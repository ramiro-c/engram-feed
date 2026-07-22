import { useState } from 'preact/hooks'
import type { Observation } from '../api/client'
import { formatRelativeTime, truncate, typeBadgeClass, typeInitial } from '../lib/format'
import { Markdown } from './Markdown'

interface RelatedThreadProps {
  items: Observation[]
  onSelect: (id: number) => void
  collapsible?: boolean
}

const BADGE_COL = 'h-7 w-7'

export function RelatedThread({ items, onSelect, collapsible = true }: RelatedThreadProps) {
  const [expanded, setExpanded] = useState(!collapsible)

  if (items.length === 0) return null

  return (
    <div class="relative">
      {/* Rail sits in the badge column itself, so it's always centered under
          every badge/dot regardless of outer padding. */}
      <div class="absolute inset-y-0 left-0 flex w-7 justify-center" aria-hidden="true">
        <div class="h-full w-px bg-accent/25" />
      </div>

      {collapsible && !expanded && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setExpanded(true)
          }}
          class="relative flex w-full cursor-pointer items-center gap-2.5 py-2 text-left text-[13px] font-semibold text-accent hover:underline"
        >
          <span class={`relative z-10 flex ${BADGE_COL} shrink-0 items-center justify-center`}>
            <span class="h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          Show {items.length} related {items.length === 1 ? 'observation' : 'observations'}
        </button>
      )}

      {expanded &&
        items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onSelect(item.id)
            }}
            class="group relative flex w-full cursor-pointer items-start gap-2.5 py-2 text-left"
          >
            <span
              class={`relative z-10 flex ${BADGE_COL} shrink-0 items-center justify-center rounded-lg text-[11px] font-bold ${typeBadgeClass(item.type)}`}
            >
              {typeInitial(item.type)}
            </span>
            <div class="min-w-0 flex-1">
              <div class="flex items-baseline gap-1.5 text-[12.5px] text-ash">
                <span class="font-semibold text-ink">{item.type}</span>
                <span>·</span>
                <time>{formatRelativeTime(item.created_at)}</time>
              </div>
              <Markdown
                class="mt-0.5 text-[13.5px] leading-snug text-ink/75 group-hover:text-ink"
                content={truncate(item.content, 140)}
              />
            </div>
          </button>
        ))}
    </div>
  )
}
