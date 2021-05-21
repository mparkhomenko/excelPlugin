// import { db } from "@core/db";
import { logger as loggerInstance } from "./logger";


export async function onSignal(signal: string): Promise<void> {

  // await db.sequelize.connectionManager.close();
  loggerInstance.logger.debug("\nSEQUELIZE connection was closed\n");

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
  loggerInstance.logger.error({ err: error });


  // await db.sequelize.connectionManager.close();
  loggerInstance.logger.debug("\nSEQUELIZE connection was closed\n");

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
