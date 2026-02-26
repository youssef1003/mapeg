'use client'

import { Link } from '@/navigation'
import styles from '../login/page.module.css'

export default function VerifySuccessPage({ params }: { params: { locale: string } }) {
    return (
        <div className={styles.authContainer}>
            <div className={styles.authCard}>
                <div className={styles.successMessage}>
                    <div className={styles.successIcon}>✓</div>
                    <h2 style={{ marginBottom: '1rem' }}>
                        {params.locale === 'ar' ? 'تم التحقق بنجاح!' : 'Verification Successful!'}
                    </h2>
                    <p>
                        {params.locale === 'ar' 
                            ? 'تم تأكيد بريدك الإلكتروني بنجاح. يمكنك الآن تسجيل الدخول.'
                            : 'Your email has been verified successfully. You can now login.'}
                    </p>
                    <Link href="/auth/login" className={styles.submitButton} style={{ marginTop: '2rem', display: 'inline-block' }}>
                        {params.locale === 'ar' ? 'تسجيل الدخول' : 'Login'}
                    </Link>
                </div>
            </div>
        </div>
    )
}
