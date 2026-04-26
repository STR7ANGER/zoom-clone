"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  CalendarDays,
  Copy,
  Loader2,
  Plus,
  UserRound,
  Video,
} from "lucide-react"

import { AccountShell } from "@/components/layout/account-shell"
import { createInstantMeeting, getMeetings, type Meeting } from "@/lib/api"
import { LandingFloatingWidgets } from "@/components/landing/landing-floating-widgets"
import { MeetingRow } from "@/features/meetings/meeting-row"
import { initials, useAuthStore } from "@/lib/auth-store"

const quickActions = [
  { label: "New Meeting", href: null, icon: Video, color: "bg-[#ff7424]" },
  { label: "Join", href: "/join", icon: Plus, color: "bg-[#1f73e8]" },
  { label: "Schedule", href: "/schedule", icon: CalendarDays, color: "bg-[#1f73e8]" },
]

export default function MyHomePage() {
  const router = useRouter()
  const [upcoming, setUpcoming] = useState<Meeting[]>([])
  const [recent, setRecent] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState("")
  const user = useAuthStore((state) => state.user)

  useEffect(() => {
    let mounted = true
    Promise.all([getMeetings("upcoming"), getMeetings("recent")])
      .then(([upcomingMeetings, recentMeetings]) => {
        if (!mounted) return
        setUpcoming(upcomingMeetings)
        setRecent(recentMeetings)
      })
      .catch((err: Error) => {
        if (mounted) setError(err.message)
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [])

  async function handleNewMeeting() {
    setCreating(true)
    setError("")
    try {
      const { meeting, participant } = await createInstantMeeting()
      router.push(`/meeting/${meeting.meeting_id}?participantId=${participant.participant_id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create meeting")
      setCreating(false)
    }
  }

  return (
    <AccountShell active="home" className="bg-[#fbfbfd]">
      <div className="grid min-h-[calc(100vh-94px)] grid-cols-1 gap-5 px-5 py-9 xl:grid-cols-[minmax(0,1fr)_320px] xl:px-7">
        <div className="space-y-5">
          <section className="flex flex-col gap-5 rounded-lg bg-white px-6 py-6 shadow-[0_4px_18px_rgba(15,23,42,0.08)] sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex size-[70px] items-center justify-center overflow-hidden rounded-[18px] bg-[#7b55c7] text-2xl font-bold text-white">
                {user?.avatar_url ? <img src={user.avatar_url} alt="" className="size-full object-cover" /> : initials(user?.name ?? "")}
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-[#10112f]">{user?.name ?? "Your Account"}</h1>
                <p className="text-[14px] text-[#3f4354]">
                  Plan: <span className="font-semibold text-[#10112f]">Workplace Basic</span>
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/schedule" className="rounded-md border border-[#9aa4b4] px-4 py-2 text-[14px] text-[#24242e]">
                Schedule
              </Link>
              <button
                type="button"
                onClick={handleNewMeeting}
                disabled={creating}
                className="inline-flex items-center gap-2 rounded-md bg-[#0b5cff] px-4 py-2 text-[14px] font-semibold text-white disabled:opacity-60"
              >
                {creating ? <Loader2 className="size-4 animate-spin" /> : <Video className="size-4" />}
                New Meeting
              </button>
            </div>
          </section>

          <section className="rounded-lg bg-white px-6 py-6 shadow-[0_4px_18px_rgba(15,23,42,0.08)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold text-[#10112f]">Upcoming meetings</h2>
                <p className="mt-1 text-[14px] text-[#697089]">Your scheduled and instant meeting links.</p>
              </div>
              <Link href="/schedule" className="text-[14px] font-medium text-[#005bff]">
                Schedule Meeting
              </Link>
            </div>

            <div className="mt-5 space-y-3">
              {loading ? (
                <div className="flex min-h-32 items-center justify-center text-[#697089]">
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Loading meetings
                </div>
              ) : upcoming.length ? (
                upcoming.map((meeting) => <MeetingRow key={meeting.meeting_id} meeting={meeting} />)
              ) : (
                <div className="rounded-md bg-[#f6f7f9] px-3 py-8 text-center text-[14px] font-semibold text-[#10112f]">
                  No Upcoming Meetings
                </div>
              )}
            </div>
          </section>

          <section className="rounded-lg bg-white px-6 py-6 shadow-[0_4px_18px_rgba(15,23,42,0.08)]">
            <h2 className="text-2xl font-bold text-[#10112f]">Recent meetings</h2>
            <div className="mt-5 space-y-3">
              {recent.length ? (
                recent.map((meeting) => <MeetingRow key={meeting.meeting_id} meeting={meeting} />)
              ) : (
                <div className="mx-auto flex min-h-[150px] max-w-sm flex-col items-center justify-center text-center">
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-[#edf4ff] text-[#0b5cff]">
                    <UserRound className="size-7" />
                  </div>
                  <p className="mt-3 text-[14px] font-bold">No recent meetings</p>
                </div>
              )}
            </div>
          </section>

          {error ? (
            <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
          ) : null}
        </div>

        <aside className="space-y-5">
          <section className="rounded-lg bg-white p-6 shadow-[0_4px_18px_rgba(15,23,42,0.08)]">
            <div className="grid grid-cols-3 gap-5">
              {quickActions.map((action) => {
                const Icon = action.icon
                const content = (
                  <>
                    <span className={`flex size-12 items-center justify-center rounded-xl text-white ${action.color}`}>
                      <Icon className="size-5" />
                    </span>
                    <span className="text-center text-[12px] font-semibold text-[#5f5d7b]">{action.label}</span>
                  </>
                )
                return action.href ? (
                  <Link key={action.label} className="flex flex-col items-center gap-2" href={action.href}>
                    {content}
                  </Link>
                ) : (
                  <button key={action.label} type="button" onClick={handleNewMeeting} className="flex flex-col items-center gap-2">
                    {content}
                  </button>
                )
              })}
            </div>
            <div className="mt-7 text-center">
              <h2 className="text-lg font-bold text-[#2a2b3b]">Personal Meeting ID</h2>
              <p className="mt-2 inline-flex items-center gap-2 text-[14px] text-[#24242e]">
                844 093 3566
                <button type="button" onClick={() => navigator.clipboard.writeText("8440933566")} aria-label="Copy">
                  <Copy className="size-4 text-[#5f6477]" />
                </button>
              </p>
            </div>
          </section>

          <section className="rounded-lg bg-white p-6 shadow-[0_4px_18px_rgba(15,23,42,0.08)]">
            <h2 className="text-2xl font-bold text-[#10112f]">Meeting readiness</h2>
            <p className="mt-3 text-[14px] leading-snug text-[#697089]">
              Camera, microphone, participant list, invite copy, and host controls are available inside every room.
            </p>
            <Link href="/join" className="mt-4 inline-flex rounded-md border border-[#9aa4b4] px-3 py-1.5 text-[14px]">
              Join a Meeting
            </Link>
          </section>
        </aside>
      </div>
      <LandingFloatingWidgets />
    </AccountShell>
  )
}
