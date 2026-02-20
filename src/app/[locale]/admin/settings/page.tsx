'use client'

import { useState, useEffect } from 'react'
import styles from '../admin.module.css'
import pageStyles from './page.module.css'

interface SiteSettings {
    siteName: string
    siteEmail: string
    sitePhone: string
    siteAddress: string
    candidatesPlaced: string
    partnerCompanies: string
    countriesCovered: string
    successRate: string
    heroJobsToday: string
    heroCountries: string
    aboutCandidates: string
    aboutCompanies: string
    aboutMissionAr: string
    aboutMissionEn: string
    facebookUrl: string
    twitterUrl: string
    linkedinUrl: string
    instagramUrl: string
    whatsappNumber: string
}

export default function AdminSettingsPage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [settings, setSettings] = useState<SiteSettings>({
        siteName: '',
        siteEmail: '',
        sitePhone: '',
        siteAddress: '',
        candidatesPlaced: '',
        partnerCompanies: '',
        countriesCovered: '',
        successRate: '',
        heroJobsToday: '',
        heroCountries: '',
        aboutCandidates: '',
        aboutCompanies: '',
        aboutMissionAr: '',
        aboutMissionEn: '',
        facebookUrl: '',
        twitterUrl: '',
        linkedinUrl: '',
        instagramUrl: '',
        whatsappNumber: '',
    })

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        try {
            const response = await fetch('/api/admin/settings', {
                cache: 'no-store'
            })
            if (response.ok) {
                const data = await response.json()
                setSettings({
                    siteName: data.siteName || '',
                    siteEmail: data.siteEmail || '',
                    sitePhone: data.sitePhone || '',
                    siteAddress: data.siteAddress || '',
                    candidatesPlaced: data.candidatesPlaced || '',
                    partnerCompanies: data.partnerCompanies || '',
                    countriesCovered: data.countriesCovered || '',
                    successRate: data.successRate || '',
                    heroJobsToday: data.heroJobsToday || '',
                    heroCountries: data.heroCountries || '',
                    aboutCandidates: data.aboutCandidates || '',
                    aboutCompanies: data.aboutCompanies || '',
                    aboutMissionAr: data.aboutMissionAr || '',
                    aboutMissionEn: data.aboutMissionEn || '',
                    facebookUrl: data.facebookUrl || '',
                    twitterUrl: data.twitterUrl || '',
                    linkedinUrl: data.linkedinUrl || '',
                    instagramUrl: data.instagramUrl || '',
                    whatsappNumber: data.whatsappNumber || '',
                })
            }
        } catch (error) {
            console.error('Error fetching settings:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            const response = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(settings),
            })

            if (response.ok) {
                alert('✅ تم حفظ الإعدادات بنجاح!')
                // Re-fetch settings to ensure UI shows persisted values
                await fetchSettings()
            } else {
                throw new Error('Failed to save settings')
            }
        } catch (error) {
            console.error('Error saving settings:', error)
            alert('❌ حدث خطأ أثناء حفظ الإعدادات. حاول مرة أخرى.')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <>
                <div className={styles.pageHeader}>
                    <h1>الإعدادات</h1>
                    <p>جاري تحميل الإعدادات...</p>
                </div>
            </>
        )
    }

    return (
        <>
            <div className={styles.pageHeader}>
                <h1>الإعدادات</h1>
                <p>إدارة إعدادات المنصة والتفضيلات</p>
            </div>

            <div className={pageStyles.settingsGrid}>
                {/* General Settings */}
                <div className={pageStyles.settingsCard}>
                    <h3 className={pageStyles.cardTitle}>
                        <span>⚙️</span>
                        الإعدادات العامة
                    </h3>
                    <div className={pageStyles.settingsForm}>
                        <div className={pageStyles.formGroup}>
                            <label>اسم الموقع</label>
                            <input
                                type="text"
                                value={settings.siteName}
                                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                            />
                        </div>
                        <div className={pageStyles.formGroup}>
                            <label>البريد الإلكتروني</label>
                            <input
                                type="email"
                                value={settings.siteEmail}
                                onChange={(e) => setSettings({ ...settings, siteEmail: e.target.value })}
                            />
                        </div>
                        <div className={pageStyles.formGroup}>
                            <label>رقم الهاتف</label>
                            <input
                                type="tel"
                                value={settings.sitePhone}
                                onChange={(e) => setSettings({ ...settings, sitePhone: e.target.value })}
                            />
                        </div>
                        <div className={pageStyles.formGroup}>
                            <label>العنوان</label>
                            <textarea
                                value={settings.siteAddress}
                                onChange={(e) => setSettings({ ...settings, siteAddress: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* Stats Settings */}
                <div className={pageStyles.settingsCard}>
                    <h3 className={pageStyles.cardTitle}>
                        <span>📊</span>
                        إحصائيات الموقع
                    </h3>
                    <div className={pageStyles.settingsForm}>
                        <div className={pageStyles.formGroup}>
                            <label>عدد المرشحين الموظفين</label>
                            <input
                                type="text"
                                value={settings.candidatesPlaced}
                                onChange={(e) => setSettings({ ...settings, candidatesPlaced: e.target.value })}
                                placeholder="مثال: 15,000+"
                            />
                        </div>
                        <div className={pageStyles.formGroup}>
                            <label>عدد الشركات الشريكة</label>
                            <input
                                type="text"
                                value={settings.partnerCompanies}
                                onChange={(e) => setSettings({ ...settings, partnerCompanies: e.target.value })}
                                placeholder="مثال: 2,500+"
                            />
                        </div>
                        <div className={pageStyles.formGroup}>
                            <label>عدد الدول</label>
                            <input
                                type="text"
                                value={settings.countriesCovered}
                                onChange={(e) => setSettings({ ...settings, countriesCovered: e.target.value })}
                                placeholder="مثال: 10+"
                            />
                        </div>
                        <div className={pageStyles.formGroup}>
                            <label>نسبة النجاح</label>
                            <input
                                type="text"
                                value={settings.successRate}
                                onChange={(e) => setSettings({ ...settings, successRate: e.target.value })}
                                placeholder="مثال: 98%"
                            />
                        </div>
                    </div>
                </div>

                {/* Social Media Links */}
                <div className={pageStyles.settingsCard}>
                    <h3 className={pageStyles.cardTitle}>
                        <span>🔗</span>
                        روابط التواصل الاجتماعي
                    </h3>
                    <div className={pageStyles.settingsForm}>
                        <div className={pageStyles.formGroup}>
                            <label>فيسبوك</label>
                            <input
                                type="url"
                                value={settings.facebookUrl}
                                onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                                placeholder="https://facebook.com/yourpage"
                            />
                        </div>
                        <div className={pageStyles.formGroup}>
                            <label>تويتر / X</label>
                            <input
                                type="url"
                                value={settings.twitterUrl}
                                onChange={(e) => setSettings({ ...settings, twitterUrl: e.target.value })}
                                placeholder="https://twitter.com/yourhandle"
                            />
                        </div>
                        <div className={pageStyles.formGroup}>
                            <label>لينكد إن</label>
                            <input
                                type="url"
                                value={settings.linkedinUrl}
                                onChange={(e) => setSettings({ ...settings, linkedinUrl: e.target.value })}
                                placeholder="https://linkedin.com/company/yourcompany"
                            />
                        </div>
                        <div className={pageStyles.formGroup}>
                            <label>انستجرام</label>
                            <input
                                type="url"
                                value={settings.instagramUrl}
                                onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                                placeholder="https://instagram.com/yourhandle"
                            />
                        </div>
                        <div className={pageStyles.formGroup}>
                            <label>واتساب</label>
                            <input
                                type="text"
                                value={settings.whatsappNumber}
                                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                                placeholder="+201234567890"
                            />
                        </div>
                    </div>
                </div>

                {/* Hero Section Stats */}
                <div className={pageStyles.settingsCard}>
                    <h3 className={pageStyles.cardTitle}>
                        <span>🎯</span>
                        إحصائيات الصفحة الرئيسية
                    </h3>
                    <div className={pageStyles.settingsForm}>
                        <div className={pageStyles.formGroup}>
                            <label>الوظائف الجديدة اليوم</label>
                            <input
                                type="text"
                                value={settings.heroJobsToday}
                                onChange={(e) => setSettings({ ...settings, heroJobsToday: e.target.value })}
                                placeholder="مثال: 250+"
                            />
                        </div>
                        <div className={pageStyles.formGroup}>
                            <label>عدد الدول (Hero)</label>
                            <input
                                type="text"
                                value={settings.heroCountries}
                                onChange={(e) => setSettings({ ...settings, heroCountries: e.target.value })}
                                placeholder="مثال: 10+"
                            />
                        </div>
                    </div>
                </div>
                {/* About Page Content */}
                <div className={pageStyles.settingsCard}>
                    <h3 className={pageStyles.cardTitle}>
                        <span>📄</span>
                        محتوى صفحة &quot;من نحن&quot;
                    </h3>
                    <div className={pageStyles.settingsForm}>
                        <div className={pageStyles.formGroup}>
                            <label>رسالتنا (عربي)</label>
                            <textarea
                                value={settings.aboutMissionAr}
                                onChange={(e) => setSettings({ ...settings, aboutMissionAr: e.target.value })}
                                rows={4}
                                placeholder="اكتب رسالة الشركة بالعربي..."
                            />
                        </div>
                        <div className={pageStyles.formGroup}>
                            <label>Our Mission (English)</label>
                            <textarea
                                value={settings.aboutMissionEn}
                                onChange={(e) => setSettings({ ...settings, aboutMissionEn: e.target.value })}
                                rows={4}
                                placeholder="Write company mission in English..."
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className={pageStyles.saveSection}>
                <button
                    className="btn btn-primary"
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? '⏳ جاري الحفظ...' : '💾 حفظ الإعدادات'}
                </button>
            </div>
        </>
    )
}
