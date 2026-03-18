# Autoweb API

A production-ready Node.js REST API built with Express.js and TypeScript.

## Tech Stack

- **Runtime**: Node.js 18+ LTS
- **Language**: TypeScript (strict mode)
- **Framework**: Express.js
- **Database**: PostgreSQL + TypeORM
- **Authentication**: JWT + Passport.js
- **Validation**: Zod
- **Testing**: Jest + Supertest
- **Logging**: Winston
- **Documentation**: Swagger/OpenAPI 3.0
- **Containerization**: Docker

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm 9+

### Setup

```bash
# Clone and install
git clone https://github.com/mruhegwu/autoweb.git
cd autoweb
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials and secrets

# Start development server
npm run dev
```

### Docker (recommended)

```bash
cp .env.example .env
docker-compose up
```

The API will be available at `http://localhost:3000`.

API documentation is at `http://localhost:3000/api-docs`.

## Project Structure

```
src/
├── config/          # Database, environment, logger setup
├── controllers/     # Request handlers
├── middleware/      # Auth, validation, error handling
├── models/          # TypeORM entities
├── routes/          # Express route definitions
├── services/        # Business logic
└── utils/           # Helpers and validators
tests/
├── unit/            # Unit tests
├── integration/     # API integration tests
└── setup.ts         # Test configuration
docker/
├── Dockerfile       # Production multi-stage build
└── Dockerfile.dev   # Development build
```

## API Endpoints

| Method | Endpoint                | Auth     | Description              |
|--------|-------------------------|----------|--------------------------|
| GET    | `/api/v1/health`        | None     | Health check             |
| POST   | `/api/v1/auth/register` | None     | Register new user        |
| POST   | `/api/v1/auth/login`    | None     | Login                    |
| POST   | `/api/v1/auth/refresh`  | None     | Refresh tokens           |
| POST   | `/api/v1/auth/logout`   | Bearer   | Logout                   |
| GET    | `/api/v1/auth/me`       | Bearer   | Get current user         |
| GET    | `/api/v1/users`         | Admin    | List users               |
| GET    | `/api/v1/users/profile` | Bearer   | Get my profile           |
| GET    | `/api/v1/users/:id`     | Bearer   | Get user by ID           |
| PATCH  | `/api/v1/users/:id`     | Bearer   | Update user              |
| DELETE | `/api/v1/users/:id`     | Admin    | Delete user              |

## Scripts

| Command                | Description                          |
|------------------------|--------------------------------------|
| `npm run dev`          | Start development server with reload |
| `npm run build`        | Compile TypeScript                   |
| `npm start`            | Start production server              |
| `npm test`             | Run tests                            |
| `npm run test:coverage`| Run tests with coverage report       |
| `npm run lint`         | Lint source files                    |
| `npm run lint:fix`     | Auto-fix lint issues                 |
| `npm run typecheck`    | Check TypeScript types               |
| `npm run db:migrate`   | Run database migrations              |

## Documentation

- [Development Guide](DEVELOPMENT.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Architecture Overview](ARCHITECTURE.md)
- [Security Policy](SECURITY.md)
- [API Docs](http://localhost:3000/api-docs) (local dev)

## License

MIT