# Деплой uStroy: последовательность команд

## 1. Подготовка

- Проверьте, что в .env заданы все переменные (MariaDB, WordPress, Next.js)
- Убедитесь, что директории `./certbot/www` и `./certbot/conf` существуют (создаются автоматически)
- Убедитесь, что домены `ustroy.webtm.ru` и `panel.ustroy.webtm.ru` уже направлены на сервер

## 2. Первый этап: только WordPress и сертификаты

1. Используйте конфиг `nginx.wp-only.conf` для nginx:
   В файле `docker-compose.yml` укажите:
   ```yaml
   services:
     nginx:
       ...
       volumes:
         - ./nginx.wp-only.conf:/etc/nginx/nginx.conf:ro
         ...
   ```

2. Запустите nginx и certbot для получения сертификатов:
   ```sh
   docker compose up -d nginx certbot
   ```

3. Получите сертификаты для обоих доменов:
   ```sh
   docker compose run --rm certbot certonly --webroot -w /var/www/certbot \
     -d ustroy.webtm.ru -d panel.ustroy.webtm.ru --email i.tarchevsky@yandex.ru \
     --agree-tos --no-eff-email --force-renewal
   ```

4. Перезапустите nginx:
   ```sh
   docker compose restart nginx
   ```

5. Запустите WordPress и базу данных:
   ```sh
   docker compose up -d db wordpress
   ```

---

## 3. Ручное наполнение WordPress

- Перейдите на https://panel.ustroy.webtm.ru
- Выполните первичную настройку WordPress, создайте нужные страницы/контент
- Убедитесь, что GraphQL доступен по адресу https://panel.ustroy.webtm.ru/graphql

---

## 4. Второй этап: подключение Next.js

1. После наполнения WordPress измените volume nginx на финальный конфиг:
   В файле `docker-compose.yml` замените:
   ```yaml
   services:
     nginx:
       ...
       volumes:
         - ./nginx.full.conf:/etc/nginx/nginx.conf:ro
         ...
   ```

2. Перезапустите nginx:
   ```sh
   docker compose restart nginx
   ```

3. Запустите Next.js:
   ```sh
   docker compose up -d nextjs
   ```

- Сайт будет доступен по адресу https://ustroy.webtm.ru

---

## 5. Обновление сертификатов (автоматически)

- certbot внутри контейнера будет автоматически обновлять сертификаты каждые 7 дней.
- Для ручного обновления можно выполнить:
   ```sh
   docker compose run --rm certbot renew --webroot -w /var/www/certbot
   ```

---

## 6. Полная остановка всех сервисов

```sh
docker compose down
```

---

## Примечания
- Не запускайте nextjs до наполнения WordPress!
- Все сервисы используют переменные из `.env`
- nginx проксирует оба домена и обслуживает SSL
- Если nginx не стартует — проверьте, какой конфиг подключён и что все тома на месте
- В случае ошибок с сертификатами — проверьте DNS и логи certbot/nginx

## 4. Ручное наполнение WordPress

- Перейдите на https://panel.ustroy.webtm.ru
- Выполните первичную настройку WordPress, создайте нужные страницы/контент
- Убедитесь, что GraphQL доступен по адресу https://panel.ustroy.webtm.ru/graphql

---

## 5. Запуск Next.js (после наполнения WordPress)

```sh
docker compose up -d nextjs
```

- Сайт будет доступен по адресу https://ustroy.webtm.ru

---

## 6. Обновление сертификатов (автоматически)

- certbot внутри контейнера будет автоматически обновлять сертификаты каждые 7 дней.
- Для ручного обновления можно выполнить:

```sh
docker compose run --rm certbot renew --webroot -w /var/www/certbot
```

---

## 7. Полная остановка всех сервисов

```sh
docker compose down
```

---

## Примечания
- Не запускайте nextjs до наполнения WordPress!
- Все сервисы используют переменные из `.env`
- nginx проксирует оба домена и обслуживает SSL
- В случае ошибок с сертификатами — проверьте DNS и логи certbot/nginx
- Если nginx не стартует на этапе получения сертификата — убедитесь, что в конфиге нет секции nextjs (ustroy.webtm.ru)
