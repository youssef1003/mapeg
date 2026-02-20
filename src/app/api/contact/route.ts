import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// POST - Submit a contact form message
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Validate required fields
        if (!body.name || !body.email || !body.subject || !body.message) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            )
        }

        const contact = await prisma.contact.create({
            data: {
                name: body.name,
                email: body.email,
                subject: body.subject,
                message: body.message,
            },
        })

        return NextResponse.json(
            {
                message: 'Thank you for your message. We will get back to you soon.',
                id: contact.id
            },
            { status: 201 }
        )
    } catch (error) {
        console.error('Error creating contact:', error)
        return NextResponse.json(
            { error: 'Failed to submit contact form' },
            { status: 500 }
        )
    }
}

// GET - Fetch contact messages (admin)
export async function GET() {
    try {
        const contacts = await prisma.contact.findMany({
            orderBy: { createdAt: 'desc' },
        })

        return NextResponse.json(contacts)
    } catch (error) {
        console.error('Error fetching contacts:', error)
        return NextResponse.json(
            { error: 'Failed to fetch contacts' },
            { status: 500 }
        )
    }
}
