'use client'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import FadeIn from '../fadeIn/FadeIn'
import ProjectFilters from '../projectFilters/ProjectFilters'
import styles from './PostsCarousel.module.scss'

interface Post {
  slug: string
  title: string
  featuredImage?: { node?: { link?: string } }
  path?: string
  categories?: {
    edges: Array<{
      node: {
        slug: string
        name: string
      }
    }>
  }
}

interface PostsCarouselProps {
  posts: Post[]
}

const PostsCarousel: React.FC<PostsCarouselProps> = ({ posts }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const pathname = usePathname()

  // Определяем, находимся ли мы на странице workshops
  const isWorkshopPage = pathname.includes('/workshops')

  // Фильтрация постов по типу страницы
  let pageFilteredPosts = posts
  if (isWorkshopPage) {
    // На странице workshops показываем только посты из категории workshops
    pageFilteredPosts = posts.filter((post) => {
      const isWorkshopPost = post.categories?.edges.some(
        (edge: any) =>
          edge.node.slug === 'workshops' ||
          edge.node.slug.includes('workshops/'),
      )
      return isWorkshopPost
    })
  } else {
    // На главной и других страницах показываем только проекты (исключаем workshops)
    pageFilteredPosts = posts.filter((post) => {
      const isWorkshopPost = post.categories?.edges.some(
        (edge: any) =>
          edge.node.slug === 'workshops' ||
          edge.node.slug.includes('workshops/'),
      )
      return !isWorkshopPost
    })
  }

  // Фильтрация по выбранной категории
  const filteredPosts = selectedCategory
    ? pageFilteredPosts.filter((post: any) =>
        post.categories?.edges.some(
          (edge: any) => edge.node.slug === selectedCategory,
        ),
      )
    : pageFilteredPosts

  return (
    <div className="ind">
      {/* Карусель постов */}
      <div className={styles.carouselContainer}>
        <FadeIn
          className={`cont carousel carousel-center gap-4 pb-6 w-full ${styles.carousel}`}
        >
          {filteredPosts.map((post, id) => {
            // Определяем основную категорию поста, исключая workshops
            const mainCategory = post.categories?.edges.find(
              (edge) =>
                edge.node.slug !== 'workshops' &&
                !edge.node.slug.includes('workshops/'),
            )?.node.slug

            return (
              <a
                key={post.slug}
                href={
                  post.path && !post.path.includes('/workshops')
                    ? post.path.startsWith('/projects')
                      ? post.path
                      : `/projects${post.path}`
                    : mainCategory
                      ? `/projects/${mainCategory}/${post.slug}`
                      : `/projects/${post.slug}`
                }
                className={`carousel-item relative rounded-box overflow-hidden flex items-end bg-gray-200 ${styles.carouselItem} group`}
              >
                {post.featuredImage?.node?.link && (
                  <img
                    src={post.featuredImage.node.link}
                    alt={post.title}
                    className="absolute inset-0 w-full h-full object-cover z-0 group-hover:scale-105 transition-transform duration-300"
                  />
                )}
                <div
                  className="absolute inset-0 z-10"
                  style={{
                    background:
                      'linear-gradient(358deg, rgba(0, 0, 0, 0.40) 23.98%, rgba(159, 159, 159, 0.04) 98.03%)',
                  }}
                />
                <div
                  className="relative z-10 text-white font-semibold"
                  style={{
                    left: 32,
                    bottom: 32,
                    position: 'absolute',
                    fontFamily: 'Unbounded Variable, sans-serif',
                    fontSize: 'clamp(18px, 2vw, 28px)',
                  }}
                >
                  {post.title}
                </div>
              </a>
            )
          })}
        </FadeIn>
      </div>

      {/* Фильтры */}
      <ProjectFilters
        posts={posts}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
    </div>
  )
}

export default PostsCarousel
