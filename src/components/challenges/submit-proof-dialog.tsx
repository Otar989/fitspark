"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ProofUploader } from '@/components/challenges/proof-uploader'
import { DatabaseChallenge as Challenge, DatabaseUserChallenge as UserChallenge } from '@/lib/supabase/challenges'
import { CHALLENGE_UNITS } from '@/constants/challenges'
import { toast } from 'sonner'

interface SubmitProofDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  challenge: Challenge | null
  userChallenge: UserChallenge | null
  onSubmit: (data: {
    day: number
    value: number
    proofUrl?: string
    file?: File
  }) => Promise<void>
}

export function SubmitProofDialog({
  open,
  onOpenChange,
  challenge,
  userChallenge,
  onSubmit
}: SubmitProofDialogProps) {
  const [day, setDay] = useState<number>(1)
  const [value, setValue] = useState<string>('')
  const [proofUrl, setProofUrl] = useState<string>('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const availableDays = challenge ? Array.from({ length: challenge.duration_days }, (_, i) => i + 1) : []
  const unitInfo = challenge ? CHALLENGE_UNITS[challenge.target_unit as keyof typeof CHALLENGE_UNITS] : null

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open && challenge) {
      setValue('')
      setProofUrl('')
      setSelectedFile(null)
      setDay(1)
    }
  }, [open, challenge])

  // Get completed days to show which days are available
  const getCompletedDays = (): number[] => {
    // For now, return empty array since we need to implement proof tracking
    // TODO: Implement proper proof tracking to show completed days
    return []
  }

  const completedDays = getCompletedDays()

  const handleSubmit = async () => {
    if (!challenge || !value || !day) {
      toast.error('Заполните все обязательные поля')
      return
    }

    const numericValue = parseFloat(value)
    if (isNaN(numericValue) || numericValue <= 0) {
      toast.error('Введите корректное значение')
      return
    }

    if (proofUrl && !isValidUrl(proofUrl)) {
      toast.error('Введите корректную ссылку')
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit({
        day,
        value: numericValue,
        proofUrl: proofUrl || undefined,
        file: selectedFile || undefined
      })
      
      onOpenChange(false)
      toast.success('Челлендж выполнен!')
    } catch (error) {
      console.error('Error submitting proof:', error)
      toast.error('Ошибка при выполнении челленджа')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  if (!challenge) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Выполнить челлендж</DialogTitle>
          <DialogDescription>
            {challenge.title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Day Selection */}
          <div className="space-y-2">
            <Label htmlFor="day">День</Label>
            <Select value={day.toString()} onValueChange={(value) => setDay(parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите день" />
              </SelectTrigger>
              <SelectContent>
                {availableDays.map((dayNum) => {
                  const isCompleted = completedDays.includes(dayNum)
                  return (
                    <SelectItem 
                      key={dayNum} 
                      value={dayNum.toString()}
                      disabled={isCompleted}
                    >
                      День {dayNum} {isCompleted && '(выполнен)'}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Вы можете выполнять челлендж только за текущий или прошедшие дни
            </p>
          </div>

          {/* Value Input */}
          <div className="space-y-2">
            <Label htmlFor="value">
              Значение ({unitInfo?.label || challenge.target_unit})
            </Label>
            <Input
              id="value"
              type="number"
              placeholder={unitInfo?.placeholder || `Например: ${challenge.target}`}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              min="0"
              step="0.1"
            />
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label>Медиа-пруф (опционально)</Label>
            <ProofUploader
              onFileSelect={setSelectedFile}
              selectedFile={selectedFile}
            />
          </div>

          {/* Proof URL */}
          <div className="space-y-2">
            <Label htmlFor="proof-url">Ссылка на пруф (опционально)</Label>
            <Input
              id="proof-url"
              type="url"
              placeholder="https://..."
              value={proofUrl}
              onChange={(e) => setProofUrl(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Можете прикрепить фото или видео для подтверждения
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Отмена
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !value || !day}
          >
            {isSubmitting ? 'Выполнение...' : 'Выполнить'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
