"use client"

import { Download } from "lucide-react"

export function NavbarUserMenu({ onClose }: { onClose: () => void }) {
  return (
    <div className="rounded-[21px] bg-white p-3 text-[#00083d] shadow-[0_24px_60px_rgba(0,0,0,0.24)]">
      <div className="flex h-[66px] items-center gap-3 rounded-[10px] bg-[#f3f7ff] px-3">
        <span className="flex size-10 items-center justify-center rounded-full bg-[#0b5cff] text-[14px] font-semibold text-white">
          DU
        </span>
        <span className="text-[18px] font-bold">Demo User</span>
      </div>

      <nav className="mt-5 px-3 text-[16px] font-semibold">
        {["Settings", "Add Account", "Web App", "Sign Out"].map((item) => (
          <a
            key={item}
            href="#"
            className="block border-b border-[#d5d5d5] py-[10px] last:border-b-0"
          >
            {item}
          </a>
        ))}
      </nav>

      <a
        href="#"
        className="mt-[48px] flex h-[59px] items-center gap-3 rounded-[10px] bg-[#e8f1ff] px-5 text-[12px]"
      >
        <span className="flex size-5 items-center justify-center rounded-[4px] bg-[#0b5cff] text-white">
          <Download className="size-3.5" />
        </span>
        <span>
          Install on desktop
          <br />
          <strong className="text-[15px]">Download center</strong>
        </span>
      </a>
    </div>
  )
}
