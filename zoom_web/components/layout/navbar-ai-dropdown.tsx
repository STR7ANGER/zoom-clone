"use client"

import Image from "next/image"
import {
  Bot,
  ChevronRight,
  Download,
  FileText,
  PenLine,
  Presentation,
  Rocket,
  Sparkles,
  Table2,
} from "lucide-react"

const sidebarItems = ["AI at Zoom", "AI Resources"]

const aiItems = [
  { label: "AI Companion", icon: Sparkles },
  { label: "AI Docs", icon: FileText },
  { label: "Custom AI Companion", icon: Sparkles },
  { label: "AI Slides", icon: Presentation },
  { label: "My Notes", icon: PenLine },
  { label: "AI Sheets", icon: Table2 },
  { label: "AI Services", icon: Bot },
]

export function NavbarAiDropdown() {
  return (
    <div className="overflow-hidden rounded-[16px] bg-white text-[#00083d] shadow-[0_24px_60px_rgba(0,0,0,0.24)]">
      <div className="grid min-h-[442px] grid-cols-[290px_1fr_340px]">
        <aside className="border-r border-[#d8e2f3] px-[14px] pt-[14px]">
          {sidebarItems.map((item, index) => (
            <button
              key={item}
              type="button"
              className={`flex h-[50px] w-full items-center justify-between rounded-[8px] px-3 text-left text-[14px] font-semibold ${
                index === 0 ? "bg-[#e8f1ff]" : "hover:bg-[#f5f8ff]"
              }`}
            >
              {item}
              <ChevronRight className="size-4 text-black" />
            </button>
          ))}
        </aside>

        <section className="px-9 pt-9">
          <h2 className="text-[24px] leading-none font-bold tracking-[-0.02em]">
            AI at Zoom
          </h2>
          <p className="mt-2 border-b border-[#dce5f4] pb-[18px] text-[13px] text-[#6c7280]">
            AI that turns conversations into action.{" "}
            <a href="#" className="text-[#005bff] underline">
              Learn more
            </a>
          </p>
          <div className="mt-4 grid max-w-[440px] grid-cols-2 gap-x-[72px] gap-y-[22px]">
            {aiItems.map((item) => {
              const Icon = item.icon
              return (
                <a
                  key={item.label}
                  href="#"
                  className="flex items-center gap-3 text-[14px] font-semibold text-[#00083d]"
                >
                  <Icon className="size-[20px] fill-[#0b5cff]/10 text-[#0b5cff]" />
                  {item.label}
                </a>
              )
            })}
          </div>
        </section>

        <section className="px-5 pt-8">
          <Image
            src="/my-notes-promo.jpg"
            alt="My Notes preview"
            width={650}
            height={540}
            className="h-[242px] w-[292px] rounded-[10px] object-cover"
            priority
          />
          <div className="mt-5 max-w-[300px]">
            <h3 className="text-[18px] leading-tight font-bold">
              <Rocket className="mr-1 inline size-4 text-[#0b5cff]" />
              <span className="mr-1 rounded-full border border-[#84b4ff] px-1.5 py-0.5 text-[10px] font-medium text-[#0b5cff]">
                NEW
              </span>
              My Notes, your AI note taker
            </h3>
            <p className="mt-2 text-[13px] leading-[1.45] text-[#00083d]">
              Automatically captures, summarizes, and extracts action items from
              any virtual or in-person meeting.
            </p>
            <a href="#" className="mt-1 inline-block text-[13px] text-[#005bff] underline">
              Learn more
            </a>
          </div>
        </section>
      </div>
      <div className="flex h-[59px] items-center gap-[70px] bg-[#e8f1ff] px-[25px] text-[11px] text-[#00083d]">
        <div className="flex items-center gap-3">
          <span className="flex size-4 items-center justify-center rounded-[3px] bg-[#0b5cff] text-[11px] text-white">
            <Download className="size-3" />
          </span>
          <span>
            Install on desktop
            <br />
            <strong className="text-[12px]">Download center</strong>
          </span>
        </div>
        <span>
          Get in touch
          <br />
          <strong className="text-[12px]">1.888.799.9666</strong>
        </span>
      </div>
    </div>
  )
}
