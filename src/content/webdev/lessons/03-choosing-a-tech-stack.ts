import type { Lesson } from '@/types';

export const choosingTechStackLesson: Lesson = {
  id: 'choosing-a-tech-stack',
  slug: 'choosing-a-tech-stack',
  title: 'Choosing a Tech Stack',
  description:
    'Compare MERN, PERN, T3, Next.js, Django, Laravel, Spring Boot, and Go stacks. Learn when to choose each, what tradeoffs you accept, and how to make the decision for real projects.',
  category: 'Architecture',
  order: 3,
  difficulty: 'intermediate',
  estimatedTime: 30,
  content: `One of the most paralyzing decisions in web development is choosing a tech stack. New developers spend days researching, comparing, and second-guessing. Senior developers make the decision in 30 minutes.

The difference is not knowledge of more technologies. It is knowing what questions to ask.

---

## The Right Questions

Before picking a stack, answer these:

1. **What is the team's existing expertise?** The best stack is the one your team already knows.
2. **What is the product?** A real-time chat app has different requirements than a content site.
3. **What is the scale at launch?** 100 users or 1,000,000?
4. **What is the timeline?** Ship in 2 weeks or 6 months?
5. **What does the ecosystem offer?** Libraries, hosting, community support.
6. **What are the operational requirements?** Serverless, containers, bare metal?

No stack is universally best. Every stack is a tradeoff.

---

## MERN Stack

**MongoDB + Express + React + Node.js**

\`\`\`
Frontend:  React
Backend:   Node.js + Express
Database:  MongoDB
Hosting:   Any Node.js host (Railway, Render, EC2)
\`\`\`

**Why use it:**
- JavaScript everywhere — one language across the entire stack
- MongoDB's flexible schema is good for rapid prototyping
- Huge community, abundant tutorials and packages
- JSON data flows naturally from MongoDB to Express to React

**Why not use it:**
- MongoDB lacks strong relational data guarantees (no foreign keys, no ACID by default)
- JavaScript is loosely typed — without TypeScript, large codebases become hard to maintain
- Express requires manual setup for everything (auth, validation, error handling)
- MongoDB's flexibility becomes a liability at scale — schema chaos

**When to choose:**
- Team knows JavaScript but not SQL
- Building a prototype or MVP quickly
- Data is document-shaped (blog posts, product catalogs, user profiles without complex relations)
- No complex multi-table transactions needed

**When to avoid:**
- Financial applications requiring transactions
- Complex relational data (e-commerce with orders, inventory, users, discounts)
- Team has SQL expertise and is being forced to use MongoDB

---

## PERN Stack

**PostgreSQL + Express + React + Node.js**

\`\`\`
Frontend:  React
Backend:   Node.js + Express
Database:  PostgreSQL
Hosting:   Any Node.js host + PostgreSQL instance
\`\`\`

**Why use it:**
- PostgreSQL is one of the most powerful databases available — ACID transactions, foreign keys, complex queries, full-text search, JSON columns
- JavaScript everywhere (same as MERN)
- Strong data integrity — your data model enforces correctness at the database level
- Drizzle ORM or Prisma make type-safe queries easy

**Why not use it:**
- Express still requires significant manual configuration
- More upfront schema design required (good discipline, but slower start)
- PostgreSQL requires more operational knowledge than MongoDB

**When to choose:**
- Building any application with relational data (users, orders, payments, inventory)
- Team knows JavaScript and wants a reliable database
- You are comfortable writing SQL or using Prisma/Drizzle

**When to avoid:**
- Simple document storage where SQL is overkill
- Team is already expert in another database

---

## T3 Stack

**Next.js + TypeScript + Tailwind + tRPC + Prisma + NextAuth**

\`\`\`
Frontend:  Next.js + React + Tailwind CSS
Backend:   Next.js API Routes + tRPC
Database:  PostgreSQL via Prisma
Auth:      NextAuth.js
Language:  TypeScript end-to-end
\`\`\`

**Why use it:**
- Type safety from database to UI — Prisma generates types from schema, tRPC shares types between server and client
- End-to-end TypeScript eliminates a class of runtime bugs
- Next.js handles routing, SSR, API routes in one framework
- Excellent developer experience — autocomplete everywhere
- Prisma migrations handle schema changes

**Why not use it:**
- tRPC does not work for public APIs consumed by mobile apps or third parties — it is designed for same-team frontends
- Bundle size can be heavy if not careful
- Less flexibility than a custom Express setup
- Overkill for simple CRUD apps where type safety adds overhead without payoff

**When to choose:**
- Building a SaaS product with a React frontend and internal API
- Small team that wants maximum type safety
- Full-stack TypeScript development
- Rapid product development with good DX

**When to avoid:**
- Building a public API consumed by mobile apps
- Team is not comfortable with TypeScript
- You need very fine-grained API design (REST with custom versioning)

---

## Next.js Stack (Vercel Stack)

**Next.js + React + Tailwind + Prisma + PostgreSQL**

\`\`\`
Frontend:  Next.js (App Router) + React + Tailwind
Backend:   Next.js Server Actions or Route Handlers
Database:  PostgreSQL via Prisma (or Neon, Supabase)
Hosting:   Vercel + Neon/Supabase
Auth:      NextAuth.js or Clerk
\`\`\`

**Why use it:**
- Minimal infrastructure — Vercel handles deployment, scaling, CDN automatically
- Server Components reduce client-side JavaScript
- Server Actions let you write backend code in the same file as your component
- Instant global deployment
- Excellent for content-heavy sites with SSR/SSG

**Why not use it:**
- Vendor lock-in to Vercel for optimal experience
- Server Actions are relatively new — patterns are still evolving
- Not ideal for applications requiring long-running processes or WebSockets
- Can get expensive at scale on Vercel

**When to choose:**
- SaaS products, marketing sites, dashboards, content platforms
- Solo developers or small teams who want to ship fast
- Projects where Vercel's deployment simplicity is worth the cost

---

## Django Stack

**Python + Django + PostgreSQL + React/HTMX**

\`\`\`
Frontend:  React or Django Templates + HTMX
Backend:   Python + Django
Database:  PostgreSQL
ORM:       Django ORM (built-in)
Auth:      Django Auth (built-in)
Hosting:   Heroku, Railway, EC2, Render
\`\`\`

**Why use it:**
- Batteries included — admin panel, ORM, auth, forms, email — all built in
- Django admin is a powerful internal tool for free
- Python is excellent for data-heavy applications, ML integrations
- Mature, battle-tested framework (Instagram, Pinterest, Disqus were built on Django)
- Django ORM is simpler than raw SQL for CRUD operations

**Why not use it:**
- Python is slower than Node.js for I/O-heavy workloads
- Two languages if your frontend is React (Python + JavaScript)
- Django's monolithic structure can feel rigid for API-first architectures
- Async support has improved but historically weaker than Node.js

**When to choose:**
- Python team or data science team building a web product
- Application needs ML/AI integration (Python ecosystem is best)
- Need Django admin as an internal tool
- Content management systems, data dashboards

---

## Laravel Stack

**PHP + Laravel + MySQL + Livewire/Vue**

\`\`\`
Frontend:  Livewire, Inertia.js + Vue, or Blade templates
Backend:   PHP + Laravel
Database:  MySQL or PostgreSQL
Hosting:   Forge + DigitalOcean, Shared hosting
\`\`\`

**Why use it:**
- Extremely rapid development — scaffolding, auth, queues, mail all built in
- Eloquent ORM is developer-friendly
- Excellent hosting options including shared hosting (cheapest option)
- Strong in Southeast Asia, Europe for web agencies
- Laravel Livewire enables interactive UIs without writing JavaScript

**Why not use it:**
- PHP has a poor reputation (sometimes unfairly, but it affects hiring)
- Smaller ecosystem for modern tooling compared to JavaScript/Python
- Less common in US tech companies and startups

**When to choose:**
- Existing PHP codebase
- Web agency building client sites quickly
- Team with PHP expertise
- Regions where PHP/Laravel talent is cheaper and more available

---

## Spring Boot Stack

**Java + Spring Boot + PostgreSQL + React/Angular**

\`\`\`
Frontend:  React or Angular
Backend:   Java + Spring Boot
Database:  PostgreSQL, MySQL, Oracle
Hosting:   AWS, GCP, on-premises
\`\`\`

**Why use it:**
- Dominant in enterprise — banks, insurance, healthcare
- Strongly typed, mature ecosystem
- Excellent for microservices architecture
- Spring Security handles complex authorization
- Massive talent pool of Java developers in enterprise

**Why not use it:**
- Verbose — Java requires significantly more code than Node.js or Python
- Slow startup time (though GraalVM native image helps)
- Complex configuration
- Overkill for startups or small teams

**When to choose:**
- Enterprise applications
- Banking, fintech, healthcare
- Team is experienced in Java
- Microservices that need strong type safety and ecosystem

---

## Go Stack

**Go + PostgreSQL + React/HTMX**

\`\`\`
Frontend:  React or HTMX (minimal JS)
Backend:   Go (net/http, Chi, Fiber, or Echo)
Database:  PostgreSQL via pgx or sqlc
Hosting:   Any Docker host, Fly.io, Railway
\`\`\`

**Why use it:**
- Extremely fast — compiled language, excellent performance
- Low memory footprint — cheap to host
- Simple concurrency with goroutines
- Single binary deployment — no runtime dependencies
- Excellent for high-throughput APIs, microservices, CLIs

**Why not use it:**
- Verbose error handling (every function returns an error)
- Smaller ecosystem than JavaScript or Python
- No generics until recently — some patterns are awkward
- Steeper learning curve for developers coming from dynamic languages

**When to choose:**
- High-performance APIs and microservices
- Infrastructure tools and CLIs
- Applications where latency and throughput matter at scale
- Small Docker images and minimal memory usage

---

## Stack Comparison

| Stack | Speed to Ship | Performance | Type Safety | Ecosystem | Enterprise |
|-------|--------------|-------------|-------------|-----------|------------|
| MERN | Fast | Good | Weak | Huge | Rare |
| PERN | Medium | Good | Medium | Huge | Common |
| T3 | Fast | Good | Excellent | Large | Growing |
| Next.js | Very Fast | Good | Strong | Large | Growing |
| Django | Fast | Medium | Medium | Large | Common |
| Laravel | Very Fast | Medium | Medium | Medium | Common |
| Spring Boot | Slow | Good | Excellent | Huge | Dominant |
| Go | Medium | Excellent | Excellent | Medium | Growing |

---

## How to Actually Choose

**Rule 1: Use what your team knows.**
A team that knows Django will ship faster with Django than with Node.js. The best stack is the one your team is already productive in.

**Rule 2: Match the stack to the product type.**

| Product Type | Recommended Stack |
|---|---|
| SaaS product, solo/small team | T3 Stack or Next.js |
| API + mobile app | PERN or Node.js + Express |
| Enterprise software | Spring Boot |
| Data science / ML product | Django |
| High-performance microservice | Go |
| Startup MVP | Whatever your team knows |

**Rule 3: Do not optimize for scale you do not have.**
99% of applications will never have enough traffic to exceed what a single PostgreSQL server can handle. Choose for developer productivity, not theoretical scale.

**Rule 4: Default to TypeScript.**
Whatever stack you choose, use TypeScript. The type errors it catches during development are far less painful than the runtime bugs it prevents.`,
  codeExamples: [
    {
      title: 'T3 Stack — Type-Safe API Call (tRPC)',
      code: `// Server (src/server/api/routers/post.ts)
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';

export const postRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.post.findMany({
      where: { authorId: ctx.session.user.id },
      orderBy: { createdAt: 'desc' },
    });
  }),

  create: protectedProcedure
    .input(z.object({ title: z.string().min(1).max(200), content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.create({
        data: { title: input.title, content: input.content, authorId: ctx.session.user.id },
      });
    }),
});

// Client (src/app/posts/page.tsx) — fully type-safe, no fetch() needed
'use client';
import { api } from '@/trpc/react';

export default function PostsPage() {
  const { data: posts } = api.post.getAll.useQuery();
  const createPost = api.post.create.useMutation();

  return (
    <div>
      {posts?.map(post => <div key={post.id}>{post.title}</div>)}
    </div>
  );
}`,
      explanation:
        'tRPC gives you end-to-end type safety. The client knows exactly what the server returns — no type casting, no runtime surprises. Input validation with Zod runs on the server.',
    },
    {
      title: 'Django — Batteries Included API',
      code: `# models.py
from django.db import models
from django.contrib.auth.models import User

class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

# serializers.py
from rest_framework import serializers
from .models import Post

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'created_at']
        read_only_fields = ['created_at']

# views.py
from rest_framework import viewsets, permissions
from .models import Post
from .serializers import PostSerializer

class PostViewSet(viewsets.ModelViewSet):
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Post.objects.filter(author=self.request.user)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

# urls.py — one line registers all CRUD endpoints
from rest_framework.routers import DefaultRouter
router = DefaultRouter()
router.register('posts', PostViewSet)`,
      explanation:
        'Django REST Framework generates all CRUD endpoints from a ViewSet. The admin panel for this model is automatically available. This is the "batteries included" philosophy.',
    },
  ],
  commonMistakes: [
    'Choosing a stack based on what is trending rather than what fits the team and product',
    'Building a small project with Spring Boot or microservices — massive overhead for simple use cases',
    'Using MongoDB for relational data because "NoSQL is more scalable" — this is a myth and creates schema chaos',
    'Switching stacks mid-project because a new technology became popular',
    'Optimizing for scale at 10M users when you have 100 users — premature optimization',
    'Not using TypeScript — loose typing causes production bugs that are hard to trace',
  ],
  interviewQuestions: [
    {
      question: 'How would you choose a tech stack for a new project?',
      answer:
        'I would ask: what does the team already know, what is the product type, what is the timeline, and what are the scaling requirements? I would default to the team\'s existing expertise because productivity matters more than theoretical stack superiority. For a TypeScript team building a SaaS product, T3 or Next.js stack. For a Python team with ML requirements, Django. For enterprise Java teams, Spring Boot.',
      difficulty: 'intermediate',
    },
    {
      question: 'What is the difference between MERN and PERN and when would you choose each?',
      answer:
        'MERN uses MongoDB (document database) while PERN uses PostgreSQL (relational database). Choose MERN when data is document-shaped, you need schema flexibility, and you do not have complex relational queries. Choose PERN when you have relational data with multiple entities and relationships, need ACID transactions, or are building financial or e-commerce applications where data integrity is critical.',
      difficulty: 'beginner',
    },
    {
      question: 'Why might you choose Go for a backend instead of Node.js?',
      answer:
        'Go has superior performance for CPU-bound and high-concurrency workloads, significantly lower memory usage (important for cost at scale), compiles to a single binary (simple deployment), and has excellent built-in concurrency with goroutines. Choose Go when building high-throughput APIs, infrastructure tools, or services where latency and memory usage matter. Node.js is faster to develop with and has a larger ecosystem, so choose Node.js for most web applications unless performance requirements justify the tradeoff.',
      difficulty: 'intermediate',
    },
  ],
  exercises: [
    {
      id: 'stack-decision',
      title: 'Make the Stack Decision',
      description:
        'For each scenario below, choose a stack and write 2-3 sentences justifying your choice. There is no single right answer — justify your reasoning.',
      starterCode: `// Scenario 1: Social media startup, 3-person team (all know React + Node.js)
// Need to ship MVP in 6 weeks, expect 500 users at launch
// Stack choice:
// Reasoning:

// Scenario 2: Bank building internal loan processing system
// Team of 20 Java developers, compliance requirements, high data integrity needed
// Stack choice:
// Reasoning:

// Scenario 3: Data science company adding a web dashboard to their ML pipeline
// Team knows Python, needs to display real-time model outputs
// Stack choice:
// Reasoning:

// Scenario 4: Microservice handling 50,000 requests/second for an analytics API
// Currently a bottleneck in a larger Node.js system
// Stack choice:
// Reasoning:`,
      solution: `// Scenario 1: Social media startup, 3-person team (React + Node.js)
// Stack choice: T3 Stack (Next.js + tRPC + Prisma + PostgreSQL)
// Reasoning: Team already knows JS/TS. T3 provides type safety end-to-end with minimal
// configuration. Next.js handles routing, SSR, and API. PostgreSQL handles relational
// data (users, posts, follows, likes). Ship fast without sacrificing maintainability.

// Scenario 2: Bank internal loan processing system
// Stack choice: Spring Boot + PostgreSQL + React frontend
// Reasoning: 20 Java devs are already productive in Java. Spring Security handles
// complex authorization requirements. PostgreSQL with ACID transactions ensures
// financial data integrity. Enterprise ecosystem (logging, monitoring, compliance tools)
// is mature in Java.

// Scenario 3: Data science company adding web dashboard
// Stack choice: Django + PostgreSQL + React or HTMX
// Reasoning: Team knows Python — no new language to learn. Django REST Framework
// exposes ML model outputs as an API. Can import numpy/pandas/scikit-learn directly
// in Django views. Django admin provides instant internal tooling for data management.

// Scenario 4: Microservice at 50,000 req/sec
// Stack choice: Go (net/http or Fiber) + PostgreSQL via pgx
// Reasoning: Go's goroutine model handles massive concurrency with minimal memory.
// Lower latency than Node.js for CPU-bound operations. Single binary deployment
// simplifies container image. The switch is justified by the specific performance
// bottleneck — do not rewrite everything, just this service.`,
      hints: [
        'Team expertise always comes before technology preferences',
        'Consider the cost of learning a new stack vs. the benefits it provides',
        'For most startups, shipping fast beats choosing the "perfect" stack',
      ],
    },
  ],
  keyTakeaways: [
    'The best stack is the one your team already knows — familiarity beats theoretical superiority',
    'MERN is good for document data; PERN is better for relational data requiring integrity',
    'T3 Stack and Next.js offer the fastest path to a type-safe full-stack product for JS teams',
    'Django is the best choice when Python expertise exists or ML integration is needed',
    'Go is for high-performance microservices where latency and memory usage are critical',
    'Spring Boot dominates enterprise because of mature Java ecosystems and strong typing',
    'Do not optimize for 10M users when you have 100 — choose for productivity, not theoretical scale',
  ],
  nextLesson: 'project-planning',
  prevLesson: 'how-modern-web-apps-work',
};
