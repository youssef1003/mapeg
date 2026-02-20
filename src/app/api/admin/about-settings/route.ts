import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { requireAdmin } from '@/lib/auth'

const prisma = new PrismaClient()

// GET - Fetch all about page content
export async function GET(request: NextRequest) {
  console.log('📥 GET /api/admin/about-settings')
  
  // Check admin authentication using JWT
  const session = await requireAdmin(request)
  
  if (!session) {
    console.log('❌ غير مصرح - Unauthorized')
    return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 })
  }

  try {
    const [content, values, milestones, team, offices] = await Promise.all([
      prisma.aboutPageContent.findUnique({ where: { id: 'main' } }),
      prisma.aboutValue.findMany({ orderBy: { order: 'asc' } }),
      prisma.aboutMilestone.findMany({ orderBy: { order: 'asc' } }),
      prisma.aboutTeamMember.findMany({ orderBy: { order: 'asc' } }),
      prisma.aboutOffice.findMany({ orderBy: { order: 'asc' } }),
    ])

    return NextResponse.json({
      content: content || null,
      values,
      milestones,
      team,
      offices,
    })
  } catch (error) {
    console.error('Error fetching about settings:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

// POST - Update about page content
export async function POST(request: NextRequest) {
  console.log('📤 POST /api/admin/about-settings')
  
  // Check admin authentication using JWT
  const session = await requireAdmin(request)
  
  if (!session) {
    console.log('❌ غير مصرح - Unauthorized')
    return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 })
  }

  try {
    const body = await request.json()
    console.log('📦 Received data:', JSON.stringify(body, null, 2))
    
    const { content, values, milestones, team, offices } = body

    // Update main content
    if (content) {
      console.log('Updating content...')
      await prisma.aboutPageContent.upsert({
        where: { id: 'main' },
        update: content,
        create: { id: 'main', ...content },
      })
      console.log('Content updated successfully')
    }

    // Update values
    if (values && Array.isArray(values)) {
      console.log('Updating values...')
      await prisma.aboutValue.deleteMany()
      if (values.length > 0) {
        await prisma.aboutValue.createMany({ data: values })
      }
      console.log('Values updated successfully')
    }

    // Update milestones
    if (milestones && Array.isArray(milestones)) {
      console.log('Updating milestones...')
      await prisma.aboutMilestone.deleteMany()
      if (milestones.length > 0) {
        await prisma.aboutMilestone.createMany({ data: milestones })
      }
      console.log('Milestones updated successfully')
    }

    // Update team
    if (team && Array.isArray(team)) {
      console.log('Updating team...')
      await prisma.aboutTeamMember.deleteMany()
      if (team.length > 0) {
        await prisma.aboutTeamMember.createMany({ data: team })
      }
      console.log('Team updated successfully')
    }

    // Update offices
    if (offices && Array.isArray(offices)) {
      console.log('Updating offices...')
      await prisma.aboutOffice.deleteMany()
      if (offices.length > 0) {
        await prisma.aboutOffice.createMany({ data: offices })
      }
      console.log('Offices updated successfully')
    }

    console.log('All updates completed successfully')
    return NextResponse.json({ success: true, message: 'تم حفظ الإعدادات بنجاح' })
  } catch (error) {
    console.error('Error updating about settings:', error)
    return NextResponse.json({ 
      error: 'Failed to update settings', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
