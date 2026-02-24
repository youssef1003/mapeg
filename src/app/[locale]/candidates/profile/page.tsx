'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { useToast } from '@/contexts/ToastContext'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import styles from './page.module.css'

interface CandidateProfile {
  id: string
  name: string
  email: string
  phone: string
  profession?: string
  yearsOfExperience?: number
  city?: string
  skills: string
  summary?: string
  cvFilePath?: string
  profileImage?: string
}

export default function CandidateProfilePage() {
  const t = useTranslations('Navigation')
  const params = useParams()
  const locale = (params?.locale as string) || 'ar'
  const toast = useToast()
  
  const [profile, setProfile] = useState<CandidateProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingCV, setUploadingCV] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  
  const cvInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/candidates/profile', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
      } else if (response.status === 401) {
        window.location.href = `/${locale}/auth/login?redirect=/candidates/profile`
      } else {
        toast.error(locale === 'ar' ? 'فشل تحميل الملف الشخصي' : 'Failed to load profile')
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast.error(locale === 'ar' ? 'حدث خطأ أثناء التحميل' : 'Error loading profile')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!profile) return
    
    setSaving(true)
    try {
      const response = await fetch('/api/candidates/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(profile),
      })

      if (response.ok) {
        toast.success(locale === 'ar' ? 'تم حفظ التغييرات بنجاح!' : 'Changes saved successfully!')
        await fetchProfile()
      } else {
        toast.error(locale === 'ar' ? 'فشل حفظ التغييرات' : 'Failed to save changes')
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      toast.error(locale === 'ar' ? 'حدث خطأ أثناء الحفظ' : 'Error saving profile')
    } finally {
      setSaving(false)
    }
  }

  const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(file.type)) {
      toast.error(locale === 'ar' ? 'يرجى رفع ملف PDF أو Word فقط' : 'Please upload PDF or Word file only')
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error(locale === 'ar' ? 'حجم الملف يجب أن يكون أقل من 5 ميجابايت' : 'File size must be less than 5MB')
      return
    }

    setUploadingCV(true)
    const formData = new FormData()
    formData.append('cv', file)

    try {
      const response = await fetch('/api/upload/cv', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setProfile(prev => prev ? { ...prev, cvFilePath: data.filePath } : null)
        toast.success(locale === 'ar' ? 'تم رفع السيرة الذاتية بنجاح!' : 'CV uploaded successfully!')
      } else {
        toast.error(locale === 'ar' ? 'فشل رفع السيرة الذاتية' : 'Failed to upload CV')
      }
    } catch (error) {
      console.error('Error uploading CV:', error)
      toast.error(locale === 'ar' ? 'حدث خطأ أثناء الرفع' : 'Error uploading CV')
    } finally {
      setUploadingCV(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error(locale === 'ar' ? 'يرجى رفع صورة فقط' : 'Please upload an image only')
      return
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error(locale === 'ar' ? 'حجم الصورة يجب أن يكون أقل من 2 ميجابايت' : 'Image size must be less than 2MB')
      return
    }

    setUploadingImage(true)
    const formData = new FormData()
    formData.append('image', file)

    try {
      const response = await fetch('/api/upload/profile-image', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setProfile(prev => prev ? { ...prev, profileImage: data.imageUrl } : null)
        toast.success(locale === 'ar' ? 'تم رفع الصورة بنجاح!' : 'Image uploaded successfully!')
      } else {
        toast.error(locale === 'ar' ? 'فشل رفع الصورة' : 'Failed to upload image')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error(locale === 'ar' ? 'حدث خطأ أثناء الرفع' : 'Error uploading image')
    } finally {
      setUploadingImage(false)
    }
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <LoadingSpinner size="large" />
          <p>{locale === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>{locale === 'ar' ? 'لم يتم العثور على الملف الشخصي' : 'Profile not found'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1>{locale === 'ar' ? 'ملفي الشخصي' : 'My Profile'}</h1>
          <p>{locale === 'ar' ? 'إدارة معلوماتك الشخصية والمهنية' : 'Manage your personal and professional information'}</p>
        </div>

        {/* Profile Header Card */}
        <div className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <div className={styles.avatarSection}>
              <div className={styles.avatarWrapper}>
                {profile.profileImage ? (
                  <img src={profile.profileImage} alt={profile.name} className={styles.avatarImage} />
                ) : (
                  <div className={styles.avatarPlaceholder}>
                    {profile.name.charAt(0).toUpperCase()}
                  </div>
                )}
                {uploadingImage && (
                  <div className={styles.uploadingOverlay}>
                    <LoadingSpinner size="small" color="white" />
                  </div>
                )}
              </div>
              <button
                onClick={() => imageInputRef.current?.click()}
                className={styles.changePhotoBtn}
                disabled={uploadingImage}
              >
                📷 {locale === 'ar' ? 'تغيير الصورة' : 'Change Photo'}
              </button>
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </div>
            <div className={styles.profileInfo}>
              <h2>{profile.name}</h2>
              <p className={styles.email}>✉️ {profile.email}</p>
              {profile.phone && <p className={styles.phone}>📱 {profile.phone}</p>}
              {profile.profession && <p className={styles.profession}>💼 {profile.profession}</p>}
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>{locale === 'ar' ? 'المعلومات الشخصية' : 'Personal Information'}</h3>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>{locale === 'ar' ? 'الاسم الكامل' : 'Full Name'} *</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder={locale === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your full name'}
              />
            </div>
            <div className={styles.formGroup}>
              <label>{locale === 'ar' ? 'البريد الإلكتروني' : 'Email'} *</label>
              <input
                type="email"
                value={profile.email}
                disabled
                className={styles.disabledInput}
              />
              <small>{locale === 'ar' ? 'لا يمكن تغيير البريد الإلكتروني' : 'Email cannot be changed'}</small>
            </div>
            <div className={styles.formGroup}>
              <label>{locale === 'ar' ? 'رقم الهاتف' : 'Phone Number'} *</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder={locale === 'ar' ? '+20 xxx xxx xxxx' : '+20 xxx xxx xxxx'}
              />
            </div>
            <div className={styles.formGroup}>
              <label>{locale === 'ar' ? 'المدينة' : 'City'}</label>
              <input
                type="text"
                value={profile.city || ''}
                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                placeholder={locale === 'ar' ? 'القاهرة، مصر' : 'Cairo, Egypt'}
              />
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>{locale === 'ar' ? 'المعلومات المهنية' : 'Professional Information'}</h3>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>{locale === 'ar' ? 'المهنة / المسمى الوظيفي' : 'Profession / Job Title'}</label>
              <input
                type="text"
                value={profile.profession || ''}
                onChange={(e) => setProfile({ ...profile, profession: e.target.value })}
                placeholder={locale === 'ar' ? 'مثال: مهندس برمجيات' : 'e.g. Software Engineer'}
              />
            </div>
            <div className={styles.formGroup}>
              <label>{locale === 'ar' ? 'سنوات الخبرة' : 'Years of Experience'}</label>
              <input
                type="number"
                value={profile.yearsOfExperience || ''}
                onChange={(e) => setProfile({ ...profile, yearsOfExperience: parseInt(e.target.value) || 0 })}
                placeholder="5"
                min="0"
              />
            </div>
            <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
              <label>{locale === 'ar' ? 'المهارات' : 'Skills'} *</label>
              <input
                type="text"
                value={profile.skills}
                onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
                placeholder={locale === 'ar' ? 'مثال: JavaScript, React, Node.js' : 'e.g. JavaScript, React, Node.js'}
              />
              <small>{locale === 'ar' ? 'افصل المهارات بفواصل' : 'Separate skills with commas'}</small>
            </div>
            <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
              <label>{locale === 'ar' ? 'نبذة مختصرة' : 'Summary'}</label>
              <textarea
                value={profile.summary || ''}
                onChange={(e) => setProfile({ ...profile, summary: e.target.value })}
                placeholder={locale === 'ar' ? 'اكتب نبذة مختصرة عن خلفيتك المهنية...' : 'Write a brief summary about your professional background...'}
                rows={4}
              />
            </div>
          </div>
        </div>

        {/* CV Upload */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>{locale === 'ar' ? 'السيرة الذاتية' : 'Curriculum Vitae'}</h3>
          <div className={styles.cvSection}>
            {profile.cvFilePath ? (
              <div className={styles.cvUploaded}>
                <div className={styles.cvInfo}>
                  <span className={styles.cvIcon}>📄</span>
                  <div>
                    <p className={styles.cvName}>{locale === 'ar' ? 'السيرة الذاتية' : 'Resume.pdf'}</p>
                    <p className={styles.cvStatus}>{locale === 'ar' ? 'تم الرفع بنجاح' : 'Uploaded successfully'}</p>
                  </div>
                </div>
                <div className={styles.cvActions}>
                  <a
                    href={`/api/cv?pathname=${encodeURIComponent(profile.cvFilePath)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.cvBtn}
                  >
                    👁️ {locale === 'ar' ? 'عرض' : 'View'}
                  </a>
                  <button
                    onClick={() => cvInputRef.current?.click()}
                    className={styles.cvBtn}
                    disabled={uploadingCV}
                  >
                    🔄 {locale === 'ar' ? 'استبدال' : 'Replace'}
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.cvUpload}>
                <div className={styles.uploadIcon}>📄</div>
                <p className={styles.uploadText}>
                  {locale === 'ar' ? 'لم يتم رفع سيرة ذاتية بعد' : 'No CV uploaded yet'}
                </p>
                <button
                  onClick={() => cvInputRef.current?.click()}
                  className="btn btn-primary"
                  disabled={uploadingCV}
                >
                  {uploadingCV ? (
                    <>
                      <LoadingSpinner size="small" color="white" />
                      <span>{locale === 'ar' ? 'جاري الرفع...' : 'Uploading...'}</span>
                    </>
                  ) : (
                    <>{locale === 'ar' ? '📤 رفع السيرة الذاتية' : '📤 Upload CV'}</>
                  )}
                </button>
                <small>{locale === 'ar' ? 'PDF أو Word، حد أقصى 5 ميجابايت' : 'PDF or Word, max 5MB'}</small>
              </div>
            )}
            <input
              ref={cvInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleCVUpload}
              style={{ display: 'none' }}
            />
          </div>
        </div>

        {/* Save Button */}
        <div className={styles.saveSection}>
          <button
            onClick={handleSave}
            className="btn btn-primary"
            disabled={saving}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {saving ? (
              <>
                <LoadingSpinner size="small" color="white" />
                <span>{locale === 'ar' ? 'جاري الحفظ...' : 'Saving...'}</span>
              </>
            ) : (
              <>{locale === 'ar' ? '💾 حفظ التغييرات' : '💾 Save Changes'}</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
