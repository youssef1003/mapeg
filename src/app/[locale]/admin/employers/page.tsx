'use client'

import { useState, useEffect } from 'react'
import { Link } from '@/navigation'
import styles from '../admin.module.css'
import pageStyles from '../jobs/page.module.css'

interface Employer {
  id: string
  companyName: string
  email: string
  phone: string
  industry: string
  country: string
  website?: string
  description?: string
  createdAt: string
  _count: {
    jobs: number
  }
}

export default function AdminEmployersPage() {
  const [employers, setEmployers] = useState<Employer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchEmployers()
  }, [])

  const fetchEmployers = async () => {
    try {
      const response = await fetch('/api/employers', { cache: 'no-store' })
      if (response.ok) {
        const data = await response.json()
        setEmployers(data)
      }
    } catch (error) {
      console.error('Error fetching employers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف "${name}"؟\n\nهذا الإجراء لا يمكن التراجع عنه.`)) {
      return
    }

    try {
      const response = await fetch(`/api/employers/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        alert('✅ تم حذف الشركة بنجاح!')
        setEmployers(employers.filter(e => e.id !== id))
      } else {
        const data = await response.json()
        alert(`❌ ${data.error || 'فشل حذف الشركة'}`)
      }
    } catch (error) {
      console.error('Error deleting employer:', error)
      alert('❌ حدث خطأ أثناء حذف الشركة')
    }
  }

  const filteredEmployers = employers.filter(employer => {
    const matchesSearch = 
      employer.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employer.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employer.email.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  if (loading) {
    return (
      <>
        <div className={styles.pageHeader}>
          <h1>إدارة أصحاب العمل</h1>
          <p>جاري تحميل البيانات...</p>
        </div>
      </>
    )
  }

  return (
    <>
      <div className={styles.pageHeader}>
        <h1>إدارة أصحاب العمل</h1>
        <p>عرض وإدارة جميع الشركات المسجلة على المنصة</p>
      </div>

      {/* Actions Bar */}
      <div className={pageStyles.actionsBar}>
        <div className={pageStyles.filters}>
          <div className={pageStyles.searchInput}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="بحث في أصحاب العمل..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <Link href="/admin/employers/new" className="btn btn-primary">
          + إضافة شركة جديدة
        </Link>
      </div>

      {/* Stats */}
      <div className={pageStyles.statsRow}>
        <div className={pageStyles.statItem}>
          <span className={pageStyles.statNumber}>{employers.length}</span>
          <span className={pageStyles.statText}>إجمالي الشركات</span>
        </div>
        <div className={pageStyles.statItem}>
          <span className={pageStyles.statNumber}>{employers.reduce((acc, e) => acc + e._count.jobs, 0)}</span>
          <span className={pageStyles.statText}>وظائف نشطة</span>
        </div>
      </div>

      {/* Employers Table */}
      <div className={styles.card}>
        {employers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '1rem' }}>
              لا توجد شركات مسجلة حالياً
            </p>
            <Link href="/admin/employers/new" className="btn btn-primary">
              + إضافة أول شركة
            </Link>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>الشركة</th>
                <th>المجال</th>
                <th>الدولة</th>
                <th>الوظائف</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployers.map((employer) => (
                <tr key={employer.id}>
                  <td>
                    <div className={styles.applicantInfo}>
                      <h4>{employer.companyName}</h4>
                      <p>{employer.email}</p>
                    </div>
                  </td>
                  <td>{employer.industry}</td>
                  <td>{employer.country}</td>
                  <td>{employer._count.jobs}</td>
                  <td>
                    <div className={pageStyles.actions}>
                      <Link
                        href={`/admin/employers/${employer.id}`}
                        className={pageStyles.actionBtn}
                        title="تعديل"
                      >
                        ✏️
                      </Link>
                      <button
                        className={pageStyles.actionBtn}
                        title="حذف"
                        onClick={() => handleDelete(employer.id, employer.companyName)}
                      >
                        🗑️
                      </button>
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
