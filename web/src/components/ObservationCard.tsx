import type { Observation } from '../api/client'
import { formatRelativeTime, truncate, typeBadgeClass, typeInitial } from '../lib/format'
import { Markdown } from './Markdown'

interface ObservationCardProps {
  observation: Observation
  onSelect: (id: number) => void
}

function topicTags(topicKey: string): string[] {
  return topicKey.split('/').filter(Boolean)
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
            class="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] text-white ring-2 ring-paper"
          >
            ★
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

        {observation.topic_key && (
          <div class="mt-2.5 flex flex-wrap items-center gap-1.5">
            {topicTags(observation.topic_key).map((tag) => (
              <span key={tag} class="rounded-full bg-canvas px-2.5 py-0.5 text-xs text-ash">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}
