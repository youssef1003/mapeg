'use client'

import { useState } from 'react'
import styles from './page.module.css'
import { useTranslations } from 'next-intl';

const countries = ['مصر', 'المملكة العربية السعودية', 'الإمارات العربية المتحدة', 'قطر', 'الكويت', 'البحرين', 'عمان', 'الأردن', 'لبنان', 'المغرب']
const jobCategories = ['تكنولوجيا', 'تسويق', 'هندسة', 'تصميم', 'مالية', 'موارد بشرية', 'مبيعات', 'رعاية صحية']

export default function CandidatesPage() {
    const t = useTranslations('CandidatesPage');
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        country: '',
        skills: '',
        experience: '',
        education: '',
        resume: null as File | null,
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (step < 3) {
            setStep(step + 1)
        } else {
            alert('تم إنشاء الملف الشخصي بنجاح! مرحبًا بك في MapEg!')
            // Reset form
            setStep(1)
            setFormData({
                name: '',
                email: '',
                phone: '',
                country: '',
                skills: '',
                experience: '',
                education: '',
                resume: null,
            })
        }
    }

    const handleBack = () => {
        if (step > 1) setStep(step - 1)
    }

    const benefits = [
        {
            icon: '🔍',
            title: t('benefit1Title'),
            description: t('benefit1Desc'),
        },
        {
            icon: '📧',
            title: t('benefit2Title'),
            description: t('benefit2Desc'),
        },
        {
            icon: '📊',
            title: t('benefit3Title'),
            description: t('benefit3Desc'),
        },
        {
            icon: '💡',
            title: t('benefit4Title'),
            description: t('benefit4Desc'),
        },
    ]

    return (
        <div className={styles.candidatesPage}>
            {/* Hero */}
            <section className={styles.hero}>
                <div className="container">
                    <div className={styles.heroContent}>
                        <h1>{t('heroTitle')} <span className="gradient-text">{t('heroHighlight')}</span></h1>
                        <p>{t('heroSubtitle')}</p>
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className={styles.benefits}>
                <div className="container">
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

            {/* Registration Form */}
            <section className={`section ${styles.registerSection}`}>
                <div className="container">
                    <div className={styles.registerWrapper}>
                        <div className={styles.progressBar}>
                            <div className={styles.progressSteps}>
                                <div className={`${styles.progressStep} ${step >= 1 ? styles.active : ''}`}>
                                    <span>1</span>
                                    {t('step1')}
                                </div>
                                <div className={`${styles.progressStep} ${step >= 2 ? styles.active : ''}`}>
                                    <span>2</span>
                                    {t('step2')}
                                </div>
                                <div className={`${styles.progressStep} ${step >= 3 ? styles.active : ''}`}>
                                    <span>3</span>
                                    {t('step3')}
                                </div>
                            </div>
                            <div className={styles.progressLine}>
                                <div className={styles.progressFill} style={{ width: `${((step - 1) / 2) * 100}%` }} />
                            </div>
                        </div>

                        <form className={styles.registerForm} onSubmit={handleSubmit}>
                            {step === 1 && (
                                <div className={styles.formStep}>
                                    <h2>{t('personalInfo')}</h2>
                                    <p className={styles.stepDescription}>{t('tellUs')}</p>

                                    <div className="form-group">
                                        <label className="form-label">{t('fullName')}</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder={t('fullNamePlaceholder')}
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
                                                placeholder={t('emailPlaceholder')}
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
                                                placeholder={t('phonePlaceholder')}
                                                required
                                            />
                                        </div>
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
                                            {countries.map(country => (
                                                <option key={country} value={country}>{country}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className={styles.formStep}>
                                    <h2>{t('professionalExperience')}</h2>
                                    <p className={styles.stepDescription}>{t('shareBackground')}</p>

                                    <div className="form-group">
                                        <label className="form-label">{t('skills')}</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={formData.skills}
                                            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                            placeholder={t('skillsPlaceholder')}
                                            required
                                        />
                                        <small className={styles.inputHint}>{t('skillsHint')}</small>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">{t('yearsExperience')}</label>
                                        <select
                                            className="form-input form-select"
                                            value={formData.experience}
                                            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                            required
                                        >
                                            <option value="">{t('selectExperience')}</option>
                                            <option value="0-1">{t('lessThan1')}</option>
                                            <option value="1-3">{t('years1to3')}</option>
                                            <option value="3-5">{t('years3to5')}</option>
                                            <option value="5-10">{t('years5to10')}</option>
                                            <option value="10+">{t('years10plus')}</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">{t('education')}</label>
                                        <select
                                            className="form-input form-select"
                                            value={formData.education}
                                            onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                                            required
                                        >
                                            <option value="">{t('selectEducation')}</option>
                                            <option value="high-school">{t('highSchool')}</option>
                                            <option value="bachelor">{t('bachelor')}</option>
                                            <option value="master">{t('master')}</option>
                                            <option value="phd">{t('phd')}</option>
                                            <option value="other">{t('other')}</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className={styles.formStep}>
                                    <h2>{t('uploadResume')}</h2>
                                    <p className={styles.stepDescription}>{t('addResume')}</p>

                                    <div className={styles.uploadArea}>
                                        <div className={styles.uploadIcon}>📄</div>
                                        <h3>{t('dragDrop')}</h3>
                                        <p>{t('orBrowse')}</p>
                                        <input
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0] || null
                                                setFormData({ ...formData, resume: file })
                                            }}
                                            className={styles.fileInput}
                                        />
                                        {formData.resume && (
                                            <div className={styles.fileName}>
                                                ✓ {formData.resume.name}
                                            </div>
                                        )}
                                    </div>
                                    <small className={styles.uploadHint}>
                                        {t('acceptedFormats')}
                                    </small>
                                </div>
                            )}

                            <div className={styles.formActions}>
                                {step > 1 && (
                                    <button type="button" className="btn btn-secondary" onClick={handleBack}>
                                        {t('back')}
                                    </button>
                                )}
                                <button type="submit" className="btn btn-primary">
                                    {step === 3 ? t('createProfile') : t('continue')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className={`section ${styles.categories}`}>
                <div className="container">
                    <h2 className="section-title">{t('exploreByCategory')} <span className="gradient-text">{t('categoryHighlight')}</span></h2>
                    <div className={styles.categoriesGrid}>
                        {jobCategories.slice(0, 8).map((category, index) => (
                            <a key={index} href={`/jobs?category=${category}`} className={styles.categoryCard}>
                                {category}
                            </a>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
