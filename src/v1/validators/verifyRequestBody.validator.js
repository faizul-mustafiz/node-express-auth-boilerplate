const Joi = require('joi');
const verifyRequestBody = Joi.object({
  code: Joi.string().length(8).required(),
});
module.exports = verifyRequestBody;
