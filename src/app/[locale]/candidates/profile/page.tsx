'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/navigation'
import styles from './page.module.css'

export default function CandidateProfilePage() {
  const t = useTranslations('Navigation')
  const [userInfo, setUserInfo] = useState<{
    name: string
    email: string
    role: string
  } | null>(null)

  useEffect(() => {
    // Get user info from cookies
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      if (parts.length === 2) return parts.pop()?.split(';').shift()
      return null
    }

    const name = getCookie('user_name') || 'User'
    const email = getCookie('user_email') || ''
    const role = getCookie('user_role') || 'CANDIDATE'

    setUserInfo({ name, email, role })
  }, [])

  if (!userInfo) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading...</div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1>{t('myProfile')}</h1>
          <p>إدارة معلوماتك الشخصية والمهنية</p>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.avatar}>
              {userInfo.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2>{userInfo.name}</h2>
              <p>{userInfo.email}</p>
            </div>
          </div>

          <div className={styles.section}>
            <h3>المعلومات الشخصية</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <label>الاسم الكامل</label>
                <p>{userInfo.name}</p>
              </div>
              <div className={styles.infoItem}>
                <label>البريد الإلكتروني</label>
                <p>{userInfo.email}</p>
              </div>
              <div className={styles.infoItem}>
                <label>نوع الحساب</label>
                <p>{userInfo.role}</p>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3>الإجراءات السريعة</h3>
            <div className={styles.actions}>
              <Link href="/jobs" className="btn btn-primary">
                تصفح الوظائف
              </Link>
              <Link href="/candidates/applications" className="btn btn-secondary">
                عرض طلباتي
              </Link>
            </div>
          </div>

          <div className={styles.notice}>
            <p>📝 هذه صفحة مؤقتة. سيتم إضافة المزيد من الميزات قريباً.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
