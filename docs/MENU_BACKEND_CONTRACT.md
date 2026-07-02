# Backend Contract: Main Menu

Документ описывает формат данных, который backend должен отдавать для построения меню в `tot-ui-kit`.

## Главное

- Меню запрашивается с backend API и строится компонентом `ScMainMenu`.
- Backend сам определяет доступное меню по текущей backend-сессии пользователя.
- `Authorization` / Bearer token не нужен и не является частью обязательного контракта.
- Если токен не передан, это не должно ломать выдачу меню.
- Иконки backend не отдаёт: библиотека выбирает иконку локально по `app_id`.
- Поле `icon` считается deprecated и игнорируется UI-kit.

## Endpoint

Основной session-only вариант:

```http
GET /iam/menu/
```

Если приложение передаёт только `baseUrl`, UI-kit сам соберёт URL:

```tsx
<Layout
  menuProps={{
    baseUrl: 'https://api.example.com',
    fetchOptions: { credentials: 'include' },
  }}
>
  {children}
</Layout>
```

Итоговый запрос:

```http
GET https://api.example.com/iam/menu/
```

Если нужен другой путь, его можно задать без правки собранного JS:

```tsx
<Layout
  menuProps={{
    baseUrl: 'https://api.example.com',
    menuEndpoint: '/iam/menu/',
    fetchOptions: { credentials: 'include' },
  }}
>
  {children}
</Layout>
```

Если нужен полностью точный URL, приложение может передать `dataUrl`.
В этом режиме `baseUrl`, `menuEndpoint` и `menuId` не используются:

```tsx
<Layout
  menuProps={{
    dataUrl: 'https://api.example.com/iam/menu/',
    fetchOptions: { credentials: 'include' },
  }}
>
  {children}
</Layout>
```

Legacy-вариант со старым endpoint и `menuId` тоже возможен через шаблон:

```tsx
<Layout
  menuProps={{
    baseUrl: 'https://api.example.com',
    menuEndpoint: '/idp/single-menu-data/:menuId',
    menuId: 'sc',
    fetchOptions: { credentials: 'include' },
  }}
>
  {children}
</Layout>
```

`menuId` нужен только для legacy-шаблонов, где `menuEndpoint` содержит `:menuId`.
Для `/iam/menu/` права доступа и состав меню backend определяет по сессии.

## Авторизация

Backend использует существующую session/cookie авторизацию.

Frontend не обязан передавать `Authorization` header. Если API и приложение находятся на разных origin, нужно включить cookie-запросы:

- frontend: `fetchOptions: { credentials: 'include' }`;
- backend: `Access-Control-Allow-Credentials: true`;
- backend: `Access-Control-Allow-Origin` должен быть конкретным origin приложения, не `*`;
- session cookie должна быть настроена так, чтобы браузер отправлял её на API domain.

Если API и frontend на одном origin, browser session cookie отправится штатно.

## Response

Успешный ответ: `200 OK`, `Content-Type: application/json`.

Тело ответа - массив пунктов меню:

```json
[
  {
    "app_id": "dashboard",
    "app_name": "Платформа данных",
    "link": "http://localhost:5174/dashboard/",
    "description": "Главный экран",
    "available": true
  },
  {
    "app_id": "sc",
    "app_name": "Центр установок",
    "link": "https://ladoga.sberanalytics.ru/sc/",
    "description": "Системный блок, позволяет управлять архитектурой системы",
    "available": true
  }
]
```

Полный пример ответа backend лежит в `docs/menu.backend.example.json`.

## Поля MenuItem

| Поле | Тип | Обязательное | Описание |
|------|-----|--------------|----------|
| `app_id` | `string` | Да | Стабильный ID приложения. Используется для локального выбора иконки. Рекомендуемый формат: `snake_case`, латиница/цифры/`_`/`-`. |
| `app_name` | `string` | Да | Название, которое показывается в меню. |
| `link` | `string` | Да | URL перехода при клике. Для доступных пунктов должен быть рабочим absolute URL или app-relative path. |
| `description` | `string` | Нет | Описание приложения. Сейчас в меню не отображается, но полезно для отладки/будущего UI. |
| `available` | `boolean` | Нет | `false` скрывает пункт из меню. Если поле отсутствует, пункт считается доступным. |
| `icon` | `string` | Нет | Deprecated. Не использовать для новой интеграции, UI-kit игнорирует это поле. |

## Правила обработки на frontend

- Пункты с `available: false` не отображаются.
- Порядок пунктов сохраняется таким, каким backend вернул массив.
- `app_id` нужен для локального выбора иконки.
- Если для `app_id` нет локальной иконки, UI-kit покажет fallback-иконку.
- `profile` и `help` не показываются в верхнем списке приложений: эти записи используются для нижних кнопок профиля и помощи.
- Если backend не вернул `profile` или `help`, соответствующая нижняя кнопка не отображается.
- Backend должен возвращать только те приложения, которые доступны текущему пользователю/клиенту по сессии.

## Известные app_id для иконок

| `app_id` | Иконка |
|-------------|--------|
| `dashboard` | AppsGrid |
| `users` | Users |
| `sc` | DownloadsCenter |
| `dwh_bridge` | NetworkSquares |
| `transformation` | Transformation |
| `table_manager` | TableManager |
| `metadata` | Metadata |
| `navigator` | Navigator |
| `profile` | UserPick |
| `help` | Question |

Новые `app_id` можно отдавать сразу: меню отобразится с fallback-иконкой. Чтобы добавить отдельную иконку, нужно обновить маппинг в `src/components/MainMenu/ScMainMenu.tsx`.

## Ошибки

Рекомендуемые статусы:

| Статус | Когда возвращать |
|--------|------------------|
| `200` | Меню успешно найдено. Можно вернуть пустой массив, если доступных пунктов нет. |
| `401` | Нет валидной backend-сессии. |
| `403` | Сессия есть, но пользователю нельзя получать меню. |
| `500` | Непредвиденная ошибка backend. |

При ошибке frontend очистит меню и вызовет `onError`, если callback передан.

## Swagger

OpenAPI JSON лежит в `menu.openapi.json`.
