import { NextRequest, NextResponse } from 'next/server'
import { verifySession } from '@/lib/jwt'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Check JWT session first
    const sessionCookie = request.cookies.get('session')
    
    if (sessionCookie?.value) {
      const session = await verifySession(sessionCookie.value)
      
      if (session) {
        return NextResponse.json({
          isLoggedIn: true,
          isAdmin: session.role === 'ADMIN',
          user: {
            id: session.sub,
            name: session.name,
            email: session.email,
            role: session.role
          }
        })
      }
    }

    // Fallback: Check old admin session for backward compatibility
    const adminSession = request.cookies.get('admin_session')
    const isAdmin = adminSession?.value === 'true'

    if (isAdmin) {
      return NextResponse.json({
        isLoggedIn: true,
        isAdmin: true,
        user: {
          id: 'admin',
          name: 'Super Admin',
          email: process.env.ADMIN_EMAIL || 'admin@mapeg.com',
          role: 'ADMIN'
        }
      })
    }

    // Not logged in
    return NextResponse.json({
      isLoggedIn: false,
      isAdmin: false,
      user: null
    })
  } catch (error) {
    console.error('Session check error:', error)
    return NextResponse.json(
      { isLoggedIn: false, isAdmin: false, user: null },
      { status: 500 }
    )
  }
}
