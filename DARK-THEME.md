# Поддержка тёмной темы в tot-ui-kit

## Как работает переключение темы

1. **Layout компонент** (`src/components/Layout/Layout.tsx`) управляет темой:
   - Устанавливает `data-theme="light"` или `data-theme="dark"` на `<html>`
   - Добавляет классы `triplex-theme-light` / `triplex-theme-dark`
   - Сохраняет выбор в `localStorage`

2. **CSS-переменные** определены в `src/global.css`:
   - Светлая тема — значения по умолчанию
   - Тёмная тема — переопределения в `html[data-theme='dark']`

3. **Triplex компоненты** используют CSS-переменные вида `--triplex-next-*`

## Как добавить поддержку тёмной темы для нового Triplex компонента

### Шаг 1: Найти CSS-переменные компонента

```bash
# Пример для компонента Button
grep -o '\-\-triplex-next-Button[A-Za-z0-9_-]*' \
  node_modules/@sberbusiness/triplex-next/styles/triplex-next.css | sort | uniq
```

### Шаг 2: Получить значения по умолчанию (светлая тема)

```bash
grep -E '\-\-triplex-next-Button-[A-Za-z0-9_-]+:[^;]+' \
  node_modules/@sberbusiness/triplex-next/styles/triplex-next.css
```

### Шаг 3: Добавить переопределения в `src/global.css`

```css
html[data-theme='dark'] {
  /* ... существующие переменные ... */
  
  /* Button — тёмная тема */
  --triplex-next-Button-Secondary_Background_Default-1-14-0: rgba(255, 255, 255, 0.08);
  --triplex-next-Button-Secondary_Color_Default-1-14-0: rgba(255, 255, 255, 0.85);
  /* ... и т.д. */
}
```

### Шаг 4: Пересобрать библиотеку

```bash
cd tot-ui-kit
npm run build
```

## Уже поддерживаемые компоненты

| Компонент | Статус | Переменные |
|-----------|--------|------------|
| Typography | ✅ | `--triplex-next-Typography-*` |
| Tabs | ✅ | `--triplex-next-Tabs-*` |
| Button | ✅ | `--triplex-next-Button-*` |
| FormField (TextField, Select) | ✅ | `--triplex-next-FormField-*` |
| SmallInput | ✅ | `--triplex-next-SmallInput-*` |
| Dropdown | ✅ | `--triplex-next-Dropdown-*`, `--triplex-next-DropdownList-*` |
| Checkbox | ✅ | `--triplex-next-Checkbox-*` |
| Radio | ✅ | `--triplex-next-Radio-*` |
| Card | ✅ | `--triplex-next-Card-*` |
| Modal | ✅ | `--triplex-next-ModalWindow-*` |
| Island | ✅ | `--triplex-next-Island-*` |
| ListItem | ✅ | `--triplex-next-ListItem-*` |
| Divider | ✅ | `--triplex-next-Divider-*` |
| Link | ✅ | `--triplex-next-Link-*` |
| Tag | ✅ | `--triplex-next-Tag-*` |
| Calendar | ❌ | Нужно добавить |
| Table | ❌ | Нужно добавить |
| Stepper | ❌ | Нужно добавить |

## Принципы подбора цветов для тёмной темы

- **Фон**: `rgba(255, 255, 255, 0.05-0.15)` — полупрозрачный белый
- **Фон hover**: увеличить opacity на 0.05-0.07
- **Фон selected**: `rgba(255, 255, 255, 0.15-0.2)`
- **Текст primary**: `rgba(255, 255, 255, 1)`
- **Текст secondary**: `rgba(255, 255, 255, 0.65)`
- **Текст disabled**: `rgba(255, 255, 255, 0.35)`
- **Бордеры**: `rgba(255, 255, 255, 0.12-0.2)`

## Использование темы в проектах

```tsx
import { Layout, useTheme } from 'tot-ui-kit'

// Получить текущую тему
const theme = useTheme() // 'light' | 'dark'

// Layout автоматически добавляет кнопку переключения темы
<Layout menuProps={...}>
  {children}
</Layout>
```

## Проверка темы в браузере

1. Открыть DevTools → Elements
2. Найти `<html>` элемент
3. Проверить атрибут `data-theme="dark"` или `data-theme="light"`
4. В Styles панели можно видеть активные CSS-переменные

## Troubleshooting

**Компонент не меняет цвет при смене темы:**
- Проверить, есть ли переменные этого компонента в `global.css` для `html[data-theme='dark']`
- Убедиться, что библиотека пересобрана (`npm run build`)
- Убедиться, что проект использует актуальную версию библиотеки

**Переменные не применяются:**
- Проверить порядок подключения CSS — `global.css` должен идти после `triplex-next.css`
- Проверить специфичность селекторов
