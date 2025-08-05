import React from 'react'

interface MiniGalleryProps {
  images: { altText: string; sourceUrl: string }[]
}

const MiniGallery: React.FC<MiniGalleryProps> = ({ images }) => (
  <div className="py-8">
    <h3 className="cont mb-6 md:text-3xl uppercase font-medium">Галерея</h3>
    <div className="carousel carousel-center gap-4 w-full cont">
      {images.map((img, i) => (
        <div
          key={i}
          className="carousel-item rounded-box overflow-hidden bg-gray-200"
          style={{ width: 260, height: 180 }}
        >
          <img
            src={img.sourceUrl}
            alt={img.altText}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  </div>
)

export default MiniGallery
