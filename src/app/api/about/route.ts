import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const [content, values, milestones, team, offices] = await Promise.all([
      prisma.aboutPageContent.findUnique({ where: { id: 'main' } }),
      prisma.aboutValue.findMany({ orderBy: { order: 'asc' } }),
      prisma.aboutMilestone.findMany({ orderBy: { order: 'asc' } }),
      prisma.aboutTeamMember.findMany({ orderBy: { order: 'asc' } }),
      prisma.aboutOffice.findMany({ orderBy: { order: 'asc' } }),
    ])

    return NextResponse.json({
      content,
      values,
      milestones,
      team,
      offices,
    })
  } catch (error) {
    console.error('Error fetching about page:', error)
    return NextResponse.json({ error: 'Failed to fetch about page' }, { status: 500 })
  }
}
