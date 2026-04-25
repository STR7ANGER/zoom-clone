const storyTiles = [
  { name: "MLB", tone: "bg-[linear-gradient(180deg,#7187a4_0%,#24324c_100%)]" },
  {
    name: "Cricut",
    tone: "bg-[linear-gradient(180deg,#c4b1a7_0%,#7a564c_100%)]",
  },
]

export function CustomerStoriesSection() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        <div className="mb-6 flex items-center justify-center gap-2.5 text-[15px] font-medium text-[#2467f4]">
          <span className="size-3 rounded-full bg-[#2467f4] shadow-[0_0_0_6px_rgba(36,103,244,0.08)]" />
          <span>Customer stories</span>
        </div>

        <h2 className="mx-auto max-w-[980px] text-center text-[2.2rem] leading-[0.98] font-semibold tracking-[-0.04em] text-[#0b124b] lg:text-[64px]">
          Companies are achieving more with Zoom
        </h2>

        <div className="mt-10 grid gap-6 xl:grid-cols-[0.42fr_1fr]">
          <div className="grid grid-cols-2 gap-6">
            {storyTiles.map((tile) => (
              <div
                key={tile.name}
                className={`relative min-h-[620px] overflow-hidden rounded-[20px] ${tile.tone}`}
              >
                <div className="absolute inset-x-4 bottom-4 rounded-xl bg-white/80 px-4 py-3 text-[18px] font-semibold text-[#0b124b] backdrop-blur">
                  {tile.name}
                </div>
              </div>
            ))}
          </div>

          <article className="relative overflow-hidden rounded-[24px] bg-[linear-gradient(135deg,#000000_0%,#0c1329_38%,#2a313e_100%)] p-7 text-white lg:p-8">
            <div className="max-w-[720px]">
              <p className="text-[20px] font-semibold">CapitalOne</p>
              <h3 className="mt-10 text-[34px] leading-[1.06] font-semibold tracking-[-0.03em] lg:text-[44px]">
                A connected, collaborative workforce drives innovation at
                Capital One
              </h3>
              <p className="mt-12 max-w-[760px] text-[18px] leading-[1.5] text-white/90 lg:text-[20px]">
                “We are highly collaborative, we are people-centered, we are
                interested in moving ourselves and our goals to the next level.
                Zoom is, I believe, the ideal tool to suit the culture that we
                are and that we strive to be at Capital One.”
              </p>
              <p className="mt-6 text-[16px] lg:text-[18px]">
                <span className="font-semibold">- Nikita Steals</span>, VP, Tech
                Talent Acquisition, Capital One
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
