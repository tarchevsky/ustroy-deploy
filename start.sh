#!/bin/bash

echo "🚀 Запуск Docker Compose с правильным порядком зависимостей..."
echo "📊 Порядок запуска:"
echo "1️⃣ База данных (MariaDB)"
echo "2️⃣ WordPress (с GraphQL)"
echo "3️⃣ Nginx"
echo "4️⃣ Next.js (только после готовности WordPress)"
echo ""

# Остановка существующих контейнеров
echo "🛑 Остановка существующих контейнеров..."
docker-compose down

# Запуск с пересборкой
echo "🏗️ Запуск с пересборкой..."
docker-compose up --build -d

echo ""
echo "✅ Запуск завершен! Проверьте статус:"
echo "📋 docker-compose ps"
echo "📋 docker-compose logs -f"
echo ""
echo "🌐 Сайты должны быть доступны по:"
echo "   - https://ustroy.art (Next.js)"
echo "   - https://panel.ustroy.art (WordPress)"
echo "   - https://panel.ustroy.art/graphql (GraphQL endpoint)"
