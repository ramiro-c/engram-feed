import { useState } from 'preact/hooks'
import type { ObservationFilters } from '../api/client'

interface FilterBarProps {
  projects: string[]
  types: string[]
  onApply: (filters: ObservationFilters) => void
  loading: boolean
}

export function FilterBar({ projects, types, onApply, loading }: FilterBarProps) {
  const [project, setProject] = useState('')
  const [type, setType] = useState('')
  const [topicKey, setTopicKey] = useState('')
  const [q, setQ] = useState('')

  function submit(e: Event) {
    e.preventDefault()
    onApply({
      project: project || undefined,
      type: type || undefined,
      topic_key: topicKey || undefined,
      q: q || undefined,
    })
  }

  return (
    <form class="filter-bar" onSubmit={submit}>
      <select value={project} onChange={(e) => setProject((e.target as HTMLSelectElement).value)}>
        <option value="">All projects</option>
        {projects.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>

      <select value={type} onChange={(e) => setType((e.target as HTMLSelectElement).value)}>
        <option value="">All types</option>
        {types.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="topic_key"
        value={topicKey}
        onInput={(e) => setTopicKey((e.target as HTMLInputElement).value)}
      />

      <input
        type="text"
        placeholder="search"
        value={q}
        onInput={(e) => setQ((e.target as HTMLInputElement).value)}
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Loading...' : 'Apply'}
      </button>
    </form>
  )
}
