# Next.js Prisma PostgreSQL Application

This is a **Next.js** project using **Prisma** as the ORM and **PostgreSQL** as the database. The project is containerized with **Docker** for both development and production environments.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Docker Setup](#docker-setup)
- [Database Migrations](#database-migrations)
- [Running the Application](#running-the-application)
- [Prisma](#prisma)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Scripts](#scripts)
- [License](#license)

---

## Features

- **Next.js** for server-side rendering (SSR) and static site generation (SSG).
- **Prisma** ORM for type-safe database interactions.
- **PostgreSQL** as the relational database.
- Docker for containerization and easy setup.
- Prisma for database schema migrations and client generation.
- Environment-based logging for better debugging and monitoring.
- Secure and scalable architecture.

---

## Prerequisites

Ensure the following are installed on your system:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js (LTS version)](https://nodejs.org/en/download/) (for local development)

---

## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/xincere-inc/nextjs-fullstack-base
   cd nextjs-fullstack-base
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Set Up Environment Variables:**

   Create a `.env.local` file in the root directory with the following content:

   ```env
   DATABASE_URL=postgresql://postgres:password@db:5432/mydatabase
   NODE_ENV=development
   NEXT_PUBLIC_API_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key
   ```

   - `DATABASE_URL`: PostgreSQL connection string.
   - `NODE_ENV`: `development` or `production`.
   - `NEXT_PUBLIC_API_URL`: Frontend URL.
   - `NEXTAUTH_SECRET`: Secret key for `next-auth`.

---

## Docker Setup

Docker manages the application and PostgreSQL database containers.

### Development Environment

Start the containers for development:

```bash
docker-compose up --build
```

- Builds Docker images for the Next.js app and PostgreSQL.
- Applies database migrations automatically.
- Launches Next.js on [http://localhost:3000](http://localhost:3000).

### Stop Containers

```bash
docker-compose down
```

### Production Environment

1. **Build the Docker Image:**

   ```bash
   docker build -t nextjs-app .
   ```

2. **Run the Production Container:**

   ```bash
   docker run -p 3000:3000 --env NODE_ENV=production nextjs-app
   ```

---

## Database Migrations

Manage Prisma migrations with the following commands:

### Apply Migrations

```bash
npm run db:migrate
```

Or with Docker:

```bash
docker-compose run web npm run db:migrate
```

### Generate Prisma Client

After updating the Prisma schema:

```bash
npx prisma generate
```

### Prisma Studio

Open Prisma Studio for database management:

```bash
npx prisma studio
```

---

## Project Structure

```plaintext
.
├── prisma/                  # Prisma schema and migrations
│   ├── migrations/          # Migration files
│   └── schema.prisma        # Prisma schema definition
├── public/                  # Public assets
├── src/                     # Source code
│   ├── app/                 # Next.js app pages
│   ├── components/          # UI components
│   └── lib/                 # Libraries and setup files
│       └── prisma.ts        # Prisma client setup
├── .env.local               # Environment variables
├── Dockerfile               # Dockerfile for Next.js app
├── docker-compose.yml       # Docker configuration
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
└── README.md                # Project documentation
```

---

## Scripts

### Development

```bash
npm run dev
```

Starts Next.js with hot-reloading.

### Production Build

```bash
npm run build
npm start
```

Builds and starts the production server.

### Prisma Commands

- **Generate Prisma Client:**

  ```bash
  npx prisma generate
  ```

- **Create New Migration:**

  ```bash
  npx prisma migrate dev --name init
  ```

- **Apply Migrations:**

  ```bash
  npm run db:migrate
  ```

- **Open Prisma Studio:**

  ```bash
  npx prisma studio
  ```

### Generate TypeScript Types from Swagger

```bash
npm run generate:types
```

# Generates TypeScript types from the Swagger/OpenAPI documentation (`swagger.yaml`) and saves them to `src/types/api.ts`.

## Docker Compose Overview

### Services

- **web**: Next.js application

  - Applies database migrations on startup.
  - Exposed on port `3000`.

- **db**: PostgreSQL
  - Username: `postgres`
  - Password: `password`
  - Exposed on port `5432`.

### Volumes

- `pg_data`: Persists PostgreSQL data.
- `/app/node_modules`: Caches dependencies to speed up builds.

---

## License

This project is licensed under the **MIT License**.
