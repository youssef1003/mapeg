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
    // Read cookies: user_session and user_role
    const userSession = request.cookies.get('user_session')?.value
    const userRole = request.cookies.get('user_role')?.value as 'CANDIDATE' | 'EMPLOYER' | 'ADMIN' | undefined

    // If no session cookie, return not authenticated
    if (!userSession || !userRole) {
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

    // Fetch user data based on role
    if (userRole === 'CANDIDATE') {
      const candidate = await prisma.candidate.findUnique({
        where: { id: userSession }
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
        where: { id: userSession }
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
      const admin = await prisma.admin.findUnique({
        where: { id: userSession }
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
    console.error('Session check error:', error)
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
