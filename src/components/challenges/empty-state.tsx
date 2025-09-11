"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Target, Search, Filter } from 'lucide-react'

interface EmptyStateProps {
  title: string
  description: string
  icon?: React.ReactNode
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ 
  title, 
  description, 
  icon = <Target className="w-16 h-16 text-muted-foreground" />,
  action 
}: EmptyStateProps) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4">
          {icon}
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-6 max-w-sm">
          {description}
        </p>
        {action && (
          <Button onClick={action.onClick} variant="outline">
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export function ChallengesEmptyState({ onResetFilters }: { onResetFilters: () => void }) {
  return (
    <EmptyState
      title="Челленджи не найдены"
      description="Попробуйте изменить фильтры или поисковый запрос, чтобы найти подходящие челленджи"
      icon={<Search className="w-16 h-16 text-muted-foreground" />}
      action={{
        label: "Сбросить фильтры",
        onClick: onResetFilters
      }}
    />
  )
}

export function NoActiveChallengesEmptyState() {
  return (
    <EmptyState
      title="Нет активных челленджей"
      description="Присоединяйтесь к челленджам, чтобы начать свой путь к здоровым привычкам"
      icon={<Target className="w-16 h-16 text-muted-foreground" />}
    />
  )
}
