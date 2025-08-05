import Footer from '@/components/footer/Footer'
import Header from '@/components/header/Header'
import Metrika from '@/components/metrika/Metrika'
import { SITE_NAME } from '@/constants/site.constants'
import type { Metadata } from 'next'
import { ReactNode } from 'react'
import './globals.css'
// Supports weights 100-900
import { fetchHeaderLogo } from '@/components/header/fetchHeaderLogo'
import { getApolloClient } from '@/lib/apollo-client'
import { fetchMenuItems } from '@/services/menuService'
import { fetchSiteSettings } from '@/services/siteSettingsService'
// Шрифт заголовков
import '@fontsource-variable/unbounded'
// Шрифт текста
import '@fontsource-variable/commissioner'

const yId = process.env.NEXT_PUBLIC_YID // id яндекс метрики

// Используем generateMetadata вместо статических метаданных
export async function generateMetadata(): Promise<Metadata> {
  const apolloClient = getApolloClient()
  const siteSettings = await fetchSiteSettings(apolloClient)

  // Используем SEO данные из WordPress, если они доступны
  const title = siteSettings.seo?.title || SITE_NAME
  const description = siteSettings.seo?.metaDesc || ''

  return {
    title: {
      default: title,
      template: `%s | ${title}`,
    },
    description: description,
    icons: {
      icon: '/favicon.png',
    },
    // Добавляем Open Graph метатеги для социальных сетей
    openGraph: {
      title: title,
      description: description,
      url: 'https://u-stroy.art/', // Замените на ваш домен
      siteName: title,
      locale: 'ru_RU',
      type: 'website',
    },
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const logoData = await fetchHeaderLogo()
  const apolloClient = getApolloClient()
  const siteSettings = await fetchSiteSettings(apolloClient)
  const menuItems = await fetchMenuItems(apolloClient)
  // Управление прилипанием header
  const isHeaderSticky = true // поменяйте на true, чтобы включить прилипание
  return (
    <html lang="ru">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <link rel="icon" href="/favicon.png" sizes="any" />
      </head>
      <body>
        <Header
          logoData={logoData}
          highlighting={true}
          telefon={siteSettings.telefon}
          telegram={siteSettings.telegram}
          email={siteSettings.email}
          vk={siteSettings.vk}
          instagram={siteSettings.instagram}
          menuItems={menuItems}
          sticky={isHeaderSticky}
        />
        {children}
        <Footer
          logoData={logoData}
          vk={siteSettings.vk}
          telegram={siteSettings.telegram}
          instagram={siteSettings.instagram}
          telefon={siteSettings.telefon}
          email={siteSettings.email}
          menuItems={menuItems}
        />
        {yId ? <Metrika yId={yId} /> : null}
      </body>
    </html>
  )
}
