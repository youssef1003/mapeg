'use client'

import { useState, useEffect } from 'react'
import { Link, useRouter } from '@/navigation'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { getCountryLabel, getCategoryLabel, getJobTypeLabel } from '@/constants/taxonomy'
import styles from './page.module.css'

interface Job {
    id: string
    title: string
    titleEn?: string | null
    company: string
    location: string
    country: string
    type: string
    salary?: string | null
    salaryMin?: string | null
    salaryMax?: string | null
    category: string
    description: string
    descriptionEn?: string | null
    requirements: string
    requirementsEn?: string | null
    featured: boolean
    createdAt: string
}

export default function JobDetailPage() {
    const params = useParams()
    const router = useRouter()
    const t = useTranslations()
    const jobId = params.id as string
    const locale = params.locale as string || 'ar'

    const [job, setJob] = useState<Job | null>(null)
    const [loading, setLoading] = useState(true)
    const [showApplyModal, setShowApplyModal] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        coverLetter: '',
    })

    useEffect(() => {
        fetchJob()
    }, [jobId])

    const fetchJob = async () => {
        try {
            const response = await fetch(`/api/jobs/${jobId}`)
            if (response.ok) {
                const data = await response.json()
                setJob(data)
            } else {
                console.error('Job not found')
            }
        } catch (error) {
            console.error('Error fetching job:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        try {
            // Check if user is logged in first
            const sessionResponse = await fetch('/api/auth/check-session', {
                credentials: 'include'
            })
            
            const sessionData = await sessionResponse.json()
            
            if (!sessionData.isLoggedIn) {
                alert(locale === 'ar' 
                    ? '⚠️ يجب تسجيل الدخول أولاً للتقديم على الوظيفة'
                    : '⚠️ Please login first to apply for this job')
                // Redirect to login
                window.location.href = `/${locale}/auth/login?redirect=/jobs/${job?.id}`
                return
            }
            
            if (sessionData.user?.role !== 'CANDIDATE') {
                alert(locale === 'ar'
                    ? '⚠️ يجب التسجيل كمرشح للتقديم على الوظائف'
                    : '⚠️ You must register as a candidate to apply for jobs')
                window.location.href = `/${locale}/auth/register`
                return
            }
            
            // Submit application (only jobId and coverLetter)
            const response = await fetch('/api/applications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    jobId: job?.id,
                    coverLetter: formData.coverLetter,
                }),
            })

            const data = await response.json()

            if (response.ok) {
                alert(locale === 'ar' ? '✅ تم تقديم الطلب بنجاح!' : '✅ Application submitted successfully!')
                setShowApplyModal(false)
                setFormData({ name: '', email: '', phone: '', coverLetter: '' })
            } else {
                throw new Error(data.error || 'Failed to submit application')
            }
        } catch (error) {
            console.error('Error submitting application:', error)
            const errorMessage = error instanceof Error ? error.message : 'An error occurred'
            alert(locale === 'ar' 
                ? `❌ ${errorMessage === 'You have already applied for this job' ? 'لقد قدمت بالفعل على هذه الوظيفة' : 'حدث خطأ. حاول مرة أخرى.'}`
                : `❌ ${errorMessage}`)
        }
    }

    if (loading) {
        return (
            <div className={styles.jobDetailPage}>
                <div className="container" style={{ textAlign: 'center', padding: '3rem' }}>
                    <p>{locale === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
                </div>
            </div>
        )
    }

    if (!job) {
        return (
            <div className={styles.jobDetailPage}>
                <div className="container" style={{ textAlign: 'center', padding: '3rem' }}>
                    <h2>{locale === 'ar' ? 'الوظيفة غير موجودة' : 'Job not found'}</h2>
                    <Link href="/jobs" className="btn btn-primary">
                        {locale === 'ar' ? 'العودة للوظائف' : 'Back to Jobs'}
                    </Link>
                </div>
            </div>
        )
    }

    // Use translations based on locale
    const displayTitle = locale === 'en' && job.titleEn ? job.titleEn : job.title
    const displayDescription = locale === 'en' && job.descriptionEn ? job.descriptionEn : job.description
    const displayRequirements = locale === 'en' && job.requirementsEn ? job.requirementsEn : job.requirements
    
    // Get translated labels from taxonomy
    const countryLabel = getCountryLabel(job.country, locale as 'ar' | 'en')
    const categoryLabel = getCategoryLabel(job.category, locale as 'ar' | 'en')
    const typeLabel = getJobTypeLabel(job.type, locale as 'ar' | 'en')
    
    // Format salary
    const displaySalary = job.salary || 
                         (job.salaryMin && job.salaryMax ? `${job.salaryMin} - ${job.salaryMax}` : null)

    return (
        <div className={styles.jobDetailPage}>
            {/* Breadcrumb */}
            <div className={styles.breadcrumb}>
                <div className="container">
                    <Link href="/jobs">
                        {locale === 'ar' ? '→ العودة للوظائف' : '← Back to Jobs'}
                    </Link>
                </div>
            </div>

            <div className="container">
                <div className={styles.jobDetailGrid}>
                    {/* Main Content */}
                    <div className={styles.mainContent}>
                        {/* Header */}
                        <div className={styles.jobHeader}>
                            <div className={styles.companyLogo}>
                                {job.company.charAt(0)}
                            </div>
                            <div className={styles.jobInfo}>
                                <h1>{displayTitle}</h1>
                                <p className={styles.company}>{job.company}</p>
                                <div className={styles.jobMeta}>
                                    <span>📍 {job.location}, {countryLabel}</span>
                                    <span>💼 {typeLabel}</span>
                                    {displaySalary && <span>💰 {displaySalary}</span>}
                                    <span>🏷️ {categoryLabel}</span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <section className={styles.section}>
                            <h2>{locale === 'ar' ? 'وصف الوظيفة' : 'Job Description'}</h2>
                            <div className={styles.content}>
                                {displayDescription.split('\n').map((paragraph, index) => (
                                    paragraph.trim() && <p key={index}>{paragraph}</p>
                                ))}
                            </div>
                        </section>

                        {/* Requirements */}
                        <section className={styles.section}>
                            <h2>{locale === 'ar' ? 'المتطلبات' : 'Requirements'}</h2>
                            <div className={styles.content}>
                                {displayRequirements.split('\n').map((line, index) => (
                                    line.trim() && <p key={index}>{line}</p>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className={styles.sidebar}>
                        {/* Apply Card */}
                        <div className={styles.applyCard}>
                            <h3>{locale === 'ar' ? 'مهتم بهذه الوظيفة؟' : 'Interested in this job?'}</h3>
                            <button
                                className="btn btn-primary"
                                style={{ width: '100%' }}
                                onClick={() => setShowApplyModal(true)}
                            >
                                {locale === 'ar' ? 'قدم الآن' : 'Apply Now'}
                            </button>
                            <p className={styles.applyNote}>
                                {locale === 'ar' 
                                    ? 'تأكد من تحديث ملفك الشخصي قبل التقديم'
                                    : 'Make sure your profile is up to date before applying'}
                            </p>
                        </div>

                        {/* Company Card */}
                        <div className={styles.companyCard}>
                            <div className={styles.companyHeader}>
                                <div className={styles.companyLogoSmall}>
                                    {job.company.charAt(0)}
                                </div>
                                <div>
                                    <h4>{job.company}</h4>
                                    <p>{categoryLabel}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Apply Modal */}
            {showApplyModal && (
                <div className={styles.modal}>
                    <div className={styles.modalBackdrop} onClick={() => setShowApplyModal(false)} />
                    <div className={styles.modalContent}>
                        <button className={styles.modalClose} onClick={() => setShowApplyModal(false)}>
                            ×
                        </button>
                        <h2>
                            {locale === 'ar' ? `التقديم على ${displayTitle}` : `Apply for ${displayTitle}`}
                        </h2>
                        <p className={styles.modalSubtitle}>
                            {locale === 'ar' ? `في ${job.company}` : `at ${job.company}`}
                        </p>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">
                                    {locale === 'ar' ? 'خطاب التقديم' : 'Cover Letter'}
                                </label>
                                <textarea
                                    className="form-input form-textarea"
                                    value={formData.coverLetter}
                                    onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                                    placeholder={locale === 'ar' 
                                        ? 'أخبرنا لماذا أنت مناسب لهذه الوظيفة...'
                                        : 'Tell us why you\'re a great fit for this role...'}
                                    rows={6}
                                />
                                <small style={{ color: '#666', fontSize: '0.85rem', marginTop: '0.5rem', display: 'block' }}>
                                    {locale === 'ar'
                                        ? 'ℹ️ سيتم استخدام بياناتك من ملفك الشخصي'
                                        : 'ℹ️ Your profile information will be used'}
                                </small>
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                                {locale === 'ar' ? 'إرسال الطلب' : 'Submit Application'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
