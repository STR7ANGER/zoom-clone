"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import {
  ChevronDown,
  Grip,
  Menu,
  Search,
  Sparkles,
  type LucideIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"

const leftLinks = [
  { label: "Products", hasChevron: true },
  { label: "AI", hasChevron: true, icon: Sparkles },
  { label: "Solutions", hasChevron: true },
  { label: "Pricing" },
]

const rightLinks = [
  { label: "Sign In", href: "/sign-in" },
  { label: "Support", href: "#" },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [meetMenuOpen, setMeetMenuOpen] = useState(false)

  const meetLinks = [
    { label: "Join a meeting", href: "/join" },
    { label: "Host a meeting", href: "/myhome" },
    { label: "Schedule a meeting", href: "/schedule" },
  ]

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const textColor = isScrolled ? "text-[#0b124b]" : "text-white"
  const logoColor = isScrolled ? "text-[#2467f4]" : "text-white"
  const aiIconColor = isScrolled ? "text-[#4774ff]" : "text-[#8db0ff]"

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "border-b border-slate-200/80 bg-white/95 shadow-[0_10px_28px_rgba(15,23,42,0.08)] backdrop-blur"
            : "border-b border-transparent bg-[linear-gradient(180deg,#050a2f_0%,#07124e_100%)]"
        }`}
      >
        <div className="flex h-[60px] w-full items-center justify-between px-4 sm:px-5 lg:px-7 xl:px-8">
          {/* Left: Logo + Nav */}
          <div className="flex items-center gap-4 lg:gap-6">
            {/* Logo */}
            <a
              href="#"
              className="shrink-0"
              aria-label="Zoom home"
            >
              <img
                src={
                  isScrolled
                    ? "https://st1.zoom.us/homepage/20260413-1449/primary/dist/assets/zoommedia/logo-zoom@2x.png"
                    : "https://st1.zoom.us/homepage/20260413-1449/primary/dist/assets/zoommedia/logo-zoom-white@2x.png"
                }
                alt="Zoom"
                className="h-7 w-auto"
              />
            </a>

            {/* Desktop nav links */}
            <nav className="hidden items-center gap-0.5 lg:flex">
              {leftLinks.map((item) => {
                const Icon = item.icon
                return (
                  <a
                    key={item.label}
                    href="#"
                    className={`flex items-center gap-1 rounded-md px-2.5 py-1.5 text-[13.5px] font-medium transition-colors hover:bg-white/10 ${textColor}`}
                  >
                    {Icon ? (
                      <Icon className={`size-3.5 ${aiIconColor}`} />
                    ) : null}
                    <span>{item.label}</span>
                    {item.hasChevron ? (
                      <ChevronDown className="size-3.5 opacity-70" />
                    ) : null}
                  </a>
                )
              })}
            </nav>
          </div>

          {/* Right: actions */}
          <div className="hidden shrink-0 items-center gap-1 lg:flex">
            {/* Search */}
            <button
              type="button"
              className={`inline-flex size-8 items-center justify-center rounded-full transition-colors hover:bg-white/10 ${textColor}`}
              aria-label="Search"
            >
              <Search className="size-4 stroke-[2.2]" />
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setMeetMenuOpen((v) => !v)}
                className={`flex items-center gap-1 rounded-md px-2.5 py-1.5 text-[13.5px] font-medium transition-colors hover:bg-white/10 ${textColor}`}
                aria-haspopup="menu"
                aria-expanded={meetMenuOpen}
              >
                <span>Meet</span>
                <ChevronDown
                  className={`size-3.5 opacity-70 transition-transform ${meetMenuOpen ? "rotate-180" : ""}`}
                />
              </button>
              {meetMenuOpen ? (
                <div className="absolute top-full left-0 mt-1.5 w-52 rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
                  {meetLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setMeetMenuOpen(false)}
                      className="block rounded-md px-3 py-2 text-[13px] font-medium text-[#0b124b] transition-colors hover:bg-[#f3f7ff]"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>

            {rightLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-1 rounded-md px-2.5 py-1.5 text-[13.5px] font-medium transition-colors hover:bg-white/10 ${textColor}`}
              >
                <span>{item.label}</span>
              </Link>
            ))}

            {/* Contact Sales */}
            <Button
              className={`ml-1.5 h-9 rounded-lg px-4 text-[13px] font-semibold transition-colors ${
                isScrolled
                  ? "border border-[#c5d7f8] bg-white text-[#0b124b] hover:bg-[#f0f5ff]"
                  : "border border-white/40 bg-transparent text-white hover:bg-white/10"
              }`}
            >
              Contact Sales
            </Button>

            {/* Sign Up Free */}
            <Button
              asChild
              className="h-9 rounded-lg bg-[#2d8cff] px-4 text-[13px] font-semibold text-white hover:bg-[#1e7af1]"
            >
              <Link href="/sign-up">Sign Up Free</Link>
            </Button>

            {/* Grid / Apps */}
            <button
              type="button"
              className={`inline-flex size-8 items-center justify-center rounded-full transition-colors hover:bg-white/10 ${textColor}`}
              aria-label="Apps"
            >
              <Grip className="size-4" />
            </button>
          </div>

          {/* Tablet: search + sign up + hamburger */}
          <div className="hidden items-center gap-2 md:flex lg:hidden">
            <button
              type="button"
              className={`inline-flex size-9 items-center justify-center rounded-full transition hover:bg-white/10 ${textColor}`}
              aria-label="Search"
            >
              <Search className="size-4 stroke-[2.2]" />
            </button>
            <Button
              asChild
              className="h-9 rounded-lg bg-[#2467f4] px-3.5 text-[13px] font-semibold text-white hover:bg-[#1e57d1]"
            >
              <Link href="/sign-up">Sign Up</Link>
            </Button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className={`inline-flex size-9 items-center justify-center rounded-full transition hover:bg-white/10 ${textColor}`}
              aria-label="Menu"
            >
              <Menu className="size-4" />
            </button>
          </div>

          {/* Mobile: hamburger only */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            className={`inline-flex size-9 items-center justify-center rounded-full transition hover:bg-white/10 ${textColor} md:hidden`}
            aria-label="Menu"
          >
            <Menu className="size-4" />
          </button>
        </div>

        {/* Mobile dropdown menu */}
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
                const Icon = ("icon" in item ? item.icon : undefined) as
                  | LucideIcon
                  | undefined
                return (
                  <Link
                    key={item.label}
                    href={"href" in item ? item.href : "#"}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-[14px] font-medium transition-colors hover:bg-white/10 ${textColor}`}
                  >
                    {Icon ? <Icon className={`size-4 ${aiIconColor}`} /> : null}
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
                  {meetLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className={`rounded-lg px-3 py-2 text-[13px] font-medium transition-colors hover:bg-white/10 ${textColor}`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="mt-2.5 flex flex-col gap-2 border-t border-white/10 pt-2.5">
                <Button
                  className={`h-10 rounded-lg text-[13px] font-semibold ${
                    isScrolled
                      ? "border border-[#c5d7f8] bg-white text-[#0b124b]"
                      : "border border-white/40 bg-transparent text-white"
                  }`}
                >
                  Contact Sales
                </Button>
                <Button
                  asChild
                  className="h-10 rounded-lg bg-[#2d8cff] text-[13px] font-semibold text-white hover:bg-[#1e7af1]"
                >
                  <Link href="/sign-up">Sign Up Free</Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  )
}
