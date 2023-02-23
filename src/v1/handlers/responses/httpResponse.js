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
const NonAuthoritative = (res, { message, result }) => {
  return res.status(203).json({
    success: true,
    message,
    result,
  });
};

const BadRequest = (res, { message, result }) => {
  return res.status(400).json({
    success: false,
    message,
    result,
  });
};
const Unauthorized = (res, { message, result }) => {
  return res.status(401).json({
    success: false,
    message,
    result,
  });
};
const Forbidden = (res, { message, result }) => {
  return res.status(403).json({
    success: false,
    message,
    result,
  });
};
const NotFound = (res, { message, result }) => {
  return res.status(404).json({
    success: false,
    message,
    result,
  });
};
const MethodNotAllowed = (res, { message, result }) => {
  return res.status(405).json({
    success: false,
    message,
    result,
  });
};
const RequestTimeout = (res, { message, result }) => {
  return res.status(408).json({
    success: false,
    message,
    result,
  });
};
const Conflict = (res, { message, result }) => {
  return res.status(409).json({
    success: false,
    message,
    result,
  });
};
const UnprocessableEntity = (res, { message, result }) => {
  return res.status(422).json({
    success: false,
    message,
    result,
  });
};
const TooManyRequests = (res, { message, result }) => {
  return res.status(429).json({
    success: false,
    message,
    result,
  });
};
const InternalServerError = (res, { message, result }) => {
  return res.status(500).json({
    success: false,
    message,
    result,
  });
};
const NotImplemented = (res, { message, result }) => {
  return res.status(501).json({
    success: false,
    message,
    result,
  });
};
const BadGateway = (res, { message, result }) => {
  return res.status(502).json({
    success: false,
    message,
    result,
  });
};
const ServiceUnavailable = (res, { message, result }) => {
  return res.status(503).json({
    success: false,
    message,
    result,
  });
};

module.exports = {
  Success,
  Created,
  NonAuthoritative,
  BadRequest,
  Unauthorized,
  Forbidden,
  NotFound,
  MethodNotAllowed,
  RequestTimeout,
  Conflict,
  UnprocessableEntity,
  TooManyRequests,
  InternalServerError,
  NotImplemented,
  BadGateway,
  ServiceUnavailable,
};
