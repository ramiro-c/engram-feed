import type { Observation } from '../api/client'

export interface ObservationGroup {
  primary: Observation
  related: Observation[]
}

/**
 * Items arrive newest-first. Within that order, the first observation seen
 * for a session_id becomes the thread head; later ones from the same
 * session are folded in as replies instead of repeating as standalone posts.
 */
export function groupBySession(items: Observation[]): ObservationGroup[] {
  const groups: ObservationGroup[] = []
  const bySession = new Map<string, ObservationGroup>()

  for (const item of items) {
    const existing = item.session_id ? bySession.get(item.session_id) : undefined
    if (existing) {
      existing.related.push(item)
      continue
    }
    const group: ObservationGroup = { primary: item, related: [] }
    groups.push(group)
    if (item.session_id) bySession.set(item.session_id, group)
  }

  return groups
}
