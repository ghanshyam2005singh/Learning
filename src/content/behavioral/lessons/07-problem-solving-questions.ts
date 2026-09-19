import type { Lesson } from '@/types';

export const problemSolvingQuestionsLesson: Lesson = {
  id: 'problem-solving-questions',
  slug: 'problem-solving-questions',
  title: 'Problem Solving Questions',
  description:
    'Learn to talk about difficult problems, debugging stories, production issues, and learning new technologies in a way that reveals your thinking process — not just your outcome.',
  category: 'Behavioral Scenarios',
  order: 7,
  difficulty: 'intermediate',
  estimatedTime: 40,
  content: `Technical interviewers use behavioral problem-solving questions to understand **how you think**, not just whether you solve problems. A candidate who found the answer by lucky guessing is less valuable than one who found it by methodical investigation — even if the outcome was the same.

The goal in answering problem-solving behavioral questions is to make your thinking visible.

---

## What Problem-Solving Questions Evaluate

\`\`\`
WHAT INTERVIEWERS LOOK FOR

Debugging ability      Can you systematically isolate the cause of a problem?
Persistence            Do you push through when something is difficult?
Resourcefulness        Can you learn what you need when you do not know it?
Hypothesis testing     Do you form and test theories, or do you flail randomly?
Learning speed         How fast do you acquire new technical knowledge?
Resilience             How do you handle production issues or serious failures?
Communication          Can you explain technical problems clearly?
\`\`\`

---

## "Tell Me About a Difficult Technical Problem You Solved"

This is the most common problem-solving behavioral question. The answer should follow a specific arc:

\`\`\`
PROBLEM STORY ARC

1. Context:        What system, project, or situation?
2. Problem:        What was the specific symptom? (not root cause — yet)
3. Why it was hard: What made it difficult to solve?
4. Investigation:  How did you approach finding the root cause?
                   - What did you check first?
                   - What led you in the wrong direction?
                   - What observation pointed you to the real cause?
5. Solution:       What exactly fixed it?
6. Learning:       What do you know now that you did not know before?
\`\`\`

**The most important element:** Step 3 and 4. Most candidates skip these and jump from "there was a problem" to "I fixed it." The investigation is where your thinking becomes visible.

**Weak answer:**
> "I had a bug in my project where the API was slow. I profiled it and found a database query issue and added an index and it got faster."

**Strong answer:**
> "In my e-commerce project, users were reporting that the product search page took 8-12 seconds to load. This was happening only after the product catalog exceeded about 500 items, which was below our expected scale.
>
> My first hypothesis was that the API had inefficient code — maybe I was doing N+1 queries somewhere. I added console logging to count database calls per request. There was only one query — hypothesis ruled out.
>
> My second hypothesis was network — maybe images were loading slowly. I checked the Chrome DevTools waterfall and the API response itself was the bottleneck, not image loading.
>
> I looked at the query itself: a full-text search across the product name and description columns with LIKE '%keyword%'. The LIKE with leading wildcard cannot use an index — it scans the entire table. I confirmed this by running EXPLAIN ANALYZE on the query in psql and seeing a sequential scan on 500 rows every time.
>
> I replaced LIKE with PostgreSQL's full-text search using tsvector and GIN index. After reindexing, the same query went from 8 seconds to 40 milliseconds.
>
> The learning was understanding why LIKE with a leading wildcard breaks index performance. I now run EXPLAIN ANALYZE on any query that touches a large table before shipping."

This answer is specific, shows hypothesis formation, shows ruling out wrong hypotheses, and ends with a concrete learning.

---

## Debugging Stories

"Walk me through your debugging process when you encounter a bug."

This can be answered as a general process question OR as a specific story. Both work. The general process answer is worth knowing:

\`\`\`
A PROFESSIONAL DEBUGGING PROCESS

1. Reproduce first       Can I trigger the bug reliably? Is it intermittent or consistent?
2. Isolate               Can I narrow down WHAT is broken? (frontend? backend? data?)
3. Form a hypothesis     What is my best guess at the cause?
4. Test the hypothesis   What experiment would confirm or deny my guess?
5. Act on evidence       Follow the evidence, not your gut
6. Verify the fix        After fixing, confirm the symptom is gone and no new symptoms appeared
7. Document              What was it? How did I fix it? What should prevent it in the future?
\`\`\`

When asked about a specific debugging story, walk through this process using a real example from your experience.

---

## Production Issues and Handling Failures

"Tell me about a time something broke in production."

If you have internship experience with production systems, this is gold. If you do not, adapt to the closest equivalent — a demo that broke at a critical moment, a deployed side project that had a serious issue, or a live hackathon demo that failed.

**What to cover:**
- What broke and how you found out
- What the immediate impact was
- What your first actions were (mitigation before diagnosis)
- How you diagnosed the root cause
- How you fixed it
- What you put in place to prevent it from happening again

**Example:**
> "During my internship, I deployed a backend change on a Friday afternoon — it was a refactor of how we processed webhook events. On Monday morning, my manager pinged me: a client was reporting that they had not received any webhook deliveries over the weekend.
>
> My heart dropped. I had deployed Friday evening and the webhooks had been silently failing for 60 hours.
>
> First action: I checked the error logs. I had introduced a JSON serialization error — a field I was expecting to be a string was sometimes a number in the incoming payload, and my code was crashing silently instead of handling the type mismatch gracefully.
>
> The fix was straightforward — normalize the field type before processing. But the real problem was that the crash was silent — we had no alerting on webhook processing failures.
>
> I fixed the code, reprocessed the failed events from our dead-letter queue, and then worked with my manager to add monitoring: an alert if webhook failure rate exceeded 1% in any 15-minute window.
>
> The client received their backfilled events and we apologized for the delay. My manager was understanding because I owned it completely and came with a fix and a prevention plan — not just an apology."

---

## Learning New Technologies

"Tell me about a time you had to learn something new quickly."

This question evaluates learning ability — one of the most important skills in software engineering because the field changes constantly.

**What to demonstrate:**
- How you approach learning something unfamiliar
- Whether you can get to productive competence quickly
- Whether you know the difference between "understanding" and "surface familiarity"
- Whether you can apply new knowledge immediately

**Structure:**
1. What did you need to learn and why? (the urgency or context)
2. How did you approach learning it? (your process, not just "I read docs")
3. At what point did you feel competent enough to use it?
4. What specifically did you build or apply with the new knowledge?
5. What gaps do you still know you have?

**Example:**
> "During a hackathon, we decided to use WebSockets for real-time updates — none of us had used them before. We had 36 hours and the real-time feature was core to our idea.
>
> I split my learning: first 30 minutes reading the MDN docs on WebSocket API and the Socket.io docs to understand the protocol and the library's design. Then I immediately tried to get a minimal 'hello world' working — a client and server exchanging messages — before touching our actual application code. Getting the simplest version working first tells me whether I understand the basics before I try to build something real.
>
> Once the simple version worked, I integrated it into our project. I hit one issue: the WebSocket connection was being dropped when the React component re-rendered because I was creating a new socket on every render. I fixed it by moving the socket connection to a ref.
>
> We had a working real-time feature at hour 18, leaving us 18 hours for other work.
>
> What I still do not fully understand: how to scale WebSockets across multiple server instances. I know it requires something like Redis pub/sub, but I have not implemented it yet. That is on my learning list."

Notice the last part — acknowledging what you still do not know. This signals honesty and self-awareness, which interviewers value.

---

## Handling Ambiguity

"How do you approach problems when requirements are unclear?"

This is asked at companies that work in fast-moving or ambiguous environments.

**The right answer:**
1. You clarify before building (ask questions)
2. You identify the most important unknowns
3. You make assumptions explicit and document them
4. You build the simplest version first and validate before expanding
5. You stay in communication rather than disappearing for three weeks and returning with the wrong thing

**Example:**
> "In a group project, the professor gave a one-paragraph description of what to build — a 'hospital appointment management system' — with no further specification. No user types defined, no workflow described, no technical requirements.
>
> My first step was to write out a list of explicit questions: Who are the users? What are the core actions? What happens when there is a conflict? I shared this list with the team.
>
> Then I proposed we build a minimum version: one patient role, one doctor role, the ability to book and cancel appointments. No additional features until the core worked. This would let us demonstrate something concrete early and add complexity if time allowed.
>
> That approach worked — we had a working system two weeks before the deadline and added a notification feature in the extra time. The professor said in feedback that our scope management was the most professional in the cohort."`,
  codeExamples: [],
  commonMistakes: [
    'Skipping the investigation process and jumping from "there was a problem" to "I fixed it" — the thinking is what the interviewer wants to see',
    'Being vague about the diagnosis: "I found the bug" — name what the bug was, how you found it, and what the root cause was',
    'Presenting only successful debugging stories — a story where you were wrong first and then found the real cause is more compelling',
    'Claiming you "just Googled it" when asked about learning something new — describe your actual learning process and methodology',
    'Not acknowledging what you still do not know — this looks dishonest, not impressive',
    'Describing production issues only in terms of the technical cause without mentioning communication and prevention steps',
  ],
  interviewQuestions: [
    {
      question: 'Tell me about the hardest bug you have ever fixed.',
      answer:
        'Name a specific bug — describe the symptom, why it was hard to find, your investigation process (including what you checked first and what led you in the wrong direction), the root cause, and the fix. The investigation process is the most important part — it shows how you think. End with a concrete learning about the underlying system.',
      difficulty: 'intermediate',
    },
    {
      question: 'How do you approach debugging a problem you have never seen before?',
      answer:
        'Reproduce reliably first, then isolate — narrow down which layer or component is responsible. Form a hypothesis about the root cause, then test it with a specific experiment. Follow evidence rather than gut feeling. Verify the fix did not introduce new symptoms. Document what you found so you and others can recognize it faster next time.',
      difficulty: 'intermediate',
    },
    {
      question: 'Tell me about a time you had to learn a new technology to complete a project.',
      answer:
        'Describe the urgency or context, then your learning approach — specifically how you went from zero to productive, not just "I read the docs." Include what you built with the new knowledge, what problem you hit while applying it, and what gaps you know you still have. Interviewers value learners who know their own boundaries.',
      difficulty: 'beginner',
    },
    {
      question: 'Tell me about a time something went wrong in a live environment.',
      answer:
        'Cover: what broke and how you found out, immediate impact, first actions (mitigate before diagnose), root cause investigation, fix, and prevention. The most important elements are owning the failure completely and coming with both a fix and a plan to prevent recurrence — not just an explanation of what happened.',
      difficulty: 'intermediate',
    },
  ],
  exercises: [
    {
      id: 'problem-solving-stories',
      title: 'Map Your Problem-Solving Stories',
      description:
        'Identify your best debugging story, learning story, and ambiguity story. For the debugging story, specifically write out the investigation process — including what you tried that was wrong before you found the real cause.',
      starterCode: `// PROBLEM-SOLVING STORY BANK

const debuggingStory = {
  system: "", // What project or system?
  symptom: "", // What was the observable problem? (not the root cause)
  whyItWasHard: "", // What made it difficult to find?

  investigation: {
    firstHypothesis: "", // What did you suspect first?
    howYouTestedIt: "", // How did you check your first hypothesis?
    wasItRight: false, // Was your first guess right?
    whatLedYouToRealCause: "", // What observation pointed to the actual issue?
    rootCause: "", // What was actually causing the problem?
  },

  solution: "", // What fixed it?
  learned: "", // What do you now understand about the underlying system?
};

const learningStory = {
  whatYouHadToLearn: "",
  urgencyOrContext: "",

  learningProcess: {
    howYouStarted: "", // Docs? Tutorials? Building? In what order?
    firstExperiment: "", // What is the simplest thing you built to test your understanding?
    problemYouHit: "", // What went wrong while applying the new knowledge?
    howYouFixed: "",
  },

  whatYouBuiltWithIt: "",
  remainingGaps: [], // What do you still not fully understand?
};

const ambiguityStory = {
  whatWasUnclear: "",
  questionsYouAsked: [], // Specific questions you identified
  assumptionsYouMadeExplicit: [],
  howYouStartedBuilding: "", // Minimum version first?
  outcome: "",
};`,
      solution: `// Example stories

const exampleDebuggingStory = {
  system: "E-commerce project — product search feature",
  symptom: "Product search taking 8-12 seconds after catalog exceeded 500 items",
  whyItWasHard: "The query itself was simple — one SQL statement. I expected slow queries to be obvious.",

  investigation: {
    firstHypothesis: "N+1 query problem — maybe I was making multiple database calls per request",
    howYouTestedIt: "Added logging to count database calls per request. Result: one query per request.",
    wasItRight: false,
    whatLedYouToRealCause: "Ran EXPLAIN ANALYZE on the query in psql — saw 'Seq Scan' on the products table instead of an index scan. Researched why LIKE with leading wildcard breaks indexes.",
    rootCause: "LIKE '%keyword%' cannot use a B-tree index because the leading wildcard means the database cannot use prefix matching — it must scan every row.",
  },

  solution: "Replaced LIKE with PostgreSQL tsvector full-text search + GIN index. Query went from 8 seconds to 40ms.",
  learned: "LIKE with leading wildcards kills index performance. EXPLAIN ANALYZE is the first tool to reach for when a query is unexpectedly slow.",
};

const exampleLearningStory = {
  whatYouHadToLearn: "WebSockets / Socket.io — had 36 hours at a hackathon",
  urgencyOrContext: "Real-time feature was core to our product idea, none of us had used WebSockets before",

  learningProcess: {
    howYouStarted: "30 minutes reading MDN WebSocket docs + Socket.io docs to understand protocol and library design first",
    firstExperiment: "Built minimal client-server that exchanged a single message — proved I understood the basics before touching the real app",
    problemYouHit: "WebSocket connection dropped on every React re-render — I was creating a new socket instance inside the component body",
    howYouFixed: "Moved socket to a useRef so it persisted across re-renders",
  },

  whatYouBuiltWithIt: "Real-time collaborative cursor tracking for a shared whiteboard — working at hour 18",
  remainingGaps: [
    "How to scale WebSockets across multiple server instances (know it needs Redis pub/sub, have not implemented it)",
    "WebSocket authentication best practices in production",
  ],
};`,
      hints: [
        'The investigation section of your debugging story is the most valuable part — spend the most time on it',
        'If your debugging story only involves finding the bug and fixing it, it is not a strong story. Add: what you tried first that was wrong, and what led you to the real cause.',
        'For learning stories, the specific problem you hit while applying the new knowledge is important — it shows you actually applied it, not just read about it',
      ],
    },
  ],
  keyTakeaways: [
    'Problem-solving questions evaluate your thinking process, not just whether you solved the problem',
    'In debugging stories, the investigation process — what you tried, what was wrong, what led you to the real cause — is the most important part',
    'Show hypothesis testing: what you suspected, how you tested it, whether you were right, and what you tried next if you were wrong',
    'Learning stories should describe your methodology, not just "I read the docs" — show how you get from zero to productive quickly',
    'Acknowledge what you still do not know — this signals honesty and self-awareness, not incompetence',
    'For production issues: mitigate before diagnose, own the failure completely, come with both a fix and a prevention plan',
  ],
  prevLesson: 'leadership-questions',
  nextLesson: 'failure-questions',
};
