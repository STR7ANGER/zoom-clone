import { LandingPage } from "@/components/landing/landing"
import { Footer } from "@/components/shared/footer"
import { Navbar } from "@/components/shared/navbar"

export default function Page() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-[#0b124b]">
      <Navbar />
      <LandingPage />
      <Footer />
    </main>
  )
}
