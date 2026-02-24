import { NextRequest, NextResponse } from 'next/server'
import { requireCandidate } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

// GET - Fetch candidate profile
export async function GET(request: NextRequest) {
  try {
    const session = await requireCandidate(request)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Find candidate by email
    const candidate = await prisma.candidate.findUnique({
      where: { email: session.email },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        profession: true,
        yearsOfExperience: true,
        city: true,
        skills: true,
        summary: true,
        cvFilePath: true,
        profileImage: true,
      }
    })

    if (!candidate) {
      return NextResponse.json(
        { error: 'Candidate not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(candidate)
  } catch (error) {
    console.error('Error fetching candidate profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update candidate profile
export async function PUT(request: NextRequest) {
  console.log('📝 PUT /api/candidates/profile - Starting update...')
  
  try {
    const session = await requireCandidate(request)
    console.log('🔐 Session:', session ? 'Valid' : 'Invalid')
    
    if (!session) {
      console.log('❌ Unauthorized - No valid session')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    console.log('📦 Received data:', body)
    
    const {
      name,
      phone,
      profession,
      yearsOfExperience,
      city,
      skills,
      summary
    } = body

    // Validate required fields
    if (!name || !phone || !skills) {
      console.log('❌ Missing required fields')
      return NextResponse.json(
        { error: 'Name, phone, and skills are required' },
        { status: 400 }
      )
    }

    // Parse yearsOfExperience safely
    let parsedYears = null
    if (yearsOfExperience !== null && yearsOfExperience !== undefined && yearsOfExperience !== '') {
      parsedYears = parseInt(String(yearsOfExperience))
      if (isNaN(parsedYears)) {
        parsedYears = null
      }
    }

    console.log('📝 Updating candidate for email:', session.email)
    console.log('📝 Data to update:', {
      name,
      phone,
      profession: profession || null,
      yearsOfExperience: parsedYears,
      city: city || null,
      skills,
      summary: summary || null
    })

    // Update candidate
    const updatedCandidate = await prisma.candidate.update({
      where: { email: session.email },
      data: {
        name,
        phone,
        profession: profession || null,
        yearsOfExperience: parsedYears,
        city: city || null,
        skills,
        summary: summary || null,
        updatedAt: new Date()
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        profession: true,
        yearsOfExperience: true,
        city: true,
        skills: true,
        summary: true,
        cvFilePath: true,
        profileImage: true,
      }
    })

    console.log('✅ Candidate updated successfully')
    return NextResponse.json(updatedCandidate)
  } catch (error) {
    console.error('❌ Error updating candidate profile:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
