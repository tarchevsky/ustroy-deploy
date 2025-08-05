import WpPageComponent from '@/components/WpPageComponent'
import { getApolloClient } from '@/lib/apollo-client'
import { fetchPageBySlug } from '@/services/pagesService'
import { notFound } from 'next/navigation'

export default async function WorkshopSlugPage({
  params,
}: {
  params: { slug: string }
}) {
  const { slug } = params
  const apolloClient = getApolloClient()

  // Получаем полные данные страницы по slug
  const page = await fetchPageBySlug(apolloClient, slug)
  if (!page) return notFound()

  return <WpPageComponent pageData={page} />
}
