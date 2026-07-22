import { useLocation } from 'preact-iso'
import { useFeed } from '../context/FeedContext'
import { cn } from '../lib/utils'

interface TopicTagsProps {
  topicKey: string
  class?: string
}

export function TopicTags({ topicKey, class: className }: TopicTagsProps) {
  const { quickFilter } = useFeed()
  const { route } = useLocation()

  function select(e: MouseEvent) {
    e.stopPropagation()
    quickFilter({ topic_key: topicKey })
    route('/')
  }

  const tags = topicKey.split('/').filter(Boolean)

  return (
    <div class={cn('flex flex-wrap items-center gap-1.5', className)}>
      {tags.map((tag) => (
        <button
          key={tag}
          type="button"
          onClick={select}
          class="cursor-pointer rounded-full bg-canvas px-2.5 py-0.5 text-xs text-ash transition-colors hover:bg-accent-soft hover:text-accent"
        >
          #{tag}
        </button>
      ))}
    </div>
  )
}
