import { writeSwaggerSpecToFile } from "@/lib/generateSwagger";
import type { NextConfig } from "next";

// Generate Swagger spec on Next.js startup
writeSwaggerSpecToFile();

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
};

export default nextConfig;
