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
    slug: "fitness",
    name: "Фитнес",
    icon: "💪",
    color: "from-orange-500 to-red-500",
    description: "Физические упражнения и активность"
  },
  {
    slug: "nutrition", 
    name: "Питание",
    icon: "🥗",
    color: "from-green-500 to-emerald-500",
    description: "Здоровое питание и диета"
  },
  {
    slug: "mindfulness",
    name: "Осознанность", 
    icon: "🧘",
    color: "from-purple-500 to-indigo-500",
    description: "Медитация и ментальное здоровье"
  },
  {
    slug: "habits",
    name: "Привычки",
    icon: "🎯", 
    color: "from-blue-500 to-cyan-500",
    description: "Полезные ежедневные привычки"
  },
  {
    slug: "social",
    name: "Социальное",
    icon: "👥",
    color: "from-pink-500 to-rose-500", 
    description: "Социальные активности"
  }
];

const challengeData = [
  // Фитнес
  {
    title: "10,000 Шагов в День",
    description: "Ходите 10,000 шагов каждый день для поддержания активности и здоровья сердечно-сосудистой системы",
    category_slug: "fitness",
    difficulty: "easy",
    target_value: 10000,
    target_unit: "шагов",
    duration_days: 30,
    points_reward: 25,
    is_premium: false,
    proof_required: "number",
    tasks: {
      daily: "Пройти 10,000 шагов",
      tips: ["Используйте лестницу вместо лифта", "Паркуйтесь дальше от входа", "Делайте короткие прогулки в течение дня"]
    }
  },
  {
    title: "15,000 Шагов в День",
    description: "Ходите 15,000 шагов для более интенсивной физической активности",
    category_slug: "fitness",
    difficulty: "hard",
    target_value: 15000,
    target_unit: "шагов", 
    duration_days: 21,
    points_reward: 40,
    is_premium: true,
    proof_required: "number",
    tasks: {
      daily: "Пройти 15,000 шагов",
      tips: ["Добавьте утреннюю пробежку", "Используйте фитнес-трекер", "Планируйте пешие маршруты"]
    }
  },
  {
    title: "30 Минут Тренировок",
    description: "Тренируйтесь по 30 минут каждый день для улучшения физической формы",
    category_slug: "fitness", 
    difficulty: "medium",
    target_value: 30,
    target_unit: "минут",
    duration_days: 21,
    points_reward: 35,
    is_premium: false,
    proof_required: "photo",
    tasks: {
      daily: "Тренироваться 30 минут",
      tips: ["Выберите любимый вид активности", "Разминайтесь перед тренировкой", "Постепенно увеличивайте нагрузку"]
    }
  },

  // Питание
  {
    title: "2 Литра Воды",
    description: "Пейте 2 литра чистой воды для поддержания водного баланса и здоровья",
    category_slug: "nutrition",
    difficulty: "easy",
    target_value: 2000,
    target_unit: "мл",
    duration_days: 30,
    points_reward: 20,
    is_premium: false,
    proof_required: "number",
    tasks: {
      daily: "Выпить 2 литра воды",
      tips: ["Начните день со стакана воды", "Пейте перед едой", "Используйте приложения для отслеживания"]
    }
  },
  {
    title: "5 Порций Овощей",
    description: "Ешьте 5 порций овощей и фруктов для получения витаминов и клетчатки",
    category_slug: "nutrition",
    difficulty: "medium",
    target_value: 5,
    target_unit: "порций",
    duration_days: 21,
    points_reward: 25,
    is_premium: false,
    proof_required: "photo",
    tasks: {
      daily: "Съесть 5 порций овощей/фруктов",
      tips: ["Добавляйте овощи в каждый прием пищи", "Готовьте смузи", "Перекусывайте фруктами"]
    }
  },
  {
    title: "Без Сахара",
    description: "Избегайте добавленного сахара в течение дня",
    category_slug: "nutrition",
    difficulty: "hard",
    target_value: 1,
    target_unit: "день",
    duration_days: 14,
    points_reward: 45,
    is_premium: true,
    proof_required: "text",
    tasks: {
      daily: "Провести день без добавленного сахара",
      tips: ["Читайте этикетки", "Замените сладости на фрукты", "Пейте воду вместо сладких напитков"]
    }
  },

  // Осознанность 
  {
    title: "5 Минут Медитации",
    description: "Медитируйте 5 минут для снижения стресса и улучшения концентрации",
    category_slug: "mindfulness",
    difficulty: "easy",
    target_value: 5,
    target_unit: "минут",
    duration_days: 30,
    points_reward: 20,
    is_premium: false,
    proof_required: "text",
    tasks: {
      daily: "Медитировать 5 минут",
      tips: ["Найдите тихое место", "Используйте приложения для медитации", "Начните с дыхательных упражнений"]
    }
  },
  {
    title: "Дневник Благодарности",
    description: "Записывайте 3 вещи, за которые вы благодарны, для улучшения настроения",
    category_slug: "mindfulness",
    difficulty: "easy",
    target_value: 3,
    target_unit: "записи",
    duration_days: 21,
    points_reward: 15,
    is_premium: false,
    proof_required: "text",
    tasks: {
      daily: "Записать 3 вещи за которые благодарны",
      tips: ["Ведите дневник благодарности", "Будьте конкретными", "Замечайте мелочи"]
    }
  },

  // Привычки
  {
    title: "8 Часов Сна",
    description: "Спите 8 часов для восстановления организма и поддержания здоровья",
    category_slug: "habits",
    difficulty: "medium",
    target_value: 8,
    target_unit: "часов",
    duration_days: 30,
    points_reward: 30,
    is_premium: false,
    proof_required: "number",
    tasks: {
      daily: "Спать 8 часов",
      tips: ["Ложитесь в одно время", "Избегайте экранов перед сном", "Создайте ритуал перед сном"]
    }
  },
  {
    title: "Утренняя Рутина",
    description: "Выполняйте утреннюю рутину в течение 30 минут после пробуждения",
    category_slug: "habits", 
    difficulty: "medium",
    target_value: 30,
    target_unit: "минут",
    duration_days: 21,
    points_reward: 25,
    is_premium: true,
    proof_required: "text",
    tasks: {
      daily: "Выполнить утреннюю рутину",
      tips: ["Составьте план с вечера", "Начните с простых действий", "Будьте последовательны"]
    }
  },

  // Социальные
  {
    title: "Связь с Друзьями",
    description: "Свяжитесь с другом или близким человеком",
    category_slug: "social",
    difficulty: "easy",
    target_value: 1,
    target_unit: "звонок",
    duration_days: 14,
    points_reward: 15,
    is_premium: false,
    proof_required: "text",
    tasks: {
      daily: "Связаться с другом",
      tips: ["Напишите сообщение или позвоните", "Поделитесь чем-то приятным", "Покажите интерес к их жизни"]
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
        title: challenge.title,
        description: challenge.description,
        difficulty: challenge.difficulty,
        target_value: challenge.target_value,
        target_unit: challenge.target_unit,
        duration_days: challenge.duration_days,
        points_reward: challenge.points_reward,
        is_premium: challenge.is_premium,
        proof_required: challenge.proof_required,
        tasks: challenge.tasks,
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
