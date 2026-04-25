const reviews = [
  { score: "4.5/5", text: "out of 7.9k+ reviews", brand: "Gartner Peer Insights" },
  { score: "4.6/5", text: "out of 54.9k+ reviews", brand: "G2" },
  { score: "8.5/10", text: "out of 5.8k+ reviews", brand: "TrustRadius" },
]

function Stars() {
  return (
    <div className="mt-4 flex items-center justify-center gap-3 text-[44px] leading-none text-black">
      <span>★</span>
      <span>★</span>
      <span>★</span>
      <span>★</span>
      <span className="text-black/35">★</span>
    </div>
  )
}

export function RecognitionSection() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-[1500px] px-6 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <div
              key={review.brand}
              className={`text-center ${index < 2 ? "lg:border-r lg:border-slate-300" : ""}`}
            >
              <div className="text-[84px] leading-none font-semibold tracking-[-0.05em] text-black">
                {review.score}
              </div>
              <Stars />
              <p className="mt-3 text-[24px] text-black/45">{review.text}</p>
              <div className="mt-8 text-[34px] font-semibold text-black/85">{review.brand}</div>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-24 max-w-[1200px] text-center">
          <blockquote className="text-[54px] leading-[1.08] font-semibold tracking-[-0.05em] text-[#17288d] lg:text-[72px]">
            “Zoom Workplace turns my brainwaves into polished gems. From meetings, I can
            create Clips, Notes, Docs, or even whiteboards faster than you can say,
            ‘transcript.’”
          </blockquote>
          <p className="mt-10 text-[36px] text-[#0b124b]">Marquesa Pettway</p>
          <p className="mt-2 text-[28px] text-[#0b124b]/75">Founder</p>
        </div>
      </div>
    </section>
  )
}
