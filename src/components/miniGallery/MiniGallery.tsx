'use client'

import { Fancybox as NativeFancybox } from '@fancyapps/ui'
import '@fancyapps/ui/dist/fancybox/fancybox.css'
import { FC, useEffect, useRef } from 'react'

interface MiniGalleryProps {
  images: { altText: string; sourceUrl: string }[]
}

const MiniGallery: FC<MiniGalleryProps> = ({ images }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

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

    // Очистка при размонтировании
    return () => {
      NativeFancybox.unbind(container)
      NativeFancybox.close()
    }
  }, [])

  if (!images || images.length === 0) {
    return null
  }

  return (
    <div className="py-8">
      <h3 className="cont mb-6 md:text-3xl uppercase font-medium">Галерея</h3>
      <div
        ref={containerRef}
        className="w-full overflow-x-auto pb-4 cont"
        style={{
          scrollbarWidth: 'none', // Для Firefox
          msOverflowStyle: 'none', // Для IE и Edge
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
                  src={img.sourceUrl}
                  alt={img.altText}
                  className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                  loading="lazy"
                />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MiniGallery
