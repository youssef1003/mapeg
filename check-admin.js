// سكريبت للتحقق من بيانات الأدمن
require('dotenv').config();

console.log('🔍 التحقق من بيانات الأدمن في .env:\n');

const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

if (!adminEmail || !adminPassword) {
    console.log('❌ خطأ: بيانات الأدمن غير موجودة في .env');
    console.log('\nيجب إضافة التالي في ملف .env:');
    console.log('ADMIN_EMAIL="admin@mapeg.com"');
    console.log('ADMIN_PASSWORD="AdminSecure123!"');
    process.exit(1);
}

console.log('✅ بيانات الأدمن موجودة:');
console.log(`   Email: ${adminEmail}`);
console.log(`   Password: ${adminPassword.replace(/./g, '*')}`);
console.log('\n📝 استخدم هذه البيانات لتسجيل الدخول في:');
console.log('   http://localhost:3000/ar/auth/login');
console.log('\n✅ كل شيء جاهز!');
