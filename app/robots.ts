import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/dashboard/', '/cart', '/login', '/register', '/forgot-password'],
    },
    sitemap: 'https://www.morzze.com/sitemap.xml',
  }
}
