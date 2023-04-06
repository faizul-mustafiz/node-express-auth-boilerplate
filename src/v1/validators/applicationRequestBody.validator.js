const Joi = require('joi');
const applicationCreateRequestBody = Joi.object({
  appName: Joi.string().required(),
  origin: Joi.string(),
  appUser: Joi.string(),
  status: Joi.string(),
}).required();
const applicationUpdateRequestBody = Joi.object({
  appName: Joi.string(),
  origin: Joi.string(),
  appUser: Joi.string(),
  status: Joi.string(),
})
  .required()
  .min(1);
module.exports = { applicationCreateRequestBody, applicationUpdateRequestBody };
