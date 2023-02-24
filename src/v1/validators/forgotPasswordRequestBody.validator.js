const Joi = require('joi');
const forgotPasswordRequestBody = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .lowercase()
    .required(),
});
module.exports = forgotPasswordRequestBody;
