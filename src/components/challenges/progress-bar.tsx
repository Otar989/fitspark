"use client"

import { Progress } from '@/components/ui/progress'

interface ProgressBarProps {
  progress: number
  className?: string
}

export function ProgressBar({ progress, className }: ProgressBarProps) {
  const getProgressColor = () => {
    if (progress >= 100) return 'bg-green-500'
    if (progress >= 75) return 'bg-blue-500'
    if (progress >= 50) return 'bg-yellow-500'
    if (progress >= 25) return 'bg-orange-500'
    return 'bg-red-500'
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Прогресс</span>
        <span className="font-medium">{progress}%</span>
      </div>
      <Progress 
        value={progress} 
        className="h-2"
      />
    </div>
  )
}
