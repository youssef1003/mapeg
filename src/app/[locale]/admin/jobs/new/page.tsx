'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Link, useRouter } from '@/navigation'
import { COUNTRIES, CATEGORIES, JOB_TYPES } from '@/constants/taxonomy'
import styles from '../../admin.module.css'
import formStyles from './page.module.css'

export default function NewJobPage() {
    const router = useRouter()
    const params = useParams()
    const locale = params.locale || 'ar'
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [activeTab, setActiveTab] = useState<'ar' | 'en'>('ar')
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        location: '',
        country: 'EG',
        type: 'full-time',
        category: '',
        salaryMin: '',
        salaryMax: '',
        description: '',
        requirements: '',
        featured: false,
        // English translations
        titleEn: '',
        descriptionEn: '',
        requirementsEn: '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const response = await fetch('/api/jobs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: formData.title,
                    company: formData.company || 'غير محدد',
                    location: formData.location || 'غير محدد',
                    country: formData.country,
                    type: formData.type,
                    salaryMin: formData.salaryMin,
                    salaryMax: formData.salaryMax,
                    description: formData.description,
                    requirements: formData.requirements,
                    category: formData.category,
                    featured: formData.featured,
                    // English translations
                    titleEn: formData.titleEn || null,
                    descriptionEn: formData.descriptionEn || null,
                    requirementsEn: formData.requirementsEn || null,
                }),
            })

            if (!response.ok) {
                throw new Error('Failed to create job')
            }

            const job = await response.json()
            alert('✅ تم إضافة الوظيفة بنجاح!')
            router.push('/admin/jobs')
        } catch (error) {
            console.error('Error creating job:', error)
            alert('❌ حدث خطأ أثناء إضافة الوظيفة. حاول مرة أخرى.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <div className={styles.pageHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link href="/admin/jobs" className="btn btn-secondary" style={{ padding: '0.5rem' }}>
                        ➡️
                    </Link>
                    <div>
                        <h1>إضافة وظيفة جديدة</h1>
                        <p>أدخل تفاصيل الوظيفة الجديدة لنشرها على الموقع</p>
                    </div>
                </div>
            </div>

            {/* Language Tabs */}
            <div style={{ 
                display: 'flex', 
                gap: '1rem', 
                marginBottom: '1.5rem',
                background: 'white',
                padding: '1rem',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
                <button
                    type="button"
                    onClick={() => setActiveTab('ar')}
                    style={{
                        flex: 1,
                        padding: '0.75rem',
                        border: 'none',
                        borderRadius: '6px',
                        background: activeTab === 'ar' ? '#0066cc' : '#f5f5f5',
                        color: activeTab === 'ar' ? 'white' : '#666',
                        fontWeight: activeTab === 'ar' ? '600' : '400',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                >
                    🇪🇬 العربية
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('en')}
                    style={{
                        flex: 1,
                        padding: '0.75rem',
                        border: 'none',
                        borderRadius: '6px',
                        background: activeTab === 'en' ? '#0066cc' : '#f5f5f5',
                        color: activeTab === 'en' ? 'white' : '#666',
                        fontWeight: activeTab === 'en' ? '600' : '400',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                >
                    🇬🇧 English
                </button>
            </div>

            <div className={formStyles.formCard}>
                <form onSubmit={handleSubmit}>
                    {activeTab === 'ar' ? (
                        // Arabic Fields
                        <>
                    <h3 className={formStyles.sectionTitle}>التفاصيل الأساسية</h3>
                    <div className={formStyles.formGrid}>
                        <div className={`${formStyles.formGroup} ${formStyles.fullWidth}`}>
                            <label>مسمى الوظيفة <span className={formStyles.required}>*</span></label>
                            <input
                                type="text"
                                className={formStyles.formInput}
                                placeholder="مثال: مهندس برمجيات أول"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>

                        <div className={formStyles.formGroup}>
                            <label>اسم الشركة</label>
                            <input
                                type="text"
                                className={formStyles.formInput}
                                placeholder="اسم الشركة المعلنة"
                                value={formData.company}
                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            />
                        </div>

                        <div className={formStyles.formGroup}>
                            <label>موقع العمل</label>
                            <input
                                type="text"
                                className={formStyles.formInput}
                                placeholder="المدينة"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>

                        <div className={formStyles.formGroup}>
                            <label>الدولة</label>
                            <select
                                className={formStyles.formSelect}
                                value={formData.country}
                                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                            >
                                {COUNTRIES.map(country => (
                                    <option key={country.value} value={country.value}>
                                        {country.ar}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={formStyles.formGroup}>
                            <label>نوع التوظيف</label>
                            <select
                                className={formStyles.formSelect}
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            >
                                {JOB_TYPES.map(type => (
                                    <option key={type.value} value={type.value}>
                                        {type.ar}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={formStyles.formGroup}>
                            <label>المجال</label>
                            <select
                                className={formStyles.formSelect}
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option value="">اختر المجال</option>
                                {CATEGORIES.map(category => (
                                    <option key={category.value} value={category.value}>
                                        {category.ar}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={formStyles.formGroup}>
                            <label>الحد الأدنى للراتب</label>
                            <input
                                type="number"
                                className={formStyles.formInput}
                                placeholder="مثال: 1000"
                                value={formData.salaryMin}
                                onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
                            />
                        </div>

                        <div className={formStyles.formGroup}>
                            <label>الحد الأقصى للراتب</label>
                            <input
                                type="number"
                                className={formStyles.formInput}
                                placeholder="مثال: 2000"
                                value={formData.salaryMax}
                                onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
                            />
                        </div>
                    </div>

                    <h3 className={formStyles.sectionTitle} style={{ marginTop: '2rem' }}>التفاصيل والوصف</h3>
                    <div className={formStyles.formGrid}>
                        <div className={`${formStyles.formGroup} ${formStyles.fullWidth}`}>
                            <label>وصف الوظيفة <span className={formStyles.required}>*</span></label>
                            <textarea
                                className={formStyles.formTextarea}
                                placeholder="اكتب وصفاً تفصيلياً للوظيفة والمسؤوليات..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                required
                            />
                        </div>

                        <div className={`${formStyles.formGroup} ${formStyles.fullWidth}`}>
                            <label>المتطلبات والمهارات <span className={formStyles.required}>*</span></label>
                            <textarea
                                className={formStyles.formTextarea}
                                placeholder="المؤهلات المطلوبة، الخبرات، والمهارات التقنية..."
                                value={formData.requirements}
                                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                        </>
                    ) : (
                        // English Fields
                        <>
                            <div style={{ marginBottom: '1rem', padding: '1rem', background: '#f0f9ff', borderRadius: '8px', border: '1px solid #0066cc' }}>
                                <p style={{ margin: 0, color: '#0066cc', fontSize: '0.9rem' }}>
                                    ℹ️ الحقول الإنجليزية اختيارية. إذا لم تملأها، سيتم عرض النص العربي في الصفحة الإنجليزية.
                                </p>
                            </div>

                            <h3 className={formStyles.sectionTitle}>English Translation</h3>
                            <div className={formStyles.formGrid}>
                                <div className={`${formStyles.formGroup} ${formStyles.fullWidth}`}>
                                    <label>Job Title (English)</label>
                                    <input
                                        type="text"
                                        className={formStyles.formInput}
                                        placeholder="e.g., Senior Software Engineer"
                                        value={formData.titleEn}
                                        onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                                    />
                                </div>

                                <div className={`${formStyles.formGroup} ${formStyles.fullWidth}`}>
                                    <label>Job Description (English)</label>
                                    <textarea
                                        className={formStyles.formTextarea}
                                        placeholder="Detailed job description in English..."
                                        value={formData.descriptionEn}
                                        onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                                    />
                                </div>

                                <div className={`${formStyles.formGroup} ${formStyles.fullWidth}`}>
                                    <label>Requirements (English)</label>
                                    <textarea
                                        className={formStyles.formTextarea}
                                        placeholder="Required qualifications, experience, and technical skills..."
                                        value={formData.requirementsEn}
                                        onChange={(e) => setFormData({ ...formData, requirementsEn: e.target.value })}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <h3 className={formStyles.sectionTitle} style={{ marginTop: '2rem' }}>إعدادات النشر</h3>
                    <div className={formStyles.formGroup}>
                        <label className={formStyles.toggleLabel}>
                            <div className={formStyles.toggleText}>
                                <span className={formStyles.toggleTitle}>وظيفة مميزة</span>
                                <span className={formStyles.toggleDescription}>تظهر الوظيفة في أعلى القائمة وفي الصفحة الرئيسية</span>
                            </div>
                            <div className={formStyles.toggle}>
                                <input
                                    type="checkbox"
                                    checked={formData.featured}
                                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                />
                                <span className={formStyles.toggleSlider}></span>
                            </div>
                        </label>
                    </div>

                    <div className={formStyles.formActions}>
                        <Link href="/admin/jobs" className={formStyles.cancelBtn}>
                            إلغاء
                        </Link>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'جاري النشر...' : 'نشر الوظيفة'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}
