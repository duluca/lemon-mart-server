import swaggerJsdoc, { Options } from 'swagger-jsdoc'
import * as packageJson from '../package.json'

const options: Options = {
  swaggerDefinition: {
    openapi: '3.1.0',
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      security: {
        bearerAuth: [],
      },
      responses: {
        UnauthorizedError: {
          description: 'Unauthorized',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ServerMessage',
              },
            },
          },
        },
      },
      schemas: {
        ServerMessage: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
            },
          },
        },
      },
    },
    info: {
      title: packageJson.name,
      version: packageJson.version,
      description: packageJson.description,
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local environment',
      },
      {
        url: 'https://mystagingserver.com',
        description: 'Staging environment',
      },
      {
        url: 'https://myprodserver.com',
        description: 'Production environment',
      },
    ],
  },
  apis: ['**/models/*.js', 'src/api.js', '**/v1/routes/*.js', '**/v2/routes/*.js'],
}

export const specs = swaggerJsdoc(options)
