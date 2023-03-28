module.exports = {
  post: {
    tags: ['Auth'],
    description:
      'This route is for revoking refresh-token. Need to use refresh-token as authorization header',
    operationId: 'revoke-rt',
    security: [
      {
        refreshToken: [],
      },
    ],
    responses: {
      200: {
        $ref: '#/components/responses/SuccessRevoke',
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
