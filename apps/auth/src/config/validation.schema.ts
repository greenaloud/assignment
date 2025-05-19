import * as Joi from 'joi';

export const validationSchema = Joi.object({
  HTTP_PORT: Joi.number().required(),
  MONGODB_URI: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRATION: Joi.string().required(),
});
