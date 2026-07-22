import { ArrowLeft, Pin } from 'lucide-preact'
import { useEffect, useState } from 'preact/hooks'
import { fetchObservation, fetchObservations, type Observation } from '../api/client'
import { formatRelativeTime, typeBadgeClass, typeInitial } from '../lib/format'
import { Markdown } from './Markdown'
import { RelatedThread } from './RelatedThread'

interface DetailPageProps {
  id: number
  onBack: () => void
  onSelect: (id: number) => void
}

export function DetailPage({ id, onBack, onSelect }: DetailPageProps) {
  const [observation, setObservation] = useState<Observation | null>(null)
  const [related, setRelated] = useState<Observation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    setRelated([])
    fetchObservation(id)
      .then((obs) => {
        if (cancelled) return
        setObservation(obs)
        return fetchObservations({ session_id: obs.session_id, limit: 100 }).then((res) => {
          if (cancelled) return
          setRelated(res.items.filter((item) => item.id !== obs.id))
        })
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
    <div class="rounded-xl bg-paper shadow-sm">
      <div class="flex items-center gap-3 border-b border-hairline px-4 py-3">
        <button
          type="button"
          onClick={onBack}
          class="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-ink transition-colors hover:bg-canvas"
          aria-label="Back to feed"
        >
          <ArrowLeft class="h-4.5 w-4.5" strokeWidth={2.25} />
        </button>
        <span class="text-[15px] font-bold text-ink">Observation</span>
      </div>

      <div class="p-5">
        {loading && <p class="text-sm text-ash">Loading...</p>}
        {error && <p class="text-sm font-medium text-ink">{error}</p>}

        {observation && (
          <>
            <div class="flex items-start gap-3">
              <span
                class={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${typeBadgeClass(observation.type)}`}
              >
                {typeInitial(observation.type)}
                {observation.pinned && (
                  <span
                    title="Pinned"
                    class="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-white ring-2 ring-paper"
                  >
                    <Pin class="h-2.5 w-2.5" fill="currentColor" strokeWidth={0} />
                  </span>
                )}
              </span>
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-baseline gap-1.5 text-[15px]">
                  <span class="truncate font-bold text-ink">{observation.project || 'unscoped'}</span>
                  <span class="text-ash">·</span>
                  <span class="text-ash">{observation.type}</span>
                </div>
                <time class="text-[13px] text-ash">{formatRelativeTime(observation.created_at)}</time>
              </div>
            </div>

            <h2 class="mt-4 break-words text-lg font-bold leading-snug text-ink">{observation.title}</h2>

            {observation.topic_key && (
              <div class="mt-2.5 flex flex-wrap gap-1.5">
                {observation.topic_key
                  .split('/')
                  .filter(Boolean)
                  .map((tag) => (
                    <span key={tag} class="rounded-full bg-canvas px-2.5 py-0.5 text-xs text-ash">
                      #{tag}
                    </span>
                  ))}
              </div>
            )}

            <div class="mt-4 max-w-full">
              <Markdown content={observation.content} />
            </div>

            {related.length > 0 && (
              <div class="mt-6 border-t border-hairline pt-4">
                <p class="mb-1 text-xs font-bold uppercase tracking-wide text-ash">
                  In this session · {related.length} related
                </p>
                <RelatedThread items={related} onSelect={onSelect} collapsible={false} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
