"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductHighlightSection } from "@/components/landing/sections/product-highlight-section"

/* ── Promo Bar ─────────────────────────────────────────────────────────────── */
function PromoBar({ onClose }: { onClose: () => void }) {
  return (
    <div className="w-full px-4 py-2.5 sm:px-6">
      <div
        className="relative mx-auto flex max-w-[1500px] items-center justify-center rounded-md px-9 py-2 sm:px-12 sm:py-2.5"
        style={{
          background:
            "linear-gradient(180deg, rgba(107,114,128,0.45) 0%, rgba(75,85,99,0.4) 100%)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.12), 0 1px 4px rgba(15,23,42,0.16)",
        }}
      >
        <div className="flex min-w-0 flex-col items-center gap-2 text-center min-[420px]:flex-row min-[420px]:gap-2.5 sm:gap-3.5">
          <p className="text-[11.5px] leading-snug font-medium text-balance text-white/90 sm:text-[12.5px]">
            Join the Zoom Scale-UP Summit EMEA - grow with AI tools
          </p>
          <button
            type="button"
            className="inline-flex h-[22px] items-center rounded-md px-3 text-[11.5px] font-semibold text-white transition hover:opacity-90 sm:h-[24px] sm:px-3.5"
            style={{
              background: "linear-gradient(90deg, #5b7dff 0%, #f3419d 100%)",
            }}
          >
            Register now
          </button>
        </div>

        {/* Close — absolute right */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-2.5 inline-flex size-5.5 items-center justify-center rounded-full text-white/55 transition hover:text-white/85"
        >
          <X className="size-3.5" />
        </button>
      </div>
    </div>
  )
}

/* ── Hero Section ─────────────────────────────────────────────────────────── */
export function HeroSection() {
  const [showPromo, setShowPromo] = useState(true)

  return (
    <section className="overflow-hidden bg-white">
      {/* gradient bg block */}
      <div
        className="bg-[linear-gradient(180deg,#050920_0%,#0c1d7e_38%,#1a46c8_62%,#5c83ff_80%,#ffffff_100%)]"
      >
        {/* Spacer for fixed navbar */}
        <div className="pt-[66px]">
          {showPromo && <PromoBar onClose={() => setShowPromo(false)} />}
        </div>

        {/* Hero copy */}
        <div className="mx-auto max-w-[1120px] px-4 pt-8 pb-24 text-center sm:pt-12 sm:pb-32 lg:pt-14 lg:pb-36">
          <h1
            className="mx-auto max-w-[880px] font-semibold tracking-tight text-white"
            style={{
              fontSize: "clamp(2rem, 5vw, 4.5rem)",
              lineHeight: 1.02,
            }}
          >
            Find out what&apos;s possible when work connects
          </h1>
          <p
            className="mx-auto mt-4 max-w-[620px] text-white/85 lg:mt-6"
            style={{
              fontSize: "clamp(14px, 1.2vw, 18px)",
              lineHeight: 1.6,
            }}
          >
            Whether you&apos;re chatting with teammates or supporting customers,
            Zoom makes it easier to connect, collaborate, and reach goals — all
            with built-in AI doing the heavy lifting.
          </p>

          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:mt-8 sm:flex-row">
            <Button
              className="h-11 w-full rounded-xl px-8 text-[14px] font-semibold text-white hover:opacity-90 sm:w-auto sm:text-[15px] lg:h-12 lg:text-[16px]"
              style={{ background: "#09115c", border: "none" }}
            >
              Explore products
            </Button>
            <Button
              className="h-11 w-full rounded-xl bg-white px-8 text-[14px] font-semibold text-[#0b124b] sm:w-auto sm:text-[15px] lg:h-12 lg:text-[16px]"
            >
              Find your plan
            </Button>
          </div>
        </div>
      </div>

      {/* Carousel overlaps the gradient bottom */}
      <div className="-mt-16 sm:-mt-24 lg:-mt-28">
        <ProductHighlightSection />
      </div>
    </section>
  )
}
