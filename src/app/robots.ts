import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://documind-ai.com'

  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/login', '/register'],
      disallow: ['/dashboard/', '/api/', '/auth/'], // No queremos indexar rutas privadas
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
