import type { Observation } from '../api/client'
import { ObservationCard } from './ObservationCard'

interface FeedListProps {
  items: Observation[]
  onSelect: (id: number) => void
}

export function FeedList({ items, onSelect }: FeedListProps) {
  if (items.length === 0) {
    return <p class="feed-empty">No observations match the current filters.</p>
  }

  return (
    <div class="feed-list">
      {items.map((item) => (
        <ObservationCard key={item.id} observation={item} onSelect={onSelect} />
      ))}
    </div>
  )
}
