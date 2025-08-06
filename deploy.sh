#!/bin/bash
set -e

echo "🚀 Развертывание Ustroy - современная конфигурация 2025"

# Проверка наличия .env файла
if [ ! -f .env ]; then
    echo "❌ Файл .env не найден!"
    exit 1
fi

echo "📋 Этап 1: Подготовка инфраструктуры"
# Создание необходимых директорий
mkdir -p certbot/www certbot/conf logs

echo "🗄️  Этап 2: Запуск базы данных и WordPress"
docker compose up -d db wordpress

echo "⏳ Ожидание готовности базы данных..."
sleep 30

echo "🌐 Этап 3: Запуск Nginx"
docker compose up -d nginx

echo "🔒 Этап 4: Получение SSL сертификатов"
echo "Убедитесь, что домены ustroy.webtm.ru и panel.ustroy.webtm.ru указывают на этот сервер!"
read -p "Нажмите Enter для продолжения..."

# Получение SSL сертификатов
docker compose --profile ssl run --rm certbot

echo "🔄 Этап 5: Перезапуск Nginx с SSL"
docker compose restart nginx

echo "✅ WordPress готов к настройке!"
echo "🌍 Откройте https://panel.ustroy.webtm.ru для настройки WordPress"
echo ""
echo "📝 После настройки WordPress запустите Next.js:"
echo "   ./start-nextjs.sh"
