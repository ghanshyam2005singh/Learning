import type { Lesson } from '@/types';

export const toolsAndFunctionCallingLesson: Lesson = {
  id: 'tools-and-function-calling',
  slug: 'tools-and-function-calling',
  title: 'Tools and Function Calling',
  description:
    'Master tool calling (function calling) — the mechanism that lets LLMs take real-world actions. Understand tool definitions, execution flow, parallel tool use, and how to build reliable tool-using systems.',
  category: 'Advanced AI',
  order: 13,
  difficulty: 'intermediate',
  estimatedTime: 45,
  content: `Tool calling (also called function calling) is how LLMs interact with the outside world. It is the core mechanism behind AI agents. Without tool calling, LLMs can only produce text. With tool calling, they can search the internet, query databases, send emails, run code, and call any API.

This module teaches you how tool calling actually works and how to build reliable tool-using systems.

---

## What Is Tool Calling?

Tool calling is a protocol where:
1. You define a set of tools (functions) available to the model
2. The model decides when to call a tool
3. The model outputs a structured tool call request (name + arguments)
4. Your code executes the actual function
5. You return the result to the model
6. The model continues its response

\`\`\`
TOOL CALLING FLOW

  Your code defines tools:
  ┌─────────────────────────────────────────────────────┐
  │ Tool: get_weather                                   │
  │ Description: Get current weather for a city        │
  │ Parameters: { city: string, unit: "C" | "F" }      │
  └─────────────────────────────────────────────────────┘

  User: "What's the weather in London?"

  Step 1: You → API (message + tools)
  Step 2: API → Model decides it needs weather data
  Step 3: Model → You (tool call request):
          { tool: "get_weather", arguments: { city: "London", unit: "C" } }

  Step 4: Your code executes get_weather("London", "C")
          → Returns: "15°C, partly cloudy"

  Step 5: You → API (original messages + tool result)
  Step 6: Model → You (final response):
          "The current weather in London is 15°C with partly cloudy skies."
\`\`\`

**Critical point**: The model does NOT call your function. The model outputs a structured request. Your code calls the function and returns the result. You control all execution.

---

## Tool Definition

Every tool has three parts: a name, a description, and a parameter schema.

\`\`\`json
{
  "name": "get_weather",
  "description": "Get current weather conditions for a city. Use this when the user asks about weather or temperature.",
  "input_schema": {
    "type": "object",
    "properties": {
      "city": {
        "type": "string",
        "description": "The city name to get weather for"
      },
      "unit": {
        "type": "string",
        "enum": ["celsius", "fahrenheit"],
        "description": "Temperature unit"
      }
    },
    "required": ["city"]
  }
}
\`\`\`

### Writing Good Tool Descriptions

The description is critical — the model uses it to decide when and how to use the tool.

\`\`\`
BAD DESCRIPTION:
  "search" — too vague, model will not know when to use it

GOOD DESCRIPTION:
  "Search the internet for current information, news, and facts.
   Use this when the user asks about recent events, current data,
   or information that may have changed since 2024."

BAD DESCRIPTION:
  "calculator" — does not explain the input format

GOOD DESCRIPTION:
  "Evaluate mathematical expressions and return the result.
   Input must be a valid arithmetic expression like '15 * 24 + 100'.
   Always use this instead of computing math yourself — LLMs make math errors."
\`\`\`

---

## Parallel Tool Use

Modern models can call multiple tools simultaneously in a single turn — they generate multiple tool call requests in one response.

\`\`\`
SEQUENTIAL TOOL CALLING (slower)

  Request 1: Model → get_weather("London")
  Wait for result
  Request 2: Model → get_weather("Paris")
  Wait for result
  Final response: "London is 15°C, Paris is 22°C"

  2 round trips to the LLM before answer

PARALLEL TOOL CALLING (faster)

  Request 1: Model → [get_weather("London"), get_weather("Paris")]
  Execute both simultaneously
  Return both results in one message
  Request 2: Model → "London is 15°C, Paris is 22°C"

  1 round trip to the LLM — significantly faster
\`\`\`

The model can decide to call multiple tools in parallel when they are independent. You execute all of them concurrently and return all results.

---

## Error Handling in Tool Use

Tools fail. Networks time out. APIs return errors. Your tool execution layer must handle these gracefully and return meaningful error messages to the model.

\`\`\`
TOOL ERROR HANDLING PATTERNS

  Pattern 1: Return error as string
  → Model sees the error and can adjust its approach
  → "Error: City 'Londinium' not found. Did you mean London?"

  Pattern 2: Return empty/null with explanation
  → Tool returns: "No results found for this query"
  → Model tells user it could not find the information

  Pattern 3: Retry with correction
  → If tool fails, try with adjusted parameters
  → Log the failure for monitoring

  Pattern 4: Fallback tool
  → Primary tool fails → try backup tool
  → web_search fails → try cached_search
\`\`\`

---

## APIs as Tools

Any REST API can be exposed as a tool to an LLM agent. This is how you integrate AI with your existing systems.

\`\`\`
API → TOOL PATTERN

  Your existing API:
  POST /api/orders/create
  Body: { productId, quantity, userId }

  Becomes an agent tool:
  {
    "name": "create_order",
    "description": "Create a new order for a user. Use when user wants to purchase something.",
    "input_schema": {
      "type": "object",
      "properties": {
        "productId": { "type": "string" },
        "quantity": { "type": "number" },
        "userId": { "type": "string" }
      },
      "required": ["productId", "quantity", "userId"]
    }
  }
\`\`\`

Your tool executor calls the API with the model's arguments and returns the result.

---

## External Integrations

Common external systems to expose as tools:

\`\`\`
COMMON TOOL CATEGORIES

  DATA RETRIEVAL
  ├── web_search (Tavily, Serper, Brave)
  ├── database_query (your DB)
  ├── document_search (vector DB)
  └── api_get (any GET endpoint)

  COMMUNICATION
  ├── send_email (SendGrid, Resend)
  ├── send_slack_message
  ├── create_calendar_event
  └── send_sms

  PRODUCTIVITY
  ├── create_github_issue
  ├── create_jira_ticket
  ├── update_notion_page
  └── add_to_todo_list

  COMPUTATION
  ├── calculator (math expressions)
  ├── execute_python (code interpreter)
  ├── run_sql_query
  └── parse_document (PDF, CSV)

  FILE OPERATIONS
  ├── read_file
  ├── write_file
  ├── list_directory
  └── search_in_files
\`\`\`

---

## Agent Workflows with Tools

The combination of tools, the agent loop, and planning creates powerful workflows:

\`\`\`
EXAMPLE: Customer Support Agent Workflow

  User: "I ordered product SKU-1234 three days ago and haven't received a tracking number"

  Agent thinks: I need to look up this order and check status

  Tool call 1: get_order(sku="SKU-1234", user_id=current_user)
  Result: { orderId: "ORD-9876", status: "processing", fulfillmentDate: null }

  Agent thinks: Order is still processing, no fulfillment. Let me check SLA.

  Tool call 2: get_sla_policy(orderType="standard")
  Result: { standardFulfillment: "2 business days" }

  Agent thinks: 3 days > 2 day SLA. This is delayed. I should escalate.

  Tool call 3: create_support_ticket(
    orderId="ORD-9876",
    priority="high",
    reason="SLA breach",
    assignTo="fulfillment_team"
  )
  Result: { ticketId: "TKT-5432" }

  Agent final response:
  "I've investigated your order. It's still in processing, which has exceeded
  our 2 business day SLA. I've escalated this to our fulfillment team with
  priority ticket TKT-5432. You should receive an update within 4 hours."
\`\`\`

No human involved. Real database lookups. Real ticket creation. Real answer grounded in actual data.`,
  codeExamples: [
    {
      title: 'Complete Tool Calling System with Parallel Execution',
      code: `import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

// Tool implementations
const toolImplementations = {
  async get_weather(args: { city: string; unit?: string }): Promise<string> {
    // In production, call a real weather API
    const temps: Record<string, number> = {
      london: 15, paris: 22, tokyo: 28, 'new york': 18,
    };
    const temp = temps[args.city.toLowerCase()] ?? 20;
    const unit = args.unit ?? 'celsius';
    return JSON.stringify({
      city: args.city,
      temperature: unit === 'fahrenheit' ? Math.round(temp * 9/5 + 32) : temp,
      unit,
      condition: 'partly cloudy',
    });
  },

  async search_web(args: { query: string }): Promise<string> {
    // In production, call Tavily, Serper, or Brave API
    return JSON.stringify({
      results: [
        { title: 'Example result', snippet: \`Information about: \${args.query}\` },
      ],
    });
  },

  async calculator(args: { expression: string }): Promise<string> {
    try {
      const result = Function('"use strict"; return (' + args.expression + ')')();
      return String(result);
    } catch {
      return 'Error: Invalid expression';
    }
  },
};

// Tool definitions for the API
const tools: Anthropic.Tool[] = [
  {
    name: 'get_weather',
    description: 'Get current weather for a city. Use when asked about weather or temperature.',
    input_schema: {
      type: 'object' as const,
      properties: {
        city: { type: 'string', description: 'City name' },
        unit: { type: 'string', enum: ['celsius', 'fahrenheit'] },
      },
      required: ['city'],
    },
  },
  {
    name: 'search_web',
    description: 'Search the internet for current information. Use for recent events or factual queries.',
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
    description: 'Evaluate a math expression. Always use for arithmetic — do not compute mentally.',
    input_schema: {
      type: 'object' as const,
      properties: {
        expression: { type: 'string', description: 'Math expression like "15 * 24 + 100"' },
      },
      required: ['expression'],
    },
  },
];

// Execute all tool calls (potentially in parallel)
async function executeTools(
  toolCalls: Array<{ id: string; name: string; input: Record<string, unknown> }>
): Promise<Anthropic.ToolResultBlockParam[]> {
  const results = await Promise.all(
    toolCalls.map(async (call) => {
      const impl = toolImplementations[call.name as keyof typeof toolImplementations];
      let result: string;

      if (!impl) {
        result = \`Error: Unknown tool "\${call.name}"\`;
      } else {
        try {
          result = await impl(call.input as { city: string; unit?: string; query: string; expression: string });
        } catch (error) {
          result = \`Error executing \${call.name}: \${error instanceof Error ? error.message : String(error)}\`;
        }
      }

      return {
        type: 'tool_result' as const,
        tool_use_id: call.id,
        content: result,
      };
    })
  );
  return results;
}

// Complete agent with parallel tool support
async function agent(userMessage: string): Promise<string> {
  const messages: Anthropic.MessageParam[] = [
    { role: 'user', content: userMessage },
  ];

  for (let i = 0; i < 10; i++) {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      tools,
      system: 'Use tools when needed. You can call multiple tools at once for parallel tasks.',
      messages,
    });

    if (response.stop_reason === 'end_turn') {
      const text = response.content.find(c => c.type === 'text');
      return text?.type === 'text' ? text.text : '';
    }

    if (response.stop_reason === 'tool_use') {
      messages.push({ role: 'assistant', content: response.content });

      const toolCalls = response.content
        .filter((c): c is Anthropic.ToolUseBlock => c.type === 'tool_use')
        .map(c => ({ id: c.id, name: c.name, input: c.input as Record<string, unknown> }));

      console.log(\`Calling \${toolCalls.length} tool(s): \${toolCalls.map(t => t.name).join(', ')}\`);

      // Execute all tools in parallel
      const results = await executeTools(toolCalls);
      messages.push({ role: 'user', content: results });
    }
  }

  return 'Max iterations reached';
}

// Test parallel tool calling
const result = await agent(
  "What's the weather in London and Paris? Also, what's 15% of their temperature difference?"
);
console.log(result);
// Agent likely calls get_weather("London") and get_weather("Paris") in parallel,
// then calls calculator with the temperature difference`,
      explanation:
        'The key insight: Promise.all runs all tool calls concurrently. The model may generate multiple tool_use blocks in one response — collect them all, execute in parallel, return all results in one user message. This halves latency compared to sequential tool calls.',
    },
  ],
  commonMistakes: [
    'Running tool calls sequentially when they are independent — use Promise.all for parallel execution; a 3-tool sequential call has 3x the latency of parallel',
    'Not returning errors to the model — if a tool fails, return a descriptive error string; the model can then decide to retry or tell the user',
    'Letting models execute tools directly — the model outputs a request, YOUR code executes it; never use eval() or equivalent on model-generated code without sandboxing',
    'Vague tool descriptions — "calculator" is not helpful; explain when to use it and what format inputs should be in',
    'Missing required parameters in tool schema — if a parameter is always needed, mark it required; the model will then always provide it',
    'Giving too many tools — 3-7 tools is usually ideal; too many causes the model to get confused about which tool to use',
  ],
  interviewQuestions: [
    {
      question: 'What is function calling / tool calling in LLMs and how does it work?',
      answer:
        'Function calling (tool calling) is a protocol where: you define tools (functions) available to the model with a JSON schema describing their name, purpose, and parameters. When the model determines it needs a tool, instead of answering, it outputs a structured tool call request with the tool name and arguments. Your code receives this request, executes the actual function, and returns the result to the model. The model then continues and generates a final response incorporating the tool result. Critical point: the model never executes functions — it only outputs structured requests; you control all execution.',
      difficulty: 'intermediate',
    },
    {
      question: 'What is parallel tool calling and when does it matter?',
      answer:
        'Parallel tool calling is when the model outputs multiple tool call requests in a single response, which you execute concurrently before returning all results. It matters for latency: a user asking "compare weather in London and Paris" would otherwise require 2 sequential round trips (call London weather → return → call Paris weather → return → final answer). With parallel calling, both weather tools run simultaneously in one round trip. Models like Claude and GPT-4 support parallel tool calls — you detect multiple tool_use blocks in the response and execute them all with Promise.all before returning results.',
      difficulty: 'intermediate',
    },
    {
      question: 'How do you write a good tool description?',
      answer:
        'Good tool descriptions tell the model: (1) what the tool does precisely, (2) when to use it vs not use it, (3) what format inputs should be in, (4) what the output will look like. Bad: "search" — too vague. Good: "Search the internet for current information, news, and facts about any topic. Use this when the user asks about recent events, current data, or anything that may have changed recently. Returns a list of search results with titles and snippets." Also: always specify the input format in parameter descriptions, use enum types when there are a fixed set of valid values, and mark required parameters correctly.',
      difficulty: 'intermediate',
    },
  ],
  exercises: [
    {
      id: 'build-tool-system',
      title: 'Build a Multi-Tool Research Assistant',
      description:
        'Build an assistant with three tools: web search, a note-taking tool (saves notes to an array), and a summarizer. The agent should research a topic, take notes, and produce a summary.',
      starterCode: `import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

// Shared notes array (agent's working memory)
const notes: string[] = [];

// TODO: Implement tool handlers
const toolHandlers: Record<string, (args: Record<string, string>) => Promise<string>> = {
  web_search: async (args) => {
    // Simulate: return data based on args.query
    return \`Search results for "\${args.query}": Found relevant information.\`;
  },

  save_note: async (args) => {
    // Save args.content to notes array
    // Return confirmation
    return '';
  },

  get_all_notes: async () => {
    // Return all saved notes formatted
    return '';
  },
};

// TODO: Define the tools array
const tools: Anthropic.Tool[] = [];

// TODO: Implement the agent loop
async function researchAssistant(topic: string): Promise<string> {
  // Goal: research the topic, save notes along the way, produce final summary
  return '';
}

const summary = await researchAssistant("benefits of TypeScript for large teams");
console.log(summary);`,
      solution: `import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();
const notes: string[] = [];

const toolHandlers: Record<string, (args: Record<string, string>) => Promise<string>> = {
  web_search: async (args) => {
    const fakeData: Record<string, string> = {
      typescript: 'TypeScript provides static types, catches errors at compile time, and improves IDE autocompletion. Large teams benefit from self-documenting code and easier refactoring.',
      benefits: 'Benefits include: type safety reduces bugs, better tooling support, improved code maintainability, and easier onboarding for new developers.',
    };
    const key = Object.keys(fakeData).find(k => args.query?.toLowerCase().includes(k));
    return key ? fakeData[key] : \`General info about: \${args.query}\`;
  },

  save_note: async (args) => {
    if (args.content) {
      notes.push(args.content);
      return \`Note saved. Total notes: \${notes.length}\`;
    }
    return 'No content to save';
  },

  get_all_notes: async () => {
    if (notes.length === 0) return 'No notes saved yet';
    return notes.map((n, i) => \`\${i + 1}. \${n}\`).join('\\n');
  },
};

const tools: Anthropic.Tool[] = [
  {
    name: 'web_search',
    description: 'Search for information on any topic.',
    input_schema: {
      type: 'object' as const,
      properties: { query: { type: 'string', description: 'Search query' } },
      required: ['query'],
    },
  },
  {
    name: 'save_note',
    description: 'Save a note for later. Use to record key findings while researching.',
    input_schema: {
      type: 'object' as const,
      properties: { content: { type: 'string', description: 'Note content to save' } },
      required: ['content'],
    },
  },
  {
    name: 'get_all_notes',
    description: 'Retrieve all saved notes. Use when you want to review what you have found so far.',
    input_schema: { type: 'object' as const, properties: {} },
  },
];

async function researchAssistant(topic: string): Promise<string> {
  const messages: Anthropic.MessageParam[] = [
    {
      role: 'user',
      content: \`Research this topic and produce a summary: \${topic}.
Use web_search to find info, save_note to record key points,
then get_all_notes and write a final summary.\`,
    },
  ];

  for (let i = 0; i < 15; i++) {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6', max_tokens: 1024, tools,
      system: 'You are a research assistant. Search, take notes, then summarize.',
      messages,
    });

    if (response.stop_reason === 'end_turn') {
      const text = response.content.find(c => c.type === 'text');
      return text?.type === 'text' ? text.text : '';
    }

    messages.push({ role: 'assistant', content: response.content });
    const results: Anthropic.ToolResultBlockParam[] = [];
    for (const block of response.content) {
      if (block.type === 'tool_use') {
        const result = await toolHandlers[block.name]?.(block.input as Record<string, string>) ?? 'Tool not found';
        results.push({ type: 'tool_result', tool_use_id: block.id, content: result });
      }
    }
    messages.push({ role: 'user', content: results });
  }
  return 'Max iterations';
}`,
      hints: [
        'Tool descriptions guide the model — tell it when to call each tool and in what order',
        'The save_note tool gives the agent persistent memory within one session',
        'The system prompt should tell the agent the intended workflow: search → note → get notes → summarize',
        'Watch the conversation unfold in logs — the agent should naturally call tools in a sensible research flow',
      ],
    },
  ],
  keyTakeaways: [
    'Tool calling lets LLMs interact with the real world — search, databases, APIs, code execution — beyond just generating text',
    'The model outputs structured tool call requests; YOUR code executes them and returns results — you control all execution',
    'Parallel tool calling (multiple tools in one turn, executed with Promise.all) dramatically reduces latency for independent operations',
    'Tool descriptions are critical — the model decides when and how to use tools based on descriptions; write them clearly and specifically',
    'Always handle tool errors gracefully — return descriptive error strings so the model can adapt',
    'Any API can become a tool — this is how you extend AI agents to interact with your existing systems',
  ],
  nextLesson: 'ai-application-architecture',
  prevLesson: 'agentic-ai',
};
