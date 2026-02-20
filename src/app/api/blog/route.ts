import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const [posts, categories] = await Promise.all([
      prisma.blogPostManaged.findMany({
        where: { published: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.blogCategory.findMany({ orderBy: { order: 'asc' } }),
    ])

    return NextResponse.json({ posts, categories })
  } catch (error) {
    console.error('Error fetching blog:', error)
    return NextResponse.json({ error: 'Failed to fetch blog' }, { status: 500 })
  }
}
