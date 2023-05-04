const Success = (res, { message, result }) => {
  return res.status(200).json({
    success: true,
    message,
    result,
  });
};
const Created = (res, { message, result }) => {
  return res.status(201).json({
    success: true,
    message,
    result,
  });
};

const BadRequest = (res, { message, result }) => {
  return res.status(400).json({
    success: true,
    message,
    result,
  });
};

module.exports = {
  Success,
  Created,
  BadRequest,
};
