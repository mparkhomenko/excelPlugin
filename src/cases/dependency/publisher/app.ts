import "module-alias/register";

import { onError, onSignal } from "../utils/signal";
import { toQueue } from "../queue";
import Faker from "faker";
import { SERVICE_NAME as CONSUMER_NAME } from "../consumer/app";
import { logger } from "../utils/logger";

const SERVICE_NAME = "STAND_ALONE_PUBLISHER";

logger.debug(SERVICE_NAME, "start");

console.log(CONSUMER_NAME);

setInterval(() => {
  toQueue({
    path: `${__dirname}/publisher.txt`,
    serviceName: SERVICE_NAME,
    uuid: Faker.random.uuid(),
  });
}, 3000);

process.on("SIGINT", onSignal);
process.on("SIGTERM", onSignal);
process.on("SIGQUIT", onSignal);
process.on("uncaughtException", onError);
