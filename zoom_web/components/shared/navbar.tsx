"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { ChevronDown, Grip, LogOut, Menu, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { NavbarAiDropdown } from "@/components/shared/navbar-ai-dropdown"
import { NavbarAppsMenu } from "@/components/shared/navbar-apps-menu"
import { NavbarProductsDropdown } from "@/components/shared/navbar-products-dropdown"
import { NavbarSearchPopover } from "@/components/shared/navbar-search-popover"
import { NavbarSolutionsDropdown } from "@/components/shared/navbar-solutions-dropdown"
import { createInstantMeeting } from "@/lib/api"
import { initials, useAuthStore } from "@/lib/auth-store"
import aiCompanionIcon from "@/components/shared/ai-companion-icon.svg"

const leftLinks = [
  { label: "Products", hasChevron: true },
  { label: "AI", hasChevron: true, icon: "ai" as const },
  { label: "Solutions", hasChevron: true },
  { label: "Pricing" },
]

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
  const token = useAuthStore((state) => state.token)
  const user = useAuthStore((state) => state.user)
  const signOut = useAuthStore((state) => state.signOut)
  const isSignedIn = Boolean(token && user)

  const meetLinks = [
    { label: "Join a meeting", href: "/join", protected: false },
    { label: "Host a meeting", href: "/myhome", protected: true, host: true },
    { label: "Schedule a meeting", href: "/schedule", protected: true },
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

  function goProtected(path: string) {
    setMeetMenuOpen(false)
    setMobileMenuOpen(false)
    router.push(isSignedIn ? path : `/signin?next=${encodeURIComponent(path)}`)
  }

  async function hostMeeting() {
    if (creatingMeeting) return
    if (!isSignedIn) {
      goProtected("/myhome")
      return
    }
    setCreatingMeeting(true)
    try {
      const { meeting, participant } = await createInstantMeeting()
      setMeetMenuOpen(false)
      setMobileMenuOpen(false)
      router.push(`/meeting/${meeting.meeting_id}?participantId=${participant.participant_id}`)
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
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "border-b border-slate-200/80 bg-white/95 shadow-[0_10px_28px_rgba(15,23,42,0.08)] backdrop-blur"
          : "border-b border-transparent bg-[linear-gradient(180deg,#050a2f_0%,#07124e_100%)]"
      }`}
    >
      <div className="flex h-[66px] w-full items-center justify-between px-4 sm:px-5 lg:px-6 xl:px-7">
        <div className="flex items-center gap-4 lg:gap-5">
          <Link href="/" className="shrink-0" aria-label="Zoom home">
            <img
              src={
                isScrolled
                  ? "https://st1.zoom.us/homepage/20260413-1449/primary/dist/assets/zoommedia/logo-zoom@2x.png"
                  : "https://st1.zoom.us/homepage/20260413-1449/primary/dist/assets/zoommedia/logo-zoom-white@2x.png"
              }
              alt="Zoom"
              className="h-[30px] w-auto"
            />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            <button type="button" onClick={() => toggleDesktopDropdown("products")} className={`flex items-center gap-1 rounded-[9px] px-3 py-2 text-[14px] font-medium transition-colors ${activeDropdown === "products" ? "bg-[#27314f] text-white" : `${textColor} hover:bg-white/10`}`} aria-expanded={activeDropdown === "products"}>
              Products <ChevronDown className={`size-4 opacity-80 transition-transform ${activeDropdown === "products" ? "rotate-180" : ""}`} />
            </button>
            <button type="button" onClick={() => toggleDesktopDropdown("ai")} className={`flex items-center gap-1 rounded-[9px] px-3 py-2 text-[14px] font-medium transition-colors ${activeDropdown === "ai" ? "bg-[#27314f] text-white" : `${textColor} hover:bg-white/10`}`} aria-expanded={activeDropdown === "ai"}>
              <img src={aiCompanionIcon.src} alt="" aria-hidden="true" className="size-4" /> AI <ChevronDown className={`size-4 opacity-80 transition-transform ${activeDropdown === "ai" ? "rotate-180" : ""}`} />
            </button>
            <button type="button" onClick={() => toggleDesktopDropdown("solutions")} className={`flex items-center gap-1 rounded-[9px] px-3 py-2 text-[14px] font-medium transition-colors ${activeDropdown === "solutions" ? "bg-[#27314f] text-white" : `${textColor} hover:bg-white/10`}`} aria-expanded={activeDropdown === "solutions"}>
              Solutions <ChevronDown className={`size-4 opacity-80 transition-transform ${activeDropdown === "solutions" ? "rotate-180" : ""}`} />
            </button>
            <a href="#" className={`flex items-center rounded-md px-3 py-2 text-[14px] font-medium transition-colors hover:bg-white/10 ${textColor}`}>Pricing</a>
          </nav>
        </div>

        <div className="hidden shrink-0 items-center gap-1.5 lg:flex">
          <button type="button" onClick={() => toggleUtilityPopover("search")} className={`inline-flex size-[42px] items-center justify-center rounded-[10px] transition-colors ${activeUtility === "search" ? "bg-[#27314f] text-white" : `${textColor} hover:bg-white/10`}`} aria-label="Search" aria-expanded={activeUtility === "search"}>
            <Search className="size-[18px] stroke-[2.2]" />
          </button>

          <div className="relative">
            <button type="button" onClick={() => { setActiveDropdown(null); setActiveUtility(null); setMeetMenuOpen((v) => !v) }} className={`flex items-center gap-1 rounded-md px-3 py-2 text-[14px] font-medium transition-colors hover:bg-white/10 ${textColor}`} aria-haspopup="menu" aria-expanded={meetMenuOpen}>
              <span>Meet</span>
              <ChevronDown className={`size-4 opacity-70 transition-transform ${meetMenuOpen ? "rotate-180" : ""}`} />
            </button>
            {meetMenuOpen ? (
              <div className="absolute top-full left-0 mt-1.5 w-52 rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
                {meetLinks.map((link) =>
                  link.host ? (
                    <button key={link.label} type="button" onClick={hostMeeting} disabled={creatingMeeting} className="block w-full rounded-md px-3 py-2 text-left text-[13px] font-medium text-[#0b124b] transition-colors hover:bg-[#f3f7ff] disabled:opacity-60">
                      {creatingMeeting ? "Creating meeting..." : link.label}
                    </button>
                  ) : link.protected ? (
                    <button key={link.label} type="button" onClick={() => goProtected(link.href)} className="block w-full rounded-md px-3 py-2 text-left text-[13px] font-medium text-[#0b124b] transition-colors hover:bg-[#f3f7ff]">
                      {link.label}
                    </button>
                  ) : (
                    <Link key={link.label} href={link.href} onClick={() => setMeetMenuOpen(false)} className="block rounded-md px-3 py-2 text-[13px] font-medium text-[#0b124b] transition-colors hover:bg-[#f3f7ff]">
                      {link.label}
                    </Link>
                  ),
                )}
              </div>
            ) : null}
          </div>

          {!isSignedIn ? (
            <Link href="/signin" className={`flex items-center rounded-md px-3 py-2 text-[14px] font-medium transition-colors hover:bg-white/10 ${textColor}`}>
              Sign In
            </Link>
          ) : null}
          <Link href="#" className={`flex items-center rounded-md px-3 py-2 text-[14px] font-medium transition-colors hover:bg-white/10 ${textColor}`}>Support</Link>

          <Button className={`ml-1 h-10 rounded-lg px-5 text-[14px] font-semibold transition-colors ${isScrolled ? "border border-[#c5d7f8] bg-white text-[#0b124b] hover:bg-[#f0f5ff]" : "border border-white/40 bg-[#eef4ff] text-[#0b124b] hover:bg-white"}`}>Contact Sales</Button>

          <Button asChild className="h-10 rounded-lg bg-[#0b5cff] px-5 text-[14px] font-semibold text-white hover:bg-[#084bd8]">
            <Link href={isSignedIn ? "/myhome" : "/signup"}>{isSignedIn ? "My Account" : "Sign Up Free"}</Link>
          </Button>

          {isSignedIn ? (
            <button type="button" onClick={() => toggleUtilityPopover("user")} className="inline-flex size-[42px] items-center justify-center overflow-hidden rounded-full bg-[#0b5cff] text-[13px] font-bold text-white shadow-sm" aria-label={`${user?.name} profile`} aria-expanded={activeUtility === "user"}>
              {user?.avatar_url ? <img src={user.avatar_url} alt="" className="size-full object-cover" /> : initials(user?.name ?? "")}
            </button>
          ) : null}

          <button type="button" onClick={() => toggleUtilityPopover("apps")} className={`inline-flex size-[42px] items-center justify-center rounded-[10px] transition-colors ${activeUtility === "apps" ? "bg-[#27314f] text-white" : `${textColor} hover:bg-white/10`}`} aria-label="Apps" aria-expanded={activeUtility === "apps"}>
            <Grip className="size-[18px]" />
          </button>
        </div>

        <div className="hidden items-center gap-2 md:flex lg:hidden">
          <button type="button" className={`inline-flex size-9 items-center justify-center rounded-full transition hover:bg-white/10 ${textColor}`} aria-label="Search">
            <Search className="size-4 stroke-[2.2]" />
          </button>
          {isSignedIn ? (
            <span className="inline-flex size-8 items-center justify-center overflow-hidden rounded-full bg-[#0b5cff] text-[12px] font-bold text-white">
              {user?.avatar_url ? <img src={user.avatar_url} alt="" className="size-full object-cover" /> : initials(user?.name ?? "")}
            </span>
          ) : (
            <Link href="/signin" className={`text-[13px] font-semibold ${textColor}`}>Sign In</Link>
          )}
          <button type="button" onClick={() => { setActiveDropdown(null); setActiveUtility(null); setMobileMenuOpen((v) => !v) }} className={`inline-flex size-9 items-center justify-center rounded-full transition hover:bg-white/10 ${textColor}`} aria-label="Menu">
            <Menu className="size-4" />
          </button>
        </div>

        <button type="button" onClick={() => { setActiveDropdown(null); setActiveUtility(null); setMobileMenuOpen((v) => !v) }} className={`inline-flex size-9 items-center justify-center rounded-full transition hover:bg-white/10 ${textColor} md:hidden`} aria-label="Menu">
          <Menu className="size-4" />
        </button>
      </div>

      {activeDropdown ? (
        <div className="absolute top-[82px] left-1/2 z-50 hidden -translate-x-1/2 lg:block">
          {activeDropdown === "products" ? <div className="w-[min(1512px,calc(100vw-408px))]"><NavbarProductsDropdown /></div> : null}
          {activeDropdown === "ai" ? <div className="w-[min(1512px,calc(100vw-408px))]"><NavbarAiDropdown /></div> : null}
          {activeDropdown === "solutions" ? <div className="w-[min(1080px,calc(100vw-220px))]"><NavbarSolutionsDropdown /></div> : null}
        </div>
      ) : null}

      {activeUtility === "search" ? <div className="absolute top-[92px] left-1/2 z-50 hidden w-[min(1680px,calc(100vw-240px))] -translate-x-1/2 lg:block"><NavbarSearchPopover /></div> : null}

      {activeUtility === "user" && isSignedIn ? (
        <div className="absolute top-[78px] right-[112px] z-50 hidden w-[280px] lg:block">
          <div className="rounded-xl bg-white p-4 text-[#0b124b] shadow-[0_24px_60px_rgba(0,0,0,0.24)]">
            <div className="flex items-center gap-3 border-b border-[#d9dce7] pb-3">
              <span className="inline-flex size-10 items-center justify-center overflow-hidden rounded-full bg-[#0b5cff] text-sm font-bold text-white">
                {user?.avatar_url ? <img src={user.avatar_url} alt="" className="size-full object-cover" /> : initials(user?.name ?? "")}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold">{user?.name}</p>
                <p className="truncate text-xs text-[#697089]">{user?.email}</p>
              </div>
            </div>
            <button type="button" onClick={() => { signOut(); setActiveUtility(null); router.push("/") }} className="mt-3 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold hover:bg-[#f3f7ff]">
              <LogOut className="size-4" /> Sign Out
            </button>
          </div>
        </div>
      ) : null}

      {activeUtility === "apps" ? <div className="absolute top-[82px] right-[58px] z-50 hidden w-[400px] lg:block"><NavbarAppsMenu /></div> : null}

      {mobileMenuOpen ? (
        <div className={`border-t lg:hidden ${isScrolled ? "border-slate-200 bg-white" : "border-white/10 bg-[#07124e]"}`}>
          <nav className="flex flex-col px-4 py-2.5">
            {[...leftLinks, { label: "Support", href: "#" }].map((item) => (
              <Link key={item.label} href={"href" in item ? item.href : "#"} className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-[14px] font-medium transition-colors hover:bg-white/10 ${textColor}`}>
                {"icon" in item && item.icon === "ai" ? <img src={aiCompanionIcon.src} alt="" aria-hidden="true" className="size-4" /> : null}
                <span>{item.label}</span>
                {"hasChevron" in item && item.hasChevron ? <ChevronDown className="ml-auto size-4 opacity-60" /> : null}
              </Link>
            ))}
            <div className="mt-1 px-3 pb-1">
              <p className={`mb-1.5 text-xs font-semibold ${textColor}`}>Meet</p>
              <div className="flex flex-col gap-1">
                {meetLinks.map((link) =>
                  link.host ? (
                    <button key={link.label} type="button" onClick={hostMeeting} disabled={creatingMeeting} className={`rounded-lg px-3 py-2 text-left text-[13px] font-medium transition-colors hover:bg-white/10 disabled:opacity-60 ${textColor}`}>
                      {creatingMeeting ? "Creating meeting..." : link.label}
                    </button>
                  ) : link.protected ? (
                    <button key={link.label} type="button" onClick={() => goProtected(link.href)} className={`rounded-lg px-3 py-2 text-left text-[13px] font-medium transition-colors hover:bg-white/10 ${textColor}`}>
                      {link.label}
                    </button>
                  ) : (
                    <Link key={link.label} href={link.href} className={`rounded-lg px-3 py-2 text-[13px] font-medium transition-colors hover:bg-white/10 ${textColor}`}>
                      {link.label}
                    </Link>
                  ),
                )}
              </div>
            </div>
            <div className="mt-2.5 flex flex-col gap-2 border-t border-white/10 pt-2.5">
              {!isSignedIn ? <Link href="/signin" className={`rounded-lg px-3 py-2 text-[13px] font-semibold transition-colors hover:bg-white/10 ${textColor}`}>Sign In</Link> : null}
              <Button className={`h-10 rounded-lg text-[13px] font-semibold ${isScrolled ? "border border-[#c5d7f8] bg-white text-[#0b124b]" : "border border-white/40 bg-[#eef4ff] text-[#0b124b]"}`}>Contact Sales</Button>
              <Button asChild className="h-10 rounded-lg bg-[#0b5cff] text-[13px] font-semibold text-white hover:bg-[#084bd8]">
                <Link href={isSignedIn ? "/myhome" : "/signup"}>{isSignedIn ? "My Account" : "Sign Up Free"}</Link>
              </Button>
              {isSignedIn ? (
                <button type="button" onClick={() => { signOut(); setMobileMenuOpen(false); router.push("/") }} className={`flex items-center gap-2 px-1 text-[13px] font-semibold ${textColor}`}>
                  <span className="inline-flex size-8 items-center justify-center overflow-hidden rounded-full bg-[#0b5cff] text-[12px] font-bold text-white">
                    {user?.avatar_url ? <img src={user.avatar_url} alt="" className="size-full object-cover" /> : initials(user?.name ?? "")}
                  </span>
                  Sign Out
                </button>
              ) : null}
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
