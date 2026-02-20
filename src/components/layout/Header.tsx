'use client'

import { Link, useRouter } from '@/navigation'
import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import LanguageSwitcher from '@/components/common/LanguageSwitcher'
import styles from './Header.module.css'

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userRole, setUserRole] = useState<string | null>(null)
    const t = useTranslations('Navigation')
    const params = useParams()
    const router = useRouter()

    useEffect(() => {
        // Check auth state via API (works with httpOnly cookies)
        const checkAuth = async () => {
            try {
                const response = await fetch('/api/auth/check-session', {
                    credentials: 'include',
                })
                
                if (response.ok) {
                    const data = await response.json()
                    console.log('[Header] Auth check:', data)
                    setIsLoggedIn(data.isLoggedIn)
                    // If isAdmin is true, set role to ADMIN, otherwise use userRole from response
                    if (data.isAdmin) {
                        setUserRole('ADMIN')
                    } else {
                        setUserRole(data.userRole)
                    }
                } else {
                    console.log('[Header] Auth check failed')
                    setIsLoggedIn(false)
                    setUserRole(null)
                }
            } catch (error) {
                console.error('Auth check failed:', error)
                setIsLoggedIn(false)
                setUserRole(null)
            }
        }
        
        checkAuth()
        
        // Listen for auth state changes
        const handleAuthChange = () => {
            console.log('[Header] Auth changed event received')
            checkAuth()
        }
        window.addEventListener('auth-changed', handleAuthChange)
        
        return () => {
            window.removeEventListener('auth-changed', handleAuthChange)
        }
    }, [params])

    const handleLogout = async () => {
        const currentLocale = window.location.pathname.split('/')[1] || 'ar'
        
        // Check if admin
        if (userRole === 'ADMIN') {
            // Admin logout - call admin logout API
            try {
                await fetch('/api/admin/logout', { method: 'POST' })
            } catch (error) {
                console.error('Logout error:', error)
            }
            
            // Redirect with full page reload
            window.location.href = `/${currentLocale}`
        } else {
            // Normal user logout - call user logout API
            try {
                await fetch('/api/auth/logout', { method: 'POST' })
            } catch (error) {
                console.error('Logout error:', error)
            }
            
            // Redirect with full page reload
            window.location.href = `/${currentLocale}`
        }
    }

    const handleDashboardClick = () => {
        const currentLocale = window.location.pathname.split('/')[1] || 'ar'
        window.location.href = `/${currentLocale}/admin`
    }

    // Base links always visible (or visible to public)
    const publicLinks = [
        { href: '/', label: t('home') },
        { href: '/about', label: t('about') },
        { href: '/blog', label: t('blog') },
        { href: '/contact', label: t('contact') },
    ]

    // Role-specific links
    const getNavLinks = () => {
        const links = [...publicLinks];

        if (!isLoggedIn || userRole === null) {
            // Guest - show public links only
            links.splice(1, 0, { href: '/jobs', label: t('jobs') });
            links.splice(2, 0, { href: '/employers', label: t('forEmployers') });
            links.splice(3, 0, { href: '/candidates', label: t('candidates') });
        } else if (userRole === 'CANDIDATE') {
            // Candidate Links
            links.push({ href: '/jobs', label: t('jobs') });
            links.push({ href: '/candidates/applications', label: t('myApplications') });
            links.push({ href: '/candidates/profile', label: t('myProfile') });
        } else if (userRole === 'EMPLOYER') {
            // Employer Links
            links.push({ href: '/employers/jobs/new', label: t('postJob') });
            links.push({ href: '/employers/jobs', label: t('myJobs') });
            links.push({ href: '/employers/applications', label: t('applications') });
        } else if (userRole === 'ADMIN') {
            // Admin - show minimal public links only
            // Admin uses sidebar navigation, not header nav
        }

        return links;
    };

    const navLinks = getNavLinks();

    return (
        <header className={styles.header}>
            <div className={`container ${styles.headerContainer}`}>
                <Link href="/" className={styles.logo}>
                    <span className={styles.logoIcon}>🗺️</span>
                    <span className={styles.logoText}>
                        Map<span className={styles.logoAccent}>Eg</span>
                    </span>
                </Link>

                <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={styles.navLink}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div className={styles.mobileSwitcher}>
                        <LanguageSwitcher />
                    </div>
                </nav>

                <div className={styles.headerActions}>
                    <LanguageSwitcher />
                    {userRole === 'ADMIN' ? (
                        // Admin: show Dashboard + Logout only
                        <>
                            <button onClick={handleDashboardClick} className="btn btn-secondary">
                                {t('dashboard')}
                            </button>
                            <button onClick={handleLogout} className="btn btn-primary">
                                {t('logout')}
                            </button>
                        </>
                    ) : isLoggedIn && (userRole === 'CANDIDATE' || userRole === 'EMPLOYER') ? (
                        // Logged in user: show Logout only
                        <>
                            <span style={{ marginLeft: '1rem', color: '#666' }}>
                                مرحباً، {userRole === 'CANDIDATE' ? 'مرشح' : 'صاحب عمل'}
                            </span>
                            <button onClick={handleLogout} className="btn btn-primary">
                                {t('logout')}
                            </button>
                        </>
                    ) : (
                        // Guest: show Login + Register
                        <>
                            <Link href="/auth/login" className="btn btn-secondary">
                                {t('login')}
                            </Link>
                            <Link href="/auth/register" className="btn btn-primary">
                                {t('register')}
                            </Link>
                        </>
                    )}
                </div>

                <button
                    className={styles.menuToggle}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <span className={`${styles.menuBar} ${isMenuOpen ? styles.menuBarOpen : ''}`}></span>
                </button>
            </div>
        </header>
    )
}

