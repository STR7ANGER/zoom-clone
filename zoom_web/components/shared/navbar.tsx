"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import {
  ChevronDown,
  Grip,
  Menu,
  Search,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { createInstantMeeting } from "@/lib/api"
import { NavbarAiDropdown } from "@/components/shared/navbar-ai-dropdown"
import { NavbarAppsMenu } from "@/components/shared/navbar-apps-menu"
import { NavbarProductsDropdown } from "@/components/shared/navbar-products-dropdown"
import { NavbarSearchPopover } from "@/components/shared/navbar-search-popover"
import { NavbarSolutionsDropdown } from "@/components/shared/navbar-solutions-dropdown"
import { NavbarUserMenu } from "@/components/shared/navbar-user-menu"
import aiCompanionIcon from "@/components/shared/ai-companion-icon.svg"

const leftLinks = [
  { label: "Products", hasChevron: true },
  { label: "AI", hasChevron: true, icon: "ai" as const },
  { label: "Solutions", hasChevron: true },
  { label: "Pricing" },
]

const rightLinks = [{ label: "Support", href: "#" }]
type DesktopDropdown = "products" | "ai" | "solutions"
type UtilityPopover = "search" | "user" | "apps"

export function Navbar() {
  const router = useRouter()
  const headerRef = useRef<HTMLElement | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [meetMenuOpen, setMeetMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<DesktopDropdown | null>(null)
  const [activeUtility, setActiveUtility] = useState<UtilityPopover | null>(null)
  const [creatingMeeting, setCreatingMeeting] = useState(false)

  const meetLinks = [
    { label: "Join a meeting", href: "/join", host: false },
    { label: "Host a meeting", href: "/myhome", host: true },
    { label: "Schedule a meeting", href: "/schedule", host: false },
  ]

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    if (!activeDropdown && !activeUtility && !meetMenuOpen && !mobileMenuOpen) return

    const closeMenus = () => {
      setActiveDropdown(null)
      setActiveUtility(null)
      setMeetMenuOpen(false)
      setMobileMenuOpen(false)
    }

    const onPointerDown = (event: PointerEvent) => {
      if (headerRef.current?.contains(event.target as Node)) return
      closeMenus()
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenus()
    }

    document.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [activeDropdown, activeUtility, meetMenuOpen, mobileMenuOpen])

  const textColor = isScrolled ? "text-[#0b124b]" : "text-white"
  async function hostMeeting() {
    if (creatingMeeting) return
    setCreatingMeeting(true)
    try {
      const { meeting, participant } = await createInstantMeeting()
      setMeetMenuOpen(false)
      setMobileMenuOpen(false)
      router.push(
        `/meeting/${meeting.meeting_id}?participantId=${participant.participant_id}`
      )
    } finally {
      setCreatingMeeting(false)
    }
  }

  const toggleDesktopDropdown = (dropdown: DesktopDropdown) => {
    setMeetMenuOpen(false)
    setActiveUtility(null)
    setActiveDropdown((current) => (current === dropdown ? null : dropdown))
  }

  const toggleUtilityPopover = (popover: UtilityPopover) => {
    setActiveDropdown(null)
    setMeetMenuOpen(false)
    setActiveUtility((current) => (current === popover ? null : popover))
  }

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "border-b border-slate-200/80 bg-white/95 shadow-[0_10px_28px_rgba(15,23,42,0.08)] backdrop-blur"
            : "border-b border-transparent bg-[linear-gradient(180deg,#050a2f_0%,#07124e_100%)]"
        }`}
      >
        <div className="flex h-[66px] w-full items-center justify-between px-4 sm:px-5 lg:px-6 xl:px-7">
          {/* Left: Logo + Nav */}
          <div className="flex items-center gap-4 lg:gap-5">
            {/* Logo */}
            <a href="#" className="shrink-0" aria-label="Zoom home">
              <img
                src={
                  isScrolled
                    ? "https://st1.zoom.us/homepage/20260413-1449/primary/dist/assets/zoommedia/logo-zoom@2x.png"
                    : "https://st1.zoom.us/homepage/20260413-1449/primary/dist/assets/zoommedia/logo-zoom-white@2x.png"
                }
                alt="Zoom"
                className="h-[30px] w-auto"
              />
            </a>

            {/* Desktop nav links */}
            <nav className="hidden items-center gap-1 lg:flex">
              <button
                type="button"
                onClick={() => toggleDesktopDropdown("products")}
                className={`flex items-center gap-1 rounded-[9px] px-3 py-2 text-[14px] font-medium transition-colors ${
                  activeDropdown === "products"
                    ? "bg-[#27314f] text-white"
                    : `${textColor} hover:bg-white/10`
                }`}
                aria-expanded={activeDropdown === "products"}
              >
                Products
                <ChevronDown
                  className={`size-4 opacity-80 transition-transform ${
                    activeDropdown === "products" ? "rotate-180" : ""
                  }`}
                />
              </button>
              <button
                type="button"
                onClick={() => toggleDesktopDropdown("ai")}
                className={`flex items-center gap-1 rounded-[9px] px-3 py-2 text-[14px] font-medium transition-colors ${
                  activeDropdown === "ai"
                    ? "bg-[#27314f] text-white"
                    : `${textColor} hover:bg-white/10`
                }`}
                aria-expanded={activeDropdown === "ai"}
              >
                <img
                  src={aiCompanionIcon.src}
                  alt=""
                  aria-hidden="true"
                  className="size-4"
                />
                AI
                <ChevronDown
                  className={`size-4 opacity-80 transition-transform ${
                    activeDropdown === "ai" ? "rotate-180" : ""
                  }`}
                />
              </button>
              <button
                type="button"
                onClick={() => toggleDesktopDropdown("solutions")}
                className={`flex items-center gap-1 rounded-[9px] px-3 py-2 text-[14px] font-medium transition-colors ${
                  activeDropdown === "solutions"
                    ? "bg-[#27314f] text-white"
                    : `${textColor} hover:bg-white/10`
                }`}
                aria-expanded={activeDropdown === "solutions"}
              >
                Solutions
                <ChevronDown
                  className={`size-4 opacity-80 transition-transform ${
                    activeDropdown === "solutions" ? "rotate-180" : ""
                  }`}
                />
              </button>
              <a
                href="#"
                onClick={() => {
                  setActiveDropdown(null)
                  setActiveUtility(null)
                }}
                className={`flex items-center rounded-md px-3 py-2 text-[14px] font-medium transition-colors hover:bg-white/10 ${textColor}`}
              >
                Pricing
              </a>
            </nav>
          </div>

          {/* Right: actions */}
          <div className="hidden shrink-0 items-center gap-1.5 lg:flex">
            {/* Search */}
            <button
              type="button"
              onClick={() => toggleUtilityPopover("search")}
              className={`inline-flex size-[42px] items-center justify-center rounded-[10px] transition-colors ${
                activeUtility === "search"
                  ? "bg-[#27314f] text-white"
                  : `${textColor} hover:bg-white/10`
              }`}
              aria-label="Search"
              aria-expanded={activeUtility === "search"}
            >
              <Search className="size-[18px] stroke-[2.2]" />
            </button>

            {/* Meet dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setActiveDropdown(null)
                  setActiveUtility(null)
                  setMeetMenuOpen((v) => !v)
                }}
                className={`flex items-center gap-1 rounded-md px-3 py-2 text-[14px] font-medium transition-colors hover:bg-white/10 ${textColor}`}
                aria-haspopup="menu"
                aria-expanded={meetMenuOpen}
              >
                <span>Meet</span>
                <ChevronDown
                  className={`size-4 opacity-70 transition-transform ${
                    meetMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {meetMenuOpen ? (
                <div className="absolute top-full left-0 mt-1.5 w-52 rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
                  {meetLinks.map((link) =>
                    link.host ? (
                      <button
                        key={link.label}
                        type="button"
                        onClick={hostMeeting}
                        disabled={creatingMeeting}
                        className="block w-full rounded-md px-3 py-2 text-left text-[13px] font-medium text-[#0b124b] transition-colors hover:bg-[#f3f7ff] disabled:opacity-60"
                      >
                        {creatingMeeting ? "Creating meeting..." : link.label}
                      </button>
                    ) : (
                      <Link
                        key={link.label}
                        href={link.href}
                        onClick={() => setMeetMenuOpen(false)}
                        className="block rounded-md px-3 py-2 text-[13px] font-medium text-[#0b124b] transition-colors hover:bg-[#f3f7ff]"
                      >
                        {link.label}
                      </Link>
                    )
                  )}
                </div>
              ) : null}
            </div>

            {rightLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-1 rounded-md px-3 py-2 text-[14px] font-medium transition-colors hover:bg-white/10 ${textColor}`}
              >
                <span>{item.label}</span>
              </Link>
            ))}

            <Button
              className={`ml-1 h-10 rounded-lg px-5 text-[14px] font-semibold transition-colors ${
                isScrolled
                  ? "border border-[#c5d7f8] bg-white text-[#0b124b] hover:bg-[#f0f5ff]"
                  : "border border-white/40 bg-[#eef4ff] text-[#0b124b] hover:bg-white"
              }`}
            >
              Contact Sales
            </Button>

            <Button
              asChild
              className="h-10 rounded-lg bg-[#0b5cff] px-5 text-[14px] font-semibold text-white hover:bg-[#084bd8]"
            >
              <Link href="https://preview.zoom.com/en/products/whats-new/">
                What&apos;s New
              </Link>
            </Button>

            <button
              type="button"
              onClick={() => toggleUtilityPopover("user")}
              className="inline-flex size-[42px] items-center justify-center rounded-full bg-[#0b5cff] text-[13px] font-bold text-white shadow-sm"
              aria-label="Demo User profile"
              aria-expanded={activeUtility === "user"}
            >
              DU
            </button>

            {/* Grid / Apps */}
            <button
              type="button"
              onClick={() => toggleUtilityPopover("apps")}
              className={`inline-flex size-[42px] items-center justify-center rounded-[10px] transition-colors ${
                activeUtility === "apps"
                  ? "bg-[#27314f] text-white"
                  : `${textColor} hover:bg-white/10`
              }`}
              aria-label="Apps"
              aria-expanded={activeUtility === "apps"}
            >
              <Grip className="size-[18px]" />
            </button>
          </div>

          {/* Tablet */}
          <div className="hidden items-center gap-2 md:flex lg:hidden">
            <button
              type="button"
              className={`inline-flex size-9 items-center justify-center rounded-full transition hover:bg-white/10 ${textColor}`}
              aria-label="Search"
            >
              <Search className="size-4 stroke-[2.2]" />
            </button>
            <span className="inline-flex size-8 items-center justify-center rounded-full bg-[#0b5cff] text-[12px] font-bold text-white">
              DU
            </span>
            <button
              type="button"
              onClick={() => {
                setActiveDropdown(null)
                setActiveUtility(null)
                setMobileMenuOpen((v) => !v)
              }}
              className={`inline-flex size-9 items-center justify-center rounded-full transition hover:bg-white/10 ${textColor}`}
              aria-label="Menu"
            >
              <Menu className="size-4" />
            </button>
          </div>

          {/* Mobile */}
          <button
            type="button"
            onClick={() => {
              setActiveDropdown(null)
              setActiveUtility(null)
              setMobileMenuOpen((v) => !v)
            }}
            className={`inline-flex size-9 items-center justify-center rounded-full transition hover:bg-white/10 ${textColor} md:hidden`}
            aria-label="Menu"
          >
            <Menu className="size-4" />
          </button>
        </div>

        {activeDropdown ? (
          <div className="absolute top-[82px] left-1/2 z-50 hidden -translate-x-1/2 lg:block">
            {activeDropdown === "products" ? (
              <div className="w-[min(1512px,calc(100vw-408px))]">
                <NavbarProductsDropdown />
              </div>
            ) : null}
            {activeDropdown === "ai" ? (
              <div className="w-[min(1512px,calc(100vw-408px))]">
                <NavbarAiDropdown />
              </div>
            ) : null}
            {activeDropdown === "solutions" ? (
              <div className="w-[min(1080px,calc(100vw-220px))]">
                <NavbarSolutionsDropdown />
              </div>
            ) : null}
          </div>
        ) : null}

        {activeUtility === "search" ? (
          <div className="absolute top-[92px] left-1/2 z-50 hidden w-[min(1680px,calc(100vw-240px))] -translate-x-1/2 lg:block">
            <NavbarSearchPopover />
          </div>
        ) : null}

        {activeUtility === "user" ? (
          <div className="absolute top-[78px] right-[112px] z-50 hidden w-[280px] lg:block">
            <NavbarUserMenu onClose={() => setActiveUtility(null)} />
          </div>
        ) : null}

        {activeUtility === "apps" ? (
          <div className="absolute top-[82px] right-[58px] z-50 hidden w-[400px] lg:block">
            <NavbarAppsMenu />
          </div>
        ) : null}

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div
            className={`border-t lg:hidden ${
              isScrolled
                ? "border-slate-200 bg-white"
                : "border-white/10 bg-[#07124e]"
            }`}
          >
            <nav className="flex flex-col px-4 py-2.5">
              {[...leftLinks, ...rightLinks].map((item) => {
                return (
                  <Link
                    key={item.label}
                    href={"href" in item ? item.href : "#"}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-[14px] font-medium transition-colors hover:bg-white/10 ${textColor}`}
                  >
                    {"icon" in item && item.icon === "ai" ? (
                      <img
                        src={aiCompanionIcon.src}
                        alt=""
                        aria-hidden="true"
                        className="size-4"
                      />
                    ) : null}
                    <span>{item.label}</span>
                    {"hasChevron" in item && item.hasChevron ? (
                      <ChevronDown className="ml-auto size-4 opacity-60" />
                    ) : null}
                  </Link>
                )
              })}
              <div className="mt-1 px-3 pb-1">
                <p className={`mb-1.5 text-xs font-semibold ${textColor}`}>Meet</p>
                <div className="flex flex-col gap-1">
                  {meetLinks.map((link) =>
                    link.host ? (
                      <button
                        key={link.label}
                        type="button"
                        onClick={hostMeeting}
                        disabled={creatingMeeting}
                        className={`rounded-lg px-3 py-2 text-left text-[13px] font-medium transition-colors hover:bg-white/10 disabled:opacity-60 ${textColor}`}
                      >
                        {creatingMeeting ? "Creating meeting..." : link.label}
                      </button>
                    ) : (
                      <Link
                        key={link.label}
                        href={link.href}
                        className={`rounded-lg px-3 py-2 text-[13px] font-medium transition-colors hover:bg-white/10 ${textColor}`}
                      >
                        {link.label}
                      </Link>
                    )
                  )}
                </div>
              </div>
              <div className="mt-2.5 flex flex-col gap-2 border-t border-white/10 pt-2.5">
                <Button
                  className={`h-10 rounded-lg text-[13px] font-semibold ${
                    isScrolled
                      ? "border border-[#c5d7f8] bg-white text-[#0b124b]"
                      : "border border-white/40 bg-[#eef4ff] text-[#0b124b]"
                  }`}
                >
                  Contact Sales
                </Button>
                <Button
                  asChild
                  className="h-10 rounded-lg bg-[#0b5cff] text-[13px] font-semibold text-white hover:bg-[#084bd8]"
                >
                  <Link href="https://preview.zoom.com/en/products/whats-new/">
                    What&apos;s New
                  </Link>
                </Button>
                <div
                  className={`flex items-center gap-2 px-1 text-[13px] font-semibold ${textColor}`}
                >
                  <span className="inline-flex size-8 items-center justify-center rounded-full bg-[#0b5cff] text-[12px] font-bold text-white">
                    DU
                  </span>
                  Demo User
                </div>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  )
}
