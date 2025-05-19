import * as Joi from 'joi';

export const validationSchema = Joi.object({
  PORT: Joi.number().required(),
  AUTH_SERVICE_HTTP_PORT: Joi.number().required(),
  EVENT_SERVICE_HTTP_PORT: Joi.number().required(),
});
