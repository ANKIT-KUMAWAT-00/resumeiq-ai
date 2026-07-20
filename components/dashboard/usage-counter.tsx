import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface UsageCounterProps {
  count: number
  limit: number
  plan: 'free' | 'pro'
}

export function UsageCounter({ count, limit, plan }: UsageCounterProps) {
  if (plan === 'pro') {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Daily Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Unlimited</div>
          <p className="text-xs text-muted-foreground mt-1">
            Analyze as many resumes as you need.
          </p>
        </CardContent>
      </Card>
    )
  }

  const percentage = Math.min((count / limit) * 100, 100)

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Daily Usage Limit</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{count} / {limit}</div>
        <Progress value={percentage} className="mt-3 h-2" />
        <p className="text-xs text-muted-foreground mt-2">
          {limit - count} reviews remaining today. Resets at midnight.
        </p>
      </CardContent>
    </Card>
  )
}