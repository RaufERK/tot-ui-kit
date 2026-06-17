# Backend Contract: Main Menu

Документ описывает формат данных, который backend должен отдавать для построения меню в `tot-ui-kit`.

## Главное

- Меню запрашивается с backend API и строится компонентом `ScMainMenu`.
- Backend сам определяет доступное меню по текущей backend-сессии пользователя.
- `Authorization` / Bearer token не нужен и не является частью обязательного контракта.
- Если токен не передан, это не должно ломать выдачу меню.
- Иконки backend не отдаёт: библиотека выбирает иконку локально по `client_id`.
- Поле `icon` считается deprecated и игнорируется UI-kit.

## Endpoint

Рекомендуемый session-only вариант:

```http
GET /idp/single-menu-data
```

Текущий совместимый вариант для существующей интеграции `ScMainMenu`:

```http
GET /idp/single-menu-data/{menuId}
```

`menuId` можно использовать как технический ключ меню или как часть старого маршрута. Права доступа и состав меню backend должен определять по сессии, а не по `menuId` и не по frontend-токену.

Если backend использует endpoint без `menuId`, приложение может передать точный URL через `dataUrl`:

```tsx
<Layout
  menuProps={{
    dataUrl: 'https://api.example.com/idp/single-menu-data',
    fetchOptions: { credentials: 'include' },
  }}
>
  {children}
</Layout>
```

Если используется текущая схема `baseUrl + menuId`, UI-kit сам соберёт URL:

```tsx
<Layout
  menuProps={{
    baseUrl: 'https://api.example.com',
    menuId: 'sc',
    fetchOptions: { credentials: 'include' },
  }}
>
  {children}
</Layout>
```

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
    "client_id": "dashboard",
    "app_name": "Dashboard",
    "link": "https://dashboard.ladoga.sberanalytics.ru/",
    "description": "Главный экран",
    "order": 1,
    "available": true
  },
  {
    "client_id": "sc",
    "app_name": "Центр установок",
    "link": "https://ladoga.sberanalytics.ru/sc/",
    "description": "Системный блок, позволяет управлять архитектурой системы",
    "order": 2,
    "available": true
  }
]
```

## Поля MenuItem

| Поле | Тип | Обязательное | Описание |
|------|-----|--------------|----------|
| `client_id` | `string` | Да | Стабильный ID приложения. Используется для локального выбора иконки. Рекомендуемый формат: `snake_case`, латиница/цифры/`_`/`-`. |
| `app_name` | `string` | Да | Название, которое показывается в меню. |
| `link` | `string` | Да | URL перехода при клике. Для доступных пунктов должен быть рабочим absolute URL или app-relative path. |
| `description` | `string` | Нет | Описание приложения. Сейчас в меню не отображается, но полезно для отладки/будущего UI. |
| `order` | `number` | Нет | Порядок сортировки по возрастанию. Если не передан, frontend ставит пункт в конец. |
| `available` | `boolean` | Нет | `false` скрывает пункт из меню. Если поле отсутствует, пункт считается доступным. |
| `icon` | `string` | Нет | Deprecated. Не использовать для новой интеграции, UI-kit игнорирует это поле. |

## Правила обработки на frontend

- Пункты с `available: false` не отображаются.
- Пункты сортируются по `order` по возрастанию.
- Если `order` не передан, используется fallback `999`.
- `client_id` нужен для локального выбора иконки.
- Если для `client_id` нет локальной иконки, UI-kit покажет fallback-иконку.
- Backend должен возвращать только те приложения, которые доступны текущему пользователю/клиенту по сессии.

## Известные client_id для иконок

| `client_id` | Иконка |
|-------------|--------|
| `dashboard` | AppsGrid |
| `users` | Users |
| `sc` | DownloadsCenter |
| `dwh_bridge` | NetworkSquares |
| `transformation` | Transformation |
| `table_manager` | TableManager |
| `metadata` | Metadata |
| `navigator` | Navigator |
| `question` | Question |

Новые `client_id` можно отдавать сразу: меню отобразится с fallback-иконкой. Чтобы добавить отдельную иконку, нужно обновить маппинг в `src/components/MainMenu/ScMainMenu.tsx`.

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
