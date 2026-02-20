import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireEmployer } from '@/lib/auth'

// GET - Fetch employer's jobs with application counts
export async function GET(request: NextRequest) {
    try {
        // Check authentication - must be EMPLOYER or ADMIN
        const session = await requireEmployer(request)
        
        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized - Please login as an employer' },
                { status: 401 }
            )
        }

        // Get employer profile
        const employer = await prisma.employer.findUnique({
            where: { userId: session.sub }
        })

        if (!employer) {
            return NextResponse.json(
                { error: 'Employer profile not found' },
                { status: 404 }
            )
        }

        // Fetch employer's jobs with application counts
        const jobs = await prisma.job.findMany({
            where: { employerId: employer.id },
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { applications: true }
                }
            }
        })

        return NextResponse.json({ jobs })
    } catch (error) {
        console.error('Error fetching employer jobs:', error)
        return NextResponse.json(
            { error: 'Failed to fetch jobs' },
            { status: 500 }
        )
    }
}
