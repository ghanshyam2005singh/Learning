import type { Lesson } from '@/types';

export const introToBehavioralLesson: Lesson = {
  id: 'introduction-to-behavioral-interviews',
  slug: 'introduction-to-behavioral-interviews',
  title: 'Introduction to Behavioral Interviews',
  description:
    'Understand what behavioral interviews really are, why companies rely on them, and what interviewers are actually evaluating — so you stop guessing and start preparing with clarity.',
  category: 'Foundations',
  order: 1,
  difficulty: 'beginner',
  estimatedTime: 30,
  content: `Most students prepare for technical interviews — DSA, system design, coding problems. They spend months solving LeetCode. Then they walk into a behavioral round and freeze because someone asks: "Tell me about a time you failed."

Behavioral interviews are not softer versions of technical interviews. They are a completely different type of evaluation — and they are just as important. Many companies eliminate candidates at the behavioral stage even when their technical skills are strong.

This module gives you the foundation. You will understand what is actually happening in a behavioral interview so you can prepare for it correctly instead of winging it.

---

## What Is a Behavioral Interview?

A behavioral interview is a structured conversation where the interviewer asks about your **past experiences** to predict how you will behave in **future situations**.

The core assumption is simple: **past behavior is the best predictor of future behavior.**

If you have successfully managed a difficult teammate before, you are more likely to handle team conflict well in the future. If you have recovered from a failure by owning the mistake and fixing it, you are likely to do that again.

This is fundamentally different from technical interviews where you solve a hypothetical problem in real time. In behavioral interviews, you are mining your own history and telling stories from it.

---

## Why Companies Ask Behavioral Questions

Companies use behavioral interviews for several concrete reasons.

**1. Technical skills are table stakes**

By the time you reach a behavioral round, the company already knows you can code. The question is whether you can work with people, handle pressure, communicate clearly, and grow from setbacks. A brilliant engineer who cannot collaborate, communicate, or take ownership is a liability.

**2. Culture fit matters operationally**

Culture is not about ping pong tables. It is about how people make decisions, handle disagreements, treat teammates, and react under pressure. Companies have learned that a culture mismatch creates expensive problems — turnover, team conflict, low morale. Behavioral interviews help them evaluate fit before a bad hire happens.

**3. Leadership potential is hard to assess technically**

Most companies want to hire people who will eventually take on more responsibility. Behavioral interviews reveal whether someone takes ownership, mentors others, makes independent decisions, or waits to be told what to do.

**4. Communication skill directly impacts team output**

A developer who cannot explain their thinking, cannot write clear documentation, or cannot discuss technical tradeoffs with non-engineers reduces team velocity. Behavioral interviews surface communication quality in a way technical interviews cannot.

---

## What Interviewers Are Actually Evaluating

When an interviewer asks a behavioral question, they are not just listening to your story. They are evaluating you across multiple dimensions simultaneously.

\`\`\`
BEHAVIORAL INTERVIEW EVALUATION DIMENSIONS

┌─────────────────────┬──────────────────────────────────────────────────────┐
│ Dimension           │ What They Are Looking For                            │
├─────────────────────┼──────────────────────────────────────────────────────┤
│ Ownership           │ Do you take responsibility or do you blame others?   │
├─────────────────────┼──────────────────────────────────────────────────────┤
│ Communication       │ Can you explain situations clearly and concisely?    │
├─────────────────────┼──────────────────────────────────────────────────────┤
│ Growth mindset      │ Do you learn from mistakes or repeat them?           │
├─────────────────────┼──────────────────────────────────────────────────────┤
│ Impact              │ Did your actions actually change something?           │
├─────────────────────┼──────────────────────────────────────────────────────┤
│ Collaboration       │ Can you work with people you disagree with?          │
├─────────────────────┼──────────────────────────────────────────────────────┤
│ Self-awareness      │ Do you know your strengths and honest weaknesses?    │
├─────────────────────┼──────────────────────────────────────────────────────┤
│ Leadership          │ Do you take initiative or wait to be told?           │
├─────────────────────┼──────────────────────────────────────────────────────┤
│ Resilience          │ How do you behave under pressure or after failure?   │
└─────────────────────┴──────────────────────────────────────────────────────┘
\`\`\`

Notice what is NOT on this list: whether you got the right answer, whether your solution was optimal, whether you used the correct algorithm. None of that matters here.

What matters is character, pattern of behavior, and self-awareness.

---

## What a Good Behavioral Answer Looks Like

A good behavioral answer has three qualities:

**1. It is specific**

"I am a good team player" is not an answer. "During my final year project, my teammate was inconsistent with deadlines. I scheduled a one-on-one, asked if something was wrong, and we discovered he was dealing with a family issue. We redistributed the work and delivered on time" — that is an answer.

Specificity creates believability. Generalities create doubt.

**2. It has a clear story arc**

A good answer has a beginning (context), middle (what you did), and end (what happened). Without this structure, the interviewer loses the thread and gets a weak impression.

**3. You played an active role**

Interviewers want to know what **you** did, not what your team did. "We built the feature" is weak. "I designed the database schema and led the backend implementation while my teammate handled the frontend" is strong.

---

## Common Mistakes Students Make

**Mistake 1: Giving generic answers**

"I am hardworking and dedicated" is a generic answer. It sounds like every other candidate. Specific stories with real details are far more convincing.

**Mistake 2: Focusing on what went wrong instead of what they did**

When asked about a failure, students often spend 80% of the answer describing the problem and 20% describing what they did about it. It should be the opposite.

**Mistake 3: Making the answer about the team instead of themselves**

"Our team worked hard and we solved it" — where are you in this story? The interviewer wants to know your contribution specifically.

**Mistake 4: Memorizing scripted answers**

Interviewers ask follow-up questions. If you memorized a script, you will freeze when the follow-up question breaks the script. Understand your stories deeply, do not memorize them word for word.

**Mistake 5: Skipping the result**

Many students tell the situation and the action but forget to tell what happened. The result is often the most important part — it demonstrates that your actions actually had impact.

**Mistake 6: Being too negative or too positive**

Being too negative ("I completely failed and never recovered") suggests poor resilience. Being too positive ("Everything always works out when I'm involved") suggests poor self-awareness. The most credible answers acknowledge real difficulty and real growth.

---

## The Difference Between HR Rounds, Behavioral Rounds, and Culture Rounds

These terms are sometimes used interchangeably but they have different focuses.

**HR Round**
- Conducted by HR professionals, not engineers
- Focuses on: salary expectations, notice period, cultural alignment, company knowledge, motivation
- Questions like: "Why do you want to join us?" "Where do you see yourself in 5 years?" "What are your salary expectations?"

**Behavioral Round**
- Conducted by senior engineers, engineering managers, or team leads
- Focuses on: past behavior, problem solving, teamwork, leadership, failure
- Questions like: "Tell me about a time you disagreed with your manager." "Describe your most challenging project."

**Culture Round**
- Conducted by cross-functional team members or senior leadership
- Focuses on: alignment with company values, communication style, team dynamics
- Questions like: "What kind of team environment makes you most productive?" "What does ownership mean to you?"

Preparing for behavioral interviews prepares you for all three because the underlying skill — telling clear, specific stories about your experience — applies across all of them.

---

## How To Build Your Story Bank

The most important preparation you can do is build a **story bank** — a collection of real experiences from your own life that you can use as raw material for answers.

Your story bank should include:

\`\`\`
STORY BANK CATEGORIES

1. Technical achievement story (built something difficult)
2. Leadership story (took initiative, led without authority)
3. Conflict story (disagreement with teammate or manager)
4. Failure story (something went wrong, how you recovered)
5. Learning story (picked up a new skill quickly)
6. Collaboration story (worked well with a team)
7. Ambiguity story (unclear requirements, how you handled it)
8. Deadline story (tight timeline, how you prioritized)
9. Project story (your most significant project in detail)
10. Self-improvement story (identified weakness, worked on it)
\`\`\`

You do not need ten separate stories — five or six well-developed stories can often be adapted to answer many different questions by emphasizing different parts.

In the next modules, you will learn the STAR method (how to structure these stories) and then apply it to every type of behavioral question you will face.

---

## The Right Mindset Going In

Before you answer your first behavioral question, adjust your mindset:

**This is not a test with right answers.** There is no correct story. There is only your story, told clearly and honestly.

**Authenticity beats perfection.** An interviewer who has spoken to hundreds of candidates can immediately detect a rehearsed, inauthentic answer. A genuine story about a real difficulty — even if it ended imperfectly — is far more compelling than a polished story that sounds fabricated.

**You have more material than you think.** Students often say "I have no experience." That is almost never true. Class projects, hackathons, freelance work, internships, open source contributions, tutoring others — all of it is legitimate material. Even working in a college club or organizing an event involves teamwork, leadership, conflict, and decision making.

Your job is not to invent impressive stories. Your job is to tell your real stories clearly, specifically, and with self-awareness.`,
  codeExamples: [],
  commonMistakes: [
    'Giving vague, generic answers like "I am a team player" instead of specific stories',
    'Spending too much time on what went wrong instead of what you did about it',
    'Using "we" constantly when the interviewer wants to know what YOU specifically did',
    'Memorizing scripted answers that fall apart when follow-up questions are asked',
    'Forgetting to include the result — the outcome of your actions',
    'Claiming to have no experience when class projects, hackathons, and clubs all count',
  ],
  interviewQuestions: [
    {
      question: 'What is a behavioral interview and how is it different from a technical interview?',
      answer:
        'A behavioral interview evaluates past behavior to predict future behavior. The interviewer asks about real experiences from your history — how you handled conflict, failure, leadership, teamwork. Unlike technical interviews where you solve hypothetical problems in real time, behavioral interviews ask you to mine your own experience and tell stories from it. The core assumption is: past behavior is the best predictor of future behavior.',
      difficulty: 'beginner',
    },
    {
      question: 'Why do companies conduct behavioral interviews even for technical roles?',
      answer:
        'Technical skills are necessary but not sufficient. Companies need engineers who can collaborate, communicate, take ownership, handle failure, and grow. A brilliant engineer who cannot work with people creates team problems that technical skill cannot fix. Behavioral interviews evaluate character, communication, leadership potential, and culture fit — things that directly impact team productivity and retention.',
      difficulty: 'beginner',
    },
    {
      question: 'What are the most important dimensions interviewers evaluate in behavioral interviews?',
      answer:
        'The key dimensions are ownership (do you take responsibility?), communication (can you explain situations clearly?), growth mindset (do you learn from mistakes?), impact (did your actions change something?), collaboration (can you work with difficult people?), self-awareness (do you know your real strengths and weaknesses?), leadership (do you take initiative?), and resilience (how do you behave under pressure?).',
      difficulty: 'intermediate',
    },
  ],
  exercises: [
    {
      id: 'build-story-bank',
      title: 'Build Your Personal Story Bank',
      description:
        'Map out your real experiences into story categories. Do not write polished answers yet — just identify raw material. What projects, situations, and experiences do you have that fit each category? Be honest. Include class projects, hackathons, clubs, part-time work, open source, tutoring — anything real.',
      starterCode: `// YOUR PERSONAL STORY BANK
// Fill in real experiences from your own life

const myStoryBank = {
  technicalAchievement: {
    situation: "", // What was the context?
    whatYouBuilt: "", // What exactly did you build or solve?
    difficulty: "", // What made it hard?
    outcome: "", // What was the result?
  },

  leadership: {
    situation: "", // When did you lead without being told to?
    whatYouDid: "", // What initiative did you take?
    outcome: "", // What changed because of your leadership?
  },

  conflict: {
    situation: "", // What was the disagreement?
    whoWasInvolved: "", // Who did you disagree with?
    whatYouDid: "", // How did you handle it?
    outcome: "", // How did it end?
  },

  failure: {
    whatHappened: "", // What went wrong?
    yourRole: "", // What was your responsibility in it?
    whatYouDid: "", // How did you respond?
    whatYouLearned: "", // What specifically did you learn?
  },

  collaboration: {
    teamContext: "", // What team were you part of?
    challenge: "", // What collaboration challenge existed?
    yourContribution: "", // What did YOU specifically contribute?
    outcome: "", // How did the team do?
  },
};`,
      solution: `// Example — a real story bank entry (not a template to copy)

const exampleStoryBank = {
  technicalAchievement: {
    situation: "Final year project — building a real-time chat application for 200+ concurrent users",
    whatYouBuilt: "WebSocket server in Node.js with Redis pub/sub for message broadcasting across multiple server instances",
    difficulty: "Messages were being lost when load-balanced across two servers because each server maintained its own in-memory state",
    outcome: "Solved the state problem using Redis as a shared pub/sub layer, deployed on two EC2 instances behind a load balancer, handled 200 concurrent connections in testing",
  },

  failure: {
    whatHappened: "Missed a submission deadline for a hackathon by 2 hours because I underestimated the time to integrate the ML model",
    yourRole: "I was responsible for the integration. I thought it would take 3 hours, it took 7.",
    whatYouDid: "We submitted anyway with a note explaining what was complete. I wrote a post-mortem for myself: the technical debt from a sloppy model API was what killed the timeline.",
    whatYouLearned: "Now I add 50% buffer to all integration estimates and test integration first before building features",
  },
};

// Key insight: these stories are specific, they name real technologies,
// real numbers, real decisions. That specificity is what makes them credible.`,
      hints: [
        'Do not aim for impressive stories — aim for real ones. Authenticity always beats fabrication.',
        'If you think you have no experience, think smaller: a group project that had team issues, a side project that taught you something hard, a time you helped a classmate through a difficult problem.',
        'Five well-developed stories will cover most behavioral questions. Depth beats breadth.',
      ],
    },
  ],
  keyTakeaways: [
    'Behavioral interviews evaluate past behavior to predict future performance — they are not soft or easy, they are a different skill',
    'Interviewers evaluate ownership, communication, growth mindset, impact, collaboration, self-awareness, leadership, and resilience',
    'Good behavioral answers are specific, have a clear story arc, and show your active role — not your team\'s',
    'Common mistakes: generic answers, blaming others, forgetting the result, memorizing scripts that break under follow-up questions',
    'Build a story bank of 5-6 real experiences across key categories — class projects, hackathons, clubs, and internships all count',
    'Authenticity beats perfection — a genuine story about real difficulty is far more compelling than a polished fabricated answer',
  ],
  nextLesson: 'star-method',
};
