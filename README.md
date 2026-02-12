# tot-ui-kit

UI-библиотека с `Layout`, `ScMainMenu` и поддержкой тем для React-приложений.

> **Важно**: Библиотека использует обычный CSS (без CSS Modules). В проектах на webpack убедитесь, что подключены `css-loader` и `style-loader` (или `mini-css-extract-plugin` для продакшена). В Vite всё работает из коробки.

## Установка

```bash
npm install tot-ui-kit @sberbusiness/triplex-next @sberbusiness/icons-next
```

## ⚠️ Критически важно: Подключение CSS

**Порядок и состав CSS импортов критичен для корректной работы!**

В входном файле приложения (`src/main.tsx`) импорты CSS должны быть:
1. **В начале файла** (до импорта React и компонентов)
2. **В строго определённом порядке**

```tsx
// src/main.tsx

// 1. CSS импорты — ПЕРВЫМИ и в этом порядке!
import '@sberbusiness/icons-next/styles/icons.css'
import '@sberbusiness/triplex-next/styles/triplex-next.css'
import 'tot-ui-kit/global.css'
import 'tot-ui-kit/dist/index.css'  // ← Обязательно! Без этого меню не отображается
import './styles/index.css'          // ваши локальные стили последними

// 2. Только потом React и компоненты
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
```

### Частые ошибки

| Проблема | Симптом | Решение |
|----------|---------|---------|
| Отсутствует `tot-ui-kit/dist/index.css` | Меню отображается как текст без стилей, иконки в ряд сверху | Добавить импорт `import 'tot-ui-kit/dist/index.css'` |
| Неправильный порядок CSS | Стили перебиваются, меню выглядит сломанным | Соблюдать порядок: icons → triplex → tot-ui-kit → локальные |
| CSS после React импортов | Стили могут не применяться | CSS импорты должны быть в самом начале файла |

## Быстрый старт

```tsx
import { Layout } from 'tot-ui-kit'

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:4000'

export const App = () => (
  <Layout
    menuProps={{
      baseUrl: API_BASE,
      menuId: '<your-menu-id>',
      activeAppId: 'my-app',
      systemTitle: 'Моё приложение',
    }}
  >
    {/* контент страниц */}
  </Layout>
)
```

## Основные пропсы

### Layout

| Проп | Описание |
|------|----------|
| `menuProps` | Пропсы для `ScMainMenu` (кроме `theme`/`layout`) |
| `initialMenuLayout` | Начальное состояние меню: `'full'` или `'compact'` |
| `initialTheme` | Начальная тема: `'light'` или `'dark'` |
| `headerTitle`, `headerSubtitle` | Заголовок и подзаголовок в шапке |
| `upperMenuSlot`, `pageLabelSlot` | Кастомные слоты для шапки |
| `footerLeft`, `footerRight` | Контент футера |

### ScMainMenu

| Проп | Описание |
|------|----------|
| `baseUrl` | Базовый URL API (формирует `${baseUrl}/idp/single-menu-data/${menuId}`) |
| `menuId` | ID меню для загрузки данных |
| `dataUrl` | Полный URL для загрузки (альтернатива `baseUrl` + `menuId`) |
| `apps` | Готовый список приложений (вместо загрузки) |
| `activeAppId` | ID активного приложения |
| `useMockData` | Использовать встроенные mock-данные |
| `iconResolver` | Кастомная функция для построения `AppDescriptor` |
| `onLayoutChange` | Callback при переключении layout |
| `onThemeChange` | Callback при переключении темы |

## Темы: светлая и тёмная

### Как работает переключение темы

1. **Layout** управляет темой автоматически:
   - Устанавливает `data-theme="light"` или `data-theme="dark"` на `<html>`
   - Добавляет классы `triplex-theme-light` / `triplex-theme-dark`
   - Сохраняет выбор в `localStorage`
   - Кнопка переключения встроена в меню

2. **CSS-переменные** определены в `global.css`:
   - Светлая тема — значения по умолчанию
   - Тёмная тема — переопределения в `html[data-theme='dark']`

3. **Triplex компоненты** используют CSS-переменные вида `--triplex-next-*`

### Использование темы в коде

```tsx
import { Layout, useTheme, getCurrentTheme } from 'tot-ui-kit'

// Хук — автоматически обновляется при смене темы
const theme = useTheme() // 'light' | 'dark'

// Функция — получить текущую тему синхронно
const currentTheme = getCurrentTheme()
```

### Кастомизация цветов

Переопределите CSS-переменные в своём CSS **после** импорта `global.css`:

```css
/* your-styles.css */
html[data-theme='light'] {
  /* Ваши цвета для светлой темы */
  --triplex-next-Typography-Primary_Color-1-14-0: #333;
  --triplex-next-ColorNeutral-90-1-14-0: #f0f0f0;
}

html[data-theme='dark'] {
  /* Ваши цвета для тёмной темы */
  --triplex-next-Typography-Primary_Color-1-14-0: #eee;
  --triplex-next-ColorNeutral-90-1-14-0: #1a1a1a;
}
```

### Кастомизация меню

Меню использует классы с префиксом `sc-`:

```css
/* Светлая тема меню */
.sc-main-menu_theme_light {
  background-color: #your-light-bg;
  color: #your-light-text;
}

/* Тёмная тема меню */
.sc-main-menu_theme_dark {
  background-color: #your-dark-bg;
  color: #your-dark-text;
}
```

### Основные CSS-переменные

| Переменная | Назначение |
|------------|------------|
| `--triplex-next-Typography-Primary_Color-*` | Основной цвет текста |
| `--triplex-next-Typography-Secondary_Color-*` | Вторичный цвет текста |
| `--triplex-next-ColorNeutral-90-*` | Фон страницы |
| `--triplex-next-Button-*` | Кнопки |
| `--triplex-next-FormField-*` | Инпуты, селекты |
| `--triplex-next-Card-*` | Карточки |
| `--triplex-next-Dropdown-*` | Выпадающие списки |

### Принципы подбора цветов для тёмной темы

| Элемент | Рекомендация |
|---------|--------------|
| Фон | `rgba(255, 255, 255, 0.05-0.15)` |
| Фон hover | Увеличить opacity на 0.05-0.07 |
| Фон selected | `rgba(255, 255, 255, 0.15-0.2)` |
| Текст primary | `rgba(255, 255, 255, 1)` |
| Текст secondary | `rgba(255, 255, 255, 0.65)` |
| Текст disabled | `rgba(255, 255, 255, 0.35)` |
| Бордеры | `rgba(255, 255, 255, 0.12-0.2)` |

> Подробная документация по темам: см. `DARK-THEME.md`

## Peer Dependencies

```json
{
  "@sberbusiness/triplex-next": "^1.0.0",
  "@sberbusiness/icons-next": "^1.0.0",
  "react": "^18.0.0",
  "react-dom": "^18.0.0"
}
```

> Рекомендуемые версии: `@sberbusiness/triplex-next@^1.14.0`, `@sberbusiness/icons-next@^1.12.0`

## Лицензия

MIT
