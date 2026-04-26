"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-4" />
        ),
        info: (
          <InfoIcon className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4" />
        ),
        error: (
          <OctagonXIcon className="size-4" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "#ffffff",
          "--normal-text": "#0b124b",
          "--normal-border": "#c5d7f8",
          "--success-bg": "#ffffff",
          "--success-text": "#0b124b",
          "--success-border": "#b9d3ff",
          "--border-radius": "10px",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast shadow-[0_16px_40px_rgba(15,23,42,0.16)]",
          title: "text-[#0b124b] font-semibold",
          description: "text-[#4d5263]",
          success: "text-[#0b5cff] [&_[data-icon]]:text-[#0b5cff]",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
