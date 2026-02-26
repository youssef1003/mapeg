import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const token = searchParams.get('token')

        if (!token) {
            // Redirect to error page
            return NextResponse.redirect(new URL('/ar/auth/login?error=invalid_token', request.url))
        }

        // Find user with this verification token
        const user = await prisma.user.findUnique({
            where: { verificationToken: token }
        })

        if (!user) {
            // Redirect to error page
            return NextResponse.redirect(new URL('/ar/auth/login?error=invalid_token', request.url))
        }

        // Check if already verified
        if (user.emailVerified) {
            // Redirect to login with already verified message
            return NextResponse.redirect(new URL('/ar/auth/login?verified=already', request.url))
        }

        // Update user to verified
        await prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: true,
                verificationToken: null // Clear the token
            }
        })

        // Redirect to success page
        return NextResponse.redirect(new URL('/ar/auth/verify-success', request.url))

    } catch (error) {
        console.error('Email verification error:', error)
        return NextResponse.redirect(new URL('/ar/auth/login?error=verification_failed', request.url))
    }
}
