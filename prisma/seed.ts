import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Deterministic IDs for seeded jobs (allows idempotent upserts)
const SEED_JOB_IDS = [
    'seed-job-001',
    'seed-job-002',
    'seed-job-003',
    'seed-job-004',
    'seed-job-005',
    'seed-job-006',
    'seed-job-007',
    'seed-job-008',
    'seed-job-009',
    'seed-job-010',
]

const SEED_EMPLOYER_ID = 'seed-employer-001'
const SEED_ADMIN_ID = 'seed-admin-001'

// Get admin credentials from environment variables
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@mapeg.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'AdminSecure123!'

async function main() {
    console.log('🌱 Starting database seed...')

    // ============================================
    // SUPER ADMIN CREATION (idempotent)
    // ============================================
    console.log('👑 Creating Super Admin...')
    const hashedAdminPassword = await bcrypt.hash(ADMIN_PASSWORD, 10)

    await prisma.user.upsert({
        where: { email: ADMIN_EMAIL },
        update: {
            password: hashedAdminPassword,
            role: 'ADMIN',
            name: 'Super Admin'
        },
        create: {
            id: SEED_ADMIN_ID,
            email: ADMIN_EMAIL,
            password: hashedAdminPassword,
            role: 'ADMIN',
            name: 'Super Admin'
        }
    })
    console.log(`✅ Super Admin created/updated: ${ADMIN_EMAIL}`)

    // ============================================
    // SAMPLE JOBS (idempotent)
    // ============================================
    const jobs = [
        {
            id: SEED_JOB_IDS[0],
            title: 'مهندس برمجيات أول',
            company: 'تك كورب مصر',
            location: 'القاهرة',
            country: 'EG',
            type: 'full-time',
            salary: '3,000$ - 5,000$',
            description: 'نبحث عن مهندس برمجيات ذو خبرة للانضمام إلى فريقنا التقني. ستعمل على تطوير تطبيقات ويب حديثة باستخدام أحدث التقنيات.',
            requirements: 'خبرة 5+ سنوات في تطوير البرمجيات، إتقان JavaScript/TypeScript، خبرة في React أو Angular',
            category: 'technology',
            featured: true,
        },
        {
            id: SEED_JOB_IDS[1],
            title: 'مدير تسويق',
            company: 'جلوبال ميديا',
            location: 'دبي',
            country: 'AE',
            type: 'full-time',
            salary: '4,000$ - 6,000$',
            description: 'مطلوب مدير تسويق لقيادة الحملات التسويقية وتطوير استراتيجيات النمو.',
            requirements: 'خبرة 3+ سنوات في التسويق الرقمي، مهارات قيادية، إجادة اللغة الإنجليزية',
            category: 'marketing',
            featured: true,
        },
        {
            id: SEED_JOB_IDS[2],
            title: 'مدير مشاريع',
            company: 'بيلد ماسترز',
            location: 'الرياض',
            country: 'SA',
            type: 'full-time',
            salary: '5,000$ - 8,000$',
            description: 'إدارة مشاريع البناء الكبرى وضمان التسليم في الوقت المحدد وفي حدود الميزانية.',
            requirements: 'خبرة 7+ سنوات في إدارة المشاريع، شهادة PMP مفضلة، خبرة في مشاريع البناء',
            category: 'engineering',
            featured: true,
        },
        {
            id: SEED_JOB_IDS[3],
            title: 'مصمم UX/UI',
            company: 'كريتيف ستوديو',
            location: 'الإسكندرية',
            country: 'EG',
            type: 'remote',
            salary: '2,500$ - 4,000$',
            description: 'تصميم واجهات مستخدم جذابة وتجارب مستخدم سلسة لتطبيقات الويب والموبايل.',
            requirements: 'خبرة 3+ سنوات في تصميم UI/UX، إتقان Figma و Adobe XD',
            category: 'design',
            featured: false,
        },
        {
            id: SEED_JOB_IDS[4],
            title: 'محلل مالي',
            company: 'جلف فاينانس',
            location: 'الدوحة',
            country: 'QA',
            type: 'full-time',
            salary: '4,500$ - 7,000$',
            description: 'تحليل البيانات المالية وإعداد التقارير للإدارة العليا.',
            requirements: 'شهادة CFA أو ما يعادلها، خبرة 4+ سنوات في التحليل المالي',
            category: 'finance',
            featured: false,
        },
        {
            id: SEED_JOB_IDS[5],
            title: 'مدير موارد بشرية',
            company: 'بيبول فيرست',
            location: 'مدينة الكويت',
            country: 'KW',
            type: 'full-time',
            salary: '6,000$ - 9,000$',
            description: 'إدارة عمليات الموارد البشرية وتطوير استراتيجيات جذب المواهب.',
            requirements: 'خبرة 5+ سنوات في الموارد البشرية، مهارات تواصل ممتازة',
            category: 'hr',
            featured: false,
        },
        {
            id: SEED_JOB_IDS[6],
            title: 'مهندس DevOps',
            company: 'كلاود سيستمز',
            location: 'القاهرة',
            country: 'EG',
            type: 'full-time',
            salary: '3,500$ - 5,500$',
            description: 'إدارة البنية التحتية السحابية وتحسين عمليات التطوير والنشر.',
            requirements: 'خبرة في AWS/Azure، Docker، Kubernetes، CI/CD pipelines',
            category: 'technology',
            featured: false,
        },
        {
            id: SEED_JOB_IDS[7],
            title: 'مطور تطبيقات موبايل',
            company: 'آب تك',
            location: 'القاهرة',
            country: 'EG',
            type: 'full-time',
            salary: '2,500$ - 4,500$',
            description: 'تطوير تطبيقات iOS و Android باستخدام React Native أو Flutter.',
            requirements: 'خبرة 2+ سنوات في تطوير تطبيقات الموبايل، معرفة بـ React Native أو Flutter',
            category: 'technology',
            featured: true,
        },
        {
            id: SEED_JOB_IDS[8],
            title: 'محاسب أول',
            company: 'فاينانس برو',
            location: 'جدة',
            country: 'SA',
            type: 'full-time',
            salary: '3,000$ - 4,500$',
            description: 'إدارة الحسابات وإعداد القوائم المالية والتقارير الضريبية.',
            requirements: 'شهادة CPA أو ما يعادلها، خبرة 3+ سنوات في المحاسبة',
            category: 'finance',
            featured: false,
        },
        {
            id: SEED_JOB_IDS[9],
            title: 'أخصائي تسويق رقمي',
            company: 'ديجيتال ماركتنج',
            location: 'دبي',
            country: 'AE',
            type: 'full-time',
            salary: '2,500$ - 4,000$',
            description: 'إدارة حملات التسويق الرقمي عبر منصات التواصل الاجتماعي وGoogle Ads.',
            requirements: 'خبرة 2+ سنوات في التسويق الرقمي، معرفة بـ Google Analytics و Facebook Ads',
            category: 'marketing',
            featured: false,
        },
    ]

    // Upsert jobs (idempotent)
    console.log('📝 Upserting jobs...')
    for (const job of jobs) {
        await prisma.job.upsert({
            where: { id: job.id },
            update: job,
            create: job,
        })
    }
    console.log(`✅ Upserted ${jobs.length} sample jobs`)

    // Upsert employer (idempotent)
    console.log('🏢 Upserting employer...')
    await prisma.employer.upsert({
        where: { id: SEED_EMPLOYER_ID },
        update: {
            companyName: 'شركة المثال',
            email: 'contact@example-company.com',
            phone: '+20 123 456 7890',
            industry: 'technology',
            website: 'https://example-company.com',
            description: 'شركة تقنية رائدة في مجال تطوير البرمجيات',
            country: 'EG',
        },
        create: {
            id: SEED_EMPLOYER_ID,
            companyName: 'شركة المثال',
            email: 'contact@example-company.com',
            phone: '+20 123 456 7890',
            industry: 'technology',
            website: 'https://example-company.com',
            description: 'شركة تقنية رائدة في مجال تطوير البرمجيات',
            country: 'EG',
        },
    })
    console.log('✅ Upserted sample employer')

    console.log('🎉 Seed completed successfully!')
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e)
        process.exit(1)
    })
    .finally(async () => {
        console.log('🔌 Disconnecting from database...')
        await prisma.$disconnect()
        console.log('✅ Disconnected')
    })
