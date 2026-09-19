import type { Lesson } from '@/types';

export const guidedProjectsLesson: Lesson = {
  id: 'guided-projects',
  slug: 'guided-projects',
  title: 'Guided Full Stack Projects',
  description:
    'Build 9 real projects from portfolio to AI SaaS — with architecture, database design, and deployment plans for each. Projects increase in complexity.',
  category: 'Projects',
  order: 19,
  difficulty: 'intermediate',
  estimatedTime: 40,
  content: `Projects are how you solidify knowledge. Reading about authentication is not the same as building it. This module gives you 9 projects to build, each teaching specific skills and increasing in complexity.

For each project: plan before coding, design the schema before the API, define the API before the frontend.

---

## Project 1: Personal Portfolio

**What you learn:** Deployment, SEO, performance, professional presentation.

**Architecture:**
\`\`\`
Stack: Next.js + Tailwind CSS + MDX for blog posts
Host: Vercel (free)
No database — static content

Pages:
  / → Home (about, skills, featured projects)
  /projects → All projects
  /projects/[slug] → Project detail
  /blog → All posts (MDX)
  /blog/[slug] → Post (MDX)
\`\`\`

**Key technical requirements:**
- SSG for all pages (fastest possible load)
- Core Web Vitals: LCP < 2.5s, CLS < 0.1
- SEO: meta tags, Open Graph, structured data
- Dark mode
- Resume PDF download

**What makes it stand out:**
- Fast (test with Lighthouse, target 95+ performance score)
- Professional design (use a minimal, clean design system)
- Real project descriptions with GitHub links and live demos
- Regular blog posts (even 1 per month)

---

## Project 2: Blog Platform

**What you learn:** CMS, rich text editing, content management, comments.

**Architecture:**
\`\`\`
Stack: Next.js + PostgreSQL (Neon) + Tailwind + shadcn/ui
Auth: NextAuth.js (email/password)
Editor: Tiptap (rich text)
Deployment: Vercel + Neon

Database:
  users: id, email, password_hash, name, role, created_at
  posts: id, author_id, title, slug, content, excerpt, cover_image, published, created_at
  tags: id, name, slug
  post_tags: post_id, tag_id
  comments: id, post_id, author_id, content, parent_id (replies), created_at
\`\`\`

**Core features:**
- Write and publish posts with rich text editor
- Tag system for categorization
- Comments with nested replies
- Public feed and individual post pages
- Basic admin (approve comments, manage posts)

**Learning focus:**
- Slug generation for SEO-friendly URLs
- Rich text storage (store as JSON/HTML, render safely)
- Nested comments (self-referential database relation)
- Image upload for cover images (S3 + Cloudflare R2)

---

## Project 3: Authentication System

**What you learn:** Full auth from scratch — JWT, sessions, OAuth, RBAC.

**Architecture:**
\`\`\`
Stack: Node.js + Express + PostgreSQL + React
Build auth completely from scratch (no NextAuth, no Clerk)
This is a learning project — use libraries in real projects

Database:
  users: id, email, password_hash, name, role, email_verified_at
  refresh_tokens: id, user_id, token_hash, expires_at, revoked_at
  password_resets: id, user_id, token_hash, expires_at, used_at
  email_verifications: id, user_id, token_hash, expires_at
  oauth_accounts: id, user_id, provider, provider_user_id
\`\`\`

**Features to implement:**
- Email/password signup and login with bcrypt
- JWT access token (15 min) + refresh token (30 days)
- Email verification on signup
- Forgot password with email reset link
- Google OAuth
- RBAC: user, moderator, admin roles

**Learning focus:**
- Token rotation: refresh tokens invalidated on use (new token issued)
- Security: rate limiting on login, generic error messages
- This teaches you what libraries like NextAuth do internally

---

## Project 4: Learning Platform (like this one)

**What you learn:** Complex content structure, user progress, challenges.

**Architecture:**
\`\`\`
Stack: Next.js + PostgreSQL + Prisma + Tailwind
Auth: Clerk
Code execution: Monaco Editor (display only) or sandboxed runner

Database:
  tracks: id, slug, title, description, order
  lessons: id, track_id, slug, title, content, order
  challenges: id, track_id, title, starter_code, solution, difficulty
  user_progress: user_id, lesson_id, completed_at (PRIMARY KEY)
  challenge_attempts: id, user_id, challenge_id, code, passed, created_at
\`\`\`

**Features:**
- Multiple learning tracks
- Lesson pages with markdown rendering
- Code challenge editor
- Progress tracking per track
- Interview questions section
- Search across lessons and challenges

**Learning focus:**
- Content management at scale
- Progress state management
- Full-text search with PostgreSQL

---

## Project 5: E-Commerce Platform

**What you learn:** Payments, inventory, order management, complex data model.

**Architecture:**
\`\`\`
Stack: Next.js + PostgreSQL + Prisma + Tailwind
Payments: Stripe (Checkout + Webhooks)
Images: Cloudflare R2 + CDN
Email: Resend

Database:
  users, products, product_images, categories
  carts, cart_items
  orders, order_items (price_at_purchase field!)
  addresses
  stripe_events (idempotency for webhooks)
\`\`\`

**Features:**
- Product catalog with categories and search
- Shopping cart (persisted in DB for logged-in, localStorage for guest)
- Stripe Checkout for payments
- Stripe webhooks for order fulfillment
- Order history and status tracking
- Admin: add products, view orders, update order status
- Email: order confirmation, shipping update

**Learning focus:**
- Stripe webhooks: idempotent processing (same event delivered twice = no duplicate)
- price_at_purchase: snapshotting price at order time
- Guest cart to account cart migration on login

---

## Project 6: Social Media Platform

**What you learn:** Real-time features, feeds, following system, notifications.

**Architecture:**
\`\`\`
Stack: Next.js + PostgreSQL + Redis + WebSockets
Cache: Redis (feed cache, notification delivery)
Real-time: Socket.io or native WebSocket

Database:
  users, posts, comments, likes
  follows: follower_id, following_id
  notifications: recipient_id, type, actor_id, entity_id, read_at
  hashtags, post_hashtags

Feed algorithm:
  Fan-out on write (fanout): when user posts, insert into all followers' feed tables
  Fan-out on read: when user opens feed, query posts from followed users
\`\`\`

**Features:**
- Post (text, image), like, comment, reply
- Follow system
- Real-time notifications via WebSocket
- Hashtag discovery
- User search
- Feed (following only, or global)

**Learning focus:**
- Feed architecture: fan-out on write vs read tradeoffs
- Denormalized counters (like_count on post vs COUNT JOIN)
- WebSocket connection management

---

## Project 7: SaaS Dashboard

**What you learn:** Multi-tenancy, subscription billing, analytics, role management.

**Architecture:**
\`\`\`
Stack: Next.js + PostgreSQL + Prisma
Auth: Clerk (with organizations)
Billing: Stripe (subscriptions + billing portal)
Charts: Recharts or Chart.js

Database:
  organizations: id, name, stripe_customer_id, plan
  memberships: org_id, user_id, role
  (tenant-scoped data: every table has org_id)
  subscriptions: org_id, stripe_subscription_id, status, plan
  audit_logs: org_id, user_id, action, resource, created_at
\`\`\`

**Features:**
- Organization creation
- Invite team members (email → accept → become member)
- Role management (admin, member, viewer)
- Subscription management (Stripe billing portal)
- Audit log (who did what, when)
- Usage analytics

**Learning focus:**
- Multi-tenancy: every query must scope to the current organization
- Stripe subscription webhooks (payment failed, subscription canceled)
- Row-level security (every query has AND org_id = $orgId)

---

## Project 8: Project Management Tool (Trello/Linear clone)

**What you learn:** Drag-and-drop, real-time collaboration, complex state.

**Architecture:**
\`\`\`
Stack: Next.js + PostgreSQL + WebSocket (real-time)
DnD: @dnd-kit (drag and drop)
Real-time: Socket.io

Database:
  workspaces, boards, columns, cards
  column_order: jsonb array of column IDs (position via order field)
  card_assignments, labels, comments, attachments
  activities: who did what to which card (audit trail)
\`\`\`

**Features:**
- Boards with columns (To Do, In Progress, Done)
- Drag cards between columns
- Card details (description, assignees, labels, due date, attachments)
- Real-time: see others' cursors and changes live
- Comments on cards
- Activity log per card and board

**Learning focus:**
- Optimistic UI: update the state immediately, then sync with server
- Collaborative real-time: how to handle conflicts when two users edit the same card
- Drag-and-drop: position tracking (float-based or lexicographic ordering)

---

## Project 9: AI SaaS Product

**What you learn:** AI integration, token management, streaming, API rate limits, usage billing.

**Architecture:**
\`\`\`
Stack: Next.js + PostgreSQL + Redis
AI: Anthropic Claude API (or OpenAI)
Billing: Stripe (usage-based)
Queue: BullMQ (for async AI tasks)

Database:
  users, organizations, subscriptions
  ai_conversations: id, user_id, model, system_prompt
  ai_messages: conversation_id, role, content, tokens_used
  usage: user_id, month, tokens_used, credits_remaining
\`\`\`

**Example product ideas:**
- AI writing assistant (blog posts, emails)
- AI code reviewer
- AI document summarizer
- AI customer support chatbot builder
- AI-powered resume analyzer

**Features:**
- Streaming AI responses (Server-Sent Events or streaming API)
- Token counting and usage limits per plan
- Conversation history
- Model selection
- Usage dashboard (how many tokens used this month)

**Learning focus:**
- Streaming responses: show AI text as it generates (not wait for complete response)
- Token counting: charge users by usage
- Rate limiting AI requests: per user, per minute

\`\`\`typescript
// Streaming AI response in Next.js
// app/api/chat/route.ts
import Anthropic from '@anthropic-ai/sdk';

export async function POST(req: Request) {
  const { messages } = await req.json();
  const client = new Anthropic();

  const stream = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages,
    stream: true,
  });

  // Return a ReadableStream that the client can consume in real-time
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta') {
          controller.enqueue(
            new TextEncoder().encode(
              \`data: \${JSON.stringify({ text: chunk.delta.text })}\\n\\n\`
            )
          );
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    },
  });
}
\`\`\`

---

## How to Build These Projects

**For every project:**

1. **Plan first** (1 day)
   - Write the feature list
   - Draw the ER diagram
   - List the API endpoints

2. **Set up infrastructure** (1 day)
   - Create repo
   - Set up Next.js + TypeScript + Tailwind
   - Set up PostgreSQL + Prisma
   - Set up CI/CD (GitHub Actions → Vercel/Railway)

3. **Build core features** (5-10 days)
   - Authentication
   - Main CRUD operations
   - Core UI

4. **Polish and deploy** (2-3 days)
   - Error handling
   - Loading states
   - Mobile responsiveness
   - Deploy to production

5. **Document** (1 day)
   - Update README with: what it is, tech stack, how to run locally, screenshots

**Push to GitHub and add to your portfolio.** Every completed project is evidence.`,
  codeExamples: [
    {
      title: 'Project Setup Template',
      code: `# Every project starts the same way

# 1. Create Next.js app with T3 Stack
pnpm create t3-app@latest my-project
# Choose: TypeScript, Tailwind, tRPC, Prisma, NextAuth

# OR minimal setup:
npx create-next-app@latest my-project --typescript --tailwind --app

# 2. Install common dependencies
pnpm add @prisma/client prisma zod
pnpm add -D @types/node

# 3. Initialize Prisma
npx prisma init --datasource-provider postgresql

# 4. Add shadcn/ui
npx shadcn-ui@latest init
npx shadcn-ui@latest add button input card dialog

# 5. Set up environment variables
cp .env.example .env
# Edit .env with actual values

# 6. Initialize git
git init
git add .
git commit -m "chore: initial setup"

# 7. Create GitHub repo and push
gh repo create my-project --public
git push -u origin main

# 8. Deploy immediately (don't wait until done)
# Vercel: connect GitHub repo in Vercel dashboard
# Set environment variables in Vercel dashboard
# Every push to main auto-deploys

# NOW BUILD THE PROJECT
# Start with auth → core CRUD → UI → polish`,
      explanation:
        'Setting up CI/CD before writing any features means every commit you make is deployed automatically. You get a production URL from day one.',
    },
  ],
  commonMistakes: [
    'Abandoning projects when they get complex — a half-finished project teaches nothing and shows nothing',
    'Building without deploying — a project only on your laptop does not exist to employers',
    'Skipping the planning phase — starting to code without an ER diagram leads to schema rewrites',
    'Building only CRUD projects — add something interesting: real-time, payments, file upload, AI',
    'Not writing README files — employers cannot evaluate a project with no description',
    'Building 10 projects at 20% completion instead of 3 projects at 100%',
  ],
  interviewQuestions: [
    {
      question: 'Walk me through the architecture of a project you have built.',
      answer:
        'Be specific: "I built an e-commerce platform using Next.js for the frontend with App Router and React Server Components, Node.js Express for the API, and PostgreSQL for the database. The interesting design decision was the order_items table stores price_at_purchase because product prices change over time — orders must reflect what the customer actually paid. I used Stripe webhooks for order fulfillment, which required idempotent processing since webhooks can be delivered multiple times."',
      difficulty: 'intermediate',
    },
    {
      question: 'What was the hardest technical problem you solved in a project?',
      answer:
        'Have a specific story ready: "In my social media project, I had to implement an activity feed. The naive approach (query all posts from followed users) was too slow at scale. I implemented a fan-out on write system where posting inserts a record into each follower\'s feed table. This adds write overhead but makes feed reads instant. I also added a Redis cache for the most recent feed items."',
      difficulty: 'intermediate',
    },
  ],
  exercises: [
    {
      id: 'plan-your-next-project',
      title: 'Plan Your Next Project',
      description:
        'Choose one project from this list (Blog Platform, E-Commerce, Social Media, or SaaS Dashboard). Write: the feature list, ER diagram (in comments), API endpoints, and your timeline in weeks.',
      starterCode: `// Project: [Your Choice]
//
// FEATURES (be specific):
// Core (must have for launch):
//   1.
//   2.
//
// v2 (after launch):
//   1.
//
// ER DIAGRAM (in comments):
// Entity1 ─── relationship ─── Entity2
//
// DATABASE SCHEMA (top 3 tables):
// CREATE TABLE ...
//
// API ENDPOINTS (top 5):
// GET ...
// POST ...
//
// TIMELINE:
// Week 1:
// Week 2:
// Week 3:
// Week 4 (launch):`,
      solution: `// Project: Blog Platform
//
// FEATURES:
// Core (must have for launch):
//   1. User signup and login (email/password)
//   2. Write and publish posts (rich text with Tiptap)
//   3. Public post listing page
//   4. Individual post page with SEO meta tags
//   5. Tag system for categorization
//   6. Comment on posts (requires login)
//
// v2 (after launch):
//   1. Email newsletter (subscribe → receive new post emails)
//   2. Post analytics (views, likes)
//   3. Post scheduling (publish at a future date)
//   4. Custom domain support
//
// ER DIAGRAM:
// User 1:n Post (user writes many posts)
// Post n:m Tag via post_tags (junction table)
// Post 1:n Comment
// Comment 0..1:n Comment via parent_id (threaded replies)
//
// DATABASE SCHEMA:
// CREATE TABLE users (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   email VARCHAR UNIQUE NOT NULL,
//   password_hash VARCHAR NOT NULL,
//   name VARCHAR NOT NULL,
//   bio TEXT,
//   avatar_url TEXT,
//   created_at TIMESTAMPTZ DEFAULT NOW()
// );
//
// CREATE TABLE posts (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   author_id UUID REFERENCES users(id) ON DELETE CASCADE,
//   title VARCHAR(200) NOT NULL,
//   slug VARCHAR UNIQUE NOT NULL,
//   content TEXT NOT NULL,
//   excerpt TEXT,
//   published BOOLEAN DEFAULT false,
//   published_at TIMESTAMPTZ,
//   created_at TIMESTAMPTZ DEFAULT NOW()
// );
//
// CREATE TABLE comments (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
//   author_id UUID REFERENCES users(id),
//   parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
//   content TEXT NOT NULL,
//   created_at TIMESTAMPTZ DEFAULT NOW()
// );
//
// API ENDPOINTS:
// GET  /api/posts?page=1&tag=tech    → list published posts
// GET  /api/posts/:slug              → single post with comments
// POST /api/posts                    → create post (auth)
// PATCH /api/posts/:id               → update post (auth, owner)
// POST /api/posts/:id/comments       → add comment (auth)
//
// TIMELINE:
// Week 1: Setup + auth (signup, login, profile page)
// Week 2: Post creation (Tiptap editor, publish/draft, slug generation)
// Week 3: Public pages (listing, individual post, SEO meta tags)
// Week 4 (launch): Comments, tags, deploy, README`,
      hints: [
        'The planning is the deliverable — do not skip to code',
        'Every feature implies database tables and API endpoints — think through the chain',
        'Timeline: assume things take longer than you expect',
      ],
    },
  ],
  keyTakeaways: [
    'Build complete projects, not just tutorials — completion is what teaches you',
    'Deploy every project from day one — a project not deployed does not demonstrate real skills',
    'Plan before coding: feature list → ER diagram → API design → code',
    'Each project should teach something new: payments, real-time, AI, multi-tenancy',
    'Three complete projects beat ten half-finished ones',
    'Write a README for every project — employers evaluate based on what they can read',
    'The AI SaaS project is the highest-value portfolio project for 2024-2025 job searches',
  ],
  nextLesson: 'industry-engineering-practices',
  prevLesson: 'interview-preparation',
};
