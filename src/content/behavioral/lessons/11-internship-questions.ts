import type { Lesson } from '@/types';

export const internshipQuestionsLesson: Lesson = {
  id: 'internship-questions',
  slug: 'internship-questions',
  title: 'Internship Questions',
  description:
    'Answer internship-specific questions authentically — why this company, why should we hire you, career goals, and startup vs enterprise — with genuine reasoning, not rehearsed answers.',
  category: 'Core Questions',
  order: 11,
  difficulty: 'beginner',
  estimatedTime: 35,
  content: `Internship interviews have a specific flavor. You are typically talking to engineers who were once interns themselves, and they remember what good intern candidates looked like — and what bad ones looked like.

The worst intern candidates are the ones trying to sound more experienced than they are. The best intern candidates are the ones who are honest about where they are, clear about what they want to learn, and genuinely curious about the company.

This module covers the most common internship-specific questions and how to answer them honestly and effectively.

---

## "Why Do You Want This Internship?"

This is the most common internship question and the most commonly answered poorly.

**Why it is asked:** Companies want to know if you actually care about this opportunity specifically, or if you are mass-applying and this company is just a slot to fill.

**What goes wrong:**
- Generic answers: "I want to gain industry experience and learn from professionals"
- Vague enthusiasm: "I am really passionate about technology and I think this would be a great opportunity"
- Clearly recycled: "I admire [Company]'s mission to..." followed by the first line of their About page

**What interviewers actually want to hear:**
- Something specific about the company, team, or technology that genuinely interested you
- What you expect to learn that you cannot learn from personal projects
- Why now — why does this internship fit where you are in your learning

**Good answer structure:**
1. What specifically attracted you to this company (product, technology, domain, culture)
2. What you expect to learn that is not available from coursework or personal projects
3. What you bring that makes you a good fit for what they do

**Example:**
> "I have been learning web development for about a year, and the gap I keep hitting is that I do not know how production-grade code is actually structured — how real teams handle code reviews, testing, deployment, monitoring. Personal projects teach me to build. An internship teaches me to build professionally.
>
> I applied here specifically because of how your team talks about data freshness on your engineering blog — the tradeoffs you described between cache invalidation strategies are exactly the kind of problem I have been reading about but never had a real system to think through. Working on something like that would accelerate my understanding in a way that building another CRUD app would not."

---

## "Why Should We Hire You?"

This question asks you to make the case for yourself. It is the one time in the interview where you should be direct about your value proposition.

**The structure:**
1. What you can contribute now (skills and abilities relevant to the role)
2. What makes you worth investing in (learning speed, work ethic, curiosity)
3. What distinguishes you from similar candidates (something specific and genuine)

**Example:**
> "I have built three complete web applications from scratch — not tutorials, but actual projects I designed, built, and deployed myself. That means I can contribute meaningfully from day one on both frontend and backend work.
>
> What makes me worth the investment: I learn from first principles. When I hit something I do not understand, I do not just find a Stack Overflow answer and move on — I understand why the solution works. That means the things I learn here compound rather than staying shallow.
>
> The specific thing that distinguishes me from other candidates at my level is that I have already debugged production-level issues. My expense tracker had real users — my friend group — and I had to diagnose and fix a race condition in a live system without a way to roll back. That experience changed how I think about reliability."

---

## "What Are Your Career Goals?"

Interviewers ask this to understand whether the internship makes sense for you — whether what they offer aligns with where you are going.

**What goes wrong:**
- Vague: "I want to become a great software engineer" — everyone wants this
- Unrealistic: "I want to be a CTO in three years" — fine ambition, but tells them nothing about what you want to do now
- Overly compliant: "Whatever you need me to do, I am flexible" — this sounds like you have not thought about it

**A better structure:**
1. The type of work you want to do (backend, systems, product, etc.)
2. The depth of understanding you are building toward
3. How this internship is a step in that direction

**Example:**
> "In the medium term, I want to develop strong fundamentals in backend systems — specifically, understanding how large-scale APIs handle state, caching, and concurrent writes correctly. I do not want to just know the tools; I want to understand why those tools exist and what problems they solve.
>
> In the short term — meaning this internship — I want to contribute to real features and understand what 'production-quality' actually means from the inside. The gap between code that works in my projects and code that teams depend on in production is the specific gap I am trying to close."

---

## "What Do You Hope to Learn in This Internship?"

This question is often the difference between intern candidates who get hired and those who do not. Hiring managers remember the candidates who knew exactly what they wanted to learn — because those candidates are the ones who actually learn it.

**The worst answer:** "I just want to learn as much as possible about everything."

This sounds enthusiastic but is actually low-information. It tells the interviewer nothing about your curiosity or self-knowledge.

**A good answer names specific things:**
- A type of system (distributed, real-time, high-availability)
- A type of practice (code review culture, deployment pipelines, monitoring)
- A specific technology you want to understand deeply
- A working context you have not had (large codebase, team PRs, production ownership)

**Example:**
> "Three specific things. First: how code reviews actually work in a professional team — I have done peer reviews in group projects but never with the rigor that comes from shipping to real users. Second: how production systems are monitored — I have deployed things but I have no experience with alerting, dashboards, or incident response. Third: how features get scoped — the gap between 'I think I should build X' and 'here is why X is the right thing to build this sprint.'"

---

## "Where Do You See Yourself in Five Years?"

This question is asked constantly and answered poorly constantly.

**The trap:** Feeling like you need to have a perfect plan. You do not. No one expects you to know exactly where you will be in five years.

**What the question is really asking:** Are you thinking about your career intentionally, or are you just drifting?

**The structure:**
1. A genuine direction you are interested in (not "I want to be successful in tech")
2. How this internship is a real step in that direction
3. Openness to how that direction might evolve

**Example:**
> "Five years is genuinely hard to predict in software — the field moves quickly. What I can say is where I am trying to go in the next two to three years: I want to develop enough backend fundamentals that I can own a feature from design through deployment independently, without needing a senior engineer to make all the architecture decisions for me. This internship is a step in that direction because it puts me in a real engineering environment where I can see those decisions being made and contribute to them.
>
> Beyond that — whether I stay in backend, move into infrastructure, or specialize in something else — I will let the work tell me. I prefer to follow curiosity rather than a fixed plan."

---

## Startup vs Enterprise Questions

If you are interviewing at a startup, you may be asked: "Why a startup over a big company?"
If at a large company: "Why us over a startup?"

**At a startup:**
> "I want to see all the layers — not just the code, but how decisions get made, how the product is positioned, how the team deals with constraints. Startups give you that exposure in a way large companies do not. At a large company, you might work on one API for six months. At a startup, you might see a feature go from an idea in a meeting to users in production in two weeks. That learning density is what I am after right now."

**At a large company:**
> "Large companies operate at scales that genuinely change how you solve problems. The caching strategies, the distributed systems, the reliability requirements — these are engineering problems that do not exist at startup scale. I want to understand these problems not just in theory but in a real production system. I can read about them in papers, but I learn better by being in the room when the decisions are made."

---

## Questions You Should Ask

Every internship interview ends with "do you have any questions for us?" This is not a formality — it is an evaluation. Candidates who ask good questions demonstrate curiosity, research, and professional maturity.

**Good questions to ask:**
- "What does a successful intern look like on your team? What have the best interns done that made an impression?"
- "What is the biggest technical challenge the team is working on right now?"
- "How do interns typically contribute — do they own features, or are they mostly on support tasks?"
- "What does the code review process look like? How do you decide when a PR is ready to merge?"
- "Is there something you wish you had known about this team before you joined?"

**Questions NOT to ask in early rounds:**
- Compensation questions in a technical interview
- Questions about remote work policies before you have the offer
- Questions whose answers are obviously on the website`,
  codeExamples: [],
  commonMistakes: [
    'Generic "why this company" answers — mentioning the first line of the company website does not show research',
    '"I want to learn as much as possible" — this sounds enthusiastic but says nothing about your actual curiosity',
    'Vague career goals: "I want to be a great software engineer" — everyone wants this; say what specifically you want to build or understand',
    'Trying to sound more senior than you are — internship interviewers want honesty about your level, not performance of expertise',
    'Not asking questions at the end — saying "no, I think I am good" signals disinterest in the role',
    'Asking questions that are answered on the company website — this signals you did not do basic research',
  ],
  interviewQuestions: [
    {
      question: 'Why do you want this internship at this company specifically?',
      answer:
        'Name something specific about the company, its technology, or its domain that genuinely interested you — not the first line of their About page. Explain what you expect to learn that you cannot learn from personal projects. Connect what they build to what you want to understand. Show that you did real research.',
      difficulty: 'beginner',
      tip: 'The word "specifically" in the question is a clue — generic answers will not work. Read the engineering blog, look at their GitHub, look at what they are building and ask yourself: what is genuinely interesting about this company vs. a random employer?',
    },
    {
      question: 'Why should we hire you over other candidates?',
      answer:
        'Name what you can contribute now (specific skills, real projects), what makes you worth investing in (how you learn, not just that you learn), and what is genuinely distinctive about you. Avoid false modesty (underselling) and false confidence (claiming more than you can prove). Make the case directly.',
      difficulty: 'beginner',
    },
    {
      question: 'What do you want to learn in this internship?',
      answer:
        'Name three to five specific things — practices, systems, or contexts you do not currently have access to. "As much as possible" is not an answer. "How production monitoring works," "how code reviews function with real stakes," and "how feature scoping decisions are made" are answers.',
      difficulty: 'beginner',
    },
    {
      question: 'Where do you see yourself in five years?',
      answer:
        'Give a genuine direction — not a specific title, but a type of work or depth of understanding you are building toward. Show that this internship is a real step in that direction. Acknowledge that the specific path will evolve, but demonstrate that you are thinking intentionally, not just drifting.',
      difficulty: 'beginner',
    },
  ],
  exercises: [
    {
      id: 'internship-answer-preparation',
      title: 'Prepare Your Internship Interview Answers',
      description:
        'For a specific company you are applying to or interested in, fill in each question with a genuine answer. Do the research first — read their engineering blog, look at their products, understand their technology stack.',
      starterCode: `// INTERNSHIP INTERVIEW PREPARATION
// Fill in for a specific company you are targeting

const targetCompany = {
  name: "",
  whatTheyBuild: "",
  techStackYouKnow: [], // What technologies they use that you have learned
  somethingSpecificYouRead: "", // From their blog, GitHub, or job description
};

const myAnswers = {
  whyThisInternship: {
    specificAttraction: "", // Something real, not "the mission"
    whatYouExpectToLearn: "",
    whatYouBring: "",
  },

  whyShouldWeHireYou: {
    whatYouCanContributeNow: "", // Skills + projects
    whatMakesYouWorthInvesting: "", // How you learn
    whatDistinguishesYou: "", // Something specific and genuine
  },

  whatYouWantToLearn: [
    // Name 3 specific things
  ],

  careerGoalsShort: "", // 1-2 years
  careerGoalsLong: "", // 3-5 years (genuine direction, not title)

  questionsYouWillAsk: [
    // 3-4 genuine questions about the team, work, or culture
  ],
};`,
      solution: `// Example completed preparation — not a template to copy

const examplePreparation = {
  targetCompany: {
    name: "Mid-size SaaS company building a data pipeline product",
    whatTheyBuild: "Real-time data ingestion and transformation pipelines for analytics teams",
    techStackYouKnow: ["PostgreSQL", "Node.js", "React"],
    somethingSpecificYouRead: "Engineering blog post about how they handle backpressure when ingestion spikes — the use of a sliding window rate limiter was something I had read about theoretically but never seen implemented",
  },

  myAnswers: {
    whyThisInternship: {
      specificAttraction: "The backpressure problem you described in your engineering blog — managing ingestion rates when sources spike unpredictably. I have read about sliding window algorithms but never seen them in a real system. Understanding how production systems handle this is exactly the gap I am trying to close.",
      whatYouExpectToLearn: "How streaming data architectures handle state at scale — what I build in personal projects is always synchronous and small. I want to see what changes when the data volume is real.",
      whatYouBring: "Full-stack web development skills and experience debugging production-level issues in my own deployed projects.",
    },

    whyShouldWeHireYou: {
      whatYouCanContributeNow: "I have built three complete full-stack applications — authentication, database design, API, deployment. I can contribute to real features from day one without needing to ramp up on basics.",
      whatMakesYouWorthInvesting: "I learn by understanding, not just by using. When I learn something in this internship, I will understand why it works, not just that it works. That compounds over time.",
      whatDistinguishesYou: "I have debugged a live race condition in a deployed application. That changed how I think about reliability in a way that pure coursework does not.",
    },

    whatYouWantToLearn: [
      "How streaming backpressure is actually implemented in production — not the theory, the specific decisions your team made",
      "How production monitoring works — what you alert on, how you decide what matters",
      "How features get scoped — the gap between building something and deciding what is worth building",
    ],

    questionsYouWillAsk: [
      "What does a successful intern look like on your team?",
      "What is the biggest technical challenge the data ingestion pipeline is facing right now?",
      "How do interns typically contribute — do they own features or work alongside senior engineers on pieces of larger features?",
    ],
  },
};`,
      hints: [
        'Do actual research before filling this in — the quality of your "why this company" answer depends entirely on how much you know about them',
        'For "what you want to learn," the more specific the better. If you can connect it to something specific about their product or engineering challenge, it shows you genuinely thought about it.',
        'Practice saying your answers out loud — written answers often sound stiff when spoken. Adjust until it sounds natural.',
      ],
    },
  ],
  keyTakeaways: [
    '"Why this company" requires actual research — mentioning something specific from their engineering blog or product is what separates genuine interest from mass applications',
    '"What you want to learn" should be specific — three named things, not "as much as possible"',
    'Career goals questions want genuine direction, not a perfect five-year plan — show intentional thinking, not rigid plans',
    'Be honest about your level — trying to sound more senior than you are backfires; internship interviewers value candidates who know where they are and what they want to learn',
    'Always ask questions at the end — "no, I am good" signals disinterest and costs you real evaluation points',
    'Your questions should be about the work, the team, and the culture — not compensation or perks in early rounds',
  ],
  prevLesson: 'strengths-and-weaknesses',
  nextLesson: 'company-research',
};
