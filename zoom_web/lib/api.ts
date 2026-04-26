import { getAuthToken, type AuthUser } from "@/lib/auth-store"

export type Participant = {
  participant_id: string
  meeting_id: string
  display_name: string
  avatar_url: string | null
  role: "host" | "participant" | string
  muted: boolean
  camera_on: boolean
  joined_at: string
  left_at: string | null
}

export type Meeting = {
  meeting_id: string
  title: string
  description: string
  meeting_type: "instant" | "scheduled" | string
  status: "upcoming" | "recent" | string
  starts_at: string
  duration_minutes: number
  invite_link: string
  host_name: string
  created_at: string
  participants: Participant[]
}

export type JoinMeetingResponse = {
  meeting: Meeting
  participant: Participant
}

export type InstantMeetingResponse = JoinMeetingResponse

export type AuthResponse = {
  access_token: string
  token_type: "bearer" | string
  user: AuthUser
}

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "http://localhost:8000"

export const WS_BASE_URL = API_BASE_URL.replace(/^http/, "ws")

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getAuthToken()
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  })

  if (!response.ok) {
    let message = "Something went wrong"
    try {
      const body = await response.json()
      message = body.detail ?? message
    } catch {
      message = response.statusText
    }
    throw new Error(message)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

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

export function signup(payload: { email: string; name: string; password: string }) {
  return request<AuthResponse>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export function login(payload: { email: string; password: string }) {
  return request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export function getMe() {
  return request<AuthUser>("/auth/me", { cache: "no-store" })
}

export function googleOAuthUrl(next = "/myhome") {
  return `${API_BASE_URL}/auth/google/start?next=${encodeURIComponent(next)}`
}

export function joinMeeting(meetingId: string, display_name: string) {
  return request<JoinMeetingResponse>(`/meetings/${meetingId}/join`, {
    method: "POST",
    body: JSON.stringify({ display_name }),
  })
}

export function updateParticipant(
  participantId: string,
  payload: { muted?: boolean; camera_on?: boolean; left?: boolean },
) {
  return request<Participant>(`/participants/${participantId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  })
}

export function removeParticipant(meetingId: string, participantId: string) {
  return request<void>(`/meetings/${meetingId}/participants/${participantId}`, {
    method: "DELETE",
  })
}

export function endMeeting(meetingId: string, participantId: string) {
  return request<void>(`/meetings/${meetingId}/end?participant_id=${encodeURIComponent(participantId)}`, {
    method: "POST",
  })
}

export function extractMeetingId(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return ""

  try {
    const url = new URL(trimmed)
    const fromQuery = url.searchParams.get("meeting")
    if (fromQuery) return fromQuery.replace(/\D/g, "")
    const roomMatch = url.pathname.match(/\/meeting\/(\d+)/)
    if (roomMatch?.[1]) return roomMatch[1]
  } catch {
    // Plain meeting IDs are expected here.
  }

  return trimmed.replace(/\D/g, "")
}

export function formatMeetingTime(value: string) {
  const normalized = /(?:z|[+-]\d{2}:?\d{2})$/i.test(value) ? value : `${value}Z`
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(normalized))
}
