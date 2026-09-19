import type { Lesson } from '@/types';

export const selfIntroductionLesson: Lesson = {
  id: 'self-introduction',
  slug: 'self-introduction',
  title: 'Self Introduction',
  description:
    'Master the "Tell me about yourself" question for every context — student, fresher, internship seeker, and beyond. Learn to tell your story in a way that is genuine, memorable, and strategically positioned.',
  category: 'Core Questions',
  order: 3,
  difficulty: 'beginner',
  estimatedTime: 40,
  content: `"Tell me about yourself."

It sounds like the easiest question in any interview. It is almost always the first question. You have your entire life as material. And yet — most candidates give the worst answer of the entire interview right here.

They either recite their resume chronologically ("I was born in... I completed my 10th from... then I did my 12th from... then I joined college..."), or they give a vague summary that says nothing ("I am a passionate developer who loves coding and solving problems").

Both are wrong. This question is an opportunity. It is the one moment in the interview where you control the narrative completely. Use it well.

---

## What the Interviewer Is Actually Asking

"Tell me about yourself" is not asking for your biography. It is asking:

- Who are you professionally?
- What have you done that is relevant to this role?
- Why are you here, talking to us, today?
- Are you someone I want to spend an hour with in this interview?

The interviewer uses your answer to decide the direction of the rest of the interview. If you mention a project, they will ask about it. If you mention a skill, they may probe it. Your introduction is not just an answer — it is a menu. Present what you want to be asked about.

---

## The Framework: Present → Past → Future

The most effective self-introduction follows a simple three-part structure:

\`\`\`
PRESENT → PAST → FUTURE

Present: Who you are right now, your strongest current positioning
Past:    The relevant experiences that got you here
Future:  Why this role, this company, and why now
\`\`\`

This structure is natural and forward-looking. It does not start with your birth or your 10th board exam. It starts with who you are today, explains how you got there, and ends with where you want to go — which lands directly in the interviewer's lap as your motivation for being there.

---

## The Four Versions

Your self-introduction should be adapted based on where you are in your academic/professional journey.

---

### Version 1: Student (No Experience Yet)

Used when: You have no internship, no significant projects, no real work experience. You are in your 1st or 2nd year.

**What to emphasize:**
- What you are currently learning and why you chose it
- Any courses, side projects, or self-learning
- What you are building toward
- Your curiosity and initiative

**Example:**
> "I am a second-year computer science student at [College]. Right now I am focused on building strong fundamentals — I have completed my data structures course and I am currently learning JavaScript and React through personal projects. I built a small task management app recently to understand how React state works in practice. I am interested in this internship because I want to see how real teams build software, not just how courses describe it."

**Why this works:**
- It does not apologize for having no experience
- It shows initiative (self-learning, personal projects)
- It connects the motivation to the opportunity specifically

---

### Version 2: Fresher (Final Year / Just Graduated)

Used when: You are in your final year or have just graduated. You have academic projects, possibly hackathons, possibly a short internship.

**What to emphasize:**
- Your strongest project (lead with it)
- Relevant technical skills you have built
- What problem you want to solve in your career
- Why this company or this type of role

**Example:**
> "I am a final-year computer science student at [College], specializing in full-stack web development. My most significant project is a real-time collaboration tool I built during my final year — it handles concurrent document editing using WebSockets and stores data in PostgreSQL. I have also done a two-month internship at a logistics startup where I built REST APIs in Node.js that are still in production. I am looking for a backend-focused role where I can work on systems that handle real traffic at scale, and [Company] caught my attention because of how you approach distributed architecture."

**Why this works:**
- Leads with the strongest credential (a real project in production from an internship)
- Names specific technologies
- Shows direction (backend, scale) not just a generic desire to "work in software"
- Connects to the company specifically

---

### Version 3: Internship Seeker (Applying Mid-Degree)

Used when: You are specifically applying for an internship. You have some learning, maybe a personal project, and you are clear about what you want to learn.

**What to emphasize:**
- What you can already do
- What you want to learn (companies want interns who know what they want to get out of it)
- A specific project that shows you can build
- Fit with the company's domain or technology stack

**Example:**
> "I am a third-year CS student at [College]. I have been learning web development for about a year — I am comfortable with JavaScript, React, and basic Node.js. I built a recipe management app last semester where I handled the entire stack myself: authentication, a PostgreSQL database, and a React frontend deployed on Vercel. I am looking for a frontend or full-stack internship where I can contribute to a real product and learn how production-grade code is structured. I applied here because I have been following your product and I am genuinely curious about how your recommendation engine is built."

**Why this works:**
- Honest about level (comfortable with X, learning Y)
- Shows a complete project from start to deployment
- Knows what they want to learn — this matters enormously to internship teams
- The last line shows the candidate did research and is genuinely curious

---

### Version 4: Experienced (Post-Internship or After Some Work)

Used when: You have completed one or more internships, or have some years of professional experience.

**What to emphasize:**
- The most impactful thing you have done professionally
- What you own and what impact it had
- The direction you are headed
- Why this company, specifically

**Example:**
> "I have been a backend developer for about a year and a half, mostly at a Series B fintech startup where I worked on the payments infrastructure. The most significant thing I built there was a webhook delivery system that needed to guarantee delivery even during server failures — I implemented it using Redis streams and got it to 99.97% delivery reliability. I am looking for a role where I can go deeper into distributed systems and work on infrastructure that operates at larger scale. [Company]'s engineering blog on how you handle database sharding is exactly the kind of problem I want to work on."

**Why this works:**
- Leads with a concrete, specific achievement with a metric
- Shows ownership ("I built", "I implemented")
- Names the direction clearly (distributed systems, infrastructure, scale)
- References company research that is genuine and specific

---

## Common Mistakes

**Mistake 1: Starting from the beginning of your life**

No one needs to know where you were born, which school you attended before college, or that you have always been passionate about computers since you were 7. Start from where you are relevant to this role, right now.

**Mistake 2: Reciting the resume**

The interviewer has your resume. If you simply read it back to them, you have wasted the introduction. The introduction is your narrative — the story that connects the resume's dots.

**Mistake 3: Being vague about your skills**

"I know many programming languages and have experience in different areas" — this says nothing. Name the specific technologies, the specific projects, the specific problems you have solved.

**Mistake 4: Being too long**

A self-introduction should be 60 to 120 seconds. Two minutes maximum. If you are going past that, you are in biography territory. The interview is a conversation — your introduction opens it, it does not replace it.

**Mistake 5: Not connecting to the company**

The last part of your introduction should mention why this company or this role specifically. "I am interested in software engineering" is not a reason. "I am interested in how [Company] is approaching X problem because I have been working on Y" — that is a reason.

**Mistake 6: Apologizing for your background**

"I do not have much experience, but..." — stop. Do not frame yourself with an apology. Frame yourself with what you have done and what you want to do. The interviewer knows you are a fresher. They invited you anyway.

---

## The 60-Second vs 90-Second vs 2-Minute Version

You should have three versions ready:

**60-second version:** Used in phone screens, campus drives, or when you sense the interviewer wants to move quickly. Hit the three parts fast: current status, strongest credential, why here.

**90-second version:** The default. Most behavioral interviews. Present → Past → Future with enough detail to give the interviewer material to work with.

**2-minute version:** Used when the interviewer explicitly says "take your time" or in senior-level interviews where more depth is expected. Include more context about a project or achievement, and more specificity about your direction.

Practice all three. Know which one to deploy.

---

## The Ending Matters

Your introduction should not just trail off. End it actively — create a bridge to the conversation.

**Passive ending (weak):**
> "...and that's basically it about me."

**Active ending (strong):**
> "...I would love to talk more about the backend architecture work I did there if it is relevant to this role."

Or:
> "...I looked at [Company]'s engineering blog and was particularly curious about [specific post]. That is part of why I applied."

The active ending shows you have thought, shows curiosity, and invites a conversation rather than waiting passively for the next question.`,
  codeExamples: [],
  commonMistakes: [
    'Starting from birth or early schooling — begin from your current professional positioning',
    'Reciting the resume chronologically — the introduction is your narrative, not your CV read aloud',
    'Being vague about skills: "I know many languages" — name specific technologies and specific projects',
    'Going over 2 minutes — the introduction opens the conversation, it does not replace it',
    'Not mentioning why this company specifically — connecting to the opportunity shows research and genuine interest',
    'Apologizing for your background with phrases like "I do not have much experience but..." — frame what you have, not what you lack',
    'Ending passively with "...that is basically it" — end actively with a bridge to the conversation',
  ],
  interviewQuestions: [
    {
      question: 'Tell me about yourself.',
      answer:
        'Use the Present → Past → Future framework. Start with who you are right now (role, current focus), then the relevant experience that built that (key project, internship, skills developed), then why you are here (what you want to learn or build and how this company fits). Keep it 90 seconds. End with a specific connection to the company or role. Do not recite your resume. Name specific projects and technologies.',
      difficulty: 'beginner',
      tip: 'The last sentence of your introduction should connect specifically to the company or role. Do your research before the interview so this is genuine, not generic.',
    },
    {
      question: 'Walk me through your background.',
      answer:
        'Same as "tell me about yourself" but slightly more detailed, particularly on the progression. What did you study, what did you build, what experience have you had, and how did each step lead to the next? The interviewer wants to understand the arc of your development. Keep it forward-looking — end at where you are today and why you are interested in this opportunity.',
      difficulty: 'beginner',
    },
    {
      question: 'Why did you choose computer science / software engineering?',
      answer:
        'Be specific and genuine. A story about your first programming experience or a project that made you realize you wanted to do this is far more compelling than "I have always loved technology." The best answers name a specific moment or project that solidified the decision and connect it to what you are doing today.',
      difficulty: 'beginner',
      tip: 'Avoid clichés like "technology is the future" or "I have always been passionate about computers." These tell the interviewer nothing about you specifically.',
    },
  ],
  exercises: [
    {
      id: 'write-your-introduction',
      title: 'Write All Four Versions of Your Introduction',
      description:
        'Write your self-introduction for each context version (student, fresher, internship seeker, or whichever applies to you now). Then time yourself saying it out loud. Adjust until it sounds natural — not like you are reading a script.',
      starterCode: `// YOUR SELF-INTRODUCTION TEMPLATES
// Fill in with your real information

const myIntroduction = {

  // Which version applies to you?
  context: "student | fresher | internship | experienced",

  // 60-SECOND VERSION (for phone screens, fast paced interviews)
  sixtySecond: \`
    [Who you are right now — one sentence]
    [Your strongest credential — one sentence]
    [Why this company or role — one sentence]
  \`,

  // 90-SECOND VERSION (default for most interviews)
  ninetySecond: \`
    [Present: who you are, current focus]

    [Past: relevant experience — project, internship, skills built]
    Specific technology/project name: [fill in]
    What you built or did: [fill in]

    [Future: why here, why now]
    Connection to this company: [fill in — be specific]

    [Active ending — bridge to conversation]
  \`,

  // What topics do you WANT the interviewer to ask about?
  // These should be the things you mention in your introduction
  menuItems: [
    // Project 1: [name and one-line description]
    // Project 2: [name and one-line description]
    // Skill you are proud of:
    // Experience you want to discuss:
  ],
};`,
      solution: `// Example — Internship Seeker Version

const internshipSeekerExample = {
  context: "internship",

  sixtySecond: \`
    I am a third-year CS student at BITS Pilani, focused on full-stack web development.
    I built a complete expense tracker with React, Node.js, and PostgreSQL — from auth to deployment on Vercel.
    I applied here because I want to see how a team like yours builds for scale, and I have been following how you handle data pipelines on your engineering blog.
  \`,

  ninetySecond: \`
    I am a third-year computer science student at BITS Pilani.
    For the past year I have been teaching myself full-stack web development — not through courses alone,
    but by building things. The project I am most proud of is an expense tracker I built completely solo:
    React frontend, Node.js with Express backend, PostgreSQL for storage, JWT authentication, and deployed on Vercel.
    I had to figure out every part myself — including debugging a race condition in concurrent expense submissions
    that took me three days to find and fix.

    I am looking for a backend or full-stack internship where I can contribute to a real product while learning
    how production systems handle things I have not encountered yet — like caching strategies, background jobs,
    and working with a codebase much larger than anything I have built alone.

    [Company] caught my attention because of how your team talks about your data architecture on the engineering blog.
    I would love to contribute to something in that space.
  \`,

  menuItems: [
    "Expense tracker project — built solo, all layers, had to debug a race condition",
    "Self-taught approach — why I learn by building, not just by watching",
    "PostgreSQL and data modeling — genuinely interested in databases",
    "What I want to learn in the internship — honest answer about gaps I want to close",
  ],
};

// Key insight: the "menu items" are deliberate choices.
// By mentioning the race condition, you signal: ask me about debugging.
// By mentioning the engineering blog, you signal: ask me about my research into the company.
// You are steering the conversation.`,
      hints: [
        'Time yourself saying your introduction out loud. If it is over 2 minutes, cut it. If it is under 60 seconds, go deeper on one project or skill.',
        'Your introduction should sound like you talking to a smart colleague, not presenting a report. Read it out loud and adjust anything that sounds unnatural.',
        'The "menu items" exercise is key — decide what you want to be asked about and make sure you mention it. The interviewer will follow your lead.',
      ],
    },
  ],
  keyTakeaways: [
    'Use Present → Past → Future structure: who you are now, what experience built that, why you are here',
    'Adapt your introduction to your context: student, fresher, internship seeker, or experienced professional',
    'Name specific projects and technologies — vague claims are forgettable, specific details are memorable',
    'Keep it 90 seconds in most cases — the introduction opens the conversation, it does not replace it',
    'The last sentence should connect specifically to the company or role — show you did your research',
    'Your introduction is a menu — mention what you want the interviewer to ask about',
    'End actively, not passively — create a bridge to the conversation rather than trailing off',
  ],
  prevLesson: 'star-method',
  nextLesson: 'project-discussions',
};
