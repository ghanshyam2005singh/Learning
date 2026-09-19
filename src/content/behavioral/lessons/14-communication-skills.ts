import type { Lesson } from '@/types';

export const communicationSkillsLesson: Lesson = {
  id: 'communication-skills',
  slug: 'communication-skills',
  title: 'Communication Skills',
  description:
    'Develop the communication skills that make you effective in interviews and in professional teams — speaking clearly, thinking structurally, listening actively, asking good questions, and writing professionally.',
  category: 'Professional Skills',
  order: 14,
  difficulty: 'intermediate',
  estimatedTime: 40,
  content: `Technical skill gets you into the interview room. Communication skill determines what happens inside it.

More importantly: in your actual engineering career, communication skill is often what separates a senior developer from a junior one. The ability to explain a complex technical decision clearly, to ask a precise question that unblocks three people, to write documentation that a new team member can actually use — these are not "soft skills." They are professional skills that have direct, measurable impact on team output.

This module teaches the specific communication skills that matter most in interviews and in professional engineering environments.

---

## Speaking Clearly in Interviews

Many candidates know the answer but cannot communicate it clearly. The answer gets lost in filler words, tangents, and unclear structure.

### Structure Your Spoken Answers

Before you speak, organize. Even two seconds of deliberate thought before answering is better than starting to talk and hoping structure emerges.

**A simple organizing question:** "What is the one thing this answer needs to communicate?"

Then build around that.

**Common structural problems:**
- Starting at the wrong place (too much background before the point)
- Not landing the key insight (circling around it without saying it)
- Recovering by repeating (saying the same thing multiple ways hoping clarity emerges)

**The bottom-line-up-front technique (BLUF):**
Start with the conclusion, then explain it.

Weak: "So I was working on this project, and we had this issue with the API, and we tried different things, and eventually we figured out that the problem was actually in how we were formatting the date, and once we fixed that, it worked."

Strong: "The bug was a date format mismatch between our code and the API. We were sending MM/YY where the API expected MMYY for non-US cards. Here is how I found it..."

The strong version tells you the answer first, then explains it. This is much easier to follow.

---

### Eliminating Filler and Hedges

**Fillers** are sounds that fill silence: "um," "uh," "like," "you know," "basically," "right?"

**Hedges** are qualifiers that weaken your statements: "I think maybe I sort of did this thing..."

Both reduce the clarity and confidence of your communication. They are not fatal — everyone uses them — but reducing them significantly improves how you are perceived.

**How to reduce fillers:**
- Accept silence — a pause before speaking is professional, not awkward
- Practice speaking out loud regularly (record yourself, then listen)
- Slow down — most people add fillers when they are speaking too fast
- Prepare your key points — you use fillers when you are searching for what to say

**Hedging to eliminate:**
- "I think" — say it only when you are genuinely uncertain; do not use it reflexively
- "Kind of" / "sort of" — be direct about what you did
- "Basically" — just say the thing
- "I feel like" — you know things; say you know them

**Before:** "Um, so I kind of built this thing where basically I was trying to sort of handle the authentication, and I think it worked pretty well..."

**After:** "I built the authentication system — JWT-based, stateless, with refresh token rotation. It worked without issues throughout the project."

---

## Structured Thinking

The best communicators think in structures. They do not just say whatever comes to mind — they organize information before presenting it.

### Common Structures for Technical Communication

**Compare and contrast:**
"There are two main approaches: X and Y. X is better when [condition A], Y is better when [condition B]. For this project, we went with X because [reason]."

**Problem → Root cause → Solution:**
"The symptom was X. The root cause turned out to be Y. We fixed it by doing Z."

**Trade-off framing:**
"The advantage of this approach is A. The disadvantage is B. We chose it because in our context, A outweighed B."

**What / Why / How:**
"What we built: a rate limiter. Why: to prevent API abuse and protect backend costs. How: using a sliding window counter in Redis."

### Using Lists When Appropriate

When you have multiple items, listing them explicitly is clearer than prose.

Weak: "So there are a few things I would consider which are like performance and also the data structure you are using and whether you need consistency guarantees and the size of the dataset..."

Strong: "There are four things I would consider: performance requirements, data structure, consistency guarantees, and dataset size. Let me go through each."

Lists give the listener a mental container. They know they are hearing four things. They can track where you are.

---

## Active Listening

Communication is not just speaking. In an interview, how you listen is equally visible.

### What Active Listening Looks Like

- You let the interviewer finish their question before you start speaking
- You ask a clarifying question when you are not sure what is being asked
- You check in when you have given a long answer: "Does that answer your question, or would you like me to go deeper on any part?"
- You acknowledge the question before pivoting: "That is a great angle — I had not framed it that way. Let me think about it from that direction..."

### Why It Matters in Interviews

Behavioral interviews are conversations. The candidates who treat them as monologues — answering each question as a performance rather than a dialogue — miss signals from the interviewer.

When an interviewer shifts the question ("Actually, I am more curious about the conflict than the technical issue"), they are redirecting. If you keep going with the technical issue, you are not listening.

When an interviewer says "hmm, interesting" and pauses, that is often a cue to go deeper or take the conversation somewhere.

Active listening means you are tracking what the interviewer wants to learn, not just delivering your prepared answers.

---

## Asking Precise Questions

The ability to ask a precise question is one of the most underrated professional skills.

A precise question is:
- Clear about what you are asking (not "can you explain more?" but "can you clarify whether you mean X or Y?")
- Specific about what you need (not "I am confused" but "I am not sure I understand the difference between A and B — can you give an example?")
- Respectful of the other person's time (one question, not four questions embedded in one)

### In Interviews: Asking for Clarification

It is completely acceptable to ask the interviewer to clarify a question. In fact, it is a good signal — it shows you think before answering.

"Can I just make sure I understand the question — are you asking about a time I disagreed with someone's technical decision, or more generally about how I handle conflict?"

This is professional. Do not guess what a question means and answer the wrong question.

### In Engineering Work: Questions That Unblock

The most valuable questions in a professional setting are the ones that unlock progress for multiple people.

Bad question (too vague): "I am confused about the authentication. Can you explain it?"

Good question (precise): "I am implementing the password reset flow. I am not sure whether the reset token should be stored in the database and invalidated after use, or kept only in the email link. Which approach does our current auth system use?"

The good question names exactly what you need to know. The person answering it can give a direct answer without asking for clarification themselves.

---

## Professional Written Communication

**Pull requests and code review comments:**

In professional environments, you communicate through text as much as through speech. How you write PRs, comments, and messages matters.

**Good PR description includes:**
- What the change is (a brief summary)
- Why the change is being made (the motivation or context)
- How to test it (how a reviewer can verify it works)
- Any known limitations or edge cases

**Good code review comment:**
- Specific about what and where: "In line 43, user.role could be undefined if the user was created before we added the role field"
- Constructive about why: "This means the permission check on line 44 could fail silently"
- Suggestive about how: "Consider adding a fallback: user.role ?? 'viewer'"

**What NOT to write in code review:**
- "This is wrong" (why? how?)
- "This is fine I guess" (is it fine? is there a concern?)
- No comment at all when you have a concern (silence is not professional)

---

## Communication in High-Stress Situations

Interviews are high-stress. Difficult technical conversations are high-stress. How you communicate under stress signals a lot.

**What breaks communication under stress:**
- Speeding up — talking faster does not make you clearer
- Filling silence with anything — random thoughts that crowd out actual thinking
- Defensive framing — "well, technically what I meant was..."
- Shutting down — going quiet and giving minimal answers

**What works:**
- Slow down deliberately — slower speech is almost always clearer
- Accept silence — a three-second pause before answering is not awkward; it is thoughtful
- Name uncertainty honestly — "I do not know this well" is far better than guessing
- Redirect when you are lost — "Let me try approaching this from a different angle"

---

## Communicating Technical Decisions to Non-Technical People

Engineers often need to explain technical decisions to people who do not share their vocabulary. This is a skill that takes practice.

**The principles:**
1. Lead with impact, not mechanism: "This change will reduce page load time by 2 seconds" before "We switched from a blocking to a non-blocking API call"
2. Use analogies: "A cache is like a notepad where you write down answers to questions you ask frequently, so you do not have to look up the answer every time"
3. Avoid jargon without explanation: if you must use a technical term, define it in one sentence immediately after using it
4. Check understanding: "Does that make sense, or would a different explanation help?"

**Example — explaining a technical decision to a non-technical manager:**

Weak: "We need to move from synchronous to asynchronous processing using a message queue because the current architecture creates I/O blocking."

Strong: "Right now, when a user uploads a file, the server waits for the file to be processed before responding — like a cashier who cannot serve the next customer until the current order is fully packed and bagged. If the processing takes 10 seconds, the user waits 10 seconds. What I want to do is have the server accept the upload immediately, hand the processing to a background worker, and tell the user 'we are working on it.' This keeps the server available for other users and makes the experience much faster."`,
  codeExamples: [],
  commonMistakes: [
    'Starting to speak before you have organized your thinking — structure before speaking saves time and improves clarity',
    'Excessive hedging: "I think maybe I kind of..." — be direct about what you did and what you know',
    'Not asking for clarification when you are not sure what the interviewer is asking — guessing and answering the wrong question',
    'Treating the interview as a monologue rather than a conversation — not listening to what the interviewer is trying to learn',
    'Writing vague code review comments that do not name the problem, the why, or the suggested fix',
    'Explaining technical decisions by starting with the mechanism instead of the impact',
  ],
  interviewQuestions: [
    {
      question: 'How do you explain technical decisions to non-technical stakeholders?',
      answer:
        'Lead with impact, not mechanism — start with what it means for the user or business before explaining how it works. Use analogies to translate technical concepts into familiar ideas. Avoid jargon or define it immediately. Check understanding and adjust based on what you hear back. The goal is not to simplify the technology — it is to translate it into terms that help the other person make an informed decision.',
      difficulty: 'intermediate',
    },
    {
      question: 'How do you communicate when you are blocked on something?',
      answer:
        'Communicate early, not after you have been blocked for a week. Name specifically what you are trying to do, what you have already tried, and what specifically you are stuck on. This respects the other person\'s time — they can give a direct answer rather than asking what you have already tried. Being blocked is not a failure; staying silently blocked is a problem.',
      difficulty: 'beginner',
    },
    {
      question: 'How do you give feedback on code or work you disagree with?',
      answer:
        'Be specific about what the concern is and why it matters — not just "this is wrong" but "this approach has the following consequence." Offer a suggestion rather than just a criticism. Use a constructive tone that assumes the person made a reasonable decision with the information they had. If it is a significant disagreement, have the conversation in person or on a call rather than in a comment thread.',
      difficulty: 'intermediate',
    },
  ],
  exercises: [
    {
      id: 'communication-practice',
      title: 'Practice Structured Communication',
      description:
        'For each exercise below, write a structured response using one of the communication frameworks — BLUF, problem/root cause/solution, or what/why/how. Then read it out loud and identify where you use hedges or fillers.',
      starterCode: `// COMMUNICATION EXERCISES

const exercise1 = {
  prompt: "Explain a technical decision you made in one of your projects to a non-technical person.",
  framework: "What/Why/How — lead with impact",
  myResponse: "",
  fillersAndHedges: [], // List any hedges or fillers in your response
};

const exercise2 = {
  prompt: "You are blocked on a task. Write a message to a senior engineer asking for help.",
  goodMessageCriteria: [
    "States exactly what you are trying to do",
    "States what you have already tried",
    "States specifically where you are stuck",
    "Does not require them to ask for more information",
  ],
  myMessage: "",
};

const exercise3 = {
  prompt: "Write a constructive code review comment for this code:\n// Retrieves user from database\nconst user = await db.findOne({ email: email });\nif (user) { grantAccess(user); }",
  concern: "No validation that the retrieved user is active/enabled — an inactive or deleted user could get access",
  goodCommentCriteria: [
    "Specific about what and where",
    "Explains why it matters",
    "Suggests how to fix it",
  ],
  myComment: "",
};`,
      solution: `// Example responses

const exampleExercise1 = {
  myResponse: \`
    What we built: a caching layer in front of our database.

    Why: Users were waiting up to 8 seconds for the product search page to load.
    The problem was that every search was querying the entire database from scratch —
    like asking a librarian to search every book in the library every time someone asked
    the same question. With caching, we store the search results for common queries
    and return the stored result instantly, only refreshing when the data changes.

    Result: Search page now loads in under 300 milliseconds.
    The cost is that search results can be up to 5 minutes out of date —
    which is acceptable for product search but would not be acceptable for
    something like account balances.
  \`,
  fillersAndHedges: [], // This response has none because it was deliberate
};

const exampleExercise2 = {
  myMessage: \`
    Hey [Name], I am blocked on the webhook delivery retry logic and wanted to ask if you
    have a few minutes.

    What I am trying to do: implement exponential backoff for failed webhook deliveries —
    retry after 30s, then 60s, then 120s, up to 5 retries.

    What I have tried: I set up a basic retry loop using setTimeout in the worker process,
    but the retries are being lost when the server restarts mid-retry. I looked into
    storing retry state in Redis, but I am not sure whether to use a sorted set by
    next-retry timestamp or a simple queue.

    Specifically stuck on: whether Redis sorted set or a BullMQ job queue is the right
    tool here, and whether BullMQ handles the retry scheduling for me or if I need to
    implement that logic myself.

    Do you have 20 minutes this afternoon to look at this together?
  \`,
};

const exampleExercise3 = {
  myComment: \`
    Possible issue: if the user record exists but is marked as inactive or deleted
    (e.g., a soft-deleted account), this code would still grant them access because
    we are only checking for existence, not status.

    Suggested fix:
    const user = await db.findOne({ email, status: 'active' });

    Or if we want to handle inactive users differently:
    const user = await db.findOne({ email });
    if (!user) return sendError('User not found');
    if (user.status !== 'active') return sendError('Account inactive');
    grantAccess(user);
  \`,
};`,
      hints: [
        'Record yourself giving a 2-minute answer to a behavioral question. Listen back. Count the fillers. Then do it again without them. This is the fastest way to improve spoken communication.',
        'For the "help request" exercise — show it to a friend and ask if they could answer your question without asking for any additional information. If not, your question is not precise enough.',
        'The best code review comments quote the specific line or function they are referring to. Vague comments ("this could be cleaner") are not actionable.',
      ],
    },
  ],
  keyTakeaways: [
    'Structure before speaking — even two seconds of organization makes your answer clearer',
    'Bottom-line-up-front: state the conclusion, then explain it — this is more followable than building to a conclusion',
    'Eliminate hedges ("I think maybe I sort of...") — be direct about what you know and what you did',
    'Active listening is visible — let the interviewer finish, ask clarifying questions, check if your answer addressed their question',
    'Precise questions unblock faster — name exactly what you are trying to do, what you have tried, and what specifically you need',
    'For non-technical audiences: lead with impact not mechanism, use analogies, define jargon immediately',
    'Under stress: slow down deliberately, accept silence, name uncertainty honestly instead of guessing',
  ],
  prevLesson: 'workplace-scenarios',
  nextLesson: 'mock-interview-hub',
};
