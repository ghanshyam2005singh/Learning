'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { AIMessage } from './AIMessage';
import { StreamingMessage } from './StreamingMessage';
import { useChatHistory } from './useChatHistory';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

type Size = 'normal' | 'minimized' | 'maximized';

export function AIAssistant({ isOpen, onClose }: AIAssistantProps) {
  const [size, setSize] = useState<Size>('normal');
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const { messages, addMessage, clearHistory } = useChatHistory();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText, scrollToBottom]);

  useEffect(() => {
    if (isOpen && size !== 'minimized') {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, size]);

  // Cancel in-flight stream when closed
  useEffect(() => {
    if (!isOpen && abortRef.current) {
      abortRef.current.abort();
    }
  }, [isOpen]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || isStreaming) return;

    setInput('');
    setError(null);
    addMessage({ role: 'user', content: text });
    setIsStreaming(true);
    setStreamingText('');

    abortRef.current = new AbortController();

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history }),
        signal: abortRef.current.signal,
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Request failed (${res.status})`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        full += chunk;
        setStreamingText(full);
      }

      // Commit the completed message to history
      if (full.trim()) {
        addMessage({ role: 'assistant', content: full });
      }
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsStreaming(false);
      setStreamingText('');
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function handleRetry() {
    setError(null);
    const lastUser = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUser) setInput(lastUser.content);
  }

  function handleStop() {
    abortRef.current?.abort();
  }

  if (!isOpen) return null;

  if (size === 'minimized') {
    return (
      <div className="fixed bottom-24 right-4 z-50">
        <button
          onClick={() => setSize('normal')}
          className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-full shadow-xl shadow-violet-900/40 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-400"
          aria-label="Restore AI Assistant"
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          AI Assistant
          {messages.length > 0 && (
            <span className="flex items-center justify-center w-4 h-4 rounded-full bg-white/20 text-[10px] font-bold">
              {messages.length}
            </span>
          )}
        </button>
      </div>
    );
  }

  const isMax = size === 'maximized';

  return (
    <div
      className={`fixed z-50 flex flex-col bg-[#07070b] border border-slate-700/60 shadow-2xl shadow-black/60 transition-all duration-200 ${
        isMax
          ? 'inset-3 sm:inset-6 rounded-2xl'
          : 'bottom-24 right-4 w-[calc(100vw-2rem)] sm:w-[min(420px,calc(100vw-3rem))] h-[min(600px,calc(100vh-7rem))] rounded-2xl'
      }`}
      role="dialog"
      aria-label="AI Assistant"
      aria-modal="true"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-violet-500/15 flex items-center justify-center">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" className="text-violet-400">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-100">AI Assistant</p>
            <p className="text-[10px] text-slate-500">
              {isStreaming ? (
                <span className="text-violet-400 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-violet-400 animate-pulse inline-block" />
                  Thinking…
                </span>
              ) : 'Powered by Gemini'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {messages.length > 0 && !isStreaming && (
            <button
              onClick={clearHistory}
              className="p-1.5 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-lg transition-colors text-[10px] px-2"
              aria-label="Clear chat history"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setSize('minimized')}
            className="p-1.5 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Minimize"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
          <button
            onClick={() => setSize(isMax ? 'normal' : 'maximized')}
            className="p-1.5 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
            aria-label={isMax ? 'Restore' : 'Maximize'}
          >
            {isMax ? (
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <polyline points="4,14 10,14 10,20" /><polyline points="20,10 14,10 14,4" />
                <line x1="10" y1="14" x2="3" y2="21" /><line x1="21" y1="3" x2="14" y2="10" />
              </svg>
            ) : (
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <polyline points="15,3 21,3 21,9" /><polyline points="9,21 3,21 3,15" />
                <line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
              </svg>
            )}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            aria-label="Close"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0">
        {messages.length === 0 && !isStreaming && (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center mb-3">
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" className="text-violet-400">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-300 mb-1">Ask me anything</p>
            <p className="text-xs text-slate-500 max-w-xs">
              Explain concepts, debug code, compare technologies, or prepare for interviews.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              {['Explain closures', 'What is a Promise?', 'Explain binary search', 'Difference: TCP vs UDP'].map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => setInput(prompt)}
                  className="text-xs px-3 py-1.5 rounded-full border border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-500 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <AIMessage key={msg.id} message={msg} />
        ))}

        {/* Live streaming message */}
        {isStreaming && (
          <StreamingMessage content={streamingText} />
        )}

        {error && (
          <div className="flex items-start gap-3 p-3 bg-red-500/5 border border-red-500/20 rounded-xl">
            <span className="text-red-400 text-sm shrink-0">⚠</span>
            <div className="flex-1 min-w-0">
              <p className="text-red-300 text-sm">{error}</p>
              <button
                onClick={handleRetry}
                className="mt-2 text-xs text-red-400 hover:text-red-300 underline underline-offset-2"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 pb-4 pt-3 border-t border-slate-800 shrink-0">
        <div className="flex items-end gap-2 bg-slate-800/50 border border-slate-700/60 rounded-xl px-3 py-2 focus-within:border-violet-500/50 transition-colors">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything… (Enter to send, Shift+Enter for new line)"
            rows={1}
            disabled={isStreaming}
            className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-500 resize-none outline-none min-h-6 max-h-32 leading-6 disabled:opacity-50"
            onInput={(e) => {
              const t = e.currentTarget;
              t.style.height = 'auto';
              t.style.height = Math.min(t.scrollHeight, 128) + 'px';
            }}
            aria-label="Message input"
          />
          {isStreaming ? (
            <button
              onClick={handleStop}
              className="shrink-0 w-8 h-8 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 flex items-center justify-center transition-colors"
              aria-label="Stop generating"
              title="Stop"
            >
              <svg width="10" height="10" fill="currentColor" viewBox="0 0 16 16">
                <rect x="2" y="2" width="12" height="12" rx="1" />
              </svg>
            </button>
          ) : (
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="shrink-0 w-8 h-8 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:bg-slate-700 disabled:text-slate-500 text-white flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-violet-400"
              aria-label="Send message"
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22,2 15,22 11,13 2,9" />
              </svg>
            </button>
          )}
        </div>
        <p className="text-[10px] text-slate-600 mt-1.5 text-center">AI can make mistakes. Verify important information.</p>
      </div>
    </div>
  );
}
