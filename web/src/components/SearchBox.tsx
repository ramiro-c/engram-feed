import { useState } from 'preact/hooks'
import { useFeed } from '../context/FeedContext'

export function SearchBox() {
  const { filters, search, loading } = useFeed()
  const [draft, setDraft] = useState(filters.q ?? '')

  function submit(e: Event) {
    e.preventDefault()
    search(draft.trim())
  }

  return (
    <form onSubmit={submit}>
      <div class="relative">
        <svg
          class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ash"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          value={draft}
          placeholder="Search observations..."
          disabled={loading}
          onInput={(e) => setDraft((e.target as HTMLInputElement).value)}
          class="w-full rounded-full bg-canvas py-3 pl-10 pr-4 text-sm text-ink outline-none ring-1 ring-transparent transition-all focus:bg-paper focus:shadow-sm focus:ring-accent/40 disabled:opacity-60"
        />
      </div>
    </form>
  )
}
