
const swaggerJSDoc = require ("swagger-jsdoc");
const swaggerUi = require ("swagger-ui-express");

const swaggerOptions = {
    definition: {
        openapi: "3.0.0", 
        info: {
            title: "Fixando PC API",
            version: "1.0.0",
            description: "API do forum FIXANDOPC",
        },
        servers: [
            {
                url: "http://localhost:3000",
            },
        ],
    },
    apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

function swaggerDocs(app) {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log("Swagger rodando em http://localhost:3000/api-docs");
}

module.exports = {swaggerDocs};