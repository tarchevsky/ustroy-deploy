# Инструкция по развертыванию Ustroy

## Предварительные требования
- Docker и Docker Compose установлены
- Домены `ustroy.webtm.ru` и `panel.ustroy.webtm.ru` направлены на IP вашего сервера
- Файл `.env` с необходимыми переменными окружения

## 1. Начальное развертывание

### 1.1 Запуск WordPress

1. Сделайте скрипты исполняемыми:
   ```bash
   chmod +x deploy.sh start-nextjs.sh renew-ssl.sh
   ```

2. Запустите развертывание WordPress:
   ```bash
   ./deploy.sh
   ```
   Этот скрипт выполнит:
   - Запуск MariaDB
   - Запуск WordPress
   - Настройку Nginx
   - Получение SSL сертификатов

3. После завершения откройте https://panel.ustroy.webtm.ru и завершите настройку WordPress

### 1.2 Настройка WordPress

1. Установите и активируйте плагин WPGraphQL
2. Настройте постоянные ссылки (Настройки → Постоянные ссылки → Имя записи)
3. Заполните контент в WordPress

## 2. Запуск Next.js

После завершения настройки WordPress и заполнения контента:

```bash
./start-nextjs.sh
```

Этот скрипт:
1. Проверит доступность WordPress GraphQL
2. Запустит Next.js приложение
3. Сайт станет доступен по https://ustroy.webtm.ru

## 3. Автоматическое обновление SSL

Сертификаты будут автоматически обновляться. Вручную можно запустить:

```bash
./renew-ssl.sh
```

Для автоматического обновления добавьте в crontab:
```
0 12 * * * /path/to/ustroy-deploy/renew-ssl.sh >> /var/log/ssl-renewal.log 2>&1
```

## 4. Управление сервисами

- Просмотр логов:
  ```bash
  docker compose logs -f
  ```

- Остановка всех сервисов:
  ```bash
  docker compose down
  ```

- Запуск только WordPress (без Next.js):
  ```bash
  docker compose up -d db wordpress nginx
  ```

## 5. Безопасность

- Все пароли хранятся в `.env`
- WordPress доступен только по HTTPS
- Настроены современные настройки безопасности Nginx
- Ограничение запросов к API
- Автоматическое обновление SSL

## 6. Мониторинг

- WordPress: https://panel.ustroy.webtm.ru
- Next.js: https://ustroy.webtm.ru
- Статус контейнеров: `docker compose ps`
- Логи: `docker compose logs -f`

## 7. Обновление

1. Остановите сервисы:
   ```bash
   docker compose down
   ```

2. Обновите образы:
   ```bash
   docker compose pull
   ```

3. Запустите заново:
   ```bash
   docker compose up -d
   ```

## 8. Резервное копирование

1. База данных:
   ```bash
   docker compose exec db mysqldump -u${MYSQL_USER} -p${MYSQL_PASSWORD} ${MYSQL_DATABASE} > backup_$(date +%Y%m%d).sql
   ```

2. Файлы WordPress:
   ```bash
   tar -czvf wordpress_backup_$(date +%Y%m%d).tar.gz $(docker volume inspect ustroy-deploy_wordpress_data | jq -r '.[0].Mountpoint')
   ```

## 9. Устранение неполадок

- Если WordPress недоступен:
  ```bash
  docker compose logs wordpress
  ```

- Если не работают SSL сертификаты:
  ```bash
  docker compose --profile ssl run --rm certbot certificates
  ```

- Если Next.js не видит WordPress:
  ```bash
  docker compose logs nextjs
  curl https://panel.ustroy.webtm.ru/graphql
  ```

## 10. Контакты

По вопросам развертывания обращайтесь к администратору.
