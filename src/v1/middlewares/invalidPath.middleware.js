const { BadRequest } = require('../responses/httpResponse');
const invalidPath = (req, res, next) => {
  return BadRequest(res, {
    message: 'This path is not valid.',
    result: {},
  });
};
module.exports = invalidPath;
