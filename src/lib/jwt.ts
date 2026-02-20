import { SignJWT, jwtVerify } from 'jose'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-min-32-characters-long-for-production'
const secret = new TextEncoder().encode(JWT_SECRET)

export interface SessionPayload {
  sub: string // userId
  role: 'ADMIN' | 'EMPLOYER' | 'CANDIDATE'
  name: string
  email: string
  exp: number // expiration timestamp
}

// إنشاء JWT token
export async function signSession(payload: Omit<SessionPayload, 'exp'>): Promise<string> {
  const token = await new SignJWT(payload as any)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d') // صالح لمدة 7 أيام
    .sign(secret)
  
  return token
}

// التحقق من JWT token
export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret)
    
    // Validate payload structure
    if (
      typeof payload.sub === 'string' &&
      typeof payload.role === 'string' &&
      typeof payload.name === 'string' &&
      typeof payload.email === 'string' &&
      typeof payload.exp === 'number'
    ) {
      return payload as unknown as SessionPayload
    }
    
    return null
  } catch (error) {
    console.error('JWT verification failed:', error)
    return null
  }
}

// استخراج session من cookies
export function getSessionFromCookies(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null
  
  const cookies = cookieHeader.split(';').map(c => c.trim())
  const sessionCookie = cookies.find(c => c.startsWith('session='))
  
  if (!sessionCookie) return null
  
  return sessionCookie.split('=')[1]
}
