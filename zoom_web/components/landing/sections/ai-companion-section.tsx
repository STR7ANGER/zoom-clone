import { Button } from "@/components/ui/button"

function SectionEyebrow({ label }: { label: string }) {
  return (
    <div className="mb-3 inline-flex items-center justify-center">
      <img
        src="https://st1.zoom.us/homepage/20260413-1449/primary/dist/assets/zoommedia/icon-aic.svg"
        alt={label}
        className="h-8 w-8 sm:h-10 sm:w-10"
      />
    </div>
  )
}

export function AiCompanionSection() {
  return (
    <section className="bg-white py-14 lg:py-16">
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-12">
        <div className="text-center">
          <SectionEyebrow label="AI Companion" />
          <h2 className="text-[2.15rem] leading-[0.98] font-semibold tracking-[-0.04em] text-[#0b124b] sm:text-[3.1rem] lg:text-[68px]">
            Introducing
            <br />
            <span className="bg-[linear-gradient(90deg,#8d5eff_0%,#6aa6ff_42%,#2d42f1_100%)] bg-clip-text text-transparent">
              Zoom AI Companion 3.0
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-[680px] text-[14px] leading-relaxed text-[#0b124b] sm:text-[16px] lg:text-[18px]">
            AI Companion does more than save you time. It captures context,
            uncovers insights, and helps you deliver better work.
          </p>
          <Button className="mt-6 h-10 rounded-xl bg-[#2467f4] px-6 text-[14px] font-semibold text-white hover:bg-[#1f58d8]">
            Learn more
          </Button>
        </div>

        <div className="mx-auto mt-10 grid max-w-[1100px] items-start gap-6 lg:grid-cols-[minmax(0,1.8fr)_280px] xl:max-w-[1180px] xl:gap-8">
          <div className="rounded-[18px] shadow-[0_0_0_1px_rgba(30,64,175,0.14),0_0_18px_rgba(29,78,216,0.44),0_0_48px_rgba(30,64,175,0.3),0_0_90px_rgba(37,99,235,0.18)]">
            <div className="overflow-hidden rounded-[18px] border border-[#377dff] bg-white shadow-[0_0_14px_rgba(29,78,216,0.38),0_0_30px_rgba(30,64,175,0.22)]">
              <video
                className="block aspect-[16/10] h-full w-full bg-white object-cover"
                src="https://st1.zoom.us/homepage/20260413-1449/primary/dist/assets/zoommedia/aic-video.mp4"
                autoPlay
                muted
                loop
                playsInline
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          <aside className="pt-2 lg:pt-4">
            <h3 className="text-[20px] leading-tight font-semibold tracking-[-0.02em] text-[#0b124b] sm:text-[22px]">
              Zoom AI Companion helps by:
            </h3>
            <ul className="mt-4 list-disc space-y-2.5 pl-5 text-[14px] leading-[1.45] text-[#0b124b] sm:text-[15px]">
              <li>
                Capturing and summarizing conversations wherever your meeting
                takes place.
              </li>
              <li>
                Turning meeting notes and insights into ready-to-use docs,
                briefs, and more.
              </li>
              <li>
                Automating prep, follow-up, and documentation so you can focus
                on impact.
              </li>
            </ul>

            <div className="mt-7 w-12 border-t-2 border-[#0b124b]/50 pt-6" />

            <div>
              <img
                src="https://st1.zoom.us/homepage/20260413-1449/primary/dist/assets/zoommedia/couch-cork.png"
                alt="couch + cork"
                className="h-auto w-[72px]"
              />
              <blockquote className="mt-4 max-w-[250px] text-[15px] leading-[1.18] font-semibold tracking-[-0.02em] text-[#5d79f5] sm:text-[17px]">
                &quot;It always comes down to &apos;I want to work on my
                business, not in my business.&apos; Zoom AI Companion allows me
                to have that time back.&quot;
              </blockquote>
              <p className="mt-4 text-[13px] text-[#0b124b]">Nancy Koziol</p>
              <p className="text-[13px] leading-snug text-[#0b124b]">
                Founder, couch + cork
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
