import chokidar from 'chokidar';
import fs from "fs";
import { NextResponse } from "next/server";
import path from "path";
import swaggerJSDoc from "swagger-jsdoc";

// Swagger options for generating API documentation
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Next.js API",
      description: "API documentation for Next.js 15 application",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local server",
      },
    ],
  },
  apis: ["src/app/api/**/*.js", "src/app/api/**/*.ts"], // Watch all your API files
};

// Function to regenerate and write Swagger spec to file
const writeSwaggerSpecToFile = (): void => {
  const swaggerSpec = swaggerJSDoc(swaggerOptions);
  const swaggerFilePath = path.join(process.cwd(), "src/api/specs/swagger.json");
  fs.writeFileSync(swaggerFilePath, JSON.stringify(swaggerSpec, null, 2));
};

// Initialize Swagger spec file on startup (only run this in non-Next.js environments like build or background task)
if (process.env.NODE_ENV !== "production") {
  writeSwaggerSpecToFile();  // Only run this logic in non-production environments
  // Watch for changes in the API routes and regenerate Swagger spec
  chokidar.watch(path.resolve("src/app/api")).on("change", () => {
    console.log("API route changed, regenerating swagger.json");
    writeSwaggerSpecToFile();
  });
}

// API route handler to serve Swagger spec
const serveSwaggerDoc = () => {
  const swaggerSpec = swaggerJSDoc(swaggerOptions); // Regenerate spec on each request
  return NextResponse.json(swaggerSpec);
};

export default serveSwaggerDoc;
