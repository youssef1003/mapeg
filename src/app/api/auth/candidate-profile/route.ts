import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function POST(request: NextRequest) {
    try {
        const session = await requireAuth(request)
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { profession, yearsOfExperience, city, skills, summary, cvFilePath } = body

        // Candidates can only update themselves, Admin can update anyone
        const targetUserId = session.role === 'ADMIN' && body.userId ? body.userId : session.sub

        // Update Candidate record
        const candidate = await prisma.candidate.update({
            where: { userId: targetUserId },
            data: {
                profession: profession || null,
                yearsOfExperience: yearsOfExperience ? parseInt(yearsOfExperience) : null,
                city: city || null,
                skills: skills || '',
                summary: summary || null,
                cvFilePath: cvFilePath || null,
                // Only update resume field if we have a CV file path (for backward compatibility or display)
                resume: cvFilePath ? cvFilePath : undefined
            }
        })

        return NextResponse.json({
            success: true,
            message: 'Profile updated successfully',
            candidate
        })

    } catch (error) {
        console.error('Profile update error:', error)
        return NextResponse.json(
            { error: 'Failed to update profile' },
            { status: 500 }
        )
    }
}
