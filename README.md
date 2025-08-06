# Мой next js 14 стартер

Основан на:

daisyUi с практиками и компонентами вёрстки

## Установка, основные принципы

```shell
yarn create next-app -e https://github.com/tarchevsky/my-next
```

В качестве package manager используется bun, по крайней мере пока.

##### Вывод постов только выбранных категорий

Перечислить до объявления страницы выбранные категории

```tsx
const FEATURE_CATEGORY_IDS = ['dGVybTo1', 'dGVybTo0']
```

И сам компонент

```tsx
<PostsByCategories posts={postsByCategories} />
```

##### Проверка ISR

Вставляем на страницу под объявлением страницы

```tsx
const generationTime = new Date().toISOString()
```

И компонент

```tsx
<IsrDebugIndicator pageId="homepage" />
```

Можно проверить страницу на ревалидацию. В браузере вбиваем

```tsx
https://sitename.ru/api/revalidate?path=/&secret=123456
```

/ - это адрес страницы.

Либо ставим:

в странице

```tsx
<IsrDebugIndicator
  pageId="homepage"
  serverGenerationTime={generationTime}
  showOnlyInDevelopment={true}
/>
```

в шаблоне категории

```tsx
<IsrDebugIndicator
  pageId={`category-${category}`}
  serverGenerationTime={generationTime}
  showOnlyInDevelopment={true}
/>
```

в шаблоне поста

```tsx
<IsrDebugIndicator
  pageId="homepage"
  serverGenerationTime={generationTime}
  showOnlyInDevelopment={true}
/>
```

Либо внутри самого компонента

```tsx

```

# Инструкция по запуску проекта (Next.js + WordPress admin)

## 1. Подготовка

1. Убедитесь, что DNS доменов `ustroy.art` и `upravdom.ustroy.art` указывают на IP вашего сервера.
2. Откройте порты 80 и 443 на сервере (firewall, cloud-панель и т.д.).
3. Проверьте файл `.env`:
   - Email для certbot (`youremail@domain.com` в `docker-compose.yml`) — замените на свой.
   - Все переменные для базы и WordPress уже сгенерированы, логины/пароли можно посмотреть в `.env`.

---

## 2. Первый запуск (получение SSL-сертификатов)

1. Соберите и запустите сервисы, кроме certbot и certbot-init:
   ```sh
   docker compose up -d nextjs nginx db wordpress
   ```
2. Получите сертификаты для обоих доменов:
   ```sh
   docker compose run --rm certbot-init
   ```
   - Если всё прошло успешно, certbot получит сертификаты для `ustroy.art` и `upravdom.ustroy.art`.
   - После этого сервис `certbot-init` больше не нужен.

---

## 3. Запуск всех сервисов (production)

1. Запустите все сервисы, включая автоматическое обновление сертификатов:
   ```sh
   docker compose up -d
   ```
   - Контейнеры: nextjs, nginx, db, wordpress, certbot.

---

## 4. Проверка работы

- **Next.js сайт:**  
  Откройте https://ustroy.art — должен открыться основной сайт.
- **WordPress админка:**  
  Откройте https://upravdom.ustroy.art/wp-login.php  
  Введите логин и пароль из `.env` (`WORDPRESS_ADMIN_USER`, `WORDPRESS_ADMIN_PASSWORD`).

---

## 5. Локальная разработка

Для локальной разработки используйте:

```sh
docker compose -f docker-compose.local.yml up
```

- Next.js будет доступен на http://localhost:8080

---

## 6. Управление сервисами

- Остановить все сервисы:
  ```sh
  docker compose down
  ```
- Посмотреть логи:
  ```sh
  docker compose logs -f
  ```

---

## 7. Важно

- **Данные базы и WordPress** хранятся в volume, не теряются при перезапуске.
- **Сертификаты** автоматически обновляются раз в неделю.
- **Пароли и логины** можно сменить в админке WordPress после первого входа.
- **Почту** для certbot обязательно укажите свою, чтобы получать уведомления о сертификатах.

---

Если потребуется сбросить пароль WordPress или сменить пользователя — воспользуйтесь WP-CLI или обратитесь к администратору.

## Подключение к базе данных MariaDB

После запуска docker-compose с проброшенным портом 3306 вы можете подключиться к базе данных MariaDB с помощью TablePlus, DBeaver или любого другого клиента.

**Параметры подключения (берутся из .env):**

- Host: 127.0.0.1
- Port: 3306
- User: .env
- Password: .env
- Database: .env

**Пример для TablePlus:**

1. Нажмите "Create a new connection" → MariaDB.
2. Введите параметры выше.
3. Нажмите "Test" для проверки соединения.
4. Сохраните и подключайтесь.

Если база уже была запущена до добавления порта, выполните:

```sh
docker compose up -d db
```

чтобы изменения вступили в силу.
