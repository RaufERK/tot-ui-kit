# @data-platform/ui-shell

Общий пакет с `Layout`, `ScMainMenu`, `MainMenuFull` и вспомогательными компонентами (`UpperMenu`, `PageLabel`).

## Установка

Когда репозиторий используется как Yarn workspace:

```bash
yarn workspace new-frontend add @data-platform/ui-shell
```

Для внешних проектов пакет можно опубликовать в приватный npm-реестр и поставить через `yarn add @data-platform/ui-shell`.

## Быстрый старт

```tsx
import { Layout } from "@data-platform/ui-shell";
import { apiData } from "@/api/ApiData";

export const App = () => (
  <Layout
    menuProps={{
      baseUrl: apiData.server,
      menuId: "VKIIw4zpK-wnEuFag4GXO",
      activeAppId: "sc",
      systemTitle: "Центр установок",
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
  - `iconResolver` — функция, которая строит `AppDescriptor` из ответа бэка.
  - `onLayoutChange`, `onThemeChange` — события переключения состояния меню.

## Дальше

## Публикация

### Локальная проверка пакета
```bash
cd packages/main-menu
yarn build        # (если решим собирать dist)
yarn pack         # создаёт tgz
```

### Публикация в приватный npm/ghcr
```bash
cd packages/main-menu
yarn publish --tag next --access restricted
```

> Перед публикацией обнови `version` и пропиши `npmrc` с токеном к реестру.

## Чеклист тестирования
- `yarn workspace @data-platform/ui-shell run typecheck`
- `yarn workspace new-frontend run dev` — меню публичной версии подхватывается из пакета
- Проверить навигацию между пунктами, переключение темы/раскладки, кастомные слоты
- Проверить загрузку данных: `baseUrl` (mock-backend) и вариант с заранее переданным `apps`

# tot-ui-kit
