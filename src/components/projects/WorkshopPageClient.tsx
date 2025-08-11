'use client'
import { contactFormFields } from '@/app/contactFormFields'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ConditionalRenderer } from '../conditional/ConditionalRenderer'

interface WorkshopPageClientProps {
  heroBlock: any
  aboutBlock: any
  posts: any[]
  companies?: any[]
  typesOfContent?: any
  pagecontent?: any
  content?: string
  workshopChildren?: any[] // добавляем проп для дочерних страниц
}

export default function WorkshopPageClient({
  heroBlock,
  aboutBlock,
  posts,
  companies = [],
  typesOfContent,
  pagecontent,
  content,
  workshopChildren = [], // добавляем проп
}: WorkshopPageClientProps) {
  const pathname = usePathname()
  const [pageId, setPageId] = useState<string | null>(null)
  const [pageTitle, setPageTitle] = useState<string>('Цеха')

  useEffect(() => {
    const slug = pathname.replace(/^\//, '')
    console.log('🔍 WorkshopPageClient: pathname =', pathname, 'slug =', slug)
    fetch(`/api/page-title?slug=${encodeURIComponent(slug)}`)
      .then((res) => res.json())
      .then((data) => {
        console.log('🔍 WorkshopPageClient: API response =', data)
        if (data.id) setPageId(data.id)
        if (data.title) setPageTitle(data.title)
      })
      .catch((error) => {
        console.error('🔍 WorkshopPageClient: API error =', error)
      })
  }, [pathname])

  // Фильтруем посты только из категории workshops
  const workshopPosts = posts.filter((post: any) =>
    post.categories?.edges.some(
      (edge: any) =>
        edge.node.slug === 'workshops' || edge.node.slug.includes('workshops/'),
    ),
  )

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
        <span className="text-primary font-semibold ml-1">Цеха</span>
      </nav>
      {/* Универсальный рендерер для условных блоков */}
      <ConditionalRenderer
        typesOfContent={typesOfContent}
        pagecontent={pagecontent}
        posts={workshopPosts}
        content={content}
        fields={contactFormFields}
        childPages={workshopChildren}
      />
    </div>
  )
}
