const authSchema = require('./schema/auth.schema');
const authValidator = async (req, res, next) => {
  /**
   * * get {email, password } form request body and validate using joi
   * * if any of these not provided send 400 bad request
   */
  try {
    const result = await authSchema.validateAsync(req.body);
    console.log('auth-schema-validation-result', result);
    next();
  } catch (error) {
    console.log('error', error);
    return res.status(400).json({
      success: false,
      message:
        'Any of these fields {email, password} not provided or incorrect',
      result: {},
    });
  }
};
module.exports = authValidator;
