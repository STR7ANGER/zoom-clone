"use client"

import Link from "next/link"
import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronDown, Loader2 } from "lucide-react"

import { LandingFloatingWidgets } from "@/components/landing/landing-floating-widgets"
import {
  createInstantMeeting,
  extractMeetingId,
  getMeeting,
  joinMeeting,
} from "@/lib/api"
import { initials, useAuthStore } from "@/lib/auth-store"

function JoinContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [meetingValue, setMeetingValue] = useState(() => searchParams.get("meeting") ?? "")
  const [displayName, setDisplayName] = useState("Demo User")
  const [nameTouched, setNameTouched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [creatingMeeting, setCreatingMeeting] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [error, setError] = useState("")
  const token = useAuthStore((state) => state.token)
  const user = useAuthStore((state) => state.user)
  const signOut = useAuthStore((state) => state.signOut)
  const isSignedIn = Boolean(token && user)
  const currentDisplayName = nameTouched ? displayName : user?.name ?? "Demo User"

  async function handleJoin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const meetingId = extractMeetingId(meetingValue)
    if (!meetingId || !currentDisplayName.trim()) return

    setLoading(true)
    setError("")
    try {
      await getMeeting(meetingId)
      const { participant } = await joinMeeting(meetingId, currentDisplayName)
      router.push(`/meeting/${meetingId}?participantId=${participant.participant_id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to join meeting")
      setLoading(false)
    }
  }

  async function hostMeeting() {
    if (creatingMeeting) return
    if (!isSignedIn) {
      router.push("/signin?next=/myhome")
      return
    }
    setCreatingMeeting(true)
    setError("")
    try {
      const { meeting, participant } = await createInstantMeeting(user?.name ?? "Host")
      router.push(
        `/meeting/${meeting.meeting_id}?participantId=${participant.participant_id}`,
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to host meeting")
      setCreatingMeeting(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col overflow-x-hidden bg-white text-[#232333]">
      <nav className="fixed top-0 right-0 left-0 z-50 flex h-[61px] items-center justify-between gap-3 border-b border-[#e8e8ee] bg-white px-4 sm:px-[22px]">
        <Link href="/" className="flex items-center" aria-label="Zoom home">
          <img
            src="https://st1.zoom.us/homepage/20260413-1449/primary/dist/assets/zoommedia/logo-zoom@2x.png"
            alt="Zoom"
            className="h-[30px] w-auto"
          />
        </Link>
        <div className="flex min-w-0 items-center gap-3 text-[13px] font-semibold whitespace-nowrap text-[#5d5a78] sm:gap-5 sm:text-[15px] lg:gap-[28px]">
          <a href="#" className="hidden hover:text-[#0b5cff] sm:inline">
            Support
          </a>
          <Link
            href="/schedule"
            onClick={(event) => {
              if (!isSignedIn) {
                event.preventDefault()
                router.push("/signin?next=/schedule")
              }
            }}
            className="hidden hover:text-[#0b5cff] min-[430px]:inline"
          >
            Schedule
          </Link>
          <Link href="/join" className="hover:text-[#0b5cff]">
            Join
          </Link>
          <button
            type="button"
            onClick={hostMeeting}
            disabled={creatingMeeting}
            className="hidden font-semibold hover:text-[#0b5cff] disabled:opacity-60 sm:inline"
          >
            {creatingMeeting ? "Hosting..." : "Host"}
          </button>
          <button type="button" className="hidden items-center gap-1 hover:text-[#0b5cff] md:inline-flex">
            Web App <ChevronDown className="size-3.5" />
          </button>
          {isSignedIn ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen((open) => !open)}
                className="inline-flex size-8 items-center justify-center overflow-hidden rounded-full bg-[#7b55c7] text-[13px] font-semibold text-white"
                aria-label={`${user?.name} menu`}
                aria-expanded={userMenuOpen}
              >
                {user?.avatar_url ? <img src={user.avatar_url} alt="" className="size-full object-cover" /> : initials(user?.name ?? "")}
              </button>
              {userMenuOpen ? (
                <div className="absolute right-0 top-[42px] w-[220px] rounded-xl border border-[#e4e6ef] bg-white p-3 text-[#0b124b] shadow-[0_18px_42px_rgba(15,23,42,0.16)]">
                  <div className="flex items-center gap-3 rounded-lg bg-[#f3f7ff] p-3">
                    <span className="inline-flex size-10 items-center justify-center overflow-hidden rounded-full bg-[#7b55c7] text-[13px] font-semibold text-white">
                      {user?.avatar_url ? <img src={user.avatar_url} alt="" className="size-full object-cover" /> : initials(user?.name ?? "")}
                    </span>
                    <span className="truncate text-[15px] font-bold">{user?.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      signOut()
                      router.push("/")
                    }}
                    className="mt-3 h-10 w-full rounded-lg border border-[#d7dbe8] text-[14px] font-semibold hover:bg-[#f5f7fb]"
                  >
                    Sign Out
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <>
              <Link href="/signin" className="hover:text-[#0b5cff]">Sign In</Link>
              <Link href="/signup" className="hidden rounded-md bg-[#0b5cff] px-3 py-1.5 text-white hover:bg-[#084bd8] sm:inline">Sign Up Free</Link>
            </>
          )}
        </div>
      </nav>

      <div className="flex flex-1 flex-col items-center px-4 pt-[128px] sm:px-6 sm:pt-[168px]">
        <form onSubmit={handleJoin} className="w-full max-w-[324px]">
          <h1 className="mb-[40px] text-center text-[24px] font-bold text-[#24272a]">
            Join Meeting
          </h1>

          <label className="mb-[11px] block text-[13.5px] font-medium text-[#252525]">
            Meeting ID or Personal Link Name
          </label>
          <input
            type="text"
            value={meetingValue}
            onChange={(event) => setMeetingValue(event.target.value)}
            placeholder="Enter Meeting ID or Personal Link Name"
            className="h-[36px] w-full rounded-[9px] border border-[#aeb4c1] px-4 text-[15px] text-[#232333] placeholder:text-[#74788d] focus:border-[#0b5cff] focus:ring-2 focus:ring-[#0b5cff]/20 focus:outline-none"
          />

          <label className="mt-4 mb-[11px] block text-[13.5px] font-medium text-[#252525]">
            Your Name
          </label>
          <input
            type="text"
            value={currentDisplayName}
            onChange={(event) => {
              setNameTouched(true)
              setDisplayName(event.target.value)
            }}
            placeholder="Enter your name"
            className="h-[36px] w-full rounded-[9px] border border-[#aeb4c1] px-4 text-[15px] text-[#232333] placeholder:text-[#74788d] focus:border-[#0b5cff] focus:ring-2 focus:ring-[#0b5cff]/20 focus:outline-none"
          />

          {error ? (
            <p className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          ) : null}

          <button
            disabled={!extractMeetingId(meetingValue) || !currentDisplayName.trim() || loading}
            className="mt-4 inline-flex h-[35px] w-full items-center justify-center gap-2 rounded-[8px] bg-[#0b5cff] text-[15px] font-medium text-white transition-colors hover:bg-[#0a52e8] disabled:cursor-not-allowed disabled:bg-[#e7e8ee] disabled:text-[#8b8f99]"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : null}
            Join
          </button>
        </form>

        <a href="#" className="mt-12 text-center text-[13.5px] font-medium text-[#005bff] hover:underline sm:mt-[67px]">
          Join a meeting from an H.323/SIP room system
        </a>
      </div>

      <LandingFloatingWidgets />

      <footer className="static px-4 py-6 sm:fixed sm:right-0 sm:bottom-[34px] sm:left-0 sm:px-6 sm:py-0">
        <div className="mx-auto flex max-w-[590px] flex-col items-center justify-between gap-2 text-center text-[12px] text-[#5f6368] sm:flex-row sm:gap-8 sm:text-left">
          <span>© 2026 Zoom Communications, Inc. All rights reserved.</span>
          <a href="#" className="whitespace-nowrap hover:underline">
            Privacy & Legal Policies
          </a>
          <Link href="#" className="whitespace-nowrap text-[#005bff] hover:underline">
            English
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
