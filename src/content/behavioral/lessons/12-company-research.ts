import type { Lesson } from '@/types';

export const companyResearchLesson: Lesson = {
  id: 'company-research',
  slug: 'company-research',
  title: 'Company Research',
  description:
    'Learn how to research a company before an interview — its products, engineering culture, team, and job description — so your answers are specific, genuine, and tailored rather than generic.',
  category: 'Preparation',
  order: 12,
  difficulty: 'beginner',
  estimatedTime: 35,
  content: `One of the clearest signals an interviewer can see within the first five minutes of a behavioral interview is whether you did your research.

Not because they expect you to know everything about the company. But because the quality of your research reveals the quality of your preparation — and preparation is a proxy for how you will approach your work.

This module teaches you what to research, where to find it, and how to use it in your answers.

---

## Why Research Matters

**It makes your answers specific**

"I want to work here because I admire your mission" is forgettable. "I read your engineering blog post about how you handle database sharding at your current scale, and that is exactly the kind of distributed systems problem I am trying to understand from the inside" is memorable.

The difference is research.

**It demonstrates genuine interest**

Any candidate can say they are excited. The ones who actually researched the company demonstrate it through specificity. You cannot fake knowing what is in an engineering blog post you read.

**It helps you tailor your stories**

If you know the company uses PostgreSQL, you can mention your PostgreSQL projects. If you know they have a large-scale real-time system, you can connect your WebSocket experience to that domain. Research lets you surface the most relevant parts of your experience.

**It gives you good questions to ask**

The strongest "questions for the interviewer" are rooted in specific research — not in curiosity about things you could have Googled.

---

## What to Research

### 1. The Product

Understand what the company builds and who uses it.

**Questions to answer:**
- What problem does their product solve?
- Who are their primary users? (businesses, developers, consumers)
- What is their core value proposition?
- Have you used the product or seen a demo?

**Why it matters:** Knowing the product lets you connect your technical work to real-world impact. "I built a real-time feature — I can see how that applies to the notification system in your product" is far more compelling than "I built a real-time feature."

---

### 2. The Engineering Culture

Understanding how the engineering team operates helps you tailor your answers and ask better questions.

**Where to find it:**
- Engineering blog (most tech companies have one)
- Engineering talks on YouTube or conference recordings
- GitHub (if they have open source projects)
- Glassdoor or Blind (employee reviews, not just ratings)

**Questions to answer:**
- Do they ship frequently or carefully?
- What is their philosophy on code quality and testing?
- Do they talk about their infrastructure, architecture, or specific engineering challenges publicly?
- What technologies do they use?

---

### 3. The Team and the People

If you know who is interviewing you, research them.

**Where to find it:**
- LinkedIn
- Their engineering blog author pages
- GitHub profiles
- Conference talk recordings

**What to look for:**
- What are they working on?
- What do they write about?
- What did they work on before this company?

You do not need to mention that you researched them — that can feel uncomfortable. But knowing their background can help you understand how to pitch your experience. A person who has worked on distributed systems will appreciate different things than someone who came from a startup.

---

### 4. The Job Description

Read the job description carefully — not to match keywords, but to understand what the role actually requires.

**What to extract:**
- The core responsibilities (not the boilerplate, the actual work)
- The specific skills they list as required vs preferred
- The type of problems the role addresses
- Any signals about team culture or work style

**How to use it:**
- Align your stories to the most relevant responsibilities
- If they mention "working in a fast-paced environment," prepare a story about handling rapid change
- If they mention "ownership," prepare an ownership story
- If they list specific technologies you know, be ready to discuss your experience with them

---

### 5. Recent News and Context

Understanding what is happening at the company right now shows that your interest is current, not just general.

**Where to find it:**
- Their blog and official announcements
- TechCrunch, The Information, or similar for funding/growth news
- Twitter/X or LinkedIn for company posts
- Hacker News discussions about the company

**What to look for:**
- Major product launches
- Recent engineering investments
- Open positions (hint at which teams are growing)
- Any engineering challenges they have discussed publicly

---

## How to Use Research in Your Answers

**In "Why do you want to work here?"**

Bad: "I admire what you are building."

Good: "I read your post on how you handled the transition from a monolith to services. The specific tradeoffs you described about service boundaries — particularly the discussion about where to draw the line between service independence and data duplication — are problems I have been reading about and want to understand from inside a real system."

**In your self-introduction**

Weak: "I applied because this role matches my skills."

Strong: "I have been building backend systems and I noticed your engineering team talks about reliability engineering in a way that matches exactly what I want to develop — specifically understanding how to build systems that degrade gracefully rather than failing completely."

**In your questions at the end**

Weak: "What does a typical day look like?"

Strong: "In your blog post about the data pipeline redesign, you mentioned that the original system had a single point of failure in the ingestion layer. How did you go about finding where to draw that boundary, and did you consider alternative approaches before the one you chose?"

---

## Research Checklist

Use this before every interview:

\`\`\`
COMPANY RESEARCH CHECKLIST

□ Product
  □ What is the main product?
  □ Who are the users?
  □ Have I seen a demo or tried the product?

□ Engineering culture
  □ Have I read their engineering blog? (at least 2 posts)
  □ Do I know their primary tech stack?
  □ Do I know one specific technical challenge they have described?

□ Team
  □ Do I know the interviewer's name and basic background?
  □ Do I know which team I would be joining?

□ Job description
  □ Have I identified the top 3 responsibilities?
  □ Have I mapped my stories to those responsibilities?
  □ Are there any technologies listed that I should be ready to discuss?

□ Recent context
  □ Have I checked for any recent news or announcements?
  □ Is there anything happening at the company that changes the context?

□ Questions prepared
  □ Do I have 3-4 questions ready that are rooted in research?
  □ None of my questions are answered on the website
\`\`\`

---

## Red Flags to Avoid

**Referencing the company About page as research**
"I am drawn to your mission to..." followed by what is clearly the first line of their About page signals that your research stopped at the website homepage.

**Faking familiarity with the product**
Do not say you use their product if you do not. If you have not used it, say so — and say what you know about it from research. Honesty is appreciated. Pretending to use something is not.

**Confusing the company with a competitor**
This happens when you are mass-applying. "I love how [Company] is building X" when actually competitor B is building X and [Company] is doing something different. Research prevents this.

**Questions that could embarrass the interviewer**
Do not ask questions that put the interviewer in an awkward position — about a recent controversy, a layoff, or an acquisition the company has not announced. Stick to engineering and team questions.

---

## Research Time Investment

For a serious application, spend at least 45-60 minutes on research before the interview:

- 20 minutes: Read 2-3 engineering blog posts
- 10 minutes: Understand the product (try it, or watch a demo/walkthrough)
- 10 minutes: Read the job description carefully and map your stories
- 10 minutes: Prepare 4-5 tailored questions
- 5 minutes: Check for recent news

For a company you are genuinely excited about, do more. For a company you are less certain about, this baseline is still respectful of the interviewer's time.`,
  codeExamples: [],
  commonMistakes: [
    'Using the company website\'s About page as your primary research source — interviewers can tell immediately',
    'Claiming to use the product when you have not — honesty about your familiarity is better than a discovered fabrication',
    'Asking questions in the interview that are answered on the company website — signals you did not prepare',
    'Not researching the specific role and job description — your stories should be tailored, not generic',
    'Mass-applying with no company-specific customization — the best candidates feel genuinely interested, not interchangeable',
    'Skipping research for companies you consider backups — every interview is practice and every impression matters',
  ],
  interviewQuestions: [
    {
      question: 'What do you know about our company?',
      answer:
        'Describe their product and who it serves. Mention one specific engineering challenge or decision you read about. Show that your research went beyond the website. End with a question or observation that connects their work to your experience or curiosity.',
      difficulty: 'beginner',
      tip: 'This question is often the first real opportunity to show you prepared. Do not waste it with "you build software that helps businesses" — be specific.',
    },
    {
      question: 'Have you used our product?',
      answer:
        'Be honest. If yes, describe your experience and what you observed. If no, explain what you know about it from research — demos, reviews, their own documentation. "No, but here is what I understand about it and here is what I found interesting" is a completely acceptable answer.',
      difficulty: 'beginner',
    },
    {
      question: 'What do you think about our technology stack?',
      answer:
        'This requires knowing their stack before the interview. If you have experience with their technologies, briefly describe your experience with them and what you would want to learn more of. If their stack includes something you are unfamiliar with, name it honestly and describe how you would approach learning it quickly.',
      difficulty: 'intermediate',
    },
  ],
  exercises: [
    {
      id: 'research-exercise',
      title: 'Complete a Full Company Research File',
      description:
        'Pick a company you are interested in applying to. Complete the full research checklist and fill in every section. The goal is to have a research document you could reference the night before an interview.',
      starterCode: `// COMPANY RESEARCH FILE
// Complete this for a specific company you are targeting

const companyResearch = {
  company: "",
  dateResearched: "",

  product: {
    whatTheyBuild: "",
    whoUsesIt: "",
    haveYouTriedIt: false,
    whatYouObserved: "",
  },

  engineering: {
    blogPostsRead: [
      // { title: "", keyInsight: "" }
    ],
    techStack: [],
    specificChallenge: "", // One technical challenge they have described publicly
    releaseVelocity: "", // Do they ship often? Carefully? What signals do you see?
  },

  team: {
    interviewerName: "",
    interviewerBackground: "", // Brief — current role, past companies
    teamIAmJoining: "",
  },

  jobDescription: {
    topThreeResponsibilities: [],
    requiredSkillsIHave: [],
    requiredSkillsToImprove: [],
    storiesImapping: [
      // { responsibility: "", myStory: "" }
    ],
  },

  recentNews: [
    // { what: "", when: "", relevance: "" }
  ],

  questionsForThem: [
    // { question: "", why: "Why this is a good question based on your research" }
  ],
};`,
      solution: `// Example completed research file

const exampleResearch = {
  company: "Notion",
  dateResearched: "Before interview",

  product: {
    whatTheyBuild: "All-in-one workspace for notes, docs, databases, and project management",
    whoUsesIt: "Knowledge workers, developers, startups — people who want flexible, structured personal and team organization",
    haveYouTriedIt: true,
    whatYouObserved: "Rich block-based editor with database views, real-time sync across devices, complex relationship features between database entries",
  },

  engineering: {
    blogPostsRead: [
      { title: "Herding elephants: Lessons learned from sharding Postgres at Notion", keyInsight: "At scale, they had to shard PostgreSQL by tenant, which meant cross-shard queries became complex — they chose to denormalize some data rather than do distributed joins" },
      { title: "The Great Table Redesign", keyInsight: "Original table implementation was not accessible and could not handle complex features — full redesign with accessibility as a first-class constraint" },
    ],
    techStack: ["TypeScript", "React", "PostgreSQL", "Redis", "Kubernetes"],
    specificChallenge: "Real-time collaborative editing with conflict resolution — many clients editing the same document simultaneously",
    releaseVelocity: "Regular product updates; engineering blog posts suggest long-term architectural investment alongside feature shipping",
  },

  questionsForThem: [
    {
      question: "In the Postgres sharding post, you chose to denormalize some data rather than handle cross-shard joins. How has that tradeoff played out over time — has denormalization created maintenance challenges you did not anticipate?",
      why: "Shows I read the specific post, understood the decision, and am curious about long-term consequences rather than just the decision itself",
    },
    {
      question: "How do you think about the conflict resolution model for real-time collaboration — have you moved closer to CRDT approaches or is the current architecture handling the scale well?",
      why: "Connects to a genuine technical curiosity and shows I have thought about the underlying problem",
    },
  ],
};`,
      hints: [
        'Start with the engineering blog — most interesting companies publish technical posts that give you far more insight than the website',
        'The "storiesImapping" field is the most actionable — knowing which of your stories maps to which responsibility lets you lead with the most relevant material',
        'Research should take 45-60 minutes minimum for a company you are serious about — if you cannot spend that time, ask yourself whether you are genuinely interested',
      ],
    },
  ],
  keyTakeaways: [
    'Company research transforms generic answers into specific, memorable ones — the difference is what you know about them',
    'Research at least the product, the engineering culture (blog), the job description, and the interviewer',
    'Use research actively: connect your stories to their specific challenges, use their technologies as context, ask questions rooted in what you read',
    'At minimum: read 2-3 engineering blog posts, understand the product, map your stories to the top job responsibilities, prepare 4 questions',
    'Never fake using the product — be honest about what you know and do not know',
    'Questions rooted in research are the best questions — they show curiosity, preparation, and genuine interest in the company\'s work',
  ],
  prevLesson: 'internship-questions',
  nextLesson: 'workplace-scenarios',
};
