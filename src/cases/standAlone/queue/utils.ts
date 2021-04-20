import { createReadStream } from "fs";
export const readFile = (path: string): Promise<string | Error> => {
  return new Promise((resolve, reject) => {
    const stream = createReadStream(path);
    let data = "";
    stream.on("error", (e) => {
      reject(e);
    });
    stream.on("data", (chunk) => {
      data = data + chunk.toString();
    });
    stream.on("end", () => resolve(data));
  });
};
