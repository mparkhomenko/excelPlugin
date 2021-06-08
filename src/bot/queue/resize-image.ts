// import { queue } from "@core/queue";
import { Job } from "bull";
import { queue } from "../../modules/queue";
import { logger as loggerInstance} from "../utils/logger";
import { uploadReleaseBoard } from "../../bot/exel/releaseBoard/checReleaseFiles";

const PROCESS_UPLOAD = "PROCESS_UPLOAD";

type PayloadType = {
  uuid: string;
};
const processRead = async (
  payload: Job<
    {
      onError?: (error: Error) => Promise<void>;
    } & PayloadType
  >,
  done: () => any
) => {
  const { uuid } = payload.data;
  await uploadReleaseBoard();

  try {
    loggerInstance.logger.debug("[Queue result]", uuid);
  } catch (e) {
    loggerInstance.logger.error("[Queue error]", uuid, e);
  }

  done();
};

queue.add(PROCESS_UPLOAD, processRead);

const toQueue = (
  payload: { onError?: (error: Error) => Promise<void> } & PayloadType
) => {
  queue.toQueue(PROCESS_UPLOAD, payload);
};

const closeQueue = () => {
  queue.remove(PROCESS_UPLOAD);
};

export { toQueue, closeQueue, processRead };
