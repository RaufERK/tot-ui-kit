## План публикации `@tot/ui-kit`

Цель: оставить рабочий вариант через Git‑URL, но иметь понятную инструкцию, как опубликовать пакет в **корпоративный Nexus** (или при необходимости в общий npm‑registry).

---

## 1. Текущий рабочий вариант — Git URL

- В проектах (`example-menu`, `test-lib`, другие) можно подключать либу так:

```jsonc
"dependencies": {
  "@tot/ui-kit": "git+ssh://git@github.com/RaufERK/tot-ui-kit.git",
  "react": "^18.3.1",
  "react-dom": "^18.3.1"
}
```

- Требования:
  - настроен SSH‑доступ к GitHub (`git@github.com:RaufERK/...`),
  - ветка `main` в `tot-ui-kit` стабильная (можно привязываться к тегу: `...git#v0.0.1`).

Этот вариант можно оставлять как основной до тех пор, пока не появятся права и время разбираться с Nexus.

---

## 2. Подготовка пакета к публикации в Nexus

Работы делаются в репозитории `tot-ui-kit`.

- **2.1. Проверить `package.json`**
  - Важно:
    - `"name": "@tot/ui-kit"` — финальное имя пакета в registry.
    - `"version": "0.0.1"` — при каждой публикации нужно увеличивать (semver).
    - `"main"`, `"module"`, `"types"`, `"exports"` — сейчас смотрят на `src`.  
      Для прод‑публикации в Nexus можно:
      - либо продолжать публиковать `src` (TypeScript + bundler на стороне потребителя),
      - либо переключиться на сборку в `dist` (`main: "dist/index.cjs"`, `module: "dist/index.mjs"`, `types: "dist/index.d.ts"`), если в компании так принято.

- **2.2. Добавить `publishConfig` (опционально)**
  - Если в компании есть отдельный scope/registry:

```jsonc
"publishConfig": {
  "registry": "https://nexus.example.com/repository/npm-group/"
}
```

  - Адрес и точный путь подскажет админ Nexus или дока по фронтовому registry.

- **2.3. Проверить сборку и типы**

```bash
cd /path/to/tot-ui-kit
npm install
npm run typecheck
npm run build
```

  - ✅ Сборка работает: CSS Modules (`.module.css`) обрабатываются tsup из коробки.
  - ❌ SCSS не поддерживается tsup без плагинов — все файлы переведены на чистый CSS.

---

## 3. Настройка доступа к Nexus

Делается один раз на машине разработчика.

- **3.1. Настроить `.npmrc`**

Обычно нужен логин/токен для registry. Пример (обезличенный):

```ini
registry=https://nexus.example.com/repository/npm-group/
//nexus.example.com/repository/npm-group/:_authToken=XXXXX
always-auth=true
```

Где:
- `registry` — общий URL Nexus для npm,
- `_authToken` или `username/password` — выдаётся администратором.

Файл можно положить:
- либо в `$HOME/.npmrc` (глобально),
- либо рядом с `package.json` в `tot-ui-kit` (локально для проекта).

- **3.2. Проверить логин**

```bash
npm whoami
```

Если команда отрабатывает без ошибки и показывает имя пользователя — доступ к registry есть.

---

## 4. Публикация в Nexus

Когда всё готово (код, версия, доступы):

- **4.1. Увеличить версию**

```bash
cd /path/to/tot-ui-kit
npm version patch   # или minor/major по смыслу
```

Это:
- обновит поле `"version"` в `package.json`,
- создаст git‑тег (если репозиторий под git и настроен).

- **4.2. Публикация**

```bash
# проверит типы и соберёт dist/ (prepublishOnly)
npm publish
```

Либо, если используется другой package manager (pnpm/yarn npm/pnpm publish) — по корпоративным правилам.

После успешной публикации пакет `@tot/ui-kit@X.Y.Z` станет доступен из Nexus.

---

## 4.3. Использование готовых release‑скриптов

В `package.json` уже настроены вспомогательные команды:

```jsonc
"scripts": {
  "build": "tsup src/index.ts --format esm,cjs --dts --out-dir dist",
  "dev": "tsup src/index.ts --format esm,cjs --dts --out-dir dist --watch",
  "typecheck": "tsc --noEmit",
  "prepublishOnly": "npm run typecheck && npm run build",
  "release:patch": "npm version patch && npm publish",
  "release:minor": "npm version minor && npm publish",
  "release:major": "npm version major && npm publish"
}
```

- `prepublishOnly`:
  - автоматически запускается перед **любым** `npm publish`,
  - выполняет `npm run typecheck && npm run build`.
- `release:patch` / `release:minor` / `release:major`:
  - обновляют версию (`npm version ...`),
  - вызывают `npm publish` (c учётом `prepublishOnly`).

Примеры:

```bash
npm run release:patch   # 0.0.1 -> 0.0.2, типы/сборка, затем publish
npm run release:minor   # 0.0.1 -> 0.1.0, типы/сборка, затем publish
```

---

## 5. Использование пакета из Nexus в приложениях

В любом проекте (включая `example-menu`, `test-lib`, `new-frontend` в корпоративном репо):

- В `package.json`:

```jsonc
"dependencies": {
  "@tot/ui-kit": "0.0.2",
  "react": "^18.3.1",
  "react-dom": "^18.3.1"
}
```

- Если в корпоративной npm‑конфигурации всё правильно настроено:
  - `npm install` сам возьмёт пакет из Nexus,
  - **Git‑URL больше не нужен**.

---

## 6. Публикация в публичный npm (если когда‑то понадобится)

Только если политика компании это разрешает.

- Проверить, что:
  - `name` не конфликтует с существующим пакетом в npm,
  - нет приватного кода/URL внутри.
- Войти под своим npm‑аккаунтом:

```bash
npm login
```

- Опубликовать:

```bash
npm publish --access public
```

Но этот шаг — только по отдельному решению, по умолчанию предполагается **только Nexus**.


