import { cn } from '@/lib/utils'

interface ScoreCircleProps {
  score: number
  label: string
  description?: string
  size?: 'sm' | 'md' | 'lg'
}

export function ScoreCircle({ score, label, description, size = 'md' }: ScoreCircleProps) {
  // Determine color based on score
  let colorClass = 'text-red-500'
  let strokeClass = 'stroke-red-500'
  if (score >= 80) {
    colorClass = 'text-green-500'
    strokeClass = 'stroke-green-500'
  } else if (score >= 60) {
    colorClass = 'text-yellow-500'
    strokeClass = 'stroke-yellow-500'
  }

  const radius = size === 'lg' ? 60 : size === 'md' ? 40 : 24
  const stroke = size === 'lg' ? 12 : size === 'md' ? 8 : 4
  const normalizedRadius = radius - stroke * 2
  const circumference = normalizedRadius * 2 * Math.PI
  const strokeDashoffset = circumference - (score / 100) * circumference

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-40 h-40'
  }

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className={cn("relative flex items-center justify-center", sizeClasses[size])}>
        {/* Background Circle */}
        <svg height={radius * 2} width={radius * 2} className="absolute rotate-[-90deg]">
          <circle
            stroke="currentColor"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="text-muted/20"
          />
          {/* Progress Circle */}
          <circle
            stroke="currentColor"
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset }}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className={cn("transition-all duration-1000 ease-in-out", strokeClass)}
          />
        </svg>
        <span className={cn("absolute font-bold", size === 'lg' ? 'text-4xl' : size === 'md' ? 'text-2xl' : 'text-base', colorClass)}>
          {score}
        </span>
      </div>
      <h3 className={cn("mt-4 font-semibold", size === 'lg' ? 'text-xl' : 'text-sm')}>{label}</h3>
      {description && <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">{description}</p>}
    </div>
  )
}