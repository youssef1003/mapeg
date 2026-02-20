'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import styles from './page.module.css'

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
}

interface AboutMilestone {
  year: string
  titleAr: string
  titleEn: string
  descriptionAr: string
  descriptionEn: string
}

interface AboutTeamMember {
  nameAr: string
  nameEn: string
  roleAr: string
  roleEn: string
  bioAr: string
  bioEn: string
  image: string | null
}

interface AboutOffice {
  icon: string
  nameAr: string
  nameEn: string
  labelAr: string
  labelEn: string
  addressAr: string
  addressEn: string
}

export default function AboutPage() {
  const params = useParams()
  const locale = params.locale as string || 'ar'
  const isArabic = locale === 'ar'

  const [loading, setLoading] = useState(true)
  const [content, setContent] = useState<AboutContent | null>(null)
  const [values, setValues] = useState<AboutValue[]>([])
  const [milestones, setMilestones] = useState<AboutMilestone[]>([])
  const [team, setTeam] = useState<AboutTeamMember[]>([])
  const [offices, setOffices] = useState<AboutOffice[]>([])

  useEffect(() => {
    fetchAboutPage()
  }, [])

  const fetchAboutPage = async () => {
    try {
      const response = await fetch('/api/about', { cache: 'no-store' })
      if (response.ok) {
        const data = await response.json()
        setContent(data.content)
        setValues(data.values || [])
        setMilestones(data.milestones || [])
        setTeam(data.team || [])
        setOffices(data.offices || [])
      }
    } catch (error) {
      console.error('Error fetching about page:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div style={{ padding: '4rem', textAlign: 'center' }}>جاري التحميل...</div>
  }

  // Default values if no content in database
  const defaultContent: AboutContent = {
    heroTitleAr: 'من نحن',
    heroTitleEn: 'About Us',
    heroHighlightAr: 'MapEg',
    heroHighlightEn: 'MapEg',
    heroSubtitleAr: 'نحن منصة توظيف رائدة تربط المواهب بالفرص في الشرق الأوسط',
    heroSubtitleEn: 'We are a leading recruitment platform connecting talents with opportunities in the Middle East',
    missionTitleAr: 'مهمتنا',
    missionTitleEn: 'Our Mission',
    missionTextAr: 'نسعى لتسهيل عملية التوظيف وربط أفضل المواهب بأفضل الفرص',
    missionTextEn: 'We strive to facilitate the recruitment process and connect the best talents with the best opportunities',
    candidatesPlaced: '15,000+',
    partnerCompanies: '2,500+',
    countriesCovered: '10+',
    valuesTitleAr: 'قيمنا الأساسية',
    valuesTitleEn: 'Our Core Values',
    valuesSubtitleAr: 'المبادئ التي نؤمن بها',
    valuesSubtitleEn: 'The principles we believe in',
  }

  const c = content || defaultContent

  return (
    <div className={styles.aboutPage}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className="container">
          <h1>
            {isArabic ? c.heroTitleAr : c.heroTitleEn}{' '}
            <span className="gradient-text">{isArabic ? c.heroHighlightAr : c.heroHighlightEn}</span>
          </h1>
          <p>{isArabic ? c.heroSubtitleAr : c.heroSubtitleEn}</p>
        </div>
      </section>

      {/* Mission */}
      <section className={`section ${styles.mission}`}>
        <div className="container">
          <div className={styles.missionGrid}>
            <div className={styles.missionContent}>
              <h2>{isArabic ? c.missionTitleAr : c.missionTitleEn}</h2>
              <p className={styles.missionText}>
                {isArabic ? c.missionTextAr : c.missionTextEn}
              </p>
            </div>
            <div className={styles.missionVisual}>
              <div className={styles.statsCard}>
                <div className={styles.stat}>
                  <span className={styles.statNumber}>{c.candidatesPlaced}</span>
                  <span className={styles.statLabel}>
                    {isArabic ? 'مرشح تم توظيفهم' : 'Candidates Placed'}
                  </span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statNumber}>{c.partnerCompanies}</span>
                  <span className={styles.statLabel}>
                    {isArabic ? 'شركة شريكة' : 'Partner Companies'}
                  </span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statNumber}>{c.countriesCovered}</span>
                  <span className={styles.statLabel}>
                    {isArabic ? 'دولة مغطاة' : 'Countries Covered'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      {values.length > 0 && (
        <section className={`section ${styles.values}`}>
          <div className="container">
            <h2 className="section-title">
              {isArabic ? c.valuesTitleAr : c.valuesTitleEn}
            </h2>
            <p className="section-subtitle">{isArabic ? c.valuesSubtitleAr : c.valuesSubtitleEn}</p>
            <div className={styles.valuesGrid}>
              {values.map((value, index) => (
                <div key={index} className={styles.valueCard}>
                  <div className={styles.valueIcon}>{value.icon}</div>
                  <h3>{isArabic ? value.titleAr : value.titleEn}</h3>
                  <p>{isArabic ? value.descriptionAr : value.descriptionEn}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Timeline */}
      {milestones.length > 0 && (
        <section className={`section ${styles.timeline}`}>
          <div className="container">
            <h2 className="section-title">
              {isArabic ? 'رحلتنا' : 'Our Journey'}
            </h2>
            <div className={styles.timelineWrapper}>
              {milestones.map((milestone, index) => (
                <div key={index} className={styles.timelineItem}>
                  <div className={styles.timelineYear}>{milestone.year}</div>
                  <div className={styles.timelineContent}>
                    <h3>{isArabic ? milestone.titleAr : milestone.titleEn}</h3>
                    <p>{isArabic ? milestone.descriptionAr : milestone.descriptionEn}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Team */}
      {team.length > 0 && (
        <section className={`section ${styles.team}`}>
          <div className="container">
            <h2 className="section-title">
              {isArabic ? 'فريق القيادة' : 'Leadership Team'}
            </h2>
            <p className="section-subtitle">
              {isArabic ? 'تعرف على فريقنا المتميز' : 'Meet our exceptional team'}
            </p>
            <div className={styles.teamGrid}>
              {team.map((member, index) => (
                <div key={index} className={styles.teamCard}>
                  <div className={styles.teamAvatar}>
                    {(isArabic ? member.nameAr : member.nameEn).charAt(0)}
                  </div>
                  <h3>{isArabic ? member.nameAr : member.nameEn}</h3>
                  <p className={styles.teamRole}>{isArabic ? member.roleAr : member.roleEn}</p>
                  <p className={styles.teamBio}>{isArabic ? member.bioAr : member.bioEn}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Offices */}
      {offices.length > 0 && (
        <section className={`section ${styles.offices}`}>
          <div className="container">
            <h2 className="section-title">
              {isArabic ? 'مكاتبنا' : 'Our Offices'}
            </h2>
            <p className="section-subtitle">
              {isArabic ? 'نحن موجودون في عدة دول' : 'We are present in multiple countries'}
            </p>
            <div className={styles.officesGrid}>
              {offices.map((office, index) => (
                <div key={index} className={styles.officeCard}>
                  <div className={styles.officeIcon}>{office.icon}</div>
                  <h3>{isArabic ? office.nameAr : office.nameEn}</h3>
                  <p>{isArabic ? office.labelAr : office.labelEn}</p>
                  <address>{isArabic ? office.addressAr : office.addressEn}</address>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
