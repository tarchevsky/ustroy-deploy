'use client'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
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

const ArrowButton = ({
  direction,
  onClick,
  visible,
}: {
  direction: 'left' | 'right'
  onClick: () => void
  visible: boolean
}) => (
  <button
    onClick={(e) => {
      e.stopPropagation()
      onClick()
    }}
    className={`hidden md:flex absolute top-1/2 z-20 -translate-y-1/2 transition-opacity duration-200 ${
      direction === 'left' ? 'left-28' : 'right-28'
    } ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    aria-label={`Scroll ${direction}`}
    style={{
      width: '40px',
      height: '40px',
      backgroundColor: 'rgba(255, 255, 255, 0.30)',
      backdropFilter: 'blur(5.4px)',
      borderRadius: '8px',
      alignItems: 'center',
      justifyContent: 'center',
      border: 'none',
      cursor: 'pointer',
    }}
  >
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        transform: direction === 'left' ? 'rotate(180deg)' : 'none',
      }}
    >
      <path
        d="M9 18L15 12L9 6"
        stroke="#FE520A"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </button>
)

const PostsCarousel: React.FC<PostsCarouselProps> = ({ posts }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const pathname = usePathname()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const checkArrows = () => {
    const container = scrollContainerRef.current
    if (!container) return

    const { scrollLeft, scrollWidth, clientWidth } = container
    setShowLeftArrow(scrollLeft > 0)
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1)
  }

  const scrollTo = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current
    if (!container) return

    const firstItem = container.querySelector(
      '.carousel-item',
    ) as HTMLElement | null
    if (!firstItem) return

    const itemStyle = window.getComputedStyle(firstItem)
    const itemWidth = firstItem.offsetWidth
    const itemMarginRight = parseInt(itemStyle.marginRight, 10) || 16 // gap-4 is 1rem = 16px
    const scrollAmount = (itemWidth + itemMarginRight) * 2 // Scroll by 2 items

    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    // Initial check
    checkArrows()

    // Check on scroll
    container.addEventListener('scroll', checkArrows, { passive: true })

    // Check on resize
    const resizeObserver = new ResizeObserver(checkArrows)
    resizeObserver.observe(container)

    // Check when filteredPosts changes
    const timeoutId = setTimeout(checkArrows, 100) // Delay to allow DOM to update

    return () => {
      container.removeEventListener('scroll', checkArrows)
      resizeObserver.disconnect()
      clearTimeout(timeoutId)
    }
  }, [posts, selectedCategory]) // Re-run when posts or filter change

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
    <div>
      {/* Карусель постов */}
      <div
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <FadeIn
          className={`cont carousel carousel-center gap-4 pb-6 w-full ${styles.carousel}`}
          ref={scrollContainerRef}
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
        <ArrowButton
          direction="left"
          onClick={() => scrollTo('left')}
          visible={isHovered && showLeftArrow}
        />
        <ArrowButton
          direction="right"
          onClick={() => scrollTo('right')}
          visible={isHovered && showRightArrow}
        />
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
