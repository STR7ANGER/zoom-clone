"use client"

import Link from "next/link"
import { Suspense, useEffect, useMemo, useRef, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import {
  Copy,
  FileText,
  Loader2,
  MessageSquare,
  Mic,
  MicOff,
  MonitorUp,
  MoreHorizontal,
  Send,
  ShieldCheck,
  Smile,
  Sparkles,
  UserMinus,
  Users,
  Video,
  VideoOff,
  X,
} from "lucide-react"

import {
  getMeeting,
  removeParticipant,
  updateParticipant,
  WS_BASE_URL,
  type Meeting,
  type Participant,
} from "@/lib/api"

type ChatMessage = {
  id: string
  from: string
  fromName: string
  text: string
  createdAt: string
}

type SignalMessage = {
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

type PanelMode = "participants" | "chat" | null

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

function ParticipantTile({
  name,
  muted = false,
  isHost = false,
  isSelf = false,
  cameraOn = false,
  stream,
  videoRef,
  screenSharing = false,
}: {
  name: string
  muted?: boolean
  isHost?: boolean
  isSelf?: boolean
  cameraOn?: boolean
  stream?: MediaStream
  videoRef?: React.RefObject<HTMLVideoElement | null>
  screenSharing?: boolean
}) {
  const remoteRef = useRef<HTMLVideoElement>(null)
  const ref = videoRef ?? remoteRef

  useEffect(() => {
    if (!videoRef && remoteRef.current && stream) {
      remoteRef.current.srcObject = stream
    }
  }, [stream, videoRef])

  return (
    <div className="relative flex min-h-0 min-w-0 items-center justify-center overflow-hidden rounded-sm bg-[#1b1b1b]">
      {(cameraOn || screenSharing || stream) ? (
        <video
          ref={ref}
          autoPlay
          playsInline
          muted={isSelf}
          className="h-full w-full object-contain"
        />
      ) : (
        <span className="flex aspect-square h-[min(38%,150px)] min-h-20 items-center justify-center bg-[#7959c7] text-[clamp(2.75rem,8vw,5.75rem)] font-light text-white">
          {initials(name)}
        </span>
      )}
      <span className="absolute bottom-2 left-2 rounded bg-black/75 px-2 py-1 text-sm text-white sm:text-base">
        {muted ? <MicOff className="mr-1 inline size-4 text-[#ff5b5b]" /> : null}
        {name}
        {isHost ? " (Host" : ""}
        {isHost && isSelf ? ", me" : ""}
        {isHost ? ")" : ""}
      </span>
    </div>
  )
}

function MeetingRoomContent() {
  const params = useParams<{ meetingId: string }>()
  const router = useRouter()
  const searchParams = useSearchParams()
  const meetingId = params.meetingId
  const participantId = searchParams.get("participantId") ?? ""
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  const displayStreamRef = useRef<MediaStream | null>(null)
  const currentVideoTrackRef = useRef<MediaStreamTrack | null>(null)
  const socketRef = useRef<WebSocket | null>(null)
  const peersRef = useRef<Record<string, RTCPeerConnection>>({})
  const controlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [meeting, setMeeting] = useState<Meeting | null>(null)
  const [participants, setParticipants] = useState<Record<string, Participant>>({})
  const [remoteStreams, setRemoteStreams] = useState<Record<string, MediaStream>>({})
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [chatText, setChatText] = useState("")
  const [muted, setMuted] = useState(false)
  const [cameraOn, setCameraOn] = useState(true)
  const [screenSharing, setScreenSharing] = useState(false)
  const [controlsVisible, setControlsVisible] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [panelMode, setPanelMode] = useState<PanelMode>(null)

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
        ? "grid-cols-2 grid-rows-1"
        : tileCount <= 4
          ? "grid-cols-2 grid-rows-2"
          : tileCount <= 6
            ? "grid-cols-3 grid-rows-2"
            : "grid-cols-3 grid-rows-3"
  const showChrome = controlsVisible || panelMode !== null

  useEffect(() => {
    if (localVideoRef.current && localStreamRef.current && !screenSharing) {
      localVideoRef.current.srcObject = localStreamRef.current
    }
  }, [loading, meeting, screenSharing])

  useEffect(() => {
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

        const socket = new WebSocket(`${WS_BASE_URL}/ws/meetings/${meetingId}?participant_id=${participantId}`)
        socketRef.current = socket
        socket.onmessage = (event) => {
          const message = JSON.parse(event.data) as SignalMessage
          void handleSignal(message)
        }
        socket.onclose = () => {
          Object.values(peersRef.current).forEach((peer) => peer.close())
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to open meeting room")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void start()

    return () => {
      cancelled = true
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
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message))
    }
  }

  function createPeer(target: string, initiator: boolean) {
    if (peersRef.current[target]) {
      return peersRef.current[target]
    }

    const peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    })
    peersRef.current[target] = peer

    const audioTrack = localStreamRef.current?.getAudioTracks()[0]
    const videoTrack = currentVideoTrackRef.current ?? localStreamRef.current?.getVideoTracks()[0]
    if (audioTrack && localStreamRef.current) peer.addTrack(audioTrack, localStreamRef.current)
    if (videoTrack) peer.addTrack(videoTrack, new MediaStream([videoTrack]))

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        send({ type: "ice-candidate", target, candidate: event.candidate.toJSON() })
      }
    }

    peer.ontrack = (event) => {
      const [stream] = event.streams
      if (stream) {
        setRemoteStreams((current) => ({ ...current, [target]: stream }))
      }
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

  async function replaceOutgoingVideoTrack(track: MediaStreamTrack | null) {
    currentVideoTrackRef.current = track
    await Promise.all(
      Object.values(peersRef.current).map(async (peer) => {
        const sender = peer.getSenders().find((item) => item.track?.kind === "video")
        if (sender) await sender.replaceTrack(track)
      }),
    )
  }

  async function handleSignal(message: SignalMessage) {
    if (message.type === "existing-participants") {
      return
    }

    if (message.type === "participant-joined" && message.participant) {
      setParticipants((current) => ({ ...current, [message.participant!.participant_id]: message.participant! }))
      createPeer(message.participant.participant_id, true)
      return
    }

    if (message.type === "participant-left" && message.participantId) {
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
      return
    }

    if (message.type === "host-mute-all") {
      await toggleMute(true)
      return
    }

    if (message.type === "removed") {
      await leaveMeeting()
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
    localStreamRef.current?.getVideoTracks().forEach((track) => {
      track.enabled = nextCameraOn
    })
    setCameraOn(nextCameraOn)
    if (!screenSharing) {
      await replaceOutgoingVideoTrack(nextCameraOn ? (localStreamRef.current?.getVideoTracks()[0] ?? null) : null)
    }
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

  async function leaveMeeting() {
    if (participantId) {
      await updateParticipant(participantId, { left: true }).catch(() => undefined)
    }
    socketRef.current?.close()
    localStreamRef.current?.getTracks().forEach((track) => track.stop())
    displayStreamRef.current?.getTracks().forEach((track) => track.stop())
    router.push("/myhome")
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
    <main onMouseMove={showControls} className="flex h-screen overflow-hidden bg-[#1b1b1b] text-white">
      <section className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header
          className={`flex items-center justify-between overflow-hidden bg-black px-8 transition-[height,opacity] duration-200 ${
            showChrome ? "h-[70px] opacity-100" : "h-0 opacity-0"
          }`}
        >
          <div className="leading-none">
            <p className="text-[15px] font-semibold tracking-tight">zoom</p>
            <p className="text-2xl font-bold">Workplace</p>
          </div>
          <div className="flex items-center gap-6 text-white/90">
            <ShieldCheck className="size-6 fill-[#39e168] text-[#39e168]" />
            <span className="h-9 w-px bg-white/25" />
            <button type="button" className="inline-flex items-center gap-2 text-lg">
              <Video className="size-5" />
              View
            </button>
            <button type="button" onClick={() => navigator.clipboard.writeText(inviteLink)} aria-label="Copy invite">
              <Copy className="size-6" />
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1 bg-[#111] p-1">
          <div className={`grid h-full w-full gap-1 ${gridClass}`}>
            <ParticipantTile
              name={self?.display_name ?? "Demo User"}
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

        <footer
          className={`flex items-center justify-between overflow-hidden bg-black px-7 transition-[height,opacity] duration-200 ${
            showChrome ? "h-[66px] opacity-100" : "h-0 opacity-0"
          }`}
        >
          <div className="flex min-w-[240px] items-center gap-8">
            <ToolButton active={muted} icon={muted ? MicOff : Mic} label={muted ? "Unmute" : "Mute"} onClick={() => toggleMute()} danger={muted} />
            <ToolButton active={!cameraOn} icon={cameraOn ? Video : VideoOff} label="Video" onClick={toggleCamera} danger={!cameraOn} />
          </div>
          <div className="flex items-center gap-7">
            <ToolButton
              active={panelMode === "participants"}
              icon={Users}
              label={`Participants${activeParticipants.length ? ` ${activeParticipants.length}` : ""}`}
              onClick={() => setPanelMode((value) => (value === "participants" ? null : "participants"))}
            />
            <ToolButton
              active={panelMode === "chat"}
              icon={MessageSquare}
              label="Chat"
              onClick={() => setPanelMode((value) => (value === "chat" ? null : "chat"))}
            />
            <ToolButton icon={Smile} label="React" onClick={() => undefined} />
            <ToolButton
              active={screenSharing}
              icon={MonitorUp}
              label={screenSharing ? "Stop Share" : "Share"}
              onClick={() => (screenSharing ? stopScreenShare() : startScreenShare())}
              green
            />
            <ToolButton icon={ShieldCheck} label="Host tools" onClick={() => undefined} />
            <ToolButton icon={Sparkles} label="AI Companion" onClick={() => undefined} />
            <ToolButton icon={MoreHorizontal} label="More" onClick={() => undefined} />
          </div>
          <div className="flex min-w-[160px] justify-end">
            <button type="button" onClick={leaveMeeting} className="flex flex-col items-center gap-0.5 text-white">
              <span className="flex size-9 items-center justify-center rounded-md border-2 border-[#ff3568] text-[#ff3568]">
                <X className="size-6" />
              </span>
              <span className="text-sm">End</span>
            </button>
          </div>
        </footer>
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

function ToolButton({
  icon: Icon,
  label,
  onClick,
  active = false,
  danger = false,
  green = false,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  onClick: () => void
  active?: boolean
  danger?: boolean
  green?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-w-16 flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-white ${active ? "bg-white/12" : "hover:bg-white/10"}`}
    >
      <span className={green ? "rounded-md bg-[#58ee87] p-1 text-black" : danger ? "text-[#ff5b5b]" : ""}>
        <Icon className="size-7" />
      </span>
      <span className="text-base leading-tight">{label}</span>
    </button>
  )
}

function ParticipantsPanel({
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
              <span className="flex size-11 items-center justify-center rounded-lg bg-[#7959c7] text-xl text-white">
                {initials(participant.display_name)}
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

function ChatPanel({
  title,
  messages,
  participantId,
  chatText,
  onTextChange,
  onSubmit,
  onClose,
}: {
  title: string
  messages: ChatMessage[]
  participantId: string
  chatText: string
  onTextChange: (value: string) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  onClose: () => void
}) {
  return (
    <aside className="flex w-[560px] shrink-0 flex-col bg-white text-[#232333]">
      <div className="relative flex h-14 items-center justify-center border-b border-[#eceff4] px-5">
        <MessageSquare className="absolute left-5 size-5 text-[#8a9099]" />
        <h2 className="max-w-[360px] truncate text-xl font-bold">{title}</h2>
        <div className="absolute right-4 flex items-center gap-3 text-[#6b7280]">
          <button type="button" aria-label="Pop out">
            <Copy className="size-5" />
          </button>
          <button type="button" onClick={onClose} aria-label="Close chat">
            <X className="size-6" />
          </button>
        </div>
      </div>
      <div className="px-8 py-5 text-center text-base leading-snug text-[#858891]">
        Messages addressed to &quot;Meeting Group Chat&quot; will also appear in the meeting group chat in Team Chat
      </div>
      <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
        {messages.map((message) => (
          <div key={message.id} className={message.from === participantId ? "text-right" : ""}>
            <p className="text-xs font-semibold text-[#6b7280]">{message.fromName}</p>
            <p
              className={`mt-1 inline-block max-w-[86%] rounded-2xl px-4 py-2 text-left text-base ${
                message.from === participantId ? "bg-[#0b5cff] text-white" : "bg-[#f1f3f7] text-[#232333]"
              }`}
            >
              {message.text}
            </p>
          </div>
        ))}
      </div>
      <form onSubmit={onSubmit} className="border-t border-[#eceff4] bg-white">
        <div className="bg-[#f6f7fb] py-2 text-center text-sm text-[#7b8190]">Who can see your messages?</div>
        <div className="px-4 pt-3 text-lg">
          to: <span className="rounded-full bg-[#3f7df6] px-4 py-1 text-white">Meeting Group Chat</span>
        </div>
        <textarea
          value={chatText}
          onChange={(event) => onTextChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault()
              event.currentTarget.form?.requestSubmit()
            }
          }}
          placeholder="Type message here ..."
          className="h-24 w-full resize-none px-4 py-3 text-lg outline-none placeholder:text-[#9299a6]"
        />
        <div className="flex items-center justify-between px-4 pb-4 text-[#89909c]">
          <div className="flex items-center gap-5">
            <FileText className="size-5" />
            <Smile className="size-5" />
            <MoreHorizontal className="size-6" />
          </div>
          <button
            type="submit"
            disabled={!chatText.trim()}
            className="flex size-9 items-center justify-center rounded-lg bg-[#e3e7ef] text-[#8c93a1] enabled:bg-[#0b5cff] enabled:text-white"
            aria-label="Send message"
          >
            <Send className="size-5" />
          </button>
        </div>
      </form>
    </aside>
  )
}

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
