import type { Observation } from '../api/client'
import { formatRelativeTime, typeBadgeClass, typeInitial } from '../lib/format'
import { Markdown } from './Markdown'

interface ObservationCardProps {
  observation: Observation
  onSelect: (id: number) => void
}

function truncate(content: string, max = 200): string {
  if (content.length <= max) return content
  return `${content.slice(0, max)}...`
}

function topicTags(topicKey: string): string[] {
  return topicKey.split('/').filter(Boolean)
}

export function ObservationCard({ observation, onSelect }: ObservationCardProps) {
  return (
    <article class="hover:bg-gray-50 p-4 cursor-pointer" onClick={() => onSelect(observation.id)}>
      <header class="flex items-start gap-3">
        <span
          class={`flex h-10 w-10 shrink-0 items-center justify-center text-sm font-bold ${typeBadgeClass(observation.type)}`}
        >
          {typeInitial(observation.type)}
        </span>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <span class="font-semibold text-black truncate">{observation.project || 'unscoped'}</span>
            {observation.pinned && (
              <span class="shrink-0" title="pinned">
                📌
              </span>
            )}
          </div>
          <div class="flex items-center gap-1.5 text-gray-500 text-xs">
            <span>{observation.type}</span>
            <span>·</span>
            <time>{formatRelativeTime(observation.created_at)}</time>
          </div>
        </div>
      </header>

      <div class="mt-3">
        {/* <p class="font-semibold text-black">{observation.title}</p> */}
        <Markdown class="mt-1 text-gray-600" content={truncate(observation.content)} />
      </div>

      {observation.topic_key && (
        <footer class="flex flex-wrap items-center gap-1.5 mt-3">
          {topicTags(observation.topic_key).map((tag) => (
            <span key={tag} class="bg-gray-100 px-2 py-0.5 rounded-lg text-gray-600 text-xs">
              #{tag}
            </span>
          ))}
        </footer>
      )}
    </article>
  )
}
