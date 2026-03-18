# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                        Client                           │
│                 (Browser / Mobile App)                  │
└────────────────────────┬────────────────────────────────┘
                         │ HTTPS
                         ▼
┌─────────────────────────────────────────────────────────┐
│                    Express.js App                        │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐  │
│  │  Helmet  │  │   CORS   │  │    Rate Limiter       │  │
│  └──────────┘  └──────────┘  └──────────────────────┘  │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │                    Router                         │  │
│  │  /api/v1/auth  /api/v1/users  /api/v1/health     │  │
│  └──────────────────────┬───────────────────────────┘  │
│                         │                               │
│  ┌──────────────────────▼───────────────────────────┐  │
│  │               Middleware Stack                    │  │
│  │  JWT Auth → Role Check → Zod Validation           │  │
│  └──────────────────────┬───────────────────────────┘  │
│                         │                               │
│  ┌──────────────────────▼───────────────────────────┐  │
│  │               Controllers                         │  │
│  │  authController    userController                 │  │
│  └──────────────────────┬───────────────────────────┘  │
│                         │                               │
│  ┌──────────────────────▼───────────────────────────┐  │
│  │               Services (Business Logic)           │  │
│  │  authService        userService                   │  │
│  └──────────────────────┬───────────────────────────┘  │
│                         │                               │
│  ┌──────────────────────▼───────────────────────────┐  │
│  │               TypeORM Repository                  │  │
│  └──────────────────────┬───────────────────────────┘  │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   PostgreSQL Database                    │
└─────────────────────────────────────────────────────────┘
```

## Layer Responsibilities

| Layer | Responsibility |
|-------|----------------|
| **Routes** | Define HTTP endpoints, apply middleware |
| **Middleware** | Cross-cutting concerns (auth, validation, logging) |
| **Controllers** | Handle HTTP request/response, delegate to services |
| **Services** | Business logic, orchestration |
| **Models** | TypeORM entities, database schema |
| **Config** | Database, environment, logging setup |
| **Utils** | Shared helpers, Zod validators |

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       VARCHAR(255) UNIQUE NOT NULL,
  first_name  VARCHAR(100) NOT NULL,
  last_name   VARCHAR(100) NOT NULL,
  password    VARCHAR(255) NOT NULL,
  role        user_role_enum DEFAULT 'user',
  is_active   BOOLEAN DEFAULT true,
  refresh_token TEXT,
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);

CREATE TYPE user_role_enum AS ENUM ('admin', 'user');
```

## Authentication Flow

```
┌──────┐         ┌─────────┐         ┌──────────┐
│Client│         │  API    │         │ Database │
└──┬───┘         └────┬────┘         └────┬─────┘
   │  POST /auth/login│                   │
   │─────────────────►│                   │
   │                  │  findUser(email)  │
   │                  │──────────────────►│
   │                  │◄──────────────────│
   │                  │                   │
   │                  │ bcrypt.compare()  │
   │                  │                   │
   │  {accessToken,   │ save refreshToken │
   │   refreshToken}  │──────────────────►│
   │◄─────────────────│                   │
   │                  │                   │
   │ GET /api/v1/users│                   │
   │ Authorization: Bearer <accessToken>  │
   │─────────────────►│                   │
   │                  │ verify JWT        │
   │                  │                   │
   │  {users: [...]}  │                   │
   │◄─────────────────│                   │
```

## Security Architecture

- **Transport**: HTTPS enforced in production
- **Authentication**: Stateless JWT (15 min expiry) + Refresh tokens (7 days)
- **Authorization**: Role-based (USER, ADMIN)
- **Password Storage**: bcrypt (12 rounds)
- **Request Security**: Helmet.js headers
- **Rate Limiting**: 100 req/15 min per IP
- **Input Validation**: Zod schemas on all endpoints
- **CORS**: Configured for specific origins

## Scaling Considerations

- **Horizontal scaling**: Stateless JWT auth means any instance can serve any request
- **Database connection pooling**: Configured via `DB_POOL_SIZE`
- **Caching**: Redis can be added for token blacklisting and response caching
- **CDN**: Static assets and API responses can be cached at the edge
