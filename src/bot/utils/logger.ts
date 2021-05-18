import Logger from "bunyan";
import bformat from "bunyan-format";

const formatOut = bformat({
  outputMode: "short" as any,
  color: true,
});

export const logger = Logger.createLogger({
  src: true,
  name: "dependency",
  streams: [
    {
      stream: formatOut,
    },
  ],
  level: "debug",
});
