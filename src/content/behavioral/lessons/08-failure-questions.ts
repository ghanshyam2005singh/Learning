import type { Lesson } from '@/types';

export const failureQuestionsLesson: Lesson = {
  id: 'failure-questions',
  slug: 'failure-questions',
  title: 'Failure Questions',
  description:
    'Master the most feared behavioral question — "Tell me about your biggest failure." Learn why this question exists, what great answers look like, and how to discuss failure with honesty, ownership, and growth.',
  category: 'Behavioral Scenarios',
  order: 8,
  difficulty: 'intermediate',
  estimatedTime: 45,
  content: `"What is your biggest failure?"

Most candidates either panic at this question or give a fake non-failure disguised as humility: "My biggest failure is that I work too hard" or "I once failed to deliver early, I only delivered exactly on time."

Interviewers have heard these. They are not impressed.

The failure question is one of the most important questions in any behavioral interview. It reveals more about a person's character, self-awareness, and growth mindset than almost any other question. The candidates who answer it best are the ones who answer it honestly.

This module teaches you how to do that.

---

## Why Companies Ask This Question

Companies ask about failure for several specific reasons:

**1. To assess self-awareness**
A person who claims they have never failed, or cannot identify a real failure, lacks self-awareness. Self-aware people know where they have fallen short. This is a prerequisite for improvement.

**2. To evaluate ownership**
How someone talks about their failures reveals whether they take responsibility or deflect blame. "The project failed because my teammates were unreliable" is a very different profile from "The project failed partly because I did not set up clear communication from the start."

**3. To understand resilience**
Did you bounce back? Did you learn something? Did you internalize the lesson and apply it? Or did you collapse and avoid similar situations afterward?

**4. To detect honesty**
A candidate who cannot give a genuine failure answer is either not self-aware or is being dishonest. Neither is reassuring to a hiring team.

---

## What a Great Failure Answer Looks Like

A great failure answer has five properties:

**1. It is a real failure**
Not a disguised success, not a humble-brag. An actual situation where something went genuinely wrong.

**2. Your role is clear**
You name your specific contribution to the failure. Not "the team failed" — what did YOU do or not do?

**3. The response shows ownership without excuse-making**
You acknowledge what happened without blaming external factors. Acknowledging contributing factors is fine ("the deadline was unrealistic") but you should own your role in how things unfolded.

**4. There is a specific learning**
Not "I learned to communicate better." A specific, concrete insight: "I learned that assuming someone understood your message is not the same as confirming they did, and now I always send a brief written summary after important verbal conversations."

**5. Evidence of applying the learning**
Either a concrete change you made (a process, a habit, a rule) or a story of how you handled a similar situation better afterward.

---

## The STAR Format for Failure Questions

Failure questions use a slightly modified STAR structure:

\`\`\`
S — Situation:    Context of the failure (briefly)
T — Task:         What you were supposed to accomplish
A — Action:       What you did (including the decision or inaction that led to failure)
R — Result:       What actually happened (the failure)
+ L — Learning:   What you specifically learned
+ C — Change:     What concrete change you made afterward
\`\`\`

The Result section is often the hardest because it requires you to name the failure directly. "We got a C on the project" or "We missed the deadline by two weeks" or "The feature shipped with a bug that affected 20% of users." Specific. Real. Named.

---

## Types of Failures Worth Discussing

### Missed Deadline

\`\`\`
Good failure type: Clear outcome (the deadline was missed), clear contribution
(what led to the miss), clear learning (about estimation, scope, or communication)
\`\`\`

**Example:**
> "In my third year, I committed to delivering a working API for my team's project by a Friday. I did not deliver until the following Wednesday. My teammates had planned their integration work around my Friday commitment, so the slip cascaded — they were blocked for five days.
>
> Looking at what caused the slip: I had estimated the work based on how long I thought it would take if everything went smoothly. I did not account for the fact that I had never implemented OAuth2 before and would need to learn it while building. Two days of my estimated four were completely consumed by understanding the authorization flow.
>
> The learning was to never estimate something I have not done before without a discovery spike — a day or two of building just enough to understand the actual complexity before committing to a date.
>
> After that project, I applied this in every subsequent team situation. If someone asks when I can deliver something I have never built before, I now say: 'Give me one day to prototype it, then I will tell you the estimate.'"

---

### Bad Technical Decision

\`\`\`
Good failure type: Shows technical judgment developing, ownership of consequences,
and a concrete lesson about how you now make decisions differently
\`\`\`

**Example:**
> "When I built my first backend project, I decided to use MongoDB because someone in a YouTube comment said it was 'easier to start with.' I did not research when to use MongoDB versus SQL. I just started.
>
> By the time I had built the project halfway, I realized that all my data had relationships — users had posts, posts had comments, comments had likes — and I was manually implementing join-like logic in application code because MongoDB does not enforce or natively support relational queries. The code became unmanageable.
>
> I had to restart the database layer with PostgreSQL. That cost me two weeks.
>
> The specific learning was that technology choices are not aesthetic — they have real consequences that compound. And the way to make technology decisions is to understand the shape of your data and your access patterns first, then choose the tool that fits. I now spend at least an afternoon on this analysis before starting any project."

---

### Team or Communication Failure

\`\`\`
Good failure type: Shows interpersonal insight, takes personal responsibility
for a team outcome, demonstrates growth in how you communicate
\`\`\`

**Example:**
> "I was the de facto lead of a four-person project. A week before submission, I found out that one member had been struggling silently for three weeks — he had written code that did not work, was embarrassed to say so, and had hoped he could fix it before anyone noticed.
>
> We did not have time to fix his code. We submitted without that feature. We lost marks.
>
> I felt frustrated at first — why did he not say something? But then I asked myself: what environment had I created where he felt he could not? I had never checked in with him individually. I had never asked 'is anything blocking you?' — only 'is your part done?'. The first question invites honesty. The second only invites the answer 'yes.'
>
> Since then, whenever I work in a team I have a personal rule: at least once a week, I ask each person individually — not in the group — how they are getting on and whether anything is blocked. It costs five minutes per person and surfaces problems before they become crises."

---

### Rejection

Rejections are a different type of failure but worth discussing.

"I applied to [Company] twice and was rejected both times. The first time I was genuinely underprepared — I had learned the syntax of languages but had not built real things. I spent six months building three complete projects from scratch: a full-stack app, a CLI tool, and a deployed API. The second rejection stung more because I felt prepared. But the feedback was that my problem-solving explanation was unclear — I solved the problems but could not articulate my thinking. That is what led me to practice explaining my reasoning out loud. I recorded myself talking through solutions and noticed how often I said 'I just... figured it out' without any structure."

---

## What NOT to Say

**Do not say these things:**

1. "My biggest failure is that I am too much of a perfectionist."
   → This is a disguised strength, not a failure. Interviewers recognize this immediately.

2. "I do not think I have really failed at anything significant."
   → This signals either dishonesty or lack of self-awareness.

3. "The project failed because my teammate was not reliable."
   → Even if this is true, an answer that does not include your role in the failure signals that you do not reflect on your own contribution.

4. "I failed once but I would rather not go into the details."
   → Refusing to engage with the question is a red flag.

5. "I once delivered something late but the client was actually fine with it in the end."
   → This is not a failure — if the outcome was good, find a real failure.

---

## Tone and Emotional Register

How you emotionally present a failure matters. The right register is:

**Honest about the difficulty:** It is fine to say "this was genuinely hard" or "I was disappointed in myself." That is human.

**Calm and reflective:** You are describing something in the past that you have processed and learned from. You are not reliving the trauma. The distance shows growth.

**Not defensive:** If you feel the need to explain why it was not really your fault, check that feeling. Defensiveness undermines the story.

**Not self-flagellating:** The goal is growth, not punishment. You do not need to end the answer with "I am ashamed of this" or "I still feel terrible." You processed it, you learned, you moved on. That is the message.`,
  codeExamples: [],
  commonMistakes: [
    '"My biggest weakness is I work too hard" — disguised strengths are not failures, interviewers recognize them immediately',
    'Blaming teammates or external factors without owning your role in what happened',
    '"I cannot think of a real failure" — this signals dishonesty or lack of self-awareness',
    'The failure story having no concrete learning — "I learned to do better" is not a learning',
    'No evidence of applying the learning — what specific behavior or process changed afterward?',
    'Overly defensive tone — if you feel compelled to justify why it was not really your fault, check that',
    'Choosing a trivial failure — "I was 5 minutes late to a meeting once" — use something real with real consequences',
  ],
  interviewQuestions: [
    {
      question: 'What is your biggest failure?',
      answer:
        'Choose a real failure with genuine consequences. Name your specific contribution to it. Describe what happened honestly. Then spend the majority of your answer on what you learned specifically and what concrete change you made afterward — a process, a habit, a rule for future situations. The learning and the change are what make the story valuable.',
      difficulty: 'intermediate',
      tip: 'The best failure answers are the ones where you clearly grew from the experience. The failure becomes the foundation for something you do better today.',
    },
    {
      question: 'Tell me about a time you missed a deadline.',
      answer:
        'Name the deadline and how late you were. Describe the impact on the team or project. Be specific about what caused the miss — estimation error, unexpected complexity, poor communication? Own your contribution without excessive excuse-making. End with the specific change you made to how you estimate or communicate about delays.',
      difficulty: 'beginner',
    },
    {
      question: 'Have you ever made a bad technical decision? What happened?',
      answer:
        'Name the decision, explain why you made it at the time (what information or beliefs led you there), describe the consequences, and explain what you would do differently. The most compelling answers show that your reasoning was understandable given what you knew then, but you now have better judgment. This is growth — not stupidity.',
      difficulty: 'intermediate',
    },
    {
      question: 'What would your biggest critics say about you?',
      answer:
        'This is a failure question in disguise — it asks you to name a real weakness or blind spot. Give a genuine answer: a working style issue, a communication tendency, or a technical gap. Then acknowledge it directly and describe what you are doing about it. Candidates who say "I do not think I have critics" or give a disguised strength lose credibility immediately.',
      difficulty: 'intermediate',
    },
  ],
  exercises: [
    {
      id: 'failure-story-preparation',
      title: 'Prepare Your Failure Stories',
      description:
        'Identify 2-3 real failures from your experience. For each one, work through the full STAR+LC structure — Situation, Task, Action, Result, Learning, Change. Be honest. The goal is not to find a failure that makes you look good — it is to find one where you genuinely grew.',
      starterCode: `// FAILURE STORY PREPARATION

const failure1 = {
  type: "missed deadline | bad decision | team failure | rejection",

  situation: "", // Brief context

  task: "", // What were you supposed to accomplish?

  action: {
    whatYouDid: "", // The decision or inaction that contributed to the failure
    whatYouCouldHaveDoneInstead: "", // With hindsight
  },

  result: {
    whatActuallyHappened: "", // Be specific — name the consequence
    impactOnOthers: "", // Who was affected and how?
    yourFeelingAtTheTime: "", // Brief — shows you are human
  },

  learning: {
    specificInsight: "", // NOT "I learned to communicate better"
                        // Something concrete and nameable
  },

  change: {
    whatConcretelyChanaged: "", // A process, a habit, a rule
    evidenceYouAppliedIt: "", // Did you use it in a subsequent situation?
  },

  tonalCheck: {
    defensive: false, // Review your draft — are you making excuses?
    selfFlagellating: false, // Are you over-punishing yourself?
    growthMindset: true, // Does the answer end with learning and growth?
  },
};`,
      solution: `// Example complete failure story

const missedDeadlineFailure = {
  type: "missed deadline",

  situation: "Third-year group project. Team of four. I was responsible for the API layer.",

  task: "Deliver a working authentication API by Friday so my teammates could integrate their frontend the following week.",

  action: {
    whatYouDid: "Committed to the Friday deadline based on gut estimate without accounting for the fact that I had never implemented OAuth2 before. Spent two of my four days understanding the authorization flow — time I had not budgeted.",
    whatYouCouldHaveDoneInstead: "Built a small proof-of-concept OAuth2 flow before committing to the date, or committed to a date contingent on a one-day discovery spike.",
  },

  result: {
    whatActuallyHappened: "Delivered the API on Wednesday — five days late. Teammates were blocked for those five days waiting for the API.",
    impactOnOthers: "They had to compress two weeks of frontend integration work into nine days. They were stressed and I felt responsible.",
    yourFeelingAtTheTime: "Embarrassed and frustrated with myself. I had been confident about the estimate.",
  },

  learning: {
    specificInsight: "Estimation requires understanding the complexity first. 'I have never done X before' is a signal that I cannot estimate X — I need to spike it first. Time spent on discovery is not wasted; it is what makes commitments real.",
  },

  change: {
    whatConcretelyChanaged: "Personal rule: if someone asks for an estimate on something I have not built before, I say 'give me one day to prototype it and I will tell you a real estimate.' I no longer give estimates under time pressure for unfamiliar work.",
    evidenceYouAppliedIt: "In my internship three months later, my manager asked how long an OAuth integration would take. I asked for a day to spike it. The spike revealed it was more complex than expected — I estimated four days instead of two. I hit the estimate.",
  },

  tonalCheck: {
    defensive: false,
    selfFlagellating: false,
    growthMindset: true,
  },
};`,
      hints: [
        'Do a "blame check" after writing your failure story — count how many times you mention external factors vs your own decisions. If external > your decisions, rewrite.',
        'The learning should be specific enough that you could teach it to someone. "Communicate better" is not teachable. "Spike unknowns before estimating" is teachable.',
        'If you feel uncomfortable writing this story, that discomfort is a signal you are on the right track. Real failures feel uncomfortable. Fake failures do not.',
      ],
    },
  ],
  keyTakeaways: [
    'Failure questions assess self-awareness, ownership, resilience, and honesty — not whether you are perfect',
    'A great failure answer names a real failure, clarifies your role in it, shows ownership without excuse-making, and demonstrates a specific learning',
    'The learning must be concrete and specific — not "I learned to communicate better" but the actual insight',
    'The change must be evidence-based — what did you do differently afterward?',
    'Disguised strengths as failures are a red flag that interviewers immediately recognize',
    'The emotional register should be honest and calm — you processed this experience and grew from it',
    'Owning a failure fully is a sign of strength, not weakness — it signals self-awareness and professional maturity',
  ],
  prevLesson: 'problem-solving-questions',
  nextLesson: 'conflict-questions',
};
