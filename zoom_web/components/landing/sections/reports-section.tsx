import Image from "next/image"

import { Button } from "@/components/ui/button"

const reports = [
  {
    image: "/report/gartner-magic-quadrant.webp",
    alt: "Gartner Magic Quadrant report cover",
    title:
      "A Leader in the Gartner® Magic Quadrant™ for UCaaS, Worldwide 2025. 6th year in a row!",
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
    <section className="bg-white py-12 sm:py-14 lg:py-16">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-x-6 gap-y-8 sm:gap-x-8 md:grid-cols-2 lg:gap-x-10 lg:gap-y-10 xl:grid-cols-3">
          {reports.map((report) => (
            <article
              key={report.title}
              className="mx-auto flex w-full max-w-[360px] flex-col items-start"
            >
              <div
                className={`w-full overflow-hidden rounded-[16px] ${report.imageWrapClassName} shadow-none sm:rounded-[18px] lg:rounded-[20px]`}
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

              <h3 className="mt-4 max-w-[330px] text-[18px] leading-[1.15] font-semibold tracking-[-0.03em] text-[#0b124b] sm:mt-5 sm:text-[21px] lg:max-w-[350px] lg:text-[24px]">
                {report.title}
              </h3>

              <Button className="mt-5 h-10 rounded-xl bg-[#2467f4] px-5 text-[14px] font-semibold text-white hover:bg-[#1f58d8] sm:mt-6 sm:h-11 sm:px-6 sm:text-[15px] lg:h-11 lg:px-6">
                {report.cta}
              </Button>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
