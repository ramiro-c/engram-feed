import { cn } from '../lib/utils'
import { useFeed } from '../context/FeedContext'

export function TypesPanel() {
  const { types, filters, quickFilter } = useFeed()
  const activeType = filters.type
  const onSelectType = (type: string) => quickFilter({ type: type || undefined })

  return (
    <aside class="bg-white shadow-sm rounded-lg">
      <nav class="flex flex-col pb-2">
        {types.length === 0 && <p class="px-4 py-2 text-gray-400 text-sm">No types yet</p>}
        <button
          type="button"
          onClick={() => onSelectType('')}
          class={cn('hover:bg-gray-50 px-4 py-2.5 w-full text-left cursor-pointer', !activeType && 'bg-gray-50')}
        >
          <p class="font-bold text-gray-600 text-sm">All types</p>
        </button>
        {types.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => onSelectType(t)}
            class={cn('hover:bg-gray-50 px-4 py-2.5 w-full text-left cursor-pointer', activeType === t && 'bg-gray-50')}
          >
            <p class="font-bold text-gray-600 text-sm truncate">{t}</p>
          </button>
        ))}
      </nav>
    </aside>
  )
}
