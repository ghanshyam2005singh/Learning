'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import type { Exercise as ExerciseType } from '@/types';

const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface ExerciseProps {
  exercise: ExerciseType;
}

export function Exercise({ exercise }: ExerciseProps) {
  const [code, setCode] = useState(exercise.starterCode);
  const [output, setOutput] = useState('');
  const [passed, setPassed] = useState<boolean | null>(null);
  const [hintsShown, setHintsShown] = useState(0);
  const [showSolution, setShowSolution] = useState(false);

  function runCode() {
    const logs: string[] = [];
    const origLog = console.log;
    console.log = (...args: unknown[]) =>
      logs.push(args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));

    try {
      // eslint-disable-next-line no-new-func
      new Function(code)();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      logs.push(`Error: ${msg}`);
    } finally {
      console.log = origLog;
    }

    const actual = logs.join('\n');
    setOutput(actual);

    if (exercise.expectedOutput) {
      const clean = (s: string) => s.replace(/["']/g, '').trim().toLowerCase();
      setPassed(clean(actual) === clean(exercise.expectedOutput));
    }
  }

  return (
    <div className="border border-slate-700/60 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-slate-800/60 px-4 py-3 flex items-start justify-between">
        <div>
          <h4 className="font-semibold text-slate-100 text-sm">{exercise.title}</h4>
          <p className="text-slate-400 text-xs mt-0.5">{exercise.description}</p>
        </div>
        {passed !== null && (
          <span className={`text-lg ${passed ? 'text-green-400' : 'text-red-400'}`}>
            {passed ? '✓' : '✗'}
          </span>
        )}
      </div>

      {/* Editor */}
      <Editor
        height="220px"
        defaultLanguage="javascript"
        value={code}
        onChange={(v) => setCode(v || '')}
        theme="vs-dark"
        options={{
          fontSize: 13,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          padding: { top: 8 },
          fontFamily: 'var(--font-geist-mono), monospace',
        }}
      />

      {/* Actions */}
      <div className="bg-slate-800/40 px-4 py-3 flex flex-wrap items-center gap-2">
        <button
          onClick={runCode}
          className="px-4 py-1.5 text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white rounded transition-colors"
        >
          ▶ Run Code
        </button>

        {hintsShown < exercise.hints.length && (
          <button
            onClick={() => setHintsShown((n) => n + 1)}
            className="px-3 py-1.5 text-xs text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/10 rounded transition-colors"
          >
            Show Hint {hintsShown + 1}/{exercise.hints.length}
          </button>
        )}

        <button
          onClick={() => setShowSolution((s) => !s)}
          className="px-3 py-1.5 text-xs text-slate-400 border border-slate-700 hover:bg-slate-700/60 rounded transition-colors"
        >
          {showSolution ? 'Hide' : 'Show'} Solution
        </button>
      </div>

      {/* Hints */}
      {hintsShown > 0 && (
        <div className="px-4 py-3 bg-yellow-500/5 border-t border-yellow-500/20 space-y-1">
          {exercise.hints.slice(0, hintsShown).map((hint, i) => (
            <p key={i} className="text-yellow-300 text-xs">
              💡 {hint}
            </p>
          ))}
        </div>
      )}

      {/* Output */}
      {output && (
        <div className={`px-4 py-3 border-t font-mono text-xs space-y-1 ${passed === false ? 'border-red-500/20 bg-red-500/5' : passed ? 'border-green-500/20 bg-green-500/5' : 'border-slate-700/60 bg-slate-900/50'}`}>
          <div className="text-slate-500 text-xs mb-1">Output:</div>
          <pre className={passed === false ? 'text-red-300' : passed ? 'text-green-300' : 'text-slate-300'}>
            {output}
          </pre>
          {exercise.expectedOutput && (
            <div className="mt-2">
              <span className="text-slate-500">Expected: </span>
              <span className="text-slate-400">{exercise.expectedOutput}</span>
            </div>
          )}
        </div>
      )}

      {/* Solution */}
      {showSolution && (
        <div className="border-t border-slate-700/60">
          <div className="px-4 py-2 bg-slate-800/60 text-xs text-slate-500">Solution</div>
          <Editor
            height="160px"
            defaultLanguage="javascript"
            value={exercise.solution}
            theme="vs-dark"
            options={{
              fontSize: 13,
              minimap: { enabled: false },
              readOnly: true,
              scrollBeyondLastLine: false,
              padding: { top: 8 },
              fontFamily: 'var(--font-geist-mono), monospace',
            }}
          />
        </div>
      )}
    </div>
  );
}
