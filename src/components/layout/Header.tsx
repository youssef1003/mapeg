'use client'

import { Link, useRouter } from '@/navigation'
import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { apiUrl } from '@/lib/api-url'
import LanguageSwitcher from '@/components/common/LanguageSwitcher'
import styles from './Header.module.css'

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userRole, setUserRole] = useState<string | null>(null)
    const [userName, setUserName] = useState<string | null>(null)
    const t = useTranslations('Navigation')
    const params = useParams()
    const router = useRouter()

    useEffect(() => {
        // Check auth state via API (works with httpOnly cookies)
        const checkAuth = async () => {
            try {
                const response = await fetch(apiUrl('/auth/check-session'), {
                    credentials: 'include',
                })
                
                if (response.ok) {
                    const data = await response.json()
                    console.log('[Header] Auth check:', data)
                    setIsLoggedIn(data.isLoggedIn || data.authenticated)
                    
                    // Get role and name from user object
                    if (data.user && data.user.role) {
                        setUserRole(data.user.role)
                        setUserName(data.user.name)
                    } else if (data.isAdmin) {
                        setUserRole('ADMIN')
                        setUserName('Admin')
                    } else {
                        setUserRole(null)
                        setUserName(null)
                    }
                } else {
                    console.log('[Header] Auth check failed')
                    setIsLoggedIn(false)
                    setUserRole(null)
                    setUserName(null)
                }
            } catch (error) {
                console.error('Auth check failed:', error)
                setIsLoggedIn(false)
                setUserRole(null)
                setUserName(null)
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
        
        try {
            // Call logout API (works for all roles)
            await fetch(apiUrl('/auth/logout'), { 
                method: 'POST',
                credentials: 'include'
            })
        } catch (error) {
            console.error('Logout error:', error)
        }
        
        // Trigger auth-changed event
        window.dispatchEvent(new Event('auth-changed'))
        
        // Redirect to home with full page reload
        window.location.href = `/${currentLocale}`
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
                        // Logged in user: show welcome message + Logout
                        <>
                            {userName && (
                                <span style={{ 
                                    marginLeft: params.locale === 'ar' ? '1rem' : '0',
                                    marginRight: params.locale === 'en' ? '1rem' : '0',
                                    color: '#1e40af', 
                                    fontSize: '15px',
                                    fontWeight: '500'
                                }}>
                                    {params.locale === 'ar' ? `مرحباً، ${userName}` : `Hello, ${userName}`}
                                </span>
                            )}
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

