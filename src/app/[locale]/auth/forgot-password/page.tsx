'use client'

import { useState } from 'react'
import { Link } from '@/navigation'
import { useTranslations } from 'next-intl'
import styles from '../login/page.module.css'

export default function ForgotPasswordPage({ params }: { params: { locale: string } }) {
    const t = useTranslations('Auth')
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setMessage('')

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, locale: params.locale })
            })

            const data = await response.json()

            if (response.ok) {
                setSuccess(true)
                setMessage(data.message || 'Password reset link sent to your email')
                setEmail('')
            } else {
                setError(data.error || 'Failed to send reset link')
            }
        } catch (err) {
            setError('An error occurred. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.authContainer}>
            <div className={styles.authCard}>
                <div className={styles.authHeader}>
                    <h1 className={styles.authTitle}>
                        {params.locale === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}
                    </h1>
                    <p className={styles.authSubtitle}>
                        {params.locale === 'ar' 
                            ? 'أدخل بريدك الإلكتروني وسنرسل لك رابط لإعادة تعيين كلمة المرور'
                            : 'Enter your email and we\'ll send you a link to reset your password'}
                    </p>
                </div>

                {success ? (
                    <div className={styles.successMessage}>
                        <div className={styles.successIcon}>✓</div>
                        <p>{message}</p>
                        <p style={{ fontSize: '0.9rem', marginTop: '1rem', color: '#6b7280' }}>
                            {params.locale === 'ar'
                                ? 'تحقق من بريدك الإلكتروني (بما في ذلك مجلد الرسائل غير المرغوب فيها)'
                                : 'Check your email (including spam folder)'}
                        </p>
                        <Link href="/auth/login" className={styles.backToLogin}>
                            {params.locale === 'ar' ? 'العودة لتسجيل الدخول' : 'Back to Login'}
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className={styles.authForm}>
                        {error && (
                            <div className={styles.errorMessage}>
                                {error}
                            </div>
                        )}

                        <div className={styles.formGroup}>
                            <label htmlFor="email">
                                {params.locale === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={styles.formInput}
                                placeholder={params.locale === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                                required
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={loading}
                        >
                            {loading 
                                ? (params.locale === 'ar' ? 'جاري الإرسال...' : 'Sending...')
                                : (params.locale === 'ar' ? 'إرسال رابط إعادة التعيين' : 'Send Reset Link')
                            }
                        </button>

                        <div className={styles.authFooter}>
                            <Link href="/auth/login">
                                {params.locale === 'ar' ? 'تذكرت كلمة المرور؟ تسجيل الدخول' : 'Remember your password? Login'}
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}
