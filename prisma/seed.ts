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

const challengeTitles = [
  "Steps 10k / day",
  "Drink 2L water",
  "No sugar today",
  "Read 20 pages",
  "Cold shower 60s",
];

async function seedChallenges() {
  console.log("Seeding challenges...");
  for (const title of challengeTitles) {
    await prisma.challenges.upsert({
      where: { title }, // предполагается уникальность title; если нет — он всё равно вставит
      update: {},
      create: { title },
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

async function seedScores() {
  console.log("Seeding user_scores...");
  // 20 записей с псевдослучайным score
  const pairs: Array<{ user_id: string; score: number }> = [];
  for (let i = 0; i < 20; i++) {
    const user_id = userIds[i % userIds.length];
    const score = 10 + (i * 7) % 120; // псевдо-распределение для наглядности
    pairs.push({ user_id, score });
  }
  // upsert по первичному ключу (user_id)
  for (const p of pairs) {
    await prisma.user_scores.upsert({
      where: { user_id: p.user_id },
      update: { score: p.score },
      create: { user_id: p.user_id, score: p.score },
    } as any);
  }
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
  try { await seedProfiles(); } catch (e) { console.warn("Skip profiles (model missing?)", e); }
  try { await seedScores(); } catch (e) { console.warn("Skip user_scores (model missing?)", e); }
  try { await ensureLeaderboardView(); } catch (e) { console.warn("Skip view creation", e); }

  console.log("Seed finished.");
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
