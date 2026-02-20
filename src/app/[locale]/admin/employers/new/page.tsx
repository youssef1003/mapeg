'use client'

import { useState } from 'react'
import { Link, useRouter } from '@/navigation'
import styles from '../../admin.module.css'
import formStyles from '../../jobs/new/page.module.css'

export default function NewEmployerPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    phone: '',
    industry: '',
    country: 'Egypt',
    website: '',
    description: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/employers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert('✅ تم إضافة الشركة بنجاح!')
        router.push('/admin/employers')
      } else {
        const data = await response.json()
        setError(data.error || 'فشل إضافة الشركة')
      }
    } catch (err) {
      setError('حدث خطأ في الاتصال')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className={styles.pageHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/admin/employers" className="btn btn-secondary" style={{ padding: '0.5rem' }}>
            ➡️
          </Link>
          <div>
            <h1>إضافة شركة جديدة</h1>
            <p>أدخل تفاصيل الشركة لإضافتها إلى المنصة</p>
          </div>
        </div>
      </div>

      <div className={formStyles.formCard}>
        {error && (
          <div style={{ 
            background: '#fee', 
            color: '#c33', 
            padding: '1rem', 
            borderRadius: '8px', 
            marginBottom: '1.5rem',
            border: '1px solid #fcc'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <h3 className={formStyles.sectionTitle}>معلومات الشركة</h3>
          <div className={formStyles.formGrid}>
            <div className={`${formStyles.formGroup} ${formStyles.fullWidth}`}>
              <label>اسم الشركة <span className={formStyles.required}>*</span></label>
              <input
                type="text"
                className={formStyles.formInput}
                placeholder="مثال: شركة التكنولوجيا المتقدمة"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                required
              />
            </div>

            <div className={formStyles.formGroup}>
              <label>البريد الإلكتروني <span className={formStyles.required}>*</span></label>
              <input
                type="email"
                className={formStyles.formInput}
                placeholder="hr@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className={formStyles.formGroup}>
              <label>رقم الهاتف</label>
              <input
                type="tel"
                className={formStyles.formInput}
                placeholder="+20 123 456 7890"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className={formStyles.formGroup}>
              <label>المجال</label>
              <select
                className={formStyles.formSelect}
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              >
                <option value="">اختر المجال</option>
                <option value="تكنولوجيا">تكنولوجيا</option>
                <option value="تسويق">تسويق</option>
                <option value="هندسة">هندسة</option>
                <option value="تصميم">تصميم</option>
                <option value="مالية">مالية</option>
                <option value="موارد بشرية">موارد بشرية</option>
                <option value="مبيعات">مبيعات</option>
                <option value="رعاية صحية">رعاية صحية</option>
                <option value="تعليم">تعليم</option>
                <option value="أخرى">أخرى</option>
              </select>
            </div>

            <div className={formStyles.formGroup}>
              <label>الدولة</label>
              <select
                className={formStyles.formSelect}
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              >
                <option value="Egypt">مصر</option>
                <option value="Saudi Arabia">السعودية</option>
                <option value="UAE">الإمارات</option>
                <option value="Qatar">قطر</option>
                <option value="Kuwait">الكويت</option>
                <option value="Bahrain">البحرين</option>
                <option value="Oman">عمان</option>
                <option value="Jordan">الأردن</option>
                <option value="Lebanon">لبنان</option>
              </select>
            </div>

            <div className={`${formStyles.formGroup} ${formStyles.fullWidth}`}>
              <label>الموقع الإلكتروني</label>
              <input
                type="url"
                className={formStyles.formInput}
                placeholder="https://www.company.com"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />
            </div>

            <div className={`${formStyles.formGroup} ${formStyles.fullWidth}`}>
              <label>وصف الشركة</label>
              <textarea
                className={formStyles.formTextarea}
                placeholder="نبذة عن الشركة ونشاطها..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>
          </div>

          <div className={formStyles.formActions}>
            <Link href="/admin/employers" className={formStyles.cancelBtn}>
              إلغاء
            </Link>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'جاري الإضافة...' : 'إضافة الشركة'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
