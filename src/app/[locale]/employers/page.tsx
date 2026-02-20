'use client'

import { useState } from 'react'
import Link from 'next/link'
import styles from './page.module.css'
import { useTranslations } from 'next-intl';

export default function EmployersPage() {
    const t = useTranslations('EmployersPage');
    const [formData, setFormData] = useState({
        companyName: '',
        email: '',
        phone: '',
        industry: '',
        website: '',
        country: '',
        description: '',
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError('')

        try {
            const response = await fetch('/api/employers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                setSubmitted(true)
                setFormData({
                    companyName: '',
                    email: '',
                    phone: '',
                    industry: '',
                    website: '',
                    country: '',
                    description: '',
                })
            } else {
                const data = await response.json()
                throw new Error(data.error || 'Failed to submit')
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const benefits = [
        {
            icon: '🎯',
            title: t('benefit1Title'),
            description: t('benefit1Desc'),
        },
        {
            icon: '⚡',
            title: t('benefit2Title'),
            description: t('benefit2Desc'),
        },
        {
            icon: '💰',
            title: t('benefit3Title'),
            description: t('benefit3Desc'),
        },
        {
            icon: '🌍',
            title: t('benefit4Title'),
            description: t('benefit4Desc'),
        },
        {
            icon: '🤝',
            title: t('benefit5Title'),
            description: t('benefit5Desc'),
        },
        {
            icon: '📊',
            title: t('benefit6Title'),
            description: t('benefit6Desc'),
        },
    ]

    const plans = [
        {
            name: t('starterPlan'),
            price: '$199',
            period: t('month'),
            features: [
                t('feature1_1'),
                t('feature1_2'),
                t('feature1_3'),
                t('feature1_4'),
            ],
            popular: false,
        },
        {
            name: t('proPlan'),
            price: '$499',
            period: t('month'),
            features: [
                t('feature2_1'),
                t('feature2_2'),
                t('feature2_3'),
                t('feature2_4'),
                t('feature2_5'),
                t('feature2_6'),
            ],
            popular: true,
        },
        {
            name: t('enterprisePlan'),
            price: t('custom'),
            period: '',
            features: [
                t('feature3_1'),
                t('feature3_2'),
                t('feature3_3'),
                t('feature3_4'),
                t('feature3_5'),
                t('feature3_6'),
            ],
            popular: false,
        },
    ]

    return (
        <div className={styles.employersPage}>
            {/* Hero */}
            <section className={styles.hero}>
                <div className="container">
                    <div className={styles.heroContent}>
                        <h1>{t('heroTitle')} <span className="gradient-text">{t('heroHighlight')}</span> {t('heroSuffix')}</h1>
                        <p>{t('heroSubtitle')}</p>
                        <div className={styles.heroButtons}>
                            <a href="#register" className="btn btn-primary">{t('postJob')}</a>
                            <Link href="/contact" className="btn btn-outline">{t('contactSales')}</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className={`section ${styles.benefits}`}>
                <div className="container">
                    <h2 className="section-title">{t('whyHireTitle')} <span className="gradient-text">{t('whyHireHighlight')}</span></h2>
                    <p className="section-subtitle">{t('whyHireSubtitle')}</p>
                    <div className={styles.benefitsGrid}>
                        {benefits.map((benefit, index) => (
                            <div key={index} className={styles.benefitCard}>
                                <div className={styles.benefitIcon}>{benefit.icon}</div>
                                <h3>{benefit.title}</h3>
                                <p>{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section className={`section ${styles.pricing}`}>
                <div className="container">
                    <h2 className="section-title">{t('pricingTitle')} <span className="gradient-text">{t('pricingHighlight')}</span></h2>
                    <p className="section-subtitle">{t('pricingSubtitle')}</p>
                    <div className={styles.pricingGrid}>
                        {plans.map((plan, index) => (
                            <div key={index} className={`${styles.pricingCard} ${plan.popular ? styles.popular : ''}`}>
                                {plan.popular && <span className={styles.popularBadge}>{t('mostPopular')}</span>}
                                <h3>{plan.name}</h3>
                                <div className={styles.price}>
                                    <span className={styles.priceValue}>{plan.price}</span>
                                    <span className={styles.pricePeriod}>{plan.period}</span>
                                </div>
                                <ul className={styles.featuresList}>
                                    {plan.features.map((feature, i) => (
                                        <li key={i}>
                                            <span className={styles.checkmark}>✓</span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <button className={`btn ${plan.popular ? 'btn-primary' : 'btn-secondary'}`} style={{ width: '100%' }}>
                                    {t('getStarted')}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className={styles.stats}>
                <div className="container">
                    <div className={styles.statsGrid}>
                        <div className={styles.statCard}>
                            <div className={styles.statValue}>2,500+</div>
                            <div className={styles.statLabel}>{t('companiesTrustUs')}</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statValue}>15,000+</div>
                            <div className={styles.statLabel}>{t('successfulPlacements')}</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statValue}>14 {t('days')}</div>
                            <div className={styles.statLabel}>{t('avgTimeToHire')}</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statValue}>95%</div>
                            <div className={styles.statLabel}>{t('clientSatisfaction')}</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Registration Form */}
            <section id="register" className={`section ${styles.registerSection}`}>
                <div className="container">
                    <div className={styles.registerGrid}>
                        <div className={styles.registerInfo}>
                            <h2>{t('readyToHireTitle')} <span className="gradient-text">{t('readyToHireHighlight')}</span></h2>
                            <p>{t('readyToHireSubtitle')}</p>
                            <ul className={styles.registerBenefits}>
                                <li>✓ {t('freeSetup')}</li>
                                <li>✓ {t('noObligation')}</li>
                                <li>✓ {t('dedicatedSupport')}</li>
                                <li>✓ {t('cancelAnytime')}</li>
                            </ul>
                        </div>
                        <form className={styles.registerForm} onSubmit={handleSubmit}>
                            <h3>{t('registerCompany')}</h3>
                            <div className="form-group">
                                <label className="form-label">{t('companyName')}</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.companyName}
                                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                    required
                                />
                            </div>
                            <div className={styles.formRow}>
                                <div className="form-group">
                                    <label className="form-label">{t('email')}</label>
                                    <input
                                        type="email"
                                        className="form-input"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">{t('phone')}</label>
                                    <input
                                        type="tel"
                                        className="form-input"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className={styles.formRow}>
                                <div className="form-group">
                                    <label className="form-label">{t('industry')}</label>
                                    <select
                                        className="form-input form-select"
                                        value={formData.industry}
                                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                                        required
                                    >
                                        <option value="">{t('selectIndustry')}</option>
                                        <option value="technology">{t('technology')}</option>
                                        <option value="finance">{t('financeIndustry')}</option>
                                        <option value="healthcare">{t('healthcareIndustry')}</option>
                                        <option value="construction">{t('constructionIndustry')}</option>
                                        <option value="retail">{t('retailIndustry')}</option>
                                        <option value="other">{t('otherIndustry')}</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">{t('country')}</label>
                                    <select
                                        className="form-input form-select"
                                        value={formData.country}
                                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                        required
                                    >
                                        <option value="">{t('selectCountry')}</option>
                                        <option value="Egypt">مصر</option>
                                        <option value="Saudi Arabia">المملكة العربية السعودية</option>
                                        <option value="UAE">الإمارات</option>
                                        <option value="Qatar">قطر</option>
                                        <option value="Kuwait">الكويت</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">{t('website')}</label>
                                <input
                                    type="url"
                                    className="form-input"
                                    placeholder="https://"
                                    value={formData.website}
                                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">{t('aboutCompany')}</label>
                                <textarea
                                    className="form-input form-textarea"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder={t('aboutPlaceholder')}
                                />
                            </div>
                            {error && (
                                <div style={{ color: '#e74c3c', marginBottom: '1rem', padding: '0.75rem', background: '#fdf0f0', borderRadius: '8px' }}>
                                    {error}
                                </div>
                            )}
                            {submitted ? (
                                <div style={{ textAlign: 'center', padding: '2rem', background: 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)', borderRadius: '12px' }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                                    <h3 style={{ color: '#155724', marginBottom: '0.5rem' }}>تم التسجيل بنجاح!</h3>
                                    <p style={{ color: '#155724' }}>سنتواصل معك قريباً لتفعيل حسابك.</p>
                                </div>
                            ) : (
                                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={isSubmitting}>
                                    {isSubmitting ? 'جاري التسجيل...' : t('registerNow')}
                                </button>
                            )}
                        </form>
                    </div>
                </div>
            </section>
        </div>
    )
}
