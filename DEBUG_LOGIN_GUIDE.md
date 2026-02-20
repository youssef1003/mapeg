# 🔧 دليل تصحيح مشكلة تسجيل الدخول

## ✅ ما تم عمله:

### 1. تبسيط Middleware
- ✅ إزالة rate limiting مؤقتاً
- ✅ الإبقاء على security headers فقط

### 2. تحسين Admin Login API
- ✅ إضافة logging مفصل
- ✅ إضافة JWT token
- ✅ إضافة 3 cookies (session, admin_session, user_role)

### 3. إنشاء صفحة Test
- ✅ صفحة لاختبار الـ APIs مباشرة
- ✅ عرض النتائج والـ cookies

---

## 🚀 خطوات التصحيح:

### الخطوة 1: أعد تشغيل الموقع
```bash
# أوقف الموقع (Ctrl + C)
# ثم شغله من جديد
npm run dev
```

### الخطوة 2: افتح صفحة Test
```
http://localhost:3000/ar/test-login
```

### الخطوة 3: اضغط "Test Admin Login"
- شوف النتيجة في الصفحة
- افتح Console (F12) وشوف الـ logs

### الخطوة 4: شوف Terminal
في الـ terminal حيث الموقع شغال، لازم تشوف:
```
🔐 Admin login attempt...
📧 Email: admin@mapeg.com
🔍 Checking against: admin@mapeg.com
✅ Credentials valid, creating session...
✅ JWT token created
✅ Cookies set, login successful!
```

---

## 🔍 تحليل المشكلة:

### إذا ظهر "حدث خطأ في الاتصال":
**السبب:** الموقع مش شغال أو الـ API مش موجود

**الحل:**
1. تأكد إن الموقع شغال على `http://localhost:3000`
2. جرب افتح `http://localhost:3000/api/admin/login` في المتصفح
3. لازم يظهر error "Method Not Allowed" (دي علامة إن الـ API موجود)

### إذا ظهر "البريد الإلكتروني أو كلمة المرور غير صحيحة":
**السبب:** البيانات مش مطابقة للـ .env

**الحل:**
1. افتح `.env`
2. تأكد من:
   ```
   ADMIN_EMAIL="admin@mapeg.com"
   ADMIN_PASSWORD="AdminSecure123!"
   ```
3. أعد تشغيل الموقع

### إذا ظهر "خطأ في إعدادات النظام":
**السبب:** ADMIN_EMAIL أو ADMIN_PASSWORD مش موجودين في .env

**الحل:**
1. افتح `.env`
2. أضف:
   ```
   ADMIN_EMAIL="admin@mapeg.com"
   ADMIN_PASSWORD="AdminSecure123!"
   JWT_SECRET="mapeg-super-secret-jwt-key-min-32-characters-long-change-in-production-2026"
   ```
3. أعد تشغيل الموقع

---

## 📝 الملفات المعدلة:

### 1. src/middleware.ts
- تبسيط الـ middleware
- إزالة rate limiting مؤقتاً

### 2. src/app/api/admin/login/route.ts
- إضافة logging مفصل
- إضافة JWT token
- تحسين error handling

### 3. src/app/[locale]/test-login/page.tsx
- صفحة جديدة للاختبار
- اختبار مباشر للـ APIs

---

## 🧪 اختبار شامل:

### Test 1: Admin Login API
```
URL: http://localhost:3000/ar/test-login
Action: اضغط "Test Admin Login"
Expected: Status 200, success: true
```

### Test 2: User Login API
```
URL: http://localhost:3000/ar/test-login
Action: اضغط "Test User Login"
Expected: Status 200, success: true, isAdmin: true
```

### Test 3: Check Session
```
URL: http://localhost:3000/ar/test-login
Action: اضغط "Check Session"
Expected: isLoggedIn: true, isAdmin: true
```

### Test 4: Admin Login Page
```
URL: http://localhost:3000/ar/auth/admin-login
Email: admin@mapeg.com
Password: AdminSecure123!
Expected: Redirect to /ar/admin
```

---

## 🔐 معلومات تسجيل الدخول:

### Admin (من .env):
```
Email: admin@mapeg.com
Password: AdminSecure123!
```

### URLs:
```
Test Page: http://localhost:3000/ar/test-login
Admin Login: http://localhost:3000/ar/auth/admin-login
User Login: http://localhost:3000/ar/auth/login
Admin Dashboard: http://localhost:3000/ar/admin
```

---

## 📊 Checklist:

- [ ] الموقع شغال على localhost:3000
- [ ] .env فيه ADMIN_EMAIL و ADMIN_PASSWORD و JWT_SECRET
- [ ] أعدت تشغيل الموقع بعد التعديلات
- [ ] صفحة Test بتفتح: /ar/test-login
- [ ] Test Admin Login بيرجع success: true
- [ ] Console مفيهوش أخطاء (F12)
- [ ] Terminal بيظهر الـ logs الصحيحة

---

## 💡 نصائح:

1. **استخدم صفحة Test أولاً** قبل ما تجرب صفحة Login العادية
2. **شوف Console** (F12) دايماً عشان تشوف الأخطاء
3. **شوف Terminal** عشان تشوف الـ server logs
4. **أعد تشغيل الموقع** بعد أي تعديل في .env

---

## 🆘 إذا لم تحل المشكلة:

1. أرسل screenshot من:
   - صفحة Test بعد الضغط على "Test Admin Login"
   - Console (F12)
   - Terminal logs

2. أو أرسل:
   - محتوى `.env` (بدون كلمة المرور)
   - الخطأ اللي بيظهر بالضبط

---

**تاريخ:** 20 فبراير 2026
**الحالة:** جاهز للاختبار ✅
**الخطوة التالية:** افتح /ar/test-login واختبر
