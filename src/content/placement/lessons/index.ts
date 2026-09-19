import type { Lesson } from '@/types';

export const placementLessons: Lesson[] = [
  // ════════════════════════════════════════════════════════════════════════════
  // SECTION 1 — APTITUDE
  // ════════════════════════════════════════════════════════════════════════════
  {
    id: 'number-system',
    slug: 'number-system',
    title: 'Number System',
    description: 'Divisibility rules, HCF, LCM, remainders, cyclicity, and modular arithmetic — the foundation of all aptitude tests.',
    category: 'Aptitude',
    order: 1,
    difficulty: 'beginner',
    estimatedTime: 45,
    content: `## What is Number System?

Number system is the foundation of quantitative aptitude. Every placement test has 4-6 number system questions. The students who know the shortcuts solve them in 30 seconds — others take 3 minutes.

---

## Divisibility Rules (Memorize These)

These rules let you check divisibility without actually dividing.

| Divisor | Rule | Example |
|---------|------|---------|
| **2** | Last digit is 0,2,4,6,8 | 348 → 8 is even ✓ |
| **3** | Sum of digits divisible by 3 | 123 → 1+2+3=6 ✓ |
| **4** | Last two digits divisible by 4 | 1324 → 24÷4=6 ✓ |
| **5** | Last digit is 0 or 5 | 345 ✓ |
| **6** | Divisible by both 2 and 3 | 132 → even + 1+3+2=6 ✓ |
| **7** | Double last digit, subtract from rest. Repeat. | 203 → 20−6=14 ✓ |
| **8** | Last three digits divisible by 8 | 1120 → 120÷8=15 ✓ |
| **9** | Sum of digits divisible by 9 | 729 → 7+2+9=18 ✓ |
| **10** | Last digit is 0 | 230 ✓ |
| **11** | (Sum of odd-position digits) − (Sum of even-position digits) = 0 or 11 | 121 → (1+1)−2=0 ✓ |

**Trick:** For divisibility by 12 → must be divisible by both 3 AND 4.
For 15 → must be divisible by both 3 AND 5.

---

## Factors and Multiples

**Factor:** A number that divides exactly into another number.
Factors of 12: 1, 2, 3, 4, 6, 12

**Multiple:** Result of multiplying a number by an integer.
Multiples of 4: 4, 8, 12, 16, 20...

**Number of factors formula:** If N = a^p × b^q × c^r, then
Number of factors = (p+1)(q+1)(r+1)

Example: 72 = 2³ × 3² → Factors = (3+1)(2+1) = 12 factors.

---

## Prime Numbers

A prime has exactly 2 factors: 1 and itself.
Primes up to 100: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97

**Shortcut to check if N is prime:** Check divisibility by all primes up to √N. If none divide N, it is prime.
Example: Is 97 prime? √97 ≈ 9.8. Check 2,3,5,7. None divide 97. So 97 is prime.

**Note:** 1 is NOT prime. 2 is the only even prime.

---

## HCF (Highest Common Factor)

**Definition:** Largest number that divides all given numbers exactly.

**Methods:**

**Method 1 — Prime Factorization:**
HCF(36, 48) = ?
36 = 2² × 3², 48 = 2⁴ × 3¹
HCF = 2² × 3¹ = 4 × 3 = 12

**Method 2 — Division Method (Euclid's Algorithm):**
HCF(48, 36): 48 = 36×1 + 12 → 36 = 12×3 + 0 → HCF = 12

**Placement Shortcut:** HCF(a, b, c) = HCF(a, HCF(b, c))

**When to use HCF:**
- Largest tile to cover a floor
- Largest group to divide items equally
- Maximum identical packets

---

## LCM (Lowest Common Multiple)

**Definition:** Smallest number divisible by all given numbers.

**Formula:** LCM × HCF = Product of two numbers (only valid for TWO numbers)
So: LCM(a, b) = (a × b) / HCF(a, b)

**Example:** LCM(12, 18) = (12×18) / HCF(12,18) = 216 / 6 = 36

**For 3+ numbers:** Use prime factorization.
LCM(4, 6, 10): 4=2², 6=2×3, 10=2×5 → LCM = 2² × 3 × 5 = 60

**When to use LCM:**
- When bells ring together again
- When two events coincide
- Minimum length/quantity for exact division

---

## Remainders and Modular Arithmetic

**Remainder Theorem:** When a number N is divided by d, we can write N = dq + r, where r is the remainder (0 ≤ r < d).

**Key Properties:**
- (a + b) mod n = ((a mod n) + (b mod n)) mod n
- (a × b) mod n = ((a mod n) × (b mod n)) mod n

**Example:** Remainder when 100 is divided by 7?
100 = 7 × 14 + 2 → Remainder = 2

**Shortcut for large numbers:** Find pattern of remainders.
Remainder when 2^50 is divided by 3?
2¹ mod 3 = 2, 2² mod 3 = 1, 2³ mod 3 = 2, 2⁴ mod 3 = 1...
Pattern repeats every 2. 50 is even → remainder = 1.

---

## Cyclicity

The unit digit of powers of a number follows a cycle.

| Number | Cycle | Period |
|--------|-------|--------|
| 2 | 2,4,8,6 | 4 |
| 3 | 3,9,7,1 | 4 |
| 4 | 4,6 | 2 |
| 7 | 7,9,3,1 | 4 |
| 8 | 8,4,2,6 | 4 |
| 9 | 9,1 | 2 |
| 0,1,5,6 | Same digit | 1 |

**Example:** Unit digit of 7^83?
83 mod 4 = 3 (cycle position 3) → cycle of 7 is {7,9,3,1} → position 3 = **3**

**Example:** Unit digit of 3^100?
100 mod 4 = 0 → use position 4 → cycle of 3 is {3,9,7,1} → position 4 = **1**`,
    codeExamples: [
      {
        title: 'Worked Example: Divisibility',
        code: `Is 4752 divisible by 8?
Last 3 digits = 752
752 ÷ 8 = 94 (exact)
Answer: YES, 4752 is divisible by 8.

Is 5376 divisible by 11?
Digits: 5, 3, 7, 6
Odd positions (1st, 3rd): 5 + 7 = 12
Even positions (2nd, 4th): 3 + 6 = 9
Difference: 12 - 9 = 3
NOT divisible by 11.`,
        explanation: 'Apply divisibility rules directly — no calculator needed.',
      },
      {
        title: 'Worked Example: HCF/LCM',
        code: `Problem: Find HCF and LCM of 24, 36, 48.

Step 1 — Prime factorize each:
24 = 2³ × 3¹
36 = 2² × 3²
48 = 2⁴ × 3¹

Step 2 — HCF (take MINIMUM power of common primes):
HCF = 2² × 3¹ = 4 × 3 = 12

Step 3 — LCM (take MAXIMUM power of all primes):
LCM = 2⁴ × 3² = 16 × 9 = 144

Verify for two numbers: HCF(24,36) × LCM(24,36) = 12 × 72 = 864 = 24 × 36 ✓`,
        explanation: 'HCF uses minimum powers; LCM uses maximum powers of all prime factors.',
      },
      {
        title: 'Placement Question — Remainder',
        code: `Q: What is the remainder when (32^32^32) is divided by 9?

Step 1: Find 32 mod 9 = 5 (since 32 = 3×9 + 5)
Step 2: Now find 5^(32^32) mod 9.
Step 3: Cyclicity of 5 mod 9:
5^1 mod 9 = 5
5^2 mod 9 = 25 mod 9 = 7
5^3 mod 9 = 35 mod 9 = 8
5^4 mod 9 = 40 mod 9 = 4
5^5 mod 9 = 20 mod 9 = 2
5^6 mod 9 = 10 mod 9 = 1
Period = 6.

Step 4: Find 32^32 mod 6.
32 mod 6 = 2. So 32^32 mod 6 = 2^32 mod 6.
2^1=2, 2^2=4, 2^3=2 (mod 6) — period 2. 32 is even → 2^32 mod 6 = 4.

Step 5: So answer = 5^4 mod 9 = 625 mod 9 = 4.
Answer: Remainder = 4`,
        explanation: 'For large power remainders: find cyclicity, reduce the exponent using cyclicity, then compute.',
      },
    ],
    commonMistakes: [
      'Confusing HCF and LCM — HCF divides (smaller), LCM is divisible by both (larger).',
      'LCM × HCF = product of numbers — this formula ONLY works for exactly TWO numbers.',
      'In cyclicity, when the remainder is 0 after dividing by cycle length, use the LAST position of the cycle, not position 0.',
      'Forgetting that 2 is prime and 1 is NOT prime.',
      'Checking primality only up to N/2 instead of √N — far more efficient.',
    ],
    interviewQuestions: [
      {
        question: 'What is the unit digit of 7^95?',
        answer: 'Cyclicity of 7: {7,9,3,1}, period=4. 95 mod 4 = 3. Position 3 in cycle = 3. Unit digit = 3.',
        difficulty: 'beginner',
      },
      {
        question: 'Three bells ring at 20, 30, 45 min intervals. If they ring together at 8 AM, when next?',
        answer: 'LCM(20,30,45) = LCM. 20=2²×5, 30=2×3×5, 45=3²×5. LCM=2²×3²×5=180 minutes = 3 hours. They ring together at 11 AM.',
        difficulty: 'beginner',
      },
      {
        question: 'Find the number of zeros at the end of 100!',
        answer: 'Zeros come from factors of 10 = 2×5. 5s are limiting. Count factors of 5 in 100!: ⌊100/5⌋ + ⌊100/25⌋ = 20 + 4 = 24 zeros.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'ns-ex-1',
        title: 'HCF/LCM Application',
        description: 'Tiles of size L × L can exactly cover a floor of 323 cm × 357 cm. Find maximum L.',
        starterCode: `// This is the concept to solve:
// Maximum tile size = HCF(323, 357)
// 357 = 323 × 1 + 34
// 323 = 34 × 9 + 17
// 34 = 17 × 2 + 0
// HCF = 17
// Answer: Maximum tile side = 17 cm`,
        solution: `// HCF(323, 357) using Euclid's algorithm:
// 357 = 323 × 1 + 34
// 323 = 34 × 9 + 17
// 34 = 17 × 2 + 0
// HCF = 17 cm`,
        hints: ['Use HCF when finding largest common measurement'],
        expectedOutput: '17',
      },
      {
        id: 'ns-ex-2',
        title: 'Cyclicity Challenge',
        description: 'Find the unit digit of (3^71 × 6^59 × 7^40).',
        starterCode: `// 3^71: cycle {3,9,7,1}, 71 mod 4 = 3 → unit digit = 7
// 6^59: unit digit always 6
// 7^40: cycle {7,9,3,1}, 40 mod 4 = 0 → use last → 1
// Product unit digit = 7 × 6 × 1 = 42 → unit digit = 2`,
        solution: `// Answer: 2`,
        hints: ['Find unit digit of each factor separately, then multiply unit digits'],
        expectedOutput: '2',
      },
    ],
    keyTakeaways: [
      'Divisibility rules eliminate calculation — memorize rules for 2,3,4,5,6,7,8,9,11.',
      'HCF = minimum powers of common primes. LCM = maximum powers of all primes.',
      'HCF × LCM = product of two numbers (only for exactly 2 numbers).',
      'Remainder of large powers: find cyclicity, reduce exponent mod cycle-length.',
      'Trailing zeros in n! = ⌊n/5⌋ + ⌊n/25⌋ + ⌊n/125⌋ + ...',
    ],
    nextLesson: 'percentage',
  },

  // ── MODULE 2: PERCENTAGE ────────────────────────────────────────────────────
  {
    id: 'percentage',
    slug: 'percentage',
    title: 'Percentage',
    description: 'Percentage concepts, successive percentage, profit/discount percentage — with placement shortcuts.',
    category: 'Aptitude',
    order: 2,
    difficulty: 'beginner',
    estimatedTime: 40,
    content: `## What is Percentage?

Percentage means "per hundred." X% = X/100.

**Why it matters:** Percentage is the most-asked aptitude topic in campus placements. Every data interpretation question uses percentage. Profit/loss, discount, and interest all use percentage.

---

## Core Formulas

**Percentage of a number:** X% of N = (X × N) / 100

**What percent is A of B?** = (A/B) × 100

**Percentage Change:** = [(New − Old) / Old] × 100

**If A increases by x%:** New value = A × (1 + x/100) = A × (100+x)/100
**If A decreases by x%:** New value = A × (1 − x/100) = A × (100−x)/100

---

## Mental Math Shortcuts

Learn these fractions as percentages for instant calculation:

| Fraction | Percentage |
|----------|------------|
| 1/2 | 50% |
| 1/3 | 33.33% |
| 1/4 | 25% |
| 1/5 | 20% |
| 1/6 | 16.67% |
| 1/7 | 14.28% |
| 1/8 | 12.5% |
| 1/9 | 11.11% |
| 1/10 | 10% |
| 1/12 | 8.33% |
| 3/4 | 75% |
| 2/3 | 66.67% |

**Speed technique:** Instead of calculating 25% of 480, think: 25% = 1/4, so 480/4 = 120.

---

## Successive Percentage Changes

When two percentage changes happen one after another:

**Formula:** Net change = a + b + (ab/100)
where a and b are the two percentage changes (use negative for decrease).

**Example:** Price increases by 20% then decreases by 20%. Net change?
= 20 + (−20) + (20×(−20)/100) = 0 − 4 = **−4%** (not 0!)

**Key insight:** Successive +x% and −x% always give a net LOSS of x²/100 %.

---

## Percentage and Fraction Relationship

**Increase by 20%:** multiply by 6/5 (since 120/100 = 6/5)
**Decrease by 25%:** multiply by 3/4 (since 75/100 = 3/4)
**Increase by 1/4:** equivalent to +25%

**Reverse percentage trick:**
If price increases by 25%, by what % should it be reduced to get original?
Original → +25% → New. To reverse: (25/125) × 100 = **20%**
Formula: If increased by x%, reduction needed = x/(100+x) × 100

---

## Profit Percentage

CP = Cost Price, SP = Selling Price
- Profit = SP − CP (when SP > CP)
- Loss = CP − SP (when CP > SP)
- **Profit % = (Profit/CP) × 100**
- **Loss % = (Loss/CP) × 100**

Note: Profit/Loss % is ALWAYS calculated on CP (not SP).

**SP formula:**
SP = CP × (100 + P%)/100 (for profit)
SP = CP × (100 − L%)/100 (for loss)

---

## Discount Percentage

Discount = Marked Price (MP) − Selling Price (SP)
**Discount % = (Discount/MP) × 100**

Note: Discount is ALWAYS calculated on MP (Marked Price), NOT CP.

**Key relationships:**
SP = MP × (100 − Discount%)/100
Profit = SP − CP

---

## Markup

Markup = MP − CP
Markup % = (Markup/CP) × 100

**Combined formula (markup + discount):**
If a merchant marks x% above CP and gives y% discount:
Profit % = x − y − (xy/100)`,
    codeExamples: [
      {
        title: 'Standard Percentage Problem',
        code: `Q: In an election, winner got 65% votes. Loser got 1750 votes.
   Total votes cast = ?

Step 1: Loser got (100 - 65)% = 35% of votes
Step 2: 35% = 1750 votes
Step 3: 100% = 1750 × (100/35) = 1750 × 20/7 = 5000

Answer: Total votes = 5000
Winner got = 65% of 5000 = 3250 votes`,
        explanation: 'When you know X% = some value, find 100% by cross multiplication.',
      },
      {
        title: 'Successive Percentage — The Trap',
        code: `Q: A salary is increased by 30% then decreased by 30%.
   Net effect?

Wrong answer (common mistake): 0% change

Correct:
Formula: Net = a + b + ab/100
= 30 + (-30) + (30 × -30)/100
= 0 + (-900/100)
= -9%

So salary DECREASES by 9%.

Intuition: 100 → +30% → 130 → -30% → 130 × 0.7 = 91
Net = (91-100)/100 × 100 = -9% ✓`,
        explanation: 'Successive equal +x% and -x% always result in a net DECREASE of x²/100 percent.',
      },
      {
        title: 'Markup and Discount Together',
        code: `Q: A shopkeeper marks goods 40% above CP and gives 25% discount.
   Find profit or loss %.

Method 1 (Formula):
Profit% = x - y - xy/100
= 40 - 25 - (40×25)/100
= 15 - 10 = 5%

Method 2 (Assume CP = 100):
MP = 140 (40% above CP)
SP = 140 × (100-25)/100 = 140 × 0.75 = 105
Profit = 105 - 100 = 5
Profit % = 5%`,
        explanation: 'Assume CP=100 when no actual values are given — makes calculation instant.',
      },
      {
        title: 'Real Placement Question (TCS/Infosys style)',
        code: `Q: The price of petrol rises by 25%. By what percent should
   consumption be reduced to keep expenditure unchanged?

Formula: Reduction % = [Rise% / (100 + Rise%)] × 100
= [25 / 125] × 100 = 20%

Proof: If price = 100, qty = 100, expenditure = 10000
New price = 125, new expenditure should = 10000
New qty = 10000/125 = 80
Reduction = (100-80)/100 × 100 = 20% ✓`,
        explanation: 'Classic placement question pattern — memorize the formula for price-quantity reciprocal changes.',
      },
    ],
    commonMistakes: [
      'Calculating profit% on SP instead of CP — always on CP.',
      'Calculating discount% on CP instead of MP — always on MP.',
      'Thinking +20% then -20% = 0% change. It is actually -4%.',
      'Not using the assume-CP-100 technique which makes most problems instant.',
      'Forgetting: If increased by x%, to reverse: decrease by x/(100+x) × 100, NOT x%.',
    ],
    interviewQuestions: [
      {
        question: 'A product costs ₹1200. What should be the marked price to get 20% profit after giving 20% discount?',
        answer: 'Need SP = 1200 × 1.2 = 1440. MP × 0.8 = 1440. MP = 1440/0.8 = ₹1800.',
        difficulty: 'intermediate',
      },
      {
        question: 'If A is 25% more than B, then B is what percent less than A?',
        answer: 'A = 1.25B. B = A/1.25. B is less than A by (A - A/1.25)/A × 100 = (1 - 1/1.25) × 100 = (1 - 0.8) × 100 = 20%. Formula: x/(100+x) × 100 = 25/125 × 100 = 20%.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'pct-ex-1',
        title: 'Successive Discounts',
        description: 'A shop offers successive discounts of 20% and 10%. What is the net discount?',
        starterCode: `// Net discount = a + b + ab/100 (with negatives for discounts)
// = -20 + (-10) + (-20 × -10)/100
// = -30 + 2
// = -28%
// Net discount = 28%`,
        solution: `Net discount = 20 + 10 - (20×10)/100 = 30 - 2 = 28%`,
        hints: ['Use successive percentage formula. Both are decreases.'],
        expectedOutput: '28% net discount',
      },
    ],
    keyTakeaways: [
      'Profit% and Loss% are always on CP. Discount% is always on MP.',
      'Successive +x% and -x% = net change of -x²/100 % (never 0).',
      'Markup+discount formula: Profit% = x - y - xy/100.',
      'Assume CP=100 when no values given — converts most problems to mental math.',
      'To reverse an x% increase: decrease by x/(100+x) × 100.',
    ],
    prevLesson: 'number-system',
    nextLesson: 'profit-loss',
  },

  // ── MODULE 3: PROFIT AND LOSS ────────────────────────────────────────────────
  {
    id: 'profit-loss',
    slug: 'profit-loss',
    title: 'Profit and Loss',
    description: 'Cost price, selling price, profit, loss, discount, marked price, successive discounts — with tricks.',
    category: 'Aptitude',
    order: 3,
    difficulty: 'beginner',
    estimatedTime: 35,
    content: `## Profit and Loss — The Foundation

Every commerce transaction involves profit or loss. Placement tests love this topic because it tests number sense and formula application under time pressure.

**Core Terms:**
- **Cost Price (CP):** Price at which item is purchased.
- **Selling Price (SP):** Price at which item is sold.
- **Marked Price (MP) / List Price:** Price written on the item (before discount).
- **Profit:** SP > CP. Profit = SP − CP.
- **Loss:** SP < CP. Loss = CP − SP.
- **Discount:** Reduction on Marked Price. Discount = MP − SP.

---

## Core Formulas

| Formula | Expression |
|---------|------------|
| Profit% | (Profit/CP) × 100 |
| Loss% | (Loss/CP) × 100 |
| SP (profit) | CP × (100+P%)/100 |
| SP (loss) | CP × (100−L%)/100 |
| CP from SP+P% | SP × 100/(100+P%) |
| CP from SP+L% | SP × 100/(100−L%) |
| Discount% | (Discount/MP) × 100 |
| SP after discount | MP × (100−D%)/100 |

---

## The Golden Rule

Profit % → always on **CP** (what you paid)
Discount % → always on **MP** (what was marked)

Never mix these up. This is the #1 mistake in placement exams.

---

## Dishonest Trader Shortcut

A trader claims to sell at CP but uses a shorter weight/measure.

**Profit% = (True weight − False weight) / False weight × 100**

Example: A milkman mixes water with milk and claims to sell pure milk at CP. Ratio = 4:1 (milk:water).
Profit% = (1/4) × 100 = 25%

---

## Two Articles — Same SP, One Profit One Loss

Classic trap: Two articles sold at ₹X each. One at P% profit, one at P% loss.
**Overall result is ALWAYS a LOSS.**
**Loss% = P²/100 %**

Example: Two books sold at ₹900 each, one at 20% profit, one at 20% loss.
Combined CP = 900×100/120 + 900×100/80 = 750 + 1125 = 1875
Combined SP = 1800
Loss = 1875 − 1800 = 75
Loss% = 75/1875 × 100 = 4% = (20²/100)% ✓

---

## Successive Discounts

Two discounts d1% and d2%:
Net discount = (d1 + d2 − d1×d2/100)%

SP = MP × (100−d1)/100 × (100−d2)/100

Example: MP = ₹2000, discounts 30% and 20%.
SP = 2000 × 0.7 × 0.8 = 2000 × 0.56 = ₹1120
Net discount = 30+20 − (30×20/100) = 50−6 = 44%

---

## Finding CP When Profit/Loss % Given

**If SP = ₹X at P% profit:**
CP = X × 100/(100+P)

**If SP = ₹X at L% loss:**
CP = X × 100/(100−L)

**Memory trick:** To find CP from SP, flip the multiplier.
SP = CP × (100+P)/100 → CP = SP × 100/(100+P)`,
    codeExamples: [
      {
        title: 'Full Profit/Loss Worked Example',
        code: `Q: A shopkeeper buys 12 oranges for ₹10 and sells 10 oranges
   for ₹12. Find profit or loss %.

CP of 1 orange = 10/12 = ₹5/6
SP of 1 orange = 12/10 = ₹6/5

Profit per orange = 6/5 - 5/6 = 36/30 - 25/30 = 11/30

Profit% = (11/30)/(5/6) × 100
= (11/30) × (6/5) × 100
= (66/150) × 100 = 44%

Shortcut: Think in terms of 60 oranges (LCM of 12 and 10):
Buy 60 at 60×(10/12) = ₹50
Sell 60 at 60×(12/10) = ₹72
Profit = 72-50 = 22, Profit% = 22/50 × 100 = 44%`,
        explanation: 'When rates involve "X for ₹Y" style, use LCM of quantities for clean calculation.',
      },
      {
        title: 'Marked Price Problems',
        code: `Q: After a 10% discount, profit is 8%. What is markup %?

Let CP = 100.
SP = 108 (8% profit on CP).
SP after discount = MP × (90/100) = 108
MP = 108 × 100/90 = 120

Markup = 120 - 100 = 20
Markup% = 20%

Verification: MP=120, 10% discount → SP=108, Profit on CP=100 → 8% ✓`,
        explanation: 'Always set CP=100 when actual values are not given.',
      },
      {
        title: 'Same SP, Equal Profit/Loss — The Trap',
        code: `Q: Two items sold at ₹1200 each. One at 20% profit,
   one at 20% loss. Net result?

CP of item 1 (sold at profit) = 1200 × 100/120 = ₹1000
CP of item 2 (sold at loss) = 1200 × 100/80 = ₹1500
Total CP = 2500, Total SP = 2400
Loss = 100, Loss% = 100/2500 × 100 = 4%

Formula check: Loss% = 20²/100 = 4% ✓

ALWAYS a loss when same SP, equal % profit and loss.`,
        explanation: 'This is one of the most common traps in placement exams. The answer is never "break even."',
      },
    ],
    commonMistakes: [
      'Calculating profit% on SP — always calculate on CP.',
      'Thinking equal P% and L% on same SP means no overall profit/loss — it is always a loss.',
      'Confusing markup% (on CP) with discount% (on MP).',
      'Adding discounts directly: 30% + 20% ≠ 50% discount. Use the formula.',
    ],
    interviewQuestions: [
      {
        question: 'A person sells two watches at the same price. On one he gains 16% and on other he loses 14%. Find his overall profit or loss.',
        answer: 'Let SP of each = ₹100. CP1 = 100×100/116 = 86.2. CP2 = 100×100/86 = 116.3. Total CP = 202.5, Total SP = 200. Loss = 2.5. Loss% ≈ 1.2%. They are not equal percentages so cannot use the P²/100 formula directly.',
        difficulty: 'intermediate',
      },
      {
        question: 'At what price should an item with CP ₹800 be marked to get 20% profit after 20% discount?',
        answer: 'Desired SP = 800 × 1.2 = ₹960. MP × (80/100) = 960. MP = 960 × 100/80 = ₹1200.',
        difficulty: 'beginner',
      },
    ],
    exercises: [
      {
        id: 'pl-ex-1',
        title: 'Profit and Loss Calculation',
        description: 'A trader buys goods for ₹6000 and sells at 25% profit. He gives a 10% discount on marked price. Find the marked price.',
        starterCode: `// CP = 6000, Profit = 25%, so SP = 6000 × 1.25 = 7500
// SP after 10% discount = MP × 0.9 = 7500
// MP = 7500 / 0.9 = 8333.33`,
        solution: `CP = 6000
SP = 6000 × 125/100 = 7500
MP × (90/100) = 7500
MP = 7500 × 100/90 = ₹8333.33`,
        hints: ['First find required SP, then work back to MP'],
        expectedOutput: '₹8333.33',
      },
    ],
    keyTakeaways: [
      'Profit%/Loss% → always on CP. Discount% → always on MP.',
      'Same SP, equal P% and L% → always a net LOSS of P²/100 %.',
      'Set CP=100 when only percentages are given — fastest approach.',
      'Successive discounts: net = d1 + d2 − d1×d2/100.',
      'Dishonest trader profit% = (Error/True−Error) × 100.',
    ],
    prevLesson: 'percentage',
    nextLesson: 'ratio-proportion',
  },

  // ── MODULE 4: RATIO AND PROPORTION ──────────────────────────────────────────
  {
    id: 'ratio-proportion',
    slug: 'ratio-proportion',
    title: 'Ratio and Proportion',
    description: 'Ratios, proportions, mixtures, partnership, and comparison — with placement shortcuts.',
    category: 'Aptitude',
    order: 4,
    difficulty: 'beginner',
    estimatedTime: 35,
    content: `## Ratio

A ratio compares two quantities of the same kind. a:b = a/b.

**Key properties:**
- Ratios are unitless — 3:4 has no units.
- a:b = ka:kb for any non-zero k (multiply both by same number).
- a:b:c = a/b = b/c (compound ratio must be consistent).

**Operations on ratios:**
- Duplicate ratio of a:b = a²:b²
- Sub-duplicate ratio = √a:√b
- Compound ratio of a:b and c:d = ac:bd

---

## Proportion

Four quantities a, b, c, d are in proportion if a:b = c:d, i.e., a×d = b×c (cross-multiply).

**Types:**
- **Direct proportion:** As one increases, other increases. a/b = k (constant).
- **Inverse proportion:** As one increases, other decreases. a × b = k (constant).

**Fourth proportional:** If a:b = c:x, then x = bc/a.
**Third proportional:** If a:b = b:x, then x = b²/a.
**Mean proportional** of a and b = √(ab).

---

## Mixture Problems

**Alligation Rule:** The fast way to solve mixture problems.

When two ingredients of prices p1 and p2 are mixed to get a mixture of price pm:

Cheaper : Dearer = (pm − p1) : (p2 − pm)

Wait — correct formula:
- Quantity of cheaper / Quantity of dearer = (Price of dearer − Mean price) / (Mean price − Price of cheaper)
= (p2 − pm) : (pm − p1)

**Example:** Milk at ₹20/L and water (₹0) mixed to get ₹15/L.
Ratio = (15−0) : (20−15) = 15:5 = 3:1 (milk:water)

---

## Mixture Replacement

A vessel has x liters of liquid A. y liters are removed and replaced with liquid B. After n operations:

**Amount of A remaining = x × (1 − y/x)^n**

Example: 40L milk, 10L removed and replaced with water, done twice.
Remaining milk = 40 × (30/40)² = 40 × (3/4)² = 40 × 9/16 = 22.5L

---

## Partnership

Partners invest capital for different times. Profit is shared in ratio of (Capital × Time).

**Simple Partnership:** Partners invest for same time → profit ratio = capital ratio.
A:B:C invest 2000:3000:5000 → share profits in 2:3:5.

**Compound Partnership:** Different capitals, different durations.
A invests ₹2000 for 6 months, B invests ₹3000 for 4 months.
A's effective capital = 2000×6 = 12000
B's effective capital = 3000×4 = 12000
Profit ratio = 1:1

---

## Comparison of Ratios

To compare a:b and c:d, cross multiply:
- If ad > bc → a:b > c:d
- If ad < bc → a:b < c:d
- If ad = bc → a:b = c:d`,
    codeExamples: [
      {
        title: 'Alligation — Fastest Mixture Method',
        code: `Q: In what ratio must rice at ₹9/kg be mixed with rice at ₹6/kg
   to get a mixture at ₹7/kg?

Using Alligation:
          Cheaper (6)    Dearer (9)
               \\             /
               Mean (7)
               /             \\
          (9-7)=2         (7-6)=1

Ratio of cheaper:dearer = 2:1

Check: If 2kg at ₹6 + 1kg at ₹9 = 12+9 = ₹21 for 3kg → ₹7/kg ✓`,
        explanation: 'Draw the cross, put mean price in center. Differences give the ratio (reverse sides).',
      },
      {
        title: 'Partnership Profit Split',
        code: `Q: A invests ₹5000 for 12 months, B joins after 4 months with ₹8000.
   Total profit ₹7400. Find each person's share.

A's capital-months = 5000 × 12 = 60000
B joined after 4 months → invested for 8 months
B's capital-months = 8000 × 8 = 64000

Ratio = 60000:64000 = 60:64 = 15:16

Total parts = 15 + 16 = 31
A's share = 15/31 × 7400 = ₹3581 (approx)
B's share = 16/31 × 7400 = ₹3819 (approx)`,
        explanation: 'Multiply capital × months invested. This gives effective investment for profit sharing.',
      },
      {
        title: 'Mixture Replacement',
        code: `Q: A can contains 40L of milk. 8L is removed and replaced with water.
   This is done 2 more times (3 times total). Final milk quantity?

Formula: Final = Initial × (1 - removed/total)^n
= 40 × (1 - 8/40)^3
= 40 × (32/40)^3
= 40 × (4/5)^3
= 40 × 64/125
= 20.48L

Percentage of milk = 20.48/40 × 100 = 51.2%`,
        explanation: 'For repeated replacement, use the exponential formula. Never subtract linearly each time.',
      },
    ],
    commonMistakes: [
      'In alligation, confusing which side to put which value. The differences cross over — dearer gives cheaper\'s part.',
      'In partnership, forgetting to multiply by time duration.',
      'Adding ratios directly: if A:B=2:3 and B:C=4:5, A:B:C ≠ 2:3:5. Must equalize the B term first.',
      'Confusing direct and inverse proportion — more workers, less time is INVERSE.',
    ],
    interviewQuestions: [
      {
        question: 'A:B = 2:3, B:C = 4:5. Find A:B:C.',
        answer: 'Make B common. A:B = 2:3 = 8:12. B:C = 4:5 = 12:15. A:B:C = 8:12:15.',
        difficulty: 'beginner',
      },
      {
        question: 'A vessel has wine and water in ratio 3:1. 4 liters of the mixture is drawn and replaced with water. The new ratio is 2:1. Find the original quantity.',
        answer: 'Using formula: 3/4 = (V-4)/V × (3/1 / 4) ... Let V = total. After operation, wine = 3V/4 - 3. Wait, let original total = T. Wine = 3T/4. After removing 4L (3L wine, 1L water), wine = 3T/4 - 3. New ratio 2:1 means wine/(total-wine) = 2/1, so wine = 2T/3. Thus 3T/4 - 3 = 2T/3. 9T/12 - 8T/12 = 3. T/12 = 3. T = 36 liters.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'rp-ex-1',
        title: 'Alligation Problem',
        description: 'A milkman has two types of milk: one at ₹32/L and another at ₹24/L. In what ratio should they be mixed to sell at ₹28/L?',
        starterCode: `// Alligation: (32-28) : (28-24) = 4:4 = 1:1`,
        solution: `Cheaper (24) -- Mean (28) -- Dearer (32)
Ratio = (32-28) : (28-24) = 4:4 = 1:1`,
        hints: ['Apply alligation formula: differences on each side of mean'],
        expectedOutput: '1:1',
      },
    ],
    keyTakeaways: [
      'Alligation ratio = (Dearer − Mean) : (Mean − Cheaper). The differences cross over.',
      'Partnership profit = Capital × Time ratio.',
      'Mixture replacement: Final A = Initial × (1 − removed/total)^n.',
      'To combine ratios A:B and B:C, equalize the common term B first.',
      'Mean proportional of a and b = √(ab). Third proportional = b²/a.',
    ],
    prevLesson: 'profit-loss',
    nextLesson: 'average',
  },

  // ── MODULE 5: AVERAGE ────────────────────────────────────────────────────────
  {
    id: 'average',
    slug: 'average',
    title: 'Average',
    description: 'Mean, weighted average, and fast average calculations for placement problems.',
    category: 'Aptitude',
    order: 5,
    difficulty: 'beginner',
    estimatedTime: 25,
    content: `## Average (Arithmetic Mean)

**Average = Sum of all observations / Number of observations**

**Sum = Average × Count**

This is the most important derivation: Sum = Average × Count. Most problems give you average and count and ask you to find sum, or change in average when values change.

---

## Key Properties

1. If all values are equal, the average equals that value.
2. Average is always between the minimum and maximum values.
3. Adding a value equal to the average does not change the average.
4. If each observation increases by k, average increases by k.
5. If each observation is multiplied by k, average is multiplied by k.

---

## Changed Average Trick

When one member of a group is replaced by another:
New Sum = Old Sum + New member − Old member
Change in average = (New member − Old member) / Count

**Example:** Average of 10 numbers is 20. If one number 15 is replaced by 35, new average?
Change = (35 − 15) / 10 = 2. New average = 20 + 2 = 22.

---

## Weighted Average

When different groups have different averages:
**Weighted Average = (n₁A₁ + n₂A₂ + ... ) / (n₁ + n₂ + ...)**

Example: 30 students avg score 60, 20 students avg score 70.
Weighted avg = (30×60 + 20×70)/(30+20) = (1800+1400)/50 = 3200/50 = 64.

---

## Average Speed

When equal distances are traveled at speeds v₁ and v₂:
**Average speed = 2v₁v₂ / (v₁ + v₂)**

This is the Harmonic Mean, NOT the arithmetic mean.
(v₁+v₂)/2 gives WRONG answer when equal distances (not equal times).

When equal times at speeds v₁ and v₂:
Average speed = (v₁ + v₂) / 2 (arithmetic mean — correct here)

---

## Age Problems Using Average

If average age of a group is A and n years pass, new average = A + n.
If a person of age X leaves and person of age Y joins:
Change in average = (Y − X) / group_size.`,
    codeExamples: [
      {
        title: 'Missing Number from Average',
        code: `Q: Average of 5 numbers is 20. Four of them are 14, 18, 22, 26.
   Find the 5th number.

Sum of all 5 = 5 × 20 = 100
Sum of 4 known = 14 + 18 + 22 + 26 = 80
5th number = 100 - 80 = 20`,
        explanation: 'Sum = Average × Count. Find total sum, subtract known values.',
      },
      {
        title: 'Average Speed Trap',
        code: `Q: A travels from A to B at 60 km/h and returns at 40 km/h.
   Average speed for the journey?

Wrong: (60+40)/2 = 50 km/h ❌

Correct: Equal distance → Harmonic Mean
Average speed = 2 × 60 × 40 / (60 + 40)
= 4800 / 100 = 48 km/h ✓

Proof: Say distance = 120 km each way.
Time A→B = 120/60 = 2 hrs
Time B→A = 120/40 = 3 hrs
Total time = 5 hrs, Total distance = 240 km
Avg speed = 240/5 = 48 km/h ✓`,
        explanation: 'For equal DISTANCE at different speeds, use harmonic mean, not arithmetic mean.',
      },
      {
        title: 'Placement Question Style',
        code: `Q: The average age of a class of 30 students is 12 years.
   The class teacher's age is 30. What is the average age
   including the teacher?

Sum of student ages = 30 × 12 = 360
Sum including teacher = 360 + 30 = 390
New count = 31

New average = 390/31 ≈ 12.58 years

Shortcut: Addition of teacher changes avg by:
(30 - 12) / 31 = 18/31 ≈ 0.58
New avg = 12 + 0.58 = 12.58 ✓`,
        explanation: 'The shortcut: change in average = (new value - old average) / new count.',
      },
    ],
    commonMistakes: [
      'Using arithmetic mean for average speed with equal distances — must use harmonic mean.',
      'Forgetting that adding a person changes the COUNT too.',
      'Not using Sum = Avg × Count as the starting point.',
    ],
    interviewQuestions: [
      {
        question: 'The average of 11 results is 50. If the average of first 6 is 49 and last 6 is 52, find the 6th result.',
        answer: 'Sum of all 11 = 550. Sum of first 6 = 294. Sum of last 6 = 312. 6th result = 294 + 312 - 550 = 56.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'avg-ex-1',
        title: 'Average Speed',
        description: 'A car goes from X to Y at 50 km/h and returns at 75 km/h. Find average speed.',
        starterCode: `// Average speed = 2 × 50 × 75 / (50 + 75) = 7500/125 = 60 km/h`,
        solution: `Average speed = 2v₁v₂/(v₁+v₂) = 2×50×75/125 = 60 km/h`,
        hints: ['Equal distance → harmonic mean formula'],
        expectedOutput: '60 km/h',
      },
    ],
    keyTakeaways: [
      'Sum = Average × Count — the most important formula.',
      'Average speed (equal distance) = 2v₁v₂/(v₁+v₂), NOT (v₁+v₂)/2.',
      'Replacement: change in average = (New − Old) / Count.',
      'Adding n years to everyone in a group increases average by n.',
    ],
    prevLesson: 'ratio-proportion',
    nextLesson: 'time-work',
  },

  // ── MODULE 6: TIME AND WORK ──────────────────────────────────────────────────
  {
    id: 'time-work',
    slug: 'time-work',
    title: 'Time and Work',
    description: 'Individual work, combined work, pipes and cisterns, efficiency — with shortcut methods.',
    category: 'Aptitude',
    order: 6,
    difficulty: 'beginner',
    estimatedTime: 35,
    content: `## The Core Idea

If A can do a job in N days, A does **1/N of the job per day**.

This fraction (1/N) is called A's **work rate** or **efficiency**.

**Total work = Efficiency × Time**

Think of total work as a fixed quantity (say 1 unit). Each worker fills it at their rate per day.

---

## Combined Work

If A does 1/a of work per day and B does 1/b of work per day:
Together they do (1/a + 1/b) per day.

**Time together = ab/(a+b)**

---

## LCM Method (Fastest for Placement)

Instead of fractions, assume total work = LCM of all individual times.

Example: A takes 6 days, B takes 4 days.
LCM(6,4) = 12. Total work = 12 units.
A does 12/6 = 2 units/day. B does 12/4 = 3 units/day.
Together: 5 units/day. Time = 12/5 = 2.4 days.

This avoids fractions entirely!

---

## Work Done in N Days

If A and B together finish in d days, and A works for d₁ days, then B finishes remaining:
Work done by A = d₁ × (1/a) units.
Remaining work done by B.

---

## Pipes and Cisterns

Same concept — inlet pipes fill, outlet pipes (leaks) empty.

Inlet pipe A fills in a hours → rate = +1/a per hour.
Outlet pipe B empties in b hours → rate = −1/b per hour.
Net rate = 1/a − 1/b.

Time to fill = 1/(1/a − 1/b) = ab/(b−a), valid when b > a.

---

## Efficiency Concept

If A is twice as efficient as B: A does work in half the time.
A:B efficiency ratio = 2:1 → A:B time ratio = 1:2.

Efficiency ∝ 1/Time

More workers → less time (inverse proportion).

---

## Work and Wages

Wages distributed in ratio of work done = ratio of efficiencies (if same time) or ratio of (efficiency × time worked).`,
    codeExamples: [
      {
        title: 'Classic Pipes Problem',
        code: `Q: Pipe A fills a tank in 6 hours. Pipe B fills it in 4 hours.
   Pipe C (outlet) drains it in 12 hours.
   All three open simultaneously — time to fill?

Method 1 (Fractions):
Net rate = 1/6 + 1/4 - 1/12
= 2/12 + 3/12 - 1/12 = 4/12 = 1/3
Time = 3 hours

Method 2 (LCM — faster):
LCM(6,4,12) = 12. Total work = 12 units.
A fills 2/hr, B fills 3/hr, C drains 1/hr.
Net = 2+3-1 = 4 units/hr
Time = 12/4 = 3 hours ✓`,
        explanation: 'LCM method converts fractions to integers — faster under exam pressure.',
      },
      {
        title: 'Work with Different Durations',
        code: `Q: A can do a job in 10 days, B in 15 days. A works for 4 days,
   then leaves. How many more days does B need to finish?

Total work = LCM(10,15) = 30 units.
A's rate = 3 units/day. B's rate = 2 units/day.

Work done by A in 4 days = 4 × 3 = 12 units.
Remaining = 30 - 12 = 18 units.
B's time = 18/2 = 9 days.`,
        explanation: 'With LCM method, A leaves after partial work — just subtract and let B finish the rest.',
      },
      {
        title: 'Efficiency and Wages',
        code: `Q: A, B, C complete work in 20, 30, 60 days. They work together
   for 5 days. Total wages ₹1500. Find each person's wages.

LCM = 60. Total work = 60 units.
A = 3/day, B = 2/day, C = 1/day. Together = 6/day.

In 5 days: 30 units done.
Wages are in ratio of work done = 15:10:5 = 3:2:1.
Total parts = 6.
A gets 3/6 × 1500 = ₹750.
B gets 2/6 × 1500 = ₹500.
C gets 1/6 × 1500 = ₹250.`,
        explanation: 'Wages split in same ratio as work done (efficiency × time).',
      },
    ],
    commonMistakes: [
      'Adding time directly: if A takes 6 days and B takes 4, together NOT 10 days. Use formula: 6×4/(6+4) = 2.4 days.',
      'Forgetting outlet pipes subtract from the rate.',
      'Confusing "efficiency ratio" with "time ratio" — they are inverses.',
    ],
    interviewQuestions: [
      {
        question: 'A is twice as efficient as B and together finish a job in 14 days. How long does B alone take?',
        answer: 'Let B\'s rate = 1 unit/day. A\'s rate = 2 units/day. Together = 3 units/day. Total work = 3×14 = 42 units. B alone = 42 days.',
        difficulty: 'beginner',
      },
      {
        question: 'A pipe fills a tank in 3 hours. There is a leak that would empty the full tank in 9 hours. How long to fill?',
        answer: 'Net rate = 1/3 − 1/9 = 3/9 − 1/9 = 2/9. Time = 9/2 = 4.5 hours.',
        difficulty: 'beginner',
      },
    ],
    exercises: [
      {
        id: 'tw-ex-1',
        title: 'Men and Days',
        description: '5 men build a wall in 8 days. How many days for 4 men to build the same wall?',
        starterCode: `// Work = Men × Days = 5 × 8 = 40 man-days (constant)
// 4 men: 40/4 = 10 days`,
        solution: `Total work = 40 man-days. New time = 40/4 = 10 days.`,
        hints: ['Men × Days = constant for same work'],
        expectedOutput: '10 days',
      },
    ],
    keyTakeaways: [
      'Rate = 1/Time. Together rate = sum of individual rates.',
      'LCM method: assume total work = LCM. Convert time to rates.',
      'Efficiency ∝ 1/Time. If twice efficient → half the time.',
      'Wages split in ratio of work done.',
      'Pipes: inlets add, outlets subtract from net rate.',
    ],
    prevLesson: 'average',
    nextLesson: 'time-speed-distance',
  },

  // ── MODULE 7: TIME SPEED DISTANCE ────────────────────────────────────────────
  {
    id: 'time-speed-distance',
    slug: 'time-speed-distance',
    title: 'Time, Speed, and Distance',
    description: 'Relative speed, trains, boats and streams, circular tracks — with placement shortcuts.',
    category: 'Aptitude',
    order: 7,
    difficulty: 'intermediate',
    estimatedTime: 40,
    content: `## The Core Triangle

**Speed = Distance / Time**
**Distance = Speed × Time**
**Time = Distance / Speed**

Units conversion:
- km/h → m/s: multiply by 5/18
- m/s → km/h: multiply by 18/5

---

## Relative Speed

When two objects move:
- **Same direction:** Relative speed = |v₁ − v₂| (faster − slower)
- **Opposite direction:** Relative speed = v₁ + v₂

**Meeting time:** Time = Total distance / Relative speed

---

## Train Problems

A train of length L passes:
- A **pole/person:** Distance = L (length of train)
- Another train length L₂: Distance = L + L₂ (both lengths)
- A **platform** of length P: Distance = L + P

**Time = Distance / Speed**

For two trains approaching each other:
Time to cross = (L₁ + L₂) / (S₁ + S₂)
For same direction:
Time to cross = (L₁ + L₂) / (S₁ − S₂)

---

## Boats and Streams

- Boat speed in still water = u
- Stream speed = v
- **Downstream speed** = u + v (current helps)
- **Upstream speed** = u − v (current opposes)

**Finding u and v:**
u = (Downstream + Upstream) / 2
v = (Downstream − Upstream) / 2

---

## Circular Track

Two runners A (speed a) and B (speed b) start from same point on circular track of length L:

- **Same direction:** They meet after L / (a−b) seconds.
- **Opposite direction:** They meet after L / (a+b) seconds.
- A completes lap in L/a, B in L/b.
- They meet at start again after LCM(L/a, L/b) seconds.

---

## Average Speed

Equal distances at speeds v₁ and v₂:
**Average speed = 2v₁v₂ / (v₁+v₂)** (harmonic mean)

Equal times at speeds v₁ and v₂:
Average speed = (v₁+v₂)/2 (arithmetic mean)`,
    codeExamples: [
      {
        title: 'Train Crossing Problems',
        code: `Q: Train 200m long crosses a platform 300m long in 25 seconds.
   Find speed of the train.

Distance = Length of train + Length of platform = 200+300 = 500m
Time = 25 seconds
Speed = 500/25 = 20 m/s = 20 × 18/5 = 72 km/h

Q: Train 100m crosses another train 200m in 20s (same dir).
   Slower train at 36 km/h. Speed of faster train?

36 km/h = 10 m/s.
Relative speed = (100+200)/20 = 15 m/s.
Faster − 10 = 15 → Faster = 25 m/s = 90 km/h.`,
        explanation: 'Train problems: identify total distance (includes both lengths), then apply S=D/T.',
      },
      {
        title: 'Boats and Streams',
        code: `Q: A boat covers 24km downstream in 4 hours and 18km upstream
   in 6 hours. Speed of boat in still water?

Downstream speed = 24/4 = 6 km/h
Upstream speed = 18/6 = 3 km/h

Boat speed = (6+3)/2 = 4.5 km/h
Stream speed = (6-3)/2 = 1.5 km/h`,
        explanation: 'Always use (downstream+upstream)/2 for boat speed and (downstream-upstream)/2 for stream speed.',
      },
      {
        title: 'Circular Track Meeting',
        code: `Q: Two runners A (12 m/s) and B (8 m/s) run around a 400m
   circular track starting from the same point.

Opposite direction: Meet after 400/(12+8) = 400/20 = 20 seconds.
Same direction: Meet after 400/(12-8) = 400/4 = 100 seconds.

First meeting at starting point (same direction):
A's lap time = 400/12 = 100/3 s
B's lap time = 400/8 = 50 s
Meet at start: LCM(100/3, 50) = 100 s.`,
        explanation: 'Circular track: opposite direction uses sum of speeds, same direction uses difference.',
      },
    ],
    commonMistakes: [
      'Not converting km/h to m/s or vice versa — always check units.',
      'In train problems, using only the train length instead of train + platform/train.',
      'Confusing downstream (faster) with upstream (slower).',
      'Using arithmetic mean for average speed when distances are equal.',
    ],
    interviewQuestions: [
      {
        question: 'Two trains 200m and 150m start toward each other at 40 and 35 km/h. Time to completely cross each other?',
        answer: 'Relative speed = 75 km/h = 75×5/18 = 125/6 m/s. Distance = 350m. Time = 350/(125/6) = 350×6/125 = 16.8 seconds.',
        difficulty: 'intermediate',
      },
      {
        question: 'A man can row 18 km in 4 hours downstream and 12 km in 4 hours upstream. What is the rate of the current?',
        answer: 'Downstream = 18/4 = 4.5 km/h. Upstream = 12/4 = 3 km/h. Current = (4.5-3)/2 = 0.75 km/h.',
        difficulty: 'beginner',
      },
    ],
    exercises: [
      {
        id: 'tsd-ex-1',
        title: 'Train and Pole',
        description: 'A train traveling at 54 km/h passes a pole in 10 seconds. Find the length of the train.',
        starterCode: `// Speed = 54 km/h = 54 × 5/18 = 15 m/s
// Length = Speed × Time = 15 × 10 = 150m`,
        solution: `Speed = 54 × 5/18 = 15 m/s. Length = 15 × 10 = 150m.`,
        hints: ['Convert speed to m/s first, then use L = S × T'],
        expectedOutput: '150 meters',
      },
    ],
    keyTakeaways: [
      'km/h × 5/18 = m/s. m/s × 18/5 = km/h.',
      'Train + platform: distance = length of train + length of platform.',
      'Boats: downstream = u+v, upstream = u-v. u=(D+U)/2, v=(D-U)/2.',
      'Circular track opposite: time = track/(s₁+s₂). Same: track/(s₁-s₂).',
      'Average speed (equal distance) = 2v₁v₂/(v₁+v₂).',
    ],
    prevLesson: 'time-work',
    nextLesson: 'permutation-combination',
  },

  // ── MODULE 8: PERMUTATION AND COMBINATION ────────────────────────────────────
  {
    id: 'permutation-combination',
    slug: 'permutation-combination',
    title: 'Permutation and Combination',
    description: 'Counting, arrangements, selections, and placement question patterns.',
    category: 'Aptitude',
    order: 8,
    difficulty: 'intermediate',
    estimatedTime: 40,
    content: `## The Core Distinction

**Permutation = Arrangement** (order matters)
**Combination = Selection** (order does not matter)

Mnemonic: **P**ermutation = **P**lace (placing in a line, order matters).
**C**ombination = **C**hoose (picking a team, order irrelevant).

---

## Factorial

n! = n × (n-1) × (n-2) × ... × 1
0! = 1 (by definition)
1! = 1, 2!=2, 3!=6, 4!=24, 5!=120, 6!=720, 7!=5040

---

## Permutation

**ⁿPr = n! / (n-r)!**  — selecting and arranging r items from n.

Arrange 3 from 5: ⁵P₃ = 5×4×3 = 60.

**All n items:** n! arrangements.
Example: Arrange ABCDE in a line = 5! = 120 ways.

**Repetition allowed:** n^r (n choices for each of r positions).
3-digit number from {1,2,3,4,5} with repetition = 5³ = 125.

---

## Combination

**ⁿCr = n! / [r!(n-r)!]**

Select 3 from 5: ⁵C₃ = 10.

**Key property:** ⁿCr = ⁿC(n-r). Choosing 7 from 10 = choosing 3 from 10.

**Sum of all combinations:** ⁿC₀ + ⁿC₁ + ... + ⁿCₙ = 2ⁿ.

---

## Common Patterns

**Circular arrangement:** (n-1)! ways (fix one person, arrange rest).
For necklace/bracelet (can flip): (n-1)!/2.

**Identical items:** Arrange n items where p are alike, q are alike:
n! / (p! × q!)

**At least one:** Total − None.

**Gaps method:** When people should NOT be adjacent, place others first, then insert in gaps.

---

## Quick Counting Tricks

**Handshakes:** n people shake hands with each other = ⁿC₂ = n(n-1)/2.
**Diagonals in n-gon:** ⁿC₂ − n = n(n-3)/2.
**Triangles from n points (no 3 collinear):** ⁿC₃.`,
    codeExamples: [
      {
        title: 'Word Arrangement Problems',
        code: `Q: How many ways can letters of MATHEMATICS be arranged?

Letters: M,A,T,H,E,M,A,T,I,C,S = 11 letters
Repeats: M appears 2 times, A appears 2 times, T appears 2 times.
Arrangements = 11! / (2! × 2! × 2!)
= 39916800 / 8 = 4989600

Q: Arrange MISSION such that all vowels come together?
Vowels: I, I, O (3 vowels, I repeated twice)
Consonants: M, S, S, N (4 consonants, S repeated twice)

Treat vowels as one unit: arrange [VOWEL_BLOCK]+M+S+S+N = 5 items
Arrangements of 5 (S repeated) = 5!/2! = 60
Arrangements within vowel block (I,I,O) = 3!/2! = 3
Total = 60 × 3 = 180`,
        explanation: 'For repeated letters: divide by factorial of count of each repeated letter.',
      },
      {
        title: 'Selection Problems',
        code: `Q: A committee of 4 is selected from 6 men and 5 women.
   The committee must have at least 2 women.

Case 1: Exactly 2 women, 2 men = C(5,2) × C(6,2) = 10 × 15 = 150
Case 2: Exactly 3 women, 1 man = C(5,3) × C(6,1) = 10 × 6 = 60
Case 3: Exactly 4 women, 0 men = C(5,4) × C(6,0) = 5 × 1 = 5
Total = 150 + 60 + 5 = 215`,
        explanation: 'For "at least" conditions, enumerate each valid case and add.',
      },
      {
        title: 'Circular Arrangement',
        code: `Q: In how many ways can 6 people sit around a circular table?

Linear arrangements = 6! = 720
Circular (fixing one, rotating others) = (6-1)! = 5! = 120

Q: 4 boys and 3 girls sit around a table, no two girls adjacent.

First arrange 4 boys in circle: (4-1)! = 6 ways.
4 boys create 4 gaps. Place 3 girls in those gaps: P(4,3) = 24.
Total = 6 × 24 = 144.`,
        explanation: 'Circular arrangements: fix one position, arrange remaining (n-1)! ways.',
      },
    ],
    commonMistakes: [
      'Using permutation when order does not matter (committee selection needs combination).',
      'Forgetting 0!=1 which leads to wrong ⁿCₙ calculations.',
      'Circular arrangements: using n! instead of (n-1)!.',
      'Repeated items: forgetting to divide by the factorial of repetition count.',
    ],
    interviewQuestions: [
      {
        question: 'In how many ways can 5 boys and 5 girls be seated in a row such that no two girls are adjacent?',
        answer: 'Arrange 5 boys in 5! = 120 ways. This creates 6 gaps (including ends). Choose 5 of 6 gaps for girls: P(6,5) = 720 ways. Total = 120 × 720 = 86400.',
        difficulty: 'intermediate',
      },
      {
        question: 'How many 4-digit numbers can be formed using 1-7 with no digit repeated?',
        answer: '⁷P₄ = 7×6×5×4 = 840.',
        difficulty: 'beginner',
      },
    ],
    exercises: [
      {
        id: 'pc-ex-1',
        title: 'Committee Selection',
        description: 'From 5 teachers and 8 students, a committee of 5 must have exactly 2 teachers. How many ways?',
        starterCode: `// C(5,2) × C(8,3) = 10 × 56 = 560`,
        solution: `C(5,2) × C(8,3) = 10 × 56 = 560 ways.`,
        hints: ['Choose teachers separately, students separately, multiply'],
        expectedOutput: '560',
      },
    ],
    keyTakeaways: [
      'Permutation = order matters = ⁿPr = n!/(n-r)!',
      'Combination = order irrelevant = ⁿCr = n!/[r!(n-r)!]',
      'Circular arrangement = (n-1)! not n!',
      'Repeated letters: divide total by factorial of each repetition.',
      'At least one = Total − None.',
    ],
    prevLesson: 'time-speed-distance',
    nextLesson: 'probability',
  },

  // ── MODULE 9: PROBABILITY ─────────────────────────────────────────────────────
  {
    id: 'probability',
    slug: 'probability',
    title: 'Probability',
    description: 'Events, sample space, independent events, conditional probability — placement style.',
    category: 'Aptitude',
    order: 9,
    difficulty: 'intermediate',
    estimatedTime: 35,
    content: `## What is Probability?

Probability measures how likely an event is to occur.

**P(Event) = Favorable outcomes / Total possible outcomes**

**Range:** 0 ≤ P(E) ≤ 1. P=0 means impossible. P=1 means certain.

---

## Key Terms

**Sample Space (S):** Set of all possible outcomes.
Rolling a die: S = {1,2,3,4,5,6}, |S| = 6.

**Event (E):** Subset of sample space.
Getting even: E = {2,4,6}, P(E) = 3/6 = 1/2.

**Complementary Event:** P(E') = 1 − P(E).
P(not getting 6) = 1 − 1/6 = 5/6.

---

## Addition Rule

P(A or B) = P(A) + P(B) − P(A and B)

**Mutually exclusive events** (can't happen together): P(A and B) = 0.
P(A or B) = P(A) + P(B).

---

## Multiplication Rule

**Independent events** (one doesn't affect the other):
P(A and B) = P(A) × P(B)

**Dependent events:**
P(A and B) = P(A) × P(B|A)

---

## Conditional Probability

P(B|A) = P(A and B) / P(A)

"Probability of B, given A has occurred."

---

## Common Problems

**Coins:** P(Heads) = 1/2. n coins: 2ⁿ outcomes.
**Dice:** P(any face) = 1/6. Two dice: 36 outcomes.
**Cards:** 52 cards. 4 suits (13 each): Spades, Hearts, Diamonds, Clubs.
4 Aces, 4 Kings, 4 Queens, 4 Jacks. 13 face cards (K,Q,J of each suit).
Red cards = 26 (Hearts+Diamonds). Black = 26 (Spades+Clubs).

---

## Placement Shortcuts

**At least one:** P(at least one) = 1 − P(none)
Much faster than adding individual cases.

**Bayes' Theorem pattern:** P(A|B) = P(B|A)×P(A) / P(B)
Used in reasoning questions, especially in tech interviews.`,
    codeExamples: [
      {
        title: 'Card Probability',
        code: `Q: From a deck of 52 cards, one card is drawn. Find P(King or Spade).

P(King) = 4/52 = 1/13
P(Spade) = 13/52 = 1/4
P(King AND Spade) = 1/52 (King of Spades)

P(King OR Spade) = 1/13 + 1/4 - 1/52
= 4/52 + 13/52 - 1/52 = 16/52 = 4/13`,
        explanation: 'Use inclusion-exclusion. Don\'t double count the King of Spades.',
      },
      {
        title: 'At Least One — The Fast Way',
        code: `Q: A die is rolled 4 times. Probability of getting at least one 6?

Slow way: P(exactly 1) + P(exactly 2) + P(exactly 3) + P(exactly 4)

Fast way (complement):
P(at least one 6) = 1 - P(no 6 in any throw)
P(no 6 in one throw) = 5/6
P(no 6 in all 4) = (5/6)^4 = 625/1296
P(at least one 6) = 1 - 625/1296 = 671/1296 ≈ 0.518`,
        explanation: 'Always use complement for "at least one" — saves enormous calculation.',
      },
      {
        title: 'Conditional Probability',
        code: `Q: Bag has 4 red, 6 blue balls. Two drawn one by one without
   replacement. P(both red)?

P(1st red) = 4/10
P(2nd red | 1st red) = 3/9 (one less red, one less total)
P(both red) = 4/10 × 3/9 = 12/90 = 2/15

With replacement:
P(both red) = 4/10 × 4/10 = 16/100 = 4/25`,
        explanation: 'Without replacement: each draw changes the bag composition. With replacement: independent events.',
      },
    ],
    commonMistakes: [
      'Forgetting inclusion-exclusion when events overlap: P(A or B) ≠ P(A)+P(B) when not mutually exclusive.',
      'Not using complement for "at least one" — direct calculation is 5× harder.',
      'Forgetting that without replacement changes the denominator for each draw.',
    ],
    interviewQuestions: [
      {
        question: 'Two dice are thrown. Probability of getting a sum of 7?',
        answer: 'Total outcomes = 36. Favorable: (1,6),(2,5),(3,4),(4,3),(5,2),(6,1) = 6 pairs. P = 6/36 = 1/6.',
        difficulty: 'beginner',
      },
      {
        question: 'Three coins are tossed. P(at least 2 heads)?',
        answer: 'P(exactly 2H) = C(3,2)/8 = 3/8. P(exactly 3H) = 1/8. P(at least 2H) = 4/8 = 1/2.',
        difficulty: 'beginner',
      },
    ],
    exercises: [
      {
        id: 'prob-ex-1',
        title: 'Balls from a Bag',
        description: 'Bag has 5 red, 3 green, 2 blue balls. Two drawn. P(one red, one green)?',
        starterCode: `// C(5,1)×C(3,1) / C(10,2) = 15/45 = 1/3`,
        solution: `Favorable = C(5,1)×C(3,1) = 15. Total = C(10,2) = 45. P = 15/45 = 1/3.`,
        hints: ['Total ways to choose 2 from 10 = C(10,2)'],
        expectedOutput: '1/3',
      },
    ],
    keyTakeaways: [
      'P(at least one) = 1 − P(none) — always use complement.',
      'Independent events: multiply. Dependent (no replacement): conditional multiply.',
      'Mutually exclusive: P(A or B) = P(A)+P(B). Overlapping: subtract intersection.',
      'Card deck: 52 cards, 4 suits of 13. 26 red, 26 black. 4 each of A,K,Q,J.',
    ],
    prevLesson: 'permutation-combination',
    nextLesson: 'data-interpretation',
  },

  // ── MODULE 10: DATA INTERPRETATION ───────────────────────────────────────────
  {
    id: 'data-interpretation',
    slug: 'data-interpretation',
    title: 'Data Interpretation',
    description: 'Tables, pie charts, bar graphs, and mixed DI — with time management strategy.',
    category: 'Aptitude',
    order: 10,
    difficulty: 'intermediate',
    estimatedTime: 40,
    content: `## What is Data Interpretation?

DI questions give you a chart, table, or graph and ask you to answer 4-6 questions from it. The math is usually simple — the skill is reading data quickly and accurately.

**DI appears in:** TCS, Infosys, Wipro, Cognizant, Accenture, banking exams, CAT.

---

## Types of DI

**1. Tables:** Most common. Read rows and columns carefully. Units matter.

**2. Bar Charts:** Compare values at a glance. Percentage change problems common.

**3. Pie Charts:** Show percentage breakdown. Central angle = (Value/Total) × 360°.

**4. Line Graphs:** Show trends over time. Rate of change = slope.

**5. Mixed DI:** Two charts together — table+bar or pie+line. Most challenging.

---

## Strategy for DI Under Time Pressure

**Step 1 — Scan before solving:** Read the title, axes labels, units, and footnotes. Know what the data represents before solving a single question.

**Step 2 — Note the scale:** Is it in thousands? Crores? Per year? Wrong units = wrong answers.

**Step 3 — Read questions FIRST:** Know what you need before digging into data. Each question targets specific rows/columns.

**Step 4 — Approximate aggressively:** For MCQ, you rarely need exact answers. Round to nearest 5 or 10.

**Step 5 — Skip, don't get stuck:** If a calculation is messy, move on and return.

---

## Common Question Types

**Percentage change:** (New − Old)/Old × 100
**Ratio between two values:** Read, divide, simplify.
**Total across categories:** Add the relevant row/column.
**Average:** Sum/Count (from the data).
**Difference:** Subtract the two values.

---

## Pie Chart Formulas

Value of a sector = (Angle/360) × Total or (Percentage/100) × Total
Central angle = (Value/Total) × 360

---

## Approximation Tricks

For quick DI calculations:
- 33.3% ≈ 1/3
- 66.7% ≈ 2/3
- 37.5% = 3/8
- 62.5% = 5/8

If options are spread far apart, approximate aggressively.
If options are close, calculate more precisely.`,
    codeExamples: [
      {
        title: 'Bar Chart Reading — Worked Example',
        code: `Data: Sales of a company (in ₹ lakhs):
2020: 120, 2021: 150, 2022: 180, 2023: 144, 2024: 216

Q1: Percentage change from 2021 to 2022?
= (180-150)/150 × 100 = 30/150 × 100 = 20% increase

Q2: Average sales from 2020-2024?
= (120+150+180+144+216)/5 = 810/5 = ₹162 lakhs

Q3: In which year was growth rate highest?
2020-21: (150-120)/120 = 25%
2021-22: (180-150)/150 = 20%
2022-23: (144-180)/180 = -20% (decline)
2023-24: (216-144)/144 = 50%
Highest growth: 2023-24 at 50%.`,
        explanation: 'Scan all values first. Then answer each question from the organized data.',
      },
      {
        title: 'Pie Chart Problem',
        code: `A company spends ₹72,000 annually.
Sectors: Salaries 40%, Rent 20%, Marketing 15%, R&D 15%, Other 10%

Q: What is spent on Salaries and R&D combined?
= (40+15)% of 72000 = 55% of 72000 = ₹39,600

Q: Marketing budget exceeds Other budget by how much?
Marketing = 15% of 72000 = ₹10,800
Other = 10% of 72000 = ₹7,200
Difference = ₹3,600

Q: Central angle for Rent sector?
= 20/100 × 360 = 72°`,
        explanation: 'In pie charts, always verify percentages add to 100%. Then apply: Value = (%)×Total/100.',
      },
    ],
    commonMistakes: [
      'Misreading units — always check if data is in lakhs, crores, thousands.',
      'Percentage change: using wrong base (must use OLD value, not new).',
      'Reading bar heights incorrectly — align with Y-axis carefully.',
      'In mixed DI, confusing which chart each question refers to.',
    ],
    interviewQuestions: [
      {
        question: 'What is the fastest way to estimate percentage in a pie chart?',
        answer: 'Each 1% = 3.6°. A quarter of the pie = 90° = 25%. Half = 180° = 50%. Use these landmarks to estimate quickly. For example, a 72° slice = 20%.',
        difficulty: 'beginner',
      },
    ],
    exercises: [
      {
        id: 'di-ex-1',
        title: 'DI Practice',
        description: 'A store sold 200,250,300,275,325 units in Jan-May. Find: (a) Average monthly sales. (b) % increase from Jan to May.',
        starterCode: `// (a) Average = (200+250+300+275+325)/5 = 1350/5 = 270 units
// (b) % increase = (325-200)/200 × 100 = 125/200 × 100 = 62.5%`,
        solution: `Average = 270 units. % increase Jan-May = 62.5%.`,
        hints: ['Sum/count for average. (New-Old)/Old×100 for percentage change.'],
        expectedOutput: 'Average: 270, Increase: 62.5%',
      },
    ],
    keyTakeaways: [
      'Scan title, labels, units BEFORE answering any question.',
      'Read questions first — find only the data you need.',
      'Approximate when answer choices are spread far apart.',
      'Pie chart: Central angle = (value/total) × 360°.',
      'Bar chart growth: always use old value as the base.',
    ],
    prevLesson: 'probability',
    nextLesson: 'logical-thinking',
  },

  // ════════════════════════════════════════════════════════════════════════════
  // SECTION 2 — LOGICAL REASONING
  // ════════════════════════════════════════════════════════════════════════════
  {
    id: 'logical-thinking',
    slug: 'logical-thinking',
    title: 'Logical Thinking',
    description: 'Patterns, observations, elimination, deduction — the mental toolkit for all reasoning questions.',
    category: 'Logical Reasoning',
    order: 11,
    difficulty: 'beginner',
    estimatedTime: 30,
    content: `## What is Logical Thinking?

Logical thinking is the ability to analyze a situation, recognize patterns, eliminate wrong options, and arrive at the correct conclusion systematically — without guessing.

Every reasoning question, no matter how complex, can be solved if you have a structured approach.

---

## The Four Core Skills

### 1. Pattern Recognition
Identify what repeats, what changes, and what the underlying rule is.
Used in: series, matrices, analogy questions.

### 2. Systematic Elimination
Remove options that are clearly wrong. Even eliminating one wrong option raises your probability from 25% to 33%.
Used in: all MCQ reasoning questions.

### 3. Deductive Reasoning
Move from general rules to specific conclusions.
"All dogs are mammals. Fluffy is a dog. Therefore Fluffy is a mammal."
Used in: syllogism, blood relations.

### 4. Inductive Reasoning
Find the general rule from specific examples.
"1, 4, 9, 16 → squares of 1,2,3,4 → next is 25."
Used in: number series, analogy.

---

## The Elimination Strategy

When you cannot solve a question directly:

1. Read all options first.
2. Eliminate options that violate any obvious rule.
3. Check the remaining options against the question.
4. Choose the one that fits all conditions.

This strategy alone can solve 40% of reasoning questions you cannot directly compute.

---

## Common Reasoning Traps

**Trap 1 — Absolute language:** "All," "None," "Always," "Never" are strong claims. They are often wrong conclusions.

**Trap 2 — Outside information:** Do not bring real-world knowledge into syllogism or assumption questions. Use only what is stated.

**Trap 3 — Close but not exact:** Wrong options are designed to be almost right. Read every word precisely.

**Trap 4 — First instinct on complex arrangements:** For seating/puzzle questions, always draw it out. Never solve in your head.

---

## Building Speed

- Do 10 reasoning questions every day.
- Time yourself: 1.5 minutes per question is the target for campus placements.
- Review wrong answers — understand WHY they were wrong, not just what the answer was.
- Identify your weakest sub-topic (usually seating or syllogism) and practice that specifically.`,
    codeExamples: [
      {
        title: 'Pattern Recognition in Practice',
        code: `Q: Find the missing: 2, 3, 5, 8, 13, 21, ?

Step 1: Look at differences: 1, 2, 3, 5, 8 — these are Fibonacci!
Step 2: Each term = sum of previous two terms.
2+3=5, 3+5=8, 5+8=13, 8+13=21, 13+21=34
Answer: 34

Q: Find odd one out: 41, 43, 47, 51, 53
Step 1: Check each for primality.
41 ✓ prime, 43 ✓ prime, 47 ✓ prime,
51 = 3 × 17 ✗ NOT prime, 53 ✓ prime
Answer: 51 (only composite number)`,
        explanation: 'Always look for differences, ratios, squares, cubes, or prime patterns first.',
      },
      {
        title: 'Deductive Reasoning',
        code: `Q: Some A are B. All B are C. Conclusions:
   (i) Some A are C.  (ii) All A are C.

Draw Venn diagram:
- A and B overlap partially (Some A are B)
- B is completely inside C (All B are C)

So the part of A that overlaps with B must also be in C.
→ Some A are definitely C → Conclusion (i) is TRUE.
→ Not all A need to be B, so not all A are C → (ii) is FALSE.

Answer: Only conclusion (i) follows.`,
        explanation: 'For syllogisms, ALWAYS draw Venn diagrams. Never solve by intuition.',
      },
    ],
    commonMistakes: [
      'Using real-world knowledge in syllogism — only use the given statements.',
      'Solving complex arrangements in head — always draw on paper/screen.',
      'Rushing through options — read every word in each option carefully.',
      'Giving up too early — elimination strategy can solve even unfamiliar question types.',
    ],
    interviewQuestions: [
      {
        question: 'How do you approach a reasoning question you have never seen before?',
        answer: '1. Read the question fully without rushing. 2. Identify the type (series, arrangement, analogy). 3. Apply systematic elimination to cut wrong options. 4. Use the remaining options to guide your search for the pattern. 5. Verify your answer against the question.',
        difficulty: 'beginner',
      },
    ],
    exercises: [
      {
        id: 'lt-ex-1',
        title: 'Odd One Out',
        description: 'Find the odd one out: 36, 49, 64, 81, 100, 112.',
        starterCode: `// 36=6², 49=7², 64=8², 81=9², 100=10², 112=?
// 112 is NOT a perfect square → Answer: 112`,
        solution: `112 is not a perfect square. All others are: 6²,7²,8²,9²,10².`,
        hints: ['Check if each number is a perfect square'],
        expectedOutput: '112',
      },
    ],
    keyTakeaways: [
      'Pattern recognition, elimination, deduction, induction — four core skills.',
      'Elimination alone solves 40% of questions you cannot directly compute.',
      'Never use real-world knowledge in logic questions — use only stated facts.',
      'Always draw arrangements — never solve seating/puzzle in your head.',
      '10 reasoning questions per day builds sufficient exam speed.',
    ],
    prevLesson: 'data-interpretation',
    nextLesson: 'series',
  },
  {
    id: 'series',
    slug: 'series',
    title: 'Series',
    description: 'Number series, alphabet series, mixed series — patterns and shortcuts for placement tests.',
    category: 'Logical Reasoning',
    order: 12,
    difficulty: 'beginner',
    estimatedTime: 35,
    content: `## Number Series

A number series follows a hidden rule. Your job is to find the rule and apply it.

### Common Patterns

**Arithmetic Series:** Constant difference.
2, 5, 8, 11, 14 → difference = 3. Next: 17.

**Geometric Series:** Constant ratio.
3, 6, 12, 24, 48 → ratio = 2. Next: 96.

**Squares:** 1, 4, 9, 16, 25, 36... (n²)

**Cubes:** 1, 8, 27, 64, 125... (n³)

**Fibonacci:** Each term = sum of previous two.
1, 1, 2, 3, 5, 8, 13, 21, 34...

**Two-step difference (2nd order):** Differences themselves form a series.
1, 2, 4, 7, 11, 16... → 1st differences: 1,2,3,4,5 → arithmetic.

**Alternating series:** Two interleaved series.
2, 3, 4, 6, 6, 12, 8, 24... → even positions: 3,6,12,24 (×2) | odd: 2,4,6,8 (+2).

---

## Alphabet Series

**Alphabetical positions:** A=1, B=2, C=3... Z=26.
**Reverse positions:** A=26, B=25... Z=1.

**Tricks:**
- Opposite of A is Z (1+26=27). Opposite of D is W (4+23=27).
- Midpoint: M=13, N=14. M is 13th from start, 13th from end.

**Common pattern:** Skip every alternate letter, or shift by fixed number.
A, C, E, G → skip 1 each time (vowels in sequence).
Z, W, T, Q → skip 2 backward each time (−3 each step).

---

## Mixed Series (Number + Letter)

Z1, Y2, X3, W4, V5 → Z=26 decreasing, numbers increasing.
A2, C4, E6, G8 → alternating consonant vowel... no: odd letters (A,C,E,G) + even numbers (2,4,6,8).

---

## Wrong Number in Series

Find the term that breaks the pattern.
10, 14, 19, 25, 32, 40, 49, 59
Differences: 4, 5, 6, 7, 8, 9, 10 → all correct. No wrong term here.

1, 2, 4, 8, 16, 36, 64 → Geometric ratio = 2. 16×2=32, not 36. **Wrong term: 36.**`,
    codeExamples: [
      {
        title: 'Finding the Pattern Systematically',
        code: `Series: 5, 6, 9, 15, 26, 45, ?

Step 1 — Check differences:
6-5=1, 9-6=3, 15-9=6, 26-15=11, 45-26=19

Step 2 — Check 2nd differences:
3-1=2, 6-3=3, 11-6=5, 19-11=8

Step 3 — 2nd differences: 2,3,5,8 = Fibonacci sequence!
Next 2nd difference = 5+8=13.
Next 1st difference = 19+13=32.
Next term = 45+32 = 77.

Answer: 77`,
        explanation: 'When 1st differences fail to show a pattern, compute 2nd differences. Keep going until you find the pattern.',
      },
      {
        title: 'Alphabet Series Logic',
        code: `Series: AZ, BY, CX, DW, ?

Pattern:
A(1) Z(26) | B(2) Y(25) | C(3) X(24) | D(4) W(23)
1st letter: +1 each time (A,B,C,D,E)
2nd letter: -1 each time (Z,Y,X,W,V)

Next pair: E(5), V(22) → Answer: EV

---

Series: B2E, D4G, F6I, H8K, ?

Pattern:
B→D→F→H→J (+2 letters, skip one)
2→4→6→8→10 (+2 numbers)
E→G→I→K→M (+2 letters, skip one)

Answer: J10M`,
        explanation: 'For mixed series, decode each component (letters, numbers) separately, then combine.',
      },
    ],
    commonMistakes: [
      'Checking only 1st differences when the pattern is in 2nd or 3rd differences.',
      'Not checking for alternating series — even/odd position terms may be independent.',
      'In alphabet series, forgetting Z=26 and confusing forward/backward positions.',
    ],
    interviewQuestions: [
      {
        question: 'Find the wrong number: 3, 7, 15, 27, 63, 127, 255.',
        answer: 'Pattern: each term = 2×previous + 1. 3→7✓, 7→15✓, 15→31≠27. Wrong number: 27 (should be 31).',
        difficulty: 'intermediate',
      },
      {
        question: 'Find next term: 2, 5, 10, 17, 26, 37, ?',
        answer: 'Differences: 3,5,7,9,11 — odd numbers increasing by 2. Next difference = 13. Answer = 37+13 = 50.',
        difficulty: 'beginner',
      },
    ],
    exercises: [
      {
        id: 'ser-ex-1',
        title: 'Complete the Series',
        description: 'Find the next term: 1, 4, 9, 16, 25, 36, ?',
        starterCode: `// Perfect squares: 1²,2²,3²,4²,5²,6²,7²
// Next = 7² = 49`,
        solution: `49 (7² = 49)`,
        hints: ['Check if terms are perfect squares'],
        expectedOutput: '49',
      },
    ],
    keyTakeaways: [
      'Always check: arithmetic → geometric → squares/cubes → Fibonacci → 2nd differences.',
      'Alternating series: odd-position and even-position terms may follow different rules.',
      'For wrong-number questions: find where the established pattern breaks.',
      'Alphabet series: A=1 to Z=26. Opposite pairs: A-Z, B-Y, C-X... sum = 27.',
    ],
    prevLesson: 'logical-thinking',
    nextLesson: 'coding-decoding',
  },
  {
    id: 'coding-decoding',
    slug: 'coding-decoding',
    title: 'Coding-Decoding',
    description: 'Letter coding, number coding, and pattern recognition — decode the rule, crack the question.',
    category: 'Logical Reasoning',
    order: 13,
    difficulty: 'beginner',
    estimatedTime: 30,
    content: `## What is Coding-Decoding?

Coding-Decoding questions give you a word and its code. You must find the rule, then apply it to a new word.

The golden rule: **Find the rule first. Apply it second. Never guess.**

---

## Type 1 — Letter Coding (Shift-Based)

Each letter is shifted by a fixed number in the alphabet.

**Example:** If CAT = FDW, then MANGO = ?
C→F (+3), A→D (+3), T→W (+3). Rule: +3 shift.
M→P, A→D, N→Q, G→J, O→R → **PDQJR**

**Reverse shift:** If COLD = FROG? C→F(+3), O→R(+3), L→O(+3), D→G(+3). Yes, +3.

**Opposite coding:** Each letter replaced by opposite: A↔Z, B↔Y, C↔X...
So A→Z, B→Y... Opposite of T = G (T=20, 27-20=7=G).

---

## Type 2 — Number Coding

Letters assigned numbers by position or reverse position.
- Forward: A=1, B=2... Z=26
- Reverse: A=26, B=25... Z=1

**Example:** If DEAR = 4-5-1-18 (forward positions), then FEAR = ?
F=6, E=5, A=1, R=18 → **6-5-1-18**

---

## Type 3 — Mixed/Symbol Coding

Words coded with symbols or numbers in given examples.
Approach: Decode by comparing two coded sentences that share a word.

**Example:**
"sky is blue" → $#@
"blue is beautiful" → @#*
"sky is beautiful" → $#*

From both: "is" appears in all three → # is the code for "is".
"sky" appears in 1st and 3rd → $ is sky.
"blue" appears in 1st and 2nd → @ is blue.
"beautiful" appears in 2nd and 3rd → * is beautiful.

---

## Type 4 — Rearrangement Coding

Letters within a word are rearranged by a specific rule.

**Example:** If MASTER → STREAM, what is PILLAR → ?
MASTER rearranged to STREAM: positions 6,5,4,1,2,3 → reverse + swap?
Check: M(1)A(2)S(3)T(4)E(5)R(6) → S(3)T(4)R(6)E(5)A(2)M(1)
Position order: 3,4,6,5,2,1. Apply to PILLAR:
P(1)I(2)L(3)L(4)A(5)R(6) → L(3)L(4)R(6)A(5)I(2)P(1) = **LLRAIP**`,
    codeExamples: [
      {
        title: 'Decoding the Rule Systematically',
        code: `Q: If FRIEND = HUMJTK, then CANDLE = ?

Step 1: Compare letter by letter.
F→H (+2), R→U (+3), I→M (+4), E→J (+5), N→T (+6), D→K (+7)

Step 2: The shift INCREASES by 1 each time!
Starting shift = 2, incrementing by 1.

Step 3: Apply to CANDLE (shifts: +2,+3,+4,+5,+6,+7):
C+2=E, A+3=D, N+4=R, D+5=I, L+6=R, E+7=L

Answer: EDRI RL → EDRIRL`,
        explanation: 'Always check if shifts are constant OR increasing/decreasing. Increasing shifts are a common trick.',
      },
      {
        title: 'Sentence Coding',
        code: `"good morning everyone" = 15 8 12
"morning is good" = 8 6 15
"everyone is here" = 12 6 20

Find code for "here":

Step 1: "morning" in sentence 1 and 2 → code 8 is "morning".
Step 2: "good" in sentence 1 and 2 → code 15 is "good".
Step 3: In sentence 1: 12 must be "everyone".
Step 4: In sentence 2: 6 must be "is".
Step 5: In sentence 3: 12=everyone, 6=is, so 20 = "here".

Answer: Code for "here" = 20`,
        explanation: 'Find words that appear in exactly two sentences. The shared code is that word\'s code.',
      },
    ],
    commonMistakes: [
      'Assuming a constant shift without verifying it for all letters.',
      'In sentence coding, not comparing sentences systematically — overlapping words reveal codes.',
      'Confusing forward position (A=1) with reverse position (A=26).',
    ],
    interviewQuestions: [
      {
        question: 'If PENCIL = RGPEKN, what is the code for ERASER?',
        answer: 'P→R(+2), E→G(+2), N→P(+2), C→E(+2), I→K(+2), L→N(+2). Rule: +2 shift. E+2=G, R+2=T, A+2=C, S+2=U, E+2=G, R+2=T. Answer: GTCUGT.',
        difficulty: 'beginner',
      },
    ],
    exercises: [
      {
        id: 'cd-ex-1',
        title: 'Find the Code',
        description: 'If GATE = 7-1-20-5, what is the code for EXAM?',
        starterCode: `// G=7(forward position), A=1, T=20, E=5. Rule: forward A=1..Z=26.
// E=5, X=24, A=1, M=13 → 5-24-1-13`,
        solution: `E=5, X=24, A=1, M=13 → Code: 5-24-1-13`,
        hints: ['A=1, B=2... Z=26 (forward position coding)'],
        expectedOutput: '5-24-1-13',
      },
    ],
    keyTakeaways: [
      'Find the rule before applying — never guess the code.',
      'Check constant shift, increasing shift, reverse alphabet, position coding.',
      'Sentence coding: compare sentences sharing words to decode each word.',
      'Rearrangement: write both original and coded word with positions, find the mapping.',
    ],
    prevLesson: 'series',
    nextLesson: 'blood-relations',
  },
  {
    id: 'blood-relations',
    slug: 'blood-relations',
    title: 'Blood Relations',
    description: 'Family tree logic, relationships, and shortcuts to decode complex kinship questions.',
    category: 'Logical Reasoning',
    order: 14,
    difficulty: 'beginner',
    estimatedTime: 30,
    content: `## How to Approach Blood Relations

Blood relation questions describe a chain of family relationships. You must determine how two people in the chain are related.

**The golden rule: Always draw the family tree. Never try to solve in your head.**

---

## Standard Family Tree Symbols

Use these while drawing:
- Male: Box or (M) label
- Female: Circle or (F) label
- Married couple: = sign between them
- Parent-child: vertical line downward
- Siblings: connected through parent line

---

## Key Relationships to Know

| Relationship | Meaning |
|---|---|
| Father's father | Grandfather (paternal) |
| Mother's father | Grandfather (maternal) |
| Father's brother | Uncle (paternal) |
| Mother's brother | Maternal uncle (mama) |
| Father's sister | Aunt (paternal — bua) |
| Mother's sister | Aunt (maternal — mausi) |
| Brother's son | Nephew |
| Sister's daughter | Niece |
| Spouse's father | Father-in-law |
| Spouse's brother | Brother-in-law |

---

## Gender Clues in Questions

Watch for gender-revealing words:
- Son, Father, Brother, Uncle, Husband, Grandfather → Male
- Daughter, Mother, Sister, Aunt, Wife, Grandmother → Female

When gender is not specified: the answer may have options "cannot be determined."

---

## Coded Relations Type

"A is the son of B's father's wife" → B's father's wife = B's mother. A is the son of B's mother → A is B's brother.

**Shortcut for coded relation chain:**
Go step by step. Resolve each link independently.

---

## Pointing/Introduction Type

"Pointing to a woman, Ram says 'Her mother is the only daughter of my mother.'"
- My mother's only daughter = Ram's sister.
- The woman's mother is Ram's sister.
- Therefore the woman is Ram's niece.`,
    codeExamples: [
      {
        title: 'Drawing the Family Tree',
        code: `Q: A is B's sister. B is C's brother. C is D's daughter.
   How is A related to D?

Step 1: C is D's daughter → D is C's parent (gender of D unknown yet).
Step 2: B is C's brother → B and C have same parent(s). D is parent of both.
Step 3: A is B's sister → A and B are siblings → A is also child of D.
Step 4: A is D's child. But what gender?
        A is B's sister → A is female → A is D's daughter.

Answer: A is D's daughter.

---
Tree:
      D (parent)
    / |  \\
   A  B   C
  (F)(M) (F/M)`,
        explanation: 'Draw the tree top-down. Parents at top, children below. Add gender when clues give it.',
      },
      {
        title: 'Coded Relation — Step by Step',
        code: `Q: "Pointing to Kavya, Akash says, 'She is the daughter of my
   grandfather's only son.'"

Step 1: Akash's grandfather's only son.
  → If grandfather has only one son, that son is Akash's father.
Step 2: Kavya is the daughter of Akash's father.
Step 3: Akash's father's daughter = Akash's sister.

Answer: Kavya is Akash's sister.

Trap: If grandfather had multiple sons, we'd say "could be aunt or..."
"Only son" removes ambiguity → must be Akash's father.`,
        explanation: 'Resolve each descriptor one at a time. "Only son" and "only daughter" are key words that eliminate ambiguity.',
      },
    ],
    commonMistakes: [
      'Not drawing the family tree — mental solutions lead to errors in 3+ step chains.',
      'Missing gender clues and assuming wrong gender for key people.',
      '"Cannot be determined" is a valid answer when gender is genuinely ambiguous.',
      'Confusing maternal and paternal sides — always specify which side in your drawing.',
    ],
    interviewQuestions: [
      {
        question: 'A woman says, "The man in the photo is the only son of my mother\'s mother." How is she related to the man?',
        answer: 'Her mother\'s mother = her grandmother. Grandmother\'s only son = her maternal uncle. She is the man\'s niece.',
        difficulty: 'beginner',
      },
      {
        question: 'Ravi\'s father is Prabhu\'s son. Mohan is Prabhu\'s father. How is Mohan related to Ravi?',
        answer: 'Mohan is Prabhu\'s father. Prabhu\'s son is Ravi\'s father. So Prabhu is Ravi\'s grandfather. Mohan is Prabhu\'s father → Mohan is Ravi\'s great-grandfather.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'br-ex-1',
        title: 'Relationship Chain',
        description: 'X is Y\'s brother. Y is Z\'s sister. Z is W\'s father. How is X related to W?',
        starterCode: `// Z is W's father → Z is male, W is Z's child.
// Y is Z's sister → Y and Z share parents.
// X is Y's brother → X, Y, Z are siblings.
// X is Z's brother → X is W's uncle (paternal).`,
        solution: `X is W's uncle (paternal uncle).`,
        hints: ['Draw tree: common parents of X,Y,Z. W is Z\'s child.'],
        expectedOutput: 'Uncle',
      },
    ],
    keyTakeaways: [
      'Always draw the family tree — never solve blood relation chains mentally.',
      'Gender clues: son/father/brother/husband = male; daughter/mother/sister/wife = female.',
      'Coded relations: resolve each link one at a time from left to right.',
      '"Cannot be determined" when gender is genuinely ambiguous.',
    ],
    prevLesson: 'coding-decoding',
    nextLesson: 'direction-sense',
  },
  {
    id: 'direction-sense',
    slug: 'direction-sense',
    title: 'Direction Sense',
    description: 'Left-right turns, clockwise, anti-clockwise, shadow-based directions, and distance problems.',
    category: 'Logical Reasoning',
    order: 15,
    difficulty: 'beginner',
    estimatedTime: 25,
    content: `## Direction Compass

The four main directions and their arrangement:

\`\`\`
        North
          ↑
West ← ──── → East
          ↓
        South
\`\`\`

Diagonals: NE (North-East), NW, SE, SW.

---

## Turning Rules

When facing a direction and you turn:
- **Right (clockwise):** N→E, E→S, S→W, W→N
- **Left (anti-clockwise):** N→W, W→S, S→E, E→N
- **180° (about-turn):** N→S, E→W, S→N, W→E

**Memory trick:** Clock rotates clockwise. Right turn = clockwise. Stand and physically turn — your body knows this.

---

## Shadow Direction

Shadow is always OPPOSITE to the sun's direction.

| Time | Sun position | Shadow direction |
|------|-------------|-----------------|
| Morning (before noon) | East | West |
| Evening (after noon) | West | East |
| Noon | Overhead | No/minimal shadow |

**Shadow questions:** "A man faces North at 7 AM. Where does his shadow fall?"
Sun is in East → shadow falls West. He faces North, shadow is behind him to the West.

---

## Distance (Displacement) Problems

After a series of moves, find the shortest distance between start and end point.

**Method:** Draw moves on a grid. Use Pythagoras if the path forms a right angle.
Distance = √(horizontal² + vertical²)

**Example:** Walk 3 km North, 4 km East.
Horizontal = 4, Vertical = 3. Distance = √(9+16) = √25 = 5 km.

---

## Strategy

1. Always draw the path on paper. Mark start point.
2. Write N/S/E/W for each move.
3. For distance, track total East-West and North-South movement separately.
4. Apply Pythagoras for straight-line distance.`,
    codeExamples: [
      {
        title: 'Direction Chain',
        code: `Q: Starting from home, Ravi goes 6km North, then 4km East,
   then 6km South. How far is he from home and in which direction?

Draw it:
Start(H) → 6km North → A
A → 4km East → B
B → 6km South → C (end point)

North/South cancel: 6N - 6S = 0 (back to same latitude as home)
East: +4km
He is 4km East of his starting point.

Distance from home = 4 km, Direction = East.`,
        explanation: 'Track N/S separately and E/W separately. Opposing movements cancel each other.',
      },
      {
        title: 'Turn-Based Direction',
        code: `Q: Facing East. Turn left, go 5km. Turn right, go 3km.
   Turn right, go 5km. Facing which direction now?

Start: Facing East
Turn left (from East) → Now facing North. Go 5km North.
Turn right (from North) → Now facing East. Go 3km East.
Turn right (from East) → Now facing South. Go 5km South.

Final direction: South.

Position: Started at (0,0)
After 5N: (0,5)
After 3E: (3,5)
After 5S: (3,0)
Displacement from origin: 3km East.`,
        explanation: 'Track both direction (for turns) and position (for distance) simultaneously.',
      },
    ],
    commonMistakes: [
      'Confusing left/right relative to the CURRENT direction — not the map\'s left/right.',
      'Forgetting shadow is opposite to sun direction.',
      'Using N/S or E/W distance as final answer instead of √(h²+v²) when diagonal.',
    ],
    interviewQuestions: [
      {
        question: 'A person walks 10m North, turns right, walks 10m, turns right, walks 10m. How far from start and in which direction?',
        answer: 'North 10, East 10, South 10. Final position: 10m East of start. Distance = 10m, Direction = East.',
        difficulty: 'beginner',
      },
    ],
    exercises: [
      {
        id: 'dir-ex-1',
        title: 'Shortest Distance',
        description: 'From start, go 8km North, 6km East, 8km South. Distance from start?',
        starterCode: `// N and S cancel (8N - 8S = 0). Only 6km East remains.
// Distance = 6km, Direction = East.`,
        solution: `6 km East.`,
        hints: ['N/S cancel out, only E/W displacement remains'],
        expectedOutput: '6 km',
      },
    ],
    keyTakeaways: [
      'Right turn = clockwise: N→E→S→W. Left = anti-clockwise: N→W→S→E.',
      'Shadow: morning sun in East → shadow goes West. Evening: sun West → shadow East.',
      'Track N/S and E/W totals separately. Pythagoras gives final distance.',
      'ALWAYS draw the path — never solve direction chains mentally.',
    ],
    prevLesson: 'blood-relations',
    nextLesson: 'seating-arrangement',
  },
  {
    id: 'seating-arrangement',
    slug: 'seating-arrangement',
    title: 'Seating Arrangement',
    description: 'Linear, circular, and rectangular arrangements — the most important topic in campus placements.',
    category: 'Logical Reasoning',
    order: 16,
    difficulty: 'intermediate',
    estimatedTime: 45,
    content: `## Why Seating Arrangement Matters

Seating arrangement is the most common reasoning topic in campus placements at TCS, Infosys, Wipro, Cognizant, and almost every large company. Sets of 4-5 questions are built from one arrangement. Solve the arrangement once → answer all 5 questions quickly.

---

## Linear Arrangement

People sit in a row. "Left" and "Right" can be confusing — always clarify:
- "Immediate right/left" = adjacent seat.
- "Second to the right" = two seats away.
- Facing north vs south changes left/right perception.

**Convention (unless stated otherwise):**
Assume people face you (the reader). Your right = their left.

**Approach:**
1. Draw blank seats: _ _ _ _ _
2. Place the most constrained person first (most conditions about them).
3. Work outward from fixed positions.
4. Use negative clues ("A is not adjacent to B") at the end.

---

## Circular Arrangement

People sit around a round table. Key rules:
- "Immediate right" = next seat in clockwise direction.
- "Immediate left" = next seat in anti-clockwise direction.
- Facing inward (default) vs facing outward changes left/right.

**Approach:**
1. Draw a circle with N seats.
2. Fix one person at any seat (reduces degrees of freedom).
3. Place the next most constrained person.
4. Fill remaining using given clues.

---

## Rectangular Arrangement

People sit around a rectangle: people on the longer sides face inward.
Corners are shared between two sides.
Left/Right must account for which side of the table each person is on.

---

## Solving Strategy (Any Arrangement)

**Step 1:** Count people and seats. Draw the layout.
**Step 2:** Collect all clues, categorize as:
  - Direct placement: "A sits at position 3."
  - Relative placement: "B sits 2 to the right of A."
  - Negative clue: "C does not sit next to D."
**Step 3:** Start with direct placements.
**Step 4:** Apply relative clues. If ambiguous (two valid positions), use a branch — hold both and check with more clues.
**Step 5:** Apply negative clues to eliminate branches.
**Step 6:** Answer all questions from the finalized arrangement.

---

## Common Tricks

- "Sits opposite" in a 6-person circle = 3 seats away.
- "Sits between A and B" means A-X-B or B-X-A.
- "Facing outside" reverses left and right perception.
- When stuck: check if any clue forces two people together — use as a unit.`,
    codeExamples: [
      {
        title: 'Linear Arrangement — Full Solve',
        code: `6 people: A, B, C, D, E, F sit in a row.
Clues:
1. A sits at an extreme end.
2. B sits to the immediate right of C.
3. D is between E and F.
4. F is second from the left.
5. C is not adjacent to A.

Seats: [1] [2] [3] [4] [5] [6]

From clue 4: F is at position 2.
From clue 3: D is between E and F. F=2, so D=1 or 3 and E on the other side.
  If D=1: E must be on other side of D → E=3.
  If D=3: E=4, and F(2) is on D's side.

From clue 1: A is at position 1 or 6.
From clue 3 (D=1 case): D=1, but A must be extreme. Conflict if D=1. So D=3, E=4.

Layout so far: [?][F][D][E][?][?] → positions 1,5,6 for A,B,C.
From clue 1: A=1 or A=6.
From clue 2: B is immediately right of C → C,B adjacent.
From clue 5: C not adjacent to A.
  If A=1: C cannot be at 2. C is at 5 or 6. B=C+1. C=5,B=6.
  Layout: [A][F][D][E][C][B] ✓ Check clue 5: C(pos5) not adjacent to A(pos1) ✓

Final: A-F-D-E-C-B`,
        explanation: 'Start with the most certain clue (exact position). Build outward. Save negative clues for last.',
      },
      {
        title: 'Circular Arrangement',
        code: `5 people: P,Q,R,S,T sit around a circle, facing center.
Clues:
1. P sits to the immediate right of Q.
2. R sits opposite to S. (5 people: no exact opposite — skip.)
   [For 6 people: opposite = 3 seats away]
   [Reinterpret: R is 2 seats to the right of S]
3. T sits between Q and S.

Fix Q at top (12 o'clock position).
Clue 1: P is immediately right of Q → P is at the next clockwise seat.
  Seats (clockwise): Q, P, _, _, _
Clue 3: T is between Q and S.
  T must be between Q and S in the arrangement.

Going counterclockwise from Q: Q, _, _, _, P
T between Q and S (counterclockwise from Q):
  Seats: Q, P, R, S, T → T between S and Q ✓

Final (clockwise): Q, P, R, S, T`,
        explanation: 'Fix one person. Place others clockwise. "Between" means the person separates two others in the circle.',
      },
    ],
    commonMistakes: [
      'Not drawing the arrangement — trying to solve mentally for 6+ people always fails.',
      'Confusing clockwise and anti-clockwise for "right" and "left" in circular arrangement.',
      'Applying "opposite" for 5 or 7 people (odd number — no exact opposite seat exists).',
      'Forgetting to verify ALL clues after placing — one missed clue invalidates the solution.',
    ],
    interviewQuestions: [
      {
        question: 'In a circular arrangement of 6 people, A is 3rd to the right of B. How many seats is A to the left of B?',
        answer: '6 seats total in circle. 3 to the right = 6-3 = 3 to the left. A is also 3 seats to the left. (They are directly opposite.)',
        difficulty: 'beginner',
      },
      {
        question: 'What is the approach when a seating arrangement has contradictory clues?',
        answer: 'Re-read each clue carefully — one is likely misread. Check "left/right" vs "to the left of facing outward." If truly contradictory in a test, flag the question and move on. Spend max 3 minutes per arrangement set.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'sa-ex-1',
        title: 'Simple Linear Placement',
        description: '4 people A,B,C,D in a row. B is second from left. A is to the right of D. C is not at an end. Find the order.',
        starterCode: `// B is position 2.
// Positions: [_][B][_][_]
// C not at end: C is at position 2 or 3. Position 2 = B, so C = position 3.
// Remaining: A and D at positions 1 and 4. A is right of D → D=1, A=4.
// Order: D-B-C-A`,
        solution: `D - B - C - A`,
        hints: ['Place B first (exact position). Then C (not at ends). Then A/D (relative order).'],
        expectedOutput: 'D-B-C-A',
      },
    ],
    keyTakeaways: [
      'ALWAYS draw the arrangement — this is non-negotiable for 5+ people.',
      'Fix the most constrained person first. Build outward.',
      'Circular: immediate right = clockwise. Immediate left = anti-clockwise.',
      'Facing outside reverses left and right directions.',
      'Verify ALL clues after completing — one error invalidates everything.',
    ],
    prevLesson: 'direction-sense',
    nextLesson: 'puzzles',
  },
  {
    id: 'puzzles',
    slug: 'puzzles',
    title: 'Puzzles',
    description: 'Easy, medium, and placement-level puzzles — logical deduction and structured solving.',
    category: 'Logical Reasoning',
    order: 17,
    difficulty: 'intermediate',
    estimatedTime: 40,
    content: `## Types of Placement Puzzles

**1. Grid/Matrix Puzzles:** Match people to attributes (job, city, color).
**2. Scheduling Puzzles:** Who does what on which day?
**3. Comparison Puzzles:** Rank people by some attribute (height, salary).
**4. Logical Deduction Puzzles:** Find who is lying, what combination is true.

---

## Grid Puzzle — The Most Common Type

Given: 5 people, 5 jobs, 5 cities. Clues tell you some connections. Fill the grid.

**Method: Elimination Grid**
Draw a table: rows = people, columns = attributes.
Mark ✓ (yes) and ✗ (no) based on clues.
When a row has only one ✓ in a column, that's the answer.
When a column has only one row without ✗, mark it ✓.

---

## Comparison/Ranking Puzzles

"A is taller than B but shorter than C. D is shorter than B."
Build a chain: D < B < A < C.

**Approach:**
Write all comparisons. Chain them in order. Answer questions from the chain.

If a puzzle has "X is not the tallest or shortest" — place X in the middle range.

---

## Truth-Lie Puzzles

Classic type: some always tell truth, some always lie, some alternate.
**Method:** Assume one person is truth-teller, work out consequences. If contradiction → they are the liar. Repeat.

---

## Interview-Style Puzzles (Tech Companies)

These test lateral thinking, not formula application.

**Classic interview puzzles:**
- 8 balls, one heavier — find it in minimum weighings.
- 25 horses, 5 tracks — minimum races to find top 3.
- 100 floors, 2 eggs — find the critical floor with minimum drops.
- 3 ants on triangle — probability they collide.

For these: think aloud, show structured reasoning, not just the answer.`,
    codeExamples: [
      {
        title: 'Grid Puzzle — Full Solve',
        code: `3 people: Alice, Bob, Carol. 3 jobs: Engineer, Doctor, Teacher.
Clues:
1. Alice is not the Doctor.
2. Bob is not the Teacher.
3. Carol is the Engineer.

Grid approach:
           Eng  Doc  Tea
Alice:      ✗    ?    ?
Bob:        ?    ?    ✗
Carol:      ✓    ✗    ✗  (from clue 3)

Since Carol = Engineer → Alice and Bob cannot be Engineer:
           Eng  Doc  Tea
Alice:      ✗    ?    ?
Bob:        ✗    ?    ✗

Bob: not Engineer, not Teacher → Bob = Doctor.
Alice: not Doctor (clue 1), not Engineer → Alice = Teacher.

Final: Alice=Teacher, Bob=Doctor, Carol=Engineer.`,
        explanation: 'Build elimination grid. Each confirmed assignment eliminates options for others in same row and column.',
      },
      {
        title: 'Classic Interview Puzzle — 8 Balls',
        code: `Q: You have 8 balls. One is heavier. You have a balance scale.
   Find the heavy ball in minimum weighings.

Answer: 2 weighings are sufficient.

Weighing 1: Split into 3 groups: [1,2,3] [4,5,6] [7,8]
  Weigh Group 1 vs Group 2.

  Case A: Left heavier → heavy ball in [1,2,3].
  Case B: Right heavier → heavy ball in [4,5,6].
  Case C: Equal → heavy ball is 7 or 8.

Weighing 2 (Case A): Weigh ball 1 vs ball 2.
  If left heavy → ball 1 is heavy.
  If right heavy → ball 2 is heavy.
  If equal → ball 3 is heavy.

Total weighings: 2. ✓

Key insight: Each weighing gives 3 possible outcomes (L,R,=).
2 weighings = 3² = 9 outcomes → can identify 1 of 9 balls.
8 < 9, so 2 weighings are sufficient.`,
        explanation: 'For interview puzzles, explain your reasoning. Show you think in logarithms/information theory.',
      },
    ],
    commonMistakes: [
      'Not building the elimination grid for grid puzzles — trying to keep it all in memory.',
      'In ranking puzzles, assuming A>B and B>C means A is the absolute tallest — others may be taller than A.',
      'In interview puzzles, giving just the answer without the reasoning — interviewers want the thought process.',
    ],
    interviewQuestions: [
      {
        question: '25 horses, 5 tracks. No timer. Minimum races to find top 3 fastest horses?',
        answer: '7 races. Race 1-5: race 5 groups of 5 (5 races). Race 6: race 5 group winners → determines overall winner (1st place). Race 7: race 2nd and 3rd from the winner\'s group + 2nd-place horse\'s group winner + 2nd-place from race 6\'s 3rd horse group. The top 2 from Race 7 are 2nd and 3rd overall. Total = 7.',
        difficulty: 'advanced',
      },
    ],
    exercises: [
      {
        id: 'puz-ex-1',
        title: 'Ranking Puzzle',
        description: 'P is taller than Q. R is shorter than S. S is taller than P. Who is the tallest?',
        starterCode: `// Chain: Q < P (P taller than Q)
// R < S (R shorter than S)
// P < S (S taller than P)
// Combined: Q < P < S, R < S
// S is tallest.`,
        solution: `S is the tallest.`,
        hints: ['Build a chain from comparisons'],
        expectedOutput: 'S',
      },
    ],
    keyTakeaways: [
      'Grid puzzles: build elimination table, mark ✓ and ✗ systematically.',
      'Ranking puzzles: build a total order chain from comparisons.',
      'Interview puzzles: show your reasoning, not just the answer.',
      'For balance-scale puzzles: each weighing gives 3 outcomes → 2 weighings handle 9 balls.',
    ],
    prevLesson: 'seating-arrangement',
    nextLesson: 'syllogism',
  },
  {
    id: 'syllogism',
    slug: 'syllogism',
    title: 'Syllogism',
    description: 'Statements, conclusions, Venn diagrams, and shortcut methods — placement syllogism mastery.',
    category: 'Logical Reasoning',
    order: 18,
    difficulty: 'intermediate',
    estimatedTime: 35,
    content: `## What is Syllogism?

A syllogism gives you 2-3 statements and asks which conclusion(s) logically follow.

**Key rule:** Use only the given statements. Do not use real-world knowledge.

---

## Statement Types

| Statement | Type | Meaning |
|-----------|------|---------|
| All A are B | Universal Affirmative (A-type) | A is completely inside B |
| No A is B | Universal Negative (E-type) | A and B have no overlap |
| Some A are B | Particular Affirmative (I-type) | A and B partially overlap |
| Some A are not B | Particular Negative (O-type) | Part of A is outside B |

---

## Venn Diagram Method

Draw circles for each concept based on the statements.
Check each conclusion by seeing if it is true in ALL possible valid diagrams.

**A-type (All A are B):** Circle A is completely inside circle B.
**E-type (No A is B):** Circles A and B do not touch.
**I-type (Some A are B):** Circles A and B partially overlap.
**O-type (Some A are not B):** A extends outside B.

---

## Deduction Rules (Shortcut)

These rules work without drawing:

| Statement 1 | Statement 2 | Conclusion |
|-------------|-------------|-----------|
| All A→B | All B→C | All A→C |
| All A→B | No B→C | No A→C |
| All A→B | Some B→C | No definite conclusion about A→C |
| Some A→B | All B→C | Some A→C |
| Some A→B | No B→C | Some A are not C |
| Some A→B | Some B→C | No conclusion |

---

## Complementary Pair

When conclusions are: "Some A are B" and "No A is B" — at least one MUST be true. This is a complementary pair.

Answer: "Either conclusion I or II follows."

---

## Common Wrong Conclusions

- "All A are B" does NOT mean "All B are A."
- "Some A are B" DOES mean "Some B are A" (valid conversion for I-type).
- "No A is B" DOES mean "No B is A" (valid conversion for E-type).
- "All A are B" does NOT mean "Some B are not A" (uncertain).`,
    codeExamples: [
      {
        title: 'Classic Syllogism — Full Solve',
        code: `Statements:
1. All cats are dogs.
2. All dogs are animals.

Conclusions:
I. All cats are animals.
II. Some animals are cats.
III. All animals are dogs. (FALSE — don't verify, check by Venn)

Venn diagram:
Cats ⊂ Dogs ⊂ Animals (nested circles)

I. All cats are animals? YES — cats inside dogs inside animals ✓
II. Some animals are cats? YES — the cats part of animals exists ✓
III. All animals are dogs? NO — Animals circle is largest ✗

Answer: Conclusions I and II follow.`,
        explanation: 'Draw nested Venn circles. A conclusion is valid only if it holds in ALL possible valid diagrams.',
      },
      {
        title: 'Tricky Syllogism',
        code: `Statements:
1. Some books are pens.
2. No pen is a pencil.

Conclusions:
I. Some books are pencils.
II. Some books are not pencils.
III. No book is a pencil.

Venn: Books and Pens overlap (some). Pens and Pencils don't touch.
The overlap region (books that are also pens) cannot be pencils.

I. "Some books are pencils" — Can books that are NOT pens be pencils?
   Not stated — so this is not definitely true. ✗

II. "Some books are not pencils" — The books that ARE pens cannot be pencils.
    Since some books are pens, those are not pencils. → TRUE ✓

III. "No book is a pencil" — Books that are NOT pens could potentially be pencils
     (not stated they can't). → NOT definitely true ✗

Answer: Only conclusion II follows.`,
        explanation: 'For "Some A are B" + "No B are C": Some A (those that are B) are not C. But other As might be C.',
      },
    ],
    commonMistakes: [
      '"All A are B" → incorrectly concluding "All B are A." Conversion of A-type reverses to I-type only.',
      'Using real-world knowledge: "All pens are books" sounds false in reality but must be treated as given.',
      'Concluding "No conclusion" too quickly — check complementary pairs.',
      'Forgetting that "Some A are B" and "Some B are A" are both valid (I-type converts freely).',
    ],
    interviewQuestions: [
      {
        question: 'Statements: All mangoes are fruits. Some fruits are sweet. Conclusion: Some mangoes are sweet. Valid?',
        answer: 'Not necessarily valid. We know all mangoes are fruits. Some fruits are sweet — those could be mangoes or other fruits. Since "some fruits are sweet" may or may not include mangoes, conclusion does not definitely follow.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'syl-ex-1',
        title: 'Check Conclusions',
        description: 'All A are B. No B is C. Does "No A is C" follow?',
        starterCode: `// Rule: All A→B + No B→C → No A→C (valid deduction rule)
// Also verify by Venn: A inside B. B and C separate. So A is also separate from C.
// Conclusion: Yes, "No A is C" follows.`,
        solution: `Yes. All A are B, No B is C → No A is C (by deduction rule and Venn diagram).`,
        hints: ['Use deduction rule: All A→B + No B→C = No A→C'],
        expectedOutput: 'No A is C — follows',
      },
    ],
    keyTakeaways: [
      'Always use Venn diagrams — never solve syllogisms by intuition.',
      'A-type converts to I-type. E-type and I-type convert freely.',
      'All A→B + All B→C = All A→C. All A→B + No B→C = No A→C.',
      'Some+Some = No conclusion. Some A→B + No B→C = Some A are not C.',
      'Complementary pair (Some/No) → "Either I or II follows."',
    ],
    prevLesson: 'puzzles',
    nextLesson: 'critical-reasoning',
  },
  {
    id: 'critical-reasoning',
    slug: 'critical-reasoning',
    title: 'Critical Reasoning',
    description: 'Assumptions, conclusions, arguments, strengthening, and weakening — GMAT/CAT-style reasoning.',
    category: 'Logical Reasoning',
    order: 19,
    difficulty: 'intermediate',
    estimatedTime: 35,
    content: `## What is Critical Reasoning?

Critical reasoning tests your ability to analyze arguments — identify what is assumed, what logically follows, and what would strengthen or weaken the argument.

---

## Types of Questions

**1. Assumption:** What must be true for the argument to hold?
**2. Conclusion:** What logically follows from the argument?
**3. Strengthen:** What additional information makes the argument stronger?
**4. Weaken:** What additional information makes the argument less valid?
**5. Inference:** What can be inferred from the given information?

---

## Identifying Assumptions

An assumption is an unstated premise that the argument relies upon.

**Technique — Negate the assumption:** If negating a statement destroys the argument, it is an assumption.

Example:
Argument: "We should increase marketing budget to grow sales."
Hidden assumption: "More marketing leads to more sales." (Negate it: "More marketing does NOT lead to more sales" → argument falls apart. ✓ Assumption confirmed.)

---

## Strengthening an Argument

A strengthener:
- Provides evidence supporting the conclusion.
- Removes an objection to the argument.
- Confirms a key assumption.

---

## Weakening an Argument

A weakener:
- Provides counter-evidence.
- Shows an alternative explanation for the evidence.
- Challenges a key assumption.

---

## Drawing Conclusions

A valid conclusion:
- Must be directly supported by the given information.
- Cannot introduce new information.
- Cannot be stronger than what the evidence allows ("all" vs "some").

---

## Inference vs Conclusion

**Inference:** Something that must be true based on the facts given.
**Conclusion:** The point the argument is trying to prove.
Both should not go beyond the given information.`,
    codeExamples: [
      {
        title: 'Assumption Question',
        code: `Argument: "Students who study for more than 4 hours daily score
higher in exams. Therefore, Rahul should study more than
4 hours to improve his score."

Options:
A. Rahul currently studies less than 4 hours.
B. Studying more than 4 hours guarantees high scores.
C. Rahul wants to improve his score.
D. The relationship between study hours and scores is causal.

Negate each:
A. "Rahul currently studies 4+ hours" — argument still works. NOT assumption.
B. Negating: "4 hours doesn't guarantee high scores" — argument weakened but survives. NOT core assumption.
C. Negating: "Rahul doesn't want to improve" — then why recommend? Argument collapses! → ASSUMPTION.
D. Also key, but C is more directly necessary.

Answer: C`,
        explanation: 'Use the negation test. If negating the option collapses the argument, it is the assumption.',
      },
      {
        title: 'Strengthen vs Weaken',
        code: `Argument: "City A has more hospitals than City B.
Therefore, City A provides better healthcare than City B."

STRENGTHEN (makes argument better):
→ "City A has more doctors per hospital than City B." ✓
→ "Hospital utilization rate in City A is higher." ✓

WEAKEN (makes argument less valid):
→ "City B's hospitals are larger and have more total beds." ✓
→ "City A's hospitals are concentrated in one area, not city-wide." ✓
→ "Number of hospitals doesn't determine healthcare quality." ✓

Key insight: The argument assumes more hospitals = better care.
Any fact that challenges this assumption weakens the argument.`,
        explanation: 'To strengthen: support the link between evidence and conclusion. To weaken: break that link.',
      },
    ],
    commonMistakes: [
      'Choosing conclusions that go beyond the given information ("All" when only "Some" is justified).',
      'Confusing assumptions with conclusions — assumptions are unstated, conclusions are stated claims.',
      'Not using the negation test for assumption questions.',
      'Bringing outside knowledge into the argument — only use what is given.',
    ],
    interviewQuestions: [
      {
        question: 'How do you distinguish between a conclusion and an inference?',
        answer: 'A conclusion is the main point the argument is trying to establish — it is explicitly argued for. An inference is something that must logically be true based on the given facts, even if not explicitly stated. Conclusions can sometimes go beyond facts; valid inferences cannot.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'cr-ex-1',
        title: 'Identify the Assumption',
        description: '"Sales increased by 30% after we ran the TV ad. The TV ad is the reason for the increase." What is the key assumption?',
        starterCode: `// Assumption: Nothing else happened during that period that could explain the 30% increase.
// (i.e., the ad was the only significant variable that changed)
// Negation: "Other factors also changed" → attribution to ad is wrong → argument fails.`,
        solution: `The ad was the primary (or only) cause of the sales increase, with no other concurrent changes.`,
        hints: ['What must be true for the causal claim to be valid?'],
        expectedOutput: 'No other cause explains the increase',
      },
    ],
    keyTakeaways: [
      'Negation test: negate option → if argument collapses, it is the assumption.',
      'Strengthen: provide evidence for the argument\'s key link.',
      'Weaken: break the link between evidence and conclusion, or provide alternative explanation.',
      'Conclusions cannot go beyond what the evidence states.',
      'Always stay within given information — no outside knowledge.',
    ],
    prevLesson: 'syllogism',
    nextLesson: 'reading-comprehension',
  },

  // ════════════════════════════════════════════════════════════════════════════
  // SECTION 3 — VERBAL ABILITY
  // ════════════════════════════════════════════════════════════════════════════
  {
    id: 'reading-comprehension',
    slug: 'reading-comprehension',
    title: 'Reading Comprehension',
    description: 'Reading strategy, elimination, time management — crack RC questions in placement tests.',
    category: 'Verbal Ability',
    order: 20,
    difficulty: 'intermediate',
    estimatedTime: 35,
    content: `## Why RC Matters

Reading Comprehension appears in TCS, Infosys, Wipro, Accenture, and every banking/MBA entrance. One passage has 4-6 questions. Read once, answer all — time efficiency is key.

---

## The Right Reading Strategy

**Wrong approach:** Read the passage fully, then read questions, then search for answers.

**Right approach (Questions-First):**
1. Read all questions first (30 seconds).
2. Note keywords from each question.
3. Read the passage actively — mark sections when you encounter question keywords.
4. Answer as you encounter relevant sections.

This cuts your RC time by 30-40%.

---

## Passage Reading Techniques

**Skim the first and last sentence of each paragraph.** The first sentence is usually the topic sentence. The last often summarizes or transitions.

**Mark key words:** Contrasting words (but, however, although, yet) signal a change in argument. Emphasis words (primarily, mainly, most importantly) signal the main idea.

**Build a mental map:** After each paragraph, ask "What is this paragraph about in one word?"

---

## Question Types and Strategies

**Main Idea:** The answer is a broad summary, not a specific detail. Eliminate options that are too specific or too broad.

**Inference:** The answer must follow logically from the passage. Must NOT require outside information.

**Tone:** What is the author's attitude? Positive/negative/neutral? Optimistic/pessimistic/analytical?

**Vocabulary in context:** The question gives a word from the passage. Even if you don't know the word, read surrounding sentences — context gives the meaning.

**Specific detail:** Scan the passage for the exact paragraph, read it, answer from there.

---

## Elimination Strategy

Use elimination even when the passage is hard:
1. Eliminate options that are too extreme ("always," "never," "all," "none").
2. Eliminate options with information not present in the passage.
3. Eliminate options that are true but not relevant to the specific question.

The correct answer is usually the one that is supported by the passage and nothing else.

---

## Time Management in RC

Target: 2 minutes per question for RC.
If passage has 5 questions: spend max 10 minutes total (2 min read + 8 min answers).
Skip a question that requires re-reading the entire passage — return after other questions.`,
    codeExamples: [
      {
        title: 'Applying the Strategy to a Passage',
        code: `PASSAGE (short example):
"The rise of remote work has fundamentally changed urban planning.
Cities that once designed infrastructure around daily commuters now
face declining public transit revenue. However, suburban areas have
seen a property boom as workers seek larger homes. Economists warn
that this shift may create permanent structural changes in urban
economies, though some analysts remain cautiously optimistic about
cities' ability to adapt."

Q1: What is the main idea?
Wrong approach: Pick the most interesting sentence.
Right approach: Find what ALL paragraphs are about.
Answer: Remote work is transforming urban and suburban economies.

Q2: Author's tone?
"Economists warn" (concern), "cautiously optimistic" (balanced).
Answer: Balanced / Analytical — presents both sides.

Q3: What can be inferred about public transit?
Passage says: declining revenue. Inference: public transit may face funding cuts.
Answer: Public transit systems may struggle financially.`,
        explanation: 'Questions-first reading: read Q1,Q2,Q3 → then read passage with those in mind → answer directly.',
      },
    ],
    commonMistakes: [
      'Answering from memory/prior knowledge instead of from the passage.',
      'Choosing options that are "probably true" instead of "must be true based on passage."',
      'Missing contrast words (but, however) which often flip the argument.',
      'Spending too long on a difficult passage — timing kills the rest of the section.',
    ],
    interviewQuestions: [
      {
        question: 'How do you approach a dense technical RC passage in under 3 minutes?',
        answer: 'Read questions first to know what to look for. Skim first/last sentences of each paragraph for structure. Read actively — stop at keywords from questions. Do not try to understand every word; understand the flow. Answer from the passage only. 5 questions × 30s each + 1 min skim = under 4 minutes.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'rc-ex-1',
        title: 'Tone Identification',
        description: 'Practice identifying author tone: "While renewable energy has made remarkable progress, it still faces significant adoption challenges in developing nations." What is the tone?',
        starterCode: `// "remarkable progress" = positive about renewables
// "still faces significant challenges" = realistic concern
// Tone = Balanced / Cautiously optimistic`,
        solution: `Balanced or cautiously optimistic — acknowledges both progress and challenges.`,
        hints: ['Look for both positive and negative language in the same statement'],
        expectedOutput: 'Balanced / Cautiously optimistic',
      },
    ],
    keyTakeaways: [
      'Read questions FIRST — then read the passage with purpose.',
      'Skim first + last sentence of each paragraph to map the passage.',
      'Inference questions: answer must come from passage, not from outside knowledge.',
      'Eliminate extreme options (always/never/all/none) — RC answers are rarely absolute.',
      'Time target: 2 minutes per RC question.',
    ],
    prevLesson: 'critical-reasoning',
    nextLesson: 'vocabulary',
  },
  {
    id: 'vocabulary',
    slug: 'vocabulary',
    title: 'Vocabulary',
    description: 'High-frequency placement words, industry vocabulary, and context-based word meaning.',
    category: 'Verbal Ability',
    order: 21,
    difficulty: 'beginner',
    estimatedTime: 30,
    content: `## Vocabulary in Placement Tests

Vocabulary questions appear as:
- Synonyms: "Which word means the same as X?"
- Antonyms: "Which word means the opposite of X?"
- Fill in the blanks: "Choose the word that fits the sentence."
- Error detection: "Which word is incorrectly used?"

**Key insight:** You don't need to memorize the dictionary. You need the 500 high-frequency words that appear repeatedly in placement tests.

---

## High-Frequency Placement Words

**Positive words:**
- **Astute** — shrewd, clever in practical matters
- **Candid** — honest and straightforward
- **Diligent** — hardworking and persistent
- **Eloquent** — fluent and persuasive in speaking/writing
- **Frugal** — careful with money, not wasteful
- **Magnanimous** — generous and forgiving
- **Pragmatic** — practical, realistic
- **Tenacious** — determined, not giving up

**Negative words:**
- **Belligerent** — aggressive, hostile
- **Capricious** — unpredictable, impulsive
- **Cynical** — distrustful, sees negative motives
- **Dogmatic** — rigidly opinionated
- **Lethargic** — sluggish, lack of energy
- **Mendacious** — dishonest, lying
- **Nefarious** — wicked, criminal
- **Pedantic** — overly focused on minor details

**Neutral/descriptive:**
- **Ambiguous** — unclear, open to more than one interpretation
- **Concise** — brief but comprehensive
- **Ephemeral** — lasting for a very short time
- **Lucid** — clear and easy to understand
- **Meticulous** — showing great attention to detail
- **Mundane** — ordinary, routine, not interesting
- **Prolific** — producing many works/results
- **Verbose** — using more words than needed

---

## Context Strategy (Most Important)

Even if you don't know a word, the surrounding sentence gives clues:

- **Contrast clues:** "Despite being _____, he succeeded" → blank is something negative.
- **Similarity clues:** "His ___ behavior, like his constant honesty, was admired" → blank is positive.
- **Definition clues:** "The ephemeral, or short-lived, beauty of cherry blossoms" → ephemeral = short-lived.

---

## Word Roots for Fast Learning

| Root | Meaning | Examples |
|------|---------|---------|
| bene | good | benefit, benevolent |
| mal | bad | malicious, malign |
| loqui | speak | eloquent, loquacious |
| ver | truth | verify, veracious |
| dict | say | dictate, contradiction |
| cred | believe | credible, incredible |
| port | carry | portable, export |
| rupt | break | disrupt, interrupt |`,
    codeExamples: [
      {
        title: 'Synonym-Antonym Practice',
        code: `Synonyms (same meaning):
Frugal = Thrifty, Economical, Sparing
Eloquent = Articulate, Fluent, Expressive
Tenacious = Persistent, Dogged, Determined
Pragmatic = Practical, Realistic, Sensible

Antonyms (opposite meaning):
Frugal ↔ Extravagant, Wasteful
Candid ↔ Deceptive, Evasive
Lucid ↔ Obscure, Confusing, Vague
Verbose ↔ Concise, Terse, Brief

Tricky pairs (often confused):
Affect (verb: to influence) vs Effect (noun: result)
Principle (rule/belief) vs Principal (main/head person)
Complement (complete) vs Compliment (praise)
Allusion (indirect reference) vs Illusion (false impression)`,
        explanation: 'Learn words in pairs: word + synonym + antonym. Three times more efficient than learning one at a time.',
      },
      {
        title: 'Using Context to Find Meaning',
        code: `Q: "The politician's mendacious statements were later proven
   false by investigators." What does mendacious mean?

Context clue: "statements... proven false" suggests dishonesty.
Mendacious = dishonest, lying. ✓

Q: "She was known for her loquacious nature, often talking
   for hours without pause."
Context clue: "talking for hours without pause" = talking too much.
Loquacious = talkative, chatty. ✓

Q: "The ephemeral nature of fame means most celebrities are
   forgotten within a decade."
Context clue: "forgotten within a decade" = lasting short time.
Ephemeral = short-lived, fleeting. ✓`,
        explanation: 'Context clues are in the same sentence or adjacent sentences. Always read the full sentence before guessing.',
      },
    ],
    commonMistakes: [
      'Memorizing words without context — you forget them in 2 days.',
      'Confusing commonly confused pairs: affect/effect, principal/principle.',
      'Ignoring word roots — roots let you decode unfamiliar words instantly.',
      'Only learning positive or negative sentiment — many placement words are neutral.',
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between "infer" and "imply"?',
        answer: '"Imply" means to suggest something indirectly (the speaker/writer implies). "Infer" means to deduce something from evidence (the reader/listener infers). Speaker implies. Listener infers. "I implied that I was tired" = I hinted. "You can infer from my yawning that I am tired" = you deduce.',
        difficulty: 'beginner',
      },
    ],
    exercises: [
      {
        id: 'voc-ex-1',
        title: 'Antonym Challenge',
        description: 'Find antonyms: (1) Magnanimous, (2) Diligent, (3) Candid, (4) Lethargic.',
        starterCode: `// 1. Magnanimous (generous) ↔ Petty / Miserly
// 2. Diligent (hardworking) ↔ Lazy / Negligent
// 3. Candid (honest) ↔ Evasive / Deceptive
// 4. Lethargic (sluggish) ↔ Energetic / Vigorous`,
        solution: `1. Petty/Miserly, 2. Lazy/Negligent, 3. Evasive/Deceptive, 4. Energetic/Vigorous`,
        hints: ['Think of the opposite quality for each word'],
        expectedOutput: 'Petty, Lazy, Evasive, Energetic',
      },
    ],
    keyTakeaways: [
      'Learn words in triplets: word + synonym + antonym.',
      'Context clues (contrast, similarity, definition) can decode unknown words.',
      'Word roots (bene, mal, loqui, cred) let you guess unfamiliar words.',
      'Know commonly confused pairs: affect/effect, principle/principal, complement/compliment.',
    ],
    prevLesson: 'reading-comprehension',
    nextLesson: 'grammar',
  },
  {
    id: 'grammar',
    slug: 'grammar',
    title: 'Grammar',
    description: 'Tenses, articles, prepositions, subject-verb agreement, and common errors for placement tests.',
    category: 'Verbal Ability',
    order: 22,
    difficulty: 'beginner',
    estimatedTime: 35,
    content: `## Grammar in Placement Tests

Grammar questions appear as:
- Error detection: Find the grammatical error in a sentence.
- Fill in the blank: Choose the correct word/tense.
- Sentence correction: Rewrite the incorrect part.

Focus on high-frequency error types, not all of English grammar.

---

## Tenses (Most Tested)

| Tense | Form | Use |
|-------|------|-----|
| Simple Present | He works | Habits, facts |
| Present Continuous | He is working | Happening now |
| Present Perfect | He has worked | Completed but connected to now |
| Simple Past | He worked | Completed at specific past time |
| Past Perfect | He had worked | Completed before another past event |
| Future Perfect | He will have worked | Completed before a future time |

**Common error:** Using simple past instead of present perfect.
Wrong: "I already ate." ✗
Right: "I have already eaten." ✓ (result connected to present)

---

## Subject-Verb Agreement

The verb must agree in number with the subject.

**Tricky cases:**
- "Either/neither... or/nor" → verb agrees with the NEAREST subject.
  "Either the manager or the employees ARE responsible." ✓
- Collective nouns (team, committee, jury) take singular verbs.
  "The team IS performing well." ✓
- "Each," "every," "either," "neither" → always singular.
  "Each student HAS a book." ✓
- "None" can be singular or plural based on context.

---

## Articles (a, an, the)

**"a/an"** — used with non-specific, first mention of countable nouns.
- "a" before consonant sounds: a dog, a university (y-sound).
- "an" before vowel sounds: an hour (h-silent), an MBA.

**"the"** — used with specific, known, unique, or previously mentioned nouns.
- The sun, the moon, the President.
- "I saw a dog. The dog was brown." (2nd mention = specific)

**No article:** For general plural/uncountable nouns.
"Dogs are loyal." NOT "The dogs are loyal" (general fact).

---

## Prepositions

| Preposition | Use | Example |
|-------------|-----|---------|
| in | enclosed space, city, country | in the box, in Delhi |
| at | specific point, address | at the door, at 10 AM |
| on | surface, specific day/date | on the table, on Monday |
| by | deadline, agent, method | by Friday, sent by courier |
| since | specific time (with perfect tense) | since 2020 |
| for | duration | for 5 years |

---

## Common Error Patterns

1. **Redundancy:** "Repeat again" → "Repeat" (again is redundant).
2. **Dangling modifier:** "Running fast, the bus was missed." → "Running fast, he missed the bus."
3. **Wrong comparative:** "More better" → "Better." "Most worst" → "Worst."
4. **Apostrophe misuse:** "Its" (possessive) vs "It's" (it is). "Your" vs "You're."`,
    codeExamples: [
      {
        title: 'Error Detection — High Frequency Patterns',
        code: `Sentence: "He is working here since five years."
Error: "since" requires present perfect, not present continuous.
Correction: "He has been working here for five years."
(Use "for" with duration, "since" with specific start point + perfect tense)

---

Sentence: "Neither the students nor the teacher were present."
Error: "nor" → verb agrees with nearest subject ("teacher" = singular).
Correction: "Neither the students nor the teacher was present."

---

Sentence: "I have went to the store yesterday."
Error: "have went" is wrong; past perfect needs "gone" AND
"yesterday" needs simple past, not present perfect.
Correction: "I went to the store yesterday."

---

Sentence: "Each of the boys have completed their homework."
Error: "Each" is always singular.
Correction: "Each of the boys has completed his homework."`,
        explanation: 'Common placement error patterns. Memorize these specific constructions — they repeat across companies.',
      },
      {
        title: 'Fill in the Blank — Preposition and Tense',
        code: `1. She has been waiting ___ two hours.
   Options: since / for / by / in
   Answer: FOR (duration, not a specific start point)

2. I will finish the report ___ Monday.
   Options: on / in / by / at
   Answer: BY (deadline/not later than)

3. He arrived ___ the airport ___ 6 AM ___ December 15th.
   Answer: at (specific location) / at (specific time) / on (specific date)

4. They ___ (live) here since 2018.
   Answer: have lived / have been living (both acceptable — present perfect)

5. By the time she arrived, the meeting ___ (already, end).
   Answer: had already ended (past perfect — completed before another past event)`,
        explanation: 'For each blank: identify the type (time expression, location, deadline) then apply the rule.',
      },
    ],
    commonMistakes: [
      'Using "since" with duration ("since 5 years") — use "for" with duration.',
      'Not adjusting verb for "each/every/neither/either" — these are always singular.',
      'Confusing "its" (possessive) with "it\'s" (contraction of it is).',
      'Dangling modifiers — the subject of the modifier must match the sentence\'s subject.',
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between "since" and "for"?',
        answer: '"Since" refers to a specific point in time and is used with perfect tenses: "I have been here since 9 AM." "For" refers to a duration of time: "I have been here for three hours." Wrong: "I am working since morning." Right: "I have been working since morning."',
        difficulty: 'beginner',
      },
    ],
    exercises: [
      {
        id: 'gram-ex-1',
        title: 'Spot the Error',
        description: 'Find and correct the error: "The committee have decided to postpone the meeting."',
        starterCode: `// "Committee" is a collective noun → takes singular verb.
// "have decided" → "has decided"
// Correction: "The committee has decided to postpone the meeting."`,
        solution: `Error: "have" should be "has." Committee = collective noun → singular verb.`,
        hints: ['Collective nouns (team, committee, jury) take singular verbs'],
        expectedOutput: 'The committee has decided to postpone the meeting.',
      },
    ],
    keyTakeaways: [
      '"Since" = specific start point (with perfect tense). "For" = duration.',
      'Each/every/either/neither → always singular verb.',
      'Collective nouns (team/committee/jury) → singular verb.',
      '"a" before consonant sounds. "an" before vowel sounds (university=a, hour=an).',
      '"Its" = possessive. "It\'s" = it is. "Your" = possessive. "You\'re" = you are.',
    ],
    prevLesson: 'vocabulary',
    nextLesson: 'sentence-improvement',
  },
  {
    id: 'sentence-improvement',
    slug: 'sentence-improvement',
    title: 'Sentence Improvement',
    description: 'Error detection, sentence correction, and placement-style verbal questions — complete guide.',
    category: 'Verbal Ability',
    order: 23,
    difficulty: 'intermediate',
    estimatedTime: 30,
    content: `## Sentence Improvement Questions

These questions give a sentence with one part underlined. You choose the option that best replaces that part — or confirm "No Improvement" if the original is correct.

---

## Strategy

**Step 1:** Read the full sentence. Understand the intended meaning.
**Step 2:** Identify what type of error might exist: grammar, word choice, redundancy, awkward phrasing.
**Step 3:** Eliminate options that change the meaning or introduce new errors.
**Step 4:** Choose the option that is grammatically correct AND conveys the original meaning most clearly.

---

## High-Frequency Error Types

**1. Parallelism errors:**
Wrong: "She likes running, to swim, and dance."
Right: "She likes running, swimming, and dancing." (all gerunds)

**2. Misplaced modifiers:**
Wrong: "He almost drove his children to school every day." (almost drove = never quite arrived?)
Right: "He drove his children to almost every school day." (or restructure)

**3. Redundancy:**
Wrong: "Return back," "advance forward," "free gift," "end result."
Right: "Return," "advance," "gift," "result."

**4. Wrong verb form:**
Wrong: "He insisted that she comes tomorrow."
Right: "He insisted that she come tomorrow." (subjunctive mood)

**5. Passive voice — when wrong:**
Wrong (awkward): "The ball was thrown by him to her by him."
Right: "He threw the ball to her."

---

## Parallelism — Deep Dive

Parallelism means items in a list or comparison must be in the same grammatical form.

**In lists:** All nouns, all gerunds, all infinitives.
"I enjoy reading, writing, and to code." → "I enjoy reading, writing, and coding."

**In comparisons:** Same structure on both sides of "than/as."
"She is more interested in music than dancing." ✓ (both nouns)
"She is more interested in music than to dance." ✗ (noun vs infinitive)

**In correlatives:** (both...and, either...or, neither...nor, not only...but also)
Wrong: "Not only did she win the race but also finishing first."
Right: "Not only did she win the race, but she also finished first."`,
    codeExamples: [
      {
        title: 'Sentence Improvement — Worked Examples',
        code: `Q1: "The manager, along with his team, are responsible for the delay."
Underlined: "are responsible"
Error: "along with" does not change the subject. Subject = "manager" (singular).
Improvement: "is responsible"
Final: "The manager, along with his team, is responsible for the delay."

---

Q2: "No sooner did the bell rang than the students rushed out."
Underlined: "rang"
After "no sooner did... than" → use bare infinitive (V1).
"did the bell rang" → "did the bell ring"
Final: "No sooner did the bell ring than the students rushed out."

---

Q3: "He is one of those students who works hard."
Underlined: "works"
"One of those students who" → "who" refers to "students" (plural) → "work."
Final: "He is one of those students who work hard."

---

Q4: "The new policy is different than the old one."
Underlined: "different than"
"Different from" is correct (not "different than").
Final: "The new policy is different from the old one."`,
        explanation: 'Each error type appears in 3-4 questions per test. Recognize the pattern, apply the fix.',
      },
    ],
    commonMistakes: [
      '"Along with/together with" does not make the subject plural — verb agrees with main subject only.',
      '"Different from" not "different than."',
      '"One of those who" → verb is plural (agrees with "those").',
      '"No sooner... than" and "Hardly/Scarcely... when" need past perfect in first clause.',
    ],
    interviewQuestions: [
      {
        question: 'Correct this sentence: "He not only donated money but also gave his time."',
        answer: 'The sentence is already correct. "Not only...but also" connects parallel items: "donated money" and "gave his time" — both are verb phrases. No correction needed.',
        difficulty: 'beginner',
      },
    ],
    exercises: [
      {
        id: 'si-ex-1',
        title: 'Parallelism Fix',
        description: 'Correct: "She spends her time reading novels, watching movies, and to play chess."',
        starterCode: `// All items must be parallel. "reading" and "watching" are gerunds. "to play" is infinitive.
// Fix: "playing chess"
// Corrected: "She spends her time reading novels, watching movies, and playing chess."`,
        solution: `"She spends her time reading novels, watching movies, and playing chess."`,
        hints: ['All verbs in a list must be in the same form — gerunds or infinitives, not mixed'],
        expectedOutput: 'playing chess',
      },
    ],
    keyTakeaways: [
      'Parallelism: items in lists/comparisons must be in the same grammatical form.',
      '"Along with/together with" → verb agrees with MAIN subject only.',
      '"Different from" is always correct, not "different than."',
      '"No sooner... than" → use V1 after "did." First clause = past perfect.',
      '"One of those who" → "who" takes plural verb (agrees with "those").',
    ],
    prevLesson: 'grammar',
    nextLesson: 'operating-systems',
  },

  // ════════════════════════════════════════════════════════════════════════════
  // SECTION 4 — CS FUNDAMENTALS
  // ════════════════════════════════════════════════════════════════════════════
  {
    id: 'operating-systems',
    slug: 'operating-systems',
    title: 'Operating Systems',
    description: 'Process, threads, scheduling, deadlock, semaphore, paging, virtual memory — complete OS interview prep.',
    category: 'CS Fundamentals',
    order: 24,
    difficulty: 'intermediate',
    estimatedTime: 60,
    content: `## What is an Operating System?

An OS is system software that manages hardware resources and provides services to programs. It is the intermediary between hardware and user applications.

**Core functions:** Process management, memory management, file system management, I/O management, security.

---

## Process vs Thread

**Process:** An independent program in execution. Has its own memory space (code, data, heap, stack). Heavy to create. Communication via IPC (Inter-Process Communication).

**Thread:** A unit of execution within a process. Shares process memory (code, data, heap). Has its own stack and registers. Light to create. Communication via shared memory.

**Analogy:** A restaurant is a process. Each chef is a thread. Chefs share the kitchen (memory), but each has their own station (stack).

---

## Process States

New → Ready → Running → (Waiting or Terminated)

- **New:** Process being created.
- **Ready:** Waiting for CPU.
- **Running:** Executing on CPU.
- **Waiting:** Waiting for I/O or event.
- **Terminated:** Execution complete.

A process can go: Running → Waiting (I/O request), or Running → Ready (preemption).

---

## CPU Scheduling Algorithms

**FCFS (First Come First Served):**
Non-preemptive. Simple but convoy effect (long jobs block short ones).

**SJF (Shortest Job First):**
Non-preemptive. Optimal average waiting time. Problem: cannot know burst time in advance.

**SRTF (Shortest Remaining Time First):**
Preemptive version of SJF. Optimal, but high overhead.

**Round Robin:**
Each process gets a time quantum (e.g., 20ms). After quantum expires, preempted and goes to end of queue. Fair. Good for time-sharing systems.

**Priority Scheduling:**
Higher priority process runs first. Problem: starvation of low-priority processes. Solution: aging (increase priority over time).

**Multilevel Queue:** Ready queue split into multiple queues (foreground/background) with different algorithms.

---

## Deadlock

**Definition:** Two or more processes wait for each other indefinitely, none able to proceed.

**4 Necessary Conditions (Coffman):**
1. **Mutual Exclusion** — resource held by only one process.
2. **Hold and Wait** — process holds a resource while waiting for another.
3. **No Preemption** — resources cannot be forcibly taken.
4. **Circular Wait** — circular chain of waiting processes.

**Deadlock Prevention:** Eliminate one of the four conditions.
**Deadlock Avoidance:** Banker's Algorithm — only grant requests if the system remains in a safe state.
**Deadlock Detection and Recovery:** Let deadlock happen, detect via Resource Allocation Graph, recover by killing a process or preempting resources.

---

## Semaphore and Mutex

**Semaphore:** An integer variable with two atomic operations:
- **wait(S) / P(S):** If S > 0, decrement S. Else block.
- **signal(S) / V(S):** Increment S, wake a blocked process.

**Binary Semaphore (0 or 1):** Like a mutex.
**Counting Semaphore:** Controls access to N resources.

**Mutex (Mutual Exclusion Lock):** Only the process that locks it can unlock it. Unlike binary semaphore which can be unlocked by any process.

**Key difference:** Mutex has ownership — only the locker can unlock. Semaphore has no ownership.

---

## Memory Management

**Paging:** Physical memory divided into fixed-size frames. Logical memory divided into pages of same size. Page table maps logical to physical addresses. Eliminates external fragmentation.

**Segmentation:** Logical memory divided into variable-size segments (code, data, stack). May cause external fragmentation.

**Virtual Memory:** Allows processes to use more memory than physically available. Pages stored on disk when not in use. Brought in on demand (demand paging). **Page fault** when needed page is not in physical memory.

**Page Replacement Algorithms:**
- FIFO: Replace oldest page. Suffers from Belady's Anomaly.
- LRU (Least Recently Used): Replace page not used for longest time. Optimal in practice.
- Optimal: Replace page used farthest in the future. Theoretical best.

**Thrashing:** When a process spends more time paging than executing — page fault rate is too high.

---

## Context Switching

When the CPU switches from one process to another:
1. Save state (registers, PC, stack pointer) of current process to its PCB.
2. Load state of next process from its PCB.

This is overhead — pure CPU time wasted. Reduced by fewer but longer time quanta or lighter threads.`,
    codeExamples: [
      {
        title: 'Scheduling — Gantt Chart Example',
        code: `Processes: P1(burst=6), P2(burst=4), P3(burst=2)
Arrival: all at time 0.

FCFS Order: P1, P2, P3
Gantt: |--P1(0-6)--|--P2(6-10)--|--P3(10-12)--|
Waiting times: P1=0, P2=6, P3=10. Average=16/3≈5.33ms

SJF Order: P3, P2, P1 (shortest first)
Gantt: |--P3(0-2)--|--P2(2-6)--|--P1(6-12)--|
Waiting times: P3=0, P2=2, P1=6. Average=8/3≈2.67ms ← much better!

Round Robin (quantum=2):
Order: P1,P2,P3,P1,P2,P1,P1,P1
Gantt: P1(0-2),P2(2-4),P3(4-6),P1(6-8),P2(8-10),P1(10-12)
P3 done at 6, P2 done at 10, P1 done at 12.
Waiting: P3=4, P2=6, P1=6. Average=5.33ms`,
        explanation: 'For scheduling questions: draw Gantt chart, calculate completion time, waiting time = completion - arrival - burst.',
      },
      {
        title: 'Deadlock — Resource Allocation Graph',
        code: `Process P1 holds R1 and waits for R2.
Process P2 holds R2 and waits for R1.

Resource Allocation Graph:
P1 → R2 (P1 requesting R2)
R1 → P1 (R1 held by P1)
P2 → R1 (P2 requesting R1)
R2 → P2 (R2 held by P2)

Cycle: P1 → R2 → P2 → R1 → P1 → ...
DEADLOCK exists (cycle with single-instance resources = deadlock).

Prevention options:
1. Force processes to request all resources at start (eliminate Hold & Wait).
2. Allow preemption (eliminate No Preemption).
3. Impose ordering on resource types (eliminate Circular Wait).`,
        explanation: 'In single-instance resource graphs, any cycle = deadlock. Multi-instance: cycle is necessary but not sufficient.',
      },
    ],
    commonMistakes: [
      'Saying "SJF has no disadvantages" — it suffers from starvation of long processes.',
      'Confusing semaphore and mutex — mutex has ownership, semaphore does not.',
      'Saying "deadlock requires all 4 conditions" — correct, removing ANY one prevents deadlock.',
      'Confusing paging (fixed size, no external fragmentation) with segmentation (variable size, external fragmentation).',
      'Thrashing is caused by TOO MANY processes in memory, not just high paging rate.',
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between process and thread?',
        answer: 'A process is an independent program with its own memory space. A thread is a unit of execution within a process that shares the process\'s memory. Processes have isolated memory; threads share heap and data segment but have separate stacks. Thread creation is faster and cheaper. Communication between threads is easier (shared memory) but requires synchronization. Processes communicate via IPC (pipes, sockets, shared memory).',
        difficulty: 'beginner',
      },
      {
        question: 'What are the four necessary conditions for deadlock?',
        answer: 'Mutual Exclusion (resource held exclusively), Hold and Wait (holds a resource while waiting for another), No Preemption (resources cannot be forcibly taken), and Circular Wait (circular chain of waiting). All four must hold simultaneously. Removing any one prevents deadlock.',
        difficulty: 'intermediate',
      },
      {
        question: 'What is the difference between a semaphore and a mutex?',
        answer: 'A mutex (mutual exclusion lock) has ownership — only the thread that locked it can unlock it. It is used to protect a critical section. A semaphore has no ownership — any thread can signal it. A binary semaphore is similar to a mutex but without ownership. A counting semaphore controls access to N resources. Use mutex for mutual exclusion; use semaphore for signaling between threads.',
        difficulty: 'intermediate',
      },
      {
        question: 'What is virtual memory and what problem does it solve?',
        answer: 'Virtual memory allows a process to use more memory than physically available by storing unused pages on disk. It solves the problem of running programs larger than RAM and provides memory isolation between processes. When a needed page is not in RAM, a page fault occurs, the OS fetches the page from disk (swap space). The drawback is latency — disk access is much slower than RAM. Too many page faults cause thrashing.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'os-ex-1',
        title: 'Scheduling Calculation',
        description: 'Three processes: P1(burst 4), P2(burst 2), P3(burst 6), all arrive at time 0. Calculate average waiting time for SJF.',
        starterCode: `// SJF order: P2(shortest), P1, P3
// P2: waiting=0, completes at 2
// P1: waiting=2, completes at 6
// P3: waiting=6, completes at 12
// Average waiting = (0+2+6)/3 = 8/3 ≈ 2.67ms`,
        solution: `Average waiting time = (0+2+6)/3 = 8/3 ≈ 2.67ms`,
        hints: ['SJF: shortest burst first. Waiting time = start time - arrival time.'],
        expectedOutput: '2.67ms',
      },
    ],
    keyTakeaways: [
      'Process = independent memory. Thread = shared memory, own stack. Thread is lighter.',
      'Deadlock 4 conditions: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait.',
      'Mutex = ownership (locker must unlock). Semaphore = no ownership.',
      'Paging = fixed frames, no external fragmentation. Segmentation = variable, external fragmentation.',
      'Thrashing = page fault rate so high that CPU spends more time swapping than executing.',
    ],
    prevLesson: 'sentence-improvement',
    nextLesson: 'dbms',
  },
  {
    id: 'dbms',
    slug: 'dbms',
    title: 'DBMS',
    description: 'Keys, normalization, ACID, transactions, joins, indexing, SQL — complete database interview prep.',
    category: 'CS Fundamentals',
    order: 25,
    difficulty: 'intermediate',
    estimatedTime: 60,
    content: `## What is DBMS?

A Database Management System is software that stores, organizes, and retrieves data. It provides data independence, consistency, security, and concurrent access.

**RDBMS (Relational DBMS):** Data stored in tables (relations) with rows and columns. Examples: MySQL, PostgreSQL, Oracle.

---

## Keys in RDBMS

**Super Key:** Any set of attributes that uniquely identifies a row.
**Candidate Key:** Minimal super key (no redundant attributes).
**Primary Key:** Chosen candidate key. No NULL, no duplicates.
**Foreign Key:** Attribute that references primary key of another table. Enforces referential integrity.
**Composite Key:** Primary key made of two or more attributes.
**Alternate Key:** Candidate keys that were NOT chosen as primary key.

---

## Normalization

Normalization eliminates redundancy and inconsistencies.

**1NF (First Normal Form):**
- No repeating groups.
- Each cell has atomic (single) value.
- Each column has a unique name.
- Order of rows doesn't matter.

**2NF (Second Normal Form):**
- Must be in 1NF.
- No partial dependency (non-key attribute depends on PART of composite key).
- All non-key attributes must depend on the ENTIRE primary key.

**3NF (Third Normal Form):**
- Must be in 2NF.
- No transitive dependency (non-key attribute depends on another non-key attribute).

**BCNF (Boyce-Codd Normal Form):**
- Stricter than 3NF.
- For every functional dependency A→B, A must be a super key.

---

## ACID Properties

Transactions must be ACID-compliant:

**A — Atomicity:** Transaction is all-or-nothing. If any step fails, entire transaction rolls back.

**C — Consistency:** Database moves from one valid state to another. Constraints never violated.

**I — Isolation:** Concurrent transactions execute as if sequential. Isolation levels: Read Uncommitted, Read Committed, Repeatable Read, Serializable.

**D — Durability:** Once committed, transaction persists even after system crash. Achieved via transaction logs and write-ahead logging.

---

## SQL Joins

**INNER JOIN:** Returns rows where there is a match in BOTH tables.

**LEFT JOIN (LEFT OUTER JOIN):** All rows from left table + matching rows from right. Non-matching right rows → NULL.

**RIGHT JOIN:** All rows from right table + matching from left. Non-matching left → NULL.

**FULL OUTER JOIN:** All rows from both tables. Non-matching rows → NULL on the respective side.

**CROSS JOIN:** Every row of table A × every row of table B (Cartesian product).

**SELF JOIN:** Table joined with itself. Useful for hierarchical data.

---

## Indexing

An index is a data structure that speeds up data retrieval.

**Primary Index:** On primary key. Automatically created.
**Secondary Index:** On non-primary key attributes.
**Clustered Index:** Data rows are physically sorted by index key. Only one per table.
**Non-Clustered Index:** Separate structure pointing to data rows. Multiple allowed.

**B+ Tree Index:** Most common. All data at leaf nodes, internal nodes only have keys.
**Hash Index:** For equality lookups only (WHERE id = 5). Not for range queries.

**Trade-off:** Indexes speed up reads but slow down writes (INSERT/UPDATE/DELETE must update index too).

---

## Transactions and Concurrency Problems

**Dirty Read:** Read uncommitted changes of another transaction (which may later roll back).
**Non-Repeatable Read:** Same row read twice gives different values (another transaction modified it between reads).
**Phantom Read:** Query run twice returns different set of rows (another transaction added/deleted rows).

**Isolation levels solve these:**
- Read Uncommitted: allows dirty reads.
- Read Committed: prevents dirty reads.
- Repeatable Read: prevents dirty reads + non-repeatable reads.
- Serializable: prevents all three.`,
    codeExamples: [
      {
        title: 'SQL Joins — Visual Guide',
        code: `-- Tables:
-- Employees: (EmpID, Name, DeptID)
-- Departments: (DeptID, DeptName)

-- INNER JOIN: only employees WITH a department
SELECT E.Name, D.DeptName
FROM Employees E
INNER JOIN Departments D ON E.DeptID = D.DeptID;

-- LEFT JOIN: all employees, even those without department
SELECT E.Name, D.DeptName
FROM Employees E
LEFT JOIN Departments D ON E.DeptID = D.DeptID;
-- Employees without dept: DeptName = NULL

-- Find employees with NO department (using LEFT JOIN):
SELECT E.Name
FROM Employees E
LEFT JOIN Departments D ON E.DeptID = D.DeptID
WHERE D.DeptID IS NULL;`,
        explanation: 'INNER JOIN = intersection. LEFT JOIN = all of left + matching from right. NULL for non-matches.',
      },
      {
        title: 'Normalization Example',
        code: `-- Unnormalized table (1NF violation — repeating courses):
Student: (ID, Name, Course1, Course2, Course3)

-- 1NF fix: one value per cell:
Student: (StudentID, Name)
StudentCourse: (StudentID, CourseName)

-- 2NF violation (partial dependency):
-- Key: (StudentID, CourseID). Attribute: StudentName depends only on StudentID.
StudentCourse: (StudentID, CourseID, StudentName, Grade)

-- 2NF fix: separate Student info:
Student: (StudentID, StudentName)
Course: (CourseID, CourseName)
Enrollment: (StudentID, CourseID, Grade)

-- 3NF violation (transitive dependency):
-- Employee(EmpID, DeptID, DeptManager): DeptManager depends on DeptID, not EmpID.
-- 3NF fix:
Employee: (EmpID, DeptID)
Department: (DeptID, DeptManager)`,
        explanation: '2NF: remove partial dependencies (move attribute to table whose key it fully depends on). 3NF: remove transitive dependencies.',
      },
      {
        title: 'Common SQL Interview Queries',
        code: `-- Second highest salary:
SELECT MAX(Salary) FROM Employees
WHERE Salary < (SELECT MAX(Salary) FROM Employees);

-- Or:
SELECT Salary FROM Employees
ORDER BY Salary DESC LIMIT 1 OFFSET 1;

-- Nth highest salary (using DENSE_RANK):
SELECT Salary FROM (
  SELECT Salary, DENSE_RANK() OVER (ORDER BY Salary DESC) AS rnk
  FROM Employees
) t WHERE rnk = N;

-- Count employees per department:
SELECT DeptID, COUNT(*) AS EmpCount
FROM Employees
GROUP BY DeptID
HAVING COUNT(*) > 5;  -- departments with more than 5 employees

-- Find duplicate emails:
SELECT Email, COUNT(*) FROM Employees
GROUP BY Email HAVING COUNT(*) > 1;`,
        explanation: 'These exact queries appear in 80% of technical interviews. Memorize the patterns.',
      },
    ],
    commonMistakes: [
      'Saying "2NF means no redundancy" — 2NF only removes partial dependencies, redundancy may still exist.',
      'Forgetting that HAVING filters groups (after GROUP BY) while WHERE filters rows (before GROUP BY).',
      'Using = NULL instead of IS NULL — NULL comparisons require IS NULL.',
      'Confusing clustered and non-clustered indexes — only ONE clustered index per table.',
    ],
    interviewQuestions: [
      {
        question: 'What are ACID properties? Give a real-world example of atomicity.',
        answer: 'ACID: Atomicity (all-or-nothing), Consistency (valid state to valid state), Isolation (concurrent = sequential), Durability (committed data persists). Real-world atomicity: bank transfer. Debit ₹1000 from A AND credit ₹1000 to B must both succeed or both fail. If debit succeeds but credit fails, the entire transaction rolls back — money doesn\'t disappear.',
        difficulty: 'beginner',
      },
      {
        question: 'What is the difference between WHERE and HAVING?',
        answer: 'WHERE filters individual rows BEFORE grouping. HAVING filters groups AFTER GROUP BY. WHERE cannot use aggregate functions. HAVING can. Example: WHERE salary > 50000 filters rows. HAVING COUNT(*) > 5 filters groups with more than 5 rows.',
        difficulty: 'beginner',
      },
      {
        question: 'What is indexing and when should you NOT use an index?',
        answer: 'An index speeds up SELECT queries by creating a separate data structure (B+ tree or hash) for quick lookups. Do NOT use index when: (1) table is small (full scan is faster). (2) columns are rarely used in WHERE/JOIN. (3) column has very low cardinality (e.g., gender — only 2 values). (4) table has many INSERT/UPDATE/DELETE operations — indexes slow down writes.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'db-ex-1',
        title: 'SQL Query Practice',
        description: 'Write a query to find all employees earning more than the average salary.',
        starterCode: `-- Use subquery to compute average, then compare
SELECT Name, Salary
FROM Employees
WHERE Salary > (SELECT AVG(Salary) FROM Employees);`,
        solution: `SELECT Name, Salary FROM Employees WHERE Salary > (SELECT AVG(Salary) FROM Employees);`,
        hints: ['Compute average in a subquery, compare each row against it'],
        expectedOutput: 'Employees with salary above average',
      },
    ],
    keyTakeaways: [
      'Keys: Primary (no null), Foreign (references primary), Candidate (minimal super key).',
      '1NF=atomic. 2NF=no partial dependency. 3NF=no transitive dependency.',
      'ACID: Atomicity, Consistency, Isolation, Durability.',
      'INNER JOIN=intersection. LEFT JOIN=all left + matching right (NULL for non-matches).',
      'Index speeds SELECT but slows INSERT/UPDATE/DELETE.',
    ],
    prevLesson: 'operating-systems',
    nextLesson: 'computer-networks',
  },
  {
    id: 'computer-networks',
    slug: 'computer-networks',
    title: 'Computer Networks',
    description: 'OSI model, TCP/IP, HTTP, DNS, TCP vs UDP, routing — complete networking interview prep.',
    category: 'CS Fundamentals',
    order: 26,
    difficulty: 'intermediate',
    estimatedTime: 50,
    content: `## OSI Model (7 Layers)

The OSI model standardizes networking functions into 7 layers. Each layer serves the layer above and is served by the layer below.

| Layer | Number | Name | Function | Protocols |
|-------|--------|------|----------|-----------|
| L7 | 7 | Application | User interface, services | HTTP, FTP, SMTP, DNS |
| L6 | 6 | Presentation | Encryption, compression, translation | SSL/TLS, JPEG |
| L5 | 5 | Session | Session establishment, management | NetBIOS, RPC |
| L4 | 4 | Transport | End-to-end communication, segmentation | TCP, UDP |
| L3 | 3 | Network | Routing, logical addressing | IP, ICMP, OSPF |
| L2 | 2 | Data Link | Framing, MAC addressing, error detection | Ethernet, Wi-Fi |
| L1 | 1 | Physical | Bits over physical medium | Cables, Hubs |

**Mnemonic:** "All People Seem To Need Data Processing" (Application→Physical) or "Please Do Not Throw Sausage Pizza Away" (Physical→Application).

---

## TCP/IP Model (4 Layers)

Practical model used on the internet:
- **Application:** HTTP, FTP, DNS, SMTP
- **Transport:** TCP, UDP
- **Internet:** IP, ICMP
- **Network Access:** Ethernet, Wi-Fi

---

## TCP vs UDP

**TCP (Transmission Control Protocol):**
- Connection-oriented (3-way handshake: SYN, SYN-ACK, ACK).
- Reliable: guarantees delivery, ordering, error checking.
- Flow control (prevent sender from overwhelming receiver).
- Congestion control (adjust to network capacity).
- Slower. Used for: HTTP/HTTPS, email, file transfer, SSH.

**UDP (User Datagram Protocol):**
- Connectionless. No handshake.
- Unreliable: no delivery guarantee, no ordering.
- Much faster, low overhead.
- Used for: DNS, video streaming, gaming, VoIP, live broadcasts.

**When to use UDP:** When speed > reliability. Data can be dropped/reordered without catastrophic result. Example: video call — a dropped frame is better than waiting for retransmission.

---

## HTTP vs HTTPS

**HTTP (HyperText Transfer Protocol):** Application layer protocol for web. Stateless. Default port 80. Data sent in plain text.

**HTTPS (HTTP Secure):** HTTP over TLS/SSL. Encrypts data in transit. Port 443. Prevents man-in-the-middle attacks.

**HTTP Methods:**
- GET: retrieve resource (idempotent, no body).
- POST: create resource (not idempotent, has body).
- PUT: update/replace resource completely (idempotent).
- PATCH: partial update.
- DELETE: delete resource.

**HTTP Status Codes:**
- 2xx Success: 200 OK, 201 Created, 204 No Content.
- 3xx Redirect: 301 Moved Permanently, 302 Found.
- 4xx Client Error: 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found.
- 5xx Server Error: 500 Internal Server Error, 503 Service Unavailable.

---

## DNS (Domain Name System)

DNS resolves domain names to IP addresses. It is the "phone book of the internet."

**Resolution order:** Browser cache → OS cache → Router cache → Recursive resolver → Root nameserver → TLD nameserver → Authoritative nameserver → IP address returned.

---

## IP Addressing

**IPv4:** 32-bit address. Written as 4 octets: 192.168.1.1. ~4.3 billion addresses.
**IPv6:** 128-bit address. Written as 8 groups of hex. Solves address exhaustion.

**Private IP ranges:**
- 10.0.0.0/8
- 172.16.0.0/12
- 192.168.0.0/16

**Subnet mask:** Determines which part of IP is network and which is host.

---

## Routing

**Routers** operate at Layer 3 (Network). Forward packets based on IP routing tables.
**Switches** operate at Layer 2 (Data Link). Forward frames based on MAC addresses.
**Hubs** operate at Layer 1 (Physical). Broadcast to all ports.

**Routing Protocols:**
- **OSPF:** Interior gateway protocol. Link-state routing. Uses Dijkstra's algorithm.
- **BGP:** Border Gateway Protocol. Exterior gateway protocol. Internet's backbone routing protocol.`,
    codeExamples: [
      {
        title: 'What Happens When You Type a URL',
        code: `You type: https://www.google.com

1. DNS Resolution:
   - Browser checks its own cache.
   - OS checks hosts file and DNS cache.
   - If not found, asks configured DNS server (ISP or 8.8.8.8).
   - Recursive resolution: Root NS → .com TLD NS → google.com NS → IP.
   - Result: www.google.com → 142.250.x.x

2. TCP Connection (3-way handshake):
   Browser → Server: SYN (want to connect?)
   Server → Browser: SYN-ACK (OK, ready)
   Browser → Server: ACK (acknowledged)
   [Connection established]

3. TLS Handshake (for HTTPS):
   - Exchange certificates (server proves identity).
   - Negotiate cipher suite.
   - Exchange session keys.
   - [Encrypted channel established]

4. HTTP Request:
   GET / HTTP/1.1
   Host: www.google.com
   [Headers...]

5. Server responds with HTTP 200 + HTML.

6. Browser parses HTML, requests CSS/JS/images.
7. Page renders.`,
        explanation: 'This exact sequence is asked in almost every technical interview. Memorize each step.',
      },
      {
        title: 'TCP vs UDP — Decision',
        code: `Use TCP when:
✓ Downloading a file (every byte must arrive)
✓ Loading a webpage (HTML must be complete)
✓ Sending email (message cannot be partially lost)
✓ Database queries (data integrity critical)
✓ SSH, SFTP, HTTP, HTTPS

Use UDP when:
✓ Video call (dropped frame OK, low latency required)
✓ Online gaming (real-time, latency > reliability)
✓ DNS queries (fast lookup, single packet, retry if lost)
✓ Live video streaming (occasional drops acceptable)
✓ VoIP (voice call)

The test:
Q: Would a dropped packet cause catastrophic data loss?
YES → TCP. NO (tolerable) → UDP.`,
        explanation: 'TCP = correctness. UDP = speed. Choose based on whether dropped packets are catastrophic.',
      },
    ],
    commonMistakes: [
      'Mixing up OSI and TCP/IP layers — OSI has 7, TCP/IP has 4.',
      'Saying routers work at Layer 2 — routers work at Layer 3 (Network). Switches are Layer 2.',
      'Confusing stateless (HTTP) with connectionless (UDP) — HTTP is stateless but runs on TCP (connection-oriented).',
      'Forgetting that HTTPS is HTTP + TLS, not a separate protocol entirely.',
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between TCP and UDP? When would you use each?',
        answer: 'TCP is connection-oriented (3-way handshake), reliable (guaranteed delivery, ordering), has flow and congestion control, slower. UDP is connectionless, unreliable (no guarantee), fast, low overhead. Use TCP for file transfer, HTTP, email, SSH — where every byte matters. Use UDP for video streaming, gaming, DNS, VoIP — where speed matters more than reliability.',
        difficulty: 'beginner',
      },
      {
        question: 'What happens when you type a URL and hit Enter?',
        answer: 'DNS resolution (domain → IP). TCP 3-way handshake. TLS handshake (for HTTPS). HTTP GET request sent. Server returns HTML response. Browser parses HTML, fetches referenced resources (CSS, JS, images). Page renders.',
        difficulty: 'intermediate',
      },
      {
        question: 'What is the purpose of the OSI model?',
        answer: 'The OSI model is a conceptual framework that standardizes networking functions into 7 layers. It allows different networking equipment and software to interoperate. Each layer handles a specific concern: physical transmission, data framing, routing, transport reliability, session management, data formatting, and application services. In practice, TCP/IP (4 layers) is used, but OSI is used for education and troubleshooting.',
        difficulty: 'beginner',
      },
    ],
    exercises: [
      {
        id: 'cn-ex-1',
        title: 'Layer Identification',
        description: 'At which OSI layer does each operate: (a) IP addressing, (b) HTTP, (c) MAC addressing, (d) encryption.',
        starterCode: `// (a) IP addressing → Layer 3 (Network)
// (b) HTTP → Layer 7 (Application)
// (c) MAC addressing → Layer 2 (Data Link)
// (d) Encryption (TLS/SSL) → Layer 6 (Presentation)`,
        solution: `(a) L3 Network, (b) L7 Application, (c) L2 Data Link, (d) L6 Presentation.`,
        hints: ['IP=Network, HTTP=Application, MAC=Data Link, SSL/TLS=Presentation'],
        expectedOutput: 'L3, L7, L2, L6',
      },
    ],
    keyTakeaways: [
      'OSI 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, Application.',
      'TCP = reliable, ordered, connection-oriented. UDP = fast, unreliable, connectionless.',
      'Routers = Layer 3 (IP). Switches = Layer 2 (MAC). Hubs = Layer 1.',
      'HTTPS = HTTP + TLS. Port 80 for HTTP, 443 for HTTPS.',
      'DNS resolves domain to IP: browser cache → OS → resolver → root → TLD → authoritative.',
    ],
    prevLesson: 'dbms',
    nextLesson: 'oop',
  },
  {
    id: 'oop',
    slug: 'oop',
    title: 'Object-Oriented Programming',
    description: 'Encapsulation, abstraction, inheritance, polymorphism, SOLID — complete OOP interview prep.',
    category: 'CS Fundamentals',
    order: 27,
    difficulty: 'intermediate',
    estimatedTime: 50,
    content: `## The Four Pillars of OOP

OOP organizes code around objects — entities that combine data (attributes) and behavior (methods). The four pillars are the foundation of every technical interview.

---

## 1. Encapsulation

**Definition:** Bundling data and methods that operate on that data within a class, and restricting direct access to some components.

**Why it exists:** Prevents invalid state. External code cannot corrupt internal data.

**How:** Make fields private. Expose controlled access via public getters/setters.

**Real example:** A BankAccount class hides the balance field (private). Only the deposit() and withdraw() methods can change it — and they validate the operation first.

---

## 2. Abstraction

**Definition:** Hiding implementation details and exposing only essential functionality to the user.

**Why it exists:** Reduces complexity. Users interact with a simple interface without knowing internal workings.

**How:** Abstract classes and interfaces define WHAT to do. Concrete classes define HOW.

**Real example:** You use a Car by turning the steering wheel and pressing pedals — you don't know how the engine works internally. The car abstracts its complexity.

---

## 3. Inheritance

**Definition:** A child class (subclass) acquires properties and behaviors of a parent class (superclass).

**Why it exists:** Code reuse. Avoids duplication. Establishes "IS-A" relationship.

**Types:**
- Single: one parent → one child.
- Multi-level: A → B → C.
- Multiple: two parents (C++ supports, Java doesn't — uses interfaces instead).
- Hierarchical: one parent, multiple children.

**Key concept:** Method overriding — child redefines a parent method with same signature.

---

## 4. Polymorphism

**Definition:** One interface, many forms. Same method call behaves differently based on context.

**Compile-time (Static) Polymorphism:** Method overloading — same name, different parameters.
int add(int a, int b) vs float add(float a, float b).

**Runtime (Dynamic) Polymorphism:** Method overriding — subclass overrides parent method. The correct version is selected at runtime based on object type.

**Example:** Animal.speak(). Dog.speak() → "Woof". Cat.speak() → "Meow". Same call, different behavior.

---

## SOLID Principles

**S — Single Responsibility:** A class should have only one reason to change. One class, one job.

**O — Open/Closed:** Open for extension, closed for modification. Add new features by adding new code, not changing existing code.

**L — Liskov Substitution:** Subclasses should be substitutable for their base class without breaking the program.

**I — Interface Segregation:** Clients should not be forced to depend on interfaces they don't use. Many specific interfaces > one general interface.

**D — Dependency Inversion:** Depend on abstractions, not concretions. High-level modules should not depend on low-level modules.

---

## Abstract Class vs Interface

| Feature | Abstract Class | Interface |
|---------|----------------|-----------|
| Methods | Can have abstract + concrete | All abstract (Java 7). Default methods (Java 8+) |
| Variables | Can have state (fields) | Only constants |
| Inheritance | Single inheritance | Multiple implementation |
| Constructor | Yes | No |
| Use when | "IS-A" with shared code | Defining a contract |

---

## Overloading vs Overriding

| Feature | Overloading | Overriding |
|---------|-------------|-----------|
| Type | Compile-time | Runtime |
| Where | Same class | Parent+Child |
| Signature | Different | Same |
| Return type | Can differ | Must be same (or covariant) |
| Access modifier | Any | Cannot restrict |`,
    codeExamples: [
      {
        title: 'All Four Pillars — Code Example',
        code: `// ENCAPSULATION: private fields, public methods
class BankAccount {
  private double balance;  // hidden

  public void deposit(double amount) {
    if (amount > 0) balance += amount;  // validated
  }

  public double getBalance() { return balance; }
}

// ABSTRACTION: hide complexity behind interface
interface Shape {
  double area();  // what, not how
}

class Circle implements Shape {
  private double radius;
  Circle(double r) { radius = r; }
  public double area() { return Math.PI * radius * radius; }  // how
}

// INHERITANCE: child reuses parent
class Animal {
  String name;
  void eat() { System.out.println(name + " eats."); }
}

class Dog extends Animal {
  void speak() { System.out.println("Woof!"); }  // new behavior
}

// POLYMORPHISM: same interface, different behavior
Animal a = new Dog();  // runtime polymorphism
a.eat();  // Animal's eat (not overridden)
// a.speak(); // Compile error — Animal reference doesn't know about speak

// Method overloading (compile-time polymorphism):
class Calculator {
  int add(int a, int b) { return a + b; }
  double add(double a, double b) { return a + b; }  // overloaded
}`,
        explanation: 'Study each pillar in code form — interviews often ask "show me an example" in addition to definition.',
      },
      {
        title: 'Runtime Polymorphism — Interview Favorite',
        code: `class Shape {
  void draw() { System.out.println("Drawing a shape"); }
}

class Circle extends Shape {
  @Override
  void draw() { System.out.println("Drawing a circle"); }
}

class Square extends Shape {
  @Override
  void draw() { System.out.println("Drawing a square"); }
}

// Usage:
Shape[] shapes = { new Circle(), new Square(), new Shape() };
for (Shape s : shapes) {
  s.draw();  // Which method is called? Determined at RUNTIME.
}

// Output:
// Drawing a circle
// Drawing a square
// Drawing a shape

// This is polymorphism: same s.draw() call → different behavior
// based on actual object type, not reference type.`,
        explanation: 'Runtime polymorphism: the reference type is Shape, but the actual object determines which draw() runs. Enabled by method overriding + virtual dispatch.',
      },
    ],
    commonMistakes: [
      'Confusing overloading (same class, different parameters) with overriding (parent-child, same signature).',
      'Saying abstract class and interface are the same — abstract class can have state and concrete methods; interface cannot (before Java 8).',
      'Forgetting Liskov Substitution — if subclass breaks parent behavior, that\'s a violation.',
      'Thinking "encapsulation = just making fields private" — it is about controlled access with validation.',
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between abstraction and encapsulation?',
        answer: 'Abstraction hides complexity — the WHAT. Encapsulation hides implementation details and protects data — the HOW. Abstraction is achieved via abstract classes and interfaces. Encapsulation is achieved via access modifiers (private/public). Example: ATM interface (what buttons do) = abstraction. ATM internal mechanism (how cash is dispensed) = encapsulation.',
        difficulty: 'intermediate',
      },
      {
        question: 'Can we override a static method in Java?',
        answer: 'No. Static methods belong to the class, not the object. They are resolved at compile time (early binding), not at runtime (late binding). You can declare a static method with the same name in a subclass (called hiding, not overriding), but polymorphism does not apply — the method called depends on the reference type, not the object type.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'oop-ex-1',
        title: 'Identify the Pillar',
        description: 'For each scenario, identify which OOP pillar is being demonstrated: (a) A Manager class extends Employee. (b) A Vehicle interface with a drive() method. (c) printArea() works differently for Circle and Rectangle. (d) Balance field is private in BankAccount.',
        starterCode: `// (a) Manager extends Employee → Inheritance
// (b) Vehicle interface → Abstraction
// (c) printArea() different behavior → Polymorphism
// (d) Private balance → Encapsulation`,
        solution: `(a) Inheritance, (b) Abstraction, (c) Polymorphism, (d) Encapsulation.`,
        hints: ['Each pillar has a distinct purpose: reuse, hide, same-interface-different-behavior, protect-data'],
        expectedOutput: 'Inheritance, Abstraction, Polymorphism, Encapsulation',
      },
    ],
    keyTakeaways: [
      'Encapsulation = protect data via private fields + public methods.',
      'Abstraction = hide complexity, expose interface only.',
      'Inheritance = code reuse, IS-A relationship, method overriding.',
      'Polymorphism = one interface, many forms. Compile-time=overloading. Runtime=overriding.',
      'SOLID: Single Responsibility, Open/Closed, Liskov, Interface Segregation, Dependency Inversion.',
    ],
    prevLesson: 'computer-networks',
    nextLesson: 'software-engineering',
  },
  {
    id: 'software-engineering',
    slug: 'software-engineering',
    title: 'Software Engineering',
    description: 'SDLC, Agile, Scrum, Git workflow, and engineering practices — for technical interviews.',
    category: 'CS Fundamentals',
    order: 28,
    difficulty: 'beginner',
    estimatedTime: 40,
    content: `## SDLC (Software Development Life Cycle)

SDLC is the process for planning, creating, testing, and deploying software.

**Phases:**
1. **Planning:** Scope, feasibility, resources, schedule.
2. **Requirements:** Gather and document what the system must do (functional and non-functional).
3. **Design:** System architecture, database design, API design, UI wireframes.
4. **Implementation:** Actual coding.
5. **Testing:** Unit, integration, system, UAT testing.
6. **Deployment:** Release to production.
7. **Maintenance:** Bug fixes, enhancements.

---

## Waterfall vs Agile

**Waterfall:**
- Sequential phases — one phase fully complete before next starts.
- Requirements frozen at start.
- Suitable for projects with fixed, well-understood requirements.
- Hard to accommodate changes mid-project.
- Extensive documentation.

**Agile:**
- Iterative and incremental delivery.
- Working software in short cycles (sprints: 1-4 weeks).
- Adapts to changing requirements.
- Customer collaboration throughout.
- Less documentation, more working software.
- Suitable for most modern software projects.

---

## Scrum

Scrum is the most popular Agile framework.

**Key Roles:**
- **Product Owner:** Defines and prioritizes the product backlog. Represents business.
- **Scrum Master:** Facilitates the process, removes impediments, coaches the team.
- **Development Team:** Cross-functional, self-organizing, typically 3-9 people.

**Key Artifacts:**
- **Product Backlog:** Ordered list of all features/requirements.
- **Sprint Backlog:** Work selected for current sprint.
- **Increment:** Potentially shippable product at end of sprint.

**Key Ceremonies:**
- **Sprint Planning:** What will we do this sprint?
- **Daily Standup (15 min):** What did I do? What will I do? Any blockers?
- **Sprint Review:** Demo the increment to stakeholders.
- **Sprint Retrospective:** How can we improve our process?

---

## Git Workflow

**Basic flow:**
main branch → feature branch → Pull Request → code review → merge to main.

**Common commands:**
- git clone, git init — start a repo
- git add, git commit — stage and commit changes
- git push, git pull — sync with remote
- git branch, git checkout — manage branches
- git merge, git rebase — integrate changes
- git stash — save uncommitted changes temporarily

**Git Flow:**
- main: production-ready code only.
- develop: integration branch.
- feature/xxx: new features.
- hotfix/xxx: urgent production fixes.
- release/xxx: release preparation.

---

## Engineering Practices

**Code Review:** Peer review of code before merging. Catches bugs, enforces standards.

**TDD (Test-Driven Development):** Write test first, then write code to make it pass, then refactor.

**CI/CD:** Continuous Integration (auto-build and test on every commit) + Continuous Delivery (auto-deploy to staging) / Deployment (auto-deploy to production).

**DRY (Don't Repeat Yourself):** Every piece of knowledge should have a single, unambiguous representation.

**KISS (Keep It Simple, Stupid):** Simple solutions are better than complex ones.

**YAGNI (You Aren't Gonna Need It):** Don't add functionality until you need it.`,
    codeExamples: [
      {
        title: 'Git Workflow — Feature Development',
        code: `# Standard feature branch workflow:

# 1. Start from latest main:
git checkout main
git pull origin main

# 2. Create feature branch:
git checkout -b feature/user-authentication

# 3. Make changes, commit frequently:
git add src/auth.js
git commit -m "Add JWT token generation"
git add src/middleware.js
git commit -m "Add auth middleware"

# 4. Push to remote:
git push origin feature/user-authentication

# 5. Open Pull Request on GitHub/GitLab

# 6. After review and approval, merge to main:
git checkout main
git merge feature/user-authentication
git push origin main

# 7. Delete feature branch:
git branch -d feature/user-authentication`,
        explanation: 'This is the standard workflow at every tech company. Know it thoroughly — it is asked in interviews.',
      },
      {
        title: 'Agile vs Waterfall Decision',
        code: `Choose WATERFALL when:
✓ Requirements are fixed and well-understood upfront
✓ Technology is mature and well-understood
✓ Project is short with no expected changes
✓ Client is not available for ongoing collaboration
✓ Examples: government projects, construction contracts

Choose AGILE when:
✓ Requirements likely to change
✓ Innovation/exploration involved
✓ Customer feedback is important
✓ Frequent delivery is valued
✓ Examples: SaaS products, startups, web apps

Real answer in interviews:
"Agile for most modern software. Waterfall for projects with
contractual fixed requirements where scope cannot change."`,
        explanation: 'Interviews ask: "What is Agile?" and "When would you not use Agile?" Both are equally important.',
      },
    ],
    commonMistakes: [
      'Saying "Agile has no documentation" — Agile prioritizes working software OVER excessive documentation, but does not eliminate it.',
      'Confusing Agile (methodology) with Scrum (framework implementing Agile).',
      'Not knowing that Scrum Master is NOT a manager — they facilitate, not command.',
      'Saying "git push -f" (force push) is normal — in real teams this is destructive and never done on shared branches.',
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between Agile and Waterfall?',
        answer: 'Waterfall is sequential — each phase (requirements, design, implementation, testing, deployment) completes before the next starts. Requirements are fixed at the beginning. Agile is iterative — requirements evolve, software is delivered in short sprints (1-4 weeks), and customer feedback shapes each iteration. Agile adapts to change; Waterfall resists it.',
        difficulty: 'beginner',
      },
      {
        question: 'What is a Pull Request and why is it important?',
        answer: 'A Pull Request (PR) is a request to merge code from a feature branch into the main branch. It triggers a code review where other developers examine the changes for correctness, style, security, and adherence to standards. PRs are important because they: catch bugs before production, share knowledge across the team, enforce coding standards, maintain a clean main branch, and create a history of why changes were made.',
        difficulty: 'beginner',
      },
    ],
    exercises: [
      {
        id: 'se-ex-1',
        title: 'SDLC Phase Identification',
        description: 'Identify the SDLC phase: (a) Writing unit tests. (b) Gathering user stories. (c) Creating ER diagrams. (d) Deploying to AWS.',
        starterCode: `// (a) Writing unit tests → Testing phase
// (b) Gathering user stories → Requirements phase
// (c) Creating ER diagrams → Design phase
// (d) Deploying to AWS → Deployment phase`,
        solution: `(a) Testing, (b) Requirements, (c) Design, (d) Deployment.`,
        hints: ['Match each activity to its SDLC phase'],
        expectedOutput: 'Testing, Requirements, Design, Deployment',
      },
    ],
    keyTakeaways: [
      'SDLC phases: Planning, Requirements, Design, Implementation, Testing, Deployment, Maintenance.',
      'Waterfall = sequential. Agile = iterative sprints with frequent delivery.',
      'Scrum: Product Owner (what), Scrum Master (process), Dev Team (how).',
      'Git: main=production, feature branches, Pull Requests, code review before merge.',
      'DRY, KISS, YAGNI — principles that make code maintainable.',
    ],
    prevLesson: 'oop',
    nextLesson: 'online-assessment-prep',
  },

  // ════════════════════════════════════════════════════════════════════════════
  // SECTION 5 — PLACEMENT PREPARATION
  // ════════════════════════════════════════════════════════════════════════════
  {
    id: 'online-assessment-prep',
    slug: 'online-assessment-prep',
    title: 'Online Assessment Preparation',
    description: 'OA patterns, time management, strategy, and company-specific assessment types.',
    category: 'Placement Preparation',
    order: 29,
    difficulty: 'intermediate',
    estimatedTime: 40,
    content: `## What is an Online Assessment (OA)?

An Online Assessment (OA) is the first filter in most campus placements and off-campus applications. It typically runs for 60-120 minutes and covers multiple sections.

Clearing the OA is the hardest step for most students — not because questions are difficult, but because students are not prepared for the FORMAT.

---

## Standard OA Structure

**Section 1: Quantitative Aptitude (20-25 questions, 25-35 min)**
Number system, percentage, profit/loss, time-work, time-speed, P&C, probability.

**Section 2: Logical Reasoning (15-20 questions, 20-30 min)**
Series, coding-decoding, blood relations, seating, syllogism, puzzles.

**Section 3: Verbal Ability (15-20 questions, 20 min)**
RC, grammar, vocabulary, sentence improvement.

**Section 4: Coding (1-3 problems, 30-45 min)**
For SDE roles. Easy-medium level DSA problems.

---

## Company-Specific OA Patterns

**TCS:**
- TCS NQT: 4 sections — Verbal, Reasoning, Numerical, Coding.
- Verbal section is heavy (many grammar and RC questions).
- Coding: 2 questions, focus on arrays and strings.
- Time: 180 minutes total.

**Infosys:**
- Infosys InfyTQ: Math, Reasoning, Verbal, Coding.
- Heavy on aptitude and reasoning.
- Coding is Python/Java focused.

**Wipro:**
- AMCAT-based test.
- Similar structure: aptitude + reasoning + verbal + coding.

**Cognizant:**
- GenC: aptitude + communication + coding.
- Communication section: email writing, spoken English.

**Amazon/Google/Microsoft (off-campus):**
- Coding focused: 2-3 medium/hard problems.
- No aptitude/verbal section typically.
- LeetCode-style questions.

---

## Time Management Strategy

**Golden rule: Don't get stuck. Move on.**

Every question has equal marks. A question you skip has the same marks as one you solve in 10 minutes.

**Recommended approach per section:**
1. Scan all questions (30 seconds): identify easy, medium, hard.
2. Solve all easy questions first. Mark medium for later. Skip hard.
3. Return to medium questions.
4. Attempt hard questions only if time remains.

**Target times:**
- Aptitude: 90 seconds per question maximum.
- Reasoning: 90-120 seconds per question.
- Verbal: 45-60 seconds per question (except RC: 2 min/question).

---

## Score Strategy with Negative Marking

If negative marking exists (usually -0.25 for wrong):
- Attempt only if ≥60% confident (expected value becomes positive).
- Skip if less than 60% certain.

If no negative marking: attempt everything — eliminate 1-2 options and make an educated guess.

---

## Day-Before Preparation

1. Sleep 7-8 hours. Cognitive function drops 20-30% with poor sleep.
2. Do 10-15 easy aptitude + reasoning questions to warm up.
3. Review shortcuts (percentage, profit/loss, time-work).
4. Do NOT try to learn new topics the day before.
5. Keep calculator allowed or not, as per test rules.`,
    codeExamples: [
      {
        title: 'OA Time Budget — Example 90-minute Test',
        code: `TCS NQT Structure (180 min):
  Verbal: 24 questions, 40 min → ~100 seconds/question
  Reasoning: 30 questions, 50 min → ~100 seconds/question
  Numerical: 26 questions, 40 min → ~92 seconds/question
  Coding: 2 problems, 30 min → 15 min/problem

Strategy:
  Verbal: Skip RC first, do grammar/vocab, return to RC.
  Reasoning: Start with series, coding-decoding (fast).
  Skip seating/arrangement, do last.
  Numerical: Do % and profit/loss first, skip complex problems.
  Coding: Problem 1 first completely. Problem 2 partial if needed.

Common mistake: Spending 8 minutes on one hard aptitude question.
That's 5 easy questions worth of time wasted.`,
        explanation: 'Budget time per section before starting. Adjust mid-test if needed.',
      },
    ],
    commonMistakes: [
      'Spending disproportionate time on hard questions at the cost of easy ones.',
      'Not practicing under timed conditions — knowing concepts ≠ solving under pressure.',
      'Skipping the communication/verbal section — it is high-impact and underestimated.',
      'Not reading question instructions carefully — some OAs have section-level time limits.',
    ],
    interviewQuestions: [
      {
        question: 'How do you prepare for a company\'s OA in 1 week?',
        answer: 'Day 1-2: Aptitude shortcuts (%, profit/loss, time-work, TSD). Day 3-4: Reasoning (series, seating, syllogism). Day 5: Verbal (grammar rules, RC strategy). Day 6: Full mock test in timed condition. Day 7: Review mistakes, warm up. Find the company\'s previous OA questions on Glassdoor/PrepInsta. Practice those exact patterns.',
        difficulty: 'beginner',
      },
    ],
    exercises: [
      {
        id: 'oa-ex-1',
        title: 'Speed Drill',
        description: 'Solve these in under 60 seconds each: (a) 15% of 840? (b) HCF(36, 48)? (c) Train 300m at 72 km/h: time to cross a pole?',
        starterCode: `// (a) 15% of 840 = 10%×840 + 5%×840 = 84 + 42 = 126
// (b) HCF(36,48): 48=36×1+12, 36=12×3+0 → HCF=12
// (c) 72 km/h = 20 m/s. Time = 300/20 = 15 seconds`,
        solution: `(a) 126, (b) 12, (c) 15 seconds`,
        hints: ['Break 15% into 10%+5% for mental math. Use Euclid for HCF. Convert to m/s for train.'],
        expectedOutput: '126, 12, 15 seconds',
      },
    ],
    keyTakeaways: [
      'OA sections: Aptitude + Reasoning + Verbal + Coding. Know the structure for your target company.',
      'Time strategy: easy → medium → hard. Never get stuck on one question.',
      'Negative marking: attempt only if 60%+ confident.',
      'Practice under timed conditions — exam performance ≠ relaxed practice performance.',
      'Day before: rest and warm-up only. No new topics.',
    ],
    prevLesson: 'software-engineering',
    nextLesson: 'resume-screening',
  },
  {
    id: 'resume-screening',
    slug: 'resume-screening',
    title: 'Resume & ATS',
    description: 'Resume writing, ATS optimization, common mistakes, and strong resume examples for tech roles.',
    category: 'Placement Preparation',
    order: 30,
    difficulty: 'beginner',
    estimatedTime: 35,
    content: `## Why Resume Screening Matters

At large companies (TCS, Infosys, Amazon), your resume is screened before a human even sees it — by an ATS (Applicant Tracking System). Many excellent candidates are rejected at this stage by accident.

Even after ATS, a recruiter spends 6-10 seconds scanning your resume before deciding to read further or move on.

---

## ATS (Applicant Tracking System)

ATS software parses your resume and ranks it based on keyword match with the job description.

**ATS rules:**
- Use standard section headings: "Work Experience," "Education," "Skills" — not creative names like "My Journey."
- Avoid tables, columns, text boxes, images — ATS cannot parse them.
- Use a simple single-column format.
- Save as PDF from a text editor (not a scanned image).
- Include keywords from the job description naturally in your text.

---

## Resume Structure for Tech Roles

**Header:** Name, Phone, Email, LinkedIn, GitHub.
**Summary (optional):** 2-3 lines. What you bring and what you seek.
**Education:** College, degree, year, CGPA (if ≥7.5).
**Experience/Internships:** Most important section for experienced. Reverse chronological.
**Projects:** Most important for freshers. 3-4 strong projects.
**Skills:** Languages, frameworks, tools, databases. Keep it factual.
**Achievements/Awards:** Competitive programming ranks, hackathon wins, academic honors.

---

## Writing Strong Bullet Points

**Format:** Action verb + What you did + Impact/Result.

**Weak:** "Worked on the backend API."
**Strong:** "Designed and implemented RESTful APIs using Node.js, reducing response latency by 40% through caching with Redis."

**Weak:** "Made a website for college fest."
**Strong:** "Developed a college fest registration portal (React + Node.js) handling 2000+ registrations with automated email confirmation, reducing manual work by 90%."

**Impact verbs:** Built, Developed, Designed, Implemented, Optimized, Reduced, Increased, Automated, Led, Deployed, Architected, Migrated.

---

## Common Resume Mistakes

1. **Generic objective statement:** "I am a hardworking person seeking a challenging role..." → Delete it. Use specific skills.
2. **Responsibilities without impact:** "Was responsible for testing" → "Wrote 150+ unit tests, achieving 90% code coverage."
3. **Irrelevant skills:** Don't list MS Word or PowerPoint for a software engineering role.
4. **Inconsistent formatting:** Mix of fonts, sizes, alignment — looks unprofessional.
5. **More than 1 page (for freshers):** Recruiters scan. Keep it tight. 2 pages acceptable for 3+ years experience.
6. **No GitHub/LinkedIn link:** For software roles, this is a missed opportunity.
7. **Typos:** Automatic rejection at many companies. Proofread 3 times.

---

## ATS Keywords by Role

**Backend Developer:** REST API, Microservices, SQL, NoSQL, Docker, Kubernetes, AWS, CI/CD.
**Frontend Developer:** React, JavaScript, TypeScript, HTML, CSS, REST API, Jest.
**Full Stack:** Node.js, Express, MongoDB, React, PostgreSQL, Redis.
**Data Science:** Python, pandas, NumPy, scikit-learn, TensorFlow, SQL.`,
    codeExamples: [
      {
        title: 'Before and After: Resume Bullets',
        code: `BEFORE (weak):
• Worked on a project using React.
• Fixed bugs in the backend.
• Helped in deployment of the application.
• Participated in daily standups.

AFTER (strong):
• Built an e-commerce product catalog (React, Redux) with
  dynamic filtering, serving 500+ products across 20 categories.
• Resolved 15 critical bugs in the payment processing module
  (Node.js), reducing checkout failures by 35%.
• Automated CI/CD pipeline using GitHub Actions, reducing
  deployment time from 45 minutes to 8 minutes.
• Contributed to Agile sprint planning and daily standups in a
  6-person cross-functional team.

Rule: Every bullet = Action + What + Measurable Impact.`,
        explanation: 'The difference is quantification and specificity. Even estimated numbers are better than no numbers.',
      },
      {
        title: 'Skills Section — What to Include',
        code: `WRONG (generic):
Skills: C, C++, Java, Python, JavaScript, HTML, CSS,
MySQL, MongoDB, Git, Docker, AWS, Kubernetes, React,
Node.js, Express, Spring Boot, Django, Flask...
(Lists 25 things — recruiter doesn't believe any of them)

RIGHT (honest + categorized):
Languages: Java, Python, JavaScript
Frameworks: React, Node.js, Express
Databases: PostgreSQL, MongoDB, Redis
Tools: Git, Docker, GitHub Actions, Postman
Cloud: AWS (EC2, S3, Lambda) — familiar

Rule: Only list what you can discuss confidently in an interview.
Rate yourself: Expert/Proficient/Familiar. List only Expert and Proficient.`,
        explanation: 'Listing 30 technologies signals desperation, not expertise. Quality over quantity in skills section.',
      },
    ],
    commonMistakes: [
      'Using tables and columns — ATS cannot parse them, your data gets lost.',
      'Writing responsibilities instead of achievements — "Responsible for X" vs "Achieved X resulting in Y."',
      'Listing skills you cannot discuss — you will be asked about every skill in your resume.',
      'Using photos — illegal to request in many countries, and ATS rejects image-heavy resumes.',
    ],
    interviewQuestions: [
      {
        question: 'Walk me through your resume.',
        answer: 'This is a structured 2-minute pitch, not a line-by-line reading. Structure: "I am a final-year CS student at [college] with a CGPA of [X]. My strongest technical areas are [2-3 skills]. In my most impactful project, I built [project] which [what it does and impact]. I also interned at [company] where I [key contribution]. I am excited about [what this role involves] because [genuine reason]."',
        difficulty: 'beginner',
      },
    ],
    exercises: [
      {
        id: 'res-ex-1',
        title: 'Improve the Bullet',
        description: 'Rewrite this weak bullet: "Worked on a login feature for a web application."',
        starterCode: `// Weak: "Worked on a login feature for a web application."

// Strong version needs:
// - Action verb: "Implemented"
// - Specific tech: "JWT-based authentication"
// - Impact: "reducing session overhead by X%" or "supporting Y users"

// Example strong version:
// "Implemented JWT-based authentication with bcrypt password hashing
//  (Node.js, Express), enabling secure login for 1000+ users and
//  reducing auth API latency by 25%."`,
        solution: `"Implemented JWT-based authentication (Node.js, Express, bcrypt), enabling secure login for 1000+ users."`,
        hints: ['Action verb + specific technology + measurable impact'],
        expectedOutput: 'Action verb + tech + impact = strong bullet',
      },
    ],
    keyTakeaways: [
      'ATS rules: single-column, no tables/images, standard headings, keyword-rich.',
      'Bullet format: Action verb + What you did + Measurable impact.',
      'Only list skills you can confidently discuss in an interview.',
      'Keep to 1 page as a fresher. Quality over quantity.',
      'GitHub link is mandatory for software engineering roles.',
    ],
    prevLesson: 'online-assessment-prep',
    nextLesson: 'technical-interviews',
  },
  {
    id: 'technical-interviews',
    slug: 'technical-interviews',
    title: 'Technical Interviews',
    description: 'Interview structure, communication, thinking process, problem solving — complete guide.',
    category: 'Placement Preparation',
    order: 31,
    difficulty: 'intermediate',
    estimatedTime: 45,
    content: `## Technical Interview Structure

Most companies have 2-4 technical interview rounds:

**Round 1 (DSA/Coding):** 1-2 coding problems. 45-60 minutes. Focus on problem-solving approach, not just the answer.

**Round 2 (CS Fundamentals):** OS, DBMS, Networks, OOP questions. For SDE roles: also DSA.

**Round 3 (Design/Architecture):** System design for senior roles. For freshers: small design questions + project deep-dive.

**Round 4 (Bar Raiser/Final Technical):** At Amazon, this round is extra. Tests breadth and depth.

---

## The Thinking Process (Most Important Skill)

Interviewers evaluate HOW you think, not just whether you get the answer.

**The interview mindset:**
> "I am not expected to know everything. I am expected to think clearly and communicate well."

**Step-by-step problem-solving framework:**

**Step 1 — Understand:** Repeat the problem in your own words. Ask clarifying questions.
- "So I need to find X given Y, and the constraint is Z. Is that correct?"
- "What happens when the input is empty/negative/null?"
- "Is this a single-threaded or multi-threaded context?"

**Step 2 — Think aloud:** Share your thought process before writing code.
- "My first instinct is a brute-force O(n²) approach. Let me think if we can do better."
- "I see that this has overlapping subproblems, which suggests dynamic programming."

**Step 3 — Discuss approach:** Confirm with interviewer before coding.
- "I am going to use a HashMap to store frequencies. Does that direction work?"
- This prevents wasting 10 minutes on a wrong approach.

**Step 4 — Code cleanly:** Variable names matter. Add brief comments for complex steps.

**Step 5 — Test and trace:** Trace through your code with an example.
- "Let me check with this input: [example]. Here, this variable becomes X, so the output is Y."
- Then check edge cases: empty input, single element, max size.

**Step 6 — Analyze complexity:** State time and space complexity unprompted.
- "This runs in O(n log n) time due to the sort, and O(n) space for the auxiliary array."

---

## Common Coding Interview Topics by Frequency

**High frequency:**
- Arrays and strings (two pointers, sliding window, hashing)
- Linked lists (reversal, cycle detection, merge)
- Binary search and sorted arrays
- Trees (BFS, DFS, LCA, height)
- Dynamic programming (subsets, subsequences, knapsack)
- Stacks and queues (monotonic stack, BFS)

**Medium frequency:**
- Graphs (BFS, DFS, Dijkstra)
- Heaps (k-th largest, top-k elements)
- Backtracking (permutations, combinations, N-queens)

**Low frequency (senior roles):**
- Segment trees, Fenwick trees
- Network flow, string matching algorithms

---

## What to Do When Stuck

1. **Say it:** "I'm not immediately seeing the optimal approach. Let me think through what information we have."
2. **Go back to basics:** What data structure would help? Have I seen a similar problem?
3. **Reduce the problem:** Solve a smaller version first. "What if the array had only 2 elements?"
4. **Ask for a hint:** "Would it be okay to get a small nudge?" — Interviewers often help.
5. **Implement brute force first:** A working brute-force with analysis is better than no code.

---

## Project Deep-Dive Questions

Be ready to answer about every project on your resume:
- "Walk me through your most complex project."
- "What was the biggest technical challenge?"
- "What would you do differently now?"
- "How does it scale to 100x users?"
- "What design patterns did you use?"`,
    codeExamples: [
      {
        title: 'Demonstrating the Thinking Process',
        code: `Q: "Find two numbers in an array that sum to a target."

Step 1 - Clarify:
"Are there duplicate numbers? Can I use the same element twice?
Is the array sorted? What to return if no pair exists?"

Step 2 - Brute Force (say it):
"Naive approach: try every pair. O(n²) time, O(1) space.
For n=1000, that's a million operations — might be too slow."

Step 3 - Optimal (think aloud):
"If I store each element in a HashSet as I go,
for each new element X, I check if (target - X) exists.
That's O(1) lookup. Total: O(n) time, O(n) space."

Step 4 - Confirm:
"Shall I proceed with the HashMap approach?"

Step 5 - Code:
function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) {
      return [seen.get(complement), i];
    }
    seen.set(nums[i], i);
  }
  return [];
}

Step 6 - Trace:
"Input: [2,7,11,15], target=9. i=0: seen={2:0}. i=1: 9-7=2, seen has 2! Return [0,1]."

Step 7 - Complexity:
"O(n) time, O(n) space."`,
        explanation: 'This 7-step demo is exactly what a top candidate does. The interviewer sees structured thinking, communication, and coding ability.',
      },
    ],
    commonMistakes: [
      'Coding in silence — interviewers cannot evaluate your thinking if you don\'t vocalize it.',
      'Not clarifying ambiguities — wrong assumptions lead to wrong solutions.',
      'Writing code before discussing the approach — confirm approach first.',
      'Not testing the code — trace through at least one example and one edge case.',
      'Ignoring space complexity — always state BOTH time and space.',
    ],
    interviewQuestions: [
      {
        question: 'How do you handle a problem you have never seen before in an interview?',
        answer: 'Clarify the problem first. Think about what category it falls into (graph/DP/greedy/etc.). Start with brute force and analyze its complexity. Look for patterns: does it have overlapping subproblems (DP)? Optimal substructure? Sorted input (binary search)? Say your thoughts aloud — interviewers guide you. A clean brute-force solution with analysis is better than silence or a buggy optimal solution.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'ti-ex-1',
        title: 'Practice the Framework',
        description: 'Practice stating your approach for: "Find the maximum subarray sum." Before coding, what would you say?',
        starterCode: `// Step 1 Clarify: "Can the array have all negatives? Should I return the sum or the subarray?"
// Step 2 Brute: O(n²) — try all subarrays, track max sum.
// Step 3 Optimal: Kadane's algorithm — O(n). Keep running sum, reset when negative.
// Step 4 Confirm: "I'll use Kadane's algorithm. Shall I proceed?"`,
        solution: `Kadane's Algorithm: iterate, keep currentSum. If currentSum<0, reset to 0. Track maxSum throughout. O(n) time, O(1) space.`,
        hints: ['Think about when it helps to "restart" your running sum'],
        expectedOutput: 'Kadane\'s Algorithm — O(n) time, O(1) space',
      },
    ],
    keyTakeaways: [
      'Technical interviews evaluate thinking process, not just the answer.',
      '7 steps: Clarify → Brute force → Optimize → Confirm → Code → Test → Complexity.',
      'Always speak your thought process — silence is the biggest mistake.',
      'A clean brute-force with analysis > buggy optimal solution.',
      'Test your code with an example AND edge cases before saying "done."',
    ],
    prevLesson: 'resume-screening',
    nextLesson: 'hr-interviews',
  },
  {
    id: 'hr-interviews',
    slug: 'hr-interviews',
    title: 'HR Interviews',
    description: 'Tell me about yourself, strengths, weaknesses, behavioral questions — complete HR interview guide.',
    category: 'Placement Preparation',
    order: 32,
    difficulty: 'beginner',
    estimatedTime: 40,
    content: `## What is the HR Interview?

The HR interview is the final step in most campus and off-campus placement processes. It evaluates:
- Cultural fit: Do you align with company values?
- Communication: Can you articulate clearly?
- Attitude: Are you coachable, collaborative, resilient?
- Motivation: Why this company, why this role?

**Key truth:** HR interviews are rarely the elimination round for campus placements. But a poor performance here CAN override a strong technical performance at some companies. Never treat it as a formality.

---

## Tell Me About Yourself (2-minute answer)

This is asked in every HR interview. Prepare and rehearse it.

**Structure (P-E-R-T framework):**
- **P — Present:** Who you are now. "I am a final-year B.Tech Computer Science student at [college]."
- **E — Experience:** Key projects/internships. "I have worked on [project] and interned at [company] where I [key achievement]."
- **R — Relevant skills:** What makes you suitable. "My strongest areas are [1-2 skills relevant to the role]."
- **T — Target:** Why you want this role/company. "I am excited about [company] because [specific reason, not 'great company']."

---

## Common HR Questions and How to Answer

**Strengths:**
- Choose 2-3 genuine strengths.
- Each strength must have an example.
- Relevant to the role.
- Example: "I am detail-oriented. During my final year project, I caught a logic bug in our payment module that could have caused double charges — saved hours of debugging later."

**Weaknesses:**
- Choose a real weakness (not "I work too hard").
- Show self-awareness + what you are doing to improve.
- Not a weakness that is critical to the role.
- Example: "I sometimes struggle to delegate — I prefer doing things myself. I've been working on this by consciously assigning tasks to teammates and following up instead of taking over."

**Why this company?**
- Research the company: products, culture, recent news.
- Specific answer: name a product, an engineering blog, a value.
- NEVER say: "Good salary," "Big brand," "Best company in market."

**Where do you see yourself in 5 years?**
- Show ambition within a realistic trajectory.
- Align with company's growth opportunities.
- Example: "I want to grow into a senior engineer role where I own significant technical decisions. I see [company] as the right place because of [specific technical challenge here]."

---

## STAR Method (Behavioral Questions)

For questions starting with "Tell me about a time when..."

**S — Situation:** Context and background.
**T — Task:** What you needed to do.
**A — Action:** What you specifically did (focus here).
**R — Result:** Measurable outcome.

**Common behavioral questions:**
- Tell me about a conflict with a teammate.
- Describe a time you failed and what you learned.
- Tell me about a time you took initiative.
- How did you handle a very tight deadline?
- Describe a time you influenced someone without authority.

---

## Salary Negotiation

At campus placements, salary is usually fixed. For off-campus:
- Research market rate (Glassdoor, LinkedIn, Levels.fyi).
- Give a range, not a single number.
- "Based on my research and skills, I am looking at ₹X-Y LPA, but I am open to discussing based on total compensation."
- Never give a number first if asked "what are you expecting?" — ask them about the range first.

---

## Questions to Ask the Interviewer

Always prepare 2-3 questions. Asking good questions signals genuine interest.

Good questions:
- "What does success look like in this role in the first 6 months?"
- "What are the biggest technical challenges your team is working on?"
- "How does mentorship work here for new engineers?"
- "What does the onboarding process look like?"

Bad questions:
- "What is the salary?" (too early in process)
- "How many leaves do I get?" (first impression matters)`,
    codeExamples: [
      {
        title: 'STAR Method — Full Example',
        code: `Q: "Tell me about a time you faced a conflict in a team project."

S — Situation:
"During our final-year project, we were a team of 4 building a
web application. Two weeks before submission, my teammate
wanted to change the backend framework from Node.js to Django,
which would have meant rewriting 60% of our work."

T — Task:
"I needed to address this conflict constructively without
dismissing his concern, while protecting the project timeline."

A — Action:
"I suggested a structured 30-minute discussion where each person
stated their case with specific reasons. I created a simple
decision matrix: remaining work, team expertise, deadline risk.
Node.js scored higher on all three factors. I also proposed
documenting his Django idea for future projects — acknowledging
the merit of his suggestion without derailing our current work."

R — Result:
"We moved forward with Node.js. My teammate felt heard because
his idea was formally evaluated, not dismissed. We submitted
on time with a working demo, and the team dynamic actually
improved afterward — we had a clearer process for resolving
disagreements."

Note: The story shows conflict resolution, leadership, data-driven
thinking, and team management — even as a student.`,
        explanation: 'STAR keeps your answer structured. Spend 80% of time on Action — that\'s what interviewers are evaluating.',
      },
      {
        title: 'Tell Me About Yourself — Template',
        code: `"I am a final-year B.Tech Computer Science student at [College],
graduating in May 2025 with a CGPA of 8.4.

During my time in college, I have focused heavily on backend
development and system design. My most significant project was
building an e-commerce platform with [tech stack] that handles
real-time inventory updates and processes orders — the platform
is live and has been used by 200+ people in a pilot.

I also interned at [Company] last summer, where I optimized
database queries that reduced report generation time by 60%
using indexing and query rewriting.

I am most comfortable with Java and Python for backend and
have strong foundations in DSA and system design.

I am very excited about [Company] specifically because of your
work on [specific product/engineering challenge I researched].
I believe my skills in backend development align well with the
role, and I am eager to contribute and grow here."

Duration: ~90 seconds. Practice until smooth.`,
        explanation: 'This is not memorization — it is a practiced narrative. Know the structure, adapt to each company.',
      },
    ],
    commonMistakes: [
      '"Tell me about yourself" — starting with childhood or irrelevant background.',
      'Negative talk about previous college, professors, or companies — red flag for interviewers.',
      'Generic "why this company" answer — shows no research.',
      'Not having any questions to ask — signals low interest.',
      'Rambling — HR answers should be 1-2 minutes max unless a behavioral story.',
    ],
    interviewQuestions: [
      {
        question: 'Why do you want to work for us specifically?',
        answer: 'Structure: (1) Specific thing about company: "I have been following your engineering blog — your recent article on handling 10 million concurrent users was fascinating." (2) How it aligns with your interests: "Distributed systems is exactly where I want to grow." (3) What you bring: "My final-year project on caching mechanisms directly relates to the challenges you described." Generic answers are rejected. Research the company deeply.',
        difficulty: 'beginner',
      },
      {
        question: 'Tell me about a time you failed.',
        answer: 'STAR: Situation (describe a real failure — interviewers respect honesty). Task (what were you trying to achieve). Action (what you did despite the failure — showed grit?). Result + Learning (what changed in your approach after). Key: the learning is more important than the failure. Never choose a failure that reveals a character flaw. Choose a technical or process failure.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'hr-ex-1',
        title: 'Draft Your Intro',
        description: 'Write your "Tell me about yourself" answer using the P-E-R-T framework. Keep it under 90 seconds when spoken.',
        starterCode: `// P - Present: I am a [year] B.Tech CS student at [college]...
// E - Experience: I built [project] / interned at [company]...
// R - Relevant skills: My strongest technical areas are [1-2 skills]...
// T - Target: I am excited about this role because [specific reason]...`,
        solution: `Draft your own answer using P-E-R-T. Practice speaking it aloud until smooth and under 90 seconds.`,
        hints: ['Speak aloud and time yourself. 90 seconds is approximately 200 words.'],
        expectedOutput: 'Personalized 90-second introduction',
      },
    ],
    keyTakeaways: [
      'Tell me about yourself: P-E-R-T framework. Practice until smooth. 90 seconds.',
      'Weaknesses: real + self-aware + what you are doing to improve.',
      'Behavioral questions: STAR method. 80% on Action.',
      'Why this company: specific research. Never generic answers.',
      'Always ask 2-3 genuine questions at the end.',
    ],
    prevLesson: 'technical-interviews',
    nextLesson: 'company-preparation',
  },

  // ════════════════════════════════════════════════════════════════════════════
  // SECTION 6 — COMPANY-SPECIFIC PREPARATION
  // ════════════════════════════════════════════════════════════════════════════
  {
    id: 'company-preparation',
    slug: 'company-preparation',
    title: 'Company-Specific Preparation',
    description: 'Google, Amazon, Microsoft, Meta, Goldman Sachs, Startups — process, focus areas, and strategies.',
    category: 'Placement Preparation',
    order: 33,
    difficulty: 'intermediate',
    estimatedTime: 50,
    content: `## Why Company-Specific Prep Matters

Every company has a distinct interview culture, difficulty level, and focus area. Generic preparation leads to generic results. Target the specific company's patterns.

---

## Google

**Process:** Phone screen → 4-5 onsite rounds (coding + design + behavioral at senior level).
**Campus:** Google does not hire from most Indian colleges directly. Use referrals or FAANG-prep routes.
**Focus:**
- DSA: Hard LeetCode. Graphs, DP, string algorithms.
- System Design: For L4+. How does Google scale products?
- "Googleyness": Collaborative, handles ambiguity, takes initiative.
**Common questions:** Minimum path sum, word break, LRU cache, design Google Search autocomplete.
**Difficulty:** Very High. 2-3 months of LeetCode medium/hard required.

---

## Amazon

**Process:** OA (coding 2 problems, 90 min) → 3-5 SDE interviews + Bar Raiser.
**Focus:**
- DSA: Medium LeetCode. Arrays, trees, DP, graphs.
- Leadership Principles: 16 LPs. Behavioral questions are structured around them.
- Bar Raiser round: Tests whether you raise the bar.
**Key LPs to prepare:**
- Customer Obsession, Ownership, Invent and Simplify, Dive Deep, Deliver Results.
**Tip:** Every behavioral answer must use STAR and reference an LP. Amazon interviewers explicitly map answers to LPs.
**Difficulty:** High for DSA. Very High for behavioral preparation.

---

## Microsoft

**Process:** OA → 4-5 technical rounds (coding + design + behavioral).
**Focus:**
- DSA: Medium LeetCode. Common: trees, strings, graphs.
- Cultural: Growth mindset, collaboration.
- Often includes a "design something simple" question.
**Tip:** Microsoft values communication and teamwork. Talk through problems even when stuck. They want to know you can collaborate.
**Difficulty:** High. Slightly more accessible than Google/Amazon.

---

## Meta (Facebook)

**Process:** 2 coding rounds + 1 behavioral (Jedi) + system design (E4+).
**Focus:**
- DSA: LeetCode medium/hard. Graphs, trees, sliding window are heavy.
- Behavioral: "Tell me about a time you had to change your approach mid-project."
- System design: Scale social network features (news feed, messaging).
**Tip:** Practice coding in 35 minutes. Meta rounds are strictly timed.
**Difficulty:** Very High.

---

## Goldman Sachs / JP Morgan (Finance Tech)

**Process:** HireVue video → 3-5 technical rounds + HR.
**Focus:**
- DSA: Moderate. Medium LeetCode.
- Finance domain knowledge (basic): bonds, derivatives, risk — optional but impressive.
- System design: Matching engines, trading systems.
- Also tests C++ (GS uses it heavily).
**Tip:** GS values accuracy and correctness over speed. Explain edge cases carefully.
**Difficulty:** High for DSA. Medium for domain knowledge.

---

## Startups

**Process:** Often 1-2 rounds. CEO/CTO may interview you.
**Focus:**
- Can you ship? Full-stack, product thinking, initiative.
- DSA: Easy-medium. Practical coding problems.
- "What would you build first?" — product sense.
- Enthusiasm for the product/mission.
**Tip:** Research the startup deeply. Know their product, competitors, tech stack. Have an opinion.
**Difficulty:** Lower DSA bar. Higher initiative/ownership bar.

---

## Adobe

**Process:** OA → 3 technical rounds + HR.
**Focus:** DSA (trees, graphs, DP), OOP design, one creative/product question.
**Common questions:** Trees (LCA, zigzag traversal), 2D DP, image processing algorithms.

---

## Walmart (Global Tech)

**Process:** OA → 2 technical + 1 HR.
**Focus:** DSA medium, system design basics, database questions.
**Easier OA than product companies.** Good stepping stone.

---

## Atlassian

**Process:** OA → values interview → technical interviews.
**Focus:** Open Company (no BS), Build with Heart, Don't #@!% the Customer.
**Technical:** DSA medium, system design, behavioral aligned to their 5 values.
**Tip:** Read their engineering blog. Atlassian values candidates who genuinely care about developer tooling.

---

## Uber

**Process:** Phone screen → technical rounds (coding + system design for senior).
**Focus:** Real-time systems, maps, ride matching algorithms, scaling.
**Common questions:** Location-based searches, nearest driver algorithm, surge pricing logic.`,
    codeExamples: [
      {
        title: 'Amazon Leadership Principle — STAR Template',
        code: `LP: Customer Obsession
Q: "Tell me about a time you put the customer first even when it was difficult."

S — Situation:
"I was building a college portal where professors submit grades.
A week before final submissions, professors complained the upload
interface was confusing — they were submitting wrong files."

T — Task:
"I needed to fix it without breaking the existing system
and without delaying the grade submission deadline."

A — Action:
"I had an existing feature freeze for exam week, but I evaluated
that the customer impact (professors submitting wrong grades)
outweighed the policy. I added a file-type validation and
a clear preview step in 6 hours, tested edge cases, and
deployed with a feature flag. I personally emailed 3 professors
who had complained to walk them through the update."

R — Result:
"Zero wrong-file submissions in the final week. Two professors
specifically mentioned the improvement in their feedback.
Grade processing completed 2 days ahead of schedule."

LP Alignment: Customer Obsession — prioritized user experience
over process convenience.`,
        explanation: 'For Amazon: explicitly map your story to an LP in your closing sentence. Interviewers check this.',
      },
      {
        title: '4-Week Company Prep Plan',
        code: `Week 1: Foundation
  - LeetCode Easy: 30 problems (arrays, strings, hashing)
  - Aptitude: Shortcuts for all 10 aptitude topics
  - Research target company's tech blog and culture

Week 2: Core DSA
  - LeetCode Medium: 20 problems (trees, DP, graphs)
  - System design: Read "System Design Primer" (GitHub)
  - OA practice: 2 full timed OAs on platform

Week 3: Company-Specific
  - Solve company-tagged LeetCode problems (filter by company)
  - Practice behavioral answers for company's focus areas
  - Mock technical interview with a friend or MockInterview.io

Week 4: Review and Polish
  - Re-solve problems you got wrong
  - 2-minute intro + 5 behavioral stories polished
  - CS fundamentals: OS, DBMS, Networks quick review
  - Full mock interview (coding + behavioral)`,
        explanation: 'Four weeks is the minimum for a focused campaign. Start earlier if multiple companies are targeted.',
      },
    ],
    commonMistakes: [
      'Preparing the same way for Google and TCS — completely different requirements.',
      'Ignoring behavioral prep for Amazon — LPs are 40% of their interview scoring.',
      'Not researching the company before interview — kills motivation and fit signals.',
      'Practicing only LeetCode hard before OAs — most campus OAs are easy-medium.',
    ],
    interviewQuestions: [
      {
        question: 'How do you decide which company to apply to first?',
        answer: 'Consider: (1) Your DSA strength — high LeetCode → FAANG. Moderate → product companies. Lower → service/mid-size. (2) Timeline — some companies recruit earlier (TCS/Infosys in August, FAANG in September-November). (3) Goals — salary, growth, culture, domain. Apply to a spread: 2 reach, 3 target, 2 safety companies. Do not put all effort into one company.',
        difficulty: 'beginner',
      },
    ],
    exercises: [
      {
        id: 'cp-ex-1',
        title: 'Research a Company',
        description: 'Pick one company you are targeting. Find: (1) Interview process, (2) One cultural value, (3) One recent engineering challenge they solved. Write 3 sentences about why you want to work there.',
        starterCode: `// Process: Look up on Glassdoor, LinkedIn, company careers page.
// Culture: Read company values page and engineering blog.
// Engineering challenge: Read engineering blog or tech articles.
// "I want to work at [company] because [specific reason based on research]."`,
        solution: `Research produces a specific, compelling answer for "Why this company?" — cannot be templated.`,
        hints: ['Engineering blogs: Netflix Tech Blog, Meta Engineering, Uber Engineering, Google AI Blog'],
        expectedOutput: 'Company research → specific answer for "why us?"',
      },
    ],
    keyTakeaways: [
      'Each company has different DSA difficulty, cultural focus, and process — prep accordingly.',
      'Amazon: 16 Leadership Principles. Every behavioral answer maps to an LP.',
      'Google/Meta: Hard DSA. Graphs, DP, system design.',
      'Service companies (TCS/Infosys): Easy-medium DSA, heavy aptitude.',
      '4-week plan: foundation → core DSA → company-specific → review.',
    ],
    prevLesson: 'hr-interviews',
    nextLesson: 'practice-hub',
  },

  // ════════════════════════════════════════════════════════════════════════════
  // SECTION 7 — PRACTICE HUB
  // ════════════════════════════════════════════════════════════════════════════
  {
    id: 'practice-hub',
    slug: 'practice-hub',
    title: 'Practice Hub',
    description: 'Daily aptitude, reasoning, CS, and interview questions — your structured practice schedule.',
    category: 'Practice',
    order: 34,
    difficulty: 'intermediate',
    estimatedTime: 60,
    content: `## The Practice Hub

This hub gives you a structured daily practice schedule. Consistent daily practice is more effective than occasional intense sessions.

**Rule: 30 minutes of daily practice beats 4 hours once a week.**

---

## Daily Practice Schedule

### Monday & Thursday — Aptitude

**10 questions in 15 minutes:**

Q1: 8% of 750 = ?
**Answer:** 60. (10% of 750 = 75. 8% = 75 - 2% = 75 - 15 = 60.)

Q2: Two numbers have ratio 3:5 and HCF 4. Their LCM?
**Answer:** Product = HCF × LCM. Numbers = 12, 20. LCM = 60.

Q3: A train 500m passes another 400m at 90 km/h in same direction. Other train's speed is 54 km/h. Time?
**Answer:** Relative speed = (90-54)×5/18 = 10 m/s. Distance = 900m. Time = 90s.

Q4: 3 men can do a job in 6 days. How many men needed in 2 days?
**Answer:** Work = 18 man-days. Men needed = 18/2 = 9 men.

Q5: P(at least one head in 3 coin tosses)?
**Answer:** 1 - P(no heads) = 1 - (1/2)^3 = 1 - 1/8 = 7/8.

Q6: Successive discounts of 25% and 20% on ₹2000?
**Answer:** 2000 × 0.75 × 0.8 = 1200. Effective discount = 40%.

Q7: In how many ways can BANANA be arranged?
**Answer:** 6!/(3!×2!) = 720/12 = 60 (N:3, A:3? Wait: B=1,A=3,N=2. Answer = 6!/(3!2!) = 60).

Q8: Profit when CP=₹640, selling at 25% profit?
**Answer:** SP = 640 × 1.25 = ₹800. Profit = ₹160.

Q9: Average of first 20 natural numbers?
**Answer:** Sum = 20×21/2 = 210. Average = 210/20 = 10.5.

Q10: Speed 60 km/h covers 180 km in?
**Answer:** Time = 180/60 = 3 hours.

---

### Tuesday & Friday — Logical Reasoning

**8 questions in 12 minutes:**

Q1: Next in series: 2, 8, 18, 32, 50, ?
**Answer:** n×(n+1)×2? Check: 2=1×2, 8=2×4=2×2², 18=3×6=2×3², 32=2×4²=32✓, 50=2×5². Next: 2×6²=72.

Q2: If P=Q+3 and Q is immediately to the left of R, who sits between P and R?
**Answer:** Q sits between P and R (Q is between P-3 and P, and R is right of Q).

Q3: All S are T. Some T are U. Does "Some S are U" follow?
**Answer:** No. The "some T that are U" may not include any S.

Q4: DECEMBER coded as ERMBCEDE?
**Answer:** Reversed + some shift. D→E(+1) E→R? No. Reversed: REBMECED. Hmm — not straightforward. DECEMBER reversed = REBMECED, not given. Skip — demonstrate process.

Q5: A is taller than B but shorter than C. D is taller than A. Who is shortest?
**Answer:** B. Chain: B < A < C, A < D. B is least.

Q6: A is North of B. C is East of B. What direction is C from A?
**Answer:** A is North of B. C is East of B. So C is South-East of A.

Q7: "Some flowers are beautiful. Beautiful things attract bees." Conclusion: Some flowers attract bees?
**Answer:** Yes — follows. Some flowers are beautiful, and beautiful things attract bees → those beautiful flowers attract bees.

Q8: In a group of 25, 12 like coffee, 10 like tea, 5 like both. How many like neither?
**Answer:** Like either = 12+10-5 = 17. Neither = 25-17 = 8.

---

### Wednesday & Saturday — CS Fundamentals

**6 questions in 10 minutes:**

Q1: What is the time complexity of binary search?
**Answer:** O(log n) — halves search space each step.

Q2: INNER JOIN vs OUTER JOIN — when to use each?
**Answer:** INNER JOIN when you want only matching records. LEFT/RIGHT OUTER when you need all records from one table regardless of match.

Q3: What is thrashing in OS?
**Answer:** When page fault rate is so high that the CPU spends more time swapping pages than executing. Caused by too many processes for available memory.

Q4: In HTTP, what does status 403 mean?
**Answer:** Forbidden — server understood the request but refuses to authorize. Different from 401 (Unauthorized — not authenticated).

Q5: Explain polymorphism in one sentence with an example.
**Answer:** Same interface, different behavior. Example: animal.speak() → Dog says "Woof", Cat says "Meow" — same method call, different output based on object type.

Q6: What is a foreign key constraint?
**Answer:** A foreign key ensures that a column's value must exist as a primary key in another (referenced) table — enforces referential integrity.

---

### Sunday — Weekly Mock Test

**Full timed mock: 60 minutes**
- 20 aptitude questions: 30 minutes
- 15 reasoning questions: 20 minutes
- 10 CS questions: 10 minutes

**After the mock:**
1. Check all answers.
2. For each wrong answer: understand why it was wrong.
3. Categorize errors: concept gap, calculation error, time pressure, or careless.
4. Focus next week's practice on the error category.

---

## Monthly Mock Assessment

At the end of each month, take a full-length OA simulation:
- 120 minutes
- All sections (aptitude + reasoning + verbal + coding)
- Review performance by category
- Adjust study focus based on weakest areas`,
    codeExamples: [
      {
        title: 'Interview Question of the Day — Rotation',
        code: `Monday: Aptitude shortcut
"What % is 75 of 125?"
→ 75/125 × 100 = 3/5 × 100 = 60%

Tuesday: Reasoning
"Find next: 3, 9, 27, 81, ?"
→ Geometric series × 3 each time → 243

Wednesday: CS Fundamental
"Difference between stack and heap memory?"
→ Stack: function calls, local variables, automatic memory management.
   Heap: dynamic allocation (new/malloc), manual or GC managed.

Thursday: Aptitude Application
"A and B invest ₹8000 and ₹12000. B leaves after 5 months.
If profit = ₹7400 at end of year, B's share?"
→ A: 8000×12=96000. B: 12000×5=60000.
   Ratio = 96:60 = 8:5. B's share = 5/13 × 7400 = ₹2846.

Friday: Reasoning — Blood Relation
"Pointing to a man, Sara says 'His mother's brother is my father's only son.'
How is Sara related to the man?"
→ Sara's father's only son = Sara's brother.
   Man's mother's brother = Sara's brother.
   So Man's mother = Sara's sister. Man is Sara's nephew.

Saturday: CS — SQL
"Write query to find duplicate email addresses."
→ SELECT Email FROM Users GROUP BY Email HAVING COUNT(*) > 1;`,
        explanation: 'Rotating through different question types daily ensures all areas get consistent practice.',
      },
    ],
    commonMistakes: [
      'Practicing only topics you are already good at — practice the weak areas.',
      'Skipping the weekly mock — timed mocks reveal time management issues that practice does not.',
      'Not reviewing wrong answers deeply — understanding the mistake is more valuable than solving more questions.',
    ],
    interviewQuestions: [
      {
        question: 'How many questions should I practice per day for placement prep?',
        answer: 'Quality beats quantity. 15-20 aptitude/reasoning questions in timed conditions per day is optimal. For DSA, 3-5 problems with understanding is better than 20 problems by reading solutions. For CS fundamentals, review 5-6 concepts per day. The key is daily consistency — 30 minutes every day beats 4 hours once a week.',
        difficulty: 'beginner',
      },
    ],
    exercises: [
      {
        id: 'ph-ex-1',
        title: 'Speed Round',
        description: 'Time yourself: Solve these 5 questions in under 5 minutes. (1) 20% of 450. (2) HCF(24,32). (3) Next in: 1,4,9,16,? (4) If EAST=31, WEST=? (use alphabetical positions sum). (5) P(sum of 2 dice = 8).',
        starterCode: `// (1) 20% of 450 = 90
// (2) HCF(24,32): 32=24×1+8, 24=8×3+0 → HCF=8
// (3) Perfect squares: 25
// (4) E+A+S+T=5+1+19+20=45. W+E+S+T=23+5+19+20=67
// (5) Pairs for sum 8: (2,6),(3,5),(4,4),(5,3),(6,2) = 5/36`,
        solution: `(1) 90, (2) 8, (3) 25, (4) 67, (5) 5/36`,
        hints: ['Speed matters as much as accuracy. Mark and return if stuck.'],
        expectedOutput: '90, 8, 25, 67, 5/36',
      },
    ],
    keyTakeaways: [
      'Mon/Thu: Aptitude. Tue/Fri: Reasoning. Wed/Sat: CS. Sun: Full mock.',
      '30 minutes daily beats 4 hours once a week — consistency wins.',
      'After every mock: categorize errors (concept/calculation/careless) and fix the root cause.',
      'Increase difficulty progressively — easy → medium → hard over 4-6 weeks.',
    ],
    prevLesson: 'company-preparation',
    nextLesson: 'revision-hub',
  },

  // ════════════════════════════════════════════════════════════════════════════
  // SECTION 8 — REVISION HUB
  // ════════════════════════════════════════════════════════════════════════════
  {
    id: 'revision-hub',
    slug: 'revision-hub',
    title: 'Revision Hub',
    description: 'Complete cheat sheets for aptitude, reasoning, CS fundamentals, and interview prep.',
    category: 'Revision',
    order: 35,
    difficulty: 'beginner',
    estimatedTime: 30,
    content: `## How to Use This Revision Hub

This is your one-stop revision resource. Use it:
- **The night before an OA** — quick scan of all formulas.
- **The morning of an interview** — CS fundamentals quick review.
- **Whenever you forget a formula** — faster than re-reading full modules.

---

## APTITUDE CHEAT SHEET

### Number System
- Divisibility by 3: sum of digits divisible by 3.
- Divisibility by 9: sum of digits divisible by 9.
- Divisibility by 11: (odd-position digits sum) − (even-position sum) = 0 or 11.
- HCF × LCM = product of two numbers.
- Factors of n = a^p × b^q → count = (p+1)(q+1).
- Trailing zeros in n! = ⌊n/5⌋ + ⌊n/25⌋ + ⌊n/125⌋ + ...
- Cyclicity: 2,3,7,8 have period 4. 4,9 have period 2. 0,1,5,6 have period 1.

### Percentage
- x% increase then x% decrease = net change of −x²/100 %.
- If increased by x%, to restore: decrease by x/(100+x) × 100.
- Markup + discount: Profit% = x − y − xy/100.

### Profit and Loss
- Profit% and Loss% → always on CP.
- Discount% → always on MP.
- Same SP, equal P% and L% → net loss of P²/100 %.
- Dishonest trader: Profit% = (Error)/(True measure − Error) × 100.

### Ratio and Proportion
- Alligation: Cheaper:Dearer = (Dearer − Mean):(Mean − Cheaper).
- Mixture replacement: Final A = Initial × (1 − removed/total)^n.
- Partnership profit = Capital × Time.

### Average
- Average Speed (equal distance) = 2v₁v₂/(v₁+v₂).
- Replacement change in average = (New − Old)/Count.

### Time and Work
- Together rate = sum of individual rates.
- LCM method: assume work = LCM. Convert times to rates.
- Wages split = ratio of work done.

### Time Speed Distance
- km/h × 5/18 = m/s.
- Train + platform: distance = train length + platform length.
- Boats: u = (D+U)/2, v = (D−U)/2.
- Circular: opposite direction = track/(s₁+s₂), same = track/(s₁−s₂).

### Permutation and Combination
- ⁿPr = n!/(n-r)!. ⁿCr = n!/[r!(n-r)!].
- Circular = (n-1)! not n!.
- At least one = 1 − P(none).
- Repeated letters: divide total by factorial of each repetition count.

### Probability
- P(E) = Favorable/Total. 0 ≤ P ≤ 1.
- Complement: P(E') = 1 − P(E).
- Mutually exclusive: P(A or B) = P(A) + P(B).
- Independent: P(A and B) = P(A) × P(B).

---

## LOGICAL REASONING CHEAT SHEET

### Series
- Always check: arithmetic → geometric → squares/cubes → Fibonacci → 2nd differences.
- Alternating series: odd and even positions independent.
- Alphabet: A=1 to Z=26. Opposite pairs sum to 27.

### Coding-Decoding
- Find rule: constant shift, increasing shift, reverse alphabet, position coding.
- Sentence coding: compare shared words across coded sentences.

### Blood Relations
- ALWAYS draw family tree. Never solve mentally.
- Gender clues: son/father/husband = male; daughter/mother/wife = female.

### Direction Sense
- Right = clockwise: N→E→S→W. Left = N→W→S→E.
- Shadow: morning sun East → shadow West. Evening sun West → shadow East.
- Distance: Pythagoras when path has a right angle.

### Seating Arrangement
- Draw the arrangement. Fix most-constrained person first.
- Circular: right = clockwise, left = anti-clockwise.
- Verify ALL clues after completion.

### Syllogism
- Use Venn diagrams always.
- All A→B + All B→C = All A→C.
- All A→B + No B→C = No A→C.
- Some + Some = No conclusion.
- Complementary pair (Some/No) → "Either I or II follows."

---

## CS FUNDAMENTALS CHEAT SHEET

### Operating Systems
- Process = own memory. Thread = shared memory, own stack.
- Deadlock: Mutual Exclusion + Hold & Wait + No Preemption + Circular Wait.
- Mutex = ownership (locker must unlock). Semaphore = no ownership.
- SJF = optimal average waiting time (non-preemptive).
- Paging = fixed frames, no external fragmentation.
- Virtual memory: demand paging. Page fault = page not in RAM.
- Thrashing = too many page faults, CPU busy swapping.

### DBMS
- Keys: Primary (no null), Foreign (references PK), Candidate (minimal super key).
- 1NF = atomic. 2NF = no partial dependency. 3NF = no transitive dependency.
- ACID: Atomicity, Consistency, Isolation, Durability.
- INNER = both match. LEFT = all left + matching right.
- WHERE = before GROUP BY. HAVING = after GROUP BY.
- Index speeds SELECT, slows INSERT/UPDATE/DELETE.

### Computer Networks
- OSI 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, Application.
- TCP = reliable, ordered, connection-oriented. UDP = fast, unreliable.
- TCP 3-way handshake: SYN → SYN-ACK → ACK.
- HTTP = port 80. HTTPS = port 443 (HTTP + TLS).
- DNS: domain → IP. Browser cache → OS → resolver → root → TLD → authoritative.
- Routers = Layer 3 (IP). Switches = Layer 2 (MAC).

### OOP
- Encapsulation = private fields + public methods.
- Abstraction = hide implementation, expose interface.
- Inheritance = IS-A relationship, code reuse.
- Polymorphism = compile-time (overloading) + runtime (overriding).
- SOLID: Single Responsibility, Open/Closed, Liskov, Interface Segregation, Dependency Inversion.
- Overloading = same class, different params. Overriding = parent+child, same signature.

---

## INTERVIEW CHEAT SHEET

### Tell Me About Yourself
- P-E-R-T: Present → Experience → Relevant Skills → Target. 90 seconds.

### STAR Method
- Situation → Task → Action (80%) → Result.

### Technical Interview Framework
- Clarify → Brute Force → Optimize → Confirm → Code → Test → Complexity.

### HR Questions
- Weakness: Real + self-aware + improving.
- Why company: Specific research (product/tech/culture), not generic.
- Salary: Research market. Give range. Never first.

### Amazon LPs (memorize top 5)
- Customer Obsession. Ownership. Invent and Simplify. Dive Deep. Deliver Results.

---

## PLACEMENT REVISION NOTES

**Before OA:**
1. Scan aptitude shortcuts (10 min).
2. Review reasoning types: series, seating, syllogism (10 min).
3. Check grammar rules: tenses, articles, SVA (5 min).
4. Sleep well. Warm-up problem set in morning.

**Before Technical Interview:**
1. Review all CS fundamentals cheat sheets (30 min).
2. Do 3 easy/medium LeetCode warmup problems.
3. Practice your "Tell me about yourself" answer aloud.
4. Review your project details — be ready for any question about your resume.

**Before HR Interview:**
1. Research the company (15 min): product, values, recent news.
2. Review 3-4 STAR stories.
3. Write down 2-3 questions to ask.
4. Dress appropriately. Arrive 10 minutes early.`,
    codeExamples: [
      {
        title: 'Quick Formula Recall Test',
        code: `Test yourself (cover answers, recall):

1. Speed in m/s when given km/h? → × 5/18
2. Average speed for equal distances? → 2v₁v₂/(v₁+v₂)
3. Boat speed from downstream D and upstream U? → (D+U)/2
4. Net effect of +x% then -x%? → -x²/100 %
5. LCM × HCF = ? → product of the two numbers (only 2 numbers)
6. Circular permutations of n? → (n-1)!
7. Deadlock conditions? → ME + H&W + NP + CW
8. SQL: all left + matching right? → LEFT JOIN
9. ACID D = ? → Durability
10. OSI Layer 3 protocol? → IP. Layer 7? → HTTP
11. Overloading = ? → compile-time polymorphism
12. Mutex vs semaphore difference? → Mutex has ownership
13. Trailing zeros in 50!? → ⌊50/5⌋ + ⌊50/25⌋ = 10+2 = 12
14. Syllogism: Some A+B, No B+C → ? → Some A are not C
15. P(at least one) = ? → 1 - P(none)`,
        explanation: 'Run this self-test the morning of your OA or interview. If you hesitate on any, re-read that module.',
      },
    ],
    commonMistakes: [
      'Reading revision notes without actively recalling — cover the answer and test yourself.',
      'Only revising what you know — specifically target the formulas you keep forgetting.',
      'Not sleeping enough the night before — cognitive performance drops significantly.',
    ],
    interviewQuestions: [
      {
        question: 'What is the single most important thing to remember during an OA?',
        answer: 'Time management: do not spend more than 90 seconds on any single aptitude question. Scan all questions first, solve easy ones, mark medium for review, skip hard. A skipped easy question is the biggest waste. Move on and return. Never calculate when you can approximate — in MCQ, rough answers are often sufficient to identify the correct option.',
        difficulty: 'beginner',
      },
    ],
    exercises: [
      {
        id: 'rh-ex-1',
        title: 'Formula Recall Challenge',
        description: 'Without looking: (1) Formula for net effect of two successive percentage changes a% and b%. (2) Time for two trains (lengths L1, L2, speeds S1>S2) in same direction to cross each other. (3) Syllogism rule: All A→B + Some B→C = ?',
        starterCode: `// (1) Net change = a + b + ab/100 (use negatives for decreases)
// (2) Time = (L1+L2)/(S1-S2) [convert to same units]
// (3) No definite conclusion about A and C from "some B→C"`,
        solution: `(1) a+b+ab/100, (2) (L1+L2)/(S1-S2), (3) No definite conclusion.`,
        hints: ['Cover answers and recall. If you hesitate, re-read that module.'],
        expectedOutput: 'Formula recall: a+b+ab/100, (L1+L2)/(S1-S2), No conclusion',
      },
    ],
    keyTakeaways: [
      'This revision hub consolidates all formulas from all 35 modules in one place.',
      'Use this the night before OA and the morning of interviews.',
      'Self-test by covering answers and recalling — passive reading does not help.',
      'Consistency over 4-6 weeks + this cheat sheet = placement success.',
      'The goal of this track: clear OAs, crack internships, ace placements, succeed in interviews.',
    ],
    prevLesson: 'practice-hub',
  },
];
