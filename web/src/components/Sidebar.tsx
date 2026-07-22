import { cn } from '../lib/utils'
import { useFeed } from '../context/FeedContext'

export function Sidebar() {
  const { result, projects, filters, quickFilter } = useFeed()
  const total = result?.total ?? null
  const activeProject = filters.project
  const onSelectProject = (project: string) => quickFilter({ project: project || undefined })

  return (
    <aside class="rounded-lg bg-white shadow-sm">
      <div class="p-4">
        <p class="text-sm text-gray-500">Total observations</p>
        <p class="text-2xl font-bold text-black">{total ?? '—'}</p>
      </div>

      <nav class="flex flex-col gap-1 p-2 pt-0">
        <p class="px-3 pb-1 text-xs font-semibold uppercase text-gray-400">Projects</p>
        {projects.length === 0 && <p class="px-3 py-1 text-sm text-gray-400">No projects yet</p>}
        <button
          type="button"
          onClick={() => onSelectProject('')}
          class={cn(
            'w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-50',
            !activeProject ? 'bg-gray-100 font-semibold text-black' : 'text-gray-600',
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
              'w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-50',
              activeProject === p ? 'bg-gray-100 font-semibold text-black' : 'text-gray-600',
            )}
          >
            {p}
          </button>
        ))}
      </nav>
    </aside>
  )
}
