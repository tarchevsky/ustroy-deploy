import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { Metadata } from 'next'

import { ChildCategoryNode } from '@/graphql/types/childCategoriesTypes'
import { TypesOfContentChooseHeroLayout } from '@/graphql/types/pageSettingsTypes'
import { getApolloClient } from '@/lib/apollo-client'
import { fetchChildCategories, fetchHomePageData } from '@/services/pageService'
import { fetchPageSettings } from '@/services/pageSettingsService'
import { fetchAllPages } from '@/services/pagesService'
import {
  transformCategories,
  transformCategoryPosts,
  transformCompanies,
  transformPosts,
  transformPostsByCategories,
} from '@/services/transformService'

import WorkshopPageClient from '@/components/projects/WorkshopPageClient'

export const revalidate = 5

// ID константы для страницы workshops
const WORKSHOPS_PAGE_ID = 'cG9zdDozNDY=' // ID страницы workshops
const CATEGORY_ID = 'dGVybToxMQ==' // ID категории workshops
const FEATURE_CATEGORY_IDS: string[] = [] // Пустой массив для категорий
const CATEGORY_IDS: string[] = [] // Пустой массив для категорий

export async function generateMetadata(): Promise<Metadata> {
  const apolloClient: ApolloClient<NormalizedCacheObject> = getApolloClient()
  const pageSettings = await fetchPageSettings(apolloClient, WORKSHOPS_PAGE_ID)

  return {
    title: pageSettings.seo?.title || 'Цеха',
    description: pageSettings.seo?.metaDesc || 'Наши цеха и мастерские',
  }
}

const WorkshopsPage = async () => {
  const apolloClient: ApolloClient<NormalizedCacheObject> = getApolloClient()

  // Получаем ВСЮ страницу через fetchPageSettings
  const pageSettings = await fetchPageSettings(apolloClient, WORKSHOPS_PAGE_ID)
  const pageContent = pageSettings.content
  const typesOfContent = pageSettings.typesOfContent

  // Остальные данные оставляем как есть
  const {
    pagecontent,
    posts: postsData,
    category: categoryData,
    categoryPosts: categoryPostsData,
    categories: categoriesData,
  } = await fetchHomePageData(
    apolloClient,
    WORKSHOPS_PAGE_ID,
    CATEGORY_ID,
    FEATURE_CATEGORY_IDS,
    CATEGORY_IDS,
  )

  const posts = transformPosts(postsData)
  const categoryPosts = transformCategoryPosts(categoryData)
  const postsByCategories = transformPostsByCategories(categoryPostsData)
  const categories = transformCategories(categoriesData)
  const companies = transformCompanies(pagecontent?.companies || [])

  const heroBlock = typesOfContent.choose?.find(
    (item: any) => item.fieldGroupName === 'TypesOfContentChooseHeroLayout',
  ) as TypesOfContentChooseHeroLayout | undefined

  const aboutBlock = typesOfContent.choose?.find(
    (item: any) => item.fieldGroupName === 'TypesOfContentChooseAboutLayout',
  )

  // Категории для фильтра
  const workshopCategories = categories.filter((cat: any) => cat.count > 0)

  // Получаем slug основной категории ("Цеха")
  const mainCategorySlug = categoryData?.slug
  let childCategories: ChildCategoryNode[] = []
  if (mainCategorySlug) {
    childCategories = await fetchChildCategories(apolloClient, mainCategorySlug)
  }

  // Получаем все страницы для поиска дочерних
  const allPages = await fetchAllPages(apolloClient)
  // Фильтруем дочерние страницы для workshops
  const workshopChildren = allPages.filter(
    (page) => page.parent?.node?.slug === 'workshops',
  )

  return (
    <>
      <WorkshopPageClient
        heroBlock={heroBlock}
        aboutBlock={aboutBlock}
        posts={posts}
        companies={companies}
        typesOfContent={typesOfContent}
        pagecontent={pagecontent}
        content={pageContent}
        workshopChildren={workshopChildren}
      />
      {/* Удалён прямой вывод WorkshopsChildrenList */}
    </>
  )
}

export default WorkshopsPage
