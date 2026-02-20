import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function checkUser() {
  try {
    console.log('🔍 Checking users in database...\n')

    // Check User table
    const users = await prisma.user.findMany({
      where: { role: 'ADMIN' }
    })

    console.log('📊 Users with ADMIN role:')
    for (const user of users) {
      console.log(`\n✅ Found Admin User:`)
      console.log(`   Email: ${user.email}`)
      console.log(`   Name: ${user.name}`)
      console.log(`   Role: ${user.role}`)
      console.log(`   ID: ${user.id}`)
      
      // Test password
      const testPassword = 'AdminSecure123!'
      const isMatch = await bcrypt.compare(testPassword, user.password)
      console.log(`   Password Test: ${isMatch ? '✅ CORRECT' : '❌ WRONG'}`)
    }

    // Check old Admin table
    const oldAdmins = await prisma.admin.findMany()
    console.log('\n\n📊 Old Admin table:')
    for (const admin of oldAdmins) {
      console.log(`\n✅ Found Old Admin:`)
      console.log(`   Email: ${admin.email}`)
      console.log(`   Name: ${admin.name}`)
      console.log(`   ID: ${admin.id}`)
    }

    if (users.length === 0 && oldAdmins.length === 0) {
      console.log('\n❌ No admin users found!')
      console.log('\n💡 Run: npm run db:seed')
    }

  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

checkUser()
