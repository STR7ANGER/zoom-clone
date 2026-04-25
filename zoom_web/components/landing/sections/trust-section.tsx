const logos = ["Walmart", "WERNER ENTERPRISES", "MOFFITT CANCER CENTER", "ExxonMobil", "CapitalOne"]

export function TrustSection() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-[1500px] px-6 lg:px-12">
        <h2 className="text-center text-[56px] leading-none font-semibold tracking-[-0.04em] text-[#0b124b] lg:text-[72px]">
          Trusted by millions. Built for you.
        </h2>

        <div className="mt-16 grid gap-10 text-center md:grid-cols-3 lg:grid-cols-5">
          {logos.map((logo) => (
            <div key={logo} className="text-[34px] font-semibold tracking-[-0.04em] text-black/75">
              {logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
