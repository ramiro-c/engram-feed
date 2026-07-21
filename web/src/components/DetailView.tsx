import { useEffect, useState } from 'preact/hooks'
import { fetchObservation, type Observation } from '../api/client'

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
    <div class="detail-overlay">
      <div class="detail-view">
        <button type="button" class="detail-close" onClick={onClose}>
          Close
        </button>
        {loading && <p>Loading...</p>}
        {error && <p class="error-message">{error}</p>}
        {observation && (
          <>
            <h2>{observation.title}</h2>
            <div class="observation-meta">
              <span class="badge">{observation.type}</span>
              {observation.project && <span class="badge">{observation.project}</span>}
              {observation.topic_key && <span class="badge">{observation.topic_key}</span>}
              {observation.pinned && <span class="pin-badge">pinned</span>}
              <time>{observation.created_at}</time>
            </div>
            <pre class="observation-content">{observation.content}</pre>
          </>
        )}
      </div>
    </div>
  )
}
