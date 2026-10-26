'use client'

import { useState, useRef, useEffect } from 'react'
import { useProgressStore } from '@/store/progress'
import { getAIClient } from '@/lib/ai'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

function buildSystemPrompt(modules: ReturnType<typeof useProgressStore.getState>['modules']) {
  const summary = modules.map((m) => {
    const done = m.topics.filter((t) => t.status === 'done').length
    const inProgress = m.topics.filter((t) => t.status === 'in_progress').length
    return `- ${m.title}: ${done}/${m.topics.length} done, ${inProgress} in progress`
  }).join('\n')

  return `You are an XR development learning coach. The user is studying:
${summary}

Help them understand topics, suggest what to study next, explain concepts clearly, and encourage their progress. Keep answers concise and practical.`
}

export function AIAssistant() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const modules = useProgressStore((s) => s.modules)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function send() {
    if (!input.trim() || loading) return
    const userMsg: Message = { role: 'user', content: input.trim() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await getAIClient().chat.completions.create({
        model: 'claude-haiku-4-5',
        messages: [
          { role: 'system', content: buildSystemPrompt(modules) },
          ...messages,
          userMsg,
        ],
      })
      const reply = res.choices[0]?.message?.content ?? 'No response.'
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
    } catch (e) {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Error reaching AI. Check your API key.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-500 text-white shadow-lg flex items-center justify-center text-xl transition-all z-50"
        title="AI Coach"
      >
        {open ? '×' : '✦'}
      </button>

      {/* panel */}
      {open && (
        <div className="fixed bottom-20 right-6 w-80 h-[480px] flex flex-col rounded-2xl border border-white/15 bg-[#111113] shadow-2xl z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-400" />
            <span className="text-sm font-medium text-white">AI Coach</span>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.length === 0 && (
              <p className="text-white/30 text-sm text-center mt-8">
                Ask me anything about your XR learning journey.
              </p>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={`text-sm rounded-xl px-3 py-2 max-w-[90%] ${
                  m.role === 'user'
                    ? 'bg-purple-600/20 text-white ml-auto'
                    : 'bg-white/8 text-white/80'
                }`}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="bg-white/8 text-white/40 text-sm rounded-xl px-3 py-2 w-12 animate-pulse">
                ...
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="px-3 py-3 border-t border-white/10 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Ask something..."
              className="flex-1 bg-white/8 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:bg-white/12 transition-colors"
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className="bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white rounded-lg px-3 py-2 text-sm transition-colors"
            >
              ↑
            </button>
          </div>
        </div>
      )}
    </>
  )
}
