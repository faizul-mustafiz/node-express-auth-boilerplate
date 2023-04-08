module.exports = {
  post: {
    tags: ['Auth'],
    description:
      'This route is for refreshing access-token & refresh-token. Need to use refresh-token as authorization header',
    operationId: 'refresh',
    security: [
      {
        appId: [],
        apiKey: [],
        appVersion: [],
        refreshToken: [],
      },
    ],
    responses: {
      200: {
        $ref: '#/components/responses/SuccessRefresh',
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
