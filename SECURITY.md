# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | :white_check_mark: |

## Reporting a Vulnerability

We take security seriously. **Do NOT open a public GitHub issue for security vulnerabilities.**

### How to Report

1. **GitHub Security Advisory**: Use [private vulnerability reporting](../../security/advisories/new)
2. **Email**: security@autoweb.com

### Response Timeline

- **Acknowledgment**: Within 48 hours
- **Assessment**: Within 5 business days
- **Resolution**: Within 30 days for critical issues

## Security Measures

### API Security

| Measure | Implementation |
|---------|----------------|
| Security headers | Helmet.js |
| Rate limiting | express-rate-limit (100 req/15min) |
| Input validation | Zod schemas on all endpoints |
| CORS | Configured for specific origins only |
| Authentication | JWT (15min) + Refresh tokens (7 days) |
| Password hashing | bcrypt (12 rounds) |

### Database Security

- Parameterized queries via TypeORM (prevents SQL injection)
- Least-privilege database user
- SSL connections in production (`DB_SSL=true`)
- Password fields excluded from default queries (`select: false`)

### Dependency Security

- Weekly `npm audit` via GitHub Actions
- Renovate bot for automated dependency updates
- CodeQL analysis on every PR
- Gitleaks secret scanning

### Secrets Management

- All secrets in environment variables
- `.env` never committed to version control
- Production secrets stored in platform secret managers
- JWT secrets minimum 32 characters

## Production Checklist

- [ ] `NODE_ENV=production`
- [ ] Strong, unique `JWT_SECRET` (32+ chars)
- [ ] Strong, unique `JWT_REFRESH_SECRET` (32+ chars)
- [ ] `DB_SSL=true`
- [ ] `CORS_ORIGIN` set to your frontend domain only
- [ ] HTTPS enforced (TLS termination at load balancer)
- [ ] Secrets stored in secret manager, not in env files
- [ ] Log aggregation configured
- [ ] Monitoring/alerting configured
