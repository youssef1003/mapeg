import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth, requireRole } from '@/lib/auth'

// GET - Fetch all jobs with optional filters (PUBLIC)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const country = searchParams.get('country')
        const category = searchParams.get('category')
        const type = searchParams.get('type')
        const search = searchParams.get('search')
        const featured = searchParams.get('featured')

        const where: Record<string, unknown> = {}

        if (country) where.country = country
        if (category) where.category = category
        if (type) where.type = type
        if (featured === 'true') where.featured = true
        if (search) {
            where.OR = [
                { title: { contains: search } },
                { company: { contains: search } },
                { description: { contains: search } },
            ]
        }

        const jobs = await prisma.job.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                employer: {
                    select: {
                        companyName: true,
                        logo: true,
                    },
                },
            },
        })

        return NextResponse.json(jobs)
    } catch (error) {
        console.error('Error fetching jobs:', error)
        return NextResponse.json(
            { error: 'Failed to fetch jobs' },
            { status: 500 }
        )
    }
}

// POST - Create a new job (ADMIN or EMPLOYER only)
export async function POST(request: NextRequest) {
    try {
        // Check authentication
        const session = await requireAuth(request)
        
        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized - Please login' },
                { status: 401 }
            )
        }

        // Check if user is ADMIN or EMPLOYER
        if (!requireRole(session, ['ADMIN', 'EMPLOYER'])) {
            return NextResponse.json(
                { error: 'Forbidden - Only employers and admins can create jobs' },
                { status: 403 }
            )
        }

        const body = await request.json()

        // Validate required fields
        if (!body.title) {
            return NextResponse.json(
                { error: 'Job title is required' },
                { status: 400 }
            )
        }

        // Get employerId based on role
        let employerId = body.employerId || null
        
        if (session.role === 'EMPLOYER') {
            // For employers, find their employer profile
            const employer = await prisma.employer.findUnique({
                where: { userId: session.sub }
            })
            
            if (!employer) {
                return NextResponse.json(
                    { error: 'Employer profile not found' },
                    { status: 404 }
                )
            }
            
            employerId = employer.id
        }

        // Format salary string
        let salaryString = null
        if (body.salaryMin && body.salaryMax) {
            salaryString = `${body.salaryMin} - ${body.salaryMax} EGP`
        } else if (body.salaryMin) {
            salaryString = `${body.salaryMin}+ EGP`
        }

        const job = await prisma.job.create({
            data: {
                title: body.title,
                company: body.company || 'غير محدد',
                location: body.location || 'غير محدد',
                country: body.country || 'EG',
                type: body.type || 'full-time',
                salary: salaryString,
                description: body.description || '',
                requirements: body.requirements || '',
                category: body.category || '',
                featured: session.role === 'ADMIN' ? (body.featured || false) : false, // Only admin can set featured
                employerId: employerId,
                // English translations
                titleEn: body.titleEn || null,
                descriptionEn: body.descriptionEn || null,
                requirementsEn: body.requirementsEn || null,
            },
        })

        return NextResponse.json(job, { status: 201 })
    } catch (error) {
        console.error('Error creating job:', error)
        return NextResponse.json(
            { error: 'Failed to create job' },
            { status: 500 }
        )
    }
}
