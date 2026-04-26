export function extractMeetingId(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return ""

  try {
    const url = new URL(trimmed)
    const fromQuery = url.searchParams.get("meeting")
    if (fromQuery) return fromQuery.replace(/\D/g, "")
    const roomMatch = url.pathname.match(/\/meeting\/(\d+)/)
    if (roomMatch?.[1]) return roomMatch[1]
  } catch {
    // Plain meeting IDs are expected here.
  }

  return trimmed.replace(/\D/g, "")
}

export function formatMeetingTime(value: string) {
  const normalized = /(?:z|[+-]\d{2}:?\d{2})$/i.test(value) ? value : `${value}Z`
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(normalized))
}
