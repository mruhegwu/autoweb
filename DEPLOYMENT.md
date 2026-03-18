# Deployment Guide

## Overview

This guide covers deploying Autoweb to various platforms.

## Prerequisites

Before deploying, ensure you have:

1. Built the Docker image or TypeScript code
2. Configured all required environment variables (see `.env.example`)
3. A running PostgreSQL database (v14+)

## Environment Variables

Copy `.env.example` to `.env` and set all required variables. **Never commit `.env` to version control.**

Required for production:

```env
NODE_ENV=production
PORT=3000
DB_HOST=<your-db-host>
DB_PORT=5432
DB_NAME=autoweb
DB_USER=<your-db-user>
DB_PASSWORD=<strong-password>
JWT_SECRET=<min-32-char-random-string>
JWT_REFRESH_SECRET=<min-32-char-random-string>
CORS_ORIGIN=https://your-frontend-domain.com
```

---

## Docker (Self-Hosted)

### Single Container

```bash
docker build -f docker/Dockerfile -t autoweb:latest .

docker run -d \
  --name autoweb \
  -p 3000:3000 \
  --env-file .env \
  autoweb:latest
```

### Docker Compose (with PostgreSQL)

```bash
# Copy and configure environment
cp .env.example .env

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f app
```

---

## Vercel

> Note: Vercel is optimized for serverless. For a persistent Express server, use a different platform or deploy with Vercel's Node.js runtime.

1. Install Vercel CLI: `npm i -g vercel`
2. Create `vercel.json`:

```json
{
  "builds": [{ "src": "dist/server.js", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "dist/server.js" }]
}
```

3. Set environment variables in Vercel Dashboard
4. Deploy: `vercel --prod`

---

## AWS

### Option 1: ECS (Fargate)

1. Push image to ECR:

```bash
aws ecr get-login-password | docker login --username AWS --password-stdin <ecr-uri>
docker tag autoweb:latest <ecr-uri>/autoweb:latest
docker push <ecr-uri>/autoweb:latest
```

2. Create ECS task definition pointing to the ECR image
3. Create ECS service with the task definition
4. Use RDS PostgreSQL for the database
5. Store secrets in AWS Secrets Manager

### Option 2: EC2

```bash
# SSH into EC2
ssh ubuntu@<ec2-ip>

# Install Docker
curl -fsSL https://get.docker.com | sh

# Pull and run
docker pull ghcr.io/mruhegwu/autoweb:latest
docker run -d -p 3000:3000 --env-file .env ghcr.io/mruhegwu/autoweb:latest
```

### Option 3: AWS App Runner

1. Connect your GitHub repository in the AWS console
2. Select `docker/Dockerfile` as the build configuration
3. Set environment variables in App Runner
4. Deploy

---

## GCP (Google Cloud Platform)

### Cloud Run

```bash
# Build and push to GCR
gcloud builds submit --tag gcr.io/<project-id>/autoweb

# Deploy to Cloud Run
gcloud run deploy autoweb \
  --image gcr.io/<project-id>/autoweb \
  --platform managed \
  --region us-central1 \
  --port 3000 \
  --set-env-vars NODE_ENV=production \
  --allow-unauthenticated
```

Use **Cloud SQL** for PostgreSQL and **Secret Manager** for secrets.

---

## Kubernetes

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: autoweb
spec:
  replicas: 3
  selector:
    matchLabels:
      app: autoweb
  template:
    metadata:
      labels:
        app: autoweb
    spec:
      containers:
        - name: autoweb
          image: ghcr.io/mruhegwu/autoweb:latest
          ports:
            - containerPort: 3000
          env:
            - name: NODE_ENV
              value: production
          envFrom:
            - secretRef:
                name: autoweb-secrets
          livenessProbe:
            httpGet:
              path: /api/v1/health
              port: 3000
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /api/v1/health
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 5
```

```bash
kubectl apply -f k8s/
```

---

## CI/CD (GitHub Actions)

The `.github/workflows/deploy.yml` workflow:

1. Triggers on push to `main`
2. Builds and pushes Docker image to GHCR
3. Deploys to your configured platform

Required GitHub Secrets:

| Secret | Description |
|--------|-------------|
| `GITHUB_TOKEN` | Auto-provided by GitHub |
| `VERCEL_TOKEN` | Vercel API token (if using Vercel) |
| `AWS_ACCESS_KEY_ID` | AWS credentials (if using AWS) |
| `AWS_SECRET_ACCESS_KEY` | AWS credentials (if using AWS) |

---

## Health Checks

The API exposes a health endpoint:

```
GET /api/v1/health
```

Response:

```json
{
  "success": true,
  "message": "API is running",
  "environment": "production",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 12345.67
}
```

Use this endpoint for load balancer health checks and monitoring.

---

## Database Migrations

```bash
# Run pending migrations
npm run db:migrate

# Revert last migration
npm run db:migrate:revert
```

In production, run migrations before deploying the new application version.
