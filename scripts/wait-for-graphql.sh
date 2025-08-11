#!/bin/sh

# Скрипт для ожидания готовности GraphQL endpoint
GRAPHQL_URL="${WORDPRESS_GRAPHQL_ENDPOINT:-https://panel.ustroy.art/graphql}"
MAX_ATTEMPTS=60
SLEEP_INTERVAL=5

echo "Ожидание готовности GraphQL endpoint: $GRAPHQL_URL"

for i in $(seq 1 $MAX_ATTEMPTS); do
    echo "Попытка $i из $MAX_ATTEMPTS..."
    
    # Выполняем простой GraphQL запрос
    if curl -s -f -X POST \
        -H "Content-Type: application/json" \
        -d '{"query":"query { __typename }"}' \
        "$GRAPHQL_URL" > /dev/null 2>&1; then
        echo "GraphQL endpoint готов!"
        exit 0
    fi
    
    if [ $i -lt $MAX_ATTEMPTS ]; then
        echo "GraphQL endpoint недоступен, ожидание $SLEEP_INTERVAL секунд..."
        sleep $SLEEP_INTERVAL
    fi
done

echo "GraphQL endpoint не стал доступен за $((MAX_ATTEMPTS * SLEEP_INTERVAL)) секунд"
exit 1
