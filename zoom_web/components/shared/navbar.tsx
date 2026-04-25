"use client"

import { useEffect, useState } from "react"
import { ChevronDown, Grip, Menu, Search, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"

const leftLinks = [
  { label: "Products", hasChevron: true },
  { label: "AI", hasChevron: true, icon: Sparkles },
  { label: "Solutions", hasChevron: true },
  { label: "Pricing" },
]

const rightLinks = [
  { label: "Meet", hasChevron: true },
  { label: "Sign In" },
  { label: "Support" },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
        <div className="flex h-[68px] w-full items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-10">
          {/* Left: Logo + Nav */}
          <div className="flex items-center gap-6 lg:gap-8">
            {/* Logo */}
            <a
              href="#"
              className={`shrink-0 text-[32px] leading-none font-bold tracking-[-0.06em] ${logoColor}`}
            >
              zoom
            </a>

            {/* Desktop nav links */}
            <nav className="hidden items-center gap-1 lg:flex">
              {leftLinks.map((item) => {
                const Icon = item.icon
                return (
                  <a
                    key={item.label}
                    href="#"
                    className={`flex items-center gap-1 rounded-md px-3 py-2 text-[14.5px] font-medium transition-colors hover:bg-white/10 ${textColor}`}
                  >
                    {Icon ? <Icon className={`size-3.5 ${aiIconColor}`} /> : null}
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
              className={`inline-flex size-9 items-center justify-center rounded-full transition-colors hover:bg-white/10 ${textColor}`}
              aria-label="Search"
            >
              <Search className="size-[18px] stroke-[2.2]" />
            </button>

            {rightLinks.map((item) => (
              <a
                key={item.label}
                href="#"
                className={`flex items-center gap-1 rounded-md px-3 py-2 text-[14.5px] font-medium transition-colors hover:bg-white/10 ${textColor}`}
              >
                <span>{item.label}</span>
                {item.hasChevron ? (
                  <ChevronDown className="size-3.5 opacity-70" />
                ) : null}
              </a>
            ))}

            {/* Contact Sales */}
            <Button
              className={`ml-2 h-10 rounded-xl px-5 text-[14px] font-semibold transition-colors ${
                isScrolled
                  ? "border border-[#c5d7f8] bg-white text-[#0b124b] hover:bg-[#f0f5ff]"
                  : "border border-white/40 bg-transparent text-white hover:bg-white/10"
              }`}
            >
              Contact Sales
            </Button>

            {/* Sign Up Free */}
            <Button className="h-10 rounded-xl bg-[#2d8cff] px-5 text-[14px] font-semibold text-white hover:bg-[#1e7af1]">
              Sign Up Free
            </Button>

            {/* Grid / Apps */}
            <button
              type="button"
              className={`inline-flex size-9 items-center justify-center rounded-full transition-colors hover:bg-white/10 ${textColor}`}
              aria-label="Apps"
            >
              <Grip className="size-[18px]" />
            </button>
          </div>

          {/* Tablet: search + sign up + hamburger */}
          <div className="hidden items-center gap-2 md:flex lg:hidden">
            <button
              type="button"
              className={`inline-flex size-10 items-center justify-center rounded-full transition hover:bg-white/10 ${textColor}`}
              aria-label="Search"
            >
              <Search className="size-5 stroke-[2.2]" />
            </button>
            <Button className="h-9 rounded-xl bg-[#2467f4] px-4 text-sm font-semibold text-white hover:bg-[#1e57d1]">
              Sign Up
            </Button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className={`inline-flex size-10 items-center justify-center rounded-full transition hover:bg-white/10 ${textColor}`}
              aria-label="Menu"
            >
              <Menu className="size-5" />
            </button>
          </div>

          {/* Mobile: hamburger only */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            className={`inline-flex size-10 items-center justify-center rounded-full transition hover:bg-white/10 ${textColor} md:hidden`}
            aria-label="Menu"
          >
            <Menu className="size-5" />
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div
            className={`border-t lg:hidden ${
              isScrolled ? "border-slate-200 bg-white" : "border-white/10 bg-[#07124e]"
            }`}
          >
            <nav className="flex flex-col px-4 py-3">
              {[...leftLinks, ...rightLinks].map((item) => {
                const Icon = "icon" in item ? item.icon : undefined
                return (
                  <a
                    key={item.label}
                    href="#"
                    className={`flex items-center gap-2 rounded-lg px-3 py-3 text-[15px] font-medium transition-colors hover:bg-white/10 ${textColor}`}
                  >
                    {Icon ? <Icon className={`size-4 ${aiIconColor}`} /> : null}
                    <span>{item.label}</span>
                    {item.hasChevron ? (
                      <ChevronDown className="ml-auto size-4 opacity-60" />
                    ) : null}
                  </a>
                )
              })}
              <div className="mt-3 flex flex-col gap-2 border-t border-white/10 pt-3">
                <Button
                  className={`h-11 rounded-xl text-sm font-semibold ${
                    isScrolled
                      ? "border border-[#c5d7f8] bg-white text-[#0b124b]"
                      : "border border-white/40 bg-transparent text-white"
                  }`}
                >
                  Contact Sales
                </Button>
                <Button className="h-11 rounded-xl bg-[#2d8cff] text-sm font-semibold text-white hover:bg-[#1e7af1]">
                  Sign Up Free
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  )
}