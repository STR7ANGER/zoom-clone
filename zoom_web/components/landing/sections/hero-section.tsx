"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductHighlightSection } from "@/components/landing/sections/product-highlight-section"

/* ── Promo Bar ─────────────────────────────────────────────────────────────── */
function PromoBar({ onClose }: { onClose: () => void }) {
  return (
    <div className="w-full bg-[#10194d] px-4 py-2.5 sm:px-6">
      <div className="mx-auto flex max-w-[1500px] flex-col items-center gap-2 sm:flex-row sm:justify-between">
        <p className="text-center text-[13px] font-medium text-white/90 sm:text-left sm:text-sm">
          Join the Zoom Scale-UP Summit EMEA - grow with AI tools
        </p>
        <div className="flex shrink-0 items-center gap-3">
          <Button className="h-8 rounded-full bg-[linear-gradient(90deg,#2b66f5,#f63288)] px-5 text-[13px] font-semibold text-white hover:opacity-90 sm:h-9">
            Register now
          </Button>
          <button
            onClick={onClose}
            aria-label="Close"
            className="inline-flex size-7 items-center justify-center rounded-full text-white/60 hover:bg-white/10 hover:text-white"
          >
            <X className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Hero Section ─────────────────────────────────────────────────────────── */
export function HeroSection() {
  const [showPromo,   setShowPromo]   = useState(true)

  return (
    <section className="overflow-hidden bg-white">

      {/* ── gradient bg block ── */}
      <div className="bg-[linear-gradient(180deg,#050920_0%,#0c1d7e_38%,#1a46c8_62%,#5c83ff_80%,#ffffff_100%)]">
        {/* promo below fixed navbar (68px tall) */}
        <div className="pt-[68px]">
          {showPromo && <PromoBar onClose={() => setShowPromo(false)} />}
        </div>

        {/* hero copy */}
        <div className="mx-auto max-w-[1200px] px-4 pb-32 pt-10 text-center sm:pb-36 sm:pt-12 lg:pb-44 lg:pt-16">
          <h1 className="mx-auto max-w-[1060px] text-[2.5rem] font-semibold leading-[1] tracking-tight text-white sm:text-5xl lg:text-[88px] lg:leading-[0.93]">
            Find out what&apos;s possible when work connects
          </h1>
          <p className="mx-auto mt-5 max-w-[740px] text-[15px] leading-relaxed text-white/85 sm:text-lg lg:mt-7 lg:text-[21px] lg:leading-[1.6]">
            Whether you&apos;re chatting with teammates or supporting customers, Zoom makes it
            easier to connect, collaborate, and reach goals — all with built-in AI doing the
            heavy lifting.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:mt-9 sm:flex-row sm:gap-4">
            <Button className="h-12 w-full rounded-[14px] bg-[#09115c] px-8 text-[15px] font-semibold text-white hover:bg-[#060e4d] sm:h-13 sm:w-auto sm:rounded-[18px] sm:px-10 sm:text-base lg:h-14 lg:text-[17px]">
              Explore products
            </Button>
            <Button
              variant="outline"
              className="h-12 w-full rounded-[14px] border-[#c0d5ff] bg-white/90 px-8 text-[15px] font-semibold text-[#0b124b] hover:bg-white sm:h-13 sm:w-auto sm:rounded-[18px] sm:px-10 sm:text-base lg:h-14 lg:text-[17px]"
            >
              Find your plan
            </Button>
          </div>
        </div>
      </div>

      <div className="-mt-24 sm:-mt-28 lg:-mt-32">
        <ProductHighlightSection />
      </div>
    </section>
  )
}