# نظام التحكم في الوصول للأدمن (Admin Access Control)

## نظرة عامة
تم تطبيق نظام Role-based Access Control كامل لحماية صفحات الأدمن وضمان أن المستخدمين العاديين يمكنهم الوصول للموقع بشكل طبيعي.

## الملفات المضافة/المعدلة

### ملفات جديدة:
1. **`src/app/[locale]/auth/admin-login/page.tsx`** - صفحة تسجيل دخول الأدمن
2. **`src/app/[locale]/auth/admin-login/page.module.css`** - تنسيقات صفحة admin login
3. **`src/app/api/admin/login/route.ts`** - API endpoint لتسجيل دخول الأدمن
4. **`src/app/api/admin/logout/route.ts`** - API endpoint لتسجيل خروج الأدمن
5. **`src/app/[locale]/forbidden/page.tsx`** - صفحة 403 (اختياري)
6. **`src/app/[locale]/forbidden/page.module.css`** - تنسيقات صفحة 403

### ملفات معدلة:
1. **`src/middleware.ts`** - إضافة حماية لصفحات /admin
2. **`src/components/layout/Header.tsx`** - إضافة زر "لوحة التحكم" للأدمن
3. **`src/app/[locale]/admin/layout.tsx`** - تحديث logout لاستخدام API

## كيفية العمل

### 1. تسجيل دخول الأدمن
- الأدمن يدخل على `/ar/auth/admin-login` أو `/en/auth/admin-login`
- يدخل البريد الإلكتروني وكلمة المرور (من `.env`)
- عند النجاح، يتم تعيين cookies:
  - `admin_session=true` (httpOnly, secure in production)
  - `user_role=ADMIN` (accessible من client)

### 2. حماية صفحات الأدمن (Middleware)
الـ middleware يتحقق من كل طلب:
- إذا كان المسار يحتوي على `/admin`:
  - يتحقق من وجود `admin_session=true`
  - إذا لم يكن موجود:
    - إذا كان المستخدم مسجل دخول كـ user عادي → redirect لـ `/`
    - إذا لم يكن مسجل دخول → redirect لـ `/auth/admin-login`

### 3. زر Dashboard في الـ Header
- الـ Header يتحقق من وجود `admin_session` cookie
- إذا كان موجود، يعرض زر "لوحة التحكم" يودي لـ `/admin`
- إذا لم يكن موجود، لا يعرض الزر

### 4. تسجيل الخروج
- الأدمن يضغط على "تسجيل الخروج" من Admin Layout
- يتم استدعاء `/api/admin/logout` لمسح الـ cookies من السيرفر
- يتم مسح الـ cookies من الـ client
- يتم التوجيه للصفحة الرئيسية

## بيانات الأدمن

يتم تخزين بيانات الأدمن في `.env`:
```env
ADMIN_EMAIL="admin@mapeg.com"
ADMIN_PASSWORD="AdminSecure123!"
```

## اختبار النظام (Smoke Test)

### Test 1: Guest يحاول الوصول لـ /admin
```
1. افتح المتصفح في وضع incognito
2. اذهب إلى http://localhost:3000/ar/admin
3. النتيجة المتوقعة: يتم التوجيه لـ /ar/auth/admin-login
```

### Test 2: User عادي يحاول الوصول لـ /admin
```
1. سجل دخول كـ Candidate أو Employer
2. اذهب إلى http://localhost:3000/ar/admin
3. النتيجة المتوقعة: يتم التوجيه لـ /ar (الصفحة الرئيسية)
```

### Test 3: Admin يدخل لـ /admin
```
1. اذهب إلى http://localhost:3000/ar/auth/admin-login
2. أدخل:
   - Email: admin@mapeg.com
   - Password: AdminSecure123!
3. النتيجة المتوقعة: يتم التوجيه لـ /ar/admin (Dashboard)
```

### Test 4: Admin يسجل خروج
```
1. بعد تسجيل الدخول كـ Admin
2. اضغط على "تسجيل الخروج" من Admin Layout
3. حاول الدخول لـ /ar/admin مرة أخرى
4. النتيجة المتوقعة: يتم التوجيه لـ /ar/auth/admin-login
```

### Test 5: زر Dashboard في الـ Header
```
1. سجل دخول كـ Admin
2. اذهب للصفحة الرئيسية /ar
3. النتيجة المتوقعة: يظهر زر "لوحة التحكم" في الـ Header
4. سجل خروج
5. النتيجة المتوقعة: زر "لوحة التحكم" يختفي
```

## الأمان (Security)

### Cookies Settings:
- **admin_session**: 
  - `httpOnly: true` - لا يمكن الوصول إليه من JavaScript
  - `secure: true` (في production) - يتم إرساله فقط عبر HTTPS
  - `sameSite: 'lax'` - حماية من CSRF attacks
  - `maxAge: 7 days` - صلاحية لمدة 7 أيام

### Server-side Validation:
- جميع API routes تتحقق من الـ credentials قبل تعيين الـ cookies
- الـ middleware يتحقق من الـ cookies في كل طلب لصفحات /admin

### Environment Variables:
- بيانات الأدمن محفوظة في `.env` وليست في الكود
- لا يتم تسريب بيانات الأدمن للـ client

## ملاحظات مهمة

1. **لا تغيير في تصميم الصفحات العامة**: جميع التغييرات محصورة في:
   - صفحات الأدمن
   - الـ middleware
   - الـ Header (إضافة زر فقط)

2. **التوافق مع الكود الحالي**: 
   - النظام يستخدم نفس الـ cookies الموجودة
   - لا يؤثر على تسجيل دخول المستخدمين العاديين

3. **Multi-language Support**:
   - جميع الصفحات تدعم العربية والإنجليزية
   - الـ redirects تحافظ على الـ locale الحالي

## الخطوات التالية (اختياري)

1. **إضافة 2FA (Two-Factor Authentication)** للأدمن
2. **Session Management**: إضافة جدول في الـ database لتتبع sessions
3. **Audit Log**: تسجيل جميع عمليات الأدمن
4. **IP Whitelisting**: السماح بالوصول من IPs محددة فقط
5. **Rate Limiting**: منع brute force attacks على صفحة admin login
