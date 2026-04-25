"use client"

import { ChevronRight, Download } from "lucide-react"

const columns = [
  {
    title: "By industry",
    items: [
      "Education",
      "Financial Services",
      "Government",
      "Healthcare",
      "Manufacturing",
      "Retail",
      "Frontline",
      "Broadcast",
    ],
  },
  {
    title: "By audience",
    items: ["Small and midsize business"],
    secondTitle: "Enterprise",
    secondItems: [
      "Information Technology",
      "Customer Experience",
      "Sales and Revenue",
      "Facilities",
      "Marketing and Events",
    ],
  },
  {
    title: "For Developer",
    items: [
      "Video SDK",
      "Meeting SDK",
      "App Marketplace",
      "APIs",
      "Webhooks",
      "Zoom Apps",
      "Developer Solutions",
    ],
  },
  {
    title: "For partners",
    items: [
      "Partner Solutions",
      "Find a Partner",
      "Become a Partner",
      "Partner Portal",
      "Partner Learning Center",
    ],
  },
]

export function NavbarSolutionsDropdown() {
  return (
    <div className="overflow-hidden rounded-[16px] bg-white text-[#00083d] shadow-[0_24px_60px_rgba(0,0,0,0.24)]">
      <div className="grid min-h-[443px] grid-cols-4 gap-12 px-[68px] pt-[35px]">
        {columns.map((column) => (
          <section key={column.title}>
            <h2 className="flex items-center justify-between border-b border-[#dce5f4] pb-4 text-[24px] leading-none font-bold tracking-[-0.02em]">
              {column.title}
              <ChevronRight className="size-4" />
            </h2>
            <div className="mt-4 flex flex-col gap-[15px]">
              {column.items.map((item) => (
                <a key={item} href="#" className="text-[14px] font-semibold">
                  {item}
                </a>
              ))}
            </div>
            {column.secondTitle ? (
              <>
                <h3 className="mt-8 border-b border-[#dce5f4] pb-4 text-[24px] leading-none font-bold tracking-[-0.02em]">
                  {column.secondTitle}
                </h3>
                <div className="mt-4 flex flex-col gap-[15px]">
                  {column.secondItems?.map((item) => (
                    <a key={item} href="#" className="text-[14px] font-semibold">
                      {item}
                    </a>
                  ))}
                </div>
              </>
            ) : null}
          </section>
        ))}
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
