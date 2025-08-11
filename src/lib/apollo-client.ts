// lib/apollo-client.ts

import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  from,
} from '@apollo/client'
import { onError } from '@apollo/client/link/error'

// Используем разные экземпляры клиента для серверного и клиентского рендеринга
let apolloClient: ApolloClient<NormalizedCacheObject> | undefined

const isBuildTime = process.env.NODE_ENV === 'production' && typeof window === 'undefined' && !process.env.WORDPRESS_GRAPHQL_ENDPOINT?.includes('localhost')

function createApolloClient() {
  const httpLink = new HttpLink({
    uri: process.env.WORDPRESS_GRAPHQL_ENDPOINT,
    // Дополнительные настройки, например, заголовки авторизации, если нужно
    // headers: { ... }
  })

  const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      )
    }

    if (networkError) {
      console.log(`[Network error]: ${networkError}`)
      
      // Во время сборки возвращаем пустой результат вместо ошибки
      if (isBuildTime) {
        return forward(operation)
      }
    }
  })

  return new ApolloClient({
    ssrMode: typeof window === 'undefined', // true для серверного рендеринга
    link: from([errorLink, httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
      query: {
        fetchPolicy: isBuildTime ? 'cache-first' : 'no-cache', // Во время сборки используем кеш
        errorPolicy: 'all',
        notifyOnNetworkStatusChange: false,
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
