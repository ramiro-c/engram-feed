import { Pin } from 'lucide-preact'
import { cn } from '../lib/utils'
import { useFeed } from '../context/FeedContext'

export function Sidebar() {
  const { result, projects, filters, quickFilter } = useFeed()
  const total = result?.total ?? null
  const activeProject = filters.project
  const pinnedOnly = filters.pinned ?? false
  const onSelectProject = (project: string) => quickFilter({ project: project || undefined })
  const togglePinned = () => quickFilter({ pinned: pinnedOnly ? undefined : true })

  return (
    <aside class="rounded-xl bg-paper shadow-sm">
      <div class="p-4">
        <p class="text-sm text-ash">Total observations</p>
        <p class="text-2xl font-bold tracking-tight text-ink">{total ?? '—'}</p>
      </div>

      <div class="px-2 pb-2">
        <button
          type="button"
          onClick={togglePinned}
          aria-pressed={pinnedOnly}
          class={cn(
            'flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold transition-colors hover:bg-canvas',
            pinnedOnly ? 'bg-accent-soft text-accent' : 'text-ink/70',
          )}
        >
          <Pin class="h-3.5 w-3.5" fill={pinnedOnly ? 'currentColor' : 'none'} strokeWidth={2} />
          Pinned only
        </button>
      </div>

      <nav class="flex flex-col gap-0.5 p-2 pt-0">
        <p class="px-3 pb-1 text-xs font-bold uppercase tracking-wide text-ash">Projects</p>
        {projects.length === 0 && <p class="px-3 py-1 text-sm text-ash">No projects yet</p>}
        <button
          type="button"
          onClick={() => onSelectProject('')}
          class={cn(
            'w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-canvas',
            !activeProject ? 'bg-accent-soft font-semibold text-accent' : 'text-ink/70',
          )}
        >
          All projects
        </button>
        {projects.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onSelectProject(p)}
            class={cn(
              'w-full cursor-pointer truncate rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-canvas',
              activeProject === p ? 'bg-accent-soft font-semibold text-accent' : 'text-ink/70',
            )}
          >
            {p}
          </button>
        ))}
      </nav>
    </aside>
  )
}
