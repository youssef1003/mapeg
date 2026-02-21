import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// DEPRECATED: Use /api/auth/login instead
export async function POST() {
  return NextResponse.json(
    { error: 'This endpoint is deprecated. Please use /api/auth/login' },
    { status: 410 }
  )
}
