import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding About and Blog content...')

  // Seed About Page Content
  await prisma.aboutPageContent.upsert({
    where: { id: 'main' },
    update: {},
    create: {
      id: 'main',
      heroTitleAr: 'من نحن',
      heroTitleEn: 'About Us',
      heroHighlightAr: 'MapEg',
      heroHighlightEn: 'MapEg',
      heroSubtitleAr: 'نحن منصة توظيف رائدة تربط المواهب بالفرص في الشرق الأوسط',
      heroSubtitleEn: 'We are a leading recruitment platform connecting talents with opportunities in the Middle East',
      missionTitleAr: 'مهمتنا',
      missionTitleEn: 'Our Mission',
      missionTextAr: 'نسعى لتسهيل عملية التوظيف وربط أفضل المواهب بأفضل الفرص في الشرق الأوسط. نؤمن بأن كل شخص يستحق فرصة عمل تناسب مهاراته وطموحاته.',
      missionTextEn: 'We strive to facilitate the recruitment process and connect the best talents with the best opportunities in the Middle East. We believe everyone deserves a job opportunity that matches their skills and ambitions.',
      candidatesPlaced: '15,000+',
      partnerCompanies: '2,500+',
      countriesCovered: '10+',
      valuesTitleAr: 'قيمنا الأساسية',
      valuesTitleEn: 'Our Core Values',
      valuesSubtitleAr: 'المبادئ التي نؤمن بها ونعمل بها كل يوم',
      valuesSubtitleEn: 'The principles we believe in and work by every day',
    },
  })

  // Seed Values
  const values = [
    {
      icon: '🎯',
      titleAr: 'التميز',
      titleEn: 'Excellence',
      descriptionAr: 'نسعى دائماً لتقديم أفضل الخدمات وأعلى معايير الجودة',
      descriptionEn: 'We always strive to provide the best services and highest quality standards',
      order: 0,
    },
    {
      icon: '🤝',
      titleAr: 'النزاهة',
      titleEn: 'Integrity',
      descriptionAr: 'نلتزم بالشفافية والصدق في جميع تعاملاتنا',
      descriptionEn: 'We commit to transparency and honesty in all our dealings',
      order: 1,
    },
    {
      icon: '💡',
      titleAr: 'الابتكار',
      titleEn: 'Innovation',
      descriptionAr: 'نبحث دائماً عن طرق جديدة لتحسين تجربة التوظيف',
      descriptionEn: 'We always look for new ways to improve the recruitment experience',
      order: 2,
    },
    {
      icon: '🌍',
      titleAr: 'التنوع',
      titleEn: 'Diversity',
      descriptionAr: 'نحتفي بالتنوع ونؤمن بقوة الفرق المتنوعة',
      descriptionEn: 'We celebrate diversity and believe in the power of diverse teams',
      order: 3,
    },
  ]

  for (const value of values) {
    await prisma.aboutValue.create({ data: value })
  }

  // Seed Milestones
  const milestones = [
    {
      year: '2020',
      titleAr: 'التأسيس',
      titleEn: 'Foundation',
      descriptionAr: 'تأسست MapEg برؤية واضحة لتغيير سوق التوظيف في المنطقة',
      descriptionEn: 'MapEg was founded with a clear vision to transform the recruitment market in the region',
      order: 0,
    },
    {
      year: '2021',
      titleAr: 'التوسع الإقليمي',
      titleEn: 'Regional Expansion',
      descriptionAr: 'افتتحنا مكاتب في دبي والرياض لخدمة عملائنا بشكل أفضل',
      descriptionEn: 'We opened offices in Dubai and Riyadh to better serve our clients',
      order: 1,
    },
    {
      year: '2023',
      titleAr: '10,000 مرشح',
      titleEn: '10,000 Candidates',
      descriptionAr: 'وصلنا إلى معلم مهم بتوظيف 10,000 مرشح بنجاح',
      descriptionEn: 'We reached an important milestone by successfully placing 10,000 candidates',
      order: 2,
    },
    {
      year: '2024',
      titleAr: 'الريادة',
      titleEn: 'Leadership',
      descriptionAr: 'أصبحنا المنصة الرائدة للتوظيف في الشرق الأوسط',
      descriptionEn: 'We became the leading recruitment platform in the Middle East',
      order: 3,
    },
  ]

  for (const milestone of milestones) {
    await prisma.aboutMilestone.create({ data: milestone })
  }

  // Seed Team Members
  const team = [
    {
      nameAr: 'أحمد محمد',
      nameEn: 'Ahmed Mohamed',
      roleAr: 'المدير التنفيذي',
      roleEn: 'CEO',
      bioAr: 'خبرة 15 عاماً في مجال التوظيف والموارد البشرية',
      bioEn: '15 years of experience in recruitment and human resources',
      image: null,
      order: 0,
    },
    {
      nameAr: 'سارة أحمد',
      nameEn: 'Sara Ahmed',
      roleAr: 'مديرة العمليات',
      roleEn: 'COO',
      bioAr: 'متخصصة في تطوير العمليات وتحسين الكفاءة',
      bioEn: 'Specialist in operations development and efficiency improvement',
      image: null,
      order: 1,
    },
    {
      nameAr: 'محمد علي',
      nameEn: 'Mohamed Ali',
      roleAr: 'مدير التكنولوجيا',
      roleEn: 'CTO',
      bioAr: 'خبير في تطوير المنصات الرقمية والذكاء الاصطناعي',
      bioEn: 'Expert in digital platform development and artificial intelligence',
      image: null,
      order: 2,
    },
    {
      nameAr: 'ليلى حسن',
      nameEn: 'Laila Hassan',
      roleAr: 'مديرة التسويق',
      roleEn: 'CMO',
      bioAr: 'متخصصة في التسويق الرقمي وبناء العلامات التجارية',
      bioEn: 'Specialist in digital marketing and brand building',
      image: null,
      order: 3,
    },
  ]

  for (const member of team) {
    await prisma.aboutTeamMember.create({ data: member })
  }

  // Seed Offices
  const offices = [
    {
      icon: '🇪🇬',
      nameAr: 'مكتب القاهرة',
      nameEn: 'Cairo Office',
      labelAr: 'المقر الرئيسي',
      labelEn: 'Headquarters',
      addressAr: 'القاهرة الجديدة، التجمع الخامس\nمصر',
      addressEn: 'New Cairo, Fifth Settlement\nEgypt',
      order: 0,
    },
    {
      icon: '🇦🇪',
      nameAr: 'مكتب دبي',
      nameEn: 'Dubai Office',
      labelAr: 'مكتب الخليج',
      labelEn: 'Gulf Office',
      addressAr: 'دبي، الإمارات العربية المتحدة\nمركز دبي المالي العالمي',
      addressEn: 'Dubai, United Arab Emirates\nDubai International Financial Centre',
      order: 1,
    },
    {
      icon: '🇸🇦',
      nameAr: 'مكتب الرياض',
      nameEn: 'Riyadh Office',
      labelAr: 'مكتب السعودية',
      labelEn: 'Saudi Office',
      addressAr: 'الرياض، المملكة العربية السعودية\nحي الملك فهد',
      addressEn: 'Riyadh, Saudi Arabia\nKing Fahd District',
      order: 2,
    },
  ]

  for (const office of offices) {
    await prisma.aboutOffice.create({ data: office })
  }

  // Seed Blog Categories
  const categories = [
    { nameAr: 'نصائح مهنية', nameEn: 'Career Tips', order: 0 },
    { nameAr: 'رؤى الصناعة', nameEn: 'Industry Insights', order: 1 },
    { nameAr: 'أخبار الشركة', nameEn: 'Company News', order: 2 },
    { nameAr: 'قصص نجاح', nameEn: 'Success Stories', order: 3 },
  ]

  for (const category of categories) {
    await prisma.blogCategory.create({ data: category })
  }

  // Seed Blog Posts
  const posts = [
    {
      titleAr: '10 نصائح لكتابة سيرة ذاتية احترافية',
      titleEn: '10 Tips for Writing a Professional Resume',
      excerptAr: 'تعلم كيفية كتابة سيرة ذاتية تجذب انتباه أصحاب العمل وتزيد فرصك في الحصول على الوظيفة',
      excerptEn: 'Learn how to write a resume that catches employers\' attention and increases your chances of getting the job',
      contentAr: 'السيرة الذاتية هي بطاقة التعريف الأولى لك أمام صاحب العمل. في هذا المقال، نقدم لك 10 نصائح عملية لكتابة سيرة ذاتية احترافية تميزك عن المنافسين...',
      contentEn: 'Your resume is your first introduction to an employer. In this article, we provide you with 10 practical tips for writing a professional resume that sets you apart from competitors...',
      authorAr: 'سارة أحمد',
      authorEn: 'Sara Ahmed',
      categoryAr: 'نصائح مهنية',
      categoryEn: 'Career Tips',
      featured: true,
      published: true,
    },
    {
      titleAr: 'مستقبل التوظيف في الشرق الأوسط',
      titleEn: 'The Future of Recruitment in the Middle East',
      excerptAr: 'نظرة على الاتجاهات الحديثة في سوق العمل وكيف تؤثر التكنولوجيا على عملية التوظيف',
      excerptEn: 'A look at modern trends in the job market and how technology affects the recruitment process',
      contentAr: 'يشهد سوق العمل في الشرق الأوسط تحولاً كبيراً مع دخول التكنولوجيا الحديثة والذكاء الاصطناعي. في هذا المقال، نستعرض أهم الاتجاهات...',
      contentEn: 'The job market in the Middle East is undergoing a major transformation with the introduction of modern technology and artificial intelligence. In this article, we review the most important trends...',
      authorAr: 'محمد حسن',
      authorEn: 'Mohamed Hassan',
      categoryAr: 'رؤى الصناعة',
      categoryEn: 'Industry Insights',
      featured: true,
      published: true,
    },
    {
      titleAr: 'كيف تستعد لمقابلة العمل',
      titleEn: 'How to Prepare for a Job Interview',
      excerptAr: 'دليل شامل للاستعداد لمقابلة العمل وترك انطباع إيجابي لدى صاحب العمل',
      excerptEn: 'A comprehensive guide to preparing for a job interview and leaving a positive impression on the employer',
      contentAr: 'مقابلة العمل هي فرصتك لإثبات أنك المرشح المناسب للوظيفة. إليك دليل شامل يساعدك على الاستعداد الجيد...',
      contentEn: 'The job interview is your chance to prove you are the right candidate for the position. Here is a comprehensive guide to help you prepare well...',
      authorAr: 'ليلى إبراهيم',
      authorEn: 'Laila Ibrahim',
      categoryAr: 'نصائح مهنية',
      categoryEn: 'Career Tips',
      featured: false,
      published: true,
    },
  ]

  for (const post of posts) {
    await prisma.blogPostManaged.create({ data: post })
  }

  console.log('✅ Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
