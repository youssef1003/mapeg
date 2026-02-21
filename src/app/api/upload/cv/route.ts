import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const MAX_FILE_SIZE = 4 * 1024 * 1024 // 4MB
const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF, DOC, and DOCX are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 4MB limit.' },
        { status: 400 }
      )
    }

    // Upload to Vercel Blob (private)
    const blob = await put(`cvs/${file.name}`, file, {
      access: 'private',
      addRandomSuffix: true,
    })

    return NextResponse.json({
      success: true,
      pathname: blob.pathname
    })

  } catch (error: any) {
    console.error('CV upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload CV' },
      { status: 500 }
    )
  }
}
