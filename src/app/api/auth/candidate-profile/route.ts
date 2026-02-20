import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { userId, profession, yearsOfExperience, city, skills, summary, cvFilePath } = body

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            )
        }

        // Update Candidate record
        const candidate = await prisma.candidate.update({
            where: { userId },
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
