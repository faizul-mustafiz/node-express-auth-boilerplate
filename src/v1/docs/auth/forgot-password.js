module.exports = {
  post: {
    tags: ['Auth'],
    description: 'forgot-password',
    operationId: 'forgotPassword',
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
