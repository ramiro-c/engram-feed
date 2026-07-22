import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { cn } from '../lib/utils'

interface MarkdownProps {
  content: string
  class?: string
}

export function Markdown({ content, class: className }: MarkdownProps) {
  const html = DOMPurify.sanitize(marked.parse(content, { async: false }))
  return (
    <div class={cn('markdown-content text-sm text-gray-800', className)} dangerouslySetInnerHTML={{ __html: html }} />
  )
}
