import type { Lesson } from '@/types';

export const projectDiscussionsLesson: Lesson = {
  id: 'project-discussions',
  slug: 'project-discussions',
  title: 'Project Discussions',
  description:
    'Learn how to talk about your projects in a way that demonstrates depth, ownership, and technical thinking — not just what you built, but why, how, and what you learned from it.',
  category: 'Core Questions',
  order: 4,
  difficulty: 'beginner',
  estimatedTime: 45,
  content: `"Tell me about your most significant project."

This question sounds simple. You built the thing. You know it. But most students give weak answers because they describe the project like a README file — a list of features and technologies.

What the interviewer wants is fundamentally different. They want to understand how you think, how you handle challenges, what decisions you made and why, and what you actually learned. The project is the vehicle. Your thinking and growth are the destination.

---

## What Makes a Project Discussion Strong

A strong project discussion has five qualities:

**1. Clear problem framing**
You can articulate what problem the project solved and why that problem mattered. Not "I built a task manager" but "I built a task manager because I was trying to understand how real-time sync works between clients — the kind of problem collaborative tools like Notion face."

**2. Architecture and decisions**
You can explain the major technical decisions you made and why you made them. Not just "I used PostgreSQL" but "I chose PostgreSQL over MongoDB because the data had clear relationships between users, tasks, and projects, and I wanted to practice writing proper SQL joins."

**3. The hard part**
Every real project has at least one genuinely difficult problem. Interviewers listen for this. If your project had no hard problems, it suggests you did not push past tutorials.

**4. Ownership**
You speak in "I" not "we." Even if it was a team project, you should be able to describe your specific contribution without taking credit for others.

**5. Learning and growth**
What do you know now that you did not know when you started? What would you do differently? This shows self-awareness and a growth mindset.

---

## How to Explain Your Project

Use this structure when asked to explain a project:

\`\`\`
PROJECT EXPLANATION STRUCTURE

1. What is it? (1-2 sentences — the problem it solves)
2. Why did you build it? (the motivation — learning goal or real need)
3. How is it built? (architecture overview — key technology decisions and why)
4. What was the hardest part? (the real challenge you faced)
5. How did you solve it? (your debugging/thinking process)
6. What would you change? (honest reflection)
\`\`\`

---

## Explaining Project Architecture

Architecture discussion is where technical interviewers evaluate depth. You need to be able to explain:

- The overall structure (frontend, backend, database, etc.)
- Why you chose the main technologies
- How the data flows through the system
- Where the complexity lives

**Weak architecture explanation:**
> "I used React for the frontend, Node.js for the backend, and MongoDB for the database."

**Strong architecture explanation:**
> "The frontend is React with a custom hook for managing WebSocket connections. The backend is Node.js with Express — I chose this because I was already comfortable with JavaScript and wanted to focus on understanding real-time patterns rather than learning a new language. The database is MongoDB because the data structure was flexible — users could create custom fields for their task types, and a rigid SQL schema would have made that difficult to implement. I used Redis for the session store because I needed fast read access for auth checks on every request."

The strong version explains **why** at each decision point. That is what interviewers want to hear.

---

## The Challenges Faced Question

"What was the biggest challenge in your project?"

This is often the most important project question. Interviewers use it to assess problem-solving depth, debugging ability, and resilience.

**Structure for answering this:**
1. Name the challenge specifically
2. Explain why it was hard
3. Walk through your debugging or problem-solving process
4. Explain the solution
5. State what you learned from it

**Weak answer:**
> "The hardest part was debugging. There were a lot of bugs. But I fixed them all eventually."

**Strong answer:**
> "The hardest challenge was a race condition in the task completion system. When two users completed the same task at the same time, the task would appear completed to one user but then reappear uncompleted. I initially thought it was a frontend state problem — I spent about a day on that before realizing the frontend state was correct. Then I added logging to the database layer and noticed that two writes were happening within milliseconds of each other. I learned about optimistic locking and implemented it using a version field on each task — the update only succeeds if the version matches what was last read. After that, I never saw the race condition again in 200+ manual tests."

The strong answer shows: a real problem, a wrong hypothesis that was investigated and discarded, a methodical approach to finding the root cause, and a real solution with a name (optimistic locking).

---

## The "Mistakes Made" Question

"What is something you would do differently in this project?"

This question evaluates self-awareness and technical maturity. The worst answers are:
- "Nothing, I am pretty happy with it" (no self-awareness)
- "Everything was wrong" (no ownership of what worked)

The best answers are honest about a specific technical decision that you now understand was suboptimal, and explain what you would do instead and why.

**Weak answer:**
> "I would probably just structure the code better overall."

**Strong answer:**
> "I would not use MongoDB for this project if I were starting over. At the time I thought the flexible schema was an advantage, but as the project grew, I was essentially implementing relational logic in application code — manually joining documents, managing referential integrity myself. A PostgreSQL database with proper foreign keys would have made those relationships explicit and enforced by the database. I did not know enough about data modeling at the time to recognize this. I learned it by reading about the differences between document and relational models after I started having consistency issues."

---

## The "Lessons Learned" Question

"What did you learn from building this project?"

Do not give a technology list: "I learned React, Node.js, MongoDB, and deployment." That is the answer of someone who followed a tutorial and called it a project.

The interviewer wants to know what you learned that you could not have gotten from reading documentation — what you learned from actually struggling with something.

**Categories of genuine learning:**
- A debugging skill ("I learned how to read stack traces and trace errors backward through layers")
- A design insight ("I learned why separation of concerns matters — when I mixed business logic into my routes, changes became impossible to make cleanly")
- A process lesson ("I learned to write tests before touching production data, after I accidentally deleted a user's data while testing a delete endpoint")
- A technical concept ("I learned what database transactions actually do — before this project I just used them blindly; now I understand the ACID properties and when you need them")

---

## Open Source Contributions

If you have contributed to open source, this is worth discussing specifically.

Interviewers value open source contributions because they demonstrate:
- Ability to read and understand code you did not write
- Professional communication in PRs and code reviews
- Working within constraints and conventions set by others

**How to discuss an open source contribution:**
1. What project? (and briefly, what it does)
2. What was your contribution?
3. How did you identify the issue or opportunity?
4. What was the review process like?
5. What did you learn from working in someone else's codebase?

Even a small documentation fix or a bug fix in a widely-used library is worth mentioning. It demonstrates professional-level behavior.

---

## Internship Experience

If you have internship experience, project discussions become more powerful because the context is production code with real users and real consequences.

When discussing internship projects, emphasize:

**1. Scale and constraints that personal projects don't have**
> "This code ran in production with 50,000 daily active users, so every change required careful testing and rollback planning."

**2. Collaboration and code review**
> "I had to get every change reviewed by a senior engineer before merging. That forced me to write code that was explainable and documented — not just code that worked."

**3. Business impact**
> "The feature I built reduced customer support tickets about billing errors by 30% in the first month."

**4. What the professional environment taught you**
> "The biggest thing I learned in the internship that I could not have learned from personal projects was how to scope work — how to break a large requirement into pieces that can be shipped incrementally without breaking the existing system."

---

## Building a Project Narrative

Before your interview, prepare a deep narrative for your two or three most significant projects. For each project, be able to answer:

\`\`\`
DEEP PROJECT NARRATIVE CHECKLIST

[ ] What problem does it solve and why did you build it?
[ ] What are the main components and how do they interact?
[ ] Why did you choose each major technology?
[ ] What was the hardest technical problem you faced?
[ ] How did you approach debugging it?
[ ] What did you initially try that did not work?
[ ] What was the final solution?
[ ] What would you do differently if starting over?
[ ] What specific things did you learn?
[ ] How long did it take?
[ ] Is it deployed? If so, where?
[ ] If it was a team project, what specifically was your contribution?
\`\`\`

If you cannot answer all of these for a project, you are not ready to discuss it in an interview. Either prepare these answers or do not mention the project.`,
  codeExamples: [],
  commonMistakes: [
    'Describing the project like a README (features list) instead of explaining decisions and challenges',
    'Explaining technologies without explaining why you chose them — "I used X" is weaker than "I used X because..."',
    'Claiming the hardest part was "just getting it all to work" — this signals you did not go deep enough',
    'Using "we" throughout when it was your project or your contribution was specific',
    'Saying "I would not change anything" — this signals poor self-awareness, every project has room for improvement',
    'Listing technology-name learning instead of deep insight learning: "I learned React" vs "I learned how React re-renders work and how to avoid unnecessary renders"',
    'Not knowing your own project well enough to answer follow-up questions — if you built it, you should be able to explain every part',
  ],
  interviewQuestions: [
    {
      question: 'Tell me about your most significant project.',
      answer:
        'Start with what problem it solved and why you built it. Then briefly describe the architecture and key technology decisions with reasons. Then go deep on the hardest technical challenge — name it specifically, explain why it was hard, walk through your debugging approach, and describe the solution. End with what you would do differently and what you specifically learned. The goal is to demonstrate depth of thinking, not breadth of features.',
      difficulty: 'beginner',
    },
    {
      question: 'Why did you choose [specific technology] for this project?',
      answer:
        'This question evaluates whether your technology choices were deliberate or accidental. Give an honest answer: if you chose it because you were comfortable with it, say so and explain what tradeoffs that means. If you chose it because it was the best tool for the problem, explain the specific fit. If you would choose something different today, say that too — it shows growth and self-awareness.',
      difficulty: 'intermediate',
    },
    {
      question: 'What was the hardest bug you ever had to fix?',
      answer:
        'Name a specific bug — race condition, memory leak, database deadlock, timing issue. Explain why it was hard to find (intermittent, environment-specific, required understanding a system you did not know). Walk through your debugging process step by step: what you initially suspected, what you tried, how you narrowed it down, and how you confirmed the root cause. End with the fix and what you learned about the underlying system.',
      difficulty: 'intermediate',
    },
    {
      question: 'Have you ever contributed to open source?',
      answer:
        'If yes: describe the project, your contribution, how you found the issue or opportunity, and what the review process taught you about working in an unfamiliar codebase. If no: be honest, but pivot to what you have done that demonstrates similar skills — reading and understanding someone else\'s code in a team project, or following code style conventions in a group project.',
      difficulty: 'beginner',
    },
  ],
  exercises: [
    {
      id: 'project-deep-dive',
      title: 'Prepare Your Project Narratives',
      description:
        'Select your two or three most significant projects. For each one, fill in the complete project narrative checklist. If you cannot answer a question, either research your own project until you can, or decide not to mention that project in interviews.',
      starterCode: `// PROJECT NARRATIVE PREPARATION

const project1 = {
  name: "",
  tagline: "", // One sentence: "A [what] that [does what] for [whom]"

  problemAndMotivation: {
    problem: "", // What problem does this solve?
    whyYouBuiltIt: "", // What made you build this specifically?
  },

  architecture: {
    overview: "", // How does the system work at a high level?
    components: [], // Frontend, backend, database, cache, etc.
    keyDecisions: [
      // { technology: "", reason: "" } — why each major choice?
    ],
  },

  hardestChallenge: {
    whatWasIt: "", // Name the challenge specifically
    whyItWasHard: "", // What made it difficult?
    whatYouTriedFirst: "", // Your initial (possibly wrong) hypothesis
    howYouDebugged: "", // Step-by-step debugging approach
    solution: "", // What actually fixed it?
    whatYouLearned: "", // The specific insight you now have
  },

  whatWouldYouChange: {
    specificDecision: "", // One decision you would make differently
    whyDifferently: "", // What you now understand that you did not then
    whatYouWouldDo: "", // The better approach
  },

  impact: {
    isItDeployed: false,
    whereDeployed: "",
    usersOrScale: "",
    metrics: [], // Any measurable impact?
  },

  timeline: "",
  teamOrSolo: "",
  yourSpecificContribution: "", // If team project
};`,
      solution: `// Example: Complete Project Narrative

const expenseTrackerNarrative = {
  name: "TeamExpense — Group Expense Tracker",
  tagline: "A web app that tracks shared expenses in groups and auto-calculates who owes whom, eliminating the confusion of manual splitting.",

  problemAndMotivation: {
    problem: "My college friend group would go on trips and managing shared expenses was always chaotic — screenshots of notes apps, manual calculations, disagreements about who paid what.",
    whyYouBuiltIt: "I wanted to build something I would actually use, and I wanted to understand how real-time sync works because I had read about how Google Docs handles it and was curious.",
  },

  architecture: {
    overview: "React SPA that talks to a Node.js/Express REST API, which reads and writes to a PostgreSQL database. Users authenticate with JWT. Expense calculations happen on the backend.",
    components: ["React frontend", "Node.js/Express API", "PostgreSQL", "Vercel (frontend)", "Railway (backend + database)"],
    keyDecisions: [
      {
        technology: "PostgreSQL instead of MongoDB",
        reason: "The data has clear relationships: users → groups → expenses → participants. I needed proper joins and foreign key constraints. MongoDB's flexible schema would have hidden bugs instead of preventing them.",
      },
      {
        technology: "JWT over sessions",
        reason: "I wanted to understand how stateless auth works in practice. Sessions require server-side storage; JWT puts the auth state in the token itself. I read about both and decided JWT was a better fit for a stateless REST API.",
      },
    ],
  },

  hardestChallenge: {
    whatWasIt: "A race condition in expense settlement calculations",
    whyItWasHard: "It only appeared when two users submitted expenses within the same second. The balance calculation would read stale data and produce wrong results. It was intermittent so difficult to reproduce reliably.",
    whatYouTriedFirst: "I thought the frontend was not refreshing correctly after submission. Spent about 4 hours adding better state management before realizing the API was returning stale data.",
    howYouDebugged: "Added request logging with timestamps. When I replayed two simultaneous requests, I could see both reads happened before either write completed. Classic read-modify-write race condition.",
    solution: "Wrapped the expense insertion and balance recalculation in a PostgreSQL transaction with SELECT FOR UPDATE to lock the relevant rows during the calculation.",
    whatYouLearned: "What database transactions actually do at a low level, and specifically when you need row-level locking vs. just a transaction. I now understand ACID properties as real concepts, not just interview terms.",
  },

  whatWouldYouChange: {
    specificDecision: "How I structured the balance calculation — I put it in the API route handler, not in a separate service",
    whyDifferently: "When I needed to test the calculation logic, I had to make HTTP requests. The logic was coupled to Express. I now understand why separating business logic from HTTP handling matters.",
    whatYouWouldDo: "Move the balance calculation into a pure function that takes data and returns results — completely testable without a running server.",
  },

  impact: {
    isItDeployed: true,
    whereDeployed: "Vercel frontend, Railway backend",
    usersOrScale: "Used by my friend group of ~15 people across 3 trips",
    metrics: ["Zero manual calculation disagreements since we started using it"],
  },

  timeline: "6 weeks, ~10 hours per week",
  teamOrSolo: "Solo",
  yourSpecificContribution: "N/A — solo project",
};`,
      hints: [
        'If you cannot describe why you chose your main technologies, research your own choices and fill in your reasoning before the interview',
        'The hardestChallenge section is what separates a tutorial follower from someone who actually built something — do not skip it',
        'The "what would you change" section should reference a specific technical concept, not just "better code organization"',
      ],
    },
  ],
  keyTakeaways: [
    'Describe projects by explaining decisions and challenges, not by listing features and technologies',
    'Always explain WHY you chose each major technology, not just what you chose',
    'The hardest challenge question is critical — name a specific problem, describe your debugging process, explain the solution',
    'Self-awareness about what you would do differently is a strength, not a weakness — every project has room for improvement',
    'Learning from a project means deep insights (understanding concepts, design lessons), not technology name-dropping',
    'For team projects, always describe your specific contribution — not what the team did collectively',
    'Know your projects deeply enough to answer follow-up questions — if you cannot, do not mention the project',
  ],
  prevLesson: 'self-introduction',
  nextLesson: 'teamwork-questions',
};
