"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, X } from 'lucide-react'
import { SORT_OPTIONS, DIFFICULTY_LABELS, type ChallengeCategory, type ChallengeDifficulty } from '@/constants/challenges'

interface Category {
  id: string
  slug: string
  name: string
}

interface ChallengeFiltersProps {
  categories: Category[]
  onFiltersChange: (filters: {
    categorySlug?: string
    difficulty?: string
    q?: string
    sort?: 'popular' | 'newest' | 'points' | 'difficulty'
  }) => void
  className?: string
}

export function ChallengeFilters({ 
  categories, 
  onFiltersChange, 
  className 
}: ChallengeFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('')
  const [selectedSort, setSelectedSort] = useState<'popular' | 'newest' | 'points' | 'difficulty'>('popular')

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    onFiltersChange({
      categorySlug: selectedCategory || undefined,
      difficulty: selectedDifficulty || undefined,
      q: value || undefined,
      sort: selectedSort
    })
  }

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value)
    onFiltersChange({
      categorySlug: value || undefined,
      difficulty: selectedDifficulty || undefined,
      q: searchQuery || undefined,
      sort: selectedSort
    })
  }

  const handleDifficultyChange = (value: string) => {
    setSelectedDifficulty(value)
    onFiltersChange({
      categorySlug: selectedCategory || undefined,
      difficulty: value || undefined,
      q: searchQuery || undefined,
      sort: selectedSort
    })
  }

  const handleSortChange = (value: 'popular' | 'newest' | 'points' | 'difficulty') => {
    setSelectedSort(value)
    onFiltersChange({
      categorySlug: selectedCategory || undefined,
      difficulty: selectedDifficulty || undefined,
      q: searchQuery || undefined,
      sort: value
    })
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('')
    setSelectedDifficulty('')
    setSelectedSort('popular')
    onFiltersChange({})
  }

  const hasActiveFilters = searchQuery || selectedCategory || selectedDifficulty || selectedSort !== 'popular'

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Поиск челленджей..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-4 items-end">
        {/* Category Filter */}
        <div className="flex-1 min-w-[200px]">
          <Label htmlFor="category" className="text-sm font-medium mb-2 block">
            Категория
          </Label>
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Все категории" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Все категории</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.slug} value={category.slug}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Difficulty Filter */}
        <div className="flex-1 min-w-[150px]">
          <Label htmlFor="difficulty" className="text-sm font-medium mb-2 block">
            Сложность
          </Label>
          <Select value={selectedDifficulty} onValueChange={handleDifficultyChange}>
            <SelectTrigger>
              <SelectValue placeholder="Любая сложность" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Любая сложность</SelectItem>
              {Object.entries(DIFFICULTY_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort Filter */}
        <div className="flex-1 min-w-[150px]">
          <Label htmlFor="sort" className="text-sm font-medium mb-2 block">
            Сортировка
          </Label>
          <Select value={selectedSort} onValueChange={handleSortChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="h-10"
          >
            <X className="w-4 h-4 mr-2" />
            Сбросить
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchQuery && (
            <Badge variant="secondary" className="gap-1">
              Поиск: {searchQuery}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => handleSearchChange('')}
              />
            </Badge>
          )}
          {selectedCategory && (
            <Badge variant="secondary" className="gap-1">
              {categories.find(c => c.slug === selectedCategory)?.name}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => handleCategoryChange('')}
              />
            </Badge>
          )}
          {selectedDifficulty && (
            <Badge variant="secondary" className="gap-1">
              {DIFFICULTY_LABELS[selectedDifficulty as keyof typeof DIFFICULTY_LABELS]}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => handleDifficultyChange('')}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
