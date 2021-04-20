import * as Joi from "joi";
import path from "path";
import fs from "fs";
import { configSchema } from "./schemas/config";
import { parse } from "dotenv";

const env = parse(fs.readFileSync(path.resolve(process.cwd(), `.env`)));

const { error, value: envVars } = Joi.validate(env, configSchema);

if (error) {
  throw new Error(`Service API config validation e.message: ${error.message}`);
}

function normalizeNumber(val: string) {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return -1;
  }
  if (port >= 0) {
    return port;
  }
  return 0;
}

const config = {
  queue: {
    host: envVars.QUEUE_REDIS_DOMAIN,
    port: normalizeNumber(envVars.QUEUE_REDIS_PORT),
    username: envVars.QUEUE_REDIS_USERNAME,
    password: envVars.QUEUE_REDIS_PASSWORD,
  },
};

export { config };
