import { NextResponse } from 'next/server'

// DEPRECATED: Use /api/auth/logout instead
export async function POST() {
  return NextResponse.json(
    { error: 'This endpoint is deprecated. Please use /api/auth/logout' },
    { status: 410 }
  )
}
