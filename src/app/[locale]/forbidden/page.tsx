import { Link } from '@/navigation'
import styles from './page.module.css'

export default function ForbiddenPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.icon}>🚫</div>
        <h1 className={styles.title}>403 - ممنوع الوصول</h1>
        <p className={styles.description}>
          عذراً، ليس لديك صلاحية للوصول إلى هذه الصفحة.
        </p>
        <p className={styles.subdescription}>
          هذه الصفحة مخصصة للمديرين فقط.
        </p>
        <div className={styles.actions}>
          <Link href="/" className="btn btn-primary">
            العودة للصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  )
}
