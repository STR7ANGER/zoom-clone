import { Button } from "@/components/ui/button"

function SectionEyebrow({ label }: { label: string }) {
  return (
    <div className="mb-4 inline-flex items-center justify-center">
      <img
        src="https://st1.zoom.us/homepage/20260413-1449/primary/dist/assets/zoommedia/icon-aic.svg"
        alt={label}
        className="h-10 w-10 sm:h-12 sm:w-12"
      />
    </div>
  )
}

export function AiCompanionSection() {
  return (
    <section className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-12">
        <div className="text-center">
          <SectionEyebrow label="AI Companion" />
          <h2 className="text-4xl leading-[0.95] font-semibold tracking-[-0.05em] text-[#0b124b] sm:text-5xl lg:text-[88px]">
            Introducing
            <br />
            <span className="bg-[linear-gradient(90deg,#8d5eff_0%,#6aa6ff_42%,#2d42f1_100%)] bg-clip-text text-transparent">
              Zoom AI Companion 3.0
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-[760px] text-base leading-relaxed text-[#0b124b] sm:text-lg lg:text-[20px]">
            AI Companion does more than save you time. It captures context, uncovers
            insights, and helps you deliver better work.
          </p>
          <Button className="mt-8 h-12 rounded-[14px] bg-[#2467f4] px-8 text-base font-semibold text-white hover:bg-[#1f58d8]">
            Learn more
          </Button>
        </div>

        <div className="mx-auto mt-14 grid max-w-[1160px] items-start gap-8 lg:grid-cols-[minmax(0,1.85fr)_300px] xl:max-w-[1240px] xl:gap-10">
          <div className="rounded-[24px] shadow-[0_0_0_1px_rgba(30,64,175,0.16),0_0_26px_rgba(29,78,216,0.58),0_0_72px_rgba(30,64,175,0.46),0_0_130px_rgba(37,99,235,0.28)]">
            <div className="overflow-hidden rounded-[24px] border border-[#377dff] bg-white shadow-[0_0_18px_rgba(29,78,216,0.5),0_0_44px_rgba(30,64,175,0.34)]">
              <video
                className="block aspect-[16/10] h-full w-full bg-white object-cover"
                src="https://st1.zoom.us/homepage/20260413-1449/primary/dist/assets/zoommedia/aic-video.mp4"
                autoPlay
                muted
                loop
                playsInline
                controls
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          <aside className="pt-4 lg:pt-6">
            <h3 className="text-[24px] leading-tight font-semibold tracking-[-0.03em] text-[#0b124b] sm:text-[28px]">
              Zoom AI Companion helps by:
            </h3>
            <ul className="mt-5 list-disc space-y-3 pl-6 text-[17px] leading-[1.35] text-[#0b124b] sm:text-[18px]">
              <li>Capturing and summarizing conversations wherever your meeting takes place.</li>
              <li>Turning meeting notes and insights into ready-to-use docs, briefs, and more.</li>
              <li>Automating prep, follow-up, and documentation so you can focus on impact.</li>
            </ul>

            <div className="mt-10 w-14 border-t-2 border-[#0b124b]/50 pt-8" />

            <div className="mt-7">
              <img
                src="https://st1.zoom.us/homepage/20260413-1449/primary/dist/assets/zoommedia/couch-cork.png"
                alt="couch + cork"
                className="h-auto w-[88px]"
              />
              <blockquote className="mt-6 max-w-[280px] text-[18px] leading-[1.05] font-semibold tracking-[-0.03em] text-[#5d79f5] sm:text-[20px]">
                &quot;It always comes down to &apos;I want to work on my business, not in my
                business.&apos; Zoom AI Companion allows me to have that time back.&quot;
              </blockquote>
              <p className="mt-6 text-[14px] text-[#0b124b]">Nancy Koziol</p>
              <p className="text-[14px] leading-snug text-[#0b124b]">Founder, couch + cork</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
