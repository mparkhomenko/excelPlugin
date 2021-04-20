import "module-alias/register";
import { toQueue } from "../queue";
import Faker from "faker";
import { logger } from "../utils/logger";

export const SERVICE_NAME = "STAND_ALONE_CONSUMER";

logger.debug(SERVICE_NAME, "start");

export const runQueue = (args: {
  path: string;
  serviceName: string;
  uuid: string;
}) => {
  toQueue(args);
  return;
};

setInterval(
  () =>
    runQueue({
      serviceName: SERVICE_NAME,
      uuid: Faker.random.uuid(),
      path: `${__dirname}/consumer.txt`,
    }),
  1000
);
