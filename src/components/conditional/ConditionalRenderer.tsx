'use client'

import type { FormField } from '@/components/contactForm/contactForm.types'
import {
  TypesOfContentChooseAboutLayout,
  TypesOfContentChooseCalculateLayout,
  TypesOfContentChooseCustomersLayout,
} from '@/graphql/types/pageSettingsTypes'
import { transformCustomersFromPageSettings } from '@/services/transformService'
import { Companies } from '@/ui/companies/Companies'
import { wpToTailwind } from '@/utils/wpToTailwind'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import AboutBlock from '../aboutBlock/AboutBlock'
import ModalContactForm from '../contactForm/ModalContactForm'
import ListOfContentsBlock from '../listOfContents/ListOfContentsBlock'
import MiniGallery from '../miniGallery/MiniGallery'
import PostsCarousel from '../postsCarousel/PostsCarousel'
import TextWithButton from '../textWithButton/TextWithButton'

interface ConditionalRendererProps {
  typesOfContent?: {
    choose?: any[]
  }
  pagecontent?: {
    companies?: any[]
  }
  posts?: any[]
  content?: string // добавляем проп content
  fields?: FormField[]
  childPages?: any[] // добавляем проп для дочерних страниц
}

export const ConditionalRenderer = ({
  typesOfContent,
  pagecontent,
  posts,
  content,
  fields,
  childPages,
}: ConditionalRendererProps) => {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  if (!mounted) return null
  if (!typesOfContent?.choose) return null

  return (
    <>
      {/* Рендерим компоненты в порядке добавления в WordPress */}
      {typesOfContent.choose.map((block, index) => {
        switch (block.fieldGroupName) {
          case 'TypesOfContentChooseCustomersLayout':
            return (
              <ConditionalCompanies
                key={index}
                block={block}
                pagecontent={pagecontent}
              />
            )
          case 'TypesOfContentChooseCalculateLayout':
            return (
              <ConditionalTextWithButton
                key={index}
                block={block}
                fields={fields}
              />
            )
          case 'TypesOfContentChooseAboutLayout':
            return <ConditionalAboutBlock key={index} block={block} />
          case 'TypesOfContentChooseProjectCarouselLayout':
            return (
              <ConditionalPostsCarousel
                key={index}
                block={block}
                posts={posts}
              />
            )
          case 'TypesOfContentChooseMiniGalleryLayout':
            return (
              <MiniGallery
                key={index}
                images={block.point.map((p: any) => ({
                  altText: p.image?.node?.altText || '',
                  sourceUrl: p.image?.node?.sourceUrl || '',
                }))}
              />
            )
          case 'TypesOfContentChooseCustomLayout':
            if (block.add && content) {
              return <ConditionalCustomContent key={index} content={content} />
            }
            return null
          case 'TypesOfContentChooseListOfContentsLayout': {
            if (!block.add) return null
            const isProjects = pathname.startsWith('/projects')
            const isWorkshops = pathname.startsWith('/workshops')
            if (!isProjects && !isWorkshops) return null
            if (isProjects) {
              return (
                <ListOfContentsBlock
                  key={index}
                  type="projects"
                  posts={posts}
                />
              )
            }
            if (isWorkshops) {
              return (
                <ListOfContentsBlock
                  key={index}
                  type="workshops"
                  pages={childPages}
                />
              )
            }
            return null
          }
          default:
            return null
        }
      })}

      {/* Проверяем pagecontent для Companies (если нет в typesOfContent) */}
      {!typesOfContent.choose.some(
        (block) =>
          block.fieldGroupName === 'TypesOfContentChooseCustomersLayout',
      ) &&
        pagecontent?.companies &&
        pagecontent.companies.length > 0 && (
          <ConditionalCompaniesFromPageContent pagecontent={pagecontent} />
        )}
    </>
  )
}

// Компонент для Companies из typesOfContent
const ConditionalCompanies = ({
  block,
  pagecontent,
}: {
  block: TypesOfContentChooseCustomersLayout
  pagecontent?: any
}) => {
  if (block?.repeater && block.repeater.length > 0) {
    return (
      <Companies
        companies={transformCustomersFromPageSettings(block.repeater)}
      />
    )
  }
  return null
}

// Компонент для Companies из pagecontent
const ConditionalCompaniesFromPageContent = ({
  pagecontent,
}: {
  pagecontent: any
}) => {
  if (pagecontent?.companies && pagecontent.companies.length > 0) {
    return <Companies companies={pagecontent.companies} />
  }
  return null
}

// Компонент для TextWithButton с формой
import { useRef } from 'react'
import Modal from '../modal/Modal'
import type { ModalHandle } from '../modal/modal.types'

const ConditionalTextWithButton = ({
  block,
  fields,
}: {
  block: TypesOfContentChooseCalculateLayout & { showForm?: boolean }
  fields?: FormField[]
}) => {
  // Refs для модалок
  const formModalRef = useRef<ModalHandle>(null)
  const messageModalRef = useRef<ModalHandle>(null)
  // Состояние для типа сообщения
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(
    null,
  )

  const handleButtonClick = () => {
    if (block.showForm !== false) {
      formModalRef.current?.showModal()
    }
  }

  const handleSuccess = (message: string) => {
    const isError = message.toLowerCase().includes('ошибка')
    setMessageType(isError ? 'error' : 'success')

    // Закрываем форму
    const formDialog =
      formModalRef.current && (formModalRef.current as any).modalRef?.current
    if (formDialog && typeof formDialog.close === 'function') {
      formDialog.close()
    }

    // Показываем сообщение в отдельной модалке
    messageModalRef.current?.showModal()
  }

  const handleCloseForm = () => {
    setMessageType(null) // Сбрасываем состояние при закрытии формы
  }

  const handleCloseMessage = () => {
    setMessageType(null) // Сбрасываем состояние при закрытии сообщения
    const formDialog =
      formModalRef.current && (formModalRef.current as any).modalRef?.current
    if (formDialog && typeof formDialog.close === 'function') {
      formDialog.close() // Закрываем форму если она открыта
    }
  }

  // По умолчанию форма всегда показывается, если явно не отключили showForm: false
  const shouldShowForm = block.showForm !== false && fields

  return (
    <>
      <TextWithButton
        text={block?.text}
        btnText={block?.btnText}
        onClick={handleButtonClick}
        closeIcon
        inlineFirstStep={true}
      />
      {shouldShowForm && (
        <>
          {/* Модальное окно с формой */}
          <Modal
            fullScreen={true}
            closeIcon={true}
            contentClassName="cont"
            ref={formModalRef}
            onClose={() => {
              const formDialog =
                formModalRef.current &&
                (formModalRef.current as any).modalRef?.current
              if (formDialog && typeof formDialog.close === 'function') {
                formDialog.close()
              }
            }}
          >
            <ModalContactForm
              title="Обсуждение проекта"
              fullScreen={true}
              fields={fields}
              message="Ваше сообщение"
              closeIcon
              onSuccess={handleSuccess}
              showStepCounter={true}
              inlineFirstStep={true}
              descr={
                fields?.find(
                  (f) => (f.step || 1) === 1 && f.layout === 'row' && f.descr,
                )?.descr
              }
            />
          </Modal>

          {/* Отдельное модальное окно для сообщений */}
          <Modal
            fullScreen={false}
            closeIcon={true}
            contentClassName="px-8 py-6 bg-white shadow-lg"
            ref={messageModalRef}
            onClose={handleCloseMessage}
            message={
              messageType === 'success'
                ? 'Спасибо за обращение! Мы свяжемся с вами в ближайшее время.'
                : 'Произошла ошибка при отправке формы. Пожалуйста, попробуйте позже.'
            }
          />
        </>
      )}
    </>
  )
}

// Компонент для AboutBlock
const ConditionalAboutBlock = ({
  block,
}: {
  block: TypesOfContentChooseAboutLayout
}) => {
  if (
    block?.grid &&
    block.grid.some(
      (row) =>
        row &&
        typeof row.heading === 'string' &&
        typeof row.subtitle === 'string' &&
        row.img &&
        row.img.node &&
        typeof row.img.node.sourceUrl === 'string' &&
        row.img.node.sourceUrl.length > 0,
    )
  ) {
    return <AboutBlock block={block} />
  }
  return null
}

// Компонент для PostsCarousel
const ConditionalPostsCarousel = ({
  block,
  posts,
}: {
  block: { projectcarousel?: boolean }
  posts?: any[]
}) => {
  if (block?.projectcarousel && posts && posts.length > 0) {
    // Всегда показываем все посты, фильтрация будет происходить в PostsCarousel
    return <PostsCarousel posts={posts} />
  }
  return null
}

// Компонент для кастомного вывода контента
const ConditionalCustomContent = ({ content }: { content: string }) => {
  if (!content) return null

  // Обрабатываем контент с помощью wpToTailwind
  const processedContent = wpToTailwind(content)

  return (
    <div className="cont px-[16px]">
      {/* Убираем prose, так как он может переопределять стили */}
      <section className="prose max-w-full">
        {/* Используем dangerouslySetInnerHTML напрямую, чтобы сохранить все классы */}
        <div dangerouslySetInnerHTML={{ __html: processedContent }} />
      </section>
    </div>
  )
}
