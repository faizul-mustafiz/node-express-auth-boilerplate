module.exports = {
  post: {
    tags: ['Auth'],
    description: 'This route is for signing out',
    operationId: 'sign-out',
    security: [
      {
        refreshToken: [],
      },
    ],
    responses: {
      200: {
        $ref: '#/components/responses/SuccessSignOut',
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
