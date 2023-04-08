module.exports = {
  post: {
    tags: ['Users'],
    description: 'This route is to update a user',
    operationId: 'updateOneUser',
    parameters: [
      {
        name: 'id',
        in: 'path',
        schema: {
          $ref: '#/components/schemas/id',
        },
        required: true,
        description: 'Id of user to be updated',
      },
    ],
    security: [
      {
        appId: [],
        apiKey: [],
        appVersion: [],
        accessToken: [],
      },
    ],
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/userInput',
          },
        },
      },
    },
    responses: {
      200: {
        $ref: '#/components/responses/SuccessUpdateUser',
      },
      401: {
        $ref: '#/components/responses/Unauthorized',
      },
      403: {
        $ref: '#/components/responses/Forbidden',
      },
      404: {
        $ref: '#/components/responses/NotFound',
      },
      500: {
        $ref: '#/components/responses/InternalServerError',
      },
    },
  },
};
