-- Insert initial challenges
INSERT INTO public.challenges (title, slug, category, description, unit, target, period, premium, image_url, active) VALUES
  ('10,000 шагов в день', 'steps-daily-10k', 'steps', 'Делай 10,000 шагов каждый день для поддержания активности', 'steps', 10000, 'daily', false, '/images/challenges/steps.jpg', true),
  ('1.5л воды в день', 'water-daily-1500ml', 'water', 'Выпивай 1.5 литра чистой воды ежедневно', 'ml', 1500, 'daily', false, '/images/challenges/water.jpg', true),
  ('40 приседаний', 'strength-40-squats', 'strength', 'Делай 40 приседаний каждый день для укрепления ног', 'reps', 40, 'daily', false, '/images/challenges/squats.jpg', true),
  ('15 минут растяжки', 'stretch-15min', 'stretch', 'Уделяй 15 минут растяжке для гибкости и восстановления', 'min', 15, 'daily', false, '/images/challenges/stretch.jpg', true),
  ('7 часов сна', 'sleep-7hours', 'sleep', 'Спи 7+ часов для качественного восстановления', 'hours', 7, 'daily', true, '/images/challenges/sleep.jpg', true),
  ('Пробежка 5км в выходные', 'weekend-run-5k', 'misc', 'Беги 5 километров каждые выходные', 'min', 30, 'weekly', true, '/images/challenges/run.jpg', true);

-- Insert badges
INSERT INTO public.badges (code, title, description, image_url) VALUES
  ('STREAK_3', 'Первые 3 дня подряд', 'Выполнил челлендж 3 дня подряд', '🔥'),
  ('STREAK_7', 'Неделя без пропусков', 'Выполнял челлендж целую неделю', '⚡'),
  ('STREAK_14', 'Две недели силы', 'Продержался 2 недели подряд', '💪'),
  ('STREAK_30', 'Железный месяц', 'Невероятно - целый месяц!', '🏆'),
  ('EARLY_BIRD', 'Ранняя пташка', 'Выполнил челлендж до 9 утра', '🌅'),
  ('WATER_MASTER', 'Мастер воды', 'Выпил 100 литров за месяц', '💧'),
  ('STEP_WARRIOR', 'Воин шагов', 'Прошел 1 миллион шагов', '👟'),
  ('STRENGTH_HERO', 'Герой силы', 'Сделал 10,000 приседаний', '🦵');