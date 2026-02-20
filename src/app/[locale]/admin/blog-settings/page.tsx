'use client'

import { useState, useEffect } from 'react'
import styles from '../jobs/page.module.css'

interface BlogPost {
  id?: string
  titleAr: string
  titleEn: string
  excerptAr: string
  excerptEn: string
  contentAr: string
  contentEn: string
  authorAr: string
  authorEn: string
  categoryAr: string
  categoryEn: string
  image: string | null
  featured: boolean
  published: boolean
  createdAt?: string
}

export default function BlogSettingsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [message, setMessage] = useState('')

  const [formData, setFormData] = useState<BlogPost>({
    titleAr: '',
    titleEn: '',
    excerptAr: '',
    excerptEn: '',
    contentAr: '',
    contentEn: '',
    authorAr: '',
    authorEn: '',
    categoryAr: '',
    categoryEn: '',
    image: null,
    featured: false,
    published: true,
  })

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/admin/blog-settings', { cache: 'no-store' })
      if (response.ok) {
        const data = await response.json()
        setPosts(data.posts || [])
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('🔵 بدء حفظ المقال...')

    try {
      const url = editingPost ? `/api/admin/blog-settings/${editingPost.id}` : '/api/admin/blog-settings'
      const method = editingPost ? 'PUT' : 'POST'

      console.log('📤 إرسال المقال:', { url, method, data: formData })

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      console.log('📥 استجابة السيرفر:', response.status, response.statusText)
      const data = await response.json()
      console.log('📦 البيانات المستلمة:', data)

      if (response.ok) {
        setMessage('✅ تم حفظ المقال بنجاح')
        setShowForm(false)
        setEditingPost(null)
        setFormData({
          titleAr: '',
          titleEn: '',
          excerptAr: '',
          excerptEn: '',
          contentAr: '',
          contentEn: '',
          authorAr: '',
          authorEn: '',
          categoryAr: '',
          categoryEn: '',
          image: null,
          featured: false,
          published: true,
        })
        fetchPosts()
        setTimeout(() => setMessage(''), 3000)
      } else {
        console.error('❌ فشل الحفظ:', data)
        setMessage(`❌ فشل حفظ المقال: ${data.error || 'خطأ غير معروف'}`)
      }
    } catch (error) {
      console.error('❌ خطأ في حفظ المقال:', error)
      setMessage(`❌ حدث خطأ أثناء الحفظ: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`)
    }
  }

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post)
    setFormData(post)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المقال؟')) return

    try {
      const response = await fetch(`/api/admin/blog-settings/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setMessage('✅ تم حذف المقال بنجاح')
        fetchPosts()
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage('❌ فشل حذف المقال')
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      setMessage('❌ حدث خطأ أثناء الحذف')
    }
  }

  if (loading) {
    return <div className={styles.loading}>جاري التحميل...</div>
  }

  return (
    <div className={styles.jobsPage}>
      <div className={styles.pageHeader}>
        <div>
          <h1>📝 إعدادات المدونة</h1>
          <p>إدارة مقالات المدونة</p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm)
            setEditingPost(null)
            setFormData({
              titleAr: '',
              titleEn: '',
              excerptAr: '',
              excerptEn: '',
              contentAr: '',
              contentEn: '',
              authorAr: '',
              authorEn: '',
              categoryAr: '',
              categoryEn: '',
              image: null,
              featured: false,
              published: true,
            })
          }}
          className="btn btn-primary"
        >
          {showForm ? '❌ إلغاء' : '➕ مقال جديد'}
        </button>
      </div>

      {message && (
        <div className={`${styles.message} ${message.includes('✅') ? styles.success : styles.error}`}>
          {message}
        </div>
      )}

      {showForm && (
        <div className={styles.formCard}>
          <h2>{editingPost ? 'تعديل المقال' : 'مقال جديد'}</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>العنوان (عربي) *</label>
                <input
                  type="text"
                  required
                  value={formData.titleAr}
                  onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label>العنوان (English) *</label>
                <input
                  type="text"
                  required
                  value={formData.titleEn}
                  onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label>المؤلف (عربي) *</label>
                <input
                  type="text"
                  required
                  value={formData.authorAr}
                  onChange={(e) => setFormData({ ...formData, authorAr: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label>المؤلف (English) *</label>
                <input
                  type="text"
                  required
                  value={formData.authorEn}
                  onChange={(e) => setFormData({ ...formData, authorEn: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label>التصنيف (عربي) *</label>
                <input
                  type="text"
                  required
                  value={formData.categoryAr}
                  onChange={(e) => setFormData({ ...formData, categoryAr: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label>التصنيف (English) *</label>
                <input
                  type="text"
                  required
                  value={formData.categoryEn}
                  onChange={(e) => setFormData({ ...formData, categoryEn: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label>المقتطف (عربي) *</label>
                <textarea
                  required
                  value={formData.excerptAr}
                  onChange={(e) => setFormData({ ...formData, excerptAr: e.target.value })}
                  rows={3}
                />
              </div>
              <div className={styles.formGroup}>
                <label>المقتطف (English) *</label>
                <textarea
                  required
                  value={formData.excerptEn}
                  onChange={(e) => setFormData({ ...formData, excerptEn: e.target.value })}
                  rows={3}
                />
              </div>
              <div className={styles.formGroup}>
                <label>المحتوى (عربي) *</label>
                <textarea
                  required
                  value={formData.contentAr}
                  onChange={(e) => setFormData({ ...formData, contentAr: e.target.value })}
                  rows={8}
                />
              </div>
              <div className={styles.formGroup}>
                <label>المحتوى (English) *</label>
                <textarea
                  required
                  value={formData.contentEn}
                  onChange={(e) => setFormData({ ...formData, contentEn: e.target.value })}
                  rows={8}
                />
              </div>
              <div className={styles.formGroup}>
                <label>
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  />
                  {' '}مقال مميز
                </label>
              </div>
              <div className={styles.formGroup}>
                <label>
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  />
                  {' '}منشور
                </label>
              </div>
            </div>
            <div className={styles.formActions}>
              <button type="submit" className="btn btn-primary">
                💾 حفظ المقال
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingPost(null)
                }}
                className="btn btn-secondary"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      )}

      <div className={styles.statsCards}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📝</div>
          <div className={styles.statInfo}>
            <h3>{posts.length}</h3>
            <p>إجمالي المقالات</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>⭐</div>
          <div className={styles.statInfo}>
            <h3>{posts.filter(p => p.featured).length}</h3>
            <p>مقالات مميزة</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>✅</div>
          <div className={styles.statInfo}>
            <h3>{posts.filter(p => p.published).length}</h3>
            <p>منشورة</p>
          </div>
        </div>
      </div>

      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>العنوان (عربي)</th>
              <th>المؤلف</th>
              <th>التصنيف</th>
              <th>الحالة</th>
              <th>التاريخ</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td>
                  {post.titleAr}
                  {post.featured && <span style={{ marginRight: '0.5rem' }}>⭐</span>}
                </td>
                <td>{post.authorAr}</td>
                <td>{post.categoryAr}</td>
                <td>
                  <span className={`${styles.badge} ${post.published ? styles.badgeSuccess : styles.badgeWarning}`}>
                    {post.published ? 'منشور' : 'مسودة'}
                  </span>
                </td>
                <td>{post.createdAt ? new Date(post.createdAt).toLocaleDateString('ar-EG') : '-'}</td>
                <td>
                  <div className={styles.actionButtons}>
                    <button
                      onClick={() => handleEdit(post)}
                      className={styles.btnEdit}
                      title="تعديل"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => post.id && handleDelete(post.id)}
                      className={styles.btnDelete}
                      title="حذف"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {posts.length === 0 && (
          <div className={styles.emptyState}>
            <p>لا توجد مقالات حتى الآن</p>
          </div>
        )}
      </div>
    </div>
  )
}
