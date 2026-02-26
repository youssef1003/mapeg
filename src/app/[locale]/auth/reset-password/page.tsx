'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Link } from '@/navigation'
import PasswordInput from '@/components/ui/PasswordInput'
import styles from '../login/page.module.css'

function ResetPasswordForm({ params }: { params: { locale: string } }) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        if (!token) {
            setError(params.locale === 'ar' ? 'رابط غير صالح' : 'Invalid link')
        }
    }, [token, params.locale])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        if (password !== confirmPassword) {
            setError(params.locale === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match')
            setLoading(false)
            return
        }

        if (password.length < 8) {
            setError(params.locale === 'ar' ? 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' : 'Password must be at least 8 characters')
            setLoading(false)
            return
        }

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password })
            })

            const data = await response.json()

            if (response.ok) {
                setSuccess(true)
                setTimeout(() => {
                    router.push(`/${params.locale}/auth/login`)
                }, 3000)
            } else {
                setError(data.error || (params.locale === 'ar' ? 'فشل إعادة تعيين كلمة المرور' : 'Failed to reset password'))
            }
        } catch (err) {
            setError(params.locale === 'ar' ? 'حدث خطأ. حاول مرة أخرى.' : 'An error occurred. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    if (!token) {
        return (
            <div className={styles.authContainer}>
                <div className={styles.authCard}>
                    <div className={styles.errorMessage}>
                        {params.locale === 'ar' ? 'رابط غير صالح أو منتهي الصلاحية' : 'Invalid or expired link'}
                    </div>
                    <Link href="/auth/forgot-password" className={styles.backToLogin}>
                        {params.locale === 'ar' ? 'طلب رابط جديد' : 'Request new link'}
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.authContainer}>
            <div className={styles.authCard}>
                <div className={styles.authHeader}>
                    <h1 className={styles.authTitle}>
                        {params.locale === 'ar' ? 'إعادة تعيين كلمة المرور' : 'Reset Password'}
                    </h1>
                    <p className={styles.authSubtitle}>
                        {params.locale === 'ar' 
                            ? 'أدخل كلمة المرور الجديدة'
                            : 'Enter your new password'}
                    </p>
                </div>

                {success ? (
                    <div className={styles.successMessage}>
                        <div className={styles.successIcon}>✓</div>
                        <p>{params.locale === 'ar' ? 'تم إعادة تعيين كلمة المرور بنجاح!' : 'Password reset successfully!'}</p>
                        <p style={{ fontSize: '0.9rem', marginTop: '1rem', color: '#6b7280' }}>
                            {params.locale === 'ar' ? 'جاري التحويل لصفحة تسجيل الدخول...' : 'Redirecting to login...'}
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className={styles.authForm}>
                        {error && (
                            <div className={styles.errorMessage}>
                                {error}
                            </div>
                        )}

                        <div className={styles.formGroup}>
                            <label htmlFor="password">
                                {params.locale === 'ar' ? 'كلمة المرور الجديدة' : 'New Password'}
                            </label>
                            <PasswordInput
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                autoComplete="new-password"
                                className={styles.formInput}
                                dir={params.locale === 'ar' ? 'rtl' : 'ltr'}
                            />
                            <small style={{ color: '#6b7280', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>
                                {params.locale === 'ar' ? '8 أحرف على الأقل' : 'At least 8 characters'}
                            </small>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="confirmPassword">
                                {params.locale === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}
                            </label>
                            <PasswordInput
                                id="confirmPassword"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                autoComplete="new-password"
                                className={styles.formInput}
                                dir={params.locale === 'ar' ? 'rtl' : 'ltr'}
                            />
                        </div>

                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={loading}
                        >
                            {loading 
                                ? (params.locale === 'ar' ? 'جاري الحفظ...' : 'Saving...')
                                : (params.locale === 'ar' ? 'حفظ كلمة المرور' : 'Save Password')
                            }
                        </button>

                        <div className={styles.authFooter}>
                            <Link href="/auth/login">
                                {params.locale === 'ar' ? 'العودة لتسجيل الدخول' : 'Back to Login'}
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}

export default function ResetPasswordPage({ params }: { params: { locale: string } }) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordForm params={params} />
        </Suspense>
    )
}
