module.exports = {
  post: {
    tags: ['Auth'],
    description:
      'This route is for change-password. Use the forgot-password code and provide a new password to change-password. Need to use forgot-password-token as authorization header',
    operationId: 'changePassword',
    parameters: [],
    security: [
      {
        appId: [],
        apiKey: [],
        appVersion: [],
        forgotPasswordToken: [],
      },
    ],
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/verify',
          },
        },
      },
    },
    responses: {
      200: {
        $ref: '#/components/responses/SuccessChangePassword',
      },
      400: {
        $ref: '#/components/responses/BadRequest',
      },
      401: {
        $ref: '#/components/responses/Unauthorized',
      },
      403: {
        $ref: '#/components/responses/Forbidden',
      },
      500: {
        $ref: '#/components/responses/InternalServerError',
      },
    },
  },
};
