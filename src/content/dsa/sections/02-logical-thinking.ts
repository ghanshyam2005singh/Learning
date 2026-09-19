import type { DSASection } from '@/types/dsa';

export const logicalThinkingSection: DSASection = {
  id: 'logical-thinking',
  slug: 'logical-thinking',
  title: 'Build-up Logical Thinking',
  description: 'Strengthen problem-solving skills through easy/medium and hard programming problems before DSA.',
  icon: '🧠',
  color: 'from-purple-500 to-violet-600',
  topics: [
    {
      id: 'logical-easy-medium',
      slug: 'logical-easy-medium',
      title: 'Easy and Medium Logic Problems',
      type: 'lesson',
      difficulty: 'easy',
      introduction: `Before jumping into data structures, you need to build logical thinking — the ability to translate a problem into code step-by-step. This section is about writing programs that simulate real scenarios using only basic constructs: variables, loops, conditions, and math.`,
      theory: `**How to approach any logic problem:**\n\n1. **Understand the problem fully** — Read twice. What is the input? What is the expected output? What are the edge cases?\n2. **Work through examples by hand** — Before writing code, trace through 2-3 examples manually.\n3. **Identify the pattern** — Is it a loop? A formula? A condition?\n4. **Write pseudocode first** — Plain English steps before actual code.\n5. **Code it up** — Translate pseudocode to code.\n6. **Test edge cases** — n=0, n=1, negative numbers, max values.\n\n**Classic problems to practice:**\n- FizzBuzz: print 1 to n, "Fizz" if divisible by 3, "Buzz" if by 5, "FizzBuzz" if both.\n- Star patterns (see next section)\n- Number reversal\n- Sum of digits\n- Fibonacci sequence`,
      codeExamples: [
        {
          title: 'FizzBuzz — the classic logic building block',
          language: 'cpp',
          code: `// FizzBuzz: print 1 to n
// If divisible by 3 → "Fizz"
// If divisible by 5 → "Buzz"
// If divisible by both → "FizzBuzz"
// Otherwise → the number

for (int i = 1; i <= n; i++) {
    if (i % 3 == 0 && i % 5 == 0) cout << "FizzBuzz\\n";
    else if (i % 3 == 0) cout << "Fizz\\n";
    else if (i % 5 == 0) cout << "Buzz\\n";
    else cout << i << "\\n";
}

// KEY INSIGHT: Always check the combined condition FIRST.
// If you check i%3==0 first, "FizzBuzz" cases get classified as "Fizz".`,
        },
        {
          title: 'Sum of digits',
          language: 'cpp',
          code: `int n = 12345;
int sum = 0;
while (n > 0) {
    sum += n % 10;  // extract last digit
    n /= 10;        // remove last digit
}
// 1+2+3+4+5 = 15

// Pattern: n%10 gives last digit, n/10 removes it
// This pattern is used in: digit count, digit sum, palindrome check, Armstrong number`,
        },
      ],
      keyTakeaways: [
        'Always trace examples by hand before coding.',
        'n%10 extracts the last digit. n/10 removes the last digit.',
        'Start with brute force — optimize later.',
      ],
    },
    {
      id: 'logical-hard',
      slug: 'logical-hard',
      title: 'Hard Logic Problems',
      type: 'lesson',
      difficulty: 'medium',
      introduction: `Hard logic problems require combining multiple concepts — nested loops, mathematical insight, and careful edge case handling. These problems develop the problem-solving instinct needed for DSA interviews.`,
      theory: `**Strategies for hard problems:**\n\n1. **Break it into subproblems** — What smaller problem must be solved first?\n2. **Look for mathematical patterns** — Often a complex loop can be replaced by a formula.\n3. **Think about complexity** — If your brute force is O(n³), try to find O(n²) or O(n) by identifying redundant work.\n4. **Draw it out** — For matrix/grid problems, draw the grid and trace manually.\n\n**Classic hard logic problems:**\n- Spiral matrix traversal\n- Pascal's triangle\n- Number patterns with formulas\n- Prime sieve (Sieve of Eratosthenes)`,
      codeExamples: [
        {
          title: 'Pascal\'s Triangle',
          language: 'cpp',
          code: `// Pascal's Triangle — each element = sum of two above
// Row 0: 1
// Row 1: 1 1
// Row 2: 1 2 1
// Row 3: 1 3 3 1

vector<vector<int>> pascal(int n) {
    vector<vector<int>> triangle;
    for (int i = 0; i < n; i++) {
        vector<int> row(i + 1, 1);  // all 1s
        for (int j = 1; j < i; j++) {
            row[j] = triangle[i-1][j-1] + triangle[i-1][j];
        }
        triangle.push_back(row);
    }
    return triangle;
}`,
        },
      ],
      keyTakeaways: [
        'Break complex problems into smaller, clear subproblems.',
        'For pattern problems, find the formula for row[i][j] before coding.',
        'Always verify your solution against multiple examples.',
      ],
    },
  ],
};
