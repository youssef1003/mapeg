'use client'

import { useState, useEffect } from 'react'
import styles from '../settings/page.module.css'

interface AboutContent {
  heroTitleAr: string
  heroTitleEn: string
  heroHighlightAr: string
  heroHighlightEn: string
  heroSubtitleAr: string
  heroSubtitleEn: string
  missionTitleAr: string
  missionTitleEn: string
  missionTextAr: string
  missionTextEn: string
  candidatesPlaced: string
  partnerCompanies: string
  countriesCovered: string
  valuesTitleAr: string
  valuesTitleEn: string
  valuesSubtitleAr: string
  valuesSubtitleEn: string
}

interface AboutValue {
  icon: string
  titleAr: string
  titleEn: string
  descriptionAr: string
  descriptionEn: string
  order: number
}

interface AboutMilestone {
  year: string
  titleAr: string
  titleEn: string
  descriptionAr: string
  descriptionEn: string
  order: number
}

interface AboutTeamMember {
  nameAr: string
  nameEn: string
  roleAr: string
  roleEn: string
  bioAr: string
  bioEn: string
  image: string | null
  order: number
}

interface AboutOffice {
  icon: string
  nameAr: string
  nameEn: string
  labelAr: string
  labelEn: string
  addressAr: string
  addressEn: string
  order: number
}

export default function AboutSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  
  const [content, setContent] = useState<AboutContent>({
    heroTitleAr: 'من نحن',
    heroTitleEn: 'About Us',
    heroHighlightAr: 'MapEg',
    heroHighlightEn: 'MapEg',
    heroSubtitleAr: '',
    heroSubtitleEn: '',
    missionTitleAr: 'مهمتنا',
    missionTitleEn: 'Our Mission',
    missionTextAr: '',
    missionTextEn: '',
    candidatesPlaced: '15,000+',
    partnerCompanies: '2,500+',
    countriesCovered: '10+',
    valuesTitleAr: 'قيمنا الأساسية',
    valuesTitleEn: 'Our Core Values',
    valuesSubtitleAr: '',
    valuesSubtitleEn: '',
  })

  const [values, setValues] = useState<AboutValue[]>([])
  const [milestones, setMilestones] = useState<AboutMilestone[]>([])
  const [team, setTeam] = useState<AboutTeamMember[]>([])
  const [offices, setOffices] = useState<AboutOffice[]>([])

  useEffect(() => {
    console.log('🔵 تحميل الصفحة...')
    // تحقق من cookies
    const cookies = document.cookie
    console.log('🍪 Cookies:', cookies)
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    console.log('📥 جلب الإعدادات...')
    try {
      const response = await fetch('/api/admin/about-settings', { 
        cache: 'no-store',
        credentials: 'include' // مهم جداً لإرسال cookies
      })
      console.log('📥 استجابة جلب الإعدادات:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('📦 البيانات المستلمة:', data)
        if (data.content) setContent(data.content)
        if (data.values) setValues(data.values)
        if (data.milestones) setMilestones(data.milestones)
        if (data.team) setTeam(data.team)
        if (data.offices) setOffices(data.offices)
      } else {
        const error = await response.json()
        console.error('❌ خطأ في جلب الإعدادات:', error)
      }
    } catch (error) {
      console.error('❌ خطأ:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    console.log('🔵 بدء عملية الحفظ...')
    console.log('🍪 Cookies قبل الحفظ:', document.cookie)
    setSaving(true)
    setMessage('')

    try {
      console.log('📤 إرسال البيانات:', { content, values, milestones, team, offices })
      
      const response = await fetch('/api/admin/about-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // مهم جداً لإرسال cookies
        body: JSON.stringify({ content, values, milestones, team, offices }),
      })

      console.log('📥 استجابة السيرفر:', response.status, response.statusText)
      
      const data = await response.json()
      console.log('📦 البيانات المستلمة:', data)

      if (response.ok) {
        setMessage('✅ تم حفظ الإعدادات بنجاح')
        setTimeout(() => setMessage(''), 3000)
        // إعادة تحميل البيانات للتأكد من الحفظ
        await fetchSettings()
      } else {
        console.error('❌ فشل الحفظ:', data)
        setMessage(`❌ فشل حفظ الإعدادات: ${data.error || 'خطأ غير معروف'}`)
      }
    } catch (error) {
      console.error('❌ خطأ في الحفظ:', error)
      setMessage(`❌ حدث خطأ أثناء الحفظ: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`)
    } finally {
      setSaving(false)
      console.log('🔵 انتهت عملية الحفظ')
    }
  }

  if (loading) {
    return <div className={styles.loading}>جاري التحميل...</div>
  }

  return (
    <div className={styles.settingsPage}>
      <div className={styles.pageHeader}>
        <h1>⚙️ إعدادات صفحة من نحن</h1>
        <p>تحكم كامل في محتوى صفحة من نحن</p>
      </div>

      {message && (
        <div className={`${styles.message} ${message.includes('✅') ? styles.success : styles.error}`}>
          {message}
        </div>
      )}

      <div className={styles.settingsForm}>
        {/* Hero Section */}
        <div className={styles.formSection}>
          <h2>🎯 قسم البطل (Hero)</h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>العنوان (عربي)</label>
              <input
                type="text"
                value={content.heroTitleAr}
                onChange={(e) => setContent({ ...content, heroTitleAr: e.target.value })}
              />
            </div>
            <div className={styles.formGroup}>
              <label>العنوان (English)</label>
              <input
                type="text"
                value={content.heroTitleEn}
                onChange={(e) => setContent({ ...content, heroTitleEn: e.target.value })}
              />
            </div>
            <div className={styles.formGroup}>
              <label>النص المميز (عربي)</label>
              <input
                type="text"
                value={content.heroHighlightAr}
                onChange={(e) => setContent({ ...content, heroHighlightAr: e.target.value })}
              />
            </div>
            <div className={styles.formGroup}>
              <label>النص المميز (English)</label>
              <input
                type="text"
                value={content.heroHighlightEn}
                onChange={(e) => setContent({ ...content, heroHighlightEn: e.target.value })}
              />
            </div>
            <div className={styles.formGroup}>
              <label>العنوان الفرعي (عربي)</label>
              <textarea
                value={content.heroSubtitleAr}
                onChange={(e) => setContent({ ...content, heroSubtitleAr: e.target.value })}
                rows={3}
              />
            </div>
            <div className={styles.formGroup}>
              <label>العنوان الفرعي (English)</label>
              <textarea
                value={content.heroSubtitleEn}
                onChange={(e) => setContent({ ...content, heroSubtitleEn: e.target.value })}
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className={styles.formSection}>
          <h2>🎯 قسم المهمة</h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>عنوان المهمة (عربي)</label>
              <input
                type="text"
                value={content.missionTitleAr}
                onChange={(e) => setContent({ ...content, missionTitleAr: e.target.value })}
              />
            </div>
            <div className={styles.formGroup}>
              <label>عنوان المهمة (English)</label>
              <input
                type="text"
                value={content.missionTitleEn}
                onChange={(e) => setContent({ ...content, missionTitleEn: e.target.value })}
              />
            </div>
            <div className={styles.formGroup}>
              <label>نص المهمة (عربي)</label>
              <textarea
                value={content.missionTextAr}
                onChange={(e) => setContent({ ...content, missionTextAr: e.target.value })}
                rows={5}
              />
            </div>
            <div className={styles.formGroup}>
              <label>نص المهمة (English)</label>
              <textarea
                value={content.missionTextEn}
                onChange={(e) => setContent({ ...content, missionTextEn: e.target.value })}
                rows={5}
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className={styles.formSection}>
          <h2>📊 الإحصائيات</h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>المرشحين الموظفين</label>
              <input
                type="text"
                value={content.candidatesPlaced}
                onChange={(e) => setContent({ ...content, candidatesPlaced: e.target.value })}
              />
            </div>
            <div className={styles.formGroup}>
              <label>الشركات الشريكة</label>
              <input
                type="text"
                value={content.partnerCompanies}
                onChange={(e) => setContent({ ...content, partnerCompanies: e.target.value })}
              />
            </div>
            <div className={styles.formGroup}>
              <label>الدول المغطاة</label>
              <input
                type="text"
                value={content.countriesCovered}
                onChange={(e) => setContent({ ...content, countriesCovered: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className={styles.formSection}>
          <h2>💎 قسم القيم</h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>عنوان القيم (عربي)</label>
              <input
                type="text"
                value={content.valuesTitleAr}
                onChange={(e) => setContent({ ...content, valuesTitleAr: e.target.value })}
              />
            </div>
            <div className={styles.formGroup}>
              <label>عنوان القيم (English)</label>
              <input
                type="text"
                value={content.valuesTitleEn}
                onChange={(e) => setContent({ ...content, valuesTitleEn: e.target.value })}
              />
            </div>
            <div className={styles.formGroup}>
              <label>العنوان الفرعي (عربي)</label>
              <textarea
                value={content.valuesSubtitleAr}
                onChange={(e) => setContent({ ...content, valuesSubtitleAr: e.target.value })}
                rows={2}
              />
            </div>
            <div className={styles.formGroup}>
              <label>العنوان الفرعي (English)</label>
              <textarea
                value={content.valuesSubtitleEn}
                onChange={(e) => setContent({ ...content, valuesSubtitleEn: e.target.value })}
                rows={2}
              />
            </div>
          </div>

          <h3 style={{ marginTop: '2rem' }}>القيم الأساسية</h3>
          <button
            onClick={() => setValues([...values, { icon: '🎯', titleAr: '', titleEn: '', descriptionAr: '', descriptionEn: '', order: values.length }])}
            className="btn btn-secondary"
            style={{ marginBottom: '1rem' }}
          >
            ➕ إضافة قيمة
          </button>
          
          {values.map((value, index) => (
            <div key={index} className={styles.arrayItem}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>الأيقونة (Emoji)</label>
                  <input
                    type="text"
                    value={value.icon}
                    onChange={(e) => {
                      const newValues = [...values]
                      newValues[index].icon = e.target.value
                      setValues(newValues)
                    }}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>العنوان (عربي)</label>
                  <input
                    type="text"
                    value={value.titleAr}
                    onChange={(e) => {
                      const newValues = [...values]
                      newValues[index].titleAr = e.target.value
                      setValues(newValues)
                    }}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>العنوان (English)</label>
                  <input
                    type="text"
                    value={value.titleEn}
                    onChange={(e) => {
                      const newValues = [...values]
                      newValues[index].titleEn = e.target.value
                      setValues(newValues)
                    }}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>الوصف (عربي)</label>
                  <textarea
                    value={value.descriptionAr}
                    onChange={(e) => {
                      const newValues = [...values]
                      newValues[index].descriptionAr = e.target.value
                      setValues(newValues)
                    }}
                    rows={2}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>الوصف (English)</label>
                  <textarea
                    value={value.descriptionEn}
                    onChange={(e) => {
                      const newValues = [...values]
                      newValues[index].descriptionEn = e.target.value
                      setValues(newValues)
                    }}
                    rows={2}
                  />
                </div>
              </div>
              <button
                onClick={() => setValues(values.filter((_, i) => i !== index))}
                className="btn btn-danger"
                style={{ marginTop: '0.5rem' }}
              >
                🗑️ حذف
              </button>
            </div>
          ))}
        </div>

        {/* Milestones */}
        <div className={styles.formSection}>
          <h2>📅 المعالم التاريخية</h2>
          <button
            onClick={() => setMilestones([...milestones, { year: '', titleAr: '', titleEn: '', descriptionAr: '', descriptionEn: '', order: milestones.length }])}
            className="btn btn-secondary"
            style={{ marginBottom: '1rem' }}
          >
            ➕ إضافة معلم
          </button>
          
          {milestones.map((milestone, index) => (
            <div key={index} className={styles.arrayItem}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>السنة</label>
                  <input
                    type="text"
                    value={milestone.year}
                    onChange={(e) => {
                      const newMilestones = [...milestones]
                      newMilestones[index].year = e.target.value
                      setMilestones(newMilestones)
                    }}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>العنوان (عربي)</label>
                  <input
                    type="text"
                    value={milestone.titleAr}
                    onChange={(e) => {
                      const newMilestones = [...milestones]
                      newMilestones[index].titleAr = e.target.value
                      setMilestones(newMilestones)
                    }}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>العنوان (English)</label>
                  <input
                    type="text"
                    value={milestone.titleEn}
                    onChange={(e) => {
                      const newMilestones = [...milestones]
                      newMilestones[index].titleEn = e.target.value
                      setMilestones(newMilestones)
                    }}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>الوصف (عربي)</label>
                  <textarea
                    value={milestone.descriptionAr}
                    onChange={(e) => {
                      const newMilestones = [...milestones]
                      newMilestones[index].descriptionAr = e.target.value
                      setMilestones(newMilestones)
                    }}
                    rows={2}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>الوصف (English)</label>
                  <textarea
                    value={milestone.descriptionEn}
                    onChange={(e) => {
                      const newMilestones = [...milestones]
                      newMilestones[index].descriptionEn = e.target.value
                      setMilestones(newMilestones)
                    }}
                    rows={2}
                  />
                </div>
              </div>
              <button
                onClick={() => setMilestones(milestones.filter((_, i) => i !== index))}
                className="btn btn-danger"
                style={{ marginTop: '0.5rem' }}
              >
                🗑️ حذف
              </button>
            </div>
          ))}
        </div>

        {/* Team Members */}
        <div className={styles.formSection}>
          <h2>👥 فريق القيادة</h2>
          <button
            onClick={() => setTeam([...team, { nameAr: '', nameEn: '', roleAr: '', roleEn: '', bioAr: '', bioEn: '', image: null, order: team.length }])}
            className="btn btn-secondary"
            style={{ marginBottom: '1rem' }}
          >
            ➕ إضافة عضو
          </button>
          
          {team.map((member, index) => (
            <div key={index} className={styles.arrayItem}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>الاسم (عربي)</label>
                  <input
                    type="text"
                    value={member.nameAr}
                    onChange={(e) => {
                      const newTeam = [...team]
                      newTeam[index].nameAr = e.target.value
                      setTeam(newTeam)
                    }}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>الاسم (English)</label>
                  <input
                    type="text"
                    value={member.nameEn}
                    onChange={(e) => {
                      const newTeam = [...team]
                      newTeam[index].nameEn = e.target.value
                      setTeam(newTeam)
                    }}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>المنصب (عربي)</label>
                  <input
                    type="text"
                    value={member.roleAr}
                    onChange={(e) => {
                      const newTeam = [...team]
                      newTeam[index].roleAr = e.target.value
                      setTeam(newTeam)
                    }}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>المنصب (English)</label>
                  <input
                    type="text"
                    value={member.roleEn}
                    onChange={(e) => {
                      const newTeam = [...team]
                      newTeam[index].roleEn = e.target.value
                      setTeam(newTeam)
                    }}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>النبذة (عربي)</label>
                  <textarea
                    value={member.bioAr}
                    onChange={(e) => {
                      const newTeam = [...team]
                      newTeam[index].bioAr = e.target.value
                      setTeam(newTeam)
                    }}
                    rows={2}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>النبذة (English)</label>
                  <textarea
                    value={member.bioEn}
                    onChange={(e) => {
                      const newTeam = [...team]
                      newTeam[index].bioEn = e.target.value
                      setTeam(newTeam)
                    }}
                    rows={2}
                  />
                </div>
              </div>
              <button
                onClick={() => setTeam(team.filter((_, i) => i !== index))}
                className="btn btn-danger"
                style={{ marginTop: '0.5rem' }}
              >
                🗑️ حذف
              </button>
            </div>
          ))}
        </div>

        {/* Offices */}
        <div className={styles.formSection}>
          <h2>🏢 المكاتب</h2>
          <button
            onClick={() => setOffices([...offices, { icon: '🇪🇬', nameAr: '', nameEn: '', labelAr: '', labelEn: '', addressAr: '', addressEn: '', order: offices.length }])}
            className="btn btn-secondary"
            style={{ marginBottom: '1rem' }}
          >
            ➕ إضافة مكتب
          </button>
          
          {offices.map((office, index) => (
            <div key={index} className={styles.arrayItem}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>الأيقونة (Emoji)</label>
                  <input
                    type="text"
                    value={office.icon}
                    onChange={(e) => {
                      const newOffices = [...offices]
                      newOffices[index].icon = e.target.value
                      setOffices(newOffices)
                    }}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>الاسم (عربي)</label>
                  <input
                    type="text"
                    value={office.nameAr}
                    onChange={(e) => {
                      const newOffices = [...offices]
                      newOffices[index].nameAr = e.target.value
                      setOffices(newOffices)
                    }}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>الاسم (English)</label>
                  <input
                    type="text"
                    value={office.nameEn}
                    onChange={(e) => {
                      const newOffices = [...offices]
                      newOffices[index].nameEn = e.target.value
                      setOffices(newOffices)
                    }}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>التسمية (عربي)</label>
                  <input
                    type="text"
                    value={office.labelAr}
                    onChange={(e) => {
                      const newOffices = [...offices]
                      newOffices[index].labelAr = e.target.value
                      setOffices(newOffices)
                    }}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>التسمية (English)</label>
                  <input
                    type="text"
                    value={office.labelEn}
                    onChange={(e) => {
                      const newOffices = [...offices]
                      newOffices[index].labelEn = e.target.value
                      setOffices(newOffices)
                    }}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>العنوان (عربي)</label>
                  <textarea
                    value={office.addressAr}
                    onChange={(e) => {
                      const newOffices = [...offices]
                      newOffices[index].addressAr = e.target.value
                      setOffices(newOffices)
                    }}
                    rows={2}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>العنوان (English)</label>
                  <textarea
                    value={office.addressEn}
                    onChange={(e) => {
                      const newOffices = [...offices]
                      newOffices[index].addressEn = e.target.value
                      setOffices(newOffices)
                    }}
                    rows={2}
                  />
                </div>
              </div>
              <button
                onClick={() => setOffices(offices.filter((_, i) => i !== index))}
                className="btn btn-danger"
                style={{ marginTop: '0.5rem' }}
              >
                🗑️ حذف
              </button>
            </div>
          ))}
        </div>

        <div className={styles.formActions}>
          <button onClick={handleSave} disabled={saving} className="btn btn-primary">
            {saving ? 'جاري الحفظ...' : '💾 حفظ التغييرات'}
          </button>
        </div>
      </div>
    </div>
  )
}
