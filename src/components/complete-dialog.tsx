"use client"

import { useState } from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload } from 'lucide-react'

interface Challenge {
  id: string
  title: string
  unit: string
  target: number
}

interface CompleteDialogProps {
  isOpen: boolean
  onClose: () => void
  challenge: Challenge
  onSubmit: (value: number, proofUrl?: string) => void
}

export function CompleteDialog({ 
  isOpen, 
  onClose, 
  challenge, 
  onSubmit 
}: CompleteDialogProps) {
  const [value, setValue] = useState('')
  const [proofUrl, setProofUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    const numValue = parseFloat(value)
    if (isNaN(numValue) || numValue <= 0) {
      return
    }

    setIsSubmitting(true)
    await onSubmit(numValue, proofUrl || undefined)
    setIsSubmitting(false)
    setValue('')
    setProofUrl('')
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="glass border-white/20 text-white">
        <DialogHeader>
          <DialogTitle>Выполнить челлендж</DialogTitle>
          <p className="text-white/80 text-sm">{challenge.title}</p>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="value" className="text-white">
              Значение ({challenge.unit})
            </Label>
            <Input
              id="value"
              type="number"
              placeholder={`Например: ${challenge.target}`}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="glass border-white/20 text-white placeholder:text-white/60"
            />
          </div>

          <div>
            <Label htmlFor="proof" className="text-white">
              Ссылка на пруф (опционально)
            </Label>
            <Input
              id="proof"
              type="url"
              placeholder="https://..."
              value={proofUrl}
              onChange={(e) => setProofUrl(e.target.value)}
              className="glass border-white/20 text-white placeholder:text-white/60"
            />
            <p className="text-xs text-white/60 mt-1">
              Можете прикрепить фото или видео для подтверждения
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="ghost" 
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            Отмена
          </Button>
          <Button
            variant="glassPrimary"
            onClick={handleSubmit}
            disabled={!value || isSubmitting}
          >
            {isSubmitting ? 'Отправка...' : 'Выполнить'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}