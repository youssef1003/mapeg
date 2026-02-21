import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

// GET - Fetch dashboard stats from database (Admin only)
export async function GET(request: NextRequest) {
    const session = await requireAdmin(request)
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    try {
        const [jobsCount, candidatesCount, employersCount, applicationsCount] = await Promise.all([
            prisma.job.count(),
            prisma.candidate.count(),
            prisma.employer.count(),
            prisma.application.count(),
        ])

        return NextResponse.json({
            jobsCount,
            candidatesCount,
            employersCount,
            applicationsCount,
        })
    } catch (error) {
        console.error('Error fetching stats:', error)
        return NextResponse.json(
            { error: 'Failed to fetch stats' },
            { status: 500 }
        )
    }
}
