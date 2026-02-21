import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

// GET - Fetch a single employer (public but hide sensitive fields for non-admin)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth(request)
    const isAdmin = session?.role === 'ADMIN'

    const employer = await prisma.employer.findUnique({
      where: { id: params.id },
      include: {
        jobs: true,
        _count: { select: { jobs: true } }
      }
    })

    if (!employer) {
      return NextResponse.json(
        { error: 'Employer not found' },
        { status: 404 }
      )
    }

    // Hide sensitive fields for non-admin
    if (!isAdmin) {
      const sanitized = {
        id: employer.id,
        companyName: employer.companyName,
        industry: employer.industry,
        country: employer.country,
        website: employer.website,
        description: employer.description,
        jobs: employer.jobs,
        _count: employer._count,
        createdAt: employer.createdAt,
        updatedAt: employer.updatedAt
      }
      return NextResponse.json(sanitized)
    }

    return NextResponse.json(employer)
  } catch (error) {
    console.error('Error fetching employer:', error)
    return NextResponse.json(
      { error: 'Failed to fetch employer' },
      { status: 500 }
    )
  }
}

// PUT - Update an employer (Admin or owner only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth(request)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Check if employer exists
    const existing = await prisma.employer.findUnique({
      where: { id: params.id }
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Employer not found' },
        { status: 404 }
      )
    }

    // Check authorization: Admin or owner
    if (session.role !== 'ADMIN' && existing.userId !== session.sub) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const employer = await prisma.employer.update({
      where: { id: params.id },
      data: {
        companyName: body.companyName,
        email: body.email,
        phone: body.phone,
        industry: body.industry,
        country: body.country,
        website: body.website || null,
        description: body.description || null,
      }
    })

    return NextResponse.json(employer)
  } catch (error) {
    console.error('Error updating employer:', error)
    return NextResponse.json(
      { error: 'Failed to update employer' },
      { status: 500 }
    )
  }
}

// DELETE - Delete an employer (Admin or owner only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth(request)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if employer exists
    const employer = await prisma.employer.findUnique({
      where: { id: params.id },
      include: {
        _count: { select: { jobs: true } }
      }
    })

    if (!employer) {
      return NextResponse.json(
        { error: 'Employer not found' },
        { status: 404 }
      )
    }

    // Check authorization: Admin or owner
    if (session.role !== 'ADMIN' && employer.userId !== session.sub) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Check if employer has jobs
    if (employer._count.jobs > 0) {
      return NextResponse.json(
        { error: 'Cannot delete employer with active jobs. Delete jobs first.' },
        { status: 400 }
      )
    }

    await prisma.employer.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Employer deleted successfully' })
  } catch (error) {
    console.error('Error deleting employer:', error)
    return NextResponse.json(
      { error: 'Failed to delete employer' },
      { status: 500 }
    )
  }
}
