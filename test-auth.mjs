// Test authentication APIs
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

async function testAdminLogin() {
  console.log('\n🔐 Testing Admin Login...\n');
  
  try {
    const response = await fetch(`${BASE_URL}/api/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@mapeg.com',
        password: 'AdminSecure123!'
      })
    });

    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('✅ Admin login successful!');
      
      // Get cookies
      const cookies = response.headers.get('set-cookie');
      console.log('\nCookies set:', cookies);
    } else {
      console.log('❌ Admin login failed!');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function testUserLogin() {
  console.log('\n\n👤 Testing User Login...\n');
  
  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@mapeg.com',
        password: 'AdminSecure123!'
      })
    });

    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('✅ User login successful!');
      
      // Get cookies
      const cookies = response.headers.get('set-cookie');
      console.log('\nCookies set:', cookies);
    } else {
      console.log('❌ User login failed!');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function testCheckSession() {
  console.log('\n\n🔍 Testing Check Session...\n');
  
  try {
    const response = await fetch(`${BASE_URL}/api/auth/check-session`);
    const data = await response.json();
    
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run tests
console.log('🧪 Starting Authentication Tests...');
console.log('Make sure the server is running on http://localhost:3000\n');

await testAdminLogin();
await testUserLogin();
await testCheckSession();

console.log('\n\n✅ Tests completed!');
