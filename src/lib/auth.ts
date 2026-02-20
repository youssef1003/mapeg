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
  const session = await requireAuth(request)
  if (!session || session.role !== 'ADMIN') {
    return null
  }
  return session
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
  const session = await requireAuth(request)
  if (!session || (session.role !== 'CANDIDATE' && session.role !== 'ADMIN')) {
    return null
  }
  return session
}
