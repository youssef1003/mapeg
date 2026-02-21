import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// GET - Fetch site settings
export async function GET() {
    try {
        // Get or create default settings
        let settings = await prisma.siteSettings.findUnique({
            where: { id: 'main' }
        })

        if (!settings) {
            settings = await prisma.siteSettings.create({
                data: {
                    id: 'main',
                    siteName: 'MapEg',
                    siteEmail: 'info@mapeg.com',
                    sitePhone: '+20 2 1234 5678',
                    siteAddress: '123 Business District, New Cairo, Egypt',
                    candidatesPlaced: '15,000+',
                    partnerCompanies: '2,500+',
                    countriesCovered: '10+',
                    successRate: '98%',
                    heroJobsToday: '250+',
                    heroCountries: '10+',
                    aboutCandidates: '15,000+',
                    aboutCompanies: '2,500+',
                }
            })
        }

        return NextResponse.json(settings)
    } catch (error) {
        console.error('Error fetching settings:', error)
        return NextResponse.json(
            { error: 'Failed to fetch settings' },
            { status: 500 }
        )
    }
}

// PUT - Update site settings (Admin only)
export async function PUT(request: NextRequest) {
    const { requireAdmin } = await import('@/lib/auth')
    const session = await requireAdmin(request)
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()

        console.log('[Settings API] Updating settings:', body)

        const settings = await prisma.siteSettings.upsert({
            where: { id: 'main' },
            update: {
                siteName: body.siteName || 'MapEg',
                siteEmail: body.siteEmail || 'info@mapeg.com',
                sitePhone: body.sitePhone || '+20 2 1234 5678',
                siteAddress: body.siteAddress || '123 Business District, New Cairo, Egypt',
                candidatesPlaced: body.candidatesPlaced || '15,000+',
                partnerCompanies: body.partnerCompanies || '2,500+',
                countriesCovered: body.countriesCovered || '10+',
                successRate: body.successRate || '98%',
                heroJobsToday: body.heroJobsToday || '250+',
                heroCountries: body.heroCountries || '10+',
                aboutCandidates: body.aboutCandidates || '15,000+',
                aboutCompanies: body.aboutCompanies || '2,500+',
                aboutMissionAr: body.aboutMissionAr || null,
                aboutMissionEn: body.aboutMissionEn || null,
                facebookUrl: body.facebookUrl || null,
                twitterUrl: body.twitterUrl || null,
                linkedinUrl: body.linkedinUrl || null,
                instagramUrl: body.instagramUrl || null,
                whatsappNumber: body.whatsappNumber || null,
            },
            create: {
                id: 'main',
                siteName: body.siteName || 'MapEg',
                siteEmail: body.siteEmail || 'info@mapeg.com',
                sitePhone: body.sitePhone || '+20 2 1234 5678',
                siteAddress: body.siteAddress || '123 Business District, New Cairo, Egypt',
                candidatesPlaced: body.candidatesPlaced || '15,000+',
                partnerCompanies: body.partnerCompanies || '2,500+',
                countriesCovered: body.countriesCovered || '10+',
                successRate: body.successRate || '98%',
                heroJobsToday: body.heroJobsToday || '250+',
                heroCountries: body.heroCountries || '10+',
                aboutCandidates: body.aboutCandidates || '15,000+',
                aboutCompanies: body.aboutCompanies || '2,500+',
                aboutMissionAr: body.aboutMissionAr || null,
                aboutMissionEn: body.aboutMissionEn || null,
                facebookUrl: body.facebookUrl || null,
                twitterUrl: body.twitterUrl || null,
                linkedinUrl: body.linkedinUrl || null,
                instagramUrl: body.instagramUrl || null,
                whatsappNumber: body.whatsappNumber || null,
            }
        })

        console.log('[Settings API] Settings updated successfully:', settings)

        // Revalidate all pages that use settings
        revalidatePath('/')
        revalidatePath('/ar')
        revalidatePath('/en')

        return NextResponse.json(settings)
    } catch (error) {
        console.error('[Settings API] Error updating settings:', error)
        return NextResponse.json(
            { error: 'Failed to update settings' },
            { status: 500 }
        )
    }
}
