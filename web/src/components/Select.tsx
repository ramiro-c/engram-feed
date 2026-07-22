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
        class="flex justify-between items-center gap-2 bg-gray-100 hover:bg-gray-200 py-2 pr-2.5 pl-3 rounded-lg w-full text-black text-sm cursor-pointer"
      >
        <span class={cn('truncate', !value && 'text-gray-500')}>{value || placeholder}</span>
        <svg
          class={cn('w-3.5 h-3.5 text-gray-500 transition-transform shrink-0', open && 'rotate-180')}
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="m5 7.5 5 5 5-5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>

      {open && (
        <div class="top-[calc(100%+6px)] left-0 z-30 absolute bg-white shadow-md py-1 rounded-lg w-full overflow-hidden">
          <button
            type="button"
            onClick={() => select('')}
            class={cn(
              'block hover:bg-gray-50 px-3 py-2 w-full text-sm text-left cursor-pointer',
              !value ? 'font-semibold text-black' : 'text-gray-600',
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
                'block hover:bg-gray-50 px-3 py-2 w-full text-sm text-left truncate cursor-pointer',
                value === opt ? 'font-semibold text-black' : 'text-gray-600',
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
