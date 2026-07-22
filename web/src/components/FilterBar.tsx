import { useState } from 'preact/hooks'
import type { ObservationFilters } from '../api/client'
import { Select } from './Select'

interface FilterBarProps {
  projects: string[]
  types: string[]
  project?: string
  type?: string
  onApply: (filters: ObservationFilters) => void
  loading: boolean
}

export function FilterBar({ projects, types, project, type, onApply, loading }: FilterBarProps) {
  const [selectedProject, setSelectedProject] = useState(project ?? '')
  const [selectedType, setSelectedType] = useState(type ?? '')
  const [topicKey, setTopicKey] = useState('')

  function submit(e: Event) {
    e.preventDefault()
    onApply({
      project: selectedProject || undefined,
      type: selectedType || undefined,
      topic_key: topicKey || undefined,
    })
  }

  return (
    <form class="flex flex-col gap-3 bg-white shadow-sm p-3 rounded-lg" onSubmit={submit}>
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
          class="flex-1 bg-gray-100 px-3 py-2 rounded-lg text-black text-sm"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        class="self-end bg-black disabled:opacity-40 px-4 py-2 rounded-lg font-medium text-white text-sm cursor-pointer disabled:cursor-default"
      >
        {loading ? 'Loading...' : 'Apply'}
      </button>
    </form>
  )
}
