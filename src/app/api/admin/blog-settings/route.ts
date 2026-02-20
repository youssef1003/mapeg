import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { requireAdmin } from '@/lib/auth'

const prisma = new PrismaClient()

// GET - Fetch all blog posts and categories
export async function GET(request: NextRequest) {
  // Check admin authentication
  const session = await requireAdmin(request)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 })
  }

  try {
    const [posts, categories] = await Promise.all([
      prisma.blogPostManaged.findMany({ orderBy: { createdAt: 'desc' } }),
      prisma.blogCategory.findMany({ orderBy: { order: 'asc' } }),
    ])

    return NextResponse.json({ posts, categories })
  } catch (error) {
    console.error('Error fetching blog settings:', error)
    return NextResponse.json({ error: 'Failed to fetch blog settings' }, { status: 500 })
  }
}

// POST - Create new blog post
export async function POST(request: NextRequest) {
  // Check admin authentication
  const session = await requireAdmin(request)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 })
  }

  try {
    const body = await request.json()
    console.log('Creating blog post:', body)
    
    const post = await prisma.blogPostManaged.create({
      data: body,
    })

    console.log('Blog post created successfully:', post.id)
    return NextResponse.json({ success: true, post })
  } catch (error) {
    console.error('Error creating blog post:', error)
    return NextResponse.json({ 
      error: 'Failed to create blog post',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
