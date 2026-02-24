'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { apiUrl } from '@/lib/api-url'
import JobCard from '@/components/jobs/JobCard'
import styles from './page.module.css'
import { useTranslations } from 'next-intl'
import { COUNTRIES, CATEGORIES, JOB_TYPES } from '@/constants/taxonomy'

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

export default function JobsPage() {
    const t = useTranslations('Jobs')
    const params = useParams()
    const locale = (params.locale as string) || 'ar'
    const [jobs, setJobs] = useState<Job[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCountry, setSelectedCountry] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('')
    const [selectedType, setSelectedType] = useState('')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

    useEffect(() => {
        fetchJobs()
    }, [])

    const fetchJobs = async () => {
        try {
            console.log('[Jobs Page] Fetching jobs from API...')
            const response = await fetch(apiUrl('/jobs'), {
                credentials: 'include'
            })
            console.log('[Jobs Page] Response status:', response.status)
            
            if (response.ok) {
                const data = await response.json()
                console.log('[Jobs Page] Jobs received:', data.length, 'jobs')
                setJobs(data)
            } else {
                console.error('[Jobs Page] Failed to fetch jobs:', response.status)
            }
        } catch (error) {
            console.error('[Jobs Page] Error fetching jobs:', error)
        } finally {
            setLoading(false)
        }
    }

    const filteredJobs = jobs.filter(job => {
        const matchesSearch =
            job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.company.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCountry = !selectedCountry || job.country === selectedCountry
        const matchesCategory = !selectedCategory || job.category === selectedCategory
        const matchesType = !selectedType || job.type === selectedType

        return matchesSearch && matchesCountry && matchesCategory && matchesType
    })

    const clearFilters = () => {
        setSearchQuery('')
        setSelectedCountry('')
        setSelectedCategory('')
        setSelectedType('')
    }

    if (loading) {
        return (
            <div className={styles.jobsPage}>
                <section className={styles.pageHeader}>
                    <div className="container">
                        <h1>{t('title')} <span className="gradient-text">{t('titleHighlight')}</span></h1>
                        <p>جاري تحميل الوظائف...</p>
                    </div>
                </section>
                <section className={styles.results}>
                    <div className="container">
                        <div style={{ textAlign: 'center', padding: '3rem' }}>
                            <div className="loading-spinner"></div>
                            <p>جاري التحميل...</p>
                        </div>
                    </div>
                </section>
            </div>
        )
    }

    return (
        <div className={styles.jobsPage}>
            {/* Page Header */}
            <section className={styles.pageHeader}>
                <div className="container">
                    <h1>{t('title')} <span className="gradient-text">{t('titleHighlight')}</span></h1>
                    <p>استكشف أكثر من {jobs.length} فرصة في مصر والعالم العربي</p>
                </div>
            </section>

            {/* Search & Filters */}
            <section className={styles.filtersSection}>
                <div className="container">
                    <div className={styles.searchBar}>
                        <div className={styles.searchInputWrapper}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" />
                                <path d="M21 21l-4.35-4.35" />
                            </svg>
                            <input
                                type="text"
                                placeholder={t('searchPlaceholder')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={styles.searchInput}
                            />
                        </div>
                    </div>

                    <div className={styles.filters}>
                        <select
                            value={selectedCountry}
                            onChange={(e) => setSelectedCountry(e.target.value)}
                            className={styles.filterSelect}
                        >
                            <option value="">{t('allCountries')}</option>
                            {COUNTRIES.map(country => (
                                <option key={country.value} value={country.value}>
                                    {locale === 'ar' ? country.ar : country.en}
                                </option>
                            ))}
                        </select>

                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className={styles.filterSelect}
                        >
                            <option value="">{t('allCategories')}</option>
                            {CATEGORIES.map(category => (
                                <option key={category.value} value={category.value}>
                                    {locale === 'ar' ? category.ar : category.en}
                                </option>
                            ))}
                        </select>

                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className={styles.filterSelect}
                        >
                            <option value="">{t('allJobTypes')}</option>
                            {JOB_TYPES.map(type => (
                                <option key={type.value} value={type.value}>
                                    {locale === 'ar' ? type.ar : type.en}
                                </option>
                            ))}
                        </select>

                        <button onClick={clearFilters} className={styles.clearBtn}>
                            {t('clearFilters')}
                        </button>

                        <div className={styles.viewToggle}>
                            <button
                                className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.active : ''}`}
                                onClick={() => setViewMode('grid')}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <rect x="3" y="3" width="7" height="7" />
                                    <rect x="14" y="3" width="7" height="7" />
                                    <rect x="3" y="14" width="7" height="7" />
                                    <rect x="14" y="14" width="7" height="7" />
                                </svg>
                            </button>
                            <button
                                className={`${styles.viewBtn} ${viewMode === 'list' ? styles.active : ''}`}
                                onClick={() => setViewMode('list')}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <rect x="3" y="4" width="18" height="4" />
                                    <rect x="3" y="10" width="18" height="4" />
                                    <rect x="3" y="16" width="18" height="4" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Results */}
            <section className={styles.results}>
                <div className="container">
                    <div className={styles.resultsHeader}>
                        <p className={styles.resultsCount}>
                            {t('showing')} <strong>{filteredJobs.length}</strong> {t('jobs')}
                        </p>
                        <select className={styles.sortSelect}>
                            <option value="newest">{t('newestFirst')}</option>
                            <option value="oldest">{t('oldestFirst')}</option>
                            <option value="salary-high">{t('highestSalary')}</option>
                            <option value="salary-low">{t('lowestSalary')}</option>
                        </select>
                    </div>

                    {filteredJobs.length > 0 ? (
                        <div className={`${styles.jobsGrid} ${viewMode === 'list' ? styles.listView : ''}`}>
                            {filteredJobs.map(job => (
                                <JobCard key={job.id} {...job} createdAt={new Date(job.createdAt)} />
                            ))}
                        </div>
                    ) : (
                        <div className={styles.noResults}>
                            <div className={styles.noResultsIcon}>🔍</div>
                            <h3>{t('noJobsFound')}</h3>
                            <p>{jobs.length === 0 ? 'لا توجد وظائف منشورة حالياً. يمكن للمسؤول إضافة وظائف من لوحة التحكم.' : t('tryAdjusting')}</p>
                            {jobs.length > 0 && (
                                <button onClick={clearFilters} className="btn btn-primary">
                                    {t('clearAllFilters')}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}
