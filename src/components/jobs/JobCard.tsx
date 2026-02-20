import { Link } from '@/navigation'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { getCountryLabel, getCategoryLabel, getJobTypeLabel } from '@/constants/taxonomy'
import styles from './JobCard.module.css'

interface JobCardProps {
    id: string
    title: string
    company: string
    location: string
    country: string
    type: string
    salary?: string | null
    category: string
    featured?: boolean
    createdAt: string | Date
    titleEn?: string | null
}

export default function JobCard({
    id,
    title,
    company,
    location,
    country,
    type,
    salary,
    category,
    featured = false,
    createdAt,
    titleEn,
}: JobCardProps) {
    const params = useParams()
    const t = useTranslations('JobCard')
    const locale = params.locale as string || 'ar'
    
    // Use English translation if available and locale is English
    const displayTitle = locale === 'en' && titleEn ? titleEn : title
    
    const formatDate = (date: string | Date) => {
        const d = new Date(date)
        const now = new Date()
        const diff = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24))

        if (diff === 0) return t('today')
        if (diff === 1) return locale === 'ar' ? 'أمس' : 'Yesterday'
        if (diff < 7) return locale === 'ar' ? `منذ ${diff} أيام` : `${diff} days ago`
        if (diff < 30) {
            const weeks = Math.floor(diff / 7)
            return locale === 'ar' ? `منذ ${weeks} أسابيع` : `${weeks} weeks ago`
        }
        return d.toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric' })
    }

    // Get translated labels from taxonomy
    const countryLabel = getCountryLabel(country, locale as 'ar' | 'en')
    const categoryLabel = getCategoryLabel(category, locale as 'ar' | 'en')
    const typeLabel = getJobTypeLabel(type, locale as 'ar' | 'en')

    return (
        <Link href={`/jobs/${id}`} className={`${styles.card} ${featured ? styles.featured : ''}`}>
            {featured && <span className={styles.featuredBadge}>{t('featured')}</span>}

            <div className={styles.cardHeader}>
                <div className={styles.companyLogo}>
                    {company.charAt(0)}
                </div>
                <div className={styles.companyInfo}>
                    <h3 className={styles.title}>{displayTitle}</h3>
                    <p className={styles.company}>{company}</p>
                </div>
            </div>

            <div className={styles.cardBody}>
                <div className={styles.details}>
                    <span className={styles.detail}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                            <circle cx="12" cy="10" r="3" />
                        </svg>
                        {location}, {countryLabel}
                    </span>
                    <span className={styles.detail}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                            <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
                        </svg>
                        {typeLabel}
                    </span>
                </div>

                <div className={styles.tags}>
                    <span className={styles.tag}>{categoryLabel}</span>
                    {salary && <span className={styles.salary}>{salary}</span>}
                </div>
            </div>

            <div className={styles.cardFooter}>
                <span className={styles.date}>{formatDate(createdAt)}</span>
                <span className={styles.applyBtn}>{t('applyNow')}</span>
            </div>
        </Link>
    )
}
