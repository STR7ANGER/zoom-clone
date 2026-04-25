"use client"

import Link from "next/link"
import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2, Video } from "lucide-react"

import { extractMeetingId, getMeeting, joinMeeting } from "@/lib/api"

function JoinContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [meetingValue, setMeetingValue] = useState(() => searchParams.get("meeting") ?? "")
  const [displayName, setDisplayName] = useState("Demo User")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleJoin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const meetingId = extractMeetingId(meetingValue)
    if (!meetingId || !displayName.trim()) return

    setLoading(true)
    setError("")
    try {
      await getMeeting(meetingId)
      const { participant } = await joinMeeting(meetingId, displayName)
      router.push(`/meeting/${meetingId}?participantId=${participant.participant_id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to join meeting")
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col overflow-x-hidden bg-white text-[#1f1f1f]">
      <nav className="fixed top-0 right-0 left-0 z-50 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-5">
        <Link href="/" className="flex items-center" aria-label="Zoom home">
          <img
            src="https://st1.zoom.us/homepage/20260413-1449/primary/dist/assets/zoommedia/logo-zoom@2x.png"
            alt="Zoom"
            className="h-9 w-auto"
          />
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/myhome"
            className="hidden rounded-full border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-gray-400 sm:inline-flex"
          >
            My Home
          </Link>
          <span className="inline-flex size-9 items-center justify-center rounded-full bg-[#7b55c7] text-[12px] font-bold text-white">
            DU
          </span>
        </div>
      </nav>

      <div className="flex flex-1 flex-col items-center justify-center px-6 pt-[65px] py-16">
        <form onSubmit={handleJoin} className="w-full max-w-md">
          <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-2xl bg-[#edf4ff] text-[#0b5cff]">
            <Video className="size-7" />
          </div>
          <h1 className="mb-8 text-center text-3xl font-bold text-[#1f1f1f]">Join Meeting</h1>

          <label className="mb-2 block text-sm text-gray-700">Meeting ID or invite link</label>
          <input
            type="text"
            value={meetingValue}
            onChange={(event) => setMeetingValue(event.target.value)}
            placeholder="Enter Meeting ID or paste invite link"
            className="mb-4 w-full rounded-lg border border-gray-300 px-4 py-3 text-base text-gray-800 placeholder-gray-400 focus:border-[#0b5cff] focus:ring-2 focus:ring-[#0b5cff]/20 focus:outline-none"
          />

          <label className="mb-2 block text-sm text-gray-700">Your display name</label>
          <input
            type="text"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            placeholder="Enter your name"
            className="mb-4 w-full rounded-lg border border-gray-300 px-4 py-3 text-base text-gray-800 placeholder-gray-400 focus:border-[#0b5cff] focus:ring-2 focus:ring-[#0b5cff]/20 focus:outline-none"
          />

          {error ? (
            <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          ) : null}

          <p className="mb-4 text-sm leading-relaxed text-gray-600">
            By clicking &quot;Join&quot;, you agree to join this demo meeting as the entered display name.
          </p>

          <button
            disabled={!extractMeetingId(meetingValue) || !displayName.trim() || loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0b5cff] px-4 py-3 text-base font-medium text-white transition-colors hover:bg-[#0a52e8] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : null}
            Join
          </button>
        </form>
      </div>

      <footer className="border-t border-gray-100 px-6 py-5">
        <div className="mx-auto flex max-w-5xl items-center justify-between text-xs text-gray-500">
          <span>Copyright 2026 Zoom Clone Demo. All rights reserved.</span>
          <Link href="/schedule" className="text-[#0b5cff] hover:underline">
            Schedule a meeting
          </Link>
        </div>
      </footer>
    </main>
  )
}

export default function JoinPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-white text-[#232333]">
          <Loader2 className="mr-2 size-5 animate-spin" />
          Loading
        </main>
      }
    >
      <JoinContent />
    </Suspense>
  )
}
