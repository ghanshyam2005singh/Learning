'use client';

import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import type { Project } from '@/types';

const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

type OutputMode = 'console' | 'preview';

interface ProjectCodingPaneProps {
  project: Project;
}

export function ProjectCodingPane({ project }: ProjectCodingPaneProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [code, setCode] = useState(project.steps[0]?.code || '// Write your code here\n');
  const [outputMode, setOutputMode] = useState<OutputMode>('console');
  const [consoleOutput, setConsoleOutput] = useState<{ text: string; type: 'log' | 'error' | 'info' }[]>([]);
  const [iframeContent, setIframeContent] = useState('');
  const [showHint, setShowHint] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const step = project.steps[stepIndex];
  const isHtmlProject = project.techStack.some((t) => t.toLowerCase().includes('html'));

  useEffect(() => {
    setShowHint(false);
    if (step?.code) {
      // Don't auto-load — let user choose
    }
  }, [stepIndex]);

  function loadStepCode() {
    if (step?.code) {
      setCode(step.code);
    }
  }

  function runCode() {
    const isHtml = code.trimStart().startsWith('<!') || code.trimStart().startsWith('<html');

    if (isHtml) {
      setOutputMode('preview');
      setIframeContent(code);
      return;
    }

    setOutputMode('console');
    const logs: { text: string; type: 'log' | 'error' | 'info' }[] = [];

    const origLog = console.log;
    const origError = console.error;
    const origWarn = console.warn;

    console.log = (...args: unknown[]) =>
      logs.push({ text: args.map((a) => (typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a))).join(' '), type: 'log' });
    console.error = (...args: unknown[]) =>
      logs.push({ text: args.map(String).join(' '), type: 'error' });
    console.warn = (...args: unknown[]) =>
      logs.push({ text: args.map(String).join(' '), type: 'info' });

    try {
      // eslint-disable-next-line no-new-func
      new Function(code)();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      logs.push({ text: `❌ ${msg}`, type: 'error' });
    } finally {
      console.log = origLog;
      console.error = origError;
      console.warn = origWarn;
    }

    setConsoleOutput(logs);
  }

  function clearOutput() {
    setConsoleOutput([]);
    setIframeContent('');
  }

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/80 border-b border-slate-700/60 flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500">Step</span>
          <div className="flex items-center gap-1">
            {project.steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setStepIndex(i)}
                className={`w-6 h-6 rounded text-[11px] font-medium transition-colors ${
                  i === stepIndex
                    ? 'bg-violet-600 text-white'
                    : 'bg-slate-800 text-slate-500 hover:bg-slate-700 hover:text-slate-300'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {step?.code && (
            <button
              onClick={loadStepCode}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Load Step Code
            </button>
          )}
          <button
            onClick={runCode}
            className="px-4 py-1.5 text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-colors flex items-center gap-1.5"
          >
            <span>▶</span> Run
          </button>
        </div>
      </div>

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Left: Step instructions */}
        <div className="w-72 flex-shrink-0 border-r border-slate-700/60 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-400 text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {stepIndex + 1}
                </span>
                <h3 className="font-semibold text-slate-100 text-sm leading-tight">{step?.title}</h3>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">{step?.description}</p>
            </div>

            {step?.hint && (
              <div>
                <button
                  onClick={() => setShowHint((s) => !s)}
                  className="text-xs text-yellow-400/80 hover:text-yellow-400 transition-colors"
                >
                  💡 {showHint ? 'Hide hint' : 'Show hint'}
                </button>
                {showHint && (
                  <p className="mt-2 text-yellow-300/70 text-xs leading-relaxed bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-2.5">
                    {step.hint}
                  </p>
                )}
              </div>
            )}

            {step?.code && (
              <div className="bg-slate-900/80 rounded-lg border border-slate-700/60 overflow-hidden">
                <div className="flex items-center justify-between px-3 py-1.5 bg-slate-800/60 border-b border-slate-700/60">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">Reference Code</span>
                  <button
                    onClick={loadStepCode}
                    className="text-[10px] text-violet-400 hover:text-violet-300 transition-colors"
                  >
                    Load →
                  </button>
                </div>
                <pre className="p-3 text-[11px] text-slate-400 font-mono overflow-x-auto leading-relaxed max-h-48 overflow-y-auto">
                  {step.code}
                </pre>
              </div>
            )}
          </div>

          {/* Step navigation */}
          <div className="border-t border-slate-700/60 p-3 flex items-center justify-between">
            <button
              onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
              disabled={stepIndex === 0}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed border border-slate-700 hover:border-slate-600 rounded-lg transition-colors"
            >
              ← Prev
            </button>
            <span className="text-xs text-slate-600">{stepIndex + 1}/{project.steps.length}</span>
            <button
              onClick={() => setStepIndex((i) => Math.min(project.steps.length - 1, i + 1))}
              disabled={stepIndex === project.steps.length - 1}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed border border-slate-700 hover:border-slate-600 rounded-lg transition-colors"
            >
              Next →
            </button>
          </div>
        </div>

        {/* Right: Editor + output */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Editor (60%) */}
          <div className="flex-1 border-b border-slate-700/60" style={{ minHeight: 0 }}>
            <Editor
              height="100%"
              defaultLanguage="javascript"
              value={code}
              onChange={(v) => setCode(v || '')}
              theme="vs-dark"
              options={{
                fontSize: 13,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                padding: { top: 10 },
                fontFamily: 'var(--font-geist-mono), monospace',
                lineNumbers: 'on',
                renderLineHighlight: 'gutter',
              }}
            />
          </div>

          {/* Output area (40%) */}
          <div className="h-48 flex flex-col overflow-hidden flex-shrink-0">
            <div className="flex items-center justify-between px-4 py-1.5 bg-slate-900/60 border-b border-slate-700/60">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setOutputMode('console')}
                  className={`text-xs px-2 py-0.5 rounded transition-colors ${outputMode === 'console' ? 'text-slate-200 bg-slate-700' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Console
                </button>
                {isHtmlProject && (
                  <button
                    onClick={() => setOutputMode('preview')}
                    className={`text-xs px-2 py-0.5 rounded transition-colors ${outputMode === 'preview' ? 'text-slate-200 bg-slate-700' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    Preview
                  </button>
                )}
              </div>
              <button onClick={clearOutput} className="text-[10px] text-slate-600 hover:text-slate-400 transition-colors">
                Clear
              </button>
            </div>

            <div className="flex-1 overflow-auto">
              {outputMode === 'console' ? (
                <div className="p-3 font-mono text-xs h-full">
                  {consoleOutput.length === 0 ? (
                    <p className="text-slate-600">Click Run to see output…</p>
                  ) : (
                    consoleOutput.map((line, i) => (
                      <div
                        key={i}
                        className={`flex gap-2 leading-5 ${
                          line.type === 'error' ? 'text-red-400' : line.type === 'info' ? 'text-yellow-400' : 'text-green-300'
                        }`}
                      >
                        <span className="text-slate-700 select-none">&gt;</span>
                        <pre className="whitespace-pre-wrap break-all">{line.text}</pre>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <iframe
                  ref={iframeRef}
                  title="preview"
                  className="w-full h-full bg-white"
                  srcDoc={iframeContent || '<p style="padding:12px;color:#666;font-size:13px">Write HTML and click Run to see preview</p>'}
                  sandbox="allow-scripts allow-same-origin"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
