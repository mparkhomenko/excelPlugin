import "module-alias/register";
import { toQueue } from "./queue";
import Faker from "faker";
import { onError, onSignal } from "./utils/signal";

export const SERVICE_NAME = "STAND_ALONE_CONSUMER";

export const runQueue = (args: {
  path: string;
  serviceName: string;
  uuid: string;
}) => {
  const payload = Object.assign({}, args, { path: `${__dirname}${args.path}` });
  toQueue(payload);
};

runQueue({
  serviceName: SERVICE_NAME,
  uuid: Faker.random.uuid(),
  path: `/consumer.txt`,
});

process.on("SIGINT", onSignal);
process.on("SIGTERM", onSignal);
process.on("SIGQUIT", onSignal);
process.on("uncaughtException", onError);
