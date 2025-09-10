# 🚀 Настройка FitSpark для продакшена

## ✅ Что уже сделано

1. **Проект успешно задеплоен на Vercel!**
   - URL: https://fitspark1-agrs5sxfj-otars-projects-e6e83f1d.vercel.app
   - Проект собирается без ошибок
   - Все основные страницы работают

## 🔧 Что нужно настроить

### 1. Настройка переменных окружения в Vercel

Зайдите в [Vercel Dashboard](https://vercel.com/otars-projects-e6e83f1d/fitspark_1) и добавьте переменные:

```
NEXT_PUBLIC_SUPABASE_URL=https://ffwuvdxfqtirqyinshgp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ваш_anon_ключ
SUPABASE_SERVICE_ROLE_KEY=ваш_service_role_ключ
DATABASE_URL=postgres://postgres:ourRd7bujproaGKl@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true
DIRECT_URL=postgres://postgres:ourRd7bujproaGKl@db.ffwuvdxfqtirqyinshgp.supabase.co:5432/postgres?sslmode=require
```

### 2. Настройка Supabase

1. **Примените миграции:**
   ```sql
   -- Выполните в Supabase SQL Editor
   -- Содержимое файла: supabase/migrations/003_create_tables.sql
   ```

2. **Настройте политики:**
   ```sql
   -- Выполните в Supabase SQL Editor
   -- Содержимое файла: supabase_policies.sql
   ```

3. **Добавьте Redirect URLs:**
   - Зайдите в Authentication → URL Configuration
   - Добавьте: `https://fitspark1-agrs5sxfj-otars-projects-e6e83f1d.vercel.app`

### 3. Заполните базу данных

Выполните seed скрипт:
```bash
npm run db:seed
```

### 4. Настройка YooKassa (опционально)

Добавьте в Vercel переменные:
```
YOOKASSA_SHOP_ID=ваш_shop_id
YOOKASSA_SECRET_KEY=ваш_secret_key
YOOKASSA_RETURN_URL=https://fitspark1-agrs5sxfj-otars-projects-e6e83f1d.vercel.app/checkout/success
```

## 🎯 Проверка работы

После настройки проверьте:

1. **Главная страница:** https://fitspark1-agrs5sxfj-otars-projects-e6e83f1d.vercel.app
2. **Челленджи:** https://fitspark1-agrs5sxfj-otars-projects-e6e83f1d.vercel.app/challenges
3. **Рейтинг:** https://fitspark1-agrs5sxfj-otars-projects-e6e83f1d.vercel.app/leaderboard
4. **Профиль:** https://fitspark1-agrs5sxfj-otars-projects-e6e83f1d.vercel.app/profile
5. **Админка:** https://fitspark1-agrs5sxfj-otars-projects-e6e83f1d.vercel.app/admin

## 🔄 Обновление деплоя

Для обновления сайта:
```bash
git add .
git commit -m "Update"
git push
```

Vercel автоматически задеплоит изменения.

## 📱 Мобильная версия

Сайт адаптирован для мобильных устройств и работает как PWA.

## 🆘 Поддержка

Если что-то не работает:
1. Проверьте логи в Vercel Dashboard
2. Убедитесь, что все переменные окружения настроены
3. Проверьте, что Supabase миграции применены
4. Убедитесь, что Redirect URLs настроены в Supabase

---

**Поздравляем! Ваш FitSpark готов к использованию! 🎉**
