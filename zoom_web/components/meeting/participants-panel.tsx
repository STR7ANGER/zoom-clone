"use client"

import { Copy, Mic, MicOff, UserMinus, Video, VideoOff, X } from "lucide-react"

import type { Participant } from "@/lib/api"
import { initials } from "@/features/meeting-room/helpers"

export function ParticipantsPanel({
  participants,
  participantId,
  isHost,
  onClose,
  onMuteAll,
  onInvite,
  onRemove,
}: {
  participants: Participant[]
  participantId: string
  isHost: boolean
  onClose: () => void
  onMuteAll: () => void
  onInvite: () => void
  onRemove: (participantId: string) => void
}) {
  return (
    <aside className="flex w-[560px] shrink-0 flex-col bg-white text-[#232333]">
      <div className="relative flex h-14 items-center justify-center border-b border-[#eceff4] px-5">
        <h2 className="text-xl font-bold">Participants ({participants.length})</h2>
        <div className="absolute right-4 flex items-center gap-3 text-[#6b7280]">
          <button type="button" aria-label="Pop out">
            <Copy className="size-5" />
          </button>
          <button type="button" onClick={onClose} aria-label="Close participants">
            <X className="size-6" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {participants.map((participant) => (
          <div key={participant.participant_id} className="flex items-center justify-between rounded-md px-1 py-3">
            <div className="flex min-w-0 items-center gap-4">
              <span className="flex size-11 items-center justify-center overflow-hidden rounded-lg bg-[#7959c7] text-xl text-white">
                {participant.avatar_url ? (
                  <img src={participant.avatar_url} alt="" className="size-full object-cover" />
                ) : (
                  initials(participant.display_name)
                )}
              </span>
              <p className="truncate text-lg">
                {participant.display_name}
                {participant.role === "host" ? " (Host, me)" : ""}
              </p>
            </div>
            <div className="flex items-center gap-3 text-[#ff4b55]">
              {participant.muted ? <MicOff className="size-5" /> : <Mic className="size-5 text-[#687284]" />}
              {participant.camera_on ? <Video className="size-5 text-[#687284]" /> : <VideoOff className="size-5" />}
              {isHost && participant.participant_id !== participantId ? (
                <button type="button" onClick={() => onRemove(participant.participant_id)} aria-label={`Remove ${participant.display_name}`}>
                  <UserMinus className="size-5 text-[#b42318]" />
                </button>
              ) : null}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-[#eceff4] p-6">
        <button type="button" onClick={onInvite} className="rounded border border-[#aeb4bf] px-6 py-2 text-lg">
          Invite
        </button>
        {isHost ? (
          <button type="button" onClick={onMuteAll} className="rounded border border-[#aeb4bf] px-6 py-2 text-lg">
            Mute All
          </button>
        ) : null}
        <button type="button" className="rounded border border-[#aeb4bf] px-6 py-2 text-lg">
          More
        </button>
      </div>
    </aside>
  )
}
