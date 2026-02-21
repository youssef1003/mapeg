'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'
import { Link } from '@/navigation'
import { apiUrl } from '@/lib/api-url'
import styles from '../login/page.module.css'

export default function RegisterPage() {
    const t = useTranslations('Auth')
    const router = useRouter()
    const searchParams = useSearchParams()

    // Steps: 1 = Role, 2 = Account, 3 = Profile (Candidate only)
    const [step, setStep] = useState(1)

    // Form Data
    const [role, setRole] = useState<'CANDIDATE' | 'EMPLOYER' | null>(null)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        companyName: '',
        // Candidate Profile
        profession: '',
        yearsOfExperience: '',
        city: '',
        skills: '',
        summary: '',
    })

    // File Upload State
    const [cvFile, setCvFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)

    // UI State
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    // Initialize role from URL
    useEffect(() => {
        const roleParam = searchParams.get('role')
        if (roleParam === 'EMPLOYER') {
            setRole('EMPLOYER')
            setStep(2)
        } else if (roleParam === 'CANDIDATE') {
            setRole('CANDIDATE')
            setStep(2)
        }
    }, [searchParams])

    const handleRoleSelect = (selectedRole: 'CANDIDATE' | 'EMPLOYER') => {
        setRole(selectedRole)
        setStep(2)
    }

    const handleAccountSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError(t('passwordsDoNotMatch'))
            setIsLoading(false)
            return
        }
        if (formData.password.length < 6) {
            setError(t('passwordTooShort'))
            setIsLoading(false)
            return
        }

        try {
            // Register User
            const response = await fetch(apiUrl('/auth/register'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: role,
                    phone: formData.phone,
                    companyName: role === 'EMPLOYER' ? formData.companyName : undefined
                }),
            })

            const data = await response.json()

            if (response.ok) {
                if (role === 'CANDIDATE') {
                    // Move to profile step with userId
                    setFormData(prev => ({ ...prev, userId: data.user.id }))
                    setStep(3)
                    setSuccess(t('accountCreated'))
                } else {
                    // Employer finished - cookies set by API, redirect with full reload
                    setSuccess(t('registrationSuccess'))
                    const currentLocale = window.location.pathname.split('/')[1] || 'ar'
                    setTimeout(() => {
                        window.location.href = `/${currentLocale}`
                    }, 1500)
                }
            } else {
                setError(data.error || t('registrationFailed'))
            }
        } catch {
            setError(t('registrationFailed'))
        } finally {
            setIsLoading(false)
        }
    }

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        let cvPath = null

        // 1. Upload CV if present
        if (cvFile) {
            setUploading(true)
            try {
                const formDataUpload = new FormData()
                formDataUpload.append('file', cvFile)

                const uploadRes = await fetch(apiUrl('/upload/cv'), {
                    method: 'POST',
                    body: formDataUpload
                })

                const uploadData = await uploadRes.json()
                if (uploadRes.ok) {
                    cvPath = uploadData.filePath
                } else {
                    console.error('CV Upload failed:', uploadData.error)
                }
            } catch (err) {
                console.error('CV Upload error', err)
            } finally {
                setUploading(false)
            }
        }

        // 2. Update Profile
        // @ts-ignore - userId injected in previous step
        const userId = formData.userId

        try {
            const res = await fetch(apiUrl('/auth/candidate-profile'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    profession: formData.profession,
                    yearsOfExperience: formData.yearsOfExperience,
                    city: formData.city,
                    skills: formData.skills,
                    summary: formData.summary,
                    cvFilePath: cvPath
                })
            })

            if (res.ok) {
                // Cookies already set by register API, just redirect
                setSuccess(t('profileCompleted'))
                const currentLocale = window.location.pathname.split('/')[1] || 'ar'
                setTimeout(() => {
                    window.location.href = `/${currentLocale}`
                }, 1500)
            } else {
                setError(t('profileSaveFailed'))
                const currentLocale = window.location.pathname.split('/')[1] || 'ar'
                setTimeout(() => {
                    window.location.href = `/${currentLocale}`
                }, 2500)
            }
        } catch {
            setError('Network error saving profile.')
        } finally {
            setIsLoading(false)
        }
    }

    // Render Steps
    const renderStep1 = () => (
        <div className={styles.roleSelection}>
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>{t('selectRole')}</h2>
            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
                <button
                    type="button"
                    onClick={() => handleRoleSelect('CANDIDATE')}
                    className={styles.loginBtn}
                    style={{ backgroundColor: 'white', color: 'var(--primary)', border: '2px solid var(--primary)' }}
                >
                    {t('candidateRole')}
                </button>
                <button
                    type="button"
                    onClick={() => handleRoleSelect('EMPLOYER')}
                    className={styles.loginBtn}
                >
                    {t('employerRole')}
                </button>
            </div>
            <div className={styles.loginFooter}>
                <p>{t('alreadyHaveAccount')} <Link href="/auth/login">{t('loginBtn')}</Link></p>
                <br />
                <Link href="/">{t('backToHome')}</Link>
            </div>
        </div>
    )

    const renderStep2 = () => (
        <form onSubmit={handleAccountSubmit}>
            <div className={styles.loginHeader}>
                <h1>{role === 'EMPLOYER' ? t('employerRegistration') : t('candidateRegistration')}</h1>
                <p>{t('registerSubtitle')}</p>
            </div>

            <div className={styles.formGroup}>
                <label>{t('nameLabel')}</label>
                <input
                    type="text"
                    className={styles.formInput}
                    placeholder={t('namePlaceholder')}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                />
            </div>

            {role === 'EMPLOYER' && (
                <div className={styles.formGroup}>
                    <label>{t('companyName')}</label>
                    <input
                        type="text"
                        className={styles.formInput}
                        placeholder={t('companyNamePlaceholder')}
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        required
                    />
                </div>
            )}

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
                <label>{t('phoneLabel')}</label>
                <input
                    type="tel"
                    className={styles.formInput}
                    placeholder="+20..."
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
            <div className={styles.formGroup}>
                <label>{t('confirmPasswordLabel')}</label>
                <input
                    type="password"
                    className={styles.formInput}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                />
            </div>

            <button
                type="submit"
                className={styles.loginBtn}
                disabled={isLoading}
            >
                {isLoading ? t('loading') : (role === 'CANDIDATE' ? t('nextProfile') : t('registerBtn'))}
            </button>

            <div className={styles.loginFooter}>
                <button type="button" onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', textDecoration: 'underline' }}>{t('changeRole')}</button>
            </div>
        </form>
    )

    const renderStep3 = () => (
        <form onSubmit={handleProfileSubmit}>
            <div className={styles.loginHeader}>
                <h1>{t('completeProfile')}</h1>
                <p>{t('profileSubtitle')}</p>
            </div>

            <div className={styles.formGroup}>
                <label>{t('currentProfession')}</label>
                <input
                    type="text"
                    className={styles.formInput}
                    placeholder={t('professionPlaceholder')}
                    value={formData.profession}
                    onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                    required
                />
            </div>

            <div className={styles.formGroup}>
                <label>{t('yearsExperience')}</label>
                <input
                    type="number"
                    className={styles.formInput}
                    placeholder={t('yearsPlaceholder')}
                    value={formData.yearsOfExperience}
                    onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
                    required
                />
            </div>

            <div className={styles.formGroup}>
                <label>{t('cityCountry')}</label>
                <input
                    type="text"
                    className={styles.formInput}
                    placeholder={t('cityPlaceholder')}
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                />
            </div>

            <div className={styles.formGroup}>
                <label>{t('skillsLabel')}</label>
                <input
                    type="text"
                    className={styles.formInput}
                    placeholder={t('skillsPlaceholder')}
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    required
                />
            </div>

            <div className={styles.formGroup}>
                <label>{t('summaryLabel')}</label>
                <textarea
                    className={styles.formInput}
                    placeholder={t('summaryPlaceholder')}
                    value={formData.summary}
                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                    rows={3}
                />
            </div>

            <div className={styles.formGroup}>
                <label>{t('uploadCV')}</label>
                <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className={styles.formInput}
                    onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                            setCvFile(e.target.files[0])
                        }
                    }}
                    style={{ padding: '0.5rem' }}
                />
            </div>

            <button
                type="submit"
                className={styles.loginBtn}
                disabled={isLoading || uploading}
            >
                {isLoading || uploading ? t('loading') : t('finishRegistration')}
            </button>

            <div className={styles.loginFooter}>
                <button type="button" onClick={() => router.push('/')} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>{t('skipForNow')}</button>
            </div>
        </form>
    )

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginCard}>
                {error && (
                    <div className={styles.errorMessage}>{error}</div>
                )}
                {success && (
                    <div className={styles.successMessage} style={{
                        background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', textAlign: 'center'
                    }}>
                        {success}
                    </div>
                )}

                {!success && (
                    <>
                        {step === 1 && renderStep1()}
                        {step === 2 && renderStep2()}
                        {step === 3 && renderStep3()}
                    </>
                )}
            </div>
        </div>
    )
}
