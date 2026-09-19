import type { Lesson } from '@/types';

export const lessons: Lesson[] = [
  // ─── MODULE 1: Introduction to Node.js ──────────────────────────────────────
  {
    id: 'what-is-nodejs',
    slug: 'what-is-nodejs',
    title: 'What is Node.js?',
    description: 'Understand what Node.js is, why it exists, how it differs from browser JavaScript, and why companies like Netflix, Uber, and PayPal use it.',
    category: 'Introduction',
    order: 1,
    difficulty: 'beginner',
    estimatedTime: 20,
    content: `Node.js is a **JavaScript runtime built on Chrome's V8 engine** that lets you run JavaScript outside the browser — on servers, CLIs, and any machine.\n\nBefore Node.js, JavaScript only ran inside browsers. Servers were written in Java, Python, Ruby, or PHP. Node.js changed that in 2009 when Ryan Dahl released it with one bold idea: use JavaScript everywhere.\n\n## Why Node.js Exists\n\nIn 2009, web servers had a problem. The dominant model (Apache, Tomcat) created **one thread per request**. A thread waiting for a database query or file read just sat idle, consuming memory. Under high traffic, servers ran out of threads.\n\nRyan Dahl's insight: instead of blocking a thread while waiting for I/O, use **event-driven, non-blocking I/O**. A single thread can handle thousands of concurrent connections because it never waits — it registers a callback and moves on.\n\nNode.js was built specifically for I/O-heavy workloads: APIs, real-time apps, streaming services.\n\n## What is V8\n\nV8 is Google's JavaScript engine, written in C++. It compiles JavaScript directly to native machine code (not interpreted line by line). Chrome uses V8. Node.js takes V8 and adds:\n- File system access\n- Network access\n- OS-level APIs\n- A module system\n\nSo Node.js = V8 + C++ bindings for system access.\n\n## Browser JavaScript vs Node.js\n\n| Feature | Browser JS | Node.js |\n|---------|-----------|--------|\n| Environment | Browser | Server / CLI |\n| Global object | window | global / globalThis |\n| DOM | Yes | No |\n| File system | No | Yes (fs module) |\n| HTTP server | No | Yes (http module) |\n| Module system | ES Modules | CommonJS + ES Modules |\n| Package manager | CDN / bundler | npm / yarn / pnpm |\n| Security sandbox | Yes (strict) | No (full OS access) |\n\n## Node.js Architecture\n\nNode.js has four layers:\n\n**1. Your JavaScript Code** — what you write\n\n**2. Node.js APIs** — built-in modules: fs, http, path, events, streams\n\n**3. libuv** — a C library that handles the event loop, async I/O, and thread pool. This is what makes non-blocking I/O possible.\n\n**4. V8** — compiles and executes your JavaScript\n\n\`\`\`\n┌─────────────────────────────┐\n│     Your JavaScript Code    │\n├─────────────────────────────┤\n│     Node.js Built-in APIs   │\n├──────────────┬──────────────┤\n│     libuv    │      V8      │\n│ (event loop) │  (JS engine) │\n└──────────────┴──────────────┘\n\`\`\`\n\n## Real World Usage\n\n**Netflix** — Migrated from Java to Node.js. Result: startup time dropped from 40 minutes to under a minute. Node handles their API layer serving 182 million users.\n\n**Uber** — Uses Node.js for their dispatch system. Reason: high concurrency (matching millions of riders/drivers in real time) is exactly what Node.js handles best.\n\n**PayPal** — Rebuilt their checkout page in Node.js. Result: 35% faster response time, double the requests per second, 33% fewer lines of code compared to Java.\n\n**LinkedIn** — Moved mobile backend from Ruby on Rails to Node.js. Result: 2 servers replaced 30 servers. 20x faster.\n\n## When NOT to Use Node.js\n\nNode.js is a single-threaded runtime. CPU-intensive work (video encoding, image processing, ML inference, complex math) blocks the event loop and kills performance.\n\nFor CPU-heavy work, use:\n- **Python** — data science, ML\n- **Go** — high-performance services\n- **Rust** — systems programming\n- **Java/C++** — compute-intensive backends\n\nNode.js excels at: APIs, real-time apps, streaming, microservices, CLI tools. It struggles at: heavy computation.`,
    codeExamples: [
      {
        title: 'Your first Node.js program',
        code: `// hello.js
console.log('Hello from Node.js');
console.log('Node version:', process.version);
console.log('Platform:', process.platform);
console.log('Current directory:', process.cwd());

// Run with: node hello.js`,
        output: `Hello from Node.js
Node version: v20.11.0
Platform: linux
Current directory: /home/user/project`,
        explanation: 'process is a global object in Node.js (like window in browsers). It gives you runtime information about the Node.js process.',
      },
      {
        title: 'Node.js has no DOM — but has everything else',
        code: `// In browser: window, document, navigator exist
// In Node.js: they do NOT exist

// What Node.js HAS that browsers do NOT:
const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('OS:', os.type());
console.log('CPU cores:', os.cpus().length);
console.log('Free memory:', Math.round(os.freemem() / 1024 / 1024), 'MB');
console.log('Home dir:', os.homedir());`,
        explanation: 'Node.js gives you OS-level access. You can read files, check system resources, manage processes — things a browser cannot do for security reasons.',
      },
      {
        title: 'A basic HTTP server in Node.js',
        code: `const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello from Node.js server!');
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});

// Visit http://localhost:3000 — you get a response
// One file. No Apache. No Tomcat. No configuration.`,
        explanation: 'This is all it takes to create an HTTP server in Node.js. This same pattern powers frameworks like Express, Fastify, and Koa.',
      },
    ],
    commonMistakes: [
      'Thinking Node.js is a programming language — it is a runtime. JavaScript is the language.',
      'Using Node.js for CPU-heavy tasks like video processing — it blocks the single thread.',
      'Assuming browser APIs (localStorage, document, window) exist in Node.js — they do not.',
      'Confusing Node.js version with V8 version — they are different but related.',
    ],
    interviewQuestions: [
      {
        question: 'What is Node.js and what problem does it solve?',
        answer: 'Node.js is a JavaScript runtime built on Chrome\'s V8 engine that lets JavaScript run on the server. It solves the C10K problem — handling 10,000+ concurrent connections efficiently. Traditional servers (Apache) block a thread per request. Node.js uses non-blocking I/O and an event loop so one thread handles many connections without waiting.',
        difficulty: 'beginner',
      },
      {
        question: 'What is the V8 engine?',
        answer: 'V8 is Google\'s open-source JavaScript engine written in C++. It compiles JavaScript to native machine code (JIT compilation) instead of interpreting it. Chrome uses V8 in the browser. Node.js takes V8 and adds file system access, network APIs, and OS bindings on top.',
        difficulty: 'beginner',
      },
      {
        question: 'What are the differences between browser JavaScript and Node.js?',
        answer: 'Browser JS runs in a security sandbox with access to DOM, window, and browser APIs but no file system. Node.js runs on the server with full OS access (file system, network, processes) but no DOM. The global object is window in browsers and global/globalThis in Node.js. Node.js uses CommonJS modules by default; browsers use ES Modules.',
        difficulty: 'beginner',
      },
      {
        question: 'When would you NOT use Node.js?',
        answer: 'Node.js is single-threaded, so CPU-intensive tasks block the event loop and degrade performance for all requests. Avoid Node.js for video encoding, image processing, machine learning inference, complex numerical computation, or any task that needs heavy CPU work. Use Python, Go, or Java for those instead.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'ex-node-1',
        title: 'Explore the process object',
        description: 'Write a Node.js script that prints OS information, Node version, memory usage, and environment variables.',
        starterCode: `const os = require('os');

// Print the following:
// 1. Node.js version
// 2. Operating system name
// 3. Number of CPU cores
// 4. Total memory in GB (rounded to 2 decimal places)
// 5. The value of the PATH environment variable`,
        solution: `const os = require('os');

console.log('Node version:', process.version);
console.log('OS:', os.type());
console.log('CPU cores:', os.cpus().length);
console.log('Total memory:', (os.totalmem() / 1024 / 1024 / 1024).toFixed(2), 'GB');
console.log('PATH:', process.env.PATH);`,
        hints: ['Use process.version for Node version', 'os.type() returns OS name', 'process.env holds environment variables'],
      },
    ],
    keyTakeaways: [
      'Node.js is a JavaScript runtime — not a language. It runs JS outside the browser.',
      'Built on V8 (Chrome\'s JS engine) + libuv (for async I/O and event loop)',
      'Non-blocking I/O lets one thread handle thousands of concurrent connections',
      'Perfect for APIs, real-time, streaming — avoid for CPU-heavy work',
      'Major companies (Netflix, Uber, PayPal) use Node.js for performance-critical services',
    ],
    nextLesson: 'nodejs-event-loop',
  },

  // ─── MODULE 2: How Node.js Works Internally ─────────────────────────────────
  {
    id: 'nodejs-event-loop',
    slug: 'nodejs-event-loop',
    title: 'How Node.js Works Internally — Event Loop',
    description: 'Deep dive into the event loop, non-blocking I/O, the thread pool, worker threads, and how Node.js achieves concurrency with a single thread.',
    category: 'Internals',
    order: 2,
    difficulty: 'intermediate',
    estimatedTime: 40,
    content: `This is the most important module in the entire Node.js track. Every performance issue, every confusing bug, every design decision in Node.js traces back to the event loop.\n\n## The Single-Threaded Model\n\nNode.js runs your JavaScript on a **single thread**. There is exactly one call stack. Two pieces of your code cannot run at the same time.\n\nYet Node.js handles thousands of concurrent HTTP connections. How?\n\nThe answer is **non-blocking I/O + the event loop**.\n\n## Blocking vs Non-Blocking I/O\n\n**Blocking I/O** — the thread waits until the operation completes:\n\`\`\`\nThread: "Read file..." → [waiting 50ms] → "OK, got data" → continue\n         ↑ Thread is frozen here. Cannot do anything else.\n\`\`\`\n\n**Non-blocking I/O** — the thread registers a callback and moves on:\n\`\`\`\nThread: "Read file... here's my callback" → [moves on immediately]\n         ↑ Thread is free to handle other requests\n[50ms later] → OS: "File ready!" → callback is queued → thread runs callback\n\`\`\`\n\nThis is the core of Node.js performance. The JavaScript thread is almost never waiting — it's always handling new work while I/O operations happen in the background.\n\n## The Event Loop — Phase by Phase\n\nThe event loop is a continuous loop that checks queues and runs callbacks. It has phases:\n\n\`\`\`\n   ┌─────────────────────────┐\n   │         timers          │  ← setTimeout, setInterval callbacks\n   └──────────┬──────────────┘\n              │\n   ┌──────────▼──────────────┐\n   │     pending callbacks   │  ← I/O callbacks deferred from last iteration\n   └──────────┬──────────────┘\n              │\n   ┌──────────▼──────────────┐\n   │       idle, prepare     │  ← internal use only\n   └──────────┬──────────────┘\n              │\n   ┌──────────▼──────────────┐\n   │          poll           │  ← retrieve new I/O events, execute callbacks\n   └──────────┬──────────────┘\n              │\n   ┌──────────▼──────────────┐\n   │          check          │  ← setImmediate callbacks\n   └──────────┬──────────────┘\n              │\n   ┌──────────▼──────────────┐\n   │     close callbacks     │  ← socket.on('close', ...) etc\n   └─────────────────────────┘\n              │\n              └──────────────────► (loop repeats)\n\`\`\`\n\n**Between every phase**, Node.js drains two special queues:\n1. **process.nextTick queue** — runs before anything else in the next iteration\n2. **Promise microtask queue** — runs after nextTick\n\n## Execution Order (Critical to Understand)\n\nWhen Node.js executes code, the priority order is:\n1. Synchronous code (current call stack)\n2. process.nextTick callbacks\n3. Promise .then() / async/await callbacks (microtasks)\n4. setImmediate callbacks (check phase)\n5. setTimeout / setInterval callbacks (timers phase)\n6. I/O callbacks\n\n## The Thread Pool (libuv)\n\nNode.js is single-threaded for JavaScript, but **not** for I/O.\n\nlibuv maintains a **thread pool** (default: 4 threads) for operations the OS cannot do asynchronously:\n- File system operations (fs.readFile, fs.writeFile)\n- DNS lookups (dns.lookup)\n- Crypto operations (crypto.pbkdf2, crypto.randomBytes)\n- zlib compression\n\nWhen you call fs.readFile, it goes to the thread pool. A pool thread reads the file. When done, the callback is pushed to the event loop queue.\n\n\`\`\`\nYour JS code\n     │\n     ▼\n  Event Loop (single JS thread)\n     │\n     ├── Network I/O ──► OS kernel (async, no thread used)\n     │\n     └── File/Crypto ──► libuv Thread Pool (4 threads)\n                              │\n                              └──► callback pushed to event loop when done\n\`\`\`\n\n## Worker Threads\n\nFor CPU-intensive JavaScript work, Node.js has **worker_threads** (added in Node 10, stable in Node 12).\n\nWorker threads run JavaScript in a separate thread. They share memory via SharedArrayBuffer and communicate via message passing.\n\nUse worker threads for: JSON parsing large files, image processing in pure JS, complex calculations.\n\nDo NOT use worker threads for I/O — that is already handled efficiently by the event loop.\n\n## Concurrency vs Parallelism in Node.js\n\n**Concurrency** — handling multiple tasks by interleaving them on one thread (what the event loop does)\n\n**Parallelism** — running multiple tasks simultaneously on multiple CPU cores (what worker threads enable)\n\nNode.js achieves **concurrency** by default. For **parallelism**, you need worker threads or child processes.\n\n## What Blocks the Event Loop\n\nThese operations BLOCK the event loop — avoid in production:\n- fs.readFileSync, fs.writeFileSync (synchronous file I/O)\n- JSON.parse on a 100MB file\n- crypto.pbkdf2Sync\n- Any long-running loop: for (let i = 0; i < 1_000_000_000; i++)\n- Regular expressions with catastrophic backtracking\n\nIf you block the event loop for 100ms, ALL users experience 100ms of delay — even those doing simple requests.`,
    codeExamples: [
      {
        title: 'Execution order — the most asked interview topic',
        code: `console.log('1 - synchronous');

setTimeout(() => console.log('2 - setTimeout 0ms'), 0);

Promise.resolve().then(() => console.log('3 - promise microtask'));

process.nextTick(() => console.log('4 - nextTick'));

console.log('5 - synchronous');

// Output order:
// 1 - synchronous
// 5 - synchronous
// 4 - nextTick          ← runs before promises
// 3 - promise microtask ← runs before setTimeout
// 2 - setTimeout 0ms    ← runs last (timer phase)`,
        explanation: 'Sync code runs first, then nextTick, then Promise microtasks, then timers. Understanding this order is essential for debugging async bugs.',
      },
      {
        title: 'Non-blocking file read vs blocking',
        code: `const fs = require('fs');

// ❌ BLOCKING — freezes the event loop
const data = fs.readFileSync('large-file.txt', 'utf8');
console.log('Read', data.length, 'chars');
// Everything else waits while this reads

// ✅ NON-BLOCKING — event loop stays free
fs.readFile('large-file.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log('Read', data.length, 'chars');
});
console.log('This runs IMMEDIATELY — does not wait for file read');

// Promise version (async/await — also non-blocking)
const fsPromises = require('fs').promises;

async function readFile() {
  const data = await fsPromises.readFile('large-file.txt', 'utf8');
  console.log('Read', data.length, 'chars');
}`,
        explanation: 'readFileSync blocks the JS thread. readFile (callback) and fsPromises.readFile (promise) are non-blocking — the event loop handles other requests while the file is being read.',
      },
      {
        title: 'Worker threads for CPU-intensive work',
        code: `// main.js
const { Worker, isMainThread, parentPort } = require('worker_threads');

if (isMainThread) {
  // This runs in the main thread
  const worker = new Worker(__filename); // run this same file as a worker

  worker.on('message', (result) => {
    console.log('Result from worker:', result);
  });

  worker.postMessage({ start: 0, end: 1_000_000_000 });

  console.log('Main thread is free — event loop not blocked');
} else {
  // This runs in the worker thread
  parentPort.on('message', ({ start, end }) => {
    let sum = 0;
    for (let i = start; i < end; i++) sum += i;
    parentPort.postMessage(sum);
  });
}`,
        explanation: 'The heavy computation (summing 1 billion numbers) runs in a worker thread, leaving the main event loop free to handle HTTP requests.',
      },
      {
        title: 'setImmediate vs setTimeout(fn, 0)',
        code: `// Inside an I/O callback, setImmediate ALWAYS runs before setTimeout
const fs = require('fs');

fs.readFile(__filename, () => {
  setTimeout(() => console.log('setTimeout'), 0);
  setImmediate(() => console.log('setImmediate'));
});

// Always outputs:
// setImmediate
// setTimeout

// Outside I/O context — order is non-deterministic (depends on system timer)
setTimeout(() => console.log('timeout'), 0);
setImmediate(() => console.log('immediate'));
// Either order possible`,
        explanation: 'Inside an I/O callback, setImmediate always fires before setTimeout because the event loop is in the poll phase and check phase (setImmediate) comes next.',
      },
    ],
    commonMistakes: [
      'Thinking "single-threaded" means slow — Node.js is fast because it never blocks the thread waiting for I/O.',
      'Using synchronous fs/crypto methods in production request handlers — they block ALL users.',
      'Expecting setTimeout(fn, 0) to run before Promises — it runs after all microtasks.',
      'Running CPU-heavy JavaScript on the main thread — it blocks the event loop. Use worker threads.',
      'Thinking all Node.js is single-threaded — libuv uses a thread pool for file I/O and crypto.',
    ],
    interviewQuestions: [
      {
        question: 'Explain the Node.js event loop.',
        answer: 'The event loop is what allows Node.js to perform non-blocking I/O with a single JavaScript thread. It runs in phases: timers (setTimeout/setInterval), pending callbacks, poll (new I/O events), check (setImmediate), close callbacks. Between each phase, it drains the nextTick queue and Promise microtask queue. When an async operation completes (file read, network response), its callback is queued and the event loop executes it when it reaches the appropriate phase.',
        difficulty: 'intermediate',
        tip: 'Draw the phases. Show the order: nextTick → Promises → setImmediate → setTimeout.',
      },
      {
        question: 'What is the output order of this code: console.log(1), setTimeout(fn, 0), Promise.resolve().then(fn), process.nextTick(fn), console.log(2)?',
        answer: 'Order: 1, 2, nextTick, Promise, setTimeout. Synchronous code (1, 2) runs first. Then process.nextTick (before microtasks). Then Promise microtasks. Then setTimeout (timer phase of event loop, runs after all microtasks are drained).',
        difficulty: 'intermediate',
        tip: 'This is one of the most common Node.js interview questions. Memorize: sync → nextTick → Promise → setTimeout/setInterval.',
      },
      {
        question: 'What is the libuv thread pool and when is it used?',
        answer: 'libuv maintains a default thread pool of 4 threads for operations the OS cannot do asynchronously: file system operations (readFile, writeFile), DNS resolution (dns.lookup), crypto operations (pbkdf2, randomBytes), and zlib compression. Network I/O does NOT use the thread pool — it uses OS-level async mechanisms (epoll on Linux, kqueue on macOS, IOCP on Windows).',
        difficulty: 'advanced',
      },
      {
        question: 'What blocks the event loop and how do you avoid it?',
        answer: 'The event loop is blocked by: synchronous file/crypto operations (readFileSync, pbkdf2Sync), large JSON.parse/JSON.stringify, computationally heavy loops, and regex with catastrophic backtracking. Solutions: use async versions of everything, break heavy work into smaller chunks with setImmediate between them, move CPU work to worker threads, or use child_process.fork to run in a separate process.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'ex-node-2',
        title: 'Predict the output order',
        description: 'Without running the code, predict the exact output order and explain why.',
        starterCode: `process.nextTick(() => console.log('A'));
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C'));
console.log('D');
setImmediate(() => console.log('E'));
Promise.resolve().then(() => {
  console.log('F');
  process.nextTick(() => console.log('G'));
});

// What is the output order? Write it out before running.`,
        solution: `// Output: D, A, C, F, G, E, B
// Explanation:
// D — synchronous, runs first
// A — nextTick queue, drained before microtasks
// C — Promise microtask
// F — Promise microtask (same batch as C)
// G — nextTick scheduled inside F, runs before next microtask batch
// E — setImmediate (check phase)
// B — setTimeout (timers phase, after setImmediate in this case)`,
        hints: ['Sync code runs first', 'nextTick runs before Promise microtasks', 'nextTick scheduled inside a Promise still runs before the next microtask'],
      },
    ],
    keyTakeaways: [
      'Node.js uses a single JS thread + non-blocking I/O to handle high concurrency',
      'Event loop phases: timers → pending → poll → check (setImmediate) → close',
      'Microtask order: nextTick first, then Promises — both run between every event loop phase',
      'libuv thread pool (4 threads by default) handles file I/O and crypto in the background',
      'Worker threads provide true parallelism for CPU-intensive JavaScript work',
      'Blocking the event loop hurts ALL concurrent users — never use sync methods in request handlers',
    ],
    prevLesson: 'what-is-nodejs',
    nextLesson: 'nodejs-runtime-globals',
  },

  // ─── MODULE 3: Node.js Runtime ───────────────────────────────────────────────
  {
    id: 'nodejs-runtime-globals',
    slug: 'nodejs-runtime-globals',
    title: 'Node.js Runtime — Globals, Process, Buffer',
    description: 'Master Node.js global objects, the process object, Buffer, timers, environment variables, and command-line arguments.',
    category: 'Runtime',
    order: 3,
    difficulty: 'beginner',
    estimatedTime: 25,
    content: `## Global Objects in Node.js\n\nIn browsers, the global object is \`window\`. In Node.js it is \`global\` (or \`globalThis\` which works in both).\n\nThings available globally without requiring:\n- \`console\` — logging\n- \`process\` — runtime info and control\n- \`Buffer\` — binary data handling\n- \`setTimeout\`, \`setInterval\`, \`setImmediate\`, \`clearTimeout\`, \`clearInterval\`\n- \`__dirname\` — absolute path of current file's directory (CommonJS only)\n- \`__filename\` — absolute path of current file (CommonJS only)\n- \`require\` — load modules (CommonJS only)\n- \`module\`, \`exports\` — module system (CommonJS only)\n\n## The process Object\n\n\`process\` is the most important global in Node.js. It represents the running Node.js process.\n\n\`\`\`\nprocess.version      // Node.js version: 'v20.11.0'\nprocess.platform     // OS: 'linux', 'darwin', 'win32'\nprocess.arch         // CPU: 'x64', 'arm64'\nprocess.pid          // Process ID\nprocess.cwd()        // Current working directory\nprocess.env          // Environment variables\nprocess.argv         // Command-line arguments\nprocess.exit(code)   // Exit the process (0 = success, 1 = error)\nprocess.memoryUsage() // Memory stats\nprocess.hrtime()     // High-resolution timer (nanoseconds)\n\`\`\`\n\n## Environment Variables (process.env)\n\nEnvironment variables are the standard way to configure Node.js applications without hardcoding values.\n\n\`\`\`bash\n# Set env variable when running:\nPORT=4000 NODE_ENV=production node server.js\n\`\`\`\n\nIn code:\n\`\`\`js\nconst port = process.env.PORT || 3000;\nconst isProduction = process.env.NODE_ENV === 'production';\n\`\`\`\n\n**Never hardcode secrets.** Database passwords, API keys, JWT secrets — all go in environment variables. Use a \`.env\` file for local development with the \`dotenv\` package.\n\n## Command Line Arguments (process.argv)\n\n\`\`\`bash\nnode script.js hello world 42\n\`\`\`\n\nprocess.argv is an array:\n- [0] — path to node executable\n- [1] — path to your script\n- [2+] — your arguments\n\n\`\`\`js\nconst args = process.argv.slice(2); // ['hello', 'world', '42']\n\`\`\`\n\n## Buffer — Binary Data\n\nBuffer is a global class for working with binary data — bytes. Useful for:\n- Reading binary files (images, videos)\n- Network protocols\n- Cryptography\n- Encoding/decoding\n\nBuffer is a fixed-size chunk of memory allocated outside the V8 heap.\n\n## Timers\n\nNode.js timers work like browser timers but with extras:\n\n\`\`\`js\n// Standard (same as browser)\nsetTimeout(fn, delay)      // run once after delay ms\nsetInterval(fn, delay)     // run repeatedly every delay ms\nclearTimeout(id)\nclearInterval(id)\n\n// Node.js specific\nsetImmediate(fn)           // run after current I/O events, before timers\nclearImmediate(id)\n\n// Unref — don't keep process alive just for this timer\nconst timer = setTimeout(fn, 5000);\ntimer.unref(); // process can exit even if timer hasn't fired\n\`\`\`\n\n## process.exit and Graceful Shutdown\n\nIn production, you should handle shutdown signals and clean up before exiting:\n\n\`\`\`js\nprocess.on('SIGTERM', async () => {\n  console.log('Shutting down gracefully...');\n  await server.close();\n  await db.disconnect();\n  process.exit(0);\n});\n\`\`\`\n\nSIGTERM is sent by orchestration tools (Kubernetes, Docker) when stopping a container. Graceful shutdown lets in-flight requests complete.`,
    codeExamples: [
      {
        title: 'process object — runtime information',
        code: `// Runtime information
console.log('Node version:', process.version);
console.log('Platform:', process.platform);
console.log('Architecture:', process.arch);
console.log('PID:', process.pid);
console.log('Working dir:', process.cwd());

// Memory usage
const mem = process.memoryUsage();
console.log('Heap used:', Math.round(mem.heapUsed / 1024 / 1024), 'MB');
console.log('Heap total:', Math.round(mem.heapTotal / 1024 / 1024), 'MB');
console.log('RSS:', Math.round(mem.rss / 1024 / 1024), 'MB');

// High-resolution timer
const start = process.hrtime.bigint();
// ... some work ...
const end = process.hrtime.bigint();
console.log('Time:', (end - start) / 1_000_000n, 'ms');`,
        explanation: 'process.memoryUsage() tells you heap usage (JS objects), RSS (total process memory). hrtime.bigint() gives nanosecond precision timing.',
      },
      {
        title: 'Environment variables with dotenv',
        code: `// .env file (never commit this to git)
// DATABASE_URL=postgresql://user:password@localhost:5432/mydb
// JWT_SECRET=super-secret-key-here
// PORT=3000
// NODE_ENV=development

// Load .env in development
require('dotenv').config();

// Access variables
const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
};

// Validate required variables on startup
function validateEnv() {
  const required = ['DATABASE_URL', 'JWT_SECRET'];
  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(\`Missing required environment variable: \${key}\`);
    }
  }
}

validateEnv(); // Fail fast — crash on startup if misconfigured`,
        explanation: 'Validate required env vars on startup. Crashing at start is better than crashing mid-request because a secret was missing.',
      },
      {
        title: 'Buffer — working with binary data',
        code: `// Create a Buffer
const buf1 = Buffer.from('Hello, Node.js'); // from string
const buf2 = Buffer.from([72, 101, 108, 108, 111]); // from bytes
const buf3 = Buffer.alloc(10); // 10 zero bytes

// Convert
console.log(buf1.toString());        // 'Hello, Node.js'
console.log(buf1.toString('hex'));   // '48656c6c6f2c204e6f64652e6a73'
console.log(buf1.toString('base64'));// 'SGVsbG8sIE5vZGUuanM='

// Buffer length is bytes, not characters
const emoji = Buffer.from('😀');
console.log(emoji.length); // 4 — emoji is 4 bytes in UTF-8

// Concatenate buffers
const combined = Buffer.concat([buf1, buf2]);

// Practical: base64 encode for APIs
function toBase64(str) {
  return Buffer.from(str).toString('base64');
}
function fromBase64(str) {
  return Buffer.from(str, 'base64').toString('utf8');
}`,
        explanation: 'Buffer is used when working with binary data — file I/O, images, encryption, network protocols. It exists outside V8 heap to handle raw bytes efficiently.',
      },
      {
        title: 'Command-line argument parsing',
        code: `// node cli.js --name Alice --age 30 --verbose
const args = process.argv.slice(2);

function parseArgs(args) {
  const result = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].slice(2);
      const value = args[i + 1] && !args[i + 1].startsWith('--')
        ? args[++i]
        : true; // flag without value → boolean
      result[key] = value;
    }
  }
  return result;
}

const options = parseArgs(args);
// { name: 'Alice', age: '30', verbose: true }

console.log(\`Hello, \${options.name}! Age: \${options.age}\`);
if (options.verbose) console.log('Verbose mode on');`,
        explanation: 'For serious CLIs, use libraries like commander or yargs. But understanding raw process.argv is important for scripts and tooling.',
      },
    ],
    commonMistakes: [
      'Using __dirname in ES Modules — it does not exist. Use import.meta.url and fileURLToPath instead.',
      'Hardcoding secrets in code instead of using environment variables.',
      'Not validating required env vars on startup — leads to confusing runtime failures deep in request handling.',
      'Confusing Buffer.length (bytes) with string.length (characters) — emoji and non-ASCII chars differ.',
      'Calling process.exit() without closing database connections — causes connection leaks in the DB.',
    ],
    interviewQuestions: [
      {
        question: 'What is the process object in Node.js?',
        answer: 'process is a global object that provides information about and control over the current Node.js process. Key properties: process.env (environment variables), process.argv (command-line args), process.pid (process ID), process.version (Node.js version), process.platform (OS). Key methods: process.exit() (terminate), process.cwd() (working directory), process.memoryUsage() (memory stats).',
        difficulty: 'beginner',
      },
      {
        question: 'What is a Buffer in Node.js and why does it exist?',
        answer: 'Buffer is a class for working with raw binary data (bytes) outside the V8 JavaScript heap. It exists because JavaScript strings are UTF-16 encoded and not efficient for binary data. Buffers are used for: reading binary files, network protocol implementation, cryptography, and streaming binary data. Buffer.from(str) creates a Buffer from a string, buf.toString() converts back. Buffer.length returns byte length, not character count.',
        difficulty: 'intermediate',
      },
      {
        question: 'How do you manage configuration and secrets in Node.js?',
        answer: 'Use environment variables. In development, load a .env file with the dotenv package (never commit .env to git). In production, set env vars in the deployment environment (Kubernetes secrets, AWS Parameter Store, etc.). Access via process.env.KEY. Validate all required variables on startup and throw an error if any are missing — fail fast rather than failing mid-request.',
        difficulty: 'beginner',
      },
    ],
    exercises: [
      {
        id: 'ex-node-3',
        title: 'Build a CLI tool',
        description: 'Build a CLI tool that accepts --name and --shout flags and prints a greeting.',
        starterCode: `// node greet.js --name Alice
// → Hello, Alice!

// node greet.js --name Bob --shout
// → HELLO, BOB!

const args = process.argv.slice(2);
// Parse args and print the correct greeting`,
        solution: `const args = process.argv.slice(2);
const nameIdx = args.indexOf('--name');
const name = nameIdx !== -1 ? args[nameIdx + 1] : 'World';
const shout = args.includes('--shout');
const greeting = \`Hello, \${name}!\`;
console.log(shout ? greeting.toUpperCase() : greeting);`,
        hints: ['Use Array.indexOf to find --name flag', 'The value after --name is the name', 'Array.includes checks for --shout'],
      },
    ],
    keyTakeaways: [
      'process is the most important global — gives runtime info, env vars, args, exit control',
      'Environment variables are the standard for configuration and secrets — never hardcode them',
      'Buffer handles binary data outside V8 heap — used for files, crypto, network protocols',
      'process.argv.slice(2) gives your command-line arguments',
      'Validate required env vars on startup — crash fast rather than failing mid-request',
    ],
    prevLesson: 'nodejs-event-loop',
    nextLesson: 'nodejs-modules',
  },

  // ─── MODULE 4: Modules ────────────────────────────────────────────────────────
  {
    id: 'nodejs-modules',
    slug: 'nodejs-modules',
    title: 'Modules — CommonJS vs ES Modules',
    description: 'Understand CommonJS (require/exports) and ES Modules (import/export), how module resolution works, and when to use each.',
    category: 'Modules',
    order: 4,
    difficulty: 'beginner',
    estimatedTime: 25,
    content: `Node.js has two module systems. Understanding both is essential because you will encounter them constantly in the wild.\n\n## CommonJS (CJS) — The Original\n\nCommonJS was Node.js's original module system (2009). Every \`.js\` file in a Node.js project is a CommonJS module by default.\n\n**Key characteristics:**\n- Synchronous loading (fine for server, not for browsers)\n- \`require()\` function to load modules\n- \`module.exports\` or \`exports\` to export\n- Loaded modules are cached after first \`require()\`\n\n## ES Modules (ESM) — The Modern Standard\n\nES Modules are the JavaScript standard (ES2015). They are what browsers, Deno, and modern Node.js (12+) use.\n\n**Key characteristics:**\n- \`import\` / \`export\` keywords (part of the language spec)\n- Asynchronous loading (works in browsers without bundlers)\n- Static analysis (imports must be at the top level — enables tree-shaking)\n- \`import.meta.url\` instead of \`__filename\`\n\n## How to Use Each in Node.js\n\n**CommonJS** — default, file ends in \`.js\` or \`.cjs\`:\n\`\`\`js\n// math.js\nfunction add(a, b) { return a + b; }\nmodule.exports = { add };\n\n// main.js\nconst { add } = require('./math');\n\`\`\`\n\n**ES Modules** — two ways to enable:\n1. Name file \`.mjs\`\n2. Or add \`"type": "module"\` in package.json\n\n\`\`\`js\n// math.mjs\nexport function add(a, b) { return a + b; }\n\n// main.mjs\nimport { add } from './math.mjs';\n\`\`\`\n\n## Module Resolution — How require() Finds Files\n\nWhen you write \`require('./utils')\`, Node.js looks for:\n1. \`./utils.js\`\n2. \`./utils.json\`\n3. \`./utils.node\` (native addon)\n4. \`./utils/index.js\`\n\nWhen you write \`require('express')\` (no ./ prefix):\n1. Check core modules (fs, path, http…)\n2. Look in \`node_modules/express\`\n3. Walk up directories until root\n\n## The Module Cache\n\nNode.js caches modules after the first \`require()\`. Subsequent calls return the cached export.\n\nThis means:\n- Modules are singletons — same object everywhere\n- State in a module is shared across all importers\n- Good for database connections (create once, reuse)\n- Can cause bugs if you expect fresh state each require()\n\n## CJS vs ESM Comparison\n\n| Feature | CommonJS | ES Modules |\n|---------|----------|------------|\n| Syntax | require/module.exports | import/export |\n| Loading | Synchronous | Asynchronous |\n| Top-level await | No | Yes |\n| __dirname | Yes | No (use import.meta) |\n| Dynamic import | require() anywhere | import() (async) |\n| Tree shaking | No | Yes |\n| Default in Node.js | Yes | No (need "type":"module") |\n| Browser compatible | No | Yes |\n\n## Named vs Default Exports\n\n\`\`\`js\n// Named exports — can export many things\nexport function add(a, b) { return a + b; }\nexport function subtract(a, b) { return a - b; }\nexport const PI = 3.14159;\n\n// Default export — one per file\nexport default class Calculator { ... }\n\n// Importing\nimport { add, subtract } from './math.js';  // named\nimport Calculator from './calculator.js';    // default\nimport { add as plus } from './math.js';     // renamed\nimport * as math from './math.js';           // namespace\n\`\`\`\n\n## Which to Use?\n\nFor **new projects**: Use ESM (\`"type": "module"\` in package.json). It is the future.\n\nFor **existing Node.js projects**: Stick with CommonJS unless you have a reason to migrate.\n\nFor **libraries you publish**: Support both with dual package exports.\n\n**Practical reality**: Most production Node.js code today is still CommonJS. TypeScript projects often compile to CJS. Frameworks like Express are CJS. You will use both.`,
    codeExamples: [
      {
        title: 'CommonJS — require and module.exports patterns',
        code: `// utils/math.js — CommonJS
function add(a, b) { return a + b; }
function subtract(a, b) { return a - b; }
const PI = 3.14159;

// Export multiple things
module.exports = { add, subtract, PI };

// Alternative: exports shorthand
// exports.add = add;  // Same result
// exports.PI = PI;

// ─────────────────────────────────
// main.js
const { add, subtract, PI } = require('./utils/math');
const math = require('./utils/math'); // same cached object

console.log(add(2, 3));    // 5
console.log(math.PI);      // 3.14159

// Dynamic require — can use variables
const moduleName = 'fs';
const fs = require(moduleName); // works — CJS is synchronous`,
        explanation: 'CommonJS is synchronous and dynamic. You can call require() anywhere, inside conditions, loops, functions. This is impossible with static ESM imports.',
      },
      {
        title: 'ES Modules — import/export patterns',
        code: `// utils/math.mjs — ES Module
export function add(a, b) { return a + b; }
export function subtract(a, b) { return a - b; }
export const PI = 3.14159;

export default function multiply(a, b) { return a * b; }

// ─────────────────────────────────
// main.mjs
import multiply, { add, subtract, PI } from './utils/math.mjs';
import * as math from './utils/math.mjs'; // import everything

console.log(add(2, 3));       // 5
console.log(math.PI);         // 3.14159
console.log(multiply(3, 4));  // 12

// Dynamic import — lazy load a module
async function loadHeavyModule() {
  const { heavyFunction } = await import('./heavy.mjs');
  heavyFunction();
}

// Top-level await — only in ESM
const data = await fetch('https://api.example.com/data').then(r => r.json());
console.log(data);`,
        explanation: 'ESM imports must be at the top level (static). For dynamic loading, use import() which returns a Promise. Top-level await works without wrapping in async functions.',
      },
      {
        title: '__dirname equivalent in ES Modules',
        code: `// CommonJS — __dirname works
const path = require('path');
console.log(__dirname);           // /home/user/project/src
console.log(__filename);          // /home/user/project/src/index.js

// ES Modules — __dirname does NOT exist
// Use import.meta.url instead

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log(__dirname);  // Same result as CommonJS version

// Practical: loading a file relative to current module
import { readFileSync } from 'fs';
import { join } from 'path';

const data = readFileSync(join(__dirname, 'data.json'), 'utf8');`,
        explanation: 'This is the most common ESM gotcha — __dirname and __filename are undefined. Use fileURLToPath(import.meta.url) to reconstruct them.',
      },
      {
        title: 'Module caching — singleton pattern',
        code: `// db.js — module is a singleton
const connections = [];

function getConnection() {
  // First require() creates connection
  // Subsequent require() return this same module object
  if (connections.length === 0) {
    connections.push({ id: Date.now(), status: 'connected' });
    console.log('New connection created');
  }
  return connections[0];
}

module.exports = { getConnection };

// ─────────────────────────────────
// a.js
const { getConnection } = require('./db');
getConnection(); // "New connection created"

// b.js
const { getConnection } = require('./db');
getConnection(); // No message — returns cached module, same connection

// This is how database connection pools work in Node.js`,
        explanation: 'Module caching makes CommonJS modules behave as singletons. Database connection modules exploit this: create once, reuse everywhere.',
      },
    ],
    commonMistakes: [
      'Mixing CJS require() and ESM import in the same file — you cannot do this.',
      'Forgetting file extensions in ESM imports — required: import from "./utils.js" not "./utils"',
      'Using __dirname in ESM — it does not exist. Use fileURLToPath(import.meta.url).',
      'Expecting require() to return a fresh module each time — it returns the cached version.',
      'Using module.exports and exports simultaneously and overwriting one.',
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between CommonJS and ES Modules?',
        answer: 'CommonJS uses require()/module.exports and loads synchronously. ES Modules use import/export and are loaded asynchronously. Key differences: ESM imports are static (must be at top level, enables tree-shaking); CJS require() is dynamic (can be called anywhere). ESM supports top-level await; CJS does not. ESM is the JavaScript standard; CJS is Node.js-specific. In Node.js, .js files are CJS by default unless "type":"module" is in package.json.',
        difficulty: 'intermediate',
        tip: 'Mention tree-shaking — it shows you understand why ESM matters for bundlers.',
      },
      {
        question: 'How does module caching work in Node.js?',
        answer: 'After the first require() call, Node.js caches the module in require.cache. Subsequent calls to require() for the same file return the cached exports object without re-executing the module file. This makes modules behave as singletons. It is useful for database connections (create once) but can cause bugs in tests where you expect a fresh module. You can clear the cache: delete require.cache[require.resolve("./module")].',
        difficulty: 'intermediate',
      },
      {
        question: 'What is module resolution in Node.js?',
        answer: 'When require("X") is called: if X is a core module (fs, path, http), return it. If X starts with ./ or ../, it is a relative file — try X, X.js, X.json, X.node, X/index.js. If X is a bare name (express), search node_modules in current dir, then parent dirs walking up to the root. Node.js finds the package.json main field or index.js inside the package.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'ex-node-4',
        title: 'Create a CommonJS module',
        description: 'Create a math utilities module and import it in another file.',
        starterCode: `// math.js
// Export: add, subtract, multiply, divide, isPrime

// index.js
const math = require('./math');
console.log(math.add(10, 5));       // 15
console.log(math.isPrime(17));      // true
console.log(math.isPrime(18));      // false`,
        solution: `// math.js
function add(a, b) { return a + b; }
function subtract(a, b) { return a - b; }
function multiply(a, b) { return a * b; }
function divide(a, b) {
  if (b === 0) throw new Error('Division by zero');
  return a / b;
}
function isPrime(n) {
  if (n < 2) return false;
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return false;
  }
  return true;
}
module.exports = { add, subtract, multiply, divide, isPrime };`,
        hints: ['Use module.exports = {} to export multiple functions', 'isPrime checks if divisible by any number up to sqrt(n)'],
      },
    ],
    keyTakeaways: [
      'CommonJS: require()/module.exports — synchronous, default in Node.js, dynamic',
      'ES Modules: import/export — async, static analysis, tree-shakeable, browser compatible',
      'Enable ESM with "type":"module" in package.json or .mjs extension',
      'Module caching makes modules singletons — great for DB connections, can surprise in tests',
      '__dirname does not exist in ESM — use fileURLToPath(import.meta.url)',
    ],
    prevLesson: 'nodejs-runtime-globals',
    nextLesson: 'npm-ecosystem',
  },

  // ─── MODULE 5: NPM Ecosystem ─────────────────────────────────────────────────
  {
    id: 'npm-ecosystem',
    slug: 'npm-ecosystem',
    title: 'NPM Ecosystem',
    description: 'Master npm, package.json, semantic versioning, scripts, security, and the difference between dependencies and devDependencies.',
    category: 'Tooling',
    order: 5,
    difficulty: 'beginner',
    estimatedTime: 20,
    content: `npm (Node Package Manager) is the world's largest software registry — over 2 million packages. Understanding it deeply is essential for Node.js development.\n\n## package.json — The Project Manifest\n\nEvery Node.js project starts with package.json. Create it with:\n\`\`\`bash\nnpm init -y  # create with defaults\n\`\`\`\n\nKey fields:\n\`\`\`json\n{\n  "name": "my-api",\n  "version": "1.0.0",\n  "description": "REST API for my app",\n  "main": "src/index.js",\n  "type": "module",\n  "scripts": {\n    "start": "node src/index.js",\n    "dev": "nodemon src/index.js",\n    "build": "tsc",\n    "test": "jest"\n  },\n  "dependencies": {\n    "express": "^4.18.2"\n  },\n  "devDependencies": {\n    "nodemon": "^3.0.0",\n    "typescript": "^5.3.0"\n  },\n  "engines": {\n    "node": ">=18.0.0"\n  }\n}\n\`\`\`\n\n## Dependencies vs devDependencies\n\n**dependencies** — packages your app needs to RUN in production:\n- express, prisma, zod, jsonwebtoken, bcrypt\n\n**devDependencies** — packages only needed during development:\n- nodemon, typescript, jest, eslint, prettier\n\n\`\`\`bash\nnpm install express          # → dependencies\nnpm install --save-dev jest  # → devDependencies\n\`\`\`\n\nIn production: \`npm install --omit=dev\` — installs only dependencies, not devDependencies. Keeps production images small.\n\n## Semantic Versioning (SemVer)\n\nVersion format: **MAJOR.MINOR.PATCH** — e.g., \`4.18.2\`\n\n- **PATCH** (4.18.**2** → 4.18.**3**): bug fixes, backward compatible\n- **MINOR** (4.**18**.2 → 4.**19**.0): new features, backward compatible\n- **MAJOR** (**4**.18.2 → **5**.0.0): breaking changes\n\n**Version ranges in package.json:**\n\`\`\`\n\"express\": \"4.18.2\"   — exact version only\n\"express\": \"^4.18.2\"  — caret: any 4.x.x ≥ 4.18.2 (most common)\n\"express\": \"~4.18.2\"  — tilde: any 4.18.x ≥ 4.18.2\n\"express\": \"*\"        — any version (dangerous!)\n\"express\": \">=4.18.0\" — any version ≥ 4.18.0\n\`\`\`\n\n## package-lock.json — Reproducible Installs\n\npackage-lock.json records the **exact** version of every package installed (including transitive dependencies). It ensures every developer and CI server installs identical versions.\n\n**Always commit package-lock.json.** Never edit it manually.\n\n\`\`\`bash\nnpm install    # installs using package-lock.json if it exists\nnpm ci         # strict install from lock file — faster, for CI/production\n\`\`\`\n\nUse \`npm ci\` in Docker builds and CI pipelines — it is faster and fails if lock file is out of sync.\n\n## npm Scripts\n\nnpm scripts are shell commands stored in package.json. Run with \`npm run <name>\`.\n\n\`\`\`json\n{\n  "scripts": {\n    "start": "node dist/index.js",\n    "dev": "tsx watch src/index.ts",\n    "build": "tsc --outDir dist",\n    "test": "jest --coverage",\n    "lint": "eslint src/",\n    "format": "prettier --write src/",\n    "db:migrate": "prisma migrate dev",\n    "db:seed": "tsx src/seed.ts",\n    "prestart": "npm run build"  // runs before 'start' automatically\n  }\n}\n\`\`\`\n\nScript hooks: \`pre<script>\` and \`post<script>\` run automatically before/after a script.\n\n## Security Considerations\n\n\`\`\`bash\nnpm audit              # check for known vulnerabilities\nnpm audit fix          # auto-fix safe updates\nnpm audit fix --force  # force-fix (may break things)\n\`\`\`\n\n**Key security practices:**\n- Run \`npm audit\` in CI pipelines\n- Use \`npm ci\` in production/Docker (reproducible installs)\n- Keep dependencies updated (\`npm outdated\` to see what is stale)\n- Do not install packages blindly — check download count, last publish date, known maintainers\n- Use \`.npmignore\` or \`files\` field in package.json to control what is published\n\n## Useful npm Commands\n\n\`\`\`bash\nnpm install              # install all dependencies\nnpm install express      # install a package\nnpm uninstall lodash     # remove a package\nnpm update               # update packages within SemVer range\nnpm outdated             # list outdated packages\nnpm list                 # tree of installed packages\nnpm ls --depth=0         # top-level packages only\nnpm run <script>         # run a package.json script\nnpx <package>            # run a package without installing globally\n\`\`\``,
    codeExamples: [
      {
        title: 'Professional package.json for a Node.js API',
        code: `{
  "name": "my-rest-api",
  "version": "1.0.0",
  "description": "Production REST API with Express and TypeScript",
  "main": "dist/index.js",
  "type": "commonjs",
  "engines": {
    "node": ">=20.0.0",
    "npm": ">=10.0.0"
  },
  "scripts": {
    "start": "node dist/index.js",
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src/ --ext .ts",
    "format": "prettier --write 'src/**/*.ts'",
    "typecheck": "tsc --noEmit",
    "db:migrate": "prisma migrate dev",
    "db:generate": "prisma generate",
    "prestart": "npm run build"
  },
  "dependencies": {
    "express": "^4.18.2",
    "prisma": "^5.7.0",
    "@prisma/client": "^5.7.0",
    "zod": "^3.22.4",
    "jsonwebtoken": "^9.0.2",
    "bcrypt": "^5.1.1",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5",
    "helmet": "^7.1.0"
  },
  "devDependencies": {
    "typescript": "^5.3.3",
    "@types/node": "^20.10.0",
    "@types/express": "^4.17.21",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/bcrypt": "^5.0.2",
    "tsx": "^4.6.2",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.11",
    "supertest": "^6.3.3",
    "eslint": "^8.56.0",
    "prettier": "^3.1.1",
    "nodemon": "^3.0.2"
  }
}`,
        explanation: 'A professional package.json separates runtime deps from dev deps. The engines field enforces Node.js version. prestart builds TypeScript before starting.',
      },
      {
        title: 'Understanding version ranges',
        code: `// package.json version ranges explained

{
  "dependencies": {
    // Exact — install only 4.18.2, nothing else
    "exact-pkg": "4.18.2",

    // Caret ^ — compatible changes (most common)
    // Allows: 4.18.2, 4.19.0, 4.20.0
    // Blocks: 5.0.0 (major bump = breaking change)
    "express": "^4.18.2",

    // Tilde ~ — patch releases only
    // Allows: 4.18.2, 4.18.3, 4.18.9
    // Blocks: 4.19.0 (minor bump)
    "strict-pkg": "~4.18.2",

    // Range
    "range-pkg": ">=4.0.0 <5.0.0",

    // Latest — NEVER use in production
    "dangerous": "*"
  }
}

// Check what would actually install:
// npm install --dry-run
// npx npm-check-updates  // shows available upgrades`,
        explanation: 'Caret (^) is the npm default. It allows minor and patch updates but blocks major versions (which may be breaking). Use exact versions for critical security packages.',
      },
    ],
    commonMistakes: [
      'Installing packages globally (npm install -g) for project dependencies — use local installs.',
      'Committing node_modules — it should always be in .gitignore.',
      'Not committing package-lock.json — causes version drift across team members.',
      'Using npm install in CI/Docker — use npm ci for reproducible, faster installs.',
      'Putting dev tools (nodemon, jest, typescript) in dependencies instead of devDependencies.',
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between npm install and npm ci?',
        answer: 'npm install: reads package.json version ranges and installs compatible versions, updates package-lock.json if needed. npm ci: reads package-lock.json exactly and installs those exact versions. If lock file is missing or out of sync, it fails. npm ci is faster (skips package resolution), deterministic, and designed for CI/CD and Docker builds.',
        difficulty: 'beginner',
      },
      {
        question: 'What is semantic versioning and what do the ^ and ~ symbols mean?',
        answer: 'Semantic versioning uses MAJOR.MINOR.PATCH. PATCH = bug fixes (backward compatible), MINOR = new features (backward compatible), MAJOR = breaking changes. In package.json: ^ (caret) allows updates to the same major version (^4.1.0 → any 4.x.x ≥ 4.1.0). ~ (tilde) allows only patch updates (~4.1.0 → any 4.1.x). ^ is the npm default when you run npm install.',
        difficulty: 'beginner',
      },
      {
        question: 'What is the difference between dependencies and devDependencies?',
        answer: 'dependencies are packages needed at runtime in production (express, prisma, bcrypt). devDependencies are only needed during development (typescript, jest, nodemon, eslint). In production Docker builds, use npm ci --omit=dev to skip devDependencies, keeping images smaller. The distinction also matters for published npm packages — users of your library install your dependencies but not devDependencies.',
        difficulty: 'beginner',
      },
    ],
    exercises: [
      {
        id: 'ex-node-5',
        title: 'Set up a Node.js project from scratch',
        description: 'Initialize a project, install express and dotenv as dependencies, install nodemon as devDependency, and add start and dev scripts.',
        starterCode: `# Commands to run in terminal:
# 1. Initialize project
# 2. Install express and dotenv
# 3. Install nodemon as devDependency
# 4. Add scripts: start (node index.js) and dev (nodemon index.js)`,
        solution: `npm init -y
npm install express dotenv
npm install --save-dev nodemon

# Then edit package.json scripts:
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  }
}`,
        hints: ['npm install without flags adds to dependencies', '--save-dev adds to devDependencies', 'Scripts go in the scripts field of package.json'],
      },
    ],
    keyTakeaways: [
      'package.json is the project manifest — name, version, scripts, dependencies',
      'dependencies = runtime. devDependencies = development only',
      'SemVer: MAJOR.MINOR.PATCH. ^ allows same-major updates, ~ allows only patch updates',
      'Always commit package-lock.json. Use npm ci in CI/Docker for reproducible installs',
      'npm audit finds security vulnerabilities — run it in your CI pipeline',
    ],
    prevLesson: 'nodejs-modules',
    nextLesson: 'nodejs-filesystem',
  },

  // ─── MODULE 6: File System ────────────────────────────────────────────────────
  {
    id: 'nodejs-filesystem',
    slug: 'nodejs-filesystem',
    title: 'File System — fs Module',
    description: 'Read, write, update, and stream files with the fs module. Learn sync vs async patterns, streams for large files, and real-world use cases.',
    category: 'Core Modules',
    order: 6,
    difficulty: 'beginner',
    estimatedTime: 25,
    content: `The \`fs\` (file system) module is one of the most used built-in modules. It lets Node.js interact with the file system — reading configs, writing logs, processing uploads, generating reports.\n\n## The Three APIs\n\nNode.js's fs module has three APIs for every operation:\n\n1. **Callback API** — async, oldest, uses callbacks\n2. **Promise API** (fs/promises) — async, modern, works with async/await\n3. **Sync API** — blocking, convenient for scripts, never use in servers\n\n\`\`\`js\nconst fs = require('fs');               // callback\nconst fsPromises = require('fs/promises'); // promise (recommended)\n// or:\nconst { readFile } = require('fs').promises;\n\`\`\`\n\n**Rule:** Use \`fs/promises\` (async/await) for all server-side code. Use sync methods only in initialization scripts that run once before the server starts.\n\n## Reading Files\n\n\`\`\`js\n// Read entire file into memory\nconst data = await fs.readFile('config.json', 'utf8');\nconst config = JSON.parse(data);\n\n// Read as Buffer (binary data)\nconst buffer = await fs.readFile('image.png');\n\`\`\`\n\n## Writing Files\n\n\`\`\`js\n// Write (creates or overwrites)\nawait fs.writeFile('output.txt', 'Hello World', 'utf8');\n\n// Append to existing file\nawait fs.appendFile('logs.txt', 'New log entry\\n');\n\n// Write JSON\nawait fs.writeFile('data.json', JSON.stringify(data, null, 2));\n\`\`\`\n\n## Directory Operations\n\n\`\`\`js\n// Create directory\nawait fs.mkdir('uploads', { recursive: true }); // recursive: no error if exists\n\n// Read directory\nconst files = await fs.readdir('./src');\n\n// Check if file exists\ntry {\n  await fs.access('config.json');\n  console.log('File exists');\n} catch {\n  console.log('File does not exist');\n}\n\n// Get file stats\nconst stats = await fs.stat('file.txt');\nconsole.log(stats.size);     // bytes\nconsole.log(stats.isFile()); // true\nconsole.log(stats.mtime);    // last modified Date\n\n// Delete\nawait fs.unlink('file.txt');       // delete file\nawait fs.rmdir('dir');             // delete empty directory\nawait fs.rm('dir', { recursive: true }); // delete directory recursively\n\n// Rename/Move\nawait fs.rename('old.txt', 'new.txt');\n\`\`\`\n\n## Streams for Large Files\n\nFor files that are too large to fit in memory (CSV exports, log files, video), use streams:\n\n\`\`\`js\nconst readable = fs.createReadStream('large-file.csv');\nconst writable = fs.createWriteStream('output.csv');\n\n// Pipe: read from source, write to destination\nreadable.pipe(writable);\n\`\`\`\n\nStreams process data in chunks — constant memory usage regardless of file size. A 10GB file uses only a small buffer, not 10GB of RAM.\n\n## Watching Files\n\n\`\`\`js\n// Watch for changes (used by nodemon, webpack, vite)\nfs.watch('src/', { recursive: true }, (event, filename) => {\n  console.log(\`\${filename} \${event}d\`);\n});\n\`\`\`\n\n## Real World Use Cases\n\n- **Reading config files** — load database URLs, feature flags on startup\n- **Writing logs** — save application logs to rotating files\n- **Processing uploads** — save uploaded files to disk or process them\n- **Generating reports** — write CSV, JSON, or PDF reports\n- **Reading templates** — load email or HTML templates from files\n- **Watching source files** — development servers (nodemon, HMR)`,
    codeExamples: [
      {
        title: 'fs/promises — the modern pattern',
        code: `const fs = require('fs/promises');
const path = require('path');

async function processConfig() {
  // Read JSON config file
  try {
    const raw = await fs.readFile('config.json', 'utf8');
    const config = JSON.parse(raw);
    return config;
  } catch (err) {
    if (err.code === 'ENOENT') {
      // File does not exist — create default
      const defaultConfig = { port: 3000, debug: false };
      await fs.writeFile(
        'config.json',
        JSON.stringify(defaultConfig, null, 2)
      );
      return defaultConfig;
    }
    throw err;
  }
}

// Save logs with timestamp
async function appendLog(message) {
  const timestamp = new Date().toISOString();
  const line = \`[\${timestamp}] \${message}\\n\`;
  await fs.appendFile('app.log', line);
}

// Create directory structure
async function ensureDirectories() {
  await fs.mkdir('uploads/images', { recursive: true });
  await fs.mkdir('uploads/documents', { recursive: true });
  await fs.mkdir('logs', { recursive: true });
}`,
        explanation: 'Always use try/catch with fs operations. err.code tells you what went wrong: ENOENT (file not found), EACCES (permission denied), EEXIST (already exists).',
      },
      {
        title: 'Streaming a large file — memory efficient',
        code: `const fs = require('fs');
const readline = require('readline');

// Process a large CSV line by line — uses constant memory
async function processLargeCSV(filePath) {
  const fileStream = fs.createReadStream(filePath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let lineCount = 0;
  const results = [];

  for await (const line of rl) {
    lineCount++;
    if (lineCount === 1) continue; // skip header row

    const [name, email, age] = line.split(',');
    results.push({ name, email, age: parseInt(age) });

    // Process in batches to avoid memory buildup
    if (results.length >= 1000) {
      await saveBatch(results.splice(0));
    }
  }

  if (results.length > 0) await saveBatch(results);
  console.log(\`Processed \${lineCount} lines\`);
}

async function saveBatch(rows) {
  // Save to database
  console.log(\`Saving batch of \${rows.length} rows\`);
}`,
        explanation: 'readline.createInterface with a stream reads line by line without loading the entire file. A 1GB CSV file uses only ~64KB of buffer.',
      },
      {
        title: 'Copying files and working with directories',
        code: `const fs = require('fs/promises');
const path = require('path');

// List all files recursively
async function listFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await listFiles(fullPath));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

// Copy a file
async function copyFile(src, dest) {
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.copyFile(src, dest);
}

// Get file info
async function getFileInfo(filePath) {
  const stats = await fs.stat(filePath);
  return {
    name: path.basename(filePath),
    size: \`\${(stats.size / 1024).toFixed(2)} KB\`,
    created: stats.birthtime,
    modified: stats.mtime,
    isFile: stats.isFile(),
  };
}`,
        explanation: 'withFileTypes: true in readdir returns Dirent objects with isDirectory() and isFile() methods — avoids a separate stat() call for each entry.',
      },
    ],
    commonMistakes: [
      'Using readFileSync / writeFileSync in Express route handlers — blocks all concurrent users.',
      'Not handling ENOENT — assuming file always exists leads to unhandled rejections.',
      'Loading entire large files into memory with readFile — use streams for files over a few MB.',
      'Not using { recursive: true } with mkdir — throws if parent directories do not exist.',
      'Watching files without limiting sensitivity — fs.watch can fire multiple times per change.',
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between fs.readFile and fs.createReadStream?',
        answer: 'fs.readFile loads the entire file into memory at once — suitable for small files (config, templates). fs.createReadStream reads the file in chunks (default 64KB) and emits data events — suitable for large files (logs, uploads, CSVs). For a 1GB file, readFile needs 1GB of RAM; createReadStream needs only 64KB regardless of file size.',
        difficulty: 'intermediate',
      },
      {
        question: 'When should you use synchronous fs methods?',
        answer: 'Only during startup/initialization before the server starts listening, and in CLI scripts that are not serving concurrent requests. Never in route handlers or any code that serves multiple users. Sync methods block the event loop — while they run, no other requests can be handled.',
        difficulty: 'beginner',
      },
    ],
    exercises: [
      {
        id: 'ex-node-6',
        title: 'Read and transform a JSON file',
        description: 'Read a users.json file, add a "createdAt" field to each user, and write the result to users-updated.json.',
        starterCode: `// users.json: [{"id": 1, "name": "Alice"}, {"id": 2, "name": "Bob"}]
const fs = require('fs/promises');

async function addTimestamps() {
  // Read users.json
  // Add createdAt: new Date().toISOString() to each user
  // Write to users-updated.json
}

addTimestamps();`,
        solution: `const fs = require('fs/promises');

async function addTimestamps() {
  const raw = await fs.readFile('users.json', 'utf8');
  const users = JSON.parse(raw);
  const updated = users.map(u => ({ ...u, createdAt: new Date().toISOString() }));
  await fs.writeFile('users-updated.json', JSON.stringify(updated, null, 2));
  console.log('Done! Written', updated.length, 'users');
}

addTimestamps().catch(console.error);`,
        hints: ['Use fs/promises for async operations', 'JSON.parse to read, JSON.stringify to write', 'Array.map to transform each user'],
      },
    ],
    keyTakeaways: [
      'Use fs/promises (async/await) for all server-side file operations',
      'Sync methods (readFileSync) only in startup scripts — never in request handlers',
      'For large files, use createReadStream + pipe or readline — constant memory usage',
      'Handle error codes: ENOENT (not found), EACCES (permission), EEXIST (already exists)',
      'fs.mkdir with { recursive: true } is idempotent — safe to call if directory already exists',
    ],
    prevLesson: 'npm-ecosystem',
    nextLesson: 'nodejs-path',
  },

  // ─── MODULE 7: Path Module ────────────────────────────────────────────────────
  {
    id: 'nodejs-path',
    slug: 'nodejs-path',
    title: 'Path Module — Cross-Platform File Paths',
    description: 'Master the path module for building, resolving, and joining file paths that work correctly on Windows, macOS, and Linux.',
    category: 'Core Modules',
    order: 7,
    difficulty: 'beginner',
    estimatedTime: 15,
    content: `The \`path\` module provides utilities for working with file and directory paths. It is critical for cross-platform compatibility because Windows uses backslashes (\\\\\) while macOS/Linux use forward slashes (/).\n\n## Why the path Module Exists\n\nIf you hardcode paths with string concatenation:\n\`\`\`js\nconst filePath = dir + '/' + filename; // ❌ breaks on Windows\n\`\`\`\n\nOn Windows, this produces \`C:/Users/project/uploads/file.txt\` but the OS expects \`C:\\\\Users\\\\project\\\\uploads\\\\file.txt\`.\n\nThe path module handles this automatically.\n\n## Essential path Methods\n\n\`\`\`js\nconst path = require('path');\n\n// Join path segments (handles separators correctly)\npath.join('/users', 'alice', 'documents', 'file.txt')\n// → '/users/alice/documents/file.txt'\n\n// Resolve to absolute path (from process.cwd() or given base)\npath.resolve('src', 'index.js')\n// → '/home/user/project/src/index.js'\n\n// Get directory name of a path\npath.dirname('/users/alice/file.txt')  // → '/users/alice'\n\n// Get file name\npath.basename('/users/alice/file.txt')         // → 'file.txt'\npath.basename('/users/alice/file.txt', '.txt') // → 'file' (no extension)\n\n// Get extension\npath.extname('photo.jpg')  // → '.jpg'\npath.extname('archive.tar.gz')  // → '.gz' (last extension only)\n\n// Parse a path into components\npath.parse('/home/user/project/index.js')\n// → { root: '/', dir: '/home/user/project', base: 'index.js',\n//     ext: '.js', name: 'index' }\n\n// Normalize (resolve .., ., double slashes)\npath.normalize('/users//alice/../bob/file.txt')\n// → '/users/bob/file.txt'\n\n// Check if path is absolute\npath.isAbsolute('/users/alice')  // → true\npath.isAbsolute('src/index.js') // → false\n\n// OS separator\npath.sep    // '/' on Unix, '\\\\' on Windows\npath.delimiter // ':' on Unix, ';' on Windows (for PATH env var)\n\`\`\`\n\n## path.join vs path.resolve\n\n- **path.join** — joins segments with the correct separator. Relative result if input is relative.\n- **path.resolve** — builds an absolute path. If a segment starts with /, it resets (like \`cd\`)\n\n\`\`\`js\npath.join('a', 'b', '../c')   // → 'a/c'\npath.resolve('a', 'b', '../c') // → '/current/working/dir/a/c'\npath.resolve('/base', 'a', '/override') // → '/override' (resets at /)\n\`\`\`\n\n## Real-World Patterns\n\n\`\`\`js\n// Load file relative to current module (CommonJS)\nconst config = require(path.join(__dirname, '..', 'config.json'));\n\n// Ensure uploads directory is absolute\nconst uploadsDir = path.resolve(process.cwd(), 'uploads');\n\n// Get file extension for type validation\nconst ext = path.extname(file.originalname).toLowerCase();\nif (!['.jpg', '.png', '.pdf'].includes(ext)) {\n  throw new Error('Invalid file type');\n}\n\`\`\``,
    codeExamples: [
      {
        title: 'path.join — always use this instead of string concatenation',
        code: `const path = require('path');

// ❌ Wrong — breaks on Windows
const bad = __dirname + '/' + 'uploads' + '/' + filename;

// ✅ Correct — works on all platforms
const good = path.join(__dirname, 'uploads', filename);

// Building paths for different purposes
const uploadsDir = path.join(__dirname, '..', 'uploads');
const configPath = path.join(process.cwd(), 'config', 'database.json');
const logPath = path.join(process.cwd(), 'logs', \`\${Date.now()}.log\`);

// Get info from existing path
const filePath = '/api/uploads/2024/user-avatar.jpg';
console.log(path.dirname(filePath));  // '/api/uploads/2024'
console.log(path.basename(filePath)); // 'user-avatar.jpg'
console.log(path.extname(filePath));  // '.jpg'

// Safe extension check for uploads
function isAllowedImage(filename) {
  const ext = path.extname(filename).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
}`,
        explanation: 'path.join handles all separator differences. Always use it instead of string concatenation for file paths.',
      },
    ],
    commonMistakes: [
      'Using string concatenation for paths — always use path.join.',
      'Confusing path.join and path.resolve — join stays relative if input is relative; resolve always returns absolute.',
      'Using path.extname on "archive.tar.gz" expecting ".tar.gz" — it returns only ".gz".',
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between path.join and path.resolve?',
        answer: 'path.join concatenates path segments with the correct OS separator. If input is relative, output is relative. path.resolve builds an absolute path starting from process.cwd(). If any segment starts with /, it resets like a cd command. Use path.join for combining segments; use path.resolve when you need an absolute path.',
        difficulty: 'beginner',
      },
    ],
    exercises: [
      {
        id: 'ex-node-7',
        title: 'Build file paths correctly',
        description: 'Given a base directory and filename, build the correct absolute path for an uploads folder.',
        starterCode: `const path = require('path');

// Given: baseDir = '/home/user/project', filename = 'photo.jpg'
// Build: absolute path to uploads/2024/photo.jpg
// Also extract: directory, basename, extension separately`,
        solution: `const path = require('path');

const baseDir = '/home/user/project';
const filename = 'photo.jpg';
const year = new Date().getFullYear();

const fullPath = path.join(baseDir, 'uploads', String(year), filename);
console.log('Full path:', fullPath);
console.log('Directory:', path.dirname(fullPath));
console.log('Basename:', path.basename(fullPath));
console.log('Extension:', path.extname(fullPath));`,
        hints: ['Use path.join for all path building', 'path.dirname gets the containing folder'],
      },
    ],
    keyTakeaways: [
      'Always use path.join() — never string concatenation for file paths',
      'path.join = concatenate segments; path.resolve = absolute path from cwd',
      'path.basename, path.dirname, path.extname extract path components',
      'path.sep is / on Unix, \\\\ on Windows — path module handles this automatically',
    ],
    prevLesson: 'nodejs-filesystem',
    nextLesson: 'nodejs-events',
  },

  // ─── MODULE 8: Events ────────────────────────────────────────────────────────
  {
    id: 'nodejs-events',
    slug: 'nodejs-events',
    title: 'Events — EventEmitter',
    description: 'Master the EventEmitter pattern, build custom event-driven systems, and understand how Node.js internals use events.',
    category: 'Core Modules',
    order: 8,
    difficulty: 'intermediate',
    estimatedTime: 20,
    content: `Node.js is fundamentally event-driven. HTTP servers, file streams, sockets — they all emit events. The \`EventEmitter\` class is the backbone of this pattern.\n\n## What is EventEmitter\n\nEventEmitter is a class from the built-in \`events\` module that lets you:\n1. **Emit events** (fire named events with optional data)\n2. **Listen to events** (register handlers that run when the event fires)\n\nThis is the **Observer pattern** — emitters broadcast, listeners subscribe.\n\n## Basic EventEmitter API\n\n\`\`\`js\nconst EventEmitter = require('events');\nconst emitter = new EventEmitter();\n\n// Listen\nemitter.on('data', (payload) => {\n  console.log('Received:', payload);\n});\n\n// Emit\nemitter.emit('data', { id: 1, name: 'Alice' });\n\n// One-time listener\nemitter.once('connect', () => console.log('Connected once'));\n\n// Remove listener\nfunction handler(data) { console.log(data); }\nemitter.on('event', handler);\nemitter.off('event', handler); // or: emitter.removeListener('event', handler)\n\n// Count listeners\nemitter.listenerCount('data'); // → 1\n\n// Remove all listeners for an event\nemitter.removeAllListeners('data');\n\`\`\`\n\n## Building Custom EventEmitters\n\nThe real power is extending EventEmitter to build event-driven classes:\n\n\`\`\`js\nclass Database extends EventEmitter {\n  connect() {\n    // ... connection logic\n    this.emit('connected', { host: 'localhost' });\n  }\n  disconnect() {\n    this.emit('disconnected');\n  }\n}\n\nconst db = new Database();\ndb.on('connected', ({ host }) => console.log('DB connected to', host));\ndb.connect();\n\`\`\`\n\n## The error Event — Special\n\nIn Node.js, the \`error\` event is special. If an EventEmitter emits \`error\` and no listener is registered, **Node.js throws the error and crashes**.\n\nAlways handle the error event:\n\`\`\`js\nemitter.on('error', (err) => {\n  console.error('Error:', err.message);\n});\n\`\`\`\n\n## Memory Leak Warning\n\nNode.js warns when more than 10 listeners are added to a single event. This protects against memory leaks where code accidentally adds listeners in a loop.\n\n\`\`\`js\n// Increase limit if you legitimately need more\nemitter.setMaxListeners(20);\n// Or set to 0 for unlimited (dangerous)\n\`\`\`\n\n## How Node.js Internals Use Events\n\nAlmost every Node.js built-in uses EventEmitter:\n\n- **HTTP Server**: emits \`request\`, \`connection\`, \`close\`, \`error\`\n- **Streams**: emit \`data\`, \`end\`, \`error\`, \`drain\`, \`finish\`\n- **File Watcher**: emits \`change\`, \`rename\`\n- **Process**: emits \`exit\`, \`uncaughtException\`, \`SIGTERM\`\n- **TCP Socket**: emits \`connect\`, \`data\`, \`end\`, \`close\`, \`error\`\n\n## Real World Use Cases\n\n- **Audit logging**: emit events on user actions, log them centrally\n- **Plugin systems**: allow plugins to hook into lifecycle events\n- **State machines**: emit events on state transitions\n- **WebSocket messaging**: emit events when messages arrive\n- **Job queues**: emit events when jobs complete, fail, or progress`,
    codeExamples: [
      {
        title: 'Custom event-driven payment system',
        code: `const EventEmitter = require('events');

class PaymentProcessor extends EventEmitter {
  async processPayment(orderId, amount) {
    this.emit('payment:started', { orderId, amount });

    try {
      // Simulate payment gateway call
      await new Promise(resolve => setTimeout(resolve, 100));

      if (amount > 10000) throw new Error('Amount exceeds limit');

      this.emit('payment:success', { orderId, amount, transactionId: 'txn_' + Date.now() });
    } catch (err) {
      this.emit('payment:failed', { orderId, amount, reason: err.message });
      this.emit('error', err); // Always emit error event too
    }
  }
}

const processor = new PaymentProcessor();

// Multiple listeners for the same event
processor.on('payment:success', ({ orderId, transactionId }) => {
  console.log(\`Order \${orderId} paid. Txn: \${transactionId}\`);
});

processor.on('payment:success', ({ orderId, amount }) => {
  // Send receipt email
  console.log(\`Sending receipt for \$\${amount} to user\`);
});

processor.on('payment:failed', ({ orderId, reason }) => {
  console.error(\`Payment failed for order \${orderId}: \${reason}\`);
});

processor.on('error', (err) => {
  console.error('Processor error:', err.message);
});

processor.processPayment('ord-123', 500);
processor.processPayment('ord-124', 50000); // fails`,
        explanation: 'Multiple listeners can subscribe to the same event — they all run. This decouples payment logic from email sending, logging, etc.',
      },
      {
        title: 'EventEmitter patterns — once, off, removeAllListeners',
        code: `const EventEmitter = require('events');
const emitter = new EventEmitter();

// once — fires only on first emit, then auto-removes
emitter.once('startup', () => console.log('Startup complete — fires once only'));
emitter.emit('startup'); // logs
emitter.emit('startup'); // nothing — listener was removed

// Accumulate vs replace — common bug
function setupListeners(emitter) {
  // ❌ Bug: called multiple times adds duplicate listeners
  emitter.on('data', processData);

  // ✅ Fix: remove first
  emitter.off('data', processData);
  emitter.on('data', processData);

  // ✅ Alternative: use once if appropriate
  emitter.once('data', processData);
}

function processData(data) { console.log(data); }

// Emit with multiple arguments
const bus = new EventEmitter();
bus.on('user:login', (userId, ip, timestamp) => {
  console.log(\`User \${userId} logged in from \${ip} at \${timestamp}\`);
});
bus.emit('user:login', 'user-42', '192.168.1.1', Date.now());`,
        explanation: 'once() auto-removes the listener after first call. Always be careful about adding listeners inside loops or re-called functions — it creates duplicates.',
      },
    ],
    commonMistakes: [
      'Not handling the error event — if error is emitted with no handler, Node.js crashes.',
      'Adding listeners inside loops or functions that are called multiple times — causes memory leaks.',
      'Forgetting to remove listeners when components unmount — leads to "memory leak detected" warnings.',
      'Using EventEmitter for request/response patterns — use Promises instead. Events are for broadcast.',
    ],
    interviewQuestions: [
      {
        question: 'What is EventEmitter in Node.js?',
        answer: 'EventEmitter is a class from the events module that implements the Observer pattern. It lets objects emit named events and register listener functions that run when events fire. Almost all Node.js internals (HTTP, streams, sockets) extend EventEmitter. Key methods: .on(event, handler) to subscribe, .emit(event, ...args) to fire, .once() for one-time handlers, .off() to remove.',
        difficulty: 'intermediate',
      },
      {
        question: 'What happens if you emit an error event with no listener?',
        answer: 'Node.js throws an unhandled error and crashes the process. The error event is special — it is the only event where missing a listener causes a crash. Always register an error handler: emitter.on("error", handler). This is why you see .on("error") in all stream, socket, and HTTP server code.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'ex-node-8',
        title: 'Build an event-driven logger',
        description: 'Create a Logger class extending EventEmitter that emits log events with level and message. Add listeners for different levels.',
        starterCode: `const EventEmitter = require('events');

class Logger extends EventEmitter {
  // log(level, message) — emits 'log' event with { level, message, timestamp }
  // info(message) — calls log('info', message)
  // error(message) — calls log('error', message)
}

const logger = new Logger();
// Add listener that prints: [INFO] Hello World
// Add listener for 'error' level that also calls process.exit(1)
logger.info('Hello World');`,
        solution: `const EventEmitter = require('events');

class Logger extends EventEmitter {
  log(level, message) {
    this.emit('log', { level, message, timestamp: new Date().toISOString() });
  }
  info(message) { this.log('info', message); }
  error(message) { this.log('error', message); }
}

const logger = new Logger();
logger.on('log', ({ level, message, timestamp }) => {
  console.log(\`[\${timestamp}] [\${level.toUpperCase()}] \${message}\`);
});
logger.on('error', () => { /* prevent crash */ });
logger.info('Hello World');
logger.error('Something failed');`,
        hints: ['Extend EventEmitter', 'Call this.emit() inside log()', 'Register on("log") listener externally'],
      },
    ],
    keyTakeaways: [
      'EventEmitter implements the Observer pattern — emit to broadcast, on() to subscribe',
      'Multiple listeners can subscribe to the same event — all run independently',
      'Always handle the error event — unhandled error events crash Node.js',
      'once() fires only on the first emit then auto-removes the listener',
      'Node.js internals (HTTP, streams, sockets) all extend EventEmitter',
    ],
    prevLesson: 'nodejs-path',
    nextLesson: 'nodejs-streams',
  },

  // ─── MODULE 9: Streams ────────────────────────────────────────────────────────
  {
    id: 'nodejs-streams',
    slug: 'nodejs-streams',
    title: 'Streams — Processing Data Without Loading It All',
    description: 'Deep dive into readable, writable, duplex, and transform streams. Understand pipe, backpressure, and why streams exist for large data.',
    category: 'Core Modules',
    order: 9,
    difficulty: 'intermediate',
    estimatedTime: 35,
    content: `Streams are one of the most powerful features in Node.js. They let you process data piece by piece instead of loading everything into memory at once.\n\n## Why Streams Exist\n\nProblem: You need to serve a 5GB video file to a user.\n\n**Without streams:**\n\`\`\`js\n// ❌ Loads entire 5GB into RAM, then sends it\nconst data = fs.readFileSync('movie.mp4'); // crashes — not enough RAM\nres.end(data);\n\`\`\`\n\n**With streams:**\n\`\`\`js\n// ✅ Reads 64KB chunk → sends it → reads next 64KB → sends it...\nfs.createReadStream('movie.mp4').pipe(res); // constant memory usage\n\`\`\`\n\nStreams use a fixed buffer (default ~64KB). Memory usage stays constant regardless of data size.\n\n## Four Types of Streams\n\n**1. Readable** — data source (you read FROM it)\n- \`fs.createReadStream()\`, \`http.IncomingMessage\`, \`process.stdin\`\n\n**2. Writable** — data destination (you write TO it)\n- \`fs.createWriteStream()\`, \`http.ServerResponse\`, \`process.stdout\`\n\n**3. Duplex** — both readable and writable\n- TCP socket: \`net.Socket\` — you can both send and receive data\n\n**4. Transform** — duplex stream that transforms data\n- \`zlib.createGzip()\` — reads raw data, writes compressed data\n- \`crypto.createCipheriv()\` — reads plaintext, writes ciphertext\n\n## Readable Streams\n\nTwo modes:\n- **Flowing mode**: data events fire as fast as possible (push model)\n- **Paused mode**: you call \`.read()\` to pull data (pull model)\n\n\`\`\`js\nconst readable = fs.createReadStream('file.txt', { encoding: 'utf8' });\n\n// Mode 1: event-based\nreadable.on('data', (chunk) => console.log('Chunk:', chunk.length, 'chars'));\nreadable.on('end', () => console.log('Done'));\nreadable.on('error', (err) => console.error('Error:', err));\n\n// Mode 2: async iteration (cleanest modern approach)\nfor await (const chunk of readable) {\n  process.stdout.write(chunk);\n}\n\`\`\`\n\n## Writable Streams\n\n\`\`\`js\nconst writable = fs.createWriteStream('output.txt');\n\nwritable.write('Hello ');\nwritable.write('World');\nwritable.end(); // signal end of writing\n\nwritable.on('finish', () => console.log('File written'));\nwritable.on('error', (err) => console.error(err));\n\`\`\`\n\n## pipe — Connect Streams Together\n\n\`pipe()\` connects a readable to a writable. It handles:\n- Forwarding data chunks\n- Pausing the readable if the writable is slow (backpressure)\n- Ending the writable when the readable ends\n\n\`\`\`js\n// Compress a file\nconst { createReadStream, createWriteStream } = require('fs');\nconst { createGzip } = require('zlib');\n\nconst source = createReadStream('input.txt');\nconst gzip = createGzip();\nconst dest = createWriteStream('output.txt.gz');\n\nsource.pipe(gzip).pipe(dest);\n\ndest.on('finish', () => console.log('Compressed!'));\n\`\`\`\n\nModern alternative — \`stream.pipeline()\` — handles errors and cleanup properly:\n\n\`\`\`js\nconst { pipeline } = require('stream/promises');\n\nawait pipeline(\n  fs.createReadStream('input.txt'),\n  createGzip(),\n  fs.createWriteStream('output.txt.gz')\n);\n\`\`\`\n\n## Backpressure — The Critical Concept\n\nBackpressure happens when data is produced faster than it can be consumed.\n\nExample: Reading a file at 1GB/s but writing to a slow network at 10MB/s.\n\nWithout backpressure: data queues up in memory → out of memory crash.\n\n\`pipe()\` handles backpressure automatically:\n- If \`writable.write()\` returns \`false\` → buffer is full → pause the readable\n- When \`drain\` event fires → buffer is empty again → resume the readable\n\n## Transform Streams — Custom Data Processing\n\n\`\`\`js\nconst { Transform } = require('stream');\n\nconst upperCaseTransform = new Transform({\n  transform(chunk, encoding, callback) {\n    this.push(chunk.toString().toUpperCase());\n    callback(); // signal chunk is processed\n  }\n});\n\nprocess.stdin\n  .pipe(upperCaseTransform)\n  .pipe(process.stdout);\n// Type anything → it prints in UPPERCASE\n\`\`\`\n\n## Real-World Stream Use Cases\n\n- **File uploads**: stream directly to S3 without saving to disk\n- **Video streaming**: serve MP4/HLS in chunks to the browser\n- **CSV processing**: read millions of rows without loading all into RAM\n- **Gzip compression**: compress API responses on the fly\n- **Encryption**: encrypt files while uploading to storage\n- **Log processing**: tail and parse large log files`,
    codeExamples: [
      {
        title: 'Stream a file as HTTP response — the right way',
        code: `const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  const filePath = path.join(__dirname, 'public', req.url);

  // Get file stats first for Content-Length header
  fs.stat(filePath, (err, stats) => {
    if (err) {
      res.writeHead(404);
      return res.end('File not found');
    }

    res.writeHead(200, {
      'Content-Type': 'video/mp4',
      'Content-Length': stats.size,
    });

    // Stream file in chunks — memory stays constant
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);

    stream.on('error', (err) => {
      console.error('Stream error:', err);
      res.destroy();
    });
  });
});

server.listen(3000);
// This serves a 5GB file using ~64KB of memory`,
        explanation: 'Instead of loading the entire file with fs.readFile, createReadStream sends it in chunks. The pipe() handles backpressure automatically.',
      },
      {
        title: 'Transform stream — CSV parsing line by line',
        code: `const { Transform } = require('stream');
const fs = require('fs');
const { pipeline } = require('stream/promises');

// Transform stream that parses CSV lines into objects
class CSVParser extends Transform {
  constructor() {
    super({ objectMode: true }); // output objects, not buffers
    this.header = null;
    this.buffer = '';
  }

  _transform(chunk, encoding, callback) {
    this.buffer += chunk.toString();
    const lines = this.buffer.split('\\n');
    this.buffer = lines.pop(); // keep incomplete last line

    for (const line of lines) {
      if (!line.trim()) continue;
      const values = line.split(',');

      if (!this.header) {
        this.header = values;
      } else {
        const row = {};
        this.header.forEach((key, i) => row[key.trim()] = values[i]?.trim());
        this.push(row); // emit parsed object
      }
    }
    callback();
  }

  _flush(callback) {
    // Process remaining buffer
    if (this.buffer.trim() && this.header) {
      const values = this.buffer.split(',');
      const row = {};
      this.header.forEach((key, i) => row[key.trim()] = values[i]?.trim());
      this.push(row);
    }
    callback();
  }
}

// Usage: stream a 1GB CSV without loading it
async function processCSV(filePath) {
  const parser = new CSVParser();
  let count = 0;

  const counter = new Transform({
    objectMode: true,
    transform(row, enc, cb) {
      count++;
      // Process each row here
      cb();
    }
  });

  await pipeline(
    fs.createReadStream(filePath),
    parser,
    counter
  );

  console.log(\`Processed \${count} rows\`);
}`,
        explanation: 'objectMode: true lets a Transform stream emit JavaScript objects instead of Buffers. The _flush method handles any remaining data after the source ends.',
      },
      {
        title: 'pipeline — proper error handling for streams',
        code: `const { pipeline } = require('stream/promises');
const { createReadStream, createWriteStream } = require('fs');
const { createGzip, createGunzip } = require('zlib');

// Compress a file
async function compressFile(src, dest) {
  await pipeline(
    createReadStream(src),
    createGzip(),
    createWriteStream(dest)
  );
  console.log(\`Compressed \${src} → \${dest}\`);
}

// Decompress a file
async function decompressFile(src, dest) {
  await pipeline(
    createReadStream(src),
    createGunzip(),
    createWriteStream(dest)
  );
}

// Upload stream from HTTP request
async function saveUpload(req, destPath) {
  await pipeline(
    req, // IncomingMessage is a readable stream
    createWriteStream(destPath)
  );
  console.log('Upload saved to', destPath);
}

compressFile('large-file.txt', 'large-file.txt.gz').catch(console.error);`,
        explanation: 'stream.pipeline() is better than .pipe() — it propagates errors through all streams and destroys them on failure. Prefer it in production code.',
      },
    ],
    commonMistakes: [
      'Using fs.readFile for large files — loads everything into memory. Use streams.',
      'Using .pipe() without error handling — errors do not propagate through pipe chains. Use pipeline().',
      'Forgetting to handle the drain event in manual backpressure — causes memory buildup.',
      'Mixing objectMode and buffer mode in a pipeline — causes type errors.',
    ],
    interviewQuestions: [
      {
        question: 'What are streams in Node.js and why do they matter?',
        answer: 'Streams let you process data piece by piece (in chunks) rather than loading everything into memory. Node.js has four stream types: Readable (source), Writable (destination), Duplex (both), Transform (read, modify, write). Key advantage: constant memory usage regardless of data size — a 10GB file still uses only ~64KB of buffer. Used for: file serving, video streaming, CSV processing, compression, encryption.',
        difficulty: 'intermediate',
        tip: 'Always mention the memory advantage. Compare readFile vs createReadStream for a large file.',
      },
      {
        question: 'What is backpressure in Node.js streams?',
        answer: 'Backpressure is the mechanism that prevents data from accumulating in memory when a producer is faster than a consumer. When the writable buffer is full, writable.write() returns false — signaling to pause the readable. When the buffer drains, the "drain" event fires — signaling to resume. pipe() and pipeline() handle backpressure automatically. Without it, fast reads + slow writes = memory exhaustion.',
        difficulty: 'advanced',
      },
      {
        question: 'What is the difference between pipe() and pipeline()?',
        answer: 'pipe() connects streams but does not handle errors — if one stream errors, the others are not cleaned up, causing memory leaks. pipeline() (from stream/promises) propagates errors through all streams and destroys them on failure. Use pipeline() in production code. pipe() can cause resource leaks on error.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'ex-node-9',
        title: 'Compress a file with streams',
        description: 'Use streams and pipeline to compress a text file with gzip. Calculate and print the compression ratio.',
        starterCode: `const { pipeline } = require('stream/promises');
const { createReadStream, createWriteStream, stat } = require('fs');
const { promisify } = require('util');
const { createGzip } = require('zlib');

const statAsync = promisify(stat);

async function compressAndReport(inputFile, outputFile) {
  // 1. Run the compression pipeline
  // 2. Get sizes of both files
  // 3. Print: "Compressed X MB → Y MB (Z% reduction)"
}

compressAndReport('input.txt', 'input.txt.gz');`,
        solution: `const { pipeline } = require('stream/promises');
const { createReadStream, createWriteStream } = require('fs');
const fs = require('fs/promises');
const { createGzip } = require('zlib');

async function compressAndReport(inputFile, outputFile) {
  await pipeline(
    createReadStream(inputFile),
    createGzip(),
    createWriteStream(outputFile)
  );
  const [inStat, outStat] = await Promise.all([
    fs.stat(inputFile),
    fs.stat(outputFile)
  ]);
  const inMB = (inStat.size / 1024 / 1024).toFixed(2);
  const outMB = (outStat.size / 1024 / 1024).toFixed(2);
  const reduction = (((inStat.size - outStat.size) / inStat.size) * 100).toFixed(1);
  console.log(\`Compressed \${inMB} MB → \${outMB} MB (\${reduction}% reduction)\`);
}`,
        hints: ['pipeline() from stream/promises returns a Promise', 'Use fs.stat to get file sizes', 'Use Promise.all to get both stats simultaneously'],
      },
    ],
    keyTakeaways: [
      'Streams process data in chunks — constant memory regardless of data size',
      'Four types: Readable (source), Writable (dest), Duplex (both), Transform (modify)',
      'Use pipeline() not pipe() — it handles errors and cleanup correctly',
      'Backpressure prevents memory exhaustion when producer > consumer speed',
      'objectMode: true lets streams emit JavaScript objects instead of Buffers',
    ],
    prevLesson: 'nodejs-events',
    nextLesson: 'nodejs-http',
  },

  // ─── MODULE 10: HTTP Module ───────────────────────────────────────────────────
  {
    id: 'nodejs-http',
    slug: 'nodejs-http',
    title: 'HTTP Module — Building Servers from Scratch',
    description: 'Understand how HTTP works in Node.js, create servers, handle requests and responses, and learn what frameworks like Express abstract away.',
    category: 'HTTP',
    order: 10,
    difficulty: 'intermediate',
    estimatedTime: 25,
    content: `Understanding the raw \`http\` module is essential — it shows you what Express, Fastify, and every Node.js framework is built on top of.\n\n## How HTTP Works in Node.js\n\nWhen a client (browser, curl, fetch) makes an HTTP request:\n1. TCP connection established\n2. Client sends: request line + headers + optional body\n3. Server reads the request stream\n4. Server writes: status line + headers + body\n5. Connection closed (or kept alive for reuse)\n\nIn Node.js, the HTTP server is an EventEmitter that emits a \`request\` event for every incoming request.\n\n## Creating an HTTP Server\n\n\`\`\`js\nconst http = require('http');\n\nconst server = http.createServer((req, res) => {\n  // req = IncomingMessage (readable stream)\n  // res = ServerResponse (writable stream)\n  res.writeHead(200, { 'Content-Type': 'application/json' });\n  res.end(JSON.stringify({ message: 'Hello' }));\n});\n\nserver.listen(3000, () => console.log('Server on port 3000'));\n\`\`\`\n\n## The Request Object (req)\n\n\`\`\`js\nreq.method   // 'GET', 'POST', 'PUT', 'DELETE', 'PATCH'\nreq.url      // '/api/users?page=2&limit=10'\nreq.headers  // { 'content-type': 'application/json', 'authorization': 'Bearer ...' }\n\n// Parse URL\nconst { URL } = require('url');\nconst url = new URL(req.url, \`http://\${req.headers.host}\`);\nurl.pathname   // '/api/users'\nurl.searchParams.get('page')  // '2'\n\n// Read request body (it is a stream)\nlet body = '';\nreq.on('data', chunk => body += chunk.toString());\nreq.on('end', () => {\n  const data = JSON.parse(body);\n});\n\`\`\`\n\n## The Response Object (res)\n\n\`\`\`js\n// Set status code and headers together\nres.writeHead(201, {\n  'Content-Type': 'application/json',\n  'Location': '/api/users/123',\n});\n\n// Set headers individually (must be before writeHead or write)\nres.setHeader('X-Request-Id', 'abc-123');\n\n// Status code only\nres.statusCode = 404;\n\n// Send body and end\nres.end(JSON.stringify({ error: 'Not Found' }));\n\n// Or write in parts\nres.write('chunk 1');\nres.write('chunk 2');\nres.end(); // signals no more data\n\`\`\`\n\n## HTTP Status Codes to Know\n\n\`\`\`\n200 OK              — request succeeded\n201 Created         — resource created (POST)\n204 No Content      — success, no body (DELETE)\n301 Moved Permanently — redirect (cached)\n302 Found           — redirect (not cached)\n400 Bad Request     — client sent invalid data\n401 Unauthorized    — not authenticated\n403 Forbidden       — authenticated but not allowed\n404 Not Found       — resource does not exist\n409 Conflict        — resource already exists\n422 Unprocessable Entity — validation failed\n429 Too Many Requests — rate limited\n500 Internal Server Error — something broke on the server\n503 Service Unavailable — server overloaded / down for maintenance\n\`\`\`\n\n## Manual Routing\n\nWithout a framework, you manually check \`req.method\` and \`req.url\`:\n\n\`\`\`js\nif (req.method === 'GET' && req.url === '/api/users') {\n  // handle GET /api/users\n} else if (req.method === 'POST' && req.url === '/api/users') {\n  // handle POST /api/users\n} else {\n  res.writeHead(404);\n  res.end('Not Found');\n}\n\`\`\`\n\nThis gets messy fast. Frameworks like Express replace this with \`app.get('/api/users', handler)\`.\n\n## What Express Abstracts Away\n\n| Raw http | Express |\n|----------|--------|\n| Parse body manually (stream) | req.body (auto-parsed) |\n| Parse URL manually | req.params, req.query |\n| Set headers manually | res.json(), res.status() |\n| Manual routing with if/else | app.get/post/put/delete() |\n| No middleware system | app.use(middleware) |\n| No error handling | app.use(errorHandler) |\n\nExpress is a thin wrapper around the http module — it does not change how HTTP works, just makes it easier.`,
    codeExamples: [
      {
        title: 'Complete HTTP server with routing and JSON body parsing',
        code: `const http = require('http');
const { URL } = require('url');

// In-memory "database"
const users = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
];

// Parse JSON request body
function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

// Send JSON response
function json(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, \`http://localhost\`);
  const pathname = url.pathname;

  try {
    // GET /api/users
    if (req.method === 'GET' && pathname === '/api/users') {
      return json(res, 200, users);
    }

    // GET /api/users/:id
    const userMatch = pathname.match(/^\\/api\\/users\\/(\\d+)$/);
    if (req.method === 'GET' && userMatch) {
      const user = users.find(u => u.id === parseInt(userMatch[1]));
      if (!user) return json(res, 404, { error: 'User not found' });
      return json(res, 200, user);
    }

    // POST /api/users
    if (req.method === 'POST' && pathname === '/api/users') {
      const body = await readBody(req);
      if (!body.name || !body.email) {
        return json(res, 400, { error: 'name and email are required' });
      }
      const user = { id: Date.now(), ...body };
      users.push(user);
      return json(res, 201, user);
    }

    json(res, 404, { error: 'Not Found' });
  } catch (err) {
    json(res, 500, { error: err.message });
  }
});

server.listen(3000, () => console.log('API running on port 3000'));`,
        explanation: 'This is what Express does internally — it just wraps this pattern with a cleaner API, middleware, and better error handling.',
      },
      {
        title: 'Making HTTP requests with the http module',
        code: `const https = require('https');

// Make an outgoing HTTPS request
function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (err) {
          reject(new Error('Invalid JSON'));
        }
      });
    }).on('error', reject);
  });
}

// Usage
async function main() {
  const data = await fetchJSON('https://api.github.com/users/nodejs');
  console.log(data.name, '-', data.followers, 'followers');
}

// In modern Node.js (18+), use the built-in fetch instead:
async function modernFetch() {
  const res = await fetch('https://api.github.com/users/nodejs');
  const data = await res.json();
  console.log(data.name);
}`,
        explanation: 'For outgoing requests, modern Node.js (v18+) has built-in fetch — same API as browsers. No need for the http module or axios for simple requests.',
      },
    ],
    commonMistakes: [
      'Forgetting res.end() — the client hangs forever waiting for a response.',
      'Setting headers after writing the body — headers must be set before writing.',
      'Not handling errors in readBody — invalid JSON causes uncaught exceptions.',
      'Using http instead of https for external API calls — always use https.',
    ],
    interviewQuestions: [
      {
        question: 'How does Node.js handle HTTP requests?',
        answer: 'Node.js creates an HTTP server via http.createServer(). Every incoming request triggers the request event, providing IncomingMessage (req — a readable stream) and ServerResponse (res — a writable stream). The server reads the request method, URL, and headers from req. It writes status code, headers, and body to res, then calls res.end() to signal completion. The underlying TCP management and HTTP parsing is handled by libuv.',
        difficulty: 'intermediate',
      },
      {
        question: 'What HTTP status codes should every developer know?',
        answer: '200 (OK), 201 (Created), 204 (No Content), 400 (Bad Request), 401 (Unauthorized — not logged in), 403 (Forbidden — logged in but no permission), 404 (Not Found), 409 (Conflict), 422 (Validation Failed), 429 (Rate Limited), 500 (Server Error), 503 (Service Unavailable). Key distinction: 401 vs 403 — 401 means "who are you?", 403 means "I know who you are but you cannot do this."',
        difficulty: 'beginner',
      },
    ],
    exercises: [
      {
        id: 'ex-node-10',
        title: 'Build a health check endpoint',
        description: 'Create an HTTP server with a GET /health endpoint that returns server status, uptime, and timestamp.',
        starterCode: `const http = require('http');

const startTime = Date.now();

const server = http.createServer((req, res) => {
  // Only handle GET /health
  // Return: { status: 'ok', uptime: <seconds>, timestamp: <ISO string> }
  // Return 404 for all other routes
});

server.listen(3000);`,
        solution: `const http = require('http');

const startTime = Date.now();

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      uptime: Math.floor((Date.now() - startTime) / 1000),
      timestamp: new Date().toISOString(),
    }));
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});

server.listen(3000, () => console.log('Server running'));`,
        hints: ['Check req.method and req.url', 'res.writeHead() sets status and headers', 'res.end() must always be called'],
      },
    ],
    keyTakeaways: [
      'HTTP server = EventEmitter emitting request events for every connection',
      'req is a readable stream (IncomingMessage), res is a writable stream (ServerResponse)',
      'Always call res.end() — otherwise the client waits forever',
      'Headers must be set before writing the body',
      'Express abstracts away: body parsing, URL parsing, routing, middleware, error handling',
    ],
    prevLesson: 'nodejs-streams',
    nextLesson: 'express-framework',
  },

  // ─── MODULE 11: Express.js ───────────────────────────────────────────────────
  {
    id: 'express-framework',
    slug: 'express-framework',
    title: 'Express.js — The Node.js Framework',
    description: 'Master Express routing, middleware, request lifecycle, error handling, and project structure for production APIs.',
    category: 'Express',
    order: 11,
    difficulty: 'intermediate',
    estimatedTime: 40,
    content: `Express is the most popular Node.js web framework. It is minimal and unopinionated — a thin layer over Node's http module that adds routing, middleware, and a cleaner API.\n\n## Why Express\n\nThe raw http module requires you to manually parse bodies, match routes with regex, build response helpers, and chain logic. Express standardizes all of this:\n\n\`\`\`bash\nnpm install express\n\`\`\`\n\n## Minimal Express Server\n\n\`\`\`js\nconst express = require('express');\nconst app = express();\n\napp.use(express.json()); // parse JSON bodies\n\napp.get('/', (req, res) => {\n  res.json({ message: 'Hello World' });\n});\n\napp.listen(3000, () => console.log('Server on port 3000'));\n\`\`\`\n\n## Routing\n\n\`\`\`js\n// HTTP method routes\napp.get('/users', handler);\napp.post('/users', handler);\napp.put('/users/:id', handler);\napp.patch('/users/:id', handler);\napp.delete('/users/:id', handler);\napp.all('/any-method', handler); // matches any method\n\n// Route parameters\napp.get('/users/:id', (req, res) => {\n  const userId = req.params.id; // from URL: /users/42 → '42'\n  res.json({ id: userId });\n});\n\n// Multiple parameters\napp.get('/posts/:postId/comments/:commentId', (req, res) => {\n  const { postId, commentId } = req.params;\n});\n\n// Query string: /search?q=nodejs&page=2\napp.get('/search', (req, res) => {\n  const { q, page = 1 } = req.query;\n  res.json({ query: q, page: parseInt(page) });\n});\n\`\`\`\n\n## Middleware — The Core of Express\n\nMiddleware is a function with signature \`(req, res, next)\`. It runs in order between the request arriving and the route handler firing.\n\n\`\`\`js\n// Middleware runs in the order you call app.use()\napp.use(logRequest);        // 1st: log every request\napp.use(cors());            // 2nd: set CORS headers\napp.use(express.json());    // 3rd: parse JSON body\napp.use(authenticate);      // 4th: verify JWT\napp.get('/users', handler); // 5th: route handler\n\nfunction logRequest(req, res, next) {\n  console.log(\`\${req.method} \${req.url}\`);\n  next(); // must call next() or the chain stops here\n}\n\n// Error handling middleware — 4 arguments (err first)\napp.use((err, req, res, next) => {\n  console.error(err);\n  res.status(500).json({ error: 'Internal Server Error' });\n});\n\`\`\`\n\n## The Request Lifecycle\n\n\`\`\`\nHTTP Request\n    │\n    ▼\n[Global middleware: logger, cors, body-parser]\n    │\n    ▼\n[Route-specific middleware: auth, validate]\n    │\n    ▼\n[Route handler]\n    │\n    ▼\n[Error handler (if error thrown)]\n    │\n    ▼\nHTTP Response\n\`\`\`\n\n## Express Router — Modular Routes\n\n\`\`\`js\n// routes/users.js\nconst router = require('express').Router();\n\nrouter.get('/', getUsers);\nrouter.post('/', createUser);\nrouter.get('/:id', getUserById);\nrouter.put('/:id', updateUser);\nrouter.delete('/:id', deleteUser);\n\nmodule.exports = router;\n\n// app.js\nconst usersRouter = require('./routes/users');\napp.use('/api/users', usersRouter);\n// Now: GET /api/users, POST /api/users, GET /api/users/:id\n\`\`\`\n\n## Response Methods\n\n\`\`\`js\nres.json({ data: users })              // JSON response\nres.status(201).json({ id: 1 })        // with status code\nres.send('plain text')                 // text response\nres.sendFile('/path/to/file.html')     // serve a file\nres.redirect('/new-url')               // redirect\nres.redirect(301, '/permanent')        // permanent redirect\nres.download('/path/to/file.pdf')      // force download\nres.set('X-Custom', 'header')          // set header\n\`\`\`\n\n## Error Handling\n\n\`\`\`js\n// Sync errors — Express catches them automatically (v5+)\napp.get('/user', (req, res) => {\n  throw new Error('Something broke'); // Express catches this\n});\n\n// Async errors — must pass to next()\napp.get('/user', async (req, res, next) => {\n  try {\n    const user = await db.findUser(req.params.id);\n    res.json(user);\n  } catch (err) {\n    next(err); // forward to error handler\n  }\n});\n\n// Centralized error handler (must have 4 params)\napp.use((err, req, res, next) => {\n  const status = err.statusCode || 500;\n  res.status(status).json({\n    error: err.message,\n    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })\n  });\n});\n\`\`\`\n\n## Production Project Structure\n\n\`\`\`\nsrc/\n├── app.js           # Express app setup (no listen call)\n├── server.js        # Entry point — imports app, calls listen\n├── routes/\n│   ├── index.js     # Mount all routers\n│   ├── users.js\n│   └── posts.js\n├── controllers/\n│   ├── users.js     # Route handlers\n│   └── posts.js\n├── middleware/\n│   ├── auth.js      # JWT verification\n│   ├── validate.js  # Request validation\n│   └── errorHandler.js\n├── services/\n│   ├── users.js     # Business logic\n│   └── email.js\n└── models/\n    └── user.js      # Database models\n\`\`\``,
    codeExamples: [
      {
        title: 'Production Express app setup',
        code: `// src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const usersRouter = require('./routes/users');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(',') }));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check (no auth required)
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// API routes
app.use('/api/v1/users', usersRouter);

// 404 handler (must be after all routes)
app.use(notFound);

// Error handler (must be last, must have 4 params)
app.use(errorHandler);

module.exports = app;

// ─────────────────────────────────
// src/server.js
const app = require('./app');

const PORT = parseInt(process.env.PORT || '3000', 10);

const server = app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});`,
        explanation: 'Separate app.js (Express setup) from server.js (listening). This makes testing easier — import app without starting the server.',
      },
      {
        title: 'Middleware patterns — auth, validate, async wrapper',
        code: `const jwt = require('jsonwebtoken');

// Authentication middleware
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user to request
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Async wrapper — avoid try/catch in every async route
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Usage
const router = require('express').Router();

router.get('/',
  authenticate,                   // must be logged in
  asyncHandler(async (req, res) => {
    const users = await db.findAll();
    res.json(users);
  })
);

// Custom error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Error handler
function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500;
  const message = err.statusCode ? err.message : 'Internal Server Error';
  res.status(status).json({ error: message });
}`,
        explanation: 'The asyncHandler wrapper is essential — it catches Promise rejections and forwards them to next(), so you do not need try/catch in every async route.',
      },
      {
        title: 'Router — modular route files',
        code: `// routes/users.js
const { Router } = require('express');
const { body, param, query, validationResult } = require('express-validator');

const router = Router();
const userService = require('../services/users');
const { authenticate, authorize } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

// Validate middleware
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
}

// GET /api/users?page=1&limit=20
router.get('/',
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  validate,
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    const users = await userService.getAll({ page, limit });
    res.json(users);
  })
);

// POST /api/users
router.post('/',
  body('email').isEmail().normalizeEmail(),
  body('name').trim().isLength({ min: 2, max: 100 }),
  body('password').isLength({ min: 8 }),
  validate,
  asyncHandler(async (req, res) => {
    const user = await userService.create(req.body);
    res.status(201).json(user);
  })
);

// GET /api/users/:id
router.get('/:id',
  authenticate,
  asyncHandler(async (req, res) => {
    const user = await userService.getById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  })
);

module.exports = router;`,
        explanation: 'Each route file handles one resource. Validation, auth, and business logic are separate. This is the pattern most production Express codebases follow.',
      },
    ],
    commonMistakes: [
      'Putting the error handler before routes — it must be the last middleware.',
      'Forgetting to call next(err) in async routes — unhandled promise rejections crash Node.js.',
      'Using app.use() for a specific HTTP method — use app.get/post/put/delete instead.',
      'Calling res.json() after res.json() has already been called — "Cannot set headers after they are sent."',
      'Not separating app.js and server.js — makes testing painful because listen() starts a port.',
    ],
    interviewQuestions: [
      {
        question: 'What is middleware in Express and how does it work?',
        answer: 'Middleware is a function with signature (req, res, next). Express executes middleware in the order they are registered with app.use(). Each middleware can read/modify req and res, then call next() to pass control to the next middleware or route handler. If next(err) is called with an error, Express skips to the error handler. Without next(), the request hangs.',
        difficulty: 'intermediate',
        tip: 'Explain the request pipeline: request → middleware chain → route handler → error handler → response.',
      },
      {
        question: 'How do you handle errors in Express?',
        answer: 'Express has a centralized error handler — a middleware with 4 parameters: (err, req, res, next). You reach it by: (1) calling next(err) from a middleware or route, (2) throwing synchronously in a route (Express v5 catches this), (3) wrapping async routes in a try/catch and calling next(err). The error handler must be registered last, after all routes.',
        difficulty: 'intermediate',
      },
      {
        question: 'What is the difference between app.use() and app.get()?',
        answer: 'app.use() registers middleware for all HTTP methods and is a prefix match (app.use("/api") matches /api, /api/users, /api/posts). app.get() registers a handler only for GET requests and is an exact match. app.use() is used for middleware (body-parser, cors, auth). app.get/post/put/delete() is used for route handlers.',
        difficulty: 'beginner',
      },
    ],
    exercises: [
      {
        id: 'ex-node-11',
        title: 'Build a CRUD API with Express Router',
        description: 'Create an Express app with a /api/tasks router supporting GET all, GET by id, POST create, PUT update, DELETE.',
        starterCode: `const express = require('express');
const app = express();
app.use(express.json());

// Create a /api/tasks router with:
// GET /api/tasks - return all tasks
// GET /api/tasks/:id - return task or 404
// POST /api/tasks - create with { title, done: false }
// PUT /api/tasks/:id - update task
// DELETE /api/tasks/:id - remove task

app.listen(3000);`,
        solution: `const express = require('express');
const app = express();
app.use(express.json());

const router = express.Router();
let tasks = [];
let nextId = 1;

router.get('/', (req, res) => res.json(tasks));

router.get('/:id', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ error: 'Not found' });
  res.json(task);
});

router.post('/', (req, res) => {
  const task = { id: nextId++, title: req.body.title, done: false };
  tasks.push(task);
  res.status(201).json(task);
});

router.put('/:id', (req, res) => {
  const idx = tasks.findIndex(t => t.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  tasks[idx] = { ...tasks[idx], ...req.body };
  res.json(tasks[idx]);
});

router.delete('/:id', (req, res) => {
  tasks = tasks.filter(t => t.id !== parseInt(req.params.id));
  res.status(204).end();
});

app.use('/api/tasks', router);
app.listen(3000);`,
        hints: ['Use express.Router() for modular routes', 'Mount with app.use("/api/tasks", router)', 'DELETE returns 204 No Content'],
      },
    ],
    keyTakeaways: [
      'Express = thin wrapper over Node\'s http module — adds routing, middleware, response helpers',
      'Middleware runs in order — request → middleware chain → route handler → error handler',
      'Always separate app.js (setup) from server.js (listen) for testability',
      'async routes must use try/catch + next(err) or an asyncHandler wrapper',
      'Error handler must be last and have exactly 4 parameters: (err, req, res, next)',
    ],
    prevLesson: 'nodejs-http',
    nextLesson: 'rest-api-development',
  },

  // ─── MODULE 12: REST API Development ─────────────────────────────────────────
  {
    id: 'rest-api-development',
    slug: 'rest-api-development',
    title: 'REST API Development',
    description: 'Design and build production REST APIs with proper conventions, CRUD, validation, pagination, filtering, sorting, and versioning.',
    category: 'API Design',
    order: 12,
    difficulty: 'intermediate',
    estimatedTime: 35,
    content: `REST (Representational State Transfer) is not a protocol — it is an architectural style for designing web APIs. Understanding REST principles lets you design APIs that are intuitive, consistent, and maintainable.\n\n## REST Principles\n\n**1. Resources** — everything is a resource, identified by a URL\n- \`/users\` — collection of users\n- \`/users/42\` — specific user\n- \`/users/42/posts\` — posts belonging to user 42\n\n**2. HTTP methods = actions**\n- \`GET\` — read (safe, idempotent)\n- \`POST\` — create\n- \`PUT\` — replace completely (idempotent)\n- \`PATCH\` — partial update\n- \`DELETE\` — remove (idempotent)\n\n**3. Stateless** — every request contains all information needed. No server-side session.\n\n**4. Uniform interface** — consistent conventions across all resources\n\n## URL Design Conventions\n\n\`\`\`\n✅ Good REST URLs\nGET    /api/v1/users           — list users\nPOST   /api/v1/users           — create user\nGET    /api/v1/users/42        — get user 42\nPUT    /api/v1/users/42        — replace user 42\nPATCH  /api/v1/users/42        — partially update user 42\nDELETE /api/v1/users/42        — delete user 42\nGET    /api/v1/users/42/posts  — get posts by user 42\n\n❌ Bad REST URLs\nGET /getUsers\nPOST /createUser\nGET /users/getById?id=42\nDELETE /users/deleteUser/42\n\`\`\`\n\n**Rules:**\n- Use nouns, not verbs in URLs\n- Use plural nouns (users, not user)\n- Use hyphens for multi-word resources (/blog-posts)\n- Lowercase only\n\n## Response Format Conventions\n\n\`\`\`json\n// Success — list\n{\n  "data": [...],\n  "meta": { "page": 1, "limit": 20, "total": 150, "pages": 8 }\n}\n\n// Success — single item\n{ "data": { "id": 1, "name": "Alice" } }\n\n// Error\n{\n  "error": {\n    "code": "VALIDATION_ERROR",\n    "message": "Validation failed",\n    "details": [\n      { "field": "email", "message": "Must be a valid email" }\n    ]\n  }\n}\n\`\`\`\n\n## Pagination\n\n\`\`\`\n// Offset-based (simple, supports random page access)\nGET /api/users?page=3&limit=20\n→ OFFSET = (page - 1) * limit = 40\n→ LIMIT = 20\n\n// Cursor-based (efficient for large datasets, real-time data)\nGET /api/users?cursor=eyJpZCI6MTAwfQ==&limit=20\n→ WHERE id > 100 LIMIT 20\n→ Response includes: next_cursor, has_more\n\`\`\`\n\nUse offset pagination for admin panels. Use cursor pagination for infinite scroll feeds.\n\n## Filtering, Searching, Sorting\n\n\`\`\`\nGET /api/users?status=active&role=admin\nGET /api/users?search=alice&minAge=18&maxAge=30\nGET /api/posts?sort=createdAt&order=desc\nGET /api/posts?sort=-createdAt              // minus prefix = descending\nGET /api/users?fields=id,name,email          // field selection\n\`\`\`\n\n## API Versioning\n\nAlways version your API. Breaking changes should create a new version, not break existing clients.\n\nThree approaches:\n1. **URL versioning** (most common): \`/api/v1/users\`, \`/api/v2/users\`\n2. **Header versioning**: \`Accept: application/vnd.api.v2+json\`\n3. **Query param**: \`/api/users?version=2\`\n\nURL versioning is the most visible and easiest to implement.\n\n## Idempotency\n\n- **GET** — always safe and idempotent (calling it 100 times = same result)\n- **DELETE** — idempotent (deleting already-deleted resource = still 204)\n- **PUT** — idempotent (replacing with same data = same result)\n- **POST** — NOT idempotent (calling twice creates two resources)\n- **PATCH** — usually not idempotent\n\n## Content Negotiation\n\nClients tell the server what format they want:\n\`\`\`\nRequest: Accept: application/json\nResponse: Content-Type: application/json\n\nRequest: Accept: text/csv\nResponse: Content-Type: text/csv\n\`\`\``,
    codeExamples: [
      {
        title: 'Complete REST API with pagination, filtering, and sorting',
        code: `const express = require('express');
const router = express.Router();

// Simulate DB
const posts = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  title: \`Post \${i + 1}\`,
  status: i % 3 === 0 ? 'draft' : 'published',
  authorId: (i % 5) + 1,
  createdAt: new Date(Date.now() - i * 86400000).toISOString(),
  views: Math.floor(Math.random() * 1000),
}));

// GET /api/posts?status=published&authorId=2&sort=views&order=desc&page=1&limit=10
router.get('/', (req, res) => {
  let { status, authorId, search, sort = 'createdAt', order = 'desc',
        page = 1, limit = 20 } = req.query;

  page = Math.max(1, parseInt(page));
  limit = Math.min(100, Math.max(1, parseInt(limit)));

  // Filter
  let result = [...posts];
  if (status) result = result.filter(p => p.status === status);
  if (authorId) result = result.filter(p => p.authorId === parseInt(authorId));
  if (search) result = result.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  // Sort
  const validSortFields = ['createdAt', 'views', 'id'];
  if (validSortFields.includes(sort)) {
    result.sort((a, b) => {
      const dir = order === 'asc' ? 1 : -1;
      return a[sort] > b[sort] ? dir : -dir;
    });
  }

  const total = result.length;

  // Paginate
  const offset = (page - 1) * limit;
  const data = result.slice(offset, offset + limit);

  res.json({
    data,
    meta: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  });
});

module.exports = router;`,
        explanation: 'Always validate and sanitize query parameters. Cap the limit to prevent abuse (max 100). Use a whitelist for sort fields to prevent SQL injection in real databases.',
      },
      {
        title: 'Consistent error responses',
        code: `// errors/AppError.js
class AppError extends Error {
  constructor(message, statusCode, code = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code || this.getCode(statusCode);
    this.isOperational = true; // vs programming errors
  }

  getCode(status) {
    const codes = {
      400: 'BAD_REQUEST', 401: 'UNAUTHORIZED',
      403: 'FORBIDDEN', 404: 'NOT_FOUND',
      409: 'CONFLICT', 422: 'VALIDATION_ERROR',
      429: 'RATE_LIMITED', 500: 'INTERNAL_ERROR',
    };
    return codes[status] || 'ERROR';
  }
}

// Usage in route handlers
router.get('/:id', async (req, res, next) => {
  const user = await userService.findById(req.params.id);
  if (!user) return next(new AppError('User not found', 404));
  res.json({ data: user });
});

// Error handler produces consistent format
function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500;

  if (err.isOperational) {
    return res.status(status).json({
      error: {
        code: err.code,
        message: err.message,
      }
    });
  }

  // Programming error — do not leak details
  console.error('UNEXPECTED ERROR:', err);
  res.status(500).json({
    error: { code: 'INTERNAL_ERROR', message: 'Something went wrong' }
  });
}`,
        explanation: 'Separate operational errors (expected: 404, 400) from programming errors (bugs: null reference). Only log programming errors — operational ones are expected business logic.',
      },
    ],
    commonMistakes: [
      'Using verbs in URLs (/getUser, /createPost) — use HTTP methods for actions.',
      'Returning 200 for errors — use proper status codes (400, 404, 500).',
      'No pagination — returning all records kills the database and the client.',
      'Not validating query parameters — sort fields without whitelisting enable injection.',
      'Mixing singular and plural in URLs (/user vs /users) — pick plural and be consistent.',
    ],
    interviewQuestions: [
      {
        question: 'What are REST principles?',
        answer: 'REST is an architectural style: (1) Resources — everything is a URL-identified resource. (2) HTTP methods for actions — GET read, POST create, PUT/PATCH update, DELETE remove. (3) Stateless — no server-side session; every request is self-contained. (4) Uniform interface — consistent conventions. (5) Layered system — client does not know about caches/load balancers. Key REST constraint: statelessness enables horizontal scaling.',
        difficulty: 'intermediate',
      },
      {
        question: 'What is the difference between PUT and PATCH?',
        answer: 'PUT replaces the entire resource — if you send PUT with only {name: "Alice"}, all other fields (email, role, etc.) are removed or reset. PATCH partially updates — only the fields you send are changed. PUT is idempotent (same result if called multiple times with same data). PATCH is usually not idempotent. In practice, most APIs use PATCH for updates.',
        difficulty: 'intermediate',
      },
      {
        question: 'How do you implement pagination in a REST API?',
        answer: 'Two approaches: (1) Offset pagination: ?page=2&limit=20, computes OFFSET=(page-1)*limit. Simple, supports random page access. Gets slow on large datasets (high offset = full table scan). (2) Cursor pagination: ?cursor=<encoded_id>&limit=20, uses WHERE id > cursor. Efficient for large datasets, great for infinite scroll. Cannot jump to arbitrary pages. Use offset for admin tables, cursor for social feeds.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'ex-node-12',
        title: 'Add filtering and pagination to an existing API',
        description: 'Given an array of products, add query string support for filtering by category, min/max price, sorting, and pagination.',
        starterCode: `const express = require('express');
const router = express.Router();

const products = [
  { id: 1, name: 'Laptop', category: 'electronics', price: 999 },
  { id: 2, name: 'Phone', category: 'electronics', price: 699 },
  { id: 3, name: 'Desk', category: 'furniture', price: 299 },
  { id: 4, name: 'Chair', category: 'furniture', price: 199 },
  { id: 5, name: 'Monitor', category: 'electronics', price: 399 },
];

// Support: ?category=electronics&minPrice=300&maxPrice=1000&sort=price&order=asc&page=1&limit=3
router.get('/', (req, res) => {
  // TODO: implement filtering, sorting, pagination
  res.json({ data: products });
});`,
        solution: `router.get('/', (req, res) => {
  let { category, minPrice, maxPrice, sort = 'id', order = 'asc', page = 1, limit = 10 } = req.query;
  page = parseInt(page); limit = Math.min(50, parseInt(limit));

  let result = [...products];
  if (category) result = result.filter(p => p.category === category);
  if (minPrice) result = result.filter(p => p.price >= parseFloat(minPrice));
  if (maxPrice) result = result.filter(p => p.price <= parseFloat(maxPrice));

  if (['price', 'name', 'id'].includes(sort)) {
    result.sort((a, b) => order === 'asc' ? (a[sort] > b[sort] ? 1 : -1) : (a[sort] < b[sort] ? 1 : -1));
  }

  const total = result.length;
  const data = result.slice((page - 1) * limit, page * limit);
  res.json({ data, meta: { page, limit, total, pages: Math.ceil(total / limit) } });
});`,
        hints: ['Filter before sorting before paginating', 'Whitelist sort field names', 'Cap limit to prevent abuse'],
      },
    ],
    keyTakeaways: [
      'REST: resources as URLs, HTTP methods as actions, stateless',
      'URL design: plural nouns, no verbs, versioned (/api/v1/)',
      'Pagination: offset-based for admin, cursor-based for feeds',
      'Consistent error format with status codes and error codes',
      'Whitelist sort/filter fields — never pass user input directly to database queries',
    ],
    prevLesson: 'express-framework',
    nextLesson: 'nodejs-auth',
  },

  // ─── MODULE 13: Authentication and Authorization ──────────────────────────────
  {
    id: 'nodejs-auth',
    slug: 'nodejs-auth',
    title: 'Authentication and Authorization',
    description: 'Implement JWT, refresh tokens, sessions, OAuth, role-based access control, and security best practices.',
    category: 'Security',
    order: 13,
    difficulty: 'advanced',
    estimatedTime: 50,
    content: `Authentication answers "Who are you?" Authorization answers "What can you do?"\n\nMost security vulnerabilities in Node.js APIs come from improperly implemented auth. This module covers the right patterns.\n\n## Sessions vs JWT\n\n**Sessions:**\n- Server stores session data (in memory or Redis)\n- Client gets a session ID cookie\n- Server looks up the session on every request\n- State is on the server\n- Easy to invalidate (delete the session)\n- Requires sticky sessions or shared storage in distributed systems\n\n**JWT (JSON Web Token):**\n- Server issues a signed token\n- Client sends token on every request (Authorization header)\n- Server verifies the signature — no DB lookup needed\n- State is in the token (stateless)\n- Hard to invalidate before expiry (need a blocklist)\n- Scales naturally — any server can verify\n\n**When to use each:**\n- Sessions: traditional web apps, when you need instant logout, when you have a single server\n- JWT: APIs, mobile apps, microservices, when statelessness matters\n\n## JWT Deep Dive\n\nA JWT has three base64-encoded parts separated by dots:\n\`\`\`\nheader.payload.signature\n\nyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0IiwiZXhwIjoxNzM2MDAwfQ.abc123xyz\n\`\`\`\n\n**Header:** Algorithm and token type\n\`\`\`json\n{ "alg": "HS256", "typ": "JWT" }\n\`\`\`\n\n**Payload (Claims):**\n\`\`\`json\n{\n  "sub": "user-42",       // subject (user ID)\n  "email": "alice@example.com",\n  "role": "admin",\n  "iat": 1700000000,      // issued at (unix timestamp)\n  "exp": 1700003600       // expires at (1 hour from iat)\n}\n\`\`\`\n\n**Signature:** HMAC-SHA256(base64(header) + "." + base64(payload), secret)\n\n**JWT is NOT encryption.** The payload is readable by anyone. Never put passwords, credit cards, or sensitive data in a JWT. It is only signed — tampering is detectable, not prevented.\n\n## Refresh Token Pattern\n\nJWTs should expire quickly (15min–1hr). But users should not have to log in every hour.\n\nSolution: **two tokens**\n- **Access token**: short-lived (15min), used for API calls\n- **Refresh token**: long-lived (7 days), stored in httpOnly cookie, used only to get new access tokens\n\n\`\`\`\nLogin → access_token (15min) + refresh_token (7 days in httpOnly cookie)\n     ↓\nAPI calls → Authorization: Bearer <access_token>\n     ↓\nAccess token expires → POST /auth/refresh (sends refresh_token cookie)\n     ↓\nServer validates refresh token → issues new access_token\n\`\`\`\n\nRefresh tokens should be stored in the database. On logout, delete the refresh token — future refresh attempts fail.\n\n## Password Hashing\n\nNever store plain text passwords. Use bcrypt:\n\n\`\`\`js\nconst bcrypt = require('bcrypt');\n\n// Hash on registration (cost factor 12 = ~250ms — deliberate)\nconst hash = await bcrypt.hash(password, 12);\n\n// Verify on login\nconst isValid = await bcrypt.compare(password, hash);\n\`\`\`\n\nWhy bcrypt: it is intentionally slow (cost factor), uses a random salt (prevents rainbow tables), and resists GPU attacks better than SHA.\n\n## Role-Based Access Control (RBAC)\n\n\`\`\`\nRoles: admin, moderator, user\n\nPermissions:\n- admin: read:any, write:any, delete:any\n- moderator: read:any, write:own, delete:own\n- user: read:own, write:own\n\`\`\`\n\n## OAuth — "Login with Google/GitHub"\n\nOAuth 2.0 lets users authenticate with a trusted provider (Google, GitHub, Auth0) instead of creating a new password with you.\n\nFlow:\n1. User clicks "Login with Google"\n2. Redirect to Google OAuth consent screen\n3. User approves\n4. Google redirects back with an authorization code\n5. Your server exchanges code for access token\n6. Get user profile from Google\n7. Create or find user in your database\n8. Issue your own JWT\n\nUse \`passport.js\` or \`Auth0\` to implement OAuth — do not implement it from scratch.\n\n## Security Best Practices\n\n- Rate limit login attempts (prevent brute force)\n- Lock accounts after N failed attempts\n- Store refresh tokens in httpOnly, Secure, SameSite=Strict cookies\n- Never log passwords — even in error logs\n- Use HTTPS everywhere\n- Rotate JWT secrets periodically\n- Keep access token expiry short (15 minutes)\n- Implement CSRF protection for cookie-based auth`,
    codeExamples: [
      {
        title: 'Complete JWT auth implementation',
        code: `const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

// In production, use a real database
const users = new Map();
const refreshTokens = new Set(); // store in database

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

function generateTokens(user) {
  const payload = { sub: user.id, email: user.email, role: user.role };

  const accessToken = jwt.sign(payload, ACCESS_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });

  return { accessToken, refreshToken };
}

// POST /auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    if (users.has(email)) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = { id: Date.now().toString(), email, name, passwordHash, role: 'user' };
    users.set(email, user);

    const { accessToken, refreshToken } = generateTokens(user);
    refreshTokens.add(refreshToken);

    res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .status(201)
      .json({ accessToken, user: { id: user.id, email: user.email, name: user.name } });
  } catch (err) {
    next(err);
  }
});

// POST /auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = users.get(email);

    // Use bcrypt.compare even if user not found (timing attack prevention)
    const dummyHash = '$2b$12$invalidhash';
    const isValid = await bcrypt.compare(password, user?.passwordHash || dummyHash);

    if (!user || !isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const { accessToken, refreshToken } = generateTokens(user);
    refreshTokens.add(refreshToken);

    res
      .cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 604800000 })
      .json({ accessToken });
  } catch (err) {
    next(err);
  }
});

// POST /auth/refresh
router.post('/refresh', (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token || !refreshTokens.has(token)) {
    return res.status(401).json({ error: 'Invalid refresh token' });
  }

  try {
    const decoded = jwt.verify(token, REFRESH_SECRET);
    const accessToken = jwt.sign(
      { sub: decoded.sub, email: decoded.email, role: decoded.role },
      ACCESS_SECRET,
      { expiresIn: '15m' }
    );
    res.json({ accessToken });
  } catch {
    refreshTokens.delete(token);
    res.status(401).json({ error: 'Refresh token expired' });
  }
});

// POST /auth/logout
router.post('/logout', (req, res) => {
  const token = req.cookies.refreshToken;
  refreshTokens.delete(token);
  res.clearCookie('refreshToken').json({ message: 'Logged out' });
});

module.exports = router;`,
        explanation: 'Access token in response body (memory), refresh token in httpOnly cookie (no JS access). Timing-safe login check prevents knowing which field was wrong.',
      },
      {
        title: 'Authentication middleware + Role-Based Access Control',
        code: `const jwt = require('jsonwebtoken');

// Authentication — verify JWT
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const token = authHeader.slice(7);

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded; // { sub, email, role, iat, exp }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired', code: 'TOKEN_EXPIRED' });
    }
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Authorization — check role
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}

// Permission check — resource ownership
function requireOwnership(getOwnerId) {
  return async (req, res, next) => {
    const ownerId = await getOwnerId(req);
    if (req.user.role === 'admin') return next(); // admins bypass
    if (req.user.sub !== ownerId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  };
}

// Usage
const router = require('express').Router();

router.get('/admin/users', authenticate, authorize('admin'), getAllUsers);

router.delete('/posts/:id',
  authenticate,
  requireOwnership(async (req) => {
    const post = await Post.findById(req.params.id);
    return post?.authorId;
  }),
  deletePost
);`,
        explanation: 'Return "TOKEN_EXPIRED" code in the response so clients know to refresh, not to logout. requireOwnership is reusable across any resource type.',
      },
    ],
    commonMistakes: [
      'Storing sensitive data (passwords, credit cards) in JWT payload — payload is just base64, not encrypted.',
      'Using the same secret for access and refresh tokens — a leaked refresh secret invalidates all access tokens too.',
      'Not comparing passwords in constant time — use bcrypt.compare, never ===.',
      'Long-lived access tokens (days/weeks) — they cannot be invalidated. Keep them short (15 minutes).',
      'Storing refresh tokens in localStorage — accessible to JavaScript, vulnerable to XSS. Use httpOnly cookies.',
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between authentication and authorization?',
        answer: 'Authentication verifies identity — "Who are you?" (login, verifying JWT). Authorization determines permissions — "What can you do?" (checking if user has admin role, if they own the resource). Authentication always comes before authorization. A user can be authenticated but not authorized (logged in but no permission to delete).',
        difficulty: 'beginner',
      },
      {
        question: 'How does JWT work and what are its security concerns?',
        answer: 'A JWT has three parts: header (algorithm), payload (claims — user ID, role, expiry), and signature (HMAC of header+payload with a secret). Anyone can read the payload — it is base64, not encrypted. The signature proves it was not tampered with. Security concerns: (1) short expiry — cannot revoke tokens early without a blocklist; (2) secret leakage — anyone with the secret can forge tokens; (3) sensitive data in payload — do not put passwords or PII.',
        difficulty: 'intermediate',
      },
      {
        question: 'Why do refresh tokens need to be stored in httpOnly cookies?',
        answer: 'httpOnly cookies are inaccessible to JavaScript — only the browser sends them in HTTP requests. This prevents XSS attacks from stealing the refresh token (localStorage is accessible to any JS on the page). Secure flag ensures they are only sent over HTTPS. SameSite=Strict prevents CSRF. Access tokens (short-lived) can live in memory; refresh tokens (long-lived) must be in httpOnly cookies.',
        difficulty: 'advanced',
      },
    ],
    exercises: [
      {
        id: 'ex-node-13',
        title: 'Build an authentication middleware',
        description: 'Create a JWT authentication middleware that verifies the Bearer token and attaches the decoded user to req.user.',
        starterCode: `const jwt = require('jsonwebtoken');

// Middleware: authenticate
// - Read Authorization header
// - Extract Bearer token
// - Verify with JWT_SECRET
// - Attach decoded payload to req.user
// - Return 401 if missing, invalid, or expired

function authenticate(req, res, next) {
  // TODO
}

module.exports = authenticate;`,
        solution: `const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token' });
  }
  try {
    req.user = jwt.verify(auth.slice(7), process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ error: err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token' });
  }
}

module.exports = authenticate;`,
        hints: ['auth.slice(7) removes "Bearer "', 'jwt.verify throws on invalid/expired token', 'Attach decoded payload: req.user = decoded'],
      },
    ],
    keyTakeaways: [
      'JWT: stateless, scalable — cannot revoke easily. Sessions: stateful, easy logout.',
      'Access token: short-lived (15min), in memory. Refresh token: long-lived (7d), httpOnly cookie.',
      'Never store sensitive data in JWT — payload is base64, not encrypted.',
      'Use bcrypt for passwords — it is intentionally slow and salted.',
      'Authentication: who are you? Authorization: what can you do?',
    ],
    prevLesson: 'rest-api-development',
    nextLesson: 'nodejs-database-integration',
  },

  // ─── MODULE 14: Database Integration ─────────────────────────────────────────
  {
    id: 'nodejs-database-integration',
    slug: 'nodejs-database-integration',
    title: 'Database Integration — Prisma, Drizzle, Mongoose',
    description: 'Connect Node.js to PostgreSQL and MongoDB, manage connections, use ORMs, and handle transactions. References the Database track.',
    category: 'Databases',
    order: 14,
    difficulty: 'intermediate',
    estimatedTime: 40,
    content: `This module assumes you have completed the Database track. We focus only on the Node.js integration layer — not SQL or MongoDB basics.\n\n## Connection Management — The Critical Concept\n\nDatabase connections are expensive to create. Creating a new connection per request would be slow and exhaust the database connection limit.\n\nSolution: **Connection pooling** — create a pool of connections at startup, reuse them across requests.\n\n\`\`\`\nStartup: Create pool of 10 connections\n\nRequest 1 → gets connection from pool → query → returns connection\nRequest 2 → gets connection from pool → query → returns connection\n(both run concurrently using different connections from pool)\n\nIf all 10 are in use → new requests wait in queue\n\`\`\`\n\nORM libraries (Prisma, Drizzle) manage the pool for you. Raw pg/mongoose need configuration.\n\n## Prisma — Type-Safe ORM\n\nPrisma is the most popular ORM for Node.js with TypeScript. It generates a typed client from your schema.\n\n\`\`\`bash\nnpm install prisma @prisma/client\nnpx prisma init\n\`\`\`\n\n**Schema (prisma/schema.prisma):**\n\`\`\`prisma\ngenerator client {\n  provider = "prisma-client-js"\n}\n\ndatasource db {\n  provider = "postgresql"\n  url      = env("DATABASE_URL")\n}\n\nmodel User {\n  id        Int      @id @default(autoincrement())\n  email     String   @unique\n  name      String\n  posts     Post[]\n  createdAt DateTime @default(now())\n}\n\nmodel Post {\n  id       Int    @id @default(autoincrement())\n  title    String\n  author   User   @relation(fields: [authorId], references: [id])\n  authorId Int\n}\n\`\`\`\n\n\`\`\`bash\nnpx prisma migrate dev --name init  # create migration\nnpx prisma generate                  # generate client\n\`\`\`\n\n## Drizzle — Lightweight SQL-First ORM\n\nDrizzle is a newer, lighter alternative to Prisma. It writes SQL, not abstracted query builders — you stay close to the database.\n\n## Mongoose — MongoDB ODM\n\nMongoose adds schema validation and a model layer on top of the MongoDB driver.\n\n\`\`\`bash\nnpm install mongoose\n\`\`\`\n\n## Singleton Pattern for Database Clients\n\nAlways create the DB client once and reuse it — module caching handles this naturally:\n\n\`\`\`js\n// db/prisma.js\nconst { PrismaClient } = require('@prisma/client');\n\nconst prisma = new PrismaClient({\n  log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],\n});\n\nmodule.exports = prisma;\n\n// Anywhere else:\nconst prisma = require('../db/prisma');\nconst users = await prisma.user.findMany();\n\`\`\`\n\n## Transactions\n\nTransactions ensure multiple operations either all succeed or all fail:\n\n\`\`\`js\n// Prisma interactive transaction\nconst result = await prisma.$transaction(async (tx) => {\n  const order = await tx.order.create({ data: orderData });\n  await tx.inventory.update({\n    where: { id: orderData.productId },\n    data: { quantity: { decrement: orderData.quantity } },\n  });\n  await tx.payment.create({ data: { orderId: order.id, amount: orderData.total } });\n  return order;\n});\n// If any step fails, ALL are rolled back automatically\n\`\`\`\n\n## When to Use Each\n\n| ORM | Use When |\n|-----|----------|\n| **Prisma** | TypeScript projects, complex relations, need auto-generated types |\n| **Drizzle** | Performance-critical, SQL control, lightweight, TypeScript |\n| **Mongoose** | MongoDB, schema validation, familiar ActiveRecord-style |\n| **Raw pg/mysql2** | Maximum control, complex queries ORMs cannot express |\n\n## N+1 Query Problem\n\nThe most common database performance bug in Node.js:\n\n\`\`\`js\n// ❌ N+1 — 1 query for users + N queries for each user's posts\nconst users = await prisma.user.findMany();\nfor (const user of users) {\n  user.posts = await prisma.post.findMany({ where: { authorId: user.id } });\n  // 1 user query + 100 post queries = 101 queries total\n}\n\n// ✅ Single query with include\nconst users = await prisma.user.findMany({\n  include: { posts: true }, // JOIN — 1 query total\n});\n\`\`\``,
    codeExamples: [
      {
        title: 'Prisma CRUD operations — the patterns you use daily',
        code: `const prisma = require('../db/prisma');

// CREATE
const user = await prisma.user.create({
  data: { email: 'alice@example.com', name: 'Alice' },
  select: { id: true, email: true, name: true }, // only return these fields
});

// READ — single
const user = await prisma.user.findUnique({
  where: { email: 'alice@example.com' },
  include: { posts: { orderBy: { createdAt: 'desc' }, take: 5 } },
});

// READ — list with pagination
const users = await prisma.user.findMany({
  where: { role: 'admin', createdAt: { gte: new Date('2024-01-01') } },
  orderBy: { name: 'asc' },
  skip: (page - 1) * limit,
  take: limit,
});

const total = await prisma.user.count({ where: { role: 'admin' } });

// UPDATE
const updated = await prisma.user.update({
  where: { id: userId },
  data: { name: 'Alice Smith', updatedAt: new Date() },
});

// UPSERT — create or update
const upserted = await prisma.user.upsert({
  where: { email: 'alice@example.com' },
  update: { name: 'Alice' },
  create: { email: 'alice@example.com', name: 'Alice' },
});

// DELETE
await prisma.user.delete({ where: { id: userId } });

// BATCH operations
const [users, total] = await prisma.$transaction([
  prisma.user.findMany({ skip: 0, take: 20 }),
  prisma.user.count(),
]);`,
        explanation: 'Prisma operations return typed results. select limits returned fields (performance). include joins related data. $transaction([]) is a batch — more efficient than sequential awaits.',
      },
      {
        title: 'Mongoose — MongoDB schema and models',
        code: `const mongoose = require('mongoose');

// Connect (singleton — call once at startup)
mongoose.connect(process.env.MONGODB_URI);

// Schema with validation
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  name: { type: String, required: true, trim: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  passwordHash: { type: String, select: false }, // never returned by default
}, {
  timestamps: true, // adds createdAt, updatedAt automatically
  toJSON: { virtuals: true },
});

// Virtual field (not stored in DB)
userSchema.virtual('displayName').get(function() {
  return \`\${this.name} <\${this.email}>\`;
});

// Instance method
userSchema.methods.toPublicJSON = function() {
  return { id: this._id, name: this.name, email: this.email };
};

// Static method
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email });
};

const User = mongoose.model('User', userSchema);

// CRUD
const user = await User.create({ email: 'alice@example.com', name: 'Alice' });
const users = await User.find({ role: 'admin' }).sort('-createdAt').limit(20);
const found = await User.findById(id).select('+passwordHash'); // include hidden field
await User.findByIdAndUpdate(id, { name: 'Updated' }, { new: true }); // return updated doc
await User.findByIdAndDelete(id);`,
        explanation: 'select: false hides passwordHash by default. Use .select("+passwordHash") only when you need it (login). timestamps: true adds createdAt/updatedAt automatically.',
      },
    ],
    commonMistakes: [
      'Creating a new database client per request — use a singleton, connection pool is managed once.',
      'N+1 queries — always check how many queries your ORM generates in development mode.',
      'Not using transactions for related writes — partial failures leave data inconsistent.',
      'Not indexing query fields — queries on un-indexed columns do full table scans.',
      'Returning sensitive fields (passwordHash) in API responses — use select to exclude them.',
    ],
    interviewQuestions: [
      {
        question: 'What is connection pooling and why is it important?',
        answer: 'Connection pooling pre-creates a set of database connections and reuses them across requests. Opening a new connection per request is expensive (100ms+) and databases have connection limits. A pool of 10 connections can serve thousands of concurrent requests because most queries complete in milliseconds. ORMs like Prisma manage pooling automatically. Configure pool size based on expected concurrency and database limits.',
        difficulty: 'intermediate',
      },
      {
        question: 'What is the N+1 query problem and how do you solve it?',
        answer: 'N+1 happens when you fetch a list of N items, then make one additional query per item to get related data — total: N+1 queries. Example: fetch 100 users, then fetch posts for each = 101 queries. Solution: use JOINs (Prisma include, Mongoose populate) to get everything in one query. Use the ORM\'s query logging in development to detect N+1 issues.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'ex-node-14',
        title: 'Build a service layer with Prisma',
        description: 'Create a PostService that wraps Prisma with methods: findAll(page, limit), findById(id), create(data), update(id, data), delete(id).',
        starterCode: `const prisma = require('../db/prisma');

class PostService {
  async findAll(page = 1, limit = 20) {
    // Return { data, total, pages }
  }
  async findById(id) { }
  async create(data) { }
  async update(id, data) { }
  async delete(id) { }
}

module.exports = new PostService();`,
        solution: `const prisma = require('../db/prisma');

class PostService {
  async findAll(page = 1, limit = 20) {
    const [data, total] = await prisma.$transaction([
      prisma.post.findMany({ skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' } }),
      prisma.post.count(),
    ]);
    return { data, total, pages: Math.ceil(total / limit) };
  }
  async findById(id) {
    return prisma.post.findUnique({ where: { id: parseInt(id) }, include: { author: true } });
  }
  async create(data) { return prisma.post.create({ data }); }
  async update(id, data) { return prisma.post.update({ where: { id: parseInt(id) }, data }); }
  async delete(id) { return prisma.post.delete({ where: { id: parseInt(id) } }); }
}

module.exports = new PostService();`,
        hints: ['Use $transaction([]) for parallel count + findMany', 'parseInt for ID from URL params', 'include: { author: true } for related data'],
      },
    ],
    keyTakeaways: [
      'Create DB client once (singleton) — pooling is managed per instance',
      'N+1 problem: use include/populate/JOIN instead of looping queries',
      'Transactions: all or nothing — use for related multi-step writes',
      'Prisma: TypeScript-first, great DX. Drizzle: SQL-close, lightweight. Mongoose: MongoDB schema.',
      'Never return sensitive fields (passwordHash) — use select to exclude them',
    ],
    prevLesson: 'nodejs-auth',
    nextLesson: 'nodejs-validation',
  },

  // ─── MODULE 15: Validation ────────────────────────────────────────────────────
  {
    id: 'nodejs-validation',
    slug: 'nodejs-validation',
    title: 'Validation — Zod and Joi',
    description: 'Validate and parse request data with Zod and Joi. Learn schema-based validation, custom validators, and best practices.',
    category: 'API Design',
    order: 15,
    difficulty: 'intermediate',
    estimatedTime: 25,
    content: `Never trust data from the client. Every piece of input — body, query params, URL params, headers — must be validated before use.\n\n## Why Schema Validation Libraries\n\nManual validation is tedious and error-prone:\n\`\`\`js\n// ❌ Manual validation — misses edge cases, verbose\nif (!body.email || typeof body.email !== 'string' || !body.email.includes('@')) {\n  return res.status(400).json({ error: 'Invalid email' });\n}\n\`\`\`\n\nSchema validation libraries provide declarative, composable schemas that validate AND transform input.\n\n## Zod — TypeScript-First Validation\n\nZod is the modern choice. It generates TypeScript types from schemas — one source of truth for both validation and types.\n\n\`\`\`bash\nnpm install zod\n\`\`\`\n\n## Joi — Battle-Tested\n\nJoi has been around longer and has a massive ecosystem. Works in plain JavaScript without TypeScript.\n\n\`\`\`bash\nnpm install joi\n\`\`\`\n\n## Zod vs Joi\n\n| Feature | Zod | Joi |\n|---------|-----|-----|\n| TypeScript types | Auto-generated | Manual |\n| Bundle size | Smaller | Larger |\n| Syntax | TypeScript-like | DSL |\n| Popularity | Growing fast | Established |\n| Runtime | Works everywhere | Works everywhere |\n\nFor TypeScript projects: use Zod. For JavaScript projects: either works, Joi has more plugins.\n\n## Validation Middleware Pattern\n\n\`\`\`js\n// Reusable middleware that validates against a schema\nfunction validate(schema, target = 'body') {\n  return (req, res, next) => {\n    const result = schema.safeParse(req[target]);\n    if (!result.success) {\n      return res.status(422).json({\n        error: 'Validation failed',\n        details: result.error.errors.map(e => ({\n          field: e.path.join('.'),\n          message: e.message,\n        }))\n      });\n    }\n    req[target] = result.data; // replace with parsed/coerced data\n    next();\n  };\n}\n\`\`\`\n\n## What to Validate\n\n- **req.body** — request payload (JSON, form data)\n- **req.params** — URL parameters (:id)\n- **req.query** — query string parameters\n- **req.headers** — custom headers (but not standard ones)\n\n## Zod Coercion\n\nURL params and query strings are always strings. Zod can coerce them:\n\n\`\`\`js\nconst schema = z.object({\n  id: z.coerce.number().int().positive(), // "42" → 42\n  page: z.coerce.number().int().default(1),\n  active: z.coerce.boolean(), // "true" → true\n});\n\`\`\``,
    codeExamples: [
      {
        title: 'Zod — comprehensive schema examples',
        code: `const { z } = require('zod');

// Basic schemas
const UserCreateSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  email: z.string().email().toLowerCase(),
  password: z.string().min(8).max(72),
  age: z.number().int().min(13).max(120).optional(),
  role: z.enum(['user', 'admin']).default('user'),
  tags: z.array(z.string()).max(10).default([]),
  website: z.string().url().optional(),
  bio: z.string().max(500).nullable().default(null),
});

// Infer TypeScript type from schema (TypeScript only)
// type UserCreate = z.infer<typeof UserCreateSchema>;

// Nested schema
const AddressSchema = z.object({
  street: z.string(),
  city: z.string(),
  country: z.string().length(2), // ISO country code
  zip: z.string().regex(/^\\d{5}(-\\d{4})?$/).optional(),
});

// Refinement — custom validation
const PasswordResetSchema = z.object({
  password: z.string().min(8),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Usage
const result = UserCreateSchema.safeParse(req.body);
if (!result.success) {
  const errors = result.error.errors.map(e => ({
    field: e.path.join('.'),
    message: e.message,
  }));
  return res.status(422).json({ errors });
}
const validData = result.data; // typed, transformed, safe to use

// Params schema (coerce string to number)
const ParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

// Query schema with pagination
const QuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().optional(),
  sort: z.enum(['name', 'createdAt', 'email']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});`,
        explanation: 'z.coerce converts strings from query/params to the right type. .safeParse() never throws — always check result.success. result.data is the parsed, transformed, safe value.',
      },
      {
        title: 'Validation middleware — reusable pattern',
        code: `const { z } = require('zod');

// Generic validate middleware
function validate(schema, source = 'body') {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      return res.status(422).json({
        error: 'Validation failed',
        details: result.error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message,
          code: e.code,
        })),
      });
    }
    req[source] = result.data; // overwrite with parsed data
    next();
  };
}

// Schemas
const CreatePostSchema = z.object({
  title: z.string().min(3).max(200).trim(),
  content: z.string().min(10),
  published: z.boolean().default(false),
  tags: z.array(z.string().toLowerCase()).max(5).default([]),
});

const PostParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

// Apply in routes
const router = require('express').Router();

router.post('/',
  validate(CreatePostSchema),        // validate body
  async (req, res) => {
    const post = await postService.create(req.body); // body is now validated
    res.status(201).json(post);
  }
);

router.get('/:id',
  validate(PostParamsSchema, 'params'), // validate params
  async (req, res) => {
    const post = await postService.findById(req.params.id); // id is number
    res.json(post);
  }
);`,
        explanation: 'The validate middleware is reusable — pass any Zod schema and which req property to validate. After validation, req.body/params/query contains parsed, coerced, safe data.',
      },
    ],
    commonMistakes: [
      'Using parse() instead of safeParse() — parse() throws on failure, crashing the request without proper error format.',
      'Validating but not using the parsed result — result.data has transformed values (trimmed, lowercased, coerced).',
      'Only validating body, not params and query — URL params and query strings are always strings, must be coerced.',
      'Not including validation in middleware — scattered manual checks across route handlers are hard to maintain.',
    ],
    interviewQuestions: [
      {
        question: 'Why use a schema validation library instead of manual validation?',
        answer: 'Schema libraries (Zod, Joi) provide: (1) Declarative schemas — easier to read and maintain than chains of if statements. (2) Coercion — automatically convert string query params to numbers/booleans. (3) Transformation — trim whitespace, lowercase emails, set defaults. (4) Consistent error format — structured errors with field paths and messages. (5) TypeScript types — Zod generates TypeScript types from schemas, eliminating duplication.',
        difficulty: 'intermediate',
      },
      {
        question: 'What is the difference between z.parse() and z.safeParse()?',
        answer: 'z.parse() throws a ZodError if validation fails — you must catch it. z.safeParse() never throws — it returns { success: true, data } on success or { success: false, error } on failure. Use safeParse() in request handlers so validation failures return a 422 response instead of an unhandled exception. Use parse() in scripts where throwing on invalid data is acceptable.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'ex-node-15',
        title: 'Create validation schemas for a user registration API',
        description: 'Write Zod schemas for: POST /register body (name, email, password, age optional), GET /users query (page, limit, role filter), GET /users/:id params.',
        starterCode: `const { z } = require('zod');

// 1. Registration schema
const RegisterSchema = z.object({
  // name: required, 2-50 chars, trimmed
  // email: required, valid email, lowercased
  // password: required, min 8 chars
  // age: optional, integer 13-120
});

// 2. Query schema for listing users
const ListQuerySchema = z.object({
  // page: default 1, positive integer
  // limit: default 20, max 100
  // role: optional, 'user' | 'admin'
});

// 3. Params schema
const IdParamSchema = z.object({
  // id: coerce string to positive integer
});`,
        solution: `const { z } = require('zod');

const RegisterSchema = z.object({
  name: z.string().trim().min(2).max(50),
  email: z.string().email().toLowerCase(),
  password: z.string().min(8),
  age: z.number().int().min(13).max(120).optional(),
});

const ListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  role: z.enum(['user', 'admin']).optional(),
});

const IdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});`,
        hints: ['z.coerce.number() converts string "42" to number 42', '.toLowerCase() transforms email after validation', '.default() sets value when field is missing'],
      },
    ],
    keyTakeaways: [
      'Validate ALL input: body, params, query, headers — never trust the client',
      'Use safeParse() — returns result object, never throws',
      'result.data contains parsed, coerced, transformed, safe data — always use this',
      'Zod: TypeScript types auto-generated. Joi: battle-tested, good for JS projects',
      'z.coerce converts URL params/query strings (always strings) to the right types',
    ],
    prevLesson: 'nodejs-database-integration',
    nextLesson: 'nodejs-file-uploads',
  },

  // ─── MODULE 16: File Uploads ──────────────────────────────────────────────────
  {
    id: 'nodejs-file-uploads',
    slug: 'nodejs-file-uploads',
    title: 'File Uploads — Multipart, Local, and Cloud Storage',
    description: 'Handle file uploads with multer, stream to cloud storage, validate file types, and implement secure upload flows.',
    category: 'API Design',
    order: 16,
    difficulty: 'intermediate',
    estimatedTime: 30,
    content: `File uploads work differently from JSON APIs. The client sends data as \`multipart/form-data\` — a special encoding that allows binary file data alongside text fields.\n\n## How Multipart Uploads Work\n\n\`\`\`\nPOST /upload\nContent-Type: multipart/form-data; boundary=----WebKitFormBoundary\n\n------WebKitFormBoundary\nContent-Disposition: form-data; name="title"\n\nMy Photo\n------WebKitFormBoundary\nContent-Disposition: form-data; name="file"; filename="photo.jpg"\nContent-Type: image/jpeg\n\n<binary JPEG data here>\n------WebKitFormBoundary--\n\`\`\`\n\nExpress does not parse multipart by default. Use multer.\n\n## Multer — File Upload Middleware\n\n\`\`\`bash\nnpm install multer\n\`\`\`\n\n## Storage Strategies\n\n**1. Memory storage** — file goes into a Buffer in RAM\n- Fast, no disk I/O\n- Dangerous for large files — can exhaust server memory\n- Good for small files you process and discard (avatar resize, validation)\n\n**2. Disk storage** — file saved to server disk\n- Simple, reliable\n- Does not work well in horizontally scaled environments (each server has different files)\n- OK for single-server or when using shared network storage\n\n**3. Cloud storage** — stream directly to S3/GCS/Cloudinary\n- Scalable, durable, CDN-accessible\n- Best practice for production\n\n## Security Considerations\n\n- **Validate file type by MIME type AND magic bytes** — extension alone is not reliable\n- **Limit file size** — prevent DoS via large upload attacks\n- **Rename uploaded files** — never use the original filename (path traversal attacks)\n- **Scan for malware** — for user-facing storage in enterprise apps\n- **Restrict allowed types** — whitelist, not blacklist\n- **Store outside web root** — files should not be directly executable via URL`,
    codeExamples: [
      {
        title: 'File upload with multer — disk and memory storage',
        code: `const express = require('express');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs/promises');

// Disk storage configuration
const diskStorage = multer.diskStorage({
  destination: async (req, file, callback) => {
    const dir = path.join(process.cwd(), 'uploads', req.user?.id || 'anonymous');
    await fs.mkdir(dir, { recursive: true });
    callback(null, dir);
  },
  filename: (req, file, callback) => {
    // Never use original filename — rename to random hash
    const ext = path.extname(file.originalname).toLowerCase();
    const randomName = crypto.randomBytes(16).toString('hex');
    callback(null, \`\${randomName}\${ext}\`);
  },
});

// File filter — validate type
function fileFilter(req, file, callback) {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    callback(null, true); // accept
  } else {
    callback(new Error(\`File type \${file.mimetype} not allowed\`), false); // reject
  }
}

const upload = multer({
  storage: diskStorage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 5,                   // max 5 files per request
  },
});

const router = express.Router();

// Single file upload
router.post('/avatar',
  upload.single('avatar'), // "avatar" is the form field name
  async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    // req.file contains:
    // fieldname, originalname, encoding, mimetype,
    // destination, filename, path, size

    const fileUrl = \`/uploads/\${req.file.filename}\`;
    res.json({ url: fileUrl, size: req.file.size });
  }
);

// Multiple files
router.post('/gallery',
  upload.array('photos', 10), // max 10 photos
  async (req, res) => {
    const files = req.files.map(f => ({
      url: \`/uploads/\${f.filename}\`,
      size: f.size,
    }));
    res.json({ files });
  }
);

// Handle multer errors
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large (max 5MB)' });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ error: 'Too many files' });
    }
  }
  next(err);
});`,
        explanation: 'Always rename uploaded files to random hashes — original filenames can contain path traversal characters. Validate by mimetype, not extension — extensions are trivially faked.',
      },
      {
        title: 'Stream uploads directly to AWS S3',
        code: `const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const crypto = require('crypto');
const path = require('path');

const s3 = new S3Client({ region: process.env.AWS_REGION });

// Memory storage — keep file in buffer for S3 upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    cb(allowed.includes(file.mimetype) ? null : new Error('Invalid type'), allowed.includes(file.mimetype));
  },
});

async function uploadToS3(file, folder = 'uploads') {
  const key = \`\${folder}/\${crypto.randomBytes(16).toString('hex')}\${path.extname(file.originalname)}\`;

  await s3.send(new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    CacheControl: 'public, max-age=31536000', // cache for 1 year
  }));

  return \`https://\${process.env.AWS_S3_BUCKET}.s3.\${process.env.AWS_REGION}.amazonaws.com/\${key}\`;
}

const router = require('express').Router();

router.post('/upload',
  upload.single('file'),
  async (req, res, next) => {
    try {
      if (!req.file) return res.status(400).json({ error: 'No file' });
      const url = await uploadToS3(req.file, 'user-uploads');
      res.json({ url, size: req.file.size, type: req.file.mimetype });
    } catch (err) {
      next(err);
    }
  }
);`,
        explanation: 'For S3, use memoryStorage — the file buffer goes straight to S3 without touching disk. No files accumulate on the server.',
      },
    ],
    commonMistakes: [
      'Using the original filename for storage — path traversal attacks: ../../../../etc/passwd.',
      'Validating only by file extension — MIME type can be spoofed too; for critical security, check magic bytes.',
      'Not limiting file size — a 2GB upload will exhaust server memory or disk.',
      'Storing uploads in memory for large files — use disk storage or stream to cloud.',
      'Serving uploaded files from the same Express server — use a CDN or separate static server.',
    ],
    interviewQuestions: [
      {
        question: 'How do file uploads work in Node.js and what is multipart/form-data?',
        answer: 'multipart/form-data is an HTTP encoding for mixed content — text fields and binary file data together. The body is split into parts by a boundary string. Express cannot parse this by default. Multer middleware handles the multipart parsing, extracts files, and puts them in req.file (single) or req.files (multiple).',
        difficulty: 'intermediate',
      },
      {
        question: 'What are the security considerations for file uploads?',
        answer: 'Key concerns: (1) File type validation — validate MIME type (not extension), magic bytes for critical security. (2) File size limits — prevent DoS. (3) Rename files — original filenames can contain path traversal. (4) Store outside web root — files should not be directly executable via URL. (5) Virus scanning for user-facing storage. (6) Use signed URLs for private file access. (7) Never serve user-uploaded files from the same Express process.',
        difficulty: 'advanced',
      },
    ],
    exercises: [
      {
        id: 'ex-node-16',
        title: 'Build an image upload endpoint',
        description: 'Create a POST /upload/image endpoint using multer that accepts only JPEG/PNG images under 2MB, renames to a random hex string, and returns the file URL.',
        starterCode: `const express = require('express');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const router = express.Router();

// Configure multer:
// - disk storage with random filename
// - only jpg/png
// - max 2MB

router.post('/image', /* multer middleware */, (req, res) => {
  // return: { url: '/uploads/...', size: bytes }
});`,
        solution: `const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, crypto.randomBytes(16).toString('hex') + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    cb(['image/jpeg', 'image/png'].includes(file.mimetype) ? null : new Error('JPG/PNG only'), true);
  },
});

router.post('/image', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file' });
  res.json({ url: '/uploads/' + req.file.filename, size: req.file.size });
});`,
        hints: ['crypto.randomBytes(16).toString("hex") generates a random filename', 'multer.diskStorage takes destination and filename functions', 'Check mimetype in fileFilter'],
      },
    ],
    keyTakeaways: [
      'multipart/form-data encodes files and text together — Express needs multer to parse it',
      'Always rename uploaded files to random hashes — never trust original filenames',
      'Validate by mimetype AND limit file size — prevent type spoofing and DoS',
      'For production: stream to cloud storage (S3, GCS) — do not serve from Express',
      'memoryStorage for small files going to cloud; diskStorage for files staying on server',
    ],
    prevLesson: 'nodejs-validation',
    nextLesson: 'nodejs-realtime',
  },

  // ─── MODULE 17: Real-Time Applications ───────────────────────────────────────
  {
    id: 'nodejs-realtime',
    slug: 'nodejs-realtime',
    title: 'Real-Time Applications — WebSockets and Socket.IO',
    description: 'Build real-time features with WebSockets and Socket.IO — chat, presence, live updates, multiplayer, and notifications.',
    category: 'Real-Time',
    order: 17,
    difficulty: 'advanced',
    estimatedTime: 35,
    content: `HTTP is request/response — the client asks, the server answers. For real-time features (chat, live cursors, notifications, multiplayer), you need the server to push data without a client request.\n\n## Why WebSockets\n\nThe old way to fake real-time:\n- **Short polling**: client asks "anything new?" every second → wasteful, slow\n- **Long polling**: client asks and server holds the request open until data is ready → works but complex\n- **Server-Sent Events (SSE)**: server pushes one-way stream → good for notifications\n\n**WebSocket**: full-duplex, persistent, bidirectional channel — both sides can send at any time.\n\n## WebSocket Handshake\n\n\`\`\`\nClient: GET /chat HTTP/1.1\n        Upgrade: websocket\n        Connection: Upgrade\n        Sec-WebSocket-Key: ...\n\nServer: HTTP/1.1 101 Switching Protocols\n        Upgrade: websocket\n        Connection: Upgrade\n        Sec-WebSocket-Accept: ...\n\n[TCP connection stays open]\n[Now both sides can send frames at any time]\n\`\`\`\n\n## Socket.IO vs Raw WebSocket\n\n**Raw WebSocket** (ws library) — low level:\n- No rooms, no namespaces\n- No auto-reconnect\n- No fallback for old browsers\n- No event names\n\n**Socket.IO** — higher level:\n- Named events\n- Rooms and namespaces\n- Auto-reconnect\n- Falls back to polling if WebSocket unavailable\n- Built-in acknowledgements\n\nFor most apps, use Socket.IO. For high-performance real-time with millions of connections, consider raw ws.\n\n## Socket.IO Concepts\n\n**Namespaces** — divide the server into separate communication channels\n\`\`\`js\nconst chat = io.of('/chat');\nconst game = io.of('/game');\n\`\`\`\n\n**Rooms** — groups within a namespace\n\`\`\`js\nsocket.join('room-123');      // join a room\nio.to('room-123').emit(...)   // send to room\nsocket.leave('room-123');     // leave\n\`\`\`\n\n**Events** — named messages\n\`\`\`js\nsocket.emit('message', data);           // send to this socket\nio.emit('message', data);               // broadcast to all\nio.to('room').emit('message', data);    // send to room\nsocket.broadcast.emit('message', data); // all except sender\n\`\`\`\n\n## Scaling Real-Time\n\nSocket.IO is stateful — connections are held on a specific server. In a multi-server setup, user A on server 1 cannot receive a message from user B on server 2 unless the servers communicate.\n\nSolution: **Socket.IO Redis Adapter** — all servers share pub/sub through Redis:\n\n\`\`\`bash\nnpm install @socket.io/redis-adapter ioredis\n\`\`\`\n\n\`\`\`js\nconst { createAdapter } = require('@socket.io/redis-adapter');\nconst { createClient } = require('redis');\n\nconst pub = createClient();\nconst sub = pub.duplicate();\nawait Promise.all([pub.connect(), sub.connect()]);\n\nio.adapter(createAdapter(pub, sub));\n// Now all servers share socket events via Redis\n\`\`\``,
    codeExamples: [
      {
        title: 'Real-time chat with Socket.IO',
        code: `// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: 'http://localhost:3000', methods: ['GET', 'POST'] },
});

const onlineUsers = new Map(); // socketId → { userId, username, room }

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join a chat room
  socket.on('join:room', ({ roomId, username }) => {
    socket.join(roomId);
    onlineUsers.set(socket.id, { username, roomId });

    // Notify others in the room
    socket.to(roomId).emit('user:joined', { username, timestamp: Date.now() });

    // Send current online users to the newcomer
    const roomUsers = [...onlineUsers.values()]
      .filter(u => u.roomId === roomId)
      .map(u => u.username);
    socket.emit('room:users', roomUsers);
  });

  // Handle message
  socket.on('message:send', ({ roomId, content }) => {
    const user = onlineUsers.get(socket.id);
    if (!user) return;

    const message = {
      id: Date.now(),
      content,
      username: user.username,
      timestamp: new Date().toISOString(),
    };

    // Send to everyone in the room (including sender)
    io.to(roomId).emit('message:received', message);

    // In production: save message to database here
  });

  // Typing indicator
  socket.on('typing:start', ({ roomId }) => {
    const user = onlineUsers.get(socket.id);
    socket.to(roomId).emit('typing:start', { username: user?.username });
  });

  socket.on('typing:stop', ({ roomId }) => {
    socket.to(roomId).emit('typing:stop', { socketId: socket.id });
  });

  // Disconnect
  socket.on('disconnect', () => {
    const user = onlineUsers.get(socket.id);
    if (user) {
      socket.to(user.roomId).emit('user:left', { username: user.username });
      onlineUsers.delete(socket.id);
    }
  });
});

server.listen(4000, () => console.log('Chat server on port 4000'));`,
        explanation: 'socket.to(room).emit() sends to all in the room except the sender. io.to(room).emit() includes the sender. onlineUsers Map tracks who is in which room.',
      },
      {
        title: 'Client-side Socket.IO',
        code: `<!-- index.html -->
<script src="/socket.io/socket.io.js"></script>
<script>
const socket = io('http://localhost:4000');

// Connect
socket.on('connect', () => {
  console.log('Connected, id:', socket.id);

  // Join a room after connecting
  socket.emit('join:room', {
    roomId: 'room-general',
    username: 'Alice',
  });
});

// Receive messages
socket.on('message:received', (message) => {
  console.log(\`[\${message.username}]: \${message.content}\`);
  renderMessage(message);
});

// User joined/left
socket.on('user:joined', ({ username }) => {
  showNotification(\`\${username} joined the room\`);
});

// Typing indicators
let typingTimer;
document.getElementById('input').addEventListener('input', () => {
  socket.emit('typing:start', { roomId: 'room-general' });
  clearTimeout(typingTimer);
  typingTimer = setTimeout(() => {
    socket.emit('typing:stop', { roomId: 'room-general' });
  }, 1000);
});

// Send message
function sendMessage(content) {
  socket.emit('message:send', { roomId: 'room-general', content });
}

// Handle disconnect
socket.on('disconnect', () => {
  console.log('Disconnected. Attempting to reconnect...');
  // Socket.IO auto-reconnects by default
});
</script>`,
        explanation: 'Socket.IO auto-reconnects on disconnect. The socket.id changes after reconnection — track users by userId from your auth system, not socket.id.',
      },
    ],
    commonMistakes: [
      'Identifying users by socket.id — it changes on reconnect. Use a userId from your auth system.',
      'Not cleaning up data on disconnect — always remove users from maps/rooms on socket disconnect event.',
      'Not using Redis adapter for multi-server setups — messages only reach sockets on the same server.',
      'Emitting to all rooms from the disconnect handler before removing the user from your data.',
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between WebSocket and HTTP?',
        answer: 'HTTP is half-duplex request/response — client sends request, server responds, connection closes. WebSocket is full-duplex — after a handshake upgrade from HTTP, the TCP connection stays open and both sides can send messages at any time. WebSocket is ideal for real-time data: chat, live scores, collaborative editing. HTTP is better for REST APIs, file downloads, and standard web requests.',
        difficulty: 'intermediate',
      },
      {
        question: 'How do you scale Socket.IO across multiple servers?',
        answer: 'By default, Socket.IO is stateful — a connection lives on one server. In multiple servers, a message from user A (server 1) cannot reach user B (server 2). Solution: use the @socket.io/redis-adapter. It uses Redis pub/sub to broadcast events across all servers. When server 1 emits to a room, Redis notifies all servers, which forward it to their connected clients in that room.',
        difficulty: 'advanced',
      },
    ],
    exercises: [
      {
        id: 'ex-node-17',
        title: 'Build a real-time notification system',
        description: 'Create a Socket.IO server where admins can broadcast notifications to all connected users or to specific user rooms.',
        starterCode: `const { Server } = require('socket.io');
const http = require('http');

const server = http.createServer();
const io = new Server(server);

// When a user connects, they join their personal room: 'user:<userId>'
// Admin can emit: notify:all, notify:user (with userId and message)

io.on('connection', (socket) => {
  // TODO
});

server.listen(4000);`,
        solution: `io.on('connection', (socket) => {
  // User joins their personal room
  socket.on('auth', ({ userId }) => {
    socket.join(\`user:\${userId}\`);
    socket.userId = userId;
  });

  // Admin broadcasts to all
  socket.on('notify:all', ({ message, type = 'info' }) => {
    io.emit('notification', { message, type, timestamp: Date.now() });
  });

  // Admin sends to specific user
  socket.on('notify:user', ({ userId, message, type = 'info' }) => {
    io.to(\`user:\${userId}\`).emit('notification', { message, type, timestamp: Date.now() });
  });
});`,
        hints: ['socket.join() adds socket to a named room', 'io.to(room).emit() sends to all in room', 'Store userId on socket object for later use'],
      },
    ],
    keyTakeaways: [
      'WebSocket is full-duplex persistent TCP — both sides send without request/response cycle',
      'Socket.IO adds events, rooms, namespaces, and auto-reconnect on top of WebSocket',
      'socket.to(room).emit() = all in room except sender; io.to(room).emit() = all including sender',
      'Track users by userId from your auth system, not socket.id (changes on reconnect)',
      'Scale with Redis adapter — pub/sub allows multi-server Socket.IO',
    ],
    prevLesson: 'nodejs-file-uploads',
    nextLesson: 'nodejs-background-jobs',
  },

  // ─── MODULE 18: Background Jobs ───────────────────────────────────────────────
  {
    id: 'nodejs-background-jobs',
    slug: 'nodejs-background-jobs',
    title: 'Background Jobs — Queues with BullMQ',
    description: 'Offload heavy work with job queues, process jobs asynchronously, handle retries, and schedule recurring tasks using BullMQ and Redis.',
    category: 'Architecture',
    order: 18,
    difficulty: 'advanced',
    estimatedTime: 30,
    content: `Some operations are too slow or unreliable to run during an HTTP request:\n- Sending emails (200-2000ms, SMTP can fail)\n- Generating PDFs or reports\n- Sending SMS notifications\n- Processing image uploads (resize, compress)\n- Syncing to external services\n- Charging credit cards\n\nRunning these in request handlers means users wait, and if the server crashes, the work is lost. **Job queues** solve this.\n\n## How Job Queues Work\n\n\`\`\`\nHTTP Request → Producer adds job to Queue → returns 202 Accepted immediately\n\nWorker (separate process) → picks job from Queue → processes it → marks done/failed\n\nIf job fails → automatically retried N times → dead letter queue\n\`\`\`\n\nUser does not wait. Work is not lost if server crashes (jobs persist in Redis).\n\n## BullMQ\n\nBullMQ is the most popular Node.js job queue. It uses Redis as the backing store.\n\n\`\`\`bash\nnpm install bullmq ioredis\n\`\`\`\n\n## BullMQ Concepts\n\n- **Queue** — list of jobs waiting to be processed\n- **Worker** — process that picks and executes jobs\n- **Job** — unit of work with a name and data payload\n- **Processor** — function that handles a specific job type\n- **Concurrency** — how many jobs a worker processes simultaneously\n- **Retry** — automatic re-processing on failure\n- **Dead Letter Queue** — jobs that failed all retries\n\n## Job Priorities and Delays\n\n\`\`\`js\n// High priority job\nawait queue.add('send-email', data, { priority: 1 });\n\n// Delayed job (run in 30 minutes)\nawait queue.add('reminder', data, { delay: 30 * 60 * 1000 });\n\n// Repeating job (cron)\nawait queue.add('daily-report', {}, {\n  repeat: { cron: '0 8 * * *' }, // every day at 8am\n});\n\n// Job with retry strategy\nawait queue.add('send-webhook', data, {\n  attempts: 5,\n  backoff: { type: 'exponential', delay: 1000 }, // 1s, 2s, 4s, 8s, 16s\n});\n\`\`\``,
    codeExamples: [
      {
        title: 'BullMQ setup — queue, worker, and retry',
        code: `const { Queue, Worker, QueueEvents } = require('bullmq');
const Redis = require('ioredis');

const connection = new Redis({ host: 'localhost', port: 6379, maxRetriesPerRequest: null });

// ── PRODUCER ─────────────────────────────────────────────────────────────────
const emailQueue = new Queue('emails', { connection });
const reportQueue = new Queue('reports', { connection });

// Add jobs from your API route
async function sendWelcomeEmail(userId, email) {
  const job = await emailQueue.add('welcome-email', { userId, email }, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 }, // retry: 2s, 4s, 8s
    removeOnComplete: { count: 100 }, // keep last 100 completed jobs
    removeOnFail: { count: 50 },      // keep last 50 failed jobs
  });
  return job.id;
}

// ── WORKER ───────────────────────────────────────────────────────────────────
const emailWorker = new Worker('emails', async (job) => {
  console.log(\`Processing job \${job.id}: \${job.name}\`);

  if (job.name === 'welcome-email') {
    const { userId, email } = job.data;

    // Simulate email sending
    await sendEmail({
      to: email,
      subject: 'Welcome to our platform!',
      template: 'welcome',
      data: { userId },
    });

    // Update job progress
    await job.updateProgress(100);

    return { sent: true, timestamp: new Date().toISOString() };
  }

  if (job.name === 'password-reset') {
    const { email, resetToken } = job.data;
    await sendEmail({ to: email, subject: 'Reset your password', template: 'reset', data: { resetToken } });
    return { sent: true };
  }
}, {
  connection,
  concurrency: 5, // process 5 emails at once
});

// Worker events
emailWorker.on('completed', (job, result) => {
  console.log(\`Job \${job.id} completed:\`, result);
});

emailWorker.on('failed', (job, err) => {
  console.error(\`Job \${job.id} failed after \${job.attemptsMade} attempts:\`, err.message);
});

// ── API ROUTE ─────────────────────────────────────────────────────────────────
const router = require('express').Router();

router.post('/register', async (req, res, next) => {
  try {
    const user = await userService.create(req.body);

    // Add to queue — do not await
    await sendWelcomeEmail(user.id, user.email);

    // Return immediately — email sends in background
    res.status(201).json({ user, message: 'Registration successful! Check your email.' });
  } catch (err) {
    next(err);
  }
});`,
        explanation: 'Add the job, return immediately to the user. The worker processes in the background. If the email service is down, BullMQ retries automatically.',
      },
      {
        title: 'Scheduled jobs and job monitoring',
        code: `const { Queue, Worker } = require('bullmq');
const Redis = require('ioredis');

const connection = new Redis({ maxRetriesPerRequest: null });
const schedulerQueue = new Queue('scheduler', { connection });

// Daily report at 9am every weekday
await schedulerQueue.add('daily-report', { reportType: 'sales' }, {
  repeat: { cron: '0 9 * * 1-5' }, // Monday-Friday at 9am
});

// Cleanup old data every Sunday midnight
await schedulerQueue.add('cleanup', { olderThan: '30d' }, {
  repeat: { cron: '0 0 * * 0' },
});

// Process scheduled jobs
const schedulerWorker = new Worker('scheduler', async (job) => {
  if (job.name === 'daily-report') {
    console.log('Generating daily report...');
    const report = await reportService.generate(job.data.reportType);
    await emailService.sendReport(report);
  }

  if (job.name === 'cleanup') {
    await dataService.cleanup(job.data.olderThan);
  }
}, { connection });

// Job status check (for API endpoint)
async function getJobStatus(jobId) {
  const job = await Queue.fromId(emailQueue, jobId);
  const state = await job.getState();
  return {
    id: job.id,
    state, // 'waiting' | 'active' | 'completed' | 'failed' | 'delayed'
    progress: job.progress,
    result: job.returnvalue,
    error: job.failedReason,
    attempts: job.attemptsMade,
  };
}`,
        explanation: 'Cron scheduling with BullMQ persists in Redis — restarts do not lose scheduled jobs. Check job status via the queue for async operation polling.',
      },
    ],
    commonMistakes: [
      'Running background jobs without a queue — crashes lose work permanently.',
      'Processing jobs in the same process as the HTTP server — a stuck job blocks requests.',
      'Not setting maxRetriesPerRequest: null in Redis config — BullMQ requires this.',
      'Forgetting to close queues and workers on shutdown — causes Redis connection leaks.',
    ],
    interviewQuestions: [
      {
        question: 'When do you use a job queue instead of processing in the request handler?',
        answer: 'Use a job queue when: the operation is slow (email, PDF generation, external API), it can fail and needs retries (webhooks, payments), it should happen asynchronously (user should not wait), or it needs scheduling/delay (reminders, reports). The pattern: add job to queue, return 202 Accepted to user immediately, worker processes in background.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'ex-node-18',
        title: 'Add email queue to registration',
        description: 'Modify a registration endpoint to add a welcome-email job to a BullMQ queue instead of sending synchronously.',
        starterCode: `const { Queue } = require('bullmq');
const Redis = require('ioredis');

const connection = new Redis({ maxRetriesPerRequest: null });
const emailQueue = new Queue('emails', { connection });

// Modify this route to add to queue instead of await sendEmail()
router.post('/register', async (req, res) => {
  const user = await userService.create(req.body);
  await sendEmail({ to: user.email, template: 'welcome' }); // synchronous — slow
  res.status(201).json(user);
});`,
        solution: `router.post('/register', async (req, res, next) => {
  try {
    const user = await userService.create(req.body);
    await emailQueue.add('welcome-email', { email: user.email, userId: user.id }, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
    });
    res.status(201).json(user); // returns immediately — email sends in background
  } catch (err) {
    next(err);
  }
});`,
        hints: ['emailQueue.add(name, data, options) adds a job', 'Do not await the actual email send — queue it instead', 'Return response before email is sent'],
      },
    ],
    keyTakeaways: [
      'Job queues offload slow/unreliable work — user gets instant response, work happens in background',
      'BullMQ + Redis: persistent jobs survive server restarts, automatic retries with backoff',
      'Run workers as separate processes from your HTTP server',
      'Use for: emails, SMS, PDF generation, webhooks, image processing, reports',
      'Monitor jobs via BullMQ Board or custom API endpoints',
    ],
    prevLesson: 'nodejs-realtime',
    nextLesson: 'nodejs-caching',
  },

  // ─── MODULE 19: Caching ───────────────────────────────────────────────────────
  {
    id: 'nodejs-caching',
    slug: 'nodejs-caching',
    title: 'Caching with Redis',
    description: 'Implement Redis caching for sessions, API responses, and database queries. Learn cache invalidation strategies.',
    category: 'Performance',
    order: 19,
    difficulty: 'advanced',
    estimatedTime: 25,
    content: `This module builds on System Design caching concepts and focuses on Node.js implementation with Redis.\n\n## Redis in Node.js\n\n\`\`\`bash\nnpm install ioredis\n# or the official client:\nnpm install redis\n\`\`\`\n\nCreate a singleton Redis client:\n\n\`\`\`js\n// cache/redis.js\nconst Redis = require('ioredis');\n\nconst redis = new Redis({\n  host: process.env.REDIS_HOST || 'localhost',\n  port: parseInt(process.env.REDIS_PORT || '6379'),\n  password: process.env.REDIS_PASSWORD,\n  retryStrategy: (times) => Math.min(times * 50, 2000), // reconnect with backoff\n});\n\nredis.on('error', (err) => console.error('Redis error:', err));\nredis.on('connect', () => console.log('Redis connected'));\n\nmodule.exports = redis;\n\`\`\`\n\n## Cache-Aside Pattern\n\nThe most common caching pattern:\n1. Check cache → if hit, return cached data\n2. If miss → query database → store in cache → return data\n\n\`\`\`js\nasync function getUser(userId) {\n  const cacheKey = \`user:\${userId}\`;\n\n  // Check cache first\n  const cached = await redis.get(cacheKey);\n  if (cached) return JSON.parse(cached);\n\n  // Cache miss — query DB\n  const user = await db.user.findUnique({ where: { id: userId } });\n  if (!user) return null;\n\n  // Store with TTL (1 hour)\n  await redis.setex(cacheKey, 3600, JSON.stringify(user));\n  return user;\n}\n\`\`\`\n\n## Cache Invalidation\n\nThe hardest part. When data changes, the cache must be updated or deleted.\n\n\`\`\`js\nasync function updateUser(userId, data) {\n  const user = await db.user.update({ where: { id: userId }, data });\n\n  // Invalidate cache after update\n  await redis.del(\`user:\${userId}\`);\n  // Or update it:\n  await redis.setex(\`user:\${userId}\`, 3600, JSON.stringify(user));\n\n  return user;\n}\n\`\`\`\n\n## Session Caching\n\nStore session data in Redis (fast, shared across servers):\n\n\`\`\`bash\nnpm install express-session connect-redis\n\`\`\`\n\n\`\`\`js\nconst session = require('express-session');\nconst RedisStore = require('connect-redis').default;\n\napp.use(session({\n  store: new RedisStore({ client: redis }),\n  secret: process.env.SESSION_SECRET,\n  resave: false,\n  saveUninitialized: false,\n  cookie: { secure: true, httpOnly: true, maxAge: 86400000 }, // 24h\n}));\n\`\`\`\n\n## API Response Caching Middleware\n\n\`\`\`js\nfunction cacheMiddleware(ttlSeconds) {\n  return async (req, res, next) => {\n    if (req.method !== 'GET') return next(); // only cache GETs\n\n    const key = \`cache:\${req.originalUrl}\`;\n    const cached = await redis.get(key);\n\n    if (cached) {\n      res.setHeader('X-Cache', 'HIT');\n      return res.json(JSON.parse(cached));\n    }\n\n    // Intercept res.json to cache it\n    const originalJson = res.json.bind(res);\n    res.json = (data) => {\n      if (res.statusCode === 200) {\n        redis.setex(key, ttlSeconds, JSON.stringify(data)).catch(console.error);\n      }\n      res.setHeader('X-Cache', 'MISS');\n      return originalJson(data);\n    };\n\n    next();\n  };\n}\n\n// Apply to routes:\nrouter.get('/products', cacheMiddleware(300), getProducts); // 5 min cache\n\`\`\`\n\n## Cache Key Design\n\n\`\`\`\nuser:{userId}              — user profile\nuser:{userId}:posts        — user's posts\npost:{postId}              — individual post\napi:/api/products?page=1   — paginated result\nsession:{sessionId}        — session data\nrate:{ip}:{endpoint}       — rate limiting counter\n\`\`\`\n\nNamespace your keys (user:, post:, session:) to avoid collisions and enable pattern-based deletion.`,
    codeExamples: [
      {
        title: 'Redis caching layer for database queries',
        code: `const redis = require('../cache/redis');
const prisma = require('../db/prisma');

class UserCache {
  static TTL = 3600; // 1 hour
  static KEY = (id) => \`user:\${id}\`;
  static LIST_KEY = (page) => \`users:list:\${page}\`;

  static async get(userId) {
    try {
      const cached = await redis.get(this.KEY(userId));
      if (cached) return JSON.parse(cached);
    } catch {} // Redis failure should not break the app

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true },
    });

    if (user) {
      await redis.setex(this.KEY(userId), this.TTL, JSON.stringify(user)).catch(() => {});
    }

    return user;
  }

  static async invalidate(userId) {
    await redis.del(this.KEY(userId));
    // Also clear any list caches that might contain this user
    const listKeys = await redis.keys('users:list:*');
    if (listKeys.length > 0) await redis.del(...listKeys);
  }

  static async update(userId, data) {
    const user = await prisma.user.update({ where: { id: userId }, data });
    // Update cache with fresh data
    await redis.setex(this.KEY(userId), this.TTL, JSON.stringify(user)).catch(() => {});
    return user;
  }
}

// Usage
router.get('/:id', async (req, res) => {
  const user = await UserCache.get(req.params.id);
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json(user);
});

router.put('/:id', async (req, res) => {
  const user = await UserCache.update(req.params.id, req.body);
  res.json(user);
});`,
        explanation: 'Wrap Redis in try/catch — Redis failure should degrade gracefully (fall through to DB), not crash the app. Cache invalidation on update keeps data fresh.',
      },
    ],
    commonMistakes: [
      'Crashing the app on Redis errors — cache should degrade gracefully to DB queries.',
      'Caching user-specific data at a shared key — cache must include the user ID in the key.',
      'Not invalidating on write — stale cache serves old data after updates.',
      'Caching errors or empty results with the same TTL — a bug returns cached errors for an hour.',
    ],
    interviewQuestions: [
      {
        question: 'What is the cache-aside pattern?',
        answer: 'Cache-aside (lazy loading): on read, check cache first. On cache hit, return cached data. On cache miss, query the database, store result in cache with TTL, then return. On write, invalidate or update the cache. It is "lazy" because data is only cached when first requested. Alternative: write-through (update cache on every write) — keeps cache more fresh but writes are slower.',
        difficulty: 'intermediate',
      },
      {
        question: 'How do you handle cache invalidation?',
        answer: 'Strategies: (1) Delete on write — when data changes, delete the cache key. Next read repopulates. Simple but causes one DB query after invalidation. (2) Update on write — when data changes, update the cache key. Cache stays warm but writes are more complex. (3) TTL-based expiry — cache expires automatically after N seconds. Simplest but serves stale data until expiry. Real systems combine: TTL for safety + delete-on-write for correctness.',
        difficulty: 'advanced',
      },
    ],
    exercises: [
      {
        id: 'ex-node-19',
        title: 'Build a caching middleware',
        description: 'Create an Express middleware that caches GET responses in Redis for a configurable TTL.',
        starterCode: `const redis = require('./redis');

function cache(ttlSeconds) {
  return async (req, res, next) => {
    // Only cache GET requests
    // Use req.originalUrl as cache key
    // If cache hit: set X-Cache: HIT header and return JSON
    // If cache miss: let request proceed, intercept res.json to cache the result
  };
}

module.exports = cache;`,
        solution: `function cache(ttlSeconds) {
  return async (req, res, next) => {
    if (req.method !== 'GET') return next();
    const key = \`cache:\${req.originalUrl}\`;
    try {
      const hit = await redis.get(key);
      if (hit) {
        res.setHeader('X-Cache', 'HIT');
        return res.json(JSON.parse(hit));
      }
    } catch {}
    const originalJson = res.json.bind(res);
    res.json = (data) => {
      if (res.statusCode === 200) {
        redis.setex(key, ttlSeconds, JSON.stringify(data)).catch(() => {});
      }
      res.setHeader('X-Cache', 'MISS');
      return originalJson(data);
    };
    next();
  };
}`,
        hints: ['Intercept res.json by reassigning it', 'Only cache 200 responses', 'Wrap Redis calls in try/catch'],
      },
    ],
    keyTakeaways: [
      'Cache-aside: check cache → miss → query DB → store → return',
      'Always invalidate cache on writes — stale data is a common bug source',
      'Redis errors should degrade gracefully, not crash the app',
      'Namespace cache keys: user:{id}, post:{id}, api:{url}',
      'Use TTL as a safety net even when you have explicit invalidation',
    ],
    prevLesson: 'nodejs-background-jobs',
    nextLesson: 'nodejs-error-handling',
  },

  // ─── MODULE 20: Error Handling ────────────────────────────────────────────────
  {
    id: 'nodejs-error-handling',
    slug: 'nodejs-error-handling',
    title: 'Error Handling — Production Patterns',
    description: 'Build centralized error handling, distinguish operational from programming errors, implement logging, and recover gracefully.',
    category: 'Production',
    order: 20,
    difficulty: 'advanced',
    estimatedTime: 30,
    content: `Poor error handling is the difference between a professional API and a fragile one. In production, errors are inevitable — databases go down, networks fail, users send bad data. How you handle errors determines how your system behaves.\n\n## Operational Errors vs Programming Errors\n\n**Operational errors** — expected, known conditions:\n- Invalid user input (400)\n- Resource not found (404)\n- Database connection timeout\n- External API rate limited\n- Authentication failure\n\nThese should be caught, handled gracefully, and return appropriate HTTP responses.\n\n**Programming errors** — bugs in your code:\n- null reference: \`user.name\` when user is undefined\n- Wrong argument type passed to a function\n- Uncaught promise rejection\n\nThese should be logged with full stack traces, and may require a process restart.\n\n## Error Taxonomy in Node.js\n\n\`\`\`js\n// Custom AppError class\nclass AppError extends Error {\n  constructor(message, statusCode, code = null) {\n    super(message);\n    this.name = 'AppError';\n    this.statusCode = statusCode;\n    this.code = code;\n    this.isOperational = true;\n    Error.captureStackTrace(this, this.constructor);\n  }\n}\n\n// Specific error types\nclass NotFoundError extends AppError {\n  constructor(resource = 'Resource') {\n    super(\`\${resource} not found\`, 404, 'NOT_FOUND');\n  }\n}\n\nclass ValidationError extends AppError {\n  constructor(message, details = []) {\n    super(message, 422, 'VALIDATION_ERROR');\n    this.details = details;\n  }\n}\n\nclass UnauthorizedError extends AppError {\n  constructor(message = 'Authentication required') {\n    super(message, 401, 'UNAUTHORIZED');\n  }\n}\n\`\`\`\n\n## Process-Level Error Handling\n\n\`\`\`js\n// Catch synchronous errors that slip through\nprocess.on('uncaughtException', (err) => {\n  console.error('UNCAUGHT EXCEPTION — shutting down:', err);\n  process.exit(1); // must exit — process state may be corrupted\n});\n\n// Catch unhandled promise rejections\nprocess.on('unhandledRejection', (reason) => {\n  console.error('UNHANDLED REJECTION:', reason);\n  process.exit(1);\n});\n\`\`\`\n\n## Logging\n\nUse structured logging (JSON) in production — logs go to aggregation services (Datadog, CloudWatch, Grafana Loki) that can index and search JSON fields.\n\n\`\`\`bash\nnpm install winston\n\`\`\`\n\n\`\`\`js\nconst winston = require('winston');\n\nconst logger = winston.createLogger({\n  level: process.env.LOG_LEVEL || 'info',\n  format: winston.format.combine(\n    winston.format.timestamp(),\n    winston.format.json() // structured JSON output\n  ),\n  transports: [\n    new winston.transports.Console(),\n    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),\n  ],\n});\n\`\`\`\n\n## Monitoring\n\nFor production monitoring, use:\n- **Sentry** — error tracking with stack traces and context\n- **Datadog** — APM, metrics, logs, alerts\n- **Prometheus + Grafana** — self-hosted metrics\n\n\`\`\`bash\nnpm install @sentry/node\n\`\`\`\n\n## Recovery Strategies\n\n- **Circuit breaker** — stop calling a failing external service after N failures\n- **Retry with backoff** — retry transient errors (network timeouts) with increasing delays\n- **Graceful degradation** — return cached data if database is down\n- **Health checks** — expose /health endpoint for load balancers to detect failures`,
    codeExamples: [
      {
        title: 'Complete error handling setup for Express',
        code: `// errors/AppError.js
class AppError extends Error {
  constructor(message, statusCode, code = null, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code || \`HTTP_\${statusCode}\`;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// middleware/errorHandler.js
const logger = require('../logger');

function errorHandler(err, req, res, next) {
  // Default to 500 for unhandled errors
  let statusCode = err.statusCode || 500;
  let message = err.isOperational ? err.message : 'Internal Server Error';
  let code = err.code || 'INTERNAL_ERROR';

  // Handle known third-party error types
  if (err.name === 'ValidationError') {
    statusCode = 422; code = 'VALIDATION_ERROR';
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401; code = 'INVALID_TOKEN'; message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401; code = 'TOKEN_EXPIRED'; message = 'Token expired';
  } else if (err.code === 'P2025') {
    // Prisma not found error
    statusCode = 404; code = 'NOT_FOUND'; message = 'Record not found';
  } else if (err.code === 'P2002') {
    // Prisma unique constraint
    statusCode = 409; code = 'CONFLICT'; message = 'Already exists';
  }

  // Log with context
  const logData = {
    error: { message: err.message, code: err.code, stack: err.stack },
    request: { method: req.method, url: req.url, userId: req.user?.sub },
  };

  if (statusCode >= 500) {
    logger.error('Server error', logData);
  } else {
    logger.warn('Client error', { ...logData, statusCode });
  }

  const body = {
    error: { code, message, ...(err.details && { details: err.details }) },
  };

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    body.error.stack = err.stack;
  }

  res.status(statusCode).json(body);
}

// 404 handler
function notFound(req, res) {
  res.status(404).json({ error: { code: 'NOT_FOUND', message: \`Route \${req.method} \${req.url} not found\` } });
}

module.exports = { errorHandler, notFound, AppError };`,
        explanation: 'Map known errors (Prisma codes, JWT errors) to appropriate HTTP responses in one place. Log 5xx as errors (alerts), 4xx as warnings (noise control).',
      },
      {
        title: 'Async error wrapper and structured logging',
        code: `const winston = require('winston');

// Structured logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    process.env.NODE_ENV === 'production'
      ? winston.format.json()
      : winston.format.colorize({ all: true }) && winston.format.simple()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Async handler wrapper
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Request logger middleware
function requestLogger(req, res, next) {
  const start = Date.now();
  res.on('finish', () => {
    logger.info('HTTP request', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: Date.now() - start,
      userId: req.user?.sub,
      ip: req.ip,
    });
  });
  next();
}

// Process-level handlers
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception', { error: err.message, stack: err.stack });
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection', { reason });
  process.exit(1);
});

module.exports = { logger, asyncHandler, requestLogger };`,
        explanation: 'JSON logs in production allow log aggregation services to query by fields (userId, statusCode, duration). Simple format in development for readability.',
      },
    ],
    commonMistakes: [
      'Swallowing errors with empty catch blocks — catch errors silently causes invisible bugs.',
      'Leaking error stack traces to clients in production — only show in development.',
      'Not separating operational from programming errors — both trigger the same response.',
      'Not handling unhandledRejection — uncaught async errors silently fail in older Node.js.',
      'Using console.log for production logging — use winston/pino for structured JSON output.',
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between operational errors and programming errors?',
        answer: 'Operational errors are expected conditions: user input validation failure, database timeout, network error, 404 for missing resource. These should be caught, handled, and return appropriate HTTP responses. Programming errors are bugs: calling a method on undefined, wrong type passed to function. These should be logged with full stack traces and may require a process restart — the process state may be corrupted.',
        difficulty: 'intermediate',
        tip: 'This distinction from the Node.js documentation is commonly asked in senior interviews.',
      },
      {
        question: 'How does error handling work in Express?',
        answer: 'Express has a centralized error handler middleware with 4 parameters (err, req, res, next). Errors reach it via: next(err) called explicitly, throw in synchronous route handlers (Express v5 catches), or uncaught rejection in async routes (must use try/catch + next(err) or an asyncHandler wrapper). The error handler is registered last. It should log the error, determine the HTTP status, and return a consistent error response format.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'ex-node-20',
        title: 'Build a centralized error handler',
        description: 'Create an Express error handler that handles AppError (operational), Prisma errors (P2025=404, P2002=409), JWT errors, and generic 500s with proper logging.',
        starterCode: `class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

function errorHandler(err, req, res, next) {
  // TODO: handle different error types with correct status codes
}`,
        solution: `function errorHandler(err, req, res, next) {
  let status = err.statusCode || 500;
  let message = err.isOperational ? err.message : 'Internal Server Error';
  if (err.code === 'P2025') { status = 404; message = 'Not found'; }
  if (err.code === 'P2002') { status = 409; message = 'Already exists'; }
  if (err.name === 'JsonWebTokenError') { status = 401; message = 'Invalid token'; }
  if (err.name === 'TokenExpiredError') { status = 401; message = 'Token expired'; }
  if (status >= 500) console.error(err);
  res.status(status).json({ error: { message, ...(process.env.NODE_ENV === 'development' && { stack: err.stack }) } });
}`,
        hints: ['Check err.code for Prisma errors', 'Check err.name for JWT errors', 'Only log 5xx errors — 4xx are expected'],
      },
    ],
    keyTakeaways: [
      'Operational errors: expected, return HTTP responses. Programming errors: bugs, log and may restart.',
      'Map known error types (Prisma, JWT) to HTTP status codes in one centralized handler',
      'Log 5xx as error (trigger alerts), 4xx as warning (expected behavior)',
      'Use structured JSON logging (winston/pino) for searchable production logs',
      'Handle unhandledRejection and uncaughtException at process level',
    ],
    prevLesson: 'nodejs-caching',
    nextLesson: 'nodejs-security',
  },

  // ─── MODULE 21: Security ──────────────────────────────────────────────────────
  {
    id: 'nodejs-security',
    slug: 'nodejs-security',
    title: 'Security — Helmet, CORS, Rate Limiting, OWASP',
    description: 'Secure Node.js APIs with helmet, CORS, rate limiting, input sanitization, password hashing, and OWASP best practices.',
    category: 'Security',
    order: 21,
    difficulty: 'advanced',
    estimatedTime: 30,
    content: `Security in Node.js is not one thing — it is a set of practices across headers, rate limiting, input sanitization, secrets management, and more.\n\n## Helmet — Security Headers\n\nHelmet sets HTTP response headers that protect against common browser-side attacks:\n\n\`\`\`bash\nnpm install helmet\n\`\`\`\n\n\`\`\`js\nconst helmet = require('helmet');\napp.use(helmet()); // sets 11 security headers\n\`\`\`\n\nHeaders helmet sets:\n- \`Content-Security-Policy\` — prevents XSS by restricting resource sources\n- \`X-XSS-Protection\` — browser XSS filter\n- \`X-Frame-Options: DENY\` — prevents clickjacking (your page in an iframe)\n- \`X-Content-Type-Options: nosniff\` — prevents MIME sniffing\n- \`Strict-Transport-Security\` — forces HTTPS\n- \`Referrer-Policy\` — controls referrer header\n\n## CORS — Cross-Origin Resource Sharing\n\nBrowsers block requests from different origins by default. CORS headers tell browsers which origins are allowed.\n\n\`\`\`bash\nnpm install cors\n\`\`\`\n\n\`\`\`js\nconst cors = require('cors');\n\n// Allow specific origins (production)\napp.use(cors({\n  origin: [\n    'https://myapp.com',\n    'https://www.myapp.com',\n    ...(process.env.NODE_ENV === 'development' ? ['http://localhost:3000'] : []),\n  ],\n  credentials: true, // allow cookies\n  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],\n  allowedHeaders: ['Content-Type', 'Authorization'],\n}));\n\`\`\`\n\n**Never use \`cors({ origin: '*' })\` with \`credentials: true\`** — browsers block this combination.\n\n## Rate Limiting\n\nProtects against brute force attacks, DoS, and API abuse.\n\n\`\`\`bash\nnpm install express-rate-limit\n\`\`\`\n\n\`\`\`js\nconst rateLimit = require('express-rate-limit');\n\n// General API rate limit\nconst apiLimiter = rateLimit({\n  windowMs: 15 * 60 * 1000, // 15 minutes\n  max: 100,                  // 100 requests per window\n  standardHeaders: true,\n  legacyHeaders: false,\n  message: { error: 'Too many requests, try again in 15 minutes' },\n});\n\n// Stricter for auth endpoints\nconst authLimiter = rateLimit({\n  windowMs: 15 * 60 * 1000,\n  max: 5,     // only 5 login attempts per 15 minutes\n  message: { error: 'Too many login attempts' },\n});\n\napp.use('/api/', apiLimiter);\napp.use('/api/auth/login', authLimiter);\n\`\`\`\n\nFor distributed systems (multiple servers), use Redis-backed rate limiting:\n\`\`\`bash\nnpm install rate-limit-redis\n\`\`\`\n\n## Input Sanitization\n\n**SQL Injection** — prevented by using parameterized queries (ORMs handle this):\n\`\`\`js\n// ❌ Vulnerable — never do this\ndb.query(\`SELECT * FROM users WHERE email = '\${email}'\`);\n\n// ✅ Safe — parameterized query\ndb.query('SELECT * FROM users WHERE email = $1', [email]);\n// ORMs like Prisma always use parameterized queries\n\`\`\`\n\n**XSS (Cross-Site Scripting)** — sanitize HTML if you render user content:\n\`\`\`bash\nnpm install dompurify jsdom\n\`\`\`\n\n## Secrets Management\n\n- Never hardcode secrets in code\n- Use environment variables (loaded from .env in development)\n- In production: AWS Secrets Manager, HashiCorp Vault, Kubernetes Secrets\n- Rotate secrets periodically\n- Never log secrets (even accidentally in error messages)\n\n## OWASP Top 10 Relevant to Node.js\n\n1. **Broken Access Control** — always check authorization, not just authentication\n2. **Cryptographic Failures** — use bcrypt for passwords, HTTPS everywhere, secure cookies\n3. **Injection** — use parameterized queries, validate all input\n4. **Security Misconfiguration** — remove default credentials, disable stack traces in production\n5. **Vulnerable Dependencies** — run \`npm audit\` regularly\n6. **Identification Failures** — short-lived JWTs, refresh tokens in httpOnly cookies\n7. **Logging Failures** — log security events (failed logins, permission denials)`,
    codeExamples: [
      {
        title: 'Complete security setup for an Express API',
        code: `const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();

// 1. Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  hsts: { maxAge: 31536000, includeSubDomains: true }, // Force HTTPS for 1 year
}));

// 2. CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
}));

// 3. Rate limiting
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000, max: 200, standardHeaders: true, legacyHeaders: false,
}));

app.use(['/api/auth/login', '/api/auth/register'], rateLimit({
  windowMs: 60 * 60 * 1000, max: 10, // 10 auth attempts per hour
  message: { error: { code: 'RATE_LIMITED', message: 'Too many attempts, try again later' } },
}));

// 4. Body parsing with limits
app.use(express.json({ limit: '1mb' })); // prevent huge payloads
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// 5. Remove X-Powered-By (tells attackers you use Express)
app.disable('x-powered-by'); // helmet does this too, but explicit is good`,
        explanation: 'Security is layered. Helmet sets headers, CORS restricts origins, rate limiting prevents brute force, body limit prevents DoS, disable x-powered-by hides your stack.',
      },
      {
        title: 'Password security and secrets management',
        code: `const bcrypt = require('bcrypt');
const crypto = require('crypto');

// Password hashing — cost factor 12 = ~250ms
// Deliberate slowness prevents brute-force
const SALT_ROUNDS = 12;

async function hashPassword(plaintext) {
  return bcrypt.hash(plaintext, SALT_ROUNDS);
}

async function verifyPassword(plaintext, hash) {
  return bcrypt.compare(plaintext, hash);
}

// ❌ Timing attack: checking before bcrypt if user exists
async function loginUnsafe(email, password) {
  const user = await db.user.findUnique({ where: { email } });
  if (!user) throw new Error('Invalid credentials'); // leaks that email doesn't exist
  return bcrypt.compare(password, user.passwordHash);
}

// ✅ Constant-time: always run bcrypt regardless of whether user exists
const DUMMY_HASH = '$2b$12$invalidhashfortimingrandomnessXXX';
async function loginSafe(email, password) {
  const user = await db.user.findUnique({ where: { email } });
  const hash = user?.passwordHash || DUMMY_HASH;
  const valid = await bcrypt.compare(password, hash);
  if (!user || !valid) throw new AppError('Invalid email or password', 401);
  return user;
}

// Secure random tokens
function generateToken() {
  return crypto.randomBytes(32).toString('hex'); // 64-char hex string
}

// Use for: email verification, password reset, API keys
async function createPasswordResetToken(userId) {
  const token = generateToken();
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 min
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  // Store hashed token in DB, send plain token in email
  await db.user.update({ where: { id: userId }, data: { resetToken: hashedToken, resetTokenExpiry: expiresAt } });
  return token; // plain — goes in email link
}`,
        explanation: 'Always run bcrypt even for non-existent users — timing attacks can detect user existence by comparing response times. Store SHA-256 of reset tokens, not the plain token.',
      },
    ],
    commonMistakes: [
      'Using cors({ origin: "*" }) with credentials — browsers block this.',
      'Not rate limiting auth endpoints — allows brute force of passwords.',
      'Storing plain text passwords — always use bcrypt.',
      'Logging request bodies that may contain passwords — scrub sensitive fields.',
      'Not running npm audit — vulnerable dependencies are the easiest attack vector.',
    ],
    interviewQuestions: [
      {
        question: 'What does helmet do in Node.js?',
        answer: 'Helmet is Express middleware that sets security-related HTTP response headers. Key headers: Content-Security-Policy (prevents XSS by restricting script/style sources), X-Frame-Options (prevents clickjacking), X-Content-Type-Options: nosniff (prevents MIME type sniffing), Strict-Transport-Security (forces HTTPS), Referrer-Policy. Without these headers, browsers are more vulnerable to common web attacks.',
        difficulty: 'intermediate',
      },
      {
        question: 'What is a timing attack and how do you prevent it in login?',
        answer: 'A timing attack exploits that code executes at different speeds. In login: if you return "user not found" immediately without running bcrypt, attackers can enumerate which emails are registered (fast response = no user, slow response = user exists). Prevention: always run bcrypt.compare() with a dummy hash even when the user is not found, making all login attempts take the same time regardless.',
        difficulty: 'advanced',
      },
    ],
    exercises: [
      {
        id: 'ex-node-21',
        title: 'Add security middleware to an Express app',
        description: 'Set up helmet, CORS for specific origin, rate limiting (100/15min general, 5/15min for /auth/login), and body size limit.',
        starterCode: `const express = require('express');
const app = express();

// TODO: Add helmet, cors, rate limiting, body limit
// allowed origin: http://localhost:3000
// general limit: 100 per 15 min
// auth limit: 5 per 15 min on /auth/login

app.use(express.json());
app.listen(3000);`,
        solution: `const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

app.use(helmet());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use('/api/', rateLimit({ windowMs: 15 * 60 * 1000, max: 100, standardHeaders: true }));
app.use('/auth/login', rateLimit({ windowMs: 15 * 60 * 1000, max: 5 }));
app.use(express.json({ limit: '1mb' }));`,
        hints: ['Apply helmet() before routes', 'Rate limiters are middleware — apply to path prefixes', 'cors() with credentials:true needs specific origin, not *'],
      },
    ],
    keyTakeaways: [
      'Helmet sets security headers — use it on every Express app',
      'CORS restricts which origins can access your API — never use * with credentials',
      'Rate limit auth endpoints strictly — brute force is the simplest attack',
      'Always use bcrypt for passwords — constant time, salted, GPU-resistant',
      'npm audit regularly — vulnerable dependencies are the easiest attack vector',
    ],
    prevLesson: 'nodejs-error-handling',
    nextLesson: 'nodejs-testing',
  },

  // ─── MODULE 22: Testing ───────────────────────────────────────────────────────
  {
    id: 'nodejs-testing',
    slug: 'nodejs-testing',
    title: 'Testing — Unit, Integration, and API Tests',
    description: 'Write unit tests, integration tests, and API tests with Jest, Vitest, and Supertest. Learn mocking and test structure.',
    category: 'Quality',
    order: 22,
    difficulty: 'intermediate',
    estimatedTime: 35,
    content: `Testing is not optional for production Node.js apps. Without tests, every change is a guess. This module covers practical testing patterns used in real Node.js backends.\n\n## Types of Tests\n\n**Unit tests** — test a single function in isolation\n- Fast (milliseconds)\n- Mock all dependencies (database, external APIs)\n- Test pure business logic\n\n**Integration tests** — test multiple layers together\n- Test route → controller → service → database\n- Use a real test database\n- Slower but more realistic\n\n**API tests (end-to-end)** — test the HTTP API\n- Use Supertest to make HTTP calls\n- Test request/response cycle completely\n- Most confidence that the API works\n\n## Testing Tools\n\n| Tool | Purpose |\n|------|--------|\n| **Jest** | Test runner, assertions, mocking — most popular |\n| **Vitest** | Jest-compatible, much faster, better ESM support |\n| **Supertest** | Make HTTP requests to Express app in tests |\n| **@faker-js/faker** | Generate realistic test data |\n| **msw** | Mock external HTTP APIs |\n\n## Test Structure (AAA Pattern)\n\nEvery test should follow Arrange-Act-Assert:\n\n\`\`\`js\ndescribe('UserService.create', () => {\n  it('should create a user with hashed password', async () => {\n    // Arrange — set up test data\n    const input = { email: 'alice@example.com', password: 'password123', name: 'Alice' };\n\n    // Act — call the thing being tested\n    const user = await userService.create(input);\n\n    // Assert — verify the result\n    expect(user.id).toBeDefined();\n    expect(user.email).toBe('alice@example.com');\n    expect(user.password).toBeUndefined(); // should not return password\n    expect(user.passwordHash).not.toBe('password123'); // should be hashed\n  });\n});\n\`\`\`\n\n## Mocking\n\n\`\`\`js\n// Mock a module\njest.mock('../services/email', () => ({\n  sendWelcomeEmail: jest.fn().mockResolvedValue({ sent: true }),\n}));\n\n// Mock a database call\nconst prisma = require('../db/prisma');\njest.mock('../db/prisma', () => ({\n  user: {\n    create: jest.fn(),\n    findUnique: jest.fn(),\n    findMany: jest.fn(),\n  },\n}));\n\n// In test:\nprisma.user.findUnique.mockResolvedValue({ id: 1, name: 'Alice' });\n\`\`\`\n\n## Test Database Setup\n\nFor integration tests, use a real database:\n1. Separate test database (DATABASE_URL_TEST)\n2. Run migrations before tests\n3. Seed test data before each test\n4. Clean up after each test\n\n\`\`\`js\nbeforeAll(async () => {\n  await prisma.$connect();\n});\n\nbeforeEach(async () => {\n  // Clean slate before each test\n  await prisma.user.deleteMany();\n});\n\nafterAll(async () => {\n  await prisma.$disconnect();\n});\n\`\`\`\n\n## Test File Structure\n\n\`\`\`\nsrc/\n├── services/\n│   └── users.js\n├── __tests__/\n│   ├── unit/\n│   │   └── users.service.test.js\n│   └── integration/\n│       └── users.api.test.js\n\`\`\``,
    codeExamples: [
      {
        title: 'API testing with Supertest',
        code: `// __tests__/integration/users.api.test.js
const request = require('supertest');
const app = require('../../src/app');
const prisma = require('../../src/db/prisma');

// Test user data factory
const createUserPayload = (overrides = {}) => ({
  name: 'Test User',
  email: \`test-\${Date.now()}@example.com\`, // unique email per test
  password: 'TestPassword123!',
  ...overrides,
});

describe('User API', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany(); // clean before each test
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/users', () => {
    it('should create a user and return 201', async () => {
      const payload = createUserPayload();

      const res = await request(app)
        .post('/api/users')
        .send(payload)
        .expect(201);

      expect(res.body).toMatchObject({
        id: expect.any(Number),
        email: payload.email,
        name: payload.name,
      });
      expect(res.body.password).toBeUndefined();
      expect(res.body.passwordHash).toBeUndefined();
    });

    it('should return 422 for invalid email', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({ ...createUserPayload(), email: 'not-an-email' })
        .expect(422);

      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return 409 for duplicate email', async () => {
      const payload = createUserPayload();
      await request(app).post('/api/users').send(payload).expect(201);
      await request(app).post('/api/users').send(payload).expect(409);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return a user by id', async () => {
      const created = await prisma.user.create({
        data: { name: 'Alice', email: 'alice@test.com', passwordHash: 'hash' },
      });

      const res = await request(app)
        .get(\`/api/users/\${created.id}\`)
        .set('Authorization', \`Bearer \${generateTestToken(created.id)}\`)
        .expect(200);

      expect(res.body.id).toBe(created.id);
    });

    it('should return 404 for non-existent user', async () => {
      await request(app)
        .get('/api/users/99999')
        .set('Authorization', \`Bearer \${generateTestToken(1)}\`)
        .expect(404);
    });
  });
});`,
        explanation: 'Import app (not server) — supertest handles listening. Use a real database with deleteMany cleanup. Generate unique emails per test to avoid conflicts.',
      },
      {
        title: 'Unit testing service logic with mocks',
        code: `// __tests__/unit/auth.service.test.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Mock dependencies
jest.mock('../db/prisma', () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock('../services/email', () => ({
  sendWelcomeEmail: jest.fn().mockResolvedValue(true),
}));

const prisma = require('../db/prisma');
const emailService = require('../services/email');
const authService = require('../services/auth');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // reset mock call history between tests
  });

  describe('register', () => {
    it('should hash password before saving', async () => {
      prisma.user.create.mockResolvedValue({
        id: 1, email: 'alice@test.com', name: 'Alice',
      });

      await authService.register({
        email: 'alice@test.com', password: 'password123', name: 'Alice',
      });

      // Verify what was passed to prisma.user.create
      const callArg = prisma.user.create.mock.calls[0][0];
      expect(callArg.data.passwordHash).toBeDefined();
      expect(callArg.data.password).toBeUndefined();
      expect(await bcrypt.compare('password123', callArg.data.passwordHash)).toBe(true);
    });

    it('should send welcome email after registration', async () => {
      prisma.user.create.mockResolvedValue({ id: 1, email: 'alice@test.com', name: 'Alice' });
      await authService.register({ email: 'alice@test.com', password: 'pw123', name: 'Alice' });
      expect(emailService.sendWelcomeEmail).toHaveBeenCalledWith('alice@test.com');
    });
  });

  describe('login', () => {
    it('should throw 401 for non-existent user', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(authService.login('unknown@test.com', 'pw')).rejects.toMatchObject({
        statusCode: 401,
      });
    });
  });
});`,
        explanation: 'jest.clearAllMocks() in beforeEach ensures test isolation. mock.calls[0][0] lets you inspect what arguments were passed to a mocked function.',
      },
    ],
    commonMistakes: [
      'Testing implementation details instead of behavior — test what the function returns, not how it does it.',
      'Not cleaning up the database between tests — tests depend on each other and fail randomly.',
      'Mocking too much in integration tests — defeats the purpose of testing the integration.',
      'Not testing error cases — only testing the happy path leaves 50% of code untested.',
      'Using the same email in multiple tests — unique constraint errors across tests.',
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between unit tests and integration tests?',
        answer: 'Unit tests test a single function/module in isolation. All dependencies (DB, APIs, email) are mocked. Fast (milliseconds), many of them, test pure logic. Integration tests test multiple layers working together — route → service → database. They use a real test database. Slower, fewer, but test that components actually work together. Both are needed: unit tests for logic coverage, integration tests for confidence the system works end-to-end.',
        difficulty: 'intermediate',
      },
      {
        question: 'How do you test an Express API?',
        answer: 'Use Supertest. Import the Express app (not server.listen) and pass it to supertest(app). Make HTTP requests with .get/.post etc., chain .expect(statusCode) and .expect(body). Tests hit your actual route handlers, middleware, and validation — just with a mock or test database. Key: export app separately from server.js so tests can import without starting a port.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'ex-node-22',
        title: 'Write API tests for a tasks endpoint',
        description: 'Write Supertest tests for POST /api/tasks (201 with title, 422 without title) and GET /api/tasks (200 with array).',
        starterCode: `const request = require('supertest');
const app = require('../../src/app');

describe('Tasks API', () => {
  describe('POST /api/tasks', () => {
    it('should create a task and return 201');
    it('should return 422 when title is missing');
  });
  describe('GET /api/tasks', () => {
    it('should return an array of tasks');
  });
});`,
        solution: `const request = require('supertest');
const app = require('../../src/app');

describe('Tasks API', () => {
  describe('POST /api/tasks', () => {
    it('should create a task and return 201', async () => {
      const res = await request(app).post('/api/tasks').send({ title: 'Test task' }).expect(201);
      expect(res.body).toMatchObject({ id: expect.anything(), title: 'Test task' });
    });
    it('should return 422 when title is missing', async () => {
      const res = await request(app).post('/api/tasks').send({}).expect(422);
      expect(res.body.error).toBeDefined();
    });
  });
  describe('GET /api/tasks', () => {
    it('should return an array', async () => {
      const res = await request(app).get('/api/tasks').expect(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });
});`,
        hints: ['Import app not server', '.expect(201) asserts status code', 'expect(Array.isArray(res.body)).toBe(true) checks array'],
      },
    ],
    keyTakeaways: [
      'Unit tests: mock everything, test logic. Integration tests: real DB, test the full flow.',
      'Use Supertest for API tests — import app (not server) to avoid port conflicts.',
      'Clean database state before each test — never share state between tests.',
      'Test error cases as much as happy paths — most bugs hide in error handling.',
      'AAA pattern: Arrange (setup), Act (call), Assert (verify)',
    ],
    prevLesson: 'nodejs-security',
    nextLesson: 'nodejs-performance',
  },

  // ─── MODULE 23: Performance ───────────────────────────────────────────────────
  {
    id: 'nodejs-performance',
    slug: 'nodejs-performance',
    title: 'Performance Optimization',
    description: 'Profile Node.js apps, detect event loop blocking, optimize memory, compress responses, and measure performance.',
    category: 'Production',
    order: 23,
    difficulty: 'advanced',
    estimatedTime: 25,
    content: `Premature optimization is the root of all evil — but deliberate, measured optimization is essential for production systems.\n\n## Profiling Node.js\n\n\`\`\`bash\n# Built-in profiler\nnode --prof server.js\nnode --prof-process isolate-*.log > profile.txt\n\n# CPU profiling with clinic.js\nnpm install -g clinic\nclinic doctor -- node server.js\nclinic flame -- node server.js  # flame graph\n\n# Memory leak detection\nclinic heapProfiler -- node server.js\n\`\`\`\n\n## Event Loop Monitoring\n\nDetect event loop lag (blocking operations):\n\n\`\`\`js\n// Measure event loop delay\nconst { monitorEventLoopDelay } = require('perf_hooks');\n\nconst h = monitorEventLoopDelay({ resolution: 20 });\nh.enable();\n\nsetInterval(() => {\n  console.log('EL delay (p99):', h.percentile(99) / 1e6, 'ms');\n  h.reset();\n}, 5000);\n\n// Alert if event loop is lagging\nlet last = Date.now();\nsetInterval(() => {\n  const now = Date.now();\n  const lag = now - last - 100; // should be ~0 if healthy\n  if (lag > 50) console.warn(\`Event loop lag: \${lag}ms\`);\n  last = now;\n}, 100);\n\`\`\`\n\n## Memory Usage\n\n\`\`\`js\n// Monitor memory in production\nfunction logMemory() {\n  const mem = process.memoryUsage();\n  console.log({\n    heapUsed: \`\${Math.round(mem.heapUsed / 1024 / 1024)}MB\`,\n    heapTotal: \`\${Math.round(mem.heapTotal / 1024 / 1024)}MB\`,\n    rss: \`\${Math.round(mem.rss / 1024 / 1024)}MB\`,\n    external: \`\${Math.round(mem.external / 1024 / 1024)}MB\`,\n  });\n}\n\nsetInterval(logMemory, 60000); // log every minute\n\`\`\`\n\n**Common memory leaks in Node.js:**\n- Global variables accumulating data (caches without eviction)\n- Event listeners not removed (EventEmitter leaks)\n- Closures holding references to large objects\n- Unclosed database connections\n- Circular references preventing garbage collection\n\n## Response Compression\n\n\`\`\`bash\nnpm install compression\n\`\`\`\n\n\`\`\`js\nconst compression = require('compression');\n\n// Compress responses larger than 1KB\napp.use(compression({ threshold: 1024 }));\n// gzip reduces JSON response size by 60-80%\n\`\`\`\n\n## Clustering — Use All CPU Cores\n\nNode.js runs on one core by default. Use the cluster module to spawn worker processes:\n\n\`\`\`js\nconst cluster = require('cluster');\nconst os = require('os');\n\nif (cluster.isPrimary) {\n  const numCPUs = os.cpus().length;\n  for (let i = 0; i < numCPUs; i++) cluster.fork();\n  cluster.on('exit', (worker) => {\n    console.warn('Worker died, restarting:', worker.process.pid);\n    cluster.fork(); // restart dead worker\n  });\n} else {\n  require('./server'); // each worker runs the server\n}\n\`\`\`\n\nIn production, use PM2 instead of manual cluster management:\n\`\`\`bash\nnpm install -g pm2\npm2 start server.js -i max  # spawn one worker per CPU\n\`\`\`\n\n## Query Optimization\n\nDatabase queries are usually the bottleneck. Key rules:\n- Index columns used in WHERE, JOIN, ORDER BY\n- Use SELECT specific columns instead of SELECT *\n- Avoid N+1 queries (use JOINs/includes)\n- Paginate large results — never return all rows\n- Use query logging in development to see what ORM generates`,
    codeExamples: [
      {
        title: 'Identifying and fixing performance issues',
        code: `const express = require('express');
const app = express();

// ❌ Slow: synchronous operation blocking event loop
app.get('/slow', (req, res) => {
  // Simulates CPU work — blocks all requests for 500ms
  const start = Date.now();
  while (Date.now() - start < 500) {} // busy wait — never do this
  res.json({ done: true });
});

// ✅ Fixed: move to worker thread
const { Worker, isMainThread } = require('worker_threads');

app.get('/fast', (req, res) => {
  const worker = new Worker(\`
    const { parentPort } = require('worker_threads');
    // Heavy computation in worker thread
    let result = 0;
    for (let i = 0; i < 1e9; i++) result += i;
    parentPort.postMessage(result);
  \`, { eval: true });

  worker.on('message', (result) => res.json({ result }));
  worker.on('error', (err) => res.status(500).json({ error: err.message }));
});

// ❌ Memory leak: listeners accumulate
function setupEvents(emitter) {
  emitter.on('data', processData); // called multiple times — adds duplicate listeners
}

// ✅ Fixed
function setupEvents(emitter) {
  emitter.removeAllListeners('data');
  emitter.on('data', processData);
}

// ❌ Memory leak: global cache without eviction
const cache = {};
function getUser(id) {
  if (!cache[id]) cache[id] = fetchUser(id); // grows forever
  return cache[id];
}

// ✅ Use LRU cache with eviction
const LRU = require('lru-cache');
const lruCache = new LRU({ max: 1000, ttl: 1000 * 60 * 5 }); // 1000 items, 5 min TTL
function getUserCached(id) {
  if (!lruCache.has(id)) lruCache.set(id, fetchUser(id));
  return lruCache.get(id);
}`,
        explanation: 'The event loop monitor, memory logging, and LRU cache pattern are all tools from production Node.js systems. Event loop lag > 100ms means something is blocking.',
      },
    ],
    commonMistakes: [
      'Optimizing without measuring — profile first, then optimize the bottleneck.',
      'Running Node.js on a single core in production — use PM2 or cluster to use all CPUs.',
      'Not compressing HTTP responses — gzip/brotli reduces JSON size by 60-80%.',
      'Global caches without size limits — grow unbounded until OOM crash.',
    ],
    interviewQuestions: [
      {
        question: 'How do you find performance bottlenecks in a Node.js app?',
        answer: 'Step 1: Measure first — use clinic.js or the built-in --prof flag to get CPU profiles. Step 2: Check event loop lag — if it is high, something is blocking the thread. Step 3: Check memory — if heapUsed grows continuously, there is a memory leak. Step 4: Check database queries — use ORM logging to find slow or N+1 queries. Common culprits: synchronous operations (readFileSync), heavy JSON parsing, N+1 queries, missing DB indexes.',
        difficulty: 'advanced',
      },
    ],
    exercises: [
      {
        id: 'ex-node-23',
        title: 'Add compression and measure response size',
        description: 'Add compression middleware to an Express app. Create a route that returns a large JSON array and compare response sizes with and without compression.',
        starterCode: `const express = require('express');
const app = express();

// TODO: add compression middleware
// Create GET /large-data that returns array of 1000 objects
// Verify Content-Encoding: gzip in response headers

app.listen(3000);`,
        solution: `const express = require('express');
const compression = require('compression');

const app = express();
app.use(compression({ threshold: 0 })); // compress everything (remove threshold for testing)

app.get('/large-data', (req, res) => {
  const data = Array.from({ length: 1000 }, (_, i) => ({
    id: i + 1, name: \`Item \${i + 1}\`, description: \`This is item number \${i + 1} with some text\`,
    category: ['A', 'B', 'C'][i % 3], value: Math.random() * 1000,
  }));
  res.json(data);
});

app.listen(3000);
// Test: curl -H "Accept-Encoding: gzip" -v http://localhost:3000/large-data | wc -c`,
        hints: ['npm install compression', 'app.use(compression()) before routes', 'threshold: 0 compresses everything (for testing)'],
      },
    ],
    keyTakeaways: [
      'Measure before optimizing — use clinic.js or --prof to find the actual bottleneck',
      'Event loop lag > 100ms means blocking code — find and move to worker thread',
      'Use compression middleware — reduces JSON response size by 60-80%',
      'PM2 or cluster module — Node.js runs on one core by default, use all cores',
      'Database queries are usually the bottleneck — index, paginate, avoid N+1',
    ],
    prevLesson: 'nodejs-testing',
    nextLesson: 'nodejs-architecture',
  },

  // ─── MODULE 24: Project Architecture ─────────────────────────────────────────
  {
    id: 'nodejs-architecture',
    slug: 'nodejs-architecture',
    title: 'Project Architecture — Scalable Backend Structure',
    description: 'Design scalable Node.js project structure with service layers, repository patterns, controllers, and modular design.',
    category: 'Architecture',
    order: 24,
    difficulty: 'advanced',
    estimatedTime: 30,
    content: `Good architecture makes a codebase maintainable as it grows. Poor architecture makes every change a game of Jenga.\n\n## The Layered Architecture\n\n\`\`\`\n┌────────────────────────────────────────┐\n│          HTTP Layer (Routes)           │  ← Express routes, middleware\n├────────────────────────────────────────┤\n│       Controller Layer                 │  ← Parse request, call service, send response\n├────────────────────────────────────────┤\n│        Service Layer                   │  ← Business logic, orchestration\n├────────────────────────────────────────┤\n│       Repository Layer                 │  ← Database access, queries\n├────────────────────────────────────────┤\n│        Database (Prisma/Mongoose)      │  ← Actual DB connection\n└────────────────────────────────────────┘\n\`\`\`\n\n**Each layer has one responsibility:**\n- Routes: define endpoints, apply middleware\n- Controllers: handle HTTP — read req, call service, write res\n- Services: business logic — no HTTP knowledge, no SQL\n- Repository: database queries — no business logic, no HTTP\n\n## Folder Structure\n\n\`\`\`\nsrc/\n├── config/\n│   ├── database.js       # DB connection\n│   ├── redis.js          # Redis connection\n│   └── env.js            # Env validation\n├── middleware/\n│   ├── auth.js           # JWT verification\n│   ├── validate.js       # Zod validation middleware\n│   ├── rateLimit.js      # Rate limiting configs\n│   └── errorHandler.js   # Centralized error handler\n├── routes/\n│   ├── index.js          # Mount all routers\n│   ├── users.js          # /api/users routes\n│   └── posts.js          # /api/posts routes\n├── controllers/\n│   ├── users.controller.js\n│   └── posts.controller.js\n├── services/\n│   ├── users.service.js\n│   ├── posts.service.js\n│   └── email.service.js\n├── repositories/\n│   ├── users.repository.js\n│   └── posts.repository.js\n├── schemas/              # Zod validation schemas\n│   ├── users.schema.js\n│   └── posts.schema.js\n├── utils/\n│   ├── asyncHandler.js\n│   ├── logger.js\n│   └── pagination.js\n├── __tests__/\n│   ├── unit/\n│   └── integration/\n├── app.js                # Express setup\n└── server.js             # Entry point\n\`\`\`\n\n## The Repository Pattern\n\nRepositories isolate database access. This makes it easy to:\n- Swap databases (PostgreSQL → MongoDB)\n- Mock in tests (mock the repository, not Prisma)\n- Add caching transparently\n\n\`\`\`js\n// repositories/users.repository.js\nconst prisma = require('../config/database');\n\nclass UserRepository {\n  async findById(id) {\n    return prisma.user.findUnique({ where: { id } });\n  }\n  async findByEmail(email) {\n    return prisma.user.findUnique({ where: { email } });\n  }\n  async create(data) {\n    return prisma.user.create({ data });\n  }\n  async update(id, data) {\n    return prisma.user.update({ where: { id }, data });\n  }\n  async delete(id) {\n    return prisma.user.delete({ where: { id } });\n  }\n  async findMany({ skip, take, where = {} }) {\n    const [data, total] = await prisma.$transaction([\n      prisma.user.findMany({ where, skip, take }),\n      prisma.user.count({ where }),\n    ]);\n    return { data, total };\n  }\n}\n\nmodule.exports = new UserRepository();\n\`\`\`\n\n## Dependency Injection\n\nInstead of importing directly, inject dependencies:\n\n\`\`\`js\n// Service receives repository as dependency\nclass UserService {\n  constructor(userRepository, emailService) {\n    this.userRepo = userRepository;\n    this.emailService = emailService;\n  }\n  async create(data) {\n    const existing = await this.userRepo.findByEmail(data.email);\n    if (existing) throw new ConflictError('Email already registered');\n    const user = await this.userRepo.create(data);\n    await this.emailService.sendWelcome(user.email);\n    return user;\n  }\n}\n\n// In tests — inject a mock repository\nconst mockRepo = { findByEmail: jest.fn(), create: jest.fn() };\nconst service = new UserService(mockRepo, mockEmailService);\n\`\`\``,
    codeExamples: [
      {
        title: 'Complete layered architecture example',
        code: `// routes/users.js
const { Router } = require('express');
const usersController = require('../controllers/users.controller');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { CreateUserSchema, UpdateUserSchema, ListQuerySchema } = require('../schemas/users.schema');
const asyncHandler = require('../utils/asyncHandler');

const router = Router();

router.get('/', validate(ListQuerySchema, 'query'), asyncHandler(usersController.list));
router.post('/', validate(CreateUserSchema), asyncHandler(usersController.create));
router.get('/:id', authenticate, asyncHandler(usersController.getById));
router.patch('/:id', authenticate, validate(UpdateUserSchema), asyncHandler(usersController.update));
router.delete('/:id', authenticate, asyncHandler(usersController.remove));

module.exports = router;

// ─────────────────────────────────────────────────────────────────────────────
// controllers/users.controller.js
const usersService = require('../services/users.service');

const list = async (req, res) => {
  const { page, limit, search } = req.query;
  const result = await usersService.list({ page, limit, search });
  res.json(result);
};

const create = async (req, res) => {
  const user = await usersService.create(req.body);
  res.status(201).json(user);
};

const getById = async (req, res) => {
  const user = await usersService.getById(req.params.id);
  res.json(user);
};

const update = async (req, res) => {
  const user = await usersService.update(req.params.id, req.body);
  res.json(user);
};

const remove = async (req, res) => {
  await usersService.delete(req.params.id);
  res.status(204).end();
};

module.exports = { list, create, getById, update, remove };

// ─────────────────────────────────────────────────────────────────────────────
// services/users.service.js
const bcrypt = require('bcrypt');
const userRepo = require('../repositories/users.repository');
const emailService = require('./email.service');
const { AppError } = require('../utils/errors');

const { paginate } = require('../utils/pagination');

async function list({ page = 1, limit = 20, search }) {
  const where = search ? { name: { contains: search, mode: 'insensitive' } } : {};
  const { data, total } = await userRepo.findMany({ ...paginate(page, limit), where });
  return { data: data.map(toPublicUser), meta: { page, limit, total, pages: Math.ceil(total / limit) } };
}

async function create(data) {
  const existing = await userRepo.findByEmail(data.email);
  if (existing) throw new AppError('Email already registered', 409, 'CONFLICT');
  const passwordHash = await bcrypt.hash(data.password, 12);
  const user = await userRepo.create({ ...data, passwordHash, password: undefined });
  await emailService.sendWelcome(user.email).catch(console.error); // don't fail registration if email fails
  return toPublicUser(user);
}

async function getById(id) {
  const user = await userRepo.findById(parseInt(id));
  if (!user) throw new AppError('User not found', 404, 'NOT_FOUND');
  return toPublicUser(user);
}

function toPublicUser(user) {
  const { passwordHash, ...publicUser } = user;
  return publicUser;
}

module.exports = { list, create, getById };`,
        explanation: 'Each layer has one job: routes wire middleware, controller handles HTTP, service has business logic, repository handles DB. This makes each layer independently testable.',
      },
    ],
    commonMistakes: [
      'Putting business logic in controllers — they become god functions that are hard to test.',
      'Calling prisma/mongoose directly from controllers — bypasses the repository layer.',
      'Returning password hashes in API responses — always strip sensitive fields in the service layer.',
      'One massive routes file — split by resource (users.js, posts.js, etc.)',
    ],
    interviewQuestions: [
      {
        question: 'What is the repository pattern and why use it?',
        answer: 'The repository pattern abstracts database access behind an interface. Services call repository methods (findById, create, update) without knowing the underlying database or ORM. Benefits: (1) Testability — mock the repository in service tests instead of mocking Prisma. (2) Replaceability — swap PostgreSQL for MongoDB by only changing the repository. (3) Caching — add cache transparently in the repository without changing service logic.',
        difficulty: 'advanced',
      },
    ],
    exercises: [
      {
        id: 'ex-node-24',
        title: 'Refactor a controller to use service and repository layers',
        description: 'Refactor this all-in-one route handler into separate controller, service, and repository files.',
        starterCode: `// Currently all in one route:
router.post('/users', async (req, res) => {
  const { email, name, password } = req.body;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ error: 'Email taken' });
  const hash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({ data: { email, name, passwordHash: hash } });
  await sendWelcomeEmail(user.email);
  const { passwordHash, ...safe } = user;
  res.status(201).json(safe);
});`,
        solution: `// repository/users.repo.js
const findByEmail = (email) => prisma.user.findUnique({ where: { email } });
const create = (data) => prisma.user.create({ data });

// service/users.service.js
const create = async ({ email, name, password }) => {
  if (await repo.findByEmail(email)) throw new AppError('Email taken', 409);
  const hash = await bcrypt.hash(password, 12);
  const user = await repo.create({ email, name, passwordHash: hash });
  await emailService.sendWelcome(user.email).catch(() => {});
  const { passwordHash, ...safe } = user;
  return safe;
};

// controller/users.ctrl.js
const create = async (req, res) => {
  const user = await userService.create(req.body);
  res.status(201).json(user);
};

// route
router.post('/users', asyncHandler(usersCtrl.create));`,
        hints: ['Repository: only DB calls', 'Service: business logic, calls repo', 'Controller: only req/res handling'],
      },
    ],
    keyTakeaways: [
      'Layered architecture: routes → controller → service → repository → database',
      'Controllers handle HTTP only — no business logic, no SQL',
      'Services contain business logic — no req/res knowledge',
      'Repositories abstract database — services never call Prisma directly',
      'Each layer is independently testable and replaceable',
    ],
    prevLesson: 'nodejs-performance',
    nextLesson: 'nodejs-deployment',
  },

  // ─── MODULE 25: Production Deployment ────────────────────────────────────────
  {
    id: 'nodejs-deployment',
    slug: 'nodejs-deployment',
    title: 'Production Deployment',
    description: 'Deploy Node.js apps with Docker, environment configuration, PM2, reverse proxy, logging, monitoring, and scaling.',
    category: 'Production',
    order: 25,
    difficulty: 'advanced',
    estimatedTime: 30,
    content: `This module references the DevOps track for Docker basics. We focus on Node.js-specific deployment concerns.\n\n## Environment Configuration\n\n\`\`\`js\n// config/env.js — validate on startup\nconst { z } = require('zod');\n\nconst envSchema = z.object({\n  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),\n  PORT: z.coerce.number().default(3000),\n  DATABASE_URL: z.string().url(),\n  JWT_ACCESS_SECRET: z.string().min(32),\n  JWT_REFRESH_SECRET: z.string().min(32),\n  REDIS_URL: z.string().optional(),\n});\n\nconst env = envSchema.parse(process.env);\nmodule.exports = env;\n// Throws at startup if any required env var is missing\n\`\`\`\n\n## Dockerfile for Node.js\n\n\`\`\`dockerfile\n# Multi-stage build — keep production image small\nFROM node:20-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --omit=dev\nCOPY . .\nRUN npm run build  # TypeScript compilation\n\nFROM node:20-alpine AS production\nWORKDIR /app\n# Copy only what is needed\nCOPY --from=builder /app/node_modules ./node_modules\nCOPY --from=builder /app/dist ./dist\nCOPY package.json ./\n\n# Non-root user for security\nRUN addgroup -S nodeapp && adduser -S nodeapp -G nodeapp\nUSER nodeapp\n\nEXPOSE 3000\nCMD [\"node\", \"dist/server.js\"]\n\`\`\`\n\n## PM2 — Process Manager\n\nPM2 manages Node.js processes in production:\n\n\`\`\`bash\nnpm install -g pm2\n\npm2 start dist/server.js --name api --instances max  # cluster mode\npm2 restart api\npm2 reload api   # zero-downtime reload\npm2 stop api\npm2 logs api\npm2 monit        # real-time monitoring\npm2 startup      # auto-start on server reboot\n\`\`\`\n\n**ecosystem.config.js** for PM2 configuration:\n\`\`\`js\nmodule.exports = {\n  apps: [{\n    name: 'api',\n    script: 'dist/server.js',\n    instances: 'max',      // one per CPU\n    exec_mode: 'cluster',\n    env_production: {\n      NODE_ENV: 'production',\n      PORT: 3000,\n    },\n    max_memory_restart: '512M', // restart if OOM\n    error_file: 'logs/pm2-error.log',\n    out_file: 'logs/pm2-out.log',\n    log_date_format: 'YYYY-MM-DD HH:mm:ss',\n  }]\n};\n\`\`\`\n\n## Reverse Proxy (Nginx)\n\nNginx sits in front of Node.js and handles:\n- SSL/TLS termination\n- Static file serving\n- Load balancing\n- Compression\n- Rate limiting\n\n\`\`\`nginx\nserver {\n  listen 443 ssl;\n  server_name api.myapp.com;\n\n  location / {\n    proxy_pass http://localhost:3000;\n    proxy_http_version 1.1;\n    proxy_set_header Upgrade $http_upgrade;\n    proxy_set_header Connection 'upgrade'; # for WebSocket\n    proxy_set_header Host $host;\n    proxy_set_header X-Real-IP $remote_addr;\n    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n    proxy_set_header X-Forwarded-Proto $scheme;\n    proxy_cache_bypass $http_upgrade;\n  }\n}\n\`\`\`\n\n## Health Checks\n\n\`\`\`js\n// Simple health check\napp.get('/health', (req, res) => {\n  res.json({ status: 'ok', uptime: process.uptime() });\n});\n\n// Deep health check (check DB, Redis)\napp.get('/health/deep', async (req, res) => {\n  const checks = {};\n  try {\n    await prisma.$queryRaw\`SELECT 1\`;\n    checks.database = 'ok';\n  } catch {\n    checks.database = 'error';\n  }\n  try {\n    await redis.ping();\n    checks.redis = 'ok';\n  } catch {\n    checks.redis = 'error';\n  }\n  const healthy = Object.values(checks).every(v => v === 'ok');\n  res.status(healthy ? 200 : 503).json({ checks });\n});\n\`\`\`\n\n## Graceful Shutdown\n\n\`\`\`js\nconst server = app.listen(PORT);\n\nprocess.on('SIGTERM', async () => {\n  console.log('Received SIGTERM — shutting down gracefully');\n  // Stop accepting new connections\n  server.close(async () => {\n    await prisma.$disconnect();\n    await redis.quit();\n    process.exit(0);\n  });\n  // Force close after 30s\n  setTimeout(() => process.exit(1), 30000);\n});\n\`\`\``,
    codeExamples: [
      {
        title: 'Production-ready server.js',
        code: `const app = require('./app');
const { logger } = require('./utils/logger');
const prisma = require('./config/database');
const redis = require('./config/redis');
const env = require('./config/env');

let server;

async function startServer() {
  // Validate database connection before listening
  try {
    await prisma.$connect();
    logger.info('Database connected');
  } catch (err) {
    logger.error('Database connection failed', { error: err.message });
    process.exit(1);
  }

  server = app.listen(env.PORT, () => {
    logger.info(\`Server started\`, {
      port: env.PORT,
      env: env.NODE_ENV,
      pid: process.pid,
    });
  });
}

function gracefulShutdown(signal) {
  logger.info(\`Received \${signal} — initiating graceful shutdown\`);

  if (!server) return process.exit(0);

  server.close(async () => {
    logger.info('HTTP server closed');
    try {
      await prisma.$disconnect();
      await redis.quit();
      logger.info('Connections closed — exiting');
      process.exit(0);
    } catch (err) {
      logger.error('Error during shutdown', { error: err.message });
      process.exit(1);
    }
  });

  // Force exit after 30 seconds
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 30000).unref();
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled rejection', { reason });
  gracefulShutdown('unhandledRejection');
});

startServer();`,
        explanation: 'Test DB connection before listening. Graceful shutdown lets in-flight requests complete. .unref() on the force-exit timer means it does not keep the process alive if everything shuts down cleanly.',
      },
    ],
    commonMistakes: [
      'Not validating env vars at startup — fails mid-request when the missing var is accessed.',
      'Running as root in Docker — security risk. Use a non-root user.',
      'Not handling SIGTERM — Kubernetes/Docker sends SIGTERM and waits 30s, then force-kills.',
      'Copying node_modules in Docker — slow builds. Use npm ci in the Dockerfile.',
    ],
    interviewQuestions: [
      {
        question: 'What is graceful shutdown in Node.js?',
        answer: 'Graceful shutdown means stopping the server cleanly: stop accepting new connections (server.close()), wait for in-flight requests to complete, close database connections and Redis clients, then exit. This is important in containerized environments (Kubernetes) which send SIGTERM before killing the process. Without graceful shutdown, in-flight requests fail and database connections leak.',
        difficulty: 'advanced',
      },
      {
        question: 'What is PM2 and why use it?',
        answer: 'PM2 is a production process manager for Node.js. It provides: cluster mode (one process per CPU core), automatic restart on crash, zero-downtime reload, log management, monitoring dashboard, and startup scripts (auto-restart on server reboot). Alternative to PM2: deploy in Docker/Kubernetes where the orchestration layer handles restarts and scaling.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'ex-node-25',
        title: 'Write a Dockerfile for a Node.js TypeScript app',
        description: 'Write a multi-stage Dockerfile that builds TypeScript to JS in a builder stage, then copies only production artifacts to the final image. Use non-root user.',
        starterCode: `# Multi-stage Dockerfile for Node.js + TypeScript
# Stage 1: Builder — install all deps and compile TypeScript
# Stage 2: Production — only production node_modules + compiled JS

# Hint: FROM node:20-alpine
# Hint: npm ci --omit=dev for production stage`,
        solution: `FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=builder /app/dist ./dist
RUN addgroup -S app && adduser -S app -G app
USER app
EXPOSE 3000
CMD ["node", "dist/server.js"]`,
        hints: ['Two FROM statements = two stages', 'COPY --from=builder copies from first stage', 'npm ci --omit=dev skips devDependencies in production'],
      },
    ],
    keyTakeaways: [
      'Validate all env vars at startup — fail fast, not mid-request',
      'Multi-stage Docker builds: builder (compile) + production (lean image)',
      'Graceful shutdown: stop accepting → drain in-flight → close DB → exit',
      'PM2 cluster mode uses all CPU cores — essential for Node.js production',
      'Health check endpoints enable load balancers to detect failures',
    ],
    prevLesson: 'nodejs-architecture',
    nextLesson: 'nodejs-interview',
  },

  // ─── MODULE 26: Interview Preparation ────────────────────────────────────────
  {
    id: 'nodejs-interview',
    slug: 'nodejs-interview',
    title: 'Node.js Interview Preparation',
    description: 'Comprehensive interview prep covering event loop, streams, Express, auth, architecture, and scenario-based questions.',
    category: 'Interview Prep',
    order: 26,
    difficulty: 'intermediate',
    estimatedTime: 40,
    content: `This module consolidates the most important interview topics and common question patterns for Node.js roles.\n\n## How Node.js Interviews Work\n\nMost companies test across three areas:\n1. **Conceptual** — do you understand how Node.js works internally?\n2. **Practical** — can you write real backend code?\n3. **Architectural** — can you design systems and make tradeoffs?\n\n## Most Frequently Asked Topics\n\n### Event Loop (Almost Always Asked)\n- How the event loop works and its phases\n- Execution order: sync → nextTick → Promises → setImmediate → setTimeout\n- What blocks the event loop\n- Libuv thread pool\n\n### Streams\n- What they are and why they exist\n- Types: Readable, Writable, Duplex, Transform\n- Backpressure\n- pipe vs pipeline\n\n### Modules\n- CommonJS vs ES Modules differences\n- How require() resolution works\n- Module caching\n\n### Authentication\n- Sessions vs JWT\n- JWT structure and what the payload contains\n- Refresh token pattern\n- Why not store JWT in localStorage\n\n### Express\n- Middleware and the request lifecycle\n- Error handling (4-parameter middleware)\n- What frameworks add on top of the http module\n\n### Architecture\n- Layered architecture (routes, controllers, services, repositories)\n- Why separate concerns\n- Repository pattern\n- When to use microservices vs monolith\n\n## Scenario-Based Questions\n\nThese test your ability to reason, not memorize:\n\n**"Our Node.js API slows down under load. How would you debug it?"**\nAnswer flow: Measure first (clinic.js, profiler) → check event loop lag → check memory → check DB queries (N+1?) → check external API calls → check missing indexes → consider clustering.\n\n**"Users are getting logged out randomly. What could cause this?"**\nAnswer flow: JWT expiry (short-lived) → refresh token not working → refresh token stored in DB and DB is down → rate limiting the refresh endpoint → cookie settings (SameSite, Secure, httpOnly) → sessions in memory not shared across servers.\n\n**"We need to send 100,000 emails after a marketing campaign. How?"**\nAnswer flow: Job queue (BullMQ) → not in request handler → workers process in batches → rate limit per email provider → retry on failure → progress tracking → notify when complete.\n\n**"Our database is the bottleneck at peak traffic. What do you do?"**\nAnswer flow: Add caching (Redis) for read-heavy data → index missing columns → paginate unbounded queries → read replicas for reads → connection pooling tuned → consider CQRS for complex reads.\n\n## Code Questions You May See\n\n1. Implement a rate limiter using in-memory store\n2. Implement a simple event emitter\n3. Implement middleware that retries failed DB connections\n4. Flatten a nested object\n5. Implement async retry with exponential backoff\n6. Explain the output of event loop ordering code\n7. Build a simple HTTP server without Express\n8. Implement a connection pool\n\n## What Interviewers Actually Look For\n\n- **Understanding over memorization**: Can you reason about why things work the way they do?\n- **Production awareness**: Do you think about error handling, security, and scale?\n- **Communication**: Can you explain complex concepts clearly?\n- **Trade-offs**: Do you understand when NOT to use a pattern?\n- **Honesty**: Saying "I don't know but I would approach it this way" is better than guessing.`,
    codeExamples: [
      {
        title: 'Classic interview: implement retry with exponential backoff',
        code: `// Implement a retry function with exponential backoff
// Usage: await retry(() => fetchData(), { attempts: 3, delay: 1000 })

async function retry(fn, options = {}) {
  const { attempts = 3, delay = 1000, factor = 2, onRetry } = options;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === attempts) throw err; // last attempt — rethrow

      const waitMs = delay * Math.pow(factor, attempt - 1);
      if (onRetry) onRetry(err, attempt, waitMs);

      await new Promise(resolve => setTimeout(resolve, waitMs));
    }
  }
}

// Usage
const data = await retry(
  () => fetch('https://flaky-api.com/data').then(r => r.json()),
  {
    attempts: 4,
    delay: 500,         // 500ms, 1000ms, 2000ms
    onRetry: (err, attempt, waitMs) => {
      console.log(\`Attempt \${attempt} failed. Retrying in \${waitMs}ms:\`, err.message);
    },
  }
);

// Also useful for DB reconnection:
const db = await retry(() => prisma.$connect(), { attempts: 5, delay: 2000 });`,
        explanation: 'Exponential backoff prevents thundering herd: if all clients retry at once, they overwhelm the recovering service. The wait doubles each attempt.',
      },
      {
        title: 'Classic interview: implement a simple event emitter',
        code: `class SimpleEventEmitter {
  constructor() {
    this._events = {};
  }

  on(event, listener) {
    if (!this._events[event]) {
      this._events[event] = [];
    }
    this._events[event].push(listener);
    return this; // enable chaining
  }

  once(event, listener) {
    const wrapper = (...args) => {
      listener(...args);
      this.off(event, wrapper);
    };
    return this.on(event, wrapper);
  }

  off(event, listener) {
    if (this._events[event]) {
      this._events[event] = this._events[event].filter(l => l !== listener);
    }
    return this;
  }

  emit(event, ...args) {
    if (this._events[event]) {
      // Copy array — listeners may modify _events[event] during emit
      [...this._events[event]].forEach(listener => listener(...args));
    }
    return this;
  }

  removeAllListeners(event) {
    if (event) {
      delete this._events[event];
    } else {
      this._events = {};
    }
    return this;
  }
}

// Test it
const emitter = new SimpleEventEmitter();
emitter.on('greet', name => console.log(\`Hello, \${name}!\`));
emitter.once('init', () => console.log('Initialized'));
emitter.emit('greet', 'Alice'); // Hello, Alice!
emitter.emit('init');           // Initialized
emitter.emit('init');           // nothing — once removed it`,
        explanation: 'Copy the listener array before iterating — a listener might call off() during emit, modifying the array while you iterate it.',
      },
      {
        title: 'Classic interview: rate limiter (in-memory)',
        code: `class RateLimiter {
  constructor(maxRequests, windowMs) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map(); // ip → [timestamp, ...]
  }

  isAllowed(key) {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    if (!this.requests.has(key)) {
      this.requests.set(key, [now]);
      return { allowed: true, remaining: this.maxRequests - 1 };
    }

    // Remove timestamps outside the window
    const timestamps = this.requests.get(key).filter(t => t > windowStart);
    timestamps.push(now);
    this.requests.set(key, timestamps);

    const count = timestamps.length;
    const allowed = count <= this.maxRequests;
    return {
      allowed,
      remaining: Math.max(0, this.maxRequests - count),
      resetAt: new Date(timestamps[0] + this.windowMs),
    };
  }
}

// As Express middleware
function rateLimitMiddleware(maxRequests, windowMs) {
  const limiter = new RateLimiter(maxRequests, windowMs);

  return (req, res, next) => {
    const key = req.ip || 'unknown';
    const { allowed, remaining, resetAt } = limiter.isAllowed(key);

    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', remaining);

    if (!allowed) {
      res.setHeader('Retry-After', Math.ceil((resetAt - Date.now()) / 1000));
      return res.status(429).json({ error: 'Too many requests' });
    }

    next();
  };
}`,
        explanation: 'Sliding window rate limiter. Note: this in-memory version does not work across multiple server instances — use Redis for distributed rate limiting in production.',
      },
    ],
    commonMistakes: [
      'Only studying theory without writing code — interviewers ask you to implement things.',
      'Memorizing answers without understanding — follow-up questions expose this immediately.',
      'Not mentioning production concerns (error handling, scaling) — junior vs senior differentiation.',
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between process.nextTick and setImmediate?',
        answer: 'process.nextTick() fires at the end of the current operation, before the event loop continues to the next phase — it fires before Promises and before setImmediate. setImmediate() fires in the check phase of the event loop, after I/O events. nextTick can starve the event loop if called recursively (infinite nextTick = nothing else runs). setImmediate is safer for recursive operations.',
        difficulty: 'advanced',
        tip: 'Show the order: current operation → nextTick queue → Promise microtasks → setImmediate (check phase) → setTimeout (timers phase).',
      },
      {
        question: 'Explain the concept of backpressure in Node.js streams.',
        answer: 'Backpressure occurs when a readable stream produces data faster than the writable stream can consume it. Without backpressure control, data accumulates in memory, leading to OOM crashes. In Node.js, writable.write() returns false when its buffer is full, signaling the readable to pause via readable.pause(). When the writable drains, it emits "drain", and the readable resumes. pipe() and pipeline() handle this automatically — another reason to prefer them over manual event handling.',
        difficulty: 'advanced',
      },
      {
        question: 'When would you use microservices vs a monolith in Node.js?',
        answer: 'Start with a monolith. Microservices add operational complexity: inter-service communication, distributed tracing, multiple deployments, network latency, eventual consistency. Switch to microservices when: specific services need independent scaling (payment vs. recommendations), teams need autonomous deployment, different services have different reliability requirements, or bounded contexts are very clearly defined. For most startups and small teams, a well-structured monolith is the right choice.',
        difficulty: 'advanced',
      },
    ],
    exercises: [
      {
        id: 'ex-node-26',
        title: 'Implement async retry with backoff',
        description: 'Implement a retry() function that retries an async operation N times with exponential backoff. It should throw on the last failure.',
        starterCode: `async function retry(fn, { attempts = 3, delay = 1000, factor = 2 } = {}) {
  // Try fn up to 'attempts' times
  // On failure wait delay * factor^(attempt-1) ms before next try
  // Throw the last error if all attempts fail
}

// Test
retry(() => {
  if (Math.random() < 0.7) throw new Error('Flaky');
  return 'success';
}, { attempts: 5, delay: 100 }).then(console.log).catch(console.error);`,
        solution: `async function retry(fn, { attempts = 3, delay = 1000, factor = 2 } = {}) {
  for (let i = 1; i <= attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === attempts) throw err;
      await new Promise(r => setTimeout(r, delay * Math.pow(factor, i - 1)));
    }
  }
}`,
        hints: ['Use a for loop from 1 to attempts', 'throw on last attempt', 'Math.pow(factor, attempt-1) gives 1, 2, 4, 8...'],
      },
    ],
    keyTakeaways: [
      'Event loop execution order is the most asked Node.js interview topic — know it cold',
      'Interviewers test: theory + implementation + production thinking + trade-offs',
      'Scenario questions test engineering judgment — talk through your reasoning',
      'Implement common patterns from scratch: EventEmitter, rate limiter, retry',
      'Production awareness (error handling, scaling, security) separates junior from senior',
    ],
    prevLesson: 'nodejs-deployment',
    nextLesson: 'nodejs-revision',
  },

  // ─── MODULE 29: Revision Hub ──────────────────────────────────────────────────
  {
    id: 'nodejs-revision',
    slug: 'nodejs-revision',
    title: 'Revision Hub — Node.js Cheat Sheets',
    description: 'Quick reference for the entire Node.js track: event loop, streams, Express, authentication, architecture, and interview essentials.',
    category: 'Revision',
    order: 27,
    difficulty: 'beginner',
    estimatedTime: 20,
    content: `## Node.js Core Cheat Sheet\n\n\`\`\`\nNode.js = V8 (JS engine) + libuv (async I/O) + built-in APIs\n\nGlobal objects: process, Buffer, console, setTimeout, setImmediate\nprocess.env       — environment variables\nprocess.argv      — command-line arguments\nprocess.exit(0)   — exit successfully\nprocess.exit(1)   — exit with error\n__dirname         — current file's directory (CJS only)\n__filename        — current file's full path (CJS only)\n\`\`\`\n\n## Event Loop Cheat Sheet\n\n\`\`\`\nExecution order:\n1. Synchronous code (call stack)\n2. process.nextTick callbacks\n3. Promise microtasks (.then, async/await)\n4. setImmediate (check phase)\n5. setTimeout / setInterval (timers phase)\n6. I/O callbacks\n\nPhases: timers → pending callbacks → poll → check → close\nBetween every phase: drain nextTick queue, then drain Promise queue\n\nLibuv thread pool (default 4 threads):\n— File system, crypto, DNS, zlib\n— NOT network I/O (kernel handles async)\n\nEvent loop blockers (AVOID in request handlers):\n— readFileSync, writeFileSync\n— crypto.pbkdf2Sync\n— JSON.parse on large data\n— CPU-heavy for loops\n\`\`\`\n\n## Modules Cheat Sheet\n\n\`\`\`\nCommonJS (default):       ES Modules:\nrequire('./module')       import { x } from './module.js'\nmodule.exports = {}       export const x = ...\nsynchronous               asynchronous / static\n__dirname works           use fileURLToPath(import.meta.url)\n\nEnable ESM: "type": "module" in package.json or .mjs extension\nModule cache: require() returns cached module — singletons\n\`\`\`\n\n## Streams Cheat Sheet\n\n\`\`\`\nReadable  — source (fs.createReadStream, HTTP request)\nWritable  — destination (fs.createWriteStream, HTTP response)\nDuplex    — both (net.Socket, TCP connections)\nTransform — read + modify + write (zlib.createGzip, crypto)\n\npipe():     readable.pipe(writable) — no error propagation\npipeline(): await pipeline(r, t, w) — error propagation (USE THIS)\n\nBackpressure: writable.write() returns false when buffer full\n              emit 'drain' when buffer empties → resume readable\n\nojectMode: true — stream objects instead of Buffers\n\`\`\`\n\n## Express Cheat Sheet\n\n\`\`\`\nMiddleware order: top to bottom, applied in app.use() order\n\napp.use(fn)             — all routes, all methods (prefix match)\napp.get('/path', fn)    — GET only (exact match)\napp.post/put/patch/delete\n\nMiddleware signature:     (req, res, next)\nError handler signature:  (err, req, res, next) — MUST have 4 params\n\ncall next()      — pass to next middleware\ncall next(err)   — pass to error handler\ndon't call next  — end the chain here\n\nres.json(data)          — send JSON\nres.status(201).json()  — with status\nres.status(204).end()   — no body\nres.redirect('/url')    — redirect\n\`\`\`\n\n## Authentication Cheat Sheet\n\n\`\`\`\nJWT structure: header.payload.signature (base64url encoded)\nPayload claims: sub (user id), email, role, iat, exp\n\nAccess token:  short-lived (15 min), in response body, in memory\nRefresh token: long-lived (7 days), in httpOnly cookie only\n\nLogin flow:\n1. Verify email + bcrypt.compare(password, hash)\n2. Generate access + refresh token\n3. Store refresh token in DB + send in httpOnly cookie\n4. Return access token in response\n\nRefresh flow:\n1. Read refresh token from cookie\n2. Verify against DB record\n3. Issue new access token\n\nLogout: delete refresh token from DB + clear cookie\n\nPassword: bcrypt.hash(password, 12) — NEVER store plain text\n\`\`\`\n\n## REST API Cheat Sheet\n\n\`\`\`\nHTTP Methods:\nGET    /users         — list\nPOST   /users         — create → 201\nGET    /users/:id     — get one\nPUT    /users/:id     — replace (idempotent)\nPATCH  /users/:id     — partial update\nDELETE /users/:id     — delete → 204\n\nStatus codes:\n200 OK, 201 Created, 204 No Content\n400 Bad Request, 401 Unauthorized, 403 Forbidden\n404 Not Found, 409 Conflict, 422 Validation, 429 Rate Limited\n500 Server Error, 503 Service Unavailable\n\nPagination: ?page=2&limit=20 → OFFSET=(page-1)*limit, TAKE=limit\n\`\`\`\n\n## Security Cheat Sheet\n\n\`\`\`\nHelmet    — security HTTP headers (XSS, clickjacking, MIME sniff)\nCORS      — restrict allowed origins, never * with credentials\nRate limit — /auth/login: 5/15min, /api: 100/15min\nbcrypt    — password hashing, cost=12\nParameterized queries — prevent SQL injection\nhttpOnly cookies — store refresh tokens, not localStorage\nenv vars  — all secrets in environment variables, never in code\nnpm audit — run in CI, fix critical vulnerabilities\n\`\`\`\n\n## Architecture Cheat Sheet\n\n\`\`\`\nLayers: Routes → Controller → Service → Repository → Database\n\nRoute:      app.get('/', auth, validate, asyncHandler(ctrl.list))\nController: reads req → calls service → writes res\nService:    business logic, no req/res, no SQL\nRepository: database queries only, no business logic\n\nError types:\n  Operational: expected (400, 404, 409) → catch and return response\n  Programming: bugs (500) → log and restart\n\nJob queue: slow/unreliable work → add to BullMQ → return 202 immediately\nCache:     Redis cache-aside pattern → invalidate on write\nWebSocket: Socket.IO → rooms for groups → Redis adapter for multi-server\n\`\`\`\n\n## Interview Quick Reference\n\n\`\`\`\nTop 10 questions:\n1. How does the event loop work? (phases + execution order)\n2. Blocking vs non-blocking I/O\n3. CommonJS vs ES Modules\n4. JWT vs Sessions\n5. What is middleware in Express?\n6. How do streams work? What is backpressure?\n7. N+1 query problem\n8. How do you handle errors in Express?\n9. How would you scale a Node.js app?\n10. When would you use a job queue?\n\`\`\``,
    codeExamples: [
      {
        title: 'The 5 patterns every Node.js developer must know',
        code: `// 1. Async error handler wrapper
const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// 2. Cache-aside pattern
async function getCached(key, fetcher, ttl = 3600) {
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);
  const data = await fetcher();
  await redis.setex(key, ttl, JSON.stringify(data));
  return data;
}

// 3. Retry with backoff
async function retry(fn, { attempts = 3, delay = 1000, factor = 2 } = {}) {
  for (let i = 1; i <= attempts; i++) {
    try { return await fn(); }
    catch (err) {
      if (i === attempts) throw err;
      await new Promise(r => setTimeout(r, delay * Math.pow(factor, i - 1)));
    }
  }
}

// 4. Paginate helper
function paginate(page = 1, limit = 20) {
  const p = Math.max(1, parseInt(page));
  const l = Math.min(100, Math.max(1, parseInt(limit)));
  return { skip: (p - 1) * l, take: l };
}

// 5. Graceful shutdown
function gracefulShutdown(server) {
  return (signal) => {
    console.log(\`Received \${signal}\`);
    server.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 30000).unref();
  };
}
process.on('SIGTERM', gracefulShutdown(server));
process.on('SIGINT', gracefulShutdown(server));`,
        explanation: 'These 5 utility patterns appear in almost every production Node.js codebase. Know them by heart.',
      },
    ],
    commonMistakes: [],
    interviewQuestions: [
      {
        question: 'What are the key things to check when a Node.js API is slow?',
        answer: 'In order: (1) Check event loop lag — if high, something is blocking the thread (sync I/O, heavy JSON, regex). (2) Check database query logs — N+1 queries, missing indexes, full table scans. (3) Check memory — if heapUsed grows continuously, there is a memory leak. (4) Check external API calls — are they timing out? Use circuit breakers. (5) Check connection pool settings — too few DB connections = requests queue up. (6) Check if clustering is enabled — single core vs all cores.',
        difficulty: 'advanced',
      },
    ],
    exercises: [],
    keyTakeaways: [
      'Event loop order: sync → nextTick → Promises → setImmediate → setTimeout',
      'JWT: stateless, short-lived access + long-lived refresh in httpOnly cookie',
      'Architecture: routes → controller (HTTP) → service (logic) → repository (DB)',
      'Security stack: helmet + cors + rate-limit + bcrypt + parameterized queries + env vars',
      'Production: env validation on startup + graceful shutdown + PM2 cluster + health checks',
    ],
    prevLesson: 'nodejs-interview',
  },
];
