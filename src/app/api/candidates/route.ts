import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// GET - Fetch all candidates (Admin only - contains PII)
export async function GET(request: NextRequest) {
    const session = await requireAdmin(request)
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { searchParams } = new URL(request.url)
        const search = searchParams.get('search')

        const where: Record<string, unknown> = {}

        if (search) {
            where.OR = [
                { name: { contains: search } },
                { email: { contains: search } },
                { skills: { contains: search } },
            ]
        }

        const candidates = await prisma.candidate.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { applications: true }
                }
            }
        })

        return NextResponse.json(candidates)
    } catch (error) {
        console.error('Error fetching candidates:', error)
        return NextResponse.json(
            { error: 'Failed to fetch candidates' },
            { status: 500 }
        )
    }
}
