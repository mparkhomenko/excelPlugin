import { queue } from "@core/queue";
import { Job } from "bull";
import { readFile } from "./utils";
import { logger } from "../utils/logger";

const PROCESS_READ = "PROCESS_READ_STANDALONE";

type PayloadType = {
  uuid: string;
  path: string;
  serviceName: string;
};
const processRead = async (
  payload: Job<
    {
      onError?: (error: Error) => Promise<void>;
    } & PayloadType
  >,
  done: () => any
) => {
  const { path, uuid, serviceName } = payload.data;

  try {
    const result = await readFile(path);
    logger.debug("[Queue result]", serviceName, uuid, result);
  } catch (e) {
    logger.error("[Queue error]", serviceName, uuid, e);
  }

  done();
};

queue.add(PROCESS_READ, processRead);

const toQueue = (
  payload: { onError?: (error: Error) => Promise<void> } & PayloadType
) => {
  queue.toQueue(PROCESS_READ, payload);
};

const closeQueue = () => {
  queue.remove(PROCESS_READ);
};

export { toQueue, closeQueue, processRead };
