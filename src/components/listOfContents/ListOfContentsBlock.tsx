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
      <section className="my-12">
        <ProjectFilters
          posts={posts}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          className="mb-6"
        />
        <div className="cont">
          <h2 className="text-2xl font-bold mb-6">Все проекты</h2>
          <ProjectGrid posts={filteredPosts} />
        </div>
      </section>
    )
  }

  if (type === 'workshops') {
    return (
      <section className="my-12">
        <div className="cont">
          <WorkshopPagesGrid pages={pages} />
        </div>
      </section>
    )
  }

  return null
}

export default ListOfContentsBlock
