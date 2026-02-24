import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const revalidate = 0

async function getPrisma() {
  const { default: prisma } = await import('@/lib/prisma')
  return prisma
}

export async function GET(request: NextRequest) {
  try {
    console.log('[check-session] Starting session check...')
    
    // Read all possible cookies
    const userSession = request.cookies.get('user_session')?.value
    const adminSession = request.cookies.get('admin_session')?.value
    const userRole = request.cookies.get('user_role')?.value as 'CANDIDATE' | 'EMPLOYER' | 'ADMIN' | undefined
    
    console.log('[check-session] Cookies:', {
      userSession: userSession ? 'exists' : 'missing',
      adminSession: adminSession ? 'exists' : 'missing',
      userRole
    })

    // Determine which session to use
    const sessionId = adminSession || userSession
    
    // If no session cookie, return not authenticated
    if (!sessionId || !userRole) {
      console.log('[check-session] No session or role found')
      return NextResponse.json({
        authenticated: false,
        isLoggedIn: false,
        isAdmin: false,
        user: null
      }, { 
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
    }

    const prisma = await getPrisma()
    let user = null

    console.log('[check-session] Checking role:', userRole)

    // Fetch user data based on role
    if (userRole === 'CANDIDATE') {
      const candidate = await prisma.candidate.findUnique({
        where: { id: sessionId }
      })
      if (candidate) {
        user = {
          id: candidate.id,
          name: candidate.name,
          email: candidate.email,
          role: 'CANDIDATE'
        }
      }
    } else if (userRole === 'EMPLOYER') {
      const employer = await prisma.employer.findUnique({
        where: { id: sessionId }
      })
      if (employer) {
        user = {
          id: employer.id,
          name: employer.companyName,
          email: employer.email,
          role: 'EMPLOYER'
        }
      }
    } else if (userRole === 'ADMIN') {
      // For admin, check if it's the super admin from env
      const adminEmail = process.env.ADMIN_EMAIL
      if (adminSession === 'admin' || sessionId === 'admin') {
        console.log('[check-session] Super admin detected')
        user = {
          id: 'admin',
          name: 'Super Admin',
          email: adminEmail || 'admin@mapeg.com',
          role: 'ADMIN'
        }
      } else {
        // Check database for admin
        const admin = await prisma.admin.findUnique({
          where: { id: sessionId }
        })
        if (admin) {
          user = {
            id: admin.id,
            name: admin.name || 'Admin',
            email: admin.email,
            role: 'ADMIN'
          }
        }
      }
    }

    console.log('[check-session] User found:', user ? 'yes' : 'no')
    console.log('[check-session] User data:', user)

    // If user found, return authenticated
    if (user) {
      return NextResponse.json({
        authenticated: true,
        isLoggedIn: true,
        isAdmin: userRole === 'ADMIN',
        user
      }, { 
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
    }

    console.log('[check-session] Session exists but user not found in DB')
    // Session exists but user not found in DB
    return NextResponse.json({
      authenticated: false,
      isLoggedIn: false,
      isAdmin: false,
      user: null
    }, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })

  } catch (error) {
    console.error('[check-session] Error:', error)
    // Return 200 even on error to prevent console errors
    return NextResponse.json({
      authenticated: false,
      isLoggedIn: false,
      isAdmin: false,
      user: null
    }, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  }
}
