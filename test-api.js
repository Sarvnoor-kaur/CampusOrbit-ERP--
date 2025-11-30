const axios = require('axios');

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
});

async function testRegister() {
  try {
    console.log('\n=== Testing Student Registration ===');
    const res = await api.post('/auth/register-student', {
      email: 'student1@test.com',
      password: 'Password123',
      name: 'John Doe',
      mobile: '9876543210'
    });
    console.log('Registration Success:', JSON.stringify(res.data, null, 2));
    return res.data;
  } catch (error) {
    console.error('Registration Error:', error.response?.data || error.message);
  }
}

async function testSubmitApplication(token) {
  try {
    console.log('\n=== Testing Application Form Submission ===');
    const res = await api.post('/admissions/submit-application',
      {
        personalDetails: {
          firstName: 'John',
          lastName: 'Doe',
          dob: '2000-01-15',
          gender: 'Male',
          phone: '9876543210'
        },
        guardianDetails: {
          fatherName: 'Father Name',
          motherName: 'Mother Name'
        },
        academicDetails: {
          batch: '2024',
          previousSchool: 'ABC School'
        }
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    console.log('Application Submission Success:', JSON.stringify(res.data, null, 2));
  } catch (error) {
    console.error('Application Submission Error:', error.response?.data || error.message);
  }
}

async function runTests() {
  const response = await testRegister();
  if (response && response.token) {
    await testSubmitApplication(response.token);
  }
}

runTests().then(() => {
  console.log('\nTests completed');
  process.exit(0);
}).catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
