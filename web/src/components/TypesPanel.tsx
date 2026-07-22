import { cn } from '../lib/utils'
import { useFeed } from '../context/FeedContext'

export function TypesPanel() {
  const { types, filters, quickFilter } = useFeed()
  const activeType = filters.type
  const onSelectType = (type: string) => quickFilter({ type: type || undefined })

  return (
    <aside class="rounded-xl bg-paper shadow-sm">
      <p class="px-4 pb-1 pt-3 text-xs font-bold uppercase tracking-wide text-ash">Types</p>
      <nav class="flex flex-col pb-2">
        {types.length === 0 && <p class="px-4 py-2 text-sm text-ash">No types yet</p>}
        <button
          type="button"
          onClick={() => onSelectType('')}
          class={cn(
            'w-full cursor-pointer px-4 py-2 text-left text-sm font-semibold transition-colors hover:bg-canvas',
            !activeType ? 'text-accent' : 'text-ink/70',
          )}
        >
          All types
        </button>
        {types.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => onSelectType(t)}
            class={cn(
              'w-full cursor-pointer truncate px-4 py-2 text-left text-sm font-semibold transition-colors hover:bg-canvas',
              activeType === t ? 'text-accent' : 'text-ink/70',
            )}
          >
            {t}
          </button>
        ))}
      </nav>
    </aside>
  )
}
