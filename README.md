```# Next.js Fullstack Base

[![Node Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)

This is a **Next.js** fullstack application using **PostgreSQL** as the database and containerized with **Docker** for both development and production environments.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Testing](#testing)
- [Deployment/CI](#deploymentci)
- [Directory Structure](#directory-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Tech Stack

- **Next.js** for server-side rendering (SSR) and static site generation (SSG).
- **PostgreSQL** as the relational database.
- **Docker** for containerization.
- **Prisma** ORM for type-safe database interactions.
- **TypeScript** for static typing.
- **Jest** for testing.

---

## Prerequisites

Ensure the following are installed on your system:

- [Docker](https://docs.docker.com/get-docker/) (≥ 20.10)
- [Docker Compose](https://docs.docker.com/compose/install/) (≥ 2.0)
- [Node.js](https://nodejs.org/) (≥ 16.0.0)

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
   DATABASE_URL=postgresql://postgres:password@localhost:5432/nextjs_app
   NODE_ENV=development
   NEXT_PUBLIC_API_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key

   SMTP_USERNAME=
   SMTP_PASSWORD=
   ```

   - `DATABASE_URL`: PostgreSQL connection string.
   - `NODE_ENV`: `development` or `production`.
   - `NEXT_PUBLIC_API_URL`: Frontend URL.
   - `NEXTAUTH_SECRET`: Secret key for `next-auth`.
   - `SMTP_USERNAME`: Secret key for `smtp`.
   - `SMTP_PASSWORD`: Secret key for `smtp`.

   ## Running Database Migrations Locally

4. **To apply database migrations locally:**

   1. Run the following command:

      ```bash
      npx prisma migrate dev

---

## Usage

### Development

Start the application in development mode:

```bash
docker-compose up --build
```

- Access the app at [http://localhost:3000](http://localhost:3000).

Stop the containers:

```bash
docker-compose down
```

### Production

1. Build the production Docker image:

   ```bash
   docker build -t nextjs-app .
   ```

2. Run the production container:

   ```bash
   docker run -p 3000:3000 --env NODE_ENV=production nextjs-app
   ```

---

## Testing

Run unit tests with:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Generate a coverage report:

```bash
npm run test:coverage
```

---

## Deployment/CI

### Deployment

1. Ensure the `.env.production` file is configured with production environment variables.
2. Build and deploy the Docker image to your preferred cloud provider.

### CI/CD

This project uses GitHub Actions for CI/CD. The workflow file is located at `.github/workflows/ci.yml`.

---

## Directory Structure

```plaintext
.
├── prisma/                  # Contains Prisma schema and migration files
│   ├── migrations/          # Auto-generated migration files by Prisma
│   └── schema.prisma        # Main Prisma schema definition
├── public/                  # Static assets served directly (e.g., images, icons)
├── src/                     # Application source code
│   ├── app/                 # Next.js App Router structure (pages, layout, etc.)
│   ├── components/          # Reusable React UI components
│   └── lib/                 # Utility libraries and configuration files
│       └── prisma.ts        # Prisma client instance setup
├── .env.local               # Local environment variable overrides (not committed)
├── .gitignore               # Specifies intentionally untracked files to ignore
├── .prettierignore          # Files to exclude from Prettier formatting
├── .prettierrc              # Prettier configuration file
├── .tool-versions           # Specifies versions for tools (used by asdf)
├── docker-compose.yml       # Docker Compose configuration for local setup
├── Dockerfile               # Dockerfile for building the Next.js app container
├── eslint.config.js         # ESLint configuration for code linting
├── next.config.js           # Next.js configuration file
├── postcss.config.js        # PostCSS configuration (used by Tailwind CSS)
├── package.json             # Project dependencies, scripts, and metadata
├── tailwind.config.js       # Tailwind CSS configuration file
├── tsconfig.json            # TypeScript compiler configuration
└── README.md                # Project overview, setup instructions, and documentation
```

---

## Admin Page Login Info

To access the admin page:

1. Navigate to [http://localhost:3000/signin](http://localhost:3000/signin) (or your deployed URL with `/signin`).
2. Use the default admin credentials (if applicable):
   - **Username**: `admin`
   - **Password**: `admin123`

> **Note:** Update the default credentials in the database or environment variables for production use.

---

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`.
3. Commit your changes: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature/your-feature-name`.
5. Open a pull request.

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for details.```
