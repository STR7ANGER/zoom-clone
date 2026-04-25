"use client"

import { useState } from "react"
import { ArrowUpRight } from "lucide-react"

const stories = [
  {
    company: "Major League Baseball",
    shortLabel: "MLB",
    logo: "https://st1.zoom.us/homepage/20260413-1449/primary/dist/assets/zoommedia/logo-4.svg",
    image: "/customer_stories/baseball-club-bg-n.jpg",
    title: "Major League Baseball™ and Zoom expand the employee-fan experience",
    quote:
      '"Zoom has allowed us to continue a tradition of really being a technology-focused company and making sure that we are using cutting-edge technology not only to advance our business but also for our fans."',
    person: "Noah Garden",
    role: "Chief Revenue Officer",
  },
  {
    company: "TheShareCo",
    shortLabel: "TheShareCo",
    logo: "https://st1.zoom.us/homepage/20260413-1449/primary/dist/assets/zoommedia/logo-mlb-white.svg",
    image: "/customer_stories/share-bg.jpg",
    title:
      "Advancing mental wellness through TheShareCo's journey with Zoom Video SDK",
    quote:
      '"Zoom Video SDKs full flexibility in layout customization allowed us to achieve a real-life experience within the limited real estate presented by a phone or smart device."',
    person: "Tan Han Sing",
    role: "Founder and CEO, TheShareCo",
  },
  {
    company: "Cricut",
    shortLabel: "Cricut",
    logo: "https://st1.zoom.us/homepage/20260413-1449/primary/dist/assets/zoommedia/logo-2.svg",
    image: "/customer_stories/cricut-bg.jpg",
    title: "Cricut slashed call abandonment rates by 90% with Zoom",
    quote:
      '"Before Zoom, we juggled 10-plus tabs to handle calls. Now, everything is integrated into one clean platform, from CRM connections to video transitions. It is a dream workflow."',
    person: "Taylor Nelson",
    role: "Member Care QA Specialist",
  },
  {
    company: "Capital One",
    shortLabel: "CapitalOne",
    logo: "https://st1.zoom.us/homepage/20260413-1449/primary/dist/assets/zoommedia/logo-3.svg",
    image: "/customer_stories/capital-one-bg.jpg",
    title:
      "A connected, collaborative workforce drives innovation at Capital One",
    quote:
      '"We are highly collaborative, we are people-centered, we are interested in moving ourselves and our goals to the next level. Zoom is, I believe, the ideal tool to suit the culture that we are and that we strive to be at Capital One."',
    person: "Nikita Steals",
    role: "VP, Tech Talent Acquisition, Capital One",
  },
] as const

function StoryLogo({
  label,
  company,
  expanded,
}: {
  label: string
  company: string
  expanded: boolean
}) {
  return (
    <img
      src={label}
      alt={`${company} logo`}
      className={`object-contain object-center ${
        expanded
          ? "h-8 w-auto max-w-[140px] sm:h-10 sm:max-w-[170px]"
          : "h-auto max-h-[34px] w-auto max-w-[78%] opacity-95"
      }`}
    />
  )
}

export function CustomerStoriesSection() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
        <div className="mb-6 flex items-center justify-center gap-2.5 text-[15px] font-medium text-[#2467f4]">
          <span className="size-3 rounded-full bg-[#2467f4] shadow-[0_0_0_6px_rgba(36,103,244,0.08)]" />
          <span>Customer stories</span>
        </div>

        <h2 className="mx-auto max-w-[980px] text-center text-[2.2rem] leading-[0.98] font-semibold tracking-[-0.04em] text-[#0b124b] lg:text-[64px]">
          Companies are achieving more with Zoom
        </h2>

        <div
          className="mt-10 flex min-h-[520px] flex-col gap-4 lg:min-h-[560px] lg:flex-row"
          onMouseLeave={() => setActiveIndex(0)}
        >
          {stories.map((story, index) => {
            const expanded = index === activeIndex

            return (
              <button
                key={story.company}
                type="button"
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                onClick={() => setActiveIndex(index)}
                className={`group relative overflow-hidden rounded-[26px] text-left transition-all duration-500 ease-out focus-visible:ring-2 focus-visible:ring-[#2467f4] focus-visible:outline-none ${
                  expanded
                    ? "min-h-[460px] flex-[7.5] lg:min-h-full"
                    : "min-h-[136px] flex-1 lg:min-h-full"
                }`}
                style={{
                  backgroundImage: `linear-gradient(90deg, rgba(0, 0, 0, ${
                    expanded ? 0.74 : 0.44
                  }) 0%, rgba(0, 0, 0, ${expanded ? 0.52 : 0.24}) 28%, rgba(0, 0, 0, ${
                    expanded ? 0.18 : 0.14
                  }) 100%), url(${story.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                aria-pressed={expanded}
              >
                <div
                  className={`absolute inset-0 ${
                    expanded
                      ? "bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0)_28%,rgba(0,0,0,0.44)_100%)]"
                      : "bg-[linear-gradient(180deg,rgba(166,172,183,0.34)_0%,rgba(124,131,143,0.22)_50%,rgba(70,76,86,0.46)_100%)]"
                  }`}
                />
                {!expanded ? (
                  <div className="absolute inset-0 bg-[#98a0ad]/28 backdrop-grayscale-[0.45]" />
                ) : null}

                {expanded ? (
                  <div className="relative flex h-full flex-col justify-between p-6 text-white sm:p-8 lg:p-10">
                    <div className="max-w-[640px]">
                      <StoryLogo
                        label={story.logo}
                        company={story.company}
                        expanded
                      />
                      <h3 className="mt-6 max-w-[760px] text-[28px] leading-[1.06] font-semibold tracking-[-0.03em] sm:text-[34px] lg:text-[42px]">
                        {story.title}
                      </h3>
                    </div>

                    <div className="flex items-end justify-between gap-6">
                      <div className="max-w-[780px]">
                        <p className="text-[14px] leading-[1.45] text-white/92 sm:text-[16px] lg:text-[17px]">
                          {story.quote}
                        </p>
                        <p className="mt-5 text-[15px] text-white sm:text-[16px]">
                          <span className="font-semibold">
                            - {story.person}
                          </span>
                          , {story.role}
                        </p>
                      </div>

                      <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-full bg-[#2467f4] text-white shadow-[0_12px_24px_rgba(36,103,244,0.28)] transition-transform duration-300 group-hover:scale-105">
                        <ArrowUpRight className="size-6" />
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="relative flex h-full items-end justify-center p-4 lg:p-5">
                    <div className="flex h-full w-full items-center justify-center">
                      <StoryLogo
                        label={story.logo}
                        company={story.company}
                        expanded={false}
                      />
                    </div>

                    <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.34)_100%)]" />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
