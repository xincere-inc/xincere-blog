# Use the LTS version of Node.js
FROM node:lts AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./ 
RUN npm ci --legacy-peer-deps

# Copy application code
COPY . .

# Generate Prisma schema
RUN npx prisma generate

# Ensure Next.js binary is executable
RUN chmod +x node_modules/.bin/next

# ⚠️ Do NOT switch user before the build process
RUN npm run build

# Create a non-root user AFTER the build
RUN adduser --disabled-password --gecos '' nextjs
USER nextjs

# Create the final production image
FROM node:lts

WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/.next /app/.next
COPY --from=builder /app/prisma /app/prisma
COPY --from=builder /app/public /app/public

# Set environment variables
ENV NODE_ENV=production

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "run", "dev"]
