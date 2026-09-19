import type { InterviewQuestion } from '@/types';

export const interviewQuestions: InterviewQuestion[] = [
  // ─── DEVOPS FUNDAMENTALS ────────────────────────────────────────────────────
  {
    question: 'What is DevOps and what problem does it solve?',
    answer: 'DevOps is a culture and set of practices that unifies Development and Operations teams to deliver software faster and more reliably. Before DevOps, developers wrote code and threw it "over the wall" to operations who deployed it — different environments, manual processes, and blame cycles when things broke. DevOps solves this by: automating build/test/deploy pipelines, using infrastructure-as-code so environments are consistent, enabling developers to deploy their own code, and creating shared responsibility for production health. The result: companies like Amazon deploy thousands of times per day instead of once per quarter.',
    difficulty: 'beginner',
    tip: 'DevOps is not a job title — it\'s a culture. Mention culture, automation, and shared responsibility.',
  },
  {
    question: 'What is the difference between Continuous Integration, Continuous Delivery, and Continuous Deployment?',
    answer: 'Continuous Integration (CI): automatically builds and tests code on every commit — ensures the codebase always compiles and tests pass. Continuous Delivery: extends CI by ensuring every passing build is in a deployable state, with the artifact automatically deployed to staging. Production deployment requires a human to click "approve". Continuous Deployment: every commit that passes CI is automatically deployed to production with no human approval. Most product teams use CI + Continuous Delivery. CD requires very high test coverage and excellent monitoring.',
    difficulty: 'beginner',
    followUp: ['What is the difference between Continuous Delivery and Continuous Deployment?'],
  },
  {
    question: 'What is Infrastructure as Code (IaC) and why is it important?',
    answer: 'IaC is the practice of managing and provisioning infrastructure (servers, networks, databases) through code files rather than manual processes. Instead of SSHing into a server and running commands, you write a Terraform or Ansible file that declares what infrastructure you need. Benefits: reproducible environments (no more "works on my machine"), version-controlled infrastructure, easy to audit changes, spin up identical environments for dev/staging/prod, disaster recovery (rebuild from code in minutes). Tools: Terraform (cloud infrastructure), Ansible (server configuration), AWS CloudFormation.',
    difficulty: 'intermediate',
    followUp: ['What is the difference between imperative and declarative IaC?'],
  },
  {
    question: 'What is the difference between blue/green deployment and canary deployment?',
    answer: 'Blue/Green: two identical environments (blue=current, green=new). You deploy to green, test it, then switch all traffic at once. Rollback = flip traffic back to blue. Zero downtime. Simple to understand but requires double the infrastructure. Canary: gradually shift traffic — start with 5% to new version, watch error rates and metrics, then increase to 25%, 50%, 100%. If errors spike, stop and rollback. Slower but safer for changes that might have unknown bugs under real traffic. Netflix uses canary deployments extensively.',
    difficulty: 'intermediate',
    tip: 'Blue/green = instant switch. Canary = gradual traffic shift. Both achieve zero-downtime deployments.',
  },
  {
    question: 'What happens when you type a URL in the browser and press Enter?',
    answer: '1) Browser parses the URL (protocol, domain, path). 2) DNS lookup: browser checks cache, then OS cache, then asks DNS resolver to translate domain → IP address. 3) TCP connection: browser establishes TCP connection to server on port 80 (HTTP) or 443 (HTTPS). 4) TLS handshake (if HTTPS): browser and server negotiate encryption, verify certificate. 5) HTTP request sent: GET /path HTTP/1.1 with headers. 6) Server processes request and returns HTTP response (200 OK + body). 7) Browser parses HTML, fetches CSS/JS/images with additional requests. 8) Page renders.',
    difficulty: 'intermediate',
    tip: 'This is the most common system design/networking interview question. Memorize the sequence: URL parse → DNS → TCP → TLS → HTTP request → response → render.',
  },

  // ─── LINUX ──────────────────────────────────────────────────────────────────
  {
    question: 'What is the difference between a process and a thread?',
    answer: 'A process is an independent program in execution with its own memory space, file handles, and system resources — fully isolated from other processes. A thread is a lightweight unit of execution within a process — threads in the same process share memory and resources. Creating a thread is faster than creating a process. Multi-threading enables parallelism within one program. Use multiple processes for isolation (e.g., microservices). Use threads for concurrent tasks that need shared data. In Linux, use ps aux to see processes and top/htop for real-time monitoring.',
    difficulty: 'beginner',
  },
  {
    question: 'What does chmod 755 mean and how do Linux file permissions work?',
    answer: 'Linux file permissions have three groups: owner, group, others. Each group has read(4), write(2), execute(1) permissions. chmod uses octal: 755 means owner=7(rwx), group=5(r-x), others=5(r-x). Common patterns: 755 for executables/directories, 644 for files (owner reads/writes, others read-only), 600 for private files like SSH keys (owner-only), 777 is dangerous — gives everyone full access. chmod +x script.sh adds execute permission. Always use the minimum permissions needed (principle of least privilege).',
    difficulty: 'beginner',
    followUp: ['What does the sticky bit do?', 'What is setuid?'],
  },
  {
    question: 'How do you diagnose a server that is not responding?',
    answer: 'Systematic approach: 1) Can you ping the server? (ping ip) — tests basic network connectivity. 2) Can you reach the port? (nc -zv host port or telnet host port) — tests if the service is listening. 3) SSH in and check: is the process running? (ps aux | grep app). 4) Check logs for errors (journalctl -u service-name -f or tail -f /var/log/app.log). 5) Check resources: disk full (df -h), out of memory (free -h), CPU maxed (top). 6) Check firewall (ufw status). 7) Check network (ss -tulpn to see what is listening). These steps diagnose 95% of server issues.',
    difficulty: 'beginner',
    tip: 'ping → port check → process → logs → resources → firewall. Always go from network layer to application layer.',
  },
  {
    question: 'What is a reverse proxy and why is Nginx commonly used as one?',
    answer: 'A reverse proxy sits between the internet and your application server, receiving requests from clients and forwarding them to the backend. Nginx is used because: it handles SSL/TLS termination (your app runs plain HTTP internally), serves static files extremely efficiently (faster than Node.js/Python), load-balances across multiple app instances, provides rate limiting and caching, and lets you run multiple apps on one server (route by domain or path). Pattern: internet → Nginx (port 443) → Node.js app (port 3000). Nginx handles HTTPS complexity; your app stays simple.',
    difficulty: 'intermediate',
  },
  {
    question: 'What is SSH key-based authentication and how does it work?',
    answer: 'SSH key authentication uses asymmetric cryptography instead of passwords. You generate a key pair: private key (stays on your machine, never shared) and public key (copied to the server). When you SSH in, the server sends a challenge encrypted with your public key — only your private key can decrypt it, proving your identity. Setup: ssh-keygen creates the pair, ssh-copy-id or manually appending to ~/.ssh/authorized_keys on the server. Advantages over passwords: no password to brute-force, no password to phish, can be used in automated scripts. Disable password auth for production servers.',
    difficulty: 'beginner',
  },

  // ─── DOCKER ─────────────────────────────────────────────────────────────────
  {
    question: 'What is Docker and what problem does it solve?',
    answer: 'Docker is a containerization platform that packages an application with its runtime, dependencies, and configuration into a portable unit called a container. It solves "it works on my machine" — before Docker, developers had Node 18 locally, production had Node 16, libraries differed, environments drifted. With Docker, you ship the entire environment. Benefits: identical environments from dev to production, easy onboarding (docker compose up instead of 3-day setup), fast deployment, easy rollback (re-run old image), efficient use of server resources (containers are much lighter than VMs).',
    difficulty: 'beginner',
    tip: 'Lead with the problem it solves: environment inconsistency. Then mention the container = app + runtime + deps.',
  },
  {
    question: 'What is the difference between a Docker image and a container?',
    answer: 'A Docker image is a read-only blueprint built from a Dockerfile — like a class definition. It contains the application code, runtime (Node.js, Python), dependencies (npm packages), and configuration, organized in layers. A container is a running instance of an image — like an object instantiated from a class. Multiple containers can run from the same image. Images are stored in registries (Docker Hub, GHCR). When you run docker run nginx, Docker pulls the nginx image and creates a running container from it. Image = static blueprint. Container = live process.',
    difficulty: 'beginner',
    followUp: ['What is a Docker registry?', 'How are image layers cached?'],
  },
  {
    question: 'How does Docker image layering work and why does it matter for performance?',
    answer: 'Every instruction in a Dockerfile creates a new read-only layer. Layers are cached: if a layer\'s instruction and inputs haven\'t changed, Docker reuses the cached layer instead of rebuilding. This is why layer ORDER matters: put rarely-changing instructions first (FROM, installing system packages) and frequently-changing instructions last (copying source code). Best practice: COPY package.json → RUN npm install → COPY source code. Since package.json changes less often than code, npm install is cached on most builds. A single line change in source code only rebuilds the last COPY layer, not npm install.',
    difficulty: 'intermediate',
    tip: 'Copy package.json first, npm install second, copy source code last. This is the single most important Dockerfile optimization.',
  },
  {
    question: 'What is the difference between CMD and ENTRYPOINT in a Dockerfile?',
    answer: 'ENTRYPOINT sets the main executable that always runs — it cannot be overridden at docker run time (only with --entrypoint flag). CMD provides default arguments to ENTRYPOINT, or if no ENTRYPOINT, the default command. CMD can be overridden at docker run time. Common pattern: ENTRYPOINT ["node"] CMD ["server.js"] — running docker run myapp test.js would start node test.js. For most application containers, CMD is sufficient: CMD ["node", "server.js"]. ENTRYPOINT is useful when the container should always run a specific executable.',
    difficulty: 'intermediate',
  },
  {
    question: 'What is a multi-stage Docker build and why use it?',
    answer: 'A multi-stage build uses multiple FROM instructions in one Dockerfile, where each stage can copy artifacts from previous stages. This solves image bloat: stage 1 (builder) installs compilers, TypeScript, test tools and builds the app; stage 2 (production) starts from a clean base image and only copies the compiled output. Result: production image contains no build tools, no source code, no devDependencies — only what is needed to run. A TypeScript app might go from 1.2GB (with build tools) to 150MB (just Node + compiled JS). Smaller images = faster pulls, smaller attack surface.',
    difficulty: 'intermediate',
    followUp: ['What is a distroless base image?'],
  },
  {
    question: 'What is Docker Compose and when would you use it?',
    answer: 'Docker Compose is a tool for defining and running multi-container applications using a YAML file (docker-compose.yml). Instead of running multiple docker run commands with environment variables and network flags, you declare all services (app, database, cache) in one file. docker compose up starts everything. docker compose down stops and removes containers. Use it for: local development (your app + PostgreSQL + Redis in one command), running integration tests with real dependencies, and small-to-medium production deployments. For large production, Kubernetes is more appropriate.',
    difficulty: 'intermediate',
  },
  {
    question: 'How do you secure a Docker container in production?',
    answer: 'Key security practices: 1) Run as non-root user: add USER in Dockerfile (root inside container = root if breakout occurs). 2) Use minimal base images: Alpine or distroless reduces attack surface. 3) Never store secrets in images or environment variables in Compose files — use Docker secrets or a secrets manager (AWS Secrets Manager, HashiCorp Vault). 4) Scan images for vulnerabilities: docker scout or Trivy. 5) Set resource limits (--memory, --cpus) to prevent DoS. 6) Use read-only filesystems where possible. 7) Pin base image versions (node:20.11.0-alpine, not node:latest).',
    difficulty: 'advanced',
  },

  // ─── CI/CD & GITHUB ACTIONS ─────────────────────────────────────────────────
  {
    question: 'What is a GitHub Actions workflow and what are its components?',
    answer: 'A GitHub Actions workflow is a YAML file in .github/workflows/ that automates tasks in response to events. Components: trigger (on: push, pull_request) — when the workflow runs. jobs — groups of steps that run on a runner (virtual machine). steps — individual commands or actions that run sequentially within a job. actions — reusable units from the marketplace (actions/checkout, actions/setup-node). secrets — encrypted values for credentials. Artifacts — files produced by a job that can be shared between jobs or downloaded. Jobs run in parallel by default; use needs: to define dependencies.',
    difficulty: 'beginner',
  },
  {
    question: 'How do you securely use secrets in a CI/CD pipeline?',
    answer: 'Store secrets in GitHub Settings → Secrets and variables → Actions. Access in workflows with ${{ secrets.SECRET_NAME }}. GitHub masks secret values in logs — they never appear in plain text. Best practices: use the minimum set of secrets needed (principle of least privilege), rotate secrets regularly, use environment-scoped secrets for production (requires approval to use), never echo secrets or print them in commands, use OIDC (OpenID Connect) where possible to get short-lived cloud credentials instead of long-lived keys. Never store secrets in code, .env files, or Docker images.',
    difficulty: 'intermediate',
    tip: 'The key principle: secrets should never appear in plaintext, in logs, in code, or in images.',
  },
  {
    question: 'How do you speed up a slow CI pipeline?',
    answer: 'Common optimizations: 1) Cache dependencies: cache node_modules based on package-lock.json hash — skips npm install if unchanged (saves 1-3 minutes). 2) Parallelize jobs: run lint, unit tests, and build in parallel instead of sequentially. 3) Use faster runners if available. 4) Only run expensive tests on PR merge, not on every commit. 5) Cancel in-progress runs when new commits are pushed (concurrency groups). 6) Use job artifacts to pass build output between jobs instead of rebuilding. 7) Use sparse checkout if the repo is large. A well-optimized CI pipeline should run in under 5 minutes.',
    difficulty: 'intermediate',
  },
  {
    question: 'What is a rollback strategy and how do you implement it?',
    answer: 'A rollback is deploying the previous known-good version after a bad deploy. Strategies: 1) Docker-based: keep previous images tagged with commit SHA. Rollback = docker stop + docker run previous-sha. Takes 30-60 seconds. 2) Git revert: create a new commit that reverses the bad changes, push, CI deploys automatically. 3) Feature flags: disable the bad feature via a flag without redeployment. 4) Blue/green: flip traffic back to the blue environment. Best practice: always tag Docker images with commit SHAs (not :latest), maintain at least 3 previous versions in your registry, and document the rollback procedure before you need it.',
    difficulty: 'intermediate',
    followUp: ['How do you rollback a database migration?'],
  },

  // ─── CLOUD & NETWORKING ─────────────────────────────────────────────────────
  {
    question: 'What is the difference between horizontal and vertical scaling?',
    answer: 'Vertical scaling (scale up) means adding more resources to existing servers — more CPU, more RAM, bigger disk. Simple, no code changes, but has a physical limit and is expensive. There is always a maximum server size. Horizontal scaling (scale out) means adding more servers and distributing load between them. Requires a load balancer, and the application must be stateless (no local session state — use Redis for sessions). Horizontal scaling has no theoretical limit and is more resilient (one server fails, others continue). Modern cloud apps are designed for horizontal scaling.',
    difficulty: 'intermediate',
  },
  {
    question: 'What is a CDN and when do you use it?',
    answer: 'A CDN (Content Delivery Network) is a distributed network of servers around the world that caches and serves static content (images, CSS, JS, videos) from a server geographically close to the user. Without CDN: a user in Tokyo downloads an image from your New York server — 200ms latency. With CDN: the image is cached in a Tokyo edge server — 10ms. Use CDN for: static assets, images, video streaming, and even HTML for fully static sites. Cloudflare, AWS CloudFront, and Fastly are common CDNs. For dynamic content (API responses), CDNs can also cache short-lived responses.',
    difficulty: 'intermediate',
  },
  {
    question: 'What is a load balancer and what algorithms does it use?',
    answer: 'A load balancer distributes incoming traffic across multiple backend servers to prevent any one server from being overwhelmed. Common algorithms: Round Robin — requests distributed evenly in rotation (simple, default). Least Connections — sends new request to server with fewest active connections (good for long-lived connections). IP Hash — same client IP always goes to same server (useful for session stickiness). Weighted — assign different weights to servers with different capacities. Health checks are critical: load balancer periodically checks each server\'s /health endpoint and stops sending traffic to unhealthy servers.',
    difficulty: 'intermediate',
  },
  {
    question: 'What is HTTPS and how does TLS work?',
    answer: 'HTTPS = HTTP + TLS (Transport Layer Security). It encrypts all traffic between browser and server so no one in the middle can read or tamper with it. TLS handshake: 1) Browser connects to server, server sends certificate (signed by a trusted Certificate Authority like Let\'s Encrypt). 2) Browser verifies certificate is valid, not expired, and signed by a trusted CA. 3) Browser and server negotiate encryption keys using asymmetric cryptography. 4) All subsequent communication is encrypted with symmetric encryption. Use Let\'s Encrypt (free, automated certificate renewal) via Certbot for any domain. Every production site must use HTTPS.',
    difficulty: 'beginner',
  },
  {
    question: 'What is a Dockerfile EXPOSE instruction and does it actually open a port?',
    answer: 'EXPOSE in a Dockerfile is purely documentation — it tells developers and tools which port the container listens on, but does NOT actually publish or open that port on the host. To actually make the port accessible, you must use -p host:container in docker run, or ports: in docker-compose.yml. Example: EXPOSE 3000 says "this app listens on 3000 inside the container". docker run -p 8080:3000 myapp maps host port 8080 to container port 3000. Containers on the same Docker network can reach each other by container name regardless of EXPOSE.',
    difficulty: 'beginner',
  },

  // ─── MONITORING & INCIDENT RESPONSE ─────────────────────────────────────────
  {
    question: 'What is observability and what are its three pillars?',
    answer: 'Observability is the ability to understand the internal state of a system from its external outputs. The three pillars: Logs — structured records of events ("user 123 logged in at 14:32"). Use structured JSON logging. Tools: ELK Stack, Loki. Metrics — numeric measurements over time (CPU%, requests/sec, error rate, p99 latency). Tools: Prometheus, Grafana, Datadog. Traces — end-to-end tracking of a request through all services, showing where time was spent. Tools: Jaeger, Zipkin, Datadog APM. Effective observability lets you answer "what broke, when, and why" without needing to reproduce the issue.',
    difficulty: 'intermediate',
    followUp: ['What is the difference between monitoring and observability?'],
  },
  {
    question: 'What is a health check endpoint and what should it check?',
    answer: 'A /health endpoint returns the app\'s operational status, used by load balancers and orchestrators to decide whether to send traffic to an instance. It should: return 200 OK when healthy, return 503 when unhealthy. What to check: is the database reachable (SELECT 1), is Redis reachable (PING), are critical third-party services responding. What NOT to check: non-critical services that would make the app "unhealthy" unnecessarily. Response should include: status, uptime, environment, timestamp. Best practice: separate /health (liveness — is the process running) from /ready (readiness — is the app ready to serve traffic).',
    difficulty: 'intermediate',
  },
  {
    question: 'You deployed new code and error rates spiked to 20%. Walk through your incident response.',
    answer: 'Immediate actions: 1) Rollback first — restore the previous version immediately to stop user impact. Do not investigate before rolling back. 2) Confirm rollback worked — monitor error rate drops back to baseline. 3) Post-incident investigation: pull logs from the 10-minute window around the deploy, identify which errors spiked and what they say. 4) Reproduce the bug in a non-production environment. 5) Fix the root cause, add a regression test. 6) Deploy fix with extra monitoring. 7) Write a post-mortem: what happened, timeline, root cause, what we will do to prevent recurrence. Never blame people — focus on systems.',
    difficulty: 'advanced',
    tip: 'Rollback first, investigate second. This is the most important principle. Interviewers want to see you prioritize user impact.',
  },
  {
    question: 'What is the difference between SLA, SLO, and SLI?',
    answer: 'SLI (Service Level Indicator): a metric that measures a specific aspect of service quality. Examples: availability (% of requests that succeed), latency (p99 response time), error rate. SLO (Service Level Objective): a target for an SLI. Example: 99.9% availability, p99 latency < 200ms. This is an internal goal your team commits to. SLA (Service Level Agreement): a legal contract with customers that includes SLOs + penalties for missing them. If SLA is broken, customers get refunds. Key insight: your internal SLOs should be stricter than your SLAs (buffer so SLA is never violated).',
    difficulty: 'advanced',
  },

  // ─── KUBERNETES (K8s) ───────────────────────────────────────────────────────
  {
    question: 'What is Kubernetes and when do you need it?',
    answer: 'Kubernetes (K8s) is a container orchestration platform that automates deploying, scaling, and managing containerized applications across a cluster of machines. It handles: scheduling containers to healthy nodes, automatically restarting crashed containers, scaling up/down based on traffic, rolling deployments with zero downtime, service discovery, config management, and self-healing. You need K8s when: you have 10+ services that need independent scaling, you need automated failover, or your deployment complexity exceeds what Docker Compose can manage. For most startups and small teams, Railway, Render, or Docker Compose on a VPS are simpler and sufficient.',
    difficulty: 'advanced',
    followUp: ['What is the difference between a Pod and a Deployment in K8s?'],
  },
];
