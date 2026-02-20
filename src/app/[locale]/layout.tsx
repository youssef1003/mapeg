import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PageTracker from '@/components/analytics/PageTracker'
import '@/app/globals.css'
import type { Metadata } from 'next'

const locales = ['ar', 'en']

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params.locale || 'ar'
  
  const isArabic = locale === 'ar'
  
  return {
    title: isArabic ? 'MapEg - منصة التوظيف الرائدة في الشرق الأوسط' : 'MapEg - Leading Recruitment Platform in Middle East',
    description: isArabic 
      ? 'منصة MapEg للتوظيف - نربط المواهب بأفضل الفرص الوظيفية في مصر والشرق الأوسط. آلاف الوظائف في التكنولوجيا، الهندسة، التسويق والمزيد.'
      : 'MapEg Recruitment Platform - Connecting talents with the best job opportunities in Egypt and Middle East. Thousands of jobs in technology, engineering, marketing and more.',
    keywords: isArabic
      ? 'وظائف, توظيف, وظائف مصر, وظائف السعودية, وظائف الإمارات, فرص عمل, MapEg, تكنولوجيا, هندسة, تسويق'
      : 'jobs, recruitment, Egypt jobs, Saudi jobs, UAE jobs, career opportunities, MapEg, technology, engineering, marketing',
    authors: [{ name: 'MapEg' }],
    creator: 'MapEg',
    publisher: 'MapEg',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'ar' ? 'ar_EG' : 'en_US',
      url: `https://mapeg.com/${locale}`,
      siteName: 'MapEg',
      title: isArabic ? 'MapEg - منصة التوظيف الرائدة' : 'MapEg - Leading Recruitment Platform',
      description: isArabic
        ? 'نربط المواهب بأفضل الفرص الوظيفية في الشرق الأوسط'
        : 'Connecting talents with the best job opportunities in Middle East',
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'MapEg',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: isArabic ? 'MapEg - منصة التوظيف الرائدة' : 'MapEg - Leading Recruitment Platform',
      description: isArabic
        ? 'نربط المواهب بأفضل الفرص الوظيفية'
        : 'Connecting talents with the best opportunities',
      images: ['/og-image.jpg'],
    },
    alternates: {
      canonical: `https://mapeg.com/${locale}`,
      languages: {
        'ar': 'https://mapeg.com/ar',
        'en': 'https://mapeg.com/en',
      },
    },
    verification: {
      google: 'your-google-verification-code',
    },
  }
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  if (!locales.includes(locale)) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#1e40af" />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <PageTracker />
          <Header />
          <main style={{ minHeight: '60vh' }}>{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
