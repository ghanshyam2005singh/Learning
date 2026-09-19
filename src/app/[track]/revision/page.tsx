import { getLessons } from '@/lib/content';
import { notFound } from 'next/navigation';

export default async function RevisionPage({ params }: { params: Promise<{ track: string }> }) {
  const { track } = await params;
  const lessons = getLessons(track);
  if (!lessons.length) notFound();

  const sheets = [
    {
      title: 'JS in 10 Minutes',
      desc: 'Ultra-condensed key facts for quick review',
      items: [
        '7 primitives: string, number, boolean, null, undefined, symbol, bigint',
        'const by default, let for reassignment, never var',
        'typeof null === "object" is a historical bug',
        'Always use === (strict equality)',
        'Falsy: false, 0, -0, 0n, "", null, undefined, NaN',
        'Arrow functions: no own this, no arguments object',
        'Closures: functions remember their outer scope',
        'Hoisting: var → undefined; function decl → fully hoisted; let/const → TDZ',
        'Promise states: pending → fulfilled | rejected',
        'Microtasks (Promises) run before macrotasks (setTimeout)',
        'Event loop: stack empty → drain microtasks → one macrotask',
        'Prototype chain: property lookup goes up to null',
        'this is dynamic (determined at call time) except arrow functions',
        '?? checks null/undefined; || checks any falsy value',
        'for...of for arrays; for...in for object keys',
      ],
    },
    {
      title: 'Array Methods Cheat Sheet',
      desc: 'Every important array method at a glance',
      items: [
        'MUTATING: push, pop, shift, unshift, splice, sort, reverse, fill',
        'TRANSFORM: map(fn) → new array with fn applied to each element',
        'FILTER: filter(fn) → new array with elements where fn returns true',
        'REDUCE: reduce(fn, init) → single value',
        'FIND: find(fn) → first element matching, findIndex(fn) → its index',
        'CHECK: every(fn) → all match, some(fn) → at least one match',
        'SEARCH: includes(val) → boolean, indexOf(val) → index or -1',
        'COPY: slice(start, end) → new array portion, [...arr] → shallow copy',
        'COMBINE: concat() or [...a, ...b]',
        'FLATTEN: flat(depth), flatMap(fn)',
        'SORT numbers: sort((a,b) => a - b) — always provide comparator',
        'Array.from(iterable) → array, Array.isArray(val) → boolean',
        'arr.at(-1) → last element (ES2022)',
        'forEach(fn) → undefined (side effects only)',
        'join(sep) → string, [].join(", ") = ""',
      ],
    },
    {
      title: 'Object Methods Cheat Sheet',
      desc: 'Object utilities you need to know',
      items: [
        'Object.keys(obj) → array of own enumerable keys',
        'Object.values(obj) → array of own enumerable values',
        'Object.entries(obj) → array of [key, value] pairs',
        'Object.fromEntries(entries) → object from [key,value] pairs',
        'Object.assign(target, ...sources) → shallow merge, mutates target',
        'Object.freeze(obj) → makes object immutable (shallow)',
        'Object.create(proto) → new object with proto as prototype',
        'Object.getPrototypeOf(obj) → prototype of obj',
        'Spread { ...a, ...b } → shallow merge (b wins)',
        'Destructuring: const { a, b: renamed, c = default } = obj',
        'Computed keys: { [dynamicKey]: value }',
        'Shorthand: { name } same as { name: name }',
        'Optional chaining: obj?.prop?.nested',
        'Nullish coalescing: obj.prop ?? defaultValue',
        'structuredClone(obj) → deep clone (modern)',
      ],
    },
    {
      title: 'Async JavaScript Cheat Sheet',
      desc: 'Promises, async/await, and the event loop',
      items: [
        'Promise: pending → fulfilled (resolve) | rejected (reject)',
        '.then(onFulfilled) .catch(onRejected) .finally(cleanup)',
        'Always return inside .then() to chain properly',
        'async function always returns a Promise',
        'await unwraps a Promise (can only use inside async)',
        'try/catch around await for error handling',
        'Sequential: const a = await f1(); const b = await f2(a)',
        'Parallel: const [a,b] = await Promise.all([f1(), f2()])',
        'Promise.all → fails fast if any rejects',
        'Promise.allSettled → all results regardless of failure',
        'Promise.race → first to settle wins',
        'Promise.any → first to fulfill wins',
        'forEach + async is BROKEN — use for...of instead',
        'Microtasks before macrotasks — Promise.then before setTimeout',
        'Never block the event loop with synchronous heavy work',
      ],
    },
    {
      title: 'Top 20 Interview Must-Knows',
      desc: 'Most frequently asked JavaScript interview topics',
      items: [
        '1. var/let/const differences + hoisting + TDZ',
        '2. Closure — what it is + counter factory example',
        '3. this — 4 rules + arrow function exception',
        '4. Prototype chain + class syntax relationship',
        '5. Event loop — call stack, microtasks, macrotasks',
        '6. Promise vs async/await — same thing, different syntax',
        '7. == vs === — always use ===',
        '8. Falsy values (exactly 7 of them)',
        '9. typeof null === "object" bug',
        '10. Arrow functions — 4 differences from regular',
        '11. Spread vs rest — same syntax, different context',
        '12. Destructuring — objects and arrays with defaults',
        '13. map vs forEach — map returns array, forEach returns undefined',
        '14. Promise.all vs Promise.allSettled',
        '15. Deep clone methods — structuredClone vs JSON trick',
        '16. Debounce vs throttle',
        '17. Event bubbling + delegation',
        '18. localStorage vs sessionStorage vs cookies',
        '19. Module system — ES modules vs CommonJS',
        '20. null vs undefined — intent vs absence',
      ],
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Quick Revision</h1>
        <p className="text-slate-400">Cheat sheets and revision cards. Perfect for interview prep or quick refreshers.</p>
      </div>

      <div className="space-y-6">
        {sheets.map((sheet) => (
          <div key={sheet.title} className="border border-slate-700/60 rounded-xl overflow-hidden">
            <div className="px-5 py-4 bg-slate-800/60 border-b border-slate-700/60">
              <h2 className="font-bold text-white">{sheet.title}</h2>
              <p className="text-slate-400 text-sm mt-0.5">{sheet.desc}</p>
            </div>
            <div className="p-5">
              <ul className="space-y-2">
                {sheet.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span className="text-violet-400 flex-shrink-0 mt-0.5">•</span>
                    <span className="text-slate-300 leading-relaxed font-mono text-xs sm:text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
