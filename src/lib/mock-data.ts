// Mock data for testing without Supabase
export const mockChallenges = [
  {
    id: '1',
    title: '10,000 Шагов в День',
    description: 'Ходите 10,000 шагов каждый день для поддержания активности',
    target: 10000,
    unit: 'шагов',
    icon: '🚶',
    category: 'активность',
    premium: false,
    active: true,
    duration_days: 30,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    title: '2 Литра Воды',
    description: 'Пейте 2 литра чистой воды для здоровья',
    target: 2000,
    unit: 'мл',
    icon: '💧',
    category: 'питание',
    premium: false,
    active: true,
    duration_days: 30,
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    title: '30 Отжиманий',
    description: 'Делайте 30 отжиманий для укрепления мышц',
    target: 30,
    unit: 'раз',
    icon: '💪',
    category: 'силовая',
    premium: false,
    active: true,
    duration_days: 30,
    created_at: new Date().toISOString()
  },
  {
    id: '4',
    title: 'Читать 20 Страниц',
    description: 'Читайте 20 страниц книги для развития ума',
    target: 20,
    unit: 'страниц',
    icon: '📚',
    category: 'развитие',
    premium: true,
    active: true,
    duration_days: 30,
    created_at: new Date().toISOString()
  },
  {
    id: '5',
    title: '5 Минут Медитации',
    description: 'Медитируйте 5 минут для внутреннего покоя',
    target: 5,
    unit: 'минут',
    icon: '🧘',
    category: 'ментальное',
    premium: true,
    active: true,
    duration_days: 30,
    created_at: new Date().toISOString()
  }
]

export const mockLeaderboard = [
  { 
    username: 'FitnessGuru', 
    user_id: '11111111-1111-1111-1111-111111111111', 
    weekly_points: 89,
    total_score: 1245
  },
  { 
    username: 'HealthHero', 
    user_id: '22222222-2222-2222-2222-222222222222', 
    weekly_points: 85,
    total_score: 1108
  },
  { 
    username: 'StepMaster', 
    user_id: '33333333-3333-3333-3333-333333333333', 
    weekly_points: 76,
    total_score: 987
  },
  { 
    username: 'WaterChamp', 
    user_id: '44444444-4444-4444-4444-444444444444', 
    weekly_points: 72,
    total_score: 934
  },
  { 
    username: 'ZenMaster', 
    user_id: '55555555-5555-5555-5555-555555555555', 
    weekly_points: 68,
    total_score: 876
  },
  { 
    username: 'BookWorm', 
    user_id: '66666666-6666-6666-6666-666666666666', 
    weekly_points: 65,
    total_score: 823
  },
  { 
    username: 'PowerLifter', 
    user_id: '77777777-7777-7777-7777-777777777777', 
    weekly_points: 61,
    total_score: 745
  },
  { 
    username: 'MindfulOne', 
    user_id: '88888888-8888-8888-8888-888888888888', 
    weekly_points: 58,
    total_score: 692
  },
  { 
    username: 'EarlyBird', 
    user_id: '99999999-9999-9999-9999-999999999999', 
    weekly_points: 54,
    total_score: 634
  },
  { 
    username: 'NightOwl', 
    user_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 
    weekly_points: 51,
    total_score: 589
  }
]

export const mockProfile = {
  id: '11111111-1111-1111-1111-111111111111',
  username: 'test_user',
  email: 'test@fitspark.com',
  updated_at: new Date().toISOString()
}

export const mockStats = {
  totalPoints: 245,
  totalChallenges: 12,
  completedToday: 3,
  longestStreak: 14,
  currentStreak: 7,
  weeklyRank: 15,
  badges: 4
}

export const mockBadges = [
  {
    id: '1',
    name: 'Первые шаги',
    description: 'Завершите свой первый челлендж',
    icon: '🌟',
    requirement_type: 'total',
    requirement_value: 1,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Активист',
    description: 'Завершите 10 челленджей',
    icon: '🔥',
    requirement_type: 'total',
    requirement_value: 10,
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Серийник',
    description: 'Выполните челлендж 7 дней подряд',
    icon: '⚡',
    requirement_type: 'streak',
    requirement_value: 7,
    created_at: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Чемпион недели',
    description: 'Займите 1-е место в недельном рейтинге',
    icon: '🏆',
    requirement_type: 'weekly_rank',
    requirement_value: 1,
    created_at: new Date().toISOString()
  }
]

export const mockUserBadges = [
  {
    id: '1',
    user_id: '11111111-1111-1111-1111-111111111111',
    badge_id: '1',
    earned_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    badge: mockBadges[0]
  },
  {
    id: '2',
    user_id: '11111111-1111-1111-1111-111111111111',
    badge_id: '3',
    earned_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    badge: mockBadges[2]
  }
]

export const mockCompletions = [
  {
    id: '1',
    user_id: '11111111-1111-1111-1111-111111111111',
    challenge_id: '1',
    value: 8500,
    completed_at: new Date().toISOString().split('T')[0],
    points: 85,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    user_id: '11111111-1111-1111-1111-111111111111',
    challenge_id: '2',
    value: 1800,
    completed_at: new Date().toISOString().split('T')[0],
    points: 90,
    created_at: new Date().toISOString()
  }
]
