"use client"

import {
  MessageSquare,
  Mic,
  MicOff,
  MonitorUp,
  MoreHorizontal,
  ShieldCheck,
  Smile,
  Sparkles,
  Users,
  Video,
  VideoOff,
  X,
} from "lucide-react"

import type { PanelMode } from "@/features/meeting-room/types"
import { ToolButton } from "@/components/meeting/tool-button"

export function MeetingToolbar({
  showChrome,
  muted,
  cameraOn,
  panelMode,
  activeParticipantCount,
  unreadChatCount,
  screenSharing,
  isHost,
  endMenuOpen,
  onToggleMute,
  onToggleCamera,
  onToggleParticipants,
  onToggleChat,
  onToggleScreenShare,
  onLeave,
  onEndMeeting,
  onEndMenuToggle,
}: {
  showChrome: boolean
  muted: boolean
  cameraOn: boolean
  panelMode: PanelMode
  activeParticipantCount: number
  unreadChatCount: number
  screenSharing: boolean
  isHost: boolean
  endMenuOpen: boolean
  onToggleMute: () => void
  onToggleCamera: () => void
  onToggleParticipants: () => void
  onToggleChat: () => void
  onToggleScreenShare: () => void
  onLeave: () => void
  onEndMeeting: () => void
  onEndMenuToggle: () => void
}) {
  return (
    <footer
      className={`flex items-center justify-between bg-black px-7 transition-[height,opacity] duration-200 ${
        showChrome ? "h-[66px] overflow-visible opacity-100" : "h-0 overflow-hidden opacity-0"
      }`}
    >
      <div className="flex min-w-[240px] items-center gap-8">
        <ToolButton active={muted} icon={muted ? MicOff : Mic} label={muted ? "Unmute" : "Mute"} onClick={onToggleMute} danger={muted} />
        <ToolButton active={!cameraOn} icon={cameraOn ? Video : VideoOff} label="Video" onClick={onToggleCamera} danger={!cameraOn} />
      </div>
      <div className="flex items-center gap-7">
        <ToolButton
          active={panelMode === "participants"}
          icon={Users}
          label={`Participants${activeParticipantCount ? ` ${activeParticipantCount}` : ""}`}
          onClick={onToggleParticipants}
        />
        <ToolButton
          active={panelMode === "chat"}
          icon={MessageSquare}
          label="Chat"
          badge={unreadChatCount}
          onClick={onToggleChat}
        />
        <ToolButton icon={Smile} label="React" onClick={() => undefined} />
        <ToolButton
          active={screenSharing}
          icon={MonitorUp}
          label={screenSharing ? "Stop Share" : "Share"}
          onClick={onToggleScreenShare}
          green
        />
        <ToolButton icon={ShieldCheck} label="Host tools" onClick={() => undefined} />
        <ToolButton icon={Sparkles} label="AI Companion" onClick={() => undefined} />
        <ToolButton icon={MoreHorizontal} label="More" onClick={() => undefined} />
      </div>
      <div className="flex min-w-[160px] justify-end">
        {isHost ? (
          <div className="relative">
            {endMenuOpen ? (
              <div className="absolute right-0 bottom-[42px] z-[100] w-44 overflow-hidden rounded-md border border-white/10 bg-[#2b2b2b] py-1 text-[12px] font-medium text-white shadow-2xl">
                <button
                  type="button"
                  onClick={() => {
                    onEndMenuToggle()
                    onLeave()
                  }}
                  className="block w-full px-3 py-2 text-left hover:bg-white/10"
                >
                  Leave Meeting
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onEndMenuToggle()
                    onEndMeeting()
                  }}
                  className="block w-full px-3 py-2 text-left text-[#ff5b5b] hover:bg-white/10"
                >
                  End Meeting for All
                </button>
              </div>
            ) : null}
            <button
              type="button"
              onClick={onEndMenuToggle}
              className="flex flex-col items-center gap-0.5 text-white"
              aria-expanded={endMenuOpen}
            >
              <span className="flex size-9 items-center justify-center rounded-md border-2 border-[#ff3568] bg-[#ff3568] text-white">
                <X className="size-6" />
              </span>
              <span className="text-sm">End</span>
            </button>
          </div>
        ) : (
          <button type="button" onClick={onLeave} className="flex flex-col items-center gap-0.5 text-white">
            <span className="flex size-9 items-center justify-center rounded-md border-2 border-[#ff3568] text-[#ff3568]">
              <X className="size-6" />
            </span>
            <span className="text-sm">Leave</span>
          </button>
        )}
      </div>
    </footer>
  )
}
