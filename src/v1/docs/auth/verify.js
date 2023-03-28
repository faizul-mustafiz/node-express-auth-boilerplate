module.exports = {
  post: {
    tags: ['Auth'],
    description: 'verify sign-up/sign-in process',
    operationId: 'verify',
    security: [
      {
        bearerAuth: [],
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
