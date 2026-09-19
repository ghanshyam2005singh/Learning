import type { Lesson } from '@/types';

export const leadershipQuestionsLesson: Lesson = {
  id: 'leadership-questions',
  slug: 'leadership-questions',
  title: 'Leadership Questions',
  description:
    'Answer leadership questions authentically even without a manager title — by understanding that leadership is a behavior, not a position. Learn to demonstrate ownership, initiative, decision-making, and mentoring through real stories.',
  category: 'Behavioral Scenarios',
  order: 6,
  difficulty: 'intermediate',
  estimatedTime: 40,
  content: `"Tell me about a time you showed leadership."

Most students panic at this question. "I am not a manager. I am a student. I have never led anything."

This is a fundamental misunderstanding of what leadership means in a behavioral interview context.

Leadership is not a title. It is a behavior. Every time you take initiative without being told to, every time you own a problem rather than wait for someone else to solve it, every time you help a colleague understand something difficult, every time you make a decision under uncertainty — you are demonstrating leadership.

You have more material for leadership questions than you think. This module teaches you how to see it and articulate it.

---

## What Interviewers Mean By Leadership

When a company asks about leadership, they are evaluating whether you are someone who:

\`\`\`
LEADERSHIP BEHAVIORS COMPANIES LOOK FOR

Initiative        Identifies problems and acts on them without being asked
Ownership         Takes responsibility for outcomes, does not deflect blame
Decision-making   Makes reasonable decisions under uncertainty
Influence         Moves others through reason, not authority
Mentoring         Helps others grow, not just themselves
Accountability    Acknowledges mistakes, corrects course, communicates proactively
Vision            Sees beyond immediate tasks to broader impact
\`\`\`

Notice that none of these require a manager title. A student can demonstrate every one of these in a class project, a hackathon, or a club.

---

## Types of Leadership Stories You Can Use

**1. Leading without authority**
You organized a group, defined the plan, or drove the project when no one was officially in charge. This is common in class projects and hackathons.

**2. Taking initiative on a problem**
You noticed a problem no one was addressing and took action without being asked. Spotting a bug and fixing it. Writing documentation because there was none. Proposing a new approach when the current one was failing.

**3. Making a decision under uncertainty**
There was no clear right answer and time pressure. You gathered what information you could, made a judgment call, and owned the outcome.

**4. Mentoring a peer**
You helped a classmate understand a concept, reviewed a teammate's code, or guided someone new to a project through the codebase.

**5. Driving a process change**
You identified an inefficiency in how the team was working and proposed a change that improved things.

---

## Answering "Tell Me About a Time You Showed Leadership"

Use STAR. The critical difference from other STAR answers is that the **Action section must demonstrate a leadership behavior** — not just doing your assigned work.

**Weak leadership story:**
> "I was the team leader in my project. I told everyone their tasks and we all did them and submitted."

This is management administration, not leadership. It shows no initiative, no influence, no decision-making under uncertainty.

**Strong leadership story:**
> "In my third year project, our team of four was building a hospital appointment booking system. Two weeks before the deadline, our original approach to the scheduling algorithm was not working — it was too slow for any realistic number of appointments.
>
> No one was stepping up to redesign it. People were hoping the problem would work itself out. I called a team meeting and said directly: we need to rethink this, and we need to do it now. I had done some reading on the problem and proposed we switch from our brute-force approach to a slot-based system — pre-compute available slots and search through them rather than checking every possible time permutation.
>
> The team was skeptical but I walked through the logic, showed a rough complexity comparison, and offered to implement it myself to de-risk the decision for the team.
>
> I implemented the new approach in three days. It was 40x faster in our testing. We met the deadline. My professor highlighted the algorithm choice in feedback as the strongest technical decision in the project."

This story demonstrates: noticing a problem (initiative), addressing it directly (ownership), making a case with reasoning (influence), and offering to take the risk personally (accountability).

---

## "Tell Me About a Time You Took Initiative"

Initiative is leadership without the team component. The question asks about a moment you acted on something when you could have easily not.

**Structure:**
1. What did you notice that others were not addressing?
2. Why did you decide to act?
3. What did you do specifically?
4. What was the result?

**Example:**
> "During a group project, I noticed we had no documentation — no README, no API specification, nothing. Everyone knew what the code did because we had all written it, but a new person joining would be completely lost. This was not assigned to anyone, and technically it was outside my scope.
>
> I spent an afternoon writing a clear README with setup instructions, an API overview with request/response examples, and a brief explanation of the data model. I put it in the repository and mentioned it in our next team meeting.
>
> Two weeks later, our professor assigned a new student to our project to handle deployment (she was a DevOps student doing a cross-project contribution). She got the project running in an afternoon because of the documentation. She specifically mentioned it when she submitted her contribution. My team retroactively agreed we should have done this from the start."

Notice: this is a mundane story about writing documentation. It is not heroic. But it demonstrates initiative, care for the team, and a team-first mindset — which is exactly what leadership questions are evaluating.

---

## "Describe a Time You Made a Difficult Decision"

Decision-making under uncertainty is a leadership skill. The question is not asking whether you made the right decision — it is asking whether you can make decisions at all.

**What to demonstrate:**
- What information you had and what you were missing
- How you weighed the options
- That you actually committed to a decision
- That you owned the outcome whatever it was

**Example:**
> "At a hackathon, we were 20 hours in and our original technical stack was not working. We had tried to use a computer vision library that required GPU access we did not have — the model was too slow to be useful on CPU.
>
> We had two options: pivot to a completely different idea we could implement well in the remaining 28 hours, or continue trying to optimize the CV approach and risk running out of time.
>
> I called a 10-minute decision meeting. We reviewed both options honestly. The CV approach had maybe a 30% chance of being good enough to demo. The pivot had maybe a 70% chance. I made the call: we pivot. We picked a simpler problem, rebuilt our approach entirely, and built a clean, working demo in the time remaining.
>
> We did not win, but we had a working demo we could present confidently. Three teams that had stuck with their original approaches had nothing to show at the end. I learned that committing to a good decision is often better than continuing with a failing one because changing course feels like admitting defeat."

---

## Mentoring Stories

"Tell me about a time you helped someone else succeed."

This question evaluates whether you invest in others, not just yourself. It is particularly valued at companies that have strong engineering cultures.

**What to demonstrate:**
- You invested time in someone else's growth
- You taught in a way that built understanding, not dependency
- There was an observable improvement in the other person

**Example:**
> "A classmate in my data structures course was struggling with recursion. He understood the concept in theory but could not implement it when faced with a new problem.
>
> I offered to work through it with him over two sessions. Instead of showing him solutions, I asked him to explain his thinking out loud while I listened. Every time he hit a wall, I asked a question: 'What is the smallest version of this problem? What would the base case be?' I did not give answers — I gave the next question.
>
> After our second session, he went home and solved a medium-level tree problem independently. He came back the next day excited because he had finally felt like he understood rather than memorized.
>
> I learned more about recursion myself from explaining it — teaching forces you to understand something differently than just using it does."

---

## Ownership and Responsibility

"Tell me about a time you took ownership of a problem."

Ownership means you did not wait to be assigned, did not blame external factors, and saw something through to completion.

**The key difference between ownership and just doing your job:**
- Ownership extends beyond your assigned scope when necessary
- Ownership means communicating problems proactively, not hiding them
- Ownership means fixing what broke even if you did not break it

**Example:**
> "Three days before our project submission, I discovered a data loss bug — if the server restarted while a user was mid-form, their draft was lost permanently. I did not write that part of the code. It was technically outside my scope.
>
> But I understood the architecture and I had time. I implemented a local storage draft save that persisted across sessions and sent the draft to the server when the user submitted. I tested it for an hour, wrote a brief explanation in the PR, and merged it after a teammate reviewed it.
>
> When I told the team, they were surprised I had done it — they had known about the bug but assumed we would just accept it as a limitation. I told them I was not comfortable shipping something that silently deleted user work.
>
> This became the version we demonstrated. The professor specifically asked about draft persistence and we had a full answer."`,
  codeExamples: [],
  commonMistakes: [
    'Thinking you need a manager title to have a leadership story — leadership is behavior, not position',
    'Describing organizational tasks ("I assigned everyone their tasks") instead of leadership behaviors (initiative, influence, decision-making)',
    'Hedging ownership: "We decided together to..." — own the decisions you made',
    'Giving a story where everything went perfectly — leadership under pressure is more compelling than easy leadership',
    'Forgetting the impact — always include what changed because of your leadership action',
    'Confusing leadership with dominance — the best leadership stories often involve listening and building consensus, not commanding',
  ],
  interviewQuestions: [
    {
      question: 'Tell me about a time you showed leadership.',
      answer:
        'Choose a story where you took initiative, owned a problem, made a decision, or moved a group without formal authority. Use STAR and emphasize the Action section — specifically what leadership behavior you demonstrated. The story does not need to be about a large team or high stakes; a clear demonstration of initiative, ownership, or decision-making under uncertainty works well.',
      difficulty: 'intermediate',
      tip: 'If you genuinely cannot think of a leadership story, think about: a time you noticed a problem no one was addressing, a time you organized something informal, a time you helped a peer understand something, or a time you made a call when the team was stuck.',
    },
    {
      question: 'Describe a time you had to make a decision without all the information you needed.',
      answer:
        'Name the situation, describe what information you had and what was missing, explain how you weighed the options, describe the decision you made and why, and state the outcome. Include what you would do differently with hindsight if relevant. The goal is to show you can make real decisions rather than waiting for certainty that will never arrive.',
      difficulty: 'intermediate',
    },
    {
      question: 'Have you ever mentored or helped someone on your team?',
      answer:
        'Describe a specific instance — who, what they were struggling with, how you helped them. The best mentoring stories show that you helped them understand rather than just giving them the answer. Include an observable outcome: they solved a problem independently afterward, their code improved, they got unblocked. End with what you learned from the experience of teaching.',
      difficulty: 'beginner',
    },
    {
      question: 'Tell me about a time you took ownership of something that was not your responsibility.',
      answer:
        'Describe a gap you noticed — a bug, a missing process, an unaddressed problem. Explain why you chose to act despite it not being your job. Describe what you did and the outcome. The key message is that you care about the team\'s and product\'s success, not just the edges of your job description.',
      difficulty: 'intermediate',
    },
  ],
  exercises: [
    {
      id: 'leadership-story-mapping',
      title: 'Map Your Leadership Moments',
      description:
        'Using the leadership behavior categories, identify real moments from your own experience for each category. Do not dismiss small moments — writing documentation, calling a meeting, making a scope decision, explaining a concept to a classmate — all of these count.',
      starterCode: `// LEADERSHIP MOMENT MAPPING

const myLeadershipMoments = {

  initiative: {
    whatYouNoticed: "", // Something that needed to happen but no one was doing
    whyYouActed: "", // Why you did not just wait for someone else
    whatYouDid: "",
    impact: "",
  },

  ownershipBeyondScope: {
    whatTheProblemWas: "",
    whyItWasOutsideYourScope: "",
    whatYouDidAnyway: "",
    outcome: "",
  },

  decisionUnderUncertainty: {
    situation: "",
    whatYouDidNotKnow: "",
    howYouDecided: "",
    whatYouChose: "",
    outcome: "",
    hindsight: "", // Would you make the same call knowing what you know now?
  },

  mentoring: {
    whoYouHelped: "", // No names — just role/context
    whatTheyWereStruggling: "",
    howYouHelped: "", // Did you give answers or ask questions?
    observableOutcome: "", // What changed in their capability?
    whatYouLearned: "",
  },

  processChange: {
    whatWasInefficient: "",
    whatYouProposed: "",
    howYouConvincedOthers: "",
    outcome: "",
  },
};`,
      solution: `// Example mapping — filled in

const exampleLeadershipMoments = {

  initiative: {
    whatYouNoticed: "No documentation in our group project repository — new contributors had no way to set up the project or understand the codebase.",
    whyYouActed: "A new student was joining to handle deployment in two weeks. If I did not write documentation, she would waste days figuring out basics. That was a preventable waste.",
    whatYouDid: "Spent an afternoon writing a README with setup, API overview, request/response examples, and a data model diagram.",
    impact: "New contributor set up and ran the project in an afternoon. Professor noted the documentation quality in feedback.",
  },

  decisionUnderUncertainty: {
    situation: "Hackathon, 20 hours in, original computer vision approach too slow on CPU.",
    whatYouDidNotKnow: "Whether the pivot would work, how long the new approach would take, whether we could demo it credibly.",
    howYouDecided: "10-minute team meeting. Assessed probability: CV approach 30% chance of working in time, pivot 70% chance. Framed it as a risk decision.",
    whatYouChose: "Pivot to a simpler, well-defined problem that we could build cleanly.",
    outcome: "Had a working demo. Three teams that did not pivot had nothing to show.",
    hindsight: "Yes — same call. But I would pivot earlier. We wasted 4 hours before calling the meeting.",
  },

  mentoring: {
    whoYouHelped: "Classmate in DSA course struggling with recursion implementation",
    whatTheyWereStruggling: "Could explain recursion conceptually but could not implement it on a new problem",
    howYouHelped: "Two sessions using Socratic questioning — asked 'what is the base case?' and 'what does one step of this look like?' rather than showing solutions",
    observableOutcome: "Solved a medium tree problem independently the next day. Came back excited because it clicked.",
    whatYouLearned: "Teaching forces deeper understanding than using — I understood recursion differently after explaining it.",
  },
};`,
      hints: [
        'If a category is blank, think smaller — any time you explained something to a classmate is mentoring, any time you noticed a gap and filled it is initiative',
        'Leadership stories do not need to be dramatic. Quiet, consistent, professional behavior is what most companies are looking for.',
        'Your best leadership story is probably not the one where you saved the day — it is the one that shows how you naturally operate when you see something that needs doing',
      ],
    },
  ],
  keyTakeaways: [
    'Leadership is a behavior, not a title — initiative, ownership, decision-making, mentoring, and influence are all leadership',
    'Common leadership behaviors accessible to students: noticing and addressing gaps, organizing a group, making decisions when teams are stuck, helping peers',
    'The Action section of leadership stories must show a leadership behavior — not just completing assigned work',
    'Own your decisions — use "I decided" not "we decided" when the call was yours to make',
    'Mentoring stories demonstrate team-first thinking — investing in others rather than just yourself',
    'Ownership means caring about outcomes beyond your defined scope — fixing what is broken even if you did not break it',
  ],
  prevLesson: 'teamwork-questions',
  nextLesson: 'problem-solving-questions',
};
