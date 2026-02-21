'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/navigation'
import { Link } from '@/navigation'
import { apiUrl } from '@/lib/api-url'
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

        // Try User Login via API
        try {
            const response = await fetch(apiUrl('/auth/login'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            })

            const data = await response.json()

            if (response.ok) {
                // Cookies are set by the API (httpOnly)
                // Check if admin or regular user and redirect accordingly
                const currentLocale = window.location.pathname.split('/')[1] || 'ar'
                const redirectPath = data.isAdmin ? `/${currentLocale}/admin` : `/${currentLocale}`
                window.location.href = redirectPath
            } else {
                setError(t('invalidCredentials'))
            }
        } catch {
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
                        <input
                            type="password"
                            className={styles.formInput}
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
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
