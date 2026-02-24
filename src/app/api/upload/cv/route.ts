import { NextRequest, NextResponse } from 'next/server'
import { requireCandidate } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  console.log('📤 POST /api/upload/cv - Starting upload...')
  
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

    const formData = await request.formData()
    const file = formData.get('cv') as File
    console.log('📄 File received:', file ? file.name : 'No file')
    
    if (!file) {
      console.log('❌ No file provided')
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    console.log('📄 File type:', file.type)
    console.log('📄 File size:', file.size, 'bytes')

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
    
    if (!allowedTypes.includes(file.type)) {
      console.log('❌ Invalid file type:', file.type)
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF and Word documents are allowed' },
        { status: 400 }
      )
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      console.log('❌ File too large:', file.size)
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const fileExtension = file.name.split('.').pop()
    const fileName = `cv_${session.email.replace(/[^a-zA-Z0-9]/g, '_')}_${timestamp}.${fileExtension}`
    
    let cvUrl: string

    // Check if we're on Vercel with Blob Storage
    if (process.env.UPLOAD_BLOB_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN) {
      console.log('💾 Uploading to Vercel Blob Storage...')
      const { put } = await import('@vercel/blob')
      
      const blob = await put(fileName, file, {
        access: 'public',
        addRandomSuffix: false,
        token: process.env.UPLOAD_BLOB_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN,
      })
      
      cvUrl = blob.url
      console.log('✅ File uploaded to Blob:', cvUrl)
    } else {
      // Fallback to local file system for development
      console.log('💾 Saving to local file system...')
      const { writeFile, mkdir } = await import('fs/promises')
      const { join } = await import('path')
      const { existsSync } = await import('fs')
      
      const uploadsDir = join(process.cwd(), 'public', 'uploads', 'cvs')
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true })
      }
      
      const filePath = join(uploadsDir, fileName)
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      await writeFile(filePath, buffer)
      
      cvUrl = `/uploads/cvs/${fileName}`
      console.log('✅ File saved locally:', cvUrl)
    }

    // Update candidate record
    console.log('📝 Updating database for email:', session.email)
    await prisma.candidate.update({
      where: { email: session.email },
      data: {
        cvFilePath: cvUrl,
        updatedAt: new Date()
      }
    })
    console.log('✅ Database updated successfully')

    return NextResponse.json({
      success: true,
      filePath: cvUrl,
      message: 'CV uploaded successfully'
    })
  } catch (error) {
    console.error('❌ Error uploading CV:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
