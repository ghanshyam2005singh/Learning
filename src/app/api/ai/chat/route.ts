import { NextRequest } from 'next/server';

const GEMINI_STREAM_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse';

const SYSTEM_PROMPT = `You are a knowledgeable programming tutor and learning assistant embedded in a developer learning platform.

Students use this platform to learn JavaScript, TypeScript, React, Next.js, Node.js, System Design, DSA (Data Structures & Algorithms), Web Development, AI Engineering, and more.

Your role:
- Explain concepts clearly, starting from basics when needed
- Provide practical, runnable code examples with explanations
- Help debug code and identify issues
- Compare technologies and explain when to use each
- Prepare students for technical interviews
- Answer DSA questions with step-by-step explanations
- Be encouraging and patient

Guidelines:
- Always explain WHY before showing code
- Use markdown formatting for all responses
- For code, use proper fenced code blocks with language identifiers
- Keep responses focused and educational
- For complex topics, break them into digestible parts`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history } = body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Message is required' }), { status: 400 });
    }

    if (message.length > 4000) {
      return new Response(JSON.stringify({ error: 'Message is too long (max 4000 characters)' }), { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'Gemini API key is not configured. Set GEMINI_API_KEY in .env.local' }),
        { status: 500 }
      );
    }

    const validHistory = Array.isArray(history)
      ? history.filter(
          (h) => h && typeof h === 'object' && (h.role === 'user' || h.role === 'assistant') && typeof h.content === 'string'
        )
      : [];

    const contents = [
      ...validHistory.map((m: { role: string; content: string }) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      })),
      { role: 'user', parts: [{ text: message.trim() }] },
    ];

    const geminiBody = {
      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents,
      generationConfig: { temperature: 0.7, topK: 40, topP: 0.95, maxOutputTokens: 2048 },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      ],
    };

    const geminiRes = await fetch(`${GEMINI_STREAM_URL}&key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiBody),
    });

    if (!geminiRes.ok || !geminiRes.body) {
      const err = await geminiRes.json().catch(() => ({}));
      return new Response(
        JSON.stringify({ error: err?.error?.message || `Gemini error (${geminiRes.status})` }),
        { status: 502 }
      );
    }

    // Pipe Gemini SSE → plain text stream (just the text deltas)
    const encoder = new TextEncoder();
    const upstream = geminiRes.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    const stream = new ReadableStream({
      async pull(controller) {
        while (true) {
          const { done, value } = await upstream.read();
          if (done) {
            controller.close();
            return;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const json = line.slice(6).trim();
            if (!json || json === '[DONE]') continue;
            try {
              const data = JSON.parse(json);
              const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;
              if (text) {
                controller.enqueue(encoder.encode(text));
                return; // yield one chunk per pull for smooth streaming
              }
            } catch {
              // skip malformed chunk
            }
          }
        }
      },
      cancel() {
        upstream.cancel();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error';
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}
