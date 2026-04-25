import Image from "next/image"

import { Button } from "@/components/ui/button"

const reports = [
  {
    image: "/report/gartner-magic-quadrant.webp",
    alt: "Gartner Magic Quadrant report cover",
    title: "A Leader in the Gartner® Magic Quadrant™ for UCaaS, Worldwide 2025. 6th year in a row!",
    cta: "Read the report",
    imageWrapClassName: "bg-white",
  },
  {
    image: "/report/zoom-recognized.webp",
    alt: "Zoom recognized in the Gartner Magic Quadrant for CCaaS",
    title: "Zoom recognized in the 2025 Gartner® Magic Quadrant™ for CCaaS",
    cta: "Explore the report",
    imageWrapClassName: "bg-white",
  },
  {
    image: "/report/forrest.jpg",
    alt: "Forrester Wave UCaaS 2025 report graphic",
    title: "Zoom named a leader in The Forrester Wave™: UCaaS 2025",
    cta: "Read Forrester report",
    imageWrapClassName: "bg-[#eef4ff]",
  },
]

export function ReportsSection() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-10">
        <div className="grid gap-x-8 gap-y-10 sm:gap-x-10 lg:gap-x-12 lg:gap-y-12 md:grid-cols-2 xl:grid-cols-3">
          {reports.map((report) => (
            <article key={report.title} className="mx-auto flex w-full max-w-[420px] flex-col items-start">
              <div
                className={`w-full overflow-hidden rounded-[22px] ${report.imageWrapClassName} shadow-none sm:rounded-[24px] lg:rounded-[26px]`}
              >
                <div className="relative aspect-[0.94/1] w-full">
                  <Image
                    src={report.image}
                    alt={report.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  />
                </div>
              </div>

              <h3 className="mt-5 max-w-[390px] text-[22px] leading-[1.08] font-semibold tracking-[-0.04em] text-[#0b124b] sm:mt-6 sm:text-[26px] lg:max-w-[410px] lg:text-[30px]">
                {report.title}
              </h3>

              <Button className="mt-6 h-12 rounded-[16px] bg-[#2467f4] px-6 text-[16px] font-semibold text-white hover:bg-[#1f58d8] sm:mt-7 sm:h-13 sm:px-7 sm:text-[17px] lg:h-14 lg:rounded-[18px] lg:px-8 lg:text-[18px]">
                {report.cta}
              </Button>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
