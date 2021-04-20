import { Options } from "sequelize";

declare module "@core/db-config" {
  const production: Options;
  const test: Options;
  const testing: Options;
  const local: Options;
  const development: Options;
  const stagging: Options;

  const objectOnReturn: { [key: string]: Options } = {
    test,
    testing,
    local,
    development,
    stagging,
    production,
  };

  export default objectOnReturn;
}
