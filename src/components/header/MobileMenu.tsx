import { contactFormFields } from '@/app/contactFormFields'
import ModalContactForm from '@/components/contactForm/ModalContactForm'
import Modal from '@/components/modal/Modal'
import type { ModalHandle } from '@/components/modal/modal.types'
import Socials from '@/components/socials/Socials'
import { MenuItemNode } from '@/graphql/types/menuTypes'
import cn from 'clsx'
import Link from 'next/link'
import { FC, useRef, useState } from 'react'
import styles from './Header.module.scss'
import { MobileMenuProps } from './types'

const MobileMenu: FC<MobileMenuProps> = ({
  isActive,
  menuItems,
  highlighting,
  pathname,
  handleMenuItemClick,
  telefon,
  telegram,
  email,
  instagram,
  vk,
  sticky,
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const formModalRef = useRef<ModalHandle>(null)
  const handleToggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx)
  }
  const handleDiscussClick = () => {
    formModalRef.current?.showModal()
  }

  return (
    <>
      {isActive && (
        <div
          className="fixed inset-0 bg-[#393939]/50 z-10 md:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}
      <nav
        className={cn(
          { [styles.active]: isActive },
          'fixed md:hidden z-20 w-1/2 h-full end-0 top-0 translate-x-full opacity-0 transition-all duration-300 ease-out',
          'rounded-tl-2xl rounded-bl-2xl',
          sticky && 'top-0',
        )}
      >
        <ul
          tabIndex={0}
          className="absolute p-0 flex-col flex-nowrap gap-5 top-24 left-4"
        >
          {menuItems.map((item: MenuItemNode, index: number) => (
            <li key={index} className={cn(styles.item, 'block')}>
              {item.childItems?.edges?.length ? (
                <>
                  <Link
                    href={item.uri}
                    className={cn(
                      'font-medium text-lg p-0 transition-colors duration-200 hover:text-base-200 flex items-center gap-1',
                      { 'text-primary': highlighting && item.uri === pathname },
                    )}
                    onClick={(e) => {
                      e.preventDefault()
                      handleToggle(index)
                    }}
                  >
                    {item.label}
                    <svg
                      className={cn('w-4 h-4 ml-1 transition-transform', {
                        'rotate-180': openIndex === index,
                      })}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </Link>
                  {openIndex === index && (
                    <ul className="pl-4 pt-2 flex flex-col gap-2">
                      {item.childItems.edges.map(({ node }) => (
                        <li key={node.id}>
                          <Link
                            className={cn('text-base block', {
                              'text-primary':
                                highlighting && node.uri === pathname,
                            })}
                            href={node.uri}
                            onClick={() => handleMenuItemClick(node.uri)}
                          >
                            {node.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <Link
                  className={cn(
                    'font-medium text-lg p-0 transition-colors duration-200 hover:text-base-200',
                    {
                      'text-primary': highlighting && item.uri === pathname,
                    },
                  )}
                  href={item.uri}
                  onClick={() => handleMenuItemClick(item.uri)}
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
        {/* Кнопка и телефон внизу мобильного меню */}
        <div className="absolute bottom-6 left-0 w-full flex flex-col gap-2 px-4">
          <button
            className="btn btn-sm btn-block font-medium text-white btn-primary hover:bg-base-100 hover:text-primary border-primary border-2 text-sm md:text-base px-1 whitespace-nowrap"
            onClick={handleDiscussClick}
          >
            Обсудить проект
          </button>
          <Modal
            fullScreen={true}
            closeIcon={true}
            contentClassName="cont"
            ref={formModalRef}
          >
            <ModalContactForm
              title="Обсуждение проекта"
              fullScreen={true}
              fields={contactFormFields}
              message="Ваше сообщение"
              closeIcon
              showStepCounter={true}
              inlineFirstStep={true}
              descr={
                contactFormFields.find(
                  (f) => (f.step || 1) === 1 && f.layout === 'row' && f.descr,
                )?.descr
              }
            />
          </Modal>
          {telefon && (
            <a
              href={`tel:${telefon}`}
              className="flex items-center gap-1 font-medium hover:underline mt-2"
            >
              <img src="/phone.svg" alt="Телефон" width={20} height={20} />
              {telefon}
            </a>
          )}
          <div className="mt-2">
            <Socials
              telegram={telegram}
              email={email}
              vk={vk}
              instagram={instagram}
            />
          </div>
        </div>
      </nav>
    </>
  )
}

export default MobileMenu
