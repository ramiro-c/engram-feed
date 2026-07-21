import type { Observation } from '../api/client'

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
    <article class="observation-card" onClick={() => onSelect(observation.id)}>
      <header>
        <h3>{observation.title}</h3>
        {observation.pinned && <span class="pin-badge">pinned</span>}
      </header>
      <div class="observation-meta">
        <span class="badge">{observation.type}</span>
        {observation.project && <span class="badge">{observation.project}</span>}
        {observation.topic_key && <span class="badge">{observation.topic_key}</span>}
        <time>{observation.created_at}</time>
      </div>
      <p class="observation-preview">{truncate(observation.content)}</p>
    </article>
  )
}
