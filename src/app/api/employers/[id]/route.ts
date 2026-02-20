import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET - Fetch a single employer
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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

    return NextResponse.json(employer)
  } catch (error) {
    console.error('Error fetching employer:', error)
    return NextResponse.json(
      { error: 'Failed to fetch employer' },
      { status: 500 }
    )
  }
}

// PUT - Update an employer
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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

// DELETE - Delete an employer
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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
