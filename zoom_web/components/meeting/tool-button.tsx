"use client"

export function ToolButton({
  icon: Icon,
  label,
  onClick,
  active = false,
  danger = false,
  green = false,
  badge = 0,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  onClick: () => void
  active?: boolean
  danger?: boolean
  green?: boolean
  badge?: number
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-w-16 flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-white ${active ? "bg-white/12" : "hover:bg-white/10"}`}
    >
      <span className={`relative ${green ? "rounded-md bg-[#58ee87] p-1 text-black" : danger ? "text-[#ff5b5b]" : ""}`}>
        <Icon className="size-7" />
        {badge > 0 ? (
          <span className="absolute -top-2 -right-2 flex min-w-5 items-center justify-center rounded-full bg-[#ff3b30] px-1.5 text-[11px] font-bold leading-5 text-white ring-2 ring-black">
            {badge > 99 ? "99+" : badge}
          </span>
        ) : null}
      </span>
      <span className="text-base leading-tight">{label}</span>
    </button>
  )
}
