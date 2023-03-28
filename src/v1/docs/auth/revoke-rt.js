module.exports = {
  post: {
    tags: ['Auth'],
    description: 'revoke-refresh-token',
    operationId: 'revoke-rt',
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
