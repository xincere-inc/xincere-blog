import chokidar from 'chokidar';
import fs from 'fs';
import yaml from "js-yaml";
import path from "path";
import swaggerJSDoc from "swagger-jsdoc";
import { swaggerOptions } from './swagger';

// Function to regenerate and write Swagger spec to file
export const writeSwaggerSpecToFile = (): void => {
  const swaggerSpec = swaggerJSDoc(swaggerOptions);
  const swaggerFilePath = path.join(process.cwd(), "src/api/specs/swagger.yaml");
  fs.writeFileSync(swaggerFilePath, yaml.dump(swaggerSpec), 'utf8');
};

// Initialize Swagger spec file on startup (only run this in non-Next.js environments like build or background task)
if (process.env.NODE_ENV !== "production") {
  writeSwaggerSpecToFile();  // Only run this logic in non-production environments
  // Watch for changes in the API routes and regenerate Swagger spec
  chokidar.watch(path.resolve("src/app/api")).on("change", () => {
    console.log("API route changed, regenerating swagger.yaml");
    writeSwaggerSpecToFile();
  });
}