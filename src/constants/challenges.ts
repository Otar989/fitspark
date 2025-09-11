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
  },
  kilometers: {
    label: 'км',
    placeholder: 'Например: 5',
    icon: '🏃'
  },
  meters: {
    label: 'м',
    placeholder: 'Например: 1000',
    icon: '📏'
  },
  calories: {
    label: 'ккал',
    placeholder: 'Например: 2000',
    icon: '🔥'
  },
  liters: {
    label: 'л',
    placeholder: 'Например: 2',
    icon: '🥤'
  },
  glasses: {
    label: 'стаканов',
    placeholder: 'Например: 8',
    icon: '🥛'
  },
  servings: {
    label: 'порций',
    placeholder: 'Например: 3',
    icon: '🍽️'
  },
  exercises: {
    label: 'упражнений',
    placeholder: 'Например: 10',
    icon: '💪'
  },
  sets: {
    label: 'подходов',
    placeholder: 'Например: 3',
    icon: '🔄'
  },
  reps: {
    label: 'повторений',
    placeholder: 'Например: 15',
    icon: '↗️'
  },
  kilograms: {
    label: 'кг',
    placeholder: 'Например: 70',
    icon: '⚖️'
  },
  days: {
    label: 'дней',
    placeholder: 'Например: 7',
    icon: '📅'
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

export const CHALLENGE_CATEGORIES = {
  fitness: {
    label: 'Фитнес',
    icon: '💪',
    color: 'from-orange-500 to-red-500'
  },
  nutrition: {
    label: 'Питание',
    icon: '🥗',
    color: 'from-green-500 to-emerald-500'
  },
  mindfulness: {
    label: 'Медитация',
    icon: '🧘',
    color: 'from-purple-500 to-indigo-500'
  },
  habits: {
    label: 'Привычки',
    icon: '⭐',
    color: 'from-blue-500 to-cyan-500'
  },
  social: {
    label: 'Социальные',
    icon: '👥',
    color: 'from-pink-500 to-rose-500'
  },
  learning: {
    label: 'Обучение',
    icon: '📚',
    color: 'from-yellow-500 to-orange-500'
  },
  creativity: {
    label: 'Творчество',
    icon: '🎨',
    color: 'from-violet-500 to-purple-500'
  }
} as const

export const PROOF_TYPES = {
  photo: 'Фото',
  video: 'Видео', 
  text: 'Текст',
  number: 'Число'
} as const

export const CHALLENGE_PLACEHOLDERS = {
  search: 'Найти челлендж...',
  proofText: 'Опишите, как выполнили челлендж...',
  proofNumber: 'Введите результат...',
  challengeName: 'Название челленджа',
  challengeDescription: 'Описание челленджа'
} as const

export const CHALLENGE_LABELS = {
  category: 'Категория',
  difficulty: 'Сложность',
  duration: 'Длительность',
  participants: 'Участников',
  target: 'Цель',
  progress: 'Прогресс',
  status: 'Статус',
  proof: 'Доказательство',
  submit: 'Отправить',
  join: 'Участвовать',
  leave: 'Покинуть',
  complete: 'Завершить',
  filter: 'Фильтр',
  reset: 'Сбросить',
  all: 'Все',
  active: 'Активные',
  completed: 'Завершенные',
  myProgress: 'Мой прогресс',
  leaderboard: 'Рейтинг',
  description: 'Описание',
  requirements: 'Требования',
  rewards: 'Награды'
} as const

export const CHALLENGE_MESSAGES = {
  joinSuccess: 'Вы успешно присоединились к челленджу!',
  leaveSuccess: 'Вы покинули челлендж',
  submitSuccess: 'Доказательство отправлено!',
  completeSuccess: 'Поздравляем! Челлендж завершен!',
  joinError: 'Не удалось присоединиться к челленджу',
  leaveError: 'Не удалось покинуть челлендж',
  submitError: 'Не удалось отправить доказательство',
  uploadError: 'Ошибка загрузки файла',
  networkError: 'Ошибка сети. Попробуйте еще раз.',
  loginRequired: 'Необходимо войти в систему'
} as const

export type ChallengeUnit = keyof typeof CHALLENGE_UNITS
export type ChallengeCategory = keyof typeof CHALLENGE_CATEGORIES  
export type ChallengeDifficulty = keyof typeof DIFFICULTY_LABELS
export type ChallengeStatus = 'not_joined' | 'active' | 'completed'
export type ProofType = keyof typeof PROOF_TYPES

export interface Challenge {
  id: string
  title: string
  description: string
  category: ChallengeCategory
  difficulty: ChallengeDifficulty
  target_value: number
  target_unit: ChallengeUnit
  duration_days: number
  points_reward: number
  is_premium: boolean
  proof_required: ProofType
  created_at: string
  updated_at: string
  participant_count?: number
}

export interface UserChallenge {
  id: string
  user_id: string
  challenge_id: string
  joined_at: string
  completed_at?: string
  current_progress: number
  status: ChallengeStatus
  challenge?: Challenge
}

export interface Proof {
  id: string
  user_challenge_id: string
  proof_type: ProofType
  proof_text?: string
  proof_number?: number
  file_url?: string
  submitted_at: string
  is_verified: boolean
}

export interface Category {
  id: string
  name: string
  slug: ChallengeCategory
  icon: string
  color: string
  description: string
  challenge_count?: number
}
