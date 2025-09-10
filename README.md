# ⚡ FitSpark - Челленджи здоровья

Превращай здоровые привычки в увлекательную игру! Выполняй ежедневные челленджи, зарабатывай очки, получай бейджи и соревнуйся с друзьями на пути к здоровому образу жизни.

## 🚀 Демо

- **Продакшен:** [https://fitspark1-5fvy2w1af-otars-projects-e6e83f1d.vercel.app](https://fitspark1-5fvy2w1af-otars-projects-e6e83f1d.vercel.app)
- **Локально:** `npm run dev` → http://localhost:3000

## ✨ Возможности

- 🔐 **Полная система авторизации** - регистрация/вход через email или Google OAuth
- 🎯 **Ежедневные челленджи** - вода, шаги, силовые, растяжка
- 🏆 **Система очков и рейтинга** - соревнуйся с другими пользователями
- 👤 **Управление профилем** - настройка username и статистики
- 🎨 **Красивый UI** - современный дизайн с glass-эффектами
- 📱 **Адаптивный дизайн** - работает на всех устройствах
- 🔧 **Админка** - управление челленджами

## 🛠 Технологии

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **ORM:** Prisma
- **Платежи:** YooKassa
- **Деплой:** Vercel
- **UI:** Lucide React, Framer Motion

## 🚀 Быстрый старт

### 1. Клонирование репозитория

```bash
git clone https://github.com/yourusername/fitspark.git
cd fitspark
```

### 2. Установка зависимостей

```bash
npm install
```

### 3. Настройка переменных окружения

Создайте файл `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"
SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"
DATABASE_URL="your_database_url"
DIRECT_URL="your_direct_url"
```

### 4. Запуск в режиме разработки

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

## 📁 Структура проекта

```
fitspark/
├── src/
│   ├── app/                 # Next.js App Router страницы
│   │   ├── auth/           # Страницы авторизации
│   │   ├── api/            # API endpoints
│   │   └── ...             # Основные страницы
│   ├── components/         # React компоненты
│   └── lib/               # Утилиты и конфигурация
├── supabase/              # Миграции и схемы БД
├── prisma/               # Prisma схема и сиды
└── public/               # Статические файлы
```

## 🔧 API Endpoints

- `GET /api/challenges` - Получить список челленджей
- `POST /api/challenges` - Создать новый челлендж
- `GET /api/leaderboard` - Получить рейтинг
- `GET /api/profile` - Получить профиль пользователя
- `PUT /api/profile` - Обновить профиль
- `GET /api/me` - Статистика пользователя

## 🎨 Страницы

- `/` - Главная страница
- `/auth/login` - Вход/регистрация
- `/challenges` - Список челленджей
- `/leaderboard` - Рейтинг пользователей
- `/profile` - Профиль пользователя
- `/admin` - Админка (управление челленджами)
- `/app` - Дашборд (требует авторизации)

## 🚀 Деплой

### Vercel (рекомендуется)

1. Подключите репозиторий к Vercel
2. Настройте переменные окружения
3. Деплой произойдет автоматически

### Другие платформы

- **Netlify:** Поддерживается из коробки
- **Railway:** Требует настройки `railway.json`
- **DigitalOcean:** Настройка через App Platform

## 🔐 Настройка Supabase

1. Создайте проект в [Supabase](https://supabase.com)
2. Примените миграции из папки `supabase/migrations/`
3. Настройте RLS политики из `supabase_policies.sql`
4. Добавьте Redirect URLs в Authentication settings

## 💳 Настройка YooKassa

1. Получите ключи в [YooKassa](https://yookassa.ru)
2. Добавьте переменные окружения:
   - `YOOKASSA_SHOP_ID`
   - `YOOKASSA_SECRET_KEY`
   - `YOOKASSA_RETURN_URL`

## 📝 Скрипты

```bash
npm run dev          # Запуск в режиме разработки
npm run build        # Сборка для продакшена
npm run start        # Запуск продакшен версии
npm run db:generate  # Генерация Prisma клиента
npm run db:migrate   # Применение миграций
npm run db:seed      # Заполнение БД тестовыми данными
```

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте ветку для новой функции (`git checkout -b feature/amazing-feature`)
3. Зафиксируйте изменения (`git commit -m 'Add amazing feature'`)
4. Отправьте в ветку (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📄 Лицензия

Этот проект лицензирован под MIT License - см. файл [LICENSE](LICENSE) для деталей.

## 👥 Авторы

- **FitSpark Team** - *Изначальная разработка*

## 🙏 Благодарности

- [Next.js](https://nextjs.org) - React фреймворк
- [Supabase](https://supabase.com) - Backend-as-a-Service
- [Tailwind CSS](https://tailwindcss.com) - CSS фреймворк
- [Lucide](https://lucide.dev) - Иконки
- [Vercel](https://vercel.com) - Хостинг

---

⭐ Если проект вам понравился, поставьте звезду!
