import * as Joi from "joi";

export const configSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
    .allow(["development", "production", "test"])
    .default("development"),

    DATABASE_POSTGRES_DOMAIN: Joi.string().required(),
    DATABASE_POSTGRES_USER: Joi.string().required(),
    DATABASE_POSTGRES_DATABASE: Joi.string().required(),
    DATABASE_POSTGRES_PASSWORD: Joi.string().required(),
    DATABASE_POSTGRES_PORT: Joi.number().required(),

    DATABASE_PGADMIN_DEFAULT_EMAIL: Joi.string().required(),
    DATABASE_PGADMIN_DEFAULT_PASSWORD: Joi.string().required(),
    DATABASE_PGADMIN_PORT: Joi.number().required(),
  })
  .unknown()
  .required();
