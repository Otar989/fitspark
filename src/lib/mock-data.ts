// Mock data for testing without Supabase
export const mockChallenges = [
  {
    id: '1',
    title: 'Steps 10k / day',
    category: 'steps',
    description: 'Walk 10,000 steps daily',
    unit: 'steps',
    target: 10000,
    premium: false,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Drink 2L water',
    category: 'water',
    description: 'Drink 2 liters of water daily',
    unit: 'ml',
    target: 2000,
    premium: false,
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    title: 'No sugar today',
    category: 'misc',
    description: 'Avoid added sugars for one day',
    unit: 'times',
    target: 1,
    premium: false,
    created_at: new Date().toISOString()
  },
  {
    id: '4',
    title: 'Read 20 pages',
    category: 'misc',
    description: 'Read 20 pages of a book',
    unit: 'pages',
    target: 20,
    premium: true,
    created_at: new Date().toISOString()
  },
  {
    id: '5',
    title: 'Cold shower 60s',
    category: 'misc',
    description: 'Take a cold shower for 60 seconds',
    unit: 'seconds',
    target: 60,
    premium: true,
    created_at: new Date().toISOString()
  }
]

export const mockLeaderboard = [
  { username: 'user_01', user_id: '11111111-1111-1111-1111-111111111111', score: 150 },
  { username: 'user_02', user_id: '22222222-2222-2222-2222-222222222222', score: 140 },
  { username: 'user_03', user_id: '33333333-3333-3333-3333-333333333333', score: 130 },
  { username: 'user_04', user_id: '44444444-4444-4444-4444-444444444444', score: 120 },
  { username: 'user_05', user_id: '55555555-5555-5555-5555-555555555555', score: 110 },
  { username: 'user_06', user_id: '66666666-6666-6666-6666-666666666666', score: 100 },
  { username: 'user_07', user_id: '77777777-7777-7777-7777-777777777777', score: 90 },
  { username: 'user_08', user_id: '88888888-8888-8888-8888-888888888888', score: 80 },
  { username: 'user_09', user_id: '99999999-9999-9999-9999-999999999999', score: 70 },
  { username: 'user_10', user_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', score: 60 }
]

export const mockProfile = {
  id: '11111111-1111-1111-1111-111111111111',
  username: 'test_user',
  updated_at: new Date().toISOString()
}

export const mockStats = {
  totalPoints: 150,
  totalChallenges: 5,
  longestStreak: 7
}
