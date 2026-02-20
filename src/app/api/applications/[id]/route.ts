import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { sendEmail, emailTemplates } from '@/lib/email'

// PUT - Update application status
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await requireAuth(request)
        
        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const { status } = body

        // Validate status
        const validStatuses = ['pending', 'reviewed', 'accepted', 'rejected']
        if (!validStatuses.includes(status)) {
            return NextResponse.json(
                { error: 'Invalid status' },
                { status: 400 }
            )
        }

        // Get application with relations
        const application = await prisma.application.findUnique({
            where: { id: params.id },
            include: {
                job: {
                    include: {
                        employer: true,
                    },
                },
                candidate: true,
            },
        })

        if (!application) {
            return NextResponse.json(
                { error: 'Application not found' },
                { status: 404 }
            )
        }

        // Check permissions
        if (session.role === 'EMPLOYER') {
            const employer = await prisma.employer.findUnique({
                where: { userId: session.sub },
            })

            if (!employer || application.job.employerId !== employer.id) {
                return NextResponse.json(
                    { error: 'Forbidden - Not your job' },
                    { status: 403 }
                )
            }
        } else if (session.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Forbidden - Only employers and admins can update applications' },
                { status: 403 }
            )
        }

        // Update the application
        const updatedApplication = await prisma.application.update({
            where: { id: params.id },
            data: { status },
        })

        // Send email notification to candidate if status changed
        if (status !== application.status && (status === 'accepted' || status === 'rejected')) {
            try {
                const email = emailTemplates.applicationStatusUpdate('ar', {
                    candidateName: application.candidate.name,
                    jobTitle: application.job.title,
                    status: status,
                })
                await sendEmail({
                    to: application.candidate.email,
                    subject: email.subject,
                    html: email.html,
                })
            } catch (error) {
                console.error('Failed to send status update email:', error)
            }
        }

        return NextResponse.json(updatedApplication, { status: 200 })
    } catch (error) {
        console.error('Error updating application:', error)
        return NextResponse.json(
            { error: 'Failed to update application' },
            { status: 500 }
        )
    }
}
