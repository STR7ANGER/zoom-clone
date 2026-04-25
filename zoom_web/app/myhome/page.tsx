import { CalendarDays, ChevronRight, Plus, Video } from "lucide-react"

import { AccountShell, CopyButton } from "@/components/shared/account-shell"

const quickActions = [
  { label: "Schedule", icon: CalendarDays, color: "bg-[#1f73e8]" },
  { label: "Join", icon: Plus, color: "bg-[#1f73e8]" },
  { label: "Host", icon: Video, color: "bg-[#ff7424]" },
]

export default function MyHomePage() {
  return (
    <AccountShell active="home" className="bg-[#fbfbfd]">
      <div className="grid min-h-[calc(100vh-94px)] grid-cols-1 gap-5 px-5 py-9 xl:grid-cols-[minmax(0,1fr)_294px] xl:px-7">
        <div className="space-y-5">
          <section className="flex items-center justify-between rounded-lg bg-white px-6 py-6 shadow-[0_4px_18px_rgba(15,23,42,0.08)]">
            <div className="flex items-center gap-4">
              <div className="flex size-[70px] items-center justify-center rounded-[18px] bg-[#7b55c7] text-4xl font-light text-white">
                X
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-[#10112f]">Xifloxy Fi</h1>
                <p className="text-[14px] text-[#3f4354]">
                  Plan: <span className="font-semibold text-[#10112f]">Workplace Basic</span>
                </p>
              </div>
            </div>
            <div className="hidden text-right sm:block">
              <button className="rounded-md border border-[#9aa4b4] px-5 py-1.5 text-[14px] text-[#24242e]">
                Manage Plan
              </button>
              <a className="mt-3 block text-[14px] font-medium text-[#005bff]" href="#">
                View Plan Details
              </a>
            </div>
          </section>

          <section className="relative overflow-hidden rounded-lg bg-white px-7 py-9 shadow-[0_4px_18px_rgba(15,23,42,0.08)]">
            <div className="mx-auto flex min-h-[215px] max-w-[650px] items-center">
              <div className="absolute left-[22%] top-6 h-[250px] w-[480px] rounded-[50%] bg-[#eeeaf8]" />
              <div className="relative z-10 max-w-[360px]">
                <h2 className="text-[32px] font-bold leading-tight text-[#2b2b3b]">
                  Limited time offer!
                </h2>
                <p className="mt-3 text-[16px] leading-snug text-[#2f3142]">
                  Take an additional 15% off when you upgrade to Zoom Workplace Pro annual!
                </p>
                <button className="mt-6 rounded-lg bg-[#0b5cff] px-5 py-2.5 text-[14px] font-semibold text-white">
                  Get offer
                </button>
              </div>
              <div className="relative z-10 ml-auto hidden h-[205px] w-[160px] items-end justify-center md:flex">
                <div className="h-[150px] w-10 rounded-t-full bg-[#59bd8c]" />
                <div className="ml-1 h-[120px] w-7 rounded-t-full bg-[#30333a]" />
                <div className="-ml-2 h-[92px] w-7 rounded-t-full bg-[#30333a]" />
              </div>
            </div>
            <button className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md bg-[#8a8d90] text-white">
              <ChevronRight className="size-5" />
            </button>
            <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-1">
              <span className="size-2 rounded-full bg-[#8c9199]" />
              <span className="size-2 rounded-full border border-[#8c9199]" />
            </div>
          </section>

          <section className="rounded-lg bg-white px-6 py-6 shadow-[0_4px_18px_rgba(15,23,42,0.08)]">
            <h2 className="text-2xl font-bold text-[#10112f]">Recent activity</h2>
            <div className="mt-5 border-t border-[#eef0f4] pt-11">
              <div className="mx-auto flex min-h-[190px] max-w-sm flex-col items-center justify-center text-center">
                <div className="relative h-24 w-32">
                  <div className="absolute left-7 top-8 h-14 w-18 -skew-y-12 bg-[#1d62d9]" />
                  <div className="absolute right-7 top-8 h-14 w-18 skew-y-12 bg-[#3b86ff]" />
                  <div className="absolute left-10 top-4 h-11 w-15 -skew-y-12 bg-[#0b5cff]" />
                  <div className="absolute right-10 top-4 h-11 w-15 skew-y-12 bg-[#79b2ff]" />
                </div>
                <p className="mt-3 text-[14px] font-bold">No recent activity</p>
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-5">
          <section className="rounded-lg bg-white p-6 shadow-[0_4px_18px_rgba(15,23,42,0.08)]">
            <div className="grid grid-cols-3 gap-5">
              {quickActions.map((action) => {
                const Icon = action.icon
                return (
                  <a key={action.label} className="flex flex-col items-center gap-2" href="#">
                    <span className={`flex size-11 items-center justify-center rounded-xl text-white ${action.color}`}>
                      <Icon className="size-5" />
                    </span>
                    <span className="text-[12px] font-semibold text-[#5f5d7b]">{action.label}</span>
                  </a>
                )
              })}
            </div>
            <div className="mt-7 text-center">
              <h2 className="text-lg font-bold text-[#2a2b3b]">Personal Meeting ID</h2>
              <p className="mt-2 inline-flex items-center gap-2 text-[14px] text-[#24242e]">
                844 093 3566 <CopyButton />
              </p>
            </div>
          </section>

          <section className="rounded-lg bg-white p-6 shadow-[0_4px_18px_rgba(15,23,42,0.08)]">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#10112f]">Meetings</h2>
              <a className="text-[14px] font-medium text-[#005bff]" href="#">
                Visit Meetings
              </a>
            </div>
            <div className="mt-5 rounded-md bg-[#f6f7f9] px-3 py-3 text-[14px] font-bold text-[#10112f]">
              No Upcoming Meetings
            </div>
            <button className="mt-4 rounded-md border border-[#9aa4b4] px-3 py-1.5 text-[14px]">
              Test Audio and Video
            </button>
          </section>
        </aside>
      </div>
    </AccountShell>
  )
}
