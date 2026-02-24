import styles from './LoadingSpinner.module.css'

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  color?: 'primary' | 'white' | 'gray'
}

export default function LoadingSpinner({ size = 'medium', color = 'primary' }: LoadingSpinnerProps) {
  return (
    <div className={`${styles.spinner} ${styles[size]} ${styles[color]}`}>
      <div className={styles.spinnerCircle}></div>
    </div>
  )
}
