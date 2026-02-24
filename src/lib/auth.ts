import { NextRequest } from 'next/server'
import { verifySession, SessionPayload } from './jwt'

// التحقق من تسجيل الدخول
export async function requireAuth(request: NextRequest): Promise<SessionPayload | null> {
  try {
    const sessionCookie = request.cookies.get('session')
    
    if (!sessionCookie?.value) {
      return null
    }
    
    const session = await verifySession(sessionCookie.value)
    return session
  } catch (error) {
    console.error('Auth error:', error)
    return null
  }
}

// التحقق من الصلاحيات
export function requireRole(
  session: SessionPayload | null,
  allowedRoles: Array<'ADMIN' | 'EMPLOYER' | 'CANDIDATE'>
): boolean {
  if (!session) return false
  return allowedRoles.includes(session.role)
}

// دالة مساعدة للتحقق من Admin
export async function requireAdmin(request: NextRequest): Promise<SessionPayload | null> {
  // First try JWT session
  const session = await requireAuth(request)
  if (session && session.role === 'ADMIN') {
    return session
  }
  
  // Fallback: Check old admin_session cookie
  const adminSession = request.cookies.get('admin_session')?.value
  const userRole = request.cookies.get('user_role')?.value
  
  if (adminSession && userRole === 'ADMIN') {
    // Return a mock session for backward compatibility
    return {
      sub: 'admin',
      role: 'ADMIN',
      name: 'Super Admin',
      email: process.env.ADMIN_EMAIL || 'admin@mapeg.com',
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
    }
  }
  
  return null
}

// دالة مساعدة للتحقق من Employer
export async function requireEmployer(request: NextRequest): Promise<SessionPayload | null> {
  const session = await requireAuth(request)
  if (!session || (session.role !== 'EMPLOYER' && session.role !== 'ADMIN')) {
    return null
  }
  return session
}

// دالة مساعدة للتحقق من Candidate
export async function requireCandidate(request: NextRequest): Promise<SessionPayload | null> {
  // First try JWT session
  const session = await requireAuth(request)
  if (session && (session.role === 'CANDIDATE' || session.role === 'ADMIN')) {
    return session
  }
  
  // Fallback: Check old user_session cookie
  const userSession = request.cookies.get('user_session')?.value
  const userRole = request.cookies.get('user_role')?.value
  
  if (userSession && (userRole === 'CANDIDATE' || userRole === 'ADMIN')) {
    // Try to get user from database
    const prisma = (await import('@prisma/client')).PrismaClient
    const db = new prisma()
    
    try {
      // Try to find in User table first
      let user = await db.user.findUnique({
        where: { id: userSession },
        select: { id: true, name: true, email: true, role: true }
      })
      
      // If not found, try Candidate table
      if (!user) {
        const candidate = await db.candidate.findUnique({
          where: { id: userSession },
          select: { id: true, name: true, email: true }
        })
        
        if (candidate) {
          user = { ...candidate, role: 'CANDIDATE' as any }
        }
      }
      
      if (user && (user.role === 'CANDIDATE' || user.role === 'ADMIN')) {
        return {
          sub: user.id,
          role: user.role as 'CANDIDATE' | 'ADMIN',
          name: user.name || '',
          email: user.email,
          exp: Date.now() + 7 * 24 * 60 * 60 * 1000
        }
      }
    } catch (error) {
      console.error('Error fetching user from database:', error)
    }
  }
  
  return null
}
