import { contactFormFields } from '@/app/contactFormFields'
import AboutBlock from '@/components/aboutBlock/AboutBlock'
import ChildCategoriesBlock from '@/components/ChildCategoriesBlock'
import Hero from '@/components/hero/Hero'
import PageTitle from '@/components/PageTitle'
import { TypesOfContentChooseHeroLayout } from '@/graphql/types/pageSettingsTypes'
import { getApolloClient } from '@/lib/apollo-client'
import { fetchChildCategories } from '@/services/pageService'
import { ConditionalRenderer } from './conditional/ConditionalRenderer'

interface WpPageComponentProps {
  pageData: any
}

export default async function WpPageComponent({
  pageData,
}: WpPageComponentProps) {
  const typesOfContent = pageData.typesOfContent

  const heroBlock = typesOfContent?.choose?.find(
    (item: any) => item.fieldGroupName === 'TypesOfContentChooseHeroLayout',
  ) as TypesOfContentChooseHeroLayout | undefined

  const aboutBlock = typesOfContent?.choose?.find(
    (item: any) => item.fieldGroupName === 'TypesOfContentChooseAboutLayout',
  )

  // Получаем дочерние категории для страниц projects и workshops
  let childCategories: any[] = []
  if (pageData.slug === 'projects') {
    const apolloClient = getApolloClient()
    childCategories = await fetchChildCategories(apolloClient, 'projects')
  } else if (pageData.slug === 'workshops') {
    const apolloClient = getApolloClient()
    childCategories = await fetchChildCategories(apolloClient, 'workshops')
  }

  return (
    <div>
      {/* Хлебные крошки для дочерних страниц workshops */}
      {pageData.parent?.node?.slug === 'workshops' && (
        <nav
          className="cont text-sm text-gray-500 py-4"
          aria-label="breadcrumbs"
        >
          <span>
            <a href="/" className="hover:underline">
              Главная
            </a>{' '}
            |
          </span>
          <span>
            <a href="/workshops" className="hover:underline ml-1">
              Цеха
            </a>{' '}
            |
          </span>
          <span className="text-primary font-semibold ml-1">
            {pageData.title}
          </span>
        </nav>
      )}
      {heroBlock && (
        <Hero
          title={heroBlock.header}
          subtitle={heroBlock.sub}
          text1={heroBlock.text1}
          text2={heroBlock.text2}
          buttonText="Обсудить проект"
        />
      )}

      {/* Заголовок страницы под header */}
      <div className="cont">
        <PageTitle pageId={pageData.id} fallback={pageData.title} />
      </div>

      {/* Загрузка цеха */}
      {/* Временно скрыт блок загрузки цехов */}
      {/* <WorkshopLoad workshopName={pageData.title} /> */}

      {aboutBlock && <AboutBlock block={aboutBlock} />}

      {/* Универсальный рендерер для условных блоков */}
      <ConditionalRenderer
        typesOfContent={typesOfContent}
        pagecontent={pageData.pagecontent}
        posts={pageData.posts}
        content={pageData.content}
        fields={contactFormFields}
        childPages={pageData.slug === 'workshops' ? childCategories : undefined}
      />

      {/* Дочерние категории для страницы projects и workshops */}
      {pageData.slug === 'projects' && childCategories.length > 0 && (
        <ChildCategoriesBlock
          categories={childCategories}
          parentSlug={pageData.slug}
        />
      )}

      {/* Обработка других типов блоков */}
      {/*
      {typesOfContent?.choose?.map((block: any, index: number) => {
        if (
          block.fieldGroupName === 'TypesOfContentChooseHeroLayout' ||
          block.fieldGroupName === 'TypesOfContentChooseAboutLayout' ||
          block.fieldGroupName === 'TypesOfContentChooseCustomersLayout'
        ) {
          return null // Эти блоки уже обработаны выше
        }

        return (
          <FadeIn key={index} className="cont">
            <div>
              // Здесь можно добавить рендеринг других типов блоков
              // <p>Блок: {block.fieldGroupName}</p>
            </div>
          </FadeIn>
        )
      })}
      */}
    </div>
  )
}
