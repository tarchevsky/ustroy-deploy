'use client'
import { useMemo } from 'react'

interface Category {
  slug: string
  name: string
}

interface Post {
  categories?: {
    edges: Array<{
      node: {
        slug: string
        name: string
      }
    }>
  }
}

interface ProjectFiltersProps {
  posts: Post[]
  selectedCategory: string | null
  onCategoryChange: (category: string | null) => void
  className?: string
}

const ProjectFilters: React.FC<ProjectFiltersProps> = ({
  posts,
  selectedCategory,
  onCategoryChange,
  className = '',
}) => {
  // Собираем уникальные категории из всех постов
  const uniqueCategories = useMemo(() => {
    const map = new Map<string, { slug: string; name: string }>()
    posts.forEach((post) => {
      post.categories?.edges.forEach((edge: any) => {
        // Исключаем категорию workshops и ее дочерние категории
        if (
          !map.has(edge.node.slug) &&
          edge.node.slug !== 'workshops' &&
          !edge.node.slug.includes('workshops/')
        ) {
          map.set(edge.node.slug, {
            slug: edge.node.slug,
            name: edge.node.name,
          })
        }
      })
    })
    return Array.from(map.values())
  }, [posts])

  return (
    <div
      className={`cont carousel carousel-center gap-2 w-full pb-8 ${className}`}
    >
      <button
        className={`btn btn-md md:btn-lg btn-primary text-white font-medium text-lg md:text-xl px-4 whitespace-nowrap ${
          selectedCategory ? 'btn-outline bg-white border-white text-black' : ''
        }`}
        style={{ fontFamily: 'Commissioner Variable, sans-serif' }}
        onClick={() => onCategoryChange(null)}
      >
        Все проекты
      </button>
      {uniqueCategories.map((cat) => (
        <button
          key={cat.slug}
          className={`btn btn-md md:btn-lg bg-white text-black font-medium text-lg md:text-xl px-4 border border-gray-200 whitespace-nowrap ${
            selectedCategory === cat.slug
              ? 'border-primary bg-primary border-2 text-primary'
              : ''
          }`}
          style={{ fontFamily: 'Commissioner Variable, sans-serif' }}
          onClick={() => onCategoryChange(cat.slug)}
        >
          {cat.name}
        </button>
      ))}
    </div>
  )
}

export default ProjectFilters
