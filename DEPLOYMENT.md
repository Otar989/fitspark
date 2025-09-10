# 🚀 Инструкция по деплою FitSpark

## Вариант 1: Vercel (Рекомендуется)

### Шаг 1: Подготовка
1. Убедитесь, что проект собирается: `npm run build`
2. Создайте аккаунт на [vercel.com](https://vercel.com)

### Шаг 2: Деплой через веб-интерфейс
1. Зайдите на [vercel.com](https://vercel.com)
2. Нажмите "New Project"
3. Подключите ваш GitHub репозиторий
4. Vercel автоматически определит Next.js
5. Нажмите "Deploy"

### Шаг 3: Настройка переменных окружения
В настройках проекта добавьте:
- `NEXT_PUBLIC_SUPABASE_URL` - URL вашего Supabase проекта
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Anon ключ из Supabase
- `SUPABASE_SERVICE_ROLE_KEY` - Service Role ключ
- `DATABASE_URL` - URL базы данных
- `DIRECT_URL` - Direct URL базы данных

### Шаг 4: Настройка Supabase
1. Зайдите в Supabase Dashboard
2. Примените миграции из папки `supabase/migrations/`
3. Выполните SQL из `supabase_policies.sql`
4. Добавьте Redirect URLs в Authentication:
   - `https://your-app.vercel.app`
   - `https://your-app.vercel.app/auth/callback`

## Вариант 2: Netlify

### Шаг 1: Подготовка
1. Создайте `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"
```

### Шаг 2: Деплой
1. Зайдите на [netlify.com](https://netlify.com)
2. Подключите GitHub репозиторий
3. Настройте переменные окружения
4. Деплойте

## Вариант 3: Railway

### Шаг 1: Подготовка
1. Создайте `railway.json`:
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/"
  }
}
```

### Шаг 2: Деплой
1. Зайдите на [railway.app](https://railway.app)
2. Подключите GitHub
3. Выберите репозиторий
4. Настройте переменные окружения

## После деплоя

1. **Проверьте работу сайта** - откройте URL
2. **Настройте Supabase** - примените миграции и политики
3. **Настройте YooKassa** - добавьте реальные ключи
4. **Протестируйте функциональность** - создайте челленджи, проверьте рейтинг

## Полезные ссылки

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Documentation](https://supabase.com/docs)
