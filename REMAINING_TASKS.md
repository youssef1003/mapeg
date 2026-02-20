# المهام المتبقية - ملخص شامل

## ✅ تم التنفيذ:

### 1. إضافة حقول الترجمة في قاعدة البيانات
- ✅ تم إضافة `titleEn`, `descriptionEn`, `requirementsEn` في جدول `Job`
- ✅ تم عمل migration: `20260211113630_add_job_translations`
- ✅ قاعدة البيانات جاهزة لحفظ الترجمات

### 2. زرار "الوظائف" في Header الداش بورد
- ✅ تم إضافة زرار "💼 الوظائف" في header الداش بورد
- ✅ الزرار يظهر بجانب الإشعارات
- ✅ ينقل مباشرة لصفحة `/admin/jobs`

---

## ⚠️ المهام المتبقية (تحتاج تنفيذ):

### 1. نظام الترجمة التلقائي للإعلانات

**الملفات المطلوب تعديلها:**

#### أ) صفحة إضافة وظيفة (`src/app/[locale]/admin/jobs/new/page.tsx`)
**التعديلات:**
- إضافة tabs للتبديل بين العربي والإنجليزي
- إضافة حقول الترجمة الإنجليزية (titleEn, descriptionEn, requirementsEn)
- تحديث الـ form data ليشمل الحقول الجديدة
- ✅ تم إضافة الحقول في الـ state
- ✅ تم إضافة الحقول في الـ API call

**المطلوب:**
```typescript
// إضافة tabs component
const [activeTab, setActiveTab] = useState<'ar' | 'en'>('ar')

// في الـ JSX:
<div className={styles.tabs}>
  <button 
    className={activeTab === 'ar' ? styles.activeTab : ''}
    onClick={() => setActiveTab('ar')}
  >
    العربية
  </button>
  <button 
    className={activeTab === 'en' ? styles.activeTab : ''}
    onClick={() => setActiveTab('en')}
  >
    English
  </button>
</div>

{activeTab === 'ar' ? (
  // الحقول العربية الموجودة
) : (
  // الحقول الإنجليزية الجديدة
  <>
    <input 
      placeholder="Job Title (English)"
      value={formData.titleEn}
      onChange={(e) => setFormData({...formData, titleEn: e.target.value})}
    />
    <textarea 
      placeholder="Job Description (English)"
      value={formData.descriptionEn}
      onChange={(e) => setFormData({...formData, descriptionEn: e.target.value})}
    />
    <textarea 
      placeholder="Requirements (English)"
      value={formData.requirementsEn}
      onChange={(e) => setFormData({...formData, requirementsEn: e.target.value})}
    />
  </>
)}
```

#### ب) صفحة تعديل وظيفة (`src/app/[locale]/admin/jobs/[id]/page.tsx`)
**التعديلات:**
- نفس التعديلات السابقة
- تحميل الترجمات الموجودة من قاعدة البيانات
- حفظ التعديلات في الحقول الجديدة

#### ج) API إضافة وظيفة (`src/app/api/jobs/route.ts`)
**التعديلات:**
```typescript
// في POST method:
const job = await prisma.job.create({
  data: {
    title: body.title,
    description: body.description,
    requirements: body.requirements,
    // ... باقي الحقول
    
    // الترجمات الإنجليزية
    titleEn: body.titleEn || null,
    descriptionEn: body.descriptionEn || null,
    requirementsEn: body.requirementsEn || null,
  }
})
```

#### د) API تعديل وظيفة (`src/app/api/jobs/[id]/route.ts`)
**التعديلات:**
```typescript
// في PUT method:
const updatedJob = await prisma.job.update({
  where: { id: params.id },
  data: {
    // ... الحقول الموجودة
    
    // الترجمات
    titleEn: body.titleEn || null,
    descriptionEn: body.descriptionEn || null,
    requirementsEn: body.requirementsEn || null,
  }
})
```

#### هـ) عرض الوظائف حسب اللغة
**في كل صفحة تعرض وظائف:**
```typescript
// في component:
const { locale } = useParams()

// عند عرض الوظيفة:
const title = locale === 'en' && job.titleEn ? job.titleEn : job.title
const description = locale === 'en' && job.descriptionEn ? job.descriptionEn : job.description
const requirements = locale === 'en' && job.requirementsEn ? job.requirementsEn : job.requirements
```

**الملفات المطلوب تعديلها:**
- `src/components/jobs/JobCard.tsx`
- `src/app/[locale]/jobs/page.tsx`
- `src/app/[locale]/page.tsx` (الصفحة الرئيسية)
- أي صفحة أخرى تعرض وظائف

---

### 2. إدارة أصحاب العمل (CRUD)

**الملفات المطلوب إنشاؤها/تعديلها:**

#### أ) API لأصحاب العمل
**ملف جديد:** `src/app/api/employers/route.ts`
```typescript
// GET - عرض كل أصحاب العمل
export async function GET() {
  const employers = await prisma.employer.findMany({
    include: {
      _count: {
        select: { jobs: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(employers)
}

// POST - إضافة صاحب عمل جديد
export async function POST(request: NextRequest) {
  const body = await request.json()
  const employer = await prisma.employer.create({
    data: {
      companyName: body.companyName,
      email: body.email,
      phone: body.phone,
      industry: body.industry,
      country: body.country,
      website: body.website || null,
      description: body.description || null,
    }
  })
  return NextResponse.json(employer)
}
```

**ملف جديد:** `src/app/api/employers/[id]/route.ts`
```typescript
// GET - عرض صاحب عمل واحد
export async function GET(request, { params }) {
  const employer = await prisma.employer.findUnique({
    where: { id: params.id },
    include: {
      jobs: true,
      _count: { select: { jobs: true } }
    }
  })
  return NextResponse.json(employer)
}

// PUT - تعديل صاحب عمل
export async function PUT(request, { params }) {
  const body = await request.json()
  const employer = await prisma.employer.update({
    where: { id: params.id },
    data: {
      companyName: body.companyName,
      email: body.email,
      phone: body.phone,
      industry: body.industry,
      country: body.country,
      website: body.website,
      description: body.description,
    }
  })
  return NextResponse.json(employer)
}

// DELETE - حذف صاحب عمل
export async function DELETE(request, { params }) {
  await prisma.employer.delete({
    where: { id: params.id }
  })
  return NextResponse.json({ message: 'Deleted successfully' })
}
```

#### ب) صفحة أصحاب العمل (`src/app/[locale]/admin/employers/page.tsx`)
**التعديلات:**
- تحويل البيانات من static إلى dynamic (fetch من API)
- إضافة زرار "حذف" لكل شركة
- إضافة زرار "تعديل" لكل شركة
- ربط زرار "إضافة شركة جديدة" بصفحة الإضافة

```typescript
const [employers, setEmployers] = useState([])

useEffect(() => {
  fetchEmployers()
}, [])

const fetchEmployers = async () => {
  const response = await fetch('/api/employers')
  const data = await response.json()
  setEmployers(data)
}

const handleDelete = async (id, name) => {
  if (!confirm(`هل أنت متأكد من حذف ${name}؟`)) return
  
  await fetch(`/api/employers/${id}`, { method: 'DELETE' })
  setEmployers(employers.filter(e => e.id !== id))
  alert('✅ تم الحذف بنجاح!')
}
```

#### ج) صفحة إضافة صاحب عمل
**ملف جديد:** `src/app/[locale]/admin/employers/new/page.tsx`
```typescript
// نفس تصميم صفحة إضافة وظيفة
// حقول: اسم الشركة، البريد، الهاتف، المجال، الدولة، الموقع الإلكتروني، الوصف
```

#### د) صفحة تعديل صاحب عمل
**ملف جديد:** `src/app/[locale]/admin/employers/[id]/page.tsx`
```typescript
// نفس تصميم صفحة تعديل وظيفة
// تحميل البيانات الموجودة وتعديلها
```

---

## 📋 خطة التنفيذ المقترحة:

### المرحلة 1: نظام الترجمة (الأولوية)
1. ✅ إضافة حقول الترجمة في قاعدة البيانات (تم)
2. تعديل صفحة إضافة وظيفة (إضافة tabs والحقول الإنجليزية)
3. تعديل صفحة تعديل وظيفة (نفس التعديلات)
4. تعديل APIs لحفظ الترجمات
5. تعديل صفحات عرض الوظائف لعرض اللغة المناسبة

### المرحلة 2: إدارة أصحاب العمل
1. إنشاء APIs لأصحاب العمل (GET, POST, PUT, DELETE)
2. تعديل صفحة أصحاب العمل (dynamic data + حذف)
3. إنشاء صفحة إضافة صاحب عمل
4. إنشاء صفحة تعديل صاحب عمل

### المرحلة 3: الاختبار
1. اختبار إضافة وظيفة بالعربي والإنجليزي
2. اختبار عرض الوظائف في `/ar` و `/en`
3. اختبار تعديل وظيفة
4. اختبار إضافة/تعديل/حذف أصحاب العمل

---

## 🎯 الوضع الحالي:

### ✅ جاهز:
- قاعدة البيانات تدعم الترجمات
- زرار الوظائف في الداش بورد
- الـ state في صفحة إضافة وظيفة يدعم الترجمات
- الـ API call يرسل الترجمات

### ⚠️ محتاج تنفيذ:
- واجهة المستخدم (tabs والحقول الإنجليزية)
- تعديل صفحة تعديل الوظيفة
- تعديل APIs لحفظ الترجمات
- تعديل صفحات العرض لعرض اللغة المناسبة
- كل ما يخص إدارة أصحاب العمل

---

## 💡 ملاحظات مهمة:

1. **الترجمات اختيارية:** لو الأدمن مكتبش ترجمة إنجليزية، الموقع هيعرض النص العربي في الصفحة الإنجليزية

2. **التوافق مع الكود الموجود:** كل التعديلات مصممة عشان متأثرش على أي حاجة موجودة

3. **الأمان:** كل الـ APIs محتاجة middleware للتحقق من صلاحيات الأدمن

4. **الأداء:** استخدام `include` و `_count` في Prisma لتقليل عدد الـ queries

---

## 🚀 الخطوات التالية:

عايز أكمل تنفيذ إيه الأول؟
1. نظام الترجمة (إضافة الـ tabs والحقول)
2. إدارة أصحاب العمل (CRUD كامل)
3. الاتنين مع بعض (هياخد وقت أطول)

قولي وأنا هبدأ فوراً! 🎯
