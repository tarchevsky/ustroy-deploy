# Деплой uStroy: последовательность команд

## 1. Подготовка

- Проверьте, что в .env заданы все переменные (MariaDB, WordPress, Next.js)
- Убедитесь, что директории `./certbot/www` и `./certbot/conf` существуют (создаются автоматически)
- Убедитесь, что домены `ustroy.webtm.ru` и `panel.ustroy.webtm.ru` уже направлены на сервер

## 2. Первый запуск (инициализация сертификатов)

1. Запустите только nginx и certbot для получения сертификатов:

```sh
docker compose up -d nginx certbot
```

2. Выполните команду для получения сертификатов (для обоих доменов):

```sh
docker compose run --rm certbot certonly --webroot -w /var/www/certbot \
  -d ustroy.webtm.ru -d panel.ustroy.webtm.ru --email i.tarchevsky@yandex.ru \
  --agree-tos --no-eff-email --force-renewal
```

3. Перезапустите nginx, чтобы он увидел сертификаты:

```sh
docker compose restart nginx
```

---

## 3. Запуск основных сервисов (WordPress + MariaDB + nginx + certbot)

```sh
docker compose up -d db wordpress nginx certbot
```

---

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
