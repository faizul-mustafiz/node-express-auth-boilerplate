module.exports = {
  post: {
    tags: ['Auth'],
    description:
      'sign-in using email and password, you will get a verify token and code. then use /verify route to verify using token and code to sign-in',
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
