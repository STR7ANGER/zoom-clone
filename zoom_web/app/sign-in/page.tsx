"use client"

import Image from "next/image"

export default function SignInPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-[#1f1f1f]">
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
        <div className="flex items-center gap-6 text-sm text-gray-700">
          <span>
            New to Zoom?{" "}
            <a href="/sign-up" className="text-[#0b5cff] font-medium hover:underline">
              Sign Up Free
            </a>
          </span>
          <a href="/support" className="text-[#0b5cff] font-medium hover:underline">
            Support
          </a>
          <button className="flex items-center gap-1 text-gray-700 hover:text-gray-900">
            English
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Main content */}
      <div className="flex min-h-screen pt-[73px]">
        {/* Left panel — banner image */}
        <div className="hidden lg:flex w-[560px] shrink-0 items-center justify-center overflow-visible border-r border-[#e9eaee] bg-[#f4f5f7] px-10 py-12">
          <Image
            src="/4e09d6bc-62d1-41a4-9b76-d90112e6759b.png"
            alt="Get the most out of Zoom"
            width={1024}
            height={740}
            className="w-[600px] max-w-none translate-x-[95px] object-cover"
            priority
          />
        </div>

        {/* Right panel */}
        <div className="flex flex-1 flex-col items-center justify-center px-8 py-14">
          <div className="w-full max-w-[420px]">
            <h1 className="mb-8 text-center text-[46px] font-bold leading-none text-[#1f1f1f]">Sign in</h1>

            {/* Email / phone field */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Email or phone number"
                className="w-full rounded-lg border border-[#cfd3da] px-4 py-3 text-base text-gray-800 placeholder-gray-400 focus:border-[#0b5cff] focus:outline-none focus:ring-2 focus:ring-[#0b5cff]/20"
              />
            </div>

            {/* Next button */}
            <button className="w-full rounded-lg bg-[#0b5cff] px-4 py-3 text-base font-medium text-white transition-colors hover:bg-[#0a52e8]">
              Next
            </button>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-sm text-gray-500">Or sign in with</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            {/* Social sign-in options */}
            <div className="flex justify-center gap-5">
              {/* SSO */}
              <button className="flex flex-col items-center gap-2 group">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm transition-colors group-hover:border-gray-300">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
                  </svg>
                </div>
                <span className="text-xs text-gray-600">SSO</span>
              </button>

              {/* Apple */}
              <button className="flex flex-col items-center gap-2 group">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm transition-colors group-hover:border-gray-300">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                </div>
                <span className="text-xs text-gray-600">Apple</span>
              </button>

              {/* Google */}
              <button className="flex flex-col items-center gap-2 group">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm transition-colors group-hover:border-gray-300">
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                </div>
                <span className="text-xs text-gray-600">Google</span>
              </button>

              {/* Facebook */}
              <button className="flex flex-col items-center gap-2 group">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm transition-colors group-hover:border-gray-300">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="#1877F2">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </div>
                <span className="text-xs text-gray-600">Facebook</span>
              </button>

              {/* Microsoft */}
              <button className="flex flex-col items-center gap-2 group">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm transition-colors group-hover:border-gray-300">
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path fill="#F25022" d="M1 1h10v10H1z" />
                    <path fill="#00A4EF" d="M13 1h10v10H13z" />
                    <path fill="#7FBA00" d="M1 13h10v10H1z" />
                    <path fill="#FFB900" d="M13 13h10v10H13z" />
                  </svg>
                </div>
                <span className="text-xs text-gray-600">Microsoft</span>
              </button>
            </div>

            {/* Forgot email */}
            <div className="mt-24 text-center">
              <a href="#" className="text-sm text-[#0b5cff] hover:underline">
                Forgot email?
              </a>
            </div>

            {/* Help & Terms */}
            <div className="mt-4 flex justify-center gap-6 text-sm">
              <a href="#" className="text-[#0b5cff] hover:underline">Help</a>
              <a href="#" className="text-[#0b5cff] hover:underline">Terms</a>
              <a href="#" className="text-[#0b5cff] hover:underline">Privacy</a>
            </div>

            {/* reCAPTCHA notice */}
            <p className="mt-6 text-center text-xs leading-relaxed text-gray-500">
              Zoom is protected by reCAPTCHA and the Google{" "}
              <a href="#" className="text-[#0b5cff] hover:underline">
                Privacy Policy
              </a>{" "}
              and{" "}
              <a href="#" className="text-[#0b5cff] hover:underline">
                Terms of Service
              </a>{" "}
              apply.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}