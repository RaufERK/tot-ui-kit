# @tot/ui-kit

Общий UI‑кит с `Layout`, `ScMainMenu`, `MainMenuFull` и вспомогательными компонентами (`UpperMenu`, `PageLabel` и т.д.).

## Установка в проект

### Вариант 1 — через Git URL (текущий рабочий)

```bash
npm install git+ssh://git@github.com/RaufERK/tot-ui-kit.git
```

Или в `package.json`:

```jsonc
"dependencies": {
  "@tot/ui-kit": "git+ssh://git@github.com/RaufERK/tot-ui-kit.git",
  "react": "^18.3.1",
  "react-dom": "^18.3.1"
}
```

### Подключение глобальных стилей

Входной файл приложения (например, `src/main.tsx`):

```ts
import '@tot/ui-kit/global.css';
```

## Быстрый старт

```tsx
import { Layout } from '@tot/ui-kit';

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:4000';

export const App = () => (
  <Layout
    menuProps={{
      baseUrl: API_BASE,
      menuId: 'VKIIw4zpK-wnEuFag4GXO',
      activeAppId: 'sc',
      systemTitle: 'Центр установок',
    }}
  >
    {/* контент страниц */}
  </Layout>
);
```

## Основные пропсы

- `Layout`
  - `menuProps` — любые пропсы `ScMainMenu` кроме `theme`/`layout`. Достаточно передать `baseUrl` или `apps`.
  - `initialMenuLayout`, `initialTheme` — стартовое состояние меню.
  - `headerTitle`, `headerSubtitle`, `upperMenuSlot`, `pageLabelSlot`, `footerLeft`, `footerRight` — кастомизация шапки/футера.
- `ScMainMenu`
  - `baseUrl` + `menuId` (по умолчанию `VKIIw4zpK-wnEuFag4GXO`) или `dataUrl` — откуда забрать данные о приложениях.
  - `apps` — можно передать готовый список вместо загрузки.
  - `useMockData` — включить встроенный mock‑режим на основе `singleMenuData.json` (для разработки/демо без бэка).
  - `iconResolver` — функция, которая строит `AppDescriptor` из ответа бэка.
  - `onLayoutChange`, `onThemeChange` — события переключения состояния меню.

## Скрипты разработки и релиза

Из корня `tot-ui-kit`:

```bash
npm run dev         # локальная разработка библиотеки (watch-сборка через tsup)
npm run typecheck   # проверка типов (tsc --noEmit)
npm run build       # сборка библиотеки в dist/ (ESM + CJS + d.ts)
```

### Подготовка и публикация релиза

Скрипты настроены под публикацию в настроенный npm‑registry (например, корпоративный Nexus):

```bash
npm run release:patch   # patch-версия: 0.0.1 -> 0.0.2
npm run release:minor   # minor-версия: 0.0.1 -> 0.1.0
npm run release:major   # major-версия: 0.x.y -> 1.0.0
```

Внутри они выполняют:
- `npm version <level>` — обновление `version` в `package.json` и создание git‑тега (если репозиторий под git),
- `npm publish` — публикация пакета в текущий registry.

Перед любой ручной командой `npm publish` автоматически запустится:

```bash
npm run prepublishOnly  # npm run typecheck && npm run build
```

Так мы гарантируем, что в реестр уходит собранная и типобезопасная версия библиотеки.
