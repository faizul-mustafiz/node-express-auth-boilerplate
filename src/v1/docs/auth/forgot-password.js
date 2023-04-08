module.exports = {
  post: {
    tags: ['Auth'],
    description:
      'This route is for creating a forgot-password request which will give a token and code and then we need to user that token and code to change password',
    operationId: 'forgotPassword',
    security: [
      {
        appId: [],
        apiKey: [],
        appVersion: [],
        deviceInfo: [],
      },
    ],
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/forgotPassword',
          },
        },
      },
    },
    responses: {
      200: {
        $ref: '#/components/responses/SuccessForgotPassword',
      },
      400: {
        $ref: '#/components/responses/BadRequest',
      },
      500: {
        $ref: '#/components/responses/InternalServerError',
      },
    },
  },
};
