import { Sequelize } from "sequelize";
import { config } from "@core/config";
// @ts-ignore
import connectionConfigs from "@core/db-config";

export const database = new Sequelize(connectionConfigs[config.env]);
