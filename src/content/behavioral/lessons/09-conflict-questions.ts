import type { Lesson } from '@/types';

export const conflictQuestionsLesson: Lesson = {
  id: 'conflict-questions',
  slug: 'conflict-questions',
  title: 'Conflict Questions',
  description:
    'Learn to answer conflict questions with professionalism and honesty — disagreements with teammates, managers, and different opinions — without sounding combative or conflict-avoidant.',
  category: 'Behavioral Scenarios',
  order: 9,
  difficulty: 'intermediate',
  estimatedTime: 40,
  content: `Conflict is a normal part of working with other people. Different people have different ideas, different working styles, and different priorities. Teams that never have conflict usually have low trust — people are not being honest with each other.

What matters is not whether conflict happens, but how you navigate it. Behavioral conflict questions are designed to evaluate exactly that.

---

## What Conflict Questions Evaluate

\`\`\`
WHAT INTERVIEWERS LOOK FOR

Professional communication    Do you address disagreements directly and respectfully?
Empathy                       Can you understand the other person's perspective?
Focus on outcomes             Do you argue to win, or to reach the best result?
Adaptability                  Can you change your position when the evidence supports it?
Escalation judgment           Do you know when to escalate and when to resolve directly?
Non-reactivity                Can you stay calm and productive under interpersonal tension?
\`\`\`

The worst conflict answers fall into two categories:
1. **Combative:** "I told them they were wrong and I was right. I do not back down when I know I am correct."
2. **Conflict-avoidant:** "I just go along with whatever the team decides. I do not like conflict."

Both signal poor interpersonal judgment. The first is aggressive. The second means you will not speak up when you see something wrong.

The best answers demonstrate **direct, professional disagreement** followed by either reaching a resolution together or accepting a decision gracefully after making your case.

---

## "Tell Me About a Time You Disagreed With a Teammate"

This is the most common conflict question. The key elements:

1. The disagreement was genuine (not trivial)
2. You addressed it directly (not passive-aggressively or through a third party)
3. You understood their perspective before defending yours
4. The resolution was professional and forward-looking

**Example:**
> "During a group project, my teammate and I disagreed about whether to use a REST API or GraphQL for our backend. He wanted GraphQL because he had seen it in a tutorial and found it interesting. I argued for REST because neither of us had used GraphQL before and we had four weeks, not four months.
>
> We had a back-and-forth that started getting tense — he felt I was dismissing his idea, and honestly maybe I was not listening carefully enough to why he wanted it.
>
> I asked for a 30-minute discussion where we both made our case with specific tradeoffs. He argued that GraphQL would reduce over-fetching — our frontend had complex data requirements. I acknowledged that was a real advantage. I then argued that the learning curve would consume at least one week of our four, and if we hit problems, neither of us could debug it.
>
> We agreed on REST but committed to adding a GraphQL spike at the end if we had time. We did not have time, but the project succeeded. Looking back: he was probably right that GraphQL would have been better for the data shape. I was probably right that the timeline made it risky. We reached a reasonable compromise."

Notice: this answer acknowledges the interviewer might think the other person had a point. It shows humility and genuine reflection, not just "and I was right."

---

## "Tell Me About a Time You Disagreed With Your Manager"

This question tests whether you can respectfully push back on authority while maintaining a professional relationship.

**What to demonstrate:**
- You raised your concern directly to the manager (not gossiping to teammates)
- You were respectful in how you did it
- You made your case with evidence or reasoning, not emotion
- After the conversation, you either changed your mind (and explain why), or the manager changed their decision, or you accepted the decision and executed it professionally

**Example:**
> "During my internship, my manager assigned me to rewrite a module from Python to JavaScript for what he described as 'consistency.' Looking at the module, I did not think the rewrite was worth the risk — the Python module was running reliably in production, and a rewrite always introduces the possibility of introducing new bugs.
>
> I scheduled a brief meeting. I said: 'I want to make sure I understand the goal here — is this primarily about the language consistency, or are there bugs in the current module we are trying to address?' He said it was purely about consistency.
>
> I then asked: 'Would it help if I documented the module thoroughly first, so other developers can understand it without rewriting it? A rewrite risks introducing bugs into something that is currently working reliably.' He paused, thought about it, and agreed that documentation was probably sufficient.
>
> He thanked me for raising it. The Python module stayed in production. I learned that you can push back on decisions if you do it with curiosity and evidence rather than protest."

Notice: the student did not say "my manager was wrong." They asked a question that opened the discussion, offered an alternative, and framed everything in terms of the project's goals.

---

## "How Do You Handle Disagreements?"

This is a process question, not a story question. Give your general philosophy and then support it with an example.

**A good philosophy:**
> "I try to address disagreements directly and early — not let them fester. My default is to separate the person from the idea: I am disagreeing with a decision, not attacking someone. I ask questions before stating my position, because I often find that I was missing information that changes my view. If we still disagree after a real discussion, I am willing to defer to whoever has the authority or expertise to make the call — but I make my case clearly first so it is a documented position, not a silent objection."

---

## Different Opinions on Technical Decisions

Technical disagreements are common and interviewers care about how engineers navigate them.

**Example question:** "Tell me about a time you and another developer disagreed on how to implement something."

**What to demonstrate:**
- Technical argument, not personal argument
- Willingness to test rather than just debate
- Data-driven decision making where possible
- Graceful acceptance if the team chose a different path

**Example:**
> "In a project, I wanted to implement caching at the API layer to reduce database load. My teammate thought it would add unnecessary complexity and that we should optimize the database queries first.
>
> We debated for a while without getting anywhere. I suggested we each write down our argument as if we were writing a short technical proposal — not to win, but to make sure we were both being precise. When I wrote mine out, I realized I had no data on whether the database was actually slow. I was solving a hypothetical problem.
>
> We profiled the application and found the database queries were fast. My teammate was right. We did not add caching.
>
> The specific lesson: I now advocate for profiling before optimizing. If you cannot measure the problem, you might not have a problem."

---

## When to Escalate Conflict

Some conflicts cannot be resolved between the two people directly. Knowing when and how to escalate is a professional skill.

**Escalate when:**
- The conflict is affecting your ability to work
- Multiple direct conversations have not improved the situation
- The issue involves something that affects the team or product significantly
- There is a code of conduct or professional boundary being crossed

**How to escalate professionally:**
- Frame it as a process question, not a personal complaint
- Describe the situation factually, not emotionally
- Explain what you have already tried
- Ask for guidance or mediation, not punishment

**What NOT to say when escalating:**
- "She is impossible to work with"
- "He is incompetent and I need him removed"
- Any personal attack that does not describe specific behaviors

**What to say:**
> "I have a collaboration challenge I would like your input on. I have had two conversations with X about [specific issue] and the situation has not changed. I want to make sure this does not affect [project/team outcome]. Can we talk about how to handle it?"

---

## The Spectrum of Conflict Stories

Not all conflict stories need to be intense. Here is a spectrum of valid conflict stories:

\`\`\`
LOW INTENSITY
→ "We disagreed about the right technology choice and resolved it through a short discussion"
→ "We had different estimates for how long a feature would take; we broke it down together"

MEDIUM INTENSITY
→ "We had a persistent disagreement about code quality standards that required involving the team"
→ "My teammate and I had different views on scope that created tension for a week"

HIGH INTENSITY
→ "A teammate was dismissive of my contributions in team meetings"
→ "I disagreed with a critical technical decision that I thought would create production risk"
\`\`\`

For most behavioral interviews, a medium-intensity story is ideal. It shows real conflict without suggesting you constantly have high-drama situations.`,
  codeExamples: [],
  commonMistakes: [
    'Claiming you never have conflict — this is not believable and suggests conflict avoidance',
    'Framing the story entirely as "they were wrong and I was right" — even if true, show empathy for the other perspective',
    'Gossiping to teammates instead of addressing the conflict directly',
    'Going nuclear immediately — escalating to HR or senior management without attempting direct resolution first',
    'Being passive-aggressive: "I just went along with it" but clearly resenting it — this is not professional conflict resolution',
    'Choosing a conflict story where the other person was clearly wrong — the best stories involve legitimate competing perspectives',
  ],
  interviewQuestions: [
    {
      question: 'Tell me about a time you had a conflict with a teammate.',
      answer:
        'Describe a genuine disagreement — ideally one where both parties had legitimate points. Show that you addressed it directly and respectfully. Include what you understood about their perspective before making your case. Describe the resolution and what you learned about navigating disagreement professionally. Avoid framing the other person as simply "wrong."',
      difficulty: 'intermediate',
    },
    {
      question: 'Have you ever disagreed with a manager or senior engineer? How did you handle it?',
      answer:
        'Show that you can respectfully push back on authority. Describe how you raised your concern directly and professionally — with a question or evidence, not a protest. Include what happened after the conversation: either you were persuaded by new information, the manager reconsidered, or you accepted the decision professionally after making your case. The key is showing respectful directness, not either blind compliance or combativeness.',
      difficulty: 'intermediate',
      tip: 'Avoid stories where you defied the decision unilaterally. Even if you thought you were right, going around a decision without agreement signals poor professional judgment.',
    },
    {
      question: 'How do you handle disagreements on technical decisions?',
      answer:
        'Describe your process: separate the technical argument from the personal relationship, ask questions before stating your position, be willing to test or measure rather than just debate, follow the evidence wherever it leads, and accept the team\'s decision gracefully after making your case. Support with a brief example.',
      difficulty: 'intermediate',
    },
    {
      question: 'Tell me about a time you worked with someone who communicated very differently from you.',
      answer:
        'Describe the working style difference specifically (direct vs. indirect, synchronous vs. asynchronous, detailed vs. summary). Explain how the difference created friction. Describe what you did to adapt or negotiate a middle ground. End with what you learned about accommodating different communication styles — and ideally, how the collaboration actually benefited from the different styles.',
      difficulty: 'beginner',
    },
  ],
  exercises: [
    {
      id: 'conflict-story-preparation',
      title: 'Prepare Your Conflict Stories',
      description:
        'Identify two conflict stories at different intensity levels. For each story, fill in the full structure including the other person\'s perspective (not just yours). Run a "tone check" to make sure you are not framing it as "they were wrong."',
      starterCode: `// CONFLICT STORY PREPARATION

const conflictStory1 = {
  type: "teammate | manager | technical decision",
  intensityLevel: "low | medium | high",

  situation: "",

  theDisagreement: {
    yourPosition: "",
    theirPosition: "",
    whyTheirPositionWasLegitimate: "", // Force yourself to articulate this
  },

  howYouAddressedIt: {
    didYouGoDirectly: true, // Never gossip — always direct
    howYouOpenedTheConversation: "",
    whatYouListenedFor: "",
    howYouMadeYourCase: "",
  },

  resolution: {
    whatHappened: "",
    didYouChangeYourMind: false,
    didTheyChangeTheirMind: false,
    wasItACompromise: false,
    wasItAcceptedDecision: false, // You accepted their decision professionally
  },

  toneCheck: {
    doesItSoundLikeComplaining: false,
    doesItShowEmapthy: true,
    doesItShowDirectCommunication: true,
    doesItShowProfessionalGrowth: true,
  },

  learned: "",
};`,
      solution: `// Example completed conflict story

const technicalDisagreementStory = {
  type: "technical decision",
  intensityLevel: "medium",

  situation: "Group project — disagreement about REST vs GraphQL for the backend API",

  theDisagreement: {
    yourPosition: "Use REST because neither of us knows GraphQL and the learning curve would risk the timeline",
    theirPosition: "Use GraphQL because our frontend has complex data requirements and GraphQL reduces over-fetching",
    whyTheirPositionWasLegitimate: "He was right that our data requirements were complex. GraphQL would genuinely have been a better technical fit for the frontend consumption pattern.",
  },

  howYouAddressedIt: {
    didYouGoDirectly: true,
    howYouOpenedTheConversation: "Asked for 30 minutes to both make our cases with specific tradeoffs — not to debate, but to understand",
    whatYouListenedFor: "The actual technical reason he wanted it, not just that he found it interesting",
    howYouMadeYourCase: "Acknowledged the over-fetching advantage was real. Then framed the timeline risk specifically: the learning curve would consume at least one week of our four.",
  },

  resolution: {
    whatHappened: "Agreed on REST, with a commitment to spike GraphQL at the end if we had time. We did not have time.",
    didYouChangeYourMind: false,
    didTheyChangeTheirMind: true, // Partially — accepted the timeline constraint
    wasItACompromise: true,
    wasItAcceptedDecision: false,
  },

  toneCheck: {
    doesItSoundLikeComplaining: false,
    doesItShowEmpathy: true, // Acknowledged their point was technically valid
    doesItShowDirectCommunication: true,
    doesItShowProfessionalGrowth: true,
  },

  learned: "The person I disagree with often has a legitimate point — the goal of a technical argument should be to find the best outcome for the project, not to win.",
};`,
      hints: [
        'The "whyTheirPositionWasLegitimate" field is the most important one to fill in — if you cannot articulate it, you might not have listened well enough during the actual conflict',
        'A conflict story where you were completely right and they were completely wrong is a weak story — real conflicts almost always have legitimate perspectives on both sides',
        'Run your story through the tone check honestly — if it sounds like a complaint about the other person, reframe it around what you did',
      ],
    },
  ],
  keyTakeaways: [
    'Conflict is normal — what matters is how you navigate it, not whether it happens',
    'Always address conflict directly and respectfully — not through gossip, passive aggression, or avoidance',
    'Before making your case, understand the other person\'s perspective well enough to articulate why their position is legitimate',
    'Separate the technical or professional argument from the personal relationship — you can strongly disagree on an idea while maintaining respect for the person',
    'Accept decisions gracefully after making your case — you do not always get to win, and that is not the goal',
    'Know when to escalate: after multiple direct conversations fail, when team outcomes are affected, or when a professional boundary is crossed',
    'The best conflict stories involve competing legitimate perspectives, not one clearly right person and one clearly wrong person',
  ],
  prevLesson: 'failure-questions',
  nextLesson: 'strengths-and-weaknesses',
};
