import type { Lesson } from '@/types';

export const projectPlanningLesson: Lesson = {
  id: 'project-planning',
  slug: 'project-planning',
  title: 'Project Planning',
  description:
    'Learn how real products are planned — requirements gathering, user stories, MVP scoping, roadmaps, and milestones. The skill that separates engineers who build features from engineers who build products.',
  category: 'Product Development',
  order: 4,
  difficulty: 'intermediate',
  estimatedTime: 25,
  content: `Most developers learn to code first and think about what they are building second. In real product development, the order is reversed.

Planning is not about writing documents. It is about making decisions before writing code so that the code you write solves the right problem.

---

## Requirements Gathering

Requirements are the answer to: **what does this product need to do?**

They come from multiple sources:
- Customers / users (what problems do they have?)
- Business (what does the company need to make money or achieve goals?)
- Technical constraints (what is technically feasible in the given time?)
- Competitors (what do users already expect?)

**Two types of requirements:**

| Functional Requirements | Non-Functional Requirements |
|------------------------|----------------------------|
| What the system does | How the system performs |
| "User can log in" | "Login must complete in under 2 seconds" |
| "User can upload a profile photo" | "Photos must be compressed to under 1MB" |
| "Admin can ban users" | "System must handle 10,000 concurrent users" |

**How to gather requirements:**

1. **User interviews** — talk to actual or potential users, not just stakeholders
2. **Competitor analysis** — what do similar products do?
3. **Usage analytics** — if the product exists, where do users spend time?
4. **Stakeholder meetings** — what does the business need?
5. **Document everything** — written requirements prevent "I thought you said..." arguments

**Common mistake:** Confusing solutions for requirements.

Bad: "We need a dashboard with graphs."
Good: "Users need to understand how their business is performing at a glance."

The first is a solution. The second is a requirement. The second allows better solutions.

---

## User Stories

A user story is a short description of a feature from the user's perspective.

**Format:**
\`\`\`
As a [type of user],
I want to [do something],
So that [I achieve some benefit].
\`\`\`

**Examples:**

\`\`\`
As a registered user,
I want to reset my password via email,
So that I can regain access if I forget my password.

As an e-commerce customer,
I want to save items to a wishlist,
So that I can buy them later without searching again.

As a team admin,
I want to invite members via email,
So that my team can access the workspace without me manually creating accounts.
\`\`\`

**Acceptance criteria** define when a story is done:

\`\`\`
Story: Password Reset

Acceptance Criteria:
- User enters email on reset page
- If email exists: user receives email within 2 minutes with reset link
- Link expires after 1 hour
- Link can only be used once
- If email does not exist: show generic message (do not reveal if email is registered)
- After successful reset, user is redirected to login
- Old password no longer works after reset
\`\`\`

Acceptance criteria eliminate ambiguity. A developer who reads them knows exactly when they are done.

---

## Feature Planning

Not all features are equal. Features must be prioritized.

**The MoSCoW Method:**

| Priority | Meaning | Example |
|----------|---------|---------|
| Must Have | Core functionality without which the product does not work | User login, product listing |
| Should Have | Important but not critical for launch | Email notifications, search filters |
| Could Have | Nice to have, low impact if omitted | Dark mode, keyboard shortcuts |
| Won't Have | Out of scope for now | Mobile app, AI recommendations |

**The ICE Scoring framework:**

Each feature gets a score for:
- **Impact** (1-10): How much does this move the needle?
- **Confidence** (1-10): How sure are we this will work?
- **Ease** (1-10): How easy is it to build?

ICE Score = (Impact × Confidence × Ease) / 3

Features with higher ICE scores ship first.

**Example: E-commerce MVP**

| Feature | Impact | Confidence | Ease | ICE Score |
|---------|--------|-----------|------|-----------|
| Product listing | 10 | 10 | 8 | 9.3 |
| Shopping cart | 10 | 10 | 7 | 9.0 |
| Checkout + payment | 10 | 9 | 5 | 8.0 |
| Wishlist | 5 | 7 | 8 | 6.7 |
| Product reviews | 6 | 6 | 6 | 6.0 |
| Recommendation engine | 7 | 4 | 2 | 4.3 |

Ship the top three first. Wishlist can come later. Reviews after that. AI recommendations much later.

---

## MVP — Minimum Viable Product

An MVP is the smallest version of a product that delivers value to users and allows you to learn.

**What MVP is NOT:**
- A buggy half-built product
- A prototype you throw away
- The full product minus some features

**What MVP IS:**
- A complete, working product
- With the minimum features needed to solve the core problem
- Built to learn whether the product should exist at all

**The famous example:**

If you are building a car, the MVP is not a chassis, then a chassis with wheels, then a chassis with a body.

The MVP is a skateboard — it solves the core problem (getting from A to B) and lets you learn if users even want transportation.

\`\`\`
WRONG MVP progression:
Chassis → Car with no engine → Car with engine → Full car

RIGHT MVP progression:
Skateboard → Scooter → Bicycle → Motorcycle → Car
     ↑
Each step is complete, usable, and teaches you something
\`\`\`

**MVP for a Blog Platform:**

Full vision:
- Custom domains
- Email newsletters
- Subscriber management
- Analytics dashboard
- Monetization
- SEO tools
- Custom themes
- Comment system
- Social sharing

MVP:
- Create and edit posts (markdown)
- Publish/unpublish
- Share via URL
- Public profile page

That is it. Ship that first. Validate that anyone actually wants to publish on your platform. Then add features based on what users ask for.

---

## Scope Definition

Scope creep is the silent killer of projects. It is when features get added mid-development without adjusting the timeline.

**Preventing scope creep:**

1. Write down what is in scope and what is not before starting
2. When someone asks for a new feature, ask: "Does this belong in v1 or v2?"
3. Every addition to scope must either extend the deadline or remove another feature

**Scope document template:**

\`\`\`
## Project: [Name]
## Version: 1.0
## Deadline: [Date]

### In Scope
- User registration and login
- Post creation and editing
- Basic search
- Public profiles

### Out of Scope (v2)
- Social features (follow, like)
- Advanced analytics
- Mobile app
- API for third parties

### Explicitly Deferred (not in v2 either)
- AI content suggestions
- Custom domains
\`\`\`

---

## Roadmaps

A roadmap is the high-level plan for where the product is going over the next 3-12 months.

**Good roadmaps:**
- Communicate direction, not exact delivery dates
- Are outcome-oriented ("users can discover content") not feature-oriented ("add explore page")
- Are updated regularly as priorities change
- Distinguish between "committed" (this quarter) and "aspirational" (next year)

**Example roadmap:**

\`\`\`
Q1: Core Platform
  - Authentication system
  - Post creation and editing
  - Basic user profiles
  - Public feed

Q2: Discovery
  - Search
  - Tags and categories
  - Trending content

Q3: Social
  - Following system
  - Notifications
  - Comments

Q4: Monetization
  - Paid subscriptions
  - Creator payouts
  - Analytics for creators
\`\`\`

---

## Milestones

Milestones are checkpoints that mark meaningful progress.

**Good milestones:**
- Specific and measurable
- Tied to a deliverable, not a date
- Small enough to hit every 1-2 weeks

**Example milestones for an e-commerce MVP:**

\`\`\`
Milestone 1 (Week 2):
  Database schema finalized and migrated
  User auth working (register, login, logout)

Milestone 2 (Week 4):
  Product listing page loads with real data
  Product detail page working
  Cart add/remove working in state

Milestone 3 (Week 6):
  Cart persists across sessions
  Checkout flow working end-to-end
  Stripe payment integration complete

Milestone 4 (Week 8):
  Order confirmation email sent
  Order history page
  Admin: view and update orders

Milestone 5 (Week 10):
  QA complete
  Performance tested
  Deployed to production
  Monitoring configured
\`\`\`

---

## Real Example: Planning a Learning Platform

Imagine you are building a coding learning platform (like the one you are using now).

**Requirements gathering:**
- Users need to learn programming
- They need to track progress
- They need to practice, not just read
- They need interview preparation

**User stories:**
\`\`\`
As a student, I want to read lessons so I can learn concepts.
As a student, I want to solve coding challenges so I can practice.
As a student, I want to track which lessons I completed so I know my progress.
As a student, I want to see interview questions so I can prepare for jobs.
\`\`\`

**MVP scope:**
- JavaScript track with 10 lessons
- Basic challenge interface with code editor
- Progress tracking (localStorage for now)
- Interview questions section

**What is NOT in MVP:**
- Multiple tracks (v2)
- User accounts and cloud sync (v2)
- AI code review (v3)
- Mobile app (v3)

**Milestones:**
\`\`\`
Week 1: Core layout, routing, lesson rendering
Week 2: First 10 lessons written and rendering
Week 3: Challenge interface with code editor working
Week 4: Progress tracking, interview questions, polish
Week 5: QA, performance, deploy
\`\`\`

This is how you go from an idea to a shipped product.`,
  codeExamples: [
    {
      title: 'User Story to Database Schema',
      code: `// User story: "As a user, I want to track which lessons I completed"

// Step 1: Identify the entities
// - User (who tracks)
// - Lesson (what they track)
// - Progress (the tracking record)

// Step 2: Define relationships
// - A user has many progress records
// - A lesson has many progress records
// - A progress record belongs to one user and one lesson

// Step 3: Create the schema
-- users table (probably already exists)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- lessons table
CREATE TABLE lessons (
  id SERIAL PRIMARY KEY,
  track_id VARCHAR NOT NULL,  -- 'javascript', 'react', etc.
  slug VARCHAR NOT NULL,
  title VARCHAR NOT NULL,
  order_index INTEGER NOT NULL
);

-- progress table (the core of this user story)
CREATE TABLE user_progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
  completed_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)  -- can't complete the same lesson twice
);

-- Query: Get all completed lessons for a user in a track
SELECT l.slug, l.title, up.completed_at
FROM lessons l
JOIN user_progress up ON l.id = up.lesson_id
WHERE up.user_id = $1
  AND l.track_id = $2
ORDER BY l.order_index;`,
      explanation:
        'A single user story (track lesson completion) translates directly into a database schema. The unique constraint prevents duplicate completion records. The join query retrieves progress in one efficient query.',
    },
  ],
  commonMistakes: [
    'Starting to code before defining what done looks like — you will build the wrong thing',
    'Confusing requirements (what users need) with solutions (how to build it)',
    'Building everything in v1 — scope creep kills projects and morale',
    'Writing user stories without acceptance criteria — leaves too much room for misinterpretation',
    'Treating roadmaps as commitments rather than direction — they should be updated as you learn',
    'Not writing down what is out of scope — this prevents "can we just add..." conversations',
  ],
  interviewQuestions: [
    {
      question: 'What is an MVP and how do you decide what goes in it?',
      answer:
        'An MVP (Minimum Viable Product) is the smallest complete product that delivers value and enables learning. To decide what goes in it, identify the core problem the product solves, then ask: "What is the absolute minimum needed to solve that problem?" Use MoSCoW prioritization — only Must Haves go in v1. Everything else is v2 or later. The goal is to ship, get real user feedback, and learn before building more.',
      difficulty: 'intermediate',
    },
    {
      question: 'What is scope creep and how do you prevent it?',
      answer:
        'Scope creep is the gradual expansion of project requirements after work has started, usually without adjusting the timeline. Prevent it by: defining scope in writing before starting (what is in, what is out), requiring that any new feature either extends the deadline or removes another feature, and maintaining a "v2 backlog" where requests go instead of the current sprint.',
      difficulty: 'intermediate',
    },
    {
      question: 'How do you write a user story?',
      answer:
        'A user story follows: "As a [user type], I want to [action], so that [benefit]." The story must also have acceptance criteria — specific, measurable conditions that define when the story is complete. Acceptance criteria eliminate ambiguity and prevent "I thought it was done" disagreements. A story without acceptance criteria is just a wish.',
      difficulty: 'beginner',
    },
  ],
  exercises: [
    {
      id: 'plan-your-project',
      title: 'Write a Mini Project Plan',
      description:
        'Choose one of these projects: a task manager, a recipe sharing site, or a job application tracker. Write user stories (at least 5), define the MVP scope, and create 4 milestones.',
      starterCode: `// Project: [Your Choice]
//
// USER STORIES (at least 5):
// 1. As a _____, I want to _____, so that _____.
//    Acceptance criteria:
//    -
//    -
//
// 2. ...
//
// MVP SCOPE:
// In scope:
//   -
// Out of scope (v2):
//   -
//
// MILESTONES:
// Milestone 1 (Week _):
//   -
// Milestone 2 (Week _):
//   -
// Milestone 3 (Week _):
//   -
// Milestone 4 (Week _):
//   -`,
      solution: `// Project: Job Application Tracker
//
// USER STORIES:
// 1. As a job seeker, I want to add a job application, so that I can track where I applied.
//    Acceptance criteria:
//    - Form with: company name, role, application date, link to job posting
//    - Status defaults to "Applied"
//    - Application appears in list immediately after save
//
// 2. As a job seeker, I want to update application status, so that I know where each application stands.
//    Acceptance criteria:
//    - Statuses: Applied, Phone Screen, Interview, Offer, Rejected, Withdrawn
//    - Status change is saved and reflected immediately
//    - Status change date is recorded
//
// 3. As a job seeker, I want to see all applications at a glance, so that I can prioritize follow-ups.
//    Acceptance criteria:
//    - Table view with columns: Company, Role, Status, Date Applied
//    - Sortable by date and status
//    - Color coding by status (green=offer, red=rejected, yellow=in progress)
//
// 4. As a job seeker, I want to add notes to each application, so that I can remember interview details.
//    Acceptance criteria:
//    - Free text notes field on each application detail page
//    - Notes are auto-saved every 30 seconds
//
// 5. As a job seeker, I want to see summary stats, so that I can understand my job search progress.
//    Acceptance criteria:
//    - Total applications count
//    - Response rate (applications that got past "Applied")
//    - Applications this week / this month
//
// MVP SCOPE:
// In scope:
//   - Add/edit/delete applications
//   - Status tracking
//   - Basic list view with sorting
//   - Notes field
// Out of scope (v2):
//   - Email reminders for follow-ups
//   - Resume version tracking
//   - Calendar integration
//   - Export to CSV
//   - Team/shared tracking
//
// MILESTONES:
// Milestone 1 (Week 1):
//   - Database schema designed and migrated
//   - User auth working
//   - Add application form working (saves to DB)
//
// Milestone 2 (Week 2):
//   - Application list page with real data
//   - Status update working
//   - Edit and delete working
//
// Milestone 3 (Week 3):
//   - Notes feature complete
//   - Summary stats working
//   - Sorting and filtering
//
// Milestone 4 (Week 4):
//   - QA complete, bugs fixed
//   - Deployed to production
//   - Monitoring set up`,
      hints: [
        'Start with the most important action a user takes — the core workflow',
        'Acceptance criteria should be specific enough that a different developer could implement them correctly',
        'Milestone 1 should always include the foundation: schema + auth',
      ],
    },
  ],
  keyTakeaways: [
    'Requirements describe what users need, not how to build it — separate these clearly',
    'User stories (As a / I want / So that) with acceptance criteria prevent ambiguity',
    'An MVP is the smallest complete product that delivers value — not a prototype, not half a product',
    'MoSCoW prioritization: Must Have ships first, everything else is v2',
    'Scope must be written down — verbal agreements about what is in/out lead to misunderstandings',
    'Milestones mark meaningful progress (working feature, not passing time) and should be hit every 1-2 weeks',
  ],
  nextLesson: 'ui-ux-for-developers',
  prevLesson: 'choosing-a-tech-stack',
};
