"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { ArrowLeft, ArrowRight } from "lucide-react"

const featureCards = [
  {
    image: "/hero/AIC.jpg",
  },
  {
    image: "/hero/clips.jpg",
  },
  {
    image: "/hero/contact-center.jpg",
  },
  {
    image: "/hero/docs.jpg",
  },
  {
    image: "/hero/meetings.jpg",
  },
  {
    image: "/hero/my-notes-carousel-2.webp",
  },
  {
    image: "/hero/phone.jpg",
  },
  {
    image: "/hero/virtual.jpg",
  },
  {
    image: "/hero/web.jpg",
  },
  {
    image: "/hero/whiteboard.jpg",
  },
  {
    image: "/hero/zoom-rooms.jpg",
  },
]

const CARD_GAP = 16
const ROTATE_MS = 5500

export function ProductHighlightSection() {
  const total = featureCards.length
  const [activeIndex, setActiveIndex] = useState(total)
  const [cardWidth, setCardWidth] = useState(320)
  const [isAnimating, setIsAnimating] = useState(true)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
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
      <div className="w-full overflow-hidden py-3">
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
          {visibleCards.map((card, index) => {
            const isHovered = hoveredIndex === index

            return (
              <div
                key={`${card.image}-${index}`}
                className="group relative shrink-0 overflow-hidden rounded-2xl"
                style={{
                  width: cardWidth,
                  height: Math.round(cardWidth * 1.32),
                  minHeight: 210,
                  transform: isHovered ? "translateY(-10px)" : "translateY(0)",
                  transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                  cursor: "pointer",
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Background image */}
                <Image
                  src={card.image}
                  alt="Feature card"
                  fill
                  className="object-cover"
                  sizes={`${cardWidth * 2}px`}
                  priority={index < 3}
                />
              </div>
            )
          })}
        </div>
      </div>

      {/* Navigation controls */}
      <div className="mx-auto mt-6 grid max-w-[1700px] grid-cols-[auto_1fr_auto] items-center gap-3 px-4 sm:mt-7 sm:gap-4 sm:px-6 lg:px-8 xl:px-10">
        {/* Prev */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Previous slide"
          className="inline-flex size-9 items-center justify-center rounded-full bg-white text-[#0b124b] shadow-md transition hover:bg-[#f0f4ff] active:scale-95 sm:size-10"
          style={{ border: "1.5px solid #e2eaf8" }}
        >
          <ArrowLeft className="size-4" />
        </button>

        {/* Dots */}
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
              className="rounded-full transition-all duration-300"
              style={{
                height: "8px",
                width: i === realIndex ? "22px" : "8px",
                background: i === realIndex ? "#0b124b" : "#c4d3ee",
              }}
            />
          ))}
        </div>

        {/* Next */}
        <button
          type="button"
          onClick={() => navigate(1)}
          aria-label="Next slide"
          className="inline-flex size-9 items-center justify-center rounded-full bg-white text-[#0b124b] shadow-md transition hover:bg-[#f0f4ff] active:scale-95 sm:size-10"
          style={{ border: "1.5px solid #e2eaf8" }}
        >
          <ArrowRight className="size-4" />
        </button>
      </div>
    </section>
  )
}
