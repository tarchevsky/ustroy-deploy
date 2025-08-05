import CategoryPage from '@/components/CategoryPage'
import CategoryPostPage from '@/components/CategoryPostPage'
import WpPageComponent from '@/components/WpPageComponent'
import { getApolloClient } from '@/lib/apollo-client'
import { fetchCategoryWithChildren } from '@/services/pageService'
import { fetchPageBySlug } from '@/services/pagesService'
import { notFound } from 'next/navigation'

interface PageRendererProps {
  slug: string[]
}

export async function renderPage({ slug }: PageRendererProps) {
  if (!slug || slug.length === 0) {
    notFound()
  }

  const apolloClient = getApolloClient()
  const path = slug.join('/')

  console.log('🔍 Запрашиваемый путь:', path, 'slug:', slug)

  // 1. Проверяем, это страница WordPress (один сегмент)
  if (slug.length === 1) {
    const pageData = await fetchPageBySlug(apolloClient, slug[0])
    if (pageData) {
      console.log('✅ Найдена страница WordPress:', pageData.title)
      return <WpPageComponent pageData={pageData} />
    }

    // Проверяем, не является ли это подкатегорией проектов или цехов
    const projectsCategory = await fetchCategoryWithChildren(
      apolloClient,
      'projects',
    )
    const workshopsCategory = await fetchCategoryWithChildren(
      apolloClient,
      'workshops',
    )

    const isProjectChild = projectsCategory?.children?.nodes?.some(
      (child: any) => child.slug === slug[0],
    )

    const isWorkshopChild = workshopsCategory?.children?.nodes?.some(
      (child: any) => child.slug === slug[0],
    )

    if (isProjectChild || isWorkshopChild) {
      // Если это подкатегория проектов или цехов, не рендерим по /child (404)
      notFound()
    }

    // Проверяем категорию с дочерними (например, если появятся другие корневые категории)
    const categoryData = await fetchCategoryWithChildren(apolloClient, slug[0])
    if (categoryData) {
      console.log('✅ Найдена категория с дочерними:', categoryData.name)
      return <CategoryPage categoryData={categoryData} />
    }
  }

  // 2. Проверяем подкатегорию (два сегмента: категория/подкатегория)
  if (slug.length === 2) {
    // Исключаем создание страницы /projects/projects и /workshops/workshops
    if (
      (slug[0] === 'projects' && slug[1] === 'projects') ||
      (slug[0] === 'workshops' && slug[1] === 'workshops')
    ) {
      console.log('❌ Блокируем создание страницы /' + slug[0] + '/' + slug[1])
      notFound()
    }

    // --- ДОБАВЛЕНО: обработка дочерних страниц для workshops ---
    if (slug[0] === 'workshops') {
      const allPages = await (
        await import('@/services/pagesService')
      ).fetchAllPages(apolloClient)
      const childPage = allPages.find(
        (p) => p.parent?.node?.slug === 'workshops' && p.slug === slug[1],
      )
      if (childPage) {
        const pageData = await (
          await import('@/services/pagesService')
        ).fetchPageBySlug(apolloClient, slug[1])
        if (pageData) {
          return <WpPageComponent pageData={pageData} />
        }
      }
    }
    // --- КОНЕЦ ДОБАВЛЕНИЯ ---

    // Получаем родительскую категорию (projects или workshops)
    const parentCategory = await fetchCategoryWithChildren(
      apolloClient,
      slug[0],
    )
    // Получаем текущую подкатегорию
    const categoryData = await fetchCategoryWithChildren(apolloClient, slug[1])

    if (parentCategory && categoryData) {
      // Собираем id всех подкатегорий и родителя
      const allCategoryIds = [
        parentCategory.id,
        ...(parentCategory.children?.nodes?.map((c: any) => c.id) || []),
      ]
      // Получаем все посты по этим категориям
      const { data } = await apolloClient.query({
        query: require('@/graphql/queries/getPostsByCategories')
          .GET_POSTS_BY_CATEGORIES,
        variables: { categoryIds: allCategoryIds },
      })
      const allPostsForParent = data.posts.edges.map((e: any) => e.node)
      console.log(
        '✅ Все посты под родительской категорией:',
        allPostsForParent.length,
      )
      return (
        <CategoryPage categoryData={{ ...categoryData, allPostsForParent }} />
      )
    }
  }

  // 3. Проверяем пост (три сегмента: категория/подкатегория/пост)
  if (slug.length === 3) {
    console.log('🔍 Проверяем пост:', slug[0], slug[1], slug[2])
    // slug[0] = projects или workshops (категория)
    // slug[1] = cinema (подкатегория)
    // slug[2] = life (slug поста)
    return <CategoryPostPage category={slug[1]} slug={slug[2]} />
  }

  console.log('❌ Ничего не найдено')
  notFound()
}
