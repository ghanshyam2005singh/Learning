import type { Challenge } from '@/types';

export const challenges: Challenge[] = [
  // ─── LINUX ──────────────────────────────────────────────────────────────────
  {
    id: 'devops-linux-find-logs',
    slug: 'find-error-logs',
    title: 'Find Error Logs',
    description: 'Write a Linux command to search for all lines containing "ERROR" inside /var/log/app.log and display only the last 20 matching lines.',
    difficulty: 'beginner',
    topic: 'Linux',
    starterCode: `# Task: Search for ERROR lines in /var/log/app.log
# and show only the last 20 matches.

# Hint: You'll need to combine two commands with a pipe (|)

# Your command:`,
    solution: `grep "ERROR" /var/log/app.log | tail -20

# Alternative using grep with line numbers:
grep -n "ERROR" /var/log/app.log | tail -20`,
    hints: [
      'grep searches for a pattern inside a file',
      'tail -N shows the last N lines',
      'Use | to pipe the output of grep into tail',
    ],
    explanation: 'grep "ERROR" /var/log/app.log filters the file to lines containing "ERROR". The pipe | passes those lines to tail -20 which keeps only the last 20. This is the most common log-debugging pattern on a Linux server. grep -n also shows line numbers, helpful when you need to cross-reference with the full file.',
    tags: ['linux', 'grep', 'tail', 'logs', 'beginner'],
  },
  {
    id: 'devops-linux-permissions',
    slug: 'fix-file-permissions',
    title: 'Fix File Permissions',
    description: 'You have a deploy.sh script that needs to be executable by the owner, readable and executable by the group, and not accessible by others. Write the chmod command.',
    difficulty: 'beginner',
    topic: 'Linux',
    starterCode: `# File: deploy.sh
# Current permissions: -rw-r--r-- (644)
# Required:
#   Owner: read + write + execute (rwx)
#   Group: read + execute (r-x)
#   Others: no permissions (---)

# Write the chmod command:`,
    solution: `chmod 750 deploy.sh

# Breaking down 750:
# 7 = owner:  4(r) + 2(w) + 1(x) = rwx
# 5 = group:  4(r) + 0   + 1(x) = r-x
# 0 = others: 0   + 0   + 0   = ---`,
    hints: [
      'chmod takes an octal number: owner / group / others',
      'r=4, w=2, x=1 — add them for each group',
      'rwx = 4+2+1 = 7, r-x = 4+1 = 5, --- = 0',
    ],
    explanation: 'chmod uses octal numbers where each digit represents permissions for owner, group, and others. r=4, w=2, x=1. Add the values: rwx=7, r-x=5, ---=0. So chmod 750 means owner can read/write/execute, group can read/execute, others have no access. This is the standard for deployment scripts — group can run it, outsiders cannot.',
    tags: ['linux', 'chmod', 'permissions', 'beginner'],
  },
  {
    id: 'devops-linux-kill-port',
    slug: 'find-and-kill-process-on-port',
    title: 'Kill Process on Port 3000',
    description: 'Your Node.js app crashed but the port 3000 is still occupied. Write the commands to find what is using port 3000 and kill it.',
    difficulty: 'beginner',
    topic: 'Linux',
    starterCode: `# Problem: Starting the app gives "EADDRINUSE: address already in use :::3000"
# The previous process is still holding port 3000.

# Step 1: Find which process is using port 3000:

# Step 2: Kill that process (replace PID with the actual number):`,
    solution: `# Step 1: Find the process
sudo lsof -i :3000
# Output:
# COMMAND  PID   USER   FD   TYPE  DEVICE SIZE/OFF NODE NAME
# node    5432  alice   23u  IPv4  socket  TCP *:3000 (LISTEN)

# The PID is 5432

# Step 2: Kill gracefully first
kill 5432

# If it doesn't stop (try force kill):
kill -9 5432

# Alternative one-liner (find and kill in one step):
fuser -k 3000/tcp`,
    hints: [
      'lsof -i :PORT lists processes using that port',
      'The PID column shows the process ID to kill',
      'kill PID sends SIGTERM (graceful), kill -9 PID force kills',
      'fuser -k PORT/tcp is a one-liner alternative',
    ],
    explanation: 'lsof (list open files) with -i :3000 shows which process is listening on port 3000. The PID column gives you the process ID. kill PID sends SIGTERM giving the process a chance to clean up. kill -9 sends SIGKILL which cannot be ignored — use it only if the process doesn\'t respond to normal kill. fuser -k 3000/tcp is a convenient shortcut.',
    tags: ['linux', 'lsof', 'kill', 'process', 'beginner'],
  },
  {
    id: 'devops-linux-monitor-disk',
    slug: 'monitor-disk-and-memory',
    title: 'Monitor Disk and Memory',
    description: 'Write the commands to check: (1) available disk space on all mounted drives, (2) current memory usage, (3) which directory is using the most disk space under /var.',
    difficulty: 'beginner',
    topic: 'Linux',
    starterCode: `# Write the commands for each task:

# Task 1: Show disk usage for all mounted filesystems (human-readable):

# Task 2: Show current memory usage (human-readable):

# Task 3: Show disk usage of directories under /var, sorted by size:`,
    solution: `# Task 1: Disk space
df -h

# Task 2: Memory usage
free -h
# or for a detailed view:
cat /proc/meminfo

# Task 3: Directory sizes under /var, sorted
du -sh /var/* | sort -rh | head -10

# du -s  = summarize (one line per directory)
# du -h  = human-readable sizes
# sort -r = reverse (largest first)
# sort -h = human-readable sort (10G > 100M)
# head -10 = show top 10`,
    hints: [
      'df = disk free (shows filesystem usage)',
      'free = shows RAM usage',
      'du = disk usage (shows directory sizes)',
      '-h flag makes output human-readable (GB, MB)',
    ],
    explanation: 'df -h shows filesystem-level disk usage — how full each partition is. free -h shows RAM. du -sh /var/* sizes each directory under /var. sort -rh sorts by size, largest first (the -h flag handles human-readable sizes like 10G, 500M). head -10 shows the top disk consumers. These three commands diagnose the most common "disk full" and "out of memory" production alerts.',
    tags: ['linux', 'df', 'du', 'free', 'monitoring', 'beginner'],
  },

  // ─── DOCKER ─────────────────────────────────────────────────────────────────
  {
    id: 'devops-dockerfile-nodejs',
    slug: 'write-nodejs-dockerfile',
    title: 'Write a Node.js Dockerfile',
    description: 'Write a production-ready Dockerfile for a Node.js Express app. It should use layer caching correctly, run as a non-root user, and expose port 3000.',
    difficulty: 'intermediate',
    topic: 'Docker',
    starterCode: `# App structure:
# package.json
# package-lock.json
# src/
#   index.js   (entry point: node src/index.js)

# Write a Dockerfile that:
# 1. Uses Node.js 20 Alpine as base image
# 2. Copies package files first (for layer caching)
# 3. Runs npm ci (clean install)
# 4. Copies the rest of the source code
# 5. Creates and switches to a non-root user
# 6. Exposes port 3000
# 7. Starts the app with: node src/index.js`,
    solution: `FROM node:20-alpine

WORKDIR /app

# Copy package files first — Docker caches this layer
# npm ci only re-runs if package.json or package-lock.json changes
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Copy source code (changes more often — separate layer)
COPY src/ ./src/

# Create non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 3000

CMD ["node", "src/index.js"]`,
    hints: [
      'Copy package.json BEFORE the source code for layer caching',
      'npm ci is faster and more reliable than npm install in CI/Docker',
      '--only=production skips devDependencies to keep the image small',
      'adduser creates a non-root user; USER switches to it',
    ],
    explanation: 'The key insight is layer ordering: package.json rarely changes, so copying it first and running npm ci second caches that layer. Changing one line of source code only rebuilds the COPY src layer. --only=production keeps the image small by omitting dev tools. Running as a non-root user (appuser) is a security best practice — if the container is compromised, the attacker has limited privileges.',
    tags: ['docker', 'dockerfile', 'nodejs', 'security', 'intermediate'],
  },
  {
    id: 'devops-docker-debug',
    slug: 'debug-crashed-container',
    title: 'Debug a Crashed Container',
    description: 'Your app container named "api" keeps restarting. Write the Docker commands to investigate why it crashed and check its resource usage.',
    difficulty: 'intermediate',
    topic: 'Docker',
    starterCode: `# Container name: api
# Symptom: container keeps restarting

# Step 1: Check container status:

# Step 2: Read the crash logs:

# Step 3: If it's currently running, exec into it to investigate:

# Step 4: Check live resource usage (CPU/memory):`,
    solution: `# Step 1: Check container status (including stopped ones)
docker ps -a
# Look for: "Exited (1)" or "Restarting (1)" — exit code 1 = error

# Step 2: Read crash logs (last 100 lines)
docker logs api --tail 100
# Or follow live:
docker logs api -f

# Step 3: Exec into a running container to investigate
docker exec -it api sh
# Inside: check env, check files, try running the app manually
env                    # verify environment variables
ls /app                # verify files are present
node src/index.js      # run manually to see the full error

# Step 4: Check resource usage
docker stats api
# Columns: CPU%, MEM USAGE/LIMIT, NET I/O, BLOCK I/O
# If MEM USAGE hits the LIMIT: OOM (Out Of Memory) crash`,
    hints: [
      'docker ps -a shows ALL containers including stopped ones',
      'Exit code in "Exited (X)" tells you why it stopped: 1 = error, 137 = OOM kill',
      'docker logs is the first place to look for crash reasons',
      'docker stats shows live resource usage — check for memory limit hits',
    ],
    explanation: 'The debugging sequence: docker ps -a reveals the exit code (1=app error, 137=killed by OOM, 0=clean exit). docker logs shows what the app printed before dying. docker exec -it api sh opens a shell inside the running container to investigate interactively. docker stats reveals if resource limits (memory) are causing the crash. This sequence resolves 90% of container issues.',
    tags: ['docker', 'debugging', 'logs', 'intermediate'],
  },
  {
    id: 'devops-docker-multi-stage',
    slug: 'multi-stage-dockerfile',
    title: 'Multi-Stage Dockerfile',
    description: 'Write a multi-stage Dockerfile for a Node.js app that: (1) builds TypeScript in a "build" stage, (2) copies only the compiled output to a lean production image.',
    difficulty: 'advanced',
    topic: 'Docker',
    starterCode: `# App structure:
# src/index.ts          (TypeScript source)
# package.json          (includes typescript, ts-node as devDependencies)
# tsconfig.json
# dist/                 (TypeScript compiles to here)

# Goal: Final image should have NO TypeScript, NO devDependencies
# Final image size should be much smaller than including all build tools

# Write a multi-stage Dockerfile:`,
    solution: `# ── Stage 1: Build ──────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json tsconfig.json ./
RUN npm ci                        # install ALL dependencies (including typescript)

COPY src/ ./src/
RUN npm run build                 # compiles src/*.ts → dist/*.js

# ── Stage 2: Production ──────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --only=production      # production deps ONLY (no typescript)

# Copy ONLY the compiled output from the builder stage
COPY --from=builder /app/dist ./dist

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 3000
CMD ["node", "dist/index.js"]`,
    hints: [
      'FROM ... AS name names each stage',
      'COPY --from=builder copies files from a previous stage',
      'The final image only contains what you explicitly COPY into it',
      'TypeScript and all devDependencies are left in the builder stage',
    ],
    explanation: 'Multi-stage builds solve the problem of build tools bloating production images. The builder stage installs TypeScript and compiles. The production stage starts fresh from a clean node:20-alpine and only copies the dist/ output. TypeScript, ts-node, and all devDependencies are left behind in the builder layer — they never reach the final image. Result: a production image 5-10x smaller than if everything was included.',
    tags: ['docker', 'multi-stage', 'typescript', 'optimization', 'advanced'],
  },

  // ─── DOCKER COMPOSE ─────────────────────────────────────────────────────────
  {
    id: 'devops-compose-app-db',
    slug: 'docker-compose-app-and-database',
    title: 'Docker Compose: App + Database',
    description: 'Write a docker-compose.yml that runs a Node.js app and a PostgreSQL database together. The app should connect to the database using the service name as hostname.',
    difficulty: 'intermediate',
    topic: 'Docker Compose',
    starterCode: `# Write a docker-compose.yml for:
# - Service "api": built from local Dockerfile, port 3000 exposed
#   Environment: DATABASE_URL=postgresql://postgres:secret@postgres:5432/myapp
# - Service "postgres": uses postgres:16 image
#   Environment: POSTGRES_PASSWORD=secret, POSTGRES_DB=myapp
#   Data should persist in a named volume: postgres_data

# docker-compose.yml:`,
    solution: `version: '3.9'

services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:secret@postgres:5432/myapp
    depends_on:
      - postgres
    restart: unless-stopped

  postgres:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: myapp
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:`,
    hints: [
      'Services on the same Compose network can reach each other by service name',
      'DATABASE_URL uses "postgres" as the hostname — matching the service name',
      'depends_on starts postgres before api',
      'Named volumes persist data across container restarts',
    ],
    explanation: 'Docker Compose creates a network where services can reach each other by their service name. The api service connects to postgres (the service name) on port 5432. depends_on ensures postgres starts first. The named volume postgres_data persists database data — without it, all data is lost when the container is removed. restart: unless-stopped auto-restarts on crashes.',
    tags: ['docker-compose', 'postgres', 'volumes', 'networking', 'intermediate'],
  },

  // ─── GITHUB ACTIONS ─────────────────────────────────────────────────────────
  {
    id: 'devops-github-actions-ci',
    slug: 'github-actions-ci-pipeline',
    title: 'Write a CI Pipeline',
    description: 'Write a GitHub Actions workflow that runs on every pull request to main. It should: install dependencies, run linting, run tests, and build the project.',
    difficulty: 'intermediate',
    topic: 'GitHub Actions',
    starterCode: `# File: .github/workflows/ci.yml
# Trigger: on pull_request to main branch
# Steps: npm ci → npm run lint → npm test → npm run build

# Write the workflow:`,
    solution: `name: CI

on:
  pull_request:
    branches: [main]

jobs:
  ci:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Test
        run: npm test

      - name: Build
        run: npm run build`,
    hints: [
      'on: pull_request triggers the workflow on PRs',
      'branches: [main] limits it to PRs targeting main',
      'cache: npm caches node_modules between runs for speed',
      'Steps run in order — if any step fails, the job fails',
    ],
    explanation: 'This workflow runs on every PR to main. actions/checkout@v4 clones the repo. actions/setup-node@v4 with cache: npm caches node_modules based on package-lock.json hash — subsequent runs reuse the cache and skip npm ci if dependencies didn\'t change. Each step must pass for the job to succeed. GitHub will show a red X on the PR, preventing merge until all steps pass.',
    tags: ['github-actions', 'ci', 'pull-request', 'intermediate'],
  },
  {
    id: 'devops-github-actions-docker',
    slug: 'github-actions-build-and-push-docker',
    title: 'Build and Push Docker Image',
    description: 'Write a GitHub Actions workflow that builds a Docker image on every push to main, tags it with the Git commit SHA, and pushes it to GitHub Container Registry (ghcr.io).',
    difficulty: 'advanced',
    topic: 'GitHub Actions',
    starterCode: `# File: .github/workflows/docker.yml
# Trigger: push to main branch
# Steps:
# 1. Checkout code
# 2. Log in to GitHub Container Registry (ghcr.io)
# 3. Build Docker image tagged with the git commit SHA
# 4. Push to ghcr.io/OWNER/REPO_NAME:SHA

# The registry URL is: ghcr.io
# Use github.repository for the image name (lowercase)
# Use github.sha for the tag
# The GITHUB_TOKEN secret is available automatically`,
    solution: `name: Build and Push Docker Image

on:
  push:
    branches: [main]

jobs:
  docker:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write        # required to push to ghcr.io

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Log in to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }}

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: |
            ghcr.io/\${{ github.repository }}:\${{ github.sha }}
            ghcr.io/\${{ github.repository }}:latest`,
    hints: [
      'permissions: packages: write is required to push to ghcr.io',
      'GITHUB_TOKEN is automatically available — no setup needed',
      'github.sha gives the full commit hash for precise image tagging',
      'docker/build-push-action handles build + push in one step',
    ],
    explanation: 'GitHub Container Registry (ghcr.io) is GitHub\'s built-in Docker registry. permissions: packages: write grants the workflow push access. GITHUB_TOKEN is automatically injected — no manual secret setup. Tagging with github.sha pins the image to an exact commit, enabling precise rollbacks. The docker/build-push-action@v5 action handles multi-platform builds and caching efficiently.',
    tags: ['github-actions', 'docker', 'ghcr', 'cd', 'advanced'],
  },
  {
    id: 'devops-github-actions-secrets',
    slug: 'use-secrets-in-github-actions',
    title: 'Use Secrets in GitHub Actions',
    description: 'Write a workflow step that deploys to a server via SSH. The server IP and SSH private key are stored as GitHub secrets: SERVER_IP and SSH_PRIVATE_KEY.',
    difficulty: 'advanced',
    topic: 'GitHub Actions',
    starterCode: `# Scenario: After a Docker image is built and pushed,
# deploy it to a VPS by SSHing in and running docker pull + docker restart.

# Secrets available (set in repo Settings → Secrets):
# - SERVER_IP: the server's IP address
# - SSH_PRIVATE_KEY: the private key content

# Write the deploy job:`,
    solution: `  deploy:
    runs-on: ubuntu-latest
    needs: docker          # run only after docker job succeeds

    steps:
      - name: Deploy to server
        env:
          SSH_PRIVATE_KEY: \${{ secrets.SSH_PRIVATE_KEY }}
          SERVER_IP: \${{ secrets.SERVER_IP }}
        run: |
          # Write the private key to a temp file
          echo "$SSH_PRIVATE_KEY" > /tmp/deploy_key
          chmod 600 /tmp/deploy_key

          # SSH into the server and deploy
          ssh -i /tmp/deploy_key \\
              -o StrictHostKeyChecking=no \\
              ubuntu@$SERVER_IP \\
              "docker pull ghcr.io/\${{ github.repository }}:\${{ github.sha }} && \\
               docker stop api || true && \\
               docker rm api || true && \\
               docker run -d --name api -p 3000:3000 \\
               ghcr.io/\${{ github.repository }}:\${{ github.sha }}"

          # Clean up the key file
          rm /tmp/deploy_key`,
    hints: [
      'Secrets are accessed with ${{ secrets.SECRET_NAME }}',
      'Never echo a secret directly — pass it via env: block',
      'chmod 600 on the SSH key is required — SSH rejects keys with open permissions',
      'StrictHostKeyChecking=no skips the "are you sure?" prompt for new hosts',
    ],
    explanation: 'GitHub secrets are injected as environment variables and never appear in logs. The SSH private key is written to a temp file with chmod 600 (required by SSH — it refuses keys readable by others). The deploy command pulls the new image, stops the old container, and starts a fresh one. The key is deleted after use. StrictHostKeyChecking=no is acceptable in CI because the server IP is already trusted via the secret.',
    tags: ['github-actions', 'secrets', 'ssh', 'deploy', 'advanced'],
  },

  // ─── CI/CD CONCEPTS ─────────────────────────────────────────────────────────
  {
    id: 'devops-cicd-rollback',
    slug: 'design-a-rollback-strategy',
    title: 'Design a Rollback Strategy',
    description: 'A deploy went wrong and users are seeing 500 errors. You need to rollback to the previous version immediately. Describe the commands to rollback a Docker-based deployment.',
    difficulty: 'intermediate',
    topic: 'CI/CD',
    starterCode: `# Current situation:
# - Running: myapp:abc1234 (broken version)
# - Previous good version: myapp:def5678
# - App is running as a container named "api"

# Write the commands to rollback to the previous version:

# Step 1: Stop and remove the broken container:

# Step 2: Start the previous good version:

# Step 3: Verify it's working:`,
    solution: `# Step 1: Stop the broken container
docker stop api
docker rm api

# Or combine:
docker rm -f api

# Step 2: Start the previous known-good version
docker run -d \\
  --name api \\
  -p 3000:3000 \\
  --restart unless-stopped \\
  myapp:def5678

# Step 3: Verify health
docker ps                          # check it's running
docker logs api --tail 20          # check for errors
curl http://localhost:3000/health  # check the health endpoint

# The rollback is complete in under 60 seconds.
# This is why Docker image tagging with commit hashes matters:
# you always have the previous version available to pull.`,
    hints: [
      'docker rm -f stops and removes in one command',
      'Use the exact previous image tag (not :latest)',
      'Always verify after rollback — check logs and health endpoint',
      'This is why you tag images with commit SHA, not :latest',
    ],
    explanation: 'Docker rollback is fast because the previous image is already in the registry (and likely cached locally). docker rm -f forcibly stops and removes the running container. docker run starts the previous good version. The health check confirms the rollback worked. This entire process takes under 60 seconds — vs hours for traditional deployments. Always tag images with commit SHAs so you can target any specific version.',
    tags: ['docker', 'rollback', 'deployment', 'incident-response', 'intermediate'],
  },

  // ─── NETWORKING ─────────────────────────────────────────────────────────────
  {
    id: 'devops-nginx-reverse-proxy',
    slug: 'configure-nginx-reverse-proxy',
    title: 'Configure Nginx as Reverse Proxy',
    description: 'Write an Nginx server block that proxies requests from port 80 to a Node.js app running on localhost:3000. Include the essential proxy headers.',
    difficulty: 'intermediate',
    topic: 'Networking',
    starterCode: `# File: /etc/nginx/sites-available/myapp
# Your Node.js app runs on: localhost:3000
# Domain: myapp.example.com
# Goal: Nginx listens on port 80 and forwards requests to the app

# Write the nginx server block:`,
    solution: `server {
    listen 80;
    server_name myapp.example.com;

    location / {
        proxy_pass http://localhost:3000;

        # Pass the original Host header (your app may need it)
        proxy_set_header Host $host;

        # Pass the real client IP (otherwise app sees 127.0.0.1)
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

        # Tell the app the original protocol (http or https)
        proxy_set_header X-Forwarded-Proto $scheme;

        # Increase timeout for slow responses (default is 60s)
        proxy_read_timeout 90;
    }
}

# After writing the file:
# sudo ln -s /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled/
# sudo nginx -t        (test config for syntax errors)
# sudo systemctl reload nginx`,
    hints: [
      'proxy_pass points to where your app is running',
      'proxy_set_header Host passes the original domain to the app',
      'X-Real-IP passes the client\'s actual IP (not Nginx\'s)',
      'nginx -t tests the config before applying it',
    ],
    explanation: 'Nginx as a reverse proxy sits between the internet and your app. proxy_pass forwards requests to your Node.js app. Without the proxy headers, your app would see every request coming from 127.0.0.1 (Nginx\'s IP) and lose the real client IP and protocol. X-Real-IP and X-Forwarded-For fix this. Always run nginx -t before reloading to catch syntax errors without downtime.',
    tags: ['nginx', 'reverse-proxy', 'networking', 'intermediate'],
  },
  {
    id: 'devops-ssl-certbot',
    slug: 'add-https-with-certbot',
    title: 'Add HTTPS with Certbot',
    description: 'Your site runs on HTTP (port 80) with Nginx. Write the commands to get a free Let\'s Encrypt SSL certificate and enable HTTPS for myapp.example.com.',
    difficulty: 'intermediate',
    topic: 'Networking',
    starterCode: `# Current state: Nginx serves myapp.example.com on port 80 (HTTP only)
# Goal: Add free HTTPS using Let's Encrypt / Certbot

# Prerequisites:
# - Domain DNS points to this server
# - Nginx is installed and serving on port 80

# Step 1: Install certbot:

# Step 2: Get certificate and auto-configure Nginx:

# Step 3: Verify auto-renewal works:`,
    solution: `# Step 1: Install certbot and the Nginx plugin
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Step 2: Get a certificate and auto-configure Nginx
# Certbot will:
#   - Get a certificate from Let's Encrypt
#   - Modify your Nginx config to enable HTTPS (port 443)
#   - Set up HTTP → HTTPS redirect
sudo certbot --nginx -d myapp.example.com

# Step 3: Test that auto-renewal works
sudo certbot renew --dry-run
# Let's Encrypt certs expire every 90 days.
# Certbot installs a systemd timer or cron job to auto-renew.
# --dry-run simulates renewal without actually renewing.

# Verify the timer is active:
sudo systemctl status certbot.timer`,
    hints: [
      'python3-certbot-nginx is the Nginx plugin that auto-configures your server block',
      'The -d flag specifies the domain(s) to get a certificate for',
      'Certbot modifies your Nginx config automatically to add SSL',
      'Certs expire every 90 days — auto-renewal must be set up',
    ],
    explanation: 'Certbot with the --nginx plugin is the easiest way to add HTTPS. It contacts Let\'s Encrypt, proves you control the domain (via an HTTP challenge), gets a free certificate, and automatically updates your Nginx config to listen on port 443 with SSL and redirect HTTP to HTTPS. The certbot.timer systemd service runs twice daily to renew certs before they expire. Always test with --dry-run to confirm renewal works.',
    tags: ['nginx', 'ssl', 'https', 'certbot', 'intermediate'],
  },

  // ─── CLOUD / DEPLOYMENT ─────────────────────────────────────────────────────
  {
    id: 'devops-health-check-endpoint',
    slug: 'write-a-health-check-endpoint',
    title: 'Write a Health Check Endpoint',
    description: 'Every production app needs a /health endpoint. Write a Node.js Express health check endpoint that returns app status, uptime, and environment. It should return 200 when healthy and 503 when unhealthy.',
    difficulty: 'beginner',
    topic: 'Cloud & Deployment',
    starterCode: `// Express app already set up
// Add a GET /health endpoint that returns:
// {
//   status: "ok" | "error",
//   uptime: <process uptime in seconds>,
//   environment: <NODE_ENV>,
//   timestamp: <ISO date string>
// }
// Return 200 when healthy, 503 when not

const express = require('express');
const app = express();

// Add your health check endpoint here:`,
    solution: `const express = require('express');
const app = express();

app.get('/health', (req, res) => {
  const health = {
    status: 'ok',
    uptime: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  };

  try {
    // Add any real health checks here:
    // await db.query('SELECT 1');   // database connectivity
    // await redis.ping();           // cache connectivity

    res.status(200).json(health);
  } catch (error) {
    health.status = 'error';
    res.status(503).json(health);
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));`,
    hints: [
      'process.uptime() returns seconds since the Node.js process started',
      'process.env.NODE_ENV gives the environment (production, development)',
      'Return 503 Service Unavailable when a health check fails',
      'Health checks should verify actual dependencies (DB, cache)',
    ],
    explanation: 'A /health endpoint is the minimum requirement for production apps. Load balancers, Kubernetes, and monitoring tools use it to know if a container is healthy. process.uptime() shows how long since the last restart. The try/catch wraps actual dependency checks — if the database is down, return 503 so load balancers stop sending traffic to this instance. This is the foundation of production reliability.',
    tags: ['nodejs', 'health-check', 'express', 'deployment', 'beginner'],
  },
  {
    id: 'devops-env-variables',
    slug: 'manage-environment-variables',
    title: 'Manage Environment Variables',
    description: 'Your app needs different database URLs for development and production. Show the correct way to manage environment variables: local .env file, Docker, and GitHub Actions.',
    difficulty: 'intermediate',
    topic: 'Cloud & Deployment',
    starterCode: `# Goal: DATABASE_URL should be different per environment
# Development:  postgresql://localhost/myapp_dev
# Production:   postgresql://prod-server/myapp_prod

# Part 1: Local development — .env file

# Part 2: Docker — pass env vars at runtime

# Part 3: GitHub Actions — use secrets

# Part 4: Node.js — read the env var safely`,
    solution: `# Part 1: Local development — .env file
# .env (NEVER commit this file — add to .gitignore)
DATABASE_URL=postgresql://localhost/myapp_dev
PORT=3000
NODE_ENV=development

# Load with dotenv in Node.js:
# require('dotenv').config();  (at top of entry file)

# .gitignore:
# .env
# .env.*
# !.env.example   (commit the template without real values)

# Part 2: Docker — pass at runtime (not baked into image)
docker run -d \\
  -e DATABASE_URL=postgresql://prod-server/myapp_prod \\
  -e NODE_ENV=production \\
  myapp:1.0.0

# Or with --env-file:
docker run -d --env-file .env.production myapp:1.0.0

# Part 3: GitHub Actions — use repository secrets
# Add to repo Settings → Secrets and variables → Actions
# Then reference in workflow:
# env:
#   DATABASE_URL: \${{ secrets.DATABASE_URL }}

# Part 4: Node.js — read safely with a fallback
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  throw new Error('DATABASE_URL environment variable is required');
}`,
    hints: [
      'Never commit .env files — they contain secrets',
      'Always add .env to .gitignore',
      'Docker -e passes individual env vars; --env-file reads from a file',
      'Validate required env vars at startup to fail fast',
    ],
    explanation: '.env files store secrets locally and must never be committed. dotenv loads them in Node.js. Docker -e or --env-file injects env vars at runtime, keeping secrets out of the image. GitHub Actions secrets are injected as encrypted variables. In Node.js, always validate required env vars at startup — it\'s better to crash immediately with a clear error than to fail mysteriously at runtime when the missing var is first used.',
    tags: ['environment-variables', 'docker', 'security', 'nodejs', 'intermediate'],
  },
];
