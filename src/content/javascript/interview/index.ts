import type { InterviewQuestion } from '@/types';

export const interviewQuestions: InterviewQuestion[] = [
  // Fundamentals
  {
    question: 'What are the different data types in JavaScript?',
    answer: 'JavaScript has 8 data types. 7 primitives: string, number, boolean, null, undefined, symbol, bigint. And 1 reference type: object (which includes arrays, functions, dates, etc.). Primitives are immutable and copied by value. Objects are copied by reference.',
    difficulty: 'beginner',
    tip: 'Always mention the 7+1 split and the by-value vs by-reference distinction.',
  },
  {
    question: 'What is the difference between null and undefined?',
    answer: 'undefined means a variable was declared but not assigned, or a function returned nothing. null is an intentional absence of value — a developer explicitly set it. typeof undefined is "undefined", typeof null is "object" (a historical bug in JS).',
    difficulty: 'beginner',
  },
  {
    question: 'What is type coercion?',
    answer: 'Type coercion is JavaScript automatically converting one type to another. It happens with ==, arithmetic operators, and boolean contexts. Examples: "5" + 3 = "53" (string concat), "5" - 3 = 2 (numeric), 0 == false is true. Always use === to avoid unintended coercion.',
    difficulty: 'beginner',
    followUp: ['What is the difference between == and ===?', 'When does implicit coercion happen?'],
  },
  {
    question: 'What are truthy and falsy values?',
    answer: 'Exactly 7 falsy values: false, 0, -0, 0n, "" (empty string), null, undefined, NaN. Everything else is truthy, including "0", [], {}, the string "false". This matters for if conditions and logical operators.',
    difficulty: 'beginner',
  },
  {
    question: 'What is the difference between var, let, and const?',
    answer: 'var: function-scoped, hoisted (initialized as undefined), can be re-declared. let: block-scoped, TDZ before declaration, cannot be re-declared. const: block-scoped, TDZ, cannot be re-declared or reassigned (but object contents can change). Use const by default, let when reassignment needed, never var.',
    difficulty: 'beginner',
    followUp: ['What is the Temporal Dead Zone?', 'Can you change properties of a const object?'],
  },
  {
    question: 'What is hoisting?',
    answer: 'Hoisting is JavaScript\'s behavior of moving declarations to the top of their scope before execution. var declarations are hoisted and initialized as undefined. Function declarations are fully hoisted (can be called before written). let/const are hoisted but in TDZ — cannot be accessed before declaration.',
    difficulty: 'intermediate',
  },
  // Functions & Closures
  {
    question: 'What is a closure?',
    answer: 'A closure is a function that retains access to its outer lexical scope even after the outer function has returned. The function "closes over" variables from its enclosing scope. Use cases: private variables, factory functions, memoization, module pattern.',
    difficulty: 'intermediate',
    followUp: ['Give a practical use case', 'Can closures cause memory leaks?'],
    tip: 'Always give a code example. Counter factory is a classic.',
  },
  {
    question: 'What is the difference between function declarations and arrow functions?',
    answer: 'Arrow functions: no own this (inherits lexically), no arguments object, cannot be constructors (no new), no prototype property. Regular functions: have own this (dynamic), have arguments object, can be constructors. Use arrow functions for callbacks, regular functions/methods when you need this.',
    difficulty: 'intermediate',
    followUp: ['When should you NOT use an arrow function?'],
  },
  {
    question: 'Explain the four rules that determine this.',
    answer: '1) new binding: new Fn() creates new object, this = that object. 2) Explicit binding: call/apply/bind. 3) Implicit binding: obj.method() — this = obj. 4) Default binding: standalone fn() — this = global or undefined in strict mode. Arrow functions override all rules: they inherit this from enclosing lexical scope.',
    difficulty: 'advanced',
    followUp: ['What does bind return?', 'Difference between call and apply?'],
  },
  {
    question: 'What is the difference between call, apply, and bind?',
    answer: 'All three explicitly set this. call(thisArg, arg1, arg2) invokes immediately, args listed. apply(thisArg, [args]) invokes immediately, args as array. bind(thisArg, ...args) returns a NEW function with this permanently set — does not invoke. Remember: call is Comma-separated, Apply is Array.',
    difficulty: 'intermediate',
  },
  // Async JavaScript
  {
    question: 'What is the event loop?',
    answer: 'The event loop allows JS to be non-blocking despite being single-threaded. Components: call stack (where code runs), Web APIs (handle async tasks), task queue (setTimeout callbacks), microtask queue (Promise callbacks). Loop: when stack is empty, drain ALL microtasks, then execute one macrotask. Repeat.',
    difficulty: 'advanced',
    tip: 'Draw a diagram if possible. Mention macrotasks vs microtasks.',
  },
  {
    question: 'What are the states of a Promise?',
    answer: 'Three states: pending (initial), fulfilled (resolved with value), rejected (failed with reason). Once fulfilled or rejected, a promise is settled and cannot change state. .then receives fulfilled value, .catch receives rejection reason, .finally always runs.',
    difficulty: 'beginner',
  },
  {
    question: 'What is the difference between Promise.all and Promise.allSettled?',
    answer: 'Promise.all rejects immediately when ANY promise rejects (fail-fast). Returns array of values if all succeed. Promise.allSettled waits for ALL promises, returns array of {status, value/reason} objects regardless of success/failure. Use allSettled when you want all results even if some fail.',
    difficulty: 'intermediate',
    followUp: ['What does Promise.race do?', 'What about Promise.any?'],
  },
  {
    question: 'What happens when you await in a forEach loop?',
    answer: 'It does NOT work as expected. forEach is not async-aware — it calls the callback and ignores the returned Promise. All iterations start immediately in parallel without waiting. Fix: use for...of with await for sequential, or Promise.all(arr.map(async fn)) for parallel.',
    difficulty: 'intermediate',
  },
  {
    question: 'What is the difference between microtasks and macrotasks?',
    answer: 'Microtasks (Promise callbacks, queueMicrotask) run before macrotasks. After each macrotask, ALL pending microtasks drain before the next macrotask. Macrotasks: setTimeout, setInterval, I/O events. Priority: synchronous code > microtasks > macrotasks.',
    difficulty: 'advanced',
  },
  // Prototypes & Classes
  {
    question: 'How does prototypal inheritance work?',
    answer: 'Every object has a [[Prototype]] link to another object (or null). Property lookup traverses the chain: own properties → prototype → prototype\'s prototype → ... → null. Classes (ES6) are syntactic sugar over this. extends sets up the chain; super() calls the parent constructor.',
    difficulty: 'advanced',
    followUp: ['What is the difference between __proto__ and prototype?'],
  },
  {
    question: 'What is the difference between classical and prototypal inheritance?',
    answer: 'Classical (Java, C++): inheritance through class blueprints, instances are copies. Prototypal (JavaScript): objects inherit directly from other objects via prototype links. JS class syntax looks classical but is prototypal underneath. Prototypal is more flexible but less familiar to developers from other languages.',
    difficulty: 'advanced',
  },
  // DOM & Browser
  {
    question: 'What is event bubbling and capturing?',
    answer: 'Events travel in three phases: capturing (down from document to target), at target, bubbling (up from target to document). Bubbling is the default — handlers fire from target upward. addEventListener 3rd arg true enables capturing phase. stopPropagation() stops the event from traveling further.',
    difficulty: 'intermediate',
    followUp: ['What is event delegation?'],
  },
  {
    question: 'What is the difference between localStorage, sessionStorage, and cookies?',
    answer: 'localStorage: persists until explicitly cleared, 5-10MB, same origin only. sessionStorage: cleared when tab closes, 5-10MB, same tab only. Cookies: sent to server with every request, 4KB limit, can set expiry and domain/path, used for authentication. Use localStorage/sessionStorage for client-side storage, cookies for server communication.',
    difficulty: 'intermediate',
  },
  // Performance & Advanced
  {
    question: 'What is debouncing and throttling?',
    answer: 'Both limit how often a function runs. Debounce: function only fires after N ms of inactivity — use for search input. Throttle: function fires at most once per N ms regardless of calls — use for scroll/resize. Debounce delays until quiet; throttle guarantees a minimum interval.',
    difficulty: 'intermediate',
    followUp: ['Implement debounce from scratch'],
  },
  {
    question: 'What are WeakMap and WeakSet?',
    answer: 'WeakMap/WeakSet hold weak references — their keys (WeakMap) or values (WeakSet) can be garbage collected if no other references exist. Not iterable (no size, no forEach). Used for: caching associated with objects without preventing GC, private data associated with objects, tracking DOM node metadata.',
    difficulty: 'advanced',
  },
  {
    question: 'What is a Generator function?',
    answer: 'A Generator is a function that can pause and resume. Declared with function*. Uses yield to pause and return a value. The caller uses .next() to resume. Returns an iterator. Used for: lazy evaluation, infinite sequences, async flow control (async/await was inspired by generators).',
    difficulty: 'advanced',
    followUp: ['How does async/await relate to generators?'],
  },
  {
    question: 'What is the Proxy object?',
    answer: 'Proxy wraps an object and intercepts operations (get, set, has, deleteProperty, etc.) via handler traps. Used for: validation, logging, reactive systems (Vue 3 reactivity), default values, access control. new Proxy(target, handler) — handler defines the traps.',
    difficulty: 'advanced',
  },
  {
    question: 'Explain memory management and garbage collection in JavaScript.',
    answer: 'JS uses automatic garbage collection with a mark-and-sweep algorithm. Objects are GC\'d when no live references point to them. Common memory leaks: forgotten event listeners, closures holding large objects, detached DOM nodes still referenced in JS. WeakMap/WeakSet help avoid leaks for object-keyed caches.',
    difficulty: 'advanced',
  },
];
