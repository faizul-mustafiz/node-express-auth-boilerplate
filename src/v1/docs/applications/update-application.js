module.exports = {
  post: {
    tags: ['Applications'],
    description: 'This route is to update a application',
    operationId: 'updateOneApplication',
    parameters: [
      {
        name: 'appId',
        in: 'path',
        schema: {
          $ref: '#/components/schemas/appId',
        },
        required: true,
        description: 'appId of application to be updated',
      },
    ],
    security: [],
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/applicationUpdateInput',
          },
        },
      },
    },
    responses: {
      200: {
        $ref: '#/components/responses/SuccessUpdateApplication',
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
