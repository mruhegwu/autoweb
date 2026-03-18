# Development Guide

## Prerequisites

- Node.js 18 LTS (`nvm use 18`)
- PostgreSQL 14+
- Docker & Docker Compose (optional)

## Local Setup

### 1. Clone & Install

```bash
git clone https://github.com/mruhegwu/autoweb.git
cd autoweb
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your local settings:

```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=autoweb
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_32_char_minimum_secret_here
JWT_REFRESH_SECRET=your_32_char_minimum_refresh_secret
```

### 3. Set Up Database

```bash
# Create the database
createdb autoweb

# Run migrations (synchronize=true handles this in dev)
npm run db:migrate
```

### 4. Start Development Server

```bash
npm run dev
```

The server runs at `http://localhost:3000` with hot reload.

## Docker Development

```bash
docker-compose up
```

This starts the app and PostgreSQL with auto-reload.

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start with hot reload |
| `npm run build` | Compile TypeScript |
| `npm run typecheck` | Check types without building |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Auto-fix lint issues |
| `npm run format` | Format with Prettier |
| `npm test` | Run all tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage |

## Code Style

- **TypeScript**: Strict mode enabled
- **Linting**: ESLint with `@typescript-eslint/recommended`
- **Formatting**: Prettier (100 char width, single quotes)
- **Imports**: Named imports preferred

Run `npm run lint:fix && npm run format` before committing.

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# With coverage
npm run test:coverage
```

### Test Structure

```
tests/
├── unit/           # Unit tests (no DB required)
│   ├── helpers.test.ts
│   └── environment.test.ts
├── integration/    # Integration tests (needs DB)
│   └── health.test.ts
└── setup.ts        # Global test setup
```

### Writing Tests

- Unit tests go in `tests/unit/`
- Integration tests go in `tests/integration/`
- Mock the database in unit tests
- Use supertest for HTTP integration tests

## Adding a New Feature

1. Add the TypeORM entity in `src/models/`
2. Create the service in `src/services/`
3. Create the controller in `src/controllers/`
4. Add routes in `src/routes/`
5. Register the route in `src/routes/index.ts`
6. Add validation schemas in `src/utils/validators.ts`
7. Write tests in `tests/`

## Troubleshooting

### Database Connection Failed

```bash
# Check PostgreSQL is running
pg_isready

# Check credentials in .env
psql -U postgres -d autoweb
```

### TypeScript Errors

```bash
# Full type check
npm run typecheck

# Clear compiled output
rm -rf dist/
npm run build
```

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000
kill -9 <PID>
```
