# 🚀 تشغيل الموقع - الخطوات النهائية

## ✅ تم إصلاح كل الـ APIs:

1. ✅ `/api/auth/login` - مبسط وبدون JWT
2. ✅ `/api/admin/login` - مبسط مع logging
3. ✅ `/api/auth/register` - مبسط وشغال
4. ✅ أضفت `export const dynamic = 'force-dynamic'`
5. ✅ أضفت `export const runtime = 'nodejs'`

---

## 🔧 الخطوات (بالترتيب):

### 1. أوقف الموقع تماماً
```
اضغط Ctrl + C في الـ terminal
```

### 2. امسح الـ cache
```bash
Remove-Item -Recurse -Force .next
```

### 3. شغل الموقع
```bash
npm run dev
```

### 4. انتظر حتى تشوف:
```
✓ Compiled successfully
○ Local: http://localhost:3000
```

---

## 🎯 اختبار:

### Test 1: Admin Login
```
URL: http://localhost:3000/ar/auth/admin-login
Email: admin@mapeg.com
Password: AdminSecure123!
```

**المتوقع:** 
- في الـ terminal: `🔐 Admin login API called`
- في المتصفح: redirect لـ `/admin`

### Test 2: Register
```
URL: http://localhost:3000/ar/auth/register
الاسم: Test User
Email: test@example.com
Password: Test123!
```

**المتوقع:**
- في الـ terminal: `📝 Register API called`
- في المتصفح: "تم إنشاء الحساب بنجاح"

### Test 3: Login
```
URL: http://localhost:3000/ar/auth/login
Email: test@example.com
Password: Test123!
```

**المتوقع:**
- في الـ terminal: `🔐 Login API called`
- في المتصفح: redirect للصفحة الرئيسية

---

## 🔍 كيف تتأكد إن الـ API شغال:

### افتح في المتصفح:
```
http://localhost:3000/api/admin/login
```

**لازم تشوف:**
```json
{"error":"البريد الإلكتروني وكلمة المرور مطلوبان"}
```

**إذا شفت 404 أو HTML:** يبقى الموقع مش شغال صح.

---

## 📊 Checklist:

- [ ] أوقفت الموقع (Ctrl + C)
- [ ] مسحت `.next` folder
- [ ] شغلت `npm run dev`
- [ ] انتظرت "Compiled successfully"
- [ ] فتحت `http://localhost:3000/api/admin/login`
- [ ] شفت JSON error (مش 404)
- [ ] جربت Admin Login
- [ ] شفت logs في الـ terminal

---

## 🆘 إذا لم يعمل:

### شوف الـ terminal:
لازم تشوف:
```
🔐 Admin login API called
📧 Email received: admin@mapeg.com
🔍 Checking against: admin@mapeg.com
✅ Login successful
✅ Cookies set
```

### إذا مفيش logs:
يعني الـ API مش بيتنفذ.

**الحل:**
1. تأكد إن الموقع شغال على `http://localhost:3000`
2. افتح `http://localhost:3000/api/admin/login` في المتصفح
3. لازم تشوف JSON error

---

**الخطوة التالية:** شغل الموقع بـ `npm run dev`
