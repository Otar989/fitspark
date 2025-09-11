export const CHALLENGE_UNITS = {
  steps: {
    label: 'шагов',
    placeholder: 'Например: 10000',
    icon: '👣'
  },
  ml: {
    label: 'мл',
    placeholder: 'Например: 2000',
    icon: '💧'
  },
  hours: {
    label: 'часов',
    placeholder: 'Например: 8',
    icon: '😴'
  },
  minutes: {
    label: 'минут',
    placeholder: 'Например: 30',
    icon: '⏱️'
  },
  times: {
    label: 'раз',
    placeholder: 'Например: 5',
    icon: '🔄'
  },
  pages: {
    label: 'страниц',
    placeholder: 'Например: 20',
    icon: '📖'
  },
  words: {
    label: 'слов',
    placeholder: 'Например: 10',
    icon: '📝'
  },
  portions: {
    label: 'порций',
    placeholder: 'Например: 5',
    icon: '🥗'
  }
} as const

export const DIFFICULTY_LABELS = {
  easy: 'Легко',
  medium: 'Средне',
  hard: 'Сложно'
} as const

export const DIFFICULTY_COLORS = {
  easy: 'bg-green-500/20 text-green-400 border-green-500/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  hard: 'bg-red-500/20 text-red-400 border-red-500/30'
} as const

export const SORT_OPTIONS = [
  { value: 'popular', label: 'Популярные' },
  { value: 'newest', label: 'Новые' },
  { value: 'points', label: 'По баллам' },
  { value: 'difficulty', label: 'По сложности' }
] as const

export const CHALLENGE_STATUS = {
  NOT_JOINED: 'not_joined',
  ACTIVE: 'active',
  COMPLETED: 'completed'
} as const

export const PROOF_FILE_TYPES = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'video/mp4': '.mp4',
  'video/webm': '.webm'
} as const

export const MAX_FILE_SIZE = 20 * 1024 * 1024 // 20MB

export const STORAGE_BUCKET = 'proofs'
