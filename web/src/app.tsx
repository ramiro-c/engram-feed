import { useEffect, useState } from 'preact/hooks'
import { fetchObservations, fetchProjects, fetchTypes, type ListResponse, type ObservationFilters } from './api/client'
import { SearchBox } from './components/SearchBox'
import { Sidebar } from './components/Sidebar'
import { TypesPanel } from './components/TypesPanel'
import { FilterBar } from './components/FilterBar'
import { FeedList } from './components/FeedList'
import { DetailView } from './components/DetailView'

const PAGE_SIZE = 20

export function App() {
  const [projects, setProjects] = useState<string[]>([])
  const [types, setTypes] = useState<string[]>([])
  const [filters, setFilters] = useState<ObservationFilters>({})
  const [offset, setOffset] = useState(0)
  const [result, setResult] = useState<ListResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  useEffect(() => {
    fetchProjects()
      .then(setProjects)
      .catch(() => {})
    fetchTypes()
      .then(setTypes)
      .catch(() => {})
    load({}, 0)
  }, [])

  function load(nextFilters: ObservationFilters, nextOffset: number) {
    setLoading(true)
    setError(null)
    fetchObservations({ ...nextFilters, limit: PAGE_SIZE, offset: nextOffset })
      .then((res) => {
        setResult(res)
        setOffset(nextOffset)
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }

  function handleApply(nextFilters: ObservationFilters) {
    const merged = { ...nextFilters, q: filters.q }
    setFilters(merged)
    load(merged, 0)
  }

  function handleSearch(q: string) {
    const merged = { ...filters, q: q || undefined }
    setFilters(merged)
    load(merged, 0)
  }

  function handleQuickFilter(patch: Partial<ObservationFilters>) {
    const merged = { ...filters, ...patch }
    setFilters(merged)
    load(merged, 0)
  }

  function handlePrev() {
    load(filters, Math.max(0, offset - PAGE_SIZE))
  }

  function handleNext() {
    if (!result) return
    load(filters, offset + PAGE_SIZE)
  }

  const hasPrev = offset > 0
  const hasNext = result !== null && offset + PAGE_SIZE < result.total

  return (
    <div class="flex flex-col bg-gray-50">
      <div class="gap-4 grid grid-cols-1 lg:grid-cols-[220px_1fr_220px] mx-auto px-4 py-4 w-full max-w-6xl">
        <div class="lg:top-4 lg:sticky lg:self-start">
          <Sidebar
            total={result?.total ?? null}
            projects={projects}
            activeProject={filters.project}
            onSelectProject={(project) => handleQuickFilter({ project: project || undefined })}
          />
        </div>

        <main class="flex flex-col gap-3">
          <FilterBar
            projects={projects}
            types={types}
            project={filters.project}
            type={filters.type}
            onApply={handleApply}
            loading={loading}
          />

          {error && <p class="bg-white shadow-sm px-4 py-2 rounded-lg font-medium text-black text-sm">{error}</p>}
          {loading && <p class="px-1 text-gray-500 text-sm">Loading...</p>}

          {result && <FeedList items={result.items} onSelect={setSelectedId} />}

          {result && (
            <div class="flex justify-between items-center bg-white shadow-sm px-4 py-2 rounded-lg text-sm">
              <button
                type="button"
                onClick={handlePrev}
                disabled={!hasPrev || loading}
                class="px-3 py-1 font-medium text-black disabled:text-gray-300 cursor-pointer disabled:cursor-default"
              >
                Previous
              </button>
              <span class="text-gray-500">
                {offset + 1}-{Math.min(offset + PAGE_SIZE, result.total)} of {result.total}
              </span>
              <button
                type="button"
                onClick={handleNext}
                disabled={!hasNext || loading}
                class="px-3 py-1 font-medium text-black disabled:text-gray-300 cursor-pointer disabled:cursor-default"
              >
                Next
              </button>
            </div>
          )}
        </main>

        <div class="lg:top-4 lg:sticky flex flex-col lg:self-start gap-4">
          <SearchBox q={filters.q ?? ''} onSearch={handleSearch} loading={loading} />
          <TypesPanel
            types={types}
            activeType={filters.type}
            onSelectType={(type) => handleQuickFilter({ type: type || undefined })}
          />
        </div>
      </div>

      {selectedId !== null && <DetailView id={selectedId} onClose={() => setSelectedId(null)} />}
    </div>
  )
}
