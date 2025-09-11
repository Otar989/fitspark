/* eslint-disable no-console */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 10 детерминированных UUID (можно заменить своими)
const userIds = [
  "11111111-1111-1111-1111-111111111111",
  "22222222-2222-2222-2222-222222222222",
  "33333333-3333-3333-3333-333333333333",
  "44444444-4444-4444-4444-444444444444",
  "55555555-5555-5555-5555-555555555555",
  "66666666-6666-6666-6666-666666666666",
  "77777777-7777-7777-7777-777777777777",
  "88888888-8888-8888-8888-888888888888",
  "99999999-9999-9999-9999-999999999999",
  "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
];

const categoryData = [
  {
    slug: "hydration",
    name: "Гидратация"
  },
  {
    slug: "steps",
    name: "Шаги"
  },
  {
    slug: "sleep",
    name: "Сон"
  },
  {
    slug: "nutrition",
    name: "Питание"
  },
  {
    slug: "mindfulness",
    name: "Осознанность"
  }
];

const challengeData = [
  // Гидратация
  {
    title: "2 Литра Воды",
    short: "Пейте 2 литра воды в день",
    description: "Пейте 2 литра чистой воды для поддержания водного баланса и здоровья",
    category_slug: "hydration",
    difficulty: "easy",
    target: 2000,
    unit: "ml",
    icon: "💧",
    duration_days: 30,
    points: 20,
    tasks: {
      daily: "Выпить 2 литра воды",
      tips: ["Начните день со стакана воды", "Пейте перед едой", "Используйте приложения для отслеживания"]
    }
  },
  {
    title: "3 Литра Воды",
    short: "Пейте 3 литра воды в день",
    description: "Пейте 3 литра воды для активного образа жизни и интенсивных тренировок",
    category_slug: "hydration",
    difficulty: "medium",
    target: 3000,
    unit: "ml",
    icon: "💧",
    duration_days: 21,
    points: 30,
    premium: true,
    tasks: {
      daily: "Выпить 3 литра воды",
      tips: ["Распределите потребление в течение дня", "Пейте до и после тренировок", "Следите за цветом мочи"]
    }
  },

  // Шаги
  {
    title: "10,000 Шагов в День",
    short: "Ходите 10,000 шагов каждый день",
    description: "Ходите 10,000 шагов каждый день для поддержания активности и здоровья сердечно-сосудистой системы",
    category_slug: "steps",
    difficulty: "easy",
    target: 10000,
    unit: "steps",
    icon: "🚶",
    duration_days: 30,
    points: 25,
    tasks: {
      daily: "Пройти 10,000 шагов",
      tips: ["Используйте лестницу вместо лифта", "Паркуйтесь дальше от входа", "Делайте короткие прогулки в течение дня"]
    }
  },
  {
    title: "15,000 Шагов в День",
    short: "Ходите 15,000 шагов каждый день",
    description: "Ходите 15,000 шагов для более интенсивной физической активности",
    category_slug: "steps",
    difficulty: "hard",
    target: 15000,
    unit: "steps",
    icon: "🏃",
    duration_days: 21,
    points: 40,
    premium: true,
    tasks: {
      daily: "Пройти 15,000 шагов",
      tips: ["Добавьте утреннюю пробежку", "Используйте фитнес-трекер", "Планируйте пешие маршруты"]
    }
  },

  // Сон
  {
    title: "8 Часов Сна",
    short: "Спите 8 часов в сутки",
    description: "Спите 8 часов для восстановления организма и поддержания здоровья",
    category_slug: "sleep",
    difficulty: "medium",
    target: 8,
    unit: "hours",
    icon: "😴",
    duration_days: 30,
    points: 30,
    tasks: {
      daily: "Спать 8 часов",
      tips: ["Ложитесь в одно время", "Избегайте экранов перед сном", "Создайте ритуал перед сном"]
    }
  },

  // Питание
  {
    title: "5 Порций Овощей",
    short: "Ешьте 5 порций овощей",
    description: "Ешьте 5 порций овощей и фруктов для получения витаминов и клетчатки",
    category_slug: "nutrition",
    difficulty: "medium",
    target: 5,
    unit: "portions",
    icon: "🥗",
    duration_days: 21,
    points: 25,
    tasks: {
      daily: "Съесть 5 порций овощей/фруктов",
      tips: ["Добавляйте овощи в каждый прием пищи", "Готовьте смузи", "Перекусывайте фруктами"]
    }
  },

  // Осознанность
  {
    title: "5 Минут Медитации",
    short: "Медитируйте 5 минут",
    description: "Медитируйте 5 минут для снижения стресса и улучшения концентрации",
    category_slug: "mindfulness",
    difficulty: "easy",
    target: 5,
    unit: "minutes",
    icon: "🧘",
    duration_days: 30,
    points: 20,
    premium: true,
    tasks: {
      daily: "Медитировать 5 минут",
      tips: ["Найдите тихое место", "Используйте приложения для медитации", "Начните с дыхательных упражнений"]
    }
  },
  {
    title: "Благодарность",
    short: "Записывайте 3 вещи за которые благодарны",
    description: "Записывайте 3 вещи, за которые вы благодарны, для улучшения настроения",
    category_slug: "mindfulness",
    difficulty: "easy",
    target: 3,
    unit: "things",
    icon: "🙏",
    duration_days: 21,
    points: 15,
    tasks: {
      daily: "Записать 3 вещи за которые благодарны",
      tips: ["Ведите дневник благодарности", "Будьте конкретными", "Замечайте мелочи"]
    }
  }
];

async function seedCategories() {
  console.log("Seeding categories...");
  for (const category of categoryData) {
    await prisma.categories.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    } as any);
  }
}

async function seedChallenges() {
  console.log("Seeding challenges...");
  
  // Сначала получаем все категории
  const categories = await prisma.categories.findMany();
  const categoryMap = new Map(categories.map(cat => [cat.slug, cat.id]));
  
  for (const challenge of challengeData) {
    const categoryId = categoryMap.get(challenge.category_slug);
    if (!categoryId) {
      console.warn(`Category not found for challenge: ${challenge.title}`);
      continue;
    }
    
    const { category_slug, ...challengeDataWithoutCategory } = challenge;
    
    await prisma.challenges.upsert({
      where: { title: challenge.title },
      update: {},
      create: {
        ...challengeDataWithoutCategory,
        category_id: categoryId,
      },
    } as any);
  }
}

async function seedProfiles() {
  console.log("Seeding profiles...");
  for (let i = 0; i < userIds.length; i++) {
    const id = userIds[i];
    const username = `user_${String(i + 1).padStart(2, "0")}`;
    await prisma.profiles.upsert({
      where: { id },
      update: { username, updated_at: new Date() as any },
      create: { id, username },
    } as any);
  }
}

async function seedUsers() {
  console.log("Seeding users...");
  // Skip users seeding since the model might not exist in current Prisma client
  console.log("Users seeding skipped - table may not exist yet");
}

async function seedScores() {
  console.log("Seeding user_scores...");
  // 10 записей с псевдослучайным score
  for (let i = 0; i < userIds.length; i++) {
    const user_id = userIds[i];
    const score = 10 + (i * 17) % 150; // псевдо-распределение для наглядности
    try {
      await prisma.user_scores.upsert({
        where: { user_id: user_id },
        update: { score: score },
        create: { user_id: user_id, score: score },
      } as any);
    } catch (e) {
      console.warn(`Skip score for ${user_id}:`, e);
    }
  }
}

async function seedBadges() {
  console.log("Seeding badges...");
  // Skip badges seeding since the model might not exist in current Prisma client
  console.log("Badges seeding skipped - table may not exist yet");
}

async function ensureLeaderboardView() {
  console.log("Ensuring leaderboard_view exists...");
  // на случай, если view не описан в Prisma — создадим через raw SQL
  await prisma.$executeRawUnsafe(`
    create or replace view leaderboard_view as
    select coalesce(p.username, left(cast(s.user_id as text), 8)) as username,
           s.user_id,
           s.score
    from user_scores s
    left join profiles p on p.id = s.user_id
    order by s.score desc;
  `);
}

async function main() {
  // проверим доступность таблиц; если моделей нет — отрапортуем и выходим
  try { await prisma.$queryRaw`select 1`; } catch (e) {
    console.error("DB connection failed:", e);
    process.exit(1);
  }

  // По очереди, с защитой от несовпадений схемы:
  try { await seedCategories(); } catch (e) { console.warn("Skip categories (model missing?)", e); }
  try { await seedChallenges(); } catch (e) { console.warn("Skip challenges (model missing?)", e); }
  try { await seedUsers(); } catch (e) { console.warn("Skip users (model missing?)", e); }
  try { await seedProfiles(); } catch (e) { console.warn("Skip profiles (model missing?)", e); }
  try { await seedScores(); } catch (e) { console.warn("Skip user_scores (model missing?)", e); }
  try { await seedBadges(); } catch (e) { console.warn("Skip badges (model missing?)", e); }
  try { await ensureLeaderboardView(); } catch (e) { console.warn("Skip view creation", e); }

  console.log("Seed finished.");
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
