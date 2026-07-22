export interface Observation {
  id: number
  sync_id?: string
  session_id: string
  type: string
  title: string
  content: string
  tool_name?: string
  project?: string
  scope: string
  topic_key?: string
  revision_count: number
  pinned: boolean
  created_at: string
  updated_at: string
}

export interface ListResponse {
  items: Observation[]
  total: number
  limit: number
  offset: number
}

export interface DistinctResponse {
  items: string[]
}

export interface ObservationFilters {
  project?: string
  type?: string
  topic_key?: string
  session_id?: string
  pinned?: boolean
  q?: string
  limit?: number
  offset?: number
}

const BASE_URL = import.meta.env.VITE_API_BASE ?? ''

async function request<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`)
  if (!res.ok) {
    let message = `request failed with status ${res.status}`
    try {
      const body = await res.json()
      if (body && typeof body.error === 'string') {
        message = body.error
      }
    } catch {}
    throw new Error(message)
  }
  return res.json() as Promise<T>
}

function buildQuery(params: Record<string, string | number | boolean | undefined>): string {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === '' || value === false) continue
    search.set(key, String(value))
  }
  const qs = search.toString()
  return qs ? `?${qs}` : ''
}

export function fetchObservations(filters: ObservationFilters): Promise<ListResponse> {
  const qs = buildQuery({
    project: filters.project,
    type: filters.type,
    topic_key: filters.topic_key,
    session_id: filters.session_id,
    pinned: filters.pinned,
    q: filters.q,
    limit: filters.limit,
    offset: filters.offset,
  })
  return request<ListResponse>(`/api/observations${qs}`)
}

export function fetchObservation(id: number): Promise<Observation> {
  return request<Observation>(`/api/observations/${id}`)
}

export function fetchProjects(): Promise<string[]> {
  return request<DistinctResponse>('/api/projects').then((r) => r.items)
}

export function fetchTypes(): Promise<string[]> {
  return request<DistinctResponse>('/api/types').then((r) => r.items)
}
