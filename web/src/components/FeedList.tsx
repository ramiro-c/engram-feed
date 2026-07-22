import type { Observation } from '../api/client'
import { groupBySession } from '../lib/group'
import { ObservationCard } from './ObservationCard'
import { RelatedThread } from './RelatedThread'

interface FeedListProps {
  items: Observation[]
  onSelect: (id: number) => void
}

export function FeedList({ items, onSelect }: FeedListProps) {
  if (items.length === 0) {
    return (
      <p class="rounded-xl bg-paper py-10 text-center text-sm text-ash shadow-sm">
        No observations match the current filters.
      </p>
    )
  }

  const groups = groupBySession(items)

  return (
    <div class="divide-y divide-hairline rounded-xl bg-paper shadow-sm">
      {groups.map((group) => (
        <div key={group.primary.id}>
          <ObservationCard observation={group.primary} onSelect={onSelect} />
          {group.related.length > 0 && (
            <div class="px-4 pb-3">
              <RelatedThread items={group.related} onSelect={onSelect} />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
