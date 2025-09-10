import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string) {
  const d = new Date(date)
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d)
}

export function formatDateTime(date: Date | string) {
  const d = new Date(date)
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

export function calculatePoints(value: number, target: number): number {
  return Math.min(100, Math.round((value / Math.max(target, 1)) * 100))
}

export function getStreakDays(completions: Array<{ completed_at: string }>, period: 'daily' | 'weekly' = 'daily'): number {
  if (!completions.length) return 0
  
  const sortedDates = completions
    .map(c => new Date(c.completed_at))
    .sort((a, b) => b.getTime() - a.getTime())
  
  let streak = 1
  let currentDate = sortedDates[0]
  
  for (let i = 1; i < sortedDates.length; i++) {
    const nextDate = sortedDates[i]
    const diffTime = currentDate.getTime() - nextDate.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (period === 'daily' && diffDays === 1) {
      streak++
      currentDate = nextDate
    } else if (period === 'weekly' && diffDays >= 7 && diffDays < 14) {
      streak++
      currentDate = nextDate
    } else {
      break
    }
  }
  
  return streak
}