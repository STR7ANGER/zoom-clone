import { AiCompanionSection } from "@/components/landing/sections/ai-companion-section"
import { BusinessCtaSection } from "@/components/landing/sections/business-cta-section"
import { CustomerStoriesSection } from "@/components/landing/sections/customer-stories-section"
import { HeroSection } from "@/components/landing/sections/hero-section"
import { NewsSection } from "@/components/landing/sections/news-section"
import { RecognitionSection } from "@/components/landing/sections/recognition-section"
import { ReportsSection } from "@/components/landing/sections/reports-section"
import { TrustSection } from "@/components/landing/sections/trust-section"
import { WorkTogetherSection } from "@/components/landing/sections/work-together-section"

export function LandingPage() {
  return (
    <>
      <HeroSection />
      <AiCompanionSection />
      <ReportsSection />
      <WorkTogetherSection />
      <TrustSection />
      <RecognitionSection />
      <CustomerStoriesSection />
      <NewsSection />
      <BusinessCtaSection />
    </>
  )
}
