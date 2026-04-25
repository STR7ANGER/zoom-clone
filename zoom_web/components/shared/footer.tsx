import { AtSign, Camera, ChevronDown, Download, MessageCircle, Play, Users } from "lucide-react"

const footerColumns = [
  {
    title: "About",
    links: [
      "Zoom Blog",
      "Customers",
      "Our Team",
      "Careers",
      "Integrations",
      "Partners",
      "Investors",
      "Press",
      "Sustainability & ESG",
      "Zoom Cares",
      "Media Kit",
      "How To Videos",
      "Developer Platform",
      "Zoom Ventures",
      "Zoom Merchandise Store",
    ],
  },
  {
    title: "Download",
    links: [
      "Zoom Workplace App",
      "Zoom Rooms App",
      "Zoom Rooms Controller",
      "Browser Extension",
      "Outlook Plug-in",
      "iPhone/iPad App",
      "Android App",
      "Zoom Virtual Backgrounds",
    ],
  },
  {
    title: "Sales",
    links: [
      "1.888.799.9666",
      "Contact Sales",
      "Plans & Pricing",
      "Request a Demo",
      "Webinars and Events",
      "Zoom Experience Center",
      "Zoom for Startups",
    ],
  },
  {
    title: "Support",
    links: [
      "Test Zoom",
      "Account",
      "Support Center",
      "Learning Center",
      "Zoom Community",
      "Technical Content Library",
      "Feedback",
      "Contact Us",
      "Accessibility",
      "Developer Support",
      "Privacy, Security, Legal Policies, and Modern Slavery Act Transparency Statement",
    ],
  },
]

const legalLinks = [
  "Terms",
  "Privacy",
  "Trust Center",
  "Acceptable Use Guidelines",
  "Legal & Compliance",
  "Your Privacy Choices",
  "Cookies Settings",
  "Site Map",
]

function FooterSelect({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="flex h-14 w-full items-center justify-between rounded-xl bg-[#13174a] px-5 text-left text-base font-medium text-white"
    >
      <span>{label}</span>
      <ChevronDown className="size-5 text-white/60" />
    </button>
  )
}

export function Footer() {
  return (
    <footer className="bg-[#05072d] text-white">
      <div className="mx-auto max-w-[1500px] px-6 py-16 lg:px-12">
        <div className="grid gap-12 border-b border-white/10 pb-14 xl:grid-cols-[300px_1fr]">
          {/* Left column */}
          <div className="space-y-6">
            {/* Download Center */}
            <div className="flex items-center gap-4">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white">
                <Download className="size-6 text-[#2467f4]" />
              </div>
              <div>
                <div className="text-base font-semibold">Download Center</div>
                <p className="text-sm text-white/70">Get the most out of Zoom</p>
              </div>
            </div>

            {/* Language & Currency */}
            <FooterSelect label="English" />
            <FooterSelect label="US Dollar $" />

            {/* Get in touch */}
            <div className="pt-6">
              <p className="text-sm text-white/70">Get in touch</p>
              <div className="mt-1 text-4xl font-bold tracking-tight">1.888.799.9666</div>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-5 pt-1">
              <a href="#" aria-label="LinkedIn" className="text-white/80 hover:text-white">
                <AtSign className="size-6" />
              </a>
              <a href="#" aria-label="X / Twitter" className="text-white/80 hover:text-white">
                <MessageCircle className="size-6" />
              </a>
              <a href="#" aria-label="YouTube" className="text-white/80 hover:text-white">
                <Play className="size-6" />
              </a>
              <a href="#" aria-label="Facebook" className="text-white/80 hover:text-white">
                <Users className="size-6" />
              </a>
              <a href="#" aria-label="Instagram" className="text-white/80 hover:text-white">
                <Camera className="size-6" />
              </a>
            </div>
          </div>

          {/* Right: link columns */}
          <div className="grid gap-10 sm:grid-cols-2 xl:grid-cols-4">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <ul className="space-y-4 text-[15px] text-white/80">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="hover:text-white leading-snug">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-4 pt-8 text-sm text-white/60 lg:flex-row lg:items-center lg:justify-between">
          <p>Copyright ©2026 Zoom Communications, Inc. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {legalLinks.map((link, i) => (
              <span key={link} className="flex items-center gap-6">
                {link === "Your Privacy Choices" ? (
                  <span className="flex items-center gap-2">
                    {/* Privacy toggle badge */}
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#2467f4] px-2 py-0.5 text-xs font-semibold text-white">
                      <span className="size-2 rounded-full bg-white" />
                      X
                    </span>
                    <a href="#" className="hover:text-white">
                      {link}
                    </a>
                  </span>
                ) : (
                  <a href="#" className="hover:text-white">
                    {link}
                  </a>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}