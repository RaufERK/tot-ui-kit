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
