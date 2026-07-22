import { cn } from '../lib/utils'
import { useFeed } from '../context/FeedContext'

export function Sidebar() {
  const { result, projects, filters, quickFilter } = useFeed()
  const total = result?.total ?? null
  const activeProject = filters.project
  const onSelectProject = (project: string) => quickFilter({ project: project || undefined })

  return (
    <aside class="rounded-xl bg-paper shadow-sm">
      <div class="p-4">
        <p class="text-sm text-ash">Total observations</p>
        <p class="text-2xl font-bold tracking-tight text-ink">{total ?? '—'}</p>
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
