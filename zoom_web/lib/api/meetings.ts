import { request } from "@/lib/api/client"
import type { InstantMeetingResponse, JoinMeetingResponse, Meeting } from "@/lib/api/types"

export function getMeetings(status?: "upcoming" | "recent") {
  const query = status ? `?status=${status}` : ""
  return request<Meeting[]>(`/meetings${query}`, { cache: "no-store" })
}

export function getMeeting(meetingId: string) {
  return request<Meeting>(`/meetings/${meetingId}`, { cache: "no-store" })
}

export function createInstantMeeting(host_display_name = "Demo User") {
  return request<InstantMeetingResponse>("/meetings/instant", {
    method: "POST",
    body: JSON.stringify({ host_display_name }),
  })
}

export function createScheduledMeeting(payload: {
  title: string
  description: string
  starts_at: string
  duration_minutes: number
  host_name?: string
  invitees?: string[]
}) {
  return request<Meeting>("/meetings/scheduled", {
    method: "POST",
    body: JSON.stringify({ host_name: "Demo User", ...payload }),
  })
}

export function joinMeeting(meetingId: string, display_name: string) {
  return request<JoinMeetingResponse>(`/meetings/${meetingId}/join`, {
    method: "POST",
    body: JSON.stringify({ display_name }),
  })
}

export function endMeeting(meetingId: string, participantId: string) {
  return request<void>(`/meetings/${meetingId}/end?participant_id=${encodeURIComponent(participantId)}`, {
    method: "POST",
  })
}
