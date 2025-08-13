'use client'
import { contactFormFields } from '@/app/contactFormFields'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ConditionalRenderer } from '../conditional/ConditionalRenderer'

interface ProjectPageClientProps {
  heroBlock: any
  aboutBlock: any
  posts: any[]
  companies?: any[]
  typesOfContent?: any
  pagecontent?: any
  content?: string
}

export default function ProjectPageClient({
  heroBlock,
  aboutBlock,
  posts,
  companies = [],
  typesOfContent,
  pagecontent,
  content,
}: ProjectPageClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const pathname = usePathname()
  const [pageId, setPageId] = useState<string | null>(null)
  const [pageTitle, setPageTitle] = useState<string>('Все проекты')

  useEffect(() => {
    const slug = pathname.replace(/^\//, '')
    console.log('🔍 ProjectPageClient: pathname =', pathname, 'slug =', slug)
    fetch(`/api/page-title?slug=${encodeURIComponent(slug)}`)
      .then((res) => res.json())
      .then((data) => {
        console.log('🔍 ProjectPageClient: API response =', data)
        if (data.id) setPageId(data.id)
        if (data.title) setPageTitle(data.title)
      })
      .catch((error) => {
        console.error('🔍 ProjectPageClient: API error =', error)
      })
  }, [pathname])

  // Фильтруем посты только из категории projects (исключаем workshops)
  const projectPosts = posts.filter((post: any) =>
    post.categories?.edges.some(
      (edge: any) =>
        edge.node.slug !== 'workshops' &&
        !edge.node.slug.includes('workshops/'),
    ),
  )

  // Фильтрация по выбранной категории
  const filteredPosts = selectedCategory
    ? projectPosts.filter((post: any) =>
        post.categories?.edges.some(
          (edge: any) => edge.node.slug === selectedCategory,
        ),
      )
    : projectPosts

  const showHero =
    heroBlock && heroBlock.header && String(heroBlock.header).trim() !== ''
  return (
    <div>
      {/* Хлебные крошки */}
      <nav className="cont text-sm text-gray-500 py-4" aria-label="breadcrumbs">
        <span>
          <a href="/" className="hover:underline">
            Главная
          </a>{' '}
          |
        </span>
        <span className="text-primary font-semibold ml-1">Проекты</span>
      </nav>

      {/* Универсальный рендерер для условных блоков */}
      <ConditionalRenderer
        typesOfContent={typesOfContent}
        pagecontent={pagecontent}
        posts={projectPosts}
        content={content}
        fields={contactFormFields}
      />
    </div>
  )
}
