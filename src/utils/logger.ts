import "module-alias/register";
import bunyan from "bunyan";
import bformat from "bunyan-format";
import path from "path";
import fs from "fs";
// import { config } from "@core/config";
import Elasticsearch from "bunyan-elasticsearch";
import { createWriteStream } from "fs";
import { Request, Response, NextFunction } from "express";

import { bunyanMiddleware } from "./bunyan-middleware";

const formatOut = bformat({
  outputMode: "short",
  color: true,
});

const createLogger = (appName: string) => {
  let esStream: any;
  const logsPath: string = path.resolve(process.cwd(), `./tmp`);
  const logsPathApp = `${logsPath}/${appName}`;
  if (!fs.existsSync(logsPathApp)) {
    fs.mkdirSync(logsPathApp, { recursive: true });
  }

  const now = Date.now();

  const logsPathInfo = `${logsPathApp}/${now}.logs.json`;
  const logsPathError = `${logsPathApp}/${now}.errors.json`;

 

  const logger = bunyan.createLogger({
    src: true,
    name: appName,
    streams: esStream
      ? [{ stream: process.stdout }, { stream: esStream }]
      : [
          {
            level: "debug",
            stream: createWriteStream(logsPathInfo),
          },
          {
            level: "error",
            stream: createWriteStream(logsPathError),
          },
          {
            stream: formatOut,
          },
        ],
    level: "debug" as bunyan.LogLevel,
  });

  return {
    logger,
    /**
     * @params
     */
    middleware: () =>
      bunyanMiddleware({
        headerName: "X-Request-Id",
        propertyName: "reqId",
        logName: "request_id",
        logger: logger,
        requestStart: true,
      }),
  };
};



export { createLogger };
