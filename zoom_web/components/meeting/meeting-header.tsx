"use client"

import { Copy, ShieldCheck, Video } from "lucide-react"

export function MeetingHeader({
  showChrome,
  inviteLink,
}: {
  showChrome: boolean
  inviteLink: string
}) {
  return (
    <header
      className={`flex items-center justify-between overflow-hidden bg-black px-8 transition-[height,opacity] duration-200 ${
        showChrome ? "h-[70px] opacity-100" : "h-0 opacity-0"
      }`}
    >
      <div className="leading-none">
        <p className="text-[15px] font-semibold tracking-tight">zoom</p>
        <p className="text-2xl font-bold">Workplace</p>
      </div>
      <div className="flex items-center gap-6 text-white/90">
        <ShieldCheck className="size-6 fill-[#39e168] text-[#39e168]" />
        <span className="h-9 w-px bg-white/25" />
        <button type="button" className="inline-flex items-center gap-2 text-lg">
          <Video className="size-5" />
          View
        </button>
        <button type="button" onClick={() => navigator.clipboard.writeText(inviteLink)} aria-label="Copy invite">
          <Copy className="size-6" />
        </button>
      </div>
    </header>
  )
}
