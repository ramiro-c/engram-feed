import { useEffect, useRef, useState } from 'preact/hooks'
import { cn } from '../lib/utils'

interface SelectProps {
  value: string
  placeholder: string
  options: string[]
  onChange: (value: string) => void
  class?: string
}

export function Select({ value, placeholder, options, onChange, class: className }: SelectProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  function select(next: string) {
    onChange(next)
    setOpen(false)
  }

  return (
    <div class={cn('relative', className)} ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        class="flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg bg-canvas py-2 pl-3 pr-2.5 text-sm text-ink ring-1 ring-transparent transition-colors hover:bg-hairline/60 focus:ring-accent/40"
      >
        <span class={cn('truncate', !value && 'text-ash')}>{value || placeholder}</span>
        <svg
          class={cn('h-3.5 w-3.5 shrink-0 text-ash transition-transform', open && 'rotate-180')}
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="m5 7.5 5 5 5-5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>

      {open && (
        <div class="absolute left-0 top-[calc(100%+6px)] z-30 w-full overflow-hidden rounded-lg bg-paper py-1 shadow-md ring-1 ring-hairline">
          <button
            type="button"
            onClick={() => select('')}
            class={cn(
              'block w-full cursor-pointer px-3 py-2 text-left text-sm hover:bg-canvas',
              !value ? 'font-semibold text-accent' : 'text-ink/70',
            )}
          >
            {placeholder}
          </button>
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => select(opt)}
              class={cn(
                'block w-full cursor-pointer truncate px-3 py-2 text-left text-sm hover:bg-canvas',
                value === opt ? 'font-semibold text-accent' : 'text-ink/70',
              )}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
