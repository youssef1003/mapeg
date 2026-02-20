# تصحيح مشكلة زر الداش بورد - خطوات التجربة

## التعديلات اللي اتعملت:

### 1. إصلاح الـ Header Logic
- الـ Header دلوقتي بيتحقق من `isAdmin` الأول
- لو `isAdmin === true` بيحط `userRole = 'ADMIN'`
- زر Dashboard بيظهر بس لما `userRole === 'ADMIN'`

### 2. Admin Login بيعمل Full Page Reload
- بعد Login ناجح، بيعمل `window.location.href` مش `router.push`
- ده بيضمن إن الـ cookies اتحفظت صح قبل ما الصفحة تتحمل

### 3. Console Logs للتتبع
- في الـ Header: بيطبع auth state
- في الـ API `/api/auth/check-session`: بيطبع الـ cookies
- في الـ API `/api/admin/login`: بيطبع نجاح Login

## خطوات التجربة:

### الخطوة 1: افتح Browser DevTools
1. اضغط F12 أو Right Click > Inspect
2. روح على تاب Console
3. امسح الـ console (Clear console)

### الخطوة 2: روح على صفحة Admin Login
```
http://localhost:3000/ar/auth/admin-login
```

### الخطوة 3: افتح تاب Network
1. في DevTools، روح على تاب Network
2. فعّل "Preserve log"

### الخطوة 4: سجل دخول
استخدم البيانات دي:
- Email: `admin@mapeg.com`
- Password: `AdminSecure123!`

### الخطوة 5: راقب الـ Console
هتشوف رسائل زي دي:
```
Admin login successful, cookies should be set
```

بعد ما الصفحة تتحمل تاني:
```
Checking auth state...
Session check: { adminSession: 'true', isAdmin: true, ... }
Auth check response: { isLoggedIn: true, isAdmin: true, userRole: 'ADMIN' }
Setting userRole to ADMIN
```

### الخطوة 6: تحقق من الـ Cookies
1. في DevTools، روح على تاب Application (أو Storage)
2. من الجانب الأيسر، اختار Cookies > http://localhost:3000
3. تأكد من وجود:
   - `admin_session` = `true` (HttpOnly ✓)
   - `user_role` = `ADMIN`

### الخطوة 7: تحقق من زر Dashboard
- في الـ Header، المفروض تشوف زر "Dashboard" (لوحة التحكم)
- لو مش ظاهر، شوف الـ Console في DevTools

## لو الزر لسه مش ظاهر:

### تحقق من الـ Console Logs:
1. هل في رسالة `Setting userRole to ADMIN`؟
   - لو لأ: معناها الـ API مش راجع `isAdmin: true`
   
2. هل في رسالة `Session check: { adminSession: 'true', isAdmin: true }`؟
   - لو لأ: معناها الـ cookie مش متحفظ صح

3. افتح الـ Network tab وشوف request `/api/auth/check-session`:
   - شوف الـ Response: هل `isAdmin: true`؟
   - شوف الـ Request Headers: هل في `Cookie: admin_session=true`؟

### لو الـ Cookie مش موجود:
1. امسح كل الـ cookies من Application tab
2. سجل خروج من أي حساب
3. جرب تسجيل دخول Admin تاني

### لو الـ Cookie موجود بس الـ API مش شايفه:
- ممكن تكون مشكلة في الـ `sameSite` أو `secure` settings
- جرب تعدل في `/api/admin/login/route.ts`:
  ```typescript
  response.cookies.set('admin_session', 'true', {
    httpOnly: true,
    secure: false, // غيرها لـ false في development
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
  ```

## الملفات المعدلة:
1. `src/components/layout/Header.tsx` - إصلاح logic + console logs
2. `src/app/[locale]/auth/admin-login/page.tsx` - full page reload
3. `src/app/api/auth/check-session/route.ts` - console logs
4. `src/app/api/admin/login/route.ts` - console logs

## ملاحظات مهمة:
- زر Dashboard بيظهر بس لما `userRole === 'ADMIN'`
- المستخدمين العاديين (Candidate/Employer) مش هيشوفوا الزر
- لازم تسجل دخول بـ admin credentials من `.env`
