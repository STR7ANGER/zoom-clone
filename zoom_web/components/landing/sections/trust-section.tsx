const logos = [
  "Walmart",
  "WERNER ENTERPRISES",
  "MOFFITT CANCER CENTER",
  "ExxonMobil",
  "CapitalOne",
]

export function TrustSection() {
  return (
    <section className="bg-white py-14">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        <h2 className="text-center text-[2.2rem] leading-none font-semibold tracking-[-0.03em] text-[#0b124b] lg:text-[52px]">
          Trusted by millions. Built for you.
        </h2>

        <div className="mt-10 grid gap-6 text-center md:grid-cols-3 lg:grid-cols-5">
          {logos.map((logo) => (
            <div
              key={logo}
              className="text-[22px] font-semibold tracking-[-0.03em] text-black/75 lg:text-[26px]"
            >
              {logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
