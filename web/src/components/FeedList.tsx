import type { Observation } from '../api/client'
import { ObservationCard } from './ObservationCard'

interface FeedListProps {
  items: Observation[]
  onSelect: (id: number) => void
}

export function FeedList({ items, onSelect }: FeedListProps) {
  if (items.length === 0) {
    return (
      <p class="rounded-lg bg-white py-10 text-center text-sm text-gray-500 shadow-sm">
        No observations match the current filters.
      </p>
    )
  }

  return (
    <div class="divide-y divide-gray-100 rounded-lg bg-white shadow-sm">
      {items.map((item) => (
        <ObservationCard key={item.id} observation={item} onSelect={onSelect} />
      ))}
    </div>
  )
}
