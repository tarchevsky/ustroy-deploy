'use client'

import FadeIn from '@/components/fadeIn/FadeIn'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { CompaniesProps } from './types'

const ROW_OFFSET = 200 // px, на сколько смещаем ряды изначально

export const Companies = ({ companies }: CompaniesProps) => {
  const [isMobile, setIsMobile] = useState(false)
  const topRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({})

  // Определяем мобильную версию
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Анимация для десктопа
  useEffect(() => {
    if (isMobile) return
    const handleScroll = () => {
      const rect = topRef.current?.parentElement?.getBoundingClientRect()
      if (!rect) return
      const start = window.innerHeight // начинаем, когда блок появляется на экране
      const end = window.innerHeight / 2 // заканчиваем в центре экрана
      const progress = Math.min(
        Math.max((start - rect.top) / (start - end), 0),
        1,
      )
      if (topRef.current)
        topRef.current.style.transform = `translateX(${ROW_OFFSET * (1 - progress)}px)`
      if (bottomRef.current)
        bottomRef.current.style.transform = `translateX(-${ROW_OFFSET * (1 - progress)}px)`
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isMobile])

  // Обработчик ошибок изображений
  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }))
    console.error(`Ошибка загрузки изображения для компании с ID: ${id}`)
  }

  // Мобильная версия
  if (isMobile) {
    return (
      <FadeIn className="cont">
        <section className="ind overflow-x-hidden">
          <h2 className="text-3xl font-bold mb-8 text-[#333] uppercase">
            Наши заказчики
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {companies.map((company) => {
              if (company.link) {
                return (
                  <Link
                    key={company.id}
                    href={company.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white rounded-box flex items-center justify-center"
                    style={{ height: 80 }}
                  >
                    <Image
                      src={company.src}
                      alt={company.alt}
                      width={company.width || 100}
                      height={company.height || 40}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                      }}
                      onError={() => handleImageError(company.id)}
                      unoptimized={imageErrors[company.id]}
                    />
                  </Link>
                )
              }
              return (
                <div
                  key={company.id}
                  className="bg-white rounded-box flex items-center justify-center"
                  style={{ height: 80 }}
                >
                  <Image
                    src={company.src}
                    alt={company.alt}
                    width={company.width || 100}
                    height={company.height || 40}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                    }}
                    onError={() => handleImageError(company.id)}
                    unoptimized={imageErrors[company.id]}
                  />
                </div>
              )
            })}
          </div>
        </section>
      </FadeIn>
    )
  }

  // Десктопная версия
  const half = Math.ceil(companies.length / 2)
  const topRow = companies.slice(0, half)
  const bottomRow = companies.slice(half)

  return (
    <div
      style={{
        overflowX: 'hidden',
        width: '99vw',
        position: 'relative',
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw',
      }}
    >
      <section className="ind">
        <FadeIn className="cont">
          <h2 className="text-[32px] font-bold mb-8 text-[#333] uppercase">
            Наши заказчики
          </h2>
          <div className="flex flex-col gap-6">
            <div
              ref={topRef}
              className="flex gap-6 items-center overflow-visible justify-end pl-[var(--container-padding,theme(spacing.4))]"
              style={{
                transition: 'transform 0.5s linear',
                transform: `translateX(${ROW_OFFSET}px)`,
              }}
            >
              {topRow.map((company) => {
                if (company.link) {
                  return (
                    <Link
                      key={company.id}
                      href={company.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white rounded-box flex items-center justify-center"
                      style={{ width: 205, height: 129 }}
                    >
                      <Image
                        src={company.src}
                        alt={company.alt}
                        width={company.width || 141}
                        height={company.height || 66}
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain',
                        }}
                        onError={() => handleImageError(company.id)}
                        unoptimized={imageErrors[company.id]}
                      />
                    </Link>
                  )
                }
                return (
                  <div
                    key={company.id}
                    className="bg-white rounded-box flex items-center justify-center"
                    style={{ width: 205, height: 129 }}
                  >
                    <Image
                      src={company.src}
                      alt={company.alt}
                      width={company.width || 141}
                      height={company.height || 66}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                      }}
                      onError={() => handleImageError(company.id)}
                      unoptimized={imageErrors[company.id]}
                    />
                  </div>
                )
              })}
            </div>
            <div
              ref={bottomRef}
              className="flex gap-6 items-center overflow-visible justify-start pr-[var(--container-padding,theme(spacing.4))]"
              style={{
                transition: 'transform 0.5s linear',
                transform: `translateX(-${ROW_OFFSET}px)`,
              }}
            >
              {bottomRow.map((company) => {
                if (company.link) {
                  return (
                    <Link
                      key={company.id}
                      href={company.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white rounded-box flex items-center justify-center"
                      style={{ width: 205, height: 129 }}
                    >
                      <Image
                        src={company.src}
                        alt={company.alt}
                        width={company.width || 141}
                        height={company.height || 66}
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain',
                        }}
                        onError={() => handleImageError(company.id)}
                        unoptimized={imageErrors[company.id]}
                      />
                    </Link>
                  )
                }
                return (
                  <div
                    key={company.id}
                    className="bg-white rounded-box flex items-center justify-center"
                    style={{ width: 205, height: 129 }}
                  >
                    <Image
                      src={company.src}
                      alt={company.alt}
                      width={company.width || 141}
                      height={company.height || 66}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                      }}
                      onError={() => handleImageError(company.id)}
                      unoptimized={imageErrors[company.id]}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </FadeIn>
      </section>
    </div>
  )
}
