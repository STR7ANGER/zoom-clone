"use client"

import { useState } from "react"
import {
  ArrowUp,
  Cookie,
  MessageCircle,
  MoreHorizontal,
  Paperclip,
  Smile,
  X,
} from "lucide-react"

const consentRows = [
  { label: "Strictly Necessary Cookies", status: "Always Active" },
  { label: "Performance Cookies", enabled: true },
  { label: "Functional Cookies", enabled: true },
  { label: "Targeting Cookies", enabled: true },
]

const quickReplies = [
  "Upgrade to Pro",
  "Join a Meeting",
  "I can't find my Meetings",
  "What Zoom plan is right for me?",
  "I'm interested in a Zoom Phone plan",
  "Ask a question",
]

/* Proper pill toggle matching screenshot */
function Toggle({ on }: { on: boolean }) {
  return (
    <span
      className={`relative inline-flex h-[28px] w-[50px] shrink-0 items-center rounded-full transition-colors ${
        on ? "bg-[#3eb56a]" : "bg-[#ccc]"
      }`}
    >
      <span
        className={`absolute size-[22px] rounded-full bg-white shadow-sm transition-transform ${
          on ? "translate-x-[24px]" : "translate-x-[3px]"
        }`}
      />
    </span>
  )
}

function CookieConsentModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/20 px-3 py-4">
      <div className="flex max-h-[calc(100vh-24px)] w-full max-w-[520px] flex-col overflow-hidden rounded-[4px] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.32)]">
        {/* Header */}
        <div className="flex h-[60px] shrink-0 items-center justify-between px-6">
          <img
            src="https://st1.zoom.us/homepage/20260413-1449/primary/dist/assets/zoommedia/logo-zoom@2x.png"
            alt="Zoom"
            className="h-[28px] w-auto object-contain"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close privacy preferences"
            className="inline-flex size-8 items-center justify-center text-[#555] hover:text-[#111]"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Divider */}
        <div className="h-px shrink-0 bg-[#e3e3e3]" />

        {/* Scrollable body */}
        <div className="overflow-y-auto px-6 pt-5 pb-3 text-[13px] leading-[1.5] text-[#444]">
          <h2 className="text-[17px] font-bold text-[#222]">
            Privacy Preference Center
          </h2>
          <p className="mt-3">
            Cookies and other similar technologies (&quot;Cookies&quot;) are important to
            the proper functioning of a site and to provide visitors with a
            seamless and customized experience. Zoom uses Cookies to enable you
            to use our site. We also use cookies to enable you to personalize
            your use of our site, to provide you enhanced functionality and to
            continually improve the performance of our site. If you have
            Targeting cookies enabled below and depending on your account type or
            login state, we may allow third-party advertisers to show you
            advertising relevant to you on our website or products, using their
            Cookies on our site.
          </p>
          <p className="mt-4">
            You can accept or decline all but Strictly Necessary Cookies, or
            customize your cookie settings below. You can change your cookie
            settings at any time. Some Strictly Necessary Cookies may transfer
            personal data to the United States. To learn more about how Zoom
            processes personal data, please visit our{" "}
            <a href="#" className="text-[#1d4ed8] underline">
              privacy statement
            </a>
            .
          </p>
          <p className="mt-4">
            For California Residents, you may exercise your right to &quot;Opt-Out of
            the Sale/Sharing of Personal Information&quot; by toggling the button
            labeled &quot;Targeting&quot; below to off.{" "}
            <a href="#" className="text-[#1d4ed8] underline">
              More information
            </a>
          </p>

          <h3 className="mt-6 text-[17px] font-bold text-[#222]">
            Manage Consent Preferences
          </h3>

          <div className="mt-4 rounded-[2px] border border-[#d0d0d0]">
            {consentRows.map((row, i) => (
              <div
                key={row.label}
                className={`flex min-h-[52px] items-center justify-between px-4 ${
                  i < consentRows.length - 1 ? "border-b border-[#d0d0d0]" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-5 shrink-0 items-center justify-center text-[18px] leading-none font-bold text-[#163b5d]">
                    +
                  </span>
                  <span className="text-[13px] font-bold text-[#333]">
                    {row.label}
                  </span>
                </div>
                {"status" in row ? (
                  <span className="shrink-0 text-[12.5px] font-bold text-[#2b61d1]">
                    {row.status}
                  </span>
                ) : (
                  <Toggle on={row.enabled ?? false} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer buttons */}
        <div className="shrink-0 border-t border-[#d7d7d7] px-6 pt-5 pb-4">
          <button
            type="button"
            className="h-[42px] w-full rounded-[4px] bg-[#2467f4] text-[13px] font-semibold text-white hover:bg-[#1a57e0] transition-colors"
          >
            Reject All
          </button>
          <button
            type="button"
            className="mt-3 h-[42px] w-full rounded-[4px] bg-[#2467f4] text-[11px] font-bold tracking-[0.18em] text-white hover:bg-[#1a57e0] transition-colors uppercase"
          >
            Confirm My Choices
          </button>
          <div className="mt-3 flex items-center justify-end gap-1 text-[10.5px] text-[#444]">
            <span>Powered by</span>
            <span className="flex items-center gap-1 font-bold text-[#111]">
              {/* OneTrust logo mark */}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" stroke="#111" strokeWidth="2.2" />
                <path d="M7 3v4l2.5 2" stroke="#111" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              OneTrust
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* Woman avatar SVG — matching the purple/pink illustrated avatar in screenshot */
function AgentAvatar() {
  return (
    <div className="mt-1 size-[37px] shrink-0 overflow-hidden rounded-full bg-[linear-gradient(140deg,#a78bfa,#f9a8d4)]">
      <svg viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-full">
        {/* Background */}
        <rect width="37" height="37" fill="url(#avatarGrad)" />
        <defs>
          <linearGradient id="avatarGrad" x1="0" y1="0" x2="37" y2="37" gradientUnits="userSpaceOnUse">
            <stop stopColor="#a78bfa" />
            <stop offset="1" stopColor="#f9a8d4" />
          </linearGradient>
        </defs>
        {/* Hair */}
        <ellipse cx="18.5" cy="10" rx="8" ry="8" fill="#4c1d95" />
        <ellipse cx="18.5" cy="8" rx="6" ry="6" fill="#5b21b6" />
        {/* Face */}
        <ellipse cx="18.5" cy="17" rx="6.5" ry="7" fill="#fde8d0" />
        {/* Hair sides */}
        <ellipse cx="12.5" cy="16" rx="2.5" ry="5" fill="#5b21b6" />
        <ellipse cx="24.5" cy="16" rx="2.5" ry="5" fill="#5b21b6" />
        {/* Eyes */}
        <ellipse cx="16" cy="16.5" rx="1" ry="1.1" fill="#3b1a08" />
        <ellipse cx="21" cy="16.5" rx="1" ry="1.1" fill="#3b1a08" />
        {/* Smile */}
        <path d="M16.2 20c.6.9 4 .9 4.6 0" stroke="#c47d5a" strokeWidth="0.9" strokeLinecap="round" fill="none" />
        {/* Shoulders / shirt */}
        <ellipse cx="18.5" cy="34" rx="10" ry="7" fill="#7c3aed" />
      </svg>
    </div>
  )
}

function VirtualAgentPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed right-4 bottom-[76px] z-[80] flex h-[590px] w-[390px] flex-col overflow-hidden rounded-[12px] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.30)] max-[430px]:right-3 max-[430px]:left-3 max-[430px]:w-auto">
      {/* Header */}
      <div className="flex h-[72px] shrink-0 items-center justify-between bg-[linear-gradient(135deg,#1164ff_0%,#c56de0_100%)] px-7 text-white">
        <div className="flex items-center gap-2">
          <img
            src="https://st1.zoom.us/homepage/20260413-1449/primary/dist/assets/zoommedia/logo-zoom-white@2x.png"
            alt="Zoom"
            className="h-[22px] w-auto object-contain"
          />
          <span className="text-[22px] font-semibold leading-none tracking-[-0.02em]">
            Virtual Agent
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" aria-label="More options" className="text-white/80 hover:text-white">
            <MoreHorizontal className="size-5" />
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close virtual agent"
            className="text-white/80 hover:text-white"
          >
            <X className="size-5" />
          </button>
        </div>
      </div>

      {/* Chat body */}
      <div className="flex flex-1 flex-col overflow-hidden bg-white">
        <div className="flex-1 overflow-y-auto px-4 pt-5 pb-2">
          {/* Sender meta */}
          <div className="mb-1 flex items-center gap-2 pl-[45px] text-[10.5px] font-semibold text-[#111827]">
            <span className="font-bold tracking-wide">ZVA</span>
            <span className="rounded-[3px] bg-[#e6e9ee] px-[5px] py-[2px] text-[8px] font-semibold text-[#606975]">
              BOT
            </span>
            <span className="font-normal text-[#6f7480]">3:06 AM</span>
          </div>

          {/* Message row */}
          <div className="flex items-start gap-2">
            <AgentAvatar />
            <div className="flex flex-col gap-2">
              <div className="rounded-[14px] rounded-tl-[4px] bg-[#f2f3f8] px-4 py-2.5 text-[13.5px] text-[#111827]">
                Hi there! I&apos;m Zoom&apos;s Virtual Agent.
              </div>
              <div className="inline-block self-start rounded-[14px] rounded-tl-[4px] bg-[#f2f3f8] px-4 py-2.5 text-[13.5px] text-[#111827]">
                How can I help?
              </div>

              {/* Quick reply chips — wrap naturally */}
              <div className="mt-1 flex flex-wrap gap-x-2 gap-y-2">
                {quickReplies.map((reply) => (
                  <button
                    key={reply}
                    type="button"
                    className="h-[32px] rounded-full border border-[#2467f4] px-4 text-[12.5px] font-semibold text-[#2467f4] hover:bg-[#eef3ff] transition-colors whitespace-nowrap"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Input area */}
        <div className="shrink-0 px-4 pb-4">
          <div className="rounded-[14px] border border-[#d9dde7] bg-white px-4 pt-3 pb-3">
            <div className="text-[13px] text-[#aaa]">Write a message</div>
            <div className="mt-5 flex items-center justify-between">
              <div className="flex items-center gap-4 text-[#5a6070]">
                <Paperclip className="size-[18px]" />
                <Smile className="size-[18px]" />
              </div>
              <button
                type="button"
                aria-label="Send message"
                className="inline-flex size-[26px] items-center justify-center rounded-full border border-[#d0d4de] bg-[#f2f3f8] text-[#c0c5d0]"
              >
                <ArrowUp className="size-3.5" />
              </button>
            </div>
          </div>
          <p className="mt-2 text-center text-[10.5px] text-[#888]">
            Zoom may retain transcripts for training purposes
          </p>
        </div>
      </div>
    </div>
  )
}

export function LandingFloatingWidgets() {
  const [showCookieModal, setShowCookieModal] = useState(false)
  const [showVirtualAgent, setShowVirtualAgent] = useState(false)

  return (
    <>
      {/* Cookie settings button — bottom left */}
      <div className="fixed bottom-4 left-4 z-[70]">
        <button
          type="button"
          onClick={() => setShowCookieModal(true)}
          aria-label="Cookie settings"
          className="group relative flex size-[54px] items-center justify-center rounded-full border-[3px] border-white bg-[#6cc44f] text-white shadow-[0_4px_16px_rgba(0,0,0,0.22)]"
        >
          <Cookie className="size-7" />
          <span className="pointer-events-none absolute left-[62px] top-1/2 -translate-y-1/2 translate-x-2 rounded-md bg-[#1f2937] px-3 py-1.5 text-[12px] font-semibold whitespace-nowrap text-white opacity-0 shadow-lg transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
            Cookie Settings
          </span>
        </button>
      </div>

      {/* Virtual agent toggle button — bottom right */}
      <button
        type="button"
        onClick={() => setShowVirtualAgent((open) => !open)}
        aria-label="Open Zoom Virtual Agent"
        className="fixed right-4 bottom-4 z-[70] flex size-[52px] items-center justify-center rounded-full bg-[#2467f4] text-white shadow-[0_8px_24px_rgba(36,103,244,0.42)]"
      >
        <MessageCircle className="size-[26px] fill-white stroke-white" />
      </button>

      {showCookieModal ? (
        <CookieConsentModal onClose={() => setShowCookieModal(false)} />
      ) : null}

      {showVirtualAgent ? (
        <VirtualAgentPanel onClose={() => setShowVirtualAgent(false)} />
      ) : null}
    </>
  )
}