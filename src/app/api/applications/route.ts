import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth, requireRole, requireCandidate } from '@/lib/auth'
import { sendEmail, emailTemplates } from '@/lib/email'

// POST - Submit a job application (CANDIDATE only)
export async function POST(request: NextRequest) {
    try {
        // Check authentication
        const session = await requireCandidate(request)
        
        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized - Please login as a candidate' },
                { status: 401 }
            )
        }

        const body = await request.json()

        // Verify job exists
        const job = await prisma.job.findUnique({
            where: { id: body.jobId },
        })

        if (!job) {
            return NextResponse.json(
                { error: 'Job not found' },
                { status: 404 }
            )
        }

        // Get candidate from session
        const candidate = await prisma.candidate.findUnique({
            where: { userId: session.sub },
        })

        if (!candidate) {
            return NextResponse.json(
                { error: 'Candidate profile not found. Please complete your profile first.' },
                { status: 404 }
            )
        }

        // Check for existing application
        const existingApplication = await prisma.application.findFirst({
            where: {
                jobId: body.jobId,
                candidateId: candidate.id,
            },
        })

        if (existingApplication) {
            return NextResponse.json(
                { error: 'You have already applied for this job' },
                { status: 400 }
            )
        }

        const application = await prisma.application.create({
            data: {
                jobId: body.jobId,
                candidateId: candidate.id,
                coverLetter: body.coverLetter || '',
                status: 'pending',
            },
            include: {
                job: {
                    include: {
                        employer: {
                            select: {
                                companyName: true,
                                email: true,
                            },
                        },
                    },
                },
            },
        })

        // Send email to candidate
        try {
            const candidateEmail = emailTemplates.applicationSubmitted('ar', {
                candidateName: candidate.name,
                jobTitle: job.title,
                companyName: job.company,
            })
            await sendEmail({
                to: candidate.email,
                subject: candidateEmail.subject,
                html: candidateEmail.html,
            })
        } catch (error) {
            console.error('Failed to send candidate email:', error)
        }

        // Send email to employer
        if (application.job.employer) {
            try {
                const employerEmail = emailTemplates.newApplicationReceived('ar', {
                    employerName: application.job.employer.companyName,
                    candidateName: candidate.name,
                    jobTitle: job.title,
                    applicationId: application.id,
                })
                await sendEmail({
                    to: application.job.employer.email,
                    subject: employerEmail.subject,
                    html: employerEmail.html,
                })
            } catch (error) {
                console.error('Failed to send employer email:', error)
            }
        }

        return NextResponse.json(application, { status: 201 })
    } catch (error) {
        console.error('Error creating application:', error)
        return NextResponse.json(
            { error: 'Failed to submit application' },
            { status: 500 }
        )
    }
}

// GET - Fetch applications (role-based access)
export async function GET(request: NextRequest) {
    try {
        // Check authentication
        const session = await requireAuth(request)
        
        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized - Please login' },
                { status: 401 }
            )
        }

        const { searchParams } = new URL(request.url)
        const jobId = searchParams.get('jobId')
        const status = searchParams.get('status')

        let applications

        if (session.role === 'ADMIN') {
            // Admin can see all applications
            const where: Record<string, unknown> = {}
            if (jobId) where.jobId = jobId
            if (status) where.status = status

            applications = await prisma.application.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                include: {
                    job: {
                        select: {
                            title: true,
                            company: true,
                            location: true,
                        },
                    },
                    candidate: {
                        select: {
                            name: true,
                            email: true,
                            phone: true,
                        },
                    },
                },
            })
        } else if (session.role === 'CANDIDATE') {
            // Candidate can only see their own applications
            const candidate = await prisma.candidate.findUnique({
                where: { userId: session.sub },
            })

            if (!candidate) {
                return NextResponse.json({ applications: [] })
            }

            const where: Record<string, unknown> = { candidateId: candidate.id }
            if (jobId) where.jobId = jobId
            if (status) where.status = status

            applications = await prisma.application.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                include: {
                    job: {
                        select: {
                            title: true,
                            company: true,
                            location: true,
                            type: true,
                        },
                    },
                },
            })
        } else if (session.role === 'EMPLOYER') {
            // Employer can see applications for their jobs only
            const employer = await prisma.employer.findUnique({
                where: { userId: session.sub },
            })

            if (!employer) {
                return NextResponse.json({ applications: [] })
            }

            const where: Record<string, unknown> = {
                job: {
                    employerId: employer.id,
                },
            }
            if (jobId) where.jobId = jobId
            if (status) where.status = status

            applications = await prisma.application.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                include: {
                    job: {
                        select: {
                            title: true,
                            company: true,
                            location: true,
                        },
                    },
                    candidate: {
                        select: {
                            name: true,
                            email: true,
                            phone: true,
                            profession: true,
                            yearsOfExperience: true,
                        },
                    },
                },
            })
        } else {
            return NextResponse.json(
                { error: 'Invalid role' },
                { status: 403 }
            )
        }

        return NextResponse.json({ applications })
    } catch (error) {
        console.error('Error fetching applications:', error)
        return NextResponse.json(
            { error: 'Failed to fetch applications' },
            { status: 500 }
        )
    }
}
