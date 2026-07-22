import type { Observation } from '../api/client'
import { formatRelativeTime, typeBadgeClass, typeInitial } from '../lib/format'

interface ObservationCardProps {
  observation: Observation
  onSelect: (id: number) => void
}

function truncate(content: string, max = 200): string {
  if (content.length <= max) return content
  return `${content.slice(0, max)}...`
}

export function ObservationCard({ observation, onSelect }: ObservationCardProps) {
  return (
    <article
      class="cursor-pointer p-4 hover:bg-gray-50"
      onClick={() => onSelect(observation.id)}
    >
      <header class="flex items-start gap-3">
        <span
          class={`flex h-10 w-10 shrink-0 items-center justify-center text-sm font-bold ${typeBadgeClass(observation.type)}`}
        >
          {typeInitial(observation.type)}
        </span>
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2">
            <span class="truncate font-semibold text-black">{observation.project || 'unscoped'}</span>
            {observation.pinned && <span class="shrink-0" title="pinned">📌</span>}
          </div>
          <div class="flex items-center gap-1.5 text-xs text-gray-500">
            <span>{observation.type}</span>
            <span>·</span>
            <time>{formatRelativeTime(observation.created_at)}</time>
          </div>
        </div>
      </header>

      <div class="mt-3">
        <p class="font-semibold text-black">{observation.title}</p>
        <p class="mt-1 text-sm text-gray-600">{truncate(observation.content)}</p>
      </div>

      <footer class="mt-3 flex items-center justify-between gap-2">
        {observation.topic_key ? (
          <span class="rounded-lg bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
            #{observation.topic_key}
          </span>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onSelect(observation.id)
          }}
          class="cursor-pointer text-sm font-medium text-black hover:underline"
        >
          Ver detalle →
        </button>
      </footer>
    </article>
  )
}
