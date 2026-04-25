"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { CalendarDays, ChevronLeft, Copy, Loader2, Plus, TriangleAlert } from "lucide-react"

import { AccountShell } from "@/components/shared/account-shell"
import { LandingFloatingWidgets } from "@/components/landing/landing-floating-widgets"
import { createScheduledMeeting, type Meeting } from "@/lib/api"

const inputClass =
  "h-10 rounded-md border border-[#b8c0cc] bg-white px-3 text-[14px] text-[#232333] outline-none focus:border-[#0b5cff] focus:ring-2 focus:ring-[#0b5cff]/10"

function Row({
  label,
  children,
  required = false,
}: {
  label: string
  children: React.ReactNode
  required?: boolean
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-[145px_minmax(0,1fr)] sm:items-start">
      <label className="pt-2 text-[14px] text-[#232333]">
        {required ? <span className="text-[#d93025]">* </span> : null}
        {label}
      </label>
      <div>{children}</div>
    </div>
  )
}

export default function SchedulePage() {
  const [title, setTitle] = useState("My Meeting")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [time, setTime] = useState("18:30")
  const [duration, setDuration] = useState(40)
  const [createdMeeting, setCreatedMeeting] = useState<Meeting | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const startsAt = useMemo(() => new Date(`${date}T${time}:00`).toISOString(), [date, time])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError("")
    setCreatedMeeting(null)
    try {
      const meeting = await createScheduledMeeting({
        title,
        description,
        starts_at: startsAt,
        duration_minutes: duration,
      })
      setCreatedMeeting(meeting)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to schedule meeting")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AccountShell active="meetings">
      <div className="min-h-[calc(100vh-94px)] px-5 py-7 lg:px-7">
        <div className="max-w-[895px]">
          <Link className="inline-flex items-center gap-1 text-[14px] font-medium text-[#005bff]" href="/myhome">
            <ChevronLeft className="size-4" />
            Back to Home
          </Link>

          <div className="mt-5 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#edf4ff] text-[#0b5cff]">
              <CalendarDays className="size-5" />
            </div>
            <h1 className="text-xl font-bold text-[#232333]">Schedule Meeting</h1>
          </div>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5 rounded-lg bg-white p-6 shadow-[0_4px_18px_rgba(15,23,42,0.08)]">
            <Row label="Topic" required>
              <input className={`${inputClass} w-full max-w-[520px]`} value={title} onChange={(event) => setTitle(event.target.value)} />
            </Row>

            <Row label="Description">
              <textarea
                className="min-h-24 w-full max-w-[520px] rounded-md border border-[#b8c0cc] bg-white px-3 py-2 text-[14px] text-[#232333] outline-none focus:border-[#0b5cff] focus:ring-2 focus:ring-[#0b5cff]/10"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Add a description for attendees"
              />
            </Row>

            <Row label="When" required>
              <div className="flex flex-wrap items-center gap-2">
                <input className={`${inputClass} w-[180px]`} type="date" value={date} onChange={(event) => setDate(event.target.value)} />
                <input className={`${inputClass} w-[140px]`} type="time" value={time} onChange={(event) => setTime(event.target.value)} />
              </div>
            </Row>

            <Row label="Duration" required>
              <select
                className={`${inputClass} w-[180px]`}
                value={duration}
                onChange={(event) => setDuration(Number(event.target.value))}
              >
                <option value={30}>30 minutes</option>
                <option value={40}>40 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>1 hour</option>
                <option value={90}>1 hour 30 minutes</option>
              </select>
              <div className="mt-4 flex max-w-[620px] gap-2 rounded-md bg-[#fff8ef] px-3 py-2.5 text-[14px] leading-snug">
                <TriangleAlert className="mt-0.5 size-4 shrink-0 fill-[#ffc400] text-[#d99a00]" />
                <p>Basic demo meetings default to Zoom-like 40 minute sessions, but the database stores any selected duration.</p>
              </div>
            </Row>

            <Row label="Meeting ID">
              <label className="flex items-center gap-2 pt-2 text-[14px] text-[#232333]">
                <input type="radio" defaultChecked className="size-3.5 accent-[#0b5cff]" />
                Generate Automatically
              </label>
            </Row>

            <Row label="Security">
              <div className="space-y-2 pt-2 text-[14px]">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="size-3.5 accent-[#0b5cff]" />
                  Waiting Room
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="size-3.5 accent-[#0b5cff]" />
                  Mute participants upon entry
                </label>
              </div>
            </Row>

            {error ? (
              <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:ml-[145px]">{error}</div>
            ) : null}

            {createdMeeting ? (
              <div className="rounded-lg border border-[#b9d3ff] bg-[#f3f7ff] p-4 sm:ml-[145px]">
                <p className="text-[14px] font-semibold text-[#10112f]">Meeting scheduled</p>
                <p className="mt-1 break-all text-[13px] text-[#4d5263]">{createdMeeting.invite_link}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(createdMeeting.invite_link)}
                    className="inline-flex items-center gap-2 rounded-md border border-[#9aa4b4] px-3 py-1.5 text-[14px]"
                  >
                    <Copy className="size-4" />
                    Copy Link
                  </button>
                  <Link href={`/join?meeting=${createdMeeting.meeting_id}`} className="rounded-md bg-[#0b5cff] px-3 py-1.5 text-[14px] font-semibold text-white">
                    Open Join Page
                  </Link>
                </div>
              </div>
            ) : null}

            <div className="flex gap-2 pt-1 sm:pl-[145px]">
              <button
                disabled={!title.trim() || loading}
                className="inline-flex items-center gap-2 rounded-md bg-[#0b5cff] px-4 py-2 text-[14px] font-semibold text-white disabled:opacity-60"
              >
                {loading ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
                Save
              </button>
              <Link href="/myhome" className="rounded-md border border-[#9aa4b4] px-4 py-2 text-[14px]">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
      <LandingFloatingWidgets />
    </AccountShell>
  )
}
