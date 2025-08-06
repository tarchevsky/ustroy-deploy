#!/bin/bash
set -e

echo "🚀 Запуск Next.js приложения"

# Проверка готовности WordPress
echo "🔍 Проверка доступности WordPress GraphQL..."
if ! curl -s -f https://panel.ustroy.webtm.ru/graphql > /dev/null; then
    echo "❌ WordPress GraphQL недоступен. Убедитесь, что WordPress настроен и работает."
    exit 1
fi

echo "✅ WordPress готов"
echo "🌐 Запуск Next.js..."

# Запуск Next.js с профилем
docker compose --profile nextjs up -d nextjs

echo "✅ Next.js запущен!"
echo "🌍 Сайт доступен по адресу: https://ustroy.webtm.ru"
echo ""
echo "📊 Проверка статуса всех сервисов:"
docker compose ps
