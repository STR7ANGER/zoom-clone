"use client"

import Link from "next/link"
import { Clock, Copy } from "lucide-react"

import { formatMeetingTime, type Meeting } from "@/lib/api"

export function MeetingRow({ meeting }: { meeting: Meeting }) {
  return (
    <div className="flex flex-col gap-3 rounded-md border border-[#e7eaf2] bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="truncate text-[15px] font-semibold text-[#232333]">{meeting.title}</p>
        <p className="mt-1 flex flex-wrap items-center gap-2 text-[13px] text-[#697089]">
          <Clock className="size-3.5" />
          {formatMeetingTime(meeting.starts_at)}
          <span>•</span>
          <span>{meeting.duration_minutes} min</span>
          <span>•</span>
          <span>ID {meeting.meeting_id}</span>
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={() => navigator.clipboard.writeText(meeting.invite_link)}
          className="inline-flex size-8 items-center justify-center rounded-md border border-[#c5cfdf] text-[#4d5263] hover:bg-[#f3f7ff]"
          aria-label="Copy invite link"
        >
          <Copy className="size-4" />
        </button>
        <Link
          href={`/join?meeting=${meeting.meeting_id}`}
          className="rounded-md bg-[#0b5cff] px-3 py-1.5 text-[13px] font-semibold text-white hover:bg-[#084bd8]"
        >
          Start
        </Link>
      </div>
    </div>
  )
}
