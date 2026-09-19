import type { Lesson } from '@/types';

export const aiAgentsLesson: Lesson = {
  id: 'ai-agents',
  slug: 'ai-agents',
  title: 'AI Agents',
  description:
    'Understand what AI agents are, how they differ from chatbots, how the agent loop works — planning, reasoning, tool use, memory, and execution — with real examples of agents in production.',
  category: 'Advanced AI',
  order: 11,
  difficulty: 'intermediate',
  estimatedTime: 50,
  content: `AI agents are the next step beyond chatbots. A chatbot answers questions. An agent accomplishes goals. This is the frontier of practical AI engineering — and it is where the most exciting products are being built right now.

---

## Agent vs Chatbot

The distinction is simpler than it sounds:

\`\`\`
CHATBOT
  User: "What is the weather in Mumbai?"
  AI: "I don't have real-time access to weather data."
  → One turn. One response. Done.

AGENT
  User: "Check the weather in Mumbai and if it's going to rain, add 'bring umbrella'
        to my todo list for tomorrow."
  Agent: Plans steps:
    1. Use weather_tool("Mumbai") → "Rain tomorrow afternoon"
    2. Use todo_tool.add("bring umbrella", date="tomorrow") → added
  AI: "Done! It's going to rain tomorrow afternoon in Mumbai, so I've added
       'bring umbrella' to your todo list for tomorrow."
  → Multiple steps. Tool use. Real actions. Goal accomplished.
\`\`\`

An agent can:
- Break a goal into steps
- Use external tools (APIs, databases, code execution)
- Observe the result of each action
- Adjust its plan based on what it finds
- Loop until the goal is complete

---

## The Agent Loop

Every AI agent, regardless of how complex, runs a version of the same loop:

\`\`\`
THE AGENT LOOP (ReAct pattern)

  ┌─────────────────────────────────────────────┐
  │                                             │
  │  Receive Goal / Observe Current State       │
  │            │                                │
  │            ▼                                │
  │  THINK: What should I do next?              │
  │  (LLM reasons about state + goal)           │
  │            │                                │
  │            ▼                                │
  │  ACT: Execute tool / take action            │
  │  (call API, read file, run code, etc.)      │
  │            │                                │
  │            ▼                                │
  │  OBSERVE: What happened?                    │
  │  (get tool result, check output)            │
  │            │                                │
  │            ▼                                │
  │  Is goal complete?                          │
  │    YES → Return final answer                │
  │    NO  → Loop back to THINK                 │
  │                                             │
  └─────────────────────────────────────────────┘
\`\`\`

This Think → Act → Observe loop is the core of every agent system — from a simple task runner to a full autonomous software engineer.

---

## Planning

Before taking actions, sophisticated agents plan — they break the goal into steps.

\`\`\`
PLANNING EXAMPLE

  Goal: "Research the top 3 AI companies and write a comparison report"

  Agent plans:
  Step 1: Search web for "top AI companies 2025"
  Step 2: For each company found, search for their latest products
  Step 3: For each company, search for their funding and valuation
  Step 4: Synthesize findings into a comparison table
  Step 5: Write the comparison report

  Agent executes each step, adjusting if results change the plan
\`\`\`

Planning quality depends heavily on the model. Frontier models (Claude 3.5 Sonnet, GPT-4o) plan well. Smaller models often produce brittle plans.

---

## Reasoning

Reasoning is the model's ability to figure out what to do when the path is not obvious.

Good agent reasoning:
- Chooses the right tool for each step
- Handles unexpected tool results
- Recognizes when a plan needs revision
- Knows when a goal is complete

Poor agent reasoning:
- Gets stuck in loops
- Uses wrong tools
- Misinterprets tool outputs
- Loses track of the original goal

\`\`\`
REASONING IN ACTION

  Goal: "Find the CEO of Anthropic"
  Agent reasons: "I have a web_search tool. I will search for 'Anthropic CEO'"
  Tool call: web_search("Anthropic CEO")
  Result: "Dario Amodei is the CEO and co-founder of Anthropic"
  Agent reasons: "I have the answer. No more steps needed."
  Output: "Dario Amodei is the CEO of Anthropic."

  vs.

  Agent with poor reasoning might:
  → Search again with different query
  → Search for Dario Amodei instead of using the result
  → Return incorrect information from a misleading search result
\`\`\`

---

## Tool Use

Tools are the mechanism by which agents interact with the world beyond text. An LLM alone can only produce text. An agent with tools can take real actions.

\`\`\`
COMMON AGENT TOOLS

  INFORMATION TOOLS (read-only)
  ┌──────────────────┬────────────────────────────────────────┐
  │ web_search       │ Search the internet for current info   │
  │ read_file        │ Read a file from disk                  │
  │ database_query   │ Query a database                       │
  │ api_get          │ Call a GET endpoint                    │
  │ calculator       │ Perform exact arithmetic               │
  └──────────────────┴────────────────────────────────────────┘

  ACTION TOOLS (write/execute)
  ┌──────────────────┬────────────────────────────────────────┐
  │ write_file       │ Create or update a file                │
  │ send_email       │ Send an email                          │
  │ create_ticket    │ Create a GitHub issue / Jira ticket    │
  │ execute_code     │ Run Python/JavaScript code             │
  │ api_post         │ Call a POST/PUT/DELETE endpoint        │
  │ browser_click    │ Click elements in a web browser        │
  └──────────────────┴────────────────────────────────────────┘
\`\`\`

Tools are defined as function schemas — the model knows what each tool does, what parameters it takes, and what it returns. The model decides when and how to call each tool.

---

## Memory

Agents can have different types of memory:

\`\`\`
AGENT MEMORY TYPES

  IN-CONTEXT MEMORY
  The conversation history in the current context window.
  Fast, but limited — disappears when context closes.
  Example: "The user said their name is Alex earlier in this conversation"

  EXTERNAL MEMORY (Semantic / Episodic)
  Embeddings stored in a vector database — retrieved when relevant.
  Example: "Load memories from past conversations with this user"
  → RAG system for memory

  WORKING MEMORY
  State maintained across agent loop iterations.
  What has the agent done so far? What tools has it called?
  Example: { step: 3, findings: [...], pending: [...] }

  KNOWLEDGE MEMORY
  Static knowledge from RAG or fine-tuning.
  Example: Company documentation, product catalog, code patterns.
\`\`\`

---

## Execution

Execution is when the agent actually runs tools and takes actions. This is where agents become powerful — and where they become risky.

\`\`\`
EXECUTION CONSIDERATIONS

  REVERSIBLE vs IRREVERSIBLE ACTIONS
  Reading a file: reversible (no side effects)
  Sending an email: IRREVERSIBLE
  Deleting a record: IRREVERSIBLE
  Calling a POST API: depends on the endpoint

  HUMAN IN THE LOOP
  For irreversible or high-stakes actions, pause and ask for confirmation.
  "I am about to send this email to 5,000 customers. Confirm? [Yes/No]"

  SANDBOXING
  Run agent code execution in isolated environments.
  Never give agents direct access to production databases.
  Use read-only credentials where possible.

  TIMEOUTS AND LIMITS
  Set max iterations for the agent loop.
  Set max tool call budget.
  Prevent infinite loops.
\`\`\`

---

## Feedback Loops

Feedback loops allow agents to improve their output:

\`\`\`
FEEDBACK LOOP EXAMPLE

  Agent writes code → Runs code → Gets error output
  → Feeds error back into agent loop
  → Agent reads error, fixes code
  → Runs again → Success

  This is what makes agents so powerful:
  They can try, fail, observe the failure, and retry with corrections.
  Without feedback loops, agents are just sequential tool callers.
  With feedback loops, agents can solve problems iteratively.
\`\`\`

---

## Real World Agent Examples

**Cursor**
A code editor where an AI agent can read your codebase, write code, run tests, see failures, and fix them — all in a feedback loop. The agent's tools: read_file, write_file, run_terminal_command, search_code.

**Claude Code**
An AI coding assistant in your terminal. Takes goals like "add TypeScript types to all these files" and executes multi-step sequences: reads files, modifies them, runs type checks, fixes errors.

**Devin (Cognition)**
A fully autonomous AI software engineer. Given a feature ticket, it opens a browser, reads the ticket, sets up the codebase, writes code, runs tests, debugs failures, and opens a PR.

**OpenAI Assistants API**
A framework for building agents with persistent threads, file reading, code execution, and custom tool calling.

**Customer Support Agents**
Agents that: read a support ticket, query the order database, check the refund policy, take action (issue refund, send email), and close the ticket — without a human involved.

---

## Building Your First Agent

\`\`\`
AGENT IMPLEMENTATION CHECKLIST

  1. Define the goal clearly
  2. Define available tools (name, description, parameters, return type)
  3. Write a system prompt explaining:
     - What the agent does
     - What tools are available
     - How to decide which tool to use
     - When the task is complete
     - When to ask for help vs proceed
  4. Implement the agent loop
  5. Handle tool execution results
  6. Add safety guardrails:
     - Max iteration limit
     - Confirmation before irreversible actions
     - Sandboxed execution environment
  7. Add logging for every tool call (essential for debugging)
  8. Test with realistic multi-step goals
\`\`\``,
  codeExamples: [
    {
      title: 'Building an Agent with Tool Use',
      code: `import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

// Tool definitions — describe each tool to the model
const tools: Anthropic.Tool[] = [
  {
    name: 'web_search',
    description: 'Search the internet for current information. Use this to find facts, news, and data.',
    input_schema: {
      type: 'object' as const,
      properties: {
        query: { type: 'string', description: 'The search query' },
      },
      required: ['query'],
    },
  },
  {
    name: 'calculator',
    description: 'Perform exact arithmetic calculations. Use this for any math — LLMs are unreliable at math.',
    input_schema: {
      type: 'object' as const,
      properties: {
        expression: {
          type: 'string',
          description: 'Math expression to evaluate, e.g. "15 * 24 + 100"',
        },
      },
      required: ['expression'],
    },
  },
];

// Tool implementations (in a real agent, these would call real APIs)
function executeTool(name: string, input: Record<string, string>): string {
  if (name === 'web_search') {
    // In production, call a real search API (Tavily, Serper, etc.)
    return JSON.stringify({
      results: [
        { title: 'Anthropic founded in 2021', url: 'https://anthropic.com', snippet: 'Anthropic was founded in 2021 by Dario Amodei and others.' },
      ],
    });
  }

  if (name === 'calculator') {
    try {
      // Safe eval for arithmetic — in production use a math parser library
      const result = Function('"use strict"; return (' + input.expression + ')')();
      return String(result);
    } catch {
      return 'Error: Invalid expression';
    }
  }

  return 'Tool not found';
}

// The agent loop
async function runAgent(userGoal: string): Promise<string> {
  const messages: Anthropic.MessageParam[] = [
    { role: 'user', content: userGoal },
  ];

  const MAX_ITERATIONS = 10; // Prevent infinite loops

  for (let i = 0; i < MAX_ITERATIONS; i++) {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: \`You are a helpful AI agent. You can use tools to accomplish tasks.
Use tools when you need real information or calculations.
When you have the final answer, respond with plain text (no tool calls).\`,
      tools,
      messages,
    });

    // If the model is done (no tool calls), return the response
    if (response.stop_reason === 'end_turn') {
      const textContent = response.content.find(c => c.type === 'text');
      return textContent?.type === 'text' ? textContent.text : 'Task complete.';
    }

    // Process tool calls
    if (response.stop_reason === 'tool_use') {
      // Add model's response (with tool calls) to history
      messages.push({ role: 'assistant', content: response.content });

      // Execute each tool call and collect results
      const toolResults: Anthropic.ToolResultBlockParam[] = [];
      for (const block of response.content) {
        if (block.type === 'tool_use') {
          console.log(\`→ Calling tool: \${block.name}(\${JSON.stringify(block.input)})\`);
          const result = executeTool(block.name, block.input as Record<string, string>);
          console.log(\`← Result: \${result.slice(0, 100)}...\`);

          toolResults.push({
            type: 'tool_result',
            tool_use_id: block.id,
            content: result,
          });
        }
      }

      // Add tool results to history — agent reads them in next iteration
      messages.push({ role: 'user', content: toolResults });
    }
  }

  return 'Maximum iterations reached. Task may be incomplete.';
}

// Run the agent
const result = await runAgent(
  "Search for when Anthropic was founded, then calculate how many years ago that was from 2025."
);
console.log(result);`,
      explanation:
        'This is the core agent loop: the model responds with either text (done) or tool calls (keep going). For tool calls, we execute the tools, add results to message history, and loop. The model reads results in the next iteration and decides what to do next. The MAX_ITERATIONS guard prevents infinite loops.',
    },
  ],
  commonMistakes: [
    'No maximum iteration limit — agents can loop forever; always set a hard limit (10-20 iterations for most tasks)',
    'Not sandboxing code execution — if you let an agent run code, use a Docker container or sandboxed runtime; never run agent-generated code directly on your server',
    'No human-in-the-loop for irreversible actions — sending emails, deleting data, or making purchases should require confirmation',
    'Vague tool descriptions — the model decides which tool to use based on the description; unclear descriptions cause wrong tool selection',
    'Not logging tool calls — agent loops are hard to debug; log every tool call, its inputs, and its results for observability',
    'Giving agents too many tools — more tools = more confusion; start with the minimum set and add only what is needed',
  ],
  interviewQuestions: [
    {
      question: 'What is the difference between an AI chatbot and an AI agent?',
      answer:
        'A chatbot has a single conversation turn — receive a message, generate a response. An agent has a goal-oriented loop — receive a goal, plan steps, use tools to gather information and take actions, observe results, adjust, and repeat until the goal is accomplished. Chatbots answer questions. Agents accomplish tasks. The key differences are: agents use tools (APIs, databases, code execution), agents take multiple steps autonomously, agents observe results and adjust, and agents can take real-world actions with consequences.',
      difficulty: 'intermediate',
    },
    {
      question: 'What is the ReAct pattern in AI agents?',
      answer:
        'ReAct (Reasoning + Acting) is the core pattern for LLM agents. The agent alternates between: THINK (reason about the current state and what to do next), ACT (call a tool or take an action), OBSERVE (get the result and add it to context). This loop continues until the goal is complete. The key insight is that reasoning and acting are interleaved — the model thinks before each action and observes after each action, allowing it to adapt its plan based on real results rather than executing a fixed script.',
      difficulty: 'intermediate',
    },
    {
      question: 'How do you make AI agents safe for production use?',
      answer:
        'Key safety measures: (1) Human-in-the-loop for irreversible actions — pause before sending emails, deleting data, or making purchases; (2) Sandboxed execution — run agent-generated code in isolated containers, never directly on production servers; (3) Maximum iteration limits — prevent infinite loops with a hard cap; (4) Read-only credentials where possible — limit the blast radius of mistakes; (5) Allowlist of safe tools — do not give agents access to tools they do not need; (6) Comprehensive logging — log every tool call, input, and output for auditability and debugging; (7) Confirmation prompts for high-stakes actions.',
      difficulty: 'advanced',
    },
  ],
  exercises: [
    {
      id: 'build-simple-agent',
      title: 'Build a Research Agent',
      description:
        'Build an agent that can answer research questions using a web search tool and a calculator tool. The agent should use multiple steps when needed — search, synthesize, calculate.',
      starterCode: `import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

// Simulated tool implementations (replace with real APIs in production)
const toolImplementations: Record<string, (input: Record<string, string>) => string> = {
  web_search: (input) => {
    // Simulate search results based on query keywords
    const query = input.query?.toLowerCase() ?? '';
    if (query.includes('population') && query.includes('india')) {
      return JSON.stringify({ answer: 'India has approximately 1.44 billion people as of 2024' });
    }
    if (query.includes('capital') && query.includes('japan')) {
      return JSON.stringify({ answer: 'The capital of Japan is Tokyo' });
    }
    return JSON.stringify({ answer: 'No relevant results found for: ' + input.query });
  },
  calculator: (input) => {
    try {
      const result = Function('"use strict"; return (' + input.expression + ')')();
      return String(result);
    } catch {
      return 'Error: Invalid expression';
    }
  },
};

// TODO: Define tools array for the API
const tools: Anthropic.Tool[] = [
  // Define web_search and calculator tools here
];

// TODO: Build the agent loop
async function researchAgent(question: string): Promise<string> {
  // Implement the agent loop:
  // 1. Send question to model with tools
  // 2. If model calls tools, execute them and add results to messages
  // 3. Loop until model returns a text response (no tool calls)
  // 4. Return the final text response
  return '';
}

// Test
console.log(await researchAgent("What is the population of India?"));
console.log(await researchAgent("What is 15% of India's population in millions?"));`,
      solution: `import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const toolImplementations: Record<string, (input: Record<string, string>) => string> = {
  web_search: (input) => {
    const query = input.query?.toLowerCase() ?? '';
    if (query.includes('population') && query.includes('india')) {
      return JSON.stringify({ answer: 'India has approximately 1.44 billion people as of 2024' });
    }
    if (query.includes('capital') && query.includes('japan')) {
      return JSON.stringify({ answer: 'The capital of Japan is Tokyo' });
    }
    return JSON.stringify({ answer: 'No results for: ' + input.query });
  },
  calculator: (input) => {
    try {
      const result = Function('"use strict"; return (' + input.expression + ')')();
      return String(result);
    } catch {
      return 'Error: Invalid expression';
    }
  },
};

const tools: Anthropic.Tool[] = [
  {
    name: 'web_search',
    description: 'Search for current information, facts, and data on any topic.',
    input_schema: {
      type: 'object' as const,
      properties: {
        query: { type: 'string', description: 'Search query' },
      },
      required: ['query'],
    },
  },
  {
    name: 'calculator',
    description: 'Perform arithmetic. Always use this for math instead of computing in your head.',
    input_schema: {
      type: 'object' as const,
      properties: {
        expression: { type: 'string', description: 'Math expression, e.g. "1440 * 0.15"' },
      },
      required: ['expression'],
    },
  },
];

async function researchAgent(question: string): Promise<string> {
  const messages: Anthropic.MessageParam[] = [
    { role: 'user', content: question },
  ];

  for (let i = 0; i < 10; i++) {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      tools,
      system: 'You are a research agent. Use tools to find information and perform calculations. Give a concise final answer.',
      messages,
    });

    if (response.stop_reason === 'end_turn') {
      const text = response.content.find(c => c.type === 'text');
      return text?.type === 'text' ? text.text : 'Done';
    }

    messages.push({ role: 'assistant', content: response.content });

    const results: Anthropic.ToolResultBlockParam[] = [];
    for (const block of response.content) {
      if (block.type === 'tool_use') {
        const result = toolImplementations[block.name]?.(block.input as Record<string, string>) ?? 'Tool not found';
        results.push({ type: 'tool_result', tool_use_id: block.id, content: result });
      }
    }
    messages.push({ role: 'user', content: results });
  }

  return 'Max iterations reached';
}`,
      hints: [
        'The message history must alternate user/assistant — tool results go in a "user" message as an array of tool_result blocks',
        'Check response.stop_reason: "end_turn" means done, "tool_use" means the model wants to call tools',
        'response.content is an array — find the text block with .find(c => c.type === "text") for the final answer',
        'Always add the assistant response (with tool_use blocks) to messages BEFORE adding tool results',
      ],
    },
  ],
  keyTakeaways: [
    'Agents accomplish goals through a Think → Act → Observe loop, using tools to interact with the world',
    'The difference from chatbots: agents take multiple sequential steps and use real tools — not just text in, text out',
    'Tools are the interface between the LLM and the real world — web search, database queries, code execution, API calls',
    'Memory exists at different levels: in-context (current conversation), external (vector DB), and working (state across loop iterations)',
    'Safety is essential: max iteration limits, human-in-the-loop for irreversible actions, sandboxed code execution, comprehensive logging',
    'Planning quality depends on model quality — use frontier models (Claude 3.5 Sonnet, GPT-4o) for complex agentic tasks',
  ],
  nextLesson: 'agentic-ai',
  prevLesson: 'rag',
};
