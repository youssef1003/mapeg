import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { requireAdmin } from '@/lib/auth'

const prisma = new PrismaClient()

// GET - Fetch single blog post
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Check admin authentication
  const session = await requireAdmin(request)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 })
  }

  try {
    const post = await prisma.blogPostManaged.findUnique({
      where: { id: params.id },
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 })
  }
}

// PUT - Update blog post
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Check admin authentication
  const session = await requireAdmin(request)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 })
  }

  try {
    const body = await request.json()
    console.log('Updating blog post:', params.id, body)
    
    const post = await prisma.blogPostManaged.update({
      where: { id: params.id },
      data: body,
    })

    console.log('Blog post updated successfully')
    return NextResponse.json({ success: true, post })
  } catch (error) {
    console.error('Error updating blog post:', error)
    return NextResponse.json({ 
      error: 'Failed to update blog post',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// DELETE - Delete blog post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Check admin authentication
  const session = await requireAdmin(request)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 })
  }

  try {
    console.log('Deleting blog post:', params.id)
    
    await prisma.blogPostManaged.delete({
      where: { id: params.id },
    })

    console.log('Blog post deleted successfully')
    return NextResponse.json({ success: true, message: 'تم حذف المقال بنجاح' })
  } catch (error) {
    console.error('Error deleting blog post:', error)
    return NextResponse.json({ 
      error: 'Failed to delete blog post',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
