import type { Lesson } from '@/types';

export const lessons: Lesson[] = [
  {
    id: 'what-is-javascript',
    slug: 'what-is-javascript',
    title: 'What is JavaScript?',
    description: 'Understand what JavaScript is, how it runs, and why it matters.',
    category: 'Fundamentals',
    order: 1,
    difficulty: 'beginner',
    estimatedTime: 10,
    content: `JavaScript is a **high-level, interpreted programming language** that runs in browsers and on servers (via Node.js). It was created in 1995 by Brendan Eich in just 10 days, originally called Mocha, then LiveScript, and finally JavaScript.\n\n**Real-world analogy:** Think of a webpage like a house. HTML is the structure (walls, floors), CSS is the decoration (paint, furniture), and JavaScript is the electricity — it makes things work and respond.\n\nJavaScript is the only language that runs natively in every browser. It can manipulate the DOM (the visual page), talk to servers (fetch data), store data locally, and with Node.js it can also run as a backend server.\n\n**How it works:** Your browser has a JavaScript engine (Chrome uses V8, Firefox uses SpiderMonkey). When you load a page, the engine reads your JS code, compiles it just-in-time, and executes it. Modern JS engines are incredibly fast.\n\nJavaScript is **single-threaded** — it can only do one thing at a time. But it uses an **event loop** to handle async operations like fetching data without blocking the page.`,
    codeExamples: [
      {
        title: 'Your first JavaScript',
        code: `// This runs in the browser console or Node.js
console.log("Hello, World!");
console.log(2 + 2); // 4
console.log("JavaScript".length); // 10`,
        output: 'Hello, World!\n4\n10',
        explanation: 'console.log() prints values to the console — your main debugging tool.',
      },
      {
        title: 'JavaScript in a browser',
        code: `// In an HTML file:
// <script src="app.js"></script>
// Or inline:
// <script>
//   alert("I am JavaScript!");
// </script>

// In Node.js (terminal):
// node app.js`,
        explanation: 'JS runs in browsers (via <script> tags) or in Node.js via the terminal.',
      },
      {
        title: 'JavaScript can do everything',
        code: `// Manipulate the page
document.title = "Changed by JS!";

// Do math
Math.random(); // 0.7341...

// Work with data
const user = { name: "Alice", age: 25 };
console.log(user.name); // Alice

// Fetch data from the internet
fetch('https://api.example.com/data')
  .then(res => res.json())
  .then(data => console.log(data));`,
        explanation: 'JS can change the page, do math, handle data, and communicate with servers.',
      },
    ],
    commonMistakes: [
      'Confusing JavaScript with Java — they are completely different languages.',
      'Thinking JS is only for browsers — Node.js lets you run it anywhere.',
      'Not using the browser console for debugging — it is your best friend.',
    ],
    interviewQuestions: [
      {
        question: 'What is JavaScript and what makes it unique?',
        answer: 'JavaScript is a high-level, interpreted, dynamically-typed language that is the only language natively supported by all browsers. It is unique because it is single-threaded but handles async operations via the event loop, supports both OOP and functional programming, and runs on both client (browser) and server (Node.js).',
        difficulty: 'beginner',
      },
      {
        question: 'What is the difference between JavaScript and ECMAScript?',
        answer: 'ECMAScript (ES) is the specification/standard that defines the language. JavaScript is the most popular implementation of that standard. When we say ES6 or ES2015, we mean version 6 of the ECMAScript specification.',
        difficulty: 'beginner',
      },
      {
        question: 'Is JavaScript single-threaded? How does it handle async operations?',
        answer: 'Yes, JavaScript is single-threaded — one call stack, one operation at a time. It handles async operations through the event loop: async tasks (like fetch, setTimeout) are handed off to Web APIs, and their callbacks are queued in the callback/microtask queue. When the call stack is empty, the event loop pushes queued callbacks in.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'ex-js-1',
        title: 'Hello World',
        description: 'Write a console.log that prints your name and the current year.',
        starterCode: `// Print your name and the current year
// Expected output: "My name is [name] and the year is [year]"
`,
        solution: `console.log("My name is Alice and the year is 2024");
// Or dynamically:
const name = "Alice";
const year = new Date().getFullYear();
console.log(\`My name is \${name} and the year is \${year}\`);`,
        hints: ['Use console.log()', 'You can use a template literal with backticks'],
        expectedOutput: 'My name is Alice and the year is 2024',
      },
      {
        id: 'ex-js-2',
        title: 'Basic Math',
        description: 'Use console.log to print the result of 15 * 4 + 10 / 2.',
        starterCode: `// Print the result of: 15 * 4 + 10 / 2
`,
        solution: `console.log(15 * 4 + 10 / 2); // 65`,
        hints: ['Multiplication and division happen before addition'],
        expectedOutput: '65',
      },
    ],
    keyTakeaways: [
      'JavaScript runs in browsers and on servers (Node.js)',
      'It is the only language natively supported by all browsers',
      'Single-threaded but handles async via the event loop',
      'ECMAScript is the specification; JavaScript is the implementation',
    ],
    nextLesson: 'variables',
  },
  {
    id: 'variables',
    slug: 'variables',
    title: 'Variables: var, let, const',
    description: 'Learn how to store data with var, let, and const — and when to use each.',
    category: 'Fundamentals',
    order: 2,
    difficulty: 'beginner',
    estimatedTime: 15,
    content: `Variables are **named containers for storing data**. In JavaScript there are three ways to declare them: \`var\`, \`let\`, and \`const\`.\n\n**Real-world analogy:** A variable is like a labeled box. \`const\` is a sealed box (can't reassign), \`let\` is an open box you can swap contents in, and \`var\` is an old-style box with confusing scoping rules.\n\n**const** — Use this by default. The variable binding cannot be reassigned. Note: for objects and arrays, the contents can still change.\n\n**let** — Use when you need to reassign the variable (like a counter in a loop).\n\n**var** — Avoid in modern code. It is function-scoped (not block-scoped), gets hoisted to the top of the function, and can lead to bugs.\n\n**Hoisting:** \`var\` declarations are moved to the top of their scope during compilation but not their assignments. \`let\` and \`const\` are in the **Temporal Dead Zone (TDZ)** — they exist in scope but cannot be accessed before their declaration line.`,
    codeExamples: [
      {
        title: 'var vs let vs const',
        code: `const PI = 3.14159; // Cannot reassign
let count = 0;       // Can reassign
count = 1;           // OK

var oldWay = "avoid this"; // Function-scoped, avoid

// const with objects - the binding is const, not the content
const user = { name: "Alice" };
user.name = "Bob"; // OK! Object content can change
// user = {}; // ERROR: cannot reassign the binding`,
        explanation: 'const prevents reassignment of the variable binding, not mutation of objects.',
      },
      {
        title: 'Block scope: let vs var',
        code: `// let is block-scoped
if (true) {
  let blockVar = "inside block";
  console.log(blockVar); // "inside block"
}
// console.log(blockVar); // ReferenceError: not defined

// var leaks out of blocks (but not functions)
if (true) {
  var leaky = "I escape!";
}
console.log(leaky); // "I escape!" — this is the var problem`,
        output: 'inside block\nI escape!',
      },
      {
        title: 'Hoisting and Temporal Dead Zone',
        code: `// var is hoisted (initialized as undefined)
console.log(x); // undefined (no error)
var x = 5;

// let/const - Temporal Dead Zone
// console.log(y); // ReferenceError: Cannot access before initialization
let y = 10;

// Function hoisting (entire function is hoisted)
sayHi(); // Works!
function sayHi() { console.log("Hi!"); }`,
        output: 'undefined\nHi!',
      },
    ],
    commonMistakes: [
      'Using var in modern code — always prefer const, then let.',
      'Using let when const would work — default to const unless you need to reassign.',
      'Thinking const makes objects immutable — it only prevents reassignment of the binding.',
      'Accessing let/const variables before their declaration (TDZ error).',
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between var, let, and const?',
        answer: 'var is function-scoped, hoisted (initialized as undefined), and can be redeclared. let is block-scoped, in TDZ before declaration, cannot be redeclared. const is block-scoped, in TDZ, cannot be redeclared or reassigned. Use const by default, let when reassignment is needed, and avoid var.',
        difficulty: 'beginner',
      },
      {
        question: 'What is the Temporal Dead Zone?',
        answer: 'The TDZ is the period between when a let/const variable enters scope and when its declaration is reached. During this time, accessing the variable throws a ReferenceError. This is different from var which is initialized as undefined during hoisting.',
        difficulty: 'intermediate',
        followUp: ['Why does TDZ exist?', 'Does var have a TDZ?'],
      },
      {
        question: 'Is const truly immutable?',
        answer: 'No. const prevents reassignment of the variable binding, but for objects and arrays, the contents can still be mutated. To make an object truly immutable, use Object.freeze().',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'ex-var-1',
        title: 'Fix the variable declarations',
        description: 'The code below uses var everywhere. Replace with const or let as appropriate.',
        starterCode: `var userName = "Alice";
var userAge = 25;
var greeting = "Hello";
userAge = 26; // birthday!
// greeting should never change after being set
console.log(greeting + ", " + userName + "! You are " + userAge);`,
        solution: `const userName = "Alice";
let userAge = 25;
const greeting = "Hello";
userAge = 26;
console.log(greeting + ", " + userName + "! You are " + userAge);`,
        hints: ['Use const for values that never change', 'Use let only for values that get reassigned'],
        expectedOutput: 'Hello, Alice! You are 26',
      },
      {
        id: 'ex-var-2',
        title: 'Spot the scope bug',
        description: 'Fix the code so that the message inside the block is accessible after the if.',
        starterCode: `if (true) {
  var message = "Hello from block";
}
// This works but is wrong. Change var to let.
// Also, move the console.log inside the block.
console.log(message);`,
        solution: `if (true) {
  let message = "Hello from block";
  console.log(message);
}`,
        hints: ['let is block-scoped, so it must be used inside the block'],
        expectedOutput: 'Hello from block',
      },
    ],
    keyTakeaways: [
      'Use const by default — only use let when reassignment is needed',
      'Never use var in modern JavaScript',
      'let and const are block-scoped; var is function-scoped',
      'const does not make objects/arrays immutable',
      'TDZ: let/const cannot be accessed before their declaration line',
    ],
    prevLesson: 'what-is-javascript',
    nextLesson: 'data-types',
  },
  {
    id: 'data-types',
    slug: 'data-types',
    title: 'Data Types',
    description: 'Primitive vs reference types, typeof, type coercion, and why undefined !== null.',
    category: 'Fundamentals',
    order: 3,
    difficulty: 'beginner',
    estimatedTime: 20,
    content: `JavaScript has **8 data types**. They split into two groups: primitives (stored by value) and reference types (stored by reference).\n\n**Primitives (7 types):** string, number, boolean, null, undefined, symbol, bigint. When you copy a primitive, you get a true copy.\n\n**Reference types:** Objects (including arrays and functions). When you copy a reference type, both variables point to the same object in memory.\n\n**Real-world analogy:** Primitive = a photocopy of a document (independent copy). Reference = a shared Google Doc link (changes affect everyone with the link).\n\n**typeof operator** returns a string describing the type. Note the famous quirk: \`typeof null === "object"\` — this is a 40-year-old bug in the language that cannot be fixed for backward compatibility.\n\n**Type coercion:** JavaScript automatically converts types in certain operations. \`"5" + 3 = "53"\` (string concatenation) but \`"5" - 3 = 2\` (numeric subtraction). This is why \`==\` is dangerous — use \`===\` (strict equality) always.`,
    codeExamples: [
      {
        title: 'All 8 data types',
        code: `// Primitives
const str = "hello";           // string
const num = 42;                // number
const bool = true;             // boolean
const nothing = null;          // null
const notDefined = undefined;  // undefined
const sym = Symbol("id");      // symbol
const big = 9007199254740991n; // bigint

// Reference type
const obj = { name: "Alice" }; // object (also: arrays, functions)

console.log(typeof str);      // "string"
console.log(typeof num);      // "number"
console.log(typeof bool);     // "boolean"
console.log(typeof nothing);  // "object" ← famous bug!
console.log(typeof notDefined); // "undefined"
console.log(typeof sym);      // "symbol"
console.log(typeof big);      // "bigint"
console.log(typeof obj);      // "object"`,
        output: 'string\nnumber\nboolean\nobject\nundefined\nsymbol\nbigint\nobject',
      },
      {
        title: 'Primitive vs Reference: the copy difference',
        code: `// Primitives: copied by value
let a = 5;
let b = a;
b = 10;
console.log(a); // 5 — unchanged

// Reference: copied by reference
let obj1 = { x: 1 };
let obj2 = obj1; // same reference!
obj2.x = 99;
console.log(obj1.x); // 99 — obj1 changed too!

// To truly copy an object:
let obj3 = { ...obj1 }; // shallow copy
obj3.x = 0;
console.log(obj1.x); // 99 — obj1 unaffected now`,
        output: '5\n99\n99',
      },
      {
        title: 'Type coercion gotchas',
        code: `// == does type coercion (avoid!)
console.log(0 == false);   // true
console.log("" == false);  // true
console.log(null == undefined); // true

// === does NOT coerce (always use this)
console.log(0 === false);  // false
console.log("" === false); // false

// Arithmetic coercion
console.log("5" + 3);  // "53" (string concat)
console.log("5" - 3);  // 2 (numeric)
console.log(true + 1); // 2`,
        output: 'true\ntrue\ntrue\nfalse\nfalse\n"53"\n2\n2',
      },
    ],
    commonMistakes: [
      'Using == instead of === — always use strict equality.',
      'typeof null === "object" surprises everyone — check for null explicitly.',
      'Mutating a shared object reference when you meant to copy it.',
      'Not knowing that NaN !== NaN — use Number.isNaN() to check for NaN.',
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between null and undefined?',
        answer: 'undefined means a variable has been declared but not assigned a value (or a function returned nothing). null is an intentional empty value — a developer explicitly set it. typeof undefined is "undefined", typeof null is "object" (a historical bug).',
        difficulty: 'beginner',
      },
      {
        question: 'What is the difference between == and ===?',
        answer: '== is loose equality and performs type coercion before comparing. === is strict equality and requires both value AND type to match. Always use === to avoid unexpected coercion bugs like 0 == false being true.',
        difficulty: 'beginner',
      },
      {
        question: 'How do you check if something is an array?',
        answer: 'Use Array.isArray(value). You cannot use typeof because typeof [] returns "object". instanceof Array also works but can fail across iframes.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'ex-dt-1',
        title: 'Type checker',
        description: 'Write a function that returns the actual type of a value (handling the null bug).',
        starterCode: `function getType(value) {
  // Handle the null bug
  // Return 'null' for null, otherwise return typeof value
}

console.log(getType(null));      // "null"
console.log(getType(42));        // "number"
console.log(getType("hello"));   // "string"
console.log(getType(undefined)); // "undefined"`,
        solution: `function getType(value) {
  if (value === null) return 'null';
  return typeof value;
}

console.log(getType(null));      // "null"
console.log(getType(42));        // "number"
console.log(getType("hello"));   // "string"
console.log(getType(undefined)); // "undefined"`,
        hints: ['Check for null before using typeof'],
        expectedOutput: 'null\nnumber\nstring\nundefined',
      },
    ],
    keyTakeaways: [
      '7 primitives: string, number, boolean, null, undefined, symbol, bigint',
      'Primitives are copied by value; objects are copied by reference',
      'typeof null === "object" is a known bug — always check null explicitly',
      'Always use === (strict equality), never ==',
      'NaN !== NaN — use Number.isNaN() to check',
    ],
    prevLesson: 'variables',
    nextLesson: 'operators',
  },
  {
    id: 'operators',
    slug: 'operators',
    title: 'Operators',
    description: 'Arithmetic, comparison, logical, nullish coalescing, optional chaining, and more.',
    category: 'Fundamentals',
    order: 4,
    difficulty: 'beginner',
    estimatedTime: 15,
    content: `Operators let you perform operations on values. JavaScript has many categories of operators.\n\n**Arithmetic:** +, -, *, /, %, ** (exponent), ++ (increment), -- (decrement)\n\n**Comparison:** === (strict equal), !== (strict not equal), >, <, >=, <=\n\n**Logical:** && (AND), || (OR), ! (NOT). These also work as short-circuit operators — they return one of the original values, not just true/false.\n\n**Nullish Coalescing (??):** Returns the right side only if the left is null or undefined. Different from || which triggers on ANY falsy value (0, "", false).\n\n**Optional Chaining (?.):** Safely access nested properties. Returns undefined instead of throwing if a property doesn't exist.\n\n**Short-circuit evaluation:** \`a && b\` returns a if a is falsy, otherwise b. \`a || b\` returns a if a is truthy, otherwise b. This is used for default values and conditional execution.`,
    codeExamples: [
      {
        title: 'Arithmetic operators',
        code: `console.log(10 + 3);  // 13
console.log(10 - 3);  // 7
console.log(10 * 3);  // 30
console.log(10 / 3);  // 3.333...
console.log(10 % 3);  // 1 (remainder)
console.log(2 ** 8);  // 256 (exponent)

let x = 5;
x++;   // x is now 6
x--;   // x is now 5
x += 10; // x is now 15`,
        output: '13\n7\n30\n3.3333333333333335\n1\n256',
      },
      {
        title: 'Nullish coalescing vs logical OR',
        code: `const a = null ?? "default";    // "default"
const b = undefined ?? "default"; // "default"
const c = 0 ?? "default";         // 0 (0 is not null/undefined)
const d = "" ?? "default";        // "" (empty string not null/undefined)

// || treats ALL falsy as missing:
const e = 0 || "default";         // "default" (0 is falsy!)
const f = "" || "default";        // "default" ("" is falsy!)

console.log(c, d); // 0 ""
console.log(e, f); // "default" "default"`,
        output: '0 ""\n"default" "default"',
      },
      {
        title: 'Optional chaining',
        code: `const user = {
  name: "Alice",
  address: {
    city: "London"
  }
};

// Without optional chaining — crashes if address is undefined
// console.log(user.address.zipcode.code); // TypeError!

// With optional chaining — safely returns undefined
console.log(user?.address?.city);       // "London"
console.log(user?.phone?.number);       // undefined (no crash)
console.log(user?.getName?.());         // undefined (method doesn't exist)`,
        output: 'London\nundefined\nundefined',
      },
    ],
    commonMistakes: [
      'Using || for default values when 0 or "" are valid values — use ?? instead.',
      'Not using optional chaining on deeply nested objects from APIs.',
      'Confusing = (assignment) with == (loose equality) or === (strict equality).',
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between ?? and ||?',
        answer: '|| returns the right side if the left is ANY falsy value (0, "", false, null, undefined). ?? (nullish coalescing) only returns the right side if the left is null or undefined. Use ?? when 0 or empty string are valid values.',
        difficulty: 'intermediate',
      },
      {
        question: 'What is short-circuit evaluation?',
        answer: 'In && and ||, JavaScript stops evaluating as soon as the result is determined. a && b: if a is falsy, return a (skip b). a || b: if a is truthy, return a (skip b). This is used for conditional execution: user && user.save() only calls save() if user exists.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'ex-op-1',
        title: 'Safe property access',
        description: 'Use optional chaining and nullish coalescing to safely read a user\'s city, defaulting to "Unknown".',
        starterCode: `const user1 = { profile: { address: { city: "Paris" } } };
const user2 = { profile: null };
const user3 = null;

// Get city for each user, default to "Unknown" if not present
function getCity(user) {
  // your code here
}

console.log(getCity(user1)); // "Paris"
console.log(getCity(user2)); // "Unknown"
console.log(getCity(user3)); // "Unknown"`,
        solution: `function getCity(user) {
  return user?.profile?.address?.city ?? "Unknown";
}`,
        hints: ['Chain ?. operators', 'Use ?? at the end for the default'],
        expectedOutput: 'Paris\nUnknown\nUnknown',
      },
    ],
    keyTakeaways: [
      'Use === never ==',
      '?? checks for null/undefined only; || checks for any falsy value',
      'Optional chaining (?.) prevents TypeError on undefined properties',
      'Short-circuit: && returns first falsy value; || returns first truthy value',
    ],
    prevLesson: 'data-types',
    nextLesson: 'strings',
  },
  {
    id: 'strings',
    slug: 'strings',
    title: 'Strings',
    description: 'String methods, template literals, immutability, and common string operations.',
    category: 'Fundamentals',
    order: 5,
    difficulty: 'beginner',
    estimatedTime: 20,
    content: `Strings are **immutable sequences of characters**. You cannot change individual characters in a string — every string method returns a new string.\n\n**Three ways to create strings:** single quotes (''), double quotes (""), and template literals (backticks). Template literals support multi-line strings and embedded expressions with \${expression}.\n\n**Strings are zero-indexed:** The first character is at index 0. Access characters with bracket notation or .charAt().\n\n**Key methods to know:**\n- .length — number of characters\n- .toUpperCase() / .toLowerCase()\n- .trim() / .trimStart() / .trimEnd() — remove whitespace\n- .includes(substr) — returns boolean\n- .startsWith() / .endsWith()\n- .indexOf(substr) — returns index or -1\n- .slice(start, end) — extract substring\n- .split(delimiter) — split into array\n- .replace(old, new) — replace first match\n- .replaceAll(old, new) — replace all matches\n- .padStart(length, char) / .padEnd()`,
    codeExamples: [
      {
        title: 'String creation and basics',
        code: `const single = 'Hello';
const double = "World";
const template = \`Hello, \${double}!\`; // template literal

console.log(template);           // "Hello, World!"
console.log(template.length);    // 13
console.log(template[0]);        // "H"
console.log(template.toUpperCase()); // "HELLO, WORLD!"

// Multi-line with template literal
const multiLine = \`Line 1
Line 2
Line 3\`;`,
        output: 'Hello, World!\n13\nH\nHELLO, WORLD!',
      },
      {
        title: 'Essential string methods',
        code: `const str = "  Hello, World!  ";

console.log(str.trim());                // "Hello, World!"
console.log(str.includes("World"));     // true
console.log(str.indexOf("World"));      // 9
console.log(str.slice(2, 7));           // "Hello"
console.log(str.replace("World", "JS")); // "  Hello, JS!  "
console.log("a,b,c".split(","));        // ["a", "b", "c"]
console.log("5".padStart(3, "0"));      // "005"`,
        output: '"Hello, World!"\ntrue\n9\n"Hello"\n"  Hello, JS!  "\n["a","b","c"]\n"005"',
      },
      {
        title: 'Strings are immutable',
        code: `let name = "Alice";
name[0] = "B"; // Silently fails in non-strict mode
console.log(name); // Still "Alice"

// To "change" a string, create a new one:
const newName = "B" + name.slice(1);
console.log(newName); // "Blice"

// String methods return NEW strings
const upper = name.toUpperCase();
console.log(name);  // "Alice" — original unchanged
console.log(upper); // "ALICE" — new string`,
        output: 'Alice\nBlice\nAlice\nALICE',
      },
    ],
    commonMistakes: [
      'Trying to mutate a string — strings are immutable, methods return new strings.',
      'Forgetting that string comparison is case-sensitive — always .toLowerCase() before comparing.',
      'Using + for concatenation in loops — use an array and .join() for performance.',
    ],
    interviewQuestions: [
      {
        question: 'Are strings immutable in JavaScript?',
        answer: 'Yes. Once created, a string cannot be changed. String methods always return new strings. You can reassign a variable to a new string but you cannot mutate the original string.',
        difficulty: 'beginner',
      },
      {
        question: 'What is the difference between slice, substring, and substr?',
        answer: 'slice(start, end) supports negative indices (from end). substring(start, end) does not support negatives. substr(start, length) is deprecated. Prefer slice() for all string extraction needs.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'ex-str-1',
        title: 'String processing',
        description: 'Write a function that takes a full name string, trims whitespace, and returns "LastName, FirstName" format.',
        starterCode: `function formatName(fullName) {
  // "  Alice Smith  " → "Smith, Alice"
  // Hint: trim, split, reverse/rearrange
}

console.log(formatName("  Alice Smith  ")); // "Smith, Alice"
console.log(formatName("John Doe"));         // "Doe, John"`,
        solution: `function formatName(fullName) {
  const parts = fullName.trim().split(" ");
  return parts[1] + ", " + parts[0];
}`,
        hints: ['Use .trim() first', 'Use .split(" ") to get an array'],
        expectedOutput: 'Smith, Alice\nDoe, John',
      },
    ],
    keyTakeaways: [
      'Strings are immutable — methods return new strings',
      'Template literals (backticks) are the preferred way to build strings',
      'slice(start, end) supports negative indices — prefer over substring',
      '.includes(), .startsWith(), .endsWith() return booleans',
    ],
    prevLesson: 'operators',
    nextLesson: 'arrays',
  },
  {
    id: 'arrays',
    slug: 'arrays',
    title: 'Arrays',
    description: 'Array creation, methods, destructuring, spread, and all the essential array operations.',
    category: 'Fundamentals',
    order: 6,
    difficulty: 'beginner',
    estimatedTime: 25,
    content: `Arrays are **ordered, zero-indexed collections** of values. They can hold any mix of types. Arrays in JavaScript are objects — typeof [] returns "object".\n\n**Creating arrays:** Array literal [] (preferred), new Array(), Array.from(), Array.of()\n\n**Mutating methods** (change the original array): push, pop, shift, unshift, splice, sort, reverse, fill\n\n**Non-mutating methods** (return new array/value): map, filter, reduce, find, findIndex, some, every, includes, indexOf, slice, concat, flat, flatMap, join\n\n**Destructuring:** Extract values by position: \`const [first, second, ...rest] = arr\`\n\n**Spread:** Expand an array into individual elements: \`[...arr1, ...arr2]\`\n\n**Real-world analogy:** An array is like a numbered list. Index 0 is item 1, index 1 is item 2. The most important methods are map (transform), filter (select), and reduce (combine into one value).`,
    codeExamples: [
      {
        title: 'Array basics and mutation',
        code: `const fruits = ["apple", "banana", "cherry"];

console.log(fruits[0]);     // "apple"
console.log(fruits.length); // 3

// Mutating methods
fruits.push("date");        // add to end
fruits.pop();               // remove from end → "date"
fruits.unshift("avocado");  // add to start
fruits.shift();             // remove from start → "avocado"

// Non-mutating
const upper = fruits.map(f => f.toUpperCase());
console.log(fruits); // original unchanged
console.log(upper);  // ["APPLE", "BANANA", "CHERRY"]`,
        output: 'apple\n3\n["apple","banana","cherry"]\n["APPLE","BANANA","CHERRY"]',
      },
      {
        title: 'map, filter, reduce',
        code: `const numbers = [1, 2, 3, 4, 5, 6];

// map: transform each element
const doubled = numbers.map(n => n * 2);
// [2, 4, 6, 8, 10, 12]

// filter: keep elements that pass test
const evens = numbers.filter(n => n % 2 === 0);
// [2, 4, 6]

// reduce: combine to single value
const sum = numbers.reduce((acc, n) => acc + n, 0);
// 21

// Chain them
const sumOfDoubledEvens = numbers
  .filter(n => n % 2 === 0)
  .map(n => n * 2)
  .reduce((acc, n) => acc + n, 0);
console.log(sumOfDoubledEvens); // 24`,
        output: '24',
      },
      {
        title: 'Destructuring and spread',
        code: `const [first, second, ...rest] = [1, 2, 3, 4, 5];
console.log(first);  // 1
console.log(second); // 2
console.log(rest);   // [3, 4, 5]

// Skip elements
const [,, third] = [10, 20, 30];
console.log(third); // 30

// Spread to merge arrays
const a = [1, 2];
const b = [3, 4];
const combined = [...a, ...b, 5];
console.log(combined); // [1, 2, 3, 4, 5]

// Copy an array (shallow)
const copy = [...a];`,
        output: '1\n2\n[3,4,5]\n30\n[1,2,3,4,5]',
      },
    ],
    commonMistakes: [
      'Using sort() without a comparator — it converts to strings first: [10, 2, 1].sort() gives [1, 10, 2].',
      'Mutating original array when you meant to return a new one — use map/filter/slice instead of splice/sort.',
      'Checking array equality with === — arrays are objects, use JSON.stringify or every().',
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between map and forEach?',
        answer: 'map returns a new array with transformed elements. forEach returns undefined and is used only for side effects. Use map when you want to transform data; use forEach when you just need to iterate.',
        difficulty: 'beginner',
      },
      {
        question: 'How does reduce work?',
        answer: 'reduce(callback, initialValue) iterates over the array, passing an accumulator and current element to the callback. The callback returns the new accumulator. After all elements, it returns the final accumulator. The initialValue is the starting accumulator value.',
        difficulty: 'intermediate',
        followUp: ['Can reduce replace map and filter?', 'What happens if you omit the initialValue?'],
      },
    ],
    exercises: [
      {
        id: 'ex-arr-1',
        title: 'Array transformations',
        description: 'Given an array of people, use filter and map to get the names of people over 18 in uppercase.',
        starterCode: `const people = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 16 },
  { name: "Charlie", age: 30 },
  { name: "Dan", age: 14 },
];

// Get names of people over 18, in uppercase
const result = people
  // your code here

console.log(result); // ["ALICE", "CHARLIE"]`,
        solution: `const result = people
  .filter(p => p.age > 18)
  .map(p => p.name.toUpperCase());`,
        hints: ['Chain .filter() then .map()', 'Access .age for filter, .name for map'],
        expectedOutput: '["ALICE","CHARLIE"]',
      },
    ],
    keyTakeaways: [
      'Arrays are zero-indexed and ordered',
      'push/pop/splice/sort mutate — map/filter/slice/concat do not',
      'map transforms, filter selects, reduce combines',
      'Use Array.isArray() to check if something is an array',
      'sort() needs a comparator for numbers: .sort((a,b) => a - b)',
    ],
    prevLesson: 'strings',
    nextLesson: 'objects',
  },
  {
    id: 'objects',
    slug: 'objects',
    title: 'Objects',
    description: 'Object creation, methods, destructuring, spread, computed keys, and Object methods.',
    category: 'Fundamentals',
    order: 7,
    difficulty: 'beginner',
    estimatedTime: 25,
    content: `Objects are **key-value pairs** — the most fundamental data structure in JavaScript. Almost everything in JS is an object (arrays, functions, dates).\n\n**Creating objects:** Object literal {} (preferred), new Object(), Object.create()\n\n**Accessing properties:** dot notation (obj.key) or bracket notation (obj["key"]). Use bracket notation for dynamic keys or keys with special characters.\n\n**Object methods:** Functions stored as properties. Inside a method, \`this\` refers to the object.\n\n**Destructuring:** Extract properties by name: \`const { name, age } = user\`\n\n**Spread:** Shallow copy or merge: \`{ ...obj1, ...obj2 }\`\n\n**Key Object methods:** Object.keys(), Object.values(), Object.entries(), Object.assign(), Object.freeze(), Object.fromEntries()`,
    codeExamples: [
      {
        title: 'Object basics',
        code: `const user = {
  name: "Alice",
  age: 25,
  "favorite color": "blue", // key with space
  greet() {
    return \`Hi, I'm \${this.name}\`;
  }
};

console.log(user.name);            // "Alice"
console.log(user["favorite color"]); // "blue"
console.log(user.greet());         // "Hi, I'm Alice"

// Add/update properties
user.email = "alice@example.com";
user.age = 26;

// Delete
delete user["favorite color"];`,
        output: 'Alice\nblue\nHi, I\'m Alice',
      },
      {
        title: 'Destructuring and renaming',
        code: `const user = { name: "Alice", age: 25, city: "London" };

// Basic destructuring
const { name, age } = user;

// Rename while destructuring
const { name: userName, city: location } = user;

// Default values
const { role = "user" } = user;

console.log(userName); // "Alice"
console.log(location); // "London"
console.log(role);     // "user" (default)

// In function parameters
function greet({ name, age }) {
  return \`\${name} is \${age}\`;
}
console.log(greet(user)); // "Alice is 25"`,
        output: 'Alice\nLondon\nuser\nAlice is 25',
      },
      {
        title: 'Object methods and spread',
        code: `const a = { x: 1, y: 2 };
const b = { y: 3, z: 4 };

// Merge (later keys win)
const merged = { ...a, ...b };
console.log(merged); // { x: 1, y: 3, z: 4 }

// Shallow copy
const copy = { ...a };
copy.x = 99;
console.log(a.x); // 1 — original unchanged

// Object methods
console.log(Object.keys(a));    // ["x", "y"]
console.log(Object.values(a));  // [1, 2]
console.log(Object.entries(a)); // [["x",1],["y",2]]`,
        output: '{x:1,y:3,z:4}\n1\n["x","y"]\n[1,2]\n[["x",1],["y",2]]',
      },
    ],
    commonMistakes: [
      'Using dot notation for dynamic keys — use bracket notation: obj[dynamicKey].',
      'Thinking spread creates a deep copy — it is shallow. Nested objects are still shared references.',
      'Forgetting that Object.assign() and spread both do shallow copies.',
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between dot notation and bracket notation?',
        answer: 'Dot notation (obj.key) requires a valid identifier and is static. Bracket notation (obj["key"]) can use any string, including computed values and keys with spaces. Use bracket notation when the key is dynamic.',
        difficulty: 'beginner',
      },
      {
        question: 'How do you deep clone an object in JavaScript?',
        answer: 'For simple JSON-compatible objects: JSON.parse(JSON.stringify(obj)). For complex objects (with functions, Date, etc.): use structuredClone() (modern) or a library like lodash cloneDeep. The spread operator and Object.assign() only do shallow copies.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'ex-obj-1',
        title: 'Object transformation',
        description: 'Given a user object, create a new "public profile" object with only name and city, and add a displayName property.',
        starterCode: `const user = {
  name: "Alice",
  email: "alice@secret.com",
  password: "hunter2",
  city: "London",
  age: 25
};

// Create a public profile with only name, city, and displayName
// displayName should be name + " from " + city
function getPublicProfile(user) {
  // your code
}

console.log(getPublicProfile(user));
// { name: "Alice", city: "London", displayName: "Alice from London" }`,
        solution: `function getPublicProfile({ name, city }) {
  return {
    name,
    city,
    displayName: \`\${name} from \${city}\`
  };
}`,
        hints: ['Destructure in the function params', 'Use shorthand property syntax'],
        expectedOutput: '{name:"Alice",city:"London",displayName:"Alice from London"}',
      },
    ],
    keyTakeaways: [
      'Objects store key-value pairs; keys are always strings or Symbols',
      'Spread creates shallow copies — nested objects still share references',
      'Destructuring with renaming: const { key: newName } = obj',
      'Object.keys/values/entries return arrays for iteration',
    ],
    prevLesson: 'arrays',
    nextLesson: 'control-flow',
  },
  {
    id: 'control-flow',
    slug: 'control-flow',
    title: 'Control Flow',
    description: 'if/else, switch, ternary operator, and truthy/falsy values.',
    category: 'Fundamentals',
    order: 8,
    difficulty: 'beginner',
    estimatedTime: 15,
    content: `Control flow determines which code runs based on conditions.\n\n**if/else:** The most basic branching. Can chain with else if.\n\n**Truthy and Falsy:** In JavaScript, every value is either truthy or falsy in a boolean context. **Falsy values:** false, 0, -0, 0n, "" (empty string), null, undefined, NaN. Everything else is truthy.\n\n**Ternary operator:** condition ? valueIfTrue : valueIfFalse — a compact if/else for expressions.\n\n**switch:** Compare one value against multiple cases. Remember to break (or return) after each case to prevent fall-through.\n\n**Logical assignment:** &&= (assign if truthy), ||= (assign if falsy), ??= (assign if nullish)`,
    codeExamples: [
      {
        title: 'if/else and truthy/falsy',
        code: `// Falsy values
if (0) console.log("falsy");       // won't run
if ("") console.log("falsy");      // won't run
if (null) console.log("falsy");    // won't run

// Truthy
if ("0") console.log("truthy");    // runs! "0" is truthy
if ([]) console.log("truthy");     // runs! empty array is truthy
if ({}) console.log("truthy");     // runs! empty object is truthy

// Checking for empty array safely
const arr = [];
if (arr.length === 0) console.log("empty array");`,
        output: 'truthy\ntruthy\ntruthy\nempty array',
      },
      {
        title: 'Ternary and switch',
        code: `// Ternary
const age = 20;
const status = age >= 18 ? "adult" : "minor";
console.log(status); // "adult"

// switch
const day = "Monday";
switch (day) {
  case "Monday":
  case "Tuesday":
    console.log("Early week");
    break;
  case "Friday":
    console.log("Almost weekend!");
    break;
  default:
    console.log("Mid week");
}`,
        output: 'adult\nEarly week',
      },
    ],
    commonMistakes: [
      'Forgetting break in switch — causes fall-through to next case.',
      'Using if (arr) to check for empty array — an empty array is truthy! Use arr.length.',
      'Nested ternaries — very hard to read, use if/else instead.',
    ],
    interviewQuestions: [
      {
        question: 'What are falsy values in JavaScript?',
        answer: 'There are exactly 7: false, 0, -0, 0n (BigInt zero), "" (empty string), null, undefined, and NaN. Everything else is truthy, including "0", [], {}, and the string "false".',
        difficulty: 'beginner',
      },
    ],
    exercises: [
      {
        id: 'ex-cf-1',
        title: 'Grade calculator',
        description: 'Write a function that converts a numeric score to a letter grade.',
        starterCode: `function getGrade(score) {
  // 90-100: A, 80-89: B, 70-79: C, 60-69: D, below 60: F
}

console.log(getGrade(95));  // "A"
console.log(getGrade(82));  // "B"
console.log(getGrade(55));  // "F"`,
        solution: `function getGrade(score) {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}`,
        hints: ['Early returns make this cleaner than else-if chains'],
        expectedOutput: 'A\nB\nF',
      },
    ],
    keyTakeaways: [
      'Falsy: false, 0, "", null, undefined, NaN. Everything else is truthy',
      'Empty array [] and empty object {} are truthy',
      'Always break in switch cases (or use return)',
      'Ternary is for simple expressions, not complex logic',
    ],
    prevLesson: 'objects',
    nextLesson: 'loops',
  },
  {
    id: 'loops',
    slug: 'loops',
    title: 'Loops',
    description: 'for, while, do-while, for...of, for...in, and when to use each.',
    category: 'Fundamentals',
    order: 9,
    difficulty: 'beginner',
    estimatedTime: 20,
    content: `Loops let you repeat code. JavaScript has several loop types, each suited for different situations.\n\n**for loop:** Classic loop with counter. Best when you know how many times to iterate.\n\n**while loop:** Runs while a condition is true. Use when you don't know iterations upfront.\n\n**do...while:** Like while, but runs at least once.\n\n**for...of:** Iterates over iterable values (arrays, strings, Maps, Sets). This is what you use for arrays in modern code.\n\n**for...in:** Iterates over object keys. Avoid for arrays — it iterates inherited properties too.\n\n**break and continue:** break exits the loop entirely. continue skips to the next iteration.`,
    codeExamples: [
      {
        title: 'for vs for...of',
        code: `const fruits = ["apple", "banana", "cherry"];

// Classic for loop
for (let i = 0; i < fruits.length; i++) {
  console.log(i, fruits[i]);
}

// for...of (modern, preferred for arrays)
for (const fruit of fruits) {
  console.log(fruit);
}

// for...of with index (use entries())
for (const [i, fruit] of fruits.entries()) {
  console.log(i, fruit);
}`,
        output: '0 apple\n1 banana\n2 cherry\napple\nbanana\ncherry\n0 apple\n1 banana\n2 cherry',
      },
      {
        title: 'for...in for objects',
        code: `const user = { name: "Alice", age: 25, city: "London" };

for (const key in user) {
  console.log(\`\${key}: \${user[key]}\`);
}
// Better: use Object.entries()
for (const [key, value] of Object.entries(user)) {
  console.log(\`\${key}: \${value}\`);
}`,
        output: 'name: Alice\nage: 25\ncity: London',
      },
      {
        title: 'break and continue',
        code: `// break: exit loop early
for (let i = 0; i < 10; i++) {
  if (i === 5) break;
  console.log(i); // 0, 1, 2, 3, 4
}

// continue: skip iteration
for (let i = 0; i < 6; i++) {
  if (i % 2 === 0) continue;
  console.log(i); // 1, 3, 5
}`,
        output: '0\n1\n2\n3\n4\n1\n3\n5',
      },
    ],
    commonMistakes: [
      'Using for...in on arrays — use for...of instead.',
      'Off-by-one errors: i < array.length (correct) vs i <= array.length (goes out of bounds).',
      'Forgetting to increment in a while loop — causes infinite loop.',
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between for...of and for...in?',
        answer: 'for...of iterates over iterable values (array elements, string characters, Map entries). for...in iterates over enumerable object keys, including inherited ones. Never use for...in on arrays.',
        difficulty: 'beginner',
      },
    ],
    exercises: [
      {
        id: 'ex-loop-1',
        title: 'FizzBuzz',
        description: 'Print numbers 1-20. For multiples of 3 print "Fizz", multiples of 5 print "Buzz", multiples of both print "FizzBuzz".',
        starterCode: `for (let i = 1; i <= 20; i++) {
  // your code
}`,
        solution: `for (let i = 1; i <= 20; i++) {
  if (i % 15 === 0) console.log("FizzBuzz");
  else if (i % 3 === 0) console.log("Fizz");
  else if (i % 5 === 0) console.log("Buzz");
  else console.log(i);
}`,
        hints: ['Check for 15 (both) first, then 3, then 5', 'Use the % (modulo) operator'],
        expectedOutput: '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz\n16\n17\nFizz\n19\nBuzz',
      },
    ],
    keyTakeaways: [
      'for...of for arrays (modern, clean)',
      'for...in for object keys only',
      'while when you don\'t know iteration count',
      'break exits loop, continue skips to next iteration',
    ],
    prevLesson: 'control-flow',
    nextLesson: 'functions',
  },
  {
    id: 'functions',
    slug: 'functions',
    title: 'Functions',
    description: 'Master function declarations, expressions, arrow functions, parameters, return values, and first-class function patterns.',
    category: 'Functions',
    order: 10,
    difficulty: 'beginner',
    estimatedTime: 45,
    content: `**What is a Function?**

A function is a named, reusable block of code that performs a specific task. Think of it like a recipe — you write the recipe once, and you can follow it as many times as you need without rewriting the steps. You "call" a function the same way you "follow" a recipe.

Without functions, if you needed to greet 100 users you would write 100 greeting statements. With a function, you write the greeting logic once and call it 100 times. This is the DRY principle: **Don't Repeat Yourself**.

**Syntax of a Function (the anatomy)**

Every function has these parts:
1. The \`function\` keyword (tells JavaScript "a function starts here")
2. A **name** (so you can call it later)
3. **Parameters** in parentheses \`()\` — placeholders for input values
4. A **body** in curly braces \`{}\` — the code to run
5. Optionally a **return** statement — the output

\`\`\`
function functionName(parameter1, parameter2) {
  // body: code to execute
  return result; // optional output
}
\`\`\`

**Parameters vs Arguments — the Difference**

This confuses many beginners. Here is the clear definition:
- **Parameter**: the variable name written inside the function definition's parentheses. It is a placeholder.
- **Argument**: the actual value you pass when you CALL the function.

Example: In \`function add(a, b)\` — \`a\` and \`b\` are **parameters**.
When you write \`add(5, 3)\` — \`5\` and \`3\` are **arguments**.
Parameters receive arguments. Parameters are local to the function body.

**Way 1 — Function Declaration**

The classic way. You write the \`function\` keyword first, then the name, then the parentheses, then the body. This is the most readable and most common form for standalone functions.

Syntax: \`function name(params) { body }\`

The key special property of declarations: they are **hoisted**. Hoisting means JavaScript reads all function declarations before running any code in that file. So you can call a declared function BEFORE the line where it is written. This can be convenient but can also confuse beginners, so use it knowingly.

When to use: For regular named utility functions, helper functions, recursive functions (a function that calls itself), and any situation where you want hoisting.

**Way 2 — Function Expression**

Here you create a function and assign it to a variable. The function itself has no name (anonymous) — the variable holds it.

Syntax: \`const name = function(params) { body };\`

Note the semicolon at the end — this is a variable assignment statement.

Key property: **NOT hoisted**. If you try to call a function expression before its line in the code, you get a \`ReferenceError: Cannot access before initialization\` (for \`const\`/\`let\`) or \`TypeError: name is not a function\` (for \`var\`). You must define it first, then call it.

When to use: When you want to ensure functions are defined in a specific order, when passing a function immediately as an argument, or when you want to assign different functions to the same variable conditionally.

**Way 3 — Arrow Functions (ES6)**

Introduced in ES2015 (ES6). A shorter syntax for writing function expressions. Arrow functions are always anonymous — they have no name of their own.

Basic syntax: \`const name = (params) => { body };\`

Arrow functions have several syntax shortcuts:
- **One parameter**: you can drop the parentheses → \`const double = n => n * 2;\`
- **No parameters**: you MUST keep empty parentheses → \`const greet = () => "hello";\`
- **Single expression body**: you can drop the curly braces AND the \`return\` keyword — the expression is implicitly returned → \`const add = (a, b) => a + b;\`
- **Multi-line body**: must use curly braces AND write \`return\` explicitly → \`const add = (a, b) => { const sum = a + b; return sum; };\`
- **Returning an object literal**: wrap it in parentheses to avoid ambiguity → \`const makeUser = name => ({ name: name, role: "user" });\`

**Arrow Functions vs Regular Functions — Full Comparison**

This is the most important distinction and a very common interview question.

**1. The \`this\` keyword (the biggest difference)**
Regular functions have their OWN \`this\`. The value of \`this\` depends on HOW the function is called (who calls it). Arrow functions do NOT have their own \`this\`. They inherit \`this\` from the surrounding lexical (enclosing) scope — wherever the arrow function is defined, not where it is called.

This matters most when using methods inside objects and callbacks inside class methods. Use regular functions for object methods. Use arrow functions for callbacks inside those methods.

**2. The \`arguments\` object**
Regular functions get a special built-in \`arguments\` object — an array-like object containing all arguments passed to the function. Arrow functions do NOT have an \`arguments\` object. To collect multiple args in an arrow function, use rest parameters \`...args\`.

**3. Can be used as a constructor (with \`new\`)**
Regular functions can be called with \`new\` to create objects. Arrow functions CANNOT. Calling \`new arrowFn()\` throws: \`TypeError: arrowFn is not a constructor\`.

**4. Prototype property**
Regular functions automatically have a \`prototype\` property. Arrow functions do not — they have no \`prototype\`.

**5. Generator functions**
Regular functions can be made generators using \`function*\`. Arrow functions cannot be generators.

Quick summary table:
| Feature              | Regular Function | Arrow Function |
|----------------------|-----------------|----------------|
| \`this\` binding      | Own (dynamic)   | Inherits (lexical) |
| \`arguments\` object | Yes             | No             |
| Can use \`new\`      | Yes             | No             |
| Has \`prototype\`    | Yes             | No             |
| Hoisted              | Yes (declaration) | No            |
| Can be generator     | Yes             | No             |
| Syntax               | Longer          | Shorter        |

**The Return Statement**

Every function has an implicit return of \`undefined\` if you don't write a return statement. The \`return\` keyword does two things: (1) sends a value back to the caller, (2) immediately exits the function — no code after \`return\` in that block runs.

You can have multiple return statements (early returns) for different conditions. This is a common pattern for guard clauses.

**Default Parameters**

Before ES6, you had to check if a parameter was \`undefined\` and set a fallback manually. ES6 introduced default parameters — values used when an argument is not passed or is explicitly passed as \`undefined\`.

Syntax: \`function greet(name = "World") {}\`

You can use any expression as a default — even the result of calling another function. Default parameters only trigger for \`undefined\`, not for \`null\` or \`0\` or \`""\` (those are valid values that override nothing).

**Rest Parameters**

What if you want a function that accepts any number of arguments? Use rest parameters. The syntax is three dots before the last parameter name: \`...paramName\`. This collects all remaining arguments into a real JavaScript array.

Syntax: \`function sum(...numbers) { return numbers.reduce((acc, n) => acc + n, 0); }\`

Rules:
- Rest parameter must be the LAST parameter: \`function fn(a, b, ...rest)\` — correct
- Only ONE rest parameter per function
- It gives you a real array (unlike the \`arguments\` object)

**First-Class Functions — Treating Functions as Values**

In JavaScript, functions are values — just like numbers, strings, or objects. This is what "first-class citizen" means. It has three consequences:

1. **Store in a variable**: \`const fn = function() {};\`
2. **Pass as an argument**: \`doSomething(myFunction);\` — the function you pass is called a **callback**
3. **Return from a function**: \`function make() { return function() {}; }\` — a function that returns a function is called a **higher-order function**

Callbacks are everywhere in JavaScript: event listeners, array methods (\`map\`, \`filter\`, \`reduce\`), \`setTimeout\`, \`fetch\` responses. Understanding that functions are values is essential for modern JavaScript.`,
    codeExamples: [
      {
        title: 'Function Declaration — syntax, hoisting, anatomy',
        code: `// ── FUNCTION DECLARATION ──────────────────────────────────────────
// Syntax: function name(parameters) { body }

// You can call it BEFORE it is defined — hoisting!
console.log(greet("Alice")); // "Hello, Alice!" — works because of hoisting

function greet(name) {       // 'name' is the PARAMETER (placeholder)
  return "Hello, " + name + "!";
}

console.log(greet("Bob"));   // "Hello, Bob!"   — normal call after definition

// ── PARAMETERS vs ARGUMENTS ────────────────────────────────────────
function add(a, b) {         // a and b are PARAMETERS
  return a + b;
}

const result = add(10, 5);   // 10 and 5 are ARGUMENTS passed to a and b
console.log(result);         // 15

// ── MULTIPLE PARAMETERS ────────────────────────────────────────────
function introduce(firstName, lastName, age) {
  return firstName + " " + lastName + " is " + age + " years old.";
}
console.log(introduce("John", "Doe", 25)); // "John Doe is 25 years old."

// ── FUNCTION WITHOUT RETURN ────────────────────────────────────────
function sayHi(name) {
  console.log("Hi, " + name + "!"); // just prints, no return
}
const val = sayHi("Tom");   // "Hi, Tom!" (prints)
console.log(val);            // undefined — no return statement means undefined`,
        output: 'Hello, Alice!\nHello, Bob!\n15\nJohn Doe is 25 years old.\nHi, Tom!\nundefined',
      },
      {
        title: 'Function Expression — not hoisted, assigned to variable',
        code: `// ── FUNCTION EXPRESSION ──────────────────────────────────────────
// Syntax: const name = function(parameters) { body };
// The function is anonymous — the variable holds it

const multiply = function(a, b) {
  return a * b;
};

console.log(multiply(4, 5)); // 20

// ── CALLING BEFORE DEFINITION (will FAIL) ──────────────────────────
// console.log(square(3)); // ❌ ReferenceError: Cannot access 'square' before initialization

const square = function(n) {
  return n * n;
};

console.log(square(3)); // 9  — works only AFTER the definition

// ── NAMED FUNCTION EXPRESSION ─────────────────────────────────────
// You can give the function a name — useful for stack traces and recursion
const factorial = function fact(n) {
  if (n <= 1) return 1;
  return n * fact(n - 1); // can use 'fact' internally
};

console.log(factorial(5)); // 120
// console.log(fact(5));   // ❌ 'fact' is NOT accessible outside

// ── CONDITIONAL FUNCTION ASSIGNMENT ───────────────────────────────
let process;
const userIsAdmin = true;

if (userIsAdmin) {
  process = function(data) { return "Admin processing: " + data; };
} else {
  process = function(data) { return "User processing: " + data; };
}

console.log(process("report")); // "Admin processing: report"`,
        output: '20\n9\n120\nAdmin processing: report',
      },
      {
        title: 'Arrow Functions — all syntax variants explained',
        code: `// ── ARROW FUNCTION SYNTAX VARIANTS ───────────────────────────────

// VARIANT 1: Full form with parentheses and block body
const add = (a, b) => {
  const sum = a + b;
  return sum;  // must write return explicitly with block body
};
console.log(add(3, 4));    // 7

// VARIANT 2: Implicit return — single expression, no braces, no return
const multiply = (a, b) => a * b;   // 'a * b' is automatically returned
console.log(multiply(3, 4));  // 12

// VARIANT 3: Single parameter — parentheses are optional
const double = n => n * 2;   // no parens needed for single param
console.log(double(7));       // 14

// VARIANT 4: No parameters — empty parentheses required
const greet = () => "Hello, World!";
console.log(greet());         // Hello, World!

// VARIANT 5: Returning an object literal — must wrap in parentheses!
// Why? Because {} looks like a block body to JavaScript
const makeUser = (name, age) => ({ name: name, age: age });
console.log(makeUser("Alice", 30)); // { name: 'Alice', age: 30 }

// ── MULTI-LINE ARROW FUNCTION ──────────────────────────────────────
const getGrade = score => {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  return "F";
};
console.log(getGrade(85)); // "B"
console.log(getGrade(55)); // "F"`,
        output: '7\n12\n14\nHello, World!\n{ name: \'Alice\', age: 30 }\nB\nF',
      },
      {
        title: "Arrow vs Regular — 'this' binding (the critical difference)",
        code: `// ── THE 'this' PROBLEM ────────────────────────────────────────────

const person = {
  name: "Alice",
  age: 25,

  // ✅ Regular function as method: 'this' = the object
  greet: function() {
    console.log("Hi, I am " + this.name);  // this.name = "Alice"
  },

  // ❌ Arrow function as method: 'this' is NOT the object
  // Arrow functions inherit 'this' from the surrounding scope (here: global/module)
  greetArrow: () => {
    console.log("Hi, I am " + this?.name); // this is undefined (strict mode) or global
  },

  // ✅ Regular method with arrow function inside callback
  // Arrow function inside correctly inherits 'this' from the method
  printAfterDelay: function() {
    const self = this; // old way (before arrow functions)
    setTimeout(function() {
      console.log("Old way: " + self.name);  // had to use 'self'
    }, 100);

    // Modern way with arrow function — 'this' is inherited from printAfterDelay
    setTimeout(() => {
      console.log("Arrow way: " + this.name); // this.name = "Alice" ✅
    }, 200);
  },
};

person.greet();        // "Hi, I am Alice"
person.greetArrow();   // "Hi, I am undefined"
person.printAfterDelay();
// (after ~100ms): "Old way: Alice"
// (after ~200ms): "Arrow way: Alice"`,
        output: 'Hi, I am Alice\nHi, I am undefined\nOld way: Alice\nArrow way: Alice',
      },
      {
        title: "Arrow vs Regular — 'arguments' object",
        code: `// ── ARGUMENTS OBJECT IN REGULAR FUNCTION ─────────────────────────
// Regular functions automatically get an 'arguments' object —
// an array-LIKE object of all passed args (but not a real array)

function logArgs() {
  console.log(arguments);        // Arguments object
  console.log(arguments[0]);     // First argument
  console.log(arguments.length); // Number of arguments

  // Convert to real array to use array methods
  const arr = Array.from(arguments);
  console.log(arr.map(x => x * 2));
}

logArgs(1, 2, 3, 4); // Works

// ── ARROW FUNCTION: NO 'arguments' OBJECT ─────────────────────────
const logArgsArrow = () => {
  // console.log(arguments); // ❌ ReferenceError: arguments is not defined
  console.log("Arrow functions have no arguments object");
};

logArgsArrow(1, 2, 3); // The extra args are completely inaccessible

// ── SOLUTION: Use rest parameters in arrow functions ───────────────
const sum = (...numbers) => {
  console.log(numbers);          // [1, 2, 3, 4] — a real array
  return numbers.reduce((total, n) => total + n, 0);
};

console.log(sum(1, 2, 3, 4));  // 10

// ── ARROW FUNCTION CANNOT USE 'new' ───────────────────────────────
function Person(name) {        // Regular function: can use 'new'
  this.name = name;
}
const p = new Person("Alice"); // ✅ works
console.log(p.name);           // "Alice"

const PersonArrow = (name) => { this.name = name; };
// const p2 = new PersonArrow("Bob"); // ❌ TypeError: PersonArrow is not a constructor`,
        output: '[Arguments] { \'0\': 1, \'1\': 2, \'2\': 3, \'3\': 4 }\n1\n4\n[2, 4, 6, 8]\nArrow functions have no arguments object\n[1, 2, 3, 4]\n10\nAlice',
      },
      {
        title: 'Default Parameters — full guide',
        code: `// ── DEFAULT PARAMETERS (ES6) ─────────────────────────────────────
// Before ES6, you wrote: name = name || "World"
// ES6 lets you write defaults directly in the parameter list

function greet(name = "World", punctuation = "!") {
  return "Hello, " + name + punctuation;
}

console.log(greet());                // "Hello, World!"  — both defaults used
console.log(greet("Alice"));         // "Hello, Alice!"  — punctuation default
console.log(greet("Bob", "."));      // "Hello, Bob."    — no defaults used
console.log(greet(undefined, "?")); // "Hello, World?"  — undefined triggers default
console.log(greet(null, "!"));      // "Hello, null!"   — null does NOT trigger default

// ── ORDER MATTERS ─────────────────────────────────────────────────
// Defaults work for the RIGHTMOST parameters typically
// You can't skip middle parameters without passing undefined

function createUser(
  name,                // required — no default
  role = "viewer",     // optional
  isActive = true      // optional
) {
  return { name, role, isActive };
}

console.log(createUser("Alice"));               // { name: 'Alice', role: 'viewer', isActive: true }
console.log(createUser("Bob", "admin"));        // { name: 'Bob', role: 'admin', isActive: true }
console.log(createUser("Carol", undefined, false)); // { name: 'Carol', role: 'viewer', isActive: false }

// ── EXPRESSIONS AS DEFAULTS ────────────────────────────────────────
// Default values can be expressions — even function calls
function getDefaultAge() { return 18; }

function registerUser(name, age = getDefaultAge()) {
  return name + " is " + age + " years old";
}

console.log(registerUser("Dave"));     // "Dave is 18 years old"
console.log(registerUser("Eve", 25));  // "Eve is 25 years old"`,
        output: 'Hello, World!\nHello, Alice!\nHello, Bob.\nHello, World?\nHello, null!\n{ name: \'Alice\', role: \'viewer\', isActive: true }\n{ name: \'Bob\', role: \'admin\', isActive: true }\n{ name: \'Carol\', role: \'viewer\', isActive: false }\nDave is 18 years old\nEve is 25 years old',
      },
      {
        title: 'Rest Parameters — collecting unlimited arguments',
        code: `// ── REST PARAMETERS ──────────────────────────────────────────────
// Three dots ... before the LAST parameter name
// Collects ALL remaining arguments into a REAL array

function sum(...numbers) {
  // 'numbers' is a real array — you can use all array methods
  console.log("Numbers array:", numbers);
  return numbers.reduce((total, n) => total + n, 0);
}

console.log(sum(1, 2, 3));           // Numbers array: [1, 2, 3] → 6
console.log(sum(10, 20, 30, 40));    // Numbers array: [10, 20, 30, 40] → 100
console.log(sum());                   // Numbers array: [] → 0

// ── COMBINING REGULAR AND REST PARAMETERS ─────────────────────────
// Rest must ALWAYS be the LAST parameter

function log(level, ...messages) {   // 'level' is normal, '...messages' gets the rest
  console.log("[" + level + "]", messages.join(", "));
}

log("INFO", "Server started");                     // [INFO] Server started
log("ERROR", "DB failed", "retry in 5s");          // [ERROR] DB failed, retry in 5s
log("DEBUG", "step1", "step2", "step3", "step4"); // [DEBUG] step1, step2, step3, step4

// ── WHY REST IS BETTER THAN 'arguments' ───────────────────────────
// arguments: array-like, has no array methods, confusing
// rest: real array with full array method access

function withArguments() {
  // Can't do arguments.map() — not a real array
  return Array.from(arguments).filter(n => n > 0).reduce((a, b) => a + b, 0);
}

function withRest(...nums) {
  // nums is already a real array
  return nums.filter(n => n > 0).reduce((a, b) => a + b, 0);
}

console.log(withArguments(-1, 2, -3, 4, 5)); // 11
console.log(withRest(-1, 2, -3, 4, 5));       // 11 (cleaner code)`,
        output: 'Numbers array: [1, 2, 3]\n6\nNumbers array: [10, 20, 30, 40]\n100\nNumbers array: []\n0\n[INFO] Server started\n[ERROR] DB failed, retry in 5s\n[DEBUG] step1, step2, step3, step4\n11\n11',
      },
      {
        title: 'Return Statement — early returns, multiple returns',
        code: `// ── THE RETURN STATEMENT ─────────────────────────────────────────
// 'return' does two things:
//   1. Sends a value back to whoever called the function
//   2. Immediately exits the function — no code after it runs

function absolute(n) {
  if (n < 0) return -n;  // ← early return, exits here for negatives
  return n;               // ← runs only for non-negative numbers
}

console.log(absolute(-5));  // 5
console.log(absolute(3));   // 3

// ── GUARD CLAUSES (common pattern) ────────────────────────────────
// Instead of deeply nested if-else, use early returns to "guard"
// against bad inputs at the top of the function

function divide(a, b) {
  if (typeof a !== "number" || typeof b !== "number") {
    return "Error: both arguments must be numbers";  // guard: invalid types
  }
  if (b === 0) {
    return "Error: cannot divide by zero";           // guard: division by zero
  }
  return a / b;   // happy path — only reached if all guards pass
}

console.log(divide(10, 2));      // 5
console.log(divide(10, 0));      // "Error: cannot divide by zero"
console.log(divide("a", 2));     // "Error: both arguments must be numbers"

// ── MULTIPLE RETURN VALUES (via object/array) ─────────────────────
// Functions can only return ONE value, but that value can be an array or object

function minMax(arr) {
  const sorted = [...arr].sort((a, b) => a - b);
  return { min: sorted[0], max: sorted[sorted.length - 1] };  // return object
}

const { min, max } = minMax([3, 1, 4, 1, 5, 9, 2, 6]);
console.log("Min:", min, "Max:", max);  // Min: 1 Max: 9

// ── RETURN WITHOUT VALUE ───────────────────────────────────────────
function printIfPositive(n) {
  if (n <= 0) return;        // exit early with no value (returns undefined)
  console.log(n + " is positive");
}

printIfPositive(-5);  // (nothing printed, just exits)
printIfPositive(7);   // "7 is positive"`,
        output: '5\n3\n5\nError: cannot divide by zero\nError: both arguments must be numbers\nMin: 1 Max: 9\n7 is positive',
      },
      {
        title: 'First-Class Functions — callbacks and higher-order functions',
        code: `// ── FUNCTIONS AS VALUES (first-class citizens) ────────────────────
// In JavaScript, functions are values just like numbers and strings
// You can: store them, pass them, return them

// 1. STORE A FUNCTION IN A VARIABLE
const sayHello = function() { return "Hello!"; };
console.log(sayHello()); // "Hello!"

// Store in an array
const operations = [
  (a, b) => a + b,
  (a, b) => a - b,
  (a, b) => a * b,
];
console.log(operations[0](5, 3)); // 8
console.log(operations[2](5, 3)); // 15

// 2. PASS A FUNCTION AS AN ARGUMENT (callback pattern)
// A function passed as an argument is called a "callback"
function applyOperation(a, b, operation) {
  // 'operation' is a function — call it with a and b
  return operation(a, b);
}

const add = (a, b) => a + b;
const multiply = (a, b) => a * b;

console.log(applyOperation(10, 3, add));      // 13
console.log(applyOperation(10, 3, multiply)); // 30
console.log(applyOperation(10, 3, (a, b) => a - b)); // 7  — inline arrow function

// Array methods USE this pattern — map/filter/reduce take callbacks
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);      // n => n*2 is the callback
const evens = numbers.filter(n => n % 2 === 0);
const total = numbers.reduce((acc, n) => acc + n, 0);

console.log(doubled); // [2, 4, 6, 8, 10]
console.log(evens);   // [2, 4]
console.log(total);   // 15

// 3. RETURN A FUNCTION FROM A FUNCTION (higher-order function)
// A function that returns another function is a "higher-order function"
function makeMultiplier(factor) {
  // Returns a new function that remembers 'factor' via closure
  return function(number) {
    return number * factor;
  };
}

const double = makeMultiplier(2);
const triple = makeMultiplier(3);
const times10 = makeMultiplier(10);

console.log(double(5));   // 10
console.log(triple(5));   // 15
console.log(times10(5));  // 50`,
        output: 'Hello!\n8\n15\n13\n30\n7\n[2, 4, 6, 8, 10]\n[2, 4]\n15\n10\n15\n50',
      },
    ],
    commonMistakes: [
      'Using an arrow function as an object method when you need to access the object with "this" — arrow functions inherit "this" from the outer scope, so "this" inside will NOT be the object. Use a regular function for object methods.',
      'Calling a function expression or arrow function BEFORE defining it — only function declarations are hoisted. "const fn = () => {};" is not available above its line.',
      'Forgetting the "return" keyword inside a block body "{ }" — writing "const add = (a, b) => { a + b; }" returns undefined. You must write "return a + b;" inside braces.',
      'Confusing parameters and arguments — parameters are the variable names in the function definition, arguments are the actual values you pass when calling.',
      'Trying to use the "arguments" object inside an arrow function — it does not exist there. Use rest parameters "...args" instead.',
      'Passing "null" expecting a default parameter to trigger — defaults only trigger for "undefined", not "null". "fn(null)" will use null, not the default.',
      'Putting a rest parameter in the middle — "function f(a, ...b, c)" is a SyntaxError. Rest must always be last.',
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between function declaration and function expression?',
        answer: 'A function declaration uses the "function" keyword as the very first word and has a name: "function add(a,b){return a+b}". Function declarations are HOISTED — JavaScript reads them before any code runs, so you can call them before their line in the code. A function expression assigns a function to a variable: "const add = function(a,b){return a+b};". Expressions are NOT hoisted — you must define them before calling. Arrow functions assigned to variables are also function expressions.',
        difficulty: 'beginner',
      },
      {
        question: 'What are ALL the differences between arrow functions and regular functions?',
        answer: '1) "this" binding: regular functions have their own dynamic "this" (depends on who calls them). Arrow functions have no own "this" — they inherit it lexically from the enclosing scope. 2) "arguments" object: regular functions have it, arrow functions do not. 3) Constructor: regular functions can be used with "new", arrow functions throw TypeError if you try "new arrowFn()". 4) Prototype: regular functions have a "prototype" property, arrow functions do not. 5) Generator: regular functions can be generators with "function*", arrow functions cannot. 6) Syntax: arrow functions are shorter, especially with implicit return.',
        difficulty: 'intermediate',
        followUp: ['When should you NOT use an arrow function?', 'What does lexical this mean?'],
      },
      {
        question: 'When should you use a regular function vs an arrow function?',
        answer: 'Use regular functions for: (1) Object methods where you need "this" to refer to the object. (2) Constructor functions used with "new". (3) When you need the "arguments" object. (4) Generator functions. Use arrow functions for: (1) Short callbacks passed to map/filter/reduce/setTimeout. (2) Functions inside class methods/object methods where you want "this" to stay as the outer context. (3) Any function where you want a concise, readable expression.',
        difficulty: 'intermediate',
      },
      {
        question: 'What is a higher-order function? Give an example.',
        answer: 'A higher-order function is a function that either (1) takes another function as an argument, or (2) returns a function. Examples: Array.map() takes a callback — higher-order. Array.filter() — higher-order. A function factory like "function makeAdder(x) { return (y) => x + y; }" — returns a function, so it is higher-order. They are fundamental to functional programming patterns in JavaScript.',
        difficulty: 'intermediate',
      },
      {
        question: 'What is the difference between parameters and arguments?',
        answer: 'Parameters are the variable names listed in the function definition — they are placeholders. "function add(a, b)" — a and b are parameters. Arguments are the actual values passed when calling the function. "add(5, 3)" — 5 and 3 are arguments. When the function runs, parameter "a" receives argument 5, parameter "b" receives argument 3.',
        difficulty: 'beginner',
      },
      {
        question: 'What happens if you pass fewer arguments than there are parameters?',
        answer: 'Any parameters without a corresponding argument receive the value "undefined". So "function add(a, b){ return a + b; }" called as "add(5)" gives NaN because b is undefined and 5 + undefined = NaN. This is why default parameters exist — "function add(a, b = 0)" ensures b is 0 when not passed.',
        difficulty: 'beginner',
      },
    ],
    exercises: [
      {
        id: 'ex-fn-1',
        title: 'Write a greeting factory',
        description: 'Write a higher-order function "makeGreeter" that takes a greeting word (like "Hello" or "Hi") and returns a new function. That returned function takes a name and returns the full greeting string.',
        starterCode: `function makeGreeter(greeting) {
  // Return a function that takes 'name' and returns greeting + ", " + name + "!"
}

const hello = makeGreeter("Hello");
const hey = makeGreeter("Hey");

console.log(hello("Alice")); // "Hello, Alice!"
console.log(hello("Bob"));   // "Hello, Bob!"
console.log(hey("Carol"));   // "Hey, Carol!"`,
        solution: `function makeGreeter(greeting) {
  return function(name) {
    return greeting + ", " + name + "!";
  };
}`,
        hints: ['The outer function receives "greeting" and returns a new function', 'The inner function receives "name" and uses both "greeting" (from closure) and "name"'],
        expectedOutput: 'Hello, Alice!\nHello, Bob!\nHey, Carol!',
      },
      {
        id: 'ex-fn-2',
        title: 'Create a pipeline function',
        description: 'Write a "pipe" function that takes any number of functions as arguments and returns a new function. When called with a value, it applies all functions left to right, passing each result to the next.',
        starterCode: `function pipe(...fns) {
  // Return a function that applies each fn from fns left to right
  // pipe(double, addOne)(5) → double(5) = 10 → addOne(10) = 11
}

const double = x => x * 2;
const addOne = x => x + 1;
const square = x => x * x;

const transform = pipe(double, addOne, square);
console.log(transform(3)); // double(3)=6, addOne(6)=7, square(7)=49`,
        solution: `function pipe(...fns) {
  return (value) => fns.reduce((v, fn) => fn(v), value);
}`,
        hints: ['Use rest parameters to collect all functions', 'Use Array.reduce — start with the initial value, apply each function to the accumulator', 'Return a function that takes the initial value'],
        expectedOutput: '49',
      },
    ],
    keyTakeaways: [
      'Function declarations are hoisted — can be called before their line. Function expressions are not.',
      'Parameters = names in the definition (placeholders). Arguments = actual values passed when calling.',
      'Arrow functions: no own "this", no "arguments" object, cannot use "new", no "prototype".',
      'Implicit return in arrow functions: "(a, b) => a + b" — only works without curly braces.',
      'To return an object from an arrow function, wrap it in parentheses: "() => ({ key: value })".',
      'Default parameters only trigger for "undefined", not for null, 0, or empty string.',
      'Rest parameters collect remaining args into a real array: "function fn(a, ...rest)".',
      'Functions are first-class values — you can store, pass, and return them like any variable.',
      'A callback is a function passed as an argument. A higher-order function takes or returns a function.',
    ],
    prevLesson: 'loops',
    nextLesson: 'scope-and-closures',
  },
  {
    id: 'scope-and-closures',
    slug: 'scope-and-closures',
    title: 'Scope & Closures',
    description: 'Lexical scope, the scope chain, closures, and practical closure patterns.',
    category: 'Functions',
    order: 11,
    difficulty: 'intermediate',
    estimatedTime: 30,
    content: `**Scope** defines where variables are accessible. JavaScript uses **lexical scope** — scope is determined by where code is written, not where it is called.\n\n**Scope types:**\n- **Global scope:** Variables declared outside any function/block\n- **Function scope:** Variables declared inside a function (var, let, const)\n- **Block scope:** Variables declared inside {} with let/const\n- **Module scope:** Variables in a module file\n\n**Scope chain:** When looking up a variable, JS looks in the current scope, then the outer scope, then outer of that, all the way to global. This is the scope chain.\n\n**Closure:** A function that remembers its outer scope even after the outer function has returned. This is one of the most powerful features of JavaScript.\n\n**Real-world analogy:** Imagine nested rooms. Each room can see everything in outer rooms, but outer rooms cannot see into inner rooms. A closure is like taking a snapshot of everything visible to you when you leave a room — you carry that memory with you.`,
    codeExamples: [
      {
        title: 'Scope chain',
        code: `const global = "I am global";

function outer() {
  const outerVar = "I am outer";

  function inner() {
    const innerVar = "I am inner";
    // Can access all outer scopes
    console.log(innerVar);  // own scope
    console.log(outerVar);  // outer scope
    console.log(global);    // global scope
  }

  inner();
  // console.log(innerVar); // ReferenceError: not in scope
}

outer();`,
        output: 'I am inner\nI am outer\nI am global',
      },
      {
        title: 'Closures in action',
        code: `function makeCounter(start = 0) {
  let count = start; // this is "closed over"

  return {
    increment() { return ++count; },
    decrement() { return --count; },
    getCount() { return count; }
  };
}

const counter = makeCounter(10);
console.log(counter.increment()); // 11
console.log(counter.increment()); // 12
console.log(counter.decrement()); // 11
console.log(counter.getCount());  // 11

// count is private — can't access directly
// console.log(count); // ReferenceError`,
        output: '11\n12\n11\n11',
      },
      {
        title: 'Classic closure gotcha',
        code: `// The classic var-in-loop bug
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // logs 3, 3, 3 !!
}

// Fix 1: use let (creates new binding per iteration)
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // logs 0, 1, 2
}

// Fix 2: IIFE (immediately invoked function expression)
for (var i = 0; i < 3; i++) {
  ((j) => setTimeout(() => console.log(j), 100))(i);
}`,
        output: '3\n3\n3\n0\n1\n2\n0\n1\n2',
      },
    ],
    commonMistakes: [
      'The var-in-loop bug — var is function-scoped, so all callbacks share the same i.',
      'Thinking closures create a copy — they capture a reference to the variable, not its value at the time.',
      'Memory leaks from closures holding large objects that should be garbage collected.',
    ],
    interviewQuestions: [
      {
        question: 'What is a closure?',
        answer: 'A closure is a function that has access to its outer lexical scope even after the outer function has returned. The function "closes over" variables from its enclosing scope. This enables patterns like private variables, factories, and memoization.',
        difficulty: 'intermediate',
        followUp: ['Give a practical use case for closures', 'Can closures cause memory leaks?'],
      },
      {
        question: 'What will this code print? for(var i=0;i<3;i++){setTimeout(()=>console.log(i),0)}',
        answer: 'It prints 3, 3, 3. Because var is function-scoped, all three callbacks share the same i. By the time the callbacks run (after the loop), i is 3. Fix: use let (block-scoped) or wrap in an IIFE.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'ex-cl-1',
        title: 'Build a memoize function',
        description: 'Use closures to build a memoize function that caches the results of expensive function calls.',
        starterCode: `function memoize(fn) {
  // Use a closure to create a cache
  // Return a new function that checks the cache before calling fn
}

const expensiveAdd = (a, b) => {
  console.log("Computing...");
  return a + b;
};

const memoAdd = memoize(expensiveAdd);
console.log(memoAdd(2, 3)); // "Computing..." then 5
console.log(memoAdd(2, 3)); // 5 (no "Computing...")
console.log(memoAdd(4, 5)); // "Computing..." then 9`,
        solution: `function memoize(fn) {
  const cache = {};
  return function(...args) {
    const key = JSON.stringify(args);
    if (key in cache) return cache[key];
    cache[key] = fn(...args);
    return cache[key];
  };
}`,
        hints: ['Use an object as the cache', 'JSON.stringify(args) makes a string key from the arguments'],
        expectedOutput: 'Computing...\n5\n5\nComputing...\n9',
      },
    ],
    keyTakeaways: [
      'Lexical scope: scope is determined by where code is written',
      'Scope chain: looks up through nested scopes to global',
      'Closure: function remembers outer scope after outer function returns',
      'Use let in loops to avoid the var closure bug',
      'Closures enable: private variables, factories, memoization',
    ],
    prevLesson: 'functions',
    nextLesson: 'higher-order-functions',
  },
  {
    id: 'higher-order-functions',
    slug: 'higher-order-functions',
    title: 'Higher-Order Functions',
    description: 'Functions that take or return functions — map, filter, reduce, and building your own.',
    category: 'Functions',
    order: 12,
    difficulty: 'intermediate',
    estimatedTime: 25,
    content: `A **higher-order function (HOF)** is a function that either: takes one or more functions as arguments, or returns a function.\n\nThis is possible because JavaScript functions are first-class citizens — they can be passed around like any other value.\n\n**Built-in HOFs you already know:** map, filter, reduce, forEach, find, every, some, sort (with comparator), setTimeout (takes a callback)\n\n**Why they matter:** HOFs enable functional programming patterns — composing small, pure functions to build complex behavior. They lead to more readable, reusable, testable code.\n\n**Callbacks:** A function passed as an argument to be called later. The foundation of HOFs and async code.`,
    codeExamples: [
      {
        title: 'Functions as arguments',
        code: `// forEach is a HOF — takes a callback
[1, 2, 3].forEach(function(num) {
  console.log(num * 2);
});

// Pass different behaviors to the same HOF
function applyToAll(arr, transform) {
  return arr.map(transform);
}

const double = n => n * 2;
const square = n => n * n;

console.log(applyToAll([1, 2, 3], double)); // [2, 4, 6]
console.log(applyToAll([1, 2, 3], square)); // [1, 4, 9]`,
        output: '2\n4\n6\n[2,4,6]\n[1,4,9]',
      },
      {
        title: 'Functions that return functions (factories)',
        code: `// A function factory
function makeGreeter(greeting) {
  return function(name) {
    return \`\${greeting}, \${name}!\`;
  };
}

const sayHello = makeGreeter("Hello");
const sayHi = makeGreeter("Hi");

console.log(sayHello("Alice")); // "Hello, Alice!"
console.log(sayHi("Bob"));      // "Hi, Bob!"

// Real example: event handler factory
function makeHandler(action) {
  return (event) => {
    console.log(\`Action: \${action}\`);
  };
}`,
        output: 'Hello, Alice!\nHi, Bob!',
      },
    ],
    commonMistakes: [
      'Calling the function instead of passing it: .map(fn()) passes the result, not the function.',
      'Confusing callback invocation with passing — always pass the function reference.',
    ],
    interviewQuestions: [
      {
        question: 'What is a higher-order function?',
        answer: 'A function that takes a function as an argument and/or returns a function. Examples: map, filter, reduce, setTimeout. They enable functional programming patterns like composition, currying, and partial application.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'ex-hof-1',
        title: 'Build your own filter',
        description: 'Implement myFilter that works like Array.prototype.filter.',
        starterCode: `function myFilter(array, predicate) {
  // Return new array with elements where predicate returns true
  // Do NOT use the built-in .filter()
}

const numbers = [1, 2, 3, 4, 5, 6];
console.log(myFilter(numbers, n => n % 2 === 0)); // [2, 4, 6]
console.log(myFilter(numbers, n => n > 4));        // [5, 6]`,
        solution: `function myFilter(array, predicate) {
  const result = [];
  for (const item of array) {
    if (predicate(item)) result.push(item);
  }
  return result;
}`,
        hints: ['Iterate over the array', 'Call predicate(item) to test each element'],
        expectedOutput: '[2,4,6]\n[5,6]',
      },
    ],
    keyTakeaways: [
      'HOFs take functions as args and/or return functions',
      'map, filter, reduce, forEach are all HOFs',
      'Pass function references, not calls: .map(fn) not .map(fn())',
      'Function factories return customized functions via closures',
    ],
    prevLesson: 'scope-and-closures',
    nextLesson: 'prototype-and-inheritance',
  },
  {
    id: 'prototype-and-inheritance',
    slug: 'prototype-and-inheritance',
    title: 'Prototypes & Inheritance',
    description: 'Prototype chain, class syntax, extends, super, and how inheritance works in JS.',
    category: 'Advanced JavaScript',
    order: 13,
    difficulty: 'advanced',
    estimatedTime: 35,
    content: `JavaScript uses **prototypal inheritance** — objects inherit directly from other objects. Every object has an internal [[Prototype]] link pointing to another object (or null).\n\nWhen you access a property, JS looks at the object itself, then its prototype, then the prototype's prototype, all the way up the chain until it reaches null. This is the **prototype chain**.\n\n**class syntax** (ES6) is syntactic sugar over prototypes. Under the hood, it is still prototype-based inheritance.\n\n**Key concepts:**\n- Every function has a .prototype property\n- Object instances have __proto__ (or Object.getPrototypeOf()) pointing to the constructor's .prototype\n- Classes use extends for inheritance and super() to call the parent constructor\n- Methods on the prototype are shared across all instances (memory efficient)`,
    codeExamples: [
      {
        title: 'Class syntax (modern approach)',
        code: `class Animal {
  constructor(name, sound) {
    this.name = name;
    this.sound = sound;
  }

  speak() {
    return \`\${this.name} says \${this.sound}\`;
  }

  toString() {
    return \`Animal(\${this.name})\`;
  }
}

class Dog extends Animal {
  constructor(name) {
    super(name, "Woof"); // must call super first
    this.tricks = [];
  }

  learn(trick) {
    this.tricks.push(trick);
    return this;
  }
}

const dog = new Dog("Rex");
console.log(dog.speak());    // "Rex says Woof"
dog.learn("sit").learn("shake");
console.log(dog.tricks);     // ["sit", "shake"]`,
        output: 'Rex says Woof\n["sit","shake"]',
      },
      {
        title: 'Prototype chain under the hood',
        code: `function Person(name) {
  this.name = name;
}
Person.prototype.greet = function() {
  return \`Hi, I'm \${this.name}\`;
};

const alice = new Person("Alice");
console.log(alice.greet()); // "Hi, I'm Alice"

// The chain:
console.log(Object.getPrototypeOf(alice) === Person.prototype); // true
console.log(Object.getPrototypeOf(Person.prototype) === Object.prototype); // true
console.log(Object.getPrototypeOf(Object.prototype)); // null (chain end)

// instanceof checks the prototype chain
console.log(alice instanceof Person); // true
console.log(alice instanceof Object); // true`,
        output: "Hi, I'm Alice\ntrue\ntrue\nnull\ntrue\ntrue",
      },
    ],
    commonMistakes: [
      'Forgetting to call super() in a subclass constructor — throws ReferenceError.',
      'Defining methods in the constructor (on each instance) instead of the prototype (shared).',
      'Mutating Object.prototype — affects all objects everywhere.',
    ],
    interviewQuestions: [
      {
        question: 'How does prototypal inheritance work in JavaScript?',
        answer: 'Every object has an internal prototype link. When accessing a property, JS traverses the prototype chain: current object → prototype → prototype of prototype → ... → null. The class syntax is sugar over this mechanism — extends sets up the prototype chain.',
        difficulty: 'advanced',
      },
      {
        question: 'What is the difference between __proto__ and prototype?',
        answer: '__proto__ (or Object.getPrototypeOf()) is a property on object instances pointing to their prototype. .prototype is a property on constructor functions pointing to the object that will become instances\' prototype when using new. They are related but different.',
        difficulty: 'advanced',
      },
    ],
    exercises: [
      {
        id: 'ex-proto-1',
        title: 'Class hierarchy',
        description: 'Create a Shape class and a Circle subclass with an area() method.',
        starterCode: `class Shape {
  constructor(color) {
    this.color = color;
  }

  describe() {
    return \`A \${this.color} shape\`;
  }
}

class Circle extends Shape {
  constructor(color, radius) {
    // Call super, store radius
  }

  area() {
    // Return π * r²
  }
}

const c = new Circle("red", 5);
console.log(c.describe()); // "A red shape"
console.log(c.area().toFixed(2)); // "78.54"`,
        solution: `class Shape {
  constructor(color) {
    this.color = color;
  }
  describe() {
    return \`A \${this.color} shape\`;
  }
}

class Circle extends Shape {
  constructor(color, radius) {
    super(color);
    this.radius = radius;
  }
  area() {
    return Math.PI * this.radius ** 2;
  }
}`,
        hints: ['Use super(color) in Circle constructor', 'Math.PI is available globally'],
        expectedOutput: 'A red shape\n78.54',
      },
    ],
    keyTakeaways: [
      'JS uses prototype chain for property lookup',
      'class is syntax sugar over prototype-based inheritance',
      'extends sets up prototype chain; super() calls parent constructor',
      'Methods on prototype are shared; properties on this are per-instance',
    ],
    prevLesson: 'higher-order-functions',
    nextLesson: 'this-keyword',
  },
  {
    id: 'this-keyword',
    slug: 'this-keyword',
    title: 'The this Keyword',
    description: 'How this works in different contexts, bind/call/apply, and common pitfalls.',
    category: 'Advanced JavaScript',
    order: 14,
    difficulty: 'advanced',
    estimatedTime: 30,
    content: `\`this\` refers to the **execution context** — the object that a function is called on. The value of \`this\` is determined at call time, not at definition time (except for arrow functions).\n\n**Rules for this (in order of priority):**\n1. **new** binding: \`new Fn()\` — this = newly created object\n2. **Explicit** binding: \`fn.call(obj)\` / \`fn.apply(obj)\` / \`fn.bind(obj)\` — this = obj\n3. **Implicit** binding: \`obj.method()\` — this = obj\n4. **Default** binding: \`fn()\` — this = global (window) or undefined in strict mode\n\n**Arrow functions**: Don't have own this — they inherit from the enclosing lexical scope. This makes them ideal for callbacks inside methods.\n\n**bind/call/apply:**\n- \`call(thisArg, arg1, arg2)\` — call immediately with specific this\n- \`apply(thisArg, [args])\` — like call but arguments as array\n- \`bind(thisArg)\` — returns NEW function with this permanently set`,
    codeExamples: [
      {
        title: 'this in different contexts',
        code: `const user = {
  name: "Alice",
  // Regular method — this is the object
  greet() {
    console.log(\`Hi from \${this.name}\`);
  },
  // Arrow — this from outer scope (module/global, not user)
  greetArrow: () => {
    console.log(\`Hi from \${this?.name}\`); // undefined!
  }
};

user.greet();       // "Hi from Alice" ✓
user.greetArrow();  // "Hi from undefined" ✗

// Lost this context
const fn = user.greet;
fn(); // "Hi from undefined" — this is now global/undefined`,
        output: 'Hi from Alice\nHi from undefined\nHi from undefined',
      },
      {
        title: 'bind, call, apply',
        code: `function greet(greeting, punctuation) {
  return \`\${greeting}, \${this.name}\${punctuation}\`;
}

const alice = { name: "Alice" };
const bob   = { name: "Bob" };

// call — immediate, args listed
console.log(greet.call(alice, "Hello", "!"));  // "Hello, Alice!"

// apply — immediate, args as array
console.log(greet.apply(bob, ["Hi", "?"]));    // "Hi, Bob?"

// bind — returns new function
const greetAlice = greet.bind(alice, "Hey");
console.log(greetAlice("..."));                 // "Hey, Alice..."`,
        output: 'Hello, Alice!\nHi, Bob?\nHey, Alice...',
      },
      {
        title: 'Arrow function fix for callbacks',
        code: `class Timer {
  constructor() {
    this.seconds = 0;
  }

  start() {
    // Arrow function — inherits this from start()
    setInterval(() => {
      this.seconds++;
      console.log(this.seconds);
    }, 1000);

    // Regular function would lose this:
    // setInterval(function() {
    //   this.seconds++; // ERROR: this is undefined/window
    // }, 1000);
  }
}`,
        explanation: 'Arrow functions in class methods maintain the correct this.',
      },
    ],
    commonMistakes: [
      'Using arrow functions as object methods — they don\'t have own this.',
      'Passing methods as callbacks without binding: btn.addEventListener("click", obj.method) — this will be the button element, not obj.',
      'Forgetting that this in a regular function inside a method is not the object.',
    ],
    interviewQuestions: [
      {
        question: 'Explain the four rules that determine the value of this.',
        answer: '1) new binding: new Fn() creates new object, this = that object. 2) Explicit binding: call/apply/bind explicitly set this. 3) Implicit binding: obj.method() — this = obj. 4) Default binding: standalone function call — this = global (or undefined in strict mode). Arrow functions are special: no own this, inherit from enclosing scope.',
        difficulty: 'advanced',
      },
      {
        question: 'What is the difference between call, apply, and bind?',
        answer: 'All three set this explicitly. call(thisArg, arg1, arg2) calls the function immediately, arguments listed individually. apply(thisArg, [arg1, arg2]) calls immediately, arguments as array. bind(thisArg) returns a NEW function with this permanently set, does not call it.',
        difficulty: 'advanced',
      },
    ],
    exercises: [
      {
        id: 'ex-this-1',
        title: 'Fix the this bug',
        description: 'Fix the code so that the button\'s click handler correctly accesses the component\'s message.',
        starterCode: `class Component {
  constructor(message) {
    this.message = message;
    this.button = { click: null }; // simulate a button
  }

  setup() {
    // BUG: this.handleClick loses 'this' context
    this.button.click = this.handleClick;
    this.button.click(); // Should log the message
  }

  handleClick() {
    console.log(this.message);
  }
}

const comp = new Component("Hello from component!");
comp.setup();`,
        solution: `class Component {
  constructor(message) {
    this.message = message;
    this.button = { click: null };
  }

  setup() {
    // Fix 1: bind
    this.button.click = this.handleClick.bind(this);
    // Fix 2: arrow wrapper
    // this.button.click = () => this.handleClick();
    this.button.click();
  }

  handleClick() {
    console.log(this.message);
  }
}`,
        hints: ['Use .bind(this) or an arrow function wrapper'],
        expectedOutput: 'Hello from component!',
      },
    ],
    keyTakeaways: [
      'this is dynamic — determined at call time, not definition time',
      'Arrow functions inherit this from enclosing scope',
      'call/apply: call immediately with explicit this',
      'bind: return new function with fixed this',
      'Object method: this = object. Standalone call: this = global/undefined',
    ],
    prevLesson: 'prototype-and-inheritance',
    nextLesson: 'promises',
  },
  {
    id: 'promises',
    slug: 'promises',
    title: 'Promises',
    description: 'Creating promises, chaining .then/.catch/.finally, Promise.all, and error handling.',
    category: 'Asynchronous JavaScript',
    order: 15,
    difficulty: 'intermediate',
    estimatedTime: 30,
    content: `A **Promise** is an object representing the eventual completion or failure of an asynchronous operation. It is a placeholder for a future value.\n\n**Three states:** pending → fulfilled (resolved) or rejected. Once settled (fulfilled or rejected), a promise is immutable.\n\n**Creating a Promise:** \`new Promise((resolve, reject) => {})\`. Call resolve(value) to fulfill, reject(error) to reject.\n\n**Consuming a Promise:**\n- \`.then(onFulfilled, onRejected)\` — handles fulfillment\n- \`.catch(onRejected)\` — handles rejection (same as .then(null, fn))\n- \`.finally(callback)\` — runs regardless of outcome\n\n**Promise static methods:**\n- \`Promise.all([...promises])\` — waits for ALL to resolve (fails if any rejects)\n- \`Promise.allSettled([...promises])\` — waits for ALL, never fails\n- \`Promise.race([...promises])\` — settles with first one that settles\n- \`Promise.any([...promises])\` — fulfills with first success\n- \`Promise.resolve(value)\` / \`Promise.reject(error)\` — create settled promises`,
    codeExamples: [
      {
        title: 'Creating and consuming promises',
        code: `// Creating a promise
function fetchUser(id) {
  return new Promise((resolve, reject) => {
    if (id <= 0) {
      reject(new Error("Invalid ID"));
      return;
    }
    // Simulate async work
    setTimeout(() => {
      resolve({ id, name: "Alice" });
    }, 1000);
  });
}

// Consuming with .then/.catch
fetchUser(1)
  .then(user => {
    console.log("Got user:", user.name); // "Got user: Alice"
    return user.name.toUpperCase();      // return for chaining
  })
  .then(name => console.log("Upper:", name))
  .catch(err => console.log("Error:", err.message))
  .finally(() => console.log("Done"));`,
        output: 'Got user: Alice\nUpper: ALICE\nDone',
      },
      {
        title: 'Promise chaining',
        code: `function getUser(id) {
  return Promise.resolve({ id, name: "Alice" });
}
function getPosts(userId) {
  return Promise.resolve([{ title: "Post 1" }, { title: "Post 2" }]);
}

getUser(1)
  .then(user => getPosts(user.id))  // return a new promise
  .then(posts => {
    console.log(posts.length); // 2
    return posts.map(p => p.title);
  })
  .then(titles => console.log(titles));
  // ["Post 1", "Post 2"]`,
        output: '2\n["Post 1","Post 2"]',
      },
      {
        title: 'Promise.all for parallel requests',
        code: `const p1 = Promise.resolve("user data");
const p2 = Promise.resolve("posts data");
const p3 = Promise.resolve("comments data");

// All in parallel, wait for all
Promise.all([p1, p2, p3])
  .then(([user, posts, comments]) => {
    console.log(user);     // "user data"
    console.log(posts);    // "posts data"
    console.log(comments); // "comments data"
  });

// allSettled never rejects
Promise.allSettled([
  Promise.resolve("ok"),
  Promise.reject("error"),
]).then(results => {
  results.forEach(r => console.log(r.status));
  // "fulfilled", "rejected"
});`,
        output: 'user data\nposts data\ncomments data\nfulfilled\nrejected',
      },
    ],
    commonMistakes: [
      'Not returning a promise inside .then() — breaks the chain, next .then receives undefined.',
      'Not having a .catch() — unhandled rejections cause crashes in Node.js.',
      'Creating unnecessary promise wrappers — if a function already returns a promise, don\'t wrap it.',
    ],
    interviewQuestions: [
      {
        question: 'What are the states of a Promise?',
        answer: 'Three states: pending (initial, operation in progress), fulfilled (resolved successfully with a value), rejected (failed with a reason/error). Once fulfilled or rejected, a promise is settled and cannot change state.',
        difficulty: 'beginner',
      },
      {
        question: 'What is the difference between Promise.all and Promise.allSettled?',
        answer: 'Promise.all rejects immediately when any promise rejects (fail-fast). Promise.allSettled always waits for all promises and returns an array of {status, value/reason} objects regardless of success or failure. Use allSettled when you want results from all even if some fail.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'ex-prom-1',
        title: 'Promisify a callback function',
        description: 'Convert a callback-based function to return a Promise.',
        starterCode: `// Callback-based (old style)
function fetchDataCallback(id, callback) {
  setTimeout(() => {
    if (id > 0) callback(null, { id, data: "some data" });
    else callback(new Error("Bad ID"), null);
  }, 100);
}

// Convert to promise-based
function fetchData(id) {
  return new Promise((resolve, reject) => {
    // Use fetchDataCallback inside here
  });
}

fetchData(1).then(d => console.log(d.data));  // "some data"
fetchData(-1).catch(e => console.log(e.message)); // "Bad ID"`,
        solution: `function fetchData(id) {
  return new Promise((resolve, reject) => {
    fetchDataCallback(id, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}`,
        hints: ['Call the original function inside the Promise constructor', 'In the callback, check err: if err exists, reject; else resolve'],
        expectedOutput: 'some data\nBad ID',
      },
    ],
    keyTakeaways: [
      'Promise: pending → fulfilled or rejected (immutable once settled)',
      'Always return from inside .then() to chain properly',
      'Always add .catch() to handle rejections',
      'Promise.all: parallel, fails fast. Promise.allSettled: parallel, never fails',
      '.finally() always runs — good for cleanup',
    ],
    prevLesson: 'this-keyword',
    nextLesson: 'async-await',
  },
  {
    id: 'async-await',
    slug: 'async-await',
    title: 'Async/Await',
    description: 'Writing async code that reads like synchronous code, error handling, and parallel patterns.',
    category: 'Asynchronous JavaScript',
    order: 16,
    difficulty: 'intermediate',
    estimatedTime: 25,
    content: `\`async/await\` is syntactic sugar over Promises that makes async code look and behave more like synchronous code.\n\n**async function:** Always returns a Promise. If you return a non-promise value, it gets wrapped in Promise.resolve().\n\n**await:** Pauses execution of the async function until the Promise settles. Can only be used inside an async function (or at top-level in ES modules).\n\n**Error handling:** Use try/catch/finally to handle rejections from await expressions.\n\n**Parallel execution:** \`await promise1; await promise2;\` is sequential — 2 seconds total if each takes 1s. Use \`Promise.all([p1, p2])\` with await for true parallel: 1 second total.\n\n**Common pattern:** \`const [a, b] = await Promise.all([fetch1(), fetch2()])\``,
    codeExamples: [
      {
        title: 'async/await basics',
        code: `// Without async/await (promise chains)
function getUser() {
  return fetch('/api/user')
    .then(r => r.json())
    .then(user => user.name);
}

// With async/await (same thing, cleaner)
async function getUser() {
  const response = await fetch('/api/user');
  const user = await response.json();
  return user.name; // wrapped in Promise.resolve()
}

// Calling an async function
const name = await getUser();
// OR with .then:
getUser().then(name => console.log(name));`,
        explanation: 'async/await is just promise chains with nicer syntax.',
      },
      {
        title: 'Error handling with try/catch',
        code: `async function fetchUser(id) {
  try {
    const res = await fetch(\`/api/users/\${id}\`);

    if (!res.ok) {
      throw new Error(\`HTTP \${res.status}\`);
    }

    const user = await res.json();
    return user;
  } catch (error) {
    console.error("Failed to fetch user:", error.message);
    return null; // or re-throw
  } finally {
    console.log("Fetch attempt complete");
  }
}`,
      },
      {
        title: 'Sequential vs parallel',
        code: `// SEQUENTIAL — takes 2 seconds total
async function sequential() {
  const user = await fetchUser(1);    // wait 1s
  const posts = await fetchPosts(1);  // wait 1s more
  return { user, posts };
}

// PARALLEL — takes 1 second total
async function parallel() {
  const [user, posts] = await Promise.all([
    fetchUser(1),   // start both immediately
    fetchPosts(1),  //
  ]);
  return { user, posts };
}

// When one depends on the other — must be sequential
async function dependent() {
  const user = await fetchUser(1);
  const posts = await fetchPosts(user.id); // needs user first
  return { user, posts };
}`,
        explanation: 'Use Promise.all when operations are independent; sequential when one depends on another.',
      },
    ],
    commonMistakes: [
      'Using await in a non-async function — SyntaxError.',
      'Sequential awaits when you could parallelize — unnecessarily slow.',
      'Not handling errors with try/catch — unhandled promise rejections.',
      'await-ing in a .forEach loop — forEach doesn\'t await, use for...of instead.',
    ],
    interviewQuestions: [
      {
        question: 'What does async/await compile down to?',
        answer: 'async/await is syntactic sugar over Promises and generators. An async function always returns a Promise. await unwraps a Promise and suspends the function until it settles, then resumes with the resolved value. Under the hood, it uses generator-like coroutine mechanics.',
        difficulty: 'intermediate',
      },
      {
        question: 'How do you run multiple async operations in parallel?',
        answer: 'Use Promise.all([...promises]) with await: const [a, b] = await Promise.all([fetchA(), fetchB()]). Both operations start simultaneously. Individual sequential awaits run one after another. Promise.allSettled if you want all results even if some fail.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'ex-async-1',
        title: 'Retry logic',
        description: 'Write an async function that retries a failing operation up to N times.',
        starterCode: `async function withRetry(fn, maxRetries = 3) {
  // Try to call fn()
  // If it rejects, retry up to maxRetries times
  // If all retries fail, throw the last error
}

let attempts = 0;
async function unstable() {
  attempts++;
  if (attempts < 3) throw new Error("Failed");
  return "Success!";
}

withRetry(unstable).then(console.log); // "Success!" after 3 attempts`,
        solution: `async function withRetry(fn, maxRetries = 3) {
  let lastError;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError;
}`,
        hints: ['Use a for loop', 'try/catch inside the loop', 'return on success, store error for retry'],
        expectedOutput: 'Success!',
      },
    ],
    keyTakeaways: [
      'async functions always return a Promise',
      'await pauses execution until Promise settles',
      'Use try/catch for error handling in async functions',
      'await in forEach does NOT work — use for...of',
      'Promise.all for parallel; sequential awaits for dependent operations',
    ],
    prevLesson: 'promises',
    nextLesson: 'dom-manipulation',
  },
  {
    id: 'dom-manipulation',
    slug: 'dom-manipulation',
    title: 'DOM Manipulation',
    description: 'Selecting elements, modifying the DOM, events, and modern DOM APIs.',
    category: 'Browser APIs',
    order: 17,
    difficulty: 'intermediate',
    estimatedTime: 30,
    content: `The **DOM (Document Object Model)** is a tree-structured representation of an HTML document. JavaScript can read and modify it, making pages interactive.\n\n**Selecting elements:**\n- \`document.getElementById("id")\` — single element by ID\n- \`document.querySelector("css-selector")\` — first match\n- \`document.querySelectorAll("css-selector")\` — all matches (NodeList)\n\n**Modifying elements:**\n- \`.textContent\` — get/set text (safe, no HTML parsing)\n- \`.innerHTML\` — get/set HTML (risk of XSS, avoid with user input)\n- \`.setAttribute()\` / \`.getAttribute()\` / \`.removeAttribute()\`\n- \`.classList.add/remove/toggle/contains\`\n- \`.style.property\`\n\n**Creating/removing elements:**\n- \`document.createElement("tag")\`\n- \`.appendChild()\` / \`.append()\` / \`.prepend()\`\n- \`.remove()\` / \`.removeChild()\`\n\n**Events:**\n- \`.addEventListener("event", handler)\`\n- \`.removeEventListener("event", handler)\`\n- Event object: e.target, e.preventDefault(), e.stopPropagation()`,
    codeExamples: [
      {
        title: 'Selecting and modifying elements',
        code: `// Selecting
const btn = document.querySelector("#myButton");
const items = document.querySelectorAll(".item");

// Modifying text
btn.textContent = "Click me!";

// Adding/removing classes
btn.classList.add("active");
btn.classList.remove("disabled");
btn.classList.toggle("highlight");
console.log(btn.classList.contains("active")); // true

// Style
btn.style.backgroundColor = "blue";
btn.style.color = "white";

// Data attributes
btn.dataset.userId = "123";
console.log(btn.dataset.userId); // "123"`,
      },
      {
        title: 'Creating and inserting elements',
        code: `// Create
const li = document.createElement("li");
li.textContent = "New item";
li.classList.add("item");

// Insert
const ul = document.querySelector("ul");
ul.appendChild(li);           // add at end
ul.prepend(li);               // add at start
ul.insertAdjacentHTML("beforeend", "<li>Another</li>");

// Remove
li.remove();

// Clone
const clone = li.cloneNode(true); // true = deep clone
ul.append(clone);`,
      },
      {
        title: 'Event handling',
        code: `const button = document.querySelector("button");

// Add event listener
function handleClick(event) {
  console.log("Clicked!", event.target);
  event.preventDefault(); // prevent default action (e.g., form submit)
}

button.addEventListener("click", handleClick);

// Remove later
button.removeEventListener("click", handleClick);

// Event delegation — handle child events on parent
document.querySelector("ul").addEventListener("click", (e) => {
  if (e.target.tagName === "LI") {
    console.log("Clicked item:", e.target.textContent);
  }
});`,
      },
    ],
    commonMistakes: [
      'Using innerHTML with user input — major XSS vulnerability. Use textContent instead.',
      'Querying the DOM before it loads — wrap in DOMContentLoaded or put scripts at bottom.',
      'Not removing event listeners — can cause memory leaks, especially on re-rendered components.',
    ],
    interviewQuestions: [
      {
        question: 'What is event delegation and why use it?',
        answer: 'Event delegation means attaching one event listener to a parent element to handle events from multiple children. It uses event bubbling — events bubble up from target to document. Benefits: fewer event listeners (better performance), works for dynamically added children.',
        difficulty: 'intermediate',
      },
      {
        question: 'What is the difference between textContent and innerHTML?',
        answer: 'textContent gets/sets the text content as plain text — no HTML parsing. innerHTML gets/sets as HTML — parses HTML tags. textContent is safe for user input; innerHTML with user input is an XSS vulnerability. Use textContent by default.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'ex-dom-1',
        title: 'Build a todo list (DOM)',
        description: 'Write JS to add items to a todo list when a button is clicked.',
        starterCode: `// Assume this HTML exists:
// <input id="input" type="text">
// <button id="addBtn">Add</button>
// <ul id="list"></ul>

const input = document.querySelector("#input");
const addBtn = document.querySelector("#addBtn");
const list = document.querySelector("#list");

addBtn.addEventListener("click", () => {
  // 1. Get the input value
  // 2. If empty, return early
  // 3. Create a <li> with the text
  // 4. Append to the list
  // 5. Clear the input
});`,
        solution: `addBtn.addEventListener("click", () => {
  const text = input.value.trim();
  if (!text) return;

  const li = document.createElement("li");
  li.textContent = text;
  list.appendChild(li);
  input.value = "";
});`,
        hints: ['input.value.trim() to get the text', 'createElement + textContent + appendChild'],
        expectedOutput: '(Interactive - adds items to list)',
      },
    ],
    keyTakeaways: [
      'querySelector/querySelectorAll: modern CSS selector API',
      'textContent for text (safe); innerHTML for HTML (risky with user input)',
      'classList.add/remove/toggle for CSS classes',
      'addEventListener/removeEventListener for events',
      'Event delegation: one listener on parent for many children',
    ],
    prevLesson: 'async-await',
    nextLesson: 'error-handling',
  },
  {
    id: 'error-handling',
    slug: 'error-handling',
    title: 'Error Handling',
    description: 'try/catch/finally, custom errors, error types, and best practices.',
    category: 'Advanced JavaScript',
    order: 18,
    difficulty: 'intermediate',
    estimatedTime: 20,
    content: `Proper error handling is critical for building reliable applications.\n\n**try/catch/finally:** Wrap code that might throw in try. Handle errors in catch. Finally always runs (cleanup).\n\n**Error types in JS:**\n- \`Error\` — base class\n- \`TypeError\` — wrong type (null.property)\n- \`ReferenceError\` — undefined variable\n- \`SyntaxError\` — invalid syntax (caught at parse time)\n- \`RangeError\` — value out of range\n- \`URIError\` / \`EvalError\`\n\n**Custom errors:** Extend the Error class to create domain-specific errors.\n\n**Best practices:**\n- Always handle promise rejections\n- Use specific error types\n- Include meaningful error messages\n- Don't swallow errors with empty catch blocks\n- Log errors with context (what was being done)`,
    codeExamples: [
      {
        title: 'try/catch/finally',
        code: `function parseJSON(str) {
  try {
    const parsed = JSON.parse(str);
    return parsed;
  } catch (error) {
    console.error("Parse failed:", error.message);
    return null;
  } finally {
    console.log("Parse attempt done");
  }
}

parseJSON('{"name":"Alice"}'); // returns {name:"Alice"}
parseJSON('invalid json');      // logs error, returns null
// "Parse attempt done" always logs`,
        output: 'Parse attempt done\nParse failed: Unexpected token...\nParse attempt done',
      },
      {
        title: 'Custom error classes',
        code: `class ValidationError extends Error {
  constructor(field, message) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
  }
}

class NotFoundError extends Error {
  constructor(resource, id) {
    super(\`\${resource} with ID \${id} not found\`);
    this.name = "NotFoundError";
    this.statusCode = 404;
  }
}

function validateAge(age) {
  if (typeof age !== "number") {
    throw new ValidationError("age", "Age must be a number");
  }
  if (age < 0 || age > 150) {
    throw new ValidationError("age", "Age must be 0-150");
  }
}

try {
  validateAge("old");
} catch (err) {
  if (err instanceof ValidationError) {
    console.log(\`Validation failed on \${err.field}: \${err.message}\`);
  } else {
    throw err; // re-throw unexpected errors
  }
}`,
        output: 'Validation failed on age: Age must be a number',
      },
    ],
    commonMistakes: [
      'Empty catch blocks — silently swallowing errors makes debugging impossible.',
      'Catching all errors with instanceof Error — re-throw errors you don\'t know how to handle.',
      'Not handling Promise rejections — in Node.js this crashes the process.',
    ],
    interviewQuestions: [
      {
        question: 'When does the finally block run?',
        answer: 'Always — whether try completes normally, throws, or there is a return statement. It runs before the function actually returns. Useful for cleanup like closing connections or releasing resources.',
        difficulty: 'beginner',
      },
    ],
    exercises: [
      {
        id: 'ex-err-1',
        title: 'Safe division',
        description: 'Write a safeDivide function that throws a custom DivisionError when dividing by zero.',
        starterCode: `class DivisionError extends Error {
  constructor(message) {
    super(message);
    this.name = "DivisionError";
  }
}

function safeDivide(a, b) {
  // Throw DivisionError if b is 0
  // Otherwise return a / b
}

try {
  console.log(safeDivide(10, 2));  // 5
  console.log(safeDivide(10, 0));  // throws
} catch (e) {
  console.log(e.name + ": " + e.message);
}`,
        solution: `function safeDivide(a, b) {
  if (b === 0) throw new DivisionError("Cannot divide by zero");
  return a / b;
}`,
        hints: ['Check if b === 0 first'],
        expectedOutput: '5\nDivisionError: Cannot divide by zero',
      },
    ],
    keyTakeaways: [
      'try/catch/finally: catch errors, finally always runs',
      'Extend Error to create custom error types',
      'Never silently swallow errors with empty catch',
      'Re-throw errors you cannot handle',
      'instanceof to distinguish error types',
    ],
    prevLesson: 'dom-manipulation',
    nextLesson: 'es6-features',
  },
  {
    id: 'es6-features',
    slug: 'es6-features',
    title: 'ES6+ Modern Features',
    description: 'Destructuring, spread/rest, modules, optional chaining, nullish coalescing, and more ES2015+ features.',
    category: 'Modern JavaScript',
    order: 19,
    difficulty: 'intermediate',
    estimatedTime: 30,
    content: `ES6 (ECMAScript 2015) and later versions added many features that transformed how JavaScript is written. These are the ones you will use every day.\n\n**Already covered in other lessons:** let/const, arrow functions, template literals, destructuring, spread/rest, Promises, classes, modules.\n\n**Additional key features:**\n- **Symbols:** Unique identifiers for object keys\n- **Iterators & Generators:** Custom iteration protocols\n- **WeakMap/WeakSet:** Keys can be garbage collected\n- **Proxy:** Intercept object operations\n- **Reflect:** Reflective operations on objects\n- **Optional chaining (?.)** and **Nullish coalescing (??)**\n- **Logical assignment (&&=, ||=, ??=)**\n- **Array:** Array.from(), Array.at(), flat(), flatMap()\n- **Object:** Object.fromEntries(), structuredClone()\n- **String:** padStart/padEnd, replaceAll, matchAll\n- **Dynamic import():** Lazy load modules`,
    codeExamples: [
      {
        title: 'Destructuring (deep dive)',
        code: `// Nested destructuring
const {
  name,
  address: { city, zip = "00000" },
  scores: [first, , third]
} = {
  name: "Alice",
  address: { city: "London" },
  scores: [95, 87, 92]
};

console.log(city);  // "London"
console.log(zip);   // "00000" (default)
console.log(first); // 95
console.log(third); // 92

// Swap variables
let a = 1, b = 2;
[a, b] = [b, a];
console.log(a, b); // 2 1`,
        output: 'London\n00000\n95\n92\n2 1',
      },
      {
        title: 'ES modules',
        code: `// Named exports (math.js)
export const PI = 3.14159;
export function add(a, b) { return a + b; }
export function subtract(a, b) { return a - b; }

// Default export
export default class Calculator { }

// Importing (main.js)
import Calculator, { PI, add } from './math.js';
import * as Math from './math.js'; // import all

// Dynamic import (lazy loading)
const { add: lazyAdd } = await import('./math.js');`,
      },
      {
        title: 'Modern utility features',
        code: `// Array.at() — negative indexing
const arr = [1, 2, 3, 4, 5];
console.log(arr.at(-1)); // 5 (last element)
console.log(arr.at(-2)); // 4

// Object.fromEntries — inverse of Object.entries
const entries = [["name", "Alice"], ["age", 25]];
const obj = Object.fromEntries(entries);
console.log(obj); // { name: "Alice", age: 25 }

// Logical assignment
let user = null;
user ??= { name: "Guest" };     // assign if null/undefined
console.log(user); // { name: "Guest" }

let count = 0;
count ||= 10; // assign if falsy (0 is falsy, so this runs)
console.log(count); // 10

// structuredClone (deep clone)
const original = { a: { b: 1 } };
const clone = structuredClone(original);
clone.a.b = 99;
console.log(original.a.b); // 1 — unaffected`,
        output: '5\n4\n{name:"Alice",age:25}\n{name:"Guest"}\n10\n1',
      },
    ],
    commonMistakes: [
      'Mixing default and named exports imports syntax.',
      'Using dynamic import() synchronously — it returns a Promise, must be awaited.',
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between import and require?',
        answer: 'require is Node.js CommonJS — synchronous, dynamic (can be in if-blocks), returns the exported object. import is ES Modules — static (must be at top level), asynchronous (allows tree-shaking), uses export/import syntax. Modern JS/TypeScript projects use ES Modules.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'ex-es6-1',
        title: 'Destructure and transform',
        description: 'Use destructuring and spread to merge two user objects, overriding the first with the second.',
        starterCode: `const defaultUser = { role: "user", theme: "dark", lang: "en" };
const userPrefs  = { theme: "light", notifications: true };

// Merge: defaultUser as base, userPrefs overrides
function mergePrefs(defaults, overrides) {
  // Return merged object
}

console.log(mergePrefs(defaultUser, userPrefs));
// { role: "user", theme: "light", lang: "en", notifications: true }`,
        solution: `function mergePrefs(defaults, overrides) {
  return { ...defaults, ...overrides };
}`,
        hints: ['Spread defaults first, then overrides — later keys win'],
        expectedOutput: '{role:"user",theme:"light",lang:"en",notifications:true}',
      },
    ],
    keyTakeaways: [
      'Destructuring works on nested objects and arrays with defaults',
      'ES modules: named exports + default export, static import',
      'Dynamic import() for lazy loading — returns a Promise',
      'Array.at(-1) for last element',
      'structuredClone() for true deep copies',
    ],
    prevLesson: 'error-handling',
    nextLesson: 'event-loop',
  },
  {
    id: 'event-loop',
    slug: 'event-loop',
    title: 'Event Loop & Execution Model',
    description: 'Call stack, heap, event loop, task queue, microtask queue — how JavaScript really works.',
    category: 'Advanced JavaScript',
    order: 20,
    difficulty: 'advanced',
    estimatedTime: 35,
    content: `Understanding the event loop explains why async code works the way it does.\n\n**Components:**\n- **Call Stack:** Where function calls live. LIFO. One function at a time.\n- **Heap:** Where objects are allocated in memory.\n- **Web APIs / Node APIs:** Handle async operations (setTimeout, fetch, DOM events).\n- **Task Queue (Macrotask):** setTimeout, setInterval, I/O callbacks.\n- **Microtask Queue:** Promise callbacks (.then, .catch), queueMicrotask(), MutationObserver.\n- **Event Loop:** Checks: is call stack empty? Yes → run ALL microtasks, then one macrotask. Repeat.\n\n**Priority:** Microtasks > Macrotasks. All pending microtasks run before the next macrotask.\n\n**Practical implication:** \`Promise.resolve().then(fn)\` runs before \`setTimeout(fn, 0)\` even though both are "async".`,
    codeExamples: [
      {
        title: 'Execution order',
        code: `console.log("1 - synchronous");

setTimeout(() => console.log("2 - setTimeout (macrotask)"), 0);

Promise.resolve()
  .then(() => console.log("3 - promise microtask 1"))
  .then(() => console.log("4 - promise microtask 2"));

console.log("5 - synchronous");

// Output order:
// 1 - synchronous
// 5 - synchronous
// 3 - promise microtask 1
// 4 - promise microtask 2
// 2 - setTimeout (macrotask)`,
        output: '1 - synchronous\n5 - synchronous\n3 - promise microtask 1\n4 - promise microtask 2\n2 - setTimeout (macrotask)',
      },
      {
        title: 'Why setTimeout 0 is not instant',
        code: `// This blocks for 1 second — everything queued waits
const start = Date.now();
while (Date.now() - start < 1000) {}

setTimeout(() => console.log("runs after 1s+"), 0);
console.log("This runs first");

// The 0ms timeout only means "at minimum 0ms after current stack clears"
// If JS is busy, it waits longer`,
        output: 'This runs first\nruns after 1s+',
      },
    ],
    commonMistakes: [
      'Thinking setTimeout(fn, 0) runs immediately — it runs after the current call stack AND all microtasks.',
      'Blocking the event loop with synchronous heavy computation — freezes the UI.',
      'Not understanding why Promise.then runs before setTimeout.',
    ],
    interviewQuestions: [
      {
        question: 'What is the event loop?',
        answer: 'The event loop is the mechanism that allows JavaScript to be non-blocking despite being single-threaded. It continuously checks: if the call stack is empty, it first flushes all microtasks (Promise callbacks), then picks one macrotask (setTimeout callback) from the task queue and pushes it onto the stack.',
        difficulty: 'advanced',
      },
      {
        question: 'What is the difference between microtasks and macrotasks?',
        answer: 'Microtasks (Promise .then, queueMicrotask) have higher priority — ALL pending microtasks run before the next macrotask. Macrotasks (setTimeout, setInterval, I/O events) are processed one per event loop iteration. This is why Promise callbacks run before setTimeout(fn, 0) callbacks.',
        difficulty: 'advanced',
      },
    ],
    exercises: [
      {
        id: 'ex-el-1',
        title: 'Predict the output',
        description: 'Without running the code, predict the order of console.log outputs.',
        starterCode: `async function main() {
  console.log("A");

  await Promise.resolve();
  console.log("B");

  setTimeout(() => console.log("C"), 0);

  await Promise.resolve();
  console.log("D");
}

main();
console.log("E");

// What is the output order? Write your answer:
// console.log("A, E, B, D, C");`,
        solution: `// A - synchronous start of main()
// E - synchronous code after main() call (main suspends at first await)
// B - resumes after first microtask
// D - resumes after second microtask
// C - setTimeout macrotask (last)

console.log("A, E, B, D, C");`,
        hints: ['A runs synchronously', 'await suspends and E runs while main is suspended', 'Microtasks (await) before macrotasks (setTimeout)'],
        expectedOutput: 'A\nE\nB\nD\nC',
      },
    ],
    keyTakeaways: [
      'Call stack is LIFO — one thing at a time',
      'Microtasks (Promises) run before macrotasks (setTimeout)',
      'All microtasks drain before next macrotask',
      'setTimeout(fn, 0) does NOT mean immediate execution',
      'Never block the event loop with heavy synchronous code',
    ],
    prevLesson: 'es6-features',
    nextLesson: 'callbacks',
  },
  // ─── Additional lessons from the JS roadmap ───────────────────────
  {
    id: 'callbacks',
    slug: 'callbacks',
    title: 'Callbacks & Callback Hell',
    description: 'Synchronous vs asynchronous callbacks, the callback pattern, and why callback hell happens.',
    category: 'Asynchronous JavaScript',
    order: 21,
    difficulty: 'intermediate',
    estimatedTime: 20,
    content: `A **callback** is a function passed as an argument to another function, to be executed later.\n\n**Synchronous callbacks** are called immediately: \`[1,2,3].forEach(fn)\`. **Asynchronous callbacks** are called later when something completes: \`setTimeout(fn, 1000)\`.\n\n**Callback Hell** (the "Pyramid of Doom") happens when async operations are nested inside each other, creating deeply indented code that is hard to read and error-prone:\n\n\`\`\`\ngetUser(id, (user) => {\n  getPosts(user.id, (posts) => {\n    getComments(posts[0].id, (comments) => {\n      // deeper and deeper...\n    });\n  });\n});\n\`\`\`\n\nProblems: error handling must be repeated at every level, no easy way to run in parallel, hard to test.\n\n**Solution:** Promises and async/await were invented specifically to solve callback hell.`,
    codeExamples: [
      {
        title: 'Sync vs async callbacks',
        code: `// Synchronous callback — runs immediately
[1, 2, 3].map(n => n * 2); // map calls the callback synchronously

// Asynchronous callback — runs later
setTimeout(() => {
  console.log("I run after 1 second");
}, 1000);

console.log("I run first");
// Output: "I run first", then 1s later: "I run after 1 second"`,
        output: 'I run first\nI run after 1 second',
      },
      {
        title: 'Node.js error-first callback pattern',
        code: `// Node.js convention: callback(error, result)
// First argument is always the error (null if success)

function readFile(path, callback) {
  try {
    const content = "file content here";
    callback(null, content);           // success
  } catch (err) {
    callback(err, null);               // error
  }
}

readFile("file.txt", (err, data) => {
  if (err) {
    console.error("Error:", err.message);
    return;
  }
  console.log("Data:", data);
});`,
        output: 'Data: file content here',
      },
      {
        title: 'Callback hell → Promises',
        code: `// ❌ Callback hell — hard to read and error-prone
getUser(id, (err, user) => {
  if (err) return handleError(err);
  getPosts(user.id, (err, posts) => {
    if (err) return handleError(err);
    getComments(posts[0].id, (err, comments) => {
      if (err) return handleError(err);
      console.log(comments); // 3 levels deep
    });
  });
});

// ✅ Same thing with Promises (or async/await)
async function loadAll(id) {
  const user = await getUser(id);
  const posts = await getPosts(user.id);
  const comments = await getComments(posts[0].id);
  return comments;
}`,
        explanation: 'Promises flatten the nesting. async/await makes it read like synchronous code.',
      },
    ],
    commonMistakes: [
      'Forgetting to handle the error parameter in error-first callbacks.',
      'Calling the callback more than once — use a guard or a flag.',
      'Not understanding that async callbacks run after all synchronous code.',
    ],
    interviewQuestions: [
      {
        question: 'What is callback hell and how do you avoid it?',
        answer: 'Callback hell is deeply nested callbacks, causing hard-to-read, hard-to-maintain code. Avoid it with: 1) Named functions instead of anonymous, 2) Promises (.then chaining), 3) async/await (best). async/await was specifically designed to solve callback hell.',
        difficulty: 'intermediate',
      },
      {
        question: 'What is the error-first callback convention in Node.js?',
        answer: 'The first argument to a callback is always the error (null if successful), the second is the result. This ensures error handling is always considered. Example: fs.readFile(path, (err, data) => { if (err) throw err; use(data); })',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'ex-cb-1',
        title: 'Convert callbacks to Promises',
        description: 'Wrap this callback-based function to return a Promise.',
        starterCode: `function delayedDouble(n, callback) {
  setTimeout(() => {
    if (typeof n !== 'number') callback(new Error('Not a number'));
    else callback(null, n * 2);
  }, 100);
}

// Convert to promise-based
function doubleAsync(n) {
  return new Promise((resolve, reject) => {
    // wrap delayedDouble here
  });
}

doubleAsync(5).then(console.log);  // 10
doubleAsync('x').catch(e => console.log(e.message)); // "Not a number"`,
        solution: `function doubleAsync(n) {
  return new Promise((resolve, reject) => {
    delayedDouble(n, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}`,
        hints: ['In the callback, check err: reject on error, resolve on success'],
        expectedOutput: '10\nNot a number',
      },
    ],
    keyTakeaways: [
      'Callbacks are functions passed to be called later',
      'Async callbacks run after synchronous code completes',
      'Node.js error-first convention: callback(err, result)',
      'Callback hell = deeply nested callbacks → use Promises or async/await',
    ],
    prevLesson: 'event-loop',
    nextLesson: 'timers',
  },
  {
    id: 'timers',
    slug: 'timers',
    title: 'Timers: setTimeout & setInterval',
    description: 'Schedule code to run after a delay or on a repeating interval. Clear timers to avoid bugs.',
    category: 'Asynchronous JavaScript',
    order: 22,
    difficulty: 'beginner',
    estimatedTime: 15,
    content: `JavaScript provides timer functions to schedule code execution.\n\n**setTimeout(fn, ms):** Calls fn once after ms milliseconds. Returns a timer ID.\n\n**setInterval(fn, ms):** Calls fn repeatedly every ms milliseconds. Returns a timer ID.\n\n**clearTimeout(id)** and **clearInterval(id):** Cancel a scheduled timer. Always store the ID so you can cancel.\n\n**Important:** Timer delays are minimums, not guarantees. If the call stack is busy, the callback waits. \`setTimeout(fn, 0)\` means "run as soon as the call stack is empty and microtasks are done".\n\n**Practical uses:** Debouncing input, polling, animations, auto-save, showing notifications, retry logic.`,
    codeExamples: [
      {
        title: 'setTimeout and clearTimeout',
        code: `// Run once after 2 seconds
const timeoutId = setTimeout(() => {
  console.log("2 seconds passed!");
}, 2000);

// Cancel it before it runs
clearTimeout(timeoutId);
// "2 seconds passed!" is never printed

// setTimeout with 0ms — still async!
setTimeout(() => console.log("async"), 0);
console.log("sync");
// Output: "sync" then "async"`,
        output: 'sync\nasync',
      },
      {
        title: 'setInterval and clearInterval',
        code: `let count = 0;
const intervalId = setInterval(() => {
  count++;
  console.log("Tick:", count);
  if (count >= 3) {
    clearInterval(intervalId); // stop after 3 ticks
    console.log("Stopped!");
  }
}, 1000);

// Runs at 1s: "Tick: 1"
//         2s: "Tick: 2"
//         3s: "Tick: 3", "Stopped!"`,
        output: 'Tick: 1\nTick: 2\nTick: 3\nStopped!',
      },
      {
        title: 'Practical: auto-save pattern',
        code: `class AutoSave {
  constructor(saveInterval = 30000) {
    this.timerId = null;
    this.saveInterval = saveInterval;
  }

  start(saveFn) {
    this.stop(); // clear any existing
    this.timerId = setInterval(saveFn, this.saveInterval);
  }

  stop() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }
}

const autoSave = new AutoSave(5000);
autoSave.start(() => console.log("Saved!"));
// Every 5 seconds: "Saved!"
// Call autoSave.stop() to cancel`,
      },
    ],
    commonMistakes: [
      'Not clearing intervals/timeouts — causes memory leaks, especially in frameworks.',
      'Using setInterval for animation — use requestAnimationFrame instead.',
      'Expecting setTimeout(fn, 0) to run immediately — it still goes through the event loop.',
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between setTimeout and setInterval?',
        answer: 'setTimeout runs once after a delay. setInterval runs repeatedly on a fixed interval. Both return an ID that can be passed to clearTimeout/clearInterval to cancel. For reliable intervals, consider recursive setTimeout instead of setInterval (handles execution time drift).',
        difficulty: 'beginner',
      },
    ],
    exercises: [
      {
        id: 'ex-timer-1',
        title: 'Build a countdown',
        description: 'Write a countdown function that prints numbers from n down to 0, then "Go!" using setInterval.',
        starterCode: `function countdown(n) {
  // Print n, n-1, ... 1, 0, then "Go!"
  // Use setInterval with 500ms delay
  // Clear interval when done
}

countdown(3);
// 3 (500ms pause) 2 (500ms pause) 1 (500ms pause) 0 (500ms pause) Go!`,
        solution: `function countdown(n) {
  let current = n;
  const id = setInterval(() => {
    console.log(current === 0 ? "Go!" : current);
    if (current === 0) clearInterval(id);
    current--;
  }, 500);
}`,
        hints: ['Store the interval ID so you can clear it', 'Check if current === 0 to print "Go!" and stop'],
        expectedOutput: '3\n2\n1\n0\nGo!',
      },
    ],
    keyTakeaways: [
      'setTimeout: run once after delay; setInterval: run repeatedly',
      'Always store timer IDs so you can cancel them',
      'clearTimeout / clearInterval to cancel',
      'setTimeout(fn, 0) is still async — goes through the event loop',
    ],
    prevLesson: 'callbacks',
    nextLesson: 'map-and-set',
  },
  {
    id: 'map-and-set',
    slug: 'map-and-set',
    title: 'Map, Set, WeakMap & WeakSet',
    description: 'ES6 keyed collections: when to use Map over objects, Set for unique values, and Weak variants.',
    category: 'Fundamentals',
    order: 23,
    difficulty: 'intermediate',
    estimatedTime: 25,
    content: `ES6 introduced four new collection types that solve specific problems that plain objects and arrays don't handle well.\n\n**Map** is like an object but: keys can be any type (including objects), maintains insertion order, has a built-in .size property, and is more performant for frequent add/delete.\n\n**Set** stores unique values of any type. Automatically removes duplicates. Useful for membership testing and deduplication.\n\n**WeakMap** and **WeakSet** hold weak references — if the key (WeakMap) or value (WeakSet) has no other references, it can be garbage collected. Not iterable. Used for: private object data, caches keyed to objects.\n\n**When to use Map over object:** When keys are not strings, when you need to know the size, when you need to iterate in insertion order, or when keys are user-provided (avoids prototype pollution).`,
    codeExamples: [
      {
        title: 'Map: any key type, ordered, sized',
        code: `const map = new Map();

// Any type as key
map.set("string", 1);
map.set(42, "number key");
map.set(true, "boolean key");
const objKey = { id: 1 };
map.set(objKey, "object key");

console.log(map.size);           // 4
console.log(map.get(42));        // "number key"
console.log(map.has("string"));  // true
map.delete("string");

// Iterate in insertion order
for (const [key, value] of map) {
  console.log(key, "→", value);
}

// Convert from/to object
const obj = Object.fromEntries(map.entries()); // only string-keyable entries
const map2 = new Map(Object.entries({ a: 1, b: 2 }));`,
        output: '4\nnumber key\ntrue',
      },
      {
        title: 'Set: unique values',
        code: `const set = new Set([1, 2, 3, 2, 1]);
console.log(set.size);         // 3 (duplicates removed)
console.log([...set]);         // [1, 2, 3]

set.add(4);
set.delete(1);
console.log(set.has(2));       // true
console.log(set.has(1));       // false

// Most common use: deduplicate an array
const arr = [1, 2, 2, 3, 3, 3, 4];
const unique = [...new Set(arr)];
console.log(unique); // [1, 2, 3, 4]

// Check array for membership (faster than includes for large data)
const allowed = new Set(["admin", "editor", "viewer"]);
console.log(allowed.has("admin")); // true (O(1) vs O(n))`,
        output: '3\n[1,2,3]\ntrue\nfalse\n[1,2,3,4]\ntrue',
      },
      {
        title: 'WeakMap: private object data',
        code: `// WeakMap: keys must be objects, values can be anything
const privateData = new WeakMap();

class User {
  constructor(name, password) {
    // Store private data linked to this instance
    privateData.set(this, { password });
    this.name = name;
  }

  checkPassword(input) {
    return privateData.get(this).password === input;
  }
}

const alice = new User("Alice", "secret123");
console.log(alice.name);                   // "Alice"
console.log(alice.checkPassword("wrong")); // false
console.log(alice.checkPassword("secret123")); // true
// password is not accessible directly on alice`,
        output: 'Alice\nfalse\ntrue',
      },
    ],
    commonMistakes: [
      'Using Map when a plain object would do — Map has overhead, prefer objects for simple string-keyed data.',
      'Using WeakMap/WeakSet and expecting to iterate them — they have no .forEach, .keys(), or .size.',
      'Not knowing that Set uses SameValueZero for equality: NaN === NaN in a Set (unlike regular ===).',
    ],
    interviewQuestions: [
      {
        question: 'When should you use Map instead of a plain object?',
        answer: 'Use Map when: 1) Keys are not strings/symbols (e.g., object or function keys), 2) You need ordered iteration, 3) You need .size, 4) Keys are user-provided (avoids __proto__ pollution), 5) Frequent adds/deletes (Map is optimized for this). Use plain objects for simple config/data with string keys.',
        difficulty: 'intermediate',
      },
      {
        question: 'What is the difference between WeakMap and Map?',
        answer: 'WeakMap keys must be objects, and the reference is weak — if the key object has no other references, it is garbage collected. WeakMap is not iterable (no .forEach, .keys(), .size). Use for: object-associated metadata, caches, private fields. Map has no garbage collection concerns and is fully iterable.',
        difficulty: 'advanced',
      },
    ],
    exercises: [
      {
        id: 'ex-ms-1',
        title: 'Unique words counter',
        description: 'Count unique words in a string using Map. Return the word with the highest count.',
        starterCode: `function topWord(text) {
  // Count each word's frequency using a Map
  // Return the word that appears most often
}

console.log(topWord("the cat sat on the mat the cat")); // "the" (3)
console.log(topWord("a b a b a")); // "a" (3)`,
        solution: `function topWord(text) {
  const counts = new Map();
  for (const word of text.toLowerCase().split(" ")) {
    counts.set(word, (counts.get(word) || 0) + 1);
  }
  return [...counts.entries()].reduce((top, [word, n]) =>
    n > top[1] ? [word, n] : top, ["", 0])[0];
}`,
        hints: ['Map.get returns undefined if not set — use (counts.get(word) || 0) + 1', 'Spread entries to find max with reduce'],
        expectedOutput: 'the\na',
      },
    ],
    keyTakeaways: [
      'Map: any key type, ordered, has .size — better than objects for non-string keys',
      'Set: unique values, fast .has() — great for deduplication',
      'WeakMap/WeakSet: weak references, not iterable, keys/values can be GC\'d',
      'Deduplicate array: [...new Set(arr)]',
    ],
    prevLesson: 'timers',
    nextLesson: 'json',
  },
  {
    id: 'json',
    slug: 'json',
    title: 'JSON',
    description: 'JSON.parse, JSON.stringify, deep clone trick, replacer/reviver, and common pitfalls.',
    category: 'Fundamentals',
    order: 24,
    difficulty: 'beginner',
    estimatedTime: 15,
    content: `**JSON (JavaScript Object Notation)** is a text format for data exchange. It is a strict subset of JavaScript object literal syntax.\n\n**JSON vs JavaScript objects:**\n- Keys must be double-quoted strings\n- Values can only be: string, number, boolean, null, array, or object\n- No functions, undefined, Symbol, Date, Map, Set, or BigInt\n- No trailing commas or comments\n\n**JSON.stringify(value, replacer, space):** Converts a JS value to a JSON string.\n\n**JSON.parse(string, reviver):** Converts a JSON string back to a JS value.\n\n**Gotchas:** undefined, functions, and Symbols are silently dropped by stringify. Date objects become strings — not Dates when parsed back. NaN/Infinity become null.`,
    codeExamples: [
      {
        title: 'stringify and parse basics',
        code: `const user = {
  name: "Alice",
  age: 25,
  active: true,
  scores: [95, 87, 92],
  address: { city: "London" }
};

// To JSON string
const json = JSON.stringify(user);
console.log(json);
// '{"name":"Alice","age":25,"active":true,"scores":[95,87,92],"address":{"city":"London"}}'

// Pretty print with indentation
console.log(JSON.stringify(user, null, 2));

// Back to object
const parsed = JSON.parse(json);
console.log(parsed.name);    // "Alice"
console.log(parsed.scores);  // [95, 87, 92]`,
        output: '{"name":"Alice","age":25,...}\nAlice\n[95,87,92]',
      },
      {
        title: 'JSON gotchas',
        code: `const data = {
  name: "Alice",
  fn: () => "hello",   // function — dropped!
  undef: undefined,    // undefined — dropped!
  sym: Symbol("id"),   // symbol — dropped!
  date: new Date(),    // becomes string
  nan: NaN,            // becomes null
  inf: Infinity,       // becomes null
};

const json = JSON.stringify(data);
const back = JSON.parse(json);

console.log(back.fn);    // undefined (was dropped)
console.log(back.undef); // undefined (was dropped)
console.log(typeof back.date); // "string" (not Date!)
console.log(back.nan);   // null
console.log(back.inf);   // null`,
        output: 'undefined\nundefined\nstring\nnull\nnull',
      },
      {
        title: 'Deep clone with JSON (and its limits)',
        code: `// Quick deep clone — only works for JSON-safe data
const original = { a: 1, b: { c: [1, 2, 3] } };
const clone = JSON.parse(JSON.stringify(original));

clone.b.c.push(4);
console.log(original.b.c); // [1, 2, 3] — unaffected!

// Limits: fails with functions, undefined, Date, circular refs
const withDate = { d: new Date() };
const cloned = JSON.parse(JSON.stringify(withDate));
console.log(cloned.d instanceof Date); // false (it's a string)

// Better: structuredClone()
const better = structuredClone(original);`,
        output: '[1,2,3]\nfalse',
      },
    ],
    commonMistakes: [
      'Using JSON.stringify for deep cloning when the object has Date, functions, or undefined.',
      'Forgetting that JSON.parse throws a SyntaxError on invalid JSON — always wrap in try/catch.',
      'Assuming parsed JSON dates are Date objects — they are strings.',
    ],
    interviewQuestions: [
      {
        question: 'What are the limitations of JSON.stringify for deep cloning?',
        answer: 'Functions, undefined, and Symbol values are silently dropped. Date objects become strings (not Dates when parsed). NaN/Infinity become null. Circular references throw an error. Use structuredClone() for a proper deep clone in modern browsers/Node.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'ex-json-1',
        title: 'Safe JSON parse',
        description: 'Write a safeJSONParse function that returns a default value on error instead of throwing.',
        starterCode: `function safeJSONParse(str, defaultValue = null) {
  // Try to parse str; return defaultValue if it fails
}

console.log(safeJSONParse('{"a":1}'));         // {a: 1}
console.log(safeJSONParse('invalid json'));     // null
console.log(safeJSONParse('bad', "fallback")); // "fallback"`,
        solution: `function safeJSONParse(str, defaultValue = null) {
  try {
    return JSON.parse(str);
  } catch {
    return defaultValue;
  }
}`,
        hints: ['Wrap JSON.parse in try/catch'],
        expectedOutput: '{a:1}\nnull\nfallback',
      },
    ],
    keyTakeaways: [
      'JSON: text format for data — keys must be double-quoted strings',
      'JSON drops: functions, undefined, Symbol — turns NaN/Infinity to null',
      'JSON.parse may throw — wrap in try/catch',
      'JSON deep clone trick only works for JSON-safe data; prefer structuredClone()',
    ],
    prevLesson: 'map-and-set',
    nextLesson: 'recursion',
  },
  {
    id: 'recursion',
    slug: 'recursion',
    title: 'Recursion',
    description: 'Recursive functions, base cases, the call stack, and when recursion beats iteration.',
    category: 'Functions',
    order: 25,
    difficulty: 'intermediate',
    estimatedTime: 25,
    content: `A **recursive function** is one that calls itself. Every recursive solution needs two parts:\n1. **Base case:** The stopping condition — prevents infinite recursion\n2. **Recursive case:** Calls itself with a smaller version of the problem\n\n**How it works:** Each recursive call adds a stack frame. When the base case is hit, the stack unwinds. If recursion is too deep, you get a **stack overflow** (Maximum call stack size exceeded).\n\n**When to use recursion:** Tree traversal, nested structures, divide-and-conquer algorithms (merge sort, binary search), parsing, directory traversal. When the problem naturally breaks down into smaller identical sub-problems.\n\n**Tail call optimization:** Some engines (Safari) optimize tail-recursive calls (where the recursive call is the last thing). Node.js only enables this in strict mode with the --harmony flag.\n\n**Real-world analogy:** Russian nesting dolls. To open them, open the outer one, then open the next, then the next — until you reach the smallest one (base case).`,
    codeExamples: [
      {
        title: 'Classic examples',
        code: `// Factorial: n! = n * (n-1) * (n-2) * ... * 1
function factorial(n) {
  if (n <= 1) return 1;          // base case
  return n * factorial(n - 1);   // recursive case
}
console.log(factorial(5)); // 5*4*3*2*1 = 120

// Fibonacci: fib(n) = fib(n-1) + fib(n-2)
function fib(n) {
  if (n <= 1) return n;          // base cases: fib(0)=0, fib(1)=1
  return fib(n - 1) + fib(n - 2);
}
console.log(fib(8)); // 21`,
        output: '120\n21',
      },
      {
        title: 'Traversing nested structures',
        code: `// Sum all numbers in a deeply nested array
function sumNested(arr) {
  let total = 0;
  for (const item of arr) {
    if (Array.isArray(item)) {
      total += sumNested(item); // recurse
    } else {
      total += item;
    }
  }
  return total;
}

console.log(sumNested([1, [2, [3, [4]]]]));   // 10
console.log(sumNested([[1, 2], [3, [4, 5]]])); // 15

// DOM tree traversal — classic recursion use case
function countNodes(element) {
  let count = 1;
  for (const child of element.children) {
    count += countNodes(child);
  }
  return count;
}`,
        output: '10\n15',
      },
      {
        title: 'Memoized recursion (avoid re-computation)',
        code: `// Plain fib is O(2^n) — exponential!
// Memoized fib is O(n)
function fib(n, memo = {}) {
  if (n in memo) return memo[n];       // cache hit
  if (n <= 1) return n;
  memo[n] = fib(n - 1, memo) + fib(n - 2, memo);
  return memo[n];
}

console.log(fib(50)); // 12586269025 (instant with memo)
// Without memo, fib(50) takes billions of operations`,
        output: '12586269025',
      },
    ],
    commonMistakes: [
      'Missing the base case — causes infinite recursion and stack overflow.',
      'Base case that is never reached — off-by-one in the condition.',
      'Not memoizing expensive recursive functions (like fibonacci).',
    ],
    interviewQuestions: [
      {
        question: 'What are the two required parts of a recursive function?',
        answer: 'Base case: the stopping condition that returns a value without recursing. Recursive case: calls itself with a smaller/simpler version of the problem. Without a base case, you get infinite recursion and a stack overflow.',
        difficulty: 'beginner',
      },
      {
        question: 'When would you choose recursion over iteration?',
        answer: 'Recursion when: traversing tree/graph structures, working with nested data, divide-and-conquer algorithms, problems that naturally decompose into sub-problems. Iteration when: simple loops, performance-critical code (recursion has call stack overhead), avoiding stack overflow on large inputs.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'ex-rec-1',
        title: 'Power function',
        description: 'Write a recursive power(base, exp) function without using Math.pow.',
        starterCode: `function power(base, exp) {
  // base case: anything to the power 0 is 1
  // recursive case: base * power(base, exp - 1)
}

console.log(power(2, 0));  // 1
console.log(power(2, 10)); // 1024
console.log(power(3, 4));  // 81`,
        solution: `function power(base, exp) {
  if (exp === 0) return 1;
  return base * power(base, exp - 1);
}`,
        hints: ['Base case: exp === 0 returns 1', 'Recursive: multiply base by power(base, exp-1)'],
        expectedOutput: '1\n1024\n81',
      },
    ],
    keyTakeaways: [
      'Every recursive function needs: base case (stop) + recursive case (shrink)',
      'Each call adds a stack frame — too deep = stack overflow',
      'Memoize expensive recursion to avoid redundant computation',
      'Recursion shines for trees, nested structures, divide-and-conquer',
    ],
    prevLesson: 'json',
    nextLesson: 'strict-mode',
  },
  {
    id: 'strict-mode',
    slug: 'strict-mode',
    title: 'Strict Mode',
    description: '"use strict" — what it prevents, how to enable it, and why modern JS uses it by default.',
    category: 'Advanced JavaScript',
    order: 26,
    difficulty: 'beginner',
    estimatedTime: 10,
    content: `**Strict mode** makes JavaScript throw errors for things that are normally silently ignored. It was introduced in ES5 to opt into a safer subset of JavaScript.\n\n**How to enable:**\n- File-level: add \`"use strict";\` as the first statement in a file\n- Function-level: add inside a function\n- **Automatic:** ES6 classes and ES modules are always in strict mode\n\n**What strict mode prevents:**\n- Using undeclared variables (would create globals silently)\n- Deleting variables/functions\n- Duplicate parameter names\n- \`with\` statement\n- Octal literals (0777)\n- Writing to read-only properties silently\n- \`this\` in a plain function call becomes \`undefined\` (not \`window\`)\n\n**Modern reality:** Since ES6, most code is written in modules or classes which are strict by default. You still encounter "use strict" in older code.`,
    codeExamples: [
      {
        title: 'What strict mode catches',
        code: `// WITHOUT strict mode — silently creates global variable
function sloppy() {
  x = 5; // creates window.x — bad!
}

// WITH strict mode — throws ReferenceError
"use strict";
function strict() {
  y = 5; // ReferenceError: y is not defined
}

// this in strict mode
function show() {
  "use strict";
  console.log(this); // undefined (not window!)
}
show();`,
        output: 'undefined',
      },
      {
        title: 'ES modules are always strict',
        code: `// In a .mjs file or type="module" — always strict
// No need to add "use strict"

// In a class — always strict
class MyClass {
  method() {
    console.log(this); // undefined when called as standalone
  }
}

// In regular .js files — need explicit "use strict"
"use strict";
// ... rest of file is strict`,
        explanation: 'ES6 modules and classes are always in strict mode automatically.',
      },
    ],
    commonMistakes: [
      'Placing "use strict" after other code — it only works as the first statement.',
      'Thinking strict mode makes code slower — modern engines optimize strict code better.',
    ],
    interviewQuestions: [
      {
        question: 'What does "use strict" do?',
        answer: 'Enables strict mode: prevents accidental global variable creation, makes this undefined in standalone function calls (instead of global), prevents duplicate parameters, catches silent errors as exceptions, reserves future ES keywords. ES modules and classes are always strict.',
        difficulty: 'beginner',
      },
    ],
    exercises: [
      {
        id: 'ex-strict-1',
        title: 'Spot the strict mode error',
        description: 'Add "use strict" and identify which line throws an error.',
        starterCode: `"use strict";

function buggy() {
  accidentalGlobal = 42; // What happens here?
  return accidentalGlobal;
}

try {
  buggy();
} catch (e) {
  console.log(e.constructor.name + ": " + e.message);
}`,
        solution: `"use strict";

function buggy() {
  accidentalGlobal = 42; // ReferenceError in strict mode
  return accidentalGlobal;
}

try {
  buggy();
} catch (e) {
  console.log(e.constructor.name + ": " + e.message);
}
// ReferenceError: accidentalGlobal is not defined`,
        hints: ['In strict mode, using an undeclared variable throws ReferenceError'],
        expectedOutput: 'ReferenceError: accidentalGlobal is not defined',
      },
    ],
    keyTakeaways: [
      '"use strict" at top of file or function enables strict mode',
      'ES6 modules and classes are always strict — no need to add it',
      'Strict mode: no accidental globals, this is undefined not window, catches silent errors',
      'Strict mode code often performs better in modern engines',
    ],
    prevLesson: 'recursion',
    nextLesson: 'generators',
  },
  {
    id: 'generators',
    slug: 'generators',
    title: 'Generators & Iterators',
    description: 'function*, yield, lazy sequences, custom iterables, and the iterator protocol.',
    category: 'Advanced JavaScript',
    order: 27,
    difficulty: 'advanced',
    estimatedTime: 30,
    content: `**Generators** are functions that can pause and resume. They produce a sequence of values lazily — values are computed only when requested.\n\n**Syntax:** \`function* generatorFn()\` — note the star.\n\n**yield:** Pauses the generator and returns a value to the caller. Execution resumes from that point on the next \`.next()\` call.\n\n**Generator returns an iterator:** The caller gets an iterator object with a \`.next()\` method. Each \`.next()\` call resumes execution until the next yield or the function returns.\n\n**Iterator protocol:** An object is iterable if it has a \`[Symbol.iterator]()\` method that returns an iterator. for...of, spread, destructuring all use this protocol.\n\n**Use cases:** Infinite sequences, lazy pipelines, pagination, implementing async/await (under the hood), custom iterables for for...of loops.`,
    codeExamples: [
      {
        title: 'Basic generator',
        code: `function* counter(start = 0) {
  while (true) {
    yield start++;  // pause and return current value
  }
}

const gen = counter(1);
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next()); // { value: 3, done: false }

// Use in for...of (stops when done: true)
function* range(start, end) {
  for (let i = start; i <= end; i++) yield i;
}

console.log([...range(1, 5)]); // [1, 2, 3, 4, 5]
for (const n of range(1, 3)) console.log(n); // 1, 2, 3`,
        output: '{value:1,done:false}\n{value:2,done:false}\n{value:3,done:false}\n[1,2,3,4,5]\n1\n2\n3',
      },
      {
        title: 'Custom iterable',
        code: `// Make an object iterable with Symbol.iterator
const range = {
  from: 1,
  to: 5,
  [Symbol.iterator]() {
    let current = this.from;
    const last = this.to;
    return {
      next() {
        if (current <= last) return { value: current++, done: false };
        return { value: undefined, done: true };
      }
    };
  }
};

// Now range works with for...of
for (const n of range) console.log(n); // 1, 2, 3, 4, 5
console.log([...range]); // [1, 2, 3, 4, 5]`,
        output: '1\n2\n3\n4\n5\n[1,2,3,4,5]',
      },
      {
        title: 'Infinite lazy sequence',
        code: `// Generates Fibonacci numbers infinitely (lazily)
function* fibonacci() {
  let [a, b] = [0, 1];
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

// Take first 8 Fibonacci numbers
function take(n, iterable) {
  const result = [];
  for (const val of iterable) {
    result.push(val);
    if (result.length === n) break;
  }
  return result;
}

console.log(take(8, fibonacci()));
// [0, 1, 1, 2, 3, 5, 8, 13]`,
        output: '[0,1,1,2,3,5,8,13]',
      },
    ],
    commonMistakes: [
      'Calling a generator function returns an iterator, not a value — you still need to call .next().',
      'Generators are single-use — once exhausted, they always return { done: true }.',
      'Forgetting that yield* delegates to another iterable.',
    ],
    interviewQuestions: [
      {
        question: 'What is a generator and when would you use one?',
        answer: 'A generator is a function (function*) that can pause at yield expressions and resume when .next() is called. Use for: infinite sequences (IDs, pagination), lazy evaluation (process values one at a time without loading all into memory), custom iterables for for...of, implementing async flows. async/await is built on generators internally.',
        difficulty: 'advanced',
        followUp: ['How does async/await relate to generators?'],
      },
    ],
    exercises: [
      {
        id: 'ex-gen-1',
        title: 'Build a range generator',
        description: 'Create a range generator that yields numbers from start to end (inclusive) with a step.',
        starterCode: `function* range(start, end, step = 1) {
  // Yield numbers from start to end with step increment
}

console.log([...range(0, 10, 2)]); // [0, 2, 4, 6, 8, 10]
console.log([...range(1, 5)]);     // [1, 2, 3, 4, 5]
console.log([...range(10, 1, -2)]); // [10, 8, 6, 4, 2]`,
        solution: `function* range(start, end, step = 1) {
  if (step > 0) {
    for (let i = start; i <= end; i += step) yield i;
  } else {
    for (let i = start; i >= end; i += step) yield i;
  }
}`,
        hints: ['Use a for loop with yield', 'Handle both positive and negative steps'],
        expectedOutput: '[0,2,4,6,8,10]\n[1,2,3,4,5]\n[10,8,6,4,2]',
      },
    ],
    keyTakeaways: [
      'function*: creates a generator. yield: pauses and returns a value',
      'gen.next() returns { value, done } — done: true when generator is finished',
      'Generators implement the iterator protocol — work with for...of, spread, destructuring',
      'Great for infinite sequences, lazy evaluation, and custom iterables',
    ],
    prevLesson: 'strict-mode',
    nextLesson: 'regular-expressions',
  },
  {
    id: 'regular-expressions',
    slug: 'regular-expressions',
    title: 'Regular Expressions',
    description: 'Regex syntax, flags, methods, groups, and practical patterns for validation and parsing.',
    category: 'Advanced JavaScript',
    order: 28,
    difficulty: 'intermediate',
    estimatedTime: 30,
    content: `A **regular expression** is a pattern for matching and manipulating strings.\n\n**Creating regex:** Literal \`/pattern/flags\` or constructor \`new RegExp("pattern", "flags")\`.\n\n**Flags:**\n- \`g\` — global: find all matches\n- \`i\` — case-insensitive\n- \`m\` — multiline: ^ and $ match line boundaries\n- \`s\` — dotAll: . matches newlines too\n\n**String methods that accept regex:**\n- \`.match(re)\` — returns array of matches\n- \`.matchAll(re)\` — iterator of all matches with groups\n- \`.replace(re, str)\` — replace first (or all with g)\n- \`.replaceAll(re, str)\` — replace all\n- \`.search(re)\` — returns index or -1\n- \`.split(re)\` — split by regex\n\n**Regex methods:**\n- \`re.test(str)\` — returns boolean\n- \`re.exec(str)\` — returns match details`,
    codeExamples: [
      {
        title: 'Regex basics',
        code: `// Literal syntax
const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$/i;

// Test method
console.log(emailRegex.test("user@example.com")); // true
console.log(emailRegex.test("not-an-email"));      // false

// Common patterns
/\\d+/          // one or more digits
/\\w+/          // word characters (a-z, 0-9, _)
/\\s+/          // whitespace
/^start/       // starts with "start"
/end$/         // ends with "end"
/[abc]/        // one of a, b, or c
/[a-z]/        // any lowercase letter
/a|b/          // a or b
/(group)/      // capture group`,
      },
      {
        title: 'String methods with regex',
        code: `const text = "The price is $9.99 or $14.50";

// Find all prices
const prices = text.match(/\\$[\\d.]+/g);
console.log(prices); // ["$9.99", "$14.50"]

// Replace
const cleaned = text.replace(/\\$[\\d.]+/g, "XX");
console.log(cleaned); // "The price is XX or XX"

// Split
"one  two   three".split(/\\s+/); // ["one","two","three"]

// Named capture groups
const date = "2024-06-15";
const { year, month, day } = date.match(
  /(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})/
).groups;
console.log(year, month, day); // "2024" "06" "15"`,
        output: '["$9.99","$14.50"]\nThe price is XX or XX\n2024 06 15',
      },
      {
        title: 'Common validation patterns',
        code: `// Validation functions
const validate = {
  email: (s) => /^[^@]+@[^@]+\\.[^@]+$/.test(s),
  phone: (s) => /^\\+?[\\d\\s()-]{7,15}$/.test(s),
  url:   (s) => /^https?:\\/\\/.+/.test(s),
  zip:   (s) => /^\\d{5}(-\\d{4})?$/.test(s),
  // Password: 8+ chars, at least one number and uppercase
  password: (s) => /^(?=.*[A-Z])(?=.*\\d).{8,}$/.test(s),
};

console.log(validate.email("user@test.com")); // true
console.log(validate.email("bad-email"));     // false
console.log(validate.password("Secure123"));  // true
console.log(validate.password("weak"));       // false`,
        output: 'true\nfalse\ntrue\nfalse',
      },
    ],
    commonMistakes: [
      'Forgetting the g flag when expecting multiple matches with .match() — returns only first match.',
      'Using new RegExp(str) without escaping backslashes — \\\\d in string becomes \\d in regex.',
      'Performance: recreating regex in a loop — create once outside the loop.',
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between /regex/g and /regex/ (without g flag)?',
        answer: 'Without g: .match() returns first match plus groups. .replace() only replaces the first occurrence. With g flag: .match() returns all matches as a flat array (no groups). .replace() replaces all occurrences. For all matches with groups, use .matchAll() (requires g flag).',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'ex-regex-1',
        title: 'Extract hashtags',
        description: 'Write a function that extracts all hashtags from a social media post.',
        starterCode: `function extractHashtags(text) {
  // Return array of hashtags (including #) from the text
  // Hashtags start with # followed by word characters
}

console.log(extractHashtags("Learning #JavaScript is #fun!"));
// ["#JavaScript", "#fun"]
console.log(extractHashtags("No hashtags here"));
// []`,
        solution: `function extractHashtags(text) {
  return text.match(/#\\w+/g) || [];
}`,
        hints: ['Use /g flag to get all matches', '.match() returns null if no matches — use || []'],
        expectedOutput: '["#JavaScript","#fun"]\n[]',
      },
    ],
    keyTakeaways: [
      '/pattern/flags — literal syntax; new RegExp() for dynamic patterns',
      'Flags: g (all), i (case-insensitive), m (multiline)',
      '.test() returns boolean; .match() returns array or null',
      'Named groups: (?<name>pattern) → .groups.name',
      'Always escape backslashes in RegExp strings: \\d → \\\\d',
    ],
    prevLesson: 'generators',
    nextLesson: 'type-conversion',
  },
  {
    id: 'type-conversion',
    slug: 'type-conversion',
    title: 'Type Conversion & Coercion',
    description: 'Explicit type casting vs implicit coercion, conversion rules, and surprising behaviors.',
    category: 'Fundamentals',
    order: 29,
    difficulty: 'intermediate',
    estimatedTime: 20,
    content: `JavaScript converts between types in two ways:\n\n**Explicit conversion (type casting):** You intentionally convert: \`Number("42")\`, \`String(42)\`, \`Boolean(0)\`.\n\n**Implicit coercion:** JavaScript automatically converts types in certain contexts — comparison, arithmetic, template literals, if conditions.\n\n**Conversion rules for the + operator:** If either operand is a string, the other is converted to string (concatenation). For -, *, /, both are converted to numbers.\n\n**ToNumber rules:** undefined → NaN, null → 0, false → 0, true → 1, "" → 0, " " → 0, "3" → 3, "3abc" → NaN, [] → 0, {} → NaN.\n\n**ToString:** null → "null", undefined → "undefined", true → "true", 0 → "0", [] → "", [1,2] → "1,2", {} → "[object Object]".\n\n**Abstract equality (==):** If types differ, JavaScript tries to coerce them. Follows complex rules — use === to avoid surprises.`,
    codeExamples: [
      {
        title: 'Explicit conversion',
        code: `// Number()
console.log(Number("42"));    // 42
console.log(Number("3.14")); // 3.14
console.log(Number(""));     // 0
console.log(Number("abc"));  // NaN
console.log(Number(true));   // 1
console.log(Number(false));  // 0
console.log(Number(null));   // 0
console.log(Number(undefined)); // NaN

// parseInt / parseFloat — stop at first non-numeric char
console.log(parseInt("42px"));   // 42
console.log(parseFloat("3.14em")); // 3.14

// String()
console.log(String(42));     // "42"
console.log(String(null));   // "null"
console.log(String(true));   // "true"

// Boolean()
console.log(Boolean(0));     // false
console.log(Boolean(""));    // false
console.log(Boolean("0"));   // true  ← tricky!`,
        output: '42\n3.14\n0\nNaN\n1\n0\n0\nNaN\n42\n3.14\n"42"\n"null"\n"true"\nfalse\nfalse\ntrue',
      },
      {
        title: 'Implicit coercion surprises',
        code: `// + operator: string + anything = string concat
console.log("5" + 3);      // "53"
console.log("5" + true);   // "5true"
console.log(1 + null);     // 1 (null → 0)
console.log(1 + undefined); // NaN (undefined → NaN)

// -, *, / always numeric
console.log("5" - 3);      // 2
console.log("6" * "2");    // 12
console.log(true + true);  // 2

// == coercion rules
console.log(null == undefined);  // true (special rule)
console.log(null == 0);          // false (null only == undefined)
console.log("0" == false);       // true (both → 0)
console.log(0 == false);         // true
console.log("" == false);        // true
console.log([] == false);        // true ([] → "" → 0, false → 0)`,
        output: '"53"\n"5true"\n1\nNaN\n2\n12\n2\ntrue\nfalse\ntrue\ntrue\ntrue\ntrue',
      },
    ],
    commonMistakes: [
      'Using == and being surprised by coercion — always use ===.',
      'parseInt without a radix: parseInt("08") can be octal in old engines — always pass parseInt("08", 10).',
      'Checking for empty/missing value with if (val) — 0 and "" are falsy but valid values.',
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between explicit type conversion and implicit coercion?',
        answer: 'Explicit: developer intentionally converts using Number(), String(), Boolean(), parseInt(), etc. Implicit (coercion): JS automatically converts types to make an operation work, like "5" * 3 = 15. Coercion is often unexpected — why 0 == false is true, or "5" + 3 is "53" but "5" - 3 is 2.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'ex-tc-1',
        title: 'Type coercion predictor',
        description: 'Without running the code, predict what each expression evaluates to.',
        starterCode: `// Predict these values:
console.log(+"");          // ?
console.log(+true);        // ?
console.log(+"5" + 3);     // ?
console.log("5" + +"3");   // ?
console.log(null + 1);     // ?
console.log(undefined + 1); // ?
console.log([] + []);      // ?
console.log({} + []);      // ?

// Answers below — check by running:
// 0, 1, 8, "53", 1, NaN, "", "[object Object]"`,
        solution: `console.log(+"");           // 0  (unary + converts "" to 0)
console.log(+true);         // 1  (true → 1)
console.log(+"5" + 3);      // 8  (+"5" = 5, then 5+3)
console.log("5" + +"3");    // "53" ("3" is 3, then string + number)
console.log(null + 1);      // 1  (null → 0)
console.log(undefined + 1); // NaN (undefined → NaN)
console.log([] + []);       // ""  (both → "", "" + "" = "")
console.log({} + []);       // "[object Object]"`,
        hints: ['Unary + converts to number', '[] converts to "" in string context'],
        expectedOutput: '0\n1\n8\n"53"\n1\nNaN\n""\n[object Object]',
      },
    ],
    keyTakeaways: [
      'Explicit: Number(), String(), Boolean(), parseInt(), parseFloat()',
      '+ with string: concatenation. -, *, /: always numeric',
      'null → 0, undefined → NaN in numeric context',
      '[] → "" → 0; {} → NaN in numeric context',
      'Always use === to avoid == coercion surprises',
    ],
    prevLesson: 'regular-expressions',
    nextLesson: 'memory-management',
  },
  {
    id: 'memory-management',
    slug: 'memory-management',
    title: 'Memory Management & Garbage Collection',
    description: 'Memory lifecycle, how GC works, common leaks, and how to avoid them.',
    category: 'Advanced JavaScript',
    order: 30,
    difficulty: 'advanced',
    estimatedTime: 20,
    content: `JavaScript manages memory automatically — you don't manually allocate or free memory. But understanding how it works helps you write code that doesn't leak.\n\n**Memory lifecycle:** Allocate (creating values) → Use (reading/writing) → Release (GC).\n\n**Garbage Collection:** The engine tracks all references to each object. When an object has zero live references, it becomes eligible for GC. The most common algorithm is **Mark-and-Sweep:** starting from root (global, stack), mark all reachable objects, then sweep (free) unmarked ones.\n\n**Common memory leaks:**\n1. Forgotten event listeners (especially on removed DOM nodes)\n2. Closures holding large objects unnecessarily\n3. Global variables that grow without bound\n4. Detached DOM nodes still referenced in JS\n5. Timers not cleared (setInterval)\n\n**Tools:** Chrome DevTools Memory panel — heap snapshot, allocation instrumentation, performance monitor.`,
    codeExamples: [
      {
        title: 'Memory leak patterns',
        code: `// ❌ Leak 1: Event listener on element that gets removed
function addListeners() {
  const button = document.createElement('button');
  document.body.appendChild(button);
  button.addEventListener('click', heavyHandler);
  document.body.removeChild(button);
  // button removed from DOM but handler still holds a reference to it!
}
// Fix: removeEventListener before removing, or use { once: true }

// ❌ Leak 2: Growing array in closure
function createLeak() {
  const hugeData = [];
  return function () {
    hugeData.push(new Array(1000000)); // keeps growing!
  };
}

// ❌ Leak 3: Uncleaned interval
const intervalId = setInterval(() => {
  // This runs forever even if component is gone
}, 1000);
// Fix: clearInterval(intervalId) when done`,
      },
      {
        title: 'WeakMap/WeakRef for non-leaking caches',
        code: `// ❌ Regular Map — prevents GC of objects
const cache = new Map();
function process(obj) {
  cache.set(obj, compute(obj)); // obj can never be GC'd while in cache
}

// ✅ WeakMap — doesn't prevent GC
const weakCache = new WeakMap();
function processWeak(obj) {
  if (weakCache.has(obj)) return weakCache.get(obj);
  const result = compute(obj);
  weakCache.set(obj, result);
  return result;
  // When obj is no longer referenced elsewhere, GC can collect it
  // AND automatically remove the WeakMap entry
}

function compute(obj) { return JSON.stringify(obj); }`,
      },
    ],
    commonMistakes: [
      'Removing DOM nodes without removing their event listeners first.',
      'Using closures that accidentally capture and hold large objects.',
      'Not clearing intervals/timeouts when components unmount (big in React/Vue).',
    ],
    interviewQuestions: [
      {
        question: 'How does garbage collection work in JavaScript?',
        answer: 'Most modern engines use mark-and-sweep: start from root references (global, call stack), mark all reachable objects, then collect (free) unreachable ones. Objects become unreachable when nothing in the reachable graph holds a reference to them. Common leaks: forgotten event listeners, closures capturing large objects, uncleaned timers.',
        difficulty: 'advanced',
      },
      {
        question: 'What is a memory leak and how do you detect one?',
        answer: 'A memory leak is when memory is allocated but never released — the GC can\'t collect it because references still exist (even unintentionally). Detection: Chrome DevTools → Memory → take heap snapshots over time and compare. Look for increasing memory use. Common causes: event listeners on removed nodes, global variables, uncleaned timers, circular references.',
        difficulty: 'advanced',
      },
    ],
    exercises: [
      {
        id: 'ex-mem-1',
        title: 'Identify the leak',
        description: 'Identify and fix the memory leak in this code.',
        starterCode: `class NotificationService {
  constructor() {
    this.handlers = [];
    this.interval = null;
  }

  start() {
    // Creates a new handler every time start() is called
    const handler = () => console.log("Notification!");
    document.addEventListener('visibilitychange', handler);
    this.handlers.push(handler);

    this.interval = setInterval(() => {
      console.log("Checking for notifications...");
    }, 5000);
  }

  stop() {
    // BUG: Does not clean up!
  }
}

// Fix the stop() method to prevent memory leaks`,
        solution: `class NotificationService {
  constructor() {
    this.handlers = [];
    this.interval = null;
  }

  start() {
    const handler = () => console.log("Notification!");
    document.addEventListener('visibilitychange', handler);
    this.handlers.push(handler);

    this.interval = setInterval(() => {
      console.log("Checking for notifications...");
    }, 5000);
  }

  stop() {
    // Remove all event listeners
    for (const handler of this.handlers) {
      document.removeEventListener('visibilitychange', handler);
    }
    this.handlers = [];

    // Clear the interval
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}`,
        hints: ['Remove each stored event listener', 'Clear the interval'],
        expectedOutput: '(Leak fixed: listeners removed, interval cleared)',
      },
    ],
    keyTakeaways: [
      'GC uses mark-and-sweep: objects with no reachable references are collected',
      'Common leaks: forgotten event listeners, uncleaned timers, global growing arrays',
      'WeakMap/WeakSet: entries don\'t prevent GC of keys/values',
      'Use Chrome DevTools Memory panel to detect leaks',
      'Always clearInterval/clearTimeout and removeEventListener when done',
    ],
    prevLesson: 'type-conversion',
  },
];
