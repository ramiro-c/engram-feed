import { createContext, type ComponentChildren } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'
import { fetchObservations, fetchProjects, fetchTypes, type ListResponse, type ObservationFilters } from '../api/client'

const PAGE_SIZE = 20

interface FeedContextValue {
  projects: string[]
  types: string[]
  filters: ObservationFilters
  offset: number
  pageSize: number
  result: ListResponse | null
  loading: boolean
  error: string | null
  applyFilters: (filters: ObservationFilters) => void
  search: (q: string) => void
  quickFilter: (patch: Partial<ObservationFilters>) => void
  prevPage: () => void
  nextPage: () => void
}

const FeedContext = createContext<FeedContextValue | null>(null)

export function FeedProvider({ children }: { children: ComponentChildren }) {
  const [projects, setProjects] = useState<string[]>([])
  const [types, setTypes] = useState<string[]>([])
  const [filters, setFilters] = useState<ObservationFilters>({})
  const [offset, setOffset] = useState(0)
  const [result, setResult] = useState<ListResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  useEffect(() => {
    fetchProjects()
      .then(setProjects)
      .catch(() => {})
    fetchTypes()
      .then(setTypes)
      .catch(() => {})
    load({}, 0)
  }, [])

  function applyFilters(nextFilters: ObservationFilters) {
    const merged = { ...nextFilters, q: filters.q }
    setFilters(merged)
    load(merged, 0)
  }

  function search(q: string) {
    const merged = { ...filters, q: q || undefined }
    setFilters(merged)
    load(merged, 0)
  }

  function quickFilter(patch: Partial<ObservationFilters>) {
    const merged = { ...filters, ...patch }
    setFilters(merged)
    load(merged, 0)
  }

  function prevPage() {
    load(filters, Math.max(0, offset - PAGE_SIZE))
  }

  function nextPage() {
    if (!result) return
    load(filters, offset + PAGE_SIZE)
  }

  const value: FeedContextValue = {
    projects,
    types,
    filters,
    offset,
    pageSize: PAGE_SIZE,
    result,
    loading,
    error,
    applyFilters,
    search,
    quickFilter,
    prevPage,
    nextPage,
  }

  return <FeedContext.Provider value={value}>{children}</FeedContext.Provider>
}

export function useFeed(): FeedContextValue {
  const ctx = useContext(FeedContext)
  if (!ctx) throw new Error('useFeed must be used within a FeedProvider')
  return ctx
}
