import { Badge } from '@/components/ui/badge'

interface KeywordChipsProps {
  keywords: string[]
  type: 'missing' | 'suggested' | 'strength'
}

export function KeywordChips({ keywords, type }: KeywordChipsProps) {
  if (!keywords || keywords.length === 0) {
    return <p className="text-sm text-muted-foreground italic">None found.</p>
  }

  const variantMap = {
    missing: 'destructive',
    suggested: 'secondary',
    strength: 'default'
  } as const

  return (
    <div className="flex flex-wrap gap-2">
      {keywords.map((kw, i) => (
        <Badge key={i} variant={variantMap[type]} className="text-sm py-1 px-3">
          {kw}
        </Badge>
      ))}
    </div>
  )
}