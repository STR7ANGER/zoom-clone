"use client"

import Image from "next/image"
import { useState } from "react"

import { Button } from "@/components/ui/button"

const tabs = [
  "Collaboration",
  "Customer support",
  "Marketing",
  "Sales",
  "Employee engagement",
] as const

const tabData = {
  Collaboration: {
    description:
      "AI-first UCaaS for team collaboration lets you work together without friction using Meetings, Chat, Docs, and more, all built into Zoom Workplace.",
    bullets: [
      {
        title: "Unify how teams connect",
        body: "Meetings, Phone, Chat, and more are all in one UCaaS platform, so communication feels seamless.",
      },
      {
        title: "Consolidate your tools",
        body: "Replace scattered apps with an all-in-one solution that saves time, reduces costs, and keeps work in sync.",
      },
      {
        title: "Support hybrid and remote work",
        body: "Keep even global teams engaged with reliable video conferencing, persistent chat, shared docs, and more.",
      },
      {
        title: "Keep workflows moving",
        body: "From brainstorms to docs to quick check-ins, Zoom helps teams cut friction and avoid projects stalling.",
      },
      {
        title: "Do more with AI",
        body: "Built-in AI summarizes meetings, drafts follow-ups, and shares next steps, so your team spends more time creating.",
      },
    ],
    image: "/work_together/collaboration.jpg",
  },
  "Customer support": {
    description:
      "Solve customer issues faster and deliver a seamless experience across every channel with AI-first contact center and CX solutions.",
    bullets: [
      {
        title: "Resolve inquiries efficiently",
        body: "Phone, chat, email, SMS, social, and video flow into one platform for full context.",
      },
      {
        title: "Automate complex interactions",
        body: "Virtual Agent handles multi-intent questions, so human agents can focus on high-value cases.",
      },
      {
        title: "Boost self-service and loyalty",
        body: "Instant answers and proactive resolutions reduce friction and improve satisfaction.",
      },
      {
        title: "Help agents focus on what matters",
        body: "AI highlights key actions, suggests responses, and streamlines repetitive tasks.",
      },
      {
        title: "Turn data into action",
        body: "Integrated CRM, real-time analytics, and conversation insights help teams spot trends and improve CX.",
      },
    ],
    image: "/work_together/customer-support.jpg",
  },
  Marketing: {
    description:
      "Drive growth for your business with Zoom webinars and virtual events for demand generation - built to engage audiences and deliver results.",
    bullets: [
      {
        title: "Keep audiences engaged",
        body: "Capture leads and build pipeline with branded webinars and events that generate long-lasting demand.",
      },
      {
        title: "Deliver stand-out experiences",
        body: "Host polished, interactive events that reflect your brand and leave a lasting impression on customers.",
      },
      {
        title: "Fuel smarter campaigns",
        body: "Extend every event with virtual and hybrid options, giving you a broader reach and richer insights.",
      },
      {
        title: "Put busywork on auto-pilot with AI",
        body: "Automate content, personalize outreach, and analyze performance faster.",
      },
    ],
    image: "/work_together/marketing.jpg",
  },
  Sales: {
    description:
      "Equip your team with Zoom sales enablement tools with AI insights so they can focus on customers, accelerate deals, and grow revenue.",
    bullets: [
      {
        title: "Make selling easier",
        body: "Eliminate admin work like note-taking and CRM updates so reps can spend more time building relationships.",
      },
      {
        title: "Boost productivity and win rates",
        body: "Auto-summarized meetings, suggested follow-ups, and deal insights keep cycles short.",
      },
      {
        title: "Give RevOps deeper visibility",
        body: "See pipeline insights and competitor trends to forecast and prospect with confidence.",
      },
      {
        title: "Close with confidence",
        body: "Agentic AI flags risks, coaches reps, and automates next steps, keeping work moving forward.",
      },
    ],
    image: "/work_together/sales.jpg",
  },
  "Employee engagement": {
    description:
      "Strengthen culture and hybrid workforce engagement across teams with Zoom Workplace.",
    bullets: [
      {
        title: "Foster community in hybrid teams",
        body: "Get company-wide updates, recognition, and social feeds that connect remote employees.",
      },
      {
        title: "Create immersive experiences",
        body: "Run interactive all-hands, learning sessions, and celebrations that teams look forward to.",
      },
      {
        title: "Communicate on your schedule",
        body: "Share video announcements asynchronously, aligning teams without more meetings.",
      },
      {
        title: "Reinforce culture and recognition",
        body: "Highlight employee wins, anniversaries, and initiatives with rich media and live events.",
      },
      {
        title: "Measure engagement to improve",
        body: "Use analytics from Events, Clips, and Workvivo to understand participation and surface gaps.",
      },
    ],
    image: "/work_together/employee-engagement.jpg",
  },
} satisfies Record<(typeof tabs)[number], { description: string; bullets: { title: string; body: string }[]; image: string }>

export function WorkTogetherSection() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Collaboration")
  const data = tabData[activeTab]

  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl leading-[0.98] font-semibold tracking-[-0.05em] text-[#0b124b] sm:text-5xl lg:text-[72px]">
            One platform.
            <br />
            Endless ways to work together.
          </h2>
          <p className="mx-auto mt-5 max-w-4xl text-base leading-relaxed text-[#0b124b] sm:text-lg lg:mt-6 lg:text-[22px]">
            From client pitches to global all-hands, patient consults to classrooms, Zoom
            delivers the flexibility and reliability you need. And with AI built in, every
            interaction is faster, easier, and more productive.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4 lg:gap-5">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-[16px] px-4 py-3 text-sm font-semibold transition-all duration-200 sm:px-5 sm:text-base lg:rounded-[18px] lg:px-7 lg:py-4 lg:text-[18px] ${
                activeTab === tab
                  ? "border border-[#b8cdfb] bg-[#eff5ff] text-[#0b124b] shadow-[0_8px_24px_rgba(36,103,244,0.08)]"
                  : "text-[#0b124b]/55 hover:text-[#0b124b]/80"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mt-12 grid items-start gap-8 xl:grid-cols-[0.92fr_1.08fr] xl:gap-10">
          <div>
            <p className="text-[17px] leading-[1.5] text-[#0b124b] sm:text-[18px] lg:text-[22px]">
              {data.description}
            </p>

            <ul className="mt-7 space-y-5 lg:mt-8 lg:space-y-6">
              {data.bullets.map((item) => (
                <li
                  key={item.title}
                  className="flex gap-3 text-[15px] leading-[1.5] text-[#0b124b] sm:text-[16px] lg:gap-4 lg:text-[18px]"
                >
                  <span className="mt-2.5 size-2.5 shrink-0 rounded-full bg-[#0b124b]" />
                  <p>
                    <span className="font-semibold">{item.title}:</span> {item.body}
                  </p>
                </li>
              ))}
            </ul>

            <Button className="mt-8 h-12 rounded-[16px] bg-[#2467f4] px-7 text-[16px] font-semibold text-white hover:bg-[#1f58d8] sm:h-13 sm:px-8 sm:text-[17px] lg:mt-10 lg:h-14 lg:px-9 lg:text-[18px]">
              Get started
            </Button>
          </div>

          <div className="overflow-hidden rounded-[26px] bg-[#f4f7fb] shadow-[0_18px_50px_rgba(15,23,42,0.1)] lg:rounded-[30px]">
            <div className="relative aspect-[1.2/1] w-full">
              <Image
                src={data.image}
                alt={`${activeTab} Zoom visual`}
                fill
                className="object-cover"
                sizes="(max-width: 1279px) 100vw, 56vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
