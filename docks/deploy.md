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

Для получения SSL-сертификатов необходимо сначала запустить Nginx с упрощенной конфигурацией, которая обслуживает только пути для проверки доменов на порту 80:

```bash
# Запуск необходимых сервисов для получения сертификатов
docker compose up -d nginx
```

> **ВАЖНО**: Nginx запускается с упрощенной конфигурацией, которая не требует наличия других сервисов (wordpress, nextjs) для обслуживания путей проверки доменов.

### 3. Получение SSL-сертификатов

После запуска контейнера nginx выполните команду для получения сертификатов:

```bash
# Инициализация сертификатов
docker compose run --rm certbot-init
```

Эта команда запустит одноразовый контейнер certbot-init, который получит SSL-сертификаты для обоих доменов. Если команда выполнится успешно, сертификаты будут сохранены в volume `certbot-etc` и будут доступны для nginx.

> **ВАЖНО**: После успешного получения сертификатов необходимо будет восстановить полную конфигурацию nginx для работы с WordPress и Next.js.

### 4. Восстановление полной конфигурации nginx

После успешного получения SSL-сертификатов необходимо восстановить полную конфигурацию nginx для работы с WordPress и Next.js:

1. Верните полную конфигурацию nginx, раскомментировав серверы на порту 443 в файле `nginx.conf`:

```nginx
server {
    listen 443 ssl;
    server_name panel.ustroy.webtm.ru;

    ssl_certificate /etc/letsencrypt/live/ustroy.webtm.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ustroy.webtm.ru/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    client_max_body_size 64m;

    root /var/www/html;
    index index.php;

    # Редирект с главной страницы на /wp-admin
    location = / {
        return 302 /wp-admin;
    }

    location / {
        try_files $uri $uri/ /index.php?$args;
    }

    location ~ \..*\.php$ {
        fastcgi_pass wordpress:9000;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_param HTTPS on;
        fastcgi_param HTTP_X_FORWARDED_PROTO https;
        include fastcgi_params;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires max;
        log_not_found off;
    }
}

server {
    listen 443 ssl;
    server_name ustroy.webtm.ru;

    ssl_certificate /etc/letsencrypt/live/ustroy.webtm.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ustroy.webtm.ru/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        proxy_pass http://nextjs:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

2. Перезапустите nginx с новой конфигурацией:

```bash
# Перезапуск nginx с полной конфигурацией
docker compose restart nginx
```

### 5. Запуск инфраструктуры WordPress

После восстановления конфигурации nginx можно запустить сервисы, необходимые для работы WordPress:

```bash
# Запуск сервисов WordPress (если они еще не запущены)
docker compose up -d db wordpress
```

Эта команда запустит следующие сервисы:

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
