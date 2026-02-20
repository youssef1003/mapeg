'use client'

import { useState, useEffect } from 'react'
import styles from './page.module.css'
import { useTranslations } from 'next-intl';

interface SiteSettings {
    siteName: string
    siteEmail: string
    sitePhone: string
    siteAddress: string
    facebookUrl?: string | null
    twitterUrl?: string | null
    linkedinUrl?: string | null
    instagramUrl?: string | null
    whatsappNumber?: string | null
}

export default function ContactPage() {
    const t = useTranslations('Contact');
    const [settings, setSettings] = useState<SiteSettings | null>(null)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    })
    const [submitted, setSubmitted] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        try {
            const response = await fetch('/api/admin/settings', { cache: 'no-store' })
            if (response.ok) {
                const data = await response.json()
                setSettings(data)
            }
        } catch (error) {
            console.error('Error fetching settings:', error)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError('')

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                setSubmitted(true)
                setFormData({ name: '', email: '', subject: '', message: '' })
                // Reset form after 5 seconds
                setTimeout(() => {
                    setSubmitted(false)
                }, 5000)
            } else {
                throw new Error('Failed to submit')
            }
        } catch {
            setError('حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const contactInfo = [
        {
            icon: '📍',
            title: t('visitUs'),
            details: settings?.siteAddress ? settings.siteAddress.split(',').map(s => s.trim()) : [t('address1'), t('address2')],
        },
        {
            icon: '📧',
            title: t('emailUs'),
            details: settings?.siteEmail ? [settings.siteEmail] : ['info@mapeg.com', 'careers@mapeg.com'],
        },
        {
            icon: '📞',
            title: t('callUs'),
            details: settings?.sitePhone ? [settings.sitePhone] : ['+20 2 1234 5678', '+971 4 123 4567'],
        },
        {
            icon: '🕐',
            title: t('workingHours'),
            details: [t('sunThu'), t('friSat')],
        },
    ]

    const faqs = [
        {
            question: t('faq1Question'),
            answer: t('faq1Answer'),
        },
        {
            question: t('faq2Question'),
            answer: t('faq2Answer'),
        },
        {
            question: t('faq3Question'),
            answer: t('faq3Answer'),
        },
        {
            question: t('faq4Question'),
            answer: t('faq4Answer'),
        },
    ]

    return (
        <div className={styles.contactPage}>
            {/* Hero */}
            <section className={styles.hero}>
                <div className="container">
                    <h1>{t('title')} <span className="gradient-text">{t('titleHighlight')}</span></h1>
                    <p>{t('subtitle')}</p>
                </div>
            </section>

            {/* Contact Info */}
            <section className={styles.contactInfo}>
                <div className="container">
                    <div className={styles.infoGrid}>
                        {contactInfo.map((info, index) => (
                            <div key={index} className={styles.infoCard}>
                                <div className={styles.infoIcon}>{info.icon}</div>
                                <h3>{info.title}</h3>
                                {info.details.map((detail, i) => (
                                    <p key={i}>{detail}</p>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Form & Map */}
            <section className={`section ${styles.contactSection}`}>
                <div className="container">
                    <div className={styles.contactGrid}>
                        {/* Form */}
                        <div className={styles.formWrapper}>
                            <h2>{t('sendMessage')}</h2>
                            <p className={styles.formSubtitle}>
                                {t('formSubtitle')}
                            </p>

                            {submitted ? (
                                <div className={styles.successMessage}>
                                    <div className={styles.successIcon}>✓</div>
                                    <h3>{t('messageSent')}</h3>
                                    <p>{t('thankYou')}</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    <div className={styles.formRow}>
                                        <div className="form-group">
                                            <label className="form-label">{t('yourName')}</label>
                                            <input
                                                type="text"
                                                className="form-input"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">{t('yourEmail')}</label>
                                            <input
                                                type="email"
                                                className="form-input"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">{t('subject')}</label>
                                        <select
                                            className="form-input form-select"
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                            required
                                        >
                                            <option value="">{t('selectSubject')}</option>
                                            <option value="general">{t('generalInquiry')}</option>
                                            <option value="candidate">{t('candidateSupport')}</option>
                                            <option value="employer">{t('employerInquiry')}</option>
                                            <option value="partnership">{t('partnership')}</option>
                                            <option value="feedback">{t('feedback')}</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">{t('message')}</label>
                                        <textarea
                                            className="form-input form-textarea"
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            placeholder={t('messagePlaceholder')}
                                            required
                                        />
                                    </div>
                                    {error && (
                                        <div style={{ color: '#e74c3c', marginBottom: '1rem', padding: '0.75rem', background: '#fdf0f0', borderRadius: '8px' }}>
                                            {error}
                                        </div>
                                    )}
                                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={isSubmitting}>
                                        {isSubmitting ? 'جاري الإرسال...' : t('sendBtn')}
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* Map Placeholder */}
                        <div className={styles.mapWrapper}>
                            <div className={styles.mapPlaceholder}>
                                <div className={styles.mapIcon}>🗺️</div>
                                <h3>{t('findUs')}</h3>
                                <p>{settings?.siteAddress || `${t('address1')}، ${t('address2')}`}</p>
                                <a
                                    href="https://maps.google.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-secondary"
                                >
                                    {t('openInMaps')}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQs */}
            <section className={`section ${styles.faqs}`}>
                <div className="container">
                    <h2 className="section-title">{t('faqTitle')} <span className="gradient-text">{t('faqHighlight')}</span></h2>
                    <div className={styles.faqsGrid}>
                        {faqs.map((faq, index) => (
                            <div key={index} className={styles.faqCard}>
                                <h3>{faq.question}</h3>
                                <p>{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
