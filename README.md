# tot-ui-kit

UI-библиотека с `Layout`, `ScMainMenu` и поддержкой светлой/тёмной темы для React-приложений.

> **Важно**: Библиотека использует обычный CSS (без CSS Modules). В проектах на webpack убедитесь, что подключены `css-loader` и `style-loader`. В Vite всё работает из коробки.

## Установка

```bash
npm install tot-ui-kit @sberbusiness/triplex-next @sberbusiness/icons-next
```

## ⚠️ Критически важно: Подключение CSS

**Порядок CSS импортов критичен для корректной работы тем!**

В входном файле приложения (`src/main.tsx`):

```tsx
// src/main.tsx

// 1. CSS импорты — ПЕРВЫМИ и в этом порядке!
import '@sberbusiness/icons-next/styles/icons.css'   // Стили иконок
import '@sberbusiness/triplex-next/styles/triplex-next.css'  // Triplex базовые стили
import 'tot-ui-kit/dist/index.css'  // Стили Layout + меню + темы (включает global.css)
import './styles/index.css'          // Ваши локальные стили — последними

// 2. Только потом React и компоненты
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

### Частые ошибки

| Проблема | Симптом | Решение |
|----------|---------|---------|
| Отсутствует `tot-ui-kit/dist/index.css` | Меню без стилей, тема не работает | Добавить импорт |
| Неправильный порядок CSS | Стили перебиваются | icons → triplex → tot-ui-kit → локальные |
| CSS после React импортов | Стили могут не применяться | CSS импорты в самом начале файла |

## Быстрый старт

```tsx
import { Layout } from 'tot-ui-kit'

export const App = () => (
  <Layout
    menuProps={{
      baseUrl: 'http://localhost:4000',
      menuId: '<your-menu-id>',
      activeAppId: 'my-app',
      systemTitle: 'Моё приложение',
    }}
  >
    {/* контент страниц */}
  </Layout>
)
```

## Темы: светлая и тёмная

### Как это работает

Layout автоматически управляет темой:

1. **Triplex ThemeProvider** — инжектит CSS-переменные для всех Triplex-компонентов (Button, TextField, Select, Tabs и т.д.)
2. **CSS-переменные** — дополнительные переопределения в `global.css`
3. **CSS-хак для иконок** — принудительное переопределение цветов SVG из `@sberbusiness/icons-next`

При смене темы Layout:
- Устанавливает `data-theme="light"` / `data-theme="dark"` на `<html>`
- Добавляет классы `triplex-theme-light` / `triplex-theme-dark`
- Переключает `ThemeProvider` из triplex-next
- Сохраняет выбор в `localStorage`

**Кнопка переключения** встроена в боковое меню (иконка солнца/луны).

### Использование в коде

```tsx
import { Layout, useTheme, getCurrentTheme } from 'tot-ui-kit'

// Хук — реактивно обновляется при смене темы
const theme = useTheme() // 'light' | 'dark'

// Функция — получить текущую тему синхронно
const currentTheme = getCurrentTheme()
```

### Применение темы к своим компонентам

```css
/* Используйте CSS-переменные из Triplex */
.my-card {
  background: var(--triplex-next-Card-Static_General_Background-1-14-0);
  color: var(--triplex-next-Typography-Primary_Color-1-14-0);
}

/* Или через data-theme */
html[data-theme='dark'] .my-card {
  background: #2d2d30;
}
```

### Поддерживаемые компоненты

Тёмная тема работает из коробки для:
- Typography, Button, Tabs
- TextField, SelectField, Checkbox, Radio
- Card, Modal, Dropdown
- Link, Tag, Divider, Island
- **Иконки** из `@sberbusiness/icons-next` (крестики, шевроны и т.д.)

> Подробная документация: см. **[DARK-THEME.md](./DARK-THEME.md)**

## Основные пропсы

### Layout

| Проп | Описание |
|------|----------|
| `menuProps` | Пропсы для `ScMainMenu` (кроме `theme`/`layout`) |
| `initialMenuLayout` | Начальное состояние меню: `'full'` или `'compact'` |
| `initialTheme` | Начальная тема: `'light'` или `'dark'` |

### ScMainMenu

| Проп | Описание |
|------|----------|
| `baseUrl` | Базовый URL API |
| `menuId` | ID меню для загрузки данных |
| `activeAppId` | ID активного приложения |
| `useMockData` | Использовать встроенные mock-данные |
| `onLayoutChange` | Callback при переключении layout |
| `onThemeChange` | Callback при переключении темы |

## Peer Dependencies

```json
{
  "@sberbusiness/triplex-next": "^1.14.0",
  "@sberbusiness/icons-next": "^1.11.0",
  "react": "^18.0.0",
  "react-dom": "^18.0.0"
}
```

## Структура файлов (темы)

```
tot-ui-kit/
├── src/
│   ├── global.css           # CSS-переменные для тёмной темы + хаки для иконок
│   ├── components/
│   │   └── Layout/
│   │       └── Layout.tsx   # ThemeProvider + логика переключения
│   └── theme/
│       └── index.ts         # useTheme, getCurrentTheme
├── DARK-THEME.md            # Подробная документация по темам
└── README.md                # Этот файл
```

## Лицензия

MIT
