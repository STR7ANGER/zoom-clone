import { ArrowUpRight } from "lucide-react"

const newsCards = [
  {
    title: "Meet My Notes: Your new AI note-taker",
    body: "My Notes captures insights from your conversations — on Zoom, in-person, and across third-party platforms — so you can focus on the discussion, not documentation.",
    tall: true,
    image: {
      src: "https://st1.zoom.us/homepage/20260413-1449/primary/dist/assets/zoommedia/whats-new-my-notes.webp",
      alt: "Person using Zoom My Notes on a laptop",
    },
  },
  {
    title: "Zoom wins Emmy for Engineering, Science & Technology",
    body: "From connecting remote workers to powering Emmy-winning broadcast technology, Zoom is changing how the world connects.",
    tall: true,
    caption: "©ATAS/NATAS",
    image: {
      src: "https://st1.zoom.us/homepage/20260413-1449/primary/dist/assets/zoommedia/Award-image.svg",
      alt: "Emmy Award statuette",
    },
  },
  {
    title: "Eric Yuan on accessible AI: Include AI tools for business",
    body: "Zoom CEO, Eric Yuan, discusses how Zoom is making AI available at no extra cost.",
    tall: false,
  },
  {
    title: "Zoom launches AI app for frontline workers",
    body: "The app handles scheduling, updates, chat, push-to-talk, and tasks, while AI Companion summarizes shifts, attendance, and task status.",
    tall: false,
  },
]

type NewsCardProps = (typeof newsCards)[number]

function ArrowButton() {
  return (
    <button
      type="button"
      className="inline-flex size-12 items-center justify-center rounded-full bg-white text-[#0b124b] shadow-sm hover:scale-105 transition-transform"
    >
      <ArrowUpRight className="size-5" />
    </button>
  )
}

function TallCard({ title, body, image, caption }: NewsCardProps) {
  return (
    <article className="relative flex flex-col overflow-hidden rounded-[28px] bg-[linear-gradient(160deg,#2f6ef5_0%,#1434c0_100%)] text-white min-h-[700px]">
      {/* Text content */}
      <div className="p-8 pb-4">
        <h3 className="text-[22px] leading-[1.2] font-semibold tracking-[-0.02em]">{title}</h3>
        <p className="mt-4 text-[16px] leading-[1.55] text-white/85">{body}</p>
        {caption && (
          <p className="mt-3 text-[12px] text-white/50">{caption}</p>
        )}
      </div>

      {/* Image area */}
      {image && (
        <div className="relative mt-auto flex items-end justify-center overflow-hidden px-6">
          <img
            src={image.src}
            alt={image.alt}
            className="w-full max-w-[340px] object-contain"
          />
        </div>
      )}

      {/* Arrow */}
      <div className="absolute bottom-6 right-6">
        <ArrowButton />
      </div>
    </article>
  )
}

function SmallCard({ title, body }: NewsCardProps) {
  return (
    <article className="relative flex flex-col overflow-hidden rounded-[28px] bg-[linear-gradient(160deg,#2f6ef5_0%,#1434c0_100%)] p-8 text-white min-h-[260px]">
      <h3 className="text-[20px] leading-[1.2] font-semibold tracking-[-0.02em] max-w-[85%]">{title}</h3>
      <p className="mt-4 text-[15px] leading-[1.55] text-white/85">{body}</p>
      <div className="absolute bottom-6 right-6">
        <ArrowButton />
      </div>
    </article>
  )
}

export function NewsSection() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-[1500px] px-6 lg:px-12">
        {/* Label */}
        <div className="mb-6 flex items-center justify-center gap-3 text-base font-medium text-[#2467f4]">
          <span className="size-2 rounded-full bg-[#2467f4]" />
          <span>What&apos;s new</span>
        </div>

        {/* Heading */}
        <h2 className="mx-auto max-w-[900px] text-center text-5xl leading-[1.0] font-semibold tracking-[-0.04em] text-[#0b124b] lg:text-[72px]">
          Making news, making impact
        </h2>

        {/* Grid */}
        <div className="mt-16 grid gap-5 xl:grid-cols-3">
          {/* Card 1 - tall */}
          <TallCard {...newsCards[0]} />

          {/* Card 2 - tall */}
          <TallCard {...newsCards[1]} />

          {/* Right column: two small cards stacked */}
          <div className="flex flex-col gap-5">
            <SmallCard {...newsCards[2]} />
            <SmallCard {...newsCards[3]} />
          </div>
        </div>
      </div>
    </section>
  )
}