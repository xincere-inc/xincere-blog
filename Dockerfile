# Use the LTS version of Node.js
FROM node:lts AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./ 
RUN npm ci --legacy-peer-deps

