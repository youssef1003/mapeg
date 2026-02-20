'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    const t = useTranslations('Common')

    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="container py-20 text-center">
            <h2 className="text-2xl font-bold mb-4">{t('errorTitle') || 'Something went wrong!'}</h2>
            <button
                onClick={() => reset()}
                className="btn btn-primary"
            >
                {t('tryAgain') || 'Try again'}
            </button>
        </div>
    )
}
