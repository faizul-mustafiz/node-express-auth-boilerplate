module.exports = {
  post: {
    tags: ['Auth'],
    description: 'sign-in',
    operationId: 'signIn',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/signInInput',
          },
        },
      },
    },
    responses: {
      200: {
        $ref: '#/components/responses/SuccessSignUp',
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
