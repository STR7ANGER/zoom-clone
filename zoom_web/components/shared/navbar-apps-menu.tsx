"use client"

import {
  Bot,
  BrainCircuit,
  CalendarClock,
  ContactRound,
  FileText,
  Grid3X3,
  Headphones,
  MessageCircle,
  MessageSquare,
  PenLine,
  Phone,
  Presentation,
  Puzzle,
  Sparkles,
  Table2,
  Target,
  Tv,
  Video,
  WalletCards,
} from "lucide-react"

const sections = [
  {
    title: "Zoom Workplace",
    viewAll: true,
    items: [
      { label: "Meetings", icon: Video },
      { label: "Chat", icon: MessageSquare },
      { label: "Phone", icon: Phone },
      { label: "Mail & Calendar", icon: CalendarClock },
      { label: "Scheduler", icon: CalendarClock },
      { label: "Whiteboard", icon: Presentation },
      { label: "Clips", icon: Tv },
    ],
  },
  {
    title: "Business Services",
    items: [
      { label: "Contact Center", icon: Headphones },
      { label: "CX Insights", icon: BrainCircuit },
      { label: "Virtual Agent", icon: MessageCircle },
      { label: "Webinars & Events", icon: Puzzle },
      { label: "Revenue Accelerator", icon: Target },
      { label: "Workforce Engagement", icon: ContactRound },
      { label: "Bonsai", icon: WalletCards },
      { label: "BrightHire", icon: Sparkles },
    ],
  },
  {
    title: "Zoom AI",
    items: [
      { label: "AI Companion", icon: Sparkles },
      { label: "Custom AI Companion", icon: Sparkles },
      { label: "My Notes", icon: PenLine },
      { label: "AI Services", icon: Bot },
      { label: "AI Docs", icon: FileText },
      { label: "AI Slides", icon: Presentation },
      { label: "AI Sheets", icon: Table2 },
    ],
  },
  {
    title: "Developers",
    items: [
      { label: "Overview", icon: Grid3X3 },
      { label: "Video SDK", icon: FileText },
      { label: "Cobrowse SDK", icon: FileText },
    ],
  },
]

export function NavbarAppsMenu() {
  return (
    <div className="max-h-[calc(100vh-86px)] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden rounded-[10px] bg-white text-[#00083d] shadow-[0_24px_60px_rgba(0,0,0,0.24)]">
      <div className="px-5 pt-[18px] pb-4">
        {sections.map((section) => (
          <section key={section.title} className="mb-[34px] last:mb-0">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[20px] font-bold">{section.title}</h2>
              {section.viewAll ? (
                <a href="#" className="text-[12px] font-semibold text-[#5b5f6a]">
                  View all
                </a>
              ) : null}
            </div>
            <div className="grid grid-cols-3 gap-x-[34px] gap-y-[29px]">
              {section.items.map((item) => {
                const Icon = item.icon
                return (
                  <a
                    key={item.label}
                    href="#"
                    className="flex min-h-[58px] flex-col items-center justify-start gap-2 text-center text-[13px] leading-[1.05] font-semibold"
                  >
                    <Icon className="size-[22px] fill-[#0b5cff]/10 text-[#0b5cff]" />
                    <span>{item.label}</span>
                  </a>
                )
              })}
            </div>
          </section>
        ))}
      </div>
      <div className="sticky bottom-0 border-t border-[#dce5f4] bg-white px-5 py-[13px]">
        <button
          type="button"
          className="h-[44px] w-full rounded-[10px] bg-[#0b5cff] text-[16px] font-semibold text-white hover:bg-[#084bd8]"
        >
          Contact Sales
        </button>
      </div>
    </div>
  )
}
