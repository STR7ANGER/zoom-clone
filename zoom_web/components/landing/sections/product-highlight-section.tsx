"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { ArrowLeft, ArrowRight } from "lucide-react"

const featureCards = [
  { title: "AI Companion", image: "/hero/AIC.jpg" },
  { title: "Clips", image: "/hero/clips.jpg" },
  { title: "Contact Center", image: "/hero/contact-center.jpg" },
  { title: "Docs", image: "/hero/docs.jpg" },
  { title: "Meetings", image: "/hero/meetings.jpg" },
  { title: "My Notes", image: "/hero/my-notes-carousel-2.webp" },
  { title: "Phone", image: "/hero/phone.jpg" },
  { title: "Virtual Agent", image: "/hero/virtual.jpg" },
  { title: "Web", image: "/hero/web.jpg" },
  { title: "Whiteboard", image: "/hero/whiteboard.jpg" },
  { title: "Zoom Rooms", image: "/hero/zoom-rooms.jpg" },
]

const CARD_GAP = 16
const ROTATE_MS = 5500

export function ProductHighlightSection() {
  const total = featureCards.length
  const [activeIndex, setActiveIndex] = useState(total)
  const [cardWidth, setCardWidth] = useState(320)
  const [isAnimating, setIsAnimating] = useState(true)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const calc = () => {
      const vw = window.innerWidth
      if (vw < 480) setCardWidth(Math.round(vw * 0.72))
      else if (vw < 768) setCardWidth(Math.round(vw * 0.46))
      else if (vw < 1024) setCardWidth(Math.round(vw * 0.3))
      else if (vw < 1280) setCardWidth(Math.round(vw * 0.22))
      else if (vw < 1536) setCardWidth(Math.round(vw * 0.19))
      else setCardWidth(Math.round(vw * 0.165))
    }
    calc()
    window.addEventListener("resize", calc)
    return () => window.removeEventListener("resize", calc)
  }, [])

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setIsAnimating(true)
      setActiveIndex((c) => c + 1)
    }, ROTATE_MS)
  }

  useEffect(() => {
    startTimer()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const navigate = (direction: -1 | 1) => {
    setIsAnimating(true)
    setActiveIndex((c) => c + direction)
    startTimer()
  }

  const step = cardWidth + CARD_GAP
  const bleed = Math.round(cardWidth * 0.12)
  const translateX = -(activeIndex * step) + bleed
  const visibleCards = [...featureCards, ...featureCards, ...featureCards]
  const realIndex = ((activeIndex % total) + total) % total

  return (
    <section className="bg-transparent py-8 sm:py-10 lg:py-12">
      <div className="w-full overflow-hidden">
        <div
          className="flex"
          style={{
            gap: `${CARD_GAP}px`,
            transform: `translateX(${translateX}px)`,
            transition: isAnimating
              ? "transform 0.52s cubic-bezier(0.4, 0, 0.2, 1)"
              : "none",
            willChange: "transform",
          }}
          onTransitionEnd={() => {
            if (activeIndex >= total * 2) {
              setIsAnimating(false)
              setActiveIndex((c) => c - total)
            } else if (activeIndex < total) {
              setIsAnimating(false)
              setActiveIndex((c) => c + total)
            }
          }}
        >
          {visibleCards.map((card, index) => (
            <div
              key={`${card.title}-${index}`}
              className="group relative shrink-0 overflow-hidden rounded-xl shadow-[0_16px_40px_rgba(8,16,60,0.22)]"
              style={{
                width: cardWidth,
                height: Math.round(cardWidth * 1.26),
                minHeight: 210,
              }}
            >
              <Image
                src={card.image}
                alt={card.title}
                fill
                className="object-contain transition duration-500 group-hover:scale-[1.025]"
                sizes={`${cardWidth * 2}px`}
                priority={index < 3}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-5 grid max-w-[1700px] grid-cols-[auto_1fr_auto] items-center gap-3 px-4 sm:mt-6 sm:gap-4 sm:px-6 lg:px-8 xl:px-10">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Previous slide"
          className="inline-flex size-9 items-center justify-center rounded-full bg-[#edf2fd] text-[#0b124b] shadow-sm transition hover:bg-[#dde7f8] active:scale-95 sm:size-10"
        >
          <ArrowLeft className="size-4" />
        </button>

        <div className="flex items-center justify-center gap-2">
          {featureCards.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setIsAnimating(true)
                setActiveIndex(total + i)
                startTimer()
              }}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === realIndex
                  ? "w-5 bg-[#0b124b]"
                  : "w-2 bg-[#c4d3ee] hover:bg-[#a4bbe0]"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => navigate(1)}
          aria-label="Next slide"
          className="inline-flex size-9 items-center justify-center rounded-full bg-[#edf2fd] text-[#0b124b] shadow-sm transition hover:bg-[#dde7f8] active:scale-95 sm:size-10"
        >
          <ArrowRight className="size-4" />
        </button>
      </div>
    </section>
  )
}
