import chokidar from 'chokidar';
import fs from "fs";
import { NextResponse } from "next/server";
import path from "path";
import swaggerJSDoc from "swagger-jsdoc";

// Swagger options for generating API documentation
const swaggerOptions = {
  swaggerDefinition: {
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
    components: {
      securitySchemes: {
        jwt: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        UnAuthorizedError: {
          type: "object",
          properties: {
            error: {
              type: "string",
              example: "Unauthorized",
            },
            message: {
              type: "string",
              example: "Please log in.",
            },
          },
        },
        ForbiddenError: {
          type: "object",
          properties: {
            error: {
              type: "string",
              example: "Forbidden",
            },
            message: {
              type: "string",
              example: "You do not have permission.",
            },
          },
        },
        NotFoundError: {
          type: "object",
          properties: {
            error: {
              type: "string",
              example: "NotFound",
            },
            message: {
              type: "string",
              example: "The target data does not exist.",
            },
          },
        },
        UnprocessableEntity: {
          type: "object",
          properties: {
            error: {
              type: "string",
              example: "UnprocessableEntity",
            },
            message: {
              type: "string",
              example: "The submission content is not appropriate.",
            },
          },
        },
        InternalServerError: {
          type: "object",
          properties: {
            error: {
              type: "string",
              example: "InternalServerError",
            },
            message: {
              type: "string",
              example: "Server error.",
            },
          },
        },
        Success: {
          type: "object",
          required: ["message"],
          properties: {
            message: {
              type: "string",
              example: "Success",
            },
          },
        },
        Created: {
          type: "object",
          required: ["message"],
          properties: {
            message: {
              type: "string",
              example: "Created",
            },
          },
        },
        CreatedWithId: {
          type: "object",
          required: ["message", "id"],
          properties: {
            message: {
              type: "string",
              example: "Created",
            },
            id: {
              type: "number",
              example: 1,
            },
          },
        },
      },
    },

  },
  apis: ["src/app/api/**/*.js", "src/app/api/**/*.ts"],
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
