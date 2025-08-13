import WorkshopPagesGrid from '@/app/workshops/WorkshopPagesGrid'
import React, { useState } from 'react'
import ProjectFilters from '../projectFilters/ProjectFilters'
import ProjectGrid from '../projects/ProjectGrid'

interface ListOfContentsBlockProps {
  type: 'projects' | 'workshops'
  posts?: any[]
  pages?: any[]
}

const ListOfContentsBlock: React.FC<ListOfContentsBlockProps> = ({
  type,
  posts = [],
  pages = [],
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  if (type === 'projects') {
    const filteredPosts = selectedCategory
      ? posts.filter((post: any) =>
          post.categories?.edges.some(
            (edge: any) => edge.node.slug === selectedCategory,
          ),
        )
      : posts

    return (
      <>
        <ProjectFilters
          posts={posts}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        <div className="ind cont">
          <h2 className="text-5xl font-bold mb-6">Все проекты</h2>
          <ProjectGrid posts={filteredPosts} />
        </div>
      </>
    )
  }

  if (type === 'workshops') {
    return (
      <>
        <div className="ind cont">
          <h2 className="text-5xl font-bold mb-6">Цеха</h2>
          <WorkshopPagesGrid pages={pages} />
        </div>
      </>
    )
  }

  return null
}

export default ListOfContentsBlock
