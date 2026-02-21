import { NextRequest, NextResponse } from 'next/server'
import { get } from '@vercel/blob'
import { requireAuth } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

async function getPrisma() {
  const { default: prisma } = await import('@/lib/prisma')
  return prisma
}

export async function GET(request: NextRequest) {
  try {
    // Authenticate
    const session = await requireAuth(request)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get pathname from query
    const { searchParams } = new URL(request.url)
    const pathname = searchParams.get('pathname')

    if (!pathname) {
      return NextResponse.json(
        { error: 'Pathname is required' },
        { status: 400 }
      )
    }

    const prisma = await getPrisma()

    // Authorization logic
    if (session.role === 'ADMIN') {
      // Admin can download any CV
    } else if (session.role === 'CANDIDATE') {
      // Candidate can only download their own CV
      const candidate = await prisma.candidate.findUnique({
        where: { userId: session.sub }
      })

      if (!candidate || candidate.cvFilePath !== pathname) {
        return NextResponse.json(
          { error: 'Forbidden' },
          { status: 403 }
        )
      }
    } else if (session.role === 'EMPLOYER') {
      // Employer can download CV if candidate applied to their job
      const employer = await prisma.employer.findUnique({
        where: { userId: session.sub }
      })

      if (!employer) {
        return NextResponse.json(
          { error: 'Employer profile not found' },
          { status: 404 }
        )
      }

      // Check if there's an application from this candidate to employer's job
      const application = await prisma.application.findFirst({
        where: {
          job: {
            employerId: employer.id
          },
          candidate: {
            cvFilePath: pathname
          }
        }
      })

      if (!application) {
        return NextResponse.json(
          { error: 'Forbidden' },
          { status: 403 }
        )
      }
    } else {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Download from Vercel Blob
    const result = await get(pathname, { access: 'private' })

    if (!result) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

    // Return file stream
    return new NextResponse(result.stream as any, {
      headers: {
        'Content-Type': result.blob.contentType || 'application/octet-stream',
        'Cache-Control': 'private, no-store'
      }
    })

  } catch (error: any) {
    console.error('CV download error:', error)
    return NextResponse.json(
      { error: 'Failed to download CV' },
      { status: 500 }
    )
  }
}
