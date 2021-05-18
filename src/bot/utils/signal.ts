import { logger } from "./logger";
import { closeQueue } from "../queue";

export async function onSignal(signal: string): Promise<void> {
  await closeQueue();
  logger.debug("QUEUE have closed");
  switch (signal) {
    case "SIGINT":
      process.exit();
      break;
    case "SIGTERM":
      process.exit();
      break;
    case "SIGQUIT":
      process.exit();
      break;
    default:
      process.exit();
      break;
  }
}

export async function onError(error: any) {
  logger.error({ err: error });

  await closeQueue();
  logger.debug("QUEUE have closed");

  if (error.syscall !== "listen") {
    throw error;
  }
  switch (error.code) {
    case "EACCES":
      process.exit(1);
      break;
    case "EADDRINUSE":
      process.exit(1);
      break;
    default:
      throw error;
  }
}
