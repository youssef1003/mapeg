'use client'

import { useState, useEffect } from 'react'
import { Link, usePathname, useRouter } from '@/navigation'
import styles from './admin.module.css'

interface Stats {
  jobsCount: number
  candidatesCount: number
  employersCount: number
  applicationsCount: number
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    fetchStats()
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
    }
  }

  const navItems = [
    { href: '/admin', icon: '📊', label: 'لوحة التحكم' },
    { href: '/admin/jobs', icon: '💼', label: 'الوظائف', count: stats?.jobsCount },
    { href: '/admin/candidates', icon: '👥', label: 'المرشحين', count: stats?.candidatesCount },
    { href: '/admin/employers', icon: '🏢', label: 'أصحاب العمل' },
    { href: '/admin/applications', icon: '📄', label: 'الطلبات', count: stats?.applicationsCount },
  ]

  const settingsItems = [
    { href: '/admin/settings', icon: '⚙️', label: 'الإعدادات العامة' },
    { href: '/admin/about-settings', icon: '📄', label: 'إعدادات من نحن' },
    { href: '/admin/blog-settings', icon: '📝', label: 'إعدادات المدونة' },
  ]

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
    } catch (error) {
      console.error('Logout error:', error)
    }
    
    // مسح الـ cookies من الـ client أيضاً
    document.cookie = 'admin_session=; path=/; max-age=0'
    document.cookie = 'user_role=; path=/; max-age=0'

    // Trigger auth state refresh in Header
    window.dispatchEvent(new Event('auth-changed'))

    // استخدام next-intl router للـ redirect
    router.push('/')
  }

  // نفس فكرة اللوج اوت: "عرض الموقع" يرجع للـ locale الصحيح
  const siteHref = '/'

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className={styles.adminLayout} style={{ flex: 1 }}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link href="/admin" className={styles.sidebarLogo}>
              <span>MapEg</span> أدمن
            </Link>
          </div>

          <nav className={styles.sidebarNav}>
            <div className={styles.navSection}>
              <div className={styles.navSectionTitle}>القائمة الرئيسية</div>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.navItem} ${
                    pathname === item.href || pathname?.endsWith(item.href) ? styles.active : ''
                  }`}
                >
                  <span className={styles.navIcon}>{item.icon}</span>
                  {item.label}
                  {item.count !== undefined && item.count > 0 && (
                    <span className={styles.navBadge}>{item.count}</span>
                  )}
                </Link>
              ))}
            </div>

            <div className={styles.navSection}>
              <div className={styles.navSectionTitle}>الإعدادات</div>
              {settingsItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.navItem} ${
                    pathname === item.href || pathname?.endsWith(item.href) ? styles.active : ''
                  }`}
                >
                  <span className={styles.navIcon}>{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>

          <div className={styles.sidebarFooter}>
            <div className={styles.userInfo}>
              <div className={styles.userAvatar}>أ</div>
              <div className={styles.userDetails}>
                <h4>Super Admin</h4>
                <p>مدير النظام</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="btn btn-secondary"
              style={{ marginTop: '0.5rem', width: '100%', fontSize: '0.875rem' }}
            >
              تسجيل الخروج
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className={styles.mainContent}>
          {/* Top Header */}
          <header className={styles.topHeader}>
            <div className={styles.searchBar}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input type="text" placeholder="بحث..." />
            </div>

            <div className={styles.headerActions}>
              <Link href="/admin/jobs" className="btn btn-primary" style={{ fontSize: '0.875rem', marginLeft: '0.5rem' }}>
                💼 الوظائف
              </Link>
              
              <button className={styles.iconBtn}>
                <span className={styles.notificationDot}></span> 🔔
              </button>
              <button className={styles.iconBtn}>📧</button>

              {/* يرجع للموقع بنفس اللغة */}
              <Link href={siteHref} className="btn btn-secondary" style={{ fontSize: '0.875rem' }}>
                عرض الموقع
              </Link>
            </div>
          </header>

          {/* Page Content */}
          <div className={styles.pageContent}>{children}</div>
        </main>
      </div>
      <style jsx global>{`
        body > div > footer {
          display: none !important;
        }
      `}</style>
    </div>
  )
}
