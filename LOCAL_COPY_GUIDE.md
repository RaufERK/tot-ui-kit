# Локальное копирование tot-ui-kit

Короткая рекомендация: если Nexus задерживает или блокирует версии, копируем исходники библиотеки внутрь проекта-потребителя как обычный код. Не используем `file:../tot-ui-kit` для контейнерной сборки, потому что соседняя папка может не попасть в Docker build context.

## Что копировать

Рекомендуемый вариант — копировать весь каталог `src`:

```txt
tot-ui-kit/
  src/
    assets/
    components/
    data/
    global.css
    global.d.ts
    index.ts
    theme.ts
```

В проекте-потребителе положить так:

```txt
project/
  src/
    vendor/
      tot-ui-kit/
        assets/
        components/
        data/
        global.css
        global.d.ts
        index.ts
        theme.ts
```

Не нужно копировать:

```txt
node_modules/
dist/
package-lock.json
scripts/
docs/
```

`dist` нужен для npm-публикации, но при локальном копировании удобнее импортировать исходники TypeScript напрямую из `src/vendor/tot-ui-kit`.

## Карта проекта

```txt
src/
  index.ts                    # публичный entrypoint библиотеки
  global.css                  # глобальные стили, Triplex tokens, overrides icons-next
  theme.ts                    # getCurrentTheme и useTheme
  global.d.ts                 # декларации для CSS/SVG
  assets/icons/               # локальные SVG-иконки меню
  components/Layout/          # Layout: оболочка приложения и боковое меню
  components/MainMenu/        # ScMainMenu, MainMenuBase, MainMenuFull, типы меню
  components/PageLabel/       # устаревший PageLabel, оставлен для совместимости
  components/UpperMenu/       # устаревший UpperMenu, оставлен для совместимости
  data/                       # mock data для разработки
```

Главные публичные экспорты находятся в `src/index.ts`:

```ts
export { default as Layout } from './components/Layout'
export { MainMenuBase, MainMenuFull, ScMainMenu } from './components/MainMenu'
export { default as PageLabel } from './components/PageLabel'
export { default as UpperMenu } from './components/UpperMenu'
export { getCurrentTheme, useTheme } from './theme'
```

## Зависимости в проекте-потребителе

В проекте, куда копируем код, должны быть установлены внешние зависимости:

```json
{
  "dependencies": {
    "@sberbusiness/icons-next": "1.27.0",
    "@sberbusiness/triplex-next": "1.34.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  }
}
```

Версии Triplex и icons-next должны совпадать с теми, под которые обновлены токены в `global.css`.

## Как импортировать

Самый простой импорт без alias:

```ts
import { Layout, useTheme } from './vendor/tot-ui-kit'
```

Лучше настроить alias, чтобы потом легко вернуться на npm-пакет:

```json
{
  "compilerOptions": {
    "paths": {
      "@tot/ui-kit": ["./src/vendor/tot-ui-kit/index.ts"]
    }
  }
}
```

Для Vite дополнительно:

```ts
resolve: {
  alias: {
    '@tot/ui-kit': '/src/vendor/tot-ui-kit/index.ts',
  },
}
```

После этого импорт выглядит как раньше:

```ts
import { Layout, useTheme } from '@tot/ui-kit'
```

## CSS

В текущем entrypoint `index.ts` уже есть:

```ts
import './global.css'
```

Для Vite/обычного React этого достаточно.

Если проект на Next.js App Router и он ругается на global CSS import из локальной библиотеки, нужно импортировать CSS в `app/layout.tsx`, а из локального `index.ts` убрать `import './global.css'`:

```ts
import '@/vendor/tot-ui-kit/global.css'
```

## Как обновлять копию

1. Обновить отдельный репозиторий `tot-ui-kit`.
2. Собрать и проверить библиотеку здесь: `npm run typecheck && npm run build`.
3. Скопировать свежий `src` в `project/src/vendor/tot-ui-kit`.
4. Проверить, что в проекте-потребителе стоят нужные версии `@sberbusiness/triplex-next` и `@sberbusiness/icons-next`.
5. Собрать проект-потребитель.
6. Закоммитить обновлённую папку `src/vendor/tot-ui-kit` в репозитории проекта-потребителя.

Для команды из двух разработчиков этого достаточно: один обновляет vendored-копию, второй получает её обычным `git pull`.
