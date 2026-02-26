'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/navigation'
import { Link } from '@/navigation'
import { apiUrl } from '@/lib/api-url'
import PasswordInput from '@/components/ui/PasswordInput'
import styles from './page.module.css'

export default function LoginPage() {
    const t = useTranslations('Auth')
    const router = useRouter()

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            const response = await fetch(apiUrl('/auth/login'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            })

            const data = await response.json()

            if (response.ok) {
                // Trigger auth-changed event for Header
                window.dispatchEvent(new Event('auth-changed'))
                
                // Get current locale
                const currentLocale = window.location.pathname.split('/')[1] || 'ar'
                
                // Redirect based on role
                let redirectPath = `/${currentLocale}`
                
                if (data.user && data.user.role) {
                    if (data.user.role === 'ADMIN') {
                        redirectPath = `/${currentLocale}/admin`
                    } else if (data.user.role === 'EMPLOYER') {
                        redirectPath = `/${currentLocale}/employers/jobs`
                    } else if (data.user.role === 'CANDIDATE') {
                        redirectPath = `/${currentLocale}/jobs`
                    }
                } else if (data.isAdmin) {
                    // Fallback for old response format
                    redirectPath = `/${currentLocale}/admin`
                }
                
                // Full page reload to ensure cookies are set
                window.location.href = redirectPath
            } else {
                setError(data.error || t('invalidCredentials'))
            }
        } catch (error) {
            console.error('Login error:', error)
            setError(t('invalidCredentials'))
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginCard}>
                <div className={styles.loginHeader}>
                    <h1>{t('loginTitle')}</h1>
                    <p>{t('loginSubtitle')}</p>
                </div>

                {error && (
                    <div className={styles.errorMessage}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label>{t('emailLabel')}</label>
                        <input
                            type="email"
                            className={styles.formInput}
                            placeholder="example@domain.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>{t('passwordLabel')}</label>
                        <PasswordInput
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="••••••••"
                            required
                            autoComplete="current-password"
                            className={styles.formInput}
                        />
                        <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
                            <Link 
                                href="/auth/forgot-password" 
                                style={{ fontSize: '0.875rem', color: 'var(--primary)', textDecoration: 'none' }}
                            >
                                {t('forgotPassword') || 'Forgot Password?'}
                            </Link>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className={styles.loginBtn}
                        disabled={isLoading}
                    >
                        {isLoading ? t('loading') : t('loginBtn')}
                    </button>
                </form>

                <div className={styles.loginFooter}>
                    <p>{t('noAccount')} <Link href="/auth/register">{t('registerBtn')}</Link></p>
                    <br />
                    <Link href="/">{t('backToHome')}</Link>
                </div>
            </div>
        </div>
    )
}
