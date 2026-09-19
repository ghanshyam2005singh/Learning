import type { InterviewQuestion } from '@/types';

export const placementInterviewQuestions: InterviewQuestion[] = [
  // ── APTITUDE ──────────────────────────────────────────────────────────────
  {
    question: 'A train 300m long passes a pole in 15 seconds. What is its speed in km/h?',
    answer: 'Speed = Distance / Time = 300 / 15 = 20 m/s. Convert to km/h: 20 × (18/5) = 72 km/h.',
    difficulty: 'beginner',
  },
  {
    question: 'Two pipes A and B fill a tank in 12 and 18 hours respectively. Both opened together — how long to fill?',
    answer: 'A fills 1/12 per hour, B fills 1/18. Together = 1/12 + 1/18 = 5/36 per hour. Time = 36/5 = 7.2 hours = 7 hours 12 minutes.',
    difficulty: 'beginner',
  },
  {
    question: 'If 20% of a number is 50, what is 40% of that number?',
    answer: '20% of N = 50 → N = 250. 40% of 250 = 100. Shortcut: 40% is double of 20%, so 2 × 50 = 100.',
    difficulty: 'beginner',
  },
  {
    question: 'A boat goes 20 km downstream in 2 hours and 15 km upstream in 3 hours. Find the speed of the stream.',
    answer: 'Downstream speed = 20/2 = 10 km/h. Upstream speed = 15/3 = 5 km/h. Speed of stream = (10−5)/2 = 2.5 km/h.',
    difficulty: 'intermediate',
  },
  {
    question: 'In how many ways can the letters of APPLE be arranged?',
    answer: 'APPLE has 5 letters with P repeated twice. Arrangements = 5! / 2! = 120/2 = 60.',
    difficulty: 'intermediate',
  },
  // ── LOGICAL REASONING ─────────────────────────────────────────────────────
  {
    question: 'Find the odd one out: 121, 169, 196, 225, 256.',
    answer: 'All are perfect squares (11²,13²,14²,15²,16²). The odd one out by prime base: 196=14² and 256=16² are even squares. Among odd-number squares: 121,169,225 are squares of primes (11,13,15). 256 = 16² where 16 is a power of 2 — stands out as a power-of-2 square.',
    difficulty: 'beginner',
    tip: 'Look for what makes one number different from all others — prime base, parity, or type of square.',
  },
  {
    question: 'If all Roses are Flowers and some Flowers are Red, can we conclude all Roses are Red?',
    answer: 'No. All Roses are Flowers (true), but only some Flowers are Red. Roses may or may not be among those red flowers. This is a syllogism trap — "some" does not guarantee inclusion of the entire subset.',
    difficulty: 'beginner',
  },
  // ── CS FUNDAMENTALS — OS ──────────────────────────────────────────────────
  {
    question: 'What is the difference between a process and a thread?',
    answer: 'A process is an independent program in execution with its own memory space (heap, stack, code, data). A thread is a lightweight unit of execution within a process — threads share the process memory space. Process creation is heavy (separate memory). Thread creation is light (shared memory). Communication between processes requires IPC; threads communicate directly via shared memory.',
    difficulty: 'intermediate',
    followUp: ['When would you use multiple processes vs multiple threads?', 'What is a race condition?'],
  },
  {
    question: 'What is a deadlock? What are its four necessary conditions?',
    answer: 'Deadlock is when two or more processes wait for each other indefinitely, none able to proceed. The four necessary conditions (Coffman): 1) Mutual Exclusion — resource held by only one process. 2) Hold and Wait — process holds a resource and waits for more. 3) No Preemption — resources cannot be forcibly taken. 4) Circular Wait — processes wait in a circular chain. All four must hold simultaneously for deadlock.',
    difficulty: 'intermediate',
    tip: 'Removing any ONE of the four conditions prevents deadlock.',
  },
  // ── CS FUNDAMENTALS — DBMS ───────────────────────────────────────────────
  {
    question: 'Explain ACID properties in DBMS.',
    answer: 'Atomicity: transaction is all-or-nothing (fully completes or fully rolls back). Consistency: database moves from one valid state to another — constraints never violated. Isolation: concurrent transactions behave as if sequential — no dirty reads/writes. Durability: once committed, transaction persists even after system failure.',
    difficulty: 'intermediate',
    followUp: ['What is a dirty read?', 'What isolation level prevents phantom reads?'],
  },
  {
    question: 'What is the difference between WHERE and HAVING in SQL?',
    answer: 'WHERE filters individual rows BEFORE grouping. HAVING filters groups AFTER GROUP BY. WHERE cannot use aggregate functions (COUNT, SUM, AVG). HAVING can. Example: WHERE salary > 50000 filters rows before grouping; HAVING COUNT(*) > 5 filters groups after.',
    difficulty: 'beginner',
  },
  // ── CS FUNDAMENTALS — NETWORKS ───────────────────────────────────────────
  {
    question: 'What happens when you type a URL in the browser and press Enter?',
    answer: '1. DNS Resolution: browser checks cache → OS cache → DNS server to resolve domain to IP. 2. TCP 3-way handshake (SYN, SYN-ACK, ACK). 3. TLS Handshake (for HTTPS): exchange certificates, negotiate cipher, establish encrypted channel. 4. HTTP Request: browser sends GET request. 5. Server processes request, sends HTTP response. 6. Browser renders HTML, fetches CSS/JS/images. 7. Page renders.',
    difficulty: 'intermediate',
    tip: 'This is asked in nearly every technical interview. Memorize all 7 steps.',
  },
  {
    question: 'What is the difference between TCP and UDP?',
    answer: 'TCP: connection-oriented (3-way handshake), reliable (guarantees delivery, ordering, error checking), slower, flow/congestion control. Used for HTTP, email, file transfer. UDP: connectionless, unreliable (no guarantee of delivery or order), faster, no overhead. Used for video streaming, gaming, DNS, VoIP — where speed matters more than reliability.',
    difficulty: 'beginner',
  },
  // ── CS FUNDAMENTALS — OOP ────────────────────────────────────────────────
  {
    question: 'What is polymorphism? Explain compile-time vs runtime polymorphism.',
    answer: 'Polymorphism means "many forms" — same interface, different behavior. Compile-time (Static): resolved at compile time via method overloading (same name, different parameters). Runtime (Dynamic): resolved at runtime via method overriding (subclass overrides parent method). Uses virtual dispatch — actual object type determines which method runs.',
    difficulty: 'intermediate',
    followUp: ['Can we override a static method?', 'What is the difference between overloading and overriding?'],
  },
  // ── INTERVIEW PREPARATION ─────────────────────────────────────────────────
  {
    question: 'Tell me about yourself.',
    answer: 'Structure (P-E-R-T): Present — "I am a final-year CS student at [college]." Experience — "I built [project] and interned at [company] where [key achievement]." Relevant skills — "My strongest areas are [2-3 skills]." Target — "I am excited about this role because [specific reason]." Keep it 90 seconds. Practice aloud until smooth.',
    difficulty: 'beginner',
    tip: 'This is not a biography — it is a sales pitch. Every sentence must be relevant to the role.',
  },
  {
    question: 'What is your greatest weakness?',
    answer: 'Never say "I work too hard." Choose a real but non-critical weakness. Structure: (1) State the weakness honestly. (2) Show self-awareness. (3) Explain what you are actively doing to improve. Example: "I sometimes over-engineer solutions — I get excited by clean abstractions. I have been practicing shipping minimal working versions first and refining after feedback."',
    difficulty: 'beginner',
  },
  {
    question: 'Describe a situation where you handled a conflict in a team.',
    answer: 'Use STAR: Situation (conflict in a project — disagreement on tech choice). Task (resolve it without damaging team dynamics). Action (called an objective discussion, used a decision matrix, evaluated options against timeline and expertise). Result (team chose objectively, both sides felt heard, project delivered on time). Key: show conflict resolution skill, not blame.',
    difficulty: 'intermediate',
    tip: 'Spend 80% of your answer on the Action — that is what interviewers are evaluating.',
  },
];
