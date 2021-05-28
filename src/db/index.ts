import "module-alias/register";
// @ts-ignore
import { database } from "@core/modules/database";

import { Card } from "./models/Cards";

const db = {
  Card: Card(database),
};

export type DbType = typeof db & {
  sequelize: typeof database;
};

Object.keys(db).forEach((modelName) => {
  const internalDb = db as DbType & { [key: string]: any };
  if (internalDb[modelName].associate) {
    internalDb[modelName].associate(db);
  }
});

const exportDb: DbType = {
  ...db,
  sequelize: database,
};

export * from "./ModelType";
export { exportDb as db };
