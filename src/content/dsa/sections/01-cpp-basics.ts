import type { DSASection } from '@/types/dsa';

export const cppBasicsSection: DSASection = {
  id: 'cpp-basics',
  slug: 'cpp-basics',
  title: 'Things to Know in C++',
  description: 'Foundations of C++ programming needed before DSA. Input/output, data types, control flow, loops, functions, arrays and strings.',
  icon: '⚙️',
  color: 'from-blue-500 to-indigo-600',
  topics: [
    {
      id: 'cpp-input-output',
      slug: 'cpp-input-output',
      title: 'Input / Output in C++',
      type: 'lesson',
      difficulty: 'easy',
      introduction: `Every competitive programming problem requires reading input and printing output. In C++, we use **cin** for input and **cout** for output, part of the \`<iostream>\` header.\n\nUnlike JavaScript's console.log(), C++ I/O is synchronous and typically much faster — especially with the fast I/O trick (\`ios::sync_with_stdio(false)\`).`,
      theory: `**Headers needed:**\n\`#include <iostream>\` — for cin, cout, endl\n\`using namespace std;\` — avoids writing std:: every time\n\n**Output:** \`cout << value;\` — prints a value. Use \`<< endl\` or \`<< "\\n"\` to end the line (\\n is faster than endl because endl flushes the buffer).\n\n**Input:** \`cin >> variable;\` — reads a value. For multiple inputs: \`cin >> a >> b;\`\n\n**Fast I/O (very important in competitive programming):**\n\`ios::sync_with_stdio(false);\` — desynchronizes C and C++ I/O\n\`cin.tie(NULL);\` — unties cin from cout\nAlways add these two lines at the start of main() in contest code.`,
      codeExamples: [
        {
          title: 'Basic Input/Output',
          language: 'cpp',
          code: `#include <iostream>
using namespace std;

int main() {
    // Fast I/O — always add in competitive programming
    ios::sync_with_stdio(false);
    cin.tie(NULL);

    int n;
    cin >> n;             // read one integer

    int a, b;
    cin >> a >> b;        // read two integers

    cout << "Sum = " << a + b << "\\n";  // \\n is faster than endl
    cout << "n = " << n << endl;         // endl flushes buffer

    return 0;
}`,
          explanation: 'cin >> reads, cout << prints. Chain multiple with << or >>.',
        },
        {
          title: 'Reading an array, printing a line',
          language: 'cpp',
          code: `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int arr[n];

    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }

    for (int i = 0; i < n; i++) {
        cout << arr[i];
        if (i < n - 1) cout << " ";
    }
    cout << "\\n";

    return 0;
}`,
          explanation: 'Read n numbers into an array, print space-separated.',
        },
      ],
      commonMistakes: [
        'Using endl excessively — endl flushes the buffer on every call, making output 10-50x slower. Use "\\n" instead.',
        'Forgetting to add fast I/O — causes TLE on large inputs.',
        'Using printf/scanf with cin/cout without sync_with_stdio(false) — causes garbled output.',
      ],
      revisionNotes: [
        'cin >> reads, cout << prints.',
        'Always add ios::sync_with_stdio(false); cin.tie(NULL); in main for contests.',
        'Use "\\n" not endl for line breaks.',
        '#include <iostream> and using namespace std; are the two must-have lines.',
      ],
      keyTakeaways: [
        'cout << for output, cin >> for input',
        'Fast I/O trick: ios_base::sync_with_stdio(false); cin.tie(NULL);',
        '"\\n" is faster than endl',
      ],
    },
    {
      id: 'cpp-basics-vars',
      slug: 'cpp-basics-vars',
      title: 'C++ Basics: Variables, Data Types & Operators',
      type: 'lesson',
      difficulty: 'easy',
      introduction: `C++ is a statically typed language — every variable must have a declared type. The key data types you will use in DSA are int, long long, double, char, bool, and string.\n\nUnlike JavaScript where variables can hold any type, C++ requires you to declare the type upfront. This makes C++ programs faster but requires more care.`,
      theory: `**Key Data Types:**\n- \`int\` — 32-bit integer, range: -2^31 to 2^31-1 (~2.1 billion). Most common in DSA.\n- \`long long\` — 64-bit integer, range: -2^63 to 2^63-1 (~9.2 × 10^18). Use when values exceed 2 billion.\n- \`double\` — 64-bit floating point. For decimal numbers.\n- \`char\` — single character. Stored as ASCII number internally.\n- \`bool\` — true or false.\n- \`string\` — text (needs #include <string>).\n\n**Variable Declaration:**\n\`int x = 5;\` — declare and initialize\n\`int a, b, c;\` — declare multiple\n\`const int MOD = 1e9 + 7;\` — constant\n\n**Operators:**\n- Arithmetic: +, -, *, /, % (modulo)\n- Comparison: ==, !=, <, >, <=, >=\n- Logical: && (and), || (or), ! (not)\n- Bitwise: &, |, ^, ~, <<, >>\n- Assignment: =, +=, -=, *=, /=, %=\n\n**Type Conversion (Casting):**\n\`(int) 3.7\` → 3 (truncates)\n\`(double) 5 / 2\` → 2.5 (not 2)\n\n**Important Constants:**\n\`INT_MAX\` = 2147483647, \`INT_MIN\` = -2147483648\n\`LLONG_MAX\` ≈ 9.2 × 10^18`,
      codeExamples: [
        {
          title: 'Data types and overflow',
          language: 'cpp',
          code: `#include <iostream>
#include <climits>
using namespace std;

int main() {
    int a = 1000000000;  // 10^9 — fine
    int b = 2000000000;  // 2×10^9 — fine
    // int overflow_example = a * 2; // OVERFLOW! exceeds INT_MAX

    long long c = (long long)a * a; // Cast first, then multiply
    cout << c << "\\n";  // 10^18 — safe with long long

    // Common modular arithmetic pattern
    const int MOD = 1e9 + 7;
    long long result = (long long)a % MOD;

    cout << INT_MAX << "\\n";    // 2147483647
    cout << LLONG_MAX << "\\n";  // 9223372036854775807

    // Integer division
    cout << 7 / 2 << "\\n";      // 3 (not 3.5)
    cout << 7 % 2 << "\\n";      // 1 (remainder)
    cout << (double)7 / 2 << "\\n"; // 3.5

    return 0;
}`,
          explanation: 'Always use long long when values might exceed 10^9. Cast before multiplying.',
        },
      ],
      commonMistakes: [
        'Integer overflow: multiplying two large ints without casting to long long. Always write (long long)a * b not a * b when result could exceed 2×10^9.',
        'Integer division: 7/2 = 3 in C++, not 3.5. Cast to double if needed.',
        'Comparing char with int without understanding ASCII values.',
      ],
      revisionNotes: [
        'int: up to ~2×10^9. long long: up to ~9×10^18.',
        'Cast before multiplying: (long long)a * b',
        'MOD = 1e9+7 is standard in problems requiring modular arithmetic.',
        '7/2 = 3 (integer division truncates towards zero).',
      ],
      keyTakeaways: [
        'Use long long when values > 10^9',
        'Integer division truncates — cast to double for decimal results',
        'Overflow is silent — your code gets wrong answers without error messages',
      ],
    },
    {
      id: 'cpp-if-elseif',
      slug: 'cpp-if-elseif',
      title: 'If / Else If / Else',
      type: 'lesson',
      difficulty: 'easy',
      introduction: `Conditional statements control which code runs based on conditions. In C++, \`if-else if-else\` works identically to most languages including JavaScript. Mastering conditions is essential — nearly every DSA problem uses them.`,
      theory: `**Syntax:**\n\`\`\`cpp\nif (condition) {\n    // runs if condition is true\n} else if (another_condition) {\n    // runs if first is false and this is true\n} else {\n    // runs if all above are false\n}\n\`\`\`\n\n**Ternary operator:** \`condition ? value_if_true : value_if_false\`\n\nExample: \`int max = (a > b) ? a : b;\`\n\n**Nested conditions:** Conditions inside conditions. Common in matrix problems.\n\n**Short-circuit evaluation:** In \`A && B\`, if A is false, B is never evaluated. In \`A || B\`, if A is true, B is never evaluated. Use this for safe null checks.`,
      codeExamples: [
        {
          title: 'Grading system example',
          language: 'cpp',
          code: `#include <iostream>
using namespace std;

int main() {
    int marks;
    cin >> marks;

    if (marks >= 90) {
        cout << "Grade: A\\n";
    } else if (marks >= 75) {
        cout << "Grade: B\\n";
    } else if (marks >= 60) {
        cout << "Grade: C\\n";
    } else if (marks >= 45) {
        cout << "Grade: D\\n";
    } else {
        cout << "Grade: F\\n";
    }

    // Ternary: shorter for simple 2-case conditions
    string result = (marks >= 45) ? "Pass" : "Fail";
    cout << result << "\\n";

    return 0;
}`,
        },
        {
          title: 'Finding max of 3 numbers',
          language: 'cpp',
          code: `int a = 5, b = 9, c = 3;

// Method 1: if-else
int maxVal;
if (a >= b && a >= c) maxVal = a;
else if (b >= a && b >= c) maxVal = b;
else maxVal = c;

// Method 2: nested ternary (less readable but concise)
int maxVal2 = (a >= b) ? ((a >= c) ? a : c) : ((b >= c) ? b : c);

// Method 3: use max() from <algorithm>
#include <algorithm>
int maxVal3 = max({a, b, c}); // C++11 initializer list`,
          explanation: 'Three ways to find max. In real DSA code, use max() from <algorithm>.',
        },
      ],
      commonMistakes: [
        'Using = (assignment) instead of == (comparison) in conditions — if (x = 5) is always true!',
        'Missing braces for single-statement if — works but leads to bugs when adding more statements.',
        'Checking floating point equality with == — use abs(a - b) < 1e-9 instead.',
      ],
      keyTakeaways: [
        '= is assignment, == is comparison. Never mix them in conditions.',
        'Ternary operator: condition ? a : b — great for min/max inline.',
        'Short-circuit: A && B skips B if A is false.',
      ],
    },
    {
      id: 'cpp-switch-case',
      slug: 'cpp-switch-case',
      title: 'Switch Case',
      type: 'lesson',
      difficulty: 'easy',
      introduction: `Switch-case provides a cleaner way to handle multiple specific values of a variable. It's faster than a chain of if-else when testing one variable against many integer/char values.`,
      theory: `**Syntax:**\n\`\`\`cpp\nswitch (variable) {\n    case value1:\n        // code\n        break;  // IMPORTANT: prevents fall-through\n    case value2:\n        // code\n        break;\n    default:\n        // runs if no case matched\n}\n\`\`\`\n\n**Fall-through:** If you omit \`break\`, execution continues into the next case. This is usually a bug, but occasionally intentional.\n\n**Works with:** int, char, enum. Does NOT work with string, float, or double.\n\n**When to use:** When testing one variable against 3+ specific values. For ranges, use if-else.`,
      codeExamples: [
        {
          title: 'Day of week',
          language: 'cpp',
          code: `#include <iostream>
using namespace std;

int main() {
    int day;
    cin >> day;

    switch (day) {
        case 1: cout << "Monday\\n"; break;
        case 2: cout << "Tuesday\\n"; break;
        case 3: cout << "Wednesday\\n"; break;
        case 4: cout << "Thursday\\n"; break;
        case 5: cout << "Friday\\n"; break;
        case 6: cout << "Saturday\\n"; break;
        case 7: cout << "Sunday\\n"; break;
        default: cout << "Invalid day\\n";
    }

    // Fall-through intentional: group cases
    switch (day) {
        case 6:
        case 7:
            cout << "Weekend!\\n";
            break;
        default:
            cout << "Weekday\\n";
    }

    return 0;
}`,
        },
      ],
      commonMistakes: [
        'Forgetting break — causes fall-through to the next case.',
        'Trying to use switch with strings — it only works with integer types and char.',
        'No default case — if no case matches, nothing runs. Always add default.',
      ],
      keyTakeaways: [
        'Always add break after each case.',
        'Switch only works with int, char, and enum (not string).',
        'default handles the "no match" case.',
      ],
    },
    {
      id: 'cpp-arrays-strings',
      slug: 'cpp-arrays-strings',
      title: 'Arrays and Strings',
      type: 'lesson',
      difficulty: 'easy',
      introduction: `Arrays and strings are the most important data structures in DSA. An array is a fixed-size collection of elements of the same type stored contiguously in memory. A string in C++ is a sequence of characters.`,
      theory: `**Arrays:**\nDeclaration: \`int arr[5];\` (uninitialized) or \`int arr[5] = {1, 2, 3, 4, 5};\`\nAccess: \`arr[0]\` to \`arr[n-1]\` (0-indexed)\nSize is FIXED — you cannot resize a C-style array.\n\n**std::vector (dynamic array):** More commonly used in competitive programming.\n\`vector<int> v;\` — empty\n\`vector<int> v(n, 0);\` — n zeros\n\`v.push_back(x)\` — add to end\n\`v.size()\` — size\n\`v[i]\` — access element\n\n**Strings:**\n\`string s = "hello";\`\n\`s.length()\` or \`s.size()\` — length\n\`s[i]\` — character at index i\n\`s.substr(start, len)\` — substring\n\`s + t\` — concatenation\n\`s.find("abc")\` — finds substring, returns pos or string::npos\n\n**2D Array:** \`int matrix[3][4];\` — 3 rows, 4 columns.\nAccess: \`matrix[row][col]\``,
      codeExamples: [
        {
          title: 'Arrays — basics and common operations',
          language: 'cpp',
          code: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n = 5;
    vector<int> arr = {3, 1, 4, 1, 5};

    // Access and modify
    arr[0] = 10;

    // Size
    cout << arr.size() << "\\n";  // 5

    // Iterate
    for (int i = 0; i < arr.size(); i++) {
        cout << arr[i] << " ";
    }
    cout << "\\n";

    // Range-based for loop (C++11)
    for (int x : arr) {
        cout << x << " ";
    }

    // 2D vector
    int rows = 3, cols = 4;
    vector<vector<int>> matrix(rows, vector<int>(cols, 0));
    matrix[1][2] = 5;

    return 0;
}`,
        },
        {
          title: 'Strings — common operations',
          language: 'cpp',
          code: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string s = "hello world";

    cout << s.length() << "\\n";      // 11
    cout << s[0] << "\\n";            // 'h'
    cout << s.substr(6, 5) << "\\n";  // "world"

    // Check if character is digit/alpha
    for (char c : s) {
        if (isalpha(c)) cout << c;    // only letters
    }
    cout << "\\n";

    // Convert case
    for (char& c : s) {
        c = toupper(c);  // modify in-place (note &)
    }
    cout << s << "\\n";  // "HELLO WORLD"

    // String comparison (lexicographic)
    string a = "apple", b = "banana";
    cout << (a < b ? "a comes first" : "b comes first") << "\\n";

    // Find
    size_t pos = s.find("WORLD");
    if (pos != string::npos) {
        cout << "Found at: " << pos << "\\n";
    }

    return 0;
}`,
        },
      ],
      commonMistakes: [
        'Accessing out-of-bounds index — arr[-1] or arr[n] causes undefined behavior (no automatic error).',
        'Comparing strings with == vs < — == checks equality, < is lexicographic. Both work in C++.',
        'Using .size() > 0 vs .size() - 1 with unsigned type — .size() returns size_t (unsigned), so size_t(0) - 1 wraps to a huge number.',
      ],
      revisionNotes: [
        'vector<int> is the go-to array in competitive programming.',
        'vector<int> v(n, 0) creates n zeros.',
        'string::npos is returned by find() when substring is not found.',
        's.substr(start, length) — second argument is length, not end index.',
      ],
      keyTakeaways: [
        'Arrays are 0-indexed.',
        'Prefer vector over raw arrays for flexibility.',
        'String characters accessed with s[i], iterate with range-for.',
      ],
    },
    {
      id: 'cpp-for-loops',
      slug: 'cpp-for-loops',
      title: 'For Loops',
      type: 'lesson',
      difficulty: 'easy',
      introduction: `For loops are the most common loop in DSA. You will use them to traverse arrays, strings, and matrices in nearly every problem. Knowing all loop variations makes your code cleaner and faster.`,
      theory: `**Standard for loop:**\n\`for (init; condition; update) { ... }\`\n\n**Common patterns in DSA:**\n- Forward: \`for (int i = 0; i < n; i++)\`\n- Backward: \`for (int i = n-1; i >= 0; i--)\`\n- Step 2: \`for (int i = 0; i < n; i += 2)\`\n- Nested: \`for (int i = 0; i < n; i++) for (int j = 0; j < m; j++)\`\n\n**Range-based for (C++11):**\n\`for (int x : arr)\` — by value (copy)\n\`for (int& x : arr)\` — by reference (can modify)\n\`for (auto x : arr)\` — auto type deduction\n\n**break:** Exit the loop immediately\n**continue:** Skip the current iteration, go to next`,
      codeExamples: [
        {
          title: 'Loop patterns in DSA',
          language: 'cpp',
          code: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> arr = {1, 2, 3, 4, 5};
    int n = arr.size();

    // 1. Standard forward
    for (int i = 0; i < n; i++) cout << arr[i] << " ";
    cout << "\\n";

    // 2. Backward
    for (int i = n - 1; i >= 0; i--) cout << arr[i] << " ";
    cout << "\\n";

    // 3. Range-based (read-only)
    for (int x : arr) cout << x << " ";
    cout << "\\n";

    // 4. Range-based (modify in-place)
    for (int& x : arr) x *= 2;
    for (int x : arr) cout << x << " ";
    cout << "\\n";

    // 5. Nested — print multiplication table
    for (int i = 1; i <= 3; i++) {
        for (int j = 1; j <= 3; j++) {
            cout << i * j << " ";
        }
        cout << "\\n";
    }

    // 6. break and continue
    for (int i = 0; i < 10; i++) {
        if (i == 5) break;     // stop at 5
        if (i % 2 == 0) continue; // skip evens
        cout << i << " ";      // prints 1 3
    }

    return 0;
}`,
        },
      ],
      commonMistakes: [
        'Off-by-one: i <= n instead of i < n — reads arr[n] which is out of bounds.',
        'Modifying the loop variable inside the loop — causes infinite loops or missed iterations.',
        'Using a range-based for without & when you intend to modify elements.',
      ],
      keyTakeaways: [
        'for (int i = 0; i < n; i++) — most common DSA pattern',
        'break exits the loop, continue skips to next iteration',
        'Use & in range-for when you need to modify elements',
      ],
    },
    {
      id: 'cpp-while-loops',
      slug: 'cpp-while-loops',
      title: 'While and Do-While Loops',
      type: 'lesson',
      difficulty: 'easy',
      introduction: `While loops run as long as a condition is true. They're used when you don't know the number of iterations upfront — like processing digits of a number, or pointer-based traversal in linked lists.`,
      theory: `**While loop:** Checks condition BEFORE executing.\n\`while (condition) { ... }\`\n\n**Do-while loop:** Executes ONCE then checks condition.\n\`do { ... } while (condition);\`\n\n**When to use while over for:**\n- When the number of iterations is unknown\n- When iterating with two pointers from both ends\n- In problems involving digits (while n > 0)\n- Simulation-type problems`,
      codeExamples: [
        {
          title: 'While loop patterns',
          language: 'cpp',
          code: `// Count digits of a number — classic while loop use
int n = 12345;
int count = 0;
while (n > 0) {
    count++;
    n /= 10;  // remove last digit
}
cout << count << "\\n";  // 5

// Two pointer pattern with while
int left = 0, right = 9;
while (left < right) {
    cout << left << " " << right << "\\n";
    left++;
    right--;
}

// Infinite loop with break
int i = 0;
while (true) {
    if (i >= 5) break;
    cout << i << " ";
    i++;
}`,
        },
      ],
      keyTakeaways: [
        'while: check first, then execute',
        'do-while: execute first, then check — guaranteed at least one run',
        'while (n > 0) { n /= 10; } — the classic digit-processing pattern',
      ],
    },
    {
      id: 'cpp-functions',
      slug: 'cpp-functions',
      title: 'Functions: Pass by Value vs Pass by Reference',
      type: 'lesson',
      difficulty: 'easy',
      introduction: `Functions let you reuse code and break problems into smaller pieces. In C++, you can pass arguments by **value** (copy) or by **reference** (original). This distinction is critical — it determines whether the function can modify the caller's variables.`,
      theory: `**Pass by Value:**\n- A copy of the argument is made\n- Changes inside the function do NOT affect the original\n- Used when: you don't want to modify the original\n\n**Pass by Reference (&):**\n- The function receives the original variable (no copy)\n- Changes inside the function AFFECT the original\n- Used when: you want to modify the caller's variable, or when passing large data structures (avoids expensive copy)\n\n**Pass by Const Reference (const &):**\n- Read-only access to the original (no copy, no modification)\n- Best practice for large objects like strings and vectors\n- \`void print(const vector<int>& arr)\`\n\n**Return values:** Functions return one value. To "return" multiple values, use reference parameters or return a \`pair<>/tuple\`.`,
      codeExamples: [
        {
          title: 'Pass by value vs reference',
          language: 'cpp',
          code: `#include <iostream>
#include <vector>
using namespace std;

// Pass by value — original unchanged
void doubleVal(int x) {
    x = x * 2;  // only modifies local copy
}

// Pass by reference — modifies original
void doubleRef(int& x) {
    x = x * 2;  // modifies the caller's variable
}

// Const reference — efficient, read-only
int sum(const vector<int>& arr) {
    int total = 0;
    for (int x : arr) total += x;
    return total;
}

// Return multiple values via references
void minMax(const vector<int>& arr, int& minVal, int& maxVal) {
    minVal = arr[0];
    maxVal = arr[0];
    for (int x : arr) {
        minVal = min(minVal, x);
        maxVal = max(maxVal, x);
    }
}

int main() {
    int a = 5;
    doubleVal(a);
    cout << a << "\\n";  // still 5

    doubleRef(a);
    cout << a << "\\n";  // now 10

    vector<int> arr = {3, 1, 4, 1, 5};
    cout << sum(arr) << "\\n";  // 14

    int mn, mx;
    minMax(arr, mn, mx);
    cout << mn << " " << mx << "\\n";  // 1 5

    return 0;
}`,
        },
      ],
      commonMistakes: [
        'Forgetting & when you intend to modify the original — function gets a copy, original unchanged.',
        'Passing large vectors/strings by value in loops — creates expensive copies. Use const& instead.',
        'Returning a reference to a local variable — the local variable is destroyed after the function returns.',
      ],
      revisionNotes: [
        'By value: function gets a copy. By reference (&): function gets the original.',
        'Use const& for large inputs you don\'t want to modify.',
        'Use & to return multiple values from a function.',
      ],
      keyTakeaways: [
        'Pass by value = copy. Pass by reference (&) = original.',
        'Use const vector<int>& for read-only array parameters.',
        'Use & parameters to "return" multiple values.',
      ],
    },
    {
      id: 'cpp-theory-examples',
      slug: 'cpp-theory-examples',
      title: 'Theory with Examples: Time & Space Complexity Basics',
      type: 'lesson',
      difficulty: 'easy',
      introduction: `Before solving DSA problems, you must understand how to analyze the efficiency of your solution. Time complexity tells you how the runtime scales with input size. Space complexity tells you how much extra memory is used. This is how interviewers evaluate your solution.`,
      theory: `**Big O Notation:** An upper bound on growth rate. We drop constants and lower-order terms.\n\n**Common Complexities (best → worst):**\n- O(1) — Constant: array access, hashmap lookup\n- O(log n) — Logarithmic: binary search, divide-and-conquer\n- O(n) — Linear: single loop through array\n- O(n log n) — Merge sort, efficient sorts\n- O(n²) — Quadratic: nested loops\n- O(2^n) — Exponential: recursive subsets\n- O(n!) — Factorial: permutations\n\n**Rule of thumb for n:**\n- n ≤ 10: O(n!) or O(n^6) fine\n- n ≤ 20: O(2^n) fine\n- n ≤ 500: O(n³) fine\n- n ≤ 5000: O(n²) fine\n- n ≤ 10^6: O(n log n) fine\n- n ≤ 10^8: O(n) fine\n- n > 10^8: O(log n) or O(1) needed`,
      codeExamples: [
        {
          title: 'Complexity examples',
          language: 'cpp',
          code: `// O(1) — constant time
int getFirst(vector<int>& arr) {
    return arr[0];  // always 1 operation
}

// O(n) — linear
int linearSum(vector<int>& arr) {
    int sum = 0;
    for (int x : arr) sum += x;  // n iterations
    return sum;
}

// O(n²) — quadratic (nested loops)
bool hasPairSum(vector<int>& arr, int target) {
    for (int i = 0; i < arr.size(); i++)          // n
        for (int j = i + 1; j < arr.size(); j++)  // n
            if (arr[i] + arr[j] == target) return true;
    return false;
}
// Better approach: O(n) using hashmap

// O(log n) — divide the search space each step
int binarySearch(vector<int>& arr, int target) {
    int lo = 0, hi = arr.size() - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;  // avoid overflow
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}`,
        },
      ],
      revisionNotes: [
        'O(n²) nested loops are usually the brute force. Look for O(n) or O(n log n) optimization.',
        '10^8 operations per second is a rough estimate for TLE threshold.',
        'Space complexity counts extra memory, not the input itself.',
      ],
      keyTakeaways: [
        'Always ask: What is the time complexity of my solution?',
        'O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2^n)',
        'For n = 10^5, O(n²) is too slow. Aim for O(n) or O(n log n).',
      ],
    },
  ],
};
