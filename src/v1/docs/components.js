module.exports = {
  components: {
    schemas: {
      id: {
        type: 'string',
        description: 'An id of a user',
        example: '63ee753cc451ec1551e64d94',
      },
      UserResponse: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'User identification',
            example: '63ee753cc451ec1551e64d94',
          },
          email: {
            type: 'string',
            description: 'User email address',
            example: 'example@email.com',
          },
          name: {
            type: 'string',
            description: 'User full name',
            example: 'John Doe',
          },
          avatar: {
            type: 'string',
            description: 'User avatar url',
            example: 'https://<bucket-name>/<user-id>/avatar.png',
          },
          mobile: {
            type: 'string',
            description: 'User mobile number',
            example: '+8801700000000',
          },
          dob: {
            type: 'string',
            description: 'User date of birth',
            example: '1970-02-16',
          },
          organization: {
            type: 'string',
            description: 'User organization',
            example: 'Evil Corp.',
          },
          isLoggedIn: {
            type: 'boolean',
            description: 'Is User loggedIn',
            example: true,
          },
          isVerified: {
            type: 'boolean',
            description: 'Is User verified',
            example: true,
          },
          created_at: {
            type: 'string',
            description: 'User creation time',
            example: '2023-02-16T18:26:05.254Z',
          },
          updated_at: {
            type: 'string',
            description: 'User update time',
            example: '2023-02-16T18:26:05.254Z',
          },
        },
      },
      UserUpdateInput: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            description: 'User email address',
            example: 'example@email.com',
          },
          password: {
            type: 'string',
            description: 'User password',
            minimum: 6,
            example: 'very-strong-password',
          },
          name: {
            type: 'string',
            description: 'User full name',
            example: 'John Doe',
          },
          avatar: {
            type: 'string',
            description: 'User avatar url',
            example: 'https://<bucket-name>/<user-id>/avatar.png',
          },
          mobile: {
            type: 'string',
            description: 'User mobile number',
            example: '+8801700000000',
          },
          dob: {
            type: 'string',
            description: 'User date of birth',
            example: '1970-02-16',
          },
          organization: {
            type: 'string',
            description: 'User organization',
            example: 'Evil Corp.',
          },
        },
      },
      UserDeleteResponse: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'User identification',
            example: '63ee753cc451ec1551e64d94',
          },
          email: {
            type: 'string',
            description: 'User email address',
            example: 'example@email.com',
          },
          created_at: {
            type: 'string',
            description: 'User creation time',
            example: '2023-02-16T18:26:05.254Z',
          },
          updated_at: {
            type: 'string',
            description: 'User update time',
            example: '2023-02-16T18:26:05.254Z',
          },
        },
      },
      SignUp: {
        type: 'object',
        require: ['email', 'password'],
        properties: {
          email: {
            type: 'string',
            description: 'User email address',
            example: 'example@email.com',
          },
          password: {
            type: 'string',
            description: 'User password',
            minimum: 6,
            example: 'very-strong-password',
          },
        },
      },
      SignIn: {
        type: 'object',
        require: ['email', 'password'],
        properties: {
          email: {
            type: 'string',
            description: 'User email address',
            example: 'example@email.com',
          },
          password: {
            type: 'string',
            description: 'User password',
            minimum: 6,
            example: 'very-strong-password',
          },
        },
      },
      Verify: {
        type: 'object',
        require: ['code'],
        properties: {
          code: {
            type: 'string',
            description:
              'Verification code to proceed signUp or signIn process',
            example: '1M57VIRS',
          },
        },
      },
      Error: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          message: {
            type: 'string',
            example: 'Error message for the relevant error',
          },
          result: {
            type: 'object',
          },
        },
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        in: 'header',
        name: 'Authorization',
        description: 'Bearer token to access these api endpoints',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    responses: {
      /**
       * * User CRUD success response template
       */
      SuccessGetUser: {
        description: 'Success get-one-user',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: {
                  type: 'boolean',
                  example: true,
                },
                message: {
                  type: 'string',
                  example: 'Successfully found user document',
                },
                result: {
                  type: 'object',
                  $ref: '#/components/schemas/UserResponse',
                },
              },
            },
          },
        },
      },
      SuccessGetAllUser: {
        description: 'Success get-all-users',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: {
                  type: 'boolean',
                  example: true,
                },
                message: {
                  type: 'string',
                  example: 'Successfully found all user documents',
                },
                result: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/UserResponse',
                  },
                },
              },
            },
          },
        },
      },
      SuccessUpdateUser: {
        description: 'Success update-one-user',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: {
                  type: 'boolean',
                  example: true,
                },
                message: {
                  type: 'string',
                  example: 'Successfully update user document',
                },
                result: {
                  type: 'object',
                  $ref: '#/components/schemas/UserResponse',
                },
              },
            },
          },
        },
      },
      SuccessDeleteUser: {
        description: 'Success delete-one-user',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: {
                  type: 'boolean',
                  example: true,
                },
                message: {
                  type: 'string',
                  example: 'Successfully deleted user document',
                },
                result: {
                  type: 'object',
                  $ref: '#/components/schemas/UserDeleteResponse',
                },
              },
            },
          },
        },
      },
      /**
       * * Error response templates
       */
      BadRequest: {
        description: 'Bad Request',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              $ref: '#/components/schemas/Error',
            },
          },
        },
      },
      Conflict: {
        description: 'Conflict',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              $ref: '#/components/schemas/Error',
            },
          },
        },
      },
      Forbidden: {
        description: 'Forbidden',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              $ref: '#/components/schemas/Error',
            },
          },
        },
      },
      InternalServerError: {
        description: 'Internal Server Error',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              $ref: '#/components/schemas/Error',
            },
          },
        },
      },
      MethodNotAllowed: {
        description: 'Method Not Allowed',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              $ref: '#/components/schemas/Error',
            },
          },
        },
      },
      NonAuthoritative: {
        description: 'NonAuthoritative',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              $ref: '#/components/schemas/Error',
            },
          },
        },
      },
      NotFound: {
        description: 'Not Found',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              $ref: '#/components/schemas/Error',
            },
          },
        },
      },
      Unauthorized: {
        description: 'Unauthorized',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              $ref: '#/components/schemas/Error',
            },
          },
        },
      },
    },
  },
};
