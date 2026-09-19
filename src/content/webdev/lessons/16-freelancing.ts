import type { Lesson } from '@/types';

export const freelancingLesson: Lesson = {
  id: 'freelancing-client-work',
  slug: 'freelancing-client-work',
  title: 'Freelancing and Client Work',
  description:
    'Requirements gathering, estimation, contracts, delivery, client communication, and maintenance — everything you need to work professionally with clients.',
  category: 'Professional Skills',
  order: 16,
  difficulty: 'intermediate',
  estimatedTime: 22,
  content: `Freelancing is building products for clients rather than for yourself or an employer. The technical skills are the same. The professional skills are entirely different.

Most developers who fail at freelancing fail not because of technical skill but because of poor requirements gathering, underestimation, poor communication, or lack of professional agreements.

---

## Requirements Gathering

Client requirements are almost never complete and often wrong.

**What clients say vs. what they mean:**
\`\`\`
"I want a website like Amazon"
  → They want an e-commerce site. Define the actual features.

"It should be fast"
  → What is fast? 2 seconds? Sub-second? On what connection?

"I need it by Friday"
  → Is Friday hard? Is this so they can demo something?

"Something simple"
  → They think simple. It might not be.
\`\`\`

**The discovery process:**

Before estimating or signing anything, have a discovery call:

\`\`\`
Questions to ask every client:
  1. What problem are you solving for your users?
  2. Who are your users? How many do you have or expect?
  3. What does success look like in 6 months?
  4. What do you have now? (existing design, existing code, brand guidelines)
  5. What is your budget range?
  6. What is your timeline?
  7. Who makes decisions on your side?
  8. Who else is involved? (designers, other developers)
  9. What technical constraints exist? (must use WordPress, must integrate with Salesforce)
  10. What happens if you don't build this?
\`\`\`

**Write a requirements document:**

After discovery, write what you heard and send it to the client before any estimate. This prevents "that's not what I meant" after months of work.

\`\`\`
PROJECT: [Name]
DATE: [Date]
CLIENT: [Name]

WHAT WE ARE BUILDING:
A web application that allows [user type] to [do what].

CORE FEATURES:
1. User authentication (email/password)
2. Product catalog with search and filter
3. Shopping cart and checkout (Stripe)
4. Order management (admin)
5. Email notifications (order confirmation)

OUT OF SCOPE:
- Mobile app
- Inventory management system
- Multi-language support
- Analytics dashboard

TECHNICAL REQUIREMENTS:
- Responsive design (mobile + desktop)
- SEO friendly
- Hosted on [platform]
- Integration with [existing system]

TIMELINE: 8 weeks
BUDGET: ₹X - ₹Y

Please confirm this matches your understanding.
\`\`\`

---

## Estimation

Estimation is difficult. The goal is not precision but reasonable expectation setting.

**Common estimation mistakes:**
- Estimating ideal time (no bugs, no miscommunication, no meetings)
- Not estimating design and UX time
- Forgetting deployment and setup time
- Ignoring client review rounds and feedback iterations
- Not accounting for scope additions

**The 3x rule:** Take your gut estimate and multiply by 3. It sounds extreme. It is usually accurate.

**Breaking down estimates:**
\`\`\`
Feature: User Authentication

Sub-tasks:
  Design (signup, login, forgot password screens): 4h
  Backend: auth service, JWT, routes: 8h
  Frontend: forms, validation, token storage: 6h
  Testing: unit + integration: 4h
  Email integration (verification, reset): 4h
  QA and bug fixes: 3h
  Deployment and configuration: 2h
  Client review and revision: 3h

Subtotal: 34h
Buffer (20%): +7h
Total: 41h
\`\`\`

**Types of estimates:**
\`\`\`
Fixed price:  You estimate, client pays that amount. Risk is on you.
              Good when: scope is clearly defined, you have done it before
              Bad when: scope is vague

Time + materials: Client pays your hourly rate for hours worked.
              Good when: scope is unclear or likely to change
              Bad when: client has strict budget

Milestone-based: Fixed price per milestone with clear deliverables.
              Best for: projects where you can define what "done" means per phase
\`\`\`

---

## Contracts

A contract is not a formality. It is protection for both parties.

**What a freelance contract must include:**

\`\`\`
1. SCOPE OF WORK
   Exactly what you will build. Reference the requirements document.
   "Features not listed in Exhibit A are out of scope."

2. PAYMENT TERMS
   - Total amount
   - Payment schedule (50% upfront, 50% on delivery)
   - Late payment fee (1.5% per month)
   - Invoice due date (net 15 or net 30)

3. TIMELINE
   - Start date
   - Milestone dates
   - What causes the timeline to shift (scope change, delayed feedback)

4. REVISION POLICY
   "Two rounds of revisions per milestone are included.
   Additional revisions are billed at [hourly rate]."

5. INTELLECTUAL PROPERTY
   - Who owns the code when paid in full?
   - What open source libraries are used?
   - Do you retain rights to reuse patterns in other projects?

6. TERMINATION
   - How either party can end the contract
   - What happens to payment if terminated?

7. WARRANTY
   - How long after delivery do you fix bugs?
   - What constitutes a bug vs. a new feature request?

8. COMMUNICATION
   - How do you communicate? (email, Slack, video calls)
   - What is the expected response time?
   - Who on the client side can approve changes?
\`\`\`

**Invoice payment structure:**
\`\`\`
Never start work without payment.

Standard:
  30% on signing
  40% at midpoint milestone
  30% on final delivery + acceptance

For smaller projects:
  50% upfront
  50% on delivery
\`\`\`

---

## Delivery

**Staging environment:**
Always deliver to a staging environment before production.
\`\`\`
Client reviews at: staging.yourproject.com
Production at:     yourproject.com (only after client approval)
\`\`\`

**Acceptance testing:**
\`\`\`
Before final payment:
  1. Client gets access to staging
  2. Client tests against the requirements document
  3. Issues logged in a shared document (not email chains)
  4. You fix bugs (bugs = things not working as specified)
  5. Feature requests go to next contract (not free)
  6. Client signs off in writing ("This meets the requirements")
  7. Deploy to production
  8. Final invoice sent
\`\`\`

---

## Client Communication

**The most important skill in freelancing is communication.**

\`\`\`
Weekly status update (every Friday):
  What I completed this week:
  - [x] User authentication working end-to-end
  - [x] Product listing page with filter and sort

  What I am working on next week:
  - [ ] Shopping cart functionality
  - [ ] Stripe integration setup

  Blockers:
  - Waiting on design files for checkout page
  - Need Stripe test credentials from your team

  Timeline: On track for milestone 2 delivery on [date]
\`\`\`

**How to say no to scope creep:**
\`\`\`
Client: "Can we also add a live chat feature?"

Response: "I'd love to add that! That would take approximately 3-4 days
of additional work. I can put together a separate estimate for that as an
add-on to the current project. Would you like me to do that?"
\`\`\`

Never say yes to scope additions without a separate estimate and agreement.

---

## Maintenance

After delivery, clients will need support. Define this upfront.

**Maintenance agreement structure:**
\`\`\`
Post-delivery warranty: 30 days bug fixes included

Monthly retainer (optional):
  - X hours per month of maintenance and improvements
  - Bug fixes within 48 hours
  - Security updates
  - Monthly backup verification
  Retainer rate: ₹Y/month

Additional work billed at: ₹Z/hour
\`\`\``,
  codeExamples: [
    {
      title: 'Project Kickoff Email Template',
      code: `// Send after signing contract and receiving first payment

Subject: [Project Name] — Kickoff Confirmation and Next Steps

Hi [Client Name],

Thank you for signing the contract and the initial payment. I am excited to get started on [Project Name].

Here is a summary of our agreement and next steps:

PROJECT OVERVIEW
What we are building: [brief description]
Timeline: [start date] → [end date]
Total budget: ₹X (30% received, 40% at milestone 2, 30% at completion)

MILESTONE 1 — [Date]
- [ ] User authentication (signup, login, password reset)
- [ ] User profile page
- [ ] Basic navigation and layout

WHAT I NEED FROM YOU
Please send by [date]:
1. Brand guidelines (logo, colors, fonts) — or Figma file
2. Copy/text for the homepage and about page
3. Access to your domain registrar (or I can set up a subdomain)
4. Stripe account email (for payment integration setup)

COMMUNICATION
- Weekly Friday updates via email
- Questions responded to within 24 hours on business days
- Video call every 2 weeks to review progress (I'll send a Loom video alternatively)

My first week goal is to have the project scaffolded and authentication working. I'll send you a staging link by [date].

Looking forward to working with you!

[Your name]
[Your email]
[Your portfolio URL]`,
      explanation:
        'A professional kickoff email sets expectations, lists what you need from the client, and establishes communication patterns. Clients who do not receive this kind of structure often become difficult to work with.',
    },
  ],
  commonMistakes: [
    'Starting work without a signed contract and upfront payment — very hard to recover unpaid fees',
    'Accepting vague requirements without a written document — clients will claim it was always different',
    'Not defining what constitutes a bug vs. a new feature in the contract',
    'Replying to every change request with "yes I can do that" without mentioning it is extra cost',
    'No staging environment — deploying untested code directly to production is unprofessional',
    'No written client sign-off before final payment — clients will say "it is not done yet"',
    'Underpricing — low rates attract difficult clients and leave no budget for proper work',
  ],
  interviewQuestions: [
    {
      question: 'How do you handle scope creep in a freelance project?',
      answer:
        'Scope creep is prevented by having a written requirements document that both parties sign. When a client requests something not in that document, I acknowledge the request positively, clarify whether it falls inside or outside the agreed scope, and if outside, provide a separate estimate. I never add work without written agreement and additional payment. The contract explicitly states that unlisted features are out of scope.',
      difficulty: 'intermediate',
    },
    {
      question: 'How do you estimate a freelance project?',
      answer:
        'Break the project into features, then each feature into sub-tasks (design, backend, frontend, testing, QA, client review, deployment). Estimate each task in hours. Sum them, add a 20-30% buffer for the unexpected, then multiply by your hourly rate. Never estimate off the top of your head — itemized estimates protect you and help clients understand where the time goes. Confirm the estimate in writing before starting.',
      difficulty: 'intermediate',
    },
  ],
  exercises: [
    {
      id: 'write-requirements-doc',
      title: 'Write a Requirements Document',
      description:
        'A client wants to build a restaurant booking system. They have said: "Users should be able to book tables, restaurants can manage their bookings, and we need a website." Write a complete requirements document based on a discovery conversation you would have.',
      starterCode: `// PROJECT: Restaurant Booking System
// CLIENT: [Name]
// DATE: [Date]

// WHAT WE ARE BUILDING:
// ...

// CORE FEATURES:
// Guest (unauthenticated):
//   1. ...
// Customer (authenticated):
//   1. ...
// Restaurant Owner (authenticated):
//   1. ...

// OUT OF SCOPE (v2):
// ...

// TECHNICAL REQUIREMENTS:
// ...

// TIMELINE: X weeks
// PAYMENT: Y% upfront, Z% on delivery`,
      solution: `// PROJECT: Restaurant Booking System
// CLIENT: [Client Name]
// DATE: [Date]

// WHAT WE ARE BUILDING:
// A web application that allows customers to discover restaurants and
// book tables online, while giving restaurant owners a dashboard to
// manage their bookings, availability, and table setup.

// CORE FEATURES:

// Guest (not logged in):
// 1. Browse restaurant listings (name, cuisine, location, photos)
// 2. View restaurant detail page (hours, menu PDF, photos, reviews)
// 3. See real-time table availability for a date/time/party size
// 4. Book a table as guest (enter name, email, phone, special requests)
// 5. Receive booking confirmation email

// Customer (registered):
// 1. Register and login with email/password
// 2. View booking history
// 3. Cancel or modify upcoming bookings (up to 2 hours before)
// 4. Leave a review after dining (1-5 stars + text)

// Restaurant Owner (authenticated with restaurant role):
// 1. Register restaurant (name, address, cuisine type, hours, photos)
// 2. Configure table setup (number of tables, sizes, turning time)
// 3. Manage availability (set closed dates, maximum bookings per slot)
// 4. View all upcoming bookings in a dashboard
// 5. Confirm, cancel, or modify individual bookings
// 6. Receive email notifications for new bookings

// Super Admin:
// 1. Approve or reject restaurant registrations
// 2. View platform analytics

// OUT OF SCOPE (v2):
// - Mobile app (iOS/Android)
// - Payment processing (deposits)
// - Waitlist feature
// - Loyalty program
// - QR code check-in
// - SMS reminders (email only in v1)
// - Multi-language support

// TECHNICAL REQUIREMENTS:
// - Responsive design (mobile-first)
// - Email notifications via SendGrid
// - Hosted on Vercel (frontend) + Railway (backend + DB)
// - Google Maps integration for location display
// - Image upload for restaurant photos

// TIMELINE: 10 weeks
// PAYMENT: 30% upfront (₹X), 40% at milestone 3 (₹Y), 30% at completion (₹Z)`,
      hints: [
        'Think about all user types — who uses the system and what do they each need?',
        'Every feature you include adds to the timeline and cost — be specific',
        'Out of scope is as important as in scope — prevents "can we add..."',
      ],
    },
  ],
  keyTakeaways: [
    'Always gather requirements in writing and have the client confirm before estimating',
    'Estimation: break into sub-tasks, sum hours, add 20-30% buffer, multiply by rate',
    'Never start work without a signed contract and upfront payment',
    'Scope creep: acknowledge it, say it is extra, provide a separate estimate',
    'Delivery: staging environment → client acceptance testing → written sign-off → final payment → production',
    'Weekly status emails prevent surprises and build client trust',
    'Define maintenance terms upfront — post-delivery support is a separate service',
  ],
  nextLesson: 'startup-development',
  prevLesson: 'open-source-development',
};
