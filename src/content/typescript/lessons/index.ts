import type { Lesson } from '@/types';

export const lessons: Lesson[] = [
  // ─── MODULE 1: Introduction to TypeScript ───────────────────────────────────
  {
    id: 'what-is-typescript',
    slug: 'what-is-typescript',
    title: 'What is TypeScript?',
    description: 'Understand why TypeScript exists, what problems it solves, and how it works under the hood.',
    category: 'Fundamentals',
    order: 1,
    difficulty: 'beginner',
    estimatedTime: 15,
    content: `TypeScript is a **statically typed superset of JavaScript** developed by Microsoft and released in 2012. Every valid JavaScript file is also a valid TypeScript file — TypeScript only adds things on top.\n\n**The core idea:** JavaScript lets you write code and discover mistakes at runtime (when the program is running). TypeScript lets you discover mistakes at compile time (before the program ever runs).\n\n**Real-world analogy:** Imagine writing an essay without spell-check, then handing it in. JavaScript is that. TypeScript is writing with a spell-checker and grammar checker that catches errors as you type — before anything is submitted.\n\n## Why TypeScript Exists\n\nJavaScript was designed for small scripts in 1995. By 2010, developers were building massive applications — Gmail, Google Maps, Facebook — in JavaScript. At this scale, JavaScript's flexibility became a liability:\n\n- You call a function with the wrong argument type — no error until runtime\n- You rename a property — all callers break silently\n- You work on a team of 50 engineers — nobody knows what a function expects\n\nTypeScript was built to solve these problems without replacing JavaScript.\n\n## Problems TypeScript Solves\n\n**1. Silent bugs from wrong types:**\n\`\`\`js\n// JavaScript — no error until runtime\nfunction greet(name) {\n  return "Hello, " + name.toUpperCase();\n}\ngreet(42); // Runtime error: name.toUpperCase is not a function\n\`\`\`\n\n**2. Unknown object shapes:** In large codebases, you cannot know what fields an object has without reading documentation or the full call chain.\n\n**3. Refactoring blindness:** Rename a function or field — JavaScript gives you no help finding all the places that break.\n\n**4. Poor autocomplete:** Without type info, editors cannot suggest the right properties or methods.\n\n## How TypeScript Works\n\nTypeScript has three phases:\n\n**1. Type Checking** — The TypeScript compiler reads your code and checks it against the type rules. If something is wrong, it reports an error.\n\n**2. Compilation (Transpilation)** — TypeScript compiles to JavaScript. The output is plain JS that any browser or Node.js can run.\n\n**3. Type Erasure** — All TypeScript-specific syntax (type annotations, interfaces, generics) is completely removed from the output. At runtime, there is no TypeScript — only JavaScript.\n\n\`\`\`\nYour .ts file  →  tsc (TypeScript Compiler)  →  .js file (pure JavaScript)\n\`\`\`\n\nThis means TypeScript has **zero runtime cost**. Types are a development tool only.\n\n## TypeScript vs JavaScript\n\n| Feature | JavaScript | TypeScript |\n|---------|-----------|------------|\n| Types | Dynamic (runtime) | Static (compile time) |\n| Errors | At runtime | At compile time |\n| Autocomplete | Limited | Rich |\n| Refactoring | Manual | Tool-assisted |\n| Learning curve | Lower | Slightly higher |\n| Runtime | Direct | Compiles to JS |\n\n## Who Uses TypeScript\n\n- **Microsoft** — Built it, uses it for VS Code and Azure SDKs\n- **Google** — Angular is built entirely in TypeScript\n- **Airbnb, Lyft, Slack, Discord** — Migrated large codebases to TypeScript\n- **Meta** — React's type definitions are maintained in TypeScript\n- **Open source** — Next.js, Prisma, tRPC, Zod are TypeScript-first`,
    codeExamples: [
      {
        title: 'TypeScript catches errors before runtime',
        code: `// TypeScript version
function greet(name: string): string {
  return "Hello, " + name.toUpperCase();
}

greet("Alice");  // OK
greet(42);       // Error at compile time: Argument of type 'number' is not assignable to parameter of type 'string'

// The error is caught BEFORE the code runs
// In JavaScript, you'd only see this when the function was called with 42`,
        explanation: 'The : string after name is a type annotation. TypeScript now knows name must be a string and rejects anything else at compile time.',
      },
      {
        title: 'Type Erasure — output is clean JavaScript',
        code: `// TypeScript source (.ts)
function add(a: number, b: number): number {
  return a + b;
}

const result: number = add(1, 2);

// Compiled JavaScript output (.js) — types are gone
function add(a, b) {
  return a + b;
}

const result = add(1, 2);`,
        explanation: 'After compilation, all TypeScript syntax is removed. The output is plain JavaScript that runs everywhere.',
      },
      {
        title: 'TypeScript enables rich autocomplete',
        code: `interface User {
  id: number;
  name: string;
  email: string;
}

function sendEmail(user: User) {
  // When you type "user." your editor shows: id, name, email
  // Without TypeScript, the editor has no idea what fields exist
  console.log(user.email);
  // console.log(user.phne); // Error: Property 'phne' does not exist on type 'User'
  // TypeScript catches the typo instantly
}`,
        explanation: 'TypeScript powers the autocomplete and error-checking you see in VS Code. The editor knows the exact shape of every variable.',
      },
      {
        title: 'JavaScript is valid TypeScript',
        code: `// This is valid TypeScript (it is also valid JavaScript)
const numbers = [1, 2, 3];
const doubled = numbers.map(n => n * 2);
console.log(doubled);

// TypeScript infers types automatically — you do not need to annotate everything
// TypeScript knows: numbers is number[], doubled is number[]`,
        output: '[2, 4, 6]',
        explanation: 'You do not need to add types to everything. TypeScript is intelligent enough to infer types from your code.',
      },
    ],
    commonMistakes: [
      'Thinking TypeScript replaces JavaScript — it compiles TO JavaScript. At runtime, there is no TypeScript.',
      'Thinking you must annotate every variable — TypeScript infers types from values. Over-annotating is noise.',
      'Expecting TypeScript to prevent runtime errors from external data (API responses, user input) — types are erased at runtime.',
      'Confusing TypeScript errors with JavaScript runtime errors — TypeScript errors happen at compile time, not during execution.',
    ],
    interviewQuestions: [
      {
        question: 'What is TypeScript and how is it different from JavaScript?',
        answer: 'TypeScript is a statically typed superset of JavaScript developed by Microsoft. It adds optional static typing, interfaces, generics, and other features on top of JavaScript. The key difference: JavaScript catches type errors at runtime, TypeScript catches them at compile time. TypeScript compiles to plain JavaScript and all type information is erased — there is no TypeScript at runtime.',
        difficulty: 'beginner',
      },
      {
        question: 'What is type erasure?',
        answer: 'Type erasure is the process by which TypeScript removes all type annotations, interfaces, and TypeScript-specific syntax during compilation. The output is plain JavaScript. This means TypeScript types have zero runtime cost and do not affect the behavior of the running program.',
        difficulty: 'beginner',
      },
      {
        question: 'Why do companies adopt TypeScript?',
        answer: 'Companies adopt TypeScript for: (1) Catching bugs at compile time instead of production, (2) Better IDE support — autocomplete, refactoring, go-to-definition, (3) Self-documenting code — types describe what a function expects and returns, (4) Safer refactoring in large codebases, (5) Easier onboarding for new team members who can understand APIs from types alone.',
        difficulty: 'intermediate',
      },
      {
        question: 'Does TypeScript guarantee no runtime errors?',
        answer: 'No. TypeScript only checks code it can analyze statically. At runtime, data from external sources (APIs, user input, localStorage) does not have TypeScript types. Also, you can use type assertions (as) to override the type checker. TypeScript significantly reduces bugs but does not eliminate them entirely.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'ex-ts-1',
        title: 'Add type annotations',
        description: 'Convert this JavaScript function to TypeScript by adding type annotations to the parameters and return type.',
        starterCode: `// Add TypeScript type annotations
function calculateTotal(price, quantity, taxRate) {
  return price * quantity * (1 + taxRate);
}

const total = calculateTotal(10, 3, 0.08);
console.log(total); // 32.4`,
        solution: `function calculateTotal(price: number, quantity: number, taxRate: number): number {
  return price * quantity * (1 + taxRate);
}

const total: number = calculateTotal(10, 3, 0.08);
console.log(total); // 32.4`,
        hints: ['Add : type after each parameter name', 'Add : returnType after the closing parenthesis'],
        expectedOutput: '32.4',
      },
    ],
    keyTakeaways: [
      'TypeScript is a superset of JavaScript — all JS is valid TS',
      'TypeScript catches type errors at compile time, not runtime',
      'Type erasure: all TypeScript syntax is removed in the output JS',
      'TypeScript has zero runtime cost — types are a development tool only',
      'Major companies (Microsoft, Google, Airbnb) use TypeScript in production',
    ],
    nextLesson: 'typescript-setup',
  },

  // ─── MODULE 2: TypeScript Setup ─────────────────────────────────────────────
  {
    id: 'typescript-setup',
    slug: 'typescript-setup',
    title: 'TypeScript Setup',
    description: 'Install TypeScript, configure tsconfig.json, and understand the compilation process.',
    category: 'Fundamentals',
    order: 2,
    difficulty: 'beginner',
    estimatedTime: 20,
    content: `## Installing TypeScript\n\nTypeScript is installed via npm. You can install it globally (available everywhere) or locally (per project).\n\n\`\`\`bash\n# Global install (for trying things out)\nnpm install -g typescript\n\n# Local install (recommended for projects)\nnpm install --save-dev typescript\n\n# Check version\ntsc --version\n\`\`\`\n\nThe \`tsc\` command is the TypeScript Compiler. It reads \`.ts\` files and outputs \`.js\` files.\n\n## The tsconfig.json File\n\n\`tsconfig.json\` is the configuration file for TypeScript. It tells the compiler:\n- Which files to compile\n- What JavaScript version to target\n- How strict the type checking should be\n- Where to put the output files\n\nCreate it with:\n\`\`\`bash\ntsc --init\n\`\`\`\n\n## Key tsconfig.json Options\n\n\`\`\`json\n{\n  "compilerOptions": {\n    "target": "ES2020",         // Output JS version\n    "module": "commonjs",       // Module system (Node) or "ESNext" (bundlers)\n    "outDir": "./dist",         // Where compiled JS goes\n    "rootDir": "./src",         // Where TS source files are\n    "strict": true,             // Enable all strict checks (ALWAYS use this)\n    "esModuleInterop": true,    // Better import compatibility\n    "skipLibCheck": true,       // Skip type checking of .d.ts files\n    "forceConsistentCasingInFileNames": true\n  },\n  "include": ["src/**/*"],      // Files to compile\n  "exclude": ["node_modules"]   // Files to skip\n}\n\`\`\`\n\n## The strict Flag — Most Important Setting\n\n\`strict: true\` enables a group of checks:\n- \`noImplicitAny\` — Error when a variable implicitly gets type \`any\`\n- \`strictNullChecks\` — \`null\` and \`undefined\` are not assignable to other types\n- \`strictFunctionTypes\` — Stricter function parameter checking\n- \`strictPropertyInitialization\` — Class properties must be initialized\n\nAlways use \`strict: true\`. Without it, TypeScript is much weaker.\n\n## Running TypeScript\n\n\`\`\`bash\n# Compile once\ntsc\n\n# Watch mode — recompiles on file save\ntsc --watch\n\n# Run directly without separate compile step (development only)\nnpx ts-node src/index.ts\n\n# Modern alternative: tsx (faster)\nnpx tsx src/index.ts\n\`\`\`\n\n## VS Code Support\n\nVS Code has TypeScript support built in — no extensions needed. It uses the TypeScript language server to:\n- Show errors as you type (red underlines)\n- Provide autocomplete\n- Enable go-to-definition (Cmd/Ctrl + Click)\n- Show type information on hover\n\nInstall the ESLint + Prettier extensions for linting and formatting.\n\n## Recommended Project Structure\n\n\`\`\`\nmy-project/\n├── src/              # TypeScript source files\n│   ├── index.ts\n│   └── utils/\n├── dist/             # Compiled JavaScript (git ignored)\n├── tsconfig.json\n├── package.json\n└── node_modules/\n\`\`\`\n\n## Type Definitions (@types)\n\nWhen using JavaScript libraries in TypeScript, you need type definitions:\n\n\`\`\`bash\n# Install types for a library\nnpm install --save-dev @types/node\nnpm install --save-dev @types/express\n\`\`\`\n\nThese \`@types/\` packages contain \`.d.ts\` files — type declaration files that describe the shape of a library without any runtime code. Modern libraries (like Zod, Prisma, tRPC) include their own types — no \`@types/\` needed.`,
    codeExamples: [
      {
        title: 'Minimal tsconfig.json for a Node.js project',
        code: `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}`,
        explanation: 'This is a solid starting tsconfig for Node.js. The strict flag is the most important — always enable it.',
      },
      {
        title: 'tsconfig.json for a Next.js project',
        code: `{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}`,
        explanation: 'Next.js generates this tsconfig for you. Key extras: jsx: preserve (Next handles JSX), noEmit: true (Next handles compilation), paths for @ imports.',
      },
      {
        title: 'Declaration files (.d.ts)',
        code: `// utils.d.ts — describes the shape of utils.js
// This is what @types/ packages contain

export declare function formatDate(date: Date): string;
export declare function slugify(text: string): string;
export declare const VERSION: string;

// No implementation — just type declarations
// This is how TypeScript understands JS libraries`,
        explanation: '.d.ts files are pure type declarations — no runtime code. They allow TypeScript to understand the shape of JavaScript files and libraries.',
      },
    ],
    commonMistakes: [
      'Not using strict: true — without it, TypeScript misses many bugs.',
      'Committing the dist/ folder — compiled output should be in .gitignore.',
      'Using ts-node in production — compile to JS first, then run the JS.',
      'Forgetting to install @types/ packages for JS libraries.',
      'Setting target to ES5 unnecessarily — modern environments support ES2020+.',
    ],
    interviewQuestions: [
      {
        question: 'What is tsconfig.json?',
        answer: 'tsconfig.json is the TypeScript compiler configuration file. It specifies the root files, compiler options (target JS version, strict mode, output directory), and which files to include or exclude. Running tsc without arguments uses tsconfig.json in the current directory.',
        difficulty: 'beginner',
      },
      {
        question: 'What does strict: true enable in TypeScript?',
        answer: 'strict: true enables a set of stricter type-checking options: noImplicitAny (errors when type is implicitly any), strictNullChecks (null/undefined are not assignable to other types), strictFunctionTypes, strictBindCallApply, strictPropertyInitialization, and noImplicitThis. Always enable it — without strict mode, TypeScript catches far fewer bugs.',
        difficulty: 'intermediate',
      },
      {
        question: 'What are .d.ts files?',
        answer: '.d.ts files are TypeScript declaration files. They contain only type declarations (no implementation code). They allow TypeScript to understand the types of JavaScript libraries. The @types/ packages on npm are collections of .d.ts files for popular JS libraries. Modern libraries (like Prisma, Zod) bundle their own .d.ts files.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'ex-ts-setup-1',
        title: 'Configure tsconfig for a Node.js API',
        description: 'Create a tsconfig.json for a Node.js Express API. Requirements: output to dist/, source in src/, ES2020 target, strict mode on.',
        starterCode: `// Create the tsconfig.json content
// Requirements:
// - target: ES2020
// - module: commonjs (for Node.js)
// - outDir: ./dist
// - rootDir: ./src
// - strict: true
// - esModuleInterop: true
{

}`,
        solution: `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}`,
        hints: ['module should be commonjs for Node.js', 'strict: true is the most important option'],
      },
    ],
    keyTakeaways: [
      'Install TypeScript with: npm install --save-dev typescript',
      'tsconfig.json controls how TypeScript compiles your code',
      'Always use strict: true — it enables all important type checks',
      '.d.ts files are type declarations for JS libraries',
      'VS Code has built-in TypeScript support — no extension needed',
    ],
    prevLesson: 'what-is-typescript',
    nextLesson: 'basic-types',
  },

  // ─── MODULE 3: Basic Types ───────────────────────────────────────────────────
  {
    id: 'basic-types',
    slug: 'basic-types',
    title: 'Basic Types',
    description: 'Learn all TypeScript primitive types — string, number, boolean, null, undefined, any, unknown, never, void, bigint, symbol.',
    category: 'Type System',
    order: 3,
    difficulty: 'beginner',
    estimatedTime: 25,
    content: `TypeScript has all of JavaScript's types plus several new ones for expressing type-level constraints.\n\n## Primitive Types (matching JavaScript)\n\nThese match JavaScript's primitives exactly. You add them as annotations:\n\n\`\`\`ts\nconst name: string = "Alice";\nconst age: number = 25;\nconst active: boolean = true;\nconst nothing: null = null;\nconst missing: undefined = undefined;\nconst big: bigint = 9007199254740993n;\nconst sym: symbol = Symbol("id");\n\`\`\`\n\nIn practice, you often don't write these — TypeScript infers them from the value (covered in the next module).\n\n## any — The Escape Hatch\n\n\`any\` disables type checking for a variable. It means "I don't know the type, and I don't want TypeScript to check this."\n\n\`\`\`ts\nlet x: any = "hello";\nx = 42;       // OK\nx = true;     // OK\nx.foo.bar;    // OK (no error, even though this will crash at runtime)\n\`\`\`\n\n**When to use any:** Only as a last resort when migrating JS to TS, or when working with truly dynamic data where the structure is unknown. Every \`any\` is a hole in your type safety.\n\n**Avoid any in new code.** Use \`unknown\` instead.\n\n## unknown — Safe Version of any\n\n\`unknown\` means "this could be anything." Unlike \`any\`, TypeScript forces you to check the type before using it.\n\n\`\`\`ts\nlet value: unknown = "hello";\n\n// Cannot use unknown directly:\nvalue.toUpperCase(); // Error: Object is of type 'unknown'\n\n// Must narrow it first:\nif (typeof value === "string") {\n  value.toUpperCase(); // OK — TypeScript knows it's a string here\n}\n\`\`\`\n\n**Use unknown** for values from external sources (API responses, JSON.parse, user input). It forces you to validate before using.\n\n## never — Impossible Type\n\n\`never\` represents a value that can never exist. It appears in two situations:\n\n**1. Functions that never return:**\n\`\`\`ts\nfunction throwError(message: string): never {\n  throw new Error(message);\n  // This function never returns — it always throws\n}\n\nfunction infiniteLoop(): never {\n  while (true) {}\n}\n\`\`\`\n\n**2. Exhaustive checks (very powerful):**\n\`\`\`ts\ntype Shape = "circle" | "square" | "triangle";\n\nfunction area(shape: Shape): number {\n  if (shape === "circle") return Math.PI;\n  if (shape === "square") return 1;\n  if (shape === "triangle") return 0.5;\n  \n  // If you forget a case, this line catches it:\n  const _exhaustive: never = shape;\n  throw new Error("Unhandled shape: " + shape);\n}\n// If you add "hexagon" to Shape but forget to add a case above,\n// TypeScript will error on the never assignment.\n\`\`\`\n\n## void — No Return Value\n\n\`void\` means a function returns nothing (or undefined).\n\n\`\`\`ts\nfunction log(message: string): void {\n  console.log(message);\n  // No return statement — implicitly returns undefined\n}\n\`\`\`\n\nDifference from \`never\`: A \`void\` function returns (completes), it just returns nothing. A \`never\` function never returns at all.\n\n## Type Comparison Table\n\n| Type | Meaning | Use when |\n|------|---------|----------|\n| \`string\` | Text values | Names, emails, URLs |\n| \`number\` | All numbers | Prices, ages, counts |\n| \`boolean\` | true/false | Flags, conditions |\n| \`null\` | Intentional absence | "No user selected" |\n| \`undefined\` | Not yet assigned | Optional properties |\n| \`any\` | Opt out of type checking | Legacy code migration only |\n| \`unknown\` | Unknown type — must narrow | API responses, JSON.parse |\n| \`never\` | Impossible/unreachable | Exhaustive checks, throws |\n| \`void\` | No return value | Event handlers, logging |\n| \`bigint\` | Arbitrary large integers | Financial calculations |\n| \`symbol\` | Unique identity | Unique object keys |`,
    codeExamples: [
      {
        title: 'Primitive type annotations',
        code: `// Explicit annotations (often not needed — TypeScript infers these)
const username: string = "alice";
const score: number = 98.5;
const isLoggedIn: boolean = true;

// null and undefined
let selectedItem: string | null = null;  // nothing selected yet
let timeout: number | undefined;          // not set yet

// TypeScript infers these even without annotations:
const greeting = "Hello";  // inferred as string
const count = 0;           // inferred as number
const flag = false;        // inferred as boolean`,
        explanation: 'TypeScript infers primitive types from literal values. Explicit annotations are optional for simple cases.',
      },
      {
        title: 'any vs unknown — the key difference',
        code: `// any — no safety
let dangerousAny: any = fetchDataFromAPI();
dangerousAny.user.profile.email; // No error — but might crash at runtime!

// unknown — safe
let safeUnknown: unknown = fetchDataFromAPI();
safeUnknown.user.profile.email; // Error: Object is of type 'unknown'

// Must check first:
if (
  typeof safeUnknown === "object" &&
  safeUnknown !== null &&
  "user" in safeUnknown
) {
  // Now TypeScript knows more about the shape
  console.log(safeUnknown); // Safer usage
}

// Or use a type assertion (after validation):
const data = safeUnknown as { user: { email: string } };
console.log(data.user.email);`,
        explanation: 'any is dangerous — it disables all checks. unknown is safe — it forces you to check before using.',
      },
      {
        title: 'never for exhaustive type checking',
        code: `type Status = "pending" | "active" | "cancelled";

function getStatusMessage(status: Status): string {
  switch (status) {
    case "pending":   return "Waiting for approval";
    case "active":    return "Currently active";
    case "cancelled": return "Has been cancelled";
    default:
      // If we add a new status to the union and forget to handle it,
      // TypeScript will error here because status won't be 'never'
      const _check: never = status;
      throw new Error(\`Unhandled status: \${status}\`);
  }
}`,
        explanation: 'The never trick in switch default is a compile-time safety net. Add a new status to the union without handling it and TypeScript tells you.',
      },
      {
        title: 'void vs never',
        code: `// void — function completes, returns nothing
function saveUser(user: User): void {
  database.save(user);
  // Returns undefined implicitly
}

// never — function never completes
function fail(message: string): never {
  throw new Error(message);
  // Never reaches a return statement
}

// never in unreachable code
function processValue(value: string | number) {
  if (typeof value === "string") {
    return value.toUpperCase();
  } else if (typeof value === "number") {
    return value.toFixed(2);
  } else {
    // TypeScript knows this branch is unreachable
    // value has type 'never' here
    const unreachable: never = value;
  }
}`,
        explanation: 'void = function returns, but returns nothing. never = function never returns at all.',
      },
    ],
    commonMistakes: [
      'Using any liberally — it disables type safety. Use unknown for uncertain types.',
      'Confusing void and never — void functions return (with undefined), never functions do not return.',
      'Forgetting strictNullChecks — without it, null and undefined sneak into all types.',
      'Using undefined and null interchangeably — null is intentional absence, undefined is "not yet set".',
      'Annotating everything explicitly — TypeScript infers primitives from literals. let name = "Alice" already knows name is string.',
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between any and unknown?',
        answer: 'Both can hold any type of value. The difference is in how you can use them: any disables all type checking — you can do anything with an any value and TypeScript will not complain. unknown is the safe version — TypeScript requires you to narrow the type (using typeof, instanceof, or type guards) before you can use the value. Use unknown for values from external sources, avoid any in new code.',
        difficulty: 'intermediate',
      },
      {
        question: 'What is the never type and when do you use it?',
        answer: 'never represents values that can never exist. It is used in two cases: (1) Functions that never return — functions that throw or run forever have return type never. (2) Exhaustive type checking — in a switch/if-else that handles all cases of a union, the remaining branch has type never. If you assign never to a variable in that branch, TypeScript will error if you add a new union member without handling it.',
        difficulty: 'advanced',
      },
      {
        question: 'When should you use null vs undefined in TypeScript?',
        answer: 'Convention: undefined means "not yet assigned" or "optional". null means "intentionally absent". For optional function parameters, use undefined (or optional parameters). For "no result" return values (like a database query that finds nothing), many teams use null. The most important thing is to be consistent within your codebase. Some teams avoid null entirely and use undefined or an Option/Maybe pattern.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'ex-types-1',
        title: 'Replace any with proper types',
        description: 'The function below uses any. Replace with proper types including unknown where appropriate.',
        starterCode: `function processApiResponse(response: any): any {
  if (response.status === 200) {
    return response.data.name.toUpperCase();
  }
  return null;
}`,
        solution: `interface ApiResponse {
  status: number;
  data: {
    name: string;
  };
}

function processApiResponse(response: ApiResponse): string | null {
  if (response.status === 200) {
    return response.data.name.toUpperCase();
  }
  return null;
}`,
        hints: ['Define an interface for the response shape', 'The return type is string or null'],
      },
      {
        id: 'ex-types-2',
        title: 'Use never for exhaustive checking',
        description: 'Add a never check to ensure all payment methods are handled.',
        starterCode: `type PaymentMethod = "credit_card" | "paypal" | "crypto";

function getPaymentFee(method: PaymentMethod): number {
  if (method === "credit_card") return 0.029;
  if (method === "paypal") return 0.034;
  // Add crypto case AND a never exhaustive check
}`,
        solution: `type PaymentMethod = "credit_card" | "paypal" | "crypto";

function getPaymentFee(method: PaymentMethod): number {
  if (method === "credit_card") return 0.029;
  if (method === "paypal") return 0.034;
  if (method === "crypto") return 0.01;

  const _exhaustive: never = method;
  throw new Error(\`Unhandled payment method: \${method}\`);
}`,
        hints: ['Handle crypto first, then add the never check in the default branch'],
      },
    ],
    keyTakeaways: [
      'TypeScript has all JS primitive types plus: any, unknown, never, void',
      'Avoid any — it disables type safety. Use unknown for uncertain types.',
      'unknown forces you to narrow the type before using the value',
      'never = impossible type. Used for exhaustive checks and throw functions.',
      'void = function returns nothing (completes). never = never returns.',
    ],
    prevLesson: 'typescript-setup',
    nextLesson: 'type-inference',
  },

  // ─── MODULE 4: Type Inference ────────────────────────────────────────────────
  {
    id: 'type-inference',
    slug: 'type-inference',
    title: 'Type Inference',
    description: 'Learn how TypeScript automatically determines types — what it infers, when to annotate, and best practices.',
    category: 'Type System',
    order: 4,
    difficulty: 'beginner',
    estimatedTime: 20,
    content: `Type inference is TypeScript's ability to **automatically determine the type of a variable or expression without you writing it explicitly**. This is one of TypeScript's most important features.\n\n## What is Type Inference\n\nWhen you write:\n\`\`\`ts\nconst name = "Alice";\n\`\`\`\n\nYou have not written any type annotation. But TypeScript knows \`name\` is a \`string\` because you assigned a string literal. You can hover over \`name\` in VS Code and see: \`const name: string\`.\n\nTypeScript infers types from:\n1. **Variable assignments** — the type of the assigned value\n2. **Function return values** — inferred from what the function returns\n3. **Array literals** — inferred from the elements\n4. **Object literals** — inferred from the properties\n5. **Function parameters with defaults** — inferred from the default value\n\n## How Inference Works\n\n\`\`\`ts\n// Literal inference — specific types\nconst age = 25;                    // inferred: number\nconst greeting = "Hello";          // inferred: string\nconst active = true;               // inferred: boolean\nconst items = [1, 2, 3];           // inferred: number[]\nconst mixed = [1, "hello", true];  // inferred: (string | number | boolean)[]\n\nconst user = {\n  name: "Alice",\n  age: 25\n};\n// inferred: { name: string; age: number }\n\`\`\`\n\n## const vs let Inference\n\nTypeScript infers differently for \`const\` and \`let\`:\n\n\`\`\`ts\nconst x = "hello";  // type: "hello" (string literal type)\nlet y = "hello";    // type: string (wider type — can be reassigned)\n\`\`\`\n\nWith \`const\`, TypeScript knows the value can never change, so it infers the most specific type (the literal type \`"hello"\`). With \`let\`, the value can change to any string, so TypeScript infers the wider type \`string\`.\n\n## Function Return Inference\n\nTypeScript infers function return types from the return statements:\n\n\`\`\`ts\nfunction add(a: number, b: number) {\n  return a + b;  // TypeScript infers return type: number\n}\n\nfunction greet(name: string) {\n  return \`Hello, \${name}\`;  // inferred: string\n}\n\nfunction findUser(id: number) {\n  if (id === 1) return { name: "Alice" };\n  return null;  // inferred return type: { name: string } | null\n}\n\`\`\`\n\n## When to Annotate vs When to Let TypeScript Infer\n\n**Let TypeScript infer:**\n- Variable assignments: \`const count = 0\` not \`const count: number = 0\`\n- Function return types (when the inference is clear)\n- Array and object literals\n\n**Write explicit annotations:**\n- Function parameters — TypeScript cannot infer these from usage\n- When inference gives a type that is too wide or too narrow\n- Public API surfaces (exported functions) — makes intent clear\n- When you want the type to be something different from what would be inferred\n\n## Contextual Typing\n\nTypeScript also infers types from context:\n\n\`\`\`ts\nconst numbers = [1, 2, 3];\n// TypeScript knows the callback receives number:\nnumbers.forEach((n) => {\n  console.log(n.toFixed(2));  // no error — n is known to be number\n});\n\ndocument.addEventListener("click", (event) => {\n  // TypeScript infers event is MouseEvent from the context "click"\n  console.log(event.clientX); // OK\n});\n\`\`\`\n\n## Inference Limitations\n\nTypeScript cannot always infer correctly:\n\n\`\`\`ts\n// Cannot infer parameter types — annotation required\nfunction double(n) {   // Error: Parameter 'n' implicitly has an 'any' type\n  return n * 2;\n}\n\n// Inference is too wide\nconst direction = "north"; // type: string — but you want: "north" | "south" | "east" | "west"\n\`\`\`\n\n## Best Practices\n\n1. **Don't over-annotate** — if TypeScript can infer it, don't write it\n2. **Do annotate function parameters** — inference cannot help here\n3. **Annotate public APIs** — makes the contract explicit\n4. **Use \`as const\`** when you need literal types from \`let\` or object literals`,
    codeExamples: [
      {
        title: 'What TypeScript infers automatically',
        code: `// TypeScript infers all of these — no annotations needed
const name = "Alice";           // string
const age = 25;                 // number
const scores = [95, 87, 92];    // number[]
const user = {
  id: 1,
  name: "Alice",
  active: true
};
// { id: number; name: string; active: boolean }

// Function return types are also inferred
function multiply(a: number, b: number) {
  return a * b;
}
// TypeScript knows return type is number

// Arrays with mixed types
const mixed = [1, "hello", true];
// (string | number | boolean)[]`,
        explanation: 'TypeScript infers types from assigned values, return statements, and array contents. You only need to annotate what TypeScript cannot figure out itself.',
      },
      {
        title: 'const vs let inference (literal types)',
        code: `// const — TypeScript infers the literal type
const direction = "north";
// type: "north" (not just string)
// direction can never be anything other than "north"

// let — TypeScript infers the general type
let direction2 = "north";
// type: string (can be reassigned to any string)
direction2 = "south"; // OK

// To get literal types from let/object, use as const:
const config = {
  host: "localhost",
  port: 3000,
} as const;
// type: { readonly host: "localhost"; readonly port: 3000 }
// All values are literal types, all properties are readonly`,
        explanation: 'const infers literal types (the exact value). let infers general types (string, number, etc.). Use as const to get literal types from objects.',
      },
      {
        title: 'Contextual typing',
        code: `// TypeScript uses context to infer types in callbacks
const users = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 30 },
];

// TypeScript infers user is { name: string; age: number }
users.forEach((user) => {
  console.log(user.name.toUpperCase()); // OK — name is string
  console.log(user.age.toFixed());      // OK — age is number
});

// Filter preserves the type
const adults = users.filter((user) => user.age >= 18);
// adults is still { name: string; age: number }[]

// Event handlers get contextual types from addEventListener
window.addEventListener("keydown", (e) => {
  // e is inferred as KeyboardEvent
  console.log(e.key); // OK
});`,
        explanation: 'TypeScript uses the surrounding context (array element type, event listener type) to infer callback parameter types.',
      },
      {
        title: 'When to add explicit annotations',
        code: `// 1. Function parameters — always annotate
function greet(name: string, age: number): string {
  return \`Hi \${name}, you are \${age}\`;
}

// 2. When inference is too wide
let status: "active" | "inactive" = "active";
// Without annotation: inferred as string (too wide)
// With annotation: locked to the union type

// 3. When you want a different type than what's inferred
const list: string[] = []; // Without annotation, inferred as never[]
// TypeScript infers empty arrays as never[] — annotate to fix

// 4. Exported public APIs — make the contract explicit
export function createUser(data: CreateUserInput): Promise<User> {
  // Explicit return type makes the API contract clear
}`,
        explanation: 'Annotate parameters always, empty arrays, union types that need to be explicit, and public API surfaces. Everything else, let TypeScript infer.',
      },
    ],
    commonMistakes: [
      'Over-annotating: writing const name: string = "Alice" — the annotation is redundant and adds noise.',
      'Under-annotating: not typing function parameters — TypeScript cannot infer these.',
      'Not using as const for configuration objects that should have literal types.',
      'Assuming TypeScript infers the narrowest possible type from let — it infers the general type (string, not the literal).',
      'Ignoring inferred types — hover over variables in VS Code to see what TypeScript has inferred.',
    ],
    interviewQuestions: [
      {
        question: 'What is type inference in TypeScript?',
        answer: 'Type inference is TypeScript\'s ability to automatically determine the type of a variable or expression without an explicit annotation. TypeScript infers types from: variable assignments (const x = 5 → number), function return values (from return statements), array elements, object properties, and function parameters with defaults. This keeps code clean while maintaining type safety.',
        difficulty: 'beginner',
      },
      {
        question: 'What is the difference between how TypeScript infers types for const vs let?',
        answer: 'For const, TypeScript infers the literal type — const x = "hello" gives type "hello" (not string) because the value can never change. For let, TypeScript infers the general type — let x = "hello" gives type string because the variable can be reassigned. Use as const on objects/arrays to get literal types for all values.',
        difficulty: 'intermediate',
      },
      {
        question: 'When should you write explicit type annotations?',
        answer: 'Write annotations for: (1) Function parameters — TypeScript cannot infer these, (2) Empty arrays — let arr = [] gives never[], annotate as string[] or number[], (3) When you want a union type or more specific type than inference would give, (4) Public API surfaces of exported functions, (5) When the inferred type is too wide and you want to constrain it.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'ex-inference-1',
        title: 'Remove unnecessary annotations',
        description: 'The code below has redundant type annotations. Remove the ones TypeScript can infer, keep the ones it cannot.',
        starterCode: `const name: string = "Alice";
const scores: number[] = [95, 87, 92];
const isActive: boolean = true;

function double(n: number): number {
  return n * 2;
}

const result: number = double(5);`,
        solution: `// TypeScript infers: string, number[], boolean, return type number
const name = "Alice";
const scores = [95, 87, 92];
const isActive = true;

// Parameter types still need annotation
// But return type can be removed (inferred as number)
function double(n: number) {
  return n * 2;
}

// result is inferred as number from double's return type
const result = double(5);`,
        hints: ['Remove annotations when TypeScript can figure it out from the right side', 'Keep parameter type annotations'],
      },
    ],
    keyTakeaways: [
      'TypeScript infers types from values — you do not always need to annotate',
      'const infers literal types; let infers general types',
      'Function parameters cannot be inferred — always annotate them',
      'Empty arrays infer as never[] — annotate them explicitly',
      'Use as const for configuration objects to get literal types',
      'Contextual typing: TypeScript infers callback types from their context',
    ],
    prevLesson: 'basic-types',
    nextLesson: 'function-typing',
  },

  // ─── MODULE 5: Function Typing ───────────────────────────────────────────────
  {
    id: 'function-typing',
    slug: 'function-typing',
    title: 'Function Typing',
    description: 'Type function parameters, return values, optional and rest parameters, callbacks, and higher-order functions.',
    category: 'Type System',
    order: 5,
    difficulty: 'beginner',
    estimatedTime: 25,
    content: `You already know JavaScript functions — declarations, expressions, arrow functions, callbacks. This module covers what TypeScript adds to them. If you need to review functions, see the JavaScript track.\n\n## What TypeScript Adds to Functions\n\n1. Parameter type annotations\n2. Return type annotations\n3. Optional parameters\n4. Default parameter type inference\n5. Rest parameter types\n6. Function type signatures\n7. Callback and higher-order function types\n\n## Parameter Types\n\nThis is the most important thing TypeScript adds to functions — you must describe what each parameter expects:\n\n\`\`\`ts\n// Syntax: parameter: Type\nfunction greet(name: string, age: number): string {\n  return \`Hello \${name}, you are \${age}\`;\n}\n\ngreet("Alice", 25);  // OK\ngreet(25, "Alice");  // Error: arguments are in wrong order\ngreet("Alice");      // Error: expected 2 arguments, got 1\n\`\`\`\n\n## Return Types\n\nTypeScript can infer return types, but annotating them explicitly:\n- Makes the contract clear to callers\n- Catches bugs where you accidentally return the wrong type\n\n\`\`\`ts\nfunction divide(a: number, b: number): number {\n  if (b === 0) return "error"; // Error — must return number!\n  return a / b;\n}\n\`\`\`\n\n## Optional Parameters\n\nAdd \`?\` to make a parameter optional. It becomes \`type | undefined\`:\n\n\`\`\`ts\nfunction createUser(name: string, role?: string): void {\n  const userRole = role ?? "viewer"; // default if undefined\n  console.log(\`\${name}: \${userRole}\`);\n}\n\ncreateUser("Alice");          // OK\ncreateUser("Bob", "admin");   // OK\n\`\`\`\n\nOptional parameters must come after required ones.\n\n## Default Parameters\n\nTypeScript infers the type from the default value:\n\n\`\`\`ts\nfunction createUser(name: string, role = "viewer") {\n  // role is inferred as string (from the default "viewer")\n  // role is optional in calls — TypeScript handles it\n}\n\`\`\`\n\n## Rest Parameters\n\n\`\`\`ts\nfunction sum(...numbers: number[]): number {\n  return numbers.reduce((acc, n) => acc + n, 0);\n}\n\nsum(1, 2, 3, 4); // 10\n\`\`\`\n\n## Function Type Signatures\n\nYou can describe the shape of a function as a type:\n\n\`\`\`ts\n// Function type signature\ntype MathOperation = (a: number, b: number) => number;\n\nconst add: MathOperation = (a, b) => a + b;\nconst multiply: MathOperation = (a, b) => a * b;\n\`\`\`\n\n## Callback Types\n\nWhen a function takes a callback, you must type the callback:\n\n\`\`\`ts\nfunction fetchUser(id: number, callback: (user: User | null) => void): void {\n  // ...\n  callback(user);\n}\n\n// Using the type alias pattern:\ntype UserCallback = (user: User | null) => void;\n\nfunction fetchUser(id: number, callback: UserCallback): void {\n  // ...\n}\n\`\`\`\n\n## Higher-Order Function Types\n\nFunctions that take or return functions:\n\n\`\`\`ts\n// Function that returns a function\nfunction multiplier(factor: number): (n: number) => number {\n  return (n) => n * factor;\n}\n\nconst double = multiplier(2); // (n: number) => number\ndouble(5); // 10\n\n// Function that takes a function\nfunction applyToArray<T>(arr: T[], fn: (item: T) => T): T[] {\n  return arr.map(fn);\n}\n\`\`\`\n\n## Overloads\n\nWhen a function behaves differently based on argument types:\n\n\`\`\`ts\n// Overload signatures (no implementation)\nfunction format(value: string): string;\nfunction format(value: number): string;\nfunction format(value: Date): string;\n\n// Implementation (handles all cases)\nfunction format(value: string | number | Date): string {\n  if (typeof value === "string") return value.trim();\n  if (typeof value === "number") return value.toFixed(2);\n  return value.toISOString();\n}\n\nformat("hello ");   // OK\nformat(3.14159);    // OK\nformat(new Date()); // OK\nformat(true);       // Error — not in overloads\n\`\`\``,
    codeExamples: [
      {
        title: 'Function parameter and return types',
        code: `// Basic typed function
function calculateArea(width: number, height: number): number {
  return width * height;
}

// Arrow function with types
const getFullName = (first: string, last: string): string => {
  return \`\${first} \${last}\`;
};

// Object parameter
function createProfile(user: { name: string; age: number; email: string }): void {
  console.log(\`Creating profile for \${user.name}\`);
}

// TypeScript catches wrong argument types
calculateArea("10", 5);   // Error: Argument of type 'string' not assignable to 'number'
calculateArea(10, 5, 2);  // Error: Expected 2 arguments, but got 3`,
        explanation: 'TypeScript checks that callers pass the right types and the right number of arguments.',
      },
      {
        title: 'Optional, default, and rest parameters',
        code: `// Optional parameter with ?
function sendEmail(to: string, subject: string, body?: string): void {
  const message = body ?? "No message body";
  console.log(\`To: \${to}, Subject: \${subject}, Body: \${message}\`);
}

sendEmail("alice@example.com", "Hello");          // OK — body is optional
sendEmail("alice@example.com", "Hello", "Hi!");   // OK

// Default parameter — TypeScript infers type from default
function createSlug(text: string, separator = "-"): string {
  return text.toLowerCase().replace(/\s+/g, separator);
}

// Rest parameters — typed as array
function logMessages(level: string, ...messages: string[]): void {
  messages.forEach(msg => console.log(\`[\${level}] \${msg}\`));
}

logMessages("INFO", "Server started", "Port 3000", "Ready");`,
        explanation: 'Optional parameters use ?, defaults are inferred from the default value, rest parameters use the array type.',
      },
      {
        title: 'Callback and higher-order function types',
        code: `// Typing a callback parameter
function processItems<T>(
  items: T[],
  callback: (item: T, index: number) => void
): void {
  items.forEach((item, i) => callback(item, i));
}

processItems([1, 2, 3], (n, i) => {
  // TypeScript infers: n is number, i is number
  console.log(\`Item \${i}: \${n * 2}\`);
});

// Function returning a function
function createLogger(prefix: string): (message: string) => void {
  return (message) => console.log(\`[\${prefix}] \${message}\`);
}

const apiLogger = createLogger("API");
apiLogger("Request received"); // [API] Request received

// Type alias for reusable function types
type Validator<T> = (value: T) => boolean;

const isPositive: Validator<number> = (n) => n > 0;
const isNonEmpty: Validator<string> = (s) => s.length > 0;`,
        explanation: 'Use generic type parameters to make callback types flexible. Type aliases (Validator<T>) make reusable function types clean.',
      },
      {
        title: 'Function overloads',
        code: `// Use overloads when return type depends on input type
function parseInput(input: string): string[];
function parseInput(input: number): number;
function parseInput(input: string | number): string[] | number {
  if (typeof input === "string") {
    return input.split(",").map(s => s.trim());
  }
  return input * 2;
}

const parts = parseInput("a, b, c");  // TypeScript knows: string[]
const doubled = parseInput(5);         // TypeScript knows: number

// Real-world example: getElementById overloads in the DOM
// document.getElementById("id") returns HTMLElement | null
// This is defined with overloads in TypeScript's lib`,
        explanation: 'Overloads let you have different return types based on the input type. The implementation signature is private — callers only see the overload signatures.',
      },
    ],
    commonMistakes: [
      'Forgetting to type function parameters — TypeScript cannot infer them and will give implicit any errors with strict mode.',
      'Not handling the undefined case for optional parameters before using them.',
      'Using void as a return type when you actually return something.',
      'Typing callbacks as Function (too broad) — always type the exact signature.',
      'Over-using overloads — generics often solve the same problem more cleanly.',
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between optional parameters (?) and parameters with default values?',
        answer: 'Optional parameters (?) make the parameter type T | undefined — the caller can omit it, and inside the function you must handle the undefined case. Default parameters automatically provide a value when the caller omits the argument — inside the function, the parameter is never undefined (TypeScript narrows it to T). Default parameters are almost always better than optional parameters when you have a sensible default.',
        difficulty: 'intermediate',
      },
      {
        question: 'How do you type a function that accepts a callback?',
        answer: 'Use an inline function type: (param: Type) => ReturnType. For example: function fetchData(callback: (data: User[], error: Error | null) => void): void. You can also use type aliases to name reusable callback types: type UserCallback = (user: User | null) => void.',
        difficulty: 'intermediate',
      },
      {
        question: 'When do you use function overloads?',
        answer: 'Use overloads when a function has multiple call signatures — different input types produce different return types. For example, a parse function that returns string[] for string input and number for number input. Overloads make the TypeScript narrowing work for callers. Avoid overloads when generics can solve the problem more simply.',
        difficulty: 'advanced',
      },
    ],
    exercises: [
      {
        id: 'ex-fn-1',
        title: 'Type a higher-order function',
        description: 'Add TypeScript types to this function factory.',
        starterCode: `function createMultiplier(factor) {
  return function(value) {
    return value * factor;
  };
}

const triple = createMultiplier(3);
console.log(triple(5)); // 15`,
        solution: `function createMultiplier(factor: number): (value: number) => number {
  return function(value: number): number {
    return value * factor;
  };
}

const triple = createMultiplier(3);
console.log(triple(5)); // 15`,
        hints: ['The return type is a function: (value: number) => number'],
      },
      {
        id: 'ex-fn-2',
        title: 'Type a sorting function with callback',
        description: 'Add types to the sort function that accepts a comparator callback.',
        starterCode: `function sortBy(items, comparator) {
  return [...items].sort(comparator);
}

const users = [{ name: "Bob", age: 30 }, { name: "Alice", age: 25 }];
const sorted = sortBy(users, (a, b) => a.age - b.age);`,
        solution: `function sortBy<T>(items: T[], comparator: (a: T, b: T) => number): T[] {
  return [...items].sort(comparator);
}

const users = [{ name: "Bob", age: 30 }, { name: "Alice", age: 25 }];
const sorted = sortBy(users, (a, b) => a.age - b.age);`,
        hints: ['Use a generic T to make it work with any array type', 'Comparator returns number (negative, 0, positive)'],
      },
    ],
    keyTakeaways: [
      'Always annotate function parameters — TypeScript cannot infer them',
      'Return types can be inferred but annotating public APIs is good practice',
      'Optional parameters (?) vs defaults — prefer defaults when you have a sensible value',
      'Type callbacks as (param: Type) => ReturnType, not as Function',
      'Function overloads for different return types based on input type',
    ],
    prevLesson: 'type-inference',
    nextLesson: 'object-types',
  },

  // ─── MODULE 6: Object Types ──────────────────────────────────────────────────
  {
    id: 'object-types',
    slug: 'object-types',
    title: 'Object Types',
    description: 'Define object shapes with type annotations, optional and readonly properties, nested objects, and index signatures.',
    category: 'Type System',
    order: 6,
    difficulty: 'beginner',
    estimatedTime: 20,
    content: `You already know JavaScript objects. TypeScript adds the ability to describe an object's shape — what properties it must have, what types they must be, and which are optional or immutable.\n\n## Inline Object Types\n\nThe simplest way to type an object:\n\n\`\`\`ts\nfunction printUser(user: { name: string; age: number; email: string }): void {\n  console.log(user.name);\n}\n\`\`\`\n\nInline types work for simple cases but become messy for complex objects. Use interfaces or type aliases for reusable object types (covered in Modules 8 and 9).\n\n## Optional Properties\n\nAdd \`?\` to mark a property as optional:\n\n\`\`\`ts\ntype User = {\n  name: string;\n  email: string;\n  phone?: string;   // optional — string | undefined\n  age?: number;     // optional\n};\n\nconst user: User = { name: "Alice", email: "alice@example.com" }; // OK\n\`\`\`\n\n## Readonly Properties\n\nPrevent property mutation after creation:\n\n\`\`\`ts\ntype Config = {\n  readonly apiUrl: string;\n  readonly timeout: number;\n  retries: number;  // mutable\n};\n\nconst config: Config = {\n  apiUrl: "https://api.example.com",\n  timeout: 5000,\n  retries: 3\n};\n\nconfig.apiUrl = "other";  // Error: Cannot assign to 'apiUrl' — it is a read-only property\nconfig.retries = 5;       // OK — retries is not readonly\n\`\`\`\n\n## Nested Objects\n\nObject properties can themselves be objects:\n\n\`\`\`ts\ntype Address = {\n  street: string;\n  city: string;\n  country: string;\n};\n\ntype User = {\n  name: string;\n  address: Address;         // nested object type\n  metadata: {\n    createdAt: Date;        // or inline nested type\n    updatedAt: Date;\n  };\n};\n\`\`\`\n\n## Index Signatures\n\nWhen you don't know the property names ahead of time:\n\n\`\`\`ts\n// An object with any string keys and number values\ntype ScoreMap = {\n  [key: string]: number;\n};\n\nconst scores: ScoreMap = {\n  alice: 95,\n  bob: 87,\n  charlie: 92,\n};\n\nscores.diana = 88;  // OK — any string key\nscores.eve = "A+";  // Error — value must be number\n\`\`\`\n\n## Combining Required and Index Signatures\n\n\`\`\`ts\ntype StrictMap = {\n  required: string;        // must have this property\n  [key: string]: string;   // can have additional string properties\n};\n\`\`\`\n\n## Object Spread and Type Widening\n\n\`\`\`ts\ntype Base = { id: number; name: string };\ntype Extended = Base & { email: string; role: string };\n\nconst base: Base = { id: 1, name: "Alice" };\nconst extended: Extended = { ...base, email: "alice@example.com", role: "admin" };\n\`\`\``,
    codeExamples: [
      {
        title: 'Object types with optional and readonly properties',
        code: `type Product = {
  readonly id: string;        // Cannot be changed after creation
  name: string;               // Required, mutable
  description?: string;       // Optional
  price: number;              // Required
  readonly createdAt: Date;   // Cannot be changed
};

const product: Product = {
  id: "prod-123",
  name: "TypeScript Course",
  price: 49.99,
  createdAt: new Date(),
};

product.name = "Updated Course";  // OK
product.id = "prod-456";          // Error: readonly
product.description = "Learn TS"; // OK — optional can be set after creation

// Accessing optional properties safely
if (product.description) {
  console.log(product.description.toUpperCase()); // Safe — narrowed to string
}`,
        explanation: 'readonly prevents mutation. ? makes a property optional (string | undefined). Always check optional properties before using them.',
      },
      {
        title: 'Nested object types',
        code: `type Address = {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

type ContactInfo = {
  email: string;
  phone?: string;
};

type User = {
  id: number;
  name: string;
  address: Address;
  contact: ContactInfo;
  preferences: {
    theme: "light" | "dark";
    language: string;
    notifications: boolean;
  };
};

const user: User = {
  id: 1,
  name: "Alice",
  address: {
    street: "123 Main St",
    city: "New York",
    state: "NY",
    zip: "10001",
    country: "USA",
  },
  contact: {
    email: "alice@example.com",
  },
  preferences: {
    theme: "dark",
    language: "en",
    notifications: true,
  },
};

console.log(user.address.city);          // "New York"
console.log(user.preferences.theme);    // "dark"`,
        explanation: 'Break complex objects into named types (Address, ContactInfo) for readability and reuse.',
      },
      {
        title: 'Index signatures for dynamic objects',
        code: `// Dictionary of any string keys
type TranslationMap = {
  [key: string]: string;
};

const translations: TranslationMap = {
  hello: "Hola",
  goodbye: "Adiós",
  thanks: "Gracias",
};

// Add translations dynamically
translations.please = "Por favor"; // OK

// Index signatures with required properties
type Config = {
  version: string;                // required
  [feature: string]: string;     // additional feature flags
};

const config: Config = {
  version: "1.0.0",
  darkMode: "enabled",
  betaFeatures: "disabled",
};

// Record<K, V> is a cleaner alternative to index signatures (covered in Module 14)
type Scores = Record<string, number>;
const scores: Scores = { alice: 95, bob: 87 };`,
        explanation: 'Index signatures let you type objects with dynamic keys. Record<K, V> is a utility type that does the same thing more cleanly.',
      },
    ],
    commonMistakes: [
      'Forgetting to handle optional properties before using them — accessing user.phone.length when phone might be undefined.',
      'Using any for nested objects — define proper types for all nesting levels.',
      'Confusing readonly (TypeScript compile-time only) with Object.freeze() (runtime enforcement).',
      'Mixing required and index signatures without aligning types — all required properties must match the index signature value type.',
    ],
    interviewQuestions: [
      {
        question: 'What is a readonly property in TypeScript?',
        answer: 'readonly is a TypeScript modifier that prevents a property from being reassigned after initialization. It is checked at compile time only — at runtime, the property can still be mutated. For runtime immutability, use Object.freeze(). readonly is useful for config objects, IDs, and creation timestamps that should never change.',
        difficulty: 'beginner',
      },
      {
        question: 'What is an index signature?',
        answer: 'An index signature allows you to type objects with dynamic property names. Syntax: { [key: string]: ValueType }. It means the object can have any string keys, but all values must match the specified type. Index signatures are commonly used for dictionaries, translation maps, and configuration objects.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'ex-obj-1',
        title: 'Type a user profile object',
        description: 'Define a TypeScript type for a user profile with required, optional, and readonly fields.',
        starterCode: `// Define a UserProfile type with:
// - readonly: id (number), createdAt (Date)
// - required: username (string), email (string)
// - optional: bio (string), avatarUrl (string), website (string)

// Then create a valid user object and try to modify a readonly field

type UserProfile = {

};`,
        solution: `type UserProfile = {
  readonly id: number;
  readonly createdAt: Date;
  username: string;
  email: string;
  bio?: string;
  avatarUrl?: string;
  website?: string;
};

const profile: UserProfile = {
  id: 1,
  createdAt: new Date(),
  username: "alice",
  email: "alice@example.com",
  bio: "TypeScript developer",
};

profile.username = "alice_updated"; // OK
// profile.id = 2; // Error: Cannot assign to 'id' because it is a read-only property`,
        hints: ['readonly goes before the property name', '? goes after the property name, before the colon'],
      },
    ],
    keyTakeaways: [
      'Optional properties (?) become T | undefined — always check before using',
      'readonly prevents reassignment at compile time — not a runtime guarantee',
      'Index signatures type objects with dynamic string/number keys',
      'Nested object types can reference named types for reusability',
      'Prefer interfaces or type aliases over inline object types for reusable shapes',
    ],
    prevLesson: 'function-typing',
    nextLesson: 'arrays-and-tuples',
  },

  // ─── MODULE 7: Arrays and Tuples ────────────────────────────────────────────
  {
    id: 'arrays-and-tuples',
    slug: 'arrays-and-tuples',
    title: 'Arrays and Tuples',
    description: 'Type arrays, readonly arrays, multi-type arrays, and tuples — fixed-length arrays with specific types at each position.',
    category: 'Type System',
    order: 7,
    difficulty: 'beginner',
    estimatedTime: 20,
    content: `You already know JavaScript arrays (see the JavaScript track). TypeScript adds typed arrays and a new concept: tuples.\n\n## Typed Arrays\n\nTwo syntaxes for typed arrays — they are equivalent:\n\n\`\`\`ts\n// Syntax 1: T[]\nconst numbers: number[] = [1, 2, 3];\nconst names: string[] = ["Alice", "Bob"];\n\n// Syntax 2: Array<T>\nconst numbers: Array<number> = [1, 2, 3];\nconst names: Array<string> = ["Alice", "Bob"];\n\`\`\`\n\nPrefer \`T[]\` for simple types, \`Array<T>\` when the type is complex.\n\n## What TypeScript Adds\n\n\`\`\`ts\nconst nums: number[] = [1, 2, 3];\n\nnums.push("hello");  // Error: Argument of type 'string' is not assignable to 'number'\nnums[0] = "world";  // Error: Type 'string' is not assignable to type 'number'\n\n// TypeScript narrows array methods automatically\nconst first = nums[0];     // type: number\nconst filtered = nums.filter(n => n > 1);  // type: number[]\nconst mapped = nums.map(n => n.toString()); // type: string[]\n\`\`\`\n\n## Multi-Type Arrays (Union Arrays)\n\n\`\`\`ts\nconst mixed: (string | number)[] = [1, "hello", 2, "world"];\n\n// Each element is string | number — you must narrow before using\nmixed.forEach(item => {\n  if (typeof item === "string") {\n    console.log(item.toUpperCase());\n  } else {\n    console.log(item.toFixed(2));\n  }\n});\n\`\`\`\n\n## Readonly Arrays\n\nPrevents mutation of the array:\n\n\`\`\`ts\nconst config: readonly string[] = ["dev", "staging", "prod"];\n// Or: ReadonlyArray<string>\n\nconfig.push("local"); // Error: Property 'push' does not exist on type 'readonly string[]'\nconfig[0] = "test";  // Error: Cannot assign to '0' because it is a read-only property\n\nconst env = config[1]; // OK — reading is fine\n\`\`\`\n\n## Tuples — Fixed-Length Typed Arrays\n\nA tuple is an array with a **fixed number of elements where each position has a specific type**.\n\n\`\`\`ts\n// Tuple: [string, number]\nconst pair: [string, number] = ["Alice", 25];\n\npair[0]; // type: string\npair[1]; // type: number\npair[2]; // Error: Tuple type has no element at index 2\n\npair[0] = 42;  // Error: Type 'number' is not assignable to type 'string'\n\`\`\`\n\n**When to use tuples:**\n- Function return values with multiple parts\n- Coordinate pairs (x, y)\n- Key-value pairs\n- React's useState return: \`[state, setter]\`\n\n\`\`\`ts\n// Tuple return types\nfunction parseCoordinate(input: string): [number, number] {\n  const [x, y] = input.split(",").map(Number);\n  return [x, y];\n}\n\nconst [x, y] = parseCoordinate("10,20");\n// x: number, y: number\n\`\`\`\n\n## Named Tuple Elements\n\nFor clarity, you can name tuple positions:\n\n\`\`\`ts\ntype Point = [x: number, y: number];\ntype Range = [min: number, max: number];\ntype HttpResponse = [statusCode: number, body: string, headers: Record<string, string>];\n\`\`\`\n\n## Optional Tuple Elements\n\n\`\`\`ts\ntype Maybe<T> = [value: T, error?: string];\n// The second element is optional\n\`\`\`\n\n## Array vs Tuple Comparison\n\n| Feature | Array | Tuple |\n|---------|-------|-------|\n| Length | Variable | Fixed |\n| Element types | All same | Each position typed |\n| Use case | Lists | Fixed-structure data |\n| Syntax | \`T[]\` | \`[T1, T2, T3]\` |`,
    codeExamples: [
      {
        title: 'Typed arrays — what TypeScript prevents',
        code: `const userIds: number[] = [1, 2, 3, 4, 5];
const userNames: string[] = ["Alice", "Bob", "Charlie"];

// TypeScript prevents type mismatches:
userIds.push("six");   // Error: Argument of type 'string' not assignable to 'number'
userNames.push(42);    // Error: Argument of type 'number' not assignable to 'string'

// TypeScript knows the types of array operations:
const doubled = userIds.map(id => id * 2);
// doubled: number[] — TypeScript tracked the transformation

const upperNames = userNames.map(name => name.toUpperCase());
// upperNames: string[]

// Find returns T | undefined (because element might not exist)
const found = userIds.find(id => id === 3);
// found: number | undefined — must handle undefined case`,
        explanation: 'TypeScript prevents pushing wrong types and correctly types the results of map, filter, find, etc.',
      },
      {
        title: 'Tuples in practice',
        code: `// Database query result
type QueryResult<T> = [data: T[], count: number, error: Error | null];

function fetchUsers(): QueryResult<User> {
  return [users, users.length, null];
}

const [data, count, error] = fetchUsers();
// data: User[], count: number, error: Error | null

// React useState returns a tuple:
// const [count, setCount] = useState<number>(0);
// count: number, setCount: Dispatch<SetStateAction<number>>

// Coordinate system
type Coordinate = [lat: number, lng: number, altitude?: number];

function plotPoint(coord: Coordinate): void {
  const [lat, lng, alt = 0] = coord;
  console.log(\`\${lat}, \${lng} at \${alt}m\`);
}

plotPoint([40.7128, -74.0060]);           // OK
plotPoint([40.7128, -74.0060, 10]);       // OK with altitude
plotPoint([40.7128, -74.0060, "high"]);   // Error — altitude must be number`,
        explanation: 'Tuples are perfect for function return values that contain multiple differently-typed pieces of data.',
      },
      {
        title: 'Readonly arrays',
        code: `// Configuration that should not be mutated
const ALLOWED_ROLES: readonly string[] = ["admin", "editor", "viewer"];

function checkRole(role: string): boolean {
  return ALLOWED_ROLES.includes(role);
}

// ALLOWED_ROLES.push("superadmin"); // Error: Property 'push' does not exist

// As function parameter — tells callers you won't mutate the array
function sum(numbers: readonly number[]): number {
  return numbers.reduce((acc, n) => acc + n, 0);
}

// You can pass a regular array to a readonly param
const scores = [95, 87, 92];
sum(scores); // OK — regular number[] is compatible with readonly number[]

// As const creates deeply readonly arrays
const directions = ["north", "south", "east", "west"] as const;
// type: readonly ["north", "south", "east", "west"]
// Elements have literal types, not just string`,
        explanation: 'readonly arrays signal immutability. as const makes arrays deeply readonly with literal types.',
      },
    ],
    commonMistakes: [
      'Forgetting that array.find() returns T | undefined — always handle the undefined case.',
      'Using any[] instead of a proper union type for mixed arrays.',
      'Confusing tuples with arrays — a tuple[0] is a specific type, not "any element type".',
      'Not using as const for fixed configuration arrays — without it, types are string[] instead of literal union types.',
    ],
    interviewQuestions: [
      {
        question: 'What is a tuple in TypeScript?',
        answer: 'A tuple is a fixed-length array where each position has a specific, possibly different type. Unlike arrays (variable length, all elements same type), tuples have a fixed number of elements where position 0 might be string, position 1 might be number, etc. They are used for function return values with multiple parts, coordinate pairs, and React useState return values.',
        difficulty: 'intermediate',
      },
      {
        question: 'What is the difference between T[] and ReadonlyArray<T>?',
        answer: 'T[] (or Array<T>) is a mutable array — you can push, pop, and modify elements. ReadonlyArray<T> (or readonly T[]) prevents all mutation — push, pop, splice methods do not exist on it, and element assignment is also prevented. However, this is a compile-time only restriction. At runtime, the array is still a regular JavaScript array.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'ex-arr-1',
        title: 'Type a function returning a tuple',
        description: 'Type the minMax function to return a tuple with the minimum and maximum values.',
        starterCode: `function minMax(numbers) {
  const sorted = [...numbers].sort((a, b) => a - b);
  return [sorted[0], sorted[sorted.length - 1]];
}

const [min, max] = minMax([3, 1, 4, 1, 5, 9, 2, 6]);
console.log(min, max); // 1 9`,
        solution: `function minMax(numbers: number[]): [min: number, max: number] {
  const sorted = [...numbers].sort((a, b) => a - b);
  return [sorted[0], sorted[sorted.length - 1]];
}

const [min, max] = minMax([3, 1, 4, 1, 5, 9, 2, 6]);
console.log(min, max); // 1 9`,
        hints: ['Return type is a tuple: [number, number]', 'Use named tuple elements for clarity: [min: number, max: number]'],
        expectedOutput: '1 9',
      },
    ],
    keyTakeaways: [
      'T[] and Array<T> are equivalent — prefer T[] for simple types',
      'TypeScript knows the types of array methods (map returns T[], find returns T | undefined)',
      'Tuples: fixed-length, each position has a specific type',
      'readonly T[] prevents all mutation — push/pop/splice do not exist',
      'as const on arrays gives literal types and readonly',
    ],
    prevLesson: 'object-types',
    nextLesson: 'interfaces',
  },

  // ─── MODULE 8: Interfaces ────────────────────────────────────────────────────
  {
    id: 'interfaces',
    slug: 'interfaces',
    title: 'Interfaces',
    description: 'Define reusable object shapes with interfaces, extend them, compose them, and use them in real-world scenarios.',
    category: 'Type System',
    order: 8,
    difficulty: 'intermediate',
    estimatedTime: 30,
    content: `An interface is a **named contract that describes the shape of an object**. It is one of TypeScript's most important features for building structured, maintainable code.\n\n## What is an Interface\n\nAn interface answers the question: "What must this object look like?"\n\n\`\`\`ts\ninterface User {\n  id: number;\n  name: string;\n  email: string;\n}\n\nfunction greetUser(user: User): string {\n  return \`Hello, \${user.name}!\`;\n}\n\ngreetUser({ id: 1, name: "Alice", email: "alice@example.com" }); // OK\ngreetUser({ id: 1, name: "Alice" }); // Error: missing email\ngreetUser({ id: 1, name: "Alice", email: "...", extra: true }); // Error: extra field\n\`\`\`\n\n## Why Interfaces Exist\n\n**Problem without interfaces:**\n\`\`\`ts\nfunction createAccount(name: string, email: string, role: string, plan: string) {\n  // 4 string parameters — easy to mix up the order\n}\n\ncreateAccount("admin", "Alice", "alice@example.com", "pro"); // Order matters!\n\`\`\`\n\n**With interfaces:**\n\`\`\`ts\ninterface CreateAccountInput {\n  name: string;\n  email: string;\n  role: string;\n  plan: string;\n}\n\nfunction createAccount(input: CreateAccountInput) {\n  // Now the caller must name every field — order does not matter\n}\n\ncreateAccount({ name: "Alice", email: "alice@example.com", role: "admin", plan: "pro" });\n\`\`\`\n\n## Optional and Readonly in Interfaces\n\n\`\`\`ts\ninterface UserProfile {\n  readonly id: number;    // Cannot change after creation\n  name: string;           // Required, mutable\n  bio?: string;           // Optional\n  avatar?: string;        // Optional\n}\n\`\`\`\n\n## Extending Interfaces\n\nInterfaces can extend other interfaces — inheriting all their properties:\n\n\`\`\`ts\ninterface Animal {\n  name: string;\n  age: number;\n}\n\ninterface Dog extends Animal {\n  breed: string;\n  isGoodBoy: boolean;\n}\n\n// Dog has: name, age (from Animal) + breed, isGoodBoy\nconst rex: Dog = {\n  name: "Rex",\n  age: 3,\n  breed: "German Shepherd",\n  isGoodBoy: true,\n};\n\`\`\`\n\n## Extending Multiple Interfaces\n\n\`\`\`ts\ninterface Timestamped {\n  createdAt: Date;\n  updatedAt: Date;\n}\n\ninterface Auditable {\n  createdBy: string;\n  updatedBy: string;\n}\n\ninterface Post extends Timestamped, Auditable {\n  id: number;\n  title: string;\n  body: string;\n}\n\`\`\`\n\n## Interface Merging (Declaration Merging)\n\nUnique to interfaces: you can declare the same interface multiple times and TypeScript merges them:\n\n\`\`\`ts\ninterface Window {\n  myCustomProperty: string;\n}\n\n// Now TypeScript knows Window has myCustomProperty\n// This is how @types/node adds types to global objects\n\`\`\`\n\nThis is called **declaration merging** — it is why many library type definitions use interfaces instead of type aliases.\n\n## Interface vs Type Alias\n\nBoth can describe object shapes. The differences are subtle:\n\n| Feature | interface | type alias |\n|---------|-----------|------------|\n| Extend | \`extends\` | \`&\` (intersection) |\n| Declaration merging | Yes | No |\n| Union types | No | Yes |\n| Computed properties | No | Yes |\n| Error messages | Shows name | Sometimes shows inline |\n\n**Rule of thumb:** Use \`interface\` for object shapes that will be extended or implemented by classes. Use \`type\` for unions, primitives, and complex compositions. Both work — be consistent.\n\n## Interfaces with Methods\n\n\`\`\`ts\ninterface Repository<T> {\n  findById(id: number): Promise<T | null>;\n  findAll(): Promise<T[]>;\n  create(data: Partial<T>): Promise<T>;\n  update(id: number, data: Partial<T>): Promise<T>;\n  delete(id: number): Promise<void>;\n}\n\n// A class implementing this interface must provide all these methods\nclass UserRepository implements Repository<User> {\n  async findById(id: number): Promise<User | null> { /* ... */ }\n  async findAll(): Promise<User[]> { /* ... */ }\n  async create(data: Partial<User>): Promise<User> { /* ... */ }\n  async update(id: number, data: Partial<User>): Promise<User> { /* ... */ }\n  async delete(id: number): Promise<void> { /* ... */ }\n}\n\`\`\`\n\n## Interface Composition — Real World Pattern\n\n\`\`\`ts\n// Base entity — all database records have these\ninterface BaseEntity {\n  readonly id: string;\n  readonly createdAt: Date;\n  updatedAt: Date;\n}\n\n// Domain entity\ninterface User extends BaseEntity {\n  email: string;\n  name: string;\n  role: UserRole;\n}\n\n// Data Transfer Object (what the API returns)\ninterface UserDTO extends Omit<User, 'role'> {\n  roleLabel: string; // Transformed for display\n}\n\n// Create input — what the client sends\ninterface CreateUserInput {\n  email: string;\n  name: string;\n  password: string;\n}\n\`\`\``,
    codeExamples: [
      {
        title: 'Defining and using interfaces',
        code: `interface Product {
  readonly id: string;
  name: string;
  price: number;
  description?: string;
  category: string;
  inStock: boolean;
}

// Function accepting the interface
function formatProductCard(product: Product): string {
  const stockStatus = product.inStock ? "In Stock" : "Out of Stock";
  const desc = product.description ?? "No description available";
  return \`\${product.name} — $\${product.price} | \${stockStatus}\n\${desc}\`;
}

const laptop: Product = {
  id: "prod-001",
  name: "MacBook Pro",
  price: 1999,
  category: "Electronics",
  inStock: true,
  description: "Powerful laptop for developers",
};

console.log(formatProductCard(laptop));`,
        explanation: 'The interface defines the exact shape. TypeScript verifies every usage — missing fields, wrong types, and extra fields all produce errors.',
      },
      {
        title: 'Extending interfaces — building a type hierarchy',
        code: `// Base interface for all database entities
interface BaseEntity {
  readonly id: string;
  readonly createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

// User extends BaseEntity
interface User extends BaseEntity {
  email: string;
  name: string;
  passwordHash: string;
}

// Admin extends User with extra permissions
interface Admin extends User {
  permissions: string[];
  department: string;
  canDeleteUsers: boolean;
}

// Admin has ALL fields from BaseEntity + User + its own
const admin: Admin = {
  id: "usr-001",
  createdAt: new Date(),
  updatedAt: new Date(),
  isDeleted: false,
  email: "admin@company.com",
  name: "Super Admin",
  passwordHash: "...",
  permissions: ["read", "write", "delete"],
  department: "Engineering",
  canDeleteUsers: true,
};`,
        explanation: 'Extending interfaces builds type hierarchies. Admin includes all fields from BaseEntity and User through inheritance.',
      },
      {
        title: 'Interface for class contracts',
        code: `interface EmailService {
  sendEmail(to: string, subject: string, body: string): Promise<void>;
  sendBulkEmail(recipients: string[], subject: string, body: string): Promise<void>;
}

interface StorageService {
  upload(file: Buffer, path: string): Promise<string>;
  download(path: string): Promise<Buffer>;
  delete(path: string): Promise<void>;
}

// Classes must implement all interface methods
class SendGridEmailService implements EmailService {
  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    // SendGrid-specific implementation
    console.log(\`Sending via SendGrid to \${to}\`);
  }

  async sendBulkEmail(recipients: string[], subject: string, body: string): Promise<void> {
    await Promise.all(recipients.map(r => this.sendEmail(r, subject, body)));
  }
}

// Using the interface as the type — not the class
function notifyUser(service: EmailService, userId: string): void {
  service.sendEmail(\`\${userId}@example.com\`, "Notification", "You have a message");
  // This function works with ANY EmailService implementation
}`,
        explanation: 'Interfaces as class contracts enable dependency injection and testability. You can swap implementations (SendGrid vs Mailgun) without changing callers.',
      },
      {
        title: 'Declaration merging — extending global types',
        code: `// Extending the Express Request type (common pattern)
// In types/express.d.ts:
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;      // Added by auth middleware
      requestId: string;    // Added by request ID middleware
    }
  }
}

// Now in your route handlers:
app.get("/profile", (req: Request, res: Response) => {
  // TypeScript knows req.user exists (from our merged interface)
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  res.json(req.user);
});

// Extending Window for browser globals
declare global {
  interface Window {
    analytics: Analytics;
    featureFlags: Record<string, boolean>;
  }
}

window.analytics.track("page_view"); // TypeScript knows analytics exists`,
        explanation: 'Declaration merging is how you add types to global objects. This is essential for Express middleware that adds properties to req.',
      },
    ],
    commonMistakes: [
      'Using an interface when you need a union type — interfaces cannot express unions, use type aliases.',
      'Implementing interfaces on classes manually — TypeScript will tell you what is missing with "implements".',
      'Defining the same data shape in multiple interfaces instead of extending a base interface.',
      'Forgetting that interfaces are erased at runtime — they exist only for type checking.',
      'Creating deeply nested interfaces instead of composing smaller ones.',
    ],
    interviewQuestions: [
      {
        question: 'What is an interface in TypeScript?',
        answer: 'An interface is a named type that defines the shape of an object — what properties it must have, their types, and whether they are optional or readonly. Interfaces serve as contracts: any object assigned to an interface type must have exactly those properties with those types. Classes can implement interfaces to ensure they provide all required methods.',
        difficulty: 'beginner',
      },
      {
        question: 'What is declaration merging?',
        answer: 'Declaration merging is a TypeScript feature where multiple interface declarations with the same name are merged into a single interface. This is unique to interfaces (not type aliases). It is commonly used to extend global types like Window, Express.Request, or Node.js modules with additional properties.',
        difficulty: 'advanced',
      },
      {
        question: 'When would you use interface vs type alias?',
        answer: 'Use interface when: defining object shapes that will be extended via extends, when classes will implement it, or when you need declaration merging. Use type alias when: defining union types (string | number), intersection types, primitive aliases, or complex mapped/conditional types. In practice, for simple object shapes, both work identically — choose one style and be consistent.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'ex-interface-1',
        title: 'Design an interface hierarchy',
        description: 'Design interfaces for a blog system: BaseEntity, Post, Comment, and Author.',
        starterCode: `// Design these interfaces:
// BaseEntity: id (string, readonly), createdAt (Date, readonly), updatedAt (Date)
// Author: extends BaseEntity, username (string), email (string), bio? (string)
// Post: extends BaseEntity, title (string), content (string), author (Author), tags (string[]), published (boolean)
// Comment: extends BaseEntity, content (string), author (Author), postId (string)

interface BaseEntity {}
interface Author {}
interface Post {}
interface Comment {}`,
        solution: `interface BaseEntity {
  readonly id: string;
  readonly createdAt: Date;
  updatedAt: Date;
}

interface Author extends BaseEntity {
  username: string;
  email: string;
  bio?: string;
}

interface Post extends BaseEntity {
  title: string;
  content: string;
  author: Author;
  tags: string[];
  published: boolean;
}

interface Comment extends BaseEntity {
  content: string;
  author: Author;
  postId: string;
}

const post: Post = {
  id: "post-1",
  createdAt: new Date(),
  updatedAt: new Date(),
  title: "TypeScript is Great",
  content: "Here is why...",
  author: {
    id: "user-1",
    createdAt: new Date(),
    updatedAt: new Date(),
    username: "alice",
    email: "alice@example.com",
  },
  tags: ["typescript", "programming"],
  published: true,
};`,
        hints: ['Use extends to inherit from BaseEntity', 'Author appears in both Post and Comment'],
      },
    ],
    keyTakeaways: [
      'Interfaces describe the shape of objects — what fields must exist and their types',
      'Extend interfaces with extends to build type hierarchies',
      'Declaration merging: multiple same-name interfaces merge — unique to interfaces',
      'Classes use implements to confirm they satisfy an interface',
      'Use interface for object shapes; use type for unions, intersections, and utilities',
    ],
    prevLesson: 'arrays-and-tuples',
    nextLesson: 'type-aliases',
  },

  // ─── MODULE 9: Type Aliases ──────────────────────────────────────────────────
  {
    id: 'type-aliases',
    slug: 'type-aliases',
    title: 'Type Aliases',
    description: 'Create named types with type aliases, compose complex types, and understand when to use type vs interface.',
    category: 'Type System',
    order: 9,
    difficulty: 'intermediate',
    estimatedTime: 20,
    content: `A **type alias** creates a new name for any type — not just objects, but primitives, unions, tuples, functions, and more. It is the \`type\` keyword.\n\n## What is a Type Alias\n\n\`\`\`ts\n// Give a name to any type\ntype UserId = string;\ntype Score = number;\ntype IsActive = boolean;\n\n// Now use the alias\nfunction getUser(id: UserId): void { /* ... */ }\n\`\`\`\n\nType aliases are purely a TypeScript concept — they are erased at runtime. They exist only to make code more readable and maintainable.\n\n## Type Aliases for Object Types\n\n\`\`\`ts\ntype User = {\n  id: number;\n  name: string;\n  email: string;\n};\n\n// Same as interface — for simple objects, they are interchangeable\n\`\`\`\n\n## Type Aliases for Unions (Most Common Use)\n\n\`\`\`ts\ntype Status = "pending" | "active" | "suspended" | "deleted";\ntype ID = string | number;\ntype StringOrNumber = string | number;\n\nfunction setStatus(status: Status): void {\n  // TypeScript ensures status is one of the 4 valid values\n}\n\nsetStatus("active");    // OK\nsetStatus("unknown");   // Error: not in the union\n\`\`\`\n\n## Type Aliases for Functions\n\n\`\`\`ts\ntype Handler = (event: MouseEvent) => void;\ntype Comparator<T> = (a: T, b: T) => number;\ntype AsyncFn<T> = () => Promise<T>;\n\nconst clickHandler: Handler = (e) => console.log(e.clientX);\n\`\`\`\n\n## Type Composition with &\n\nUse \`&\` (intersection) to combine type aliases:\n\n\`\`\`ts\ntype Timestamped = {\n  createdAt: Date;\n  updatedAt: Date;\n};\n\ntype WithId = {\n  id: string;\n};\n\ntype User = WithId & Timestamped & {\n  name: string;\n  email: string;\n};\n// User has: id, createdAt, updatedAt, name, email\n\`\`\`\n\n## Recursive Type Aliases\n\n\`\`\`ts\n// A JSON value can be: primitive, array of JSON, or object with JSON values\ntype JSONValue =\n  | string\n  | number\n  | boolean\n  | null\n  | JSONValue[]\n  | { [key: string]: JSONValue };\n\n// A tree node that references itself\ntype TreeNode = {\n  value: number;\n  left?: TreeNode;\n  right?: TreeNode;\n};\n\`\`\`\n\n## Type vs Interface — Complete Comparison\n\n| Capability | type | interface |\n|-----------|------|----------|\n| Object shapes | ✅ | ✅ |\n| Union types | ✅ | ❌ |\n| Intersection (\`&\`) | ✅ | ✅ (via \`extends\`) |\n| Primitive aliases | ✅ | ❌ |\n| Function types | ✅ | ✅ |\n| Tuple types | ✅ | ❌ |\n| Declaration merging | ❌ | ✅ |\n| Class \`implements\` | ✅ | ✅ |\n| Computed properties | ✅ | ❌ |\n| Conditional types | ✅ | ❌ |\n\n**When to use type:**\n- Union types: \`type Status = "active" | "inactive"\`\n- Primitive aliases: \`type ID = string\`\n- Function types: \`type Handler = (e: Event) => void\`\n- Complex compositions with conditional/mapped types\n- Tuples\n\n**When to use interface:**\n- Object shapes that classes will implement\n- Objects that will be extended with \`extends\`\n- When you need declaration merging\n\n**For simple objects:** choose one and be consistent. Most teams use \`interface\` for objects and \`type\` for everything else.`,
    codeExamples: [
      {
        title: 'Type aliases for primitive names and unions',
        code: `// Domain-specific aliases make code self-documenting
type UserId = string;
type PostId = string;
type Email = string;
type Timestamp = number; // Unix timestamp

// Union types — the most common use of type aliases
type UserRole = "admin" | "editor" | "viewer" | "guest";
type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
type Theme = "light" | "dark" | "system";

// These aliases prevent mixing up parameters
function getPost(userId: UserId, postId: PostId): Promise<Post> {
  // Even though both are string, the alias names the intent
  return fetch(\`/api/users/\${userId}/posts/\${postId}\`).then(r => r.json());
}

// Status machines
type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

function canCancel(status: OrderStatus): boolean {
  return status === "pending" || status === "confirmed";
}

canCancel("unknown"); // Error: not a valid OrderStatus`,
        explanation: 'Type aliases for primitive domains (UserId, Email) and unions (UserRole, OrderStatus) make code self-documenting and prevent errors.',
      },
      {
        title: 'Type composition with intersections',
        code: `// Reusable building blocks
type WithId = { readonly id: string };
type WithTimestamps = { createdAt: Date; updatedAt: Date };
type SoftDeletable = { deletedAt: Date | null };

// Compose them into domain types
type User = WithId & WithTimestamps & {
  name: string;
  email: string;
  role: "admin" | "user";
};

type Post = WithId & WithTimestamps & SoftDeletable & {
  title: string;
  content: string;
  authorId: string;
  published: boolean;
};

// Both User and Post share the same id/timestamps shape
// Changes to WithTimestamps apply everywhere automatically`,
        explanation: 'Composition with & builds complex types from smaller reusable pieces. This mirrors how you compose objects in JavaScript.',
      },
      {
        title: 'Recursive types and complex aliases',
        code: `// Recursive type — a category can have subcategories
type Category = {
  id: string;
  name: string;
  parent?: Category; // References itself
  children: Category[];
};

// A fully flexible JSON type
type JSONPrimitive = string | number | boolean | null;
type JSONObject = { [key: string]: JSONValue };
type JSONArray = JSONValue[];
type JSONValue = JSONPrimitive | JSONObject | JSONArray;

// Deep readonly — makes every nested property readonly
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

type ReadonlyUser = DeepReadonly<User>;
// Every field and nested field is readonly`,
        explanation: 'Type aliases support recursion. DeepReadonly is a real-world utility pattern — it makes the entire object tree immutable.',
      },
    ],
    commonMistakes: [
      'Using type for everything when interface would be more appropriate for objects.',
      'Creating type aliases that are just noise: type Name = string — only useful if the domain meaning adds clarity.',
      'Forgetting that type aliases are erased — you cannot use them at runtime for instanceof checks.',
      'Confusing intersection (&) with union (|) — & means "has all properties of both", | means "is one of these types".',
    ],
    interviewQuestions: [
      {
        question: 'What is a type alias in TypeScript?',
        answer: 'A type alias creates a new name for any TypeScript type using the type keyword. Unlike interface, it can alias primitives, unions, intersections, tuples, function types, and conditional types — not just objects. Type aliases are erased at runtime — they exist only for compile-time type checking.',
        difficulty: 'beginner',
      },
      {
        question: 'What is the practical difference between type and interface?',
        answer: 'Both can define object shapes. Key differences: (1) Only type can define unions (string | number) and primitive aliases. (2) Only interface supports declaration merging. (3) interface uses extends for composition; type uses & (intersection). (4) In complex mapped/conditional type scenarios, type is required. For object shapes, they are largely interchangeable — most teams use interface for objects and type for everything else.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'ex-type-1',
        title: 'Build a type system for an e-commerce order',
        description: 'Create type aliases for an order system using unions and intersections.',
        starterCode: `// Create these types:
// OrderStatus: union of "pending" | "processing" | "shipped" | "delivered" | "cancelled"
// PaymentMethod: union of "credit_card" | "paypal" | "crypto" | "bank_transfer"
// Money: object with amount (number) and currency (string)
// OrderItem: product id (string), name (string), quantity (number), unitPrice (Money)
// Order: id (string), status (OrderStatus), items (OrderItem[]), payment (PaymentMethod), total (Money)`,
        solution: `type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";
type PaymentMethod = "credit_card" | "paypal" | "crypto" | "bank_transfer";

type Money = {
  amount: number;
  currency: string;
};

type OrderItem = {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: Money;
};

type Order = {
  id: string;
  status: OrderStatus;
  items: OrderItem[];
  paymentMethod: PaymentMethod;
  total: Money;
  createdAt: Date;
};

const order: Order = {
  id: "ord-001",
  status: "pending",
  items: [{ productId: "p1", name: "Book", quantity: 2, unitPrice: { amount: 15, currency: "USD" } }],
  paymentMethod: "credit_card",
  total: { amount: 30, currency: "USD" },
  createdAt: new Date(),
};`,
        hints: ['Type aliases are declared with the type keyword', 'String literal unions use |', 'Nested types can reference other type aliases'],
      },
    ],
    keyTakeaways: [
      'type creates a named alias for any TypeScript type — not just objects',
      'Most powerful use: union types (type Status = "active" | "inactive")',
      'Composition with & (intersection) builds complex types from smaller pieces',
      'Recursive types are possible (TreeNode, JSONValue)',
      'Use type for unions/primitives/functions, interface for extendable objects',
    ],
    prevLesson: 'interfaces',
    nextLesson: 'unions-and-intersections',
  },

  // ─── MODULE 10: Unions and Intersections ────────────────────────────────────
  {
    id: 'unions-and-intersections',
    slug: 'unions-and-intersections',
    title: 'Unions, Intersections, and Type Narrowing',
    description: 'Combine types with | and &, narrow types with guards, and write safe code for values with multiple possible types.',
    category: 'Type System',
    order: 10,
    difficulty: 'intermediate',
    estimatedTime: 30,
    content: `## Union Types (|)\n\nA union type means a value can be **one of several types**:\n\n\`\`\`ts\nlet id: string | number = "user-1"; // can be string\nid = 42;                             // or number\n\ntype Result = "success" | "error" | "loading";\n\`\`\`\n\n## Intersection Types (&)\n\nAn intersection type means a value must **satisfy all combined types simultaneously**:\n\n\`\`\`ts\ntype Admin = User & {\n  permissions: string[];\n  department: string;\n};\n// Admin must have all User properties AND permissions AND department\n\`\`\`\n\n## Narrowing — The Key Concept\n\nWhen you have a union type, TypeScript requires you to **narrow** it before using type-specific methods:\n\n\`\`\`ts\nfunction format(value: string | number): string {\n  // Here, value is string | number — you cannot call string methods directly\n  return value.toUpperCase(); // Error: 'toUpperCase' does not exist on 'number'\n}\n\`\`\`\n\nYou must narrow the type first:\n\n\`\`\`ts\nfunction format(value: string | number): string {\n  if (typeof value === "string") {\n    return value.toUpperCase(); // TypeScript knows: string here\n  }\n  return value.toFixed(2); // TypeScript knows: number here\n}\n\`\`\`\n\n## Type Guards\n\nType guards are expressions that narrow the type. TypeScript understands several patterns:\n\n**1. typeof guard:**\n\`\`\`ts\nif (typeof value === "string") { /* value is string */ }\nif (typeof value === "number") { /* value is number */ }\nif (typeof value === "boolean") { /* value is boolean */ }\n\`\`\`\n\n**2. instanceof guard:**\n\`\`\`ts\nif (error instanceof Error) {\n  console.log(error.message); // error is Error\n}\nif (animal instanceof Dog) {\n  animal.bark(); // animal is Dog\n}\n\`\`\`\n\n**3. in operator guard:**\n\`\`\`ts\nif ("email" in user) {\n  console.log(user.email); // user has email property\n}\n\`\`\`\n\n**4. Equality narrowing:**\n\`\`\`ts\nfunction processStatus(status: "active" | "inactive"): void {\n  if (status === "active") {\n    // TypeScript knows status is "active" here\n  }\n}\n\`\`\`\n\n**5. Custom type guard functions:**\n\`\`\`ts\nfunction isUser(value: unknown): value is User {\n  return (\n    typeof value === "object" &&\n    value !== null &&\n    "id" in value &&\n    "name" in value\n  );\n}\n\nif (isUser(data)) {\n  console.log(data.name); // TypeScript knows data is User\n}\n\`\`\`\n\n## Discriminated Unions — Most Important Pattern\n\nA discriminated union is a union where each member has a **common literal field** (the discriminant) that identifies which variant it is:\n\n\`\`\`ts\ntype Circle = { kind: "circle"; radius: number };\ntype Square = { kind: "square"; side: number };\ntype Triangle = { kind: "triangle"; base: number; height: number };\n\ntype Shape = Circle | Square | Triangle;\n\nfunction area(shape: Shape): number {\n  switch (shape.kind) {\n    case "circle":   return Math.PI * shape.radius ** 2;\n    case "square":   return shape.side ** 2;\n    case "triangle": return 0.5 * shape.base * shape.height;\n    default:\n      const _exhaustive: never = shape; // exhaustive check\n      throw new Error("Unknown shape");\n  }\n}\n\`\`\`\n\nThe \`kind\` field is the discriminant — TypeScript uses it to know which variant you're in.\n\n## Real-World: API Response Pattern\n\n\`\`\`ts\ntype ApiSuccess<T> = { status: "success"; data: T };\ntype ApiError = { status: "error"; message: string; code: number };\ntype ApiResponse<T> = ApiSuccess<T> | ApiError;\n\nfunction handleResponse<T>(response: ApiResponse<T>): T | null {\n  if (response.status === "success") {\n    return response.data; // TypeScript knows: ApiSuccess<T>\n  }\n  console.error(response.message); // TypeScript knows: ApiError\n  return null;\n}\n\`\`\``,
    codeExamples: [
      {
        title: 'Union types and type narrowing',
        code: `// Union type — value can be string OR number
function printId(id: string | number): void {
  if (typeof id === "string") {
    // TypeScript narrows: id is string here
    console.log("String ID:", id.toUpperCase());
  } else {
    // TypeScript narrows: id is number here
    console.log("Numeric ID:", id.toFixed(0));
  }
}

// Nullable types — very common pattern
function getUsername(user: { name: string } | null): string {
  if (user === null) {
    return "Anonymous";
  }
  return user.name; // TypeScript knows user is not null here
}

// Optional chaining for nullable values
const name = user?.name ?? "Anonymous";`,
        explanation: 'typeof and equality checks narrow union types. TypeScript tracks the type in each branch.',
      },
      {
        title: 'Discriminated unions — the most powerful pattern',
        code: `// Each variant has a unique "kind" (or "type") literal field
type LoadingState = { status: "loading" };
type SuccessState<T> = { status: "success"; data: T };
type ErrorState = { status: "error"; message: string };

type AsyncState<T> = LoadingState | SuccessState<T> | ErrorState;

function renderState<T>(state: AsyncState<T>): string {
  switch (state.status) {
    case "loading":
      return "Loading...";
    case "success":
      // TypeScript knows state.data exists here
      return JSON.stringify(state.data);
    case "error":
      // TypeScript knows state.message exists here
      return \`Error: \${state.message}\`;
  }
}

// Redux action pattern (discriminated union)
type Action =
  | { type: "INCREMENT"; payload: number }
  | { type: "DECREMENT"; payload: number }
  | { type: "RESET" };

function reducer(state: number, action: Action): number {
  switch (action.type) {
    case "INCREMENT": return state + action.payload; // TypeScript knows payload exists
    case "DECREMENT": return state - action.payload;
    case "RESET":     return 0;
  }
}`,
        explanation: 'Discriminated unions with a shared literal field are the standard pattern for state machines, Redux actions, and API responses.',
      },
      {
        title: 'Custom type guard functions',
        code: `// Type guard for validating external data
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isUser(value: unknown): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as any).id === "number" &&
    typeof (value as any).name === "string" &&
    typeof (value as any).email === "string"
  );
}

// Using type guards with API responses
async function fetchUser(id: number): Promise<User> {
  const response = await fetch(\`/api/users/\${id}\`);
  const data: unknown = await response.json();

  if (!isUser(data)) {
    throw new Error("Invalid user data from API");
  }

  return data; // TypeScript knows: data is User here
}

// Assertion function (alternative to type guard)
function assertIsUser(value: unknown): asserts value is User {
  if (!isUser(value)) {
    throw new Error("Expected a User");
  }
}`,
        explanation: 'Custom type guards (value is Type) and assertion functions (asserts value is Type) validate external data and teach TypeScript the result.',
      },
      {
        title: 'Intersection types — combining shapes',
        code: `type Serializable = {
  serialize(): string;
  deserialize(data: string): void;
};

type Loggable = {
  log(level: "info" | "warn" | "error"): void;
};

// Intersection: must satisfy both types
type DataManager = Serializable & Loggable;

class UserManager implements DataManager {
  serialize(): string { return JSON.stringify(this); }
  deserialize(data: string): void { Object.assign(this, JSON.parse(data)); }
  log(level: "info" | "warn" | "error"): void {
    console[level]("UserManager:", this);
  }
}

// Merging object literals with intersection
type WithTimestamps = { createdAt: Date; updatedAt: Date };
type UserWithTimestamps = User & WithTimestamps;`,
        explanation: 'Intersection types combine multiple types into one that must satisfy all of them. Used for mixins and composition.',
      },
    ],
    commonMistakes: [
      'Forgetting to narrow union types before using type-specific methods.',
      'Using typeof for object discrimination — typeof {} === "object" for all objects including null.',
      'Not using discriminated unions when working with variant data — they make narrowing cleaner than multiple typeof checks.',
      'Confusing & (intersection — has all) with | (union — is one of).',
    ],
    interviewQuestions: [
      {
        question: 'What is type narrowing in TypeScript?',
        answer: 'Type narrowing is the process of reducing a wide type to a more specific type within a code block. TypeScript tracks type narrowing through: typeof checks, instanceof checks, equality checks (=== and !==), the in operator, custom type guard functions (returning value is Type), and control flow analysis. After a narrowing check, TypeScript uses the narrower type in that branch.',
        difficulty: 'intermediate',
      },
      {
        question: 'What is a discriminated union and why is it useful?',
        answer: 'A discriminated union is a union type where each member has a shared literal property (the discriminant) that uniquely identifies that variant. Example: type Shape = { kind: "circle"; radius: number } | { kind: "square"; side: number }. The kind field discriminates between variants. TypeScript can use this to narrow the type in switch/if statements, enabling exhaustive checking with never. This pattern is used for Redux actions, state machines, and API responses.',
        difficulty: 'advanced',
      },
      {
        question: 'What is a custom type guard?',
        answer: 'A custom type guard is a function with a return type of "value is Type" — this is a type predicate. When the function returns true, TypeScript narrows the argument to that Type in the calling code. Used to validate data from external sources (APIs, JSON) and teach TypeScript about the result of runtime checks.',
        difficulty: 'advanced',
      },
    ],
    exercises: [
      {
        id: 'ex-union-1',
        title: 'Model a payment system with discriminated unions',
        description: 'Create a discriminated union for payment methods and a function that processes each one.',
        starterCode: `// Create a discriminated union for these payment methods:
// - CreditCard: type="credit_card", cardNumber, expiry, cvv
// - PayPal: type="paypal", email
// - BankTransfer: type="bank_transfer", accountNumber, routingNumber
// Then write a processPayment function that handles each case

type Payment = // your types here

function processPayment(payment: Payment, amount: number): string {
  // handle each payment type
}`,
        solution: `type CreditCardPayment = {
  type: "credit_card";
  cardNumber: string;
  expiry: string;
  cvv: string;
};

type PayPalPayment = {
  type: "paypal";
  email: string;
};

type BankTransferPayment = {
  type: "bank_transfer";
  accountNumber: string;
  routingNumber: string;
};

type Payment = CreditCardPayment | PayPalPayment | BankTransferPayment;

function processPayment(payment: Payment, amount: number): string {
  switch (payment.type) {
    case "credit_card":
      return \`Charging $\${amount} to card ending in \${payment.cardNumber.slice(-4)}\`;
    case "paypal":
      return \`Sending $\${amount} via PayPal to \${payment.email}\`;
    case "bank_transfer":
      return \`Transferring $\${amount} to account \${payment.accountNumber}\`;
  }
}`,
        hints: ['Each payment type needs a unique "type" literal field', 'Use switch on the type field to discriminate'],
      },
    ],
    keyTakeaways: [
      'Union (|): value is one of the types — must narrow before using type-specific features',
      'Intersection (&): value must satisfy all types simultaneously',
      'Narrowing: typeof, instanceof, in, equality, and custom type guards',
      'Discriminated unions: shared literal field enables clean switch-based narrowing',
      'Custom type guards: function returning "value is Type" validates runtime data',
    ],
    prevLesson: 'type-aliases',
    nextLesson: 'enums',
  },

  // ─── MODULE 11: Enums ───────────────────────────────────────────────────────
  {
    id: 'enums',
    slug: 'enums',
    title: 'Enums',
    description: 'Understand TypeScript enums — numeric, string, and const enums — when to use them and when to use alternatives.',
    category: 'Type System',
    order: 11,
    difficulty: 'intermediate',
    estimatedTime: 20,
    content: `An **enum** (enumeration) is a way to define a set of named constants. Unlike union types (which are erased at runtime), enums compile to actual JavaScript objects.\n\n## What is an Enum\n\n\`\`\`ts\nenum Direction {\n  Up,\n  Down,\n  Left,\n  Right,\n}\n\nconst move = Direction.Up;\nconsole.log(move); // 0\n\`\`\`\n\nBy default, enum members get numeric values starting from 0.\n\n## Numeric Enums\n\n\`\`\`ts\nenum StatusCode {\n  OK = 200,\n  Created = 201,\n  BadRequest = 400,\n  Unauthorized = 401,\n  NotFound = 404,\n  ServerError = 500,\n}\n\nfunction handleResponse(code: StatusCode): void {\n  if (code === StatusCode.OK) {\n    console.log("Success!");\n  } else if (code === StatusCode.NotFound) {\n    console.log("Not found");\n  }\n}\n\`\`\`\n\nNumeric enums also support **reverse mapping** — you can look up the name from the value:\n\n\`\`\`ts\nconsole.log(StatusCode[200]); // "OK"\nconsole.log(StatusCode.OK);   // 200\n\`\`\`\n\n## String Enums\n\n\`\`\`ts\nenum UserRole {\n  Admin = "ADMIN",\n  Editor = "EDITOR",\n  Viewer = "VIEWER",\n}\n\nconst role = UserRole.Admin;\nconsole.log(role); // "ADMIN"\n\`\`\`\n\nString enums are **more readable** in logs and debugging. No reverse mapping, but the values are self-documenting.\n\n## Const Enums\n\n\`\`\`ts\nconst enum Direction {\n  Up = "UP",\n  Down = "DOWN",\n}\n\nconst dir = Direction.Up;\n// Compiled output: const dir = "UP";\n// The enum is completely inlined — no runtime object\n\`\`\`\n\n\`const enum\` is inlined at compile time. The enum object does not exist at runtime — this is more efficient but means you cannot iterate over the values.\n\n## When to Use Enums\n\n**Good use cases:**\n- HTTP status codes with meaningful names\n- User roles that are checked frequently\n- Direction/state constants that need to be logged clearly\n- When you need the runtime object for iteration\n\n**When NOT to use enums:**\n- When a string union type would be simpler\n- When you only need compile-time safety (use union types)\n- When you are building a library (enums add runtime overhead)\n\n## Enums vs Union Types — The Key Comparison\n\n\`\`\`ts\n// Enum approach\nenum Status { Active = "ACTIVE", Inactive = "INACTIVE" }\nconst s: Status = Status.Active;\n\n// Union type approach (often preferred)\ntype Status = "ACTIVE" | "INACTIVE";\nconst s: Status = "ACTIVE";\n\`\`\`\n\n| Feature | Enum | Union Type |\n|---------|------|------------|\n| Runtime existence | Yes — JS object | No — erased |\n| Iteration | Yes | No |\n| Reverse mapping (numeric) | Yes | No |\n| Tree-shaking | Poor | Good |\n| Syntax overhead | More | Less |\n| Self-documenting values | With string enums | Always |\n| Preferred in modern TS | Less common | More common |\n\n**Modern TypeScript recommendation:** Prefer string literal unions over enums for most cases. Use enums when you genuinely need the runtime object (iteration, mapping).`,
    codeExamples: [
      {
        title: 'String enums for user roles',
        code: `enum UserRole {
  Admin = "ADMIN",
  Editor = "EDITOR",
  Viewer = "VIEWER",
}

interface User {
  id: number;
  name: string;
  role: UserRole;
}

function canEdit(user: User): boolean {
  return user.role === UserRole.Admin || user.role === UserRole.Editor;
}

function canDelete(user: User): boolean {
  return user.role === UserRole.Admin;
}

const user: User = {
  id: 1,
  name: "Alice",
  role: UserRole.Editor,
};

console.log(canEdit(user));   // true
console.log(canDelete(user)); // false
console.log(user.role);       // "EDITOR"`,
        explanation: 'String enums give readable values in logs and are safe at compile time. The values appear as strings at runtime.',
      },
      {
        title: 'Numeric enum with HTTP status codes',
        code: `enum HttpStatus {
  OK = 200,
  Created = 201,
  NoContent = 204,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  InternalServerError = 500,
}

function getStatusMessage(status: HttpStatus): string {
  switch (status) {
    case HttpStatus.OK:          return "Request successful";
    case HttpStatus.Created:     return "Resource created";
    case HttpStatus.NotFound:    return "Resource not found";
    case HttpStatus.Unauthorized: return "Authentication required";
    default:                     return "Unknown status";
  }
}

// Reverse mapping — numeric enums support this
console.log(HttpStatus[200]);  // "OK"
console.log(HttpStatus.OK);    // 200`,
        explanation: 'Numeric enums with explicit values are clear and support reverse mapping (value → name). Ideal for HTTP codes, error codes, etc.',
      },
      {
        title: 'Enum vs union type — practical comparison',
        code: `// Enum approach — creates a runtime object
enum Direction {
  North = "NORTH",
  South = "SOUTH",
  East = "EAST",
  West = "WEST",
}

// Iterate over enum values (only possible with enum)
const allDirections = Object.values(Direction);
console.log(allDirections); // ["NORTH", "SOUTH", "EAST", "WEST"]

// Union type approach — no runtime object, simpler syntax
type Direction = "NORTH" | "SOUTH" | "EAST" | "WEST";
// Cannot iterate — but autocomplete and type safety work fine

// For most cases, union types are preferred:
type Theme = "light" | "dark" | "system";
type Environment = "development" | "staging" | "production";

function setTheme(theme: Theme): void {
  document.documentElement.setAttribute("data-theme", theme);
}

setTheme("dark");    // OK
setTheme("unknown"); // Error`,
        explanation: 'Use enums when you need to iterate over values. For simple constants and string unions, literal union types are cleaner.',
      },
    ],
    commonMistakes: [
      'Using enums everywhere — union string types are cleaner for most use cases.',
      'Mixing string and numeric values in the same enum — pick one style.',
      'Assuming const enum values exist at runtime — they are inlined and the object does not exist.',
      'Using numeric enums without explicit values — auto-incremented 0,1,2 values are not readable in logs.',
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between a numeric and string enum?',
        answer: 'Numeric enums assign auto-incrementing numbers (0, 1, 2...) or explicit numbers to each member. They support reverse mapping (look up name by value). String enums assign explicit string values — they are more readable in logs and debugging but do not support reverse mapping. String enums are generally preferred in modern TypeScript.',
        difficulty: 'beginner',
      },
      {
        question: 'What is a const enum and when should you use it?',
        answer: 'A const enum is inlined at compile time — the enum object does not exist in the output JavaScript. Each usage is replaced by its literal value. This eliminates the runtime overhead. Use const enum when you need enum ergonomics (named constants with autocomplete) but do not need to iterate over the values at runtime. Avoid const enum in libraries because it requires TypeScript compilation to work correctly.',
        difficulty: 'intermediate',
      },
      {
        question: 'When would you prefer a string union type over an enum?',
        answer: 'String union types (type Status = "active" | "inactive") are preferred when: you do not need to iterate over values at runtime, you want zero runtime overhead, you are building a library, or you want simpler syntax. Enums are preferred when you need runtime iteration (Object.values), reverse mapping, or want a named namespace for related constants. Modern TypeScript codebases trend toward union types over enums.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'ex-enum-1',
        title: 'Convert union to enum and back',
        description: 'Convert this union type to an enum, then decide which is better for the use case.',
        starterCode: `// Current: union type
type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

function getStatusLabel(status: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    pending: "Awaiting Confirmation",
    processing: "Being Prepared",
    shipped: "On the Way",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };
  return labels[status];
}

// Task 1: Convert to a string enum
// Task 2: Add a function that lists all possible statuses using Object.values()`,
        solution: `enum OrderStatus {
  Pending = "pending",
  Processing = "processing",
  Shipped = "shipped",
  Delivered = "delivered",
  Cancelled = "cancelled",
}

function getStatusLabel(status: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    [OrderStatus.Pending]: "Awaiting Confirmation",
    [OrderStatus.Processing]: "Being Prepared",
    [OrderStatus.Shipped]: "On the Way",
    [OrderStatus.Delivered]: "Delivered",
    [OrderStatus.Cancelled]: "Cancelled",
  };
  return labels[status];
}

function getAllStatuses(): OrderStatus[] {
  return Object.values(OrderStatus) as OrderStatus[];
}

console.log(getAllStatuses());
// ["pending", "processing", "shipped", "delivered", "cancelled"]`,
        hints: ['String enums use EnumName.Member = "value" syntax', 'Object.values() works on string enums to get all values'],
      },
    ],
    keyTakeaways: [
      'Enums create runtime JavaScript objects — they are not erased like types',
      'String enums are more readable than numeric enums in logs',
      'const enum inlines values at compile time — no runtime object',
      'Modern TypeScript prefers union string types over enums for most cases',
      'Use enums when you need runtime iteration (Object.values)',
    ],
    prevLesson: 'unions-and-intersections',
    nextLesson: 'generics',
  },

  // ─── MODULE 12: Generics ────────────────────────────────────────────────────
  {
    id: 'generics',
    slug: 'generics',
    title: 'Generics',
    description: 'Master generics — the most powerful TypeScript feature for writing reusable, type-safe code that works with any type.',
    category: 'Advanced Types',
    order: 12,
    difficulty: 'intermediate',
    estimatedTime: 40,
    content: `Generics are the mechanism for writing **reusable code that works with any type while maintaining full type safety**. They are one of the most important TypeScript features.\n\n## Why Generics Exist\n\n**Problem without generics:**\n\`\`\`ts\n// You write the same logic for every type\nfunction firstNumber(arr: number[]): number | undefined {\n  return arr[0];\n}\nfunction firstString(arr: string[]): string | undefined {\n  return arr[0];\n}\n// This is code duplication — same logic, different types\n\`\`\`\n\n**With any — loses type safety:**\n\`\`\`ts\nfunction first(arr: any[]): any {\n  return arr[0]; // caller gets any — type information is lost\n}\n\nconst n = first([1, 2, 3]);\nn.toUpperCase(); // No error — but crashes at runtime!\n\`\`\`\n\n**With generics — one function, full type safety:**\n\`\`\`ts\nfunction first<T>(arr: T[]): T | undefined {\n  return arr[0];\n}\n\nconst n = first([1, 2, 3]);        // TypeScript knows: n is number | undefined\nconst s = first(["a", "b", "c"]); // TypeScript knows: s is string | undefined\n\`\`\`\n\nThe \`<T>\` is a **type parameter** — a placeholder that TypeScript fills in based on what you pass.\n\n## Generic Functions\n\n\`\`\`ts\n// Single type parameter\nfunction identity<T>(value: T): T {\n  return value;\n}\n\n// Multiple type parameters\nfunction pair<A, B>(first: A, second: B): [A, B] {\n  return [first, second];\n}\n\nconst result = pair("Alice", 25); // [string, number]\n\n// With arrays\nfunction last<T>(arr: T[]): T | undefined {\n  return arr[arr.length - 1];\n}\n\n// Transforming types\nfunction mapArray<T, U>(arr: T[], fn: (item: T) => U): U[] {\n  return arr.map(fn);\n}\n\nconst lengths = mapArray(["hello", "world"], s => s.length);\n// lengths: number[]\n\`\`\`\n\n## Generic Interfaces\n\n\`\`\`ts\ninterface ApiResponse<T> {\n  data: T;\n  status: number;\n  message: string;\n  timestamp: Date;\n}\n\n// Usage — T is specified by the caller\nconst userResponse: ApiResponse<User> = {\n  data: { id: 1, name: "Alice" },\n  status: 200,\n  message: "OK",\n  timestamp: new Date(),\n};\n\nconst postsResponse: ApiResponse<Post[]> = {\n  data: [...posts],\n  status: 200,\n  message: "OK",\n  timestamp: new Date(),\n};\n\`\`\`\n\n## Generic Type Aliases\n\n\`\`\`ts\ntype Nullable<T> = T | null;\ntype Optional<T> = T | undefined;\ntype Result<T, E = Error> = { success: true; data: T } | { success: false; error: E };\n\n// Usage\ntype MaybeUser = Nullable<User>; // User | null\ntype UserResult = Result<User>;  // { success: true; data: User } | { success: false; error: Error }\n\`\`\`\n\n## Generic Classes\n\n\`\`\`ts\nclass Stack<T> {\n  private items: T[] = [];\n\n  push(item: T): void {\n    this.items.push(item);\n  }\n\n  pop(): T | undefined {\n    return this.items.pop();\n  }\n\n  peek(): T | undefined {\n    return this.items[this.items.length - 1];\n  }\n\n  get size(): number {\n    return this.items.length;\n  }\n}\n\nconst numberStack = new Stack<number>();\nnumberStack.push(1);\nnumberStack.push(2);\nnumberStack.pop(); // 2 (type: number | undefined)\n\nconst stringStack = new Stack<string>();\nstringStack.push("hello");\nnumberStack.push("world"); // Error: string not assignable to number\n\`\`\`\n\n## Generic Constraints\n\nUse \`extends\` to limit what types can be passed:\n\n\`\`\`ts\n// T must have a .length property\nfunction logLength<T extends { length: number }>(value: T): T {\n  console.log(value.length);\n  return value;\n}\n\nlogLength("hello");         // OK — string has .length\nlogLength([1, 2, 3]);      // OK — arrays have .length\nlogLength({ length: 5 });  // OK — has .length\nlogLength(42);              // Error — number has no .length\n\n// T must be a key of an object type\nfunction getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {\n  return obj[key];\n}\n\nconst user = { id: 1, name: "Alice", email: "alice@example.com" };\ngetProperty(user, "name");   // OK — "name" is a key of user\ngetProperty(user, "phone");  // Error — "phone" is not a key of user\n\`\`\`\n\n## Default Type Parameters\n\n\`\`\`ts\ninterface Container<T = string> {\n  value: T;\n}\n\nconst box1: Container = { value: "hello" };     // T defaults to string\nconst box2: Container<number> = { value: 42 };  // T is number\n\`\`\`\n\n## Real-World Generic Patterns\n\n\`\`\`ts\n// Generic repository pattern\ninterface Repository<T, ID = string> {\n  findById(id: ID): Promise<T | null>;\n  findAll(filter?: Partial<T>): Promise<T[]>;\n  save(entity: T): Promise<T>;\n  delete(id: ID): Promise<void>;\n}\n\n// Generic hook pattern (React)\nfunction useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {\n  const stored = localStorage.getItem(key);\n  const initial = stored ? JSON.parse(stored) : initialValue;\n  const [state, setState] = useState<T>(initial);\n  \n  const setValue = (value: T) => {\n    setState(value);\n    localStorage.setItem(key, JSON.stringify(value));\n  };\n  \n  return [state, setValue];\n}\n\`\`\``,
    codeExamples: [
      {
        title: 'Generic functions — the foundation',
        code: `// Generic wrapper for async operations with error handling
function tryCatch<T>(
  fn: () => Promise<T>
): Promise<[T, null] | [null, Error]> {
  return fn()
    .then(data => [data, null] as [T, null])
    .catch(err => [null, err instanceof Error ? err : new Error(String(err))]);
}

// Usage — TypeScript infers T from the promise
const [user, err] = await tryCatch(() => fetchUser(1));
if (err) {
  console.error(err.message);
} else {
  console.log(user.name); // TypeScript knows: user is User, not null
}

// Generic array utilities
function chunk<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

chunk([1, 2, 3, 4, 5], 2);        // [[1,2], [3,4], [5]] — number[][]
chunk(["a","b","c","d"], 2);       // [["a","b"], ["c","d"]] — string[][]`,
        explanation: 'Generics let one function work correctly with any type. TypeScript infers T from the arguments — no explicit annotation needed when calling.',
      },
      {
        title: 'Generic API response pattern',
        code: `// Generic response wrapper — used throughout the codebase
type ApiResponse<T> = {
  data: T;
  meta: {
    total: number;
    page: number;
    pageSize: number;
  };
};

type ApiError = {
  error: string;
  code: string;
  details?: Record<string, string[]>;
};

type ApiResult<T> = ApiResponse<T> | ApiError;

// Generic fetch function
async function apiGet<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.error);
  }
  return response.json() as Promise<T>;
}

// Usage — each call is fully typed
const users = await apiGet<ApiResponse<User[]>>("/api/users");
users.data.forEach(user => console.log(user.name)); // TypeScript knows user is User

const post = await apiGet<Post>("/api/posts/1");
console.log(post.title); // TypeScript knows post is Post`,
        explanation: 'This generic API pattern is used in real applications. Each endpoint call is typed, and TypeScript knows exactly what shape the response has.',
      },
      {
        title: 'Generic constraints with keyof',
        code: `// Type-safe object access
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { id: 1, name: "Alice", email: "alice@example.com" };

const name = getProperty(user, "name");   // type: string
const id = getProperty(user, "id");       // type: number
// getProperty(user, "phone");            // Error: "phone" is not keyof user

// Type-safe object pick
function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    result[key] = obj[key];
  });
  return result;
}

const partial = pick(user, ["name", "email"]);
// type: { name: string; email: string }
// id is excluded — TypeScript knows this

// Generic sort by key
function sortByKey<T, K extends keyof T>(arr: T[], key: K): T[] {
  return [...arr].sort((a, b) => {
    if (a[key] < b[key]) return -1;
    if (a[key] > b[key]) return 1;
    return 0;
  });
}

const sortedByName = sortByKey(users, "name"); // OK
const sortedByAge = sortByKey(users, "age");   // Error if "age" not in T`,
        explanation: 'K extends keyof T constrains K to be a valid key of T. TypeScript then knows the return type is T[K] — the type of that specific property.',
      },
      {
        title: 'Generic class — typed data structure',
        code: `class Queue<T> {
  private items: T[] = [];

  enqueue(item: T): void {
    this.items.push(item);
  }

  dequeue(): T | undefined {
    return this.items.shift();
  }

  peek(): T | undefined {
    return this.items[0];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }

  // Generic method — converts the queue to another type
  map<U>(fn: (item: T) => U): Queue<U> {
    const newQueue = new Queue<U>();
    this.items.forEach(item => newQueue.enqueue(fn(item)));
    return newQueue;
  }
}

const taskQueue = new Queue<{ id: number; task: string }>();
taskQueue.enqueue({ id: 1, task: "Send email" });
taskQueue.enqueue({ id: 2, task: "Process payment" });

const next = taskQueue.dequeue();
// TypeScript knows: next is { id: number; task: string } | undefined

const idQueue = taskQueue.map(t => t.id);
// idQueue is Queue<number>`,
        explanation: 'Generic classes maintain type safety throughout all methods. The map method demonstrates a generic method inside a generic class — T is the class type, U is the transform output.',
      },
    ],
    commonMistakes: [
      'Using any instead of generics — any loses type information, generics preserve it.',
      'Over-constraining with too many extends — start simple and add constraints only when needed.',
      'Naming type parameters single letters (T, U) when a descriptive name (TItem, TResponse) would be clearer in complex generics.',
      'Forgetting to pass the type argument when TypeScript cannot infer it from the arguments.',
      'Using generics when a union type would be simpler — not everything needs to be generic.',
    ],
    interviewQuestions: [
      {
        question: 'What are generics and why do they exist?',
        answer: 'Generics allow you to write reusable code that works with multiple types while maintaining type safety. Without generics, you either duplicate code for each type or use any (which loses type information). A generic function <T> accepts a type parameter T that TypeScript fills in based on what you pass. The result is code that is both reusable and fully typed.',
        difficulty: 'intermediate',
      },
      {
        question: 'What is a generic constraint (extends in generics)?',
        answer: 'A generic constraint limits what types can be substituted for a type parameter. Syntax: function fn<T extends SomeType>(arg: T). The constraint can be an interface, a class, an object shape, or keyof another type. For example: <T extends { length: number }> means T must have a .length property. This lets you call .length on T safely inside the function.',
        difficulty: 'intermediate',
      },
      {
        question: 'What is the difference between generics and any?',
        answer: 'Both allow a function or class to work with multiple types, but generics preserve type information while any discards it. With any, you lose all type checking for that value — the caller gets any back. With generics, TypeScript tracks the actual type through the function — if you pass a string[], you get a string[] back, not any[]. Generics are type-safe; any is an escape hatch that breaks type safety.',
        difficulty: 'intermediate',
      },
      {
        question: 'What does keyof mean in a generic constraint?',
        answer: 'keyof T produces a union of all the keys of type T. In a generic constraint: function fn<T, K extends keyof T>(obj: T, key: K) — this means K must be a valid key of T. TypeScript then knows that obj[key] has type T[K] — the type of that specific property. This is how you write type-safe property access functions.',
        difficulty: 'advanced',
      },
    ],
    exercises: [
      {
        id: 'ex-generics-1',
        title: 'Write a generic filter function',
        description: 'Write a generic filter function that filters an array by a predicate and returns the correct type.',
        starterCode: `// Make this generic — it should work with any array type
// and return the correctly typed array
function filterBy(arr, predicate) {
  return arr.filter(predicate);
}

// These should all be correctly typed:
const numbers = filterBy([1, 2, 3, 4, 5], n => n > 2);
// Expected type: number[]

const users = filterBy(
  [{ name: "Alice", age: 25 }, { name: "Bob", age: 17 }],
  u => u.age >= 18
);
// Expected type: { name: string; age: number }[]`,
        solution: `function filterBy<T>(arr: T[], predicate: (item: T) => boolean): T[] {
  return arr.filter(predicate);
}

const numbers = filterBy([1, 2, 3, 4, 5], n => n > 2);
// type: number[]

const users = filterBy(
  [{ name: "Alice", age: 25 }, { name: "Bob", age: 17 }],
  u => u.age >= 18
);
// type: { name: string; age: number }[]`,
        hints: ['Add <T> after the function name', 'The predicate type is (item: T) => boolean', 'Return type is T[]'],
      },
      {
        id: 'ex-generics-2',
        title: 'Build a generic cache',
        description: 'Build a generic in-memory cache class that stores any type with get/set/has/clear methods.',
        starterCode: `// Build a generic Cache class
// Methods: set(key: string, value: T): void
//          get(key: string): T | undefined
//          has(key: string): boolean
//          clear(): void
//          size: number (getter)

class Cache {
  // implement with generics
}

const userCache = new Cache<User>();
userCache.set("user-1", { id: 1, name: "Alice" });
const user = userCache.get("user-1"); // should be User | undefined`,
        solution: `class Cache<T> {
  private store = new Map<string, T>();

  set(key: string, value: T): void {
    this.store.set(key, value);
  }

  get(key: string): T | undefined {
    return this.store.get(key);
  }

  has(key: string): boolean {
    return this.store.has(key);
  }

  clear(): void {
    this.store.clear();
  }

  get size(): number {
    return this.store.size;
  }
}

interface User { id: number; name: string; }

const userCache = new Cache<User>();
userCache.set("user-1", { id: 1, name: "Alice" });
const user = userCache.get("user-1"); // User | undefined`,
        hints: ['Use private store = new Map<string, T>()', 'The class itself takes <T> as a type parameter'],
      },
    ],
    keyTakeaways: [
      'Generics write reusable code that works with any type while staying type-safe',
      'Type parameters (T, U) are filled in by TypeScript based on what you pass',
      'Constraints (T extends X) limit which types are acceptable',
      'keyof T produces a union of all property names — use for type-safe property access',
      'Generic classes, functions, interfaces, and type aliases all use the same <T> syntax',
    ],
    prevLesson: 'enums',
    nextLesson: 'advanced-types',
  },

  // ─── MODULE 13: Advanced Types ──────────────────────────────────────────────
  {
    id: 'advanced-types',
    slug: 'advanced-types',
    title: 'Advanced Types',
    description: 'Master keyof, typeof, indexed access types, mapped types, and conditional types — the tools that power TypeScript\'s utility types.',
    category: 'Advanced Types',
    order: 13,
    difficulty: 'advanced',
    estimatedTime: 40,
    content: `Advanced types are the building blocks TypeScript uses internally to implement Partial, Pick, Readonly, and other utility types. Understanding them lets you create your own utilities and understand what TypeScript is doing under the hood.\n\n## keyof — Property Name Union\n\n\`keyof T\` produces a union of all the property names of type T:\n\n\`\`\`ts\ninterface User {\n  id: number;\n  name: string;\n  email: string;\n}\n\ntype UserKeys = keyof User; // "id" | "name" | "email"\n\n// Practical use: type-safe property access\nfunction getValue<T, K extends keyof T>(obj: T, key: K): T[K] {\n  return obj[key];\n}\n\`\`\`\n\n## typeof — Extract a Type from a Value\n\n\`typeof\` in TypeScript (at the type level) extracts the type of a value:\n\n\`\`\`ts\nconst config = {\n  host: "localhost",\n  port: 3000,\n  debug: true,\n};\n\ntype Config = typeof config;\n// { host: string; port: number; debug: boolean }\n\nfunction applyConfig(cfg: typeof config): void {\n  // cfg must match the same shape as config\n}\n\n// Very useful for inferring types from existing values\nconst colors = ["red", "green", "blue"] as const;\ntype Color = typeof colors[number]; // "red" | "green" | "blue"\n\`\`\`\n\n## Indexed Access Types — T[K]\n\nAccess the type of a specific property:\n\n\`\`\`ts\ninterface Post {\n  id: string;\n  title: string;\n  author: { name: string; email: string };\n  tags: string[];\n}\n\ntype PostId = Post["id"];           // string\ntype PostAuthor = Post["author"];   // { name: string; email: string }\ntype PostTag = Post["tags"][number]; // string — element type of the array\n\n// Combine with keyof\ntype PostValues = Post[keyof Post]; // string | { name: string; email: string } | string[]\n\`\`\`\n\n## Mapped Types — Transform Every Property\n\nMapped types iterate over the keys of a type and create a new type:\n\n\`\`\`ts\n// Make all properties optional\ntype Optional<T> = {\n  [K in keyof T]?: T[K];\n};\n\n// Make all properties readonly\ntype Immutable<T> = {\n  readonly [K in keyof T]: T[K];\n};\n\n// Make all properties nullable\ntype Nullable<T> = {\n  [K in keyof T]: T[K] | null;\n};\n\n// These are exactly how Partial, Readonly work internally\n\`\`\`\n\nModifiers in mapped types:\n\n\`\`\`ts\n// Remove readonly (prefix with -)\ntype Mutable<T> = {\n  -readonly [K in keyof T]: T[K];\n};\n\n// Remove optionality\ntype Required<T> = {\n  [K in keyof T]-?: T[K];\n};\n\`\`\`\n\n## Conditional Types — Types with if/else Logic\n\n\`\`\`ts\n// T extends U ? TrueType : FalseType\ntype IsString<T> = T extends string ? true : false;\n\ntype A = IsString<string>; // true\ntype B = IsString<number>; // false\n\`\`\`\n\n**Distributive conditional types** — when T is a union, the condition distributes:\n\n\`\`\`ts\ntype NonNullable<T> = T extends null | undefined ? never : T;\n\ntype Clean = NonNullable<string | null | undefined>;\n// string — null and undefined become never and are removed\n\`\`\`\n\n**infer keyword** — extract types within conditional types:\n\n\`\`\`ts\n// Extract the return type of a function\ntype ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;\n\nfunction greet(): string { return "hello"; }\ntype GreetReturn = ReturnType<typeof greet>; // string\n\n// Extract the element type of an array\ntype ElementType<T> = T extends (infer E)[] ? E : never;\ntype NumType = ElementType<number[]>; // number\n\`\`\`\n\n## Template Literal Types\n\n\`\`\`ts\ntype EventName = "click" | "focus" | "blur";\ntype HandlerName = \`on\${Capitalize<EventName>}\`;\n// "onClick" | "onFocus" | "onBlur"\n\ntype ApiRoute = \`/api/\${string}\`;\n// Matches any string starting with /api/\n\`\`\``,
    codeExamples: [
      {
        title: 'keyof and indexed access in practice',
        code: `interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
}

// keyof gives us the union of property names
type ProductKey = keyof Product; // "id" | "name" | "price" | "category" | "inStock"

// Indexed access gives us the type of a specific property
type ProductPrice = Product["price"]; // number
type ProductId = Product["id"];       // string

// Generic function using keyof + indexed access
function pluck<T, K extends keyof T>(items: T[], key: K): T[K][] {
  return items.map(item => item[key]);
}

const products: Product[] = [
  { id: "1", name: "Laptop", price: 999, category: "Electronics", inStock: true },
  { id: "2", name: "Phone", price: 699, category: "Electronics", inStock: false },
];

const prices = pluck(products, "price");  // number[]
const names = pluck(products, "name");    // string[]
// pluck(products, "unknown");             // Error: not a key of Product`,
        explanation: 'keyof Product gives all keys as a union. T[K] gives the type of that specific key. Together they enable type-safe property access utilities.',
      },
      {
        title: 'Mapped types — building your own utilities',
        code: `// Partial — make all properties optional
type MyPartial<T> = {
  [K in keyof T]?: T[K];
};

// Readonly — make all properties readonly
type MyReadonly<T> = {
  readonly [K in keyof T]: T[K];
};

// Nullable — make all properties nullable
type MyNullable<T> = {
  [K in keyof T]: T[K] | null;
};

// Convert all values to a new type
type Stringify<T> = {
  [K in keyof T]: string;
};

interface User {
  id: number;
  name: string;
  active: boolean;
}

type PartialUser = MyPartial<User>;
// { id?: number; name?: string; active?: boolean }

type StringUser = Stringify<User>;
// { id: string; name: string; active: string }

// Filter keys by value type
type KeysOfType<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never;
}[keyof T];

type StringKeys = KeysOfType<User, string>; // "name"
type NumberKeys = KeysOfType<User, number>; // "id"`,
        explanation: 'Mapped types use [K in keyof T] to iterate over all properties. You can transform the key (with as) or the value type. This is how all utility types are built.',
      },
      {
        title: 'Conditional types and infer',
        code: `// Extract the element type from any array type
type ArrayElement<T> = T extends (infer E)[] ? E : never;

type StringEl = ArrayElement<string[]>;      // string
type NumberEl = ArrayElement<number[]>;      // number
type UserEl = ArrayElement<User[]>;          // User
type NotArray = ArrayElement<string>;        // never

// Extract the first argument type of a function
type FirstArg<T extends (...args: any) => any> =
  T extends (first: infer F, ...rest: any[]) => any ? F : never;

function login(email: string, password: string): boolean { return true; }
type LoginFirstArg = FirstArg<typeof login>; // string

// Unwrap a Promise type
type Awaited<T> = T extends Promise<infer R> ? R : T;

type UserData = Awaited<Promise<User>>; // User (unwrapped)
type Raw = Awaited<string>;             // string (not a Promise, stays as-is)

// Distributive conditional — applies to each union member
type ToArray<T> = T extends any ? T[] : never;

type StringOrNumberArrays = ToArray<string | number>;
// string[] | number[] (distributed — not (string | number)[])`,
        explanation: 'infer lets you capture a type from within another type. Distributive conditional types apply the condition to each member of a union separately.',
      },
      {
        title: 'Template literal types',
        code: `// Build event handler names from event names
type DOMEvent = "click" | "focus" | "blur" | "change" | "submit";
type EventHandlerName = \`on\${Capitalize<DOMEvent>}\`;
// "onClick" | "onFocus" | "onBlur" | "onChange" | "onSubmit"

// Type-safe API routes
type ResourceName = "users" | "posts" | "comments";
type ApiPath =
  | \`/api/\${ResourceName}\`
  | \`/api/\${ResourceName}/\${string}\`;

function fetchApi(path: ApiPath): Promise<unknown> {
  return fetch(path).then(r => r.json());
}

fetchApi("/api/users");           // OK
fetchApi("/api/users/123");       // OK
fetchApi("/api/orders");          // Error: not a valid ResourceName

// CSS property names
type CSSProperty = "margin" | "padding" | "border";
type CSSDirection = "top" | "right" | "bottom" | "left";
type CSSDirectionalProp = \`\${CSSProperty}-\${CSSDirection}\`;
// "margin-top" | "margin-right" | ... (12 combinations)`,
        explanation: 'Template literal types compute string type combinations. TypeScript generates all combinations automatically from the union members.',
      },
    ],
    commonMistakes: [
      'Forgetting that T[K] is an indexed access type (at the type level) — different from obj[key] at the value level.',
      'Not using infer correctly — it can only appear in the extends clause of a conditional type.',
      'Expecting mapped types to work on primitives — they only work on object types.',
      'Confusing typeof at the value level (JavaScript) vs type level (TypeScript) — context determines which one runs.',
    ],
    interviewQuestions: [
      {
        question: 'What does keyof do in TypeScript?',
        answer: 'keyof T produces a union type of all the property keys of type T. For example, keyof { id: number; name: string } produces "id" | "name". It is used with generics to write type-safe property access functions — function fn<T, K extends keyof T>(obj: T, key: K): T[K] ensures the key is valid and the return type matches that property.',
        difficulty: 'intermediate',
      },
      {
        question: 'What is a mapped type?',
        answer: 'A mapped type creates a new type by iterating over the keys of an existing type. Syntax: { [K in keyof T]: NewType }. For each key K in T, you define what the new value type should be. This is how TypeScript\'s built-in utility types (Partial, Readonly, Required) are implemented. You can add or remove readonly and ? modifiers using + and - prefixes.',
        difficulty: 'advanced',
      },
      {
        question: 'What is the infer keyword and where can it be used?',
        answer: 'infer is used inside conditional types to capture and name a type that TypeScript infers from the extends clause. Example: T extends Promise<infer R> ? R : never — if T is a Promise, R captures the resolved type. infer can only appear in the extends part of a conditional type (T extends ...). It enables building utility types like ReturnType, Parameters, and Awaited.',
        difficulty: 'advanced',
      },
    ],
    exercises: [
      {
        id: 'ex-advanced-1',
        title: 'Build a DeepPartial type',
        description: 'Create a DeepPartial type that makes all properties optional — including nested objects.',
        starterCode: `// Partial only makes the top-level properties optional
// DeepPartial should make ALL levels optional

type Partial<T> = { [K in keyof T]?: T[K] }; // only top level

// Build DeepPartial that recurses into nested objects:
type DeepPartial<T> = // your implementation

interface Config {
  server: {
    host: string;
    port: number;
    ssl: {
      enabled: boolean;
      cert: string;
    };
  };
  database: {
    url: string;
    poolSize: number;
  };
}

// All fields at all levels should be optional:
const partial: DeepPartial<Config> = {
  server: {
    port: 3000, // only port — host and ssl are optional
  },
};`,
        solution: `type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

interface Config {
  server: {
    host: string;
    port: number;
    ssl: {
      enabled: boolean;
      cert: string;
    };
  };
  database: {
    url: string;
    poolSize: number;
  };
}

const partial: DeepPartial<Config> = {
  server: {
    port: 3000,
  },
};`,
        hints: ['Use T[K] extends object ? DeepPartial<T[K]> : T[K] to recurse', 'The ? after K makes each property optional'],
      },
    ],
    keyTakeaways: [
      'keyof T — union of all property names of T',
      'typeof value — extract the type from a runtime value',
      'T[K] — indexed access: the type of property K in T',
      'Mapped types [K in keyof T] — transform every property of a type',
      'Conditional types T extends U ? A : B — type-level if/else',
      'infer — capture a type within a conditional type extends clause',
    ],
    prevLesson: 'generics',
    nextLesson: 'utility-types',
  },

  // ─── MODULE 14: Utility Types ───────────────────────────────────────────────
  {
    id: 'utility-types',
    slug: 'utility-types',
    title: 'Utility Types',
    description: 'Master TypeScript\'s built-in utility types — Partial, Required, Pick, Omit, Record, Exclude, Extract, Readonly, ReturnType, Parameters, and more.',
    category: 'Advanced Types',
    order: 14,
    difficulty: 'intermediate',
    estimatedTime: 35,
    content: `TypeScript ships with a set of **built-in generic types that transform existing types**. These utility types solve the most common type manipulation tasks so you do not have to write them yourself.\n\n## Partial\<T\> — Make All Properties Optional\n\n\`\`\`ts\ninterface User {\n  id: number;\n  name: string;\n  email: string;\n  role: string;\n}\n\ntype PartialUser = Partial<User>;\n// { id?: number; name?: string; email?: string; role?: string }\n\n// Real-world use: update payloads\nfunction updateUser(id: number, changes: Partial<User>): User {\n  // changes can have any subset of User fields\n  return { ...currentUser, ...changes };\n}\n\nupdateUser(1, { name: "Alice Updated" }); // OK — only updating name\n\`\`\`\n\n## Required\<T\> — Make All Properties Required\n\n\`\`\`ts\ninterface Config {\n  host?: string;\n  port?: number;\n  debug?: boolean;\n}\n\ntype StrictConfig = Required<Config>;\n// { host: string; port: number; debug: boolean } — no more optional\n\`\`\`\n\n## Pick\<T, K\> — Select Specific Properties\n\n\`\`\`ts\ntype UserPreview = Pick<User, "id" | "name">;\n// { id: number; name: string } — only these two fields\n\n// Common use: API response shapes (don't expose all fields)\ntype PublicUser = Pick<User, "id" | "name" | "avatar">;\n\`\`\`\n\n## Omit\<T, K\> — Remove Specific Properties\n\n\`\`\`ts\ntype UserWithoutPassword = Omit<User, "password" | "passwordHash">;\n// All User fields except password and passwordHash\n\n// Common use: create/update inputs (no id yet)\ntype CreateUserInput = Omit<User, "id" | "createdAt" | "updatedAt">;\n\`\`\`\n\n## Record\<K, V\> — Object with Specific Key/Value Types\n\n\`\`\`ts\ntype RolePermissions = Record<UserRole, string[]>;\n// { admin: string[]; editor: string[]; viewer: string[] }\n\nconst permissions: Record<string, boolean> = {\n  read: true,\n  write: false,\n  delete: false,\n};\n\n// Cleaner than index signatures for most use cases\n\`\`\`\n\n## Exclude\<T, U\> — Remove Types from a Union\n\n\`\`\`ts\ntype Status = "pending" | "active" | "cancelled" | "deleted";\ntype ActiveStatus = Exclude<Status, "deleted" | "cancelled">;\n// "pending" | "active"\n\ntype NonNullable<T> = Exclude<T, null | undefined>;\n// Built-in — removes null and undefined from a union\n\`\`\`\n\n## Extract\<T, U\> — Keep Only Matching Types\n\n\`\`\`ts\ntype Mixed = string | number | boolean | null;\ntype OnlyStrings = Extract<Mixed, string>; // string\ntype StringOrNumber = Extract<Mixed, string | number>; // string | number\n\`\`\`\n\n## Readonly\<T\> — Make All Properties Readonly\n\n\`\`\`ts\ntype ImmutableUser = Readonly<User>;\n// All properties are readonly — cannot be reassigned\n\n// Useful for function parameters you should not mutate\nfunction displayUser(user: Readonly<User>): void {\n  // user.name = "changed"; // Error — readonly\n  console.log(user.name);\n}\n\`\`\`\n\n## ReturnType\<T\> — Extract a Function's Return Type\n\n\`\`\`ts\nfunction getUser(): { id: number; name: string } {\n  return { id: 1, name: "Alice" };\n}\n\ntype UserFromFn = ReturnType<typeof getUser>;\n// { id: number; name: string }\n\n// Useful when you want to match a function's return type\n// without repeating it as an interface\n\`\`\`\n\n## Parameters\<T\> — Extract Function Parameter Types as a Tuple\n\n\`\`\`ts\nfunction createPost(title: string, content: string, tags: string[]): Post {\n  // ...\n}\n\ntype CreatePostParams = Parameters<typeof createPost>;\n// [title: string, content: string, tags: string[]]\n\ntype FirstParam = Parameters<typeof createPost>[0]; // string\n\`\`\`\n\n## ConstructorParameters\<T\> and InstanceType\<T\>\n\n\`\`\`ts\nclass UserService {\n  constructor(private db: Database, private cache: Cache) {}\n}\n\ntype ServiceArgs = ConstructorParameters<typeof UserService>;\n// [db: Database, cache: Cache]\n\ntype ServiceInstance = InstanceType<typeof UserService>;\n// UserService\n\`\`\`\n\n## Utility Type Cheat Sheet\n\n| Utility | Input | Output |\n|---------|-------|--------|\n| \`Partial<T>\` | All required | All optional |\n| \`Required<T>\` | All optional | All required |\n| \`Readonly<T>\` | Mutable | All readonly |\n| \`Pick<T, K>\` | All keys | Only K keys |\n| \`Omit<T, K>\` | All keys | All except K |\n| \`Record<K, V>\` | Keys + value type | Object type |\n| \`Exclude<T, U>\` | Union T | Remove U from T |\n| \`Extract<T, U>\` | Union T | Keep only U from T |\n| \`NonNullable<T>\` | T with null/undef | Remove null/undef |\n| \`ReturnType<T>\` | Function type | Return type |\n| \`Parameters<T>\` | Function type | Params as tuple |`,
    codeExamples: [
      {
        title: 'Pick and Omit — shaping API types',
        code: `interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: "admin" | "user";
  createdAt: Date;
  updatedAt: Date;
}

// What the API returns publicly (no sensitive fields)
type PublicUser = Omit<User, "passwordHash">;
// { id, name, email, role, createdAt, updatedAt }

// What the user profile card shows
type UserCard = Pick<User, "id" | "name" | "email">;
// { id: string; name: string; email: string }

// What clients send to create a user
type CreateUserInput = Omit<User, "id" | "createdAt" | "updatedAt">;
// { name, email, passwordHash, role }

// What clients send to update a user
type UpdateUserInput = Partial<Omit<User, "id" | "createdAt">>;
// All fields optional except id and createdAt

function publicizeUser(user: User): PublicUser {
  const { passwordHash, ...rest } = user;
  return rest;
}`,
        explanation: 'Pick selects specific fields; Omit removes specific fields. Combined with Partial, they create the input/output shapes for every API endpoint.',
      },
      {
        title: 'Record — typed dictionaries',
        code: `type Language = "en" | "es" | "fr" | "de" | "ja";

// Every language must have a translation
type Translations = Record<Language, string>;

const welcomeMessage: Translations = {
  en: "Welcome",
  es: "Bienvenido",
  fr: "Bienvenue",
  de: "Willkommen",
  ja: "ようこそ",
  // Missing a language? TypeScript will error
};

// Route → Component mapping
type Route = "/home" | "/about" | "/contact" | "/blog";
type RouteConfig = Record<Route, { component: string; protected: boolean }>;

const routes: RouteConfig = {
  "/home":    { component: "HomePage", protected: false },
  "/about":   { component: "AboutPage", protected: false },
  "/contact": { component: "ContactPage", protected: false },
  "/blog":    { component: "BlogPage", protected: false },
};

// Feature flags
type Feature = "darkMode" | "betaEditor" | "analytics";
const flags: Record<Feature, boolean> = {
  darkMode: true,
  betaEditor: false,
  analytics: true,
};`,
        explanation: 'Record<K, V> is cleaner than index signatures when you know the valid keys. TypeScript ensures every key is present and every value matches the type.',
      },
      {
        title: 'ReturnType and Parameters — reflect function signatures',
        code: `// You have existing functions and want to match their types

async function fetchUser(id: string): Promise<{ id: string; name: string }> {
  const response = await fetch(\`/api/users/\${id}\`);
  return response.json();
}

// Extract return type without repeating the interface
type FetchUserReturn = Awaited<ReturnType<typeof fetchUser>>;
// { id: string; name: string }

// Extract parameter types
type FetchUserParams = Parameters<typeof fetchUser>;
// [id: string]

// Useful for wrapping/decorating functions
function withLogging<T extends (...args: any[]) => any>(
  fn: T
): (...args: Parameters<T>) => ReturnType<T> {
  return (...args) => {
    console.log("Calling with:", args);
    return fn(...args);
  };
}

const loggedFetch = withLogging(fetchUser);
// TypeScript knows: loggedFetch has the same signature as fetchUser`,
        explanation: 'ReturnType and Parameters let you reference a function\'s types without duplicating them. Essential for decorators, wrappers, and higher-order functions.',
      },
      {
        title: 'Combining utility types',
        code: `interface BlogPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
  tags: string[];
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Create input — client provides these
type CreatePostInput = Pick<BlogPost, "title" | "content" | "tags">;

// Update input — all optional except we know the id
type UpdatePostInput = { id: string } & Partial<Pick<BlogPost, "title" | "content" | "tags" | "published">>;

// Search filters — all optional
type PostFilters = Partial<Pick<BlogPost, "authorId" | "published" | "tags">>;

// Public post — no internal fields
type PublicPost = Omit<BlogPost, "authorId"> & { author: { name: string } };

// List item — just enough to show in a list
type PostListItem = Pick<BlogPost, "id" | "title" | "published" | "createdAt">;

function searchPosts(filters: PostFilters): Promise<PostListItem[]> {
  return fetch(\`/api/posts?\${new URLSearchParams(filters as any)}\`)
    .then(r => r.json());
}`,
        explanation: 'Real applications combine utility types to create precise input/output shapes for each operation. This eliminates type duplication.',
      },
    ],
    commonMistakes: [
      'Using Partial<T> for update inputs when some fields should always be required (use Pick + Partial on the subset instead).',
      'Confusing Exclude (removes from a union) with Omit (removes from an object type).',
      'Forgetting Awaited when using ReturnType on async functions — ReturnType<typeof asyncFn> gives Promise<T>, not T.',
      'Using Record<string, any> instead of a more specific Record<KnownKeys, ValueType>.',
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between Pick and Omit?',
        answer: 'Both create a new object type from an existing one. Pick<T, K> selects only the specified keys K — the result has only those properties. Omit<T, K> removes the specified keys K — the result has everything except those properties. Use Pick when you want a small subset. Use Omit when you want everything except a few fields.',
        difficulty: 'beginner',
      },
      {
        question: 'What is the difference between Exclude and Omit?',
        answer: 'Exclude operates on union types — Exclude<"a" | "b" | "c", "a"> removes "a" from the union to produce "b" | "c". Omit operates on object types — Omit<User, "password"> removes the "password" property from the User object type. Different targets: Exclude for unions, Omit for objects.',
        difficulty: 'intermediate',
      },
      {
        question: 'How do you get the return type of an async function?',
        answer: 'ReturnType<typeof fn> gives Promise<T> for async functions. To unwrap the Promise, use Awaited<ReturnType<typeof fn>>. Awaited recursively unwraps Promise types. Example: if fn returns Promise<User>, Awaited<ReturnType<typeof fn>> gives User.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'ex-utility-1',
        title: 'Build an API type layer using utility types',
        description: 'Given a User interface, create all the API types using utility types — no duplication allowed.',
        starterCode: `interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: "admin" | "user" | "guest";
  createdAt: Date;
  updatedAt: Date;
  lastLogin: Date | null;
}

// Create these types using ONLY utility types (Partial, Pick, Omit, etc.):
// 1. PublicUser — all fields except passwordHash
// 2. CreateUserInput — name, email, password (plain text — different from passwordHash)
// 3. UpdateUserInput — id required, name and email optional
// 4. AdminUserView — all fields (admins can see everything)
// 5. UserSummary — id, name, role only

type PublicUser = // ...
type CreateUserInput = // ...
type UpdateUserInput = // ...
type AdminUserView = // ...
type UserSummary = // ...`,
        solution: `interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: "admin" | "user" | "guest";
  createdAt: Date;
  updatedAt: Date;
  lastLogin: Date | null;
}

type PublicUser = Omit<User, "passwordHash">;

type CreateUserInput = Pick<User, "name" | "email"> & { password: string };

type UpdateUserInput = Pick<User, "id"> & Partial<Pick<User, "name" | "email">>;

type AdminUserView = User; // Admins see everything

type UserSummary = Pick<User, "id" | "name" | "role">;`,
        hints: ['Omit removes fields, Pick selects fields', 'Use & to add a field that does not exist on User (like plain text password)', 'Required fields in update — use Pick for just id, then Partial for the rest'],
      },
    ],
    keyTakeaways: [
      'Partial<T> — all optional, Required<T> — all required, Readonly<T> — all readonly',
      'Pick<T, K> — select keys, Omit<T, K> — remove keys',
      'Record<K, V> — object with specific key/value types',
      'Exclude<T, U> — remove from union, Extract<T, U> — keep matching from union',
      'ReturnType and Parameters reflect function signatures without duplication',
      'Combine utility types to create precise shapes for every API operation',
    ],
    prevLesson: 'advanced-types',
    nextLesson: 'classes-typescript',
  },

  // ─── MODULE 15: Classes in TypeScript ───────────────────────────────────────
  {
    id: 'classes-typescript',
    slug: 'classes-typescript',
    title: 'Classes in TypeScript',
    description: 'TypeScript adds access modifiers, readonly, abstract classes, and interface implementation to JavaScript classes.',
    category: 'Advanced Types',
    order: 15,
    difficulty: 'intermediate',
    estimatedTime: 30,
    content: `You already know JavaScript classes from the JavaScript track. TypeScript adds access control, readonly fields, constructor shorthand, abstract classes, and interface enforcement. This module focuses only on what TypeScript adds.\n\n## Access Modifiers\n\nTypeScript adds three visibility modifiers that control where class members can be accessed:\n\n\`\`\`ts\nclass BankAccount {\n  public owner: string;      // Accessible everywhere (default)\n  private balance: number;   // Only within this class\n  protected id: string;      // This class + subclasses\n\n  constructor(owner: string, initialBalance: number) {\n    this.owner = owner;\n    this.balance = initialBalance;\n    this.id = crypto.randomUUID();\n  }\n\n  // public method — anyone can call\n  public getBalance(): number {\n    return this.balance; // can access private field from within the class\n  }\n\n  // private method — internal only\n  private validateAmount(amount: number): boolean {\n    return amount > 0 && amount <= this.balance;\n  }\n\n  public withdraw(amount: number): boolean {\n    if (!this.validateAmount(amount)) return false;\n    this.balance -= amount;\n    return true;\n  }\n}\n\nconst account = new BankAccount("Alice", 1000);\naccount.owner;             // OK — public\naccount.balance;           // Error — private\naccount.validateAmount(5); // Error — private\n\`\`\`\n\n**Important:** Access modifiers are compile-time only. At runtime, they are removed. For true private fields at runtime, use JavaScript's native # private fields.\n\n## Constructor Shorthand\n\n\`\`\`ts\n// Without shorthand (verbose)\nclass User {\n  public name: string;\n  private email: string;\n  readonly id: number;\n\n  constructor(name: string, email: string, id: number) {\n    this.name = name;\n    this.email = email;\n    this.id = id;\n  }\n}\n\n// With shorthand — same result, much less code\nclass User {\n  constructor(\n    public name: string,\n    private email: string,\n    readonly id: number,\n  ) {}\n}\n\`\`\`\n\nWhen you put a modifier in the constructor parameter, TypeScript automatically creates the property and assigns it.\n\n## Readonly Properties\n\n\`\`\`ts\nclass Config {\n  readonly apiUrl: string;\n  readonly version = "1.0.0"; // Inline initialization\n\n  constructor(apiUrl: string) {\n    this.apiUrl = apiUrl;\n    // After construction, apiUrl cannot be changed\n  }\n}\n\nconst config = new Config("https://api.example.com");\nconfig.apiUrl = "other"; // Error: Cannot assign to 'apiUrl' — read-only\n\`\`\`\n\n## Abstract Classes\n\nAbstract classes cannot be instantiated directly — they define a template that subclasses must follow:\n\n\`\`\`ts\nabstract class Shape {\n  abstract area(): number;     // Subclass must implement\n  abstract perimeter(): number; // Subclass must implement\n\n  // Concrete method — shared by all shapes\n  describe(): string {\n    return \`Area: \${this.area().toFixed(2)}, Perimeter: \${this.perimeter().toFixed(2)}\`;\n  }\n}\n\nclass Circle extends Shape {\n  constructor(private radius: number) { super(); }\n\n  area(): number { return Math.PI * this.radius ** 2; }\n  perimeter(): number { return 2 * Math.PI * this.radius; }\n}\n\nclass Rectangle extends Shape {\n  constructor(private width: number, private height: number) { super(); }\n\n  area(): number { return this.width * this.height; }\n  perimeter(): number { return 2 * (this.width + this.height); }\n}\n\nconst shape = new Shape(); // Error: Cannot create instance of abstract class\nconst circle = new Circle(5);\nconsole.log(circle.describe()); // Uses the concrete method from Shape\n\`\`\`\n\n## Implementing Interfaces\n\nClasses can implement interfaces to guarantee they have specific methods:\n\n\`\`\`ts\ninterface Serializable {\n  serialize(): string;\n  deserialize(data: string): void;\n}\n\ninterface Cacheable {\n  getCacheKey(): string;\n  getTTL(): number;\n}\n\n// A class can implement multiple interfaces\nclass UserRepository implements Serializable, Cacheable {\n  serialize(): string {\n    return JSON.stringify(this);\n  }\n\n  deserialize(data: string): void {\n    Object.assign(this, JSON.parse(data));\n  }\n\n  getCacheKey(): string {\n    return "user-repository";\n  }\n\n  getTTL(): number {\n    return 3600; // 1 hour\n  }\n}\n\`\`\`\n\n## Static Members\n\n\`\`\`ts\nclass Counter {\n  private static count = 0;\n\n  static increment(): void {\n    Counter.count++;\n  }\n\n  static getCount(): number {\n    return Counter.count;\n  }\n}\n\nCounter.increment();\nCounter.increment();\nconsole.log(Counter.getCount()); // 2\n\`\`\``,
    codeExamples: [
      {
        title: 'Constructor shorthand — the most used TypeScript class feature',
        code: `// This is the most common TypeScript class pattern
class UserService {
  constructor(
    private readonly db: Database,
    private readonly cache: Cache,
    private readonly logger: Logger,
  ) {}
  // db, cache, logger are now private readonly class properties
  // No need to write this.db = db etc.

  async findById(id: string): Promise<User | null> {
    const cached = await this.cache.get(\`user:\${id}\`);
    if (cached) return JSON.parse(cached) as User;

    const user = await this.db.users.findUnique({ where: { id } });
    if (user) {
      await this.cache.set(\`user:\${id}\`, JSON.stringify(user), 3600);
    }
    return user;
  }
}

// Usage — TypeScript knows the constructor signature
const service = new UserService(db, cache, logger);`,
        explanation: 'Constructor shorthand (private readonly in constructor params) is idiomatic TypeScript. It eliminates boilerplate property declaration and assignment.',
      },
      {
        title: 'Abstract class — template method pattern',
        code: `abstract class EmailTemplate {
  // Abstract — must be implemented by subclasses
  abstract getSubject(): string;
  abstract getBody(context: Record<string, string>): string;

  // Concrete — shared by all templates
  protected formatFooter(): string {
    return "\\n\\nBest regards,\\nThe Team";
  }

  // Template method — defines the algorithm
  render(context: Record<string, string>): { subject: string; body: string } {
    return {
      subject: this.getSubject(),
      body: this.getBody(context) + this.formatFooter(),
    };
  }
}

class WelcomeEmail extends EmailTemplate {
  getSubject(): string {
    return "Welcome to our platform!";
  }

  getBody(context: Record<string, string>): string {
    return \`Hello \${context.name},\\n\\nWelcome aboard!\`;
  }
}

class PasswordResetEmail extends EmailTemplate {
  getSubject(): string {
    return "Password Reset Request";
  }

  getBody(context: Record<string, string>): string {
    return \`Click here to reset your password: \${context.resetLink}\`;
  }
}

const welcome = new WelcomeEmail();
const result = welcome.render({ name: "Alice" });
console.log(result.subject); // "Welcome to our platform!"`,
        explanation: 'Abstract classes define the skeleton (the render method) while subclasses fill in the specific parts (getSubject, getBody). This is the Template Method pattern.',
      },
      {
        title: 'Class implementing an interface — dependency injection',
        code: `// Define the contract (interface)
interface NotificationService {
  send(to: string, message: string): Promise<void>;
  sendBulk(recipients: string[], message: string): Promise<void>;
}

// Email implementation
class EmailNotificationService implements NotificationService {
  constructor(private apiKey: string) {}

  async send(to: string, message: string): Promise<void> {
    console.log(\`Sending email to \${to}: \${message}\`);
    // SendGrid API call here
  }

  async sendBulk(recipients: string[], message: string): Promise<void> {
    await Promise.all(recipients.map(r => this.send(r, message)));
  }
}

// SMS implementation
class SmsNotificationService implements NotificationService {
  constructor(private twilioClient: any) {}

  async send(to: string, message: string): Promise<void> {
    console.log(\`Sending SMS to \${to}: \${message}\`);
    // Twilio API call here
  }

  async sendBulk(recipients: string[], message: string): Promise<void> {
    await Promise.all(recipients.map(r => this.send(r, message)));
  }
}

// Consumer — uses the interface, not the concrete class
class UserController {
  constructor(private notifications: NotificationService) {}

  async onUserRegistered(user: User): Promise<void> {
    await this.notifications.send(user.email, "Welcome!");
  }
}

// Swap implementations without changing UserController
const emailCtrl = new UserController(new EmailNotificationService("key"));
const smsCtrl = new UserController(new SmsNotificationService(client));`,
        explanation: 'Programming to interfaces (NotificationService) instead of concrete classes allows you to swap implementations. This is dependency injection and the Open/Closed principle.',
      },
    ],
    commonMistakes: [
      'Thinking private is enforced at runtime — it is only compile-time. Use # for true runtime privacy.',
      'Forgetting to call super() in subclass constructors — TypeScript (and JavaScript) require this.',
      'Using classes for everything — for simple data bags, interfaces or type aliases are cleaner.',
      'Not using constructor shorthand — writing this.db = db explicitly when the shorthand does it for you.',
      'Implementing interfaces with optional methods — interface methods are required by default.',
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between private and # (private class fields)?',
        answer: 'TypeScript\'s private modifier is compile-time only — the property is still accessible at runtime via JavaScript. The # syntax (native private class fields from ES2022) is enforced at runtime — the property truly cannot be accessed outside the class. In modern TypeScript, # is preferred when you need true runtime privacy. TypeScript\'s private is useful for catching accidental access in your own codebase.',
        difficulty: 'intermediate',
      },
      {
        question: 'What is an abstract class and when do you use it?',
        answer: 'An abstract class is a class that cannot be instantiated directly — it must be extended. It can have abstract methods (no implementation — subclasses must provide them) and concrete methods (shared implementation). Use abstract classes when you have shared behavior but each subclass needs to implement specific parts — like a template method pattern. If you only need a contract (no shared implementation), use an interface instead.',
        difficulty: 'intermediate',
      },
      {
        question: 'What does TypeScript\'s constructor shorthand do?',
        answer: 'When you add an access modifier (public, private, protected) or readonly to a constructor parameter, TypeScript automatically creates a class property with that name and assigns the parameter to it. So constructor(private name: string) {} is equivalent to declaring private name: string and writing this.name = name inside the constructor body. This reduces boilerplate.',
        difficulty: 'beginner',
      },
    ],
    exercises: [
      {
        id: 'ex-class-1',
        title: 'Build a generic typed event emitter',
        description: 'Create a typed EventEmitter class using generics so each event name maps to a specific handler signature.',
        starterCode: `// Build a typed event emitter
// EventMap is an object where keys are event names
// and values are the function signature for that event

// Example usage (what we want to achieve):
// const emitter = new TypedEmitter<{
//   login: (userId: string) => void;
//   logout: () => void;
//   error: (err: Error) => void;
// }>();
//
// emitter.on("login", (userId) => console.log(userId)); // userId is string
// emitter.on("unknown", () => {}); // Error: not a valid event

class TypedEmitter {
  // implement here
}`,
        solution: `class TypedEmitter<EventMap extends Record<string, (...args: any[]) => void>> {
  private listeners = {} as { [K in keyof EventMap]: EventMap[K][] };

  on<K extends keyof EventMap>(event: K, listener: EventMap[K]): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [] as any;
    }
    this.listeners[event].push(listener);
  }

  off<K extends keyof EventMap>(event: K, listener: EventMap[K]): void {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(l => l !== listener) as any;
    }
  }

  emit<K extends keyof EventMap>(event: K, ...args: Parameters<EventMap[K]>): void {
    this.listeners[event]?.forEach(listener => listener(...args));
  }
}

const emitter = new TypedEmitter<{
  login: (userId: string) => void;
  logout: () => void;
  error: (err: Error) => void;
}>();

emitter.on("login", (userId) => console.log("Logged in:", userId));
emitter.emit("login", "user-123");`,
        hints: ['EventMap extends Record<string, Function>', 'Use K extends keyof EventMap to type individual event names', 'Parameters<EventMap[K]> gives the arg types for each event'],
      },
    ],
    keyTakeaways: [
      'public, private, protected — access modifiers (compile-time only)',
      'Constructor shorthand: modifier in params auto-creates and assigns properties',
      'readonly prevents reassignment after construction',
      'Abstract classes: cannot instantiate, subclasses must implement abstract members',
      'implements: class must provide all interface methods',
      'Program to interfaces — enables dependency injection and easy swapping',
    ],
    prevLesson: 'utility-types',
    nextLesson: 'modules-project-structure',
  },

  // ─── MODULE 16: Modules and Project Structure ────────────────────────────────
  {
    id: 'modules-project-structure',
    slug: 'modules-project-structure',
    title: 'Modules and Project Structure',
    description: 'Organize TypeScript projects with imports, exports, barrel files, and scalable folder structures.',
    category: 'Real World',
    order: 16,
    difficulty: 'intermediate',
    estimatedTime: 25,
    content: `TypeScript uses the same ES module system as modern JavaScript — but adds type-level imports and better tooling support. This module covers how to organize TypeScript projects at scale.\n\n## Named vs Default Exports\n\n\`\`\`ts\n// Named exports — you can have many per file\nexport interface User { id: string; name: string; }\nexport type UserId = string;\nexport function createUser(data: CreateUserInput): User { /* ... */ }\nexport const DEFAULT_ROLE = "viewer";\n\n// Default export — one per file (common for components and classes)\nexport default class UserService { /* ... */ }\n\`\`\`\n\nImporting:\n\n\`\`\`ts\n// Named imports — must match the export name\nimport { User, createUser, DEFAULT_ROLE } from "./user";\n\n// Default import — any name works\nimport UserService from "./UserService";\n\n// Combine both\nimport UserService, { User, createUser } from "./user";\n\n// Import everything as a namespace\nimport * as UserModule from "./user";\nUserModule.createUser(...);\n\`\`\`\n\n## Type-Only Imports\n\nIn TypeScript, you can import types without including them in the JavaScript output:\n\n\`\`\`ts\n// import type — erased completely at compile time\nimport type { User, UserRole } from "./types";\nimport type { Request, Response } from "express";\n\n// Use when you only need the type, not the runtime value\n// Important for avoiding circular imports and reducing bundle size\n\`\`\`\n\n## Barrel Files (Index Files)\n\nA barrel file re-exports from multiple files as a single entry point:\n\n\`\`\`ts\n// src/services/index.ts\nexport { UserService } from "./UserService";\nexport { PostService } from "./PostService";\nexport { EmailService } from "./EmailService";\nexport type { ServiceConfig } from "./types";\n\n// Now callers import from one place:\nimport { UserService, PostService } from "@/services";\n// Instead of:\nimport { UserService } from "@/services/UserService";\nimport { PostService } from "@/services/PostService";\n\`\`\`\n\n## Recommended Project Structure — Node.js API\n\n\`\`\`\nsrc/\n├── types/           # Shared TypeScript types and interfaces\n│   ├── index.ts     # Barrel — re-exports all types\n│   ├── user.ts\n│   ├── post.ts\n│   └── api.ts\n├── services/        # Business logic\n│   ├── index.ts\n│   ├── UserService.ts\n│   └── PostService.ts\n├── repositories/    # Data access layer\n│   ├── index.ts\n│   └── UserRepository.ts\n├── controllers/     # HTTP request handlers\n│   ├── index.ts\n│   └── UserController.ts\n├── middleware/      # Express middleware\n│   ├── auth.ts\n│   └── validation.ts\n├── utils/           # Shared utilities\n│   ├── index.ts\n│   └── validation.ts\n└── index.ts         # App entry point\n\`\`\`\n\n## Recommended Project Structure — React/Next.js\n\n\`\`\`\nsrc/\n├── types/           # Shared types\n│   └── index.ts\n├── components/      # Reusable UI components\n│   ├── ui/          # Low-level (Button, Input, Modal)\n│   └── features/    # Feature-specific (UserCard, PostList)\n├── hooks/           # Custom hooks\n│   └── useUser.ts\n├── lib/             # Utilities, API clients\n│   └── api.ts\n├── store/           # State management\n│   └── userSlice.ts\n└── app/             # Next.js app router pages\n\`\`\`\n\n## Path Aliases\n\nConfigure TypeScript path aliases to avoid long relative imports:\n\n\`\`\`json\n// tsconfig.json\n{\n  "compilerOptions": {\n    "paths": {\n      "@/*": ["./src/*"],\n      "@types/*": ["./src/types/*"],\n      "@services/*": ["./src/services/*"]\n    }\n  }\n}\n\`\`\`\n\n\`\`\`ts\n// Before — relative hell\nimport { User } from "../../../types/user";\nimport { UserService } from "../../services/UserService";\n\n// After — clean aliases\nimport type { User } from "@/types";\nimport { UserService } from "@/services";\n\`\`\`\n\n## Declaration Files for JS Libraries\n\n\`\`\`ts\n// custom.d.ts — for JS files without types\ndeclare module "some-untyped-js-library" {\n  export function doThing(value: string): number;\n  export const VERSION: string;\n}\n\n// Augmenting existing types (declaration merging)\ndeclare module "express-serve-static-core" {\n  interface Request {\n    user?: AuthUser;\n    requestId: string;\n  }\n}\n\`\`\``,
    codeExamples: [
      {
        title: 'Barrel files — clean, organized imports',
        code: `// src/types/user.ts
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export type UserRole = "admin" | "editor" | "viewer";
export type CreateUserInput = Pick<User, "name" | "email"> & { password: string };
export type UpdateUserInput = Partial<Pick<User, "name" | "email">>;

// src/types/post.ts
export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  published: boolean;
}

// src/types/index.ts — barrel file
export type { User, UserRole, CreateUserInput, UpdateUserInput } from "./user";
export type { Post } from "./post";

// Anywhere in the app:
import type { User, Post, UserRole } from "@/types";
// Clean — no need to know which file each type lives in`,
        explanation: 'Barrel files create a single entry point for each module. Internal reorganization (moving types between files) does not break callers.',
      },
      {
        title: 'Type-only imports — keeping JS output clean',
        code: `// user.service.ts
import { Injectable } from "@nestjs/common";
import type { User, CreateUserInput } from "@/types"; // type-only — erased at runtime
import { hashPassword } from "@/utils/crypto"; // value import — kept at runtime
import type { Repository } from "typeorm"; // type-only

@Injectable()
export class UserService {
  constructor(private readonly userRepo: Repository<User>) {}

  async create(input: CreateUserInput): Promise<User> {
    const passwordHash = await hashPassword(input.password);
    return this.userRepo.save({ ...input, passwordHash });
  }
}

// Why import type matters:
// 1. Circular dependency prevention — type imports don't run module code
// 2. Bundle size — type imports have zero runtime cost (already true, but explicit)
// 3. Clarity — signals to readers this is used only for typing`,
        explanation: 'import type tells TypeScript and bundlers that these are type-level imports only. The output JS will have no trace of them. Use it for interfaces, types, and any import used only in type positions.',
      },
      {
        title: 'Scalable service structure with interfaces',
        code: `// src/services/user/types.ts
export interface IUserService {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(input: CreateUserInput): Promise<User>;
  update(id: string, input: UpdateUserInput): Promise<User>;
  delete(id: string): Promise<void>;
}

// src/services/user/UserService.ts
import type { IUserService } from "./types";
import type { User, CreateUserInput, UpdateUserInput } from "@/types";

export class UserService implements IUserService {
  constructor(
    private readonly db: Database,
    private readonly cache: CacheService,
  ) {}

  async findById(id: string): Promise<User | null> {
    const cached = await this.cache.get<User>(\`user:\${id}\`);
    if (cached) return cached;

    const user = await this.db.users.findFirst({ where: { id } });
    if (user) await this.cache.set(\`user:\${id}\`, user, 3600);
    return user;
  }

  // ... other methods
}

// src/services/index.ts
export { UserService } from "./user/UserService";
export type { IUserService } from "./user/types";`,
        explanation: 'Defining service interfaces separately from implementation enables testing (inject mock implementations) and keeps the codebase flexible.',
      },
    ],
    commonMistakes: [
      'Using default exports everywhere — named exports are easier to refactor and provide better autocomplete.',
      'Not using import type for type-only imports — imports that are only types should be explicit about it.',
      'Creating circular imports — barrel files can accidentally create cycles. If A imports from B and B imports from A, both will fail.',
      'Putting everything in a single types.ts file — split types by domain (user.ts, post.ts, api.ts) as the project grows.',
    ],
    interviewQuestions: [
      {
        question: 'What is a barrel file and what are its trade-offs?',
        answer: 'A barrel file (usually index.ts) re-exports symbols from multiple files, creating a single entry point. Benefit: callers import from one location regardless of how files are organized internally. Trade-off: barrel files can create circular dependency issues and can slow down build tools because they force importing the entire module even when only one export is needed. In large projects, consider using direct imports for frequently-used utilities.',
        difficulty: 'intermediate',
      },
      {
        question: 'What is import type and when should you use it?',
        answer: 'import type imports only type information — it is completely erased from the output JavaScript. Use it for any import that is only used in type positions (interface, type annotations). Benefits: prevents accidental runtime usage, signals intent to readers, can help avoid circular dependencies (type imports do not trigger module execution), and is required by some tools like isolatedModules mode.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'ex-modules-1',
        title: 'Organize a feature module',
        description: 'Create the barrel index.ts that correctly exports types and implementations for a user module.',
        starterCode: `// Assume these files exist:
// user/model.ts — exports: User interface, UserRole type
// user/service.ts — exports: UserService class, IUserService interface
// user/dto.ts — exports: CreateUserDTO, UpdateUserDTO, UserResponseDTO

// Create user/index.ts that:
// 1. Re-exports User and UserRole as type-only exports
// 2. Re-exports UserService as a value export
// 3. Re-exports IUserService as a type-only export
// 4. Re-exports all DTO types as type-only exports

// user/index.ts
`,
        solution: `// user/index.ts

// Type-only re-exports (no runtime impact)
export type { User, UserRole } from "./model";
export type { IUserService } from "./service";
export type { CreateUserDTO, UpdateUserDTO, UserResponseDTO } from "./dto";

// Value export — the actual class (has runtime presence)
export { UserService } from "./service";`,
        hints: ['Use export type { ... } from for interfaces and types', 'Use export { ... } from for classes and functions'],
      },
    ],
    keyTakeaways: [
      'Named exports are preferred over default exports — easier to refactor',
      'import type — erased at compile time, signals type-only usage',
      'Barrel files (index.ts) — single import point for a module',
      'Path aliases (@/types, @/services) eliminate long relative import paths',
      'Organize by domain: each feature/domain has its own folder with types, service, and index',
    ],
    prevLesson: 'classes-typescript',
    nextLesson: 'error-handling',
  },

  // ─── MODULE 17: Error Handling ───────────────────────────────────────────────
  {
    id: 'error-handling',
    slug: 'error-handling',
    title: 'Error Handling in TypeScript',
    description: 'Type errors safely with unknown, build custom error classes, and use Result types for predictable error handling.',
    category: 'Real World',
    order: 17,
    difficulty: 'intermediate',
    estimatedTime: 25,
    content: `Error handling in TypeScript requires understanding how \`catch\` blocks type errors and how to design safe error patterns for production applications.\n\n## The Problem with catch(e)\n\nIn TypeScript with \`strict\` mode (specifically \`useUnknownInCatchVariables\`), caught errors have type \`unknown\`:\n\n\`\`\`ts\ntry {\n  await fetchUser(id);\n} catch (error) {\n  // error is: unknown (in strict mode)\n  console.log(error.message); // Error: 'error' is of type 'unknown'\n}\n\`\`\`\n\nThis is correct — anything can be thrown: Error objects, strings, numbers, null. You cannot assume the caught value has a \`.message\` property.\n\n## Safe Error Handling Pattern\n\n\`\`\`ts\ntry {\n  await fetchUser(id);\n} catch (error) {\n  if (error instanceof Error) {\n    console.log(error.message); // Safe — we checked it's an Error\n  } else {\n    console.log("Unknown error:", String(error));\n  }\n}\n\n// Helper function for extracting error messages\nfunction getErrorMessage(error: unknown): string {\n  if (error instanceof Error) return error.message;\n  if (typeof error === "string") return error;\n  return "An unknown error occurred";\n}\n\`\`\`\n\n## Custom Error Classes\n\n\`\`\`ts\n// Base application error\nclass AppError extends Error {\n  constructor(\n    message: string,\n    public readonly code: string,\n    public readonly statusCode: number = 500,\n  ) {\n    super(message);\n    this.name = "AppError"; // Important for instanceof checks\n    Object.setPrototypeOf(this, AppError.prototype); // ES5 fix\n  }\n}\n\n// Domain-specific errors\nclass NotFoundError extends AppError {\n  constructor(resource: string, id: string) {\n    super(\`\${resource} with id \${id} not found\`, "NOT_FOUND", 404);\n    this.name = "NotFoundError";\n    Object.setPrototypeOf(this, NotFoundError.prototype);\n  }\n}\n\nclass ValidationError extends AppError {\n  constructor(\n    message: string,\n    public readonly fields: Record<string, string[]>,\n  ) {\n    super(message, "VALIDATION_ERROR", 400);\n    this.name = "ValidationError";\n    Object.setPrototypeOf(this, ValidationError.prototype);\n  }\n}\n\n// Using them\ntry {\n  throw new NotFoundError("User", "123");\n} catch (error) {\n  if (error instanceof NotFoundError) {\n    console.log(error.statusCode); // 404\n  } else if (error instanceof ValidationError) {\n    console.log(error.fields);    // Record of field errors\n  } else if (error instanceof AppError) {\n    console.log(error.code);      // Generic app error\n  }\n}\n\`\`\`\n\n## Result Type Pattern — No Exceptions\n\nA functional approach where errors are values, not exceptions:\n\n\`\`\`ts\ntype Success<T> = { ok: true; data: T };\ntype Failure<E> = { ok: false; error: E };\ntype Result<T, E = Error> = Success<T> | Failure<E>;\n\n// Helper constructors\nconst ok = <T>(data: T): Success<T> => ({ ok: true, data });\nconst fail = <E>(error: E): Failure<E> => ({ ok: false, error });\n\n// Usage — function that never throws\nasync function findUser(id: string): Promise<Result<User, AppError>> {\n  try {\n    const user = await db.findUser(id);\n    if (!user) return fail(new NotFoundError("User", id));\n    return ok(user);\n  } catch (error) {\n    return fail(new AppError(getErrorMessage(error), "DATABASE_ERROR"));\n  }\n}\n\n// Caller handles both cases explicitly — no surprise throws\nconst result = await findUser("123");\nif (result.ok) {\n  console.log(result.data.name); // User\n} else {\n  console.log(result.error.message); // Error\n}\n\`\`\`\n\n## Error Handling in Express\n\n\`\`\`ts\n// Global error handler middleware\nfunction errorHandler(\n  error: unknown,\n  req: Request,\n  res: Response,\n  next: NextFunction,\n): void {\n  if (error instanceof ValidationError) {\n    res.status(400).json({\n      error: error.message,\n      fields: error.fields,\n    });\n  } else if (error instanceof NotFoundError) {\n    res.status(404).json({ error: error.message });\n  } else if (error instanceof AppError) {\n    res.status(error.statusCode).json({ error: error.message });\n  } else {\n    res.status(500).json({ error: "Internal server error" });\n  }\n}\n\`\`\``,
    codeExamples: [
      {
        title: 'Safe error handling utilities',
        code: `// Type-safe error message extraction
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  if (typeof error === "object" && error !== null) {
    if ("message" in error && typeof (error as any).message === "string") {
      return (error as any).message;
    }
  }
  return String(error);
}

// Wrap any async operation — never throws
async function tryCatch<T>(
  fn: () => Promise<T>
): Promise<[T, null] | [null, Error]> {
  try {
    const result = await fn();
    return [result, null];
  } catch (error) {
    const err = error instanceof Error ? error : new Error(getErrorMessage(error));
    return [null, err];
  }
}

// Usage
const [user, err] = await tryCatch(() => db.findUser("123"));
if (err) {
  console.error("Failed to find user:", err.message);
  return;
}
console.log(user.name); // TypeScript knows user is not null here`,
        explanation: 'getErrorMessage handles all possible thrown values safely. tryCatch converts async exceptions to tuple returns — no try/catch noise in business logic.',
      },
      {
        title: 'Custom error hierarchy',
        code: `class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  toJSON() {
    return {
      error: this.message,
      code: this.code,
      statusCode: this.statusCode,
      details: this.details,
    };
  }
}

class NotFoundError extends AppError {
  constructor(resource: string, id: string | number) {
    super(\`\${resource} not found\`, "NOT_FOUND", 404, { resource, id });
  }
}

class UnauthorizedError extends AppError {
  constructor(reason = "Authentication required") {
    super(reason, "UNAUTHORIZED", 401);
  }
}

class ForbiddenError extends AppError {
  constructor(action: string) {
    super(\`You are not allowed to \${action}\`, "FORBIDDEN", 403, { action });
  }
}

class ValidationError extends AppError {
  constructor(public readonly fields: Record<string, string[]>) {
    super("Validation failed", "VALIDATION_ERROR", 400, { fields });
  }
}

// Type guard for AppError
function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}`,
        explanation: 'Object.setPrototypeOf(this, new.target.prototype) fixes the instanceof check in ES5 targets. Each error subclass carries domain-specific data.',
      },
      {
        title: 'Result type in a real service',
        code: `type Result<T, E extends AppError = AppError> =
  | { success: true; data: T }
  | { success: false; error: E };

class UserService {
  async createUser(
    input: CreateUserInput
  ): Promise<Result<User, ValidationError | AppError>> {
    // Validate
    const errors = validateUserInput(input);
    if (Object.keys(errors).length > 0) {
      return { success: false, error: new ValidationError(errors) };
    }

    // Check duplicate
    const existing = await this.db.findByEmail(input.email);
    if (existing) {
      return {
        success: false,
        error: new ValidationError({ email: ["Email already in use"] }),
      };
    }

    // Create
    try {
      const user = await this.db.create(input);
      return { success: true, data: user };
    } catch (err) {
      return {
        success: false,
        error: new AppError("Failed to create user", "DB_ERROR"),
      };
    }
  }
}

// Controller — handles the Result
app.post("/users", async (req, res) => {
  const result = await userService.createUser(req.body);
  if (!result.success) {
    return res.status(result.error.statusCode).json(result.error.toJSON());
  }
  res.status(201).json(result.data);
});`,
        explanation: 'The Result pattern makes error cases explicit in the function signature. The controller does not need try/catch — all outcomes are typed values.',
      },
    ],
    commonMistakes: [
      'Using catch(error: Error) — TypeScript does not allow typing catch parameters (error is always unknown).',
      'Accessing error.message without checking instanceof Error first — any value can be thrown.',
      'Forgetting Object.setPrototypeOf in custom error classes — breaks instanceof checks in ES5 output.',
      'Throwing strings — always throw Error instances or subclasses. Strings have no stack trace.',
    ],
    interviewQuestions: [
      {
        question: 'Why is the caught error typed as unknown in TypeScript?',
        answer: 'Because JavaScript allows throwing any value — objects, strings, numbers, null, anything. It would be incorrect for TypeScript to assume caught errors are Error instances. With strict mode, the catch variable is typed as unknown, forcing you to narrow the type before using it. This prevents runtime crashes from assuming error.message exists when the thrown value might be a string or number.',
        difficulty: 'intermediate',
      },
      {
        question: 'What is the Result pattern and when should you use it?',
        answer: 'The Result (or Either) pattern represents the outcome of an operation as a typed value rather than an exception. The function returns Success<T> or Failure<E> — callers must handle both cases at compile time. Use it for expected failure scenarios (not found, validation errors) where the caller needs to decide what to do. Still use exceptions for truly unexpected errors (bugs, infrastructure failures).',
        difficulty: 'advanced',
      },
    ],
    exercises: [
      {
        id: 'ex-error-1',
        title: 'Build a safe JSON parser',
        description: 'Write a safeJsonParse function that returns a Result type instead of throwing.',
        starterCode: `// JSON.parse throws on invalid input.
// Write safeJsonParse<T> that:
// 1. Returns { success: true; data: T } on valid JSON
// 2. Returns { success: false; error: string } on invalid JSON
// 3. Never throws

type ParseResult<T> = // your Result type

function safeJsonParse<T>(input: string): ParseResult<T> {
  // implement
}

// Test cases:
const r1 = safeJsonParse<{ name: string }>('{"name":"Alice"}');
const r2 = safeJsonParse<{ name: string }>("not json");`,
        solution: `type ParseResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

function safeJsonParse<T>(input: string): ParseResult<T> {
  try {
    const data = JSON.parse(input) as T;
    return { success: true, data };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid JSON";
    return { success: false, error: message };
  }
}

const r1 = safeJsonParse<{ name: string }>('{"name":"Alice"}');
if (r1.success) console.log(r1.data.name); // "Alice"

const r2 = safeJsonParse<{ name: string }>("not json");
if (!r2.success) console.log(r2.error); // "Unexpected token..."`,
        hints: ['Wrap JSON.parse in try/catch', 'Return the two variants based on success/failure', 'Extract error message safely with instanceof Error check'],
      },
    ],
    keyTakeaways: [
      'Caught errors are typed as unknown — always check instanceof Error before using',
      'Custom error classes extend Error and carry domain-specific data',
      'Object.setPrototypeOf fixes instanceof for custom errors in ES5',
      'Result pattern: errors as values — forces callers to handle both cases',
      'getErrorMessage helper safely extracts message from any thrown value',
    ],
    prevLesson: 'modules-project-structure',
    nextLesson: 'typescript-react',
  },

  // ─── MODULE 18: TypeScript with React ───────────────────────────────────────
  {
    id: 'typescript-react',
    slug: 'typescript-react',
    title: 'TypeScript with React',
    description: 'Type React components, props, state, events, hooks, context, and refs in real-world applications.',
    category: 'Frontend',
    order: 18,
    difficulty: 'intermediate',
    estimatedTime: 45,
    content: `This module focuses entirely on TypeScript's additions to React. You already know React from the JavaScript track — here we cover how TypeScript makes React safer and more maintainable.\n\n## Component Props\n\n\`\`\`tsx\n// Define props with an interface\ninterface ButtonProps {\n  label: string;\n  onClick: () => void;\n  variant?: "primary" | "secondary" | "danger";\n  disabled?: boolean;\n  children?: React.ReactNode;\n}\n\nfunction Button({ label, onClick, variant = "primary", disabled = false }: ButtonProps) {\n  return (\n    <button\n      onClick={onClick}\n      disabled={disabled}\n      className={\`btn btn-\${variant}\`}\n    >\n      {label}\n    </button>\n  );\n}\n\n// TypeScript ensures correct usage:\n<Button label="Click me" onClick={() => {}} />              // OK\n<Button onClick={() => {}} />                               // Error: label is required\n<Button label="Go" onClick={() => {}} variant="invalid" />  // Error: invalid variant\n\`\`\`\n\n## React.FC vs Plain Function\n\n\`\`\`tsx\n// React.FC (or React.FunctionComponent) — adds children and other React types\nconst Button: React.FC<ButtonProps> = ({ label, onClick }) => (\n  <button onClick={onClick}>{label}</button>\n);\n\n// Plain function — generally preferred in modern React\nfunction Button({ label, onClick }: ButtonProps) {\n  return <button onClick={onClick}>{label}</button>;\n}\n\n// Why plain functions are preferred:\n// 1. Simpler — no wrapping in React.FC\n// 2. Return type is inferred correctly\n// 3. React.FC used to add children implicitly (fixed in React 18)\n\`\`\`\n\n## State Typing with useState\n\n\`\`\`tsx\n// TypeScript infers state type from initial value\nconst [count, setCount] = useState(0);           // number\nconst [name, setName] = useState("");            // string\nconst [active, setActive] = useState(false);    // boolean\n\n// Explicit type for complex initial values\nconst [user, setUser] = useState<User | null>(null);\nconst [users, setUsers] = useState<User[]>([]);\n\n// State with union types\ntype Status = "idle" | "loading" | "success" | "error";\nconst [status, setStatus] = useState<Status>("idle");\n\`\`\`\n\n## Event Typing\n\n\`\`\`tsx\n// Input change event\nfunction handleChange(event: React.ChangeEvent<HTMLInputElement>): void {\n  setName(event.target.value);\n}\n\n// Form submit event\nfunction handleSubmit(event: React.FormEvent<HTMLFormElement>): void {\n  event.preventDefault();\n  // process form\n}\n\n// Button click event\nfunction handleClick(event: React.MouseEvent<HTMLButtonElement>): void {\n  console.log("Clicked at:", event.clientX, event.clientY);\n}\n\n// Select change\nfunction handleSelect(event: React.ChangeEvent<HTMLSelectElement>): void {\n  setRole(event.target.value as UserRole);\n}\n\`\`\`\n\n## useRef Typing\n\n\`\`\`tsx\n// Ref to a DOM element\nconst inputRef = useRef<HTMLInputElement>(null);\n\n// Access safely — ref.current can be null before mount\nconst focusInput = () => {\n  inputRef.current?.focus();\n};\n\n// Mutable ref for storing values (not DOM)\nconst timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);\n\n<input ref={inputRef} type="text" />\n\`\`\`\n\n## useReducer Typing\n\n\`\`\`tsx\ntype CounterAction =\n  | { type: "INCREMENT"; amount: number }\n  | { type: "DECREMENT"; amount: number }\n  | { type: "RESET" };\n\ninterface CounterState {\n  count: number;\n  history: number[];\n}\n\nfunction counterReducer(state: CounterState, action: CounterAction): CounterState {\n  switch (action.type) {\n    case "INCREMENT":\n      return { count: state.count + action.amount, history: [...state.history, state.count] };\n    case "DECREMENT":\n      return { count: state.count - action.amount, history: [...state.history, state.count] };\n    case "RESET":\n      return { count: 0, history: [] };\n  }\n}\n\nconst [state, dispatch] = useReducer(counterReducer, { count: 0, history: [] });\ndispatch({ type: "INCREMENT", amount: 5 }); // TypeScript checks action shape\n\`\`\`\n\n## Context API Typing\n\n\`\`\`tsx\ninterface AuthContextValue {\n  user: User | null;\n  login: (email: string, password: string) => Promise<void>;\n  logout: () => void;\n  isLoading: boolean;\n}\n\nconst AuthContext = createContext<AuthContextValue | null>(null);\n\n// Custom hook that guarantees context is available\nfunction useAuth(): AuthContextValue {\n  const ctx = useContext(AuthContext);\n  if (!ctx) throw new Error("useAuth must be used within AuthProvider");\n  return ctx;\n}\n\nfunction AuthProvider({ children }: { children: React.ReactNode }) {\n  const [user, setUser] = useState<User | null>(null);\n  const [isLoading, setIsLoading] = useState(false);\n\n  const login = async (email: string, password: string) => { /* ... */ };\n  const logout = () => setUser(null);\n\n  return (\n    <AuthContext.Provider value={{ user, login, logout, isLoading }}>\n      {children}\n    </AuthContext.Provider>\n  );\n}\n\`\`\`\n\n## API Response Types\n\n\`\`\`tsx\ninterface ApiUser {\n  id: string;\n  name: string;\n  email: string;\n}\n\nfunction useUser(id: string) {\n  const [user, setUser] = useState<ApiUser | null>(null);\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState<string | null>(null);\n\n  useEffect(() => {\n    fetch(\`/api/users/\${id}\`)\n      .then(r => r.json() as Promise<ApiUser>)\n      .then(setUser)\n      .catch(err => setError(getErrorMessage(err)))\n      .finally(() => setLoading(false));\n  }, [id]);\n\n  return { user, loading, error };\n}\n\`\`\``,
    codeExamples: [
      {
        title: 'Fully typed React component',
        code: `interface CardProps {
  title: string;
  description: string;
  image?: string;
  tags?: string[];
  onTagClick?: (tag: string) => void;
  footer?: React.ReactNode;
  className?: string;
}

function Card({
  title,
  description,
  image,
  tags = [],
  onTagClick,
  footer,
  className = "",
}: CardProps) {
  return (
    <div className={\`card \${className}\`}>
      {image && <img src={image} alt={title} />}
      <h2>{title}</h2>
      <p>{description}</p>
      {tags.length > 0 && (
        <div className="tags">
          {tags.map(tag => (
            <span
              key={tag}
              onClick={onTagClick ? () => onTagClick(tag) : undefined}
              className="tag"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
}

// Usage — TypeScript ensures correct props
<Card
  title="TypeScript"
  description="A typed superset of JavaScript"
  tags={["language", "microsoft"]}
  onTagClick={(tag) => console.log(tag)} // tag is string
/>`,
        explanation: 'React.ReactNode is the type for anything renderable (JSX, string, null, array). Optional props use ? and can have defaults. Children are typed as React.ReactNode.',
      },
      {
        title: 'Typed form with controlled inputs',
        code: `interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

function LoginForm({ onSubmit }: { onSubmit: (data: LoginFormData) => Promise<void> }) {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await onSubmit(formData);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" value={formData.email} onChange={handleChange} />
      <input name="password" type="password" value={formData.password} onChange={handleChange} />
      <input name="rememberMe" type="checkbox" checked={formData.rememberMe} onChange={handleChange} />
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}`,
        explanation: 'The form state type LoginFormData ensures all fields are accounted for. Event types (React.ChangeEvent, React.FormEvent) give access to the correct target properties.',
      },
      {
        title: 'Generic data table component',
        code: `interface Column<T> {
  key: keyof T;
  header: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (row: T) => string;
  onRowClick?: (row: T) => void;
}

function DataTable<T>({ data, columns, keyExtractor, onRowClick }: DataTableProps<T>) {
  return (
    <table>
      <thead>
        <tr>
          {columns.map(col => (
            <th key={String(col.key)}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map(row => (
          <tr key={keyExtractor(row)} onClick={() => onRowClick?.(row)}>
            {columns.map(col => (
              <td key={String(col.key)}>
                {col.render
                  ? col.render(row[col.key], row)
                  : String(row[col.key])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Usage — fully typed for User
<DataTable<User>
  data={users}
  keyExtractor={u => u.id}
  columns={[
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    { key: "role", header: "Role", render: (role) => <Badge>{role}</Badge> },
  ]}
  onRowClick={(user) => navigate(\`/users/\${user.id}\`)}
/>`,
        explanation: 'Generic components are powerful — DataTable works with any data type. TypeScript ensures column keys are valid properties of T and values are typed correctly.',
      },
    ],
    commonMistakes: [
      'Using any for event handlers — always use React.ChangeEvent<HTMLInputElement>, React.FormEvent<HTMLFormElement>, etc.',
      'Not typing useState initial value when it starts as null or empty array — add the generic: useState<User | null>(null).',
      'Forgetting the null check on useRef.current — it is null before the component mounts.',
      'Using React.FC when a plain function suffices — React.FC adds complexity and was controversial in older React.',
      'Not creating a custom hook wrapper for context — always check for null context and throw a descriptive error.',
    ],
    interviewQuestions: [
      {
        question: 'How do you type React component props?',
        answer: 'Define an interface (or type alias) for props, then use it as the parameter type for the function. Use ? for optional props and provide defaults in destructuring. For children, use React.ReactNode for anything renderable. TypeScript then verifies all usages of the component — missing required props, wrong types, and invalid values are caught at compile time.',
        difficulty: 'beginner',
      },
      {
        question: 'How do you type the Context API?',
        answer: 'Create the context with createContext<ValueType | null>(null) — null as initial value signals the context has not been provided. Create a custom hook (useMyContext) that reads the context, checks for null, and throws a descriptive error if null. This prevents using the context outside its provider and removes the null from the return type in components.',
        difficulty: 'intermediate',
      },
      {
        question: 'What is the difference between React.FC and a plain function component?',
        answer: 'React.FC (FunctionComponent) is a generic type that wraps your props type. Modern React (18+) no longer adds children to props automatically. Plain function components are simpler, have cleaner TypeScript output, and are the current recommendation. Use plain functions. Only use React.FC when you need its specific type helpers (like the component displayName or defaultProps types).',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'ex-react-1',
        title: 'Type a custom hook for data fetching',
        description: 'Build a typed useFetch hook that returns data, loading, and error states with proper types.',
        starterCode: `// Build a generic useFetch<T> hook
// It should:
// 1. Accept a URL string
// 2. Return { data: T | null, loading: boolean, error: string | null }
// 3. Fetch on mount and when url changes
// 4. Handle errors safely

function useFetch(url) {
  // implement with types
}

// Usage:
const { data, loading, error } = useFetch<User[]>("/api/users");
if (data) {
  data.forEach(user => console.log(user.name)); // user is User
}`,
        solution: `import { useState, useEffect } from "react";

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function useFetch<T>(url: string): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    setState(prev => ({ ...prev, loading: true, error: null }));

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
        return res.json() as Promise<T>;
      })
      .then(data => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch(err => {
        if (!cancelled) {
          setState({ data: null, loading: false, error: err instanceof Error ? err.message : "Error" });
        }
      });

    return () => { cancelled = true; };
  }, [url]);

  return state;
}`,
        hints: ['Use useState<FetchState<T>> to type the entire state object', 'Set cancelled = true in cleanup to prevent state updates after unmount', 'Cast the JSON response: res.json() as Promise<T>'],
      },
    ],
    keyTakeaways: [
      'Props — interface with optional (?) properties and React.ReactNode for children',
      'useState — TypeScript infers from initial value; add generic for null/empty initial values',
      'Events — React.ChangeEvent<HTMLInputElement>, React.FormEvent<HTMLFormElement>, etc.',
      'useRef — useRef<HTMLElement>(null); access with optional chaining: ref.current?.method()',
      'Context — createContext<T | null>(null) + custom hook with null guard',
      'Generic components — make reusable components work with any typed data',
    ],
    prevLesson: 'error-handling',
    nextLesson: 'typescript-nextjs',
  },

  // ─── MODULE 19: TypeScript with Next.js ─────────────────────────────────────
  {
    id: 'typescript-nextjs',
    slug: 'typescript-nextjs',
    title: 'TypeScript with Next.js',
    description: 'Type Next.js App Router pages, API routes, Server Actions, data fetching, route parameters, and environment variables.',
    category: 'Frontend',
    order: 19,
    difficulty: 'intermediate',
    estimatedTime: 35,
    content: `Next.js is built with TypeScript-first in mind. The App Router (Next.js 13+) provides TypeScript types for pages, layouts, route parameters, and more.\n\n## Page Component Types\n\n\`\`\`tsx\n// app/page.tsx — root page, no params\nexport default function HomePage() {\n  return <h1>Home</h1>;\n}\n\n// app/users/[id]/page.tsx — dynamic route\ninterface PageProps {\n  params: { id: string };\n  searchParams: { [key: string]: string | string[] | undefined };\n}\n\nexport default function UserPage({ params, searchParams }: PageProps) {\n  const { id } = params; // string\n  const tab = searchParams.tab; // string | string[] | undefined\n  return <div>User: {id}</div>;\n}\n\`\`\`\n\n## generateStaticParams\n\n\`\`\`tsx\n// app/posts/[slug]/page.tsx\ninterface PageProps {\n  params: { slug: string };\n}\n\nexport async function generateStaticParams(): Promise<{ slug: string }[]> {\n  const posts = await fetchAllPosts();\n  return posts.map(post => ({ slug: post.slug }));\n}\n\nexport default async function PostPage({ params }: PageProps) {\n  const post = await fetchPost(params.slug);\n  if (!post) notFound();\n  return <article>{post.title}</article>;\n}\n\`\`\`\n\n## generateMetadata\n\n\`\`\`tsx\nimport type { Metadata } from "next";\n\ninterface PageProps {\n  params: { id: string };\n}\n\nexport async function generateMetadata({ params }: PageProps): Promise<Metadata> {\n  const user = await fetchUser(params.id);\n  return {\n    title: user?.name ?? "User Not Found",\n    description: user?.bio,\n    openGraph: {\n      title: user?.name ?? "User",\n      images: user?.avatar ? [user.avatar] : [],\n    },\n  };\n}\n\`\`\`\n\n## Route Handlers (API Routes)\n\n\`\`\`tsx\n// app/api/users/route.ts\nimport { NextRequest, NextResponse } from "next/server";\n\nexport async function GET(request: NextRequest): Promise<NextResponse> {\n  const searchParams = request.nextUrl.searchParams;\n  const page = Number(searchParams.get("page") ?? 1);\n\n  const users = await db.users.findMany({\n    skip: (page - 1) * 10,\n    take: 10,\n  });\n\n  return NextResponse.json({ users, page });\n}\n\nexport async function POST(request: NextRequest): Promise<NextResponse> {\n  const body: CreateUserInput = await request.json();\n  const user = await userService.create(body);\n  return NextResponse.json(user, { status: 201 });\n}\n\n// app/api/users/[id]/route.ts — dynamic route handler\nexport async function GET(\n  request: NextRequest,\n  { params }: { params: { id: string } }\n): Promise<NextResponse> {\n  const user = await db.users.findUnique({ where: { id: params.id } });\n  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });\n  return NextResponse.json(user);\n}\n\`\`\`\n\n## Server Actions\n\n\`\`\`tsx\n// app/actions/user.ts\n"use server";\n\nimport { revalidatePath } from "next/cache";\n\nexport async function createUserAction(\n  prevState: { error: string | null },\n  formData: FormData\n): Promise<{ error: string | null }> {\n  const name = formData.get("name") as string;\n  const email = formData.get("email") as string;\n\n  if (!name || !email) {\n    return { error: "Name and email are required" };\n  }\n\n  try {\n    await userService.create({ name, email });\n    revalidatePath("/users");\n    return { error: null };\n  } catch (err) {\n    return { error: getErrorMessage(err) };\n  }\n}\n\n// app/users/new/page.tsx — using the action\n"use client";\nimport { useActionState } from "react";\nimport { createUserAction } from "@/app/actions/user";\n\nexport default function NewUserPage() {\n  const [state, action] = useActionState(createUserAction, { error: null });\n  return (\n    <form action={action}>\n      <input name="name" />\n      <input name="email" type="email" />\n      {state.error && <p>{state.error}</p>}\n      <button type="submit">Create User</button>\n    </form>\n  );\n}\n\`\`\`\n\n## Environment Variables\n\n\`\`\`ts\n// src/lib/env.ts — typed environment variables\nconst env = {\n  DATABASE_URL: process.env.DATABASE_URL!,\n  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET!,\n  NEXTAUTH_URL: process.env.NEXTAUTH_URL!,\n  // NEXT_PUBLIC_ prefix — available in browser\n  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL!,\n} as const;\n\n// Validate on startup\nfunction validateEnv() {\n  const required = ["DATABASE_URL", "NEXTAUTH_SECRET"];\n  for (const key of required) {\n    if (!process.env[key]) {\n      throw new Error(\`Missing required environment variable: \${key}\`);\n    }\n  }\n}\n\nexport { env };\n\`\`\``,
    codeExamples: [
      {
        title: 'Next.js page with data fetching',
        code: `// app/dashboard/page.tsx
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  revenue: number;
  recentOrders: Order[];
}

async function getDashboardStats(): Promise<DashboardStats> {
  const [users, revenue, orders] = await Promise.all([
    db.users.count(),
    db.orders.aggregate({ _sum: { amount: true } }),
    db.orders.findMany({ take: 10, orderBy: { createdAt: "desc" } }),
  ]);

  return {
    totalUsers: users,
    activeUsers: await db.users.count({ where: { active: true } }),
    revenue: revenue._sum.amount ?? 0,
    recentOrders: orders,
  };
}

export default async function DashboardPage() {
  const session = await getServerSession();
  if (!session) redirect("/login");

  const stats = await getDashboardStats();

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Total Users: {stats.totalUsers}</p>
      <p>Revenue: \${stats.revenue}</p>
      <OrderList orders={stats.recentOrders} />
    </div>
  );
}`,
        explanation: 'Server components in Next.js are async functions. TypeScript types the returned data, ensuring props passed to child components are correct.',
      },
      {
        title: 'Typed API route with validation',
        code: `// app/api/posts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Zod schema for request validation
const CreatePostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(10),
  tags: z.array(z.string()).max(10).optional(),
  published: z.boolean().default(false),
});

type CreatePostInput = z.infer<typeof CreatePostSchema>;

export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = CreatePostSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const input: CreatePostInput = parsed.data; // Fully typed

  const post = await db.posts.create({
    data: { ...input, authorId: session.user.id },
  });

  return NextResponse.json(post, { status: 201 });
}`,
        explanation: 'Zod validates at runtime and infers the TypeScript type from the schema. z.infer<typeof Schema> gives you the type without duplication.',
      },
      {
        title: 'Typed server action with useActionState',
        code: `// app/actions/auth.ts
"use server";

import { z } from "zod";
import { redirect } from "next/navigation";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type LoginState = {
  errors?: { email?: string[]; password?: string[] };
  message?: string;
};

export async function loginAction(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const parsed = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const user = await db.users.findByCredentials(parsed.data);
  if (!user) {
    return { message: "Invalid email or password" };
  }

  await createSession(user.id);
  redirect("/dashboard");
}

// app/login/page.tsx
"use client";
import { useActionState } from "react";
import { loginAction } from "@/app/actions/auth";

export default function LoginPage() {
  const [state, action, isPending] = useActionState(loginAction, {});

  return (
    <form action={action}>
      <input name="email" type="email" />
      {state.errors?.email && <span>{state.errors.email[0]}</span>}
      <input name="password" type="password" />
      {state.errors?.password && <span>{state.errors.password[0]}</span>}
      {state.message && <p className="error">{state.message}</p>}
      <button disabled={isPending}>
        {isPending ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}`,
        explanation: 'Server Actions with useActionState provide typed state from server to client. The action signature (prevState, formData) is enforced by TypeScript.',
      },
    ],
    commonMistakes: [
      'Not using NextRequest instead of Request — NextRequest has nextUrl.searchParams and other Next.js-specific helpers.',
      'Forgetting that params in App Router pages are strings even if the route segment looks numeric.',
      'Using process.env directly in client components — only NEXT_PUBLIC_ prefixed vars are available in the browser.',
      'Not using z.infer to get types from Zod schemas — defining the type separately leads to duplication.',
    ],
    interviewQuestions: [
      {
        question: 'How do you type dynamic route parameters in Next.js App Router?',
        answer: 'In the App Router, page components receive a params prop with route segment values as strings. Define a PageProps interface: { params: { slug: string } } and use it as the type for your page component and generateMetadata function. Note that all param values are strings even if the segment is numeric — you need to convert with Number() if needed.',
        difficulty: 'intermediate',
      },
      {
        question: 'What is a Server Action and how do you type it?',
        answer: 'A Server Action is an async function marked with "use server" that runs on the server and can be called from client components. For form-based actions with useActionState, the signature is (prevState: State, formData: FormData) => Promise<State>. The state type is shared between server and client — TypeScript ensures both sides agree on the shape.',
        difficulty: 'advanced',
      },
    ],
    exercises: [
      {
        id: 'ex-nextjs-1',
        title: 'Type a paginated API route',
        description: 'Create a typed GET route handler that accepts pagination query params and returns typed paginated results.',
        starterCode: `// app/api/products/route.ts
// Create a GET handler that:
// 1. Reads page (default: 1) and pageSize (default: 10) from query params
// 2. Returns { data: Product[], total: number, page: number, pageSize: number }
// 3. Is fully typed throughout

import { NextRequest, NextResponse } from "next/server";

interface Product {
  id: string;
  name: string;
  price: number;
}

interface PaginatedResponse<T> {
  // define this
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  // implement
}`,
        solution: `import { NextRequest, NextResponse } from "next/server";

interface Product {
  id: string;
  name: string;
  price: number;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export async function GET(request: NextRequest): Promise<NextResponse<PaginatedResponse<Product>>> {
  const searchParams = request.nextUrl.searchParams;
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize") ?? 10)));

  const [products, total] = await Promise.all([
    db.products.findMany({ skip: (page - 1) * pageSize, take: pageSize }),
    db.products.count(),
  ]);

  return NextResponse.json({
    data: products,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  });
}`,
        hints: ['Read from request.nextUrl.searchParams', 'Use Number() to parse string params', 'NextResponse.json<T>() lets you type the response body'],
      },
    ],
    keyTakeaways: [
      'Page components receive params (route segments) and searchParams (query string) — both are strings',
      'Route handlers use NextRequest and NextResponse from "next/server"',
      'Server Actions signature: (prevState: State, formData: FormData) => Promise<State>',
      'Zod + z.infer — validate at runtime and get TypeScript types in one step',
      'Environment variables: non-public vars are server-only; NEXT_PUBLIC_ prefix exposes to client',
    ],
    prevLesson: 'typescript-react',
    nextLesson: 'typescript-nodejs',
  },

  // ─── MODULE 20: TypeScript with Node.js ─────────────────────────────────────
  {
    id: 'typescript-nodejs',
    slug: 'typescript-nodejs',
    title: 'TypeScript with Node.js',
    description: 'Build typed Express APIs, type middleware, request/response, environment variables, and database queries in Node.js.',
    category: 'Backend',
    order: 20,
    difficulty: 'intermediate',
    estimatedTime: 40,
    content: `Node.js with TypeScript gives you fully typed backend applications. This module covers Express typing, middleware, database types, and production patterns.\n\n## Setting Up TypeScript with Node.js\n\n\`\`\`bash\nnpm install express\nnpm install --save-dev typescript @types/node @types/express ts-node nodemon\n\`\`\`\n\n\`\`\`json\n// tsconfig.json for Node.js\n{\n  "compilerOptions": {\n    "target": "ES2020",\n    "module": "commonjs",\n    "outDir": "./dist",\n    "rootDir": "./src",\n    "strict": true,\n    "esModuleInterop": true,\n    "skipLibCheck": true\n  }\n}\n\`\`\`\n\n## Express Request and Response Types\n\n\`\`\`ts\nimport { Request, Response, NextFunction } from "express";\n\n// Basic typed route\napp.get("/users/:id", async (req: Request, res: Response): Promise<void> => {\n  const { id } = req.params; // string\n  const user = await userService.findById(id);\n  if (!user) {\n    res.status(404).json({ error: "User not found" });\n    return;\n  }\n  res.json(user);\n});\n\`\`\`\n\n## Typed Request Bodies and Params\n\n\`\`\`ts\n// Generic types for request body and params\ninterface CreateUserBody {\n  name: string;\n  email: string;\n  role?: "admin" | "user";\n}\n\ninterface UserParams {\n  id: string;\n}\n\ninterface UserQuery {\n  page?: string;\n  limit?: string;\n  role?: string;\n}\n\n// Typed route with generics\napp.post(\n  "/users",\n  async (\n    req: Request<{}, {}, CreateUserBody>,\n    res: Response,\n  ): Promise<void> => {\n    const { name, email, role = "user" } = req.body; // typed!\n    const user = await userService.create({ name, email, role });\n    res.status(201).json(user);\n  }\n);\n\n// Request<Params, ResBody, ReqBody, QueryString>\napp.get(\n  "/users/:id",\n  async (\n    req: Request<UserParams, {}, {}, UserQuery>,\n    res: Response,\n  ): Promise<void> => {\n    const { id } = req.params; // UserParams\n    const { page, limit } = req.query; // UserQuery\n    const user = await userService.findById(id);\n    res.json(user);\n  }\n);\n\`\`\`\n\n## Augmenting Express Request\n\n\`\`\`ts\n// types/express.d.ts — add properties to req\ndeclare global {\n  namespace Express {\n    interface Request {\n      user?: AuthUser;       // added by auth middleware\n      requestId: string;     // added by request ID middleware\n      startTime: number;     // added by timing middleware\n    }\n  }\n}\n\n// auth.middleware.ts\nexport async function authMiddleware(\n  req: Request,\n  res: Response,\n  next: NextFunction\n): Promise<void> {\n  const token = req.headers.authorization?.replace("Bearer ", "");\n  if (!token) {\n    res.status(401).json({ error: "Unauthorized" });\n    return;\n  }\n  const user = await verifyToken(token);\n  req.user = user; // TypeScript knows this is valid (from the augmentation)\n  next();\n}\n\`\`\`\n\n## Middleware Typing\n\n\`\`\`ts\nimport { RequestHandler, ErrorRequestHandler } from "express";\n\n// Middleware type\ntype AuthMiddleware = RequestHandler;\n\nconst requireAuth: AuthMiddleware = (req, res, next) => {\n  if (!req.user) {\n    res.status(401).json({ error: "Authentication required" });\n    return;\n  }\n  next();\n};\n\n// Error middleware — must have 4 parameters\nconst errorHandler: ErrorRequestHandler = (error, req, res, next) => {\n  if (error instanceof AppError) {\n    res.status(error.statusCode).json({ error: error.message });\n  } else {\n    res.status(500).json({ error: "Internal server error" });\n  }\n};\n\`\`\`\n\n## Database Types with Prisma\n\n\`\`\`ts\n// Prisma auto-generates TypeScript types from your schema\nimport { PrismaClient, User, Post, Prisma } from "@prisma/client";\n\nconst prisma = new PrismaClient();\n\n// Fully typed — TypeScript knows the shape from the schema\nasync function getUserWithPosts(id: string): Promise<User & { posts: Post[] } | null> {\n  return prisma.user.findUnique({\n    where: { id },\n    include: { posts: true },\n  });\n}\n\n// Prisma utility types\ntype UserCreateInput = Prisma.UserCreateInput;\ntype UserUpdateInput = Prisma.UserUpdateInput;\ntype UserWhereInput = Prisma.UserWhereInput;\n\nasync function createUser(data: UserCreateInput): Promise<User> {\n  return prisma.user.create({ data });\n}\n\`\`\`\n\n## Environment Variables\n\n\`\`\`ts\n// src/config/env.ts\nimport { z } from "zod";\n\nconst envSchema = z.object({\n  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),\n  PORT: z.string().transform(Number).default("3000"),\n  DATABASE_URL: z.string().url(),\n  JWT_SECRET: z.string().min(32),\n  REDIS_URL: z.string().url().optional(),\n});\n\nexport const env = envSchema.parse(process.env);\n// env is fully typed and validated at startup\n// If any required env var is missing, the app fails fast\n\`\`\``,
    codeExamples: [
      {
        title: 'Typed Express router structure',
        code: `// src/routes/users.ts
import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { UserService } from "@/services/UserService";
import { authMiddleware, requireRole } from "@/middleware/auth";

const router = Router();
const userService = new UserService();

// Schema definitions
const CreateUserSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  role: z.enum(["admin", "user", "viewer"]).default("user"),
});

const UpdateUserSchema = CreateUserSchema.partial();

type CreateUserInput = z.infer<typeof CreateUserSchema>;

// GET /users
router.get("/", authMiddleware, async (req: Request, res: Response): Promise<void> => {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 10);
  const users = await userService.findAll({ page, limit });
  res.json(users);
});

// POST /users
router.post(
  "/",
  authMiddleware,
  requireRole("admin"),
  async (req: Request<{}, {}, CreateUserInput>, res: Response): Promise<void> => {
    const parsed = CreateUserSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ errors: parsed.error.flatten() });
      return;
    }
    const user = await userService.create(parsed.data);
    res.status(201).json(user);
  }
);

export default router;`,
        explanation: 'Each route is typed end-to-end. Zod validates the request body and infers the TypeScript type. The service receives a validated, typed input.',
      },
      {
        title: 'Typed middleware with augmented Request',
        code: `// src/types/express.d.ts
export interface AuthUser {
  id: string;
  email: string;
  role: "admin" | "user" | "viewer";
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      requestId: string;
    }
  }
}

// src/middleware/auth.ts
import jwt from "jsonwebtoken";
import type { RequestHandler } from "express";
import { env } from "@/config/env";

export const authMiddleware: RequestHandler = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      res.status(401).json({ error: "No token provided" });
      return;
    }
    const decoded = jwt.verify(token, env.JWT_SECRET) as AuthUser;
    req.user = decoded; // TypeScript knows this is AuthUser
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

export const requireRole = (...roles: AuthUser["role"][]): RequestHandler =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ error: "Insufficient permissions" });
      return;
    }
    next();
  };`,
        explanation: 'Declaration merging augments Express\'s Request interface. After the middleware runs, req.user is typed as AuthUser throughout the route handlers.',
      },
      {
        title: 'Typed database service with Prisma',
        code: `import { PrismaClient, Prisma, User } from "@prisma/client";

// Include type — user with related posts
type UserWithPosts = Prisma.UserGetPayload<{
  include: { posts: true };
}>;

class UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findWithPosts(id: string): Promise<UserWithPosts | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: { posts: true },
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({ where: { id }, data });
  }

  async findMany(
    filter: Prisma.UserWhereInput,
    pagination: { skip: number; take: number }
  ): Promise<[User[], number]> {
    return this.prisma.$transaction([
      this.prisma.user.findMany({ where: filter, ...pagination }),
      this.prisma.user.count({ where: filter }),
    ]);
  }
}`,
        explanation: 'Prisma.UserGetPayload<{include: { posts: true }}> gives the exact type of a user query with included relations — TypeScript knows posts is included.',
      },
    ],
    commonMistakes: [
      'Not installing @types/express and @types/node — without these, Express and Node.js types are missing.',
      'Using res.json() after returning or after next() is called — causes "headers already sent" runtime error.',
      'Typing req.body as any — use the generic Request<Params, ResBody, Body, Query> or Zod parsing.',
      'Not augmenting the Express Request type for custom middleware properties — TypeScript will not know about req.user etc.',
    ],
    interviewQuestions: [
      {
        question: 'How do you type the request body in an Express route?',
        answer: 'Use the generic form Request<Params, ResponseBody, RequestBody, QueryString>. For example: Request<{}, {}, CreateUserInput> types the body as CreateUserInput. In practice, you also need to validate the body at runtime (since req.body is untyped input from a client). Use Zod or another validation library to parse and validate, then use z.infer<typeof Schema> to get the TypeScript type.',
        difficulty: 'intermediate',
      },
      {
        question: 'How do you add custom properties to the Express Request object?',
        answer: 'Use declaration merging to augment the Express Request interface in a .d.ts file: declare global { namespace Express { interface Request { user?: AuthUser; } } }. This makes req.user available throughout your application without type errors. You also need to set req.user in your middleware. Place the declaration file in a types/ folder and include it in your tsconfig.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'ex-nodejs-1',
        title: 'Build a typed validation middleware',
        description: 'Create a generic Express middleware factory that validates request body with a Zod schema.',
        starterCode: `import { z } from "zod";
import type { Request, Response, NextFunction, RequestHandler } from "express";

// Build validateBody<T> that:
// 1. Takes a Zod schema
// 2. Returns Express middleware
// 3. On success: attaches parsed data to req.body (typed)
// 4. On failure: returns 400 with error details

function validateBody<T extends z.ZodType>(schema: T): RequestHandler {
  // implement
}

// Usage:
const UserSchema = z.object({ name: z.string(), email: z.string().email() });
router.post("/users", validateBody(UserSchema), (req, res) => {
  // req.body should be typed as z.infer<typeof UserSchema>
});`,
        solution: `import { z } from "zod";
import type { Request, Response, NextFunction, RequestHandler } from "express";

function validateBody<T extends z.ZodType>(schema: T): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        error: "Validation failed",
        details: result.error.flatten().fieldErrors,
      });
      return;
    }
    req.body = result.data; // Replace with parsed/validated data
    next();
  };
}

// Usage
const UserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});

router.post("/users", validateBody(UserSchema), (req: Request, res: Response) => {
  // req.body is parsed — but not narrowed to z.infer<typeof UserSchema>
  // For full typing, use a different approach with augmented Request types
  const user = req.body;
  res.status(201).json(user);
});`,
        hints: ['schema.safeParse(req.body) returns { success, data } or { success, error }', 'Return 400 on failure with result.error.flatten()', 'Assign result.data to req.body on success and call next()'],
      },
    ],
    keyTakeaways: [
      'Install @types/node and @types/express for Node.js and Express types',
      'Request<Params, ResBody, ReqBody, Query> — type all four parts of the request',
      'Augment Express.Request via declaration merging to add req.user etc.',
      'Prisma generates TypeScript types from your schema automatically',
      'Validate environment variables at startup with Zod — fail fast if misconfigured',
    ],
    prevLesson: 'typescript-nextjs',
    nextLesson: 'typescript-large-apps',
  },

  // ─── MODULE 21: TypeScript for Large Applications ────────────────────────────
  {
    id: 'typescript-large-apps',
    slug: 'typescript-large-apps',
    title: 'TypeScript for Large Applications',
    description: 'Scale TypeScript projects with domain types, DTOs, API contracts, shared type libraries, and architectural patterns.',
    category: 'Real World',
    order: 21,
    difficulty: 'advanced',
    estimatedTime: 35,
    content: `Large applications require systematic type organization. Without structure, types become duplicated, inconsistent, and unmaintainable. This module covers proven patterns used in production codebases.\n\n## Domain Types — The Foundation\n\nDomain types represent real-world entities in your business domain:\n\n\`\`\`ts\n// src/types/domain/user.ts\nexport type UserId = string;\nexport type Email = string;\n\nexport type UserRole = "admin" | "editor" | "viewer" | "guest";\n\nexport interface User {\n  readonly id: UserId;\n  email: Email;\n  name: string;\n  role: UserRole;\n  readonly createdAt: Date;\n  updatedAt: Date;\n  deletedAt: Date | null;\n}\n\nexport interface UserProfile extends Pick<User, "id" | "name" | "email"> {\n  bio?: string;\n  avatar?: string;\n  joinedAt: Date;\n}\n\`\`\`\n\n## Data Transfer Objects (DTOs)\n\nDTOs define the shape of data crossing API boundaries — what clients send and what they receive:\n\n\`\`\`ts\n// src/types/dto/user.dto.ts\n\n// Client → Server: Create\nexport interface CreateUserDTO {\n  name: string;\n  email: string;\n  password: string;\n  role?: UserRole;\n}\n\n// Client → Server: Update\nexport interface UpdateUserDTO {\n  name?: string;\n  email?: string;\n  role?: UserRole;\n}\n\n// Server → Client: Response (never includes sensitive fields)\nexport interface UserResponseDTO {\n  id: string;\n  name: string;\n  email: string;\n  role: UserRole;\n  createdAt: string; // ISO string — dates serialize to strings in JSON\n}\n\n// Mapper — convert domain User to DTO\nexport function toUserDTO(user: User): UserResponseDTO {\n  return {\n    id: user.id,\n    name: user.name,\n    email: user.email,\n    role: user.role,\n    createdAt: user.createdAt.toISOString(),\n  };\n}\n\`\`\`\n\n## API Contracts\n\nDefine the shape of every API endpoint in a shared location:\n\n\`\`\`ts\n// src/types/api/contracts.ts\n\ninterface PaginationQuery {\n  page?: number;\n  limit?: number;\n  sortBy?: string;\n  sortOrder?: "asc" | "desc";\n}\n\ninterface PaginatedResponse<T> {\n  data: T[];\n  pagination: {\n    page: number;\n    limit: number;\n    total: number;\n    totalPages: number;\n  };\n}\n\n// User API contract\nexport interface UserApi {\n  "GET /users": {\n    query: PaginationQuery & { role?: UserRole };\n    response: PaginatedResponse<UserResponseDTO>;\n  };\n  "POST /users": {\n    body: CreateUserDTO;\n    response: UserResponseDTO;\n  };\n  "GET /users/:id": {\n    params: { id: string };\n    response: UserResponseDTO;\n  };\n  "PUT /users/:id": {\n    params: { id: string };\n    body: UpdateUserDTO;\n    response: UserResponseDTO;\n  };\n  "DELETE /users/:id": {\n    params: { id: string };\n    response: { success: boolean };\n  };\n}\n\`\`\`\n\n## Shared Types Across Frontend and Backend (Monorepo)\n\n\`\`\`\nmonorepo/\n├── packages/\n│   └── shared-types/         # Shared TypeScript types\n│       ├── src/\n│       │   ├── domain/       # User, Post, Order interfaces\n│       │   ├── dto/          # Request/Response shapes\n│       │   ├── api/          # API contracts\n│       │   └── index.ts      # Barrel\n│       └── package.json\n├── apps/\n│   ├── api/                  # Backend\n│   └── web/                  # Frontend\n└── package.json\n\`\`\`\n\nBoth frontend and backend import from the same package:\n\`\`\`ts\nimport type { User, CreateUserDTO } from "@company/shared-types";\n\`\`\`\n\n## Type-Safe API Client\n\n\`\`\`ts\n// src/lib/apiClient.ts\ntype ApiMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";\n\nclass TypedApiClient {\n  constructor(private baseUrl: string) {}\n\n  async get<T>(path: string, params?: Record<string, string>): Promise<T> {\n    const url = new URL(path, this.baseUrl);\n    if (params) {\n      Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));\n    }\n    const res = await fetch(url.toString());\n    if (!res.ok) throw new Error(\`API Error: \${res.status}\`);\n    return res.json() as Promise<T>;\n  }\n\n  async post<TBody, TResponse>(path: string, body: TBody): Promise<TResponse> {\n    const res = await fetch(\`\${this.baseUrl}\${path}\`, {\n      method: "POST",\n      headers: { "Content-Type": "application/json" },\n      body: JSON.stringify(body),\n    });\n    if (!res.ok) throw new Error(\`API Error: \${res.status}\`);\n    return res.json() as Promise<TResponse>;\n  }\n}\n\nconst api = new TypedApiClient(process.env.NEXT_PUBLIC_API_URL!);\n\n// Usage\nconst users = await api.get<PaginatedResponse<UserResponseDTO>>("/users");\nconst newUser = await api.post<CreateUserDTO, UserResponseDTO>("/users", { name: "Alice", email: "...", password: "..." });\n\`\`\`\n\n## Validation Layer with Zod\n\n\`\`\`ts\n// src/validation/user.schema.ts\nimport { z } from "zod";\n\nexport const CreateUserSchema = z.object({\n  name: z.string().min(2).max(100),\n  email: z.string().email("Invalid email address"),\n  password: z.string().min(8).regex(/[A-Z]/, "Must contain uppercase").regex(/[0-9]/, "Must contain number"),\n  role: z.enum(["admin", "editor", "viewer", "guest"]).default("viewer"),\n});\n\n// Type inferred from schema — single source of truth\nexport type CreateUserInput = z.infer<typeof CreateUserSchema>;\n\n// Reuse on both client and server\nexport const UpdateUserSchema = CreateUserSchema.partial().omit({ password: true });\nexport type UpdateUserInput = z.infer<typeof UpdateUserSchema>;\n\`\`\``,
    codeExamples: [
      {
        title: 'Feature-based type organization',
        code: `// Organized by feature, not by type kind
// src/features/orders/types.ts

export type OrderId = string;
export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
}

export interface Order {
  readonly id: OrderId;
  customerId: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  shippingAddress: Address;
  readonly createdAt: Date;
  updatedAt: Date;
}

// State transitions — only valid next states for each status
export const ORDER_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending:   ["confirmed", "cancelled"],
  confirmed: ["shipped", "cancelled"],
  shipped:   ["delivered"],
  delivered: [],
  cancelled: [],
} as const;

export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return ORDER_TRANSITIONS[from].includes(to);
}`,
        explanation: 'Organizing types by feature (orders, users, products) keeps related types together. State machine transitions are type-safe with the OrderStatus union.',
      },
      {
        title: 'Repository pattern with generics',
        code: `// Shared base repository interface
interface IRepository<T, ID = string> {
  findById(id: ID): Promise<T | null>;
  findAll(filter?: Partial<T>): Promise<T[]>;
  create(data: Omit<T, "id" | "createdAt" | "updatedAt">): Promise<T>;
  update(id: ID, data: Partial<Omit<T, "id" | "createdAt">>): Promise<T | null>;
  delete(id: ID): Promise<boolean>;
  count(filter?: Partial<T>): Promise<number>;
}

// Type-safe base class
abstract class BaseRepository<T extends { id: ID; createdAt: Date }, ID = string>
  implements IRepository<T, ID>
{
  abstract findById(id: ID): Promise<T | null>;
  abstract findAll(filter?: Partial<T>): Promise<T[]>;
  abstract create(data: Omit<T, "id" | "createdAt" | "updatedAt">): Promise<T>;
  abstract update(id: ID, data: Partial<Omit<T, "id" | "createdAt">>): Promise<T | null>;
  abstract delete(id: ID): Promise<boolean>;
  abstract count(filter?: Partial<T>): Promise<number>;

  async findOrFail(id: ID): Promise<T> {
    const item = await this.findById(id);
    if (!item) throw new NotFoundError(String(id));
    return item;
  }

  async exists(id: ID): Promise<boolean> {
    return (await this.findById(id)) !== null;
  }
}

// Concrete implementation
class UserRepository extends BaseRepository<User> {
  constructor(private db: PrismaClient) { super(); }

  async findById(id: string): Promise<User | null> {
    return this.db.user.findUnique({ where: { id } });
  }
  // ... other methods
}`,
        explanation: 'Generic base repository enforces a consistent data access interface. Each concrete repository gets findOrFail and exists for free from the base class.',
      },
    ],
    commonMistakes: [
      'Duplicating types between frontend and backend — use a shared types package in a monorepo.',
      'Using any in DTO mappers — the mapper function is where bugs hide, type it strictly.',
      'Not separating domain types from DTO types — domain types may have sensitive fields; DTOs are what cross boundaries.',
      'Having a single large types.ts file — split by domain as the codebase grows.',
    ],
    interviewQuestions: [
      {
        question: 'What is a DTO and why is it important in TypeScript applications?',
        answer: 'A DTO (Data Transfer Object) defines the shape of data crossing an API boundary. It is separate from domain types because: (1) Domain types may contain sensitive fields (passwordHash) that should never be sent to clients. (2) Domain types use proper JS types (Date) but API responses serialize to JSON (string). (3) Update inputs are Partial while domain types are complete. DTOs make these distinctions explicit.',
        difficulty: 'intermediate',
      },
      {
        question: 'How do you share types between a frontend and backend in a TypeScript project?',
        answer: 'In a monorepo, create a shared-types package that both apps import from. The package contains domain interfaces, DTO types, and API contracts. Both frontend and backend reference the same types — a change in the API contract is visible to both. Tools like tRPC take this further by generating typed client functions from server functions.',
        difficulty: 'advanced',
      },
    ],
    exercises: [
      {
        id: 'ex-large-apps-1',
        title: 'Design a type layer for an e-commerce feature',
        description: 'Create the complete type layer for a cart feature: domain types, DTOs, and a service interface.',
        starterCode: `// Design these types for a shopping cart:
// 1. Domain types: CartItem, Cart
// 2. DTOs: AddToCartDTO, CartResponseDTO
// 3. Service interface: ICartService

// CartItem: productId, name, quantity, price, discount?
// Cart: id, userId, items, subtotal, total

// AddToCartDTO: what the client sends when adding an item
// CartResponseDTO: what the API returns

// ICartService: addItem, removeItem, updateQuantity, clearCart, getCart`,
        solution: `// Domain types
interface CartItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  discount?: number;
}

interface Cart {
  readonly id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  total: number;
  updatedAt: Date;
}

// DTOs
interface AddToCartDTO {
  productId: string;
  quantity: number;
}

interface UpdateCartItemDTO {
  quantity: number;
}

interface CartItemResponseDTO {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  lineTotal: number;
}

interface CartResponseDTO {
  id: string;
  items: CartItemResponseDTO[];
  subtotal: number;
  total: number;
  itemCount: number;
}

// Service interface
interface ICartService {
  getCart(userId: string): Promise<CartResponseDTO>;
  addItem(userId: string, item: AddToCartDTO): Promise<CartResponseDTO>;
  updateItem(userId: string, productId: string, update: UpdateCartItemDTO): Promise<CartResponseDTO>;
  removeItem(userId: string, productId: string): Promise<CartResponseDTO>;
  clearCart(userId: string): Promise<void>;
}`,
        hints: ['Domain types are internal, DTOs cross API boundaries', 'CartResponseDTO includes computed fields like lineTotal and itemCount', 'ICartService returns DTOs (not domain types) since it serves the API'],
      },
    ],
    keyTakeaways: [
      'Domain types represent business entities; DTOs represent data at API boundaries',
      'Mappers convert domain types to DTOs — type them strictly',
      'Shared types package in monorepos — frontend and backend share one source of truth',
      'API contracts document every endpoint\'s params, body, and response in one place',
      'Repository pattern with generics — consistent data access with type safety',
    ],
    prevLesson: 'typescript-nodejs',
    nextLesson: 'migrating-to-typescript',
  },

  // ─── MODULE 22: Migrating JavaScript to TypeScript ──────────────────────────
  {
    id: 'migrating-to-typescript',
    slug: 'migrating-to-typescript',
    title: 'Migrating JavaScript to TypeScript',
    description: 'Learn a practical, incremental migration strategy from JavaScript to TypeScript with common patterns and pitfalls.',
    category: 'Real World',
    order: 22,
    difficulty: 'intermediate',
    estimatedTime: 30,
    content: `Migrating an existing JavaScript project to TypeScript is one of the most common real-world tasks. This module gives you a practical strategy.\n\n## Why Incremental Migration\n\nTrying to type the entire codebase at once:\n- Takes weeks or months\n- Blocks feature work\n- High risk of bugs from rushed types\n\nIncremental migration:\n- TypeScript and JavaScript coexist in the same project\n- Migrate one file or module at a time\n- Safer — you can test each migrated file\n- Allows the team to learn TypeScript gradually\n\n## Step 1: Configure for Incremental Migration\n\n\`\`\`json\n// tsconfig.json — lenient settings for migration start\n{\n  "compilerOptions": {\n    "target": "ES2020",\n    "module": "commonjs",\n    "outDir": "./dist",\n    "allowJs": true,              // Allow .js files\n    "checkJs": false,             // Don't type-check .js files yet\n    "strict": false,              // Loosen strict for initial migration\n    "noImplicitAny": false,       // Allow implicit any temporarily\n    "esModuleInterop": true,\n    "skipLibCheck": true\n  },\n  "include": ["src/**/*"]\n}\n\`\`\`\n\nTighten settings gradually as more files are migrated:\n\`\`\`json\n// After most files are migrated:\n{\n  "compilerOptions": {\n    "checkJs": true,              // Now check .js files too\n    "strict": true,               // Enable strict mode\n    "noImplicitAny": true         // Disallow any implicit any\n  }\n}\n\`\`\`\n\n## Step 2: Rename and Fix\n\nRename files from \`.js\` to \`.ts\` one at a time. Start with:\n- **Utility functions** — usually pure, easy to type\n- **Type definitions** — create \`types.ts\` files first\n- **Services/business logic** — high value for typing\n- **Leave entry points and frameworks last** — most complex\n\n## Step 3: Use any Temporarily\n\n\`\`\`ts\n// Before: you have this JS function\nfunction processOrder(order, config, logger) {\n  // ...\n}\n\n// Migration step 1: rename to .ts, add any for unknown types\nfunction processOrder(order: any, config: any, logger: any) {\n  // ...\n}\n\n// Migration step 2: define proper types\nfunction processOrder(order: Order, config: AppConfig, logger: Logger) {\n  // ...\n}\n\`\`\`\n\n## Common Migration Problems\n\n**1. Third-party libraries without types:**\n\`\`\`ts\n// Option 1: Install @types/ package\nnpm install --save-dev @types/lodash\n\n// Option 2: Quick inline declaration\ndeclare module "some-untyped-library" {\n  const lib: any;\n  export default lib;\n}\n\`\`\`\n\n**2. Dynamic object shapes:**\n\`\`\`ts\n// JavaScript: objects built dynamically\nconst result = {};\nfields.forEach(field => {\n  result[field] = getValue(field);\n});\n\n// TypeScript: add an index signature or type assertion\nconst result: Record<string, unknown> = {};\n\`\`\`\n\n**3. Any-typed function parameters (strict mode):**\n\`\`\`ts\n// Before: callback parameter inferred as any\narray.forEach(function(item) { /* item is any */ });\n\n// After: infer type from array\nconst items: string[] = [];\nitems.forEach(item => { /* item is string */ });\n\`\`\`\n\n**4. Null checks everywhere (strictNullChecks):**\n\`\`\`ts\n// JS code that assumed all values exist\nfunction getFullName(user) {\n  return user.firstName + " " + user.lastName; // What if user is null?\n}\n\n// TypeScript with strictNullChecks forces you to handle it\nfunction getFullName(user: User | null): string {\n  if (!user) return "Anonymous";\n  return \`\${user.firstName} \${user.lastName}\`;\n}\n\`\`\`\n\n## Migration Checklist\n\n1. Install TypeScript and @types/* packages\n2. Create tsconfig.json with allowJs: true and strict: false\n3. Add \".ts\" to file extensions in your build tool\n4. Rename files one by one: .js → .ts\n5. Fix type errors with any initially — then tighten later\n6. Create type declaration files for untyped JS libraries\n7. Enable strict mode gradually: noImplicitAny → strictNullChecks → strict\n8. Add types to utility functions and services first\n9. Type API boundaries (request/response shapes)\n10. Enable checkJs for remaining .js files\n\n## Useful tsconfig Flags for Migration\n\n| Flag | Purpose |\n|------|---------|\n| \`allowJs\` | Include .js files in compilation |\n| \`checkJs\` | Type-check .js files |\n| \`strict\` | Enable all strict checks |\n| \`noImplicitAny\` | Require explicit types for implicit any |\n| \`strictNullChecks\` | null/undefined not assignable to other types |\n| \`@ts-ignore\` | Suppress error on next line (use sparingly) |\n| \`@ts-nocheck\` | Skip file entirely during migration |`,
    codeExamples: [
      {
        title: 'Before and after migration — utility function',
        code: `// BEFORE: utils.js
function formatCurrency(amount, currency, locale) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(amount);
}

function truncate(str, maxLength, suffix) {
  suffix = suffix || "...";
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - suffix.length) + suffix;
}

// AFTER: utils.ts
function formatCurrency(
  amount: number,
  currency: string = "USD",
  locale: string = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
}

function truncate(
  str: string,
  maxLength: number,
  suffix: string = "..."
): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - suffix.length) + suffix;
}

// Benefits after migration:
formatCurrency("not a number", "USD"); // Error caught at compile time
truncate(42, 10);                      // Error: number not assignable to string`,
        explanation: 'Start with pure utility functions — they have no dependencies and are easy to type. Parameter types and default values make the API explicit.',
      },
      {
        title: 'Migrating a class with gradual typing',
        code: `// MIGRATION STEP 1: Rename to .ts, add any for now
class ApiClient {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor(baseUrl: any, options: any) {
    this.baseUrl = baseUrl;
    this.headers = options?.headers ?? {};
  }

  async get(path: any): Promise<any> {
    const response = await fetch(this.baseUrl + path, {
      headers: this.headers,
    });
    return response.json();
  }
}

// MIGRATION STEP 2: Replace any with proper types
interface ApiClientOptions {
  headers?: Record<string, string>;
  timeout?: number;
}

class ApiClient {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor(baseUrl: string, options: ApiClientOptions = {}) {
    this.baseUrl = baseUrl;
    this.headers = options.headers ?? {};
  }

  async get<T>(path: string): Promise<T> {
    const response = await fetch(this.baseUrl + path, {
      headers: this.headers,
    });
    if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
    return response.json() as Promise<T>;
  }
}`,
        explanation: 'Two-step migration: first make it compile (any everywhere), then replace any with proper types. This keeps the build green throughout the migration.',
      },
      {
        title: 'Using @ts-ignore and @ts-nocheck during migration',
        code: `// @ts-nocheck — skip entire file (use for files you haven't migrated yet)
// @ts-nocheck

function oldLegacyFunction(x) {
  return x.property.that.might.not.exist; // Not checked
}

// @ts-ignore — suppress ONE error on the next line (use sparingly)
function newFunction(user: User): string {
  // @ts-ignore — TODO: fix this after migration
  return legacyFormat(user);
}

// Better: use type assertions with a comment explaining why
function newFunction(user: User): string {
  return legacyFormat(user as any); // TODO: type legacyFormat and remove any
}

// @ts-expect-error — like @ts-ignore but fails if there's no error
// (useful for tests)
function testUser() {
  // @ts-expect-error — intentionally passing wrong type
  createUser(123);
}`,
        explanation: '@ts-nocheck disables a whole file. @ts-ignore suppresses one error. Use them to keep the build green during migration, then remove them as you properly type things.',
      },
    ],
    commonMistakes: [
      'Trying to migrate everything at once — always migrate incrementally.',
      'Leaving strict: false forever — gradually enable strict options as files are migrated.',
      'Over-using @ts-ignore — it hides real type errors. Track them with TODO comments.',
      'Not migrating type-critical paths first — API boundaries and data models have the highest ROI for typing.',
      'Not adding @types/* packages — always check if types are available on npm before writing your own.',
    ],
    interviewQuestions: [
      {
        question: 'How would you approach migrating a large JavaScript codebase to TypeScript?',
        answer: 'Use incremental migration: (1) Install TypeScript with allowJs: true so JS and TS coexist. (2) Start with strict: false and noImplicitAny: false. (3) Rename files one at a time (.js → .ts), starting with utilities and types. (4) Use any initially — replace gradually. (5) Enable strict options incrementally (strictNullChecks → noImplicitAny → strict). (6) Type API boundaries (request/response) for highest value. (7) Track remaining any usage with TypeScript\'s noImplicitAny once ready.',
        difficulty: 'advanced',
      },
      {
        question: 'What is allowJs in tsconfig and when do you use it?',
        answer: 'allowJs: true tells TypeScript to include .js files in the compilation alongside .ts files. Used during migration — you can have some files as .ts (typed) and others still as .js (not yet migrated). Combine with checkJs: false to skip type-checking the .js files until you are ready. Set checkJs: true later to gradually introduce type checking to .js files without renaming them.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'ex-migration-1',
        title: 'Migrate a JavaScript service to TypeScript',
        description: 'Migrate this JavaScript user service to TypeScript with proper types.',
        starterCode: `// Before: user.service.js
class UserService {
  constructor(db, cache) {
    this.db = db;
    this.cache = cache;
  }

  async getUser(id) {
    const cached = await this.cache.get("user:" + id);
    if (cached) return JSON.parse(cached);

    const user = await this.db.query("SELECT * FROM users WHERE id = ?", [id]);
    if (!user) return null;

    await this.cache.set("user:" + id, JSON.stringify(user), 3600);
    return user;
  }

  async updateUser(id, changes) {
    return this.db.query("UPDATE users SET ? WHERE id = ?", [changes, id]);
  }
}`,
        solution: `// After: user.service.ts
interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  createdAt: Date;
}

interface Database {
  query<T>(sql: string, params?: unknown[]): Promise<T | null>;
}

interface Cache {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttl: number): Promise<void>;
}

class UserService {
  constructor(
    private readonly db: Database,
    private readonly cache: Cache,
  ) {}

  async getUser(id: string): Promise<User | null> {
    const cached = await this.cache.get(\`user:\${id}\`);
    if (cached) return JSON.parse(cached) as User;

    const user = await this.db.query<User>(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );
    if (!user) return null;

    await this.cache.set(\`user:\${id}\`, JSON.stringify(user), 3600);
    return user;
  }

  async updateUser(
    id: string,
    changes: Partial<Omit<User, "id" | "createdAt">>
  ): Promise<User | null> {
    return this.db.query<User>("UPDATE users SET ? WHERE id = ?", [changes, id]);
  }
}`,
        hints: ['Define interfaces for User, Database, and Cache first', 'Use constructor shorthand (private readonly db: Database)', 'Generic query<T>() method returns T | null'],
      },
    ],
    keyTakeaways: [
      'Migrate incrementally — never all at once. Use allowJs: true for JS/TS coexistence.',
      'Start with utilities and types — highest value, lowest complexity.',
      'Use any as a stepping stone — track with TODO comments, remove gradually.',
      'Enable strict options one at a time after files are migrated.',
      '@ts-nocheck skips a file, @ts-ignore suppresses one error — use sparingly.',
    ],
    prevLesson: 'typescript-large-apps',
    nextLesson: 'typescript-interviews',
  },

  // ─── MODULE 23: TypeScript Interview Preparation ────────────────────────────
  {
    id: 'typescript-interviews',
    slug: 'typescript-interviews',
    title: 'TypeScript Interview Preparation',
    description: 'Comprehensive interview questions and answers covering beginner to advanced TypeScript — with scenario-based questions.',
    category: 'Interview',
    order: 23,
    difficulty: 'intermediate',
    estimatedTime: 50,
    content: `This module covers the most commonly asked TypeScript interview questions at all levels — from junior to senior and staff engineer roles.\n\n## Beginner Level\n\n**What is TypeScript and why should I use it?**\nTypeScript is a statically typed superset of JavaScript that compiles to plain JavaScript. Use it because: (1) Catches bugs at compile time before they reach production. (2) Rich IDE support — autocomplete, go-to-definition, refactoring. (3) Self-documenting code — types describe what functions expect and return. (4) Safer refactoring in large codebases.\n\n**What is type inference?**\nTypeScript automatically determines the type of a variable from its value. You do not need to annotate \`const name = "Alice"\` — TypeScript knows name is string. You DO need to annotate function parameters — TypeScript cannot infer those.\n\n**What are type annotations?**\nSyntax to explicitly tell TypeScript a type: \`const age: number = 25\`. For variables with obvious initializers, annotations are redundant. For function parameters, they are required.\n\n**What is the difference between any and unknown?**\nBoth allow a variable to hold any type. The difference: with \`any\`, you can do anything with the value without checks. With \`unknown\`, you must narrow the type first (typeof, instanceof). Use unknown for external data (APIs, user input).\n\n---\n\n## Intermediate Level\n\n**What is the difference between interface and type?**\n- Both describe object shapes\n- \`interface\` supports declaration merging (same name twice → merged)\n- \`type\` supports unions, primitives, conditional types\n- \`interface\` uses \`extends\`; \`type\` uses \`&\`\n- For objects: use \`interface\` when classes will implement it, \`type\` for everything else\n\n**What is a discriminated union?**\nA union where each member has a shared literal field (discriminant) that uniquely identifies the variant:\n\`\`\`ts\ntype Shape =\n  | { kind: "circle"; radius: number }\n  | { kind: "square"; side: number };\n\`\`\`\nTypeScript uses the discriminant to narrow the type in switch/if statements.\n\n**What are generics?**\nGenerics write reusable code that works with any type while staying type-safe. \`function first<T>(arr: T[]): T | undefined\` works for any array type without losing type information.\n\n**What is the keyof operator?**\n\`keyof T\` produces a union of all property names of T. Used with generics: \`function get<T, K extends keyof T>(obj: T, key: K): T[K]\` — type-safe property access.\n\n**What are mapped types?**\nMapped types transform every property of a type: \`{ [K in keyof T]: NewValueType }\`. This is how Partial, Readonly, and Required are built internally.\n\n**What are utility types?**\nBuilt-in generic types: Partial (all optional), Required (all required), Readonly, Pick (select keys), Omit (remove keys), Record (typed object), Exclude/Extract (union manipulation), ReturnType, Parameters.\n\n---\n\n## Advanced Level\n\n**What is a conditional type?**\nType-level if/else: \`T extends U ? TrueType : FalseType\`. Example: \`type NonNullable<T> = T extends null | undefined ? never : T\`.\n\n**What is the infer keyword?**\nUsed inside conditional types to capture and name a type. \`T extends Promise<infer R> ? R : never\` — if T is a Promise, R is the resolved type.\n\n**What is declaration merging?**\nMultiple declarations of the same \`interface\` name are merged into one. Used to extend global types: add \`user\` to Express's Request, add properties to Window.\n\n**What is a type predicate?**\nA function return type \`value is Type\` that tells TypeScript the type of a variable after the function returns true. \`function isUser(v: unknown): v is User { ... }\`\n\n**What is the difference between Exclude and Omit?**\nExclude works on union types (removes members). Omit works on object types (removes properties). Common confusion in interviews.\n\n---\n\n## React TypeScript Questions\n\n**How do you type component props?**\nDefine an interface: \`interface ButtonProps { label: string; onClick: () => void; }\`. Use as the parameter type: \`function Button({ label, onClick }: ButtonProps)\`.\n\n**How do you type useState?**\nTypeScript infers from initial value. For null initial: \`useState<User | null>(null)\`. For empty array: \`useState<User[]>([])\`.\n\n**How do you type event handlers?**\nReact.ChangeEvent<HTMLInputElement>, React.FormEvent<HTMLFormElement>, React.MouseEvent<HTMLButtonElement>.\n\n**How do you type the Context API?**\n\`createContext<ValueType | null>(null)\`, then a custom hook that checks for null and throws.\n\n---\n\n## Scenario-Based Questions\n\n**Scenario: You have a function that processes payments. How do you model different payment methods?**\nUse a discriminated union:\n\`\`\`ts\ntype Payment =\n  | { method: "credit_card"; cardNumber: string; cvv: string }\n  | { method: "paypal"; email: string }\n  | { method: "crypto"; walletAddress: string };\n\`\`\`\nSwitch on \`payment.method\` to handle each case with full type narrowing.\n\n**Scenario: You need to make all properties of a deeply nested object optional. How?**\nWrite a recursive mapped type:\n\`\`\`ts\ntype DeepPartial<T> = {\n  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];\n};\n\`\`\`\n\n**Scenario: A function accepts a key of an object and returns the value. How do you type it?**\n\`\`\`ts\nfunction getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {\n  return obj[key];\n}\n\`\`\`\n\n**Scenario: You want to create a function that wraps any async function and returns [data, error] instead of throwing. How?**\n\`\`\`ts\nasync function tryCatch<T>(\n  fn: () => Promise<T>\n): Promise<[T, null] | [null, Error]> {\n  try {\n    return [await fn(), null];\n  } catch (err) {\n    return [null, err instanceof Error ? err : new Error(String(err))];\n  }\n}\n\`\`\``,
    codeExamples: [
      {
        title: 'Classic interview: implement Partial from scratch',
        code: `// "Can you implement Partial<T> without using the built-in?"

// Partial makes all properties optional
type MyPartial<T> = {
  [K in keyof T]?: T[K];
};

// Explanation:
// [K in keyof T] — iterate over all keys of T
// ?             — make each key optional
// T[K]          — preserve the original value type

// Test:
interface User { id: number; name: string; email: string; }
type PartialUser = MyPartial<User>;
// { id?: number; name?: string; email?: string }

// "Now implement Required<T>"
type MyRequired<T> = {
  [K in keyof T]-?: T[K]; // -? removes optionality
};

// "And Readonly<T>"
type MyReadonly<T> = {
  readonly [K in keyof T]: T[K];
};

// "And Pick<T, K>"
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
};

type UserPreview = MyPick<User, "id" | "name">;
// { id: number; name: string }`,
        explanation: 'Building utility types from scratch is a common advanced interview question. Understanding mapped types, keyof, and modifiers is essential.',
      },
      {
        title: 'Classic interview: deep readonly',
        code: `// "Write a type that makes all properties readonly recursively"

type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object
    ? T[K] extends Function
      ? T[K]                    // Leave functions as-is
      : DeepReadonly<T[K]>      // Recurse into nested objects
    : T[K];                     // Leave primitives as-is
};

interface Config {
  server: {
    host: string;
    port: number;
    ssl: { enabled: boolean; cert: string };
  };
  database: { url: string };
}

type FrozenConfig = DeepReadonly<Config>;
// Every property at every level is readonly

const config: FrozenConfig = {
  server: { host: "localhost", port: 3000, ssl: { enabled: true, cert: "..." } },
  database: { url: "..." },
};

config.server.host = "other";          // Error: readonly
config.server.ssl.enabled = false;    // Error: readonly (deep!)`,
        explanation: 'DeepReadonly uses a conditional type to recurse into objects. The Function check prevents making methods readonly (which would prevent calling them).',
      },
      {
        title: 'Classic interview: extract function parameter types',
        code: `// "How do you get the type of the first parameter of any function?"

type FirstParameter<T extends (...args: any) => any> =
  T extends (first: infer F, ...rest: any[]) => any ? F : never;

function createUser(name: string, email: string, role: number): void {}
function fetchData(id: number): Promise<string> { return Promise.resolve(""); }

type NameType = FirstParameter<typeof createUser>; // string
type IdType = FirstParameter<typeof fetchData>;    // number

// "How do you get ALL parameters?"
type AllParams<T extends (...args: any) => any> =
  T extends (...args: infer P) => any ? P : never;

type CreateUserParams = AllParams<typeof createUser>; // [string, string, number]

// These are exactly how TypeScript's built-in types work:
// Parameters<T> — same as AllParams<T>
// ReturnType<T> — extracts the return type with infer`,
        explanation: 'The infer keyword captures a type from within the extends clause. This pattern appears in TypeScript\'s own implementation of ReturnType, Parameters, etc.',
      },
    ],
    commonMistakes: [
      'Confusing Exclude (union) with Omit (object) — a very common interview mistake.',
      'Not knowing how mapped types work internally — interviewers often ask you to implement Partial or Readonly.',
      'Forgetting that interface supports declaration merging but type does not.',
      'Describing generics vaguely — be specific: "T is a type parameter that TypeScript infers from the argument."',
    ],
    interviewQuestions: [
      {
        question: 'Implement a type-safe event emitter without using any.',
        answer: 'Use a generic type parameter for the event map: class TypedEmitter<Events extends Record<string, (...args: any[]) => void>>. Then: on<K extends keyof Events>(event: K, handler: Events[K]): void and emit<K extends keyof Events>(event: K, ...args: Parameters<Events[K]>): void. This ensures event names are valid keys and handler arguments match the registered types.',
        difficulty: 'advanced',
      },
      {
        question: 'What is the difference between structural and nominal typing? Which does TypeScript use?',
        answer: 'Structural typing (duck typing) means two types are compatible if they have the same shape — regardless of their names. Nominal typing means types are compatible only if they are explicitly declared to be (class hierarchies). TypeScript uses structural typing — if two interfaces have the same properties and types, values of one are assignable to the other, even without any explicit relationship between them.',
        difficulty: 'advanced',
      },
      {
        question: 'What is the never type used for in practice?',
        answer: 'Two main uses: (1) Exhaustiveness checking — in a switch on a discriminated union, the default branch has type never. If you add a new union member and forget to handle it, TypeScript errors because the new member cannot be assigned to never. (2) Functions that never return — functions that always throw or run forever have return type never. Also appears as the element type of empty arrays (never[]) and in the result of impossible type intersections.',
        difficulty: 'advanced',
      },
    ],
    exercises: [
      {
        id: 'ex-interview-1',
        title: 'Implement type-safe Record from scratch',
        description: 'Implement MyRecord<K, V> that creates an object type with keys of type K and values of type V.',
        starterCode: `// Implement MyRecord<K extends string, V>
// It should create an object type where:
// - All keys are of type K (a union of string literals)
// - All values are of type V

type MyRecord<K extends string, V> = // your implementation

// Test cases:
type UserRole = "admin" | "editor" | "viewer";
type RolePermissions = MyRecord<UserRole, string[]>;
// Should be: { admin: string[]; editor: string[]; viewer: string[] }

type FeatureFlags = MyRecord<string, boolean>;
// Should be: { [key: string]: boolean }`,
        solution: `type MyRecord<K extends string, V> = {
  [P in K]: V;
};

type UserRole = "admin" | "editor" | "viewer";
type RolePermissions = MyRecord<UserRole, string[]>;
// { admin: string[]; editor: string[]; viewer: string[] }

type FeatureFlags = MyRecord<string, boolean>;
// { [key: string]: boolean }

// Verify:
const permissions: RolePermissions = {
  admin: ["read", "write", "delete"],
  editor: ["read", "write"],
  viewer: ["read"],
};`,
        hints: ['Use [P in K]: V — iterate over K and set value to V', 'This is exactly how Record<K, V> is implemented in TypeScript'],
      },
    ],
    keyTakeaways: [
      'Know the distinction: interface (declaration merging) vs type (unions, conditional types)',
      'Be able to implement Partial, Required, Readonly, Pick, Record from scratch',
      'Discriminated unions — shared literal discriminant field, switch/if narrowing',
      'Generics — T extends U for constraints, K extends keyof T for property access',
      'Never — exhaustiveness in switch default, functions that always throw',
      'infer — capture types in conditional type extends clauses',
    ],
    prevLesson: 'migrating-to-typescript',
    nextLesson: 'typescript-practice',
  },

  // ─── MODULE 24: Practice Section ────────────────────────────────────────────
  {
    id: 'typescript-practice',
    slug: 'typescript-practice',
    title: 'Practice Exercises',
    description: 'Hands-on exercises across all TypeScript topics — types, interfaces, generics, utility types, React, API, and backend typing.',
    category: 'Practice',
    order: 24,
    difficulty: 'intermediate',
    estimatedTime: 60,
    content: `Practice is the only way to solidify TypeScript knowledge. These exercises range from foundational to advanced. Try each without looking at the solution first.\n\n## How to Practice Effectively\n\n1. **Read the problem carefully** — understand what types you need to create\n2. **Start with the simplest case** — handle the happy path first\n3. **Add edge cases** — null, undefined, unions, error states\n4. **Verify with TypeScript** — hover over variables to check inferred types\n5. **Compare with the solution** — see if your approach differs\n\n## Topics Covered\n\n- Basic types and annotations\n- Interfaces and type aliases\n- Generics\n- Utility types\n- Discriminated unions\n- React component typing\n- API response typing\n- Backend middleware typing\n\n## Tips for TypeScript Exercises\n\n**When stuck on generics:**\n\`\`\`ts\n// Start with a specific type, then generalize\nfunction first(arr: string[]): string | undefined {\n  return arr[0];\n}\n// Now make it generic:\nfunction first<T>(arr: T[]): T | undefined {\n  return arr[0];\n}\n\`\`\`\n\n**When stuck on utility types:**\n\`\`\`ts\n// Think about what you want to transform:\n// "I want all properties optional" → Partial<T>\n// "I want to remove these fields" → Omit<T, "field1" | "field2">\n// "I want only these fields" → Pick<T, "field1" | "field2">\n\`\`\`\n\n**When stuck on discriminated unions:**\n\`\`\`ts\n// Add a shared "kind" or "type" literal field to each variant\ntype Result<T> =\n  | { kind: "success"; data: T }\n  | { kind: "error"; message: string };\n\`\`\``,
    codeExamples: [
      {
        title: 'Exercise 1: Type a configuration system',
        code: `// Problem: Create types for a typed configuration system
// Requirements:
// - Config has environment ("dev" | "staging" | "prod")
// - Config has server settings (host, port, ssl)
// - Config has database settings (url, poolSize, timeout)
// - Config has feature flags (Record of string to boolean)
// - Some fields differ by environment (ssl only in prod)

// Starter:
type Environment = "dev" | "staging" | "prod";

type DatabaseConfig = {
  // fill in
};

type ServerConfig = {
  // fill in
};

type AppConfig = {
  // fill in
};

// Solution (try first, then check):
type DatabaseConfig = {
  url: string;
  poolSize: number;
  timeout: number;
  ssl?: boolean;
};

type ServerConfig = {
  host: string;
  port: number;
  ssl: {
    enabled: boolean;
    certPath?: string;
    keyPath?: string;
  };
};

type AppConfig = {
  environment: Environment;
  server: ServerConfig;
  database: DatabaseConfig;
  features: Record<string, boolean>;
  debug: boolean;
};

const devConfig: AppConfig = {
  environment: "dev",
  server: { host: "localhost", port: 3000, ssl: { enabled: false } },
  database: { url: "postgresql://localhost/dev", poolSize: 5, timeout: 5000 },
  features: { darkMode: true, betaFeatures: true },
  debug: true,
};`,
        explanation: 'Real configuration objects need to be typed. Separate objects for each concern (server, database) keeps the types organized and reusable.',
      },
      {
        title: 'Exercise 2: Generic Pipeline',
        code: `// Problem: Build a typed pipeline where each step transforms the data
// Each step takes the output of the previous step as input

// Starter:
function pipe(value, ...fns) {
  return fns.reduce((v, fn) => fn(v), value);
}

// Should work like:
const result = pipe(
  "  hello world  ",
  (s: string) => s.trim(),            // string → string
  (s: string) => s.split(" "),        // string → string[]
  (arr: string[]) => arr.length       // string[] → number
);
// result should be: number (2)

// Solution:
function pipe<A>(value: A): A;
function pipe<A, B>(value: A, fn1: (a: A) => B): B;
function pipe<A, B, C>(value: A, fn1: (a: A) => B, fn2: (b: B) => C): C;
function pipe<A, B, C, D>(
  value: A,
  fn1: (a: A) => B,
  fn2: (b: B) => C,
  fn3: (c: C) => D
): D;
function pipe(value: unknown, ...fns: Function[]): unknown {
  return fns.reduce((v, fn) => fn(v), value);
}`,
        explanation: 'Typed pipe requires function overloads — one for each number of steps. Each overload tracks the type transformation from step to step.',
      },
      {
        title: 'Exercise 3: Type a form validation system',
        code: `// Problem: Create a type-safe form validation library

type ValidationRule<T> = (value: T) => string | null; // null = valid, string = error message

type FormSchema<T> = {
  [K in keyof T]: ValidationRule<T[K]>[];
};

type FormErrors<T> = Partial<Record<keyof T, string>>;

function validateForm<T extends Record<string, unknown>>(
  values: T,
  schema: FormSchema<T>
): FormErrors<T> {
  const errors: FormErrors<T> = {};

  for (const key in schema) {
    const value = values[key];
    const rules = schema[key];

    for (const rule of rules) {
      const error = rule(value);
      if (error) {
        errors[key] = error;
        break;
      }
    }
  }

  return errors;
}

// Usage
interface LoginForm {
  email: string;
  password: string;
}

const errors = validateForm<LoginForm>(
  { email: "not-an-email", password: "short" },
  {
    email: [
      v => v.length > 0 ? null : "Email is required",
      v => v.includes("@") ? null : "Invalid email format",
    ],
    password: [
      v => v.length > 0 ? null : "Password is required",
      v => v.length >= 8 ? null : "Must be at least 8 characters",
    ],
  }
);
// errors.email: "Invalid email format" (first failing rule)
// errors.password: "Must be at least 8 characters"`,
        explanation: 'FormSchema<T> uses a mapped type to ensure every field in T has validation rules. The types propagate through the entire system.',
      },
    ],
    commonMistakes: [
      'Giving up too quickly on generics — start with a concrete type and generalize step by step.',
      'Not using TypeScript\'s hover to verify your types — always check what TypeScript inferred.',
      'Writing any when stuck — try unknown or a more specific type first.',
    ],
    interviewQuestions: [
      {
        question: 'Write a type that extracts all keys of an object whose values are strings.',
        answer: 'type StringKeys<T> = { [K in keyof T]: T[K] extends string ? K : never }[keyof T]. The mapped type creates an object where non-string keys become never. Then indexing with [keyof T] collects all the non-never keys into a union.',
        difficulty: 'advanced',
      },
      {
        question: 'Write a Flatten<T> type that unwraps nested arrays.',
        answer: 'type Flatten<T> = T extends (infer E)[] ? Flatten<E> : T. This recursively unwraps arrays: Flatten<number[][][]> → number. The infer E captures the element type, then Flatten recurses until E is no longer an array.',
        difficulty: 'advanced',
      },
    ],
    exercises: [
      {
        id: 'ex-practice-1',
        title: 'Build a type-safe state machine',
        description: 'Create a generic state machine class that only allows valid state transitions.',
        starterCode: `// Build StateMachine<S extends string> where:
// - States are a union of string literals
// - Transitions define which states can follow each state
// - transition() only accepts valid next states (checked at compile time)
// - current property returns the current state

type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

type Transitions = {
  pending: "confirmed" | "cancelled";
  confirmed: "shipped" | "cancelled";
  shipped: "delivered";
  delivered: never;
  cancelled: never;
};

class StateMachine {
  // implement using generics
}

const order = new StateMachine<OrderStatus>("pending", transitions);
order.transition("confirmed"); // OK
order.transition("shipped");   // Error! Can't go from pending to shipped`,
        solution: `type Transitions<S extends string> = {
  [K in S]: S | never;
};

class StateMachine<S extends string> {
  private _current: S;

  constructor(
    initial: S,
    private readonly transitions: { [K in S]: S[] }
  ) {
    this._current = initial;
  }

  get current(): S {
    return this._current;
  }

  canTransitionTo(next: S): boolean {
    return this.transitions[this._current].includes(next);
  }

  transition(next: S): void {
    if (!this.canTransitionTo(next)) {
      throw new Error(
        \`Invalid transition from \${this._current} to \${next}\`
      );
    }
    this._current = next;
  }
}

type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

const orderMachine = new StateMachine<OrderStatus>("pending", {
  pending:   ["confirmed", "cancelled"],
  confirmed: ["shipped", "cancelled"],
  shipped:   ["delivered"],
  delivered: [],
  cancelled: [],
});

orderMachine.transition("confirmed"); // OK
console.log(orderMachine.current);   // "confirmed"`,
        hints: ['Generic S extends string represents all possible states', 'transitions maps each state to its allowed next states', 'transition() validates at runtime; for compile-time safety, use conditional types in advanced implementations'],
      },
    ],
    keyTakeaways: [
      'Practice building types from scratch — do not rely only on reading',
      'Generalize concrete types — write for string first, then make it T extends string',
      'Use TypeScript\'s hover in your editor to verify inferred types while practicing',
      'Mapped types + conditional types = powerful type transformations',
    ],
    prevLesson: 'typescript-interviews',
    nextLesson: 'typescript-mini-projects',
  },

  // ─── MODULE 25: Mini Projects ────────────────────────────────────────────────
  {
    id: 'typescript-mini-projects',
    slug: 'typescript-mini-projects',
    title: 'Mini Projects',
    description: 'Guided real-world TypeScript projects — typed Todo App, API Client, Auth System, Express Backend, React Dashboard, and Next.js project.',
    category: 'Projects',
    order: 25,
    difficulty: 'advanced',
    estimatedTime: 120,
    content: `Real-world projects are the best way to cement TypeScript knowledge. Each project here focuses on TypeScript patterns you will use in production.\n\n## Project 1: Typed Todo Application\n\n**Goal:** A complete CRUD Todo app with full type safety.\n\n**Types to build:**\n\`\`\`ts\ntype TodoId = string;\ntype Priority = "low" | "medium" | "high";\ntype TodoStatus = "pending" | "in_progress" | "completed";\n\ninterface Todo {\n  readonly id: TodoId;\n  title: string;\n  description?: string;\n  priority: Priority;\n  status: TodoStatus;\n  tags: string[];\n  readonly createdAt: Date;\n  updatedAt: Date;\n  dueDate?: Date;\n}\n\ntype CreateTodoInput = Omit<Todo, "id" | "createdAt" | "updatedAt">;\ntype UpdateTodoInput = Partial<Omit<Todo, "id" | "createdAt">>;\n\ninterface ITodoService {\n  getAll(filter?: Partial<Pick<Todo, "status" | "priority">>): Todo[];\n  getById(id: TodoId): Todo | undefined;\n  create(input: CreateTodoInput): Todo;\n  update(id: TodoId, input: UpdateTodoInput): Todo;\n  delete(id: TodoId): void;\n  search(query: string): Todo[];\n}\n\`\`\`\n\n## Project 2: Typed API Client\n\n**Goal:** A type-safe HTTP client that knows the response types for each endpoint.\n\n\`\`\`ts\n// Define the API contract\ninterface ApiEndpoints {\n  "GET /users": {\n    response: User[];\n    query?: { page?: number; limit?: number };\n  };\n  "GET /users/:id": {\n    response: User;\n    params: { id: string };\n  };\n  "POST /users": {\n    body: CreateUserInput;\n    response: User;\n  };\n  "DELETE /users/:id": {\n    params: { id: string };\n    response: { success: boolean };\n  };\n}\n\n// The client uses the contract:\nconst client = new TypedApiClient<ApiEndpoints>(baseUrl);\nconst users = await client.get("GET /users"); // TypeScript knows: User[]\nconst user = await client.get("GET /users/:id", { id: "1" }); // User\n\`\`\`\n\n## Project 3: Typed Authentication System\n\n**Goal:** JWT-based authentication with full type safety.\n\n\`\`\`ts\ninterface JwtPayload {\n  sub: string;       // userId\n  email: string;\n  role: UserRole;\n  iat: number;\n  exp: number;\n}\n\ninterface AuthTokens {\n  accessToken: string;\n  refreshToken: string;\n  expiresIn: number;\n}\n\ninterface IAuthService {\n  login(email: string, password: string): Promise<AuthTokens>;\n  logout(userId: string): Promise<void>;\n  refreshTokens(refreshToken: string): Promise<AuthTokens>;\n  verifyToken(token: string): JwtPayload;\n  hashPassword(password: string): Promise<string>;\n  comparePassword(plain: string, hashed: string): Promise<boolean>;\n}\n\`\`\`\n\n## Project 4: Typed Express Backend\n\n**Goal:** A full CRUD REST API for a blog with typed routes, middleware, and responses.\n\n**Structure:**\n\`\`\`\nsrc/\n├── types/\n│   ├── domain.ts     # Post, User, Comment interfaces\n│   └── dto.ts        # Request/Response DTOs\n├── middleware/\n│   ├── auth.ts       # Typed auth middleware\n│   └── validate.ts   # Generic Zod validation middleware\n├── services/\n│   └── PostService.ts\n├── repositories/\n│   └── PostRepository.ts\n├── routes/\n│   └── posts.ts      # Typed route handlers\n└── app.ts\n\`\`\`\n\n## Project 5: Typed React Dashboard\n\n**Goal:** A data dashboard with typed charts, tables, and API integration.\n\n**Key components to type:**\n\`\`\`tsx\n// Generic typed table\ninterface TableColumn<T> {\n  key: keyof T;\n  header: string;\n  sortable?: boolean;\n  render?: (value: T[keyof T], row: T) => React.ReactNode;\n}\n\ninterface DataTableProps<T> {\n  data: T[];\n  columns: TableColumn<T>[];\n  loading?: boolean;\n  onSort?: (key: keyof T, direction: "asc" | "desc") => void;\n  pagination?: PaginationProps;\n}\n\n// Typed chart data\ninterface ChartDataPoint {\n  label: string;\n  value: number;\n  color?: string;\n}\n\ninterface LineChartProps {\n  data: ChartDataPoint[];\n  xAxis: string;\n  yAxis: string;\n  title: string;\n}\n\`\`\`\n\n## Project 6: Typed Next.js Application\n\n**Goal:** A blog with App Router, typed Server Actions, and tRPC.\n\n**Key patterns:**\n\`\`\`ts\n// tRPC router — types flow from server to client automatically\nconst appRouter = router({\n  posts: router({\n    getAll: publicProcedure\n      .input(z.object({ page: z.number().default(1) }))\n      .query(async ({ input }) => {\n        return db.posts.findMany({ skip: (input.page - 1) * 10, take: 10 });\n        // Return type is automatically inferred\n      }),\n    create: protectedProcedure\n      .input(CreatePostSchema)\n      .mutation(async ({ input, ctx }) => {\n        return db.posts.create({ data: { ...input, authorId: ctx.user.id } });\n      }),\n  }),\n});\n\nexport type AppRouter = typeof appRouter;\n// Client gets the same types without any manual work\n\`\`\``,
    codeExamples: [
      {
        title: 'Project 1 starter: Typed Todo service implementation',
        code: `type TodoId = \`todo-\${string}\`;
type Priority = "low" | "medium" | "high";
type TodoStatus = "pending" | "in_progress" | "completed";

interface Todo {
  readonly id: TodoId;
  title: string;
  description?: string;
  priority: Priority;
  status: TodoStatus;
  tags: string[];
  readonly createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
}

type CreateTodoInput = Omit<Todo, "id" | "createdAt" | "updatedAt" | "status"> & {
  status?: TodoStatus;
};
type UpdateTodoInput = Partial<Omit<Todo, "id" | "createdAt">>;

class TodoService {
  private todos: Map<TodoId, Todo> = new Map();

  create(input: CreateTodoInput): Todo {
    const id: TodoId = \`todo-\${crypto.randomUUID()}\`;
    const now = new Date();
    const todo: Todo = {
      id,
      status: "pending",
      ...input,
      createdAt: now,
      updatedAt: now,
    };
    this.todos.set(id, todo);
    return todo;
  }

  update(id: TodoId, input: UpdateTodoInput): Todo {
    const existing = this.todos.get(id);
    if (!existing) throw new NotFoundError("Todo", id);

    const updated: Todo = {
      ...existing,
      ...input,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
    };
    this.todos.set(id, updated);
    return updated;
  }

  getAll(filter?: Partial<Pick<Todo, "status" | "priority">>): Todo[] {
    let todos = Array.from(this.todos.values());
    if (filter?.status) todos = todos.filter(t => t.status === filter.status);
    if (filter?.priority) todos = todos.filter(t => t.priority === filter.priority);
    return todos;
  }

  delete(id: TodoId): void {
    if (!this.todos.has(id)) throw new NotFoundError("Todo", id);
    this.todos.delete(id);
  }
}`,
        explanation: 'The TodoId type uses a template literal (todo-${string}) making it clear these IDs have a specific format. The service is typed throughout.',
      },
      {
        title: 'Project 2: Typed API client',
        code: `type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestConfig<TBody = unknown> {
  method: HttpMethod;
  body?: TBody;
  headers?: Record<string, string>;
  params?: Record<string, string>;
}

class TypedApiClient {
  constructor(
    private readonly baseUrl: string,
    private readonly defaultHeaders: Record<string, string> = {}
  ) {}

  private async request<TResponse, TBody = unknown>(
    path: string,
    config: RequestConfig<TBody>
  ): Promise<TResponse> {
    const url = new URL(path, this.baseUrl);

    if (config.params) {
      Object.entries(config.params).forEach(([k, v]) =>
        url.searchParams.set(k, v)
      );
    }

    const response = await fetch(url.toString(), {
      method: config.method,
      headers: {
        "Content-Type": "application/json",
        ...this.defaultHeaders,
        ...config.headers,
      },
      body: config.body ? JSON.stringify(config.body) : undefined,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error((error as any).message ?? \`HTTP \${response.status}\`);
    }

    return response.json() as Promise<TResponse>;
  }

  get<T>(path: string, params?: Record<string, string>): Promise<T> {
    return this.request<T>(path, { method: "GET", params });
  }

  post<TBody, TResponse>(path: string, body: TBody): Promise<TResponse> {
    return this.request<TResponse, TBody>(path, { method: "POST", body });
  }

  put<TBody, TResponse>(path: string, body: TBody): Promise<TResponse> {
    return this.request<TResponse, TBody>(path, { method: "PUT", body });
  }

  delete<T>(path: string): Promise<T> {
    return this.request<T>(path, { method: "DELETE" });
  }
}

// Usage
const api = new TypedApiClient("https://api.example.com", {
  Authorization: \`Bearer \${token}\`,
});

const users = await api.get<User[]>("/users");
const newUser = await api.post<CreateUserInput, User>("/users", { name: "Alice", email: "..." });`,
        explanation: 'Generic type parameters TBody and TResponse propagate types through the request. Each HTTP method helper simplifies the API.',
      },
    ],
    commonMistakes: [
      'Not defining types before writing implementation — type your interfaces first, then implement.',
      'Using any for the API response — always define response types explicitly.',
      'Not handling loading and error states in React projects — type them as part of the state.',
    ],
    interviewQuestions: [
      {
        question: 'Walk me through how you would type a React component that fetches and displays a list with pagination.',
        answer: 'I would: (1) Define the item interface (User, Post, etc). (2) Define PaginationState: { page: number; total: number; pageSize: number }. (3) Define the component state: { data: Item[]; pagination: PaginationState; loading: boolean; error: string | null }. (4) Type the API call with a generic get<PaginatedResponse<Item>>. (5) Use useEffect with url as dependency. (6) Type onClick handlers as () => void. (7) Pass typed props to child components (ItemCard, Pagination).',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'ex-projects-1',
        title: 'Build a typed localStorage utility',
        description: 'Create a typed localStorage wrapper that serializes/deserializes with type safety.',
        starterCode: `// Build TypedStorage<Schema> where Schema is an object
// mapping storage keys to their value types

// Usage:
interface AppStorage {
  user: { id: string; name: string } | null;
  theme: "light" | "dark";
  token: string;
  preferences: { notifications: boolean; language: string };
}

const storage = new TypedStorage<AppStorage>();
storage.set("theme", "dark");              // OK
storage.set("theme", "unknown");           // Error
storage.get("user");                       // User | null
storage.get("token");                      // string`,
        solution: `class TypedStorage<Schema extends Record<string, unknown>> {
  get<K extends keyof Schema>(key: K): Schema[K] | null {
    const raw = localStorage.getItem(String(key));
    if (raw === null) return null;
    try {
      return JSON.parse(raw) as Schema[K];
    } catch {
      return null;
    }
  }

  set<K extends keyof Schema>(key: K, value: Schema[K]): void {
    localStorage.setItem(String(key), JSON.stringify(value));
  }

  remove<K extends keyof Schema>(key: K): void {
    localStorage.removeItem(String(key));
  }

  clear(): void {
    localStorage.clear();
  }
}

interface AppStorage {
  user: { id: string; name: string } | null;
  theme: "light" | "dark";
  token: string;
}

const storage = new TypedStorage<AppStorage>();
storage.set("theme", "dark");    // OK
// storage.set("theme", "blue"); // Error`,
        hints: ['K extends keyof Schema ensures the key is valid', 'Schema[K] is the type of that specific key\'s value', 'JSON.parse returns unknown — cast with as Schema[K]'],
      },
    ],
    keyTakeaways: [
      'Define types before implementing — interfaces first, then code',
      'Use generic API clients to get type safety without repeating types at every call',
      'Template literal types (todo-${string}) add semantic meaning to string IDs',
      'Separate domain types from DTOs in project code',
      'tRPC is the ultimate TypeScript full-stack type safety — types flow from server to client',
    ],
    prevLesson: 'typescript-practice',
    nextLesson: 'typescript-revision',
  },

  // ─── MODULE 26: Revision Hub ─────────────────────────────────────────────────
  {
    id: 'typescript-revision',
    slug: 'typescript-revision',
    title: 'Revision Hub',
    description: 'Complete TypeScript cheat sheets — types, generics, utility types, React patterns, and a JavaScript vs TypeScript comparison guide.',
    category: 'Revision',
    order: 26,
    difficulty: 'beginner',
    estimatedTime: 30,
    content: `## TypeScript Core Cheat Sheet\n\n### Types\n\`\`\`ts\n// Primitives\nconst name: string = "Alice";\nconst age: number = 25;\nconst active: boolean = true;\nconst nothing: null = null;\nconst missing: undefined = undefined;\n\n// Special types\nlet x: any;      // disable type checking\nlet y: unknown;  // must narrow before use\nlet z: never;    // impossible value\nfunction log(): void {} // returns nothing\n\n// Arrays\nconst nums: number[] = [1, 2, 3];\nconst strs: Array<string> = ["a", "b"];\nconst readonly: readonly number[] = [1, 2, 3];\n\n// Tuples\nconst pair: [string, number] = ["Alice", 25];\nconst named: [name: string, age: number] = ["Alice", 25];\n\n// Union and intersection\ntype StringOrNumber = string | number;\ntype AdminUser = User & { permissions: string[] };\n\n// Literal types\ntype Direction = "north" | "south" | "east" | "west";\ntype Zero = 0;\n\`\`\`\n\n### Interfaces vs Type Aliases\n\n| Feature | interface | type |\n|---------|-----------|------|\n| Object shapes | ✅ | ✅ |\n| Union types | ❌ | ✅ |\n| Declaration merging | ✅ | ❌ |\n| extends keyword | ✅ | ❌ (use &) |\n| implements in class | ✅ | ✅ |\n| Conditional types | ❌ | ✅ |\n\n### Functions\n\`\`\`ts\n// Basic\nfunction add(a: number, b: number): number { return a + b; }\n\n// Optional and defaults\nfunction greet(name: string, greeting: string = "Hello"): string {\n  return \`\${greeting}, \${name}!\`;\n}\n\n// Rest params\nfunction sum(...nums: number[]): number {\n  return nums.reduce((a, b) => a + b, 0);\n}\n\n// Function type\ntype Handler = (event: Event) => void;\n\n// Generic\nfunction first<T>(arr: T[]): T | undefined { return arr[0]; }\n\`\`\`\n\n### Generics\n\`\`\`ts\n// Generic function\nfunction identity<T>(x: T): T { return x; }\n\n// Generic with constraint\nfunction getLength<T extends { length: number }>(x: T): number {\n  return x.length;\n}\n\n// Generic interface\ninterface Repository<T> {\n  findById(id: string): Promise<T | null>;\n  save(entity: T): Promise<T>;\n}\n\n// Generic with default\ninterface Container<T = string> { value: T; }\n\`\`\`\n\n### Utility Types Cheat Sheet\n\n\`\`\`ts\ninterface User { id: string; name: string; email: string; active: boolean; }\n\nPartial<User>   // { id?: string; name?: string; email?: string; active?: boolean }\nRequired<User>  // removes all ?\nReadonly<User>  // all readonly\nPick<User, "id" | "name">   // { id: string; name: string }\nOmit<User, "active">        // { id: string; name: string; email: string }\nRecord<"a" | "b", number>   // { a: number; b: number }\nExclude<"a" | "b" | "c", "a">  // "b" | "c"\nExtract<"a" | "b" | 1, string> // "a" | "b"\nNonNullable<string | null>   // string\n\nfunction fn(a: string, b: number): boolean { return true; }\nReturnType<typeof fn>    // boolean\nParameters<typeof fn>    // [a: string, b: number]\n\`\`\`\n\n### Advanced Types Quick Reference\n\n\`\`\`ts\n// keyof\ntype Keys = keyof User; // "id" | "name" | "email" | "active"\n\n// typeof (type level)\nconst config = { host: "localhost", port: 3000 };\ntype Config = typeof config; // { host: string; port: number }\n\n// Indexed access\ntype UserEmail = User["email"]; // string\n\n// Mapped type\ntype Optional<T> = { [K in keyof T]?: T[K] };\ntype Mutable<T> = { -readonly [K in keyof T]: T[K] };\n\n// Conditional type\ntype IsArray<T> = T extends any[] ? true : false;\n\n// Template literal type\ntype EventName<T extends string> = \`on\${Capitalize<T>}\`;\n\`\`\`\n\n### React TypeScript Patterns\n\n\`\`\`tsx\n// Props interface\ninterface ButtonProps {\n  label: string;\n  onClick: () => void;\n  variant?: "primary" | "secondary";\n  children?: React.ReactNode;\n}\n\n// Component\nfunction Button({ label, onClick, variant = "primary" }: ButtonProps) { ... }\n\n// State\nconst [user, setUser] = useState<User | null>(null);\nconst [items, setItems] = useState<string[]>([]);\n\n// Events\nconst handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { ... };\nconst handleSubmit = (e: React.FormEvent<HTMLFormElement>) => { ... };\n\n// Refs\nconst ref = useRef<HTMLInputElement>(null);\n\n// Context\nconst Ctx = createContext<ContextType | null>(null);\nfunction useCtx() {\n  const ctx = useContext(Ctx);\n  if (!ctx) throw new Error("Must be inside Provider");\n  return ctx;\n}\n\`\`\`\n\n### JavaScript vs TypeScript — Quick Comparison\n\n| Concept | JavaScript | TypeScript |\n|---------|-----------|------------|\n| Variable | \`let x = 5\` | \`let x: number = 5\` or \`let x = 5\` (inferred) |\n| Function | \`function f(a) {}\` | \`function f(a: string): void {}\` |\n| Object | \`const u = { name: "Alice" }\` | \`const u: User = { name: "Alice" }\` |\n| Array | \`const a = []\` | \`const a: string[] = []\` |\n| Class | \`class Foo {}\` | \`class Foo { private x: string; }\` |\n| Import | \`import { x } from "./a"\` | \`import type { X } from "./a"\` for types |\n| Error | Caught at runtime | Caught at compile time |\n| Tooling | Basic autocomplete | Rich autocomplete, go-to-def, refactoring |`,
    codeExamples: [
      {
        title: 'TypeScript in 30 lines — complete reference',
        code: `// Primitive types
const name: string = "Alice";
const age: number = 25;
const active: boolean = true;

// Type inference — no annotation needed
const inferred = "TypeScript"; // string

// Union types
type ID = string | number;

// Interfaces and type aliases
interface User { id: ID; name: string; email?: string }
type Role = "admin" | "user" | "guest";

// Generics
function first<T>(arr: T[]): T | undefined { return arr[0]; }

// Utility types
type PartialUser = Partial<User>;
type PublicUser = Omit<User, "email">;

// Discriminated union
type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

// Type guard
function isString(x: unknown): x is string { return typeof x === "string"; }

// Mapped type
type Nullable<T> = { [K in keyof T]: T[K] | null };

// Conditional type
type Unwrap<T> = T extends Promise<infer R> ? R : T;

// keyof + indexed access
function get<T, K extends keyof T>(obj: T, key: K): T[K] { return obj[key]; }`,
        explanation: 'This 30-line reference covers all core TypeScript concepts. Useful for quick review before interviews.',
      },
      {
        title: 'Common patterns quick reference',
        code: `// Null safety
const user: User | null = getUser();
const name = user?.name ?? "Anonymous"; // optional chaining + nullish coalescing

// Type assertion (use sparingly)
const input = document.getElementById("name") as HTMLInputElement;

// Non-null assertion (use only when you are certain)
const definitelyUser = maybeUser!; // tells TS "trust me, it's not null"

// as const — literal types
const ROLES = ["admin", "editor", "viewer"] as const;
type Role = typeof ROLES[number]; // "admin" | "editor" | "viewer"

// Satisfies operator (TS 4.9+) — validates without widening
const config = {
  port: 3000,
  host: "localhost",
} satisfies Partial<ServerConfig>;
// config.port is still 3000 (literal), not number

// Template literal types
type ApiPath = \`/api/\${string}\`;
type EventHandler<T extends string> = \`on\${Capitalize<T>}\`;

// infer in conditional types
type ElementType<T> = T extends (infer E)[] ? E : never;
type PromiseType<T> = T extends Promise<infer R> ? R : T;`,
        explanation: 'These patterns appear in every production TypeScript codebase. Non-null assertion (!) should be rare — prefer optional chaining (?.).',
      },
    ],
    commonMistakes: [
      'Using type assertions (as) instead of type guards — assertions bypass safety, guards prove types.',
      'Over-using non-null assertion (!) — it will crash if the value is actually null.',
      'Forgetting that TypeScript types are erased at runtime — never use them for runtime logic.',
      'Not using as const for configuration arrays — without it, types are string[] instead of literal types.',
    ],
    interviewQuestions: [
      {
        question: 'In one sentence, what does TypeScript add to JavaScript?',
        answer: 'TypeScript adds a static type system to JavaScript — it catches type errors at compile time instead of runtime, with zero runtime overhead because all type information is erased in the output JavaScript.',
        difficulty: 'beginner',
      },
      {
        question: 'Name five utility types and explain what they do.',
        answer: '(1) Partial<T> — makes all properties optional. (2) Omit<T, K> — creates a new type excluding specified properties. (3) Pick<T, K> — creates a type with only the specified properties. (4) Record<K, V> — creates an object type with keys K and values V. (5) ReturnType<T> — extracts the return type of a function type.',
        difficulty: 'intermediate',
      },
      {
        question: 'What is structural typing and how does it affect TypeScript?',
        answer: 'Structural typing means two types are compatible if they have the same structure (same properties and types) — regardless of their names. In TypeScript, if object A has all the properties that interface B requires, you can assign A to B even if A was not explicitly declared to implement B. This is different from nominal typing (Java, C#) where explicit declarations are required. It enables duck typing patterns from JavaScript while still providing type safety.',
        difficulty: 'advanced',
      },
    ],
    exercises: [
      {
        id: 'ex-revision-1',
        title: 'TypeScript diagnosis quiz',
        description: 'Identify the TypeScript errors in this code and explain how to fix each one.',
        starterCode: `// Find and explain all TypeScript errors:

// 1.
const users = [];
users.push({ name: "Alice" });
users.push({ age: 25 }); // ?

// 2.
function greet(person: { name: string }) {
  return "Hello " + person.firstName; // ?
}

// 3.
async function fetchUser(): User {
  const res = await fetch("/api/user");
  return res.json();
}

// 4.
type Status = "active" | "inactive";
function setStatus(status: Status) { }
setStatus("pending"); // ?

// 5.
try {
  riskyOperation();
} catch (error) {
  console.log(error.message); // ?
}`,
        solution: `// Fixes and explanations:

// 1. Empty array inferred as never[] — must annotate
interface User { name: string; age?: number; }
const users: User[] = [];
users.push({ name: "Alice" }); // OK
users.push({ age: 25 });       // Error: name is missing (required)

// 2. person.firstName doesn't exist — it's person.name
function greet(person: { name: string }) {
  return "Hello " + person.name; // Fixed
}

// 3. Async function must return Promise<User>, not User
async function fetchUser(): Promise<User> {
  const res = await fetch("/api/user");
  return res.json() as Promise<User>; // Also cast the JSON
}

// 4. "pending" is not in the Status union
type Status = "active" | "inactive" | "pending"; // add pending
// OR: pass a valid value
setStatus("active"); // OK

// 5. error is unknown in catch — must narrow first
try {
  riskyOperation();
} catch (error) {
  if (error instanceof Error) {
    console.log(error.message); // Safe
  } else {
    console.log(String(error));
  }
}`,
        hints: ['Empty arrays are never[] without annotation', 'Check the exact property names', 'Async functions return Promise<T>', 'Catch errors are unknown — always check instanceof'],
      },
    ],
    keyTakeaways: [
      'TypeScript = JavaScript + static types — all JS is valid TS',
      'Types are erased at runtime — zero runtime cost',
      'Strict mode — always use strict: true in production projects',
      'Generics — reuse code across types while preserving type safety',
      'Utility types — Partial, Pick, Omit, Record, ReturnType are your most-used tools',
      'Discriminated unions — the most powerful pattern for variant data',
    ],
    prevLesson: 'typescript-mini-projects',
  },
];
