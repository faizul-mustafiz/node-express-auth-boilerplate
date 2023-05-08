const Success = (res, payload) => {
  return res.status(200).json({
    success: true,
    message: payload.message,
    result: payload.result,
  });
};
const Created = (res, payload) => {
  return res.status(201).json({
    success: true,
    message: payload.message,
    result: payload.result,
  });
};

const BadRequest = (res, payload) => {
  return res.status(400).json({
    success: false,
    message: payload.message,
    result: payload.result,
  });
};

module.exports = {
  Success,
  Created,
  BadRequest,
};
