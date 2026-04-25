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

function CookieConsentModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/15 px-3 py-4">
      <div className="flex max-h-[calc(100vh-24px)] w-full max-w-[520px] flex-col overflow-hidden rounded-[2px] border border-[#b7b7b7] bg-white font-sans text-[#555] shadow-[0_18px_48px_rgba(0,0,0,0.28)]">
        <div className="flex h-[55px] items-center justify-between border-b border-[#e3e3e3] px-[27px]">
          <div className="text-[41px] leading-none font-bold tracking-[-0.08em] text-[#0b5cff]">
            zoom
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close privacy preferences"
            className="inline-flex size-8 items-center justify-center text-[#555] hover:text-[#111]"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="overflow-y-auto px-[27px] pt-3 pb-2 text-[12.5px] leading-[1.42]">
          <h2 className="text-[16px] font-bold text-[#646464]">
            Privacy Preference Center
          </h2>
          <p className="mt-3">
            Cookies and other similar technologies (&quot;Cookies&quot;) are
            important to the proper functioning of a site and to provide visitors
            with a seamless and customized experience. Zoom uses Cookies to
            enable you to use our site. We also use cookies to enable you to
            personalize your use of our site, to provide you enhanced
            functionality and to continually improve the performance of our site.
            If you have Targeting cookies enabled below and depending on your
            account type or login state, we may allow third-party advertisers to
            show you advertising relevant to you on our website or products, using
            their Cookies on our site.
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
            For California Residents, you may exercise your right to &quot;Opt-Out
            of the Sale/Sharing of Personal Information&quot; by toggling the
            button labeled &quot;Targeting&quot; below to off.{" "}
            <a href="#" className="text-[#1d4ed8] underline">
              More information
            </a>
          </p>

          <h3 className="mt-6 text-[16px] font-bold text-[#646464]">
            Manage Consent Preferences
          </h3>
          <div className="mt-4 border border-[#d7d7d7]">
            {consentRows.map((row) => (
              <div
                key={row.label}
                className="flex min-h-[47px] items-center justify-between border-b border-[#d7d7d7] px-3 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-5 items-center justify-center text-[20px] leading-none text-[#163b5d]">
                    +
                  </span>
                  <span className="text-[13px] font-bold text-[#626262]">
                    {row.label}
                  </span>
                </div>
                {"status" in row ? (
                  <span className="text-[12px] font-bold text-[#2b61d1]">
                    {row.status}
                  </span>
                ) : (
                  <span className="relative h-[21px] w-[38px] rounded-full bg-[#458b58]">
                    <span className="absolute top-0.5 right-0.5 size-[17px] rounded-full bg-white shadow-sm" />
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-[#d7d7d7] bg-white px-[27px] pt-[18px] pb-4">
          <button className="h-[35px] w-full rounded-[2px] bg-[#1f73e8] text-[11px] font-bold tracking-[0.08em] text-white hover:bg-[#1765d3]">
            Reject All
          </button>
          <button className="mt-[18px] h-[39px] w-full rounded-[2px] bg-[#1f73e8] text-[11px] font-bold tracking-[0.22em] text-white hover:bg-[#1765d3]">
            CONFIRM MY CHOICES
          </button>
          <div className="mt-3 flex justify-end text-[10px] text-[#333]">
            Powered by{" "}
            <span className="ml-1 inline-flex items-center gap-1 font-bold">
              <span className="inline-block size-3 rounded-full border-[3px] border-black" />
              OneTrust
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function VirtualAgentPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed right-4 bottom-[88px] z-[80] h-[585px] w-[386px] overflow-hidden rounded-[9px] bg-white shadow-[0_20px_55px_rgba(15,23,42,0.28)] max-[430px]:right-3 max-[430px]:left-3 max-[430px]:w-auto">
      <div className="flex h-[79px] items-center justify-between bg-[linear-gradient(135deg,#1164ff_0%,#bf67d7_100%)] px-[30px] text-white">
        <div className="flex items-end gap-2">
          <span className="text-[30px] leading-none font-bold tracking-[-0.08em]">
            zoom
          </span>
          <span className="text-[26px] leading-none font-semibold tracking-[-0.03em]">
            Virtual Agent
          </span>
        </div>
        <div className="flex items-center gap-3">
          <MoreHorizontal className="size-5" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close virtual agent"
            className="inline-flex size-6 items-center justify-center"
          >
            <X className="size-5" />
          </button>
        </div>
      </div>

      <div className="flex h-[506px] flex-col bg-white">
        <div className="flex-1 px-[14px] pt-5">
          <div className="ml-[45px] flex items-center gap-2 text-[10px] font-semibold text-[#111827]">
            <span>ZVA</span>
            <span className="rounded-[2px] bg-[#e6e9ee] px-1 py-0.5 text-[8px] text-[#606975]">
              BOT
            </span>
            <span className="font-normal text-[#6f7480]">3:06 AM</span>
          </div>
          <div className="mt-1 flex items-start gap-2">
            <div className="mt-1 flex size-[37px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-[linear-gradient(140deg,#2b7cff,#ffc2a8)] text-[13px] font-bold text-white">
              Z
            </div>
            <div>
              <div className="rounded-[11px] bg-[#f5f6fb] px-3 py-2 text-[13px] text-[#111827]">
                Hi there! I&apos;m Zoom&apos;s Virtual Agent.
              </div>
              <div className="mt-2 inline-block rounded-[11px] bg-[#f5f6fb] px-3 py-2 text-[13px] text-[#111827]">
                How can I help?
              </div>
              <div className="mt-2 flex max-w-[285px] flex-wrap gap-7 gap-y-[7px]">
                {quickReplies.map((reply) => (
                  <button
                    key={reply}
                    type="button"
                    className="h-[29px] rounded-full border border-[#2878ff] px-[14px] text-[12.5px] font-bold whitespace-nowrap text-[#2878ff]"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="px-[14px] pb-[14px]">
          <div className="h-[77px] rounded-[15px] border border-[#d9dde7] px-[14px] pt-[11px]">
            <div className="text-[13px] text-[#777]">Write a message</div>
            <div className="mt-[22px] flex items-center justify-between">
              <div className="flex items-center gap-4 text-[#4d5561]">
                <Paperclip className="size-4" />
                <Smile className="size-4" />
              </div>
              <button
                type="button"
                aria-label="Send message"
                className="inline-flex size-[23px] items-center justify-center rounded-full bg-[#f0f2f5] text-[#c7cbd3]"
              >
                <ArrowUp className="size-3.5" />
              </button>
            </div>
          </div>
          <p className="mt-[10px] text-center text-[10.5px] text-[#6d6d6d]">
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

      <button
        type="button"
        onClick={() => setShowVirtualAgent((open) => !open)}
        aria-label="Open Zoom Virtual Agent"
        className="fixed right-4 bottom-4 z-[70] flex size-[50px] items-center justify-center rounded-full bg-[#3c7cff] text-white shadow-[0_8px_20px_rgba(38,110,255,0.38)]"
      >
        <MessageCircle className="size-[25px] fill-white stroke-white" />
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
