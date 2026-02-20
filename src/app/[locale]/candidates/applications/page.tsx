'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/navigation'
import { useParams } from 'next/navigation'
import styles from './page.module.css'

interface Application {
  id: string
  status: string
  createdAt: string
  coverLetter: string
  job: {
    title: string
    company: string
    location: string
    type: string
  }
}

export default function CandidateApplicationsPage() {
  const t = useTranslations('Navigation')
  const params = useParams()
  const locale = params.locale as string || 'ar'
  
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/applications', {
        credentials: 'include'
      })

      if (response.status === 401) {
        // Not logged in
        window.location.href = `/${locale}/auth/login?redirect=/candidates/applications`
        return
      }

      if (!response.ok) {
        throw new Error('Failed to fetch applications')
      }

      const data = await response.json()
      setApplications(data.applications || [])
    } catch (error) {
      console.error('Error fetching applications:', error)
      setError(locale === 'ar' ? 'فشل تحميل الطلبات' : 'Failed to load applications')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      pending: { 
        label: locale === 'ar' ? 'قيد المراجعة' : 'Pending', 
        color: '#f59e0b' 
      },
      reviewed: { 
        label: locale === 'ar' ? 'تمت المراجعة' : 'Reviewed', 
        color: '#3b82f6' 
      },
      accepted: { 
        label: locale === 'ar' ? 'مقبول' : 'Accepted', 
        color: '#10b981' 
      },
      rejected: { 
        label: locale === 'ar' ? 'مرفوض' : 'Rejected', 
        color: '#ef4444' 
      },
    }

    const statusInfo = statusMap[status] || statusMap.pending

    return (
      <span style={{
        padding: '0.25rem 0.75rem',
        borderRadius: '9999px',
        fontSize: '0.875rem',
        fontWeight: '500',
        backgroundColor: `${statusInfo.color}20`,
        color: statusInfo.color,
      }}>
        {statusInfo.label}
      </span>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          {locale === 'ar' ? 'جاري التحميل...' : 'Loading...'}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1>{t('myApplications')}</h1>
          <p>{locale === 'ar' ? 'تتبع حالة طلبات التوظيف الخاصة بك' : 'Track your job applications'}</p>
        </div>

        {applications.length === 0 ? (
          <>
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📄</div>
              <h2>{locale === 'ar' ? 'لا توجد طلبات حتى الآن' : 'No applications yet'}</h2>
              <p>{locale === 'ar' ? 'ابدأ بالتقديم على الوظائف المتاحة لتظهر طلباتك هنا' : 'Start applying to jobs to see your applications here'}</p>
              <Link href="/jobs" className="btn btn-primary">
                {locale === 'ar' ? 'تصفح الوظائف' : 'Browse Jobs'}
              </Link>
            </div>

            <div className={styles.notice}>
              <p>💡 {locale === 'ar' ? 'نصيحة: قم بتحديث ملفك الشخصي لزيادة فرص قبولك في الوظائف' : 'Tip: Update your profile to increase your chances'}</p>
              <Link href="/candidates/profile" className={styles.noticeLink}>
                {locale === 'ar' ? 'تحديث الملف الشخصي →' : 'Update Profile →'}
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className={styles.stats}>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{applications.length}</div>
                <div className={styles.statLabel}>{locale === 'ar' ? 'إجمالي الطلبات' : 'Total Applications'}</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>
                  {applications.filter(a => a.status === 'pending').length}
                </div>
                <div className={styles.statLabel}>{locale === 'ar' ? 'قيد المراجعة' : 'Pending'}</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>
                  {applications.filter(a => a.status === 'accepted').length}
                </div>
                <div className={styles.statLabel}>{locale === 'ar' ? 'مقبول' : 'Accepted'}</div>
              </div>
            </div>

            <div className={styles.applicationsList}>
              {applications.map((application) => (
                <div key={application.id} className={styles.applicationCard}>
                  <div className={styles.applicationHeader}>
                    <div>
                      <h3>{application.job.title}</h3>
                      <p className={styles.company}>
                        {application.job.company} • {application.job.location}
                      </p>
                    </div>
                    {getStatusBadge(application.status)}
                  </div>
                  
                  <div className={styles.applicationMeta}>
                    <span>📅 {formatDate(application.createdAt)}</span>
                    <span>💼 {application.job.type}</span>
                  </div>

                  {application.coverLetter && (
                    <div className={styles.coverLetter}>
                      <strong>{locale === 'ar' ? 'خطاب التقديم:' : 'Cover Letter:'}</strong>
                      <p>{application.coverLetter}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
