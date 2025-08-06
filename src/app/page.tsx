import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { Metadata } from 'next'

import { TypesOfContentChooseHeroLayout } from '@/graphql/types/pageSettingsTypes'
import { getApolloClient } from '@/lib/apollo-client'
import { fetchSeoMetadata } from '@/lib/seo'
import { fetchHomePageData } from '@/services/pageService'
import { fetchPageSettings } from '@/services/pageSettingsService'

import { ConditionalRenderer } from '@/components/conditional/ConditionalRenderer'
import Hero from '@/components/hero/Hero'
import {
  transformCategories,
  transformCategoryPosts,
  transformCompanies,
  transformPosts,
  transformPostsByCategories,
} from '@/services/transformService'

export const revalidate = 5

// ID константы
const PAGE_ID = 'cG9zdDo0MTU=' // Текущий ID
const ALTERNATIVE_PAGE_ID = 'cG9zdDo5' // Альтернативный ID для проверки
const HOME_PAGE_PATH = 'home' // Slug главной страницы для проверки
const CATEGORY_ID = 'dGVybToz'
const FEATURE_CATEGORY_IDS = ['dGVybTo1', 'dGVybTo0']
const CATEGORY_IDS = ['dGVybTo1', 'dGVybTo0', 'dGVybToxMA==', 'dGVybTo5']

export async function generateMetadata(): Promise<Metadata> {
  const apolloClient: ApolloClient<NormalizedCacheObject> = getApolloClient()

  // Проверка обоими методами с текущим ID
  const pageSettings = await fetchPageSettings(apolloClient, PAGE_ID)
  console.log('Текущий ID - pageSettings.seo:', PAGE_ID, pageSettings.seo)

  const seoData = await fetchSeoMetadata(PAGE_ID)
  console.log('Текущий ID - seoData:', PAGE_ID, seoData)

  // Проверка с альтернативным ID
  try {
    const alternativePageSettings = await fetchPageSettings(
      apolloClient,
      ALTERNATIVE_PAGE_ID,
    )
    console.log(
      'Альтернативный ID - pageSettings.seo:',
      ALTERNATIVE_PAGE_ID,
      alternativePageSettings.seo,
    )
  } catch (error) {
    console.error('Ошибка при получении данных с альтернативным ID:', error)
  }

  // Используем данные, которые не являются "дефолтными"
  const title = pageSettings.seo?.title || seoData.title || 'U-Stroy'
  const description =
    pageSettings.seo?.metaDesc || seoData.description || 'Строительная компания'

  console.log('Итоговые метаданные:', { title, description })

  return {
    title,
    description,
  }
}

const HomePage = async () => {
  const apolloClient: ApolloClient<NormalizedCacheObject> = getApolloClient()

  // Получаем typesOfContent и content из fetchPageSettings
  const pageSettings = await fetchPageSettings(apolloClient, PAGE_ID)
  const typesOfContent = pageSettings.typesOfContent
  const content = pageSettings.content

  const {
    page,
    pagecontent,
    posts: postsData,
    category: categoryData,
    categoryPosts: categoryPostsData,
    categories: categoriesData,
  } = await fetchHomePageData(
    apolloClient,
    PAGE_ID,
    CATEGORY_ID,
    FEATURE_CATEGORY_IDS,
    CATEGORY_IDS,
  )

  const posts = transformPosts(postsData)
  const categoryPosts = transformCategoryPosts(categoryData)
  const postsByCategories = transformPostsByCategories(categoryPostsData)
  const categories = transformCategories(categoriesData)
  const companies = transformCompanies(pagecontent?.companies || [])

  const heroBlock = typesOfContent.choose.find(
    (item: any) => item.fieldGroupName === 'TypesOfContentChooseHeroLayout',
  ) as TypesOfContentChooseHeroLayout | undefined

  const aboutBlock = typesOfContent.choose.find(
    (item: any) => item.fieldGroupName === 'TypesOfContentChooseAboutLayout',
  )

  return (
    <>
      {heroBlock && (
        <Hero
          title={heroBlock.header}
          subtitle={heroBlock.sub}
          text1={heroBlock.text1}
          text2={heroBlock.text2}
          buttonText="Обсудить проект"
        />
      )}
      {/* Импортируем contactFormFields и передаём как проп fields */}
      <ConditionalRenderer
        typesOfContent={typesOfContent}
        pagecontent={pagecontent}
        posts={posts}
        content={content}
        fields={require('./contactFormFields').contactFormFields}
      />
    </>
  )
}

export default HomePage
