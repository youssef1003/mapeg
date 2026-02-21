import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

// GET - Fetch all employers (public but hide sensitive fields for non-admin)
export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth(request)
    const isAdmin = session?.role === 'ADMIN'

    const employers = await prisma.employer.findMany({
      include: {
        _count: {
          select: { jobs: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Hide sensitive fields for non-admin
    if (!isAdmin) {
      const sanitized = employers.map(emp => ({
        id: emp.id,
        companyName: emp.companyName,
        industry: emp.industry,
        country: emp.country,
        website: emp.website,
        description: emp.description,
        _count: emp._count,
        createdAt: emp.createdAt,
        updatedAt: emp.updatedAt
      }))
      return NextResponse.json(sanitized)
    }

    return NextResponse.json(employers)
  } catch (error) {
    console.error('Error fetching employers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch employers' },
      { status: 500 }
    )
  }
}

// POST - Create a new employer (Admin only)
export async function POST(request: NextRequest) {
  const { requireAdmin } = await import('@/lib/auth')
  const session = await requireAdmin(request)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

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
