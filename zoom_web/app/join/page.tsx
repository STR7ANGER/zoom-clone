"use client"

import { useState } from "react"

export default function JoinPage() {
  const [meetingId, setMeetingId] = useState("")

  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-[#1f1f1f] flex flex-col">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-white px-6 py-5 border-b border-gray-100">
        <a href="/" className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://st1.zoom.us/homepage/20260413-1449/primary/dist/assets/zoommedia/logo-zoom@2x.png"
            alt="Zoom"
            className="h-9 w-auto"
          />
        </a>
        <div className="flex items-center gap-3">
          <a
            href="/support"
            className="rounded-full border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:border-gray-400 transition-colors"
          >
            Support
          </a>
          <a
            href="/sign-up"
            className="rounded-full bg-[#0b5cff] px-5 py-2 text-sm font-medium text-white hover:bg-[#0a52e8] transition-colors"
          >
            Sign Up Free
          </a>
        </div>
      </nav>

      {/* Main content */}
      <div className="flex flex-1 flex-col items-center justify-center pt-[65px] px-6 py-16">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-center text-[#1f1f1f] mb-8">Join Meeting</h1>

          {/* Label */}
          <label className="block text-sm text-gray-700 mb-2">
            Meeting ID or Personal Link Name
          </label>

          {/* Meeting ID input */}
          <input
            type="text"
            value={meetingId}
            onChange={(e) => setMeetingId(e.target.value)}
            placeholder="Enter Meeting ID or Personal Link Name"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base text-gray-800 placeholder-gray-400 focus:border-[#0b5cff] focus:outline-none focus:ring-2 focus:ring-[#0b5cff]/20 mb-3"
          />

          {/* Terms notice */}
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            By clicking &quot;Join&quot;, you agree to our{" "}
            <a href="#" className="text-[#0b5cff] hover:underline">
              Terms of Services
            </a>{" "}
            and{" "}
            <a href="#" className="text-[#0b5cff] hover:underline">
              Privacy Statement
            </a>
          </p>

          {/* Join button */}
          <button
            disabled={!meetingId.trim()}
            className={`w-full rounded-lg px-4 py-3 text-base font-medium transition-colors ${
              meetingId.trim()
                ? "bg-[#0b5cff] text-white hover:bg-[#0a52e8]"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Join
          </button>

          {/* H.323/SIP link */}
          <div className="mt-8 text-center">
            <a href="#" className="text-sm text-[#0b5cff] hover:underline">
              Join a meeting from an H.323/SIP room system
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-5 px-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between text-xs text-gray-500">
          <span>© 2026 Zoom Communications, Inc. All rights reserved.{" "}
            <a href="#" className="hover:underline">Privacy &amp; Legal Policies</a>
          </span>
          <button className="flex items-center gap-1 text-gray-600 hover:text-gray-800">
            English
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </footer>
    </main>
  )
}