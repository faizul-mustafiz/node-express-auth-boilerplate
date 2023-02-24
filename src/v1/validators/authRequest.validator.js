const Joi = require('joi');
const authRequest = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .lowercase()
    .required(),
  password: Joi.string().min(6).required(),
});
module.exports = authRequest;
