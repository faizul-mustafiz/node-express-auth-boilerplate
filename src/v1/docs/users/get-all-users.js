module.exports = {
  get: {
    tags: ['Users'],
    description: 'This route is to get all user',
    operationId: 'getAllUser',
    parameters: [],
    security: [
      {
        appId: [],
        apiKey: [],
        appVersion: [],
        accessToken: [],
      },
    ],
    responses: {
      200: {
        $ref: '#/components/responses/SuccessGetAllUser',
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
