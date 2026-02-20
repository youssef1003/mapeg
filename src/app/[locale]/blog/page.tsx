'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Link } from '@/navigation'
import styles from './page.module.css'

interface BlogPost {
  id: string
  titleAr: string
  titleEn: string
  excerptAr: string
  excerptEn: string
  authorAr: string
  authorEn: string
  categoryAr: string
  categoryEn: string
  featured: boolean
  createdAt: string
}

interface BlogCategory {
  nameAr: string
  nameEn: string
}

export default function BlogPage() {
  const params = useParams()
  const locale = params.locale as string || 'ar'
  const isArabic = locale === 'ar'

  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    fetchBlog()
  }, [])

  const fetchBlog = async () => {
    try {
      const response = await fetch('/api/blog', { cache: 'no-store' })
      if (response.ok) {
        const data = await response.json()
        setPosts(data.posts || [])
        setCategories(data.categories || [])
      }
    } catch (error) {
      console.error('Error fetching blog:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPosts = selectedCategory === 'all' 
    ? posts 
    : posts.filter(post => (isArabic ? post.categoryAr : post.categoryEn) === selectedCategory)

  const featuredPosts = filteredPosts.filter(post => post.featured)
  const regularPosts = filteredPosts.filter(post => !post.featured)

  if (loading) {
    return <div style={{ padding: '4rem', textAlign: 'center' }}>جاري التحميل...</div>
  }

  return (
    <div className={styles.blogPage}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className="container">
          <h1>
            {isArabic ? 'مدونة' : 'Blog'}{' '}
            <span className="gradient-text">{isArabic ? 'MapEg' : 'MapEg'}</span>
          </h1>
          <p>
            {isArabic 
              ? 'اكتشف أحدث النصائح والرؤى في عالم التوظيف والتطوير المهني'
              : 'Discover the latest tips and insights in recruitment and career development'}
          </p>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className={styles.categories}>
          <div className="container">
            <div className={styles.categoryTabs}>
              <button
                className={`${styles.categoryTab} ${selectedCategory === 'all' ? styles.active : ''}`}
                onClick={() => setSelectedCategory('all')}
              >
                {isArabic ? 'الكل' : 'All'}
              </button>
              {categories.map((category, index) => (
                <button
                  key={index}
                  className={`${styles.categoryTab} ${selectedCategory === (isArabic ? category.nameAr : category.nameEn) ? styles.active : ''}`}
                  onClick={() => setSelectedCategory(isArabic ? category.nameAr : category.nameEn)}
                >
                  {isArabic ? category.nameAr : category.nameEn}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className={styles.featured}>
          <div className="container">
            <h2 className={styles.sectionTitle}>
              {isArabic ? 'مقالات مميزة' : 'Featured Articles'}
            </h2>
            <div className={styles.featuredGrid}>
              {featuredPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.id}`} className={styles.featuredCard}>
                  <div className={styles.featuredImage}>
                    <div className={styles.imagePlaceholder}>
                      <span>📝</span>
                    </div>
                  </div>
                  <div className={styles.featuredContent}>
                    <span className={styles.postCategory}>
                      {isArabic ? post.categoryAr : post.categoryEn}
                    </span>
                    <h3>{isArabic ? post.titleAr : post.titleEn}</h3>
                    <p>{isArabic ? post.excerptAr : post.excerptEn}</p>
                    <div className={styles.postMeta}>
                      <span>{isArabic ? post.authorAr : post.authorEn}</span>
                      <span>•</span>
                      <span>{new Date(post.createdAt).toLocaleDateString(isArabic ? 'ar-EG' : 'en-US')}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Posts */}
      {regularPosts.length > 0 && (
        <section className={`section ${styles.allPosts}`}>
          <div className="container">
            <h2 className={styles.sectionTitle}>
              {isArabic ? 'أحدث المقالات' : 'Latest Articles'}
            </h2>
            <div className={styles.postsGrid}>
              {regularPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.id}`} className={styles.postCard}>
                  <div className={styles.postImage}>
                    <div className={styles.imagePlaceholder}>
                      <span>📄</span>
                    </div>
                  </div>
                  <div className={styles.postContent}>
                    <span className={styles.postCategory}>
                      {isArabic ? post.categoryAr : post.categoryEn}
                    </span>
                    <h3>{isArabic ? post.titleAr : post.titleEn}</h3>
                    <p>{isArabic ? post.excerptAr : post.excerptEn}</p>
                    <div className={styles.postMeta}>
                      <span>{isArabic ? post.authorAr : post.authorEn}</span>
                      <span>•</span>
                      <span>{new Date(post.createdAt).toLocaleDateString(isArabic ? 'ar-EG' : 'en-US')}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {posts.length === 0 && (
        <section className="section">
          <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
            <p>{isArabic ? 'لا توجد مقالات حتى الآن' : 'No articles yet'}</p>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className={styles.newsletter}>
        <div className="container">
          <div className={styles.newsletterContent}>
            <h2>{isArabic ? 'ابق على اطلاع' : 'Stay Updated'}</h2>
            <p>
              {isArabic 
                ? 'اشترك في نشرتنا البريدية لتصلك أحدث المقالات والنصائح'
                : 'Subscribe to our newsletter to receive the latest articles and tips'}
            </p>
            <form className={styles.newsletterForm}>
              <input
                type="email"
                placeholder={isArabic ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                className={styles.newsletterInput}
              />
              <button type="submit" className="btn btn-primary">
                {isArabic ? 'اشترك' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
