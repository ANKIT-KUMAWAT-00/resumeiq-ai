import { Badge } from '@/components/ui/badge'

interface PlanBadgeProps {
  plan: 'free' | 'pro'
}

export function PlanBadge({ plan }: PlanBadgeProps) {
  if (plan === 'pro') {
    return (
      <Badge className="bg-primary text-primary-foreground hover:bg-primary/90">
        Pro Plan
      </Badge>
    )
  }

  return (
    <Badge variant="secondary" className="font-medium">
      Free Plan
    </Badge>
  )
}