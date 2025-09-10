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

const challengeData = [
  {
    title: "10,000 Шагов в День",
    description: "Ходите 10,000 шагов каждый день для поддержания активности",
    target: 10000,
    unit: "шагов",
    icon: "🚶",
    category: "активность"
  },
  {
    title: "2 Литра Воды",
    description: "Пейте 2 литра чистой воды для здоровья",
    target: 2000,
    unit: "мл",
    icon: "💧",
    category: "питание"
  },
  {
    title: "30 Отжиманий",
    description: "Делайте 30 отжиманий для укрепления мышц",
    target: 30,
    unit: "раз",
    icon: "💪",
    category: "силовая"
  },
  {
    title: "Читать 20 Страниц",
    description: "Читайте 20 страниц книги для развития ума",
    target: 20,
    unit: "страниц",
    icon: "📚",
    category: "развитие"
  },
  {
    title: "5 Минут Медитации",
    description: "Медитируйте 5 минут для внутреннего покоя",
    target: 5,
    unit: "минут",
    icon: "🧘",
    category: "ментальное",
    premium: true
  },
  {
    title: "8 Часов Сна",
    description: "Спите 8 часов для восстановления",
    target: 8,
    unit: "часов",
    icon: "😴",
    category: "сон"
  },
  {
    title: "Планка 1 Минута",
    description: "Держите планку 1 минуту для укрепления кора",
    target: 60,
    unit: "секунд",
    icon: "🏋️",
    category: "силовая",
    premium: true
  },
  {
    title: "Изучить 10 Новых Слов",
    description: "Изучайте новые слова для развития языка",
    target: 10,
    unit: "слов",
    icon: "🎓",
    category: "развитие",
    premium: true
  }
];

async function seedChallenges() {
  console.log("Seeding challenges...");
  for (const challenge of challengeData) {
    await prisma.challenges.upsert({
      where: { title: challenge.title },
      update: {},
      create: challenge,
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
