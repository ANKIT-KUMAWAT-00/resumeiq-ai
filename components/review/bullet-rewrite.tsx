import { ArrowRight, Info } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface BulletRewriteProps {
  bullets: {
    original: string
    improved: string
    explanation: string
  }[]
}

export function BulletRewrite({ bullets }: BulletRewriteProps) {
  if (!bullets || bullets.length === 0) return null

  return (
    <div className="space-y-6">
      {bullets.map((b, i) => (
        <div key={i} className="flex flex-col space-y-3 p-4 border rounded-lg bg-card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-red-500">Original</span>
              <p className="text-sm text-muted-foreground bg-destructive/5 p-3 rounded-md line-through decoration-red-500/30">
                {b.original}
              </p>
            </div>
            
            <div className="hidden md:flex items-center justify-center w-8 -mx-4 z-10">
              <div className="bg-background border rounded-full p-1">
                <ArrowRight className="h-4 w-4 text-primary" />
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-green-500">Improved</span>
              <p className="text-sm font-medium bg-green-500/10 p-3 rounded-md">
                {b.improved}
              </p>
            </div>
          </div>
          
          <Alert className="bg-muted/30 border-none">
            <Info className="h-4 w-4 text-muted-foreground" />
            <AlertDescription className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">Why: </span> {b.explanation}
            </AlertDescription>
          </Alert>
        </div>
      ))}
    </div>
  )
}