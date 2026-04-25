import { Button } from "@/components/ui/button"

export function BusinessCtaSection() {
  return (
    <section className="bg-white pt-24">
      <div className="mx-auto max-w-[1500px] px-6 pb-20 text-center lg:px-12">
        <h2 className="mx-auto max-w-[1100px] text-6xl leading-[0.95] font-semibold tracking-[-0.05em] text-[#0b124b] lg:text-[96px]">
          See what Zoom can do for your business
        </h2>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button className="h-16 rounded-[22px] bg-[#2467f4] px-10 text-[22px] font-semibold text-white hover:bg-[#1f58d8]">
            Get started today
          </Button>
          <Button
            variant="outline"
            className="h-16 rounded-[22px] border-[#c4d6fb] bg-[#f5f9ff] px-10 text-[22px] font-semibold text-[#0b124b] hover:bg-white"
          >
            Find your plan
          </Button>
        </div>
        <p className="mx-auto mt-16 max-w-[1400px] text-[20px] text-[#0b124b] lg:text-[24px]">
          <span className="font-semibold">Zoom AI Companion</span> is available with
          eligible paid Zoom Workplace plans. May not be available for all regions or
          industry verticals. <a href="#" className="text-[#2467f4]">Learn more.</a>
        </p>
      </div>
    </section>
  )
}
