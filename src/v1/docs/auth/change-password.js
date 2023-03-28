module.exports = {
  post: {
    tags: ['Auth'],
    description: 'change-password',
    operationId: 'changePassword',
    parameters: [],
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
