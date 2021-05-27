import "module-alias/register";
import { config } from "@core/config";

const database = {
  database: config.postgres.config.database,
  host: config.postgres.config.domain,
  port: config.postgres.config.port,
  password: config.postgres.config.password,
  username: config.postgres.config.user,
  dialect: "postgres",
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 60000,
    idle: 10000,
  },
};

/* Sequelize uses CommonJS modules */
module.exports = {
  test: database,
  testing: database,
  local: database,
};
