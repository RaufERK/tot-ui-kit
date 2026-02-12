# Поддержка тёмной темы в tot-ui-kit

## Обзор архитектуры

Тёмная тема в tot-ui-kit работает на **трёх уровнях**:

1. **Triplex ThemeProvider** — React-провайдер из `@sberbusiness/triplex-next`, который инжектит CSS-переменные для всех Triplex-компонентов
2. **CSS-переменные** — переопределения в `global.css` для `html[data-theme='dark']`
3. **CSS-хаки для иконок** — принудительное переопределение цветов SVG-иконок из `@sberbusiness/icons-next`

---

## Как работает переключение темы

### 1. Layout компонент (`src/components/Layout/Layout.tsx`)

При смене темы Layout выполняет:

```tsx
useEffect(() => {
  const root = document.documentElement
  
  // 1. Атрибут для CSS-селекторов
  root.setAttribute('data-theme', theme) // 'light' | 'dark'
  
  // 2. Классы для Triplex
  root.classList.remove('triplex-theme-light', 'triplex-theme-dark')
  root.classList.add(theme === 'dark' ? 'triplex-theme-dark' : 'triplex-theme-light')
  
  // 3. Классы для icons-next (для CSS-переопределений)
  root.classList.remove('icons-light_tptl2v', 'icons-dark_7mk9a3')
  root.classList.add(theme === 'dark' ? 'icons-dark_7mk9a3' : 'icons-light_tptl2v')
  
  // 4. Сохранение в localStorage
  window.localStorage.setItem('tot-ui-kit-theme', theme)
}, [theme])
```

### 2. Triplex ThemeProvider

Layout оборачивает содержимое в `ThemeProvider` из `@sberbusiness/triplex-next`:

```tsx
import { ThemeProvider, ETriplexNextTheme } from '@sberbusiness/triplex-next'

const triplexTheme = theme === 'dark' ? ETriplexNextTheme.DARK : ETriplexNextTheme.LIGHT

return (
  <ThemeProvider theme={triplexTheme} scopeRef={scopeRef}>
    <div ref={scopeRef}>
      {/* ... */}
    </div>
  </ThemeProvider>
)
```

**Что делает ThemeProvider:**
- Создаёт уникальный CSS-класс (например, `triplex-next-theme-1234567890`)
- Инжектит `<style>` с **всеми** CSS-переменными для выбранной темы
- Добавляет этот класс на элемент из `scopeRef`

### 3. CSS-переменные в global.css

Дополнительные переопределения для тёмной темы:

```css
html[data-theme='dark'] {
  /* Typography */
  --triplex-next-Typography-Primary_Color-1-14-0: rgba(255, 255, 255, 1);
  --triplex-next-Typography-Secondary_Color-1-14-0: rgba(255, 255, 255, 0.65);
  
  /* Tabs, Buttons, FormFields, Cards и т.д. */
  /* ... */
}
```

### 4. CSS-хаки для иконок

**Проблема:** Иконки из `@sberbusiness/icons-next` используют свой собственный React Context (`useTheme()`), который определяет тему. Но из-за разных копий React между библиотекой и проектом, Context не работает — иконки всегда думают, что тема светлая.

**Решение:** Принудительное переопределение CSS-классов иконок:

```css
/* Иконки используют класс ._505n0h для светлой темы (тёмная заливка #1F1F22)
   В тёмной теме меняем на белую заливку */
html[data-theme='dark'] ._505n0h {
  fill: #FFFFFF !important;
  fill-opacity: 0.35 !important;
}

html[data-theme='dark'] .hoverable:hover ._505n0h {
  fill: #FFFFFF !important;
  fill-opacity: 1 !important;
}
```

---

## Как добавить поддержку тёмной темы для нового Triplex компонента

### Шаг 1: Проверить, нужно ли что-то делать

Если компонент уже выглядит правильно — **ThemeProvider** уже подставил нужные переменные. Дополнительных действий не требуется.

### Шаг 2: Если компонент отображается неправильно

#### 2.1. Найти CSS-переменные компонента

```bash
# Пример для компонента Stepper
grep -o '\-\-triplex-next-Stepper[A-Za-z0-9_-]*' \
  node_modules/@sberbusiness/triplex-next/styles/triplex-next.css | sort | uniq
```

#### 2.2. Посмотреть значения в Triplex Storybook

1. Открыть https://storybook.triplex-dev.ru/main/
2. Найти нужный компонент
3. Переключить тему (кнопка в тулбаре)
4. В DevTools → Elements → Computed → найти нужные переменные

#### 2.3. Добавить переопределения в `src/global.css`

```css
html[data-theme='dark'] {
  /* ... существующие переменные ... */
  
  /* ===== Stepper ===== */
  --triplex-next-Stepper-Background-1-14-0: #181819;
  --triplex-next-Stepper-Step_Background_Default-1-14-0: #424245;
  /* ... */
}
```

#### 2.4. Пересобрать библиотеку

```bash
cd tot-ui-kit
npm run build
```

---

## Уже поддерживаемые компоненты

| Компонент | Статус | Переменные |
|-----------|--------|------------|
| Typography | ✅ | `--triplex-next-Typography-*` |
| Tabs | ✅ | `--triplex-next-Tabs-*` |
| Button | ✅ | `--triplex-next-Button-*` |
| FormField (TextField, Select, Input) | ✅ | `--triplex-next-FormField-*` |
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
| **Иконки (icons-next)** | ✅ | CSS-хак для `._505n0h` |
| Calendar | ❌ | Нужно проверить |
| Table | ❌ | Нужно проверить |
| Stepper | ❌ | Нужно проверить |

---

## Принципы подбора цветов для тёмной темы

### Фоны

| Элемент | Opacity | Пример |
|---------|---------|--------|
| Фон по умолчанию | 0.05-0.08 | `rgba(255, 255, 255, 0.08)` |
| Фон hover | +0.05-0.07 | `rgba(255, 255, 255, 0.12)` |
| Фон active | +0.03-0.05 | `rgba(255, 255, 255, 0.15)` |
| Фон selected | 0.15-0.20 | `rgba(255, 255, 255, 0.18)` |
| Фон disabled | 0.03-0.05 | `rgba(255, 255, 255, 0.05)` |

### Текст

| Элемент | Opacity |
|---------|---------|
| Primary | 1.0 |
| Complementary | 0.85 |
| Secondary | 0.65 |
| Tertiary | 0.55 |
| Disabled | 0.35 |
| Placeholder | 0.55 |

### Бордеры и тени

- Бордеры: `rgba(255, 255, 255, 0.12-0.25)`
- Тени: обычно убирают (`none`) или делают темнее (`rgba(0, 0, 0, 0.35)`)

---

## Использование темы в проектах

### Автоматически (через Layout)

```tsx
import { Layout } from 'tot-ui-kit'

// Layout управляет темой, кнопка переключения встроена в меню
<Layout menuProps={...}>
  {children}
</Layout>
```

### Программно

```tsx
import { useTheme, getCurrentTheme } from 'tot-ui-kit'

// Хук (реактивно обновляется)
const theme = useTheme() // 'light' | 'dark'

// Функция (получить текущее значение)
const currentTheme = getCurrentTheme()
```

### Применение темы к своим компонентам

```css
/* Ваши стили */
.my-component {
  background: var(--triplex-next-Card-Static_General_Background-1-14-0);
  color: var(--triplex-next-Typography-Primary_Color-1-14-0);
}

/* Или через data-theme */
html[data-theme='dark'] .my-component {
  background: #2d2d30;
  color: #fff;
}
```

---

## Проверка и отладка

### В браузере

1. Открыть DevTools → Elements
2. Найти `<html>` элемент
3. Проверить:
   - Атрибут `data-theme="dark"` или `data-theme="light"`
   - Классы: `triplex-theme-dark`, `icons-dark_7mk9a3`, `triplex-next-theme-*`
4. В Styles панели проверить активные CSS-переменные

### Общие проблемы

| Проблема | Причина | Решение |
|----------|---------|---------|
| Компонент не меняет цвет | Переменные не переопределены | Добавить в `global.css` для `html[data-theme='dark']` |
| Иконки остаются тёмными | CSS-хак не работает | Проверить, что `global.css` импортирован и класс `._505n0h` переопределён |
| Стили не применяются | Неправильный порядок CSS | `global.css` должен быть после `triplex-next.css` |
| ThemeProvider ошибка | Конфликт версий React | Не использовать ThemeProvider из `icons-next` напрямую |

---

## Файлы, связанные с темами

```
tot-ui-kit/
├── src/
│   ├── global.css                    # CSS-переменные для обеих тем
│   ├── components/
│   │   └── Layout/
│   │       ├── Layout.tsx            # ThemeProvider + управление темой
│   │       └── styles.css            # Стили Layout
│   └── theme/
│       └── index.ts                  # useTheme, getCurrentTheme
└── DARK-THEME.md                     # Эта документация
```
