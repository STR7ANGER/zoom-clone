"use client"

import { Suspense } from "react"
import { Loader2 } from "lucide-react"

import { MeetingRoomContent } from "@/features/meeting-room/meeting-room-content"

export default function MeetingRoomPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#1b1b1b] text-white">
          <Loader2 className="mr-2 size-5 animate-spin" />
          Opening meeting
        </main>
      }
    >
      <MeetingRoomContent />
    </Suspense>
  )
}
