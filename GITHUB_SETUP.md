# 🐙 Настройка GitHub репозитория

## Шаги для создания репозитория на GitHub

### 1. Создание репозитория на GitHub

1. Перейдите на [GitHub.com](https://github.com)
2. Нажмите кнопку **"New"** или **"+"** → **"New repository"**
3. Заполните форму:
   - **Repository name:** `fitspark`
   - **Description:** `⚡ FitSpark - Челленджи здоровья. Превращай здоровые привычки в увлекательную игру!`
   - **Visibility:** Public (или Private, если хотите)
   - **Initialize repository:** НЕ отмечайте (у нас уже есть файлы)
4. Нажмите **"Create repository"**

### 2. Подключение локального репозитория к GitHub

После создания репозитория GitHub покажет инструкции. Выполните команды:

```bash
# Добавьте remote origin (замените YOUR_USERNAME на ваш GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/fitspark.git

# Переименуйте ветку в main (если нужно)
git branch -M main

# Отправьте код на GitHub
git push -u origin main
```

### 3. Альтернативный способ через SSH

Если у вас настроен SSH ключ:

```bash
git remote add origin git@github.com:YOUR_USERNAME/fitspark.git
git branch -M main
git push -u origin main
```

## 🚀 После создания репозитория

### Настройка GitHub Pages (опционально)

1. Перейдите в **Settings** → **Pages**
2. Выберите **Source:** Deploy from a branch
3. Выберите **Branch:** main
4. Нажмите **Save**

### Настройка автоматического деплоя на Vercel

1. Перейдите на [Vercel.com](https://vercel.com)
2. Нажмите **"New Project"**
3. Подключите ваш GitHub аккаунт
4. Выберите репозиторий `fitspark`
5. Настройте переменные окружения
6. Нажмите **"Deploy"**

### Настройка GitHub Actions (опционально)

Создайте файл `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build
      run: npm run build
```

## 📋 Чек-лист

- [ ] Создан репозиторий на GitHub
- [ ] Подключен remote origin
- [ ] Код отправлен на GitHub
- [ ] Настроен автоматический деплой на Vercel
- [ ] Добавлены переменные окружения в Vercel
- [ ] Проверена работа сайта в продакшене

## 🔗 Полезные ссылки

- [GitHub Docs](https://docs.github.com)
- [Vercel GitHub Integration](https://vercel.com/docs/concepts/git/vercel-for-github)
- [GitHub Actions](https://docs.github.com/en/actions)

---

**Готово! Ваш проект теперь на GitHub! 🎉**
