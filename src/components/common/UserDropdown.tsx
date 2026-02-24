'use client'

import { useState, useRef, useEffect } from 'react'
import { Link } from '@/navigation'
import styles from './UserDropdown.module.css'

interface UserDropdownProps {
  userName: string
  userRole: 'ADMIN' | 'CANDIDATE' | 'EMPLOYER'
  onLogout: () => void
  currentLocale: string
}

export default function UserDropdown({ userName, userRole, onLogout, currentLocale }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Get user initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  // Get role-specific links
  const getRoleLinks = () => {
    if (userRole === 'ADMIN') {
      return [
        { href: '/admin', icon: '📊', label: currentLocale === 'ar' ? 'لوحة التحكم' : 'Dashboard' },
        { href: '/admin/settings', icon: '⚙️', label: currentLocale === 'ar' ? 'الإعدادات' : 'Settings' },
      ]
    } else if (userRole === 'CANDIDATE') {
      return [
        { href: '/candidates/profile', icon: '👤', label: currentLocale === 'ar' ? 'ملفي الشخصي' : 'My Profile' },
        { href: '/candidates/applications', icon: '📄', label: currentLocale === 'ar' ? 'طلباتي' : 'My Applications' },
        { href: '/jobs', icon: '💼', label: currentLocale === 'ar' ? 'الوظائف' : 'Jobs' },
      ]
    } else if (userRole === 'EMPLOYER') {
      return [
        { href: '/employers/jobs', icon: '💼', label: currentLocale === 'ar' ? 'وظائفي' : 'My Jobs' },
        { href: '/employers/applications', icon: '📄', label: currentLocale === 'ar' ? 'الطلبات' : 'Applications' },
        { href: '/employers/jobs/new', icon: '➕', label: currentLocale === 'ar' ? 'نشر وظيفة' : 'Post Job' },
      ]
    }
    return []
  }

  const roleLinks = getRoleLinks()

  return (
    <div className={styles.userDropdown} ref={dropdownRef}>
      <button
        className={styles.userButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className={styles.userAvatar}>
          {getInitials(userName)}
        </div>
        <span className={styles.userName}>{userName}</span>
        <svg
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div className={styles.dropdownMenu}>
          <div className={styles.dropdownHeader}>
            <div className={styles.dropdownAvatar}>
              {getInitials(userName)}
            </div>
            <div className={styles.dropdownUserInfo}>
              <div className={styles.dropdownUserName}>{userName}</div>
              <div className={styles.dropdownUserRole}>
                {userRole === 'ADMIN' && (currentLocale === 'ar' ? 'مدير' : 'Admin')}
                {userRole === 'CANDIDATE' && (currentLocale === 'ar' ? 'مرشح' : 'Candidate')}
                {userRole === 'EMPLOYER' && (currentLocale === 'ar' ? 'صاحب عمل' : 'Employer')}
              </div>
            </div>
          </div>

          <div className={styles.dropdownDivider} />

          <div className={styles.dropdownLinks}>
            {roleLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={styles.dropdownLink}
                onClick={() => setIsOpen(false)}
              >
                <span className={styles.linkIcon}>{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>

          <div className={styles.dropdownDivider} />

          <button
            className={styles.logoutButton}
            onClick={() => {
              setIsOpen(false)
              onLogout()
            }}
          >
            <span className={styles.linkIcon}>🚪</span>
            {currentLocale === 'ar' ? 'تسجيل الخروج' : 'Logout'}
          </button>
        </div>
      )}
    </div>
  )
}
