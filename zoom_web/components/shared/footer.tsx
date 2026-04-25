import { ChevronDown, Download } from "lucide-react"

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
      className="flex h-11 w-full items-center justify-between rounded-lg bg-[#0d1240] px-4 text-left text-[14px] font-medium text-white"
    >
      <span>{label}</span>
      <ChevronDown className="size-4 text-white/50" />
    </button>
  )
}

/* Social SVG icons — pixel-matched to the screenshot */
function LinkedInIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L2.25 2.25h6.961l4.263 5.638 4.77-5.638zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  )
}

function YouTubeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#05072d" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

export function Footer() {
  return (
    <footer className="bg-[#05072d] text-white">
      <div className="mx-auto max-w-[1440px] px-8 pt-14 pb-12 lg:px-14">

        {/* Main content row */}
        <div className="flex flex-col gap-12 border-b border-white/[0.08] pb-10 xl:flex-row xl:gap-0">

          {/* ── Left column ── */}
          <div className="flex w-full flex-col xl:w-[390px] xl:shrink-0 xl:pr-14">
            {/* Zoom logo */}
            <img
              src="https://st1.zoom.us/homepage/20260413-1449/primary/dist/assets/zoommedia/logo-zoom-white@2x.png"
              alt="Zoom"
              className="mb-8 h-8 w-auto object-contain object-left"
            />

            {/* Download Center */}
            <div className="mb-6 flex items-center gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white">
                <Download className="size-5 text-[#2467f4]" />
              </div>
              <div>
                <div className="text-[15px] font-semibold">Download Center</div>
                <p className="text-[13px] text-white/60">Get the most out of Zoom</p>
              </div>
            </div>

            {/* Selects */}
            <div className="mb-2 space-y-3">
              <FooterSelect label="English" />
              <FooterSelect label="US Dollar $" />
            </div>

            {/* Spacer — pushes phone + social to bottom on large screens */}
            <div className="flex-1" />

            {/* Get in touch */}
            <div className="mt-10">
              <p className="text-[13px] text-white/60">Get in touch</p>
              <div className="mt-1 text-[28px] font-bold tracking-tight">
                1.888.799.9666
              </div>
            </div>

            {/* Social icons */}
            <div className="mt-5 flex items-center gap-5">
              <a href="#" aria-label="LinkedIn" className="text-white/80 hover:text-white transition-colors">
                <LinkedInIcon />
              </a>
              <a href="#" aria-label="X / Twitter" className="text-white/80 hover:text-white transition-colors">
                <XIcon />
              </a>
              <a href="#" aria-label="YouTube" className="text-white/80 hover:text-white transition-colors">
                <YouTubeIcon />
              </a>
              <a href="#" aria-label="Facebook" className="text-white/80 hover:text-white transition-colors">
                <FacebookIcon />
              </a>
              <a href="#" aria-label="Instagram" className="text-white/80 hover:text-white transition-colors">
                <InstagramIcon />
              </a>
            </div>
          </div>

          {/* ── Right: link columns ── */}
          <div className="grid flex-1 gap-8 sm:grid-cols-2 xl:grid-cols-4">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <h4 className="mb-4 text-[14px] font-semibold text-white">
                  {column.title}
                </h4>
                <ul className="space-y-[10px] text-[13px] text-white/65">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="leading-snug hover:text-white transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="flex flex-col gap-3 pt-5 text-[12.5px] text-white/50 lg:flex-row lg:items-center lg:justify-between">
          <p>Copyright ©2026 Zoom Communications, Inc. All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {legalLinks.map((link) =>
              link === "Your Privacy Choices" ? (
                <span key={link} className="flex items-center gap-2">
                  {/* Privacy toggle badge */}
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#2467f4] px-2 py-[3px] text-[11px] font-bold text-white leading-none">
                    <span className="size-[10px] rounded-full bg-white inline-block" />
                    X
                  </span>
                  <a href="#" className="hover:text-white transition-colors">
                    {link}
                  </a>
                </span>
              ) : (
                <a key={link} href="#" className="hover:text-white transition-colors">
                  {link}
                </a>
              )
            )}
          </div>
        </div>

      </div>
    </footer>
  )
}