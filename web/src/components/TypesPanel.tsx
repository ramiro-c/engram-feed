import { cn } from '../lib/utils'

interface TypesPanelProps {
  types: string[]
  activeType?: string
  onSelectType: (type: string) => void
}

export function TypesPanel({ types, activeType, onSelectType }: TypesPanelProps) {
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
