import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth, requireRole } from '@/lib/auth'

// GET - Fetch a single job by ID (PUBLIC)
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const job = await prisma.job.findUnique({
            where: { id: params.id },
            include: {
                employer: {
                    select: {
                        companyName: true,
                        logo: true,
                    },
                },
            },
        })

        if (!job) {
            return NextResponse.json(
                { error: 'Job not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(job)
    } catch (error) {
        console.error('Error fetching job:', error)
        return NextResponse.json(
            { error: 'Failed to fetch job' },
            { status: 500 }
        )
    }
}

// DELETE - Delete a job by ID (ADMIN or job owner EMPLOYER only)
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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
                { error: 'Forbidden - Only employers and admins can delete jobs' },
                { status: 403 }
            )
        }

        // Check if job exists
        const job = await prisma.job.findUnique({
            where: { id: params.id },
        })

        if (!job) {
            return NextResponse.json(
                { error: 'Job not found' },
                { status: 404 }
            )
        }

        // If EMPLOYER, check if they own this job
        if (session.role === 'EMPLOYER') {
            const employer = await prisma.employer.findUnique({
                where: { userId: session.sub }
            })
            
            if (!employer || job.employerId !== employer.id) {
                return NextResponse.json(
                    { error: 'Forbidden - You can only delete your own jobs' },
                    { status: 403 }
                )
            }
        }

        // Delete the job
        await prisma.job.delete({
            where: { id: params.id },
        })

        return NextResponse.json(
            { message: 'Job deleted successfully' },
            { status: 200 }
        )
    } catch (error) {
        console.error('Error deleting job:', error)
        return NextResponse.json(
            { error: 'Failed to delete job' },
            { status: 500 }
        )
    }
}

// PUT - Update a job by ID (ADMIN or job owner EMPLOYER only)
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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
                { error: 'Forbidden - Only employers and admins can update jobs' },
                { status: 403 }
            )
        }

        const body = await request.json()
        const {
            title,
            company,
            location,
            country,
            type,
            category,
            description,
            requirements,
            salary,
            featured,
        } = body

        // Check if job exists
        const existingJob = await prisma.job.findUnique({
            where: { id: params.id },
        })

        if (!existingJob) {
            return NextResponse.json(
                { error: 'Job not found' },
                { status: 404 }
            )
        }

        // If EMPLOYER, check if they own this job
        if (session.role === 'EMPLOYER') {
            const employer = await prisma.employer.findUnique({
                where: { userId: session.sub }
            })
            
            if (!employer || existingJob.employerId !== employer.id) {
                return NextResponse.json(
                    { error: 'Forbidden - You can only update your own jobs' },
                    { status: 403 }
                )
            }
        }

        // Update the job
        const updatedJob = await prisma.job.update({
            where: { id: params.id },
            data: {
                title,
                company,
                location,
                country: country || existingJob.country,
                type,
                category,
                description,
                requirements,
                salary: salary || null,
                featured: session.role === 'ADMIN' ? (featured || false) : existingJob.featured, // Only admin can change featured
                // English translations
                titleEn: body.titleEn || null,
                descriptionEn: body.descriptionEn || null,
                requirementsEn: body.requirementsEn || null,
            },
        })

        return NextResponse.json(updatedJob, { status: 200 })
    } catch (error) {
        console.error('Error updating job:', error)
        return NextResponse.json(
            { error: 'Failed to update job' },
            { status: 500 }
        )
    }
}
