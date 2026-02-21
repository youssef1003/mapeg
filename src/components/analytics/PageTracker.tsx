'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { apiUrl } from '@/lib/api-url'

export default function PageTracker() {
    const pathname = usePathname()

    useEffect(() => {
        // Track page view
        const trackPageView = async () => {
            try {
                await fetch(apiUrl('/analytics/track'), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        page: pathname,
                    }),
                })
            } catch (error) {
                // Silently fail - analytics shouldn't break the app
                console.debug('Analytics tracking failed:', error)
            }
        }

        trackPageView()
    }, [pathname])

    return null
}
