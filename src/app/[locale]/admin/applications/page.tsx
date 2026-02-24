'use client'

import { useState, useEffect } from 'react'
import { useToast } from '@/contexts/ToastContext'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import styles from '../admin.module.css'
import pageStyles from './page.module.css'

interface Application {
  id: string
  candidateName: string
  candidateEmail: string
  jobTitle: string
  company: string
  status: string
  createdAt: string
  cvUrl?: string
}

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const toast = useToast()

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/applications', {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        // Transform data to match our interface
        const transformedData = data.applications.map((app: any) => ({
          id: app.id,
          candidateName: app.candidate?.name || 'غير متوفر',
          candidateEmail: app.candidate?.email || 'غير متوفر',
          jobTitle: app.job?.title || 'غير متوفر',
          company: app.job?.company || 'غير متوفر',
          status: app.status,
          createdAt: app.createdAt,
          cvUrl: app.cvUrl || null,
        }))
        setApplications(transformedData)
      }
    } catch (error) {
      console.error('Error fetching applications:', error)
      toast.error('فشل تحميل الطلبات')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (applicationId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        // Update local state
        setApplications(applications.map(app =>
          app.id === applicationId ? { ...app, status: newStatus } : app
        ))
        toast.success('تم تحديث حالة الطلب بنجاح!')
      } else {
        toast.error('فشل تحديث حالة الطلب')
      }
    } catch (error) {
      console.error('Error updating application:', error)
      toast.error('حدث خطأ أثناء التحديث')
    }
  }

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.company.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { label: string; className: string } } = {
      pending: { label: 'قيد المراجعة', className: pageStyles.statusPending },
      reviewed: { label: 'تمت المراجعة', className: pageStyles.statusReviewed },
      accepted: { label: 'مقبول', className: pageStyles.statusAccepted },
      rejected: { label: 'مرفوض', className: pageStyles.statusRejected },
    }
    const statusInfo = statusMap[status] || { label: status, className: '' }
    return <span className={`${pageStyles.statusBadge} ${statusInfo.className}`}>{statusInfo.label}</span>
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <>
        <div className={styles.pageHeader}>
          <h1>إدارة الطلبات</h1>
          <p>عرض ومتابعة جميع طلبات التوظيف</p>
        </div>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <LoadingSpinner size="large" />
          <p style={{ marginTop: '1rem' }}>جاري تحميل الطلبات...</p>
        </div>
      </>
    )
  }

  return (
    <>
      <div className={styles.pageHeader}>
        <h1>إدارة الطلبات</h1>
        <p>عرض ومتابعة جميع طلبات التوظيف</p>
      </div>

      {/* Filters Bar */}
      <div className={pageStyles.filtersBar}>
        <div className={pageStyles.searchInput}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="بحث في الطلبات..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={pageStyles.filterSelect}
        >
          <option value="all">جميع الحالات</option>
          <option value="pending">قيد المراجعة</option>
          <option value="reviewed">تمت المراجعة</option>
          <option value="accepted">مقبول</option>
          <option value="rejected">مرفوض</option>
        </select>
      </div>

      {/* Stats */}
      <div className={pageStyles.statsRow}>
        <div className={pageStyles.statItem}>
          <span className={pageStyles.statNumber}>{applications.length}</span>
          <span className={pageStyles.statText}>إجمالي الطلبات</span>
        </div>
        <div className={pageStyles.statItem}>
          <span className={pageStyles.statNumber}>{applications.filter(a => a.status === 'pending').length}</span>
          <span className={pageStyles.statText}>قيد المراجعة</span>
        </div>
        <div className={pageStyles.statItem}>
          <span className={pageStyles.statNumber}>{applications.filter(a => a.status === 'accepted').length}</span>
          <span className={pageStyles.statText}>مقبول</span>
        </div>
      </div>

      {/* Applications Table */}
      <div className={styles.card}>
        {applications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ fontSize: '1.2rem', color: '#666' }}>
              لا توجد طلبات توظيف حالياً
            </p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>المرشح</th>
                <th>الوظيفة</th>
                <th>الشركة</th>
                <th>تاريخ التقديم</th>
                <th>الحالة</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map((app) => (
                <tr key={app.id}>
                  <td>
                    <div className={styles.applicantInfo}>
                      <h4>{app.candidateName}</h4>
                      <p>{app.candidateEmail}</p>
                    </div>
                  </td>
                  <td>{app.jobTitle}</td>
                  <td>{app.company}</td>
                  <td>{formatDate(app.createdAt)}</td>
                  <td>{getStatusBadge(app.status)}</td>
                  <td>
                    <div className={pageStyles.actions}>
                      {app.cvUrl && (
                        <a
                          href={app.cvUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={pageStyles.actionBtn}
                          title="عرض السيرة الذاتية"
                        >
                          📄
                        </a>
                      )}
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        className={pageStyles.statusSelect}
                      >
                        <option value="pending">قيد المراجعة</option>
                        <option value="reviewed">تمت المراجعة</option>
                        <option value="accepted">مقبول</option>
                        <option value="rejected">مرفوض</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}
