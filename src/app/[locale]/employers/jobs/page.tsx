'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/navigation'
import { useParams, useRouter } from 'next/navigation'
import { getCountryLabel, getCategoryLabel, getJobTypeLabel } from '@/constants/taxonomy'
import styles from './page.module.css'

interface Job {
  id: string
  title: string
  company: string
  location: string
  country: string
  type: string
  category: string
  salary: string | null
  featured: boolean
  createdAt: string
  _count?: {
    applications: number
  }
}

export default function EmployerJobsPage() {
  const t = useTranslations('Navigation')
  const params = useParams()
  const router = useRouter()
  const locale = params.locale as string || 'ar'
  
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      // Check session first
      const sessionResponse = await fetch('/api/auth/check-session', {
        credentials: 'include'
      })
      
      const sessionData = await sessionResponse.json()
      
      if (!sessionData.isLoggedIn || sessionData.user?.role !== 'EMPLOYER') {
        window.location.href = `/${locale}/auth/login?redirect=/employers/jobs`
        return
      }

      // Fetch employer's jobs
      const response = await fetch('/api/employers/jobs', {
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Failed to fetch jobs')
      }

      const data = await response.json()
      setJobs(data.jobs || [])
    } catch (error) {
      console.error('Error fetching jobs:', error)
      setError(locale === 'ar' ? 'فشل تحميل الوظائف' : 'Failed to load jobs')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (jobId: string) => {
    if (!confirm(locale === 'ar' ? 'هل أنت متأكد من حذف هذه الوظيفة؟' : 'Are you sure you want to delete this job?')) {
      return
    }

    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (response.ok) {
        alert(locale === 'ar' ? '✅ تم حذف الوظيفة بنجاح' : '✅ Job deleted successfully')
        fetchJobs() // Refresh list
      } else {
        throw new Error('Failed to delete job')
      }
    } catch (error) {
      console.error('Error deleting job:', error)
      alert(locale === 'ar' ? '❌ فشل حذف الوظيفة' : '❌ Failed to delete job')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const totalApplications = jobs.reduce((sum, job) => sum + (job._count?.applications || 0), 0)

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
          <div>
            <h1>{t('myJobs')}</h1>
            <p>{locale === 'ar' ? 'إدارة الوظائف المنشورة' : 'Manage your posted jobs'}</p>
          </div>
          <Link href="/employers/jobs/new" className="btn btn-primary">
            + {locale === 'ar' ? 'نشر وظيفة' : 'Post Job'}
          </Link>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>📊</div>
            <div className={styles.statInfo}>
              <h3>{jobs.length}</h3>
              <p>{locale === 'ar' ? 'وظائف نشطة' : 'Active Jobs'}</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>👥</div>
            <div className={styles.statInfo}>
              <h3>{totalApplications}</h3>
              <p>{locale === 'ar' ? 'طلبات مستلمة' : 'Applications'}</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>⭐</div>
            <div className={styles.statInfo}>
              <h3>{jobs.filter(j => j.featured).length}</h3>
              <p>{locale === 'ar' ? 'وظائف مميزة' : 'Featured'}</p>
            </div>
          </div>
        </div>

        {jobs.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>💼</div>
            <h2>{locale === 'ar' ? 'لا توجد وظائف منشورة' : 'No jobs posted yet'}</h2>
            <p>{locale === 'ar' ? 'ابدأ بنشر أول وظيفة لك للعثور على أفضل المواهب' : 'Start posting your first job to find the best talents'}</p>
            <Link href="/employers/jobs/new" className="btn btn-primary">
              {locale === 'ar' ? 'نشر وظيفة جديدة' : 'Post a Job'}
            </Link>
          </div>
        ) : (
          <div className={styles.jobsList}>
            {jobs.map((job) => (
              <div key={job.id} className={styles.jobCard}>
                <div className={styles.jobHeader}>
                  <div>
                    <h3>{job.title}</h3>
                    <p className={styles.jobMeta}>
                      {job.location}, {getCountryLabel(job.country, locale as 'ar' | 'en')} • 
                      {' '}{getCategoryLabel(job.category, locale as 'ar' | 'en')} • 
                      {' '}{getJobTypeLabel(job.type, locale as 'ar' | 'en')}
                    </p>
                  </div>
                  {job.featured && (
                    <span className={styles.featuredBadge}>⭐ {locale === 'ar' ? 'مميزة' : 'Featured'}</span>
                  )}
                </div>

                <div className={styles.jobStats}>
                  <span>👥 {job._count?.applications || 0} {locale === 'ar' ? 'طلب' : 'applications'}</span>
                  <span>📅 {formatDate(job.createdAt)}</span>
                  {job.salary && <span>💰 {job.salary}</span>}
                </div>

                <div className={styles.jobActions}>
                  <Link href={`/jobs/${job.id}`} className={styles.actionBtn}>
                    👁️ {locale === 'ar' ? 'عرض' : 'View'}
                  </Link>
                  <Link href={`/admin/jobs/${job.id}`} className={styles.actionBtn}>
                    ✏️ {locale === 'ar' ? 'تعديل' : 'Edit'}
                  </Link>
                  <button 
                    onClick={() => handleDelete(job.id)}
                    className={`${styles.actionBtn} ${styles.deleteBtn}`}
                  >
                    🗑️ {locale === 'ar' ? 'حذف' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
