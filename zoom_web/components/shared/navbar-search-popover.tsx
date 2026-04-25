"use client"

import { Search } from "lucide-react"

const suggestions = [
  "where are my zoom cloud recordings",
  "how to record zoom meeting",
  "reports",
  "transcript",
  "sign in to my account",
]

export function NavbarSearchPopover() {
  return (
    <div className="rounded-[10px] bg-white px-4 pt-4 pb-5 text-[#242424] shadow-[0_24px_60px_rgba(0,0,0,0.24)]">
      <div className="flex items-center gap-3">
        <label className="flex h-[45px] flex-1 items-center gap-2 rounded-[10px] bg-[#f2f6fd] px-4">
          <Search className="size-5 text-[#111827]" />
          <input
            autoFocus
            type="search"
            placeholder="Enter search here..."
            className="h-full flex-1 bg-transparent text-[20px] text-[#111827] outline-none placeholder:text-[#7b7f87]"
          />
        </label>
        <button
          type="button"
          className="h-[39px] rounded-[10px] bg-[#0b5cff] px-[18px] text-[16px] font-semibold text-white hover:bg-[#084bd8]"
        >
          Search
        </button>
      </div>

      <div className="mt-3">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            className="block h-[47px] w-full border-b border-[#cbd8ed] px-3 text-left text-[20px] font-semibold text-[#2a2a2a] last:border-b-0"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  )
}
