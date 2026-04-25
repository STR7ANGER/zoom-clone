"use client"

import Image from "next/image"

export default function SignUpPage() {
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
            Already have an account?{" "}
            <a href="/sign-in" className="text-[#0b5cff] font-medium hover:underline">
              Sign In
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
      <div className="flex min-h-screen pt-[65px]">
        {/* Left panel */}
        <div className="hidden lg:flex w-[560px] shrink-0 flex-col items-center justify-center bg-[#f2f2f7] px-12 py-16 relative">
          {/* Illustration placeholder — envelope + person */}
          <div className="mb-10 flex items-end justify-center">
            {/* Envelope SVG */}
            <svg
              width="260"
              height="200"
              viewBox="0 0 260 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-10 top-24 opacity-90"
            >
              {/* back envelope */}
              <rect x="10" y="50" width="200" height="140" rx="8" fill="#e0e0e8" />
              {/* front envelope flap */}
              <path d="M10 58 L110 120 L210 58" stroke="#c8c8d8" strokeWidth="2" fill="none" />
              {/* second envelope behind */}
              <rect x="30" y="30" width="200" height="140" rx="8" fill="#ebebf3" />
              <path d="M30 38 L130 100 L230 38" stroke="#d5d5e5" strokeWidth="2" fill="none" />
            </svg>

            <Image
              src="/banner-step-2.BCd7FDlz.png"
              alt="Person illustration"
              width={560}
              height={379}
              className="relative z-10 ml-20 h-auto w-[280px]"
              priority
            />
          </div>

          {/* Feature card */}
          <div className="w-full max-w-sm rounded-2xl bg-white p-7 shadow-sm mt-4">
            <h2 className="text-xl font-bold text-[#1f1f1f] mb-5">
              Create your free Basic account
            </h2>
            <ul className="space-y-3">
              {[
                "Get up to 40 minutes and 100 participants per meeting",
                "Share AI docs",
                "Get 3 editable whiteboards",
                "Unlimited instant messaging",
                "Create up to 5 two-minute video messages",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-gray-700">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#27ae60]">
                    <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right panel */}
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-16">
          <div className="w-full max-w-md">
            <h1 className="text-4xl font-bold text-center text-[#1f1f1f] mb-8">Sign up</h1>

            {/* Email field */}
            <div className="mb-4">
              <input
                type="email"
                placeholder="Email address"
                className="w-full rounded-lg border border-gray-300 px-4 py-3.5 text-base text-gray-800 placeholder-gray-400 focus:border-[#0b5cff] focus:outline-none focus:ring-2 focus:ring-[#0b5cff]/20"
              />
            </div>

            {/* Continue button */}
            <button
              disabled
              className="w-full rounded-lg bg-gray-200 px-4 py-3.5 text-base font-medium text-gray-400 cursor-not-allowed"
            >
              Continue
            </button>

            {/* Terms */}
            <p className="mt-4 text-sm text-gray-600 leading-relaxed">
              By proceeding, I agree to{" "}
              <a href="#" className="text-[#0b5cff] hover:underline">
                Zoom&apos;s Privacy Statement
              </a>{" "}
              and{" "}
              <a href="#" className="text-[#0b5cff] hover:underline">
                Terms of Service
              </a>
              .
            </p>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-sm text-gray-500">Or sign up with</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            {/* Social sign-up options */}
            <div className="flex justify-center gap-6">
              {/* SSO */}
              <button className="flex flex-col items-center gap-2 group">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm group-hover:border-gray-300 transition-colors">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
                  </svg>
                </div>
                <span className="text-xs text-gray-600">SSO</span>
              </button>

              {/* Apple */}
              <button className="flex flex-col items-center gap-2 group">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm group-hover:border-gray-300 transition-colors">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                </div>
                <span className="text-xs text-gray-600">Apple</span>
              </button>

              {/* Google */}
              <button className="flex flex-col items-center gap-2 group">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm group-hover:border-gray-300 transition-colors">
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
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm group-hover:border-gray-300 transition-colors">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="#1877F2">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </div>
                <span className="text-xs text-gray-600">Facebook</span>
              </button>

              {/* Microsoft */}
              <button className="flex flex-col items-center gap-2 group">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm group-hover:border-gray-300 transition-colors">
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

            {/* reCAPTCHA notice */}
            <p className="mt-8 text-xs text-gray-500 leading-relaxed">
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