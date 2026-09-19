import type { Lesson } from '@/types';

export const mockInterviewHubLesson: Lesson = {
  id: 'mock-interview-hub',
  slug: 'mock-interview-hub',
  title: 'Mock Interview Hub',
  description:
    'Practice full behavioral interviews with realistic scenarios for beginners, internship seekers, placement candidates, startup interviews, and product company interviews.',
  category: 'Practice',
  order: 15,
  difficulty: 'intermediate',
  estimatedTime: 90,
  content: `Reading about behavioral interviews is not enough. The skill is built through practice — specifically, through speaking your answers out loud under simulated interview conditions.

This module provides complete mock interview scripts for five different contexts. For each one: read the context, go through the questions out loud (not in your head — spoken), and evaluate your performance against the criteria provided.

Do not read ahead. Answer each question before moving to the next.

---

## How to Use This Module

**Step 1: Set the scene**
Find a quiet place. Set a timer for the interview length. Sit up straight. Treat it like a real interview.

**Step 2: Answer out loud**
No typing your answers. No writing them down first. Speak, the way you would in a real interview.

**Step 3: Record yourself**
Use your phone to record the session. Listen back after. You will catch things you did not notice while speaking.

**Step 4: Self-evaluate**
After each mock, score yourself on: structure, specificity, clarity, ownership, and authenticity.

**Step 5: Identify one thing to improve**
Do not try to fix everything at once. Each mock practice, focus on one improvement.

---

## Mock Interview 1: Beginner (First Year Student / No Experience)

**Context:** You are a first-year CS student with no internship, no significant projects, and limited experience. You have done some self-learning.

**Duration:** 20 minutes

---

**Question 1 (opening):** Tell me about yourself.

*Evaluation criteria:*
- Did you start with your current situation, not your biography?
- Did you mention what you are learning?
- Did you connect to why you are here?
- Was it under 90 seconds?

---

**Question 2:** Why did you choose computer science?

*Evaluation criteria:*
- Did you give a specific, genuine reason?
- Did you avoid clichés like "technology is the future"?
- Was there a specific moment, project, or person that influenced the decision?

---

**Question 3:** Tell me about a time you had to learn something difficult.

*Evaluation criteria:*
- Did you name a specific thing you learned?
- Did you describe how you approached the learning (not just "I studied")?
- Did you mention a specific moment where it clicked or where you struggled?
- Did you connect it to an outcome?

---

**Question 4:** Describe a time you worked on a group project.

*Evaluation criteria:*
- Did you name your specific role and contribution?
- Did you mention a real challenge the team faced?
- Did you focus on what YOU did, not just what "we" did?

---

**Question 5:** What is one thing you are working to improve about yourself?

*Evaluation criteria:*
- Is this a genuine weakness or a disguised strength?
- Did you describe a specific consequence of this weakness?
- Did you describe what you are doing about it?

---

## Mock Interview 2: Internship Seeker (Mid-Degree With Projects)

**Context:** You are a second or third year student with 2-3 personal projects and some self-directed learning. You are applying for a software engineering internship.

**Duration:** 30 minutes

---

**Question 1:** Tell me about yourself.

*(Use the internship version from Module 3)*

---

**Question 2:** Walk me through your most significant project.

*Evaluation criteria:*
- Did you explain what problem it solved, not just what it is?
- Did you name specific technology choices and explain WHY?
- Did you describe the hardest challenge and how you debugged it?
- Did you mention what you would do differently?

---

**Question 3:** Tell me about a time you solved a problem you had never encountered before.

*Evaluation criteria:*
- Did you show hypothesis formation?
- Did you mention what you tried that was wrong?
- Did you describe the investigation process, not just the answer?

---

**Question 4:** Why do you want this internship?

*(Answer for a real company you are interested in)*

*Evaluation criteria:*
- Is there something specific about the company?
- Did you avoid generic enthusiasm?
- Did you mention what you want to learn that you cannot get from personal projects?

---

**Question 5:** What are your technical strengths and where are you weakest?

*Evaluation criteria:*
- Is the strength specific and proven by example?
- Is the weakness real (not a disguised strength)?
- Is there evidence you are actively improving on the weakness?

---

**Question 6:** Do you have any questions for me?

*(Ask 2-3 genuine questions)*

*Evaluation criteria:*
- Are the questions rooted in research about the company?
- Are they about the work, the team, or the culture?
- Are any of them easily Googleable? (If yes, replace them)

---

## Mock Interview 3: Campus Placement (Fresher)

**Context:** Final year student, applying for campus placements at product companies. You have a significant project and possibly a short internship.

**Duration:** 35 minutes

---

**Question 1:** Introduce yourself.

---

**Question 2:** What is your most significant project? Walk me through everything — the architecture, the challenges, the decisions.

*Allow 5-7 minutes. This is a deep dive.*

---

**Question 3:** Tell me about a time you disagreed with a teammate on a technical decision.

*Evaluation criteria:*
- Did you describe the disagreement specifically?
- Did you articulate why their position was legitimate?
- Did you describe how you resolved it?
- Does the answer end with a genuine learning?

---

**Question 4:** Tell me about a time you failed.

*Evaluation criteria:*
- Is this a real failure with real consequences?
- Do you name your contribution to the failure?
- Is the learning specific, not generic?
- Is there evidence you applied the learning?

---

**Question 5:** Where do you see yourself in 3 years?

---

**Question 6:** What makes you different from other candidates applying to this role?

*Evaluation criteria:*
- Is this genuine and specific?
- Does it demonstrate something about how you work or think?
- Is it backed by evidence?

---

**Question 7:** Do you have any questions?

---

## Mock Interview 4: Startup Interview

**Context:** You are interviewing for an engineering role at an early-stage startup (Series A or earlier). Startups care more about generalism, ownership, and ability to figure things out than large companies.

**Duration:** 30 minutes

**Startup-specific opening context:** "We are a small team, everyone wears multiple hats, and we move fast. We care a lot about ownership and learning speed."

---

**Question 1:** Tell me about yourself.

*(Include: what you have built, what you can own end-to-end, why a startup fits your goals)*

---

**Question 2:** Tell me about a time you had to figure something out completely on your own — no one to ask.

*Evaluation criteria:*
- Did you show resourcefulness?
- Did you describe a systematic approach to the unknown?
- Did you demonstrate comfort with ambiguity?

---

**Question 3:** Tell me about a time something broke and you had to fix it fast.

*Evaluation criteria:*
- Did you show triage instinct (assess → communicate → mitigate → diagnose)?
- Did you name what broke specifically?
- Did you show calm, methodical behavior under pressure?

---

**Question 4:** You are given a feature to build but the requirements are vague. What do you do?

*(Situational question — walk through your process)*

---

**Question 5:** What do you want to get out of working at a startup versus a bigger company?

*Evaluation criteria:*
- Is the answer genuine and specific?
- Does it connect to the company's actual stage and context?

---

**Question 6:** What is something you taught yourself that was outside your curriculum?

*Evaluation criteria:*
- Does this demonstrate initiative and intellectual curiosity?
- Is there evidence you went beyond surface familiarity?

---

## Mock Interview 5: Product Company (FAANG or Similar)

**Context:** You are interviewing at a large product company that has a structured behavioral process. They use specific leadership principles or values to evaluate candidates.

**Duration:** 45 minutes

**Note:** Large companies often ask behavioral questions tied to specific principles — ownership, customer obsession, bias for action, invent and simplify, etc. Even if you do not know their exact principles, the stories from this track prepare you for all of them.

---

**Question 1:** Tell me about yourself.

---

**Question 2:** Tell me about a time you took ownership of something that was not your responsibility.

---

**Question 3:** Tell me about a time you had to learn something very quickly to complete a project. How did you approach it?

---

**Question 4:** Tell me about a time you made a decision that turned out to be wrong. What happened and what did you learn?

*Evaluation criteria:*
- Is this a real mistake with real consequences?
- Do you own the decision fully without excessive excuse-making?
- Is the learning specific and applied?

---

**Question 5:** Tell me about a time you had to influence others without having direct authority over them.

*Evaluation criteria:*
- Did you describe influencing through reason and evidence?
- Did you show you listened to the other side?
- Did you avoid describing influence as manipulation or pressure?

---

**Question 6:** Tell me about a time you advocated for a user or customer when others were not thinking about them.

*This may not apply to your experience yet — adapt to: "Tell me about a time you thought about who would use something you built."*

---

**Question 7:** What is your greatest professional accomplishment?

*Evaluation criteria:*
- Is this specific and quantifiable where possible?
- Does it demonstrate the type of impact you want to be known for?
- Is it genuinely yours — not something your team did?

---

**Question 8:** Do you have any questions for us?

*(At this level: ask about engineering culture, team structure, or a specific technical challenge)*

---

## Self-Evaluation Rubric

After each mock, score yourself (1-5) on each dimension:

\`\`\`
SELF-EVALUATION DIMENSIONS

Structure (1-5)
  1 = Rambling, no clear arc
  3 = Some structure, occasional tangents
  5 = Clear S-T-A-R arc, tight and followable

Specificity (1-5)
  1 = Vague, could be anyone's answer
  3 = Some specific details, some generalities
  5 = Real names, numbers, technologies, decisions — vivid and credible

Ownership (1-5)
  1 = "We" throughout, no personal contribution visible
  3 = Mix of "I" and "we," contribution sometimes visible
  5 = Clear personal contribution, owns outcomes without blaming

Authenticity (1-5)
  1 = Sounds memorized or performed
  3 = Mostly genuine, occasional scripted feel
  5 = Conversational, genuine, feels like you are talking not presenting

Result (1-5)
  1 = No outcome mentioned
  3 = Vague outcome ("it worked out")
  5 = Specific outcome with evidence or metrics, plus a clear learning
\`\`\``,
  codeExamples: [],
  commonMistakes: [
    'Doing mock interviews mentally instead of out loud — speaking reveals problems that thinking hides',
    'Not recording yourself — you cannot evaluate what you cannot hear',
    'Trying to fix everything after one session — identify one improvement per practice',
    'Answering questions in writing before speaking them — this produces polished written answers, not natural spoken ones',
    'Skipping the questions that make you uncomfortable — those are exactly the ones to practice most',
  ],
  interviewQuestions: [
    {
      question: 'How do you prepare for a behavioral interview?',
      answer:
        'Build a story bank of 5-6 real experiences covering: technical achievement, leadership, conflict, failure, teamwork, and learning. For each story, have a clear STAR outline — not a memorized script, but a mental map. Research the company so your "why this company" answer is genuine. Practice all answers out loud, ideally recorded. Identify your weakest question types and practice those disproportionately.',
      difficulty: 'beginner',
    },
    {
      question: 'How do you evaluate whether your behavioral interview preparation is working?',
      answer:
        'Record yourself answering questions. After listening back, check: Is the answer specific (real names, real details) or vague? Does the story have a clear arc? Is "I" used for your contribution or is everything "we"? Is there a result with a real outcome? Is there a genuine learning? If you would not find this answer compelling as an interviewer, improve it.',
      difficulty: 'intermediate',
    },
  ],
  exercises: [
    {
      id: 'complete-one-mock',
      title: 'Complete One Full Mock Interview',
      description:
        'Choose the mock interview that matches your current stage (beginner, internship, placement, startup, or product company). Set a timer. Answer every question out loud. Record yourself. Score yourself on the rubric. Identify one thing to improve.',
      starterCode: `// MOCK INTERVIEW SELF-EVALUATION

const mockSession = {
  date: "",
  mockType: "beginner | internship | placement | startup | product_company",
  duration: 0, // minutes

  scores: {
    structure: 0, // 1-5
    specificity: 0, // 1-5
    ownership: 0, // 1-5
    authenticity: 0, // 1-5
    result: 0, // 1-5
  },

  totalScore: 0, // out of 25

  observations: {
    strongestAnswer: "", // Which question did you answer best and why?
    weakestAnswer: "", // Which question tripped you up most?
    fillersUsed: [], // Any fillers you noticed? ("um", "like", "basically")
    hedgesUsed: [], // Any hedges? ("I think maybe I kind of...")
    answersWithoutResult: [], // Which answers did not include a result?
  },

  oneThingToImprove: "",

  nextPracticeDate: "",
};`,
      solution: `// Example evaluation after a mock session

const exampleMockSession = {
  date: "Week 2 of practice",
  mockType: "internship",
  duration: 30,

  scores: {
    structure: 3, // Had structure for some, rambled on "tell me about yourself"
    specificity: 4, // Project discussion was specific; failure question was vague
    ownership: 2, // Used "we" too much in the project discussion
    authenticity: 4, // Felt genuine, not scripted
    result: 2, // Forgot to include result in two of five answers
  },

  totalScore: 15, // out of 25 — room to grow

  observations: {
    strongestAnswer: "The project architecture discussion — was specific, named technologies and reasons, described the debugging challenge clearly",
    weakestAnswer: "Tell me about a failure — gave a vague answer ('I missed a deadline and learned from it') without naming what I learned specifically",
    fillersUsed: ["um", "basically", "like"],
    hedgesUsed: ["I think maybe"],
    answersWithoutResult: ["teamwork story", "failure story"],
  },

  oneThingToImprove: "Add a specific result to every answer. The structure is there, the specificity is improving, but I keep ending on the action without closing the loop on what happened.",

  nextPracticeDate: "3 days from now — focus only on adding results to every STAR story",
};`,
      hints: [
        'Do the mock once without any notes. Then listen to the recording. Then read the question back and see what you missed or could improve. That sequence reveals more than just practicing with notes.',
        'The hardest questions to practice are the failure and conflict questions — they are also the most important. Practice them disproportionately.',
        'You will not be satisfied with your first recording. That is expected and correct. The gap between what you thought you said and what you actually said is the gap you are trying to close.',
      ],
    },
  ],
  keyTakeaways: [
    'Behavioral interview skill is built through spoken practice, not reading — answers must be practiced out loud',
    'Record your mock sessions — you cannot evaluate what you cannot hear back',
    'Identify one improvement per practice session — attempting to fix everything at once fixes nothing',
    'The questions that feel most uncomfortable are the ones to practice most',
    'Self-evaluation rubric: structure, specificity, ownership, authenticity, result — score yourself honestly',
    'Five mock contexts: beginner, internship, placement, startup, product company — choose the one that matches your target',
  ],
  prevLesson: 'communication-skills',
  nextLesson: 'behavioral-question-bank',
};
