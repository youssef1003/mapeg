'use client'

import { useState, useEffect } from 'react'
import { Link } from '@/navigation'
import Image from 'next/image'
import { apiUrl } from '@/lib/api-url'
import styles from './page.module.css'
import JobCard from '@/components/jobs/JobCard'
import { useTranslations } from 'next-intl';

interface Job {
    id: string
    title: string
    company: string
    location: string
    country: string
    type: string
    salary: string | null
    category: string
    featured: boolean
    createdAt: string
    titleEn?: string | null
}

const testimonials = [
    {
        name: 'أحمد حسن',
        role: 'مطور برمجيات',
        company: 'تك كورب',
        content: 'ساعدتني MapEg في العثور على وظيفة أحلامي في أسبوعين فقط! كان الفريق داعمًا بشكل لا يصدق طوال العملية.',
        image: null,
        rating: 5,
    },
    {
        name: 'سارة الراشد',
        role: 'مديرة موارد بشرية',
        company: 'جلف إندستريز',
        content: 'كصاحب عمل، كانت MapEg شريكنا المفضل في التوظيف. إنهم يقدمون باستمرار مرشحين ذوي جودة عالية.',
        image: null,
        rating: 5,
    },
    {
        name: 'محمد خليل',
        role: 'مدير مشاريع',
        company: 'بيلد ماسترز',
        content: 'أفضل وكالة توظيف في المنطقة. محترفون وفعالون ويتجاوزون التوقعات دائمًا.',
        image: null,
        rating: 5,
    },
]

const topEmployers = [
    { name: 'تك كورب', industry: 'تكنولوجيا' },
    { name: 'جلف فاينانس', industry: 'بنوك' },
    { name: 'بيلد ماسترز', industry: 'بناء' },
    { name: 'كريتيف ستوديو', industry: 'تصميم' },
    { name: 'جلوبال ميديا', industry: 'إعلام' },
    { name: 'بيبول فيرست', industry: 'موارد بشرية' },
]

export default function Home() {
    const t = useTranslations();
    const [featuredJobs, setFeaturedJobs] = useState<Job[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchFeaturedJobs()
    }, [])

    const fetchFeaturedJobs = async () => {
        try {
            const response = await fetch(apiUrl('/jobs'))
            if (response.ok) {
                const data = await response.json()
                // Filter featured jobs and limit to 6
                const featured = data.filter((job: Job) => job.featured).slice(0, 6)
                setFeaturedJobs(featured)
            }
        } catch (error) {
            console.error('Error fetching jobs:', error)
        } finally {
            setLoading(false)
        }
    }

    // الإحصائيات
    const stats = [
        { value: '15,000+', label: t('Stats.placed') },
        { value: '2,500+', label: t('Stats.partners') },
        { value: '10+', label: t('Stats.countries') },
        { value: '98%', label: t('Stats.success') },
    ]

    const categories = [
        { icon: '💻', name: t('Categories.technology'), count: 450 },
        { icon: '📊', name: t('Categories.finance'), count: 320 },
        { icon: '🏗️', name: t('Categories.engineering'), count: 280 },
        { icon: '📢', name: t('Categories.marketing'), count: 195 },
        { icon: '🏥', name: t('Categories.healthcare'), count: 175 },
        { icon: '🎨', name: t('Categories.design'), count: 150 },
        { icon: '👥', name: t('Categories.hr'), count: 120 },
        { icon: '⚙️', name: t('Categories.operations'), count: 200 },
    ]

    return (
        <>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroBackground}>
                    <div className={styles.heroGradient}></div>
                    <div className={styles.heroPattern}></div>
                </div>
                <div className={`container ${styles.heroContent}`}>
                    <div className={`${styles.heroText} animate-slide-in`}>
                        <span className={styles.heroBadge}>{t('Hero.badge')}</span>
                        <h1 className={styles.heroTitle}>
                            {t('Hero.titlePrefix')} <span className="gradient-text">{t('Hero.titleGradient')}</span> {t('Hero.titleSuffix')}
                        </h1>
                        <p className={styles.heroSubtitle}>
                            {t('Hero.subtitle')}
                        </p>
                        <div className={styles.heroSearch}>
                            <div className={styles.searchBox}>
                                <input
                                    type="text"
                                    placeholder={t('Hero.searchPlaceholder')}
                                    className={styles.searchInput}
                                />
                                <select className={styles.searchSelect}>
                                    <option value="">{t('Hero.allCountries')}</option>
                                    <option value="egypt">{t('Hero.egypt')}</option>
                                    <option value="saudi-arabia">{t('Hero.saudiArabia')}</option>
                                    <option value="uae">{t('Hero.uae')}</option>
                                    <option value="qatar">{t('Hero.qatar')}</option>
                                    <option value="kuwait">{t('Hero.kuwait')}</option>
                                </select>
                                <button className={styles.searchBtn}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="11" cy="11" r="8" />
                                        <path d="M21 21l-4.35-4.35" />
                                    </svg>
                                    {t('Hero.searchBtn')}
                                </button>
                            </div>
                            <div className={styles.popularSearches}>
                                <span>{t('Hero.popular')}</span>
                                <Link href="/jobs?q=software">{t('Hero.softwareEngineer')}</Link>
                                <Link href="/jobs?q=marketing">{t('Hero.marketing')}</Link>
                                <Link href="/jobs?q=finance">{t('Hero.finance')}</Link>
                                <Link href="/jobs?q=engineering">{t('Hero.engineering')}</Link>
                            </div>
                        </div>
                    </div>
                    <div className={`${styles.heroVisual} animate-fade-in`}>
                        <div className="hover-lift" style={{ position: 'relative', width: '100%', height: '500px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-xl)' }}>
                            <Image
                                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                                alt="فريق مكتب حديث"
                                fill
                                style={{ objectFit: 'cover' }}
                                priority
                            />

                            {/* البطاقة العائمة 1 */}
                            <div className={`${styles.heroCard} animate-float`} style={{ position: 'absolute', bottom: '20px', left: '20px', right: 'auto', top: 'auto' }}>
                                <div className={styles.heroCardContent}>
                                    <div className={styles.heroCardIcon}>💼</div>
                                    <div className={styles.heroCardNumber}>250+</div>
                                    <div className={styles.heroCardLabel}>{t('Hero.newJobsToday')}</div>
                                </div>
                            </div>

                            {/* البطاقة العائمة 2 */}
                            <div className={`${styles.heroCard} ${styles.heroCardAlt} animate-float`} style={{ position: 'absolute', top: '40px', right: '-20px', left: 'auto', bottom: 'auto', animationDelay: '1.5s' }}>
                                <div className={styles.heroCardContent}>
                                    <div className={styles.heroCardIcon}>🌍</div>
                                    <div className={styles.heroCardNumber}>10+</div>
                                    <div className={styles.heroCardLabel}>{t('Hero.countries')}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className={styles.stats}>
                <div className="container">
                    <div className={styles.statsGrid}>
                        {stats.map((stat, index) => (
                            <div key={index} className={styles.statCard}>
                                <div className={styles.statValue}>{stat.value}</div>
                                <div className={styles.statLabel}>{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Jobs Section */}
            <section className={`section ${styles.featuredJobs}`}>
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <div>
                            <h2 className="section-title">{t('Featured.title')} <span className="gradient-text">{t('Featured.titleHighlight')}</span></h2>
                            <p className="section-subtitle">{t('Featured.subtitle')}</p>
                        </div>
                        <Link href="/jobs" className="btn btn-secondary">
                            {t('Featured.viewAll')} →
                        </Link>
                    </div>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '3rem' }}>
                            <p>جاري تحميل الوظائف المميزة...</p>
                        </div>
                    ) : featuredJobs.length > 0 ? (
                        <div className={styles.jobsGrid}>
                            {featuredJobs.map((job) => (
                                <JobCard key={job.id} {...job} />
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '3rem' }}>
                            <p>لا توجد وظائف مميزة حالياً</p>
                        </div>
                    )}
                </div>
            </section>


            {/* Categories Section */}
            <section className={`section ${styles.categories}`}>
                <div className="container">
                    <h2 className="section-title">{t('Categories.title')} <span className="gradient-text">{t('Categories.titleHighlight')}</span></h2>
                    <p className="section-subtitle">{t('Categories.subtitle')}</p>
                    <div className={styles.categoriesGrid}>
                        {categories.map((category, index) => (
                            <Link key={index} href={`/jobs?category=${category.name}`} className={styles.categoryCard}>
                                <span className={styles.categoryIcon}>{category.icon}</span>
                                <h3 className={styles.categoryName}>{category.name}</h3>
                                <p className={styles.categoryCount}>{category.count} {t('Categories.positions')}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Top Employers */}
            <section className={`section ${styles.employers}`}>
                <div className="container">
                    <h2 className="section-title">{t('Employers.title')} <span className="gradient-text">{t('Employers.titleHighlight')}</span></h2>
                    <p className="section-subtitle">{t('Employers.subtitle')}</p>
                    <div className={styles.employersGrid}>
                        {topEmployers.map((employer, index) => (
                            <div key={index} className={styles.employerCard}>
                                <div className={styles.employerLogo}>{employer.name.charAt(0)}</div>
                                <div className={styles.employerInfo}>
                                    <h4>{employer.name}</h4>
                                    <p>{employer.industry}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className={`section ${styles.testimonials}`}>
                <div className="container">
                    <h2 className="section-title">{t('Testimonials.title')} <span className="gradient-text">{t('Testimonials.titleHighlight')}</span></h2>
                    <p className="section-subtitle">{t('Testimonials.subtitle')}</p>
                    <div className={styles.testimonialsGrid}>
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className={styles.testimonialCard}>
                                <div className={styles.testimonialRating}>
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <span key={i}>⭐</span>
                                    ))}
                                </div>
                                <p className={styles.testimonialContent}>&quot;{testimonial.content}&quot;</p>
                                <div className={styles.testimonialAuthor}>
                                    <div className={styles.testimonialAvatar}>
                                        {testimonial.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4>{testimonial.name}</h4>
                                        <p>{testimonial.role} {t('Testimonials.at')} {testimonial.company}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className={styles.cta}>
                <div className="container">
                    <div className={styles.ctaContent}>
                        <h2>{t('CTA.title')}</h2>
                        <p>{t('CTA.subtitle')}</p>
                    </div>
                </div>
            </section>
        </>
    )
}
