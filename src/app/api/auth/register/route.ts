import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
    try {
        console.log('📝 Register API called')
        
        const body = await request.json()
        const { name, email, password, role, phone, companyName, industry, country } = body

        console.log('📧 Email:', email, 'Role:', role)

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            )
        }

        const validRoles = ['CANDIDATE', 'EMPLOYER']
        const userRole = validRoles.includes(role) ? role : 'CANDIDATE'

        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 400 }
            )
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                name: name || null,
                email,
                password: hashedPassword,
                role: userRole,
                phone: phone || null
            }
        })

        console.log('✅ User created:', user.id)

        if (userRole === 'EMPLOYER') {
            await prisma.employer.create({
                data: {
                    companyName: companyName || name || 'My Company',
                    email: email,
                    phone: phone || '',
                    industry: industry || 'Other',
                    country: country || 'Egypt',
                    userId: user.id
                }
            })
        } else if (userRole === 'CANDIDATE') {
            await prisma.candidate.create({
                data: {
                    name: name || '',
                    email: email,
                    phone: phone || '',
                    skills: '',
                    experience: '',
                    education: '',
                    country: country || 'Egypt',
                    userId: user.id
                }
            })
        }

        console.log('✅ Profile created')

        const response = NextResponse.json({
            success: true,
            message: 'User registered successfully',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        }, { status: 201 })

        response.cookies.set('user_session', user.id, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30,
            path: '/',
        })

        response.cookies.set('user_role', user.role, {
            httpOnly: false,
            secure: false,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30,
            path: '/',
        })

        return response

    } catch (error: any) {
        console.error('❌ Registration error:', error.message)
        return NextResponse.json(
            { error: 'Failed to register user' },
            { status: 500 }
        )
    }
}
