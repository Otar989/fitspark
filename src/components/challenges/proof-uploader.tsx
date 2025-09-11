"use client"

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Upload, X, FileImage, FileVideo, Check } from 'lucide-react'
import { PROOF_FILE_TYPES, MAX_FILE_SIZE } from '@/constants/challenges'

interface ProofUploaderProps {
  onFileSelect: (file: File | null) => void
  selectedFile: File | null
  className?: string
}

export function ProofUploader({ onFileSelect, selectedFile, className }: ProofUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    const file = files[0]
    
    if (file && validateFile(file)) {
      onFileSelect(file)
    }
  }, [onFileSelect])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && validateFile(file)) {
      onFileSelect(file)
    }
  }, [onFileSelect])

  const validateFile = (file: File): boolean => {
    // Check file type
    if (!Object.keys(PROOF_FILE_TYPES).includes(file.type)) {
      alert('Неподдерживаемый тип файла. Разрешены: JPG, PNG, WebP, MP4, WebM')
      return false
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      alert('Файл слишком большой. Максимальный размер: 20MB')
      return false
    }

    return true
  }

  const removeFile = () => {
    onFileSelect(null)
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <FileImage className="w-8 h-8 text-blue-500" />
    } else if (file.type.startsWith('video/')) {
      return <FileVideo className="w-8 h-8 text-purple-500" />
    }
    return <FileImage className="w-8 h-8 text-gray-500" />
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (selectedFile) {
    return (
      <Card className={`border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getFileIcon(selectedFile)}
              <div>
                <p className="font-medium text-sm">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              <Button
                variant="ghost"
                size="sm"
                onClick={removeFile}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card 
      className={`border-dashed transition-colors ${
        isDragOver 
          ? 'border-primary bg-primary/5' 
          : 'border-muted-foreground/25 hover:border-muted-foreground/50'
      } ${className}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <CardContent className="p-6">
        <div className="flex flex-col items-center justify-center text-center">
          <Upload className="w-8 h-8 text-muted-foreground mb-2" />
          <p className="text-sm font-medium mb-1">
            Перетащите файл сюда или нажмите для выбора
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            JPG, PNG, WebP, MP4, WebM до 20MB
          </p>
          <Button variant="outline" size="sm" asChild>
            <label htmlFor="proof-file" className="cursor-pointer">
              Выбрать файл
              <input
                id="proof-file"
                type="file"
                accept={Object.keys(PROOF_FILE_TYPES).join(',')}
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
