import * as swaggerJsdoc from 'swagger-jsdoc'
import { Options } from 'swagger-jsdoc'

import * as packageJson from '../package.json'

const options: Options = {
  swaggerDefinition: {
    openapi: '3.0.1',
    components: {},
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
    ],
  },
  apis: ['**/models/*.js', '**/v1/routes/*.js'],
}

export const specs = swaggerJsdoc(options)
