"use client"

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
  }) => void
}

export function SubmitProofDialog({
  open,
  onOpenChange,
  challenge,
  userChallenge,
  onSubmit
}: SubmitProofDialogProps) {
  const [day, setDay] = useState<number>(1)
  const [value, setValue] = useState('')
  const [proofText, setProofText] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const availableDays = challenge ? Array.from({ length: challenge.duration_days }, (_, i) => i + 1) : []
  const unitInfo = challenge ? CHALLENGE_UNITS[challenge.target_unit as keyof typeof CHALLENGE_UNITS] : null

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open && challenge) {
      setDay(1)
      setValue('')
      setProofText('')
      setSelectedFile(null)
    } else {
      setDay(1)
    }
  }, [open, challenge])

  // Get completed days (simplified for now)
  const getCompletedDays = (): number[] => {
    // TODO: Implement proper proof tracking to show completed days
    return []
  }

  const completedDays = getCompletedDays()

  const handleSubmit = async () => {
    if (!challenge) return

    const numValue = parseFloat(value)
    if (isNaN(numValue) || numValue <= 0) {
      toast.error('Пожалуйста, введите корректное значение')
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit({
        day,
        value: numValue,
        proofUrl: proofText || undefined,
        file: selectedFile || undefined
      })
      
      onOpenChange(false)
      toast.success('Доказательство отправлено!')
    } catch (error) {
      console.error('Error submitting proof:', error)
      toast.error('Ошибка при отправке доказательства')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!challenge) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Отправить доказательство</DialogTitle>
          <DialogDescription>
            {challenge.title}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Day Selection */}
          {availableDays.length > 1 && (
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
                        День {dayNum} {isCompleted ? '(выполнено)' : ''}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Value Input */}
          <div className="space-y-2">
            <Label htmlFor="value">
              Значение ({unitInfo?.label || challenge.target_unit})
            </Label>
            <Input
              id="value"
              type="number"
              placeholder={unitInfo?.placeholder || `Например: ${challenge.target_value}`}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              min="0"
              step="0.1"
              required
            />
          </div>

          {/* Proof Text */}
          <div className="space-y-2">
            <Label htmlFor="proofText">Описание (необязательно)</Label>
            <Input
              id="proofText"
              placeholder="Опишите как выполнили задание..."
              value={proofText}
              onChange={(e) => setProofText(e.target.value)}
            />
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label>Фото/видео доказательство (необязательно)</Label>
            <ProofUploader
              onFileSelect={setSelectedFile}
              selectedFile={selectedFile}
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!value || isSubmitting}
          >
            {isSubmitting ? 'Отправка...' : 'Отправить'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}