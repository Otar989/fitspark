# Supabase Auth Redirect URLs

## Настройка в Supabase Dashboard

1. Перейдите в Supabase Dashboard → Authentication → URL Configuration
2. Добавьте следующие URL в поле "Redirect URLs":

```
http://localhost:3000
http://localhost:3000/auth/callback
http://localhost:3000/profile
```

## Для продакшена

Добавьте также ваши продакшн URL:

```
https://yourdomain.com
https://yourdomain.com/auth/callback
https://yourdomain.com/profile
```

## Важно

- URL должны точно совпадать (включая протокол и порт)
- Не забудьте сохранить изменения
- Проверьте, что все URL доступны и возвращают корректные страницы
