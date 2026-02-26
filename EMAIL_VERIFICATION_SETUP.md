# Email Verification & Password Reset Setup Guide

## ✅ ما تم إضافته

### 1. Show/Hide Password
- تم إنشاء `PasswordInput` component مع زر لإظهار/إخفاء كلمة المرور
- تم تطبيقه في صفحات Login و Register

### 2. Email Verification System
- عند التسجيل، يتم إرسال email verification
- المستخدم لا يستطيع تسجيل الدخول قبل تأكيد البريد
- Token صالح لمدة 24 ساعة

### 3. Password Reset System
- صفحة "Forgot Password" لطلب إعادة تعيين كلمة المرور
- Token صالح لمدة ساعة واحدة فقط
- صفحة "Reset Password" لإدخال كلمة المرور الجديدة

## 📋 خطوات التفعيل

### الخطوة 1: تحديث Database

```bash
# تشغيل Migration
npx prisma migrate dev --name add_email_verification_and_password_reset

# أو إذا كنت على production
npx prisma migrate deploy
```

### الخطوة 2: إعداد SMTP (اختياري للتطوير)

أضف المتغيرات التالية في ملف `.env`:

```env
# Email Configuration (SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="465"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="MapEg <noreply@mapeg.com>"
```

#### للحصول على App Password من Gmail:
1. اذهب إلى Google Account Settings
2. Security → 2-Step Verification (يجب تفعيله أولاً)
3. App Passwords → اختر "Mail" و "Other"
4. انسخ الـ password المكون من 16 حرف

### الخطوة 3: اختبار النظام

#### اختبار بدون SMTP (Development):
- الإيميلات ستظهر في console logs فقط
- يمكنك نسخ الروابط من الـ logs واستخدامها

#### اختبار مع SMTP:
1. سجل حساب جديد
2. تحقق من بريدك الإلكتروني
3. اضغط على رابط التحقق
4. سجل دخول

## 🔗 الروابط الجديدة

- `/auth/forgot-password` - طلب إعادة تعيين كلمة المرور
- `/auth/reset-password?token=xxx` - إعادة تعيين كلمة المرور
- `/auth/verify-success` - صفحة نجاح التحقق
- `/api/auth/verify-email?token=xxx` - API للتحقق من البريد
- `/api/auth/forgot-password` - API لطلب إعادة التعيين
- `/api/auth/reset-password` - API لإعادة تعيين كلمة المرور

## 🔒 الأمان

- كل الـ tokens عشوائية (32 bytes)
- Verification token صالح لمدة 24 ساعة
- Reset token صالح لمدة ساعة واحدة
- كلمة المرور يجب أن تكون 8 أحرف على الأقل
- الـ tokens تُحذف بعد الاستخدام

## 📝 ملاحظات مهمة

1. **Admin Account**: حساب الأدمن من `.env` لا يحتاج email verification
2. **Existing Users**: المستخدمين الحاليين `emailVerified` سيكون `false` - يمكنك تحديثهم يدوياً:
   ```sql
   UPDATE "User" SET "emailVerified" = true WHERE "createdAt" < NOW();
   ```
3. **Production**: تأكد من إعداد SMTP قبل النشر على production
4. **App URL**: تأكد من `NEXT_PUBLIC_APP_URL` في `.env` صحيح

## 🐛 استكشاف الأخطاء

### المستخدم لا يستلم الإيميل:
- تحقق من SMTP settings في `.env`
- تحقق من console logs للأخطاء
- تحقق من مجلد Spam

### Token expired:
- Verification token: صالح 24 ساعة
- Reset token: صالح ساعة واحدة
- اطلب token جديد

### لا يمكن تسجيل الدخول:
- تأكد من تأكيد البريد الإلكتروني أولاً
- تحقق من رسالة الخطأ

## 🎨 التخصيص

### تغيير مدة صلاحية الـ Tokens:

في `src/app/api/auth/register/route.ts`:
```typescript
// Verification token - حالياً 24 ساعة
// لا يوجد expiry محدد، يمكنك إضافته إذا أردت
```

في `src/app/api/auth/forgot-password/route.ts`:
```typescript
// Reset token - حالياً ساعة واحدة
const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
// غير 60 * 60 * 1000 للمدة المطلوبة بالميلي ثانية
```

### تخصيص Email Templates:

عدّل في `src/lib/email.ts` في `emailTemplates` object.

## ✅ Checklist قبل Deploy

- [ ] تم تشغيل database migration
- [ ] تم إعداد SMTP credentials
- [ ] تم اختبار التسجيل والتحقق
- [ ] تم اختبار password reset
- [ ] تم تحديث `NEXT_PUBLIC_APP_URL` للـ production URL
- [ ] تم اختبار الإيميلات على production

## 🚀 الخطوات التالية المقترحة

1. إضافة resend verification email
2. إضافة rate limiting على forgot password
3. إضافة email templates أفضل مع HTML/CSS
4. إضافة 2FA (Two-Factor Authentication)
5. إضافة email change verification
