import type { Lesson } from '@/types';

export const revisionHubLesson: Lesson = {
  id: 'revision-hub',
  slug: 'revision-hub',
  title: 'Revision Hub',
  description:
    'Complete cheat sheets for full stack development, frontend, backend, database, deployment, and interview revision. Everything you need in one place before a project or interview.',
  category: 'Revision',
  order: 21,
  difficulty: 'beginner',
  estimatedTime: 20,
  content: `This module consolidates everything from the Web Development track into quick-reference cheat sheets. Use this before starting a project, before an interview, or whenever you need a fast refresher.

---

## Full Stack Development Cheat Sheet

\`\`\`
THE FIVE LAYERS:
  Frontend     → Browser, React, UI, state, API calls
  Backend      → Node.js, Express, business logic, validation
  Database     → PostgreSQL, data persistence, queries
  Infrastructure → Docker, Nginx, CI/CD, cloud hosting
  Product      → Planning, UX, features, user needs

REQUEST LIFECYCLE:
  Browser → DNS → CDN → Load Balancer → Server → Cache → Database
  Database → Server → Browser → User sees result

TECH STACK DECISION:
  Default for most projects: Next.js + TypeScript + PostgreSQL + Prisma
  Solo/startup: Vercel + Neon + Clerk (managed services = fast)
  Enterprise: Spring Boot / Django + PostgreSQL
  High performance: Go + PostgreSQL

PROJECT PHASES:
  1. Requirements (user stories + acceptance criteria)
  2. ER Diagram + Schema design
  3. API design (endpoints, request/response shapes)
  4. Backend implementation (controller → service → repository)
  5. Frontend implementation (pages → features → components)
  6. Testing (critical paths)
  7. Deployment + monitoring
\`\`\`

---

## Frontend Cheat Sheet

\`\`\`
RENDERING MODES:
  CSR   → Empty HTML, React renders in browser (dashboard, apps)
  SSR   → Server renders per request (feeds, product pages)
  SSG   → Generated at build, served from CDN (blogs, marketing)
  ISR   → SSG + background regeneration (Next.js specific)

REACT PATTERNS:
  Local state   → useState (modal open, form values)
  Server state  → useQuery from TanStack Query (API data)
  Global state  → Context API or Zustand (user, theme)
  URL state     → useSearchParams (filters, pagination)

COMPONENT HIERARCHY:
  UI primitives (Button, Input) → no domain knowledge
  Domain components (PostCard)  → knows your data shapes
  Feature components (LoginForm) → business logic
  Pages → assemble features, handle routing

FOLDER STRUCTURE:
  src/
    components/ui/     → shared design system
    features/auth/     → self-contained feature modules
    features/posts/
    pages/             → page-level components

API LAYER:
  Never fetch() in components
  → Create apiClient (handles auth headers)
  → Create feature API functions (postsApi.getAll)
  → Use TanStack Query hooks (usePosts)

ACCESSIBILITY:
  ✓ Semantic HTML (button, not div)
  ✓ Label on every input
  ✓ ARIA when semantic HTML isn't enough
  ✓ Color contrast 4.5:1 (text), 3:1 (large text)
  ✓ Keyboard navigable
  ✓ Loading and error states

MOBILE FIRST:
  Default styles → mobile
  md: prefix    → tablet (768px+)
  lg: prefix    → desktop (1024px+)
\`\`\`

---

## Backend Cheat Sheet

\`\`\`
LAYERED ARCHITECTURE:
  Route → Middleware → Controller → Service → Repository → Database
  Controller: HTTP only (parse request, return response)
  Service:    Business logic (rules, authorization, orchestration)
  Repository: Database queries only

MIDDLEWARE STACK (order matters):
  cors() → helmet() → express.json() → rateLimiter → authenticate → routes → errorHandler

HTTP STATUS CODES:
  200 OK         → successful GET/PATCH/PUT
  201 Created    → successful POST
  204 No Content → successful DELETE
  400 Bad Request → malformed request
  401 Unauthorized → not authenticated
  403 Forbidden    → authenticated but not allowed
  404 Not Found    → resource doesn't exist
  409 Conflict     → duplicate (email taken)
  422 Validation   → valid syntax, invalid semantics
  429 Rate Limit   → too many requests
  500 Server Error → unexpected bug

ERROR RESPONSE:
  { error: { code: 'VALIDATION_ERROR', message: '...', details: [...] }, requestId: '...' }

VALIDATION:
  Use Zod at every boundary (request body, query params, URL params)
  Never trust external input — validate and coerce

AUTHENTICATION:
  Never store plain text passwords (bcrypt, rounds >= 12)
  Access token: JWT, 15 minutes, signed with strong secret
  Refresh token: httpOnly cookie, 30 days, stored hashed in DB
  Rate limit: 10 login attempts per 15 minutes per IP
\`\`\`

---

## Database Cheat Sheet

\`\`\`
DESIGN PROCESS:
  1. ER Diagram (entities + relationships)
  2. CREATE TABLE statements
  3. Add indexes after tables

DATA TYPES:
  IDs:     UUID (distributed) or SERIAL (simple)
  Money:   DECIMAL(10, 2) — never FLOAT
  Dates:   TIMESTAMPTZ WITH TIME ZONE — never VARCHAR
  Flags:   BOOLEAN — never VARCHAR 'true'/'false'
  JSON:    JSONB (indexed, queryable) — never TEXT

RELATIONSHIPS:
  1:1  → UNIQUE FK on child table
  1:n  → FK on child table (no UNIQUE)
  n:m  → Junction table with composite PK

ON DELETE:
  CASCADE   → child has no meaning without parent
  SET NULL  → child can exist independently
  RESTRICT  → protect important linked data

INDEXES:
  Always index: FK columns (PostgreSQL doesn't auto-index)
  Add indexes for: WHERE columns, ORDER BY columns, composite queries
  Check with: EXPLAIN ANALYZE query

COMMON MISTAKES:
  ✗ FLOAT for money
  ✗ VARCHAR for dates
  ✗ Comma-separated arrays in VARCHAR
  ✗ Missing FK indexes in PostgreSQL
  ✗ Hard deleting without considering orphaned data
  ✗ No timestamps (created_at, updated_at)

PAGINATION:
  Offset: page + limit (simple, but stale data issues)
  Cursor: WHERE id > $cursor LIMIT n (consistent, better for feeds)
\`\`\`

---

## Deployment Cheat Sheet

\`\`\`
DEPLOYMENT TARGETS:
  Frontend: Vercel (best for Next.js), Netlify, S3+CloudFront
  Backend:  Railway, Render, Fly.io, EC2 + Docker
  Database: Neon, Supabase, Railway PostgreSQL, RDS
  Cache:    Upstash Redis

CI/CD PIPELINE:
  Push to main
    → Tests run (fail = no deploy)
    → Build Docker image
    → Run migrations
    → Deploy new version
    → Health check passes
    → Route traffic to new version
    → Old version stops

HEALTH CHECK:
  GET /health → { status: 'healthy', db: 'connected', version: '...' }
  Returns 503 if database is down

DNS:
  A record:     domain → IP address
  CNAME record: subdomain → another domain
  TTL:          how long DNS is cached (low TTL before changes)

SSL:
  Vercel/Railway: automatic HTTPS
  VPS: certbot --nginx (Let's Encrypt, free)

ENVIRONMENT VARIABLES:
  Development: .env file (in .gitignore)
  Production:  Platform env vars UI or secret manager
  Validate at startup: Zod schema for process.env

ZERO DOWNTIME:
  Start new version → health check passes → switch traffic → stop old version
\`\`\`

---

## Security Cheat Sheet

\`\`\`
MUST DO:
  ✓ Parameterized SQL queries (never concatenate)
  ✓ bcrypt passwords (rounds >= 12)
  ✓ Helmet middleware (security headers)
  ✓ CORS restricted to known origins
  ✓ Rate limiting on auth endpoints
  ✓ Input validation with Zod (every boundary)
  ✓ httpOnly cookies for session tokens
  ✓ Secrets in environment variables (never in code)
  ✓ HTTPS only in production

NEVER DO:
  ✗ Store plain text passwords
  ✗ String concatenation in SQL
  ✗ dangerouslySetInnerHTML without sanitize
  ✗ JWT secret as "mysecret"
  ✗ .env files in git
  ✗ Log passwords, tokens, or credit cards
  ✗ Return stack traces to clients in production
  ✗ Trust client-provided file extensions

VULNERABILITIES:
  SQL Injection → parameterized queries
  XSS          → escape output (React does this), sanitize HTML
  CSRF         → SameSite cookies, CSRF tokens
  Auth attacks → rate limit, lockout, bcrypt
  Secrets leak → env vars, secret managers, .gitignore
\`\`\`

---

## Interview Quick Reference

\`\`\`
MOST ASKED CONCEPTS:
  1. SSR vs SSG vs CSR — when to use each
  2. SQL Injection — what it is, how to prevent
  3. XSS — what it is, how React prevents it
  4. JWT vs Sessions — tradeoffs
  5. Authentication vs Authorization
  6. N+1 Query Problem — what it is, how to fix
  7. Database Indexes — what, when, how to check
  8. Transactions — ACID properties, when needed
  9. Horizontal vs Vertical scaling
  10. REST design — HTTP methods, status codes, URL design

SYSTEM DESIGN TEMPLATE:
  1. Clarify requirements (functional + non-functional)
  2. Define entities and API endpoints
  3. Draw high-level architecture (database, servers, cache, CDN)
  4. Identify scale challenges
  5. Propose solutions for scale
  6. Discuss tradeoffs

BEHAVIORAL ANSWERS:
  "Tell me about a technical challenge" →
    Use STAR: Situation, Task, Action, Result
    Include: what you tried that didn't work, what you learned

PROJECT WALKTHROUGH:
  - What it does (one sentence)
  - Why you built it (problem it solves)
  - Stack and WHY (not just what)
  - Interesting technical decision
  - What you would do differently
\`\`\`

---

## Production Readiness Quick Checklist

\`\`\`
Security:
[ ] HTTPS + SSL certificate
[ ] Helmet middleware
[ ] CORS configured
[ ] Rate limiting on auth
[ ] Secrets in env vars (not code)

Observability:
[ ] Structured logging (pino/winston)
[ ] Error tracking (Sentry)
[ ] Uptime monitoring (UptimeRobot)
[ ] Health endpoint /health

Database:
[ ] Connection pooling
[ ] Indexes on FK + query columns
[ ] Daily backups
[ ] Migrations automated in CI/CD

Performance:
[ ] CDN for static assets
[ ] Images optimized
[ ] Pagination on all list endpoints

Operations:
[ ] README with setup instructions
[ ] How to deploy
[ ] How to rollback
[ ] Who to contact if broken
\`\`\`

---

## What You Can Now Build

After completing this track, you can:

\`\`\`
Build:
  ✓ Complete full-stack web applications
  ✓ REST APIs with authentication and authorization
  ✓ Properly designed database schemas
  ✓ Secure production applications
  ✓ Applications that scale

Deploy:
  ✓ Frontend to Vercel/Netlify
  ✓ Backend to Railway/Render
  ✓ Database to Neon/Supabase
  ✓ With CI/CD via GitHub Actions

Work in:
  ✓ Startup environments (move fast)
  ✓ Team environments (PRs, reviews, Scrum)
  ✓ Freelance projects (contracts, estimates, delivery)
  ✓ Open source projects (contribution workflow)

Interview for:
  ✓ Full Stack Developer roles
  ✓ Frontend Developer roles
  ✓ Backend Developer roles
  ✓ Junior to Mid-level engineering positions
\`\`\``,
  codeExamples: [
    {
      title: 'The Fastest Way to Start a New Full Stack Project',
      code: `# Complete project scaffold in 10 minutes

# 1. Create Next.js project
npx create-next-app@latest my-project \\
  --typescript --tailwind --eslint --app --src-dir

cd my-project

# 2. Install core dependencies
npm install prisma @prisma/client zod
npm install @tanstack/react-query @tanstack/react-query-devtools
npm install -D @types/node

# 3. Initialize Prisma with PostgreSQL
npx prisma init --datasource-provider postgresql

# 4. Add shadcn/ui
npx shadcn-ui@latest init --defaults
npx shadcn-ui@latest add button input card label badge dialog

# 5. Create .env from template
cat > .env << EOF
DATABASE_URL="postgresql://user:pass@localhost:5432/mydb"
NEXTAUTH_SECRET="$(openssl rand -hex 32)"
NEXTAUTH_URL="http://localhost:3000"
EOF

echo ".env" >> .gitignore
echo ".env.local" >> .gitignore

# 6. Create basic folder structure
mkdir -p src/features/auth src/features/core
mkdir -p src/lib src/components/ui src/components/layout

# 7. Initialize git
git init
git add .
git commit -m "chore: initial project setup"

# 8. Push to GitHub and connect Vercel
gh repo create my-project --public --push
# Then: go to vercel.com → New Project → Import from GitHub

echo "Done! You have a deployable Next.js app with:"
echo "  TypeScript, Tailwind, Prisma (PostgreSQL), shadcn/ui"
echo "  Deployment: Vercel auto-deploys on push to main"`,
      explanation:
        'This scaffold gives you a production-ready foundation in 10 minutes. Everything is set up: TypeScript, Tailwind, database ORM, UI components, git, and auto-deployment. Start building features immediately.',
    },
  ],
  commonMistakes: [],
  interviewQuestions: [
    {
      question: 'What is the complete tech stack you would choose for a new SaaS product today?',
      answer:
        'Next.js (App Router) for full-stack with TypeScript and Tailwind CSS for styling. PostgreSQL via Neon for the database, Prisma as ORM. Clerk for authentication (saves time vs building from scratch). Stripe for payments. Resend for transactional email. Cloudflare R2 for file storage. Vercel for deployment. Sentry for error tracking. Posthog for analytics. This stack lets a solo developer or small team ship fast without managing infrastructure.',
      difficulty: 'intermediate',
    },
    {
      question: 'If you had to explain web development to a non-technical person, what would you say?',
      answer:
        'A web application is like a restaurant. The frontend is the dining room — what customers see and interact with. The backend is the kitchen — where the actual work happens. The database is the pantry and recipe book — where all the ingredients (data) are stored. When you click a button (order food), the request goes to the kitchen (server), which retrieves ingredients (database query), prepares the result, and brings it back to your table (renders in your browser).',
      difficulty: 'beginner',
    },
  ],
  exercises: [
    {
      id: 'final-self-assessment',
      title: 'Final Self Assessment',
      description:
        'Rate your confidence (1-5) in each area. For anything below 3, go back and review that module. This is an honest evaluation, not a test.',
      starterCode: `// WEB DEVELOPMENT TRACK SELF ASSESSMENT
//
// Rate 1-5 (1 = need more study, 5 = confident to implement/explain)
//
// Module 1:  Web Development Overview           [ /5 ]
// Module 2:  Request Lifecycle / How Apps Work  [ /5 ]
// Module 3:  Tech Stack Selection               [ /5 ]
// Module 4:  Project Planning / User Stories    [ /5 ]
// Module 5:  UI/UX and Accessibility            [ /5 ]
// Module 6:  Frontend Architecture              [ /5 ]
// Module 7:  Backend Architecture               [ /5 ]
// Module 8:  Database Design                    [ /5 ]
// Module 9:  Authentication Systems             [ /5 ]
// Module 10: File Storage                       [ /5 ]
// Module 11: API Design                         [ /5 ]
// Module 12: Security                           [ /5 ]
// Module 13: Deployment                         [ /5 ]
// Module 14: Team Development                   [ /5 ]
// Module 15: Open Source                        [ /5 ]
// Module 16: Freelancing                        [ /5 ]
// Module 17: Startup Development                [ /5 ]
// Module 18: Interview Preparation              [ /5 ]
// Module 19: Building Projects                  [ /5 ]
// Module 20: Industry Practices                 [ /5 ]
//
// Modules I am going to revisit:
// 1.
// 2.
//
// Projects I am going to build next:
// 1.
// 2.`,
      solution: `// There is no single correct answer here.
// What matters is honesty and follow-through.
//
// If any module is below 3:
//   → Go back and read the lesson again
//   → Complete the exercise
//   → Build something that uses that skill
//
// The point of the assessment is not to feel good about your scores.
// It is to identify gaps before they become problems in a real job or project.
//
// The most valuable developer is not one who knows everything,
// but one who knows what they do and don't know.`,
      hints: [
        'Be honest — a 4 you did not earn is more dangerous than a 2 you know about',
        'Modules you rated below 3 are your study priorities before interviews',
        'The only way to get from 2 to 5 on any module is to build something with it',
      ],
    },
  ],
  keyTakeaways: [
    'The five layers: frontend, backend, database, infrastructure, product — everything connects through these',
    'Always plan before coding: ER diagram → API design → implementation',
    'Security is non-negotiable: parameterized SQL, bcrypt passwords, validated inputs, HTTPS',
    'Production requires: logging, error tracking, uptime monitoring, health checks, backups',
    'Career path: build complete projects, deploy them, contribute to open source, work with teams',
    'The gap between learning technologies and building products is bridged by architecture, planning, and practice',
    'You now have the knowledge to build real products — the only remaining step is to build them',
  ],
  prevLesson: 'industry-engineering-practices',
};
