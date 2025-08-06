#!/bin/bash
set -e

echo "🔄 Обновление SSL сертификатов"

# Обновление сертификатов
docker compose --profile ssl run --rm certbot renew

# Перезагрузка Nginx для применения новых сертификатов
docker compose exec nginx nginx -s reload

echo "✅ SSL сертификаты обновлены!"

# Добавить в crontab для автоматического обновления:
# 0 12 * * * /path/to/ustroy-deploy/renew-ssl.sh >> /var/log/ssl-renewal.log 2>&1
