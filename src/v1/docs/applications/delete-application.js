module.exports = {
  delete: {
    tags: ['Applications'],
    description: 'This route is for deleting a application',
    operationId: 'deleteOneApplication',
    parameters: [
      {
        name: 'appId',
        in: 'path',
        schema: {
          $ref: '#/components/schemas/appId',
        },
        required: true,
        description: 'Delete a single Application',
      },
    ],
    security: [],
    responses: {
      200: {
        $ref: '#/components/responses/SuccessDeleteApplication',
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
