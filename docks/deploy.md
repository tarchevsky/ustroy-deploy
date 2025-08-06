# Развёртывание проекта ustroy.webtm.ru с WordPress и SSL

## Общая архитектура

Проект состоит из следующих компонентов:

1. **Next.js приложение** - основной сайт ustroy.webtm.ru
2. **WordPress** - панель управления на panel.ustroy.webtm.ru
3. **Nginx** - веб-сервер с SSL-терминацией
4. **MariaDB** - база данных для WordPress
5. **Certbot** - получение и обновление SSL-сертификатов

## Быстрый шаблон команд для деплоя

```sh
docker compose --profile acme up -d nginx certbot certbot-init
docker compose logs -f certbot-init
docker compose --profile acme down

docker compose --profile full up -d db wordpress nginx certbot
docker compose --profile full up -d nextjs
```

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

Упрощенная конфигурация nginx включает только серверы на порту 80 для обслуживания путей `/.well-known/acme-challenge/` и редиректы на HTTPS. Серверы на порту 443 временно возвращают код 503 для всех запросов до запуска соответствующих сервисов.

В файле `nginx.conf` упрощенная конфигурация реализована следующим образом:

1. На этапе получения SSL-сертификатов в сервере `panel.ustroy.webtm.ru` на порту 443 следующие строки **закомментированы**:

```nginx
# Временно отключаем обработку PHP до запуска wordpress
# location ~ \..*\.php$ {
#     fastcgi_pass wordpress:9000;
#     fastcgi_index index.php;
#     fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
#     fastcgi_param HTTPS on;
#     fastcgi_param HTTP_X_FORWARDED_PROTO https;
#     include fastcgi_params;
# }
```

И вместо них добавлена заглушка, которая **раскомментирована**:

```nginx
# Временная заглушка для PHP-файлов
location ~ \..*\.php$ {
    return 503;
}
```

2. На этапе получения SSL-сертификатов в сервере `ustroy.webtm.ru` на порту 443 следующие строки **закомментированы**:

```nginx
# Временно отключаем проксирование до запуска nextjs
# location / {
#     proxy_pass http://nextjs:3000;
#     proxy_http_version 1.1;
#     proxy_set_header Upgrade $http_upgrade;
#     proxy_set_header Connection 'upgrade';
#     proxy_set_header Host $host;
#     proxy_cache_bypass $http_upgrade;
# }
```

И вместо них добавлена заглушка, которая **раскомментирована**:

```nginx
# Временная заглушка для ustroy.webtm.ru
location / {
    return 503;
}
```

Такая конфигурация позволяет nginx запуститься без зависимости от других сервисов и обслуживать пути для проверки доменов, необходимые для получения SSL-сертификатов.

### 3. Получение SSL-сертификатов

После запуска контейнера nginx выполните команду для получения сертификатов:

```bash
# Инициализация сертификатов
docker compose run --rm certbot-init
```

Эта команда запустит одноразовый контейнер certbot-init, который получит SSL-сертификаты для обоих доменов. Если команда выполнится успешно, сертификаты будут сохранены в volume `certbot-etc` и будут доступны для nginx.

> **ВАЖНО**: После успешного получения сертификатов необходимо будет восстановить полную конфигурацию nginx для работы с WordPress и Next.js.

> **ПРИМЕЧАНИЕ**: В текущей конфигурации nginx серверы на порту 443 возвращают код 503 для всех запросов, так как сервисы wordpress и nextjs еще не запущены. Это нормально на этапе получения сертификатов.

### 4. Настройка WordPress

Перед запуском Next.js необходимо полностью настроить WordPress:

1. Запустите сервисы базы данных и WordPress:

```bash
# Запуск сервисов базы данных и WordPress
docker compose up -d db wordpress
```

2. Восстановите полную конфигурацию nginx для работы с WordPress:

В файле `nginx.conf` для сервера `panel.ustroy.webtm.ru` на порту 443 замените заглушку для PHP-файлов на рабочую конфигурацию:

Было:
```nginx
# Временно отключаем обработку PHP до запуска wordpress
# location ~ \..*\.php$ {
    fastcgi_pass wordpress:9000;
    fastcgi_index index.php;
    fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    fastcgi_param HTTPS on;
    fastcgi_param HTTP_X_FORWARDED_PROTO https;
    include fastcgi_params;
}
```

3. Перезапустите nginx с новой конфигурацией:

```bash
# Перезапуск nginx с конфигурацией для WordPress
docker compose restart nginx
```

4. Откройте в браузере `https://panel.ustroy.webtm.ru` и выполните инициализацию WordPress:
   - Выберите язык
   - Укажите название сайта
   - Создайте учетную запись администратора
   - Войдите в панель администратора
   - Установите необходимые плагины (включая WP GraphQL)
   - Настройте permalinks (Настройки → Постоянные ссылки → выберите "Название записи")

> **ВАЖНО**: WordPress должен быть полностью настроен и работать по адресу `https://panel.ustroy.webtm.ru` перед запуском Next.js, иначе сборка Next.js завершится ошибкой из-за недоступности эндпоинта `WORDPRESS_GRAPHQL_ENDPOINT`.

### 5. Запуск Next.js

После полной настройки WordPress можно запускать Next.js:

1. В файле `nginx.conf` для сервера `ustroy.webtm.ru` на порту 443 замените заглушку для проксирования на рабочую конфигурацию:

Было:
```nginx
# Временно отключаем проксирование до запуска nextjs
# location / {
    proxy_pass http://nextjs:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

2. Перезапустите nginx с полной конфигурацией:
    #     # Редирект с главной страницы на /wp-admin
    #     location = / {
    #         return 302 /wp-admin;
    #     }
    #
    #     location / {
    #         try_files $uri $uri/ /index.php?$args;
    #     }
    #
    #     location ~ \..*\.php$ {
    #         fastcgi_pass wordpress:9000;
    #         fastcgi_index index.php;
    #         fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    #         fastcgi_param HTTPS on;
    #         fastcgi_param HTTP_X_FORWARDED_PROTO https;
    #         include fastcgi_params;
    #     }
    #
    #     location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    #         expires max;
    #         log_not_found off;
    #     }
    # }

    # server {
    #     listen 443 ssl;
    #     server_name ustroy.webtm.ru;
    #
    #     ssl_certificate /etc/letsencrypt/live/ustroy.webtm.ru/fullchain.pem;
    #     ssl_certificate_key /etc/letsencrypt/live/ustroy.webtm.ru/privkey.pem;
    #     ssl_protocols TLSv1.2 TLSv1.3;
    #     ssl_ciphers HIGH:!aNULL:!MD5;
    #
    #     location / {
    #         proxy_pass http://nextjs:3000;
    #         proxy_http_version 1.1;
    #         proxy_set_header Upgrade $http_upgrade;
    #         proxy_set_header Connection 'upgrade';
    #         proxy_set_header Host $host;
    #         proxy_cache_bypass $http_upgrade;
    #     }
    # }
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

---

## Быстрый шаблон команд для деплоя

```sh
docker compose --profile acme up -d nginx certbot certbot-init
docker compose logs -f certbot-init
docker compose --profile acme down

docker compose --profile full up -d db wordpress nginx certbot
docker compose --profile full up -d nextjs
```

---

## Пошаговая инструкция

1. **Получить SSL-сертификаты:**
   - Запустите nginx и certbot для получения сертификатов:
     ```sh
     docker compose --profile acme up -d nginx certbot certbot-init
     docker compose logs -f certbot-init
     docker compose --profile acme down
     ```

2. **Запустить WordPress и базу данных:**
   - Запустите все сервисы для production:
     ```sh
     docker compose --profile full up -d db wordpress nginx certbot
     ```

3. **Настроить WordPress через браузер:**
   - Перейдите в браузере по адресу https://panel.ustroy.webtm.ru
   - Выполните первичную настройку (пользователь, плагины, GraphQL и т.д.)
   - **Важно:** Не запускайте nextjs, пока WordPress полностью не инициализирован и не доступен по адресу https://panel.ustroy.webtm.ru/graphql

4. **Запустить Next.js:**
   - После настройки WordPress выполните:
     ```sh
     docker compose --profile full up -d nextjs
     ```

5. **Проверить работу сервисов:**
   - https://panel.ustroy.webtm.ru — админка WordPress
   - https://ustroy.webtm.ru — фронт Next.js
   - Для диагностики используйте:
     ```sh
     docker compose logs -f nginx
     docker compose logs -f wordpress
     docker compose logs -f nextjs
     ```

---

## Важные замечания
- Конфиги (docker-compose.yml, nginx.conf) универсальны, не требуют ручных правок.
- Если сервис (wordpress или nextjs) не поднят — nginx отдаёт 503 с заглушкой.
- Certbot автоматически продлевает сертификаты (контейнер certbot).
- Все тома и переменные окружения сохраняются между перезапусками.
- Для пересоздания сертификатов повторите этап 1.

---

## FAQ

**Q: Нужно ли что-то комментировать в nginx.conf?**
A: Нет! Всё уже готово, nginx отдаёт 503 если сервис не поднят.

**Q: Можно ли запускать всё одной командой?**
A: Нет, сначала нужен этап получения SSL, затем основной запуск.

**Q: Как обновить сертификаты?**
A: Контейнер certbot делает это автоматически в фоне.

**Q: Как пересоздать сервисы?**
A: Используйте `docker compose --profile full restart <service>`

---

**Если порядок нарушен — nginx/nextjs/wordpress могут отдавать 503. Просто следуйте шагам!**
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
