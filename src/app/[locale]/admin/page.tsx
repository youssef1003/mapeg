'use client'

import { useState, useEffect } from 'react'
import { Link } from '@/navigation'
import styles from './admin.module.css'

interface Stats {
    jobsCount: number
    candidatesCount: number
    employersCount: number
    applicationsCount: number
}

interface AnalyticsStats {
    visitorsToday: number
    visitorsLast30Days: number
    uniqueVisitorsToday: number
    uniqueVisitorsLast30Days: number
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null)
    const [analytics, setAnalytics] = useState<AnalyticsStats | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchStats()
        fetchAnalytics()
    }, [])

    const fetchStats = async () => {
        try {
            const response = await fetch('/api/admin/stats', { cache: 'no-store' })
            if (response.ok) {
                const data = await response.json()
                setStats(data)
            }
        } catch (error) {
            console.error('Error fetching stats:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchAnalytics = async () => {
        try {
            const response = await fetch('/api/analytics/stats', { cache: 'no-store' })
            if (response.ok) {
                const data = await response.json()
                setAnalytics(data)
            }
        } catch (error) {
            console.error('Error fetching analytics:', error)
        }
    }

    const statsCards = [
        {
            icon: '💼',
            iconClass: 'blue',
            value: stats?.jobsCount ?? 0,
            label: 'وظائف نشطة',
        },
        {
            icon: '👥',
            iconClass: 'green',
            value: stats?.candidatesCount ?? 0,
            label: 'إجمالي المرشحين',
        },
        {
            icon: '🏢',
            iconClass: 'purple',
            value: stats?.employersCount ?? 0,
            label: 'أصحاب العمل',
        },
        {
            icon: '📄',
            iconClass: 'orange',
            value: stats?.applicationsCount ?? 0,
            label: 'طلبات جديدة',
        },
        {
            icon: '👁️',
            iconClass: 'blue',
            value: analytics?.visitorsToday ?? 0,
            label: 'زوار اليوم',
        },
        {
            icon: '📊',
            iconClass: 'green',
            value: analytics?.visitorsLast30Days ?? 0,
            label: 'زوار آخر 30 يوم',
        },
    ]

    return (
        <>
            <div className={styles.pageHeader}>
                <h1>لوحة التحكم</h1>
                <p>مرحبًا بك مرة أخرى! إليك نظرة عامة على نشاط المنصة.</p>
            </div>

            {/* Stats Grid */}
            <div className={styles.statsGrid}>
                {loading ? (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
                        جاري تحميل الإحصائيات...
                    </div>
                ) : (
                    statsCards.map((stat, index) => (
                        <div key={index} className={styles.statCard}>
                            <div className={styles.statHeader}>
                                <div className={`${styles.statIcon} ${styles[stat.iconClass]}`}>
                                    {stat.icon}
                                </div>
                            </div>
                            <div className={styles.statValue}>{stat.value.toLocaleString('ar-EG')}</div>
                            <div className={styles.statLabel}>{stat.label}</div>
                        </div>
                    ))
                )}
            </div>

            {/* Content Grid */}
            <div className={styles.contentGrid}>
                {/* Quick Actions */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h3>إجراءات سريعة</h3>
                    </div>
                    <div className={styles.cardBody}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <Link href="/admin/jobs/new" className="btn btn-primary" style={{ textAlign: 'center' }}>
                                + إضافة وظيفة جديدة
                            </Link>
                            <Link href="/admin/jobs" className="btn btn-secondary" style={{ textAlign: 'center' }}>
                                إدارة الوظائف
                            </Link>
                            <Link href="/admin/candidates" className="btn btn-secondary" style={{ textAlign: 'center' }}>
                                عرض المرشحين
                            </Link>
                            <Link href="/admin/settings" className="btn btn-secondary" style={{ textAlign: 'center' }}>
                                الإعدادات
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Summary */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h3>ملخص المنصة</h3>
                    </div>
                    <div className={styles.cardBody}>
                        {loading ? (
                            <p>جاري التحميل...</p>
                        ) : (
                            <div className={styles.activityList}>
                                <div className={styles.activityItem}>
                                    <div className={`${styles.activityIcon} ${styles.blue}`}>
                                        💼
                                    </div>
                                    <div className={styles.activityContent}>
                                        <h4>الوظائف المنشورة</h4>
                                        <p>{stats?.jobsCount ?? 0} وظيفة متاحة حالياً</p>
                                    </div>
                                </div>
                                <div className={styles.activityItem}>
                                    <div className={`${styles.activityIcon} ${styles.green}`}>
                                        👥
                                    </div>
                                    <div className={styles.activityContent}>
                                        <h4>المرشحين المسجلين</h4>
                                        <p>{stats?.candidatesCount ?? 0} مرشح في قاعدة البيانات</p>
                                    </div>
                                </div>
                                <div className={styles.activityItem}>
                                    <div className={`${styles.activityIcon} ${styles.purple}`}>
                                        🏢
                                    </div>
                                    <div className={styles.activityContent}>
                                        <h4>الشركات الشريكة</h4>
                                        <p>{stats?.employersCount ?? 0} شركة مسجلة</p>
                                    </div>
                                </div>
                                <div className={styles.activityItem}>
                                    <div className={`${styles.activityIcon} ${styles.orange}`}>
                                        📄
                                    </div>
                                    <div className={styles.activityContent}>
                                        <h4>الطلبات المقدمة</h4>
                                        <p>{stats?.applicationsCount ?? 0} طلب توظيف</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
