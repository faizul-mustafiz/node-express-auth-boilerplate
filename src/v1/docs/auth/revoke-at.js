module.exports = {
  post: {
    tags: ['Auth'],
    description:
      'This route is for revoking access-token. Need to use access-token as authorization header',
    operationId: 'revoke-at',
    security: [
      {
        bearerAuth: [],
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
