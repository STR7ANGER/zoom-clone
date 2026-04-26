"use client"

import { useEffect, useRef } from "react"
import { MicOff } from "lucide-react"

import { initials } from "@/features/meeting-room/helpers"

export function ParticipantTile({
  name,
  avatarUrl,
  muted = false,
  isHost = false,
  isSelf = false,
  cameraOn = false,
  stream,
  videoRef,
  screenSharing = false,
}: {
  name: string
  avatarUrl?: string | null
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
  const showVideo = cameraOn || screenSharing

  useEffect(() => {
    if (!videoRef && remoteRef.current && stream) {
      remoteRef.current.srcObject = stream
    }
  }, [showVideo, stream, videoRef])

  return (
    <div className="relative flex min-h-0 min-w-0 items-center justify-center overflow-hidden rounded-sm bg-[#1b1b1b]">
      {showVideo ? (
        <video
          ref={ref}
          autoPlay
          playsInline
          muted={isSelf}
          className="h-full w-full object-contain"
        />
      ) : avatarUrl ? (
        <img
          src={avatarUrl}
          alt=""
        className="aspect-square h-[min(34%,150px)] min-h-14 rounded-full object-cover sm:min-h-20"
        />
      ) : (
        <span className="flex aspect-square h-[min(34%,150px)] min-h-14 items-center justify-center bg-[#7959c7] text-[clamp(2rem,8vw,5.75rem)] font-light text-white sm:min-h-20">
          {initials(name)}
        </span>
      )}
      <span className="absolute bottom-2 left-2 max-w-[calc(100%-16px)] truncate rounded bg-black/75 px-2 py-1 text-xs text-white sm:text-base">
        {muted ? <MicOff className="mr-1 inline size-4 text-[#ff5b5b]" /> : null}
        {name}
        {isHost ? " (Host" : ""}
        {isHost && isSelf ? ", me" : ""}
        {isHost ? ")" : ""}
      </span>
    </div>
  )
}
