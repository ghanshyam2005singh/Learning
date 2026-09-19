import type { Lesson } from '@/types';

export const workplaceScenariosLesson: Lesson = {
  id: 'workplace-scenarios',
  slug: 'workplace-scenarios',
  title: 'Workplace Scenarios',
  description:
    'Handle situational behavioral questions about tight deadlines, ambiguous requirements, team issues, difficult clients, production bugs, and priority changes with clear, structured thinking.',
  category: 'Behavioral Scenarios',
  order: 13,
  difficulty: 'intermediate',
  estimatedTime: 45,
  content: `Situational questions — "What would you do if..." or "How do you handle..." — are different from story-based behavioral questions. Instead of asking you to recall a past experience, they ask you to walk through how you would approach a hypothetical (or future) situation.

These questions evaluate your judgment, your process, and your professional instincts.

The key to answering them well: be specific about your thinking process. "I would communicate clearly and prioritize effectively" is the verbal equivalent of a shrug. The interviewer wants to see your mental model for how you approach difficult situations.

---

## How to Answer Situational Questions

Situational questions should be answered with:

\`\`\`
SITUATIONAL ANSWER STRUCTURE

1. Understand first    What information would you need before acting?
2. Immediate action    What do you do first?
3. Process             How do you work through the problem?
4. Communication       Who do you keep informed and how?
5. Outcome focus       What are you trying to achieve for the team/product?
6. Past reference      "I had a similar situation when..." (if applicable)
\`\`\`

The past reference step is optional but powerful — connecting a hypothetical to a real experience you have had makes your answer far more credible.

---

## Tight Deadlines

**Question:** "Tell me about a time you worked under significant time pressure."

Or: "How do you handle situations where deadlines are unrealistic?"

**What the interviewer is evaluating:**
- Do you panic or stay focused?
- How do you prioritize under constraint?
- Do you communicate proactively or hide the situation?
- Do you know how to make smart scope tradeoffs?

**Key behaviors to demonstrate:**
1. Clarify what is truly required vs. what is nice to have (ruthless scope triage)
2. Communicate the situation proactively — not on the day of the deadline
3. Focus energy on what matters most, not on everything equally
4. Protect quality on the critical path even when cutting scope elsewhere

**Example:**
> "In my third year project, we had two weeks to build and present a working prototype. On day eight, we realized our original architecture could not support the real-time collaboration feature that was the core of the demo.
>
> My first move was scope triage — what absolutely had to work for the demo to be meaningful? The answer was: one user creating a shared board, a second user joining, and both seeing changes in real time. Everything else — history, undo, sharing links — was a nice-to-have.
>
> I had a team conversation that evening. We explicitly cut four planned features from the demo scope and put them in a 'stretch' list. Then we focused all energy on the three core interactions.
>
> We had a working demo by day thirteen. It was limited — but it was real and it worked. The professor asked specifically about the real-time sync mechanism, which we were able to explain in detail because we had built it properly rather than rushing a fake version.
>
> My rule from that experience: under deadline pressure, the first thing you do is not work faster — it is figure out what you actually need to deliver."

---

## Ambiguous Requirements

**Question:** "Tell me about a time you had to work with unclear or incomplete requirements."

Or: "How do you handle ambiguity?"

**What the interviewer is evaluating:**
- Can you function without hand-holding?
- Do you ask the right clarifying questions before building the wrong thing?
- Do you communicate your assumptions?
- Do you know how to make progress incrementally?

**Key behaviors:**
1. Before building: identify the most important unknowns and ask about them
2. Document assumptions explicitly — do not work silently on an interpretation
3. Build the minimum version first to validate before going further
4. Stay in communication — check in rather than disappearing for three weeks

**Example:**
> "In a group project, the brief was 'build a hospital appointment management system' — one paragraph, no specifications. No user roles defined, no workflow, no constraints.
>
> My first step was to write down everything I did not know: who are the users (doctors, patients, both?), what are the core actions (book, cancel, reschedule?), what happens when there is a conflict (two patients booked for the same slot)?
>
> I brought that list to the team. We could not answer all of it — so we made decisions and documented them as explicit assumptions: 'We are assuming two roles: patient and doctor. We are assuming no recurring appointments. We are assuming no payment processing.'
>
> Then we built the minimum version that validated those assumptions: patient can book an appointment, doctor can view their schedule. We presented this mini-version to our professor at week two for feedback before building further. He redirected us on one assumption, which saved us from building the wrong thing for three more weeks.
>
> The process I take from this: clarify the top three unknowns, document your assumptions, build the simplest version that can be validated, and check in early before committing to the full implementation."

---

## Team Issues

**Question:** "How do you handle team dynamics that are affecting productivity?"

Or: "What do you do when a team is not working well together?"

**What the interviewer is evaluating:**
- Do you address problems or ignore them?
- Can you navigate interpersonal issues without making them worse?
- Do you escalate appropriately?
- Do you distinguish between surface conflict and underlying causes?

**Key behaviors:**
1. Address team issues directly and early — not after they become crises
2. Understand the root cause before proposing solutions
3. Focus on the team's goal, not on assigning blame
4. Create structural solutions, not just one-time interventions

**Example:**
> "In a group project, two team members stopped communicating effectively — they were passive-aggressive in messages and not attending shared work sessions. The rest of us were frustrated but pretending it was not happening.
>
> I decided to address it directly. I asked both members individually, in private, what was going on from their perspective. One felt his ideas were being dismissed. The other felt the first was not doing his share of the work. Neither of these had ever been said out loud.
>
> I set up a team meeting where I said: 'We have a communication issue that is slowing us down. I want us to talk about it so we can finish this project well.' I then let them speak. It was uncomfortable. But they did.
>
> After the meeting, the atmosphere improved significantly. The underlying issue was not personality conflict — it was two people who felt unheard. Making space to say that out loud resolved most of it.
>
> I am not always the person who calls these meetings. But when no one else is doing it and the team is suffering, I try to be."

---

## Difficult Clients or Stakeholders

**Question:** "How do you handle stakeholders who are difficult to work with?"

Or: "Tell me about a time a client or user pushed back on your work."

**What the interviewer is evaluating:**
- Do you listen to criticism or get defensive?
- Can you separate the frustration from the feedback?
- Do you communicate technical constraints clearly to non-technical people?
- Do you advocate for quality while being responsive to needs?

**Key behaviors:**
1. Listen first — understand what the pushback is actually about
2. Separate legitimate feedback from preference or noise
3. Communicate constraints clearly and without jargon
4. Find solutions that address the underlying need, not just the stated request

**Example:**
> "During a class project, our 'client' (the professor's assistant reviewing our prototype) said our interface was confusing and needed to be 'completely redesigned.' This was a vague request that would have meant rewriting the entire frontend one week before submission.
>
> Instead of immediately agreeing or defending our work, I asked: 'Can you show me specifically where you got confused?' He pointed to three spots — the navigation menu, the form for booking, and the error messages.
>
> I said: 'Let me see if we can address those three points specifically rather than redesigning everything.' We fixed the navigation labeling, simplified the booking form to one step, and rewrote the error messages in plain language. This took one day, not one week.
>
> He reviewed it and said it was significantly better. The 'complete redesign' was actually three specific usability issues. You have to ask where the pain is before you propose the solution."

---

## Production Bugs and Priority Changes

**Question:** "How do you handle unexpected issues that require reprioritizing your work?"

Or: "Describe how you would respond to a critical production bug."

**The production bug response process:**
1. **Assess severity first** — is this a complete outage or degraded functionality?
2. **Communicate immediately** — tell your team and manager what you know and what you are doing
3. **Mitigate before diagnosing** — if there is a quick workaround, apply it while investigating root cause
4. **Investigate systematically** — do not randomly try fixes; form a hypothesis, test it
5. **Fix and verify** — confirm the symptom is gone and no new issues appeared
6. **Write a post-mortem** — what happened, how it was caught, what prevents recurrence

**The priority change response:**
> "When priorities shift, my first step is to understand why — not to resist the change, but to make sure I understand what changed so I can make good decisions about what to do with the in-progress work. Is the priority change temporary or permanent? Does the work I am stopping need to be handed off, paused cleanly, or abandoned?
>
> Then I communicate: what I was doing, where I left it, and any risks of leaving it mid-flight.
>
> The hardest part of priority changes is when work is half done — a half-finished feature is often worse than no feature because it creates invisible debt. I try to either get to a clean stopping point or explicitly document the state of the work so re-entry is feasible.
>
> In a hackathon, we pivoted to a different problem at hour 20. I spent 20 minutes documenting what we had built so far and what assumptions we had made, before switching. That document saved us 2 hours when we briefly reconsidered the original approach at hour 30."`,
  codeExamples: [],
  commonMistakes: [
    'Answering situational questions with "I would just communicate and prioritize" without any specifics about how',
    'Under tight deadlines, trying to do everything instead of triaging what actually needs to be done',
    'Working on ambiguous requirements without documenting your assumptions — assumptions that are not explicit will bite you later',
    'Addressing team issues by complaining to uninvolved parties instead of having a direct conversation',
    'Taking stakeholder feedback at face value without asking where the actual pain is',
    'In production issues, skipping the "communicate first" step and going straight to debugging — your manager needs to know immediately',
  ],
  interviewQuestions: [
    {
      question: 'How do you handle a situation where you are given an unrealistic deadline?',
      answer:
        'First, scope triage — identify what is truly required for the deadline vs. what is optional. Then communicate proactively: tell your team or manager early that the current scope cannot be delivered in the time available and propose a scoped version that can be. The worst thing to do is silently try to do everything and deliver nothing. Better to deliver a smaller thing on time than a larger thing late.',
      difficulty: 'intermediate',
    },
    {
      question: 'Describe how you would handle a critical production bug.',
      answer:
        'Communicate immediately — tell the team what you know, even if you do not know the cause yet. If there is a quick mitigation (rollback, feature flag), apply it while investigating root cause. Investigate systematically: reproduce it, form a hypothesis, test the hypothesis, follow the evidence. After fixing, verify the symptom is gone and write a brief post-mortem describing what happened and how to prevent recurrence.',
      difficulty: 'intermediate',
    },
    {
      question: 'How do you work when requirements are unclear?',
      answer:
        'Identify the top three unknowns before writing code. Ask about them explicitly — do not assume. Document your assumptions so they can be corrected. Build the minimum version that validates your understanding and check in early before going further. Stay in communication throughout — do not disappear and return with something built on wrong assumptions.',
      difficulty: 'beginner',
    },
    {
      question: 'What do you do when a project changes priorities suddenly?',
      answer:
        'Understand why the change is happening — context helps you make good decisions about the in-progress work. Communicate the state of current work clearly. Find a clean stopping point or document the work-in-progress state so re-entry is feasible later. Then focus on the new priority without resentment — priorities change in real engineering environments, and adaptability matters.',
      difficulty: 'intermediate',
    },
  ],
  exercises: [
    {
      id: 'scenario-responses',
      title: 'Write Structured Scenario Responses',
      description:
        'For each scenario, write a structured response following the situational answer framework. Focus on being specific about your thinking process — not just what you would do, but how you would decide.',
      starterCode: `// SCENARIO RESPONSE PRACTICE

const scenarios = [
  {
    scenario: "You are three days from a demo and you realize the core feature will not work as planned. You cannot extend the deadline.",
    myResponse: {
      understandFirst: "", // What do you confirm/clarify before acting?
      immediateAction: "", // What do you do first?
      process: "", // How do you work through it?
      communication: "", // Who do you tell, when, and what?
      outcomeFocus: "", // What are you trying to achieve?
    },
  },

  {
    scenario: "You are asked to implement a feature but the requirements are vague. Your manager is unavailable for 48 hours.",
    myResponse: {
      understandFirst: "",
      immediateAction: "",
      process: "",
      communication: "",
      outcomeFocus: "",
    },
  },

  {
    scenario: "A critical bug appears in production on a Friday afternoon. You are the only developer available.",
    myResponse: {
      understandFirst: "",
      immediateAction: "",
      process: "",
      communication: "",
      outcomeFocus: "",
    },
  },

  {
    scenario: "Midway through a two-week sprint, all priorities are reshuffled and your current work is deprioritized.",
    myResponse: {
      understandFirst: "",
      immediateAction: "",
      process: "",
      communication: "",
      outcomeFocus: "",
    },
  },
];`,
      solution: `// Example scenario responses

const exampleResponses = [
  {
    scenario: "Three days from demo, core feature will not work as planned.",
    myResponse: {
      understandFirst: "What absolutely must work for the demo to be meaningful? What is the minimum version that demonstrates the core idea? Can a manual workaround stand in for the broken part during the demo?",
      immediateAction: "Call an emergency team meeting to triage scope. Do not silently try to fix the broken feature — communicate the situation immediately.",
      process: "Define the 'minimum viable demo' together. Cut everything that is not essential. Focus all remaining capacity on the three or four interactions that must work. If there is a broken part, decide: is there a workaround for the demo, or do we cut it and explain why in the presentation?",
      communication: "Tell the team now, not on demo day. If there is a supervising instructor or stakeholder, tell them too — framed as 'here is our updated scope and why.' Surprises on demo day are far worse than early honesty.",
      outcomeFocus: "Deliver a demo that works for what it demonstrates — limited but real. A smaller demo that actually functions is better than a larger demo that fails.",
    },
  },

  {
    scenario: "Critical production bug, Friday afternoon, only developer available.",
    myResponse: {
      understandFirst: "What is the severity? Complete outage or degraded service? How many users are affected? Is there a known workaround?",
      immediateAction: "Communicate: send a message to your manager and team immediately — 'I am aware of the bug, assessing severity, will update in 15 minutes.' Even if they are offline, the message is timestamped. Then mitigate if possible before diagnosing.",
      process: "Check for a quick mitigation first (rollback, feature flag, cache clear). If mitigation is not possible, investigate systematically: reproduce, form hypothesis, test. Do not randomly try things. Document what you try and what you observe.",
      communication: "Status updates every 30 minutes to whoever needs to know, even if the update is 'still investigating, no change.' Silence is worse than bad news.",
      outcomeFocus: "Restore service as quickly as possible. Accept a temporary fix if it gets users back online — proper root cause fix can follow. Write a post-mortem before Monday.",
    },
  },
];`,
      hints: [
        '"Understand first" is the most important step that candidates skip — acting before understanding the full situation is how small problems become larger ones',
        'Communication is always a step in workplace scenarios — tell the right people the right thing at the right time, and do it proactively rather than reactively',
        'When answering scenario questions, the best candidates also say what they would NOT do — "I would not try to fix everything in three days; I would scope it down" is stronger than just saying what you would do',
      ],
    },
  ],
  keyTakeaways: [
    'Situational questions evaluate judgment and process — be specific about how you would think, not just what you would do',
    'Under tight deadlines: triage scope first — identify what must work vs. what is optional, then communicate the updated scope proactively',
    'With ambiguous requirements: clarify the top unknowns, document your assumptions, build the minimum version, check in early',
    'Team issues: address them directly and early; understand the root cause before proposing solutions; create structural fixes not one-time interventions',
    'Production bugs: communicate immediately (even with incomplete information), mitigate before diagnosing, investigate systematically, write a post-mortem',
    'Priority changes: understand why, find a clean stopping point, document work-in-progress state, then focus on the new priority without resentment',
  ],
  prevLesson: 'company-research',
  nextLesson: 'communication-skills',
};
