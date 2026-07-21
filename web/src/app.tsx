import { useEffect, useState } from 'preact/hooks'
import {
  fetchObservations,
  fetchProjects,
  fetchTypes,
  type ListResponse,
  type ObservationFilters,
} from './api/client'
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
    fetchProjects().then(setProjects).catch(() => {})
    fetchTypes().then(setTypes).catch(() => {})
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
    setFilters(nextFilters)
    load(nextFilters, 0)
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
    <div class="app">
      <h1>Engram Feed Viewer</h1>
      <FilterBar projects={projects} types={types} onApply={handleApply} loading={loading} />

      {error && <p class="error-message">{error}</p>}
      {loading && <p class="loading-message">Loading...</p>}

      {!loading && result === null && !error && (
        <p class="feed-empty">Apply filters to load the feed.</p>
      )}

      {result && <FeedList items={result.items} onSelect={setSelectedId} />}

      {result && (
        <div class="pagination">
          <button type="button" onClick={handlePrev} disabled={!hasPrev || loading}>
            Previous
          </button>
          <span>
            {offset + 1}-{Math.min(offset + PAGE_SIZE, result.total)} of {result.total}
          </span>
          <button type="button" onClick={handleNext} disabled={!hasNext || loading}>
            Next
          </button>
        </div>
      )}

      {selectedId !== null && (
        <DetailView id={selectedId} onClose={() => setSelectedId(null)} />
      )}
    </div>
  )
}
