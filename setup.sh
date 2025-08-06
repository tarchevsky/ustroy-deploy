#!/bin/bash
set -e

echo "🚀 Starting deployment process..."

# Create necessary directories
echo "📂 Creating required directories..."
mkdir -p certbot/www certbot/conf

# Start database and WordPress
echo "🐳 Starting database and WordPress..."
docker compose up -d db

echo "⏳ Waiting for database to be ready..."
until docker compose exec -T db mysqladmin ping -h localhost -u${MYSQL_USER} -p${MYSQL_PASSWORD} --silent; do
    echo "⏳ Waiting for database..."
    sleep 5
done

echo "🚀 Starting WordPress..."
docker compose up -d wordpress

echo "⏳ Waiting for WordPress to be ready..."
until docker compose exec -T wordpress wp core is-installed 2>/dev/null; do
    echo "⏳ Waiting for WordPress..."
    sleep 5
done

echo "🌐 Starting Nginx..."
docker compose up -d nginx

# Check if Nginx is running
if ! docker compose ps | grep nginx | grep -q "Up"; then
    echo "❌ Nginx failed to start. Checking logs..."
    docker compose logs nginx
    exit 1
fi

echo "✅ Basic setup complete!"
echo ""
echo "Next steps:"
echo "1. Access WordPress admin at: http://panel.ustroy.webtm.ru/wp-admin"
echo "2. After setting up WordPress, run: ./setup-ssl.sh"
echo "3. Finally, start Next.js with: docker compose --profile nextjs up -d"

chmod +x setup.sh
