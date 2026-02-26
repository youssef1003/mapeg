// Email service using Nodemailer
import nodemailer from 'nodemailer'

interface EmailOptions {
  to: string
  subject: string
  html: string
  locale?: 'ar' | 'en'
}

// Create transporter (lazy initialization)
let transporter: nodemailer.Transporter | null = null

function getTransporter() {
  if (!transporter) {
    const smtpHost = process.env.SMTP_HOST
    const smtpPort = process.env.SMTP_PORT
    const smtpUser = process.env.SMTP_USER
    const smtpPass = process.env.SMTP_PASS

    // If SMTP not configured, return null (will log only)
    if (!smtpHost || !smtpUser || !smtpPass) {
      console.warn('⚠️ SMTP not configured. Emails will be logged only.')
      return null
    }

    transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort || '465'),
      secure: true,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    })
  }
  return transporter
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  const transport = getTransporter()
  
  // If no transporter, just log
  if (!transport) {
    console.log('📧 Email would be sent:', { to, subject })
    return { success: true }
  }

  try {
    await transport.sendMail({
      from: process.env.SMTP_FROM || 'MapEg <noreply@mapeg.com>',
      to,
      subject,
      html,
    })
    console.log('✅ Email sent successfully to:', to)
    return { success: true }
  } catch (error) {
    console.error('❌ Email send error:', error)
    return { success: false, error }
  }
}

// Email Templates
export const emailTemplates = {
  emailVerification: (locale: 'ar' | 'en', data: { name: string; verificationLink: string }) => ({
    subject: locale === 'ar' 
      ? 'تأكيد البريد الإلكتروني - MapEg'
      : 'Email Verification - MapEg',
    html: locale === 'ar' ? `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e40af;">مرحباً ${data.name}</h2>
        <p>شكراً لتسجيلك في MapEg! يرجى تأكيد بريدك الإلكتروني للمتابعة.</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <a href="${data.verificationLink}" style="display: inline-block; background: #1e40af; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            تأكيد البريد الإلكتروني
          </a>
        </div>
        <p style="color: #6b7280; font-size: 14px;">
          أو انسخ هذا الرابط في المتصفح:<br>
          <a href="${data.verificationLink}" style="color: #1e40af; word-break: break-all;">${data.verificationLink}</a>
        </p>
        <p style="color: #ef4444; font-size: 14px; margin-top: 20px;">
          ⚠️ هذا الرابط صالح لمدة 24 ساعة فقط.
        </p>
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          إذا لم تقم بإنشاء حساب، يرجى تجاهل هذا البريد.<br><br>
          شكراً لاستخدامك MapEg<br>
          <a href="https://mapeg.com" style="color: #1e40af;">mapeg.com</a>
        </p>
      </div>
    ` : `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e40af;">Hello ${data.name}</h2>
        <p>Thank you for registering with MapEg! Please verify your email to continue.</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <a href="${data.verificationLink}" style="display: inline-block; background: #1e40af; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Verify Email
          </a>
        </div>
        <p style="color: #6b7280; font-size: 14px;">
          Or copy this link to your browser:<br>
          <a href="${data.verificationLink}" style="color: #1e40af; word-break: break-all;">${data.verificationLink}</a>
        </p>
        <p style="color: #ef4444; font-size: 14px; margin-top: 20px;">
          ⚠️ This link is valid for 24 hours only.
        </p>
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          If you didn't create an account, please ignore this email.<br><br>
          Thank you for using MapEg<br>
          <a href="https://mapeg.com" style="color: #1e40af;">mapeg.com</a>
        </p>
      </div>
    `
  }),

  passwordReset: (locale: 'ar' | 'en', data: { name: string; resetLink: string }) => ({
    subject: locale === 'ar'
      ? 'إعادة تعيين كلمة المرور - MapEg'
      : 'Password Reset - MapEg',
    html: locale === 'ar' ? `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e40af;">مرحباً ${data.name}</h2>
        <p>تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بك.</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <a href="${data.resetLink}" style="display: inline-block; background: #1e40af; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            إعادة تعيين كلمة المرور
          </a>
        </div>
        <p style="color: #6b7280; font-size: 14px;">
          أو انسخ هذا الرابط في المتصفح:<br>
          <a href="${data.resetLink}" style="color: #1e40af; word-break: break-all;">${data.resetLink}</a>
        </p>
        <p style="color: #ef4444; font-size: 14px; margin-top: 20px;">
          ⚠️ هذا الرابط صالح لمدة ساعة واحدة فقط.
        </p>
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          إذا لم تطلب إعادة تعيين كلمة المرور، يرجى تجاهل هذا البريد. حسابك آمن.<br><br>
          شكراً لاستخدامك MapEg<br>
          <a href="https://mapeg.com" style="color: #1e40af;">mapeg.com</a>
        </p>
      </div>
    ` : `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e40af;">Hello ${data.name}</h2>
        <p>We received a request to reset your password.</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <a href="${data.resetLink}" style="display: inline-block; background: #1e40af; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Reset Password
          </a>
        </div>
        <p style="color: #6b7280; font-size: 14px;">
          Or copy this link to your browser:<br>
          <a href="${data.resetLink}" style="color: #1e40af; word-break: break-all;">${data.resetLink}</a>
        </p>
        <p style="color: #ef4444; font-size: 14px; margin-top: 20px;">
          ⚠️ This link is valid for 1 hour only.
        </p>
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          If you didn't request a password reset, please ignore this email. Your account is safe.<br><br>
          Thank you for using MapEg<br>
          <a href="https://mapeg.com" style="color: #1e40af;">mapeg.com</a>
        </p>
      </div>
    `
  }),

  applicationSubmitted: (locale: 'ar' | 'en', data: { candidateName: string; jobTitle: string; companyName: string }) => ({
    subject: locale === 'ar' 
      ? `تم استلام طلبك للوظيفة: ${data.jobTitle}`
      : `Application Received: ${data.jobTitle}`,
    html: locale === 'ar' ? `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e40af;">مرحباً ${data.candidateName}</h2>
        <p>تم استلام طلبك للوظيفة بنجاح!</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0;">تفاصيل الطلب:</h3>
          <p style="margin: 5px 0;"><strong>الوظيفة:</strong> ${data.jobTitle}</p>
          <p style="margin: 5px 0;"><strong>الشركة:</strong> ${data.companyName}</p>
        </div>
        <p>سيتم مراجعة طلبك من قبل فريق التوظيف وسنتواصل معك قريباً.</p>
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          شكراً لاستخدامك MapEg<br>
          <a href="https://mapeg.com" style="color: #1e40af;">mapeg.com</a>
        </p>
      </div>
    ` : `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e40af;">Hello ${data.candidateName}</h2>
        <p>Your application has been received successfully!</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0;">Application Details:</h3>
          <p style="margin: 5px 0;"><strong>Job:</strong> ${data.jobTitle}</p>
          <p style="margin: 5px 0;"><strong>Company:</strong> ${data.companyName}</p>
        </div>
        <p>Your application will be reviewed by our recruitment team and we'll contact you soon.</p>
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          Thank you for using MapEg<br>
          <a href="https://mapeg.com" style="color: #1e40af;">mapeg.com</a>
        </p>
      </div>
    `
  }),

  applicationStatusUpdate: (locale: 'ar' | 'en', data: { candidateName: string; jobTitle: string; status: string }) => ({
    subject: locale === 'ar'
      ? `تحديث حالة طلبك: ${data.jobTitle}`
      : `Application Status Update: ${data.jobTitle}`,
    html: locale === 'ar' ? `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e40af;">مرحباً ${data.candidateName}</h2>
        <p>تم تحديث حالة طلبك للوظيفة: <strong>${data.jobTitle}</strong></p>
        <div style="background: ${data.status === 'accepted' ? '#d1fae5' : '#fee2e2'}; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0; color: ${data.status === 'accepted' ? '#065f46' : '#991b1b'};">
            ${data.status === 'accepted' ? '✅ تم قبول طلبك!' : '❌ تم رفض طلبك'}
          </h3>
        </div>
        <p>يمكنك مراجعة جميع طلباتك من خلال لوحة التحكم الخاصة بك.</p>
        <a href="https://mapeg.com/ar/candidates/applications" style="display: inline-block; background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
          عرض طلباتي
        </a>
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          شكراً لاستخدامك MapEg<br>
          <a href="https://mapeg.com" style="color: #1e40af;">mapeg.com</a>
        </p>
      </div>
    ` : `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e40af;">Hello ${data.candidateName}</h2>
        <p>Your application status for <strong>${data.jobTitle}</strong> has been updated.</p>
        <div style="background: ${data.status === 'accepted' ? '#d1fae5' : '#fee2e2'}; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0; color: ${data.status === 'accepted' ? '#065f46' : '#991b1b'};">
            ${data.status === 'accepted' ? '✅ Application Accepted!' : '❌ Application Rejected'}
          </h3>
        </div>
        <p>You can review all your applications from your dashboard.</p>
        <a href="https://mapeg.com/en/candidates/applications" style="display: inline-block; background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
          View My Applications
        </a>
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          Thank you for using MapEg<br>
          <a href="https://mapeg.com" style="color: #1e40af;">mapeg.com</a>
        </p>
      </div>
    `
  }),

  newApplicationReceived: (locale: 'ar' | 'en', data: { employerName: string; candidateName: string; jobTitle: string; applicationId: string }) => ({
    subject: locale === 'ar'
      ? `طلب توظيف جديد: ${data.jobTitle}`
      : `New Application: ${data.jobTitle}`,
    html: locale === 'ar' ? `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e40af;">مرحباً ${data.employerName}</h2>
        <p>تلقيت طلب توظيف جديد!</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0;">تفاصيل الطلب:</h3>
          <p style="margin: 5px 0;"><strong>المرشح:</strong> ${data.candidateName}</p>
          <p style="margin: 5px 0;"><strong>الوظيفة:</strong> ${data.jobTitle}</p>
        </div>
        <a href="https://mapeg.com/ar/employers/applications" style="display: inline-block; background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
          مراجعة الطلب
        </a>
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          MapEg - منصة التوظيف<br>
          <a href="https://mapeg.com" style="color: #1e40af;">mapeg.com</a>
        </p>
      </div>
    ` : `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e40af;">Hello ${data.employerName}</h2>
        <p>You have received a new job application!</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0;">Application Details:</h3>
          <p style="margin: 5px 0;"><strong>Candidate:</strong> ${data.candidateName}</p>
          <p style="margin: 5px 0;"><strong>Job:</strong> ${data.jobTitle}</p>
        </div>
        <a href="https://mapeg.com/en/employers/applications" style="display: inline-block; background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
          Review Application
        </a>
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          MapEg - Recruitment Platform<br>
          <a href="https://mapeg.com" style="color: #1e40af;">mapeg.com</a>
        </p>
      </div>
    `
  }),
}
