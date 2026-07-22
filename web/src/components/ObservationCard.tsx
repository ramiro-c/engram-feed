import { Pin } from 'lucide-preact'
import type { Observation } from '../api/client'
import { formatRelativeTime, truncate, typeBadgeClass, typeInitial } from '../lib/format'
import { Markdown } from './Markdown'
import { TopicTags } from './TopicTags'

interface ObservationCardProps {
  observation: Observation
  onSelect: (id: number) => void
}

export function ObservationCard({ observation, onSelect }: ObservationCardProps) {
  return (
    <article
      class="relative flex cursor-pointer gap-3 px-4 py-3.5 transition-colors hover:bg-canvas"
      onClick={() => onSelect(observation.id)}
    >
      <span
        class={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${typeBadgeClass(observation.type)}`}
      >
        {typeInitial(observation.type)}
        {observation.pinned && (
          <span
            title="Pinned"
            class="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-white ring-2 ring-paper"
          >
            <Pin class="h-2.5 w-2.5" fill="currentColor" strokeWidth={0} />
          </span>
        )}
      </span>

      <div class="min-w-0 flex-1">
        <div class="flex items-baseline gap-1.5 text-[15px] leading-snug">
          <span class="truncate font-bold text-ink">{observation.project || 'unscoped'}</span>
          <span class="shrink-0 text-ash">·</span>
          <span class="shrink-0 text-ash">{observation.type}</span>
          <span class="shrink-0 text-ash">·</span>
          <time class="shrink-0 text-ash">{formatRelativeTime(observation.created_at)}</time>
        </div>

        <Markdown class="mt-1 text-[14px] leading-relaxed text-ink/80" content={truncate(observation.content, 220)} />

        {observation.topic_key && <TopicTags class="mt-2.5" topicKey={observation.topic_key} />}
      </div>
    </article>
  )
}
