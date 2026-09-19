import type { Lesson } from '@/types';

export const agenticAILesson: Lesson = {
  id: 'agentic-ai',
  slug: 'agentic-ai',
  title: 'Agentic AI — Single, Multi-Agent, and Autonomous Systems',
  description:
    'Understand the spectrum of agentic AI — from single agents to multi-agent systems to fully autonomous workflows — and when to use each architecture.',
  category: 'Advanced AI',
  order: 12,
  difficulty: 'advanced',
  estimatedTime: 40,
  content: `Agentic AI refers to AI systems that operate autonomously over time to accomplish goals. The previous module covered what agents are. This module covers how agentic systems are structured — single agent, multi-agent, autonomous workflows, and where humans fit in.

---

## Single Agent Systems

A single agent system has one LLM with access to a set of tools, operating in a loop to accomplish a goal.

\`\`\`
SINGLE AGENT ARCHITECTURE

  ┌───────────────────────────────────────────────────────┐
  │ Single Agent                                          │
  │                                                       │
  │   Goal → [LLM + Tools] → Loop → Done                 │
  │                                                       │
  │   Tools: search, calculator, file_read, api_call      │
  └───────────────────────────────────────────────────────┘

WHEN TO USE:
  - One well-defined task with clear completion criteria
  - Requires 3-10 sequential steps
  - One domain or skill set
  - Examples: research assistant, code reviewer, email drafter
\`\`\`

**Advantages**:
- Simple to build and debug
- Easy to understand what is happening
- Less coordination overhead

**Limitations**:
- Complex tasks with many subtasks get hard to manage in one context
- One model does everything — no specialization
- Context grows very long in complex tasks

---

## Multi-Agent Systems

Multi-agent systems use multiple AI agents working together. Each agent can specialize in a subtask, and agents can call each other, share results, or run in parallel.

\`\`\`
MULTI-AGENT ARCHITECTURE PATTERNS

  PATTERN 1: ORCHESTRATOR + WORKERS
  ─────────────────────────────────────────────────────
  User Goal
      │
      ▼
  Orchestrator Agent (plans and delegates)
  ├── Worker Agent A (research)
  ├── Worker Agent B (writing)
  └── Worker Agent C (code execution)
      │
      ▼
  Final result assembled by orchestrator

  PATTERN 2: PIPELINE (sequential)
  ─────────────────────────────────────────────────────
  Raw Input
      │
      ▼
  Agent 1: Extract key data
      │
      ▼
  Agent 2: Analyze and synthesize
      │
      ▼
  Agent 3: Format and deliver
      │
      ▼
  Final Output

  PATTERN 3: PARALLEL (concurrent)
  ─────────────────────────────────────────────────────
  Single goal
  ├──────────────────┐
  Agent 1            Agent 2
  (search topic A)   (search topic B)
  ├──────────────────┘
  Combine results
      │
      ▼
  Final answer (faster than sequential)
\`\`\`

### Real Example: Software Development Multi-Agent

\`\`\`
USER: "Build a REST API for user authentication"

Orchestrator Agent: Breaks task into subtasks

  Research Agent:
  → Searches best practices for auth APIs
  → Returns: JWT vs sessions, bcrypt hashing, refresh tokens

  Planner Agent:
  → Designs API endpoints and data models
  → Returns: POST /auth/register, POST /auth/login, POST /auth/refresh

  Coder Agent:
  → Writes implementation code
  → Returns: Express routes, middleware, validation

  Reviewer Agent:
  → Reviews code for security issues
  → Returns: "Missing rate limiting on /login endpoint"

  Coder Agent (again):
  → Fixes rate limiting issue

  Orchestrator: Assembles final deliverable
\`\`\`

---

## Autonomous Workflows

Autonomous workflows are agentic systems that run without (or with minimal) human input to complete complex, long-horizon tasks.

\`\`\`
AUTONOMOUS WORKFLOW SPECTRUM

  Human-Driven          Assisted              Autonomous
  ──────────────────────────────────────────────────────────
  Human does task       AI suggests steps     AI does task
  AI assists            Human approves each   Human reviews
  Copilot mode          Semi-autonomous       at the end

  ← More human control                   More AI autonomy →
\`\`\`

**Examples of autonomous workflows**:

*Customer support ticket resolution*:
Agent reads ticket → queries order database → checks refund eligibility → issues refund → sends confirmation email → closes ticket. Runs fully automatically for standard cases.

*Content pipeline*:
Agent monitors RSS feeds → identifies trending topics → writes article draft → fact-checks claims → formats for publication → schedules posting.

*CI/CD Code Review*:
Agent runs on every PR → reads changed files → checks for security issues → checks for performance regressions → writes inline comments → approves or requests changes.

---

## Human in the Loop

Most agentic systems work best with humans still in the loop — not for every step, but at critical decision points.

\`\`\`
HUMAN IN THE LOOP PATTERNS

  CHECKPOINT PATTERN
  Agent works autonomously until it reaches a pre-defined checkpoint
  → "I'm about to send 5,000 emails. Confirm? [Y/N]"

  REVIEW PATTERN
  Agent produces a complete plan or output
  → Human reviews and approves before execution
  → "Here's my plan to refactor this module. Should I proceed?"

  EXCEPTION PATTERN
  Agent handles standard cases autonomously
  → Escalates to human when uncertain or high-stakes
  → "I cannot determine the right action for this ticket. Human review needed."

  MONITORING PATTERN
  Agent runs fully autonomously
  → Human monitors dashboards and metrics
  → Intervenes when something looks wrong
\`\`\`

For most production agentic systems today, some form of human in the loop is the right choice — especially for irreversible actions (financial transactions, sending communications, deleting data).

---

## Real Examples of Agentic AI Products

**Cursor (Agentic Mode)**
Uses an agent that: reads your codebase, plans the implementation, writes code across multiple files, runs tests, sees failures, fixes errors, and loops until tests pass. You give a natural language goal — "Add a dark mode toggle to the app" — and the agent executes it.

**Devin (Cognition AI)**
A fully autonomous software engineer. Given a GitHub issue, Devin: reads the issue, opens the repo, runs existing tests to understand the codebase, plans the implementation, writes code, runs tests, debugs failures, and opens a PR. Can take hours to complete complex tasks.

**Claude Code**
Terminal-based AI coding agent. Can read files, edit files, run commands, and iterate. Used for refactoring, adding features, debugging, and code review across a full codebase.

**OpenAI Assistants / Agents SDK**
A framework for building production agents with persistent threads, file storage, code execution, and tool calling. Used by developers to build customer-facing AI assistants.

**AutoGPT / BabyAGI**
Early autonomous AI experiments that demonstrated self-directed goal pursuit — agents that set their own subtasks and pursue long-horizon goals. Showed promise but also limitations of fully autonomous systems without guardrails.

---

## Multi-Agent Coordination Challenges

Multi-agent systems introduce new problems:

**Coordination overhead**: Agents communicating with each other adds latency and cost.

**Information consistency**: If two agents update the same state, you need conflict resolution.

**Error propagation**: A mistake in an early agent cascades to later agents.

**Context isolation**: Each agent has its own context window — shared state must be explicit.

\`\`\`
MULTI-AGENT ANTI-PATTERNS TO AVOID

  ❌ Agents calling agents in deep chains (hard to debug)
  ❌ Agents sharing state through in-memory objects (race conditions)
  ❌ No error handling when one agent fails
  ❌ Agents with overlapping responsibilities (confusion)
  ❌ No visibility into what each agent is doing (black box)

  ✅ Clear responsibility boundaries for each agent
  ✅ Shared state through explicit data store (database/queue)
  ✅ Error handling at each agent boundary
  ✅ Logging everything each agent does
  ✅ Human escalation path when agents get stuck
\`\`\`

---

## When to Use Multi-Agent vs Single Agent

\`\`\`
USE SINGLE AGENT WHEN:
  - Task is sequential with 5-15 steps
  - One model can handle all required capabilities
  - Simple to describe in one system prompt
  - Low coordination overhead needed
  - Building a prototype or MVP

USE MULTI-AGENT WHEN:
  - Different parts of the task require different expertise
  - Subtasks can run in parallel (significant speed improvement)
  - Task is so complex that one agent loses track
  - Different trust levels for different actions
  - Already have single agents that need to be composed
\`\`\``,
  codeExamples: [
    {
      title: 'Multi-Agent Orchestrator Pattern',
      code: `import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

// Worker agent — specialized for one type of task
async function workerAgent(
  role: string,
  task: string,
  context: string
): Promise<string> {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: \`You are a specialist agent: \${role}. Complete the assigned task concisely.\`,
    messages: [
      {
        role: 'user',
        content: \`Context: \${context}\\n\\nTask: \${task}\`,
      },
    ],
  });
  const content = response.content[0];
  return content.type === 'text' ? content.text : '';
}

// Orchestrator — plans and delegates to workers
async function orchestratorAgent(userGoal: string): Promise<string> {
  // Step 1: Plan — break goal into subtasks
  const planResponse = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 512,
    system: \`You are an orchestrator. Break the user's goal into 2-3 subtasks.
Return ONLY a JSON array of subtask objects with fields:
[{"role": "specialist type", "task": "specific task description"}]\`,
    messages: [{ role: 'user', content: userGoal }],
  });

  const planContent = planResponse.content[0];
  if (planContent.type !== 'text') throw new Error('Plan failed');

  let subtasks: Array<{ role: string; task: string }>;
  try {
    subtasks = JSON.parse(planContent.text);
  } catch {
    throw new Error('Failed to parse plan');
  }

  console.log('Plan:', subtasks.map(t => t.role).join(' → '));

  // Step 2: Execute subtasks sequentially (could also run in parallel)
  const results: string[] = [];
  let context = \`User goal: \${userGoal}\`;

  for (const subtask of subtasks) {
    console.log(\`\\nRunning worker: \${subtask.role}\`);
    const result = await workerAgent(subtask.role, subtask.task, context);
    results.push(\`[\${subtask.role}]: \${result}\`);
    context += \`\\n\\n\${results[results.length - 1]}\`; // Each worker gets prior results
  }

  // Step 3: Synthesize — combine worker outputs into final answer
  const synthesisResponse = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: 'Synthesize these specialist outputs into a coherent final answer.',
    messages: [
      {
        role: 'user',
        content: \`Goal: \${userGoal}\\n\\nSpecialist outputs:\\n\${results.join('\\n\\n')}\`,
      },
    ],
  });

  const synthesisContent = synthesisResponse.content[0];
  return synthesisContent.type === 'text' ? synthesisContent.text : '';
}

// Run the orchestrator
const result = await orchestratorAgent(
  'Research the pros and cons of TypeScript and write a recommendation for a startup choosing a language.'
);
console.log('\\nFinal answer:', result);`,
      explanation:
        'This orchestrator pattern: (1) uses an LLM to plan and break the goal into specialist subtasks, (2) runs worker agents sequentially with accumulated context, (3) synthesizes all worker outputs into a final answer. Each worker gets the full context of prior workers — a pipeline pattern.',
    },
  ],
  commonMistakes: [
    'Building multi-agent systems when a single agent would suffice — complexity without benefit; always start with the simplest approach',
    'No human-in-the-loop for autonomous workflows handling real data — autonomous systems make mistakes; build in checkpoints for high-stakes actions',
    'Letting agents share state through in-memory objects — use a proper database or message queue for shared state to avoid race conditions',
    'No logging in multi-agent systems — when something fails in a multi-agent pipeline, you need logs to know which agent failed and why',
    'Giving every agent the same tools — specialize each agent; fewer tools per agent = less confusion = better performance',
  ],
  interviewQuestions: [
    {
      question: 'What is the difference between a single-agent and a multi-agent system?',
      answer:
        'A single agent is one LLM in a tool-use loop handling all aspects of a task. A multi-agent system has multiple agents, each specialized for different subtasks, coordinated by an orchestrator or pipeline. Multi-agent systems help when: (1) different parts of a task require different expertise, (2) subtasks can run in parallel, (3) one context window is not enough for a very complex task. But they add coordination complexity — use single agents first and only add multi-agent when you have a clear need.',
      difficulty: 'intermediate',
    },
    {
      question: 'What is human-in-the-loop in agentic AI and why is it important?',
      answer:
        'Human-in-the-loop means inserting human review or approval at specific points in an autonomous workflow. It is critical because: (1) agents make mistakes, especially on novel situations; (2) some actions (financial transactions, customer communications, data deletion) are irreversible; (3) trust must be built incrementally before going fully autonomous. Patterns include: checkpoint approval ("about to send 5,000 emails, confirm?"), exception escalation (handle standard cases automatically, escalate edge cases to humans), and end-to-end review (agent produces a plan, human approves before execution).',
      difficulty: 'intermediate',
    },
    {
      question: 'How would you architect an autonomous customer support system?',
      answer:
        'Architecture: (1) Intake agent reads incoming tickets and classifies by type (refund, shipping, technical, billing); (2) Specialist agents for each category with access to relevant tools (order DB for refunds/shipping, documentation for technical); (3) Each specialist tries to resolve autonomously; (4) If confidence is low or action is high-stakes (large refund), escalate to human queue; (5) Resolution agent: sends response, updates ticket system, closes ticket. Key safety measures: human escalation path for all uncertain cases, read-only access to databases unless action is necessary, logging every decision, human monitoring dashboard for anomaly detection.',
      difficulty: 'advanced',
    },
  ],
  exercises: [
    {
      id: 'parallel-agent-research',
      title: 'Build a Parallel Research Agent',
      description:
        'Build a system where multiple agents research different sub-topics in parallel, then an orchestrator combines their findings. This is faster than sequential research on separate topics.',
      starterCode: `import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

// Simulated research tool
function simulateResearch(topic: string): string {
  const knowledge: Record<string, string> = {
    'typescript benefits': 'TypeScript adds static typing, better IDE support, and early error detection to JavaScript.',
    'typescript drawbacks': 'TypeScript adds build complexity, compilation step, and learning curve over plain JavaScript.',
    'javascript benefits': 'JavaScript is universally supported, easy to start, no compilation, and has the largest ecosystem.',
    'javascript drawbacks': 'JavaScript lacks types, making large codebases harder to maintain and refactor safely.',
  };

  for (const [key, value] of Object.entries(knowledge)) {
    if (topic.toLowerCase().includes(key.split(' ')[0])) return value;
  }
  return \`Research on "\${topic}": No specific data available.\`;
}

// TODO: Implement parallel research
// Run multiple research subtasks concurrently using Promise.all
// Then combine results into a final answer

async function parallelResearch(mainQuestion: string): Promise<string> {
  // 1. Use LLM to split into 2-4 parallel research subtopics
  // 2. Run all subtopic agents in parallel with Promise.all
  // 3. Combine results into final answer

  return '';
}

const answer = await parallelResearch(
  "Should a new startup use TypeScript or JavaScript?"
);
console.log(answer);`,
      solution: `import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

function simulateResearch(topic: string): string {
  const knowledge: Record<string, string> = {
    'typescript benefits': 'TypeScript adds static typing, better IDE support, and early error detection.',
    'typescript drawbacks': 'TypeScript adds build complexity, compilation step, and learning curve.',
    'javascript benefits': 'JavaScript is universally supported, easy to start, no compilation needed.',
    'javascript drawbacks': 'JavaScript lacks types, making large codebases harder to maintain.',
  };
  for (const [key, value] of Object.entries(knowledge)) {
    if (topic.toLowerCase().includes(key.split(' ')[0])) return value;
  }
  return \`Research on "\${topic}": General analysis available.\`;
}

async function researchSubtopic(subtopic: string): Promise<string> {
  const rawInfo = simulateResearch(subtopic);
  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 200,
    system: 'Summarize the research findings in 2-3 sentences.',
    messages: [
      {
        role: 'user',
        content: \`Topic: \${subtopic}\\nData: \${rawInfo}\`,
      },
    ],
  });
  const content = response.content[0];
  return content.type === 'text' ? content.text : '';
}

async function parallelResearch(mainQuestion: string): Promise<string> {
  // Step 1: Generate subtopics to research
  const planResponse = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 200,
    system: 'Return ONLY a JSON array of 2-4 research subtopic strings.',
    messages: [{ role: 'user', content: \`Subtopics to research for: \${mainQuestion}\` }],
  });
  const planContent = planResponse.content[0];
  if (planContent.type !== 'text') throw new Error('Plan failed');

  const subtopics: string[] = JSON.parse(planContent.text);
  console.log('Researching in parallel:', subtopics);

  // Step 2: Run all subtopic agents in parallel
  const findings = await Promise.all(subtopics.map(researchSubtopic));

  // Step 3: Synthesize findings
  const context = subtopics.map((t, i) => \`[\${t}]: \${findings[i]}\`).join('\\n');
  const synthResponse = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 512,
    system: 'Synthesize research findings into a clear recommendation.',
    messages: [
      { role: 'user', content: \`Question: \${mainQuestion}\\n\\nResearch:\\n\${context}\` },
    ],
  });
  const synthContent = synthResponse.content[0];
  return synthContent.type === 'text' ? synthContent.text : '';
}`,
      hints: [
        'Promise.all runs all promises in parallel — pass an array of async calls and await them all at once',
        'For the planning step, use the LLM to generate subtopics in JSON format — then parse and iterate',
        'Use Haiku for individual subtopic research (cheaper, fast) and Sonnet for synthesis (needs better reasoning)',
        'Each parallel agent should return a string that the orchestrator can combine',
      ],
    },
  ],
  keyTakeaways: [
    'Single agents handle sequential tasks well; multi-agent systems enable specialization and parallelism for complex tasks',
    'The orchestrator pattern: one agent plans and delegates, worker agents specialize, orchestrator synthesizes results',
    'Human-in-the-loop is essential for production agentic systems — especially for irreversible actions',
    'Multi-agent systems add coordination complexity — only use when single agent cannot handle the task',
    'Logging is critical in agentic systems — you need visibility into what each agent did and why',
    'Products like Cursor, Devin, and Claude Code demonstrate agentic AI in practice — multi-step, tool-using, feedback-looping AI systems',
  ],
  nextLesson: 'tools-and-function-calling',
  prevLesson: 'ai-agents',
};
