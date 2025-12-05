const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FixandoPC API',
      version: '1.0.0',
      description: 'API do fórum FixandoPC — compartilhamento e interação entre usuários',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
   apis: ['./src/routes/*.js', './src/controllers/*.js'],
};


const swaggerDocs = swaggerJsDoc(swaggerOptions );



function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  console.log('Swagger rodando em http://localhost:3000/api-docs' );
}

module.exports = { setupSwagger };
