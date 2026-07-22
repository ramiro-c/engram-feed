import { useEffect, useState } from 'preact/hooks'
import { fetchObservation, type Observation } from '../api/client'
import { formatRelativeTime, typeBadgeClass, typeInitial } from '../lib/format'
import { Markdown } from './Markdown'

interface DetailPageProps {
  id: number
  onBack: () => void
}

export function DetailPage({ id, onBack }: DetailPageProps) {
  const [observation, setObservation] = useState<Observation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchObservation(id)
      .then((obs) => {
        if (!cancelled) setObservation(obs)
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [id])

  return (
    <div class="rounded-lg bg-white p-6 shadow-sm">
      <button
        type="button"
        onClick={onBack}
        class="mb-4 flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-600 hover:text-black"
      >
        <span aria-hidden="true">←</span> Back to feed
      </button>

      {loading && <p class="text-sm text-gray-500">Loading...</p>}
      {error && <p class="text-sm font-medium text-black">{error}</p>}

      {observation && (
        <>
          <div class="flex items-start gap-3">
            <span
              class={`flex h-10 w-10 shrink-0 items-center justify-center text-sm font-bold ${typeBadgeClass(observation.type)}`}
            >
              {typeInitial(observation.type)}
            </span>
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <span class="font-semibold text-black">{observation.project || 'unscoped'}</span>
                {observation.pinned && <span title="pinned">📌</span>}
              </div>
              <div class="flex items-center gap-1.5 text-xs text-gray-500">
                <span>{observation.type}</span>
                <span>·</span>
                <time>{formatRelativeTime(observation.created_at)}</time>
              </div>
            </div>
          </div>

          <h2 class="mt-4 break-words text-lg font-bold text-black">{observation.title}</h2>

          {observation.topic_key && (
            <div class="mt-2 flex flex-wrap gap-1.5">
              {observation.topic_key
                .split('/')
                .filter(Boolean)
                .map((tag) => (
                  <span key={tag} class="rounded-lg bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                    #{tag}
                  </span>
                ))}
            </div>
          )}

          <div class="mt-4">
            <Markdown content={observation.content} />
          </div>
        </>
      )}
    </div>
  )
}
