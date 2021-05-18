

import { onError, onSignal } from "./utils/signal";

import { logger } from "./utils/logger";

const SERVICE_NAME = "STAND_ALONE_PUBLISHER";

logger.debug(SERVICE_NAME, "start");



process.on("SIGINT", onSignal);
process.on("SIGTERM", onSignal);
process.on("SIGQUIT", onSignal);
process.on("uncaughtException", onError);
