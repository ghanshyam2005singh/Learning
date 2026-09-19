'use client';

import { useState } from 'react';
import type { CodeExample } from '@/types';

interface CodeBlockProps {
  example: CodeExample;
}

export function CodeBlock({ example }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(example.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-xl border border-slate-700/60 overflow-hidden my-4">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800/80 border-b border-slate-700/60">
        <span className="text-xs text-slate-400 font-medium">{example.title}</span>
        <button
          onClick={copy}
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <pre className="bg-[#0d1117] p-4 overflow-x-auto text-sm">
        <code className="text-slate-300 font-mono leading-relaxed">{example.code}</code>
      </pre>
      {example.output && (
        <div className="border-t border-slate-700/60 px-4 py-3 bg-slate-900/60">
          <span className="text-xs text-slate-500 block mb-1">Output:</span>
          <pre className="text-green-400 text-xs font-mono">{example.output}</pre>
        </div>
      )}
      {example.explanation && (
        <div className="border-t border-slate-700/60 px-4 py-3 bg-slate-900/40">
          <p className="text-slate-400 text-xs leading-relaxed">{example.explanation}</p>
        </div>
      )}
    </div>
  );
}
