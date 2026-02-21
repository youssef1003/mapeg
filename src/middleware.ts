import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'

const intlMiddleware = createMiddleware({
  locales: ['ar', 'en'],
  defaultLocale: 'ar',
})

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Safety net: Rewrite /{locale}/api/* to /api/*
  // This prevents 404/405 errors when frontend accidentally calls localized API paths
  const localeApiMatch = pathname.match(/^\/(ar|en)\/api\/(.*)$/)
  if (localeApiMatch) {
    const apiPath = localeApiMatch[2]
    const url = request.nextUrl.clone()
    url.pathname = `/api/${apiPath}`
    console.log(`[Middleware] Rewriting ${pathname} → ${url.pathname}`)
    return NextResponse.rewrite(url)
  }
  
  // Apply intl middleware for non-API routes
  const response = intlMiddleware(request)
  
  // Security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  return response
}

export const config = {
  matcher: [
    '/((?!_next|.*\\..*).*)',  // Original matcher for intl
    '/(ar|en)/api/:path*',      // Match localized API paths for rewrite
  ],
}
