# Развёртывание проекта ustroy.webtm.ru с WordPress и SSL

## Общая архитектура

Проект состоит из следующих компонентов:

1. **Next.js приложение** - основной сайт ustroy.webtm.ru
2. **WordPress** - панель управления на panel.ustroy.webtm.ru
3. **Nginx** - веб-сервер с SSL-терминацией
4. **MariaDB** - база данных для WordPress
5. **Certbot** - получение и обновление SSL-сертификатов

## Подготовка к развертыванию

1. Убедитесь, что у вас установлен Docker и Docker Compose
2. Проверьте, что домены ustroy.webtm.ru и panel.ustroy.webtm.ru направлены на IP-адрес вашего сервера (записи A в DNS)
3. Убедитесь, что порты 80 и 443 открыты на вашем сервере

## Пошаговое развертывание

### 1. Настройка переменных окружения

Создайте файл `.env` на основе `.env.example` (если есть) или убедитесь, что в нем заданы следующие переменные:

```
REVALIDATE_SECRET=123456
WORDPRESS_GRAPHQL_ENDPOINT=https://panel.ustroy.webtm.ru/graphql

# MariaDB
MYSQL_DATABASE=wp_base
MYSQL_USER=wp_user
MYSQL_PASSWORD=Qwert10-!yuiop
MYSQL_ROOT_PASSWORD=Qwert10-!yuiop

# WordPress
WORDPRESS_DB_HOST=db:3306
WORDPRESS_DB_NAME=wp_base
WORDPRESS_DB_USER=wp_user
WORDPRESS_DB_PASSWORD=Qwert10-!yuiop
WORDPRESS_ADMIN_USER=Tadmin
WORDPRESS_ADMIN_PASSWORD=Qwert10-!yuiop
WORDPRESS_ADMIN_EMAIL=i.tarchevsky@yandex.ru
WORDPRESS_SITE_URL=https://panel.ustroy.webtm.ru
WORDPRESS_TITLE=Ustroy
```

### 2. Первичный запуск инфраструктуры

Для получения SSL-сертификатов необходимо сначала запустить Nginx. Ранее nginx зависел от nextjs, но эта зависимость была убрана для корректного пошагового развертывания:

```bash
# Запуск необходимых сервисов для получения сертификатов
docker compose up -d nginx certbot-init
```

> **ВАЖНО**: Теперь nginx запускается без автоматического запуска nextjs, что позволяет получить SSL-сертификаты до настройки WordPress.

### 3. Получение SSL-сертификатов

После запуска контейнеров выполните команду для получения сертификатов:

```bash
# Инициализация сертификатов
docker compose run --rm certbot-init
```

Эта команда запустит одноразовый контейнер certbot-init, который получит SSL-сертификаты для обоих доменов. Если команда выполнится успешно, сертификаты будут сохранены в volume `certbot-etc` и будут доступны для nginx.

### 4. Запуск инфраструктуры WordPress

После получения сертификатов можно запустить сервисы, необходимые для работы WordPress:

```bash
# Остановка предыдущих контейнеров (если были запущены)
docker compose down

# Запуск сервисов WordPress
docker compose up -d nginx certbot db wordpress
```

Эта команда запустит следующие сервисы:

- nginx - веб-сервер с SSL-терминацией
- certbot - сервис для автоматического обновления SSL-сертификатов
- db - база данных MariaDB для WordPress
- wordpress - контейнер с WordPress

> **ВАЖНО**: Сервис nextjs (фронтенд) НЕ запускается на этом этапе, так как для его корректной работы необходимо сначала полностью настроить WordPress и убедиться, что GraphQL API работает корректно.

### 5. Настройка WordPress

1. Откройте в браузере `https://panel.ustroy.webtm.ru`
2. Пройдите стандартную процедуру установки WordPress:

   - Система автоматически использует данные из переменных окружения
   - Название сайта: "Ustroy"
   - Учетная запись администратора: логин: Tadmin, пароль: Qwert10-!yuiop, email: i.tarchevsky@yanex.ru
   - Нажмите "Установить WordPress"

3. После установки войдите в админку WordPress по адресу `https://panel.ustroy.webtm.ru/wp-login.php`

4. **Обязательная ручная настройка WordPress** (до перехода к фронтенду):
   - Установите и активируйте плагин WPGraphQL:
     - Перейдите в раздел "Плагины" → "Добавить новый"
     - Найдите плагин "WPGraphQL"
     - Установите и активируйте его
   - Проверьте работу GraphQL API, открыв в браузере `https://panel.ustroy.webtm.ru/graphql` - должна открыться GraphQL IDE
   - Выполните любые другие необходимые настройки WordPress (темы, дополнительные плагины и т.д.)
   - Убедитесь, что все необходимые настройки выполнены и WordPress работает корректно

> **ТОЛЬКО ПОСЛЕ ЭТОГО** можно переходить к настройке фронтенда.

### 5. Настройка Next.js приложения

> **ВАЖНО**: Этот шаг можно выполнять только после полной ручной настройки WordPress-админки, описанной в предыдущем разделе.

Next.js приложение автоматически подключится к WordPress GraphQL API по адресу, указанному в переменной окружения `WORDPRESS_GRAPHQL_ENDPOINT`.

Для запуска приложения в продакшене:

```bash
# Сборка и запуск приложения
docker compose up -d nextjs
```

Эта команда соберет и запустит Next.js приложение в режиме продакшена. Приложение будет доступно по адресу `https://ustroy.webtm.ru`.

> **ПОЧЕМУ ТОЛЬКО СЕЙЧАС**: Фронтенд (Next.js) требует работающего GraphQL API для генерации статики блога. Если запустить его до настройки WordPress, он не сможет получить данные и сборка завершится ошибкой.

## Проверка работоспособности

1. Откройте в браузере `https://ustroy.webtm.ru` - должен отображаться Next.js сайт
2. Откройте в браузере `https://panel.ustroy.webtm.ru` - должна отображаться WordPress панель
3. Проверьте, что оба сайта используют HTTPS и сертификаты действительны

## Обновление SSL-сертификатов

Certbot настроен на автоматическое обновление сертификатов через cron-задание в контейнере `certbot`. Сертификаты обновляются раз в 7 дней.

Для ручного обновления сертификатов выполните:

```bash
# Принудительное обновление сертификатов
docker compose exec certbot certbot renew --force-renewal
```

Автоматическое обновление работает через entrypoint контейнера certbot, который запускает команду `certbot renew --webroot` каждые 7 дней.

## Резервное копирование

Для создания резервной копии данных WordPress и базы данных:

```bash
# Создание резервной копии базы данных
docker compose exec db mysqldump -u wordpress -p wordpress > backup-$(date +%F).sql

# Архивирование данных WordPress
tar -czf wp-content-$(date +%F).tar.gz ./wp_data
```

## Возможные проблемы и их решения

### 1. Ошибка получения SSL-сертификата

Если при получении сертификата возникает ошибка, проверьте:

- Правильность DNS-записей для доменов
- Доступность портов 80 и 443
- Что веб-сервер запущен и отвечает по порту 80

### 2. WordPress не может подключиться к базе данных

Проверьте правильность переменных окружения в файле `.env`, особенно:

- WORDPRESS_DB_HOST (должен быть db:3306)
- WORDPRESS_DB_NAME
- WORDPRESS_DB_USER
- WORDPRESS_DB_PASSWORD

### 3. Next.js не может получить данные из WordPress GraphQL

Проверьте:

- Что WordPress и WPGraphQL плагин работают
- Что переменная WORDPRESS_GRAPHQL_ENDPOINT указывает на правильный адрес
- Что домен panel.ustroy.webtm.ru доступен из контейнера nextjs

## Дополнительные рекомендации

1. Регулярно обновляйте Docker-образы:

   ```bash
   docker compose pull
   docker compose up -d
   ```

2. Следите за логами контейнеров:

   ```bash
   docker compose logs -f [service_name]
   ```

3. Для изменения конфигурации Nginx отредактируйте файл `nginx.conf` и перезапустите контейнер:
   ```bash
   docker compose restart nginx
   ```
