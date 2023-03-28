module.exports = {
  delete: {
    tags: ['Users'],
    description: 'This route is for deleting a user document',
    operationId: 'deleteOneUser',
    parameters: [
      {
        name: 'id',
        in: 'path',
        schema: {
          $ref: '#/components/schemas/id',
        },
        required: true,
        description: 'Delete a single user document',
      },
    ],
    security: [
      {
        accessToken: [],
      },
    ],
    responses: {
      200: {
        $ref: '#/components/responses/SuccessDeleteUser',
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
