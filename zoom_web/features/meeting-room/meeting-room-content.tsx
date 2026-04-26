"use client"

import Link from "next/link"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import { Loader2 } from "lucide-react"

import { ChatPanel } from "@/components/meeting/chat-panel"
import { MeetingHeader } from "@/components/meeting/meeting-header"
import { MeetingToolbar } from "@/components/meeting/meeting-toolbar"
import { ParticipantTile } from "@/components/meeting/participant-tile"
import { ParticipantsPanel } from "@/components/meeting/participants-panel"
import {
  endMeeting,
  getMeeting,
  removeParticipant,
  updateParticipant,
  WS_BASE_URL,
  type Meeting,
  type Participant,
} from "@/lib/api"
import { useAuthStore } from "@/lib/auth-store"
import type { ChatMessage, PanelMode, SignalMessage } from "@/features/meeting-room/types"

export function MeetingRoomContent() {
  const params = useParams<{ meetingId: string }>()
  const router = useRouter()
  const searchParams = useSearchParams()
  const meetingId = params.meetingId
  const participantId = searchParams.get("participantId") ?? ""
  const isAuthenticated = useAuthStore((state) => Boolean(state.token))
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  const displayStreamRef = useRef<MediaStream | null>(null)
  const currentVideoTrackRef = useRef<MediaStreamTrack | null>(null)
  const socketRef = useRef<WebSocket | null>(null)
  const peersRef = useRef<Record<string, RTCPeerConnection>>({})
  const controlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const panelModeRef = useRef<PanelMode>(null)
  const heartbeatTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const reconnectAttemptsRef = useRef(0)
  const manualCloseRef = useRef(false)

  const [meeting, setMeeting] = useState<Meeting | null>(null)
  const [participants, setParticipants] = useState<Record<string, Participant>>({})
  const [remoteStreams, setRemoteStreams] = useState<Record<string, MediaStream>>({})
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [chatText, setChatText] = useState("")
  const [unreadChatCount, setUnreadChatCount] = useState(0)
  const [muted, setMuted] = useState(false)
  const [cameraOn, setCameraOn] = useState(true)
  const [screenSharing, setScreenSharing] = useState(false)
  const [controlsVisible, setControlsVisible] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [panelMode, setPanelMode] = useState<PanelMode>(null)
  const [endMenuOpen, setEndMenuOpen] = useState(false)

  const self = participantId ? participants[participantId] : undefined
  const isHost = self?.role === "host"
  const inviteLink = meeting?.invite_link ?? ""
  const activeParticipants = useMemo(
    () => Object.values(participants).filter((participant) => !participant.left_at),
    [participants],
  )
  const remoteParticipantIds = useMemo(
    () => Object.keys(remoteStreams).filter((id) => participants[id] && !participants[id].left_at),
    [participants, remoteStreams],
  )
  const visibleRemoteIds = remoteParticipantIds.slice(0, 8)
  const hiddenRemoteCount = Math.max(remoteParticipantIds.length - visibleRemoteIds.length, 0)
  const tileCount = 1 + visibleRemoteIds.length + (hiddenRemoteCount > 0 ? 1 : 0)
  const gridClass =
    tileCount <= 1
      ? "grid-cols-1 grid-rows-1"
      : tileCount === 2
        ? "grid-cols-1 grid-rows-2 sm:grid-cols-2 sm:grid-rows-1"
        : tileCount <= 4
          ? "grid-cols-1 grid-rows-4 sm:grid-cols-2 sm:grid-rows-2"
          : tileCount <= 6
            ? "grid-cols-2 grid-rows-3 md:grid-cols-3 md:grid-rows-2"
            : "grid-cols-2 grid-rows-5 md:grid-cols-3 md:grid-rows-3"
  const showChrome = controlsVisible || panelMode !== null
  useEffect(() => {
    if (!localVideoRef.current) return
    localVideoRef.current.srcObject =
      screenSharing && displayStreamRef.current
        ? displayStreamRef.current
        : localStreamRef.current
  }, [cameraOn, loading, meeting, screenSharing])

  useEffect(() => {
    panelModeRef.current = panelMode
    showControls()
    return () => {
      if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [panelMode])

  useEffect(() => {
    if (!participantId) {
      router.replace(`/join?meeting=${meetingId}`)
    }
  }, [meetingId, participantId, router])

  useEffect(() => {
    if (!participantId) return
    let cancelled = false

    function clearHeartbeat() {
      if (heartbeatTimerRef.current) {
        clearInterval(heartbeatTimerRef.current)
        heartbeatTimerRef.current = null
      }
    }

    function clearReconnect() {
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current)
        reconnectTimerRef.current = null
      }
    }

    function startHeartbeat() {
      clearHeartbeat()
      heartbeatTimerRef.current = setInterval(() => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
          send({ type: "ping" })
        }
      }, 20000)
    }

    function connectSocket() {
      clearReconnect()
      const socket = new WebSocket(`${WS_BASE_URL}/ws/meetings/${meetingId}?participant_id=${participantId}`)
      socketRef.current = socket
      socket.onopen = () => {
        reconnectAttemptsRef.current = 0
        startHeartbeat()
      }
      socket.onmessage = (event) => {
        const message = JSON.parse(event.data) as SignalMessage
        void handleSignal(message)
      }
      socket.onclose = () => {
        clearHeartbeat()
        if (cancelled || manualCloseRef.current) return
        const attempts = reconnectAttemptsRef.current + 1
        reconnectAttemptsRef.current = attempts
        if (attempts > 5) {
          setError("Connection lost. Please rejoin the meeting.")
          return
        }
        const delayMs = Math.min(1000 * 2 ** (attempts - 1), 10000)
        reconnectTimerRef.current = setTimeout(() => {
          if (!cancelled) connectSocket()
        }, delayMs)
      }
    }

    async function start() {
      try {
        const meetingData = await getMeeting(meetingId)
        if (cancelled) return
        setMeeting(meetingData)
        setParticipants(
          Object.fromEntries(
            meetingData.participants
              .filter((participant) => !participant.left_at)
              .map((participant) => [participant.participant_id, participant]),
          ),
        )

        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }
        localStreamRef.current = stream
        currentVideoTrackRef.current = stream.getVideoTracks()[0] ?? null
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
        }

        connectSocket()
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to open meeting room")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void start()

    return () => {
      cancelled = true
      manualCloseRef.current = true
      clearHeartbeat()
      clearReconnect()
      socketRef.current?.close()
      localStreamRef.current?.getTracks().forEach((track) => track.stop())
      displayStreamRef.current?.getTracks().forEach((track) => track.stop())
      Object.values(peersRef.current).forEach((peer) => peer.close())
      peersRef.current = {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meetingId, participantId])

  function showControls() {
    setControlsVisible(true)
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current)
    controlsTimerRef.current = setTimeout(() => {
      if (panelMode === null) setControlsVisible(false)
    }, 2200)
  }

  function send(message: SignalMessage) {
    if (socketRef.current?.readyState === WebSocket.OPEN) socketRef.current.send(JSON.stringify(message))
  }

  function createPeer(target: string, initiator: boolean) {
    if (peersRef.current[target]) return peersRef.current[target]

    const peer = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] })
    peersRef.current[target] = peer

    const audioTrack = localStreamRef.current?.getAudioTracks()[0]
    const videoTrack = currentVideoTrackRef.current ?? localStreamRef.current?.getVideoTracks()[0]
    if (localStreamRef.current) {
      if (audioTrack) peer.addTrack(audioTrack, localStreamRef.current)
      if (videoTrack) peer.addTrack(videoTrack, localStreamRef.current)
    }

    peer.onicecandidate = (event) => {
      if (event.candidate) send({ type: "ice-candidate", target, candidate: event.candidate.toJSON() })
    }
    peer.ontrack = (event) => {
      setRemoteStreams((current) => {
        const stream = current[target] ?? new MediaStream()
        const alreadyAdded = stream.getTracks().some((track) => track.id === event.track.id)
        if (!alreadyAdded) stream.addTrack(event.track)
        return { ...current, [target]: stream }
      })
    }
    peer.onconnectionstatechange = () => {
      if (["failed", "disconnected", "closed"].includes(peer.connectionState)) {
        setRemoteStreams((current) => {
          const next = { ...current }
          delete next[target]
          return next
        })
      }
    }
    if (initiator) {
      peer
        .createOffer()
        .then((offer) => peer.setLocalDescription(offer).then(() => offer))
        .then((offer) => send({ type: "offer", target, offer }))
        .catch((err) => setError(err.message))
    }
    return peer
  }

  async function renegotiatePeer(peer: RTCPeerConnection, target: string) {
    const offer = await peer.createOffer()
    await peer.setLocalDescription(offer)
    send({ type: "offer", target, offer })
  }

  async function replaceOutgoingVideoTrack(track: MediaStreamTrack | null) {
    currentVideoTrackRef.current = track
    await Promise.all(
      Object.entries(peersRef.current).map(async ([target, peer]) => {
        const sender =
          peer.getSenders().find((item) => item.track?.kind === "video") ??
          peer.getTransceivers().find((item) => item.receiver.track.kind === "video")?.sender
        if (sender) {
          await sender.replaceTrack(track)
        } else if (track && localStreamRef.current) {
          peer.addTrack(track, localStreamRef.current)
          await renegotiatePeer(peer, target)
        }
      }),
    )
  }

  async function handleSignal(message: SignalMessage) {
    if (message.type === "pong") return
    if (message.type === "existing-participants") {
      message.participants?.forEach((id) => {
        if (id !== participantId) createPeer(id, true)
      })
      return
    }
    if (message.type === "participant-joined" && message.participant) {
      setParticipants((current) => ({ ...current, [message.participant!.participant_id]: message.participant! }))
      createPeer(message.participant.participant_id, true)
      return
    }
    if (message.type === "participant-left" && message.participantId) {
      if (message.participantId === participantId) return
      peersRef.current[message.participantId]?.close()
      delete peersRef.current[message.participantId]
      setRemoteStreams((current) => {
        const next = { ...current }
        delete next[message.participantId!]
        return next
      })
      setParticipants((current) => {
        const next = { ...current }
        delete next[message.participantId!]
        return next
      })
      return
    }
    if (message.type === "participant-updated" && message.participant) {
      setParticipants((current) => ({ ...current, [message.participant!.participant_id]: message.participant! }))
      return
    }
    if (message.type === "chat-message" && message.chat) {
      setMessages((current) => [...current, message.chat!])
      if (panelModeRef.current !== "chat") setUnreadChatCount((count) => count + 1)
      return
    }
    if (message.type === "host-mute-all") {
      await toggleMute(true)
      return
    }
    if (message.type === "removed" || message.type === "meeting-ended") {
      await leaveMeeting({ notifyBackend: false })
      return
    }

    if (!message.from) return
    const peer = createPeer(message.from, false)
    if (message.type === "offer" && message.offer) {
      await peer.setRemoteDescription(new RTCSessionDescription(message.offer))
      const answer = await peer.createAnswer()
      await peer.setLocalDescription(answer)
      send({ type: "answer", target: message.from, answer })
    }
    if (message.type === "answer" && message.answer) {
      await peer.setRemoteDescription(new RTCSessionDescription(message.answer))
    }
    if (message.type === "ice-candidate" && message.candidate) {
      await peer.addIceCandidate(new RTCIceCandidate(message.candidate))
    }
  }

  async function toggleMute(force?: boolean) {
    const nextMuted = force ?? !muted
    localStreamRef.current?.getAudioTracks().forEach((track) => {
      track.enabled = !nextMuted
    })
    setMuted(nextMuted)
    if (participantId) {
      const updated = await updateParticipant(participantId, { muted: nextMuted })
      setParticipants((current) => ({ ...current, [participantId]: updated }))
    }
  }

  async function toggleCamera() {
    const nextCameraOn = !cameraOn
    const localVideoTrack = localStreamRef.current?.getVideoTracks()[0] ?? null
    if (localVideoTrack) localVideoTrack.enabled = nextCameraOn
    setCameraOn(nextCameraOn)
    if (!screenSharing && nextCameraOn) await replaceOutgoingVideoTrack(localVideoTrack)
    if (participantId) {
      const updated = await updateParticipant(participantId, { camera_on: nextCameraOn })
      setParticipants((current) => ({ ...current, [participantId]: updated }))
    }
  }

  async function startScreenShare() {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false })
      const [track] = stream.getVideoTracks()
      displayStreamRef.current = stream
      setScreenSharing(true)
      if (localVideoRef.current) localVideoRef.current.srcObject = stream
      await replaceOutgoingVideoTrack(track)
      track.onended = () => {
        void stopScreenShare()
      }
    } catch (err) {
      if (err instanceof Error && err.name !== "NotAllowedError") setError(err.message)
    }
  }

  async function stopScreenShare() {
    displayStreamRef.current?.getTracks().forEach((track) => track.stop())
    displayStreamRef.current = null
    setScreenSharing(false)
    if (localVideoRef.current && localStreamRef.current) localVideoRef.current.srcObject = localStreamRef.current
    const cameraTrack = cameraOn ? (localStreamRef.current?.getVideoTracks()[0] ?? null) : null
    await replaceOutgoingVideoTrack(cameraTrack)
  }

  async function leaveMeeting({ notifyBackend = true } = {}) {
    manualCloseRef.current = true
    if (notifyBackend && participantId) {
      await updateParticipant(participantId, { left: true }).catch(() => undefined)
    }
    socketRef.current?.close()
    localStreamRef.current?.getTracks().forEach((track) => track.stop())
    displayStreamRef.current?.getTracks().forEach((track) => track.stop())
    router.push(isAuthenticated ? "/myhome" : "/")
  }

  async function handleEndMeeting() {
    if (!meeting || !participantId) return
    await endMeeting(meeting.meeting_id, participantId)
    await leaveMeeting({ notifyBackend: false })
  }

  async function handleRemove(targetParticipantId: string) {
    if (!meeting) return
    await removeParticipant(meeting.meeting_id, targetParticipantId)
    setParticipants((current) => {
      const next = { ...current }
      delete next[targetParticipantId]
      return next
    })
  }

  function muteAll() {
    activeParticipants
      .filter((participant) => participant.participant_id !== participantId)
      .forEach((participant) => send({ type: "host-mute-all", target: participant.participant_id }))
  }

  function toggleChatPanel() {
    setPanelMode((value) => {
      const nextMode = value === "chat" ? null : "chat"
      if (nextMode === "chat") setUnreadChatCount(0)
      return nextMode
    })
  }

  function submitChat(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const text = chatText.trim()
    if (!text || !participantId) return
    const message: ChatMessage = {
      id: crypto.randomUUID(),
      from: participantId,
      fromName: self?.display_name ?? "Demo User",
      text,
      createdAt: new Date().toISOString(),
    }
    setMessages((current) => [...current, message])
    send({ type: "chat-message", chat: message })
    setChatText("")
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#1b1b1b] text-white">
        <Loader2 className="mr-2 size-5 animate-spin" />
        Opening meeting
      </main>
    )
  }

  if (error || !meeting) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#1b1b1b] px-6 text-center text-white">
        <p className="text-lg font-semibold">{error || "Meeting unavailable"}</p>
        <Link href="/join" className="mt-4 rounded-md bg-[#0b5cff] px-4 py-2 text-sm font-semibold">
          Back to Join
        </Link>
      </main>
    )
  }

  return (
    <main onMouseMove={showControls} className="relative flex h-dvh overflow-hidden bg-[#1b1b1b] text-white">
      <section className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <MeetingHeader showChrome={showChrome} inviteLink={inviteLink} />
        <div className="min-h-0 flex-1 bg-[#111] p-1">
          <div className={`grid h-full w-full gap-1 ${gridClass}`}>
            <ParticipantTile
              name={self?.display_name ?? "Demo User"}
              avatarUrl={self?.avatar_url}
              muted={muted}
              isHost={isHost}
              isSelf
              cameraOn={cameraOn}
              screenSharing={screenSharing}
              videoRef={localVideoRef}
            />
            {visibleRemoteIds.map((id) => (
              <ParticipantTile
                key={id}
                name={participants[id]?.display_name ?? "Participant"}
                avatarUrl={participants[id]?.avatar_url}
                muted={participants[id]?.muted}
                isHost={participants[id]?.role === "host"}
                cameraOn={participants[id]?.camera_on}
                stream={remoteStreams[id]}
              />
            ))}
            {hiddenRemoteCount > 0 ? (
              <div className="flex items-center justify-center rounded-sm bg-[#232323] text-4xl font-semibold text-white">
                +{hiddenRemoteCount} more
              </div>
            ) : null}
          </div>
        </div>
        <MeetingToolbar
          showChrome={showChrome}
          muted={muted}
          cameraOn={cameraOn}
          panelMode={panelMode}
          activeParticipantCount={activeParticipants.length}
          unreadChatCount={unreadChatCount}
          screenSharing={screenSharing}
          isHost={isHost}
          endMenuOpen={endMenuOpen}
          onToggleMute={() => void toggleMute()}
          onToggleCamera={() => void toggleCamera()}
          onToggleParticipants={() => setPanelMode((value) => (value === "participants" ? null : "participants"))}
          onToggleChat={toggleChatPanel}
          onToggleScreenShare={() => void (screenSharing ? stopScreenShare() : startScreenShare())}
          onLeave={() => void leaveMeeting()}
          onEndMeeting={() => void handleEndMeeting()}
          onEndMenuToggle={() => setEndMenuOpen((open) => !open)}
        />
      </section>

      {panelMode === "participants" ? (
        <ParticipantsPanel
          participants={activeParticipants}
          participantId={participantId}
          isHost={isHost}
          onClose={() => setPanelMode(null)}
          onMuteAll={muteAll}
          onInvite={() => navigator.clipboard.writeText(inviteLink)}
          onRemove={handleRemove}
        />
      ) : null}
      {panelMode === "chat" ? (
        <ChatPanel
          title={meeting.title}
          messages={messages}
          participantId={participantId}
          chatText={chatText}
          onTextChange={setChatText}
          onSubmit={submitChat}
          onClose={() => setPanelMode(null)}
        />
      ) : null}
    </main>
  )
}
