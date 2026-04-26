"use client"

import type { Participant } from "@/lib/api"

export type ChatMessage = {
  id: string
  from: string
  fromName: string
  text: string
  createdAt: string
}

export type SignalMessage = {
  type: string
  from?: string
  target?: string
  participants?: string[]
  participant?: Participant
  participantId?: string
  offer?: RTCSessionDescriptionInit
  answer?: RTCSessionDescriptionInit
  candidate?: RTCIceCandidateInit
  chat?: ChatMessage
}

export type PanelMode = "participants" | "chat" | null
