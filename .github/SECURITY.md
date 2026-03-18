# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | :white_check_mark: |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability, please report it responsibly.

**Do NOT open a public GitHub issue for security vulnerabilities.**

### How to Report

1. **Email**: Send details to [security@autoweb.com](mailto:security@autoweb.com)
2. **GitHub Security Advisory**: Use the [private vulnerability reporting](../../security/advisories/new) feature

### What to Include

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### Response Timeline

- **Acknowledgment**: Within 48 hours
- **Initial assessment**: Within 5 business days
- **Resolution target**: Within 30 days for critical issues

## Security Best Practices

### Environment Variables

- Never commit `.env` files to the repository
- Use `.env.example` as a template
- Rotate secrets regularly
- Use a secrets manager in production (AWS Secrets Manager, GCP Secret Manager, HashiCorp Vault)

### Authentication

- JWT tokens expire in 15 minutes
- Refresh tokens expire in 7 days
- Passwords are hashed with bcrypt (12 rounds)
- Rate limiting is applied to auth endpoints

### Dependencies

- Dependencies are scanned weekly with `npm audit`
- Renovate bot keeps dependencies up to date
- CodeQL analysis runs on every PR

## Security Headers

The API uses Helmet.js to set the following security headers:

- `Content-Security-Policy`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection`
- `Strict-Transport-Security` (HTTPS only)
