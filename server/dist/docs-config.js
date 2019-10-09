"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const swaggerJsdoc = require("swagger-jsdoc");
const packageJson = require('../package.json');
const options = {
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
    apis: ['**/models/*.js', '**/routes/*.js'],
};
exports.specs = swaggerJsdoc(options);
//# sourceMappingURL=docs-config.js.map