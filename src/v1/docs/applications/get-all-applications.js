module.exports = {
  get: {
    tags: ['Applications'],
    description: 'This route is to get all application',
    operationId: 'getAllApplication',
    parameters: [],
    security: [],
    responses: {
      200: {
        $ref: '#/components/responses/SuccessGetAllApplication',
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
