"use client"

import { useState } from "react"
import Image from "next/image"
import { Pause, Play } from "lucide-react"

const logos = [
  { name: "Werner", image: "/trust/wn.jpg" },
  { name: "Moffitt", image: "/trust/mf.jpg" },
  { name: "ExxonMobil", image: "/trust/exm.jpg" },
  { name: "Capital One", image: "/trust/co.jpg" },
  { name: "The New York Times", image: "/trust/nt.jpg" },
  { name: "Walmart", image: "/trust/wm.jpg" },
]

const ratings = [
  {
    score: "4.5/5",
    stars: 4,
    reviews: "out of 7.9k+ reviews",
    platform: "Gartner Peer Insights",
    logo: "/trust/gartner-logo.svg",
    logoWidth: 98,
    logoHeight: 31,
  },
  {
    score: "4.6/5",
    stars: 4,
    reviews: "out of 54.9k+ reviews",
    platform: "G2",
    logo: "/trust/g2-logo.svg",
    logoWidth: 23,
    logoHeight: 25,
  },
  {
    score: "8.5/10",
    stars: 4,
    reviews: "out of 5.8k+ reviews",
    platform: "TrustRadius",
    logo: "/trust/tr-logo.svg",
    logoWidth: 121,
    logoHeight: 23,
  },
]

function Stars({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`size-5 ${i < count ? "text-[#0b124b]" : "text-[#0b124b]/25"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

// Duplicate logos for seamless loop
const marqueeLogos = [...logos, ...logos, ...logos]

export function TrustSection() {
  const [isMarqueeHovered, setIsMarqueeHovered] = useState(false)

  return (
    <section className="bg-white py-14">
      {/* Heading */}
      <div className="text-center">
        <h2 className="text-lg font-semibold tracking-[-0.01em] text-[#0b124b]">
          Trusted by millions. Built for you.
        </h2>
      </div>

      {/* Marquee row */}
      <div className="mt-8">
        <div
          className="relative flex items-center overflow-hidden"
          onMouseEnter={() => setIsMarqueeHovered(true)}
          onMouseLeave={() => setIsMarqueeHovered(false)}
        >
          {/* Left fade */}
          <div className="pointer-events-none absolute left-0 z-10 h-full w-32 bg-gradient-to-r from-white to-transparent" />
          {/* Right fade */}
          <div className="pointer-events-none absolute right-0 z-10 h-full w-32 bg-gradient-to-l from-white to-transparent" />

          {/* Scrolling track */}
          <div
            className="flex min-w-full"
            style={{
              animation: "marquee 28s linear infinite",
              animationPlayState: isMarqueeHovered ? "paused" : "running",
            }}
          >
            {marqueeLogos.map((logo, i) => (
              <div
                key={`${logo.image}-${i}`}
                className="mx-8 flex h-16 w-40 shrink-0 items-center justify-center sm:mx-10 sm:h-[76px] sm:w-[180px]"
              >
                <Image
                  src={logo.image}
                  alt={logo.name}
                  width={320}
                  height={152}
                  className="h-full w-full object-contain"
                  sizes="180px"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Pause / Play indicator */}
        <div className="mx-auto mt-3 flex max-w-[1700px] justify-end px-4 sm:px-6 lg:px-8 xl:px-10">
          <button
            type="button"
            aria-label={isMarqueeHovered ? "Marquee paused" : "Marquee playing"}
            disabled
            className="flex size-8 cursor-default items-center justify-center text-[#2467f4]"
          >
            {isMarqueeHovered ? (
              <Play className="size-5 fill-[#2467f4]" />
            ) : (
              <Pause className="size-5 fill-[#2467f4]" />
            )}
          </button>
        </div>
      </div>

      {/* Keyframe animation */}
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.333%); }
        }
      `}</style>

      {/* Ratings row */}
      <div className="mx-auto mt-16 flex max-w-[860px] items-start justify-center divide-x divide-black/10">
        {ratings.map((r) => (
          <div key={r.score} className="flex flex-1 flex-col items-center px-10 text-center">
            <span className="text-4xl font-semibold tracking-tight text-[#0b124b]">
              {r.score}
            </span>
            <div className="mt-2">
              <Stars count={r.stars} />
            </div>
            <p className="mt-1 text-[11px] text-black/45">{r.reviews}</p>
            <Image
              src={r.logo}
              alt={r.platform}
              width={r.logoWidth}
              height={r.logoHeight}
              className="mt-3 h-8 max-w-[140px] object-contain"
            />
          </div>
        ))}
      </div>

      {/* Testimonial */}
      <div className="mx-auto mt-20 max-w-[860px] px-6 text-center">
        <blockquote className="text-2xl font-semibold leading-[1.35] tracking-[-0.02em] text-[#0b124b] lg:text-[32px]">
          &quot;Zoom Workplace turns my brainwaves into polished gems. From meetings, I can
          create Clips, Notes, Docs, or even whiteboards faster than you can say,
          &lsquo;transcript.&rsquo;&quot;
        </blockquote>
        <div className="mt-6">
          <p className="text-sm font-medium text-black/70">Marquesa Pettway</p>
          <p className="text-sm text-black/45">Founder</p>
        </div>
      </div>
    </section>
  )
}
