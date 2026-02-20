import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://mapeg.com'
  
  const routes = [
    '',
    '/about',
    '/jobs',
    '/blog',
    '/contact',
    '/auth/login',
    '/auth/register',
    '/candidates',
    '/employers',
  ]

  const locales = ['ar', 'en']
  
  const urls: MetadataRoute.Sitemap = []

  locales.forEach(locale => {
    routes.forEach(route => {
      urls.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' || route === '/jobs' ? 'daily' : 'weekly',
        priority: route === '' ? 1 : route === '/jobs' ? 0.9 : 0.8,
        alternates: {
          languages: {
            ar: `${baseUrl}/ar${route}`,
            en: `${baseUrl}/en${route}`,
          },
        },
      })
    })
  })

  return urls
}
