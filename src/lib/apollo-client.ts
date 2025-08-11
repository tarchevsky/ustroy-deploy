// lib/apollo-client.ts

import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client'

// Используем разные экземпляры клиента для серверного и клиентского рендеринга
let apolloClient: ApolloClient<NormalizedCacheObject> | undefined

function createApolloClient() {
  // Во время Docker build используем внутренний адрес
  let graphqlEndpoint = process.env.WORDPRESS_GRAPHQL_ENDPOINT || 'http://localhost:3001/graphql'
  
  // Если сборка внутри Docker и WordPress недоступен, используем внутренний адрес
  if (process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
    graphqlEndpoint = 'http://wordpress:9000/graphql'
  }
  
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: new HttpLink({
      uri: graphqlEndpoint,
      fetch: (uri, options) => {        
        return fetch(uri, {
          ...options,
          signal: AbortSignal.timeout(30000)
        }).catch(error => {
          console.warn('GraphQL request failed:', error.message)
          return new Response('{"data": {}}', { 
            status: 200, 
            headers: { 'Content-Type': 'application/json' }
          })
        })
      }
    }),
    cache: new InMemoryCache(),
    defaultOptions: {
      query: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all',
      },
    },
  })
}

export function initializeApollo(initialState: any = null) {
  const _apolloClient = apolloClient ?? createApolloClient()

  // Если есть начальное состояние, восстанавливаем его
  if (initialState) {
    // Получаем существующий кеш
    const existingCache = _apolloClient.cache.extract()

    // Восстанавливаем кеш с объединенными данными
    _apolloClient.cache.restore({ ...existingCache, ...initialState })
  }

  // Для SSG и SSR всегда создаем новый клиент
  if (typeof window === 'undefined') return _apolloClient

  // Создаем клиент один раз для клиентской стороны
  if (!apolloClient) apolloClient = _apolloClient

  return _apolloClient
}

export function getApolloClient() {
  return initializeApollo()
}
