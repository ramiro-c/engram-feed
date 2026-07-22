import { useState } from 'preact/hooks'
import { useFeed } from '../context/FeedContext'
import { Select } from './Select'

interface FilterBarProps {
  project?: string
  type?: string
}

export function FilterBar({ project, type }: FilterBarProps) {
  const { projects, types, applyFilters, loading } = useFeed()
  const [selectedProject, setSelectedProject] = useState(project ?? '')
  const [selectedType, setSelectedType] = useState(type ?? '')
  const [topicKey, setTopicKey] = useState('')

  function submit(e: Event) {
    e.preventDefault()
    applyFilters({
      project: selectedProject || undefined,
      type: selectedType || undefined,
      topic_key: topicKey || undefined,
    })
  }

  return (
    <form class="flex flex-col gap-3 rounded-xl bg-paper p-3 shadow-sm" onSubmit={submit}>
      <div class="flex flex-1 items-center gap-2">
        <Select
          class="flex-1"
          value={selectedProject}
          placeholder="All projects"
          options={projects}
          onChange={setSelectedProject}
        />
        <Select
          class="flex-1"
          value={selectedType}
          placeholder="All types"
          options={types}
          onChange={setSelectedType}
        />

        <input
          type="text"
          placeholder="topic_key"
          value={topicKey}
          onInput={(e) => setTopicKey((e.target as HTMLInputElement).value)}
          class="flex-1 rounded-lg bg-canvas px-3 py-2 text-sm text-ink outline-none ring-1 ring-transparent focus:ring-accent/40"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        class="cursor-pointer self-end rounded-lg bg-ink px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent disabled:cursor-default disabled:opacity-40"
      >
        {loading ? 'Loading...' : 'Apply'}
      </button>
    </form>
  )
}
