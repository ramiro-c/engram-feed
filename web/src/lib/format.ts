export function formatRelativeTime(iso: string): string {
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return iso

  const diffMs = Date.now() - then
  const diffSec = Math.round(diffMs / 1000)

  if (diffSec < 5) return 'just now'
  if (diffSec < 60) return `${diffSec}s`
  const diffMin = Math.round(diffSec / 60)
  if (diffMin < 60) return `${diffMin}m`
  const diffHour = Math.round(diffMin / 60)
  if (diffHour < 24) return `${diffHour}h`
  const diffDay = Math.round(diffHour / 24)
  if (diffDay < 7) return `${diffDay}d`
  const diffWeek = Math.round(diffDay / 7)
  if (diffWeek < 5) return `${diffWeek}w`
  const diffMonth = Math.round(diffDay / 30)
  if (diffMonth < 12) return `${diffMonth}mo`
  const diffYear = Math.round(diffDay / 365)
  return `${diffYear}y`
}

const TYPE_BADGES: Record<string, string> = {
  architecture: 'bg-black text-white',
  decision: 'bg-gray-800 text-white',
  bugfix: 'bg-gray-700 text-white',
  discovery: 'bg-gray-600 text-white',
  pattern: 'bg-gray-500 text-white',
  config: 'bg-gray-100 text-gray-700',
  preference: 'bg-gray-100 text-gray-700',
  other: 'bg-gray-50 text-gray-500',
}

const FALLBACK_BADGES = [
  'bg-black text-white',
  'bg-gray-700 text-white',
  'bg-gray-100 text-gray-700',
  'bg-gray-50 text-gray-700',
]

export function typeBadgeClass(type: string): string {
  if (TYPE_BADGES[type]) return TYPE_BADGES[type]
  let hash = 0
  for (let i = 0; i < type.length; i++) {
    hash = (hash * 31 + type.charCodeAt(i)) >>> 0
  }
  return FALLBACK_BADGES[hash % FALLBACK_BADGES.length]
}

export function typeInitial(type: string): string {
  return type.charAt(0).toUpperCase() || '?'
}

export function truncate(content: string, max: number): string {
  if (content.length <= max) return content
  return `${content.slice(0, max)}...`
}
