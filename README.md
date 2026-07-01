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
      fetchOptions: { credentials: 'include' },
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

### ⭐ Рекомендуемый способ: Body из triplex-next

**Лучший способ создать контейнер с автоматической поддержкой тем:**

```tsx
import { Body, EBodyPageType, EBodyPageVerticalMargin } from '@sberbusiness/triplex-next'

const MyPage = () => (
  <div className={styles.container}>
    {/* Island с автоматическим переключением тем */}
    <Body
      type={EBodyPageType.FIRST}
      verticalMargin={EBodyPageVerticalMargin.SMALL}
      className={styles.section}
    >
      <h2>Заголовок секции</h2>
      {/* Ваш контент */}
    </Body>
  </div>
)
```

**Преимущества:**
- ✅ Не нужно писать CSS для тёмной темы — Body автоматически переключает цвета
- ✅ Консистентный дизайн с остальными Triplex компонентами
- ✅ `type="FIRST"` создаёт Island (карточку с фоном), `type="SECOND"` — без фона

> Подробнее: [triplex-design.ru/next/ru/Web/Components/platform/body%20page](https://triplex-design.ru/next/ru/Web/Components/platform/body%20page)

### Ручной способ: CSS-переменные

```css
/* Используйте CSS-переменные из Triplex */
.my-card {
  background: var(--triplex-next-Card-Static_General_Background-1-33-0);
  color: var(--triplex-next-Typography-Primary_Color-1-33-0);
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

> Подробная документация: см. **[docs/DARK-THEME.md](./docs/DARK-THEME.md)**

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
| `dataUrl` | Точный URL API меню. Если передан, используется вместо `baseUrl` |
| `baseUrl` | Базовый URL API. По умолчанию меню грузится с `${baseUrl}/iam/menu/` |
| `menuEndpoint` | Путь меню относительно `baseUrl`, по умолчанию `/iam/menu/` |
| `menuId` | Legacy ID меню. Используется только если `menuEndpoint` содержит `:menuId` |
| `activeAppId` | ID активного приложения |
| `profileAppId` | Service ID профиля для нижней кнопки, по умолчанию `profile` |
| `profileHref` | URL профиля для нижней кнопки, если backend не прислал service item `profile` |
| `helpHref` | URL помощи для нижней кнопки, если backend не прислал service item `help` |
| `useMockData` | Использовать встроенные mock-данные |
| `onLayoutChange` | Callback при переключении layout |
| `onThemeChange` | Callback при переключении темы |

## Backend Contract для меню

Короткий текст для backend-разработчика лежит в [docs/MENU_BACKEND_SHORT_RU.txt](./docs/MENU_BACKEND_SHORT_RU.txt).
Подробный формат backend API описан в [docs/MENU_BACKEND_CONTRACT.md](./docs/MENU_BACKEND_CONTRACT.md).
Swagger/OpenAPI JSON лежит в [docs/menu.openapi.json](./docs/menu.openapi.json).

Коротко:
- backend отдаёт меню по текущей session/cookie;
- `Authorization` / Bearer token не обязателен;
- дефолтный endpoint: `/iam/menu/`;
- frontend ждёт массив `{ app_id, app_name, link, available?, description? }`;
- порядок пунктов берётся из массива backend;
- иконки выбираются локально по `app_id`, поле `icon` deprecated.
- `profile`, `profil`, `help`, `question` считаются service item и не показываются в верхнем списке приложений.

## Peer Dependencies

```json
{
  "@sberbusiness/triplex-next": "^1.33.0",
  "@sberbusiness/icons-next": "^1.26.0",
  "react": "^18.3.1",
  "react-dom": "^18.3.1"
}
```

## Структура файлов (темы)

```
tot-ui-kit/
├── docs/
│   ├── DARK-THEME.md        # Подробная документация по темам
│   ├── DEV_README.md        # Developer guide
│   ├── MENU_BACKEND_CONTRACT.md
│   ├── MENU_BACKEND_SHORT_RU.txt
│   └── menu.openapi.json
├── src/
│   ├── global.css           # CSS-переменные для тёмной темы + хаки для иконок
│   ├── components/
│   │   └── Layout/
│   │       └── Layout.tsx   # ThemeProvider + логика переключения
│   └── theme/
│       └── index.ts         # useTheme, getCurrentTheme
└── README.md                # Этот файл
```

## Лицензия

MIT
