// src/lib/seo.ts
import { GET_PAGE } from '@/graphql/queries/getPage'
import { PageData } from '@/graphql/types/pageTypes'
import { getApolloClient } from '@/lib/apollo-client'
import { ApolloClient, NormalizedCacheObject } from '@apollo/client'

export async function fetchSeoMetadata(
  id: string,
): Promise<{ title: string; description: string }> {
  const apolloClient: ApolloClient<NormalizedCacheObject> = getApolloClient()

  try {
    const { data } = await apolloClient.query<PageData>({
      query: GET_PAGE,
      variables: { id },
    })

    console.log('SEO данные для страницы ID:', id)
    console.log('Полученные данные:', JSON.stringify(data, null, 2))
    console.log('SEO данные:', data?.page?.seo)

    const seo = data?.page?.seo

    if (!seo || !seo.title || !seo.metaDesc) {
      console.warn('SEO данные отсутствуют или неполные для страницы:', id)
    }

    return {
      title: seo?.title || 'Default Title',
      description: seo?.metaDesc || 'Default Description',
    }
  } catch (error) {
    console.error('Error fetching SEO metadata:', error)
    return {
      title: 'Default Title',
      description: 'Default Description',
    }
  }
}
