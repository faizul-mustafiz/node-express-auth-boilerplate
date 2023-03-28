module.exports = {
  post: {
    tags: ['Auth'],
    description:
      'sign-up using email and password, you will get a verify token and code. Then go to /verify route to verify using token and code to complete sign-up',
    operationId: 'signUp',
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
