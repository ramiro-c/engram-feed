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
    <div class="bg-paper shadow-sm rounded-xl">
      <div class="flex items-center gap-3 px-4 py-3 border-hairline border-b">
        <button
          type="button"
          onClick={onBack}
          class="flex justify-center items-center hover:bg-canvas rounded-full w-8 h-8 text-ink transition-colors cursor-pointer shrink-0"
          aria-label="Back to feed"
        >
          <ArrowLeft class="w-4.5 h-4.5" strokeWidth={2.25} />
        </button>
        <span class="font-bold text-[15px] text-ink">Observation</span>
      </div>

      <div class="p-5">
        {loading && <p class="text-ash text-sm">Loading...</p>}
        {error && <p class="font-medium text-ink text-sm">{error}</p>}

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
                    class="-top-1 -right-1 absolute flex justify-center items-center bg-accent rounded-full ring-2 ring-paper w-4 h-4 text-white"
                  >
                    <Pin class="w-2.5 h-2.5" fill="currentColor" strokeWidth={0} />
                  </span>
                )}
              </span>
              <div class="flex-1 min-w-0">
                <div class="flex flex-wrap items-baseline gap-1.5 text-[15px]">
                  <span class="font-bold text-ink truncate">{observation.project || 'unscoped'}</span>
                  <span class="text-ash">·</span>
                  <span class="text-ash">{observation.type}</span>
                </div>
                <time class="text-[13px] text-ash">{formatRelativeTime(observation.created_at)}</time>
              </div>
            </div>

            <h2 class="mt-4 font-bold text-ink text-lg wrap-break-word leading-snug">{observation.title}</h2>

            {observation.topic_key && (
              <div class="flex flex-wrap gap-1.5 mt-2.5">
                {observation.topic_key
                  .split('/')
                  .filter(Boolean)
                  .map((tag) => (
                    <span key={tag} class="bg-canvas px-2.5 py-0.5 rounded-full text-ash text-xs">
                      #{tag}
                    </span>
                  ))}
              </div>
            )}

            <div class="mt-4 max-w-full">
              <Markdown content={observation.content} />
            </div>

            {related.length > 0 && (
              <div class="mt-6 pt-4 border-hairline border-t">
                <p class="mb-1 font-bold text-ash text-xs uppercase tracking-wide">
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
