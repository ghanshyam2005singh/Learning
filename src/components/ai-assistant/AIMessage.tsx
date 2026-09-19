'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ChatMessage } from './useChatHistory';

interface AIMessageProps {
  message: ChatMessage;
}

function CodeBlock({ children, language }: { children: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(children).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="relative group my-3 rounded-xl overflow-hidden border border-slate-700/60">
      {language && (
        <div className="flex items-center justify-between px-4 py-1.5 bg-slate-800/80 border-b border-slate-700/60">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">{language}</span>
          <button
            onClick={copy}
            className="text-[10px] text-slate-500 hover:text-slate-300 transition-colors"
            aria-label="Copy code"
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
      )}
      <pre className="bg-slate-900 px-4 py-3 overflow-x-auto">
        <code className="text-xs font-mono text-slate-200 whitespace-pre leading-relaxed">{children}</code>
      </pre>
      {!language && (
        <button
          onClick={copy}
          className="absolute top-2 right-2 text-[10px] text-slate-500 hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-all bg-slate-800 px-2 py-1 rounded"
          aria-label="Copy code"
        >
          {copied ? '✓' : 'Copy'}
        </button>
      )}
    </div>
  );
}

const mdComponents = {
  p: ({ children }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="text-sm text-slate-200 leading-relaxed mb-2 last:mb-0">{children}</p>
  ),
  strong: ({ children }: React.HTMLAttributes<HTMLElement>) => (
    <strong className="text-slate-100 font-semibold">{children}</strong>
  ),
  em: ({ children }: React.HTMLAttributes<HTMLElement>) => (
    <em className="text-slate-300 italic">{children}</em>
  ),
  ul: ({ children }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="list-disc list-inside space-y-1 mb-2 text-sm text-slate-200 pl-1">{children}</ul>
  ),
  ol: ({ children }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="list-decimal list-inside space-y-1 mb-2 text-sm text-slate-200 pl-1">{children}</ol>
  ),
  li: ({ children }: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="text-slate-200 leading-relaxed">{children}</li>
  ),
  h1: ({ children }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="text-base font-bold text-white mt-3 mb-1">{children}</h1>
  ),
  h2: ({ children }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="text-sm font-bold text-white mt-3 mb-1">{children}</h2>
  ),
  h3: ({ children }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="text-sm font-semibold text-sky-300 mt-2 mb-1">{children}</h3>
  ),
  blockquote: ({ children }: React.HTMLAttributes<HTMLElement>) => (
    <blockquote className="border-l-2 border-violet-500 pl-3 my-2 text-slate-400 italic text-sm">{children}</blockquote>
  ),
  hr: () => <hr className="border-slate-700 my-3" />,
  table: ({ children }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="overflow-x-auto my-2">
      <table className="w-full text-xs border-collapse">{children}</table>
    </div>
  ),
  thead: ({ children }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead className="bg-slate-800/60">{children}</thead>
  ),
  tbody: ({ children }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <tbody className="divide-y divide-slate-800">{children}</tbody>
  ),
  tr: ({ children }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr className="hover:bg-slate-800/30">{children}</tr>
  ),
  th: ({ children }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th className="px-3 py-1.5 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-700">
      {children}
    </th>
  ),
  td: ({ children }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td className="px-3 py-1.5 text-slate-300 border-b border-slate-800/60">{children}</td>
  ),
  code: ({ className, children }: React.HTMLAttributes<HTMLElement>) => {
    const language = className?.replace('language-', '');
    const content = String(children).replace(/\n$/, '');
    if (className?.startsWith('language-')) {
      return <CodeBlock language={language}>{content}</CodeBlock>;
    }
    return (
      <code className="px-1.5 py-0.5 rounded bg-slate-700/60 text-violet-300 text-[0.82em] font-mono">
        {children}
      </code>
    );
  },
  pre: ({ children }: React.HTMLAttributes<HTMLPreElement>) => <>{children}</>,
} as React.ComponentProps<typeof ReactMarkdown>['components'];

export function AIMessage({ message }: AIMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div
        className={`w-7 h-7 rounded-full shrink-0 mt-0.5 flex items-center justify-center text-[11px] font-bold ${
          isUser
            ? 'bg-violet-600 text-white'
            : 'bg-violet-500/15 text-violet-400'
        }`}
      >
        {isUser ? (
          'U'
        ) : (
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-violet-600/20 border border-violet-500/30 rounded-tr-sm text-sm text-slate-200 leading-relaxed'
            : 'bg-slate-800/60 border border-slate-700/60 rounded-tl-sm'
        }`}
      >
        {isUser ? (
          <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="prose-ai">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
              {message.content}
            </ReactMarkdown>
          </div>
        )}
        <p className="text-[10px] text-slate-600 mt-1.5 text-right">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}
