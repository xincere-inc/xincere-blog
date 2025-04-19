import { NextResponse } from 'next/server';
import swaggerJSDoc from 'swagger-jsdoc';

// Swagger options for generating API documentation
export const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Next.js API',
      description: 'API documentation for Next.js 15 application',
      version: '1.0.0',
    },
    servers: [
      {
        url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
        description: 'Local server',
      },
    ],
    components: {
      securitySchemes: {
        jwt: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        UnAuthorizedError: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'Unauthorized',
            },
            message: {
              type: 'string',
              example: 'Please log in.',
            },
          },
        },
        ForbiddenError: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'Forbidden',
            },
            message: {
              type: 'string',
              example: 'You do not have permission.',
            },
          },
        },
        NotFoundError: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'NotFound',
            },
            message: {
              type: 'string',
              example: 'The target data does not exist.',
            },
          },
        },
        UnprocessableEntity: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'UnprocessableEntity',
            },
            message: {
              type: 'string',
              example: 'The submission content is not appropriate.',
            },
          },
        },
        ValidationError: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'ValidationError',
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  path: {
                    type: 'string',
                    example: 'email',
                  },
                  message: {
                    type: 'string',
                    example: 'Invalid email address', // Example error message
                  },
                },
              },
            },
          },
        },
        InternalServerError: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'InternalServerError',
            },
            message: {
              type: 'string',
              example: 'Server error.',
            },
          },
        },
        Success: {
          type: 'object',
          required: ['message'],
          properties: {
            message: {
              type: 'string',
              example: 'Success',
            },
          },
        },
        Created: {
          type: 'object',
          required: ['message'],
          properties: {
            message: {
              type: 'string',
              example: 'Created',
            },
          },
        },
        CreatedWithId: {
          type: 'object',
          required: ['message', 'id'],
          properties: {
            message: {
              type: 'string',
              example: 'Created',
            },
            id: {
              type: 'number',
              example: 1,
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Auth',
        description: 'Endpoints related to authentication',
      },
    ],
  },
  apis: ['src/app/api/**/*.js', 'src/app/api/**/*.ts'],
};

// API route handler to serve Swagger spec
const serveSwaggerDoc = () => {
  const swaggerSpec = swaggerJSDoc(swaggerOptions); // Regenerate spec on each request
  return NextResponse.json(swaggerSpec);
};

export default serveSwaggerDoc;
