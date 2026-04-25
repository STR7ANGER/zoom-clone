import Link from "next/link"
import type { ReactNode } from "react"
import {
  Bot,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Copy,
  Edit3,
  ExternalLink,
  FileText,
  MessageSquare,
  MonitorUp,
  NotebookTabs,
  PanelLeft,
  Search,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Video,
} from "lucide-react"

import { cn } from "@/lib/utils"

type AccountPage = "home" | "meetings"

const navItems = [
  { label: "AI Companion", icon: Bot, badge: "New", external: true },
  { label: "Meetings", icon: Video, page: "meetings" as const },
  { label: "Recordings", icon: MonitorUp },
  { label: "Summaries", icon: ClipboardList },
  { label: "Hub", icon: PanelLeft, badge: "New", external: true },
  { label: "Whiteboards", icon: Edit3, external: true },
  { label: "Notes", icon: NotebookTabs },
  { label: "Clips", icon: Video, external: true },
  { label: "AI Docs", icon: FileText, external: true },
  { label: "Tasks", icon: ClipboardList, external: true },
  { label: "Scheduler", icon: CalendarDays, external: true },
]

const footerColumns = [
  {
    title: "About",
    links: [
      "Zoom Blog",
      "Customers",
      "Our Team",
      "Careers",
      "Integrations",
      "Partners",
      "Investors",
      "Press",
      "Sustainability & ESG",
      "Zoom Cares",
      "Media Kit",
      "How to Videos",
      "Developer Platform",
      "Zoom Ventures",
      "Zoom Merchandise Store",
    ],
  },
  {
    title: "Download",
    links: [
      "Zoom Workplace App",
      "Zoom Room Apps",
      "Zoom Rooms Controller",
      "Browser Extension",
      "Outlook Plug-in",
      "Android App",
      "Zoom Virtual Backgrounds",
    ],
  },
  {
    title: "Sales",
    links: [
      "0008000503335",
      "Contact Sales",
      "Plans & Pricing",
      "Request a Demo",
      "Webinars and Events",
      "Zoom Experience Center",
    ],
  },
  {
    title: "Support",
    links: [
      "Test Zoom",
      "Account",
      "Support Center",
      "Learning Center",
      "Zoom Community",
      "Feedback",
      "Contact Us",
      "Accessibility",
      "Developer support",
      "Privacy, Security, Legal Policies, and Modern Slavery Act Transparency Statement",
    ],
  },
]

const legalLinks = [
  "Terms",
  "Privacy",
  "Trust Center",
  "Acceptable Use Guidelines",
  "Legal & Compliance",
  "Your Privacy Choices",
  "Cookie Preferences",
]

function AccountHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 bg-white text-[#232333]">
      <div className="flex h-9 items-center justify-end gap-5 bg-[#050522] px-4 text-[13px] font-semibold text-white lg:px-6">
        <a className="hidden items-center gap-1.5 md:flex" href="#">
          <Search className="size-4" />
          Search
        </a>
        <a className="hidden md:block" href="#">
          Support
        </a>
        <a className="hidden md:block" href="#">
          1.888.799.9666
        </a>
        <span className="hidden h-4 w-px bg-white/35 md:block" />
        <a href="#">Contact Sales</a>
        <a className="hidden sm:block" href="#">
          Request a Demo
        </a>
        <span className="hidden h-4 w-px bg-white/35 sm:block" />
        <ShoppingCart className="size-4" />
      </div>
      <div className="flex h-[58px] items-center justify-between border-b border-[#e5e7ef] px-5 shadow-[0_1px_4px_rgba(30,41,59,0.06)] lg:px-8">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-[34px] font-semibold leading-none tracking-[-0.06em] text-[#0b5cff]"
            aria-label="Zoom home"
          >
            zoom
          </Link>
          <nav className="hidden items-center gap-8 text-[14px] font-semibold text-[#5f5d7b] lg:flex">
            <a href="#">Products</a>
            <a href="#">Solutions</a>
            <a href="#">Resources</a>
            <a href="#">Plans & Pricing</a>
          </nav>
        </div>
        <nav className="flex items-center gap-5 text-[14px] font-semibold text-[#5f5d7b] sm:gap-7">
          <Link href="/schedule">Schedule</Link>
          <Link href="/join">Join</Link>
          <a className="hidden items-center gap-1 md:flex" href="#">
            Host <ChevronDown className="size-3.5" />
          </a>
          <a className="hidden items-center gap-1 md:flex" href="#">
            Web App <ChevronDown className="size-3.5" />
          </a>
          <span className="inline-flex size-8 items-center justify-center rounded-full bg-[#7b55c7] text-base font-semibold text-white">
            X
          </span>
        </nav>
      </div>
    </header>
  )
}

function AccountSidebar({ active }: { active: AccountPage }) {
  return (
    <aside className="sticky top-[94px] hidden h-[calc(100vh-94px)] w-[270px] shrink-0 border-r border-[#eef0f6] bg-[#f7f8fc] text-[#24242e] lg:block">
      <nav className="flex h-full flex-col overflow-y-auto pt-1">
        <Link
          href="/myhome"
          className={cn(
            "px-8 py-4 text-[14px]",
            active === "home" ? "bg-[#edf4ff] font-medium text-[#005bff]" : "text-[#24242e]",
          )}
        >
          Home
        </Link>
        <div className="mt-3 px-3 text-[12px] text-[#697089]">My Products</div>
        <div className="mt-2 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon
            const activeItem = item.page === active
            const content = (
              <>
                <Icon className="size-4 shrink-0 text-[#5f6477]" />
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                {item.badge ? (
                  <span className="rounded-full border border-[#9ec4ff] bg-[#edf5ff] px-1.5 text-[10px] leading-4 text-[#005bff]">
                    {item.badge}
                  </span>
                ) : null}
                {item.external ? <ExternalLink className="size-3.5 text-[#4d5263]" /> : null}
              </>
            )

            return item.page ? (
              <Link
                key={item.label}
                href="/schedule"
                className={cn(
                  "flex items-center gap-2 px-8 py-2 text-[14px]",
                  activeItem ? "bg-[#edf4ff] font-medium text-[#005bff]" : "hover:bg-white",
                )}
              >
                {content}
              </Link>
            ) : (
              <a
                key={item.label}
                href="#"
                className="flex items-center gap-2 px-8 py-2 text-[14px] hover:bg-white"
              >
                {content}
              </a>
            )
          })}
        </div>
        <a className="mt-4 flex items-center gap-2 px-8 py-2 text-[14px]" href="#">
          Discover More Products
        </a>
        <div className="mt-6 space-y-1">
          {["My Account", "Admin", "Support"].map((item) => (
            <a key={item} className="flex items-center gap-2 px-4 py-2 text-[14px]" href="#">
              <ChevronRight className="size-4 text-[#6a7083]" />
              {item}
            </a>
          ))}
        </div>
        <div className="mt-auto px-8 py-7">
          <a
            href="#"
            className="inline-flex items-center gap-1.5 rounded-full border border-[#27c7d9] bg-[#effdff] px-3 py-1.5 text-[13px] font-medium text-[#005bff]"
          >
            <Sparkles className="size-3.5" />
            Upgrade to Pro
          </a>
        </div>
      </nav>
    </aside>
  )
}

function AccountFooter() {
  return (
    <>
      <footer className="bg-[#3a3a50] px-5 py-7 text-white lg:px-16">
        <div className="mx-auto max-w-[1280px]">
          <div className="grid gap-9 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1fr_260px]">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <h2 className="text-[14px] font-bold">{column.title}</h2>
                <ul className="mt-3 space-y-1.5 text-[13px] font-semibold leading-snug">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a className="hover:underline" href="#">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <h2 className="text-[14px] font-bold">Language</h2>
              <button className="mt-3 inline-flex h-8 items-center gap-1 rounded border border-white/25 px-3 text-[13px] font-semibold">
                English <ChevronDown className="size-3.5" />
              </button>

              <h2 className="mt-6 text-[14px] font-bold">Currency</h2>
              <button className="mt-3 inline-flex h-8 items-center gap-1 rounded border border-white/25 px-3 text-[13px] font-semibold">
                Indian Rupee ₹ <ChevronDown className="size-3.5" />
              </button>

              <div className="mt-3 flex items-center gap-2">
                {["W", "in", "X", "▶", "f", "◎"].map((item) => (
                  <a
                    key={item}
                    aria-label={item}
                    className="inline-flex size-8 items-center justify-center rounded-full bg-[#282966] text-[14px] font-bold text-white"
                    href="#"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-x-2 gap-y-2 text-[13px] font-semibold">
            <span>Copyright ©2026 Zoom Communications, Inc. All rights reserved.</span>
            {legalLinks.map((link) => (
              <span key={link} className="inline-flex items-center gap-2">
                <span className="h-4 w-px bg-white/55" />
                {link === "Your Privacy Choices" ? (
                  <a className="inline-flex items-center gap-1 hover:underline" href="#">
                    <span className="inline-flex h-3.5 w-6 items-center justify-center rounded bg-[#2f7cff] text-[10px] leading-none">
                      ✓×
                    </span>
                    {link}
                  </a>
                ) : (
                  <a className="hover:underline" href="#">
                    {link}
                  </a>
                )}
              </span>
            ))}
          </div>
        </div>
      </footer>

      <button
        type="button"
        aria-label="Security"
        className="fixed bottom-4 left-5 z-40 hidden size-11 items-center justify-center rounded-lg bg-[#64aef1] text-white shadow-[0_6px_18px_rgba(38,117,216,0.28)] lg:inline-flex"
      >
        <ShieldCheck className="size-7" />
      </button>
      <button
        type="button"
        aria-label="Chat"
        className="fixed right-5 bottom-5 z-40 inline-flex size-13 items-center justify-center rounded-full bg-[#3c80ff] text-white shadow-[0_8px_20px_rgba(38,117,216,0.28)]"
      >
        <MessageSquare className="size-6" />
      </button>
    </>
  )
}

export function AccountShell({
  active,
  children,
  className,
}: {
  active: AccountPage
  children: ReactNode
  className?: string
}) {
  return (
    <main className="min-h-screen bg-white text-[#232333]">
      <AccountHeader />
      <div className="pt-[94px] lg:flex">
        <AccountSidebar active={active} />
        <section className={cn("min-w-0 flex-1", className)}>{children}</section>
      </div>
      <AccountFooter />
    </main>
  )
}

export function CopyButton({ label = "Copy" }: { label?: string }) {
  return (
    <button type="button" aria-label={label} className="inline-flex text-[#5f6477]">
      <Copy className="size-4" />
    </button>
  )
}
