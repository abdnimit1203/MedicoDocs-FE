'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { fetchWithAuth } from '@/lib/api'
import { toast } from 'react-hot-toast'
import { Send, Sparkles, Loader2, User as UserIcon } from 'lucide-react'

interface ChatMessage {
  role: 'user' | 'assistant'
  text: string
}

const STARTER_PROMPTS = [
  'Show me my recent prescriptions',
  'What medicines were prescribed recently?',
  'What tests have I done recently?',
  'How have my test values changed over time?',
  'Summarize my recent medical history',
]

export function AssistantChat() {
  const { getToken } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isSending])

  const sendMessage = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || isSending) return

    setMessages((prev) => [...prev, { role: 'user', text: trimmed }])
    setInput('')
    setIsSending(true)

    try {
      const token = await getToken()
      const response = await fetchWithAuth('/assistant/chat', token, {
        method: 'POST',
        body: JSON.stringify({ message: trimmed }),
      })

      if (response.success && response.data?.answer) {
        setMessages((prev) => [...prev, { role: 'assistant', text: response.data.answer }])
      } else {
        throw new Error(response.error?.message || 'The assistant did not return a valid response.')
      }
    } catch (err: any) {
      const errText = err.message || 'Failed to reach the AI Assistant.'
      toast.error(errText)
      setMessages((prev) => [...prev, { role: 'assistant', text: `⚠️ ${errText}` }])
    } finally {
      setIsSending(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  return (
    <div className="bg-white border border-slate-200 rounded-3xl shadow-xs flex flex-col h-[70vh] sm:h-[75vh] w-full max-w-full overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200 bg-[#F8F9F7] flex items-center gap-2 shrink-0">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#8F1D2C] to-[#3B988E] flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div className="min-w-0">
          <h2 className="font-bold text-sm text-[#17201D]">AI Medical Assistant</h2>
          <p className="text-[10px] text-[#68736F]">Answers only from your own stored MedicoDocs records</p>
        </div>
      </div>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center gap-4 px-4">
            <div className="w-14 h-14 rounded-2xl bg-[#F8E9EC] text-[#8F1D2C] flex items-center justify-center">
              <Sparkles className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-[#17201D]">Ask about your medical records</h3>
              <p className="text-xs text-[#68736F] max-w-xs">
                I can only answer using your own prescriptions and test reports stored in MedicoDocs.
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5 justify-center max-w-md">
              {STARTER_PROMPTS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => sendMessage(p)}
                  className="px-3 py-1.5 rounded-full border border-slate-200 bg-[#F8F9F7] hover:bg-[#F8E9EC] hover:border-[#8F1D2C]/40 hover:text-[#8F1D2C] text-[11px] font-semibold text-[#68736F] transition-all"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-lg bg-[#F8E9EC] text-[#8F1D2C] flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                    m.role === 'user'
                      ? 'bg-[#8F1D2C] text-white rounded-br-sm'
                      : 'bg-[#F8F9F7] border border-slate-200 text-[#17201D] rounded-bl-sm'
                  }`}
                >
                  {m.text}
                </div>
                {m.role === 'user' && (
                  <div className="w-6 h-6 rounded-lg bg-slate-100 text-[#68736F] flex items-center justify-center shrink-0 mt-0.5">
                    <UserIcon className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}
            {isSending && (
              <div className="flex items-start gap-2 justify-start">
                <div className="w-6 h-6 rounded-lg bg-[#F8E9EC] text-[#8F1D2C] flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div className="px-3.5 py-2.5 rounded-2xl rounded-bl-sm bg-[#F8F9F7] border border-slate-200 flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#8F1D2C]" />
                  <span className="text-xs text-[#68736F]">Thinking...</span>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Compact starter chips once the conversation has started */}
      {messages.length > 0 && (
        <div className="px-3 pt-2 flex gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          {STARTER_PROMPTS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => sendMessage(p)}
              disabled={isSending}
              className="px-2.5 py-1 rounded-full border border-slate-200 bg-white hover:bg-[#F8E9EC] hover:border-[#8F1D2C]/40 hover:text-[#8F1D2C] text-[10px] font-semibold text-[#68736F] transition-all shrink-0 disabled:opacity-50"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input box */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-slate-200 flex items-center gap-2 shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your prescriptions, medicines, or test reports..."
          disabled={isSending}
          className="flex-1 min-w-0 px-3.5 py-2.5 bg-white border border-slate-300 rounded-full text-xs sm:text-sm text-[#17201D] focus:outline-none focus:border-[#8F1D2C] disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={isSending || !input.trim()}
          className="w-10 h-10 rounded-full bg-[#8F1D2C] hover:bg-[#741522] disabled:opacity-50 disabled:hover:bg-[#8F1D2C] text-white flex items-center justify-center shrink-0 transition-all"
          aria-label="Send"
        >
          {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </form>
    </div>
  )
}
