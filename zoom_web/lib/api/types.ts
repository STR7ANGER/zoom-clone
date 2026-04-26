import type { AuthUser } from "@/lib/auth-store"

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
