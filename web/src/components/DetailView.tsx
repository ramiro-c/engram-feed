import { useEffect, useState } from 'preact/hooks'
import { fetchObservation, type Observation } from '../api/client'
import { formatRelativeTime, typeBadgeClass, typeInitial } from '../lib/format'

interface DetailViewProps {
  id: number
  onClose: () => void
}

export function DetailView({ id, onClose }: DetailViewProps) {
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
    <div class="z-30 fixed inset-0 flex justify-end bg-black/50" onClick={onClose}>
      <div class="bg-white shadow-sm p-6 w-full max-w-lg h-full overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={onClose}
          class="flex justify-center items-center bg-gray-100 hover:bg-gray-200 mb-4 rounded-lg w-8 h-8 text-gray-600 hover:text-black cursor-pointer"
        >
          ✕
        </button>

        {loading && <p class="text-gray-500 text-sm">Loading...</p>}
        {error && <p class="font-medium text-black text-sm">{error}</p>}

        {observation && (
          <>
            <div class="flex items-start gap-3">
              <span
                class={`flex h-10 w-10 shrink-0 items-center justify-center text-sm font-bold ${typeBadgeClass(observation.type)}`}
              >
                {typeInitial(observation.type)}
              </span>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <span class="font-semibold text-black">{observation.project || 'unscoped'}</span>
                  {observation.pinned && <span>📌</span>}
                </div>
                <div class="flex items-center gap-1.5 text-gray-500 text-xs">
                  <span>{observation.type}</span>
                  <span>·</span>
                  <time>{formatRelativeTime(observation.created_at)}</time>
                </div>
              </div>
            </div>

            <h2 class="mt-4 font-bold text-black text-lg">{observation.title}</h2>

            {observation.topic_key && (
              <span class="inline-block bg-gray-100 mt-2 px-2 py-0.5 rounded-lg text-gray-600 text-xs">
                #{observation.topic_key}
              </span>
            )}

            <pre class="mt-4 text-gray-800 text-sm wrap-break-word whitespace-pre-wrap">{observation.content}</pre>
          </>
        )}
      </div>
    </div>
  )
}
