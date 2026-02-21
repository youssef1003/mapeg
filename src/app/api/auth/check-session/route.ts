import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth(request)
    
    if (session) {
      return NextResponse.json({
        authenticated: true,
        isLoggedIn: true,
        isAdmin: session.role === 'ADMIN',
        user: {
          id: session.sub,
          name: session.name,
          email: session.email,
          role: session.role
        }
      }, { status: 200 })
    }

    // No session - return 200 with authenticated: false
    return NextResponse.json({
      authenticated: false,
      isLoggedIn: false,
      isAdmin: false,
      user: null
    }, { status: 200 })

  } catch (error) {
    console.error('Session check error:', error)
    // Return 200 even on error to prevent console errors
    return NextResponse.json({
      authenticated: false,
      isLoggedIn: false,
      isAdmin: false,
      user: null
    }, { status: 200 })
  }
}
