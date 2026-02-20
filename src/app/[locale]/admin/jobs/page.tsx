'use client'

import { useState, useEffect } from 'react'
import { Link } from '@/navigation'
import { useParams } from 'next/navigation'
import styles from '../admin.module.css'
import pageStyles from './page.module.css'

interface Job {
    id: string
    title: string
    company: string
    location: string
    type: string
    category: string
    featured: boolean
    createdAt: string
    applications?: number
}

export default function AdminJobsPage() {
    const params = useParams()
    const locale = params.locale || 'ar'
    const [jobs, setJobs] = useState<Job[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('')

    useEffect(() => {
        fetchJobs()
    }, [])

    const fetchJobs = async () => {
        try {
            const response = await fetch('/api/jobs')
            if (response.ok) {
                const data = await response.json()
                setJobs(data)
            }
        } catch (error) {
            console.error('Error fetching jobs:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (jobId: string, jobTitle: string) => {
        if (!confirm(`هل أنت متأكد من حذف الوظيفة:\n"${jobTitle}"؟\n\nهذا الإجراء لا يمكن التراجع عنه.`)) {
            return
        }

        try {
            const response = await fetch(`/api/jobs/${jobId}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                alert('✅ تم حذف الوظيفة بنجاح!')
                // Remove job from state
                setJobs(jobs.filter(job => job.id !== jobId))
            } else {
                throw new Error('Failed to delete job')
            }
        } catch (error) {
            console.error('Error deleting job:', error)
            alert('❌ حدث خطأ أثناء حذف الوظيفة. حاول مرة أخرى.')
        }
    }

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.title.includes(searchQuery) || job.company.includes(searchQuery)
        return matchesSearch
    })


    const getTypeLabel = (type: string) => {
        const typeMap: { [key: string]: string } = {
            'full-time': 'دوام كامل',
            'part-time': 'دوام جزئي',
            'remote': 'عن بُعد',
            'contract': 'عقد',
            'internship': 'تدريب',
        }
        return typeMap[type] || type
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
                    <h1>إدارة الوظائف</h1>
                    <p>عرض وإدارة جميع الوظائف المنشورة على المنصة</p>
                </div>
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <p>جاري تحميل الوظائف...</p>
                </div>
            </>
        )
    }

    return (
        <>
            <div className={styles.pageHeader}>
                <h1>إدارة الوظائف</h1>
                <p>عرض وإدارة جميع الوظائف المنشورة على المنصة</p>
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
                            placeholder="بحث في الوظائف..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                <Link href="/admin/jobs/new" className="btn btn-primary">
                    + إضافة وظيفة جديدة
                </Link>
            </div>

            {/* Stats */}
            <div className={pageStyles.statsRow}>
                <div className={pageStyles.statItem}>
                    <span className={pageStyles.statNumber}>{jobs.length}</span>
                    <span className={pageStyles.statText}>إجمالي الوظائف</span>
                </div>
                <div className={pageStyles.statItem}>
                    <span className={pageStyles.statNumber}>{jobs.filter(j => j.featured).length}</span>
                    <span className={pageStyles.statText}>وظائف مميزة</span>
                </div>
                <div className={pageStyles.statItem}>
                    <span className={pageStyles.statNumber}>{jobs.reduce((acc, j) => acc + (j.applications || 0), 0)}</span>
                    <span className={pageStyles.statText}>إجمالي الطلبات</span>
                </div>
            </div>

            {/* Jobs Table */}
            <div className={styles.card}>
                {jobs.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '1rem' }}>
                            لا توجد وظائف منشورة حالياً
                        </p>
                        <Link href="/admin/jobs/new" className="btn btn-primary">
                            + إضافة أول وظيفة
                        </Link>
                    </div>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>الوظيفة</th>
                                <th>الموقع</th>
                                <th>النوع</th>
                                <th>المجال</th>
                                <th>تاريخ النشر</th>
                                <th>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredJobs.map((job) => {
                                return (
                                    <tr key={job.id}>
                                        <td>
                                            <div className={styles.applicantInfo}>
                                                <h4>
                                                    {job.title}
                                                    {job.featured && <span className={pageStyles.featuredBadge}>⭐</span>}
                                                </h4>
                                                <p>{job.company}</p>
                                            </div>
                                        </td>
                                        <td>{job.location}</td>
                                        <td>{getTypeLabel(job.type)}</td>
                                        <td>{job.category || '-'}</td>
                                        <td>{formatDate(job.createdAt)}</td>
                                        <td>
                                            <div className={pageStyles.actions}>
                                                <Link
                                                    href={`/admin/jobs/${job.id}`}
                                                    className={pageStyles.actionBtn}
                                                    title="تعديل"
                                                >
                                                    ✏️
                                                </Link>
                                                <button
                                                    className={pageStyles.actionBtn}
                                                    title="حذف"
                                                    onClick={() => handleDelete(job.id, job.title)}
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    )
}
