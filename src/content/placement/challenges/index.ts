import type { Challenge } from '@/types';

export const placementChallenges: Challenge[] = [
  {
    id: 'placement-ch-1',
    slug: 'hcf-lcm-application',
    title: 'HCF and LCM Application',
    description: 'Three bells ring at 15, 20, and 30 minute intervals. They ring together at 8 AM. Find the next time they all ring together.',
    difficulty: 'beginner',
    topic: 'Number System',
    starterCode: `// Find LCM of 15, 20, and 30.
// LCM gives the interval after which all three bells sync again.
// Then add that interval to 8:00 AM.

function nextRingTogether(intervals) {
  // your solution here
}`,
    solution: `// LCM(15, 20, 30):
// 15 = 3 × 5
// 20 = 2² × 5
// 30 = 2 × 3 × 5
// LCM = 2² × 3 × 5 = 60 minutes = 1 hour
// Next time = 8:00 AM + 1 hour = 9:00 AM`,
    hints: [
      'LCM gives you the smallest time after which all three bells coincide.',
      'Factorize each interval first, then take maximum power of each prime.',
    ],
    explanation: 'LCM(15,20,30) = 60 minutes. The bells ring together again at 9:00 AM. Decompose: 15=3×5, 20=2²×5, 30=2×3×5 → LCM=2²×3×5=60.',
    tags: ['LCM', 'Number System', 'Aptitude'],
  },
  {
    id: 'placement-ch-2',
    slug: 'successive-percentage',
    title: 'Successive Percentage Trap',
    description: 'A price increases by 20% and then decreases by 20%. What is the net change? Prove why the answer is NOT zero.',
    difficulty: 'beginner',
    topic: 'Percentage',
    starterCode: `// Use the formula: Net change = a + b + ab/100
// where a = +20 and b = -20

function netPercentageChange(a, b) {
  // return net percentage change
}`,
    solution: `// Net change = 20 + (-20) + (20 × -20)/100
// = 0 + (-400/100)
// = -4%
// So there is a net DECREASE of 4%.
// Proof: 100 → +20% → 120 → -20% → 96. Net: -4.`,
    hints: [
      'Use formula: net = a + b + ab/100',
      'Remember b is negative for a decrease',
    ],
    explanation: 'Net = a + b + ab/100 = 20 + (-20) + (20×-20)/100 = 0 - 4 = -4%. Successive +x% and -x% always yields a net decrease of x²/100 %.',
    tags: ['Percentage', 'Aptitude', 'Placement Trap'],
  },
  {
    id: 'placement-ch-3',
    slug: 'time-work-lcm',
    title: 'Time and Work — LCM Method',
    description: 'A can do a job in 12 days, B in 15 days, C in 20 days. They work together for 3 days, then A leaves. How many more days for B and C to finish?',
    difficulty: 'intermediate',
    topic: 'Time and Work',
    starterCode: `// Step 1: Find LCM(12, 15, 20) = total work units
// Step 2: Calculate rates for A, B, C
// Step 3: Compute work done in first 3 days (all three)
// Step 4: Remaining work / (B + C rate) = answer`,
    solution: `// LCM(12,15,20) = 60 units total work.
// A = 60/12 = 5 units/day
// B = 60/15 = 4 units/day
// C = 60/20 = 3 units/day
// Together 3 days: 3 × (5+4+3) = 3 × 12 = 36 units
// Remaining: 60 - 36 = 24 units
// B+C rate: 4+3 = 7 units/day
// Days needed: 24/7 = 3 3/7 days`,
    hints: [
      'LCM of 12,15,20 is 60.',
      'After A leaves, only B and C work. Their combined rate determines time for remaining work.',
    ],
    explanation: 'Total work = LCM(12,15,20) = 60. After 3 days together, 36 units done, 24 remain. B+C finish at 7 units/day → 24/7 ≈ 3.43 more days.',
    tags: ['Time and Work', 'LCM Method', 'Aptitude'],
  },
  {
    id: 'placement-ch-4',
    slug: 'seating-arrangement-linear',
    title: 'Linear Seating Arrangement',
    description: 'A,B,C,D,E sit in a row. B is not at the ends. A is left of C. D is to the immediate right of E. B is between A and D. Find all possible arrangements.',
    difficulty: 'intermediate',
    topic: 'Seating Arrangement',
    starterCode: `// Strategy:
// 1. Draw 5 blank seats: [_][_][_][_][_]
// 2. Apply each clue step by step
// 3. D is immediately right of E → E,D must be adjacent (E-D pair)
// 4. B is between A and D
// 5. B is not at ends (position 2,3,4 only)
// 6. A is left of C`,
    solution: `// D is right of E → consecutive: ...E-D...
// B between A and D: A-B-D or D-B-A
// Combined with E-D: A-B-E-D or we need E before D adjacent.
// Possible: A-B-E-D-C (A left of C ✓, B not at end ✓, D right of E ✓)
// Verify: B at position 2 (not an end) ✓
// Answer: A-B-E-D-C`,
    hints: [
      'Start with the pair constraint: D is immediately right of E → treat E-D as a unit.',
      'B between A and D means arrangement is A...B...D or D...B...A.',
    ],
    explanation: 'Fix E-D as adjacent pair. B is between A and D. With A left of C: valid arrangement is A-B-E-D-C. All clues satisfied.',
    tags: ['Seating Arrangement', 'Logical Reasoning', 'Placement'],
  },
  {
    id: 'placement-ch-5',
    slug: 'os-scheduling',
    title: 'CPU Scheduling — Average Waiting Time',
    description: 'Calculate average waiting time for SJF (non-preemptive): P1(burst=6), P2(burst=3), P3(burst=8), P4(burst=1). All arrive at time 0.',
    difficulty: 'intermediate',
    topic: 'Operating Systems',
    starterCode: `// SJF: order by burst time (shortest first).
// Order: P4(1), P2(3), P1(6), P3(8)
// Waiting time = time process starts - arrival time
// Arrival = 0 for all, so waiting = start time.`,
    solution: `// SJF order: P4(1), P2(3), P1(6), P3(8)
// P4: starts at 0, waits 0ms. Finishes at 1.
// P2: starts at 1, waits 1ms. Finishes at 4.
// P1: starts at 4, waits 4ms. Finishes at 10.
// P3: starts at 10, waits 10ms. Finishes at 18.
// Average waiting = (0+1+4+10)/4 = 15/4 = 3.75ms`,
    hints: [
      'SJF: sort by burst time ascending.',
      'Each process waits until all shorter ones before it are done.',
    ],
    explanation: 'SJF minimizes average waiting time. Order: P4(1)→P2(3)→P1(6)→P3(8). Waiting times: 0,1,4,10. Average = 3.75ms.',
    tags: ['Operating Systems', 'CPU Scheduling', 'SJF', 'CS Fundamentals'],
  },
  {
    id: 'placement-ch-6',
    slug: 'sql-joins-query',
    title: 'SQL JOIN Practice',
    description: 'Write SQL to find all employees who do NOT have a department assigned (department is NULL in Employees table after a LEFT JOIN with Departments).',
    difficulty: 'beginner',
    topic: 'DBMS',
    starterCode: `-- Tables:
-- Employees(EmpID, Name, DeptID)
-- Departments(DeptID, DeptName)
-- Write a query to find employees with no department.

SELECT ___
FROM Employees E
___ JOIN Departments D ON E.DeptID = D.DeptID
WHERE ___;`,
    solution: `SELECT E.Name
FROM Employees E
LEFT JOIN Departments D ON E.DeptID = D.DeptID
WHERE D.DeptID IS NULL;

-- LEFT JOIN keeps all employees.
-- Employees without a matching department will have NULL for D.DeptID.
-- WHERE D.DeptID IS NULL filters to only those unmatched employees.`,
    hints: [
      'Use LEFT JOIN to keep all employees, even those without a matching department.',
      'After LEFT JOIN, employees without a department will have NULL in the Department columns.',
      'Filter with WHERE D.DeptID IS NULL.',
    ],
    explanation: 'LEFT JOIN returns all rows from the left table (Employees). Non-matching right side (Departments) gets NULL. Filtering WHERE D.DeptID IS NULL gives employees with no department.',
    tags: ['SQL', 'DBMS', 'JOIN', 'CS Fundamentals'],
  },
];
