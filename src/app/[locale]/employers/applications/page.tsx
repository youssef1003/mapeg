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
  }
  candidate: {
    name: string
    email: string
    phone: string
    profession?: string
    yearsOfExperience?: number
  }
}

export default function EmployerApplicationsPage() {
  const t = useTranslations('Navigation')
  const params = useParams()
  const locale = params.locale as string || 'ar'
  
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/applications', {
        credentials: 'include'
      })

      if (response.status === 401) {
        window.location.href = `/${locale}/auth/login?redirect=/employers/applications`
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

  const filteredApplications = filter === 'all' 
    ? applications 
    : applications.filter(app => app.status === filter)

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

  const handleStatusUpdate = async (applicationId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        alert(locale === 'ar' ? '✅ تم تحديث الحالة بنجاح' : '✅ Status updated successfully')
        fetchApplications() // Refresh list
      } else {
        throw new Error('Failed to update status')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      alert(locale === 'ar' ? '❌ فشل تحديث الحالة' : '❌ Failed to update status')
    }
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
          <h1>{t('applications')}</h1>
          <p>{locale === 'ar' ? 'إدارة طلبات المرشحين على وظائفك' : 'Manage candidate applications'}</p>
        </div>

        {applications.length === 0 ? (
          <>
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📋</div>
              <h2>{locale === 'ar' ? 'لا توجد طلبات حتى الآن' : 'No applications yet'}</h2>
              <p>{locale === 'ar' ? 'بمجرد نشر وظائف، ستظهر طلبات المرشحين هنا' : 'Once you post jobs, candidate applications will appear here'}</p>
              <Link href="/employers/jobs/new" className="btn btn-primary">
                {locale === 'ar' ? 'نشر وظيفة جديدة' : 'Post a Job'}
              </Link>
            </div>

            <div className={styles.notice}>
              <p>💡 {locale === 'ar' ? 'نصيحة: قم بنشر وظائف جذابة مع وصف واضح للحصول على أفضل المرشحين' : 'Tip: Post attractive jobs with clear descriptions to get the best candidates'}</p>
              <Link href="/employers/jobs" className={styles.noticeLink}>
                {locale === 'ar' ? 'إدارة وظائفي →' : 'Manage My Jobs →'}
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

            <div className={styles.filters}>
              <button 
                className={filter === 'all' ? styles.filterActive : ''}
                onClick={() => setFilter('all')}
              >
                {locale === 'ar' ? 'الكل' : 'All'} ({applications.length})
              </button>
              <button 
                className={filter === 'pending' ? styles.filterActive : ''}
                onClick={() => setFilter('pending')}
              >
                {locale === 'ar' ? 'قيد المراجعة' : 'Pending'} ({applications.filter(a => a.status === 'pending').length})
              </button>
              <button 
                className={filter === 'accepted' ? styles.filterActive : ''}
                onClick={() => setFilter('accepted')}
              >
                {locale === 'ar' ? 'مقبول' : 'Accepted'} ({applications.filter(a => a.status === 'accepted').length})
              </button>
              <button 
                className={filter === 'rejected' ? styles.filterActive : ''}
                onClick={() => setFilter('rejected')}
              >
                {locale === 'ar' ? 'مرفوض' : 'Rejected'} ({applications.filter(a => a.status === 'rejected').length})
              </button>
            </div>

            <div className={styles.applicationsList}>
              {filteredApplications.map((application) => (
                <div key={application.id} className={styles.applicationCard}>
                  <div className={styles.applicationHeader}>
                    <div>
                      <h3>{application.candidate.name}</h3>
                      <p className={styles.candidateInfo}>
                        {application.candidate.profession && `${application.candidate.profession} • `}
                        {application.candidate.yearsOfExperience && `${application.candidate.yearsOfExperience} ${locale === 'ar' ? 'سنوات خبرة' : 'years exp'}`}
                      </p>
                      <p className={styles.jobTitle}>
                        {locale === 'ar' ? 'تقدم على:' : 'Applied for:'} <strong>{application.job.title}</strong>
                      </p>
                    </div>
                    {getStatusBadge(application.status)}
                  </div>
                  
                  <div className={styles.contactInfo}>
                    <span>📧 {application.candidate.email}</span>
                    <span>📱 {application.candidate.phone}</span>
                    <span>📅 {formatDate(application.createdAt)}</span>
                  </div>

                  {application.coverLetter && (
                    <div className={styles.coverLetter}>
                      <strong>{locale === 'ar' ? 'خطاب التقديم:' : 'Cover Letter:'}</strong>
                      <p>{application.coverLetter}</p>
                    </div>
                  )}

                  <div className={styles.actions}>
                    {application.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => handleStatusUpdate(application.id, 'accepted')}
                          className={styles.acceptBtn}
                        >
                          ✅ {locale === 'ar' ? 'قبول' : 'Accept'}
                        </button>
                        <button 
                          onClick={() => handleStatusUpdate(application.id, 'rejected')}
                          className={styles.rejectBtn}
                        >
                          ❌ {locale === 'ar' ? 'رفض' : 'Reject'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
