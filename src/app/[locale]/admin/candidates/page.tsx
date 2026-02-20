'use client'

import { useState, useEffect } from 'react'
import styles from '../admin.module.css'
import pageStyles from '../jobs/page.module.css'

interface Candidate {
    id: string
    name: string
    email: string
    phone: string
    country: string
    experience: string
    skills: string
    createdAt: string
}

export default function AdminCandidatesPage() {
    const [candidates, setCandidates] = useState<Candidate[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        fetchCandidates()
    }, [])

    const fetchCandidates = async () => {
        try {
            const response = await fetch('/api/candidates', { cache: 'no-store' })
            if (response.ok) {
                const data = await response.json()
                setCandidates(data)
            }
        } catch (error) {
            console.error('Error fetching candidates:', error)
        } finally {
            setLoading(false)
        }
    }

    const filteredCandidates = candidates.filter(candidate => {
        const matchesSearch = candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            candidate.email.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesSearch
    })

    if (loading) {
        return (
            <>
                <div className={styles.pageHeader}>
                    <h1>إدارة المرشحين</h1>
                    <p>عرض وإدارة جميع المرشحين المسجلين على المنصة</p>
                </div>
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <p>جاري تحميل المرشحين...</p>
                </div>
            </>
        )
    }

    return (
        <>
            <div className={styles.pageHeader}>
                <h1>إدارة المرشحين</h1>
                <p>عرض وإدارة جميع المرشحين المسجلين على المنصة</p>
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
                            placeholder="بحث في المرشحين..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className={pageStyles.statsRow}>
                <div className={pageStyles.statItem}>
                    <span className={pageStyles.statNumber}>{candidates.length}</span>
                    <span className={pageStyles.statText}>إجمالي المرشحين</span>
                </div>
            </div>

            {/* Empty State or Candidates Grid */}
            {candidates.length === 0 ? (
                <div className={styles.card}>
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</p>
                        <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '0.5rem' }}>
                            لا يوجد مرشحين مسجلين حالياً
                        </p>
                        <p style={{ fontSize: '0.9rem', color: '#999' }}>
                            سيظهر المرشحين هنا عند تقديم طلبات جديدة
                        </p>
                    </div>
                </div>
            ) : (
                <div className={pageStyles.candidatesGrid}>
                    {filteredCandidates.map((candidate) => (
                        <div key={candidate.id} className={pageStyles.candidateCard}>
                            <div className={pageStyles.candidateAvatar}>
                                {candidate.name.charAt(0)}
                            </div>
                            <div className={pageStyles.candidateInfo}>
                                <h4>{candidate.name}</h4>
                                <p>{candidate.email}</p>
                                <div className={pageStyles.candidateMeta}>
                                    <span className={pageStyles.metaItem}>📍 {candidate.country}</span>
                                    <span className={pageStyles.metaItem}>💼 {candidate.experience}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    )
}
