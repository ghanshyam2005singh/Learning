'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import type { DSATopic, DSASection } from '@/types/dsa';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface Props {
  topic: DSATopic;
  section: DSASection;
}

/* ─── helpers ───────────────────────────────────────────────────────── */

function DiffBadge({ d }: { d: string }) {
  const cls =
    d === 'easy' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' :
    d === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400' :
    'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400';
  return <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls}`}>{d.charAt(0).toUpperCase() + d.slice(1)}</span>;
}

function CopyBtn({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 2000); }}
      className="text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded"
    >
      {done ? '✓ Copied' : 'Copy'}
    </button>
  );
}

function ReadonlyCode({ code, language = 'cpp' }: { code: string; language?: string }) {
  const lines = code.split('\n').length;
  const height = Math.min(Math.max(lines * 20 + 16, 80), 500);
  return (
    <div className="rounded-xl overflow-hidden border border-gray-700/50">
      <div className="flex items-center justify-between px-4 py-2 bg-[#1e1e2e]">
        <span className="text-[11px] text-gray-400 font-mono uppercase tracking-wide">{language}</span>
        <CopyBtn text={code} />
      </div>
      <MonacoEditor
        height={height}
        language={language}
        value={code}
        theme="vs-dark"
        options={{
          readOnly: true, minimap: { enabled: false }, scrollBeyondLastLine: false,
          fontSize: 13, lineNumbers: 'on', folding: false,
          scrollbar: { vertical: 'hidden', horizontal: 'hidden' },
          renderLineHighlight: 'none', overviewRulerBorder: false,
          wordWrap: 'on',
        }}
      />
    </div>
  );
}

/* renders **bold** and `code` inline */
function Prose({ text }: { text: string }) {
  const html = text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-gray-100 font-semibold">$1</strong>')
    .replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 rounded bg-gray-700 text-violet-300 text-[0.82em] font-mono">$1</code>')
    .replace(/\n/g, '<br/>');
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-[#111827] border border-gray-800 rounded-2xl p-6 ${className}`}>
      {children}
    </div>
  );
}

function SectionTitle({ emoji, title }: { emoji: string; title: string }) {
  return (
    <h3 className="flex items-center gap-2 text-base font-bold text-gray-100 mb-4">
      <span>{emoji}</span> {title}
    </h3>
  );
}

/* ─── auto-generate starter code from solution code ─────────────────── */
function buildStarterCode(code: string): string {
  if (!code) return `#include <bits/stdc++.h>
using namespace std;

// Write your solution here

int main() {
    // Test your function here
    return 0;
}`;

  // Extract the function signature (first line)
  const lines = code.split('\n');
  const sig = lines[0].replace(/{$/, '').trim();

  return `#include <bits/stdc++.h>
using namespace std;

// ── YOUR TASK: Fill in the function body ─────────────────────────────
// Read the approach above, understand the algorithm, then code it here.
${sig} {
    // Write your solution here

}

// ── Test your solution ───────────────────────────────────────────────
int main() {
    // Add your own test cases here and print the result
    // Compare with the examples shown above

    // Example:
    // vector<int> arr = {3, 1, 4, 1, 5, 9};
    // cout << "Result: " << yourFunction(arr) << endl;

    return 0;
}`;
}

/* ─── Code Playground with Run + Feedback ───────────────────────────── */
interface RunResult {
  stdout: string;
  stderr: string;
  compileError: string;
  exitCode: number;
  error?: string;
}

function CodePlayground({ approach }: { approach: NonNullable<DSATopic['approaches']>[number] }) {
  const initialCode = approach.starterCode ?? buildStarterCode(approach.code ?? '');
  const [code, setCode] = useState(initialCode);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);
  const [showSolution, setShowSolution] = useState(false);

  const editorHeight = Math.min(Math.max(initialCode.split('\n').length * 20 + 32, 200), 520);

  async function runCode() {
    setRunning(true);
    setResult(null);
    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data: RunResult = await res.json();
      setResult(data);
    } catch {
      setResult({ stdout: '', stderr: '', compileError: '', exitCode: 1, error: 'Network error — check your internet connection.' });
    } finally {
      setRunning(false);
    }
  }

  function reset() {
    setCode(initialCode);
    setResult(null);
  }

  const hasCompileError = result && (result.compileError || (result.stderr && result.exitCode !== 0 && !result.stdout));
  const hasOutput = result && result.stdout;
  const hasRuntimeError = result && result.exitCode !== 0 && !result.compileError && result.stderr;

  const solutionToShow = approach.solutionWithComments ?? approach.code;

  return (
    <div className="space-y-3">
      {/* Editor header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#1e1e2e] rounded-t-xl border border-gray-700/50 border-b-0">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500/70" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <span className="w-3 h-3 rounded-full bg-green-500/70" />
          <span className="ml-2 text-[11px] text-gray-400 font-mono">solution.cpp — write your code</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={reset}
            className="text-[11px] text-gray-500 hover:text-gray-300 transition-colors px-2 py-1 rounded"
          >
            Reset
          </button>
          <CopyBtn text={code} />
        </div>
      </div>

      {/* Editable Monaco Editor */}
      <div className="border border-gray-700/50 border-t-0 rounded-b-xl overflow-hidden">
        <MonacoEditor
          height={editorHeight}
          language="cpp"
          value={code}
          theme="vs-dark"
          onChange={(val) => setCode(val ?? '')}
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 13,
            lineNumbers: 'on',
            folding: true,
            scrollbar: { vertical: 'auto', horizontal: 'auto' },
            renderLineHighlight: 'line',
            wordWrap: 'on',
            suggestOnTriggerCharacters: true,
            quickSuggestions: true,
          }}
        />
      </div>

      {/* Run button */}
      <button
        onClick={runCode}
        disabled={running}
        className={`w-full py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
          running
            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
            : 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-900/30 hover:shadow-violet-800/40'
        }`}
      >
        {running ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            Compiling & Running...
          </>
        ) : (
          <>▶ Run Code</>
        )}
      </button>

      {/* Result display */}
      {result && (
        <div className="space-y-3">
          {/* Network/API error */}
          {result.error && (
            <div className="bg-red-950/40 border border-red-700/50 rounded-xl p-4">
              <p className="text-sm font-semibold text-red-400 mb-1">⚠ Error</p>
              <p className="text-xs text-red-300">{result.error}</p>
            </div>
          )}

          {/* Compile error */}
          {hasCompileError && (
            <div className="bg-red-950/40 border border-red-700/50 rounded-xl p-4">
              <p className="text-sm font-semibold text-red-400 mb-2">✗ Compile Error</p>
              <pre className="text-xs text-red-300 whitespace-pre-wrap font-mono leading-relaxed overflow-x-auto">
                {result.compileError || result.stderr}
              </pre>
              <div className="mt-3 pt-3 border-t border-red-800/40">
                <p className="text-[11px] text-red-400 font-semibold mb-1">Common fixes:</p>
                <ul className="text-[11px] text-red-300 space-y-1">
                  <li>• Missing semicolons <code className="text-red-200">;</code> at end of statements</li>
                  <li>• Typo in variable/function names</li>
                  <li>• Missing <code className="text-red-200">#include &lt;bits/stdc++.h&gt;</code> at the top</li>
                  <li>• Missing <code className="text-red-200">return</code> statement</li>
                </ul>
              </div>
            </div>
          )}

          {/* Runtime error */}
          {hasRuntimeError && (
            <div className="bg-orange-950/40 border border-orange-700/50 rounded-xl p-4">
              <p className="text-sm font-semibold text-orange-400 mb-2">⚠ Runtime Error (exit code {result.exitCode})</p>
              <pre className="text-xs text-orange-300 whitespace-pre-wrap font-mono">{result.stderr}</pre>
              <div className="mt-3 pt-3 border-t border-orange-800/40">
                <p className="text-[11px] text-orange-400 font-semibold mb-1">Common causes:</p>
                <ul className="text-[11px] text-orange-300 space-y-1">
                  <li>• Array index out of bounds — accessing arr[i] when i &gt;= arr.size()</li>
                  <li>• Accessing empty vector — arr[0] when arr is empty</li>
                  <li>• Infinite loop — loop condition never becomes false</li>
                  <li>• Stack overflow — too deep recursion</li>
                </ul>
              </div>
            </div>
          )}

          {/* Success output */}
          {hasOutput && (
            <div className="bg-green-950/30 border border-green-700/40 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-green-400">✓ Output</p>
                {result.exitCode === 0 && (
                  <span className="text-[10px] text-green-600 bg-green-900/30 px-2 py-0.5 rounded-full">exit 0</span>
                )}
              </div>
              <pre className="text-sm text-green-200 whitespace-pre-wrap font-mono leading-relaxed">{result.stdout}</pre>
              {approach.expectedOutput && (
                <div className="mt-3 pt-3 border-t border-green-800/30">
                  <p className="text-[11px] text-green-600 font-semibold mb-1">Expected output:</p>
                  <pre className="text-[11px] text-green-300 font-mono">{approach.expectedOutput}</pre>
                  {result.stdout.trim() === approach.expectedOutput.trim() ? (
                    <p className="mt-2 text-xs font-bold text-green-400">🎉 Perfect match! Your solution is correct.</p>
                  ) : (
                    <p className="mt-2 text-xs text-amber-400">⚠ Output doesn't match expected. Check your logic above.</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Full Solution with Comments */}
      <div className="mt-4 border border-gray-700/40 rounded-xl overflow-hidden">
        <button
          onClick={() => setShowSolution((s) => !s)}
          className="w-full flex items-center justify-between px-4 py-3 bg-gray-800/60 hover:bg-gray-800 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm">🔑</span>
            <span className="text-sm font-semibold text-gray-300">
              {approach.solutionWithComments ? 'Full Solution with Line-by-Line Explanation' : 'Full Solution Code'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {!showSolution && (
              <span className="text-[10px] text-gray-500 bg-gray-700 px-2 py-0.5 rounded-full">Hidden — try first!</span>
            )}
            <span className="text-gray-500 text-sm">{showSolution ? '▲' : '▼'}</span>
          </div>
        </button>

        {showSolution && solutionToShow && (
          <div className="border-t border-gray-700/40">
            {approach.solutionWithComments && (
              <div className="px-4 py-2.5 bg-blue-950/30 border-b border-blue-800/30">
                <p className="text-[11px] text-blue-400">
                  📖 Every line is explained. Read carefully — understand WHY each line is written, not just WHAT it does.
                </p>
              </div>
            )}
            <ReadonlyCode code={solutionToShow} language="cpp" />
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── LESSON VIEW ──────────────────────────────────────────────────── */
function LessonView({ topic }: { topic: DSATopic }) {
  return (
    <div className="space-y-6">
      {topic.introduction && (
        <Card className="border-l-4 border-l-blue-500">
          <SectionTitle emoji="💡" title="What is this?" />
          <p className="text-gray-300 leading-relaxed text-sm"><Prose text={topic.introduction} /></p>
        </Card>
      )}

      {topic.theory && (
        <Card>
          <SectionTitle emoji="📖" title="Theory" />
          <div className="space-y-3">
            {topic.theory.split('\n\n').map((para, i) => (
              <p key={i} className="text-gray-300 leading-relaxed text-sm whitespace-pre-line">
                <Prose text={para} />
              </p>
            ))}
          </div>
        </Card>
      )}

      {topic.complexity && (
        <Card>
          <SectionTitle emoji="⚡" title="Time & Space Complexity" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
            {[
              { label: 'Time Complexity', value: topic.complexity.time },
              { label: 'Space Complexity', value: topic.complexity.space },
              topic.complexity.best ? { label: 'Best Case', value: topic.complexity.best } : null,
              topic.complexity.average ? { label: 'Average Case', value: topic.complexity.average } : null,
              topic.complexity.worst ? { label: 'Worst Case', value: topic.complexity.worst } : null,
            ].filter(Boolean).map((c) => (
              <div key={c!.label} className="bg-gray-800 rounded-xl p-3 text-center">
                <div className="text-[11px] text-gray-500 mb-1">{c!.label}</div>
                <div className="font-mono text-sm font-bold text-violet-400">{c!.value}</div>
              </div>
            ))}
          </div>
          {topic.complexity.note && (
            <p className="text-xs text-gray-500 italic mt-2">{topic.complexity.note}</p>
          )}
        </Card>
      )}

      {topic.codeExamples && topic.codeExamples.length > 0 && (
        <Card>
          <SectionTitle emoji="💻" title="Code Examples" />
          <div className="space-y-6">
            {topic.codeExamples.map((ex, i) => (
              <div key={i}>
                {ex.title && <p className="text-sm font-semibold text-gray-300 mb-2">{ex.title}</p>}
                <ReadonlyCode code={ex.code} language={ex.language ?? 'cpp'} />
                {ex.explanation && (
                  <p className="mt-2 text-xs text-gray-400 leading-relaxed">{ex.explanation}</p>
                )}
                {ex.dryRun && (
                  <div className="mt-2 bg-gray-800 rounded-lg px-4 py-3">
                    <span className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide">Dry Run: </span>
                    <span className="text-xs text-gray-300">{ex.dryRun}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {topic.revisionNotes && topic.revisionNotes.length > 0 && (
        <Card className="border-l-4 border-l-amber-500">
          <SectionTitle emoji="⚡" title="Quick Revision" />
          <ul className="space-y-2">
            {topic.revisionNotes.map((note, i) => (
              <li key={i} className="flex gap-2 text-sm text-amber-200">
                <span className="text-amber-500 mt-0.5 shrink-0">▶</span>
                <Prose text={note} />
              </li>
            ))}
          </ul>
        </Card>
      )}

      {topic.keyTakeaways && topic.keyTakeaways.length > 0 && (
        <Card className="border-l-4 border-l-green-500">
          <SectionTitle emoji="🎯" title="Key Takeaways" />
          <ul className="space-y-2">
            {topic.keyTakeaways.map((t, i) => (
              <li key={i} className="flex gap-2 text-sm text-green-200">
                <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                <Prose text={t} />
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}

/* ─── PROBLEM VIEW ─────────────────────────────────────────────────── */
function ProblemView({ topic }: { topic: DSATopic }) {
  const [activeApproach, setActiveApproach] = useState(0);
  const [showHints, setShowHints] = useState(false);
  const [revealedHints, setRevealedHints] = useState<Set<number>>(new Set());

  const ap = topic.approaches?.[activeApproach];

  function revealHint(i: number) {
    setRevealedHints((prev) => new Set([...prev, i]));
  }

  return (
    <div className="space-y-6">

      {/* LeetCode link */}
      {topic.leetcodeUrl && (
        <a
          href={topic.leetcodeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between gap-3 px-5 py-4 bg-[#1a1a2e] border border-orange-500/40 rounded-2xl hover:border-orange-500 hover:bg-[#1f1f3a] transition-all group"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔗</span>
            <div>
              <p className="text-sm font-bold text-orange-400 group-hover:text-orange-300">Practice on LeetCode</p>
              <p className="text-xs text-gray-500">Click to open the problem and submit your solution</p>
            </div>
          </div>
          <span className="text-orange-500 group-hover:translate-x-1 transition-transform text-lg">→</span>
        </a>
      )}

      {/* Problem Statement */}
      {topic.problemStatement && (
        <Card>
          <SectionTitle emoji="📋" title="Problem Statement" />
          <p className="text-gray-300 leading-relaxed text-sm mb-4">
            <Prose text={topic.problemStatement} />
          </p>

          {topic.pattern && (
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-gray-500">Pattern:</span>
              <span className="px-2.5 py-1 bg-violet-900/40 text-violet-300 text-xs font-medium rounded-full border border-violet-700/40">
                {topic.pattern}
              </span>
            </div>
          )}

          {topic.constraints && topic.constraints.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Constraints</p>
              <ul className="space-y-1">
                {topic.constraints.map((c, i) => (
                  <li key={i} className="text-xs font-mono text-gray-400 flex gap-2">
                    <span className="text-gray-600">•</span>{c}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      )}

      {/* Examples */}
      {topic.examples && topic.examples.length > 0 && (
        <Card>
          <SectionTitle emoji="🧪" title="Examples" />
          <div className="space-y-4">
            {topic.examples.map((ex, i) => (
              <div key={i} className="bg-gray-900 rounded-xl border border-gray-700/50 overflow-hidden">
                <div className="px-4 py-2 bg-gray-800/50 border-b border-gray-700/50">
                  <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Example {i + 1}</span>
                </div>
                <div className="p-4 font-mono text-sm space-y-2">
                  <div className="flex gap-3">
                    <span className="text-gray-500 w-14 shrink-0">Input:</span>
                    <span className="text-cyan-300">{ex.input}</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-gray-500 w-14 shrink-0">Output:</span>
                    <span className="text-green-300 font-semibold">{ex.output}</span>
                  </div>
                  {ex.explanation && (
                    <div className="mt-2 pt-2 border-t border-gray-700/50">
                      <span className="text-[11px] text-gray-500">Explanation: </span>
                      <span className="text-xs text-gray-300">{ex.explanation}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Approach & Algorithm → Code Playground */}
      {topic.approaches && topic.approaches.length > 0 && (
        <Card>
          <SectionTitle emoji="🧠" title="How to Think & Solve" />

          {/* Approach tabs */}
          {topic.approaches.length > 1 && (
            <div className="flex gap-2 mb-6 flex-wrap">
              {topic.approaches.map((a, i) => (
                <button
                  key={i}
                  onClick={() => setActiveApproach(i)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    activeApproach === i
                      ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/30'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                  }`}
                >
                  {i === 0 ? '🐢 ' : i === 1 ? '🚀 ' : '⚡ '}{a.name}
                </button>
              ))}
            </div>
          )}

          {ap && (
            <div className="space-y-5">
              {/* Intuition */}
              <div className="bg-blue-950/40 border border-blue-800/40 rounded-xl p-4">
                <p className="text-[11px] font-bold text-blue-400 uppercase tracking-widest mb-2">Intuition / Core Idea</p>
                <p className="text-sm text-blue-100 leading-relaxed"><Prose text={ap.intuition} /></p>
              </div>

              {/* Steps */}
              {ap.steps && ap.steps.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">Step-by-Step Algorithm</p>
                  <ol className="space-y-3">
                    {ap.steps.map((step, si) => (
                      <li key={si} className="flex gap-3">
                        <span className="w-6 h-6 rounded-full bg-violet-900/60 border border-violet-700/50 text-violet-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {si + 1}
                        </span>
                        <span className="text-sm text-gray-300 leading-relaxed pt-0.5">
                          <Prose text={step} />
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Complexity */}
              <div className="flex gap-3">
                <div className="flex-1 bg-gray-800 rounded-xl p-4 text-center">
                  <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Time</div>
                  <div className="font-mono text-base font-bold text-green-400">{ap.complexity.time}</div>
                </div>
                <div className="flex-1 bg-gray-800 rounded-xl p-4 text-center">
                  <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Space</div>
                  <div className="font-mono text-base font-bold text-blue-400">{ap.complexity.space}</div>
                </div>
              </div>

              {/* Dry run */}
              {ap.dryRun && (
                <div className="bg-gray-800/60 rounded-xl p-4">
                  <p className="text-[11px] font-bold text-amber-500 uppercase tracking-widest mb-2">Dry Run / Trace</p>
                  <p className="text-xs text-gray-300 leading-relaxed font-mono">{ap.dryRun}</p>
                </div>
              )}

              {/* Code Playground — blank editor + run */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                    Now Write It Yourself
                  </p>
                  <span className="text-[10px] text-violet-400 bg-violet-900/30 px-2 py-0.5 rounded-full border border-violet-700/30">
                    Run your code below
                  </span>
                </div>
                <div className="bg-violet-950/20 border border-violet-700/20 rounded-xl px-4 py-3 mb-3">
                  <p className="text-[11px] text-violet-300">
                    ✏️ The editor starts with just the function signature. Read the algorithm steps above, then implement the body. Click <strong>Run Code</strong> to test it. If it fails, read the error — it tells you exactly what went wrong.
                  </p>
                </div>
                <CodePlayground approach={ap} />
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Hints */}
      {topic.hints && topic.hints.length > 0 && (
        <Card>
          <button
            onClick={() => setShowHints(true)}
            className={`w-full flex items-center justify-between ${showHints ? '' : 'cursor-pointer'}`}
          >
            <SectionTitle emoji="💡" title="Hints (Try Before Peeking!)" />
            {!showHints && (
              <span className="text-xs text-amber-400 border border-amber-600/40 rounded-full px-3 py-1 hover:bg-amber-900/20 transition-colors">
                Show Hints
              </span>
            )}
          </button>

          {showHints && (
            <div className="space-y-3">
              <p className="text-xs text-gray-500 mb-4">Reveal one hint at a time. Only look at the next one if you're stuck.</p>
              {topic.hints.map((hint, i) => (
                <div key={i}>
                  {revealedHints.has(i) ? (
                    <div className="flex gap-3 p-4 bg-amber-950/30 border border-amber-700/30 rounded-xl">
                      <span className="text-amber-500 font-bold text-sm shrink-0">H{i + 1}</span>
                      <p className="text-sm text-amber-100 leading-relaxed"><Prose text={hint} /></p>
                    </div>
                  ) : (
                    <button
                      onClick={() => revealHint(i)}
                      disabled={i > 0 && !revealedHints.has(i - 1)}
                      className="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed border border-gray-700 rounded-xl transition-colors"
                    >
                      <span className="text-sm text-gray-400">Hint {i + 1} of {topic.hints!.length}</span>
                      <span className="text-xs text-amber-500 font-medium">
                        {i > 0 && !revealedHints.has(i - 1) ? '🔒 Reveal Hint ' + i + ' first' : '👁 Reveal'}
                      </span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Key Takeaways */}
      {topic.keyTakeaways && topic.keyTakeaways.length > 0 && (
        <Card className="border-l-4 border-l-violet-500">
          <SectionTitle emoji="🎯" title="Key Takeaways" />
          <ul className="space-y-2">
            {topic.keyTakeaways.map((t, i) => (
              <li key={i} className="flex gap-2 text-sm text-violet-200">
                <span className="text-violet-400 mt-0.5 shrink-0">✓</span>
                <Prose text={t} />
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}

/* ─── MAIN EXPORT ──────────────────────────────────────────────────── */
export default function TopicClient({ topic, section }: Props) {
  return (
    <div className="min-h-full bg-[#0d1117] text-gray-200">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-6 flex-wrap">
          <a href="/dsa" className="hover:text-gray-300 transition-colors">DSA</a>
          <span>›</span>
          <span className={`px-2 py-0.5 rounded text-[11px] bg-linear-to-r ${section.color} text-white font-medium`}>
            {section.icon} {section.title.split(' ')[0]}
          </span>
          <span>›</span>
          <span className="text-gray-400">{topic.title}</span>
        </nav>

        {/* Topic Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h1 className="text-2xl font-bold text-white leading-tight">{topic.title}</h1>
            {topic.leetcodeUrl && (
              <a
                href={topic.leetcodeUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Open on LeetCode"
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-400 rounded-lg text-xs font-medium transition-colors"
              >
                <span>🔗</span> LeetCode
              </a>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <DiffBadge d={topic.difficulty} />
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
              topic.type === 'lesson'
                ? 'bg-blue-900/40 text-blue-300 border border-blue-700/40'
                : 'bg-purple-900/40 text-purple-300 border border-purple-700/40'
            }`}>
              {topic.type === 'lesson' ? '📖 Lesson' : '⚡ Problem'}
            </span>
            {topic.pattern && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-gray-400 border border-gray-700">
                {topic.pattern}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        {topic.type === 'lesson' ? <LessonView topic={topic} /> : <ProblemView topic={topic} />}

        {/* Interview questions */}
        {topic.interviewQuestions && topic.interviewQuestions.length > 0 && (
          <div className="mt-6">
            <InterviewQs questions={topic.interviewQuestions} />
          </div>
        )}

        {/* Bottom nav */}
        <div className="mt-10 pt-6 border-t border-gray-800 flex items-center justify-between">
          <a href="/dsa" className="text-xs text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1.5">
            ← All Sections
          </a>
          <p className="text-xs text-gray-600">Use the sidebar to navigate between topics</p>
        </div>
      </div>
    </div>
  );
}

function InterviewQs({ questions }: { questions: NonNullable<DSATopic['interviewQuestions']> }) {
  const [open, setOpen] = useState<Set<number>>(new Set());
  function toggle(i: number) {
    setOpen((prev) => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n; });
  }
  return (
    <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6">
      <h3 className="flex items-center gap-2 text-base font-bold text-gray-100 mb-4">
        <span>🎤</span> Interview Questions
      </h3>
      <div className="space-y-2">
        {questions.map((q, i) => (
          <div key={i} className="border border-gray-700/60 rounded-xl overflow-hidden">
            <button
              onClick={() => toggle(i)}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-800/50 transition-colors"
            >
              <span className="text-sm text-gray-300 font-medium">{q.question}</span>
              <span className="text-gray-500 shrink-0 ml-2">{open.has(i) ? '▲' : '▼'}</span>
            </button>
            {open.has(i) && (
              <div className="px-4 pb-4 pt-2 border-t border-gray-700/50 bg-gray-900/30">
                <p className="text-sm text-gray-300 leading-relaxed">{q.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
