'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { COUNTRIES, CATEGORIES, JOB_TYPES } from '@/constants/taxonomy'
import styles from './page.module.css'

interface Job {
  id: string
  title: string
  company: string
  location: string
  type: string
  category: string
  description: string
  requirements: string
  salary?: string
  featured: boolean
}

export default function EditJobPage() {
  const router = useRouter()
  const params = useParams()
  const jobId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'ar' | 'en'>('ar')
  
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    country: 'EG',
    type: 'full-time',
    category: '',
    description: '',
    requirements: '',
    salary: '',
    featured: false,
    // English translations
    titleEn: '',
    descriptionEn: '',
    requirementsEn: '',
  })

  useEffect(() => {
    fetchJob()
  }, [jobId])

  const fetchJob = async () => {
    try {
      const response = await fetch(`/api/jobs/${jobId}`)
      if (response.ok) {
        const job = await response.json()
        setFormData({
          title: job.title || '',
          company: job.company || '',
          location: job.location || '',
          country: job.country || 'EG',
          type: job.type || 'full-time',
          category: job.category || '',
          description: job.description || '',
          requirements: job.requirements || '',
          salary: job.salary || '',
          featured: job.featured || false,
          // English translations
          titleEn: job.titleEn || '',
          descriptionEn: job.descriptionEn || '',
          requirementsEn: job.requirementsEn || '',
        })
      } else {
        setError('فشل تحميل بيانات الوظيفة')
      }
    } catch (err) {
      setError('حدث خطأ في تحميل البيانات')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          titleEn: formData.titleEn || null,
          descriptionEn: formData.descriptionEn || null,
          requirementsEn: formData.requirementsEn || null,
        }),
      })

      if (response.ok) {
        alert('✅ تم تحديث الوظيفة بنجاح!')
        router.push('/admin/jobs')
      } else {
        const data = await response.json()
        setError(data.error || 'فشل تحديث الوظيفة')
      }
    } catch (err) {
      setError('حدث خطأ في الاتصال')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <p>جاري تحميل بيانات الوظيفة...</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>تعديل الوظيفة</h1>
        <button onClick={() => router.back()} className="btn btn-secondary">
          رجوع
        </button>
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

      {error && <div className={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        {activeTab === 'ar' ? (
          // Arabic Fields
          <>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>عنوان الوظيفة *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>اسم الشركة *</label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>الموقع *</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>الدولة *</label>
            <select
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              required
            >
              {COUNTRIES.map(country => (
                <option key={country.value} value={country.value}>
                  {country.ar}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>نوع الوظيفة *</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              required
            >
              {JOB_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.ar}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>المجال</label>
            <select
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

          <div className={styles.formGroup}>
            <label>الراتب</label>
            <input
              type="text"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              placeholder="مثال: 5000-7000 جنيه"
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>وصف الوظيفة *</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={6}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>المتطلبات *</label>
          <textarea
            value={formData.requirements}
            onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
            rows={6}
            required
          />
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

            <div className={styles.formGroup}>
              <label>Job Title (English)</label>
              <input
                type="text"
                value={formData.titleEn}
                onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                placeholder="e.g., Senior Software Engineer"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Job Description (English)</label>
              <textarea
                value={formData.descriptionEn}
                onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                rows={6}
                placeholder="Detailed job description in English..."
              />
            </div>

            <div className={styles.formGroup}>
              <label>Requirements (English)</label>
              <textarea
                value={formData.requirementsEn}
                onChange={(e) => setFormData({ ...formData, requirementsEn: e.target.value })}
                rows={6}
                placeholder="Required qualifications, experience, and technical skills..."
              />
            </div>
          </>
        )}

        <div className={styles.formGroup}>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            />
            <span>وظيفة مميزة ⭐</span>
          </label>
        </div>

        <div className={styles.actions}>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
          </button>
          <button type="button" onClick={() => router.back()} className="btn btn-secondary">
            إلغاء
          </button>
        </div>
      </form>
    </div>
  )
}
