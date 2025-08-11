'use client'

import { Fancybox as NativeFancybox } from '@fancyapps/ui'
import '@fancyapps/ui/dist/fancybox/fancybox.css'
import { FC, useEffect, useRef, useState } from 'react'

interface MiniGalleryProps {
  images: { altText: string; sourceUrl: string }[]
}

const ArrowButton = ({
  direction,
  onClick,
  visible,
}: {
  direction: 'left' | 'right'
  onClick: () => void
  visible: boolean
}) => (
  <button
    onClick={(e) => {
      e.stopPropagation()
      onClick()
    }}
    className={`hidden md:flex absolute top-1/2 z-10 -translate-y-1/2 transition-opacity duration-200 ${
      direction === 'left' ? 'left-28' : 'right-28'
    } ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    aria-label={`Scroll ${direction}`}
    style={{
      width: '40px',
      height: '40px',
      backgroundColor: 'rgba(255, 255, 255, 0.30)',
      backdropFilter: 'blur(5.4px)',
      borderRadius: '8px',
      alignItems: 'center',
      justifyContent: 'center',
      border: 'none',
      cursor: 'pointer',
    }}
  >
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        transform: direction === 'left' ? 'rotate(180deg)' : 'none',
      }}
    >
      <path
        d="M9 18L15 12L9 6"
        stroke="#FE520A"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </button>
)

const MiniGallery: FC<MiniGalleryProps> = ({ images }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)
  const [isHovered, setIsHovered] = useState(false)

  const scrollTo = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current
    if (!container) return

    // Получаем ширину одного элемента галереи (260px) + отступ (16px)
    const itemWidth = 260 + 16 // 16px - это gap-4
    const containerWidth = container.parentElement?.clientWidth || 0

    // Вычисляем, сколько элементов полностью помещается в видимой области
    const visibleItems = Math.floor(containerWidth / itemWidth)

    // Вычисляем ширину прокрутки на основе количества видимых элементов
    const scrollAmount = itemWidth * (visibleItems > 1 ? visibleItems - 1 : 1)

    // Вычисляем новую позицию прокрутки
    let newScroll
    if (direction === 'left') {
      newScroll = Math.max(0, container.scrollLeft - scrollAmount)
    } else {
      const maxScroll = container.scrollWidth - container.clientWidth
      newScroll = Math.min(maxScroll, container.scrollLeft + scrollAmount)
    }

    // Прокручиваем плавно
    container.scrollTo({
      left: newScroll,
      behavior: 'smooth',
    })
  }

  const checkScroll = () => {
    if (!scrollContainerRef.current || !containerRef.current) {
      console.log('checkScroll: элементы не найдены')
      return
    }

    const container = containerRef.current
    const scrollContainer = scrollContainerRef.current

    // Принудительно обновляем размеры
    const containerWidth = container.clientWidth
    const scrollWidth = scrollContainer.scrollWidth
    const scrollLeft = scrollContainer.scrollLeft
    const maxScroll = Math.max(0, scrollWidth - containerWidth)

    // Всегда показываем правую стрелку, если есть место для скролла
    const showRight = scrollLeft < maxScroll - 10 || maxScroll <= 0

    console.log('checkScroll', {
      containerWidth,
      scrollWidth,
      scrollLeft,
      maxScroll,
      showLeft: scrollLeft > 10,
      showRight,
    })

    setShowLeftArrow(scrollLeft > 10)
    setShowRightArrow(showRight)
  }

  // Функция для принудительного обновления размеров
  const forceUpdate = () => {
    if (!scrollContainerRef.current) return

    // Принудительно вызываем проверку с небольшой задержкой
    setTimeout(() => {
      checkScroll()
      // Повторная проверка после полной загрузки изображений
      const images = scrollContainerRef.current?.querySelectorAll('img')
      if (images) {
        images.forEach((img) => {
          if (!img.complete) {
            img.onload = checkScroll
          }
        })
      }

      // Дополнительная проверка после полной загрузки страницы
      if (document.readyState !== 'complete') {
        window.addEventListener('load', checkScroll)
      }

      // Проверяем, нужны ли стрелки при загрузке
      if (scrollContainerRef.current) {
        const { scrollWidth, clientWidth } = scrollContainerRef.current
        setShowRightArrow(scrollWidth > clientWidth)
      }
    }, 300)
  }

  useEffect(() => {
    const container = containerRef.current
    const scrollContainer = scrollContainerRef.current
    if (!container || !scrollContainer) {
      console.error('Не удалось найти контейнеры для инициализации')
      return
    }

    console.log('Инициализация галереи', {
      containerWidth: container.clientWidth,
      scrollWidth: scrollContainer.scrollWidth,
      container,
      scrollContainer,
    })

    // Первая проверка
    checkScroll()

    // Повторная проверка после небольшой задержки
    const initTimer = setTimeout(forceUpdate, 100)

    // Добавляем обработчик скролла
    scrollContainer.addEventListener('scroll', checkScroll, { passive: true })

    // Обновляем при изменении размеров окна
    const resizeObserver = new ResizeObserver(forceUpdate)
    resizeObserver.observe(container)

    // Принудительно обновляем видимость стрелок при загрузке изображений
    const images = scrollContainer.querySelectorAll('img')
    images.forEach((img) => {
      if (!img.complete) {
        img.onload = forceUpdate
      }
    })

    // Инициализация Fancybox
    const delegate = '[data-fancybox]'
    const options: any = {
      Thumbs: {
        type: 'classic',
      },
      Toolbar: {
        display: {
          left: [],
          middle: [],
          right: ['close'],
        },
      },
    }

    // Используем делегирование событий
    NativeFancybox.bind(container, delegate, options)

    // Cleanup
    return () => {
      clearTimeout(initTimer)
      scrollContainer.removeEventListener('scroll', checkScroll)
      window.removeEventListener('load', checkScroll)
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
      NativeFancybox.unbind(container)
      NativeFancybox.close()
    }
  }, [])

  // Функция для оптимизации URL изображений
  const optimizeImageUrl = (
    url: string,
    width: number = 260,
    height: number = 180,
  ) => {
    if (!url) return url

    // Если URL уже содержит параметры оптимизации, не добавляем повторно
    if (url.includes('w=') || url.includes('h=')) {
      return url
    }

    const separator = url.includes('?') ? '&' : '?'
    // Используем только ширину для масштабирования с сохранением пропорций
    // auto=compress,format для автоматического сжатия и выбора формата
    // q=80 для хорошего качества при меньшем размере файла
    return `${url}${separator}w=${width}&auto=compress,format&q=80`
  }

  if (!images || images.length === 0) {
    return null
  }

  // Отладочная информация
  console.log('Render MiniGallery', {
    imagesCount: images?.length,
    showLeftArrow,
    showRightArrow,
    containerWidth: containerRef.current?.clientWidth,
    scrollContainerWidth: scrollContainerRef.current?.scrollWidth,
  })

  return (
    <div className="py-8">
      <h3 className="cont mb-6 md:text-3xl uppercase font-medium">Галерея</h3>
      <div
        className="relative w-full"
        ref={containerRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide py-4 px-6 md:px-24"
          style={{
            scrollBehavior: 'smooth',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          <div className="flex gap-4 w-max">
            {images.map((img, i) => (
              <div
                key={i}
                className="flex-shrink-0 rounded-lg overflow-hidden bg-gray-200 cursor-pointer"
                style={{ width: 260, height: 180 }}
              >
                <a
                  href={img.sourceUrl}
                  data-fancybox="gallery"
                  data-caption={img.altText}
                >
                  <img
                    src={optimizeImageUrl(img.sourceUrl, 260, 180)}
                    alt={img.altText}
                    className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                    loading="lazy"
                    onLoad={checkScroll}
                    sizes="260px"
                    srcSet={`
                      ${optimizeImageUrl(img.sourceUrl, 260, 180)} 1x,
                      ${optimizeImageUrl(img.sourceUrl, 520, 360)} 2x
                    `}
                  />
                </a>
              </div>
            ))}
          </div>
        </div>

        <ArrowButton
          direction="left"
          onClick={() => scrollTo('left')}
          visible={isHovered && showLeftArrow}
        />
        <ArrowButton
          direction="right"
          onClick={() => scrollTo('right')}
          visible={isHovered && showRightArrow}
        />
      </div>
    </div>
  )
}

export default MiniGallery
