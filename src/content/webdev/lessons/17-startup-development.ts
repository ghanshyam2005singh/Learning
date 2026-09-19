import type { Lesson } from '@/types';

export const startupDevelopmentLesson: Lesson = {
  id: 'startup-development',
  slug: 'startup-development',
  title: 'Startup Development',
  description:
    'MVP building, fast iteration, product validation, scaling considerations, technical debt management, and startup engineering culture — how engineers build products under startup conditions.',
  category: 'Product Development',
  order: 17,
  difficulty: 'advanced',
  estimatedTime: 25,
  content: `Startup engineering is different from enterprise engineering. The constraints are different: less time, less money, more uncertainty, higher stakes.

The goal is not clean code. The goal is learning as fast as possible whether the product should exist — then building it properly once you know it should.

---

## The Startup Engineering Mindset

**Enterprise engineering optimizes for:**
- Stability
- Correctness
- Long-term maintainability
- Process and documentation

**Startup engineering optimizes for:**
- Speed of learning
- Shipping
- Flexibility (everything might change)
- Survival (running out of money = dead)

Neither is wrong. They are different problems.

---

## MVP Building

The minimum viable product at a startup is not "the product but with fewer features." It is "the fastest way to test if this product should exist."

**The build-measure-learn loop:**
\`\`\`
BUILD → something small and testable
  ↓
MEASURE → does anyone use it? do they pay? does it solve the problem?
  ↓
LEARN → what did the metrics tell us?
  ↓
BUILD → something better based on what we learned
  ↓
(repeat)
\`\`\`

**Types of MVPs:**

\`\`\`
Concierge MVP:
  Instead of building software, do the thing manually.
  "AI that books restaurants" → manually book restaurants for users
  Learn: do users actually want this? What do they really need?

Landing page MVP:
  Build a landing page describing the product.
  Collect emails from interested users.
  Learn: is there demand? What language resonates?

Wizard of Oz MVP:
  The user thinks software is working.
  Actually a human is doing it behind the scenes.
  Learn: does the workflow work? What edge cases exist?

Prototype MVP:
  Non-functional mockup in Figma.
  Put in front of users and watch them try to use it.
  Learn: is the UX intuitive? What features matter most?

Code MVP:
  Minimal working version of the core feature only.
  Built in 2-4 weeks.
  Learn: do users actually use it after signing up?
\`\`\`

---

## Fast Iteration

**Every week without shipping is a week without learning.**

Startup engineering velocity comes from:

\`\`\`
1. Small scope per iteration
   Ship features weekly, not quarterly.

2. Feature flags
   Deploy code without activating it.
   Enable for 5% of users. Watch metrics. Enable for all.

3. Trunk-based development
   Everyone works on main.
   No long-lived feature branches.
   Feature flags replace branches.

4. Automated testing (not full coverage, critical paths only)
   Auth, payment, core CRUD — must always work.
   Edge cases can be caught by users and fixed next week.

5. Skipping premature optimization
   Optimize when the metric is wrong, not before.
   If the page takes 3 seconds and no one is complaining, fix something else.
\`\`\`

---

## Product Validation

**How to know if you are building the right thing:**

\`\`\`
Quantitative signals:
  - DAU/MAU ratio (daily active users / monthly) — healthy: 20%+
  - Retention: what % of users return after 1 week? 1 month?
  - Conversion: what % of sign-ups actually use the core feature?
  - Revenue: are people paying?
  - Churn: are paying users leaving?

Qualitative signals:
  - User interviews: talk to users weekly
  - Session recordings (Hotjar/FullStory): watch users actually use the product
  - Support tickets: what do users ask for help with?
  - NPS: would you recommend this product?
\`\`\`

**Product-market fit signals:**
\`\`\`
You have product-market fit when:
  - Users are upset if you talk about removing the product
  - You are growing faster than you can handle
  - Users bring other users (organic growth)
  - Retention curves flatten at 30%+ (not approaching zero)

You do NOT have product-market fit when:
  - Users sign up but don't come back
  - You need to constantly push to get anyone to use it
  - Churn is high
  - No one is paying despite being asked
\`\`\`

---

## Scaling

**Don't scale what you haven't validated.**

Premature scaling is one of the most common startup mistakes. Architecture for 10M users before you have 100 is wasted engineering time that could have been used to find product-market fit.

**When to scale:**
\`\`\`
Scale when the metric is actually broken:
  - Response times > 2 seconds
  - Downtime affecting users
  - Database queries exceeding available connections
  - Memory exhausted

Not when:
  - "We might have 10M users someday"
  - "This doesn't feel scalable"
  - "The CTO at a big company told me to use microservices"
\`\`\`

**Simple → Complex scaling path:**
\`\`\`
Stage 1 (0-10k users):
  - Monolith application
  - Single PostgreSQL instance
  - Vercel/Railway (managed hosting)
  - No caching (fast enough)

Stage 2 (10k-100k users):
  - Add Redis caching for expensive queries
  - Read replicas for PostgreSQL
  - CDN for static assets (already on Vercel)
  - Async job queue for slow operations (email, processing)

Stage 3 (100k-1M users):
  - Database sharding or partition consideration
  - Multiple application servers
  - Full observability (tracing, metrics, alerts)
  - Begin considering service extraction for bottlenecks

Stage 4 (1M+ users):
  - Microservices where needed (not everywhere)
  - Dedicated data infrastructure
  - ML/personalization infrastructure
  - Large dedicated platform/infra team
\`\`\`

**Most startups never need Stage 3 or 4.** Being at Stage 2 with 100k happy users is a great problem to have.

---

## Technical Debt

Technical debt is code that works but will be expensive to change later.

**Good debt (intentional shortcuts to ship faster):**
\`\`\`
- Hardcoded config values instead of a config service
- Skip caching and accept slower queries
- Simple file upload to local disk instead of S3
- Manual deployment instead of automated CI/CD
- Simplified pricing model that doesn't scale perfectly
\`\`\`

**Bad debt (unintentional mistakes):**
\`\`\`
- No tests on critical paths
- No error handling
- Security vulnerabilities (never acceptable even early)
- No logging or monitoring
- Data that is impossible to query efficiently
\`\`\`

**Managing technical debt:**
\`\`\`
1. Make it visible: keep a debt backlog
2. Pay it down incrementally: 20% of each sprint on debt
3. Never ship security debt
4. Never ship data debt (bad schemas are expensive to fix)
5. Code that you are going to change anyway is not technical debt
\`\`\`

---

## Startup Architecture Principles

\`\`\`
1. Monolith first, microservices when a specific service is the bottleneck.

2. One database (PostgreSQL) for all things. Split only when you have a specific reason.

3. Don't invent infrastructure. Use managed services.
   - Vercel for hosting
   - Neon for database
   - Upstash for Redis
   - Resend/SendGrid for email
   - Clerk for auth (delegate to experts)

4. Keep it boring: use proven technologies.
   No new databases, no new frameworks, no new patterns without clear justification.
   Boring stack + fast iteration > cutting-edge stack + slow iteration.

5. Build for today + 10x. Not for today + 1000x.

6. Make reversible decisions fast. Deliberate carefully on irreversible ones.
   Database schema, API contracts, data models → think carefully.
   UI, endpoint names, component names → decide and move.
\`\`\`

---

## The Startup Engineer's Day

\`\`\`
Morning standup (10 minutes):
  What did I ship yesterday?
  What am I shipping today?
  What is blocked?

Work:
  Write code → ship → check metrics → next thing
  Talk to users: minimum 1 user call per week
  Review error tracking every morning

Evening:
  Deploy to production (ideally multiple times per day)
  Document what shipped in linear/notion
\`\`\``,
  codeExamples: [
    {
      title: 'Feature Flag Implementation',
      code: `// Simple feature flag system for startup-speed iteration
// Store flags in database or Redis for dynamic control

// lib/flags.ts
const FLAGS = {
  NEW_DASHBOARD: 'new_dashboard',
  AI_SUGGESTIONS: 'ai_suggestions',
  BETA_CHECKOUT: 'beta_checkout',
} as const;

type Flag = typeof FLAGS[keyof typeof FLAGS];

// Check if a flag is enabled for a specific user
async function isEnabled(flag: Flag, userId: string): Promise<boolean> {
  // Get flag config from database
  const config = await flagsCache.get(flag) ?? await db.query(
    'SELECT * FROM feature_flags WHERE name = $1',
    [flag]
  ).then(r => r.rows[0]);

  if (!config || !config.enabled) return false;

  // Rollout percentage: enable for X% of users
  if (config.rollout_percentage < 100) {
    // Deterministic hash so same user always gets same result
    const hash = parseInt(
      crypto.createHash('md5').update(userId + flag).digest('hex').slice(0, 8),
      16
    );
    return (hash % 100) < config.rollout_percentage;
  }

  // Specific users list
  if (config.user_ids?.includes(userId)) return true;

  return config.enabled;
}

// Usage in route handler:
app.get('/dashboard', authenticate, async (req, res) => {
  const useNewDashboard = await isEnabled('new_dashboard', req.user.id);

  res.json({
    variant: useNewDashboard ? 'new' : 'legacy',
    data: useNewDashboard
      ? await newDashboardService.getData(req.user.id)
      : await legacyDashboardService.getData(req.user.id),
  });
});

// Feature flags table:
// CREATE TABLE feature_flags (
//   name VARCHAR PRIMARY KEY,
//   enabled BOOLEAN DEFAULT false,
//   rollout_percentage INTEGER DEFAULT 0,  -- 0-100
//   user_ids UUID[] DEFAULT '{}'           -- specific users
// );`,
      explanation:
        'Feature flags let you deploy code to production without activating it for all users. You can roll out to 5%, watch metrics, then expand. This enables trunk-based development and safe experiments.',
    },
  ],
  commonMistakes: [
    'Building for 10M users before having 10 users — wasted engineering time that could find product-market fit',
    'Perfecting code quality when product-market fit is still unproven',
    'Never talking to users — building what you think they want instead of what they actually need',
    'Technical debt in security, data models, or auth — these are never acceptable shortcuts',
    'Moving to microservices because "that is how big companies do it" — it is how they do it at 10M+ users',
    'Not measuring anything — shipping without analytics is building blind',
    'Spending 2 months building when a landing page would have answered the question in 2 days',
  ],
  interviewQuestions: [
    {
      question: 'How would you approach building a startup\'s MVP?',
      answer:
        'Start with the riskiest assumption: does anyone want this? Validate before building by talking to users and potentially using a concierge or landing page MVP. When building code, scope to the single core workflow only. Choose a boring, proven stack (Next.js + PostgreSQL + managed services) — novelty in the stack costs speed. Ship in 2-4 weeks, put in front of users, measure retention and engagement. Build the next thing based on what you learned, not what you planned.',
      difficulty: 'intermediate',
    },
    {
      question: 'What is technical debt and when is it acceptable?',
      answer:
        'Technical debt is code that works but is expensive to change later. Intentional technical debt is acceptable when it lets you ship faster to validate a hypothesis, and when you have a plan to pay it down. Unacceptable debt: security vulnerabilities, poor data models (expensive to migrate), no error monitoring, no critical path tests. Acceptable debt: manual processes, no caching yet, simplified architecture. The key is making it explicit and having a plan.',
      difficulty: 'intermediate',
    },
  ],
  exercises: [
    {
      id: 'startup-architecture',
      title: 'Design a Startup Architecture',
      description:
        'You are CTO of a new startup building an e-learning platform (like this one). You have 6 weeks to launch, 2 engineers, and a budget for managed services. Design the architecture for the MVP launch and the plan for scaling if you reach 100k users.',
      starterCode: `// MVP Architecture (Week 1-6, 0-1k users)
// Stack:
// Deployment:
// Database:
// Auth:
// Email:
// Payments:
// Monitoring:

// Phase 2 Architecture (Month 3-6, 1k-100k users)
// What changes?
// What stays the same?

// Technical debt we are intentionally taking:
// 1.
// 2.

// Technical debt we refuse to take (even in MVP):
// 1.
// 2.`,
      solution: `// MVP Architecture (Week 1-6, 0-1k users)
// Stack: Next.js (App Router), TypeScript, Tailwind, tRPC, Prisma
// Deployment: Vercel (frontend + API routes) — zero config, auto-scaling
// Database: Neon (serverless PostgreSQL) — free tier, scales automatically
// Auth: Clerk — delegate auth completely, saves 1+ week of dev time
// Email: Resend — simple API, great developer experience
// Payments: Stripe — industry standard, excellent docs
// File Storage: Cloudflare R2 — cheap, S3-compatible, CDN included
// Monitoring: Sentry (errors) + Vercel Analytics (performance)
// Cache: None — Neon is fast enough at this scale

// Phase 2 Architecture (Month 3-6, 1k-100k users)
// What changes:
// - Add Upstash Redis for caching expensive lesson/progress queries
// - Migrate to dedicated PostgreSQL on Railway if Neon becomes costly
// - Add a worker service (Railway background worker) for async jobs:
//   email sending, video processing, certificate generation
// - Add Posthog for product analytics (which lessons do users drop off at?)

// What stays the same:
// - Next.js monolith (no microservices)
// - Vercel for deployment
// - Clerk for auth
// - Stripe for payments
// - Same database schema (design it right at MVP)

// Technical debt we are intentionally taking:
// 1. No video hosting — link YouTube videos instead of hosting our own
// 2. No automated CI/CD — manually deploy on Vercel (push to main = deploy)
// 3. No caching — accept slower query times, optimize when metrics demand it
// 4. Simplified progress tracking (localStorage + DB sync, not real-time)

// Technical debt we refuse to take (even in MVP):
// 1. No security shortcuts — auth through Clerk, no rolling our own
// 2. No bad database design — schema migrations are expensive, design carefully
// 3. No skipping error monitoring — Sentry from day one, costs $0 at our scale
// 4. No skipping input validation — Zod on all API inputs from the start`,
      hints: [
        'Use managed services for everything you are not competing on (auth, email, payments)',
        'The schema is the one thing you should NOT rush — bad data models are expensive to fix',
        'Scaling happens when the current solution is actually breaking, not in anticipation',
      ],
    },
  ],
  keyTakeaways: [
    'Startup engineering optimizes for speed of learning and shipping, not long-term architecture',
    'Validate before building: a landing page or manual process often answers the question faster than code',
    'Ship in small batches weekly — every week without shipping is a week without learning',
    'Scale when the metric is actually broken, not in anticipation of future scale',
    'Acceptable startup debt: manual processes, no caching, simplified architecture',
    'Never acceptable: security shortcuts, bad data models, no error monitoring',
    'Use managed services for everything you are not competing on — focus engineering on your product',
  ],
  nextLesson: 'interview-preparation',
  prevLesson: 'freelancing-client-work',
};
