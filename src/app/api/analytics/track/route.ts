import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET handler to prevent 405 errors (returns 204 No Content)
export async function GET() {
    return new NextResponse(null, { status: 204 })
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { page } = body

        // Get user agent and IP
        const userAgent = request.headers.get('user-agent') || undefined
        const ipAddress = request.headers.get('x-forwarded-for') || 
                         request.headers.get('x-real-ip') || 
                         undefined

        // Track page view
        await prisma.pageView.create({
            data: {
                page,
                userAgent,
                ipAddress,
            }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error tracking page view:', error)
        return NextResponse.json({ success: false }, { status: 500 })
    }
}
