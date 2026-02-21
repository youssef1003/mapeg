import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    const session = await requireAdmin(request)
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    try {
        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const thirtyDaysAgo = new Date(today)
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        // Get visitors today
        const visitorsToday = await prisma.pageView.count({
            where: {
                createdAt: {
                    gte: today
                }
            }
        })

        // Get visitors last 30 days
        const visitorsLast30Days = await prisma.pageView.count({
            where: {
                createdAt: {
                    gte: thirtyDaysAgo
                }
            }
        })

        // Get unique visitors today (by IP)
        const uniqueVisitorsToday = await prisma.pageView.groupBy({
            by: ['ipAddress'],
            where: {
                createdAt: {
                    gte: today
                },
                ipAddress: {
                    not: null
                }
            }
        })

        // Get unique visitors last 30 days
        const uniqueVisitorsLast30Days = await prisma.pageView.groupBy({
            by: ['ipAddress'],
            where: {
                createdAt: {
                    gte: thirtyDaysAgo
                },
                ipAddress: {
                    not: null
                }
            }
        })

        return NextResponse.json({
            visitorsToday,
            visitorsLast30Days,
            uniqueVisitorsToday: uniqueVisitorsToday.length,
            uniqueVisitorsLast30Days: uniqueVisitorsLast30Days.length,
        })
    } catch (error) {
        console.error('Error fetching analytics:', error)
        return NextResponse.json(
            { error: 'Failed to fetch analytics' },
            { status: 500 }
        )
    }
}
