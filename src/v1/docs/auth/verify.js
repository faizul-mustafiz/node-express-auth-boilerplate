module.exports = {
  post: {
    tags: ['Auth'],
    description:
      'This route is for verifying sign-up/sign-in using the token and code provided at the sign-in/sign-up process. Need to use verify-token as authorization header',
    operationId: 'verify',
    security: [
      {
        appId: [],
        apiKey: [],
        appVersion: [],
        verifyToken: [],
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
      201: {
        $ref: '#/components/responses/SuccessVerify',
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
