import type { Lesson } from '@/types';

export const teamworkQuestionsLesson: Lesson = {
  id: 'teamwork-questions',
  slug: 'teamwork-questions',
  title: 'Teamwork Questions',
  description:
    'Learn how to answer questions about collaboration, difficult teammates, communication problems, and conflict resolution — with specific stories, not generic claims.',
  category: 'Behavioral Scenarios',
  order: 5,
  difficulty: 'beginner',
  estimatedTime: 40,
  content: `Every company hires people to work on teams. Even "solo" developers submit code for review, communicate with product managers, and coordinate with infrastructure teams. The ability to collaborate, navigate conflict, and communicate across different working styles is not optional — it is fundamental.

Teamwork questions are asked in almost every behavioral interview. The interviewers are not looking for candidates who claim to be perfect team players. They are looking for candidates who have navigated real team dynamics with self-awareness and professionalism.

---

## What Teamwork Questions Evaluate

Interviewers use teamwork questions to evaluate:

\`\`\`
TEAMWORK EVALUATION DIMENSIONS

1. Collaboration ability       Can you work with people effectively?
2. Conflict navigation          Can you handle disagreement professionally?
3. Communication               Can you express ideas and listen actively?
4. Adaptability                Can you adjust to different working styles?
5. Accountability              Do you own your part without blaming others?
6. Team-first mindset          Do you prioritize team success over ego?
\`\`\`

The worst teamwork answers always involve blaming: "My teammate was unreliable and dragged us down." Even if this is factually true, framing a story as "my teammate was bad" suggests poor professional judgment and an inability to navigate difficult working relationships.

Good teamwork stories focus on what **you** did in response to a team challenge — not on how bad the other person was.

---

## Common Teamwork Questions

### "Tell me about a time you worked on a team."

This is the most open-ended teamwork question. Use it to present your best collaboration story.

**What to cover:**
- What the team was trying to accomplish
- Your specific role and contribution
- A real challenge the team faced
- How the team navigated it (including what you did specifically)
- The outcome and what you learned about collaboration

**Example:**
> "During my third year, I was part of a four-person team building a hospital appointment booking system for a semester project. I was responsible for the backend API and the database design.
>
> About two weeks in, we hit a communication problem — the frontend developers were building components based on assumptions about the API structure that did not match what I was actually building. We were working in parallel and had not agreed on the interface contract early enough.
>
> I called a team meeting and we spent two hours writing out every API endpoint, the request shape, and the response shape before anyone wrote more code. I created a shared Notion doc for this so everyone could reference it and comment if something needed to change.
>
> After that, our integration went smoothly. We delivered on time with fewer bugs than I expected. The lesson I took from this was that the first thing a team should do is define its interfaces — not assume everyone has the same mental model."

This story demonstrates: initiative (calling the meeting), a specific solution (the Notion doc), and a concrete learning.

---

### "Describe a difficult team member you have worked with."

This is a test of professional maturity. The trap is to spend the answer criticizing the difficult person.

**The right approach:**
- Brief, fair description of what made the collaboration difficult (without excessive judgment)
- Focus on what YOU did to address it
- Show that you tried to understand their perspective
- Describe the outcome and what you learned about working with different personalities

**What to avoid:**
- "He was just lazy and did not care"
- "She was arrogant and thought she knew everything"
- Any language that is primarily about judging the other person

**Example:**
> "In a hackathon team, one teammate and I had very different working styles. I like to plan the structure before writing code — I want to know the data model, the API shape, and the component hierarchy before I start. He preferred to just start coding and figure things out as he went.
>
> This created tension early on — he felt I was wasting time on planning, and I felt he was creating technical debt we would have to clean up later. After the first day, I suggested we try a middle ground: spend 45 minutes designing, then start coding and revisit the design only when we hit a real blocker.
>
> He agreed, and it actually worked well. His quick prototyping helped us test ideas faster, and my planning helped us avoid some consistency issues in the data model. We did not agree on everything, but we respected each other's approach.
>
> What I learned is that different working styles can complement each other if you take time to negotiate instead of assuming one approach is right."

---

### "Tell me about a time a team project did not go well."

This is a failure question applied to a team context. Be honest. Do not blame the team.

**Key rules:**
- Acknowledge your role in what went wrong
- Be specific about what the outcome was (not vague: "it did not go well")
- Focus on what you learned and what you would do differently

**Example:**
> "In my second year, a group of five of us submitted a software project that was incomplete. We were building a simulation tool and ran out of time — the visualization component was missing, and the backend logic had known bugs.
>
> Looking back, I contributed to the failure. I was the team lead in name, but I did not actually lead. I tracked progress in my head instead of making sure everyone knew the status. Three days before the deadline, I realized two members had been blocked on an integration issue for a week and had not told anyone — and I had not checked.
>
> We submitted what we had, got a lower grade than I expected, and I was disappointed with myself more than with the team. After that project, in every team I work in, I make sure there is a visible way to track what is blocked — a simple shared doc or a 10-minute daily check-in. Not because I distrust people, but because blockers need light to get resolved."

---

### "How do you handle communication problems in a team?"

This is a process question, not a story question — though you should support your answer with an example.

**Structure:**
1. Your general principle or philosophy
2. A concrete example of applying it
3. What you do when the first approach does not work

**Example:**
> "My default when communication breaks down is to move from asynchronous to synchronous. If messages are being misunderstood or ignored, a quick call almost always resolves what ten messages could not.
>
> In a group project last semester, the team was disagreeing over text about how to structure the authentication flow. Everyone was getting terse and no one was moving forward. I suggested a 20-minute call — we shared screens, I drew the two approaches on a whiteboard diagram in a shared doc, and within 20 minutes we had a decision and everyone understood why.
>
> If someone genuinely will not communicate — does not respond, does not engage — I will try to understand why first. Are they overwhelmed with something else? Do they feel their input is not valued? Most communication problems are not actually communication problems — they are motivation or trust problems underneath."

---

### Conflict Resolution Questions

Conflict resolution is covered in detail in the Conflict Questions module. But in teamwork contexts, the key principle is:

**Address conflict directly, professionally, and early.**

Most team problems that become serious could have been resolved when they were small. The students who get good marks in behavioral interviews are the ones who can demonstrate they did not wait — they addressed the issue directly, with respect, and with a focus on the team's goal rather than winning an argument.

---

## Scenario-Based Practice

Scenario questions sound like: "Imagine you are on a team and one member is consistently missing deadlines. What would you do?"

These require you to think through a process, not just recall a past event. Here is how to approach them:

\`\`\`
SCENARIO ANSWER STRUCTURE

1. Immediate action: What do you do first?
2. Understanding: Before acting, what do you want to understand?
3. Direct conversation: When and how do you address it directly?
4. Escalation: At what point and in what way would you escalate?
5. Long-term: What do you do to prevent the issue recurring?
\`\`\`

**Example scenario:** "Your teammate keeps missing PR reviews, blocking your work. What do you do?"

> "First I would check whether I am actually blocked or can keep working on something else to stay productive. Then I would have a direct conversation — not a message asking 'can you review?' but actually talking to them: 'I have noticed the PR has been sitting for two days. Is there anything blocking you from getting to it?' I want to understand if there is a reason before assuming they are just not prioritizing it.
>
> If after talking, the pattern continues, I would ask my tech lead to clarify expectations around review turnaround — framed as a process question, not a personal complaint. And I would suggest we add a simple norm: PRs should be reviewed within 24 business hours unless there is a reason they cannot be.
>
> The goal throughout is to solve the problem, not to get the person in trouble."

Notice: this answer demonstrates empathy, direct communication, process thinking, and de-escalation — all things interviewers want to see.`,
  codeExamples: [],
  commonMistakes: [
    'Blaming teammates excessively — even if they were difficult, the answer should focus on what you did in response',
    'Claiming to have never had a team conflict — this is not credible; every team has friction at some point',
    'Being too vague: "I am good at working in teams" — give a specific story with real details',
    'In scenario questions, jumping straight to escalation — always try to resolve things directly first',
    'Forgetting your role in team failures — a mature candidate acknowledges their contribution to what went wrong',
    'Describing difficult colleagues in harshly judgmental terms — this signals poor professional maturity',
  ],
  interviewQuestions: [
    {
      question: 'Tell me about a time you worked effectively as part of a team.',
      answer:
        'Use STAR to describe a team context, your specific role, a real challenge the team faced, and what you specifically did to contribute to the solution. Include a learning about collaboration. The best answers name a specific moment where the team almost went wrong and show how you helped navigate it.',
      difficulty: 'beginner',
    },
    {
      question: 'Describe a time you had a conflict with a teammate.',
      answer:
        'Focus on what you did to resolve the conflict, not on how bad the other person was. Describe the disagreement briefly, explain how you approached the other person directly and respectfully, describe the conversation or process that led to resolution, and end with what you learned about navigating disagreement professionally.',
      difficulty: 'intermediate',
      tip: 'The best conflict stories involve a genuine disagreement where both parties had legitimate points — not just "they were wrong and I was right."',
    },
    {
      question: 'How do you handle a team member who is not pulling their weight?',
      answer:
        'Start with curiosity, not judgment. Have a direct one-on-one conversation to understand if there is a reason — personal issues, unclear expectations, or blockers they have not communicated. If the direct conversation does not resolve it, set clear expectations together. If it continues, involve a lead or manager — framing it as a process question, not a personal complaint. Throughout, focus on the team\'s goal, not on the individual\'s failure.',
      difficulty: 'intermediate',
    },
  ],
  exercises: [
    {
      id: 'teamwork-scenarios',
      title: 'Write Your Team Stories and Practice Scenarios',
      description:
        'Complete the story bank entries for teamwork situations, then practice the scenario responses by writing your thought process for each scenario.',
      starterCode: `// TEAMWORK STORY BANK

const teamworkStories = {

  bestCollaboration: {
    context: "", // Team size, project, timeframe
    yourRole: "", // Your specific contribution
    challenge: "", // What was hard about the collaboration?
    whatYouDid: "", // Specifically what YOU did
    outcome: "", // What happened?
    learned: "", // What do you understand now about teamwork?
  },

  difficultTeamMember: {
    whatMadeItHard: "", // Working style clash, communication issue, etc.
    whatYouTried: "", // Your first attempt to address it
    howItEvolved: "", // What happened after your first attempt?
    outcome: "", // How did the situation resolve?
    learned: "", // What did this teach you about collaboration?
  },

  teamFailure: {
    whatWentWrong: "", // Specific outcome
    yourContribution: "", // YOUR role in what went wrong
    whatYouWouldChange: "", // Specific process change
    learned: "",
  },
};

// SCENARIO PRACTICE
const scenarios = {

  scenario1: {
    situation: "Your teammate keeps missing PR reviews, blocking your work.",
    immediateAction: "",
    understandingStep: "",
    directConversation: "",
    escalationPoint: "",
    whatYouLearnedToPrevent: "",
  },

  scenario2: {
    situation: "Two teammates have a personality clash that is disrupting team progress. You are not the lead.",
    immediateAction: "",
    yourRole: "",
    howYouHelp: "",
    boundary: "", // When does this stop being your problem to solve?
  },
};`,
      solution: `// Example completed entries

const exampleTeamworkStories = {

  difficultTeamMember: {
    whatMadeItHard: "Working style clash — I plan before coding, he codes before planning. We both thought the other's approach was wasting time.",
    whatYouTried: "Initially, I ignored it and worked around his approach. That created inconsistency in the codebase.",
    howItEvolved: "After day one at a hackathon, I suggested we try a 45-minute design phase before coding and re-evaluate at natural breakpoints.",
    outcome: "He agreed. His quick prototyping helped us validate ideas faster; my planning reduced integration bugs. We delivered.",
    learned: "Different working styles can complement each other if you negotiate instead of fighting or ignoring. I now try to understand someone's style before deciding it is wrong.",
  },

  teamFailure: {
    whatWentWrong: "Submitted an incomplete project — missing visualization, backend had known bugs.",
    yourContribution: "I was team lead in name but not in practice. I tracked progress mentally and never surfaced blockers. Two members were stuck for a week and I did not know.",
    whatYouWouldChange: "Add a visible tracking mechanism from day one — even a simple shared doc or 10-minute check-in. Not because I distrust people, but because blockers need light to get resolved.",
    learned: "Leadership means creating visibility, not just assigning tasks. Problems do not surface themselves.",
  },
};

const exampleScenarios = {
  scenario1: {
    situation: "Teammate keeps missing PR reviews, blocking your work.",
    immediateAction: "Check if I can work on something else to stay productive while waiting.",
    understandingStep: "Before assuming they are deprioritizing my work, ask directly: 'I noticed the PR has been there a couple days — is anything blocking you from getting to it?'",
    directConversation: "In person or on a call, not in chat. Explain the impact on my work. Ask if there is something I can do to make reviewing easier.",
    escalationPoint: "If the pattern continues after the conversation, ask the tech lead to clarify review turnaround expectations for the team — framed as a process question.",
    whatYouLearnedToPrevent: "Proactively set review turnaround norms at the start of a project. Make the expectation explicit so there is no ambiguity later.",
  },
};`,
      hints: [
        'When writing about a difficult team member, do a "tone check" — if the entry sounds like a complaint, reframe it around what you did',
        'In scenario responses, always include an understanding step before action — jumping to conclusions is what creates team problems',
        'Write 3-4 variations of your best teamwork story so you can adapt it depending on what the question emphasizes',
      ],
    },
  ],
  keyTakeaways: [
    'Teamwork questions evaluate collaboration, conflict navigation, communication, adaptability, accountability, and team-first mindset',
    'Never frame a teamwork answer primarily around how bad a colleague was — focus on what you did in response',
    'Address conflict directly and early — interviewers want to see that you did not let problems fester',
    'In scenario questions, always demonstrate understanding before action and direct conversation before escalation',
    'Acknowledge your contribution to team failures — this is a sign of maturity, not weakness',
    'Different working styles can be assets if negotiated — the best team answers show adaptation, not intolerance',
  ],
  prevLesson: 'project-discussions',
  nextLesson: 'leadership-questions',
};
