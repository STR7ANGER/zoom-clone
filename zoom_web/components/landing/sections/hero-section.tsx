"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductHighlightSection } from "@/components/landing/sections/product-highlight-section"

/* ── Promo Bar ─────────────────────────────────────────────────────────────── */
function PromoBar({ onClose }: { onClose: () => void }) {
  return (
    <div className="w-full bg-[#10194d] px-4 py-2 sm:px-6">
      <div className="mx-auto flex max-w-[1500px] flex-col items-center gap-2 sm:flex-row sm:justify-between">
        <p className="text-center text-[12px] font-medium text-white/90 sm:text-left sm:text-[13px]">
          Join the Zoom Scale-UP Summit EMEA - grow with AI tools
        </p>
        <div className="flex shrink-0 items-center gap-3">
          <Button className="h-7 rounded-full bg-[linear-gradient(90deg,#2b66f5,#f63288)] px-4 text-[12px] font-semibold text-white hover:opacity-90 sm:h-8">
            Register now
          </Button>
          <button
            onClick={onClose}
            aria-label="Close"
            className="inline-flex size-6 items-center justify-center rounded-full text-white/60 hover:bg-white/10 hover:text-white"
          >
            <X className="size-3" />
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Hero Section ─────────────────────────────────────────────────────────── */
export function HeroSection() {
  const [showPromo, setShowPromo] = useState(true)

  return (
    <section className="overflow-hidden bg-white">
      {/* ── gradient bg block ── */}
      <div className="bg-[linear-gradient(180deg,#050920_0%,#0c1d7e_38%,#1a46c8_62%,#5c83ff_80%,#ffffff_100%)]">
        {/* promo below fixed navbar (68px tall) */}
        <div className="pt-[60px]">
          {showPromo && <PromoBar onClose={() => setShowPromo(false)} />}
        </div>

        {/* hero copy */}
        <div className="mx-auto max-w-[1120px] px-4 pt-8 pb-24 text-center sm:pt-10 sm:pb-28 lg:pt-12 lg:pb-32">
          <h1 className="mx-auto max-w-[920px] text-[2.15rem] leading-[1.02] font-semibold tracking-tight text-white sm:text-[3.25rem] lg:text-[72px] lg:leading-[0.95]">
            Find out what&apos;s possible when work connects
          </h1>
          <p className="mx-auto mt-4 max-w-[660px] text-[14px] leading-relaxed text-white/85 sm:text-[16px] lg:mt-6 lg:text-[18px] lg:leading-[1.55]">
            Whether you&apos;re chatting with teammates or supporting customers,
            Zoom makes it easier to connect, collaborate, and reach goals — all
            with built-in AI doing the heavy lifting.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:mt-8 sm:flex-row sm:gap-3">
            <Button className="h-10 w-full rounded-xl bg-[#09115c] px-7 text-[14px] font-semibold text-white hover:bg-[#060e4d] sm:h-11 sm:w-auto sm:px-8 sm:text-[15px] lg:h-12 lg:text-[16px]">
              Explore products
            </Button>
            <Button
              variant="outline"
              className="h-10 w-full rounded-xl border-[#c0d5ff] bg-white/90 px-7 text-[14px] font-semibold text-[#0b124b] hover:bg-white sm:h-11 sm:w-auto sm:px-8 sm:text-[15px] lg:h-12 lg:text-[16px]"
            >
              Find your plan
            </Button>
          </div>
        </div>
      </div>

      <div className="-mt-16 sm:-mt-20 lg:-mt-24">
        <ProductHighlightSection />
      </div>
    </section>
  )
}
