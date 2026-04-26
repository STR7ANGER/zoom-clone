"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { CalendarDays, ChevronLeft, Loader2, Plus, X } from "lucide-react"
import { toast } from "sonner"

import { AccountShell } from "@/components/shared/account-shell"
import { LandingFloatingWidgets } from "@/components/landing/landing-floating-widgets"
import { createScheduledMeeting } from "@/lib/api"

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
  const router = useRouter()
  const [title, setTitle] = useState("My Meeting")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [time, setTime] = useState("18:30")
  const [duration, setDuration] = useState(40)
  const [inviteeInput, setInviteeInput] = useState("")
  const [invitees, setInvitees] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const startsAt = useMemo(() => {
    const parsedDate = new Date(`${date}T${time}:00`)
    if (Number.isNaN(parsedDate.getTime())) {
      return null
    }
    return parsedDate.toISOString()
  }, [date, time])

  function addInvitee() {
    const email = inviteeInput.trim().toLowerCase()
    if (!email) return
    if (!email.includes("@") || !email.split("@")[1]?.includes(".")) {
      setError("Please enter a valid invitee email.")
      return
    }
    setError("")
    setInvitees((current) => (current.includes(email) ? current : [...current, email]))
    setInviteeInput("")
  }

  function removeInvitee(email: string) {
    setInvitees((current) => current.filter((invitee) => invitee !== email))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!startsAt) {
      setError("Please select a valid date and time.")
      return
    }
    setLoading(true)
    setError("")
    try {
      await createScheduledMeeting({
        title,
        description,
        starts_at: startsAt,
        duration_minutes: duration,
        invitees,
      })
      toast.success("Meeting scheduled")
      router.push("/myhome")
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
            </Row>

            <Row label="Invitees">
              <div className="flex w-full max-w-[520px] flex-col gap-3">
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    className={`${inputClass} min-w-0 flex-1`}
                    value={inviteeInput}
                    onChange={(event) => setInviteeInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault()
                        addInvitee()
                      }
                    }}
                    placeholder="Enter invitee email"
                    type="email"
                  />
                  <button
                    type="button"
                    onClick={addInvitee}
                    className="inline-flex h-10 items-center justify-center rounded-md border border-[#9aa4b4] px-4 text-[14px] font-semibold text-[#24242e] hover:bg-[#f3f7ff]"
                  >
                    Add
                  </button>
                </div>
                {invitees.length ? (
                  <div className="flex flex-wrap gap-2">
                    {invitees.map((email) => (
                      <span
                        key={email}
                        className="inline-flex max-w-full items-center gap-2 rounded-full border border-[#b9d3ff] bg-[#f3f7ff] px-3 py-1.5 text-[13px] font-medium text-[#0b124b]"
                      >
                        <span className="truncate">{email}</span>
                        <button type="button" onClick={() => removeInvitee(email)} aria-label={`Remove ${email}`}>
                          <X className="size-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
              <p className="mt-2 max-w-[520px] text-[13px] text-[#697089]">
                Invitees receive the meeting title, date, time, duration, and join URL.
              </p>
            </Row>

            {error ? (
              <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:ml-[145px]">{error}</div>
            ) : null}

            <div className="flex gap-2 pt-1 sm:pl-[145px]">
              <button
                disabled={!title.trim() || !startsAt || loading}
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
