import { createSwaggerSpec } from "next-swagger-doc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Next.js API Documentation",
    version: "1.0.0",
  },
};

export const getApiDocs = () =>
  createSwaggerSpec({
    apiFolder: "src/app/api",
    definition: swaggerDefinition,
  });
