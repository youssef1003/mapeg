import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET - Fetch dashboard stats from database
export async function GET() {
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
