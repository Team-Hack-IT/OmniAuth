import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "Omni Auth User API",
        version: "1.0.0",
        description: "Documentation for the endpoint of the omni auth user API",
        contact: {
            name: "The Omni Auth Team",
        },
        servers: [
            "http://localhost:3000/",
            "https://www.omni-auth.onrender.com",
        ],
    },
};

const options: swaggerJSDoc.Options = {
    swaggerDefinition,
    apis: ["./api/routes/*.ts"],
};

export default swaggerJSDoc(options);
