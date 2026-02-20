import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET - Fetch all employers
export async function GET() {
  try {
    const employers = await prisma.employer.findMany({
      include: {
        _count: {
          select: { jobs: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(employers)
  } catch (error) {
    console.error('Error fetching employers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch employers' },
      { status: 500 }
    )
  }
}

// POST - Create a new employer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.companyName || !body.email) {
      return NextResponse.json(
        { error: 'Company name and email are required' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existing = await prisma.employer.findUnique({
      where: { email: body.email }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      )
    }

    const employer = await prisma.employer.create({
      data: {
        companyName: body.companyName,
        email: body.email,
        phone: body.phone || '',
        industry: body.industry || 'Other',
        country: body.country || 'Egypt',
        website: body.website || null,
        description: body.description || null,
      }
    })

    return NextResponse.json(employer, { status: 201 })
  } catch (error) {
    console.error('Error creating employer:', error)
    return NextResponse.json(
      { error: 'Failed to create employer' },
      { status: 500 }
    )
  }
}
