import "module-alias/register";
import { v1 as uuid } from "uuid";
import bunyan from "bunyan";
import { Request, Response, NextFunction } from "express";
import { config } from "@core/config";

function getDuration(start: [number, number] | undefined) {
  const diff = process.hrtime(start);
  return diff[0] * 1e3 + diff[1] * 1e-6;
}

export const bunyanMiddleware = function (
  options: {
    headerName: string;
    propertyName: string;
    logName: string;
    logger: bunyan;
    requestStart?: boolean;
    verbose?: boolean;
    level?: string;
    additionalRequestFinishData?: (req: Request, res: Response) => any;
    filter?: (req: Request, res: Response) => boolean;
    obscureHeaders?: string[];
    excludeHeaders?: string[];
  },
  logger?: bunyan
) {
  options = options || {
    level: "info",
  };
  logger = logger || options.logger;

  if (!logger) {
    throw new Error("`logger` is required");
  }

  const headerName = options.headerName || "X-Request-Id",
    headerNameLower = headerName.toLowerCase(),
    propertyName = options.propertyName || "reqId",
    additionalRequestFinishData = options.additionalRequestFinishData,
    logName = options.logName || "req_id",
    requestStart = options.requestStart || false,
    verbose = options.verbose || false,
    filter = options.filter,
    // @ts-ignore
    parentRequestSerializer = logger.serializers && logger.serializers.req,
    level = options.level || "info";

  let obscureHeaders = options.obscureHeaders;
  let excludeHeaders = options.excludeHeaders;

  function processHeaderNames(property?: string[]) {
    if (property && property.length) {
      return property.map(function (name) {
        return name.toLowerCase();
      });
    } else {
      return undefined;
    }
  }

  obscureHeaders = processHeaderNames(obscureHeaders);
  excludeHeaders = processHeaderNames(excludeHeaders);

  function requestSerializer(req: Request) {
    let obj: any;
    if (parentRequestSerializer) {
      obj = parentRequestSerializer(req);
    } else {
      obj = {
        method: req.method,
        baseUrl: req.baseUrl + req.path,
        url: req.originalUrl || req.url,
        headers: req.headers,
        args: req.query,
        remoteAddress: req.connection.remoteAddress,
        remotePort: req.connection.remotePort,
      };
    }

    if (obj.headers && (obscureHeaders || excludeHeaders)) {
      obj.headers = Object.keys(obj.headers).reduce(function (memo, name) {
        if (excludeHeaders && excludeHeaders.includes(name)) {
          return memo;
        }

        if (obscureHeaders && obscureHeaders.includes(name)) {
          memo[name] = null;
          return memo;
        }

        memo[name] = obj.headers[name];
        return memo;
      }, {} as { [key: string]: string | null | undefined });
    }

    return obj;
  }
  // @ts-ignore
  const x = logger.serializers && logger.serializers.res;
  const y = bunyan.stdSerializers.res;
  logger = logger.child({
    serializers: {
      req: requestSerializer,
      res: x || y,
    },
  });

  return function (req: Request, res: Response, next: NextFunction) {
    if (filter && filter(req, res)) return next();
    // @ts-ignore
    const id = req[propertyName] || req.headers[headerNameLower] || uuid();

    const start = process.hrtime();

    const prefs = {} as { [key: string]: string | string[] };
    prefs[logName] = id;
    if (logger) {
      req.log = res.log = logger.child(prefs, true);
    }

    // @ts-ignore
    req[propertyName] = res[propertyName] = id;
    res.setHeader(headerName, id);

    if (requestStart || verbose) {
      const reqStartData = { req: req } as {
        req: Request;
        res?: Response;
      };

      if (verbose) reqStartData.res = res;
      // @ts-ignore
      req.log[level](reqStartData, "[REQUEST]");
    }

    res.on("finish", function () {
      const reqFinishData = { res: res, duration: getDuration(start) } as {
        req?: Request;
        res: Response;
        duration: number;
        [key: string]: any;
      };
      if (!requestStart || verbose) reqFinishData.req = req;
      if (additionalRequestFinishData) {
        const additionReqFinishData = additionalRequestFinishData(req, res);
        if (additionReqFinishData) {
          Object.keys(additionReqFinishData).forEach(function (name) {
            reqFinishData[name] = additionReqFinishData[name];
          });
        }
      }
      // @ts-ignore
      res.log[level](reqFinishData, "[RESPONSE]");
    });

    next();
  };
};
