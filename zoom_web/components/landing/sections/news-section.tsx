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
      className="inline-flex size-10 items-center justify-center rounded-full bg-white text-[#0b124b] shadow-sm transition-transform hover:scale-105"
    >
      <ArrowUpRight className="size-4" />
    </button>
  )
}

function TallCard({ title, body, image, caption }: NewsCardProps) {
  const isEmmy = !!caption

  return (
    <article
      className="relative flex flex-col overflow-hidden rounded-[20px] text-white"
      style={{
        background: isEmmy
          ? "linear-gradient(160deg, #2d5ef0 0%, #1230b8 100%)"
          : "linear-gradient(160deg, #3068f5 0%, #1840cc 100%)",
        minHeight: "420px",
      }}
    >
      {/* Text content */}
      <div className="p-6 pb-2">
        <h3 className="text-[19px] leading-[1.2] font-semibold tracking-[-0.02em]">
          {title}
        </h3>
        <p className="mt-3 text-[14px] leading-[1.55] text-white/85">{body}</p>
        {caption && (
          <p className="mt-2 text-[11px] text-white/50">{caption}</p>
        )}
      </div>

      {/* Image area — flush to bottom */}
      {image && (
        <div
          className="relative mt-auto flex overflow-hidden"
          style={isEmmy ? { justifyContent: "center", alignItems: "flex-end", paddingBottom: "56px", paddingLeft: "20px", paddingRight: "20px" } : {}}
        >
          <img
            src={image.src}
            alt={image.alt}
            className={
              isEmmy
                ? "object-contain"
                : "w-full object-cover object-top"
            }
            style={isEmmy ? { height: "200px", width: "auto" } : {}}
          />
        </div>
      )}

      {/* Arrow pinned bottom-right */}
      <div className="absolute right-5 bottom-5">
        <ArrowButton />
      </div>
    </article>
  )
}

function SmallCard({ title, body }: NewsCardProps) {
  return (
    <article
      className="relative flex flex-1 flex-col overflow-hidden rounded-[20px] p-6 text-white"
      style={{
        background: "linear-gradient(160deg, #3570f8 0%, #1a3fd4 100%)",
        minHeight: "200px",
      }}
    >
      <h3 className="max-w-[85%] text-[17px] leading-[1.2] font-semibold tracking-[-0.02em]">
        {title}
      </h3>
      <p className="mt-3 text-[14px] leading-[1.55] text-white/85">{body}</p>
      <div className="absolute right-5 bottom-5">
        <ArrowButton />
      </div>
    </article>
  )
}

export function NewsSection() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        {/* Label */}
        <div className="mb-5 flex items-center justify-center gap-2.5 text-[14px] font-medium text-[#2467f4]">
          <span className="size-2 rounded-full bg-[#2467f4]" />
          <span>What&apos;s new</span>
        </div>

        {/* Heading */}
        <h2 className="mx-auto max-w-[760px] text-center text-[2.1rem] leading-[1.02] font-semibold tracking-[-0.03em] text-[#0b124b] lg:text-[54px]">
          Making news, making impact
        </h2>

        {/* Grid — 3 equal columns, tall cards left two, small stacked right */}
        <div className="mt-10 grid gap-4 xl:grid-cols-3">
          {/* Card 1 - tall, image bleeds to bottom */}
          <TallCard {...newsCards[0]} />

          {/* Card 2 - tall, Emmy centered */}
          <TallCard {...newsCards[1]} />

          {/* Right column: two small cards stacked, equal height */}
          <div className="flex flex-col gap-4">
            <SmallCard {...newsCards[2]} />
            <SmallCard {...newsCards[3]} />
          </div>
        </div>
      </div>
    </section>
  )
}