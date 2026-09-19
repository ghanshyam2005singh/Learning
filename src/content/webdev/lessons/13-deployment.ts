import type { Lesson } from '@/types';

export const deploymentLesson: Lesson = {
  id: 'deployment',
  slug: 'deployment',
  title: 'Deployment',
  description:
    'Deploy frontend and backend applications to production — Vercel, Railway, Docker, CI/CD with GitHub Actions, domains, SSL, and monitoring for a complete production setup.',
  category: 'Production',
  order: 13,
  difficulty: 'intermediate',
  estimatedTime: 30,
  content: `You have built the application. Now you make it available to the world. Deployment is not an afterthought — the decisions you make in deployment affect your architecture, your costs, and your reliability.

This module references the DevOps track. You know Docker and GitHub Actions. Here you apply those skills to deploy a real full-stack application.

---

## The Deployment Landscape

\`\`\`
WHAT YOU ARE DEPLOYING:
  Frontend:    Static files (HTML, CSS, JS bundles)
               OR Next.js server (for SSR)
  Backend:     Node.js process / container
  Database:    PostgreSQL / MongoDB instance
  Workers:     Background job processors
  Cache:       Redis instance

WHERE YOU DEPLOY:
  PaaS (simplest):   Vercel, Railway, Render, Fly.io
  IaaS (most control): AWS, GCP, DigitalOcean with Docker/Kubernetes
  Hybrid:            Vercel for frontend + Railway for backend + Neon for DB
\`\`\`

---

## Frontend Deployment

**Static React app (Vite/CRA):**
\`\`\`bash
# Build
npm run build  # outputs to dist/

# Deploy to any CDN/static host:
# Vercel: vercel --prod
# Netlify: netlify deploy --prod --dir=dist
# AWS S3 + CloudFront:
aws s3 sync dist/ s3://your-bucket --delete
aws cloudfront create-invalidation --distribution-id ABCD --paths "/*"
\`\`\`

**Next.js app:**
\`\`\`bash
# Vercel (zero config — recommended for Next.js)
npx vercel --prod

# Or self-hosted with Docker:
# Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
\`\`\`

---

## Backend Deployment

**With Railway (recommended for solo/small teams):**
\`\`\`bash
# railway.toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "node dist/server.js"
healthcheckPath = "/health"
healthcheckTimeout = 30

# railway.json or environment variables set in Railway dashboard:
DATABASE_URL = \${{ PGHOST }}:\${{ PGPORT }}/\${{ PGDATABASE }}
JWT_SECRET = <set in Railway environment variables>
\`\`\`

**With Docker on any VPS:**
\`\`\`dockerfile
# Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json .

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser  # never run as root

EXPOSE 4000
CMD ["node", "dist/server.js"]
\`\`\`

\`\`\`yaml
# docker-compose.yml (for VPS deployment)
services:
  app:
    build: .
    ports: ["4000:4000"]
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://user:pass@db:5432/mydb
    depends_on:
      db:
        condition: service_healthy
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: mydb
      POSTGRES_USER: user
      POSTGRES_PASSWORD: \${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user -d mydb"]
      interval: 10s
      retries: 5

  nginx:
    image: nginx:alpine
    ports: ["80:80", "443:443"]
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - /etc/letsencrypt:/etc/letsencrypt:ro
    depends_on: [app]

volumes:
  postgres_data:
\`\`\`

---

## Database Deployment

**Managed databases (recommended):**
- **Neon** — serverless PostgreSQL, free tier, branches for dev/prod
- **Supabase** — PostgreSQL with real-time and storage
- **Railway PostgreSQL** — simple, co-located with your app
- **AWS RDS** — production-grade, expensive, full control

**Database migrations in deployment:**
\`\`\`bash
# Never run migrations manually in production
# Run them automatically in your CI/CD pipeline

# Prisma
npx prisma migrate deploy  # applies pending migrations

# In GitHub Actions:
- name: Run migrations
  run: npx prisma migrate deploy
  env:
    DATABASE_URL: \${{ secrets.DATABASE_URL }}
\`\`\`

---

## CI/CD with GitHub Actions

\`\`\`yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_DB: testdb
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm test
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/testdb

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build Docker image
        run: docker build -t myapp:\${{ github.sha }} .
      - name: Push to Registry
        run: |
          echo \${{ secrets.DOCKER_PASSWORD }} | docker login -u \${{ secrets.DOCKER_USERNAME }} --password-stdin
          docker tag myapp:\${{ github.sha }} myusername/myapp:latest
          docker push myusername/myapp:latest
      - name: Deploy
        run: |
          # SSH to server and pull new image
          ssh -i \${{ secrets.SSH_KEY }} user@your-server.com \
            "cd /app && docker-compose pull && docker-compose up -d"

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci && npm run build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: \${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: \${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: \${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
\`\`\`

---

## Domain and SSL

**Setting up a domain:**
\`\`\`
1. Buy domain (Namecheap, Google Domains, Cloudflare Registrar)
2. Add DNS records:
   - Frontend: CNAME yourdomain.com → vercel-deployment.vercel.app
   - API:      A api.yourdomain.com → your-server-ip
              (or CNAME api.yourdomain.com → your-railway-app.railway.app)
3. SSL: Vercel and Railway handle SSL automatically
   For VPS: use certbot / Let's Encrypt:
\`\`\`

\`\`\`bash
# SSL with Let's Encrypt on VPS
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d api.yourdomain.com
# Certbot auto-renews — set up cron: 0 0 * * * certbot renew
\`\`\`

**Nginx configuration for SSL + reverse proxy:**
\`\`\`nginx
server {
  listen 80;
  server_name api.yourdomain.com;
  return 301 https://$server_name$request_uri;  # force HTTPS
}

server {
  listen 443 ssl;
  server_name api.yourdomain.com;

  ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

  location / {
    proxy_pass http://localhost:4000;  # your Node.js app
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_cache_bypass $http_upgrade;
  }
}
\`\`\`

---

## Health Checks and Monitoring

\`\`\`typescript
// Every deployed service needs a health endpoint
app.get('/health', async (req, res) => {
  try {
    // Check database connectivity
    await db.query('SELECT 1');

    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version,
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: 'Database connection failed',
    });
  }
});

// Ready endpoint (is the app ready to receive traffic?)
app.get('/ready', (req, res) => {
  // Could check: DB connected, migrations ran, cache warm
  res.json({ ready: true });
});
\`\`\`

**Monitoring tools:**
- **Uptime monitoring:** UptimeRobot (free), Better Uptime — alerts you when your app goes down
- **Error tracking:** Sentry — captures and groups exceptions with stack traces
- **Performance:** Vercel Analytics, DataDog, New Relic
- **Logs:** Railway built-in logs, AWS CloudWatch, Logtail

---

## Deployment Checklist

\`\`\`
Before deploying:
[ ] All tests passing
[ ] Environment variables set in deployment platform
[ ] Database migrations ready to run
[ ] .env files NOT in the repository

During deployment:
[ ] Migrations run before app starts
[ ] Health check passes before routing traffic
[ ] Old version still running until new version is healthy

After deploying:
[ ] Verify health endpoint responds
[ ] Check error tracking for new errors
[ ] Verify key user flows work
[ ] Monitor memory and CPU for first 30 minutes
\`\`\``,
  codeExamples: [
    {
      title: 'Zero-Downtime Deployment with Docker',
      code: `# Zero-downtime deployment script
#!/bin/bash
set -e

echo "Pulling new image..."
docker pull myusername/myapp:latest

echo "Starting new container..."
docker run -d \
  --name myapp_new \
  --env-file /app/.env \
  -p 4001:4000 \  # different port
  myusername/myapp:latest

echo "Waiting for health check..."
for i in {1..30}; do
  if curl -f http://localhost:4001/health; then
    echo "New container healthy!"
    break
  fi
  sleep 2
done

echo "Switching traffic..."
# Update nginx upstream to point to new container port
nginx -s reload

echo "Stopping old container..."
docker stop myapp_old || true
docker rm myapp_old || true

echo "Renaming new container..."
docker rename myapp_new myapp_old

echo "Deployment complete!"`,
      explanation:
        'Start the new container on a different port, wait for health check to pass, then switch nginx to the new container. The old container only stops after the new one is healthy — zero downtime.',
    },
  ],
  commonMistakes: [
    'Running database migrations after the new app is already live — new code requiring new columns breaks immediately',
    'Not having a health check endpoint — load balancers cannot route away from unhealthy instances',
    'Storing secrets in environment files on the server instead of using a secret manager',
    'Not setting up SSL — browsers warn users about insecure sites, killing trust',
    'Manual deployment without CI/CD — you will eventually deploy untested code by mistake',
    'Not monitoring after deployment — silent errors accumulate for hours before users complain',
  ],
  interviewQuestions: [
    {
      question: 'What is CI/CD and why is it important?',
      answer:
        'CI (Continuous Integration) runs automated tests on every push, catching bugs before they reach production. CD (Continuous Deployment) automatically deploys code that passes tests. Together they eliminate manual deployment steps, ensure code is always tested before deployment, and allow teams to ship multiple times per day safely. Without CI/CD, deployments are risky, infrequent, and stressful.',
      difficulty: 'beginner',
    },
    {
      question: 'How do you achieve zero-downtime deployment?',
      answer:
        'Run the new version alongside the old version before switching traffic. Using Docker: start the new container, wait for health checks to pass, update the load balancer/reverse proxy to route traffic to the new container, then stop the old container. Platforms like Kubernetes, Render, and Railway handle this automatically with rolling deployments or blue-green deployments.',
      difficulty: 'intermediate',
    },
    {
      question: 'What should be in a deployment pipeline?',
      answer:
        'Install dependencies → run linting → run tests (with test database) → build → run database migrations → deploy → run smoke tests against production → monitor for errors. Critical: migrations must run before the new code starts. Tests must pass before deployment. Health checks must pass before routing traffic.',
      difficulty: 'intermediate',
    },
  ],
  exercises: [
    {
      id: 'write-ci-pipeline',
      title: 'Write a CI/CD Pipeline',
      description:
        'Write a GitHub Actions workflow that: runs tests on every push, deploys to production only on main branch pushes, runs database migrations as part of deployment, and sends a Slack notification on successful/failed deployment.',
      starterCode: `# .github/workflows/ci-cd.yml
name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  # Job 1: Run tests
  # ...

  # Job 2: Deploy to production (only on main push)
  # ...`,
      solution: `# .github/workflows/ci-cd.yml
name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_DB: testdb
          POSTGRES_USER: testuser
          POSTGRES_PASSWORD: testpass
        options: >-
          --health-cmd pg_isready
          --health-interval 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npm run typecheck

      - name: Lint
        run: npm run lint

      - name: Run tests
        run: npm test -- --coverage
        env:
          DATABASE_URL: postgresql://testuser:testpass@localhost:5432/testdb
          JWT_SECRET: test-secret-at-least-32-characters-long
          NODE_ENV: test

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Railway
        run: npm install -g @railway/cli && railway up --service backend
        env:
          RAILWAY_TOKEN: \${{ secrets.RAILWAY_TOKEN }}

      - name: Run migrations
        run: railway run npx prisma migrate deploy
        env:
          RAILWAY_TOKEN: \${{ secrets.RAILWAY_TOKEN }}

      - name: Verify deployment
        run: |
          sleep 30  # wait for deployment
          curl -f https://api.yourapp.com/health || exit 1

      - name: Notify Slack on success
        if: success()
        uses: slackapi/slack-github-action@v1
        with:
          payload: '{"text": "✅ Deployed to production: \${{ github.event.head_commit.message }}"}'
        env:
          SLACK_WEBHOOK_URL: \${{ secrets.SLACK_WEBHOOK }}

      - name: Notify Slack on failure
        if: failure()
        uses: slackapi/slack-github-action@v1
        with:
          payload: '{"text": "❌ Deployment failed: \${{ github.event.head_commit.message }}"}'
        env:
          SLACK_WEBHOOK_URL: \${{ secrets.SLACK_WEBHOOK }}`,
      hints: [
        'Deploy only runs when test job succeeds (needs: test)',
        'if condition checks both the branch and that it is a push (not a PR)',
        'Health check after deployment confirms the app is actually working',
        'Migrations should run after the new code is deployed but before traffic switches',
      ],
    },
  ],
  keyTakeaways: [
    'Frontend deploys to CDN/static hosting (Vercel); backend runs in containers on PaaS or VPS',
    'Managed databases (Neon, Railway, Supabase) are recommended over self-managed for most teams',
    'CI/CD ensures every deployment is tested; GitHub Actions automates the pipeline',
    'Migrations must run before the new application version starts receiving traffic',
    'Health check endpoints allow load balancers and orchestrators to detect unhealthy instances',
    'SSL is mandatory in production; Let\'s Encrypt provides free certificates',
    'Monitor with Sentry (errors) and UptimeRobot (uptime) from day one',
  ],
  nextLesson: 'team-development',
  prevLesson: 'security',
};
