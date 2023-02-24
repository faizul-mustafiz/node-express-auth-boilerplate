const Joi = require('joi');
const changePasswordRequestBody = Joi.object({
  code: Joi.string().length(8).required(),
  new_password: Joi.string().min(6).required(),
});
module.exports = changePasswordRequestBody;
