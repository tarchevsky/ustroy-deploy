/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'panel.ustroy.art',
      },
    ],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    deviceSizes: [260, 520, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  // Оптимизация для ISR
  optimizeFonts: true,
  // Установка политики для ISR кеширования
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value:
              'public, max-age=60, s-maxage=3600, stale-while-revalidate=3600',
          },
        ],
      },
    ]
  },
}

export default nextConfig
