# tot-ui-kit

UI-библиотека с `Layout`, `ScMainMenu` и поддержкой тем для React-приложений.

> **Важно**: Библиотека использует обычный CSS (без CSS Modules). В проектах на webpack убедитесь, что подключены `css-loader` и `style-loader` (или `mini-css-extract-plugin` для продакшена). В Vite всё работает из коробки.

## Установка

```bash
npm install tot-ui-kit
```

### Подключение глобальных стилей

В входном файле приложения (например, `src/main.tsx`):

```ts
import 'tot-ui-kit/global.css'
import '@sberbusiness/triplex-next/styles/triplex-next.css'
import '@sberbusiness/icons-next/styles/icons.css'
```

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
  "@sberbusiness/triplex-next": "^1.14.0",
  "@sberbusiness/icons-next": "^1.11.0",
  "react": "^18.3.1",
  "react-dom": "^18.3.1"
}
```

## Лицензия

MIT
