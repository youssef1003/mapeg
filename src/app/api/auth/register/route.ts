import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { sendEmail, emailTemplates } from '@/lib/email'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
    try {
        console.log('📝 Register API called')
        
        const body = await request.json()
        const { name, email, password, role, phone, companyName, industry, country, locale = 'ar' } = body

        console.log('📧 Email:', email, 'Role:', role)

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            )
        }

        // Validate password strength
        if (password.length < 8) {
            return NextResponse.json(
                { error: 'Password must be at least 8 characters long' },
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

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex')

        const user = await prisma.user.create({
            data: {
                name: name || null,
                email,
                password: hashedPassword,
                role: userRole,
                phone: phone || null,
                emailVerified: false,
                verificationToken
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

        // Send verification email
        try {
            const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
            const verificationLink = `${appUrl}/api/auth/verify-email?token=${verificationToken}`

            const emailContent = emailTemplates.emailVerification(locale as 'ar' | 'en', {
                name: user.name || 'User',
                verificationLink
            })

            await sendEmail({
                to: user.email,
                subject: emailContent.subject,
                html: emailContent.html,
                locale: locale as 'ar' | 'en'
            })

            console.log('✅ Verification email sent')
        } catch (emailError) {
            console.error('⚠️ Failed to send verification email:', emailError)
            // Don't fail registration if email fails
        }

        const response = NextResponse.json({
            success: true,
            message: 'User registered successfully. Please check your email to verify your account.',
            requiresVerification: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                emailVerified: user.emailVerified
            }
        }, { status: 201 })

        // Don't set session cookies until email is verified
        // User will need to login after verification

        return response

    } catch (error: any) {
        console.error('❌ Registration error:', error.message)
        return NextResponse.json(
            { error: 'Failed to register user' },
            { status: 500 }
        )
    }
}
