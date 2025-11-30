# Quick Start Guide

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally on port 27017)
- npm or yarn

## Installation & Setup

### 1. Clone or Extract the Project
```bash
cd ums
```

### 2. Backend Setup (5 minutes)

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# The .env file is already configured with defaults
# For production, update the .env file with your credentials

# Create uploads directory
mkdir uploads

# Start MongoDB (in a separate terminal)
mongod

# Start the backend server
npm run dev
```

The backend will be available at: `http://localhost:5000`

### 3. Frontend Setup (5 minutes)

```bash
# In a new terminal, navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the React application
npm start
```

The frontend will be available at: `http://localhost:3000`

## Default Login Credentials

### Student
- Email: `student@example.com`
- Password: Create an account through registration or contact admin

### Teacher
- Email: `teacher@example.com`
- Password: Ask admin for credentials

### Admin
- Email: `admin@example.com`
- Password: `admin123`

> **Note:** Change default passwords immediately in production!

## Key Endpoints

### Health Check
```
GET http://localhost:5000/api/health
```

### API Base URL
```
http://localhost:5000/api
```

## Main Features to Explore

### For Students
1. Login and view dashboard
2. Check attendance record
3. View exam results
4. Check fee status
5. Download marksheet
6. Access learning materials

### For Teachers
1. Login and view dashboard
2. Mark student attendance
3. Enter student marks
4. Upload study materials
5. Create assignments
6. Grade submissions

### For Admin
1. Dashboard with statistics
2. Manage admissions
3. Create courses and subjects
4. Manage students and teachers
5. Create timetables
6. View reports

## Project Structure Overview

```
backend/
├── models/          - MongoDB schemas
├── controllers/     - Business logic
├── routes/         - API endpoints
├── middleware/     - Auth & error handling
├── config/         - Database configuration
├── uploads/        - File storage
└── server.js       - Express server

frontend/
├── src/
│   ├── pages/      - React pages (Login, Dashboards)
│   ├── components/ - Reusable components
│   ├── App.js      - Main app component
│   └── index.js    - Entry point
└── public/         - Static files
```

## Common Issues & Solutions

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
Solution: Start MongoDB with 'mongod' command
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
Solution: Change PORT in .env or kill process on that port
```

### CORS Error
```
Error: Access to XMLHttpRequest blocked by CORS policy
Solution: Check CORS_ORIGIN in backend .env matches frontend URL
```

### Module Not Found
```
Error: Cannot find module 'express'
Solution: Run 'npm install' in the project directory
```

## Development Tips

### Add New Student
1. Go to Admin Dashboard → Admissions
2. Review pending admissions
3. Click "Approve" to create student account

### Mark Attendance
1. Login as Teacher
2. Go to "Attendance" tab
3. Select batch, date, and mark attendance
4. Save

### Enter Marks
1. Login as Teacher
2. Go to "Marks" tab
3. Select exam, student, and enter marks
4. System auto-calculates grade and percentage

### Create Course
1. Login as Admin
2. Go to "Courses" section
3. Fill in course details
4. Save

## API Testing

Use Postman or cURL to test APIs:

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login-admin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# Get token from response and use in Authorization header
curl -X GET http://localhost:5000/api/admin/dashboard-stats \
  -H "Authorization: Bearer {token}"
```

## Database

### Collections Created
- students
- teachers
- admins
- attendance
- exams
- marksheets
- fees
- timetables
- subjects
- courses
- messages
- notices
- lms
- hostels
- transports
- inventories
- admissions

### View Data
```bash
# In MongoDB shell
use ums
db.students.find()
db.teachers.find()
db.exams.find()
```

## File Upload

Uploaded files are stored in `backend/uploads/` directory.
Configure upload directory in `.env` if needed.

## Next Steps

1. **Configure Email Service** - Update .env with SMTP credentials for notifications
2. **Set JWT Secret** - Change JWT_SECRET in .env
3. **Connect Payment Gateway** - Integrate for fee payments
4. **Add Notifications** - Implement email/SMS reminders
5. **Deploy** - Use Heroku, Railway, or AWS

## Support & Documentation

- Full API documentation: See README.md
- Backend routes: backend/routes/
- Frontend components: frontend/src/
- Database models: backend/models/

## Production Checklist

- [ ] Change all default passwords
- [ ] Update JWT_SECRET in .env
- [ ] Configure MONGODB_URI for production database
- [ ] Set NODE_ENV to production
- [ ] Enable HTTPS
- [ ] Set up email service
- [ ] Configure CORS for production domain
- [ ] Enable rate limiting
- [ ] Set up backup strategy
- [ ] Configure logging

---

**Happy Coding!** 🚀

For more details, refer to README.md
