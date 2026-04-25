const reviews = [
  {
    score: "4.5/5",
    text: "out of 7.9k+ reviews",
    brand: "Gartner Peer Insights",
  },
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
    <section className="bg-white py-16">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <div
              key={review.brand}
              className={`text-center ${index < 2 ? "lg:border-r lg:border-slate-300" : ""}`}
            >
              <div className="text-[54px] leading-none font-semibold tracking-[-0.04em] text-black lg:text-[64px]">
                {review.score}
              </div>
              <Stars />
              <p className="mt-2 text-[16px] text-black/45 lg:text-[18px]">
                {review.text}
              </p>
              <div className="mt-5 text-[24px] font-semibold text-black/85 lg:text-[28px]">
                {review.brand}
              </div>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-16 max-w-[980px] text-center">
          <blockquote className="text-[2rem] leading-[1.12] font-semibold tracking-[-0.04em] text-[#17288d] lg:text-[52px]">
            “Zoom Workplace turns my brainwaves into polished gems. From
            meetings, I can create Clips, Notes, Docs, or even whiteboards
            faster than you can say, ‘transcript.’”
          </blockquote>
          <p className="mt-7 text-[24px] text-[#0b124b] lg:text-[28px]">
            Marquesa Pettway
          </p>
          <p className="mt-1 text-[18px] text-[#0b124b]/75 lg:text-[20px]">
            Founder
          </p>
        </div>
      </div>
    </section>
  )
}
