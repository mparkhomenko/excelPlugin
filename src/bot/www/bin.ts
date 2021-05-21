// config should be imported before importing any other file
import "module-alias/register";
import { config } from "@core/config";
import { app } from "../app";
import { logger as loggerInstance } from "../utils/logger";
import { onSignal, onError } from "../utils/signalHandler";
import http from "http";

const port = 8888


app.set("port", port);

const server = http.createServer(app);

function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? `Pipe ${port}` : `Port ${port}`;
  loggerInstance.logger.debug(`🚀 Listening on ${bind}`);
}

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

process.on("SIGINT", onSignal);
process.on("SIGTERM", onSignal);
process.on("SIGQUIT", onSignal);
