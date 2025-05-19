import * as Joi from 'joi';

export const validationSchema = Joi.object({
  PORT: Joi.number().required(),
  AUTH_HTTP_PORT: Joi.number().required(),
});
