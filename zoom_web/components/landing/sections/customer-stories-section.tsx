const storyTiles = [
  { name: "MLB", tone: "bg-[linear-gradient(180deg,#7187a4_0%,#24324c_100%)]" },
  { name: "Cricut", tone: "bg-[linear-gradient(180deg,#c4b1a7_0%,#7a564c_100%)]" },
]

export function CustomerStoriesSection() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-[1500px] px-6 lg:px-12">
        <div className="mb-8 flex items-center justify-center gap-3 text-xl font-medium text-[#2467f4]">
          <span className="size-4 rounded-full bg-[#2467f4] shadow-[0_0_0_8px_rgba(36,103,244,0.08)]" />
          <span>Customer stories</span>
        </div>

        <h2 className="mx-auto max-w-[1200px] text-center text-6xl leading-[0.95] font-semibold tracking-[-0.05em] text-[#0b124b] lg:text-[100px]">
          Companies are achieving more with Zoom
        </h2>

        <div className="mt-16 grid gap-8 xl:grid-cols-[0.42fr_1fr]">
          <div className="grid grid-cols-2 gap-8">
            {storyTiles.map((tile) => (
              <div
                key={tile.name}
                className={`relative min-h-[900px] overflow-hidden rounded-[34px] ${tile.tone}`}
              >
                <div className="absolute inset-x-5 bottom-5 rounded-2xl bg-white/80 px-5 py-4 text-2xl font-semibold text-[#0b124b] backdrop-blur">
                  {tile.name}
                </div>
              </div>
            ))}
          </div>

          <article className="relative overflow-hidden rounded-[40px] bg-[linear-gradient(135deg,#000000_0%,#0c1329_38%,#2a313e_100%)] p-10 text-white">
            <div className="max-w-[820px]">
              <p className="text-[28px] font-semibold">CapitalOne</p>
              <h3 className="mt-16 text-[62px] leading-[1.02] font-semibold tracking-[-0.04em]">
                A connected, collaborative workforce drives innovation at Capital One
              </h3>
              <p className="mt-20 max-w-[900px] text-[26px] leading-[1.45] text-white/90">
                “We are highly collaborative, we are people-centered, we are interested in
                moving ourselves and our goals to the next level. Zoom is, I believe, the
                ideal tool to suit the culture that we are and that we strive to be at
                Capital One.”
              </p>
              <p className="mt-8 text-[24px]">
                <span className="font-semibold">- Nikita Steals</span>, VP, Tech Talent
                Acquisition, Capital One
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
