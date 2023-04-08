module.exports = {
  get: {
    tags: ['Applications'],
    description: 'This route is for getting a application',
    operationId: 'getOneApplication',
    parameters: [
      {
        name: 'appId',
        in: 'path',
        schema: {
          $ref: '#/components/schemas/appId',
        },
        required: true,
        description: 'Generated application appId',
      },
    ],
    security: [],
    responses: {
      200: {
        $ref: '#/components/responses/SuccessGetApplication',
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
