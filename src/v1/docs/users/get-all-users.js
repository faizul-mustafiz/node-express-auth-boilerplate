module.exports = {
  get: {
    tags: ['Users'],
    description: 'This route is to get all the user documents',
    operationId: 'getAllUser',
    parameters: [],
    security: [
      {
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
