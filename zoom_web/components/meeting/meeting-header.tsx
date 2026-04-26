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
      className={`flex items-center justify-between gap-3 overflow-hidden bg-black px-3 transition-[height,opacity] duration-200 sm:px-5 lg:px-8 ${
        showChrome ? "h-[58px] opacity-100 sm:h-[70px]" : "h-0 opacity-0"
      }`}
    >
      <div className="leading-none">
        <p className="text-[13px] font-semibold tracking-tight sm:text-[15px]">zoom</p>
        <p className="text-lg font-bold sm:text-2xl">Workplace</p>
      </div>
      <div className="flex items-center gap-3 text-white/90 sm:gap-6">
        <ShieldCheck className="size-5 fill-[#39e168] text-[#39e168] sm:size-6" />
        <span className="hidden h-9 w-px bg-white/25 sm:block" />
        <button type="button" className="inline-flex items-center gap-1.5 text-sm sm:gap-2 sm:text-lg">
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
