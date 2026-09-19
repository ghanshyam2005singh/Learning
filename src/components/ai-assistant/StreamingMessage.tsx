'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface StreamingMessageProps {
  content: string;
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
      return (
        <div className="my-3 rounded-xl overflow-hidden border border-slate-700/60">
          {language && (
            <div className="flex items-center px-4 py-1.5 bg-slate-800/80 border-b border-slate-700/60">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">{language}</span>
            </div>
          )}
          <pre className="bg-slate-900 px-4 py-3 overflow-x-auto">
            <code className="text-xs font-mono text-slate-200 whitespace-pre leading-relaxed">{content}</code>
          </pre>
        </div>
      );
    }
    return (
      <code className="px-1.5 py-0.5 rounded bg-slate-700/60 text-violet-300 text-[0.82em] font-mono">
        {children}
      </code>
    );
  },
  pre: ({ children }: React.HTMLAttributes<HTMLPreElement>) => <>{children}</>,
} as React.ComponentProps<typeof ReactMarkdown>['components'];

export function StreamingMessage({ content }: StreamingMessageProps) {
  return (
    <div className="flex gap-3">
      {/* Avatar */}
      <div className="w-7 h-7 rounded-full shrink-0 mt-0.5 bg-violet-500/15 flex items-center justify-center">
        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" className="text-violet-400">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </div>

      {/* Bubble */}
      <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-slate-800/60 border border-slate-700/60 px-4 py-3">
        {content ? (
          <div className="prose-ai">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
              {content}
            </ReactMarkdown>
            {/* Blinking cursor appended after last rendered char */}
            <span
              className="inline-block w-[2px] h-[1em] bg-violet-400 align-middle ml-0.5 animate-pulse"
              aria-hidden="true"
            />
          </div>
        ) : (
          /* Dot animation while waiting for first chunk */
          <div className="flex items-center gap-1.5 py-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        )}
      </div>
    </div>
  );
}
