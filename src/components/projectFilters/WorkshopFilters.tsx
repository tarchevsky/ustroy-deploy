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

interface WorkshopFiltersProps {
  posts: Post[]
  selectedCategory: string | null
  onCategoryChange: (category: string | null) => void
  className?: string
}

const WorkshopFilters: React.FC<WorkshopFiltersProps> = ({
  posts,
  selectedCategory,
  onCategoryChange,
  className = '',
}) => {
  // Собираем уникальные категории только из workshops
  const uniqueCategories = useMemo(() => {
    const map = new Map<string, { slug: string; name: string }>()
    posts.forEach((post) => {
      post.categories?.edges.forEach((edge: any) => {
        // Включаем только категории workshops и их дочерние
        if (
          !map.has(edge.node.slug) &&
          (edge.node.slug === 'workshops' ||
            edge.node.slug.includes('workshops/'))
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
      className={`ind cont carousel carousel-center gap-2 py-2 w-full ${className}`}
    >
      <button
        className={`btn btn-primary text-white whitespace-nowrap ${
          selectedCategory ? 'btn-outline bg-white border-white text-black' : ''
        }`}
        onClick={() => onCategoryChange(null)}
      >
        Все цеха
      </button>
      {uniqueCategories.map((cat) => (
        <button
          key={cat.slug}
          className={`btn bg-white text-black border border-gray-200 whitespace-nowrap ${
            selectedCategory === cat.slug
              ? 'border-primary bg-primary border-2 text-primary'
              : ''
          }`}
          onClick={() => onCategoryChange(cat.slug)}
        >
          {cat.name}
        </button>
      ))}
    </div>
  )
}

export default WorkshopFilters
