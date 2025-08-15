'use client'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import CategoryLinks from './categoryLinks/CategoryLinks'
import { ConditionalRenderer } from './conditional/ConditionalRenderer'
import { useCategoryPostData } from './hooks/useCategoryPostData'
import { Breadcrumbs } from './ui/Breadcrumbs'

interface CategoryPostPageClientProps {
  initialData: {
    post: any
    categories: any[]
    posts: any[]
  }
  category: string
  slug: string
}

function transformPostsForCarousel(posts: any[]) {
  return posts.map((post) => {
    const mainCategory = post.categories?.edges[0]?.node?.slug
    let featuredImage = post.featuredImage
    if (featuredImage?.node?.link) {
      featuredImage = {
        node: {
          link: featuredImage.node.link,
          altText: featuredImage.node.altText || '',
        },
      }
    }

    // Определяем базовый путь в зависимости от категории
    const isWorkshop =
      mainCategory === 'workshops' ||
      post.categories?.edges.some(
        (edge: any) => edge.node?.slug === 'workshops',
      )
    const basePath = isWorkshop ? '/workshops' : '/projects'

    return {
      ...post,
      featuredImage,
      path: mainCategory
        ? `${basePath}/${mainCategory}/${post.slug}`
        : `${basePath}/${post.slug}`,
    }
  })
}

export default function CategoryPostPageClient({
  initialData,
  category,
  slug,
}: CategoryPostPageClientProps) {
  const { data, loading } = useCategoryPostData({ initialData, category, slug })
  const { post, categories, posts } = data

  if (loading && !post) return <div>Загрузка...</div>
  if (!post) return notFound()

  // Получаем имя и slug категории из поста, если доступно
  const categoryNode = post.categories?.edges[0]?.node
  const categoryName = categoryNode?.name || category
  const categorySlug = categoryNode?.slug || category

  // Определяем тип контента (workshops или projects)
  const isWorkshop =
    categorySlug === 'workshops' ||
    post.categories?.edges.some((edge: any) => edge.node?.slug === 'workshops')
  const basePath = isWorkshop ? '/workshops' : '/projects'
  const baseTitle = isWorkshop ? 'Цеха' : 'Проекты'

  // Получаем блок с четырьмя картинками из typesOfContent
  const projectPicturesBlock = post.typesOfContent?.choose?.find(
    (item: any) =>
      item.fieldGroupName === 'TypesOfContentChooseProjectPicturesLayout',
  )

  const yearBlock = post.typesOfContent?.choose?.find(
    (item: any) => item.fieldGroupName === 'TypesOfContentChooseYearLayout',
  )
  const customYear = yearBlock?.number

  // Хлебные крошки
  const breadcrumbs: Array<{ name: string; href?: string }> = [
    { name: 'Главная', href: '/' },
    { name: baseTitle, href: basePath },
  ]
  // Если категория — подкатегория проектов/цехов, ссылка должна быть /[basePath]/категория
  const isSubcategory =
    categorySlug && categorySlug !== 'projects' && categorySlug !== 'workshops'
  if (isSubcategory) {
    breadcrumbs.push({
      name: categoryName,
      href: `${basePath}/${categorySlug}`,
    })
  }
  breadcrumbs.push({ name: post.title })

  return (
    <div>
      <Breadcrumbs items={breadcrumbs} />
      <div className="cont mb-6">
        <main>
          <div className="flex flex-col">
            <div className="flex flex-col gap-3 md:gap-2 md:flex-row justify-between md:items-start">
              <div className="flex flex-col gap-2 md:max-w-2xl">
                <h1 className="text-3xl md:text-[32px] leading-[44px]">
                  {post.title}
                </h1>
                {customYear && (
                  <div
                    className="font-light text-xl"
                    style={{ fontFamily: 'Unbounded Variable, sans-serif' }}
                  >
                    ({customYear})
                  </div>
                )}
              </div>
              <Link
                href={`${basePath}/${categorySlug}`}
                className="btn btn-primary text-white border-2 hover:bg-white hover:text-primary text-xl font-normal btn-wide"
              >
                {categoryName}
              </Link>
            </div>
          </div>
        </main>
      </div>

      {/* Универсальный рендерер для условных блоков */}
      <ConditionalRenderer
        typesOfContent={post.typesOfContent}
        pagecontent={undefined}
        posts={transformPostsForCarousel(posts)}
        content={post.content}
      />

      <section className="ind">
        <CategoryLinks
          categories={categories}
          posts={posts}
          currentCategorySlug={categorySlug}
        />
      </section>
    </div>
  )
}
