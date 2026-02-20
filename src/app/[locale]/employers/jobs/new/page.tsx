'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/navigation'
import { useParams, useRouter } from 'next/navigation'
import { COUNTRIES, CATEGORIES, JOB_TYPES } from '@/constants/taxonomy'
import styles from './page.module.css'

export default function PostJobPage() {
  const t = useTranslations('Navigation')
  const params = useParams()
  const router = useRouter()
  const locale = params.locale as string || 'ar'
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    titleEn: '',
    company: '',
    location: '',
    country: 'EG',
    type: 'full-time',
    category: 'technology',
    salaryMin: '',
    salaryMax: '',
    description: '',
    descriptionEn: '',
    requirements: '',
    requirementsEn: ''
  })

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/check-session', {
        credentials: 'include'
      })
      const data = await response.json()
      
      if (!data.isLoggedIn || data.user?.role !== 'EMPLOYER') {
        window.location.href = `/${locale}/auth/login?redirect=/employers/jobs/new`
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        alert(locale === 'ar' ? '✅ تم نشر الوظيفة بنجاح' : '✅ Job posted successfully')
        router.push(`/${locale}/employers/jobs`)
      } else {
        const data = await response.json()
        throw new Error(data.error || 'Failed to post job')
      }
    } catch (error: any) {
      console.error('Error posting job:', error)
      setError(error.message || (locale === 'ar' ? 'فشل نشر الوظيفة' : 'Failed to post job'))
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <div>
            <h1>{locale === 'ar' ? 'نشر وظيفة جديدة' : 'Post New Job'}</h1>
            <p>{locale === 'ar' ? 'أضف تفاصيل الوظيفة للعثور على أفضل المواهب' : 'Add job details to find the best talents'}</p>
          </div>
          <Link href="/employers/jobs" className="btn btn-secondary">
            ← {locale === 'ar' ? 'وظائفي' : 'My Jobs'}
          </Link>
        </div>

        {error && (
          <div className={styles.error}>
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.section}>
            <h2>{locale === 'ar' ? 'معلومات أساسية' : 'Basic Information'}</h2>
            
            <div className={styles.formGroup}>
              <label>{locale === 'ar' ? 'عنوان الوظيفة (عربي)' : 'Job Title (Arabic)'} *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder={locale === 'ar' ? 'مثال: مطور برمجيات' : 'Example: Software Developer'}
              />
            </div>

            <div className={styles.formGroup}>
              <label>{locale === 'ar' ? 'عنوان الوظيفة (إنجليزي)' : 'Job Title (English)'}</label>
              <input
                type="text"
                name="titleEn"
                value={formData.titleEn}
                onChange={handleChange}
                placeholder="Example: Software Developer"
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>{locale === 'ar' ? 'اسم الشركة' : 'Company Name'} *</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>{locale === 'ar' ? 'الموقع/المدينة' : 'Location/City'} *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder={locale === 'ar' ? 'مثال: القاهرة' : 'Example: Cairo'}
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>{locale === 'ar' ? 'الدولة' : 'Country'} *</label>
                <select name="country" value={formData.country} onChange={handleChange} required>
                  {COUNTRIES.map(c => (
                    <option key={c.value} value={c.value}>
                      {locale === 'ar' ? c.ar : c.en}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>{locale === 'ar' ? 'نوع الوظيفة' : 'Job Type'} *</label>
                <select name="type" value={formData.type} onChange={handleChange} required>
                  {JOB_TYPES.map(t => (
                    <option key={t.value} value={t.value}>
                      {locale === 'ar' ? t.ar : t.en}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>{locale === 'ar' ? 'التصنيف' : 'Category'} *</label>
                <select name="category" value={formData.category} onChange={handleChange} required>
                  {CATEGORIES.map(c => (
                    <option key={c.value} value={c.value}>
                      {locale === 'ar' ? c.ar : c.en}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>{locale === 'ar' ? 'الراتب الأدنى (EGP)' : 'Min Salary (EGP)'}</label>
                <input
                  type="number"
                  name="salaryMin"
                  value={formData.salaryMin}
                  onChange={handleChange}
                  placeholder="5000"
                />
              </div>

              <div className={styles.formGroup}>
                <label>{locale === 'ar' ? 'الراتب الأقصى (EGP)' : 'Max Salary (EGP)'}</label>
                <input
                  type="number"
                  name="salaryMax"
                  value={formData.salaryMax}
                  onChange={handleChange}
                  placeholder="10000"
                />
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h2>{locale === 'ar' ? 'وصف الوظيفة' : 'Job Description'}</h2>
            
            <div className={styles.formGroup}>
              <label>{locale === 'ar' ? 'الوصف (عربي)' : 'Description (Arabic)'} *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={6}
                placeholder={locale === 'ar' ? 'اكتب وصف تفصيلي للوظيفة...' : 'Write detailed job description...'}
              />
            </div>

            <div className={styles.formGroup}>
              <label>{locale === 'ar' ? 'الوصف (إنجليزي)' : 'Description (English)'}</label>
              <textarea
                name="descriptionEn"
                value={formData.descriptionEn}
                onChange={handleChange}
                rows={6}
                placeholder="Write detailed job description..."
              />
            </div>
          </div>

          <div className={styles.section}>
            <h2>{locale === 'ar' ? 'المتطلبات' : 'Requirements'}</h2>
            
            <div className={styles.formGroup}>
              <label>{locale === 'ar' ? 'المتطلبات (عربي)' : 'Requirements (Arabic)'} *</label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                required
                rows={6}
                placeholder={locale === 'ar' ? 'اكتب متطلبات الوظيفة...' : 'Write job requirements...'}
              />
            </div>

            <div className={styles.formGroup}>
              <label>{locale === 'ar' ? 'المتطلبات (إنجليزي)' : 'Requirements (English)'}</label>
              <textarea
                name="requirementsEn"
                value={formData.requirementsEn}
                onChange={handleChange}
                rows={6}
                placeholder="Write job requirements..."
              />
            </div>
          </div>

          <div className={styles.actions}>
            <Link href="/employers/jobs" className="btn btn-secondary">
              {locale === 'ar' ? 'إلغاء' : 'Cancel'}
            </Link>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (locale === 'ar' ? 'جاري النشر...' : 'Publishing...') : (locale === 'ar' ? 'نشر الوظيفة' : 'Publish Job')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
