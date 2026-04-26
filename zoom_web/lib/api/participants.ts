import { request } from "@/lib/api/client"
import type { Participant } from "@/lib/api/types"

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
