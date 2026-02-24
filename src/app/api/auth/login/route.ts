import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { signSession } from '@/lib/jwt'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
    try {
        console.log('🔐 Login API called')
        
        const body = await request.json()
        const { email, password } = body

        console.log('📧 Email:', email)

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            )
        }

        // Check admin first
        const adminEmail = process.env.ADMIN_EMAIL
        const adminPassword = process.env.ADMIN_PASSWORD

        if (adminEmail && adminPassword && email === adminEmail && password === adminPassword) {
            console.log('✅ Admin login')
            
            // Create JWT token for admin
            const token = await signSession({
                sub: 'admin',
                role: 'ADMIN',
                name: 'Super Admin',
                email: adminEmail
            })
            
            const response = NextResponse.json({
                success: true,
                message: 'Admin login successful',
                isAdmin: true,
                redirectTo: '/admin',
                user: {
                    id: 'admin',
                    name: 'Super Admin',
                    email: adminEmail,
                    role: 'ADMIN'
                }
            })

            // Set JWT session cookie
            response.cookies.set('session', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7, // 7 days
                path: '/',
            })

            // Keep old cookies for backward compatibility
            response.cookies.set('admin_session', 'admin', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7,
                path: '/',
            })

            response.cookies.set('user_session', 'admin', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7,
                path: '/',
            })

            response.cookies.set('user_role', 'ADMIN', {
                httpOnly: false,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7,
                path: '/',
            })

            return response
        }

        // Regular user login
        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            )
        }

        const isValidPassword = await bcrypt.compare(password, user.password)

        if (!isValidPassword) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            )
        }

        console.log('✅ User login:', user.id)

        // Create JWT token for user
        const token = await signSession({
            sub: user.id,
            role: user.role as 'ADMIN' | 'EMPLOYER' | 'CANDIDATE',
            name: user.name || 'User',
            email: user.email
        })

        const response = NextResponse.json({
            success: true,
            message: 'Login successful',
            isAdmin: false,
            redirectTo: '/',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })

        // Set JWT session cookie
        response.cookies.set('session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: '/',
        })

        // Keep old cookies for backward compatibility
        response.cookies.set('user_session', user.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30,
            path: '/',
        })

        response.cookies.set('user_role', user.role, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30,
            path: '/',
        })

        return response

    } catch (error: any) {
        console.error('❌ Login error:', error.message)
        return NextResponse.json(
            { error: 'Failed to login' },
            { status: 500 }
        )
    }
}
