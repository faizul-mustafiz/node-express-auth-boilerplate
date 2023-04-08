module.exports = {
  post: {
    tags: ['Applications'],
    description: 'This route is to create a application',
    operationId: 'createOneApplication',
    security: [],
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/applicationCreateInput',
          },
        },
      },
    },
    responses: {
      201: {
        $ref: '#/components/responses/SuccessCreateApplication',
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
