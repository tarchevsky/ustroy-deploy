'use client'

import Burger from '@/components/burger/Burger'
import Brief from '@/components/contactForm/Brief'
import Logo from '@/components/logo/Logo'
import { MenuItemNode } from '@/graphql/types/menuTypes'
import cn from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FC, useEffect, useState } from 'react'
import MobileMenu from './MobileMenu'
import { HeaderProps } from './types'

// HeaderNav компонент
const HeaderNav: FC<{
  menuItems: MenuItemNode[]
  highlighting: boolean
  pathname: string
  handleMenuItemClick: (path: string) => void
}> = ({ menuItems, highlighting, pathname, handleMenuItemClick }) => (
  <nav className="hidden md:block">
    <ul className="flex gap-6">
      {menuItems.map((item, index) => (
        <li
          key={index}
          className={
            item.childItems?.edges?.length
              ? 'dropdown dropdown-hover group'
              : ''
          }
        >
          {item.childItems?.edges?.length ? (
            <>
              <Link
                className={cn(
                  'font-medium text-lg md:text-xl p-0 transition-colors duration-200 hover:text-base-200 flex items-center gap-1',
                  { 'text-primary': highlighting && item.uri === pathname },
                )}
                href={item.uri}
                onClick={() => handleMenuItemClick(item.uri)}
              >
                {item.label}
                <svg
                  className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:rotate-180"
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
              <ul tabIndex={0} className="dropdown-content pt-[15px] w-56 z-30">
                <div className="p-6 bg-white shadow rounded-xl flex flex-col gap-2">
                  {item.childItems.edges.map(({ node }) => (
                    <li key={node.id}>
                      <Link
                        className={cn(
                          'text-base transition-colors duration-200',
                          {
                            'text-primary':
                              highlighting && node.uri === pathname,
                          },
                        )}
                        href={node.uri}
                        onClick={() => handleMenuItemClick(node.uri)}
                      >
                        <span className="hover:text-primary transition-colors duration-200">
                          {node.label}
                        </span>
                      </Link>
                    </li>
                  ))}
                </div>
              </ul>
            </>
          ) : (
            <Link
              className={cn(
                'font-medium text-lg md:text-xl p-0 transition-colors duration-200 hover:text-base-200',
                { 'text-primary': highlighting && item.uri === pathname },
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
  </nav>
)

const Header: FC<HeaderProps> = ({
  logoData,
  highlighting = false,
  telefon,
  telegram,
  email,
  instagram,
  vk,
  menuItems,
  sticky = false,
}) => {
  const [isMenuActive, setIsMenuActive] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleMenu = () => {
    setIsMenuActive(!isMenuActive)
  }

  useEffect(() => {
    if (isMenuActive) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [isMenuActive])

  const pathname = usePathname()

  const handleMenuItemClick = (path: string) => {
    if (path === pathname) {
      setIsMenuActive(false)
    }
  }

  useEffect(() => {
    setIsMenuActive(false)
  }, [pathname])

  return (
    <header
      className={cn(
        'cont flex justify-between items-center',
        sticky && 'sticky top-0 z-30 bg-base-100',
        'relative',
      )}
    >
      <div className="flex items-center gap-8">
        <Logo
          className="my-2 md:my-6 flex flex-col justify-center z-20 md:h-[84px] md:w-[84px]"
          type="file"
          logo={logoData?.sourceUrl}
          logoAlt={logoData?.altText}
          width={44}
          height={44}
        />
        <HeaderNav
          menuItems={menuItems}
          highlighting={highlighting}
          pathname={pathname}
          handleMenuItemClick={handleMenuItemClick}
        />
      </div>
      <MobileMenu
        isActive={isMenuActive}
        menuItems={menuItems}
        highlighting={highlighting}
        pathname={pathname}
        handleMenuItemClick={handleMenuItemClick}
        telefon={telefon}
        telegram={telegram}
        email={email}
        instagram={instagram}
        vk={vk}
        sticky={sticky}
      />
      <div className="flex items-center gap-4 md:gap-6">
        <Brief className="hidden md:block btn font-medium text-white btn-primary hover:bg-base-100 hover:text-primary border-primary border-2" />
        {telefon && (
          <a
            href={`tel:${telefon}`}
            className="hidden md:inline-block text-lg font-medium hover:underline"
          >
            {telefon}
          </a>
        )}
        {telefon && (
          <Link
            href={`tel:${telefon}`}
            className="p-[5px] mt-1 mr-[47px] md:hidden"
          >
            <img src="/phone.svg" alt="Телефон" width={24} height={24} />
          </Link>
        )}
        <Burger toggleMenu={toggleMenu} isActive={isMenuActive} />
      </div>
    </header>
  )
}

export default Header
