module.exports = {
  components: {
    schemas: {
      id: {
        type: 'string',
        description: 'An id of a user',
        example: '63ee753cc451ec1551e64d94',
      },
      signUpInput: {
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
      signInInput: {
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
      verify: {
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
      forgotPassword: {
        type: 'object',
        require: ['email'],
        properties: {
          email: {
            type: 'string',
            description: 'User email address',
            example: 'example@email.com',
          },
        },
      },
      changePassword: {
        type: 'object',
        require: ['code', 'new_password'],
        properties: {
          code: {
            type: 'string',
            description: 'Verification code',
            example: '1M57VIRS',
          },
          new_password: {
            type: 'string',
            description: 'New password',
            minimum: 6,
            example: '<very-strong-password>',
          },
        },
      },
      userInput: {
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
      /**
       * * Response schemas
       */
      verificationTokenAndCodeResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          message: {
            type: 'string',
            example: 'Please verify using token and code',
          },
          result: {
            type: 'object',
            properties: {
              token: {
                type: 'string',
                example: '<jwt-token>',
              },
              code: {
                type: 'string',
                example: 'FUZ0V894',
              },
            },
          },
        },
      },
      accessAndRefreshAuthResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          message: {
            type: 'string',
            example: 'Sign-in/Sign-up successful',
          },
          result: {
            type: 'object',
            properties: {
              accessToken: {
                type: 'string',
                example: '<access-token>',
              },
              refreshToken: {
                type: 'string',
                example: '<refresh-token>',
              },
            },
          },
        },
      },
      basicAuthResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          message: {
            type: 'string',
            example: 'Sign-in/Sign-up successful',
          },
          result: {
            type: 'object',
          },
        },
      },
      userResponse: {
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
      userDeleteResponse: {
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
      error: {
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
      verifyToken: {
        type: 'http',
        in: 'header',
        name: 'VerifyToken',
        description:
          'Verify Bearer token to access all endpoints requiring verify_token.[/sign-in, /sign-up]',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      accessToken: {
        type: 'http',
        in: 'header',
        name: 'AccessToken',
        description:
          'Access Bearer token to access all endpoints requiring access_token. [/users*, /revoke-at]',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      refreshToken: {
        type: 'http',
        in: 'header',
        name: 'RefreshToken',
        description:
          'Refresh Bearer token to access all endpoints requiring refresh_token. [/refresh, /revoke-rt, /sign-out]',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      forgotPasswordToken: {
        type: 'http',
        in: 'header',
        name: 'RefreshToken',
        description:
          'Forgot Password Bearer token to complete /change-password',
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
                  $ref: '#/components/schemas/userResponse',
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
                    $ref: '#/components/schemas/userResponse',
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
                  $ref: '#/components/schemas/userResponse',
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
                  $ref: '#/components/schemas/userDeleteResponse',
                },
              },
            },
          },
        },
      },
      /**
       * * Auth success response template
       */
      SuccessSignUp: {
        description: 'Success sign-up',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              $ref: '#/components/schemas/verificationTokenAndCodeResponse',
            },
          },
        },
      },
      SuccessSignIn: {
        description: 'Success sign-in',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              $ref: '#/components/schemas/verificationTokenAndCodeResponse',
            },
          },
        },
      },
      SuccessVerify: {
        description: 'Success verify sign-in/sign-up',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              $ref: '#/components/schemas/accessAndRefreshAuthResponse',
            },
          },
        },
      },
      SuccessForgotPassword: {
        description: 'Success forgot-password',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              $ref: '#/components/schemas/verificationTokenAndCodeResponse',
            },
          },
        },
      },
      SuccessChangePassword: {
        description: 'Success change-password',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              $ref: '#/components/schemas/basicAuthResponse',
            },
          },
        },
      },
      SuccessRefresh: {
        description: 'Success refresh',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              $ref: '#/components/schemas/accessAndRefreshAuthResponse',
            },
          },
        },
      },
      SuccessRevoke: {
        description: 'Success revoke-token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              $ref: '#/components/schemas/basicAuthResponse',
            },
          },
        },
      },
      SuccessSignOut: {
        description: 'Success sign-out',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              $ref: '#/components/schemas/basicAuthResponse',
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
              $ref: '#/components/schemas/error',
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
              $ref: '#/components/schemas/error',
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
              $ref: '#/components/schemas/error',
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
              $ref: '#/components/schemas/error',
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
              $ref: '#/components/schemas/error',
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
              $ref: '#/components/schemas/error',
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
              $ref: '#/components/schemas/error',
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
              $ref: '#/components/schemas/error',
            },
          },
        },
      },
    },
  },
};
