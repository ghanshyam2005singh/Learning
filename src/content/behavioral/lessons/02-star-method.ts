import type { Lesson } from '@/types';

export const starMethodLesson: Lesson = {
  id: 'star-method',
  slug: 'star-method',
  title: 'The STAR Method',
  description:
    'Learn how to structure behavioral answers using the STAR method — and more importantly, learn when to use it, when not to use it, and how to make it sound natural instead of robotic.',
  category: 'Foundations',
  order: 2,
  difficulty: 'beginner',
  estimatedTime: 45,
  content: `The STAR method is the most widely taught framework for answering behavioral interview questions. You have probably heard of it. But most students apply it incorrectly — they either follow it so rigidly that their answers sound robotic, or they do not follow it at all and ramble without structure.

This module teaches you not just what STAR is, but how to use it like a tool instead of a crutch — adapting it to different question types while keeping your answer natural, specific, and genuinely human.

---

## What STAR Stands For

STAR is an acronym for a four-part story structure:

\`\`\`
S — Situation   What was the context?
T — Task        What was your specific responsibility?
A — Action      What did you actually do? (the most important part)
R — Result      What happened as a direct consequence?
\`\`\`

The structure exists for one reason: interviewers need to follow your story without getting lost. Without structure, most people either give too much background (endless context with no action) or jump straight to the action without any context (the interviewer has no idea what is happening).

STAR gives your answer a spine.

---

## Each Part in Depth

### S — Situation

The Situation sets the scene. It answers: "What was happening, and why does this story matter?"

**What to include:**
- Where you were (company, team, project, course)
- When it happened (rough timeframe — "during my internship last summer", "in my third year project")
- What the broader context was (what was the team trying to do?)
- What made this particular moment meaningful or challenging

**What NOT to include:**
- Excessive detail about the company's entire history
- Technical specifications that are not relevant to the story
- Long preambles about how you got to that role

**Target length:** 2-4 sentences. The Situation is not the story — it is the setup.

**Weak Situation:**
> "So I was working on this project and there were some problems with the team and it was getting complicated and we had been working on it for a while and the deadline was coming up..."

**Strong Situation:**
> "During my internship at a startup, our team of four was building a payment integration feature with a two-week deadline. Three days before launch, we discovered that our integration was failing for international credit cards."

See the difference. The strong version tells you immediately: who, what, when, and why it mattered.

---

### T — Task

The Task clarifies YOUR specific role in the situation. It answers: "What were you personally responsible for?"

This part matters because group projects, internships, and team environments involve multiple people. The interviewer wants to isolate your contribution from the team's contribution.

**What to include:**
- Your specific role or responsibility
- What was expected of you specifically
- Any constraints you were operating under (time, resources, authority)

**What NOT to include:**
- Restating the Situation
- What the team was doing if it is not directly relevant to your task

**Target length:** 1-3 sentences.

**Weak Task:**
> "We all had to fix the problem and make sure the payment worked."

**Strong Task:**
> "As the backend developer, I was responsible for diagnosing the root cause and implementing the fix. I had two days before a hard deadline that could not be moved because the client had a marketing campaign launching."

The strong version identifies your specific role and the constraint (two days, hard deadline).

---

### A — Action

The Action is the most important part of any STAR answer. This is where most students are weakest.

Action answers: "What did YOU specifically do, step by step?"

This is not the place for passive voice. Not "the bug was fixed." Not "we decided to." It is "I did X, then I did Y, and when Z happened, I did W."

**What to include:**
- The specific steps you took
- The decisions you made (and sometimes why you made them)
- How you handled obstacles or unexpected complications
- What you tried that did not work (this shows depth and problem-solving)

**What NOT to include:**
- What your team did (unless you directed it)
- Passive descriptions ("it was decided that...")
- Vague summaries ("I worked hard to fix it")

**Target length:** 4-8 sentences. This section deserves the most detail.

**Weak Action:**
> "I worked on finding the bug and eventually figured it out and fixed it so the payment integration would work."

**Strong Action:**
> "I started by reproducing the failure locally using test cards from international issuers. I found that the error was in how we were formatting the card expiry date — we were sending MM/YY but the payment gateway expected MMYY for non-US cards. I checked the API documentation and confirmed the format mismatch. I updated the formatter, wrote test cases for six different card formats, verified all six passed, and submitted a pull request with the fix. My manager reviewed it in thirty minutes and we merged it that evening."

The strong version shows reasoning, specific steps, technical detail, and professionalism (tests, PR, review). It is vivid. It is specific. It is believable.

---

### R — Result

The Result closes the loop. It answers: "What happened because of your actions?"

**What to include:**
- The direct outcome (did it work? did it ship? did the conflict resolve?)
- Quantified impact where possible (metrics, time saved, users affected)
- What you learned from the experience
- Long-term impact if relevant

**What NOT to include:**
- New problems that arose after (unless asked)
- Credit-sharing that dilutes your contribution

**Target length:** 2-4 sentences.

**Weak Result:**
> "It worked out and we launched the feature."

**Strong Result:**
> "We launched the payment integration on time. The feature processed over 400 transactions in the first week with zero payment failures. My manager cited this fix in my end-of-internship review as an example of independent problem-solving under pressure. I learned to always check API documentation against test cases before integration, not after."

The strong result includes: the outcome, a concrete metric (400 transactions, zero failures), external validation (the manager's review), and a personal learning.

---

## The Full STAR Answer — Before and After

**Question:** "Tell me about a time you solved a difficult technical problem."

**Without STAR (rambling):**
> "Yeah so there was this bug. It was a payment thing. We were all stressed. I went through the code and looked at a bunch of stuff and eventually found where the problem was. It took like two days. It was the formatting. We fixed it and launched."

This answer is five sentences and communicates almost nothing. The interviewer has no idea what you did, how you thought, or whether you can actually solve problems.

**With STAR (structured, specific):**
> "During my internship at a fintech startup, our team was building a payment integration with a two-week deadline. Three days before launch, we discovered that international credit card payments were failing silently.
>
> As the backend developer, I was responsible for diagnosing and fixing the issue within two days — the deadline was hard because the client had a marketing campaign launching.
>
> I started by reproducing the failure locally using international test cards. I traced the error to a date format mismatch: we were sending MM/YY but the payment gateway expected MMYY for non-US cards. I confirmed this in the API docs, updated the formatter, wrote test cases for six different card formats, verified all passed, and submitted a pull request that my manager reviewed and merged the same evening.
>
> We launched on time. The feature processed over 400 transactions in the first week with zero payment failures. My manager cited this as independent problem-solving under pressure in my end-of-internship review. I now always validate external API behavior against test cases before writing integration code."

This answer is compelling because it is specific. The interviewer can visualize the situation. They can follow the reasoning. They can see the result.

---

## When To Use STAR — And When Not To

STAR is designed for questions that begin with:
- "Tell me about a time when..."
- "Describe a situation where..."
- "Give me an example of..."
- "Walk me through a time you..."

These questions explicitly ask for a past experience and a story. STAR is perfect here.

**When STAR is NOT the right format:**

| Question Type | Example | Better Approach |
|---|---|---|
| Opinion questions | "What's your greatest strength?" | Direct answer + brief example, not a full story |
| Hypothetical questions | "What would you do if..." | Think through the scenario logically, mention past experience lightly |
| Simple factual questions | "What technologies have you used?" | Direct list with brief context |
| Motivation questions | "Why do you want this internship?" | Genuine reasons with supporting context |

Forcing STAR onto a question like "What is your greatest weakness?" sounds bizarre. "Situation: I existed. Task: To have a weakness. Action: I had a weakness. Result: I still have it sometimes." That is not a story — it is a category error.

Adapt the framework. Use it when it fits. Modify or skip it when it does not.

---

## Making STAR Sound Natural

The biggest complaint about STAR is that it produces robotic answers. Here is why that happens and how to fix it.

**Why STAR sounds robotic:**
- You memorized exact sentences
- You announce the structure ("Now for the Situation...")
- You have not internalized the story — you are reading from memory
- You do not adapt your tone to the conversational context

**How to make it sound natural:**
- Know your stories deeply, not word for word
- Tell it like you are explaining something to a friend, not presenting a report
- Use natural transitions: "So the context was...", "My specific job was...", "What I ended up doing was...", "The result was..."
- Let emotion in when appropriate — if the situation was stressful, it is fine to say "this was genuinely stressful"
- Allow the conversation to breathe — interviewers sometimes ask follow-up questions in the middle of your story. Welcome them.

STAR is a mental scaffold, not a script. The scaffold holds the structure. The words are yours.

---

## Practicing STAR: The Two-Track Exercise

Most people practice by going straight to full answers. That is too hard at first and produces over-rehearsed answers.

A better approach:

**Track 1: Outline practice**
Pick a story from your story bank. In 60 seconds, outline the four parts in bullet points. Do not write sentences. Just bullets. Then speak from the bullets.

\`\`\`
Story: Payment bug

S: Fintech internship, payment integration, 3 days before launch
T: Backend dev, responsible for fix, 2-day hard deadline
A: Reproduced locally → traced date format → found doc mismatch → fixed → wrote tests → PR
R: Launched on time, 400 transactions, zero failures, cited in review
\`\`\`

**Track 2: Verbal practice**
Set a 3-minute timer. Tell the story out loud, alone, using only the outline. Record yourself on your phone. Play it back. Listen for: vagueness, rambling, missing result, overuse of "we."

This is the fastest way to build a real answer that sounds natural.`,
  codeExamples: [],
  commonMistakes: [
    'Spending 60% of the answer on Situation and Task, leaving no time for Action and Result',
    'Using "we" throughout the Action section — the interviewer wants to know what YOU did',
    'Forgetting the Result entirely — many students end on the Action and leave the interviewer with no outcome',
    'Announcing the STAR structure ("Let me tell you the Situation...") which sounds robotic and unnatural',
    'Memorizing exact words rather than deeply knowing the story — this breaks when follow-up questions arrive',
    'Using STAR for questions that are not asking for a story, like opinion or motivation questions',
    'Giving vague Actions like "I worked on it" instead of specific, sequential steps that show how you think',
  ],
  interviewQuestions: [
    {
      question: 'Can you walk me through the STAR method and why it works?',
      answer:
        'STAR stands for Situation (context), Task (your specific role), Action (what you did step by step), and Result (what happened). It works because behavioral interviews require you to tell stories from your past, and stories need structure to be followable. Without structure, answers either ramble or lack context. STAR gives your answer a clear arc: setup, responsibility, action, outcome. The most important part is Action — that is where the interviewer sees how you actually think and work.',
      difficulty: 'beginner',
    },
    {
      question: 'How long should a STAR answer be?',
      answer:
        'Most STAR answers should be 90 seconds to 3 minutes. Shorter than 90 seconds usually means insufficient depth in the Action. Longer than 3 minutes usually means excessive Situation detail or storytelling tangents. The rough distribution: Situation 15%, Task 10%, Action 60%, Result 15%. Action deserves the majority of your time because it shows how you think, not just what happened.',
      difficulty: 'beginner',
    },
    {
      question: 'What is the difference between a strong STAR answer and a weak one?',
      answer:
        'A strong STAR answer is specific — it names real technologies, real constraints, real numbers. The Action section describes sequential steps, actual decisions, and how you handled complications. The Result includes a quantifiable or observable outcome and often a personal learning. A weak STAR answer is vague — generic context, "we did things," and "it worked out." The specificity is what creates credibility. Interviewers hear hundreds of vague answers. A specific answer stands out immediately.',
      difficulty: 'intermediate',
    },
  ],
  exercises: [
    {
      id: 'star-outline-practice',
      title: 'Build 3 STAR Outlines',
      description:
        'Take three stories from your story bank and outline each one using the STAR framework. Do not write full sentences yet — write bullet points for each section. Focus on making the Action section the most detailed. Then say each story out loud from your outline only.',
      starterCode: `// STAR OUTLINE PRACTICE
// Fill in bullets for each section — NOT full sentences

const story1 = {
  title: "Story title here",

  situation: [
    // Where? When? What was happening?
    // Keep to 2-3 bullets
  ],

  task: [
    // YOUR specific role and responsibility
    // What were YOU expected to do?
    // Any constraints (time, resources, authority)?
  ],

  action: [
    // This section should have the most bullets
    // What did you do FIRST?
    // What did you do NEXT?
    // What obstacle came up and how did you handle it?
    // What was the final step before the outcome?
  ],

  result: [
    // What happened because of your actions?
    // Any metrics or observable outcomes?
    // What did you learn?
  ],
};

const story2 = {
  // Same structure as story1
};

const story3 = {
  // Same structure as story1
};`,
      solution: `// Example of a completed STAR outline

const paymentBugStory = {
  title: "Payment integration bug fix during internship",

  situation: [
    "Fintech startup internship, summer",
    "Team of 4 building payment integration feature",
    "3 days before hard launch deadline, international card payments failing silently",
  ],

  task: [
    "I was the backend developer responsible for diagnosis and fix",
    "2-day hard deadline — client had marketing campaign launching",
    "No one else was available to help, I had to own this completely",
  ],

  action: [
    "Reproduced the failure locally using test cards from international issuers",
    "Traced the error to a date format mismatch in the card formatter",
    "We were sending MM/YY, gateway expected MMYY for non-US cards",
    "Verified format requirement in payment gateway API documentation",
    "Updated the card formatter function",
    "Wrote test cases for 6 different card formats (Visa, Mastercard, Amex — US and international)",
    "All 6 tests passed",
    "Submitted pull request — manager reviewed and merged same evening",
  ],

  result: [
    "Launched on time — no delay",
    "400+ transactions processed in first week, zero payment failures",
    "Manager cited this in end-of-internship review as example of independent problem-solving under pressure",
    "Learned: always validate external API behavior with test cases before writing integration code",
  ],
};

// Key: the Action section has 8 bullets. That is correct.
// It shows sequential thinking, a real obstacle, and how it was resolved.
// The Result has a metric (400 transactions), external validation, and a learning.`,
      hints: [
        'The Action section should always have the most bullets — aim for at least 5-6 specific steps',
        'If your Result does not have at least one concrete number or observable outcome, dig deeper',
        'Time yourself saying each story — if it is under 60 seconds, you are not going deep enough on the Action',
      ],
    },
    {
      id: 'star-identify-mistakes',
      title: 'Diagnose Weak STAR Answers',
      description:
        'Read the following weak STAR answers and identify exactly what is wrong with each one. Then rewrite the weakest part to make it strong.',
      starterCode: `// WEAK ANSWERS TO DIAGNOSE

const weakAnswer1 = {
  question: "Tell me about a time you worked under a tight deadline",
  answer: \`
    I was working on a project that had a deadline.
    My task was to complete my part on time.
    I worked hard and stayed late and got it done.
    We submitted on time and the professor gave us a good grade.
  \`,
  whatIsWrong: "", // Fill in what is wrong here
  rewrittenAction: "", // Rewrite the Action section to make it strong
};

const weakAnswer2 = {
  question: "Tell me about a time you failed",
  answer: \`
    We had a hackathon project and the team did not communicate well.
    We all tried our best but the system was not working at the end.
    We learned to communicate better next time.
  \`,
  whatIsWrong: "", // Fill in what is wrong here
  rewrittenAction: "", // Rewrite to show personal ownership
};`,
      solution: `const diagnosedAnswer1 = {
  question: "Tell me about a time you worked under a tight deadline",

  whatIsWrong: [
    "No specifics — no project name, no technology, no subject, no number of days",
    "Action is a single vague sentence: 'worked hard and stayed late' — this tells the interviewer nothing",
    "Result is vague: 'good grade' is not a result, it is a label. What grade? What did it prove?",
    "Uses 'we' for everything — where is the individual?",
  ],

  rewrittenAction: \`
    My specific responsibility was implementing the REST API for the authentication system in 48 hours.
    I broke the work into 4-hour blocks: schema design, endpoint implementation, JWT integration, testing.
    At hour 36, I discovered a bug in the token refresh logic — expired tokens were not being invalidated correctly.
    I debugged for 3 hours, found that I was checking token expiry against server time without timezone conversion,
    fixed the comparison, added a test for UTC edge cases, and had the API ready 2 hours before the deadline.
  \`,
};

const diagnosedAnswer2 = {
  question: "Tell me about a time you failed",

  whatIsWrong: [
    "The entire answer uses 'we' — the personal failure is invisible",
    "No specific action taken BY THE INDIVIDUAL to address the failure",
    "Result is vague and generic: 'learned to communicate better' is not a learning, it is a platitude",
    "No context — what hackathon? What were we building? When did it happen?",
  ],

  rewrittenPersonalOwnership: \`
    The communication failure was partly my responsibility. I was the team lead.
    I assumed everyone understood the interface contract between the frontend and backend — I never documented it.
    When we integrated at hour 22 of a 24-hour hackathon, nothing connected because we had built to different assumptions.
    Specifically: I learned that assumption is not communication.
    Since then, on every team project, I write a brief interface contract document on day one and share it with everyone before development starts.
  \`,
};`,
      hints: [
        'Any answer that uses "we" in the Action section is missing personal accountability',
        'Any Action section with fewer than 3 specific steps is not detailed enough',
        'Any Result that does not include a concrete outcome or a specific learning is incomplete',
      ],
    },
  ],
  keyTakeaways: [
    'STAR stands for Situation, Task, Action, Result — a framework for structuring behavioral answers',
    'Action is the most important part — it should take 60% of your answer and describe specific sequential steps',
    'Situation and Task are setup — keep them brief (2-4 sentences combined)',
    'Result must include a concrete outcome and often a personal learning — it is not optional',
    'Use "I" not "we" throughout the Action section — the interviewer wants to know your contribution specifically',
    'STAR is for story questions only — do not force it onto opinion, motivation, or hypothetical questions',
    'Practice by outlining stories in bullets first, then speaking from the outline — do not memorize scripts',
  ],
  prevLesson: 'introduction-to-behavioral-interviews',
  nextLesson: 'self-introduction',
};
