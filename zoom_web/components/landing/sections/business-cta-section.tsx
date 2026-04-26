import { Button } from "@/components/ui/button"

export function BusinessCtaSection() {
  return (
    <section className="bg-white pt-12 sm:pt-16">
      <div className="mx-auto max-w-[1280px] px-4 pb-14 text-center sm:px-6 lg:px-10">
        <h2 className="mx-auto max-w-[900px] text-[2.05rem] leading-[1] font-semibold tracking-[-0.04em] text-[#0b124b] sm:text-[2.7rem] lg:text-[60px]">
          See what Zoom can do for your business
        </h2>
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button className="h-11 w-full rounded-xl bg-[#2467f4] px-7 text-[15px] font-semibold text-white hover:bg-[#1f58d8] sm:w-auto">
            Get started today
          </Button>
          <Button
            variant="outline"
            className="h-11 w-full rounded-xl border-[#c4d6fb] bg-[#f5f9ff] px-7 text-[15px] font-semibold text-[#0b124b] hover:bg-white sm:w-auto"
          >
            Find your plan
          </Button>
        </div>
        <p className="mx-auto mt-10 max-w-[980px] text-[14px] text-[#0b124b] lg:text-[16px]">
          <span className="font-semibold">Zoom AI Companion</span> is available
          with eligible paid Zoom Workplace plans. May not be available for all
          regions or industry verticals.{" "}
          <a href="#" className="text-[#2467f4]">
            Learn more.
          </a>
        </p>
      </div>
    </section>
  )
}
