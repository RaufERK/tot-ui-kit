# tot-ui-kit — Developer Guide

Внутренняя документация для разработчиков библиотеки.

## Структура проекта

```
src/
├── assets/icons/       # SVG-иконки как React-компоненты
├── components/
│   ├── Layout/         # Основной layout (sidebar + content)
│   ├── MainMenu/       # Навигационное меню
│   ├── UpperMenu/      # Верхняя панель (deprecated)
│   └── PageLabel/      # Заголовок страницы (deprecated)
├── data/               # Mock-данные для разработки
├── global.css          # Глобальные стили и переопределения тем
└── index.ts            # Экспорты библиотеки
```

## Скрипты

```bash
npm run dev         # Watch-сборка (разработка)
npm run build       # Продакшн-сборка в dist/
npm run typecheck   # Проверка типов
npm run lint        # ESLint
npm run lint:fix    # ESLint с автоисправлением
```

## Добавление иконок

1. Добавь SVG в `src/assets/icons/`
2. Создай React-компонент в `src/assets/icons/index.tsx`
3. Добавь маппинг в `appIconMap` в `src/components/MainMenu/ScMainMenu.tsx`

```tsx
// src/assets/icons/index.tsx
export const MyNewIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox='0 0 20 20' {...props}>
    {/* ... */}
  </svg>
)

// src/components/MainMenu/ScMainMenu.tsx
const appIconMap = {
  // ...
  my_app: MyNewIcon,
}
```

## Публикация в npm

### Подготовка

```bash
npm run typecheck   # Проверка типов
npm run build       # Сборка
npm pack            # Локальная проверка (создаёт .tgz)
```

### Авторизация в npm

```bash
npm login           # Откроется браузер для авторизации
npm whoami          # Проверить что залогинен
```

### Публикация

```bash
# Увеличение версии
npm version patch   # 1.0.0 → 1.0.1
npm version minor   # 1.0.0 → 1.1.0
npm version major   # 1.0.0 → 2.0.0

# Публикация (откроется браузер для подтверждения)
npm publish --access public
```

## Тестирование

- Локально: `npm link` в библиотеке, `npm link tot-ui-kit` в проекте
- Или через `file:` в package.json: `"tot-ui-kit": "file:../tot-ui-kit"`

### Чеклист

- [ ] `npm run typecheck` — без ошибок
- [ ] `npm run build` — собирается
- [ ] Навигация между пунктами меню
- [ ] Переключение темы (light/dark)
- [ ] Переключение layout (full/compact)
- [ ] Загрузка данных с `baseUrl` и с `apps`
- [ ] Mock-режим (`useMockData`)

## Git

Репозиторий: `git@sberworks.ru:7998/~erk.r/tot-ui-kit.git`

```bash
git push origin main
```

## Заметки

- `UpperMenu` и `PageLabel` — deprecated, оставлены для совместимости
- Иконки определяются по `client_id`, поле `icon` в данных бэкенда игнорируется
- CSS без modules — классы с префиксом `sc-` для изоляции
