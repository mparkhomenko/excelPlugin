import * as Joi from "joi";

export const configSchema = Joi.object()
  .keys({
    QUEUE_REDIS_PORT: Joi.number().required(),
    QUEUE_REDIS_DOMAIN: Joi.string().required(),
    QUEUE_REDIS_PASSWORD: Joi.string().required(),
    QUEUE_REDIS_USERNAME: Joi.string().required(),
  })
  .unknown()
  .required();
