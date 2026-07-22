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
          class="top-1/2 left-4 absolute w-4 h-4 text-gray-400 -translate-y-1/2 pointer-events-none"
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
          class="bg-gray-100 focus:bg-white disabled:opacity-60 focus:shadow-sm py-3 pr-4 pl-10 rounded-full outline-none w-full text-black text-sm"
        />
      </div>
    </form>
  )
}
