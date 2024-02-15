import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  PORT: Joi.number().default(3000),
  //STAGE: Joi.string().required(),
  DB_CONNECTION: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required().default(5432),
  DB_DATABASE: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  MAIL_HOST: Joi.string().required(),
  MAIL_PORT: Joi.string().required(),
  MAIL_USERNAME: Joi.string().required(),
  MAIL_PASSWORD: Joi.string().required(),
  MAIL_FROM_ADDRESS: Joi.string().required(),
});
