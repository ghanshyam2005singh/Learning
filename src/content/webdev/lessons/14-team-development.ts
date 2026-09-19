import type { Lesson } from '@/types';

export const teamDevelopmentLesson: Lesson = {
  id: 'team-development',
  slug: 'team-development',
  title: 'Team Development',
  description:
    'Git workflow, branching strategies, pull requests, code reviews, Agile and Scrum practices, documentation, and collaboration skills for working in engineering teams.',
  category: 'Professional Skills',
  order: 14,
  difficulty: 'intermediate',
  estimatedTime: 25,
  content: `The skills that make you a great solo developer do not automatically make you a great team developer. Working in a team requires additional practices — not because individuals are untrustworthy, but because coordinating multiple people writing the same codebase requires structure.

---

## Git Workflow

**Feature Branch Workflow (most common):**
\`\`\`
main (production)
  └── develop (integration)
        ├── feature/user-authentication
        ├── feature/payment-integration
        ├── fix/login-redirect-bug
        └── chore/update-dependencies
\`\`\`

**Rules:**
- \`main\` is always deployable — it represents production
- No one commits directly to \`main\`
- Every feature and fix lives on its own branch
- Branches merge to \`main\` (or \`develop\`) via pull requests
- Branches are deleted after merging

**Branch naming:**
\`\`\`bash
feature/  → new functionality
fix/      → bug fixes
chore/    → maintenance (deps, config)
docs/     → documentation
refactor/ → code improvement without feature change
test/     → adding or fixing tests

Examples:
  feature/oauth-social-login
  fix/cart-total-calculation
  chore/upgrade-next-js-14
  refactor/extract-payment-service
\`\`\`

**Git Flow (for projects with formal releases):**
\`\`\`
main         → production code
develop      → integration branch
feature/*    → new features (branch off develop)
release/*    → release preparation (branch off develop)
hotfix/*     → urgent production fixes (branch off main)
\`\`\`

---

## Commit Messages

Good commit messages help teammates (and future you) understand why a change was made.

**Format (Conventional Commits):**
\`\`\`
<type>(<scope>): <description>

<body> (optional)

<footer> (optional)
\`\`\`

**Types:**
\`\`\`
feat:     new feature
fix:      bug fix
docs:     documentation only
style:    formatting (no logic change)
refactor: code change that's neither a bug fix nor feature
test:     adding or fixing tests
chore:    build process, deps, config
perf:     performance improvement
\`\`\`

**Examples:**
\`\`\`
feat(auth): add Google OAuth login

fix(cart): recalculate total when quantity changes

Closes #234. The cart total was not updating when users changed
item quantity in the drawer. Added quantity change listener and
recalculate on change.

refactor(api): extract payment service from checkout controller

BREAKING CHANGE: PaymentService must now be injected into CheckoutService
\`\`\`

**What makes a bad commit:**
\`\`\`
git commit -m "stuff"
git commit -m "fix"
git commit -m "wip"
git commit -m "asdfgh"
\`\`\`

---

## Pull Requests

A pull request (PR) is a request to merge your branch into another branch. It is also a conversation.

**What a good PR contains:**

1. **Title:** Short, specific, imperative. "Add Google OAuth login" not "Added stuff"
2. **Description:**
   - What changed and why
   - How to test it
   - Screenshots (for UI changes)
   - Related issues
3. **Small scope:** One PR per feature or fix
4. **Passing CI:** Tests must pass before review

**PR description template:**
\`\`\`markdown
## What changed
Brief description of the change and why it was necessary.

## How to test
1. Go to /login
2. Click "Continue with Google"
3. Complete OAuth flow
4. Should redirect to dashboard with user logged in

## Screenshots
[Before] [After]

## Checklist
- [x] Tests written and passing
- [x] Documentation updated
- [x] No sensitive data in code
\`\`\`

---

## Code Reviews

A code review is not about finding fault. It is about:
- Catching bugs before they reach production
- Sharing knowledge across the team
- Maintaining code quality and consistency
- Mentoring less experienced teammates

**Reviewer checklist:**

\`\`\`
Correctness:
  [ ] Does the code do what the PR description says?
  [ ] Are edge cases handled?
  [ ] Are error states handled?
  [ ] Are there race conditions?

Security:
  [ ] Is user input validated?
  [ ] Is authorization checked?
  [ ] Are there SQL injection risks?

Performance:
  [ ] Are there N+1 query problems?
  [ ] Are large datasets paginated?
  [ ] Are expensive operations cached?

Code Quality:
  [ ] Is the code readable without comments?
  [ ] Is logic duplicated (should be extracted)?
  [ ] Are names clear and consistent?
\`\`\`

**How to give feedback in reviews:**

\`\`\`
Blocking issues (must fix before merge):
  "This will cause a SQL injection — please use parameterized queries"
  "Missing authorization check — any user can delete any post"

Non-blocking suggestions (nice to have):
  "nit: consider extracting this into a helper function"
  "suggestion: this could use early return for readability"

Questions (seeking understanding):
  "I'm not sure I understand why we need this extra check — can you explain?"
  "Is there a reason we chose X over Y here?"

Praise (underutilized):
  "Nice! I didn't know about this API"
  "Great solution to the cache invalidation problem"
\`\`\`

---

## Agile and Scrum

**Agile** is a philosophy: deliver working software frequently, respond to change, collaborate with customers.

**Scrum** is an implementation of Agile with specific ceremonies and roles.

**Sprint:** A fixed time box (usually 1-2 weeks) of development work.

**Scrum Ceremonies:**
\`\`\`
Sprint Planning (start of sprint, ~2 hours):
  - Select stories from the backlog
  - Estimate effort (story points)
  - Commit to what fits in the sprint

Daily Standup (every day, ~15 minutes):
  - What did I do yesterday?
  - What am I doing today?
  - What is blocking me?

Sprint Review (end of sprint, ~1 hour):
  - Demo what was built to stakeholders
  - Get feedback

Retrospective (end of sprint, ~1 hour):
  - What went well?
  - What did not go well?
  - What do we change next sprint?
\`\`\`

**Backlog refinement:**
A session (mid-sprint) where the team breaks down upcoming stories and estimates effort.

**Story Points:**
Relative estimates of complexity (not time). Common scales: Fibonacci (1, 2, 3, 5, 8, 13) or T-shirt sizes (S, M, L, XL).

---

## Documentation

Good teams document:
- **Architecture decisions** (why was X chosen over Y?)
- **Setup instructions** (how do I run this locally?)
- **API documentation** (what do these endpoints do?)
- **Environment variables** (what do I need to configure?)

**README.md minimum:**
\`\`\`markdown
# Project Name

Brief description.

## Prerequisites
- Node.js 20+
- PostgreSQL 16+
- Docker (optional)

## Setup
\`\`\`bash
git clone ...
cd project
cp .env.example .env
# Fill in .env values
npm install
npx prisma migrate dev
npm run dev
\`\`\`

## Environment Variables
| Variable | Description | Example |
|---|---|---|
| DATABASE_URL | PostgreSQL connection | postgresql://... |
| JWT_SECRET | JWT signing key | (32+ char random string) |

## Architecture
Brief overview of key directories and decisions.
\`\`\`

**ADR (Architecture Decision Records):**
\`\`\`markdown
# ADR-001: Use PostgreSQL instead of MongoDB

## Status: Accepted

## Context
We need a database for the platform. Our data is relational
(users → posts → comments, users → orders → items).

## Decision
We chose PostgreSQL over MongoDB.

## Rationale
Our data has clear relationships and benefits from foreign keys,
ACID transactions, and complex JOIN queries. MongoDB's schema
flexibility is not needed and would introduce schema inconsistency.

## Consequences
Team needs SQL knowledge. Schema changes require migrations.
\`\`\`

---

## Collaboration Tools

\`\`\`
Code: GitHub / GitLab
Communication: Slack / Discord
Planning: Linear / Jira / Notion
Design: Figma
Documentation: Notion / Confluence / GitHub Wiki
CI/CD: GitHub Actions / CircleCI
Monitoring: Sentry / DataDog
Video: Loom (async demos) / Zoom (sync meetings)
\`\`\``,
  codeExamples: [
    {
      title: 'Git Workflow for a Feature Branch',
      code: `# 1. Start from a fresh main
git checkout main
git pull origin main

# 2. Create feature branch
git checkout -b feature/user-notifications

# 3. Work in small, logical commits
git add src/notifications/
git commit -m "feat(notifications): add notification data model

Add Notification model to Prisma schema with types:
like, comment, follow. Include read/unread status."

git add src/api/notifications/
git commit -m "feat(notifications): add notifications API endpoints

GET /api/notifications - list user notifications (paginated)
PATCH /api/notifications/:id/read - mark as read
POST /api/notifications/read-all - mark all as read"

git add src/components/notifications/
git commit -m "feat(notifications): add notification bell UI component

Shows unread count badge, dropdown list of recent notifications.
Polls for new notifications every 30 seconds."

# 4. Push branch
git push -u origin feature/user-notifications

# 5. Open pull request on GitHub
# 6. Respond to review comments
# 7. After approval, squash and merge to main

# If main has moved while you worked:
git checkout main && git pull
git checkout feature/user-notifications
git rebase main  # replay your commits on top of latest main
# or: git merge main  (creates a merge commit — some teams prefer this)`,
      explanation:
        'Feature branches keep work isolated. Small focused commits make the PR reviewable. Rebasing keeps history clean. Squash merging keeps main history readable.',
    },
  ],
  commonMistakes: [
    'Committing directly to main — bypasses PR review and CI checks',
    'Giant PRs with 50+ file changes — impossible to review effectively, split into smaller PRs',
    'Vague commit messages ("fix stuff", "wip") — makes git blame and history useless',
    'Not writing PR descriptions — reviewers cannot understand what to test or why the change exists',
    'Personal code reviews — treating review comments as personal criticism instead of professional discussion',
    'Skipping retrospectives — teams that do not reflect do not improve',
    'No README or setup docs — new team members waste days setting up their environment',
  ],
  interviewQuestions: [
    {
      question: 'What is the difference between merge and rebase?',
      answer:
        'Merge creates a merge commit that joins two branches, preserving the full history of both. Rebase replays your commits on top of another branch, creating linear history as if you had started from the latest commit. Rebase creates cleaner history but rewrites commit hashes — never rebase a branch others are working on. Most teams use rebase for keeping feature branches up to date with main, and merge (or squash merge) for the final PR merge.',
      difficulty: 'intermediate',
    },
    {
      question: 'What makes a good code review?',
      answer:
        'A good review checks correctness (does it do what it says?), security (input validation, auth checks), performance (N+1 queries, missing indexes), and readability (are names clear, is logic extractable?). Feedback distinguishes blocking issues (must fix), suggestions (consider), and questions (seeking understanding). Good reviews are timely, specific, and constructive — they improve the code without attacking the person.',
      difficulty: 'intermediate',
    },
    {
      question: 'What is a sprint retrospective and why does it matter?',
      answer:
        'A sprint retrospective is a meeting at the end of each sprint where the team reflects: what went well, what did not, what to change next sprint. It matters because it creates a continuous improvement loop — teams that retrospect regularly improve their processes, fix broken workflows, and surface hidden problems before they become crises. Teams that skip retros repeat the same mistakes indefinitely.',
      difficulty: 'beginner',
    },
  ],
  exercises: [
    {
      id: 'write-a-good-pr',
      title: 'Write a Pull Request Description',
      description:
        'You just implemented the "forgot password" feature (email with reset link, password update endpoint). Write a complete PR description including: title, what changed, how to test, and a checklist.',
      starterCode: `# PR Title: ???

## What changed


## How to test
1.
2.
3.

## Screenshots (if UI changed)

## Checklist
- [ ]
- [ ]
- [ ]`,
      solution: `# PR Title: feat(auth): add forgot password with email reset

## What changed
Implemented the forgot password flow:
- POST /api/auth/forgot-password — accepts email, sends reset link (always returns 200 regardless of whether email exists, to prevent user enumeration)
- GET /api/auth/reset-password/:token — validates token (must not be expired or used)
- POST /api/auth/reset-password — accepts token + new password, updates password, invalidates token and all existing sessions

Reset tokens expire in 1 hour and are single-use. Tokens are stored hashed in the database.

Added SendGrid email integration for the reset email template.

## How to test
1. Go to /login and click "Forgot password?"
2. Enter your email address and submit
3. Check your email (or check Mailtrap in development)
4. Click the reset link
5. Enter a new password (at least 8 characters)
6. Should redirect to login with "Password updated" message
7. Verify old password no longer works, new password works

Edge cases:
- Submit with email that doesn't exist → same success message (no leak)
- Click expired link (>1 hour) → "Link expired" error
- Click already-used link → "Link already used" error

## Screenshots
[Email template screenshot]
[Reset password form screenshot]

## Checklist
- [x] Tests written (unit tests for service, integration test for full flow)
- [x] Reset tokens stored as SHA-256 hashes (not plain text)
- [x] Generic error message (does not reveal if email is registered)
- [x] Token expires in 1 hour
- [x] All existing sessions invalidated after password reset
- [x] Email template tested in Mailtrap
- [x] Environment variables documented in .env.example`,
      hints: [
        'Describe the security decisions — reviewers need to know why you used generic error messages',
        'List edge cases in How to Test — reviewers should test these',
        'Include all security-relevant items in the checklist',
      ],
    },
  ],
  keyTakeaways: [
    'Feature branch workflow: branch off main, work, open PR, review, merge — never commit directly to main',
    'Conventional commits (feat/fix/chore + scope + description) make git history readable and useful',
    'Good PRs are small (one feature/fix), have clear descriptions, and include test instructions',
    'Code reviews catch bugs, share knowledge, and maintain quality — they are not personal critiques',
    'Scrum ceremonies (planning, standup, review, retro) create rhythm and continuous improvement',
    'Documentation (README, ADRs, API docs) is a gift to future teammates including your future self',
  ],
  nextLesson: 'open-source-development',
  prevLesson: 'deployment',
};
