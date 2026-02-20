import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    console.log('🔐 Admin login API called')
    
    const body = await request.json()
    const { email, password } = body
    
    console.log('📧 Email received:', email)

    if (!email || !password) {
      console.log('❌ Missing credentials')
      return NextResponse.json(
        { error: 'البريد الإلكتروني وكلمة المرور مطلوبان' },
        { status: 400 }
      )
    }

    const adminEmail = process.env.ADMIN_EMAIL
    const adminPassword = process.env.ADMIN_PASSWORD

    console.log('🔍 Checking against:', adminEmail)

    if (!adminEmail || !adminPassword) {
      console.error('❌ ENV variables not set')
      return NextResponse.json(
        { error: 'خطأ في إعدادات النظام' },
        { status: 500 }
      )
    }

    if (email !== adminEmail || password !== adminPassword) {
      console.log('❌ Invalid credentials')
      return NextResponse.json(
        { error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' },
        { status: 401 }
      )
    }

    console.log('✅ Login successful')

    const response = NextResponse.json(
      { success: true, message: 'تم تسجيل الدخول بنجاح' },
      { status: 200 }
    )

    response.cookies.set('admin_session', 'true', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    response.cookies.set('user_role', 'ADMIN', {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    console.log('✅ Cookies set')

    return response
  } catch (error: any) {
    console.error('❌ Error:', error.message)
    return NextResponse.json(
      { error: 'حدث خطأ في تسجيل الدخول' },
      { status: 500 }
    )
  }
}
