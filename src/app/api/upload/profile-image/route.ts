import { NextRequest, NextResponse } from 'next/server'
import { requireCandidate } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { put } from '@vercel/blob'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  console.log('📤 POST /api/upload/profile-image - Starting upload...')
  
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
    const file = formData.get('image') as File
    console.log('🖼️ File received:', file ? file.name : 'No file')
    
    if (!file) {
      console.log('❌ No file provided')
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    console.log('🖼️ File type:', file.type)
    console.log('🖼️ File size:', file.size, 'bytes')

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.log('❌ Invalid file type:', file.type)
      return NextResponse.json(
        { error: 'Invalid file type. Only images are allowed' },
        { status: 400 }
      )
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      console.log('❌ File too large:', file.size)
      return NextResponse.json(
        { error: 'File size exceeds 2MB limit' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const fileExtension = file.name.split('.').pop()
    const fileName = `profile_${session.email.replace(/[^a-zA-Z0-9]/g, '_')}_${timestamp}.${fileExtension}`
    
    console.log('💾 Uploading file to Vercel Blob:', fileName)

    // Upload to Vercel Blob
    const blob = await put(fileName, file, {
      access: 'public',
      addRandomSuffix: false,
    })
    
    console.log('✅ File uploaded successfully to:', blob.url)

    // Update candidate record with profile image
    console.log('📝 Updating database for email:', session.email)
    await prisma.candidate.update({
      where: { email: session.email },
      data: {
        profileImage: blob.url,
        updatedAt: new Date()
      }
    })
    console.log('✅ Database updated successfully')
    
    return NextResponse.json({
      success: true,
      imageUrl: blob.url,
      message: 'Profile image uploaded successfully'
    })
  } catch (error) {
    console.error('❌ Error uploading profile image:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
