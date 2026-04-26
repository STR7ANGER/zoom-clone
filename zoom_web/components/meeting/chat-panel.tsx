"use client"

import { Copy, FileText, MessageSquare, MoreHorizontal, Send, Smile, X } from "lucide-react"

import type { ChatMessage } from "@/features/meeting-room/types"

export function ChatPanel({
  title,
  messages,
  participantId,
  chatText,
  onTextChange,
  onSubmit,
  onClose,
}: {
  title: string
  messages: ChatMessage[]
  participantId: string
  chatText: string
  onTextChange: (value: string) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  onClose: () => void
}) {
  return (
    <aside className="flex w-[560px] shrink-0 flex-col bg-white text-[#232333]">
      <div className="relative flex h-14 items-center justify-center border-b border-[#eceff4] px-5">
        <MessageSquare className="absolute left-5 size-5 text-[#8a9099]" />
        <h2 className="max-w-[360px] truncate text-xl font-bold">{title}</h2>
        <div className="absolute right-4 flex items-center gap-3 text-[#6b7280]">
          <button type="button" aria-label="Pop out">
            <Copy className="size-5" />
          </button>
          <button type="button" onClick={onClose} aria-label="Close chat">
            <X className="size-6" />
          </button>
        </div>
      </div>
      <div className="px-8 py-5 text-center text-base leading-snug text-[#858891]">
        Messages addressed to &quot;Meeting Group Chat&quot; will also appear in the meeting group chat in Team Chat
      </div>
      <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
        {messages.map((message) => (
          <div key={message.id} className={message.from === participantId ? "text-right" : ""}>
            <p className="text-xs font-semibold text-[#6b7280]">{message.fromName}</p>
            <p
              className={`mt-1 inline-block max-w-[86%] rounded-2xl px-4 py-2 text-left text-base ${
                message.from === participantId ? "bg-[#0b5cff] text-white" : "bg-[#f1f3f7] text-[#232333]"
              }`}
            >
              {message.text}
            </p>
          </div>
        ))}
      </div>
      <form onSubmit={onSubmit} className="border-t border-[#eceff4] bg-white">
        <div className="bg-[#f6f7fb] py-2 text-center text-sm text-[#7b8190]">Who can see your messages?</div>
        <div className="px-4 pt-3 text-lg">
          to: <span className="rounded-full bg-[#3f7df6] px-4 py-1 text-white">Meeting Group Chat</span>
        </div>
        <textarea
          value={chatText}
          onChange={(event) => onTextChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault()
              event.currentTarget.form?.requestSubmit()
            }
          }}
          placeholder="Type message here ..."
          className="h-24 w-full resize-none px-4 py-3 text-lg outline-none placeholder:text-[#9299a6]"
        />
        <div className="flex items-center justify-between px-4 pb-4 text-[#89909c]">
          <div className="flex items-center gap-5">
            <FileText className="size-5" />
            <Smile className="size-5" />
            <MoreHorizontal className="size-6" />
          </div>
          <button
            type="submit"
            disabled={!chatText.trim()}
            className="flex size-9 items-center justify-center rounded-lg bg-[#e3e7ef] text-[#8c93a1] enabled:bg-[#0b5cff] enabled:text-white"
            aria-label="Send message"
          >
            <Send className="size-5" />
          </button>
        </div>
      </form>
    </aside>
  )
}
