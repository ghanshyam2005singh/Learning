'use client';

import { useState, useRef } from 'react';
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface CodePlaygroundProps {
  initialCode?: string;
  height?: string;
  readOnly?: boolean;
}

export function CodePlayground({
  initialCode = '// Write your JavaScript here\nconsole.log("Hello, World!");\n',
  height = '400px',
  readOnly = false,
}: CodePlaygroundProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string[]>([]);
  const [hasError, setHasError] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  function runCode() {
    setIsRunning(true);
    const logs: string[] = [];

    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    console.log = (...args: unknown[]) => {
      logs.push(args.map((a) => (typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a))).join(' '));
      originalLog(...args);
    };
    console.error = (...args: unknown[]) => {
      logs.push('Error: ' + args.map(String).join(' '));
      originalError(...args);
    };
    console.warn = (...args: unknown[]) => {
      logs.push('Warning: ' + args.map(String).join(' '));
      originalWarn(...args);
    };

    let errored = false;
    try {
      // eslint-disable-next-line no-new-func
      new Function(code)();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      logs.push(`❌ ${msg}`);
      errored = true;
    } finally {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
    }

    setOutput(logs);
    setHasError(errored);
    setIsRunning(false);
  }

  function reset() {
    setCode(initialCode);
    setOutput([]);
    setHasError(false);
  }

  return (
    <div className="rounded-xl border border-slate-700/60 overflow-hidden bg-slate-900">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800/80 border-b border-slate-700/60">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/60" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
          <div className="w-3 h-3 rounded-full bg-green-500/60" />
          <span className="ml-2 text-xs text-slate-500 font-mono">JavaScript</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={reset}
            className="px-3 py-1 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-700/60 rounded transition-colors"
          >
            Reset
          </button>
          <button
            onClick={runCode}
            disabled={isRunning}
            className="px-4 py-1.5 text-xs font-semibold bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white rounded transition-colors flex items-center gap-1.5"
          >
            <span>▶</span> Run
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Editor */}
        <div className="border-b lg:border-b-0 lg:border-r border-slate-700/60">
          <Editor
            height={height}
            defaultLanguage="javascript"
            value={code}
            onChange={(v) => !readOnly && setCode(v || '')}
            theme="vs-dark"
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              padding: { top: 12 },
              readOnly,
              fontFamily: 'var(--font-geist-mono), monospace',
              lineNumbers: 'on',
              renderLineHighlight: 'line',
              cursorBlinking: 'smooth',
            }}
          />
        </div>

        {/* Output */}
        <div className="bg-[#0d0d14] p-4 font-mono text-sm" style={{ minHeight: height }}>
          <div className="text-xs text-slate-500 mb-3 uppercase tracking-wider">Output</div>
          {output.length === 0 ? (
            <p className="text-slate-600 text-xs">Run code to see output…</p>
          ) : (
            <div className="space-y-1">
              {output.map((line, i) => (
                <div
                  key={i}
                  className={
                    line.startsWith('❌') || line.startsWith('Error:')
                      ? 'text-red-400'
                      : line.startsWith('Warning:')
                      ? 'text-yellow-400'
                      : 'text-green-300'
                  }
                >
                  <span className="text-slate-600 select-none mr-2">&gt;</span>
                  {line}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
