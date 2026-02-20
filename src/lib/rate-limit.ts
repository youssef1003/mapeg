import { NextResponse } from 'next/server'

interface RateLimitStore {
    [key: string]: {
        count: number
        resetTime: number
    }
}

const store: RateLimitStore = {}

// Clean up expired entries every 5 minutes
setInterval(() => {
    const now = Date.now()
    for (const key in store) {
        if (store[key].resetTime < now) {
            delete store[key]
        }
    }
}, 5 * 60 * 1000)

export interface RateLimitConfig {
    /** Maximum number of requests allowed in the window */
    limit: number
    /** Time window in seconds */
    windowSeconds: number
}

/**
 * Simple in-memory rate limiter for API routes.
 * For production with multiple instances, use Redis or similar.
 * 
 * @example
 * ```ts
 * export async function POST(request: Request) {
 *     const ip = request.headers.get('x-forwarded-for') || 'anonymous'
 *     const rateLimitResult = rateLimit(ip, { limit: 10, windowSeconds: 60 })
 *     
 *     if (!rateLimitResult.success) {
 *         return rateLimitResult.response
 *     }
 *     
 *     // Process request...
 * }
 * ```
 */
export function rateLimit(
    identifier: string,
    config: RateLimitConfig = { limit: 10, windowSeconds: 60 }
): { success: true } | { success: false; response: NextResponse } {
    const now = Date.now()
    const key = identifier
    const windowMs = config.windowSeconds * 1000

    if (!store[key] || store[key].resetTime < now) {
        store[key] = {
            count: 1,
            resetTime: now + windowMs,
        }
        return { success: true }
    }

    store[key].count++

    if (store[key].count > config.limit) {
        const retryAfter = Math.ceil((store[key].resetTime - now) / 1000)
        return {
            success: false,
            response: NextResponse.json(
                { error: 'Too many requests. Please try again later.' },
                {
                    status: 429,
                    headers: {
                        'Retry-After': String(retryAfter),
                        'X-RateLimit-Limit': String(config.limit),
                        'X-RateLimit-Remaining': '0',
                        'X-RateLimit-Reset': String(store[key].resetTime),
                    },
                }
            ),
        }
    }

    return { success: true }
}

/**
 * Get client IP from request headers
 */
export function getClientIP(request: Request): string {
    return (
        request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
        request.headers.get('x-real-ip') ||
        'anonymous'
    )
}
