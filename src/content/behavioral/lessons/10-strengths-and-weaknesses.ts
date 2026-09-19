import type { Lesson } from '@/types';

export const strengthsWeaknessesLesson: Lesson = {
  id: 'strengths-and-weaknesses',
  slug: 'strengths-and-weaknesses',
  title: 'Strengths and Weaknesses',
  description:
    'Give honest, specific answers to "What is your greatest strength?" and "What is your greatest weakness?" — without either bragging or pretending your weakness is secretly a strength.',
  category: 'Core Questions',
  order: 10,
  difficulty: 'beginner',
  estimatedTime: 35,
  content: `"What is your greatest strength?"
"What is your greatest weakness?"

These two questions are asked in nearly every HR interview. And yet most candidates give terrible answers to both.

For strengths: vague claims like "I am hardworking and passionate" that every other candidate also says.
For weaknesses: disguised strengths like "I am too much of a perfectionist" that interviewers have heard thousands of times and find insulting.

The right approach to both questions requires the same thing: honesty with specificity.

---

## The Strengths Question

### What the Interviewer Wants

When an interviewer asks about your greatest strength, they want to know:
- What specific quality makes you effective?
- Can you give evidence that this is actually true?
- Is this strength relevant to the role?

"I am hardworking" is not an answer. Every candidate says this. It is also unverifiable — you saying you are hardworking proves nothing.

A good strength answer has three parts:
1. **Name the strength precisely** (not a generic virtue)
2. **Give a specific example** that demonstrates it in action
3. **Connect it to the role** (why this strength matters here)

### Types of Genuine Strengths

Here are strengths that work well when supported by evidence:

**Technical:**
- Debugging systematically under pressure
- Learning new technologies quickly and deeply (not just surface familiarity)
- Designing clean, modular systems before writing code

**Professional:**
- Breaking down complex problems into deliverable pieces
- Communicating technical decisions clearly to non-technical people
- Taking ownership beyond my assigned scope when needed

**Personal:**
- Persistence through ambiguous problems
- Asking clarifying questions before building
- Teaching and explaining concepts to others

**What does NOT work as a strength:**
- Vague virtues without evidence: "hardworking," "dedicated," "passionate"
- Strengths everyone claims: "good team player," "fast learner" (without proof)
- Strengths that sound suspiciously perfect for the job description

### Example Strength Answers

**Weak:**
> "My greatest strength is that I am a quick learner. I love picking up new technologies."

**Strong:**
> "My greatest strength is systematic debugging. When I encounter a problem I have not seen before, I do not panic or randomly try things — I reproduce the issue, form a hypothesis, test it, and follow the evidence. During a hackathon, I traced an intermittent race condition in our real-time sync system to a socket connection being recreated on every React re-render. I found it in three hours because I tested each layer independently before jumping to conclusions. In a backend role like this one, where production bugs need to be diagnosed quickly, this way of thinking is where I add consistent value."

Notice: this names the strength precisely ("systematic debugging"), gives a specific example with real detail, and connects it to the role.

---

**Weak:**
> "I am passionate about coding. I spend a lot of time working on personal projects."

**Strong:**
> "My greatest strength is understanding what a user needs before writing code. I have a habit of building the smallest version of something — just enough to test the assumption — before committing to a full implementation. In my expense tracker project, instead of building the full multi-currency calculation system upfront, I first validated that my basic single-currency flow actually worked end-to-end with real data. That prototype revealed three data model problems I would have had to unwind later if I had gone further. In product engineering roles, this saves a lot of rework."

---

## The Weaknesses Question

### What the Interviewer Wants

When an interviewer asks about your greatest weakness, they are evaluating:
1. **Self-awareness** — Do you know your real weaknesses?
2. **Honesty** — Are you telling the truth?
3. **Growth mindset** — Are you working on it?

The disguised strength trap is to say something that sounds like a weakness but is really a strength:
- "I am too perfectionist" → "I work really hard and care about quality"
- "I struggle to delegate because I want everything done right" → "I am very responsible"
- "I sometimes work too many hours" → "I am highly dedicated"

Interviewers have heard these hundreds of times. When you give a disguised strength, you communicate that you are either dishonest or have no genuine self-awareness. Neither is a good signal.

### What Makes a Good Weakness Answer

A good weakness answer:
1. **Names a real weakness** — something that has actually cost you or someone else time, quality, or results
2. **Explains where it comes from or when it shows up** — context makes it credible
3. **Shows what you are doing about it** — concrete steps, not "I am working on it"
4. **Is not catastrophic for the role** — real, but not disqualifying

### Types of Genuine Weaknesses

**Process and working style:**
- Underestimating how long new tasks take (estimation weakness)
- Difficulty saying no, leading to overcommitment
- Preferring to work alone when collaboration would be faster
- Moving too fast at the start without enough planning

**Communication:**
- Struggling to explain technical concepts simply to non-technical people
- Being too direct in a way that sometimes comes across as abrupt
- Difficulty in difficult conversations — tending to avoid or delay them

**Technical:**
- A specific technology area you are not confident in (and say why + what you are doing)
- Tendency to over-engineer simple solutions

**What does NOT work as a weakness:**
- Any disguised strength
- Something so minor it is trivially irrelevant ("sometimes I lose track of time when I am focused")
- Something catastrophically relevant to the role ("I find it hard to meet deadlines")

### Example Weakness Answers

**Weak:**
> "My greatest weakness is that I am a perfectionist. I like to make sure everything is right before moving on."
(Disguised strength — do not use this.)

**Strong:**
> "My greatest weakness is estimation. I consistently underestimate how long tasks take when they involve something I have not done before — I anchor on the technical work but do not budget enough time for the learning curve. This cost me and my team a five-day slip in a group project when I underestimated an OAuth implementation.
>
> I am actively working on this. My rule now is: I never give a timeline estimate for unfamiliar work without a one-day spike first. I prototyped three new API integrations during my last project using this approach and hit all three estimates. It is not a natural instinct yet, but it is becoming a habit."

---

**Weak:**
> "Sometimes I do not communicate enough when I am working — I just get into flow and forget to update people."
(Too vague — could be anyone)

**Strong:**
> "I find it difficult to have direct conversations when I think someone's work is substandard. Instead of saying 'this code has a serious design issue,' I tend to phrase it so gently in a code review that the feedback gets lost. A teammate implemented something I thought was architecturally wrong in our project, I gave very mild feedback, they left it as is, and we shipped it. Three weeks later it became a maintenance problem exactly as I had expected.
>
> I have been deliberately practicing more direct feedback — saying 'I think this will create a problem because X, here is what I would suggest instead' rather than 'this is interesting, maybe you could consider...'. It is uncomfortable, but the code review that is too gentle is useless."

---

## Picking the Right Weakness for the Context

Not all weaknesses are appropriate for all interviews. Consider:

\`\`\`
ROLE CONTEXT → WEAKNESS TO AVOID

Backend engineering role    Do not mention: "I find it hard to meet deadlines"
Team-heavy role             Do not mention: "I struggle to collaborate"
Customer-facing role        Do not mention: "I find client communication very stressful"
Leadership role             Do not mention: "I find it hard to make decisions independently"
\`\`\`

Pick a weakness that is:
- Real (you are actually working on it)
- Not catastrophically bad for the role
- Something you can show active progress on

---

## Combining Strengths and Weaknesses

Some interviewers ask for both in sequence. The structure works well together:

1. Strength (specific + example + role connection)
2. Weakness (real + context + what you are doing about it)
3. Brief connection: "The combination of [strength] and awareness of [weakness] means I bring [value] while being careful about [where I need to be watchful]."

This shows mature self-understanding — you know what you do well and you know what you need to watch.`,
  codeExamples: [],
  commonMistakes: [
    'Giving vague strengths like "hardworking" or "passionate" without specific evidence',
    'Giving disguised strengths as weaknesses ("I am too much of a perfectionist") — interviewers recognize this immediately',
    'Choosing a weakness that is catastrophically relevant to the role — use real but not disqualifying',
    'For weaknesses, saying "I am working on it" without describing what specifically you are doing',
    'For strengths, not connecting to the role — why does this strength matter for this specific job?',
    'Choosing a weakness that is too trivial: "I sometimes lose track of time" — use something with real consequences',
  ],
  interviewQuestions: [
    {
      question: 'What is your greatest strength?',
      answer:
        'Name a specific professional quality — not a generic virtue. Give a concrete example of it in action with real details. Connect it to why it matters in the role you are applying for. The strength should be something that has measurably helped you or others — not something you just believe about yourself without evidence.',
      difficulty: 'beginner',
      tip: 'Choose a strength you can prove. If you cannot give a specific example that demonstrates it, you have not proven it — you have only claimed it.',
    },
    {
      question: 'What is your greatest weakness?',
      answer:
        'Name a real weakness — not a disguised strength. Explain when it shows up and what consequences it has had. Then describe specifically what you are doing to address it — a concrete habit, rule, or process you have put in place. The weakness should be real but not catastrophically relevant to the role.',
      difficulty: 'beginner',
      tip: 'The quality of your weakness answer is tested by the follow-up: "How are you working on that?" If you cannot answer with specifics, you have not actually thought about it.',
    },
    {
      question: 'How do you know when to ask for help versus figuring something out yourself?',
      answer:
        'This is a hidden question about self-awareness and time management. Give a genuine principle: set a time box (e.g., "I spend 20-30 minutes genuinely trying to understand the problem myself before asking"), then ask with context ("I ask with a clear description of what I have already tried, so I am not asking someone to do my thinking for me"). Acknowledge when the balance is off — if you have wasted hours on something you could have asked about in 5 minutes, that is a real cost.',
      difficulty: 'intermediate',
    },
  ],
  exercises: [
    {
      id: 'strengths-weaknesses-preparation',
      title: 'Write Your Honest Strengths and Weaknesses',
      description:
        'Write three genuine strengths with evidence, and two genuine weaknesses with specific actions you are taking. Run each through the quality checks before finalizing.',
      starterCode: `// STRENGTHS WITH EVIDENCE

const myStrengths = [
  {
    strengthName: "", // Precise label, not a generic virtue
    evidenceExample: {
      context: "", // When/where did this strength show up?
      whatYouDid: "", // Specific action demonstrating the strength
      impact: "", // What changed because of this strength?
    },
    roleConnection: "", // Why does this matter for the role you are applying to?
    qualityCheck: {
      isItSpecific: false, // Not "hardworking" but "systematic problem decomposition"
      canYouProveIt: false, // Do you have a real example?
      isItRelevant: false, // Does it connect to the role?
    },
  },
  // Add 2 more strengths following the same structure
];

// WEAKNESSES WITH ACTIVE IMPROVEMENT

const myWeaknesses = [
  {
    weaknessName: "",
    whenItShowsUp: "", // Context — not always, but specifically when?
    realConsequence: "", // What has this actually cost you?
    whatYouAreDoing: {
      specificHabit: "", // Not "I am working on it" but a named habit or rule
      evidence: "", // Have you applied this habit? What happened?
    },
    qualityCheck: {
      isItDisguisedStrength: false, // If true, choose a different weakness
      isCatastrophicForRole: false, // If true, choose a different weakness
      canYouShowProgress: false, // If false, you have not thought about this enough
    },
  },
  // Add 1 more weakness
];`,
      solution: `// Example completed strengths and weaknesses

const exampleStrengths = [
  {
    strengthName: "Systematic debugging under pressure",
    evidenceExample: {
      context: "Hackathon — 36-hour build, intermittent race condition in real-time sync system",
      whatYouDid: "Isolated the issue layer by layer — ruled out frontend state, ruled out network, traced it to WebSocket connection being recreated on every React re-render using browser DevTools timeline",
      impact: "Found and fixed the race condition in 3 hours, leaving 18 hours for other features",
    },
    roleConnection: "Backend engineering roles require diagnosing production issues quickly. Systematic debugging is exactly where I add reliable value under pressure.",
    qualityCheck: {
      isItSpecific: true,
      canYouProveIt: true,
      isItRelevant: true,
    },
  },
];

const exampleWeaknesses = [
  {
    weaknessName: "Underestimating task time when there is an unfamiliar component",
    whenItShowsUp: "When I need to implement something I have never built before and anchor my estimate on the code I need to write rather than the learning I need to do first",
    realConsequence: "Caused a 5-day team slip in a group project when I underestimated OAuth2 implementation. My team was blocked for those 5 days.",
    whatYouAreDoing: {
      specificHabit: "Personal rule: never give a timeline for unfamiliar work without a one-day discovery spike first. Prototype just enough to understand the real complexity, then estimate.",
      evidence: "Applied this to three API integrations in my last project. Hit all three estimates. The rule is working.",
    },
    qualityCheck: {
      isItDisguisedStrength: false,
      isCatastrophicForRole: false, // Not ideal, but I am actively improving with evidence
      canYouShowProgress: true,
    },
  },
];`,
      hints: [
        'If your strength does not have a real example to prove it, do not use it — find a strength you can actually demonstrate',
        'The disguised strength test: ask yourself "does this weakness actually cause problems for me or others?" If no, it is probably a disguised strength',
        'For weaknesses, the "what you are doing about it" section should be specific enough that a follow-up question like "give me an example of applying that habit" would be easy to answer',
      ],
    },
  ],
  keyTakeaways: [
    'Strengths require evidence — "I am a quick learner" without proof is an unverifiable claim; give a specific example',
    'Good strength answers: name it precisely + give a real example + connect to the role',
    'Disguised strengths as weaknesses are a red flag — interviewers recognize them immediately and it damages your credibility',
    'Good weakness answers: name a real weakness + show real consequences + describe specific active improvement with evidence',
    'Choose weaknesses that are real but not catastrophically relevant to the core requirements of the role',
    'Self-awareness is the underlying skill both questions evaluate — candidates who know themselves genuinely are far more trustworthy to hire',
  ],
  prevLesson: 'conflict-questions',
  nextLesson: 'internship-questions',
};
