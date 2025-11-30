# ERP-Based Integrated Student Management System

A complete MERN Stack solution for comprehensive student management with features like admissions, attendance, academics, fees, and learning management system.

## Project Structure

```
ums/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── Student.js
│   │   ├── Teacher.js
│   │   ├── Admin.js
│   │   ├── Attendance.js
│   │   ├── Exam.js
│   │   ├── Marksheet.js
│   │   ├── Fee.js
│   │   ├── Timetable.js
│   │   ├── Subject.js
│   │   ├── Course.js
│   │   ├── Message.js
│   │   ├── Notice.js
│   │   ├── LMS.js
│   │   ├── Hostel.js
│   │   ├── Transport.js
│   │   ├── Inventory.js
│   │   └── Admission.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── studentController.js
│   │   ├── teacherController.js
│   │   ├── adminController.js
│   │   ├── attendanceController.js
│   │   ├── examController.js
│   │   ├── feeController.js
│   │   ├── timetableController.js
│   │   ├── messageController.js
│   │   └── lmsController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── studentRoutes.js
│   │   ├── teacherRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── attendanceRoutes.js
│   │   ├── examRoutes.js
│   │   ├── feeRoutes.js
│   │   ├── timetableRoutes.js
│   │   ├── messageRoutes.js
│   │   └── lmsRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── server.js
│   ├── package.json
│   ├── .env
│   └── uploads/
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── StudentDashboard.js
│   │   │   ├── TeacherDashboard.js
│   │   │   └── AdminDashboard.js
│   │   ├── components/
│   │   │   └── Sidebar.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   └── .gitignore
└── README.md
```

## Features

### 1. **Student Information Management**
- Store personal details, academic details, guardian details
- View student profile
- Upload documents (ID card, certificates)
- Admin can edit/update/delete student profiles

### 2. **Admission & Enrollment Module**
- Online admission form
- Verification & approval
- Automatic admission number generation
- Course & batch allotment

### 3. **Attendance Management**
- Daily attendance marking
- Subject-wise attendance tracking
- Automatic attendance percentage calculation
- Low attendance alerts
- Biometric and RFID integration support

### 4. **Academic & Timetable Management**
- Create/edit subjects
- Assign faculty to subjects
- Generate weekly timetable
- Students can view timetable
- Teachers can update timetable

### 5. **Examination & Result Management**
- Create exams (mid-term, final, internal)
- Enter marks for students
- Auto-calculate grade, percentage, and CGPA
- Publish results to student dashboard
- Download marksheet as PDF

### 6. **Fee & Accounts Management**
- Fee structure creation
- Online/offline fee payment tracking
- Monitor pending dues
- Auto email/SMS reminder support
- Generate financial reports (monthly & yearly)

### 7. **Learning Management System (LMS)**
- Upload study material and notes
- Assignment submission system
- Online quizzes with auto-grading
- Live class integration support (Zoom/Meet links)

### 8. **Hostel & Transport Management**
- Hostel room allocation
- Transport route assignment
- Student enrollment in services

### 9. **Inventory Management**
- Track equipment and books
- Manage inventory stock levels
- Record inventory history

### 10. **Communication System**
- Admin announcements
- Messaging between admin, teacher, and student
- Email/SMS notification support
- Notice board module

### 11. **Analytics & Reporting**
- Attendance analytics
- Fee collection reports
- Performance charts
- Admission statistics
- Faculty performance metrics

## Setup Instructions

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create .env file** (already created with defaults)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ums
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
UPLOAD_DIR=./uploads
```

4. **Start MongoDB**
```bash
mongod
```

5. **Run the server**
```bash
npm run dev
```

Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the application**
```bash
npm start
```

Application will run on `http://localhost:3000`

## API Documentation

### Authentication APIs

#### Login Student
```
POST /api/auth/login-student
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token",
  "user": { id, email, role, admissionNumber, name }
}
```

#### Login Teacher
```
POST /api/auth/login-teacher
Content-Type: application/json

{
  "email": "teacher@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token",
  "user": { id, email, role, employeeId, name }
}
```

#### Login Admin
```
POST /api/auth/login-admin
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token",
  "user": { id, email, role, adminId, name }
}
```

#### Register Student
```
POST /api/auth/register-student
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "1234567890"
}

Response:
{
  "success": true,
  "message": "Student registered successfully",
  "token": "jwt_token",
  "user": { id, email, role, admissionNumber }
}
```

### Student APIs

#### Get Student Profile
```
GET /api/students/profile
Headers: Authorization: Bearer {token}

Response:
{
  "success": true,
  "student": { ... }
}
```

#### Update Student Profile
```
PUT /api/students/profile
Headers: Authorization: Bearer {token}
Content-Type: application/json

{
  "personalDetails": { firstName, lastName, dob, phone, ... },
  "guardianDetails": { fatherName, guardianPhone, ... }
}

Response:
{
  "success": true,
  "message": "Profile updated",
  "student": { ... }
}
```

#### Upload Document
```
POST /api/students/upload-document
Headers: Authorization: Bearer {token}
Content-Type: multipart/form-data

Form Data:
- document: File
- documentType: "ID Card" | "Certificate" | etc.

Response:
{
  "success": true,
  "message": "Document uploaded",
  "student": { ... }
}
```

#### Get Student Attendance
```
GET /api/students/attendance?page=1&limit=10
Headers: Authorization: Bearer {token}

Response:
{
  "success": true,
  "attendance": [ ... ],
  "stats": { presentDays, absentDays, totalDays, attendancePercentage },
  "pagination": { page, limit, total, pages }
}
```

#### Get Student Results
```
GET /api/students/results?page=1&limit=10
Headers: Authorization: Bearer {token}

Response:
{
  "success": true,
  "results": [ ... ],
  "cgpa": "7.5",
  "pagination": { page, limit, total, pages }
}
```

#### Get Student Fees
```
GET /api/students/fees
Headers: Authorization: Bearer {token}

Response:
{
  "success": true,
  "fees": { totalFee, paidAmount, pendingDues, feePaymentHistory, ... }
}
```

#### Download Marksheet
```
GET /api/students/marksheet/{marksheeetId}/download
Headers: Authorization: Bearer {token}

Response: PDF File
```

### Teacher APIs

#### Get Teacher Profile
```
GET /api/teachers/profile
Headers: Authorization: Bearer {token}

Response:
{
  "success": true,
  "teacher": { ... }
}
```

#### Mark Attendance
```
POST /api/attendance/mark
Headers: Authorization: Bearer {token}
Content-Type: application/json

{
  "students": [
    { "studentId": "...", "status": "present", "subjectName": "..." },
    { "studentId": "...", "status": "absent", "subjectName": "..." }
  ],
  "date": "2024-01-15",
  "subject": "subject_id",
  "batch": "2024-A"
}

Response:
{
  "success": true,
  "message": "Attendance marked successfully"
}
```

#### Enter Marks
```
POST /api/teachers/enter-marks
Headers: Authorization: Bearer {token}
Content-Type: application/json

{
  "student": "student_id",
  "exam": "exam_id",
  "subject": "subject_id",
  "marksObtained": 85,
  "totalMarks": 100
}

Response:
{
  "success": true,
  "message": "Marks entered successfully",
  "marksheet": { ... }
}
```

#### Get Teacher Timetable
```
GET /api/teachers/timetable
Headers: Authorization: Bearer {token}

Response:
{
  "success": true,
  "timetable": { ... }
}
```

#### Upload LMS Content
```
POST /api/teachers/upload-lms
Headers: Authorization: Bearer {token}
Content-Type: multipart/form-data

Form Data:
- file: File
- title: "Introduction to Math"
- type: "study_material" | "assignment" | "quiz" | "video"
- subject: "subject_id"
- batch: "2024-A"

Response:
{
  "success": true,
  "message": "LMS content uploaded",
  "lmsContent": { ... }
}
```

### Admin APIs

#### Get Dashboard Stats
```
GET /api/admin/dashboard-stats
Headers: Authorization: Bearer {token}

Response:
{
  "success": true,
  "stats": {
    "totalStudents": 150,
    "totalTeachers": 20,
    "totalCourses": 5,
    "totalSubjects": 35,
    "pendingAdmissions": 5
  }
}
```

#### Get Admissions
```
GET /api/admin/admissions?page=1&limit=10&status=pending
Headers: Authorization: Bearer {token}

Response:
{
  "success": true,
  "admissions": [ ... ],
  "pagination": { page, limit, total, pages }
}
```

#### Approve Admission
```
POST /api/admin/admission/{admissionId}/approve
Headers: Authorization: Bearer {token}
Content-Type: application/json

{
  "remarks": "All documents verified"
}

Response:
{
  "success": true,
  "message": "Admission approved",
  "admission": { ... },
  "student": { ... }
}
```

#### Create Course
```
POST /api/admin/course/create
Headers: Authorization: Bearer {token}
Content-Type: application/json

{
  "courseName": "Bachelor of Engineering",
  "courseCode": "BE001",
  "department": "Engineering",
  "totalSemesters": 8
}

Response:
{
  "success": true,
  "message": "Course created",
  "course": { ... }
}
```

#### Create Subject
```
POST /api/admin/subject/create
Headers: Authorization: Bearer {token}
Content-Type: application/json

{
  "subjectCode": "MATH101",
  "subjectName": "Calculus",
  "credits": 4,
  "semester": 1,
  "department": "Engineering"
}

Response:
{
  "success": true,
  "message": "Subject created",
  "subject": { ... }
}
```

#### Create Teacher
```
POST /api/admin/teacher/create
Headers: Authorization: Bearer {token}
Content-Type: application/json

{
  "email": "teacher@example.com",
  "password": "password123",
  "firstName": "Jane",
  "lastName": "Smith",
  "department": "Engineering",
  "designation": "Assistant Professor"
}

Response:
{
  "success": true,
  "message": "Teacher created",
  "teacher": { ... }
}
```

### Attendance APIs

#### Get Student Attendance
```
GET /api/attendance/student/{studentId}?page=1&limit=10
Headers: Authorization: Bearer {token}

Response:
{
  "success": true,
  "attendance": [ ... ],
  "stats": { presentDays, absentDays, totalDays, attendancePercentage },
  "pagination": { page, limit, total, pages }
}
```

#### Get Low Attendance Alerts
```
GET /api/attendance/low-attendance-alerts?threshold=75
Headers: Authorization: Bearer {token}

Response:
{
  "success": true,
  "alerts": [
    {
      "student": "student_id",
      "studentName": "John Doe",
      "admissionNumber": "ADM123",
      "attendancePercentage": "65.50",
      "presentDays": 13,
      "totalDays": 20
    }
  ]
}
```

#### Biometric Mark Attendance
```
POST /api/attendance/biometric
Headers: Authorization: Bearer {token}
Content-Type: application/json

{
  "biometricId": "BIO123456",
  "date": "2024-01-15"
}

Response:
{
  "success": true,
  "message": "Attendance marked via biometric",
  "attendance": { ... }
}
```

### Exam APIs

#### Create Exam
```
POST /api/exams/create
Headers: Authorization: Bearer {token}
Content-Type: application/json

{
  "examName": "Mid-term Exam",
  "examType": "midterm",
  "subject": "subject_id",
  "batch": "2024-A",
  "date": "2024-02-01",
  "totalMarks": 100,
  "passingMarks": 40
}

Response:
{
  "success": true,
  "message": "Exam created",
  "exam": { ... }
}
```

#### Get All Exams
```
GET /api/exams?page=1&limit=10&batch=2024-A&examType=midterm
Headers: Authorization: Bearer {token}

Response:
{
  "success": true,
  "exams": [ ... ],
  "pagination": { page, limit, total, pages }
}
```

#### Publish Results
```
POST /api/exams/{examId}/publish-results
Headers: Authorization: Bearer {token}

Response:
{
  "success": true,
  "message": "Results published",
  "exam": { ... },
  "publishedCount": 50
}
```

### Fee APIs

#### Create Fee Structure
```
POST /api/fees/create
Headers: Authorization: Bearer {token}
Content-Type: application/json

{
  "student": "student_id",
  "semester": 1,
  "academicYear": "2024",
  "feeStructure": {
    "tuitionFee": 50000,
    "labFee": 5000,
    "libraryFee": 2000,
    "sportsFee": 3000,
    "otherFee": 1000
  },
  "totalFee": 61000,
  "dueDate": "2024-02-01"
}

Response:
{
  "success": true,
  "message": "Fee structure created",
  "fee": { ... }
}
```

#### Record Fee Payment
```
POST /api/fees/payment
Headers: Authorization: Bearer {token}
Content-Type: application/json

{
  "feeId": "fee_id",
  "amount": 30000,
  "paymentMethod": "online",
  "transactionId": "TXN123456",
  "status": "completed"
}

Response:
{
  "success": true,
  "message": "Payment recorded",
  "fee": { ... }
}
```

#### Get Fee Report
```
GET /api/fees/report/generate?month=1&year=2024
Headers: Authorization: Bearer {token}

Response:
{
  "success": true,
  "report": {
    "totalRecords": 150,
    "totalCollected": 1500000,
    "totalPending": 300000,
    "totalAmount": 1800000,
    "fees": [ ... ]
  }
}
```

### Timetable APIs

#### Create Timetable
```
POST /api/timetable/create
Headers: Authorization: Bearer {token}
Content-Type: application/json

{
  "batch": "2024-A",
  "semester": 1,
  "academicYear": "2024",
  "schedule": [
    {
      "day": "Monday",
      "slot": { "slotNumber": 1, "startTime": "09:00", "endTime": "10:30" },
      "subject": "subject_id",
      "subjectName": "Calculus",
      "teacher": "teacher_id",
      "teacherName": "Jane Smith",
      "classroom": "A101",
      "type": "theory"
    }
  ]
}

Response:
{
  "success": true,
  "message": "Timetable created/updated",
  "timetable": { ... }
}
```

#### Get Timetable by Batch
```
GET /api/timetable/batch?batch=2024-A&semester=1
Headers: Authorization: Bearer {token}

Response:
{
  "success": true,
  "timetable": { ... }
}
```

### LMS APIs

#### Upload LMS Content
```
POST /api/lms/upload
Headers: Authorization: Bearer {token}
Content-Type: multipart/form-data

Form Data:
- file: File
- title: "Chapter 1: Introduction"
- type: "study_material" | "assignment" | "quiz" | "video"
- subject: "subject_id"
- batch: "2024-A"

Response:
{
  "success": true,
  "message": "Content uploaded",
  "lmsContent": { ... }
}
```

#### Get All LMS Content
```
GET /api/lms?page=1&limit=10&type=study_material&subject=subject_id
Headers: Authorization: Bearer {token}

Response:
{
  "success": true,
  "content": [ ... ],
  "pagination": { page, limit, total, pages }
}
```

#### Submit Assignment
```
POST /api/lms/{contentId}/submit-assignment
Headers: Authorization: Bearer {token}
Content-Type: multipart/form-data

Form Data:
- file: File

Response:
{
  "success": true,
  "message": "Assignment submitted",
  "submission": { ... }
}
```

#### Submit Quiz
```
POST /api/lms/{contentId}/submit-quiz
Headers: Authorization: Bearer {token}
Content-Type: application/json

{
  "answers": [
    { "questionNumber": 1, "answer": "A" },
    { "questionNumber": 2, "answer": "C" }
  ]
}

Response:
{
  "success": true,
  "message": "Quiz submitted",
  "result": { marksObtained, totalMarks, percentage }
}
```

### Message APIs

#### Send Message
```
POST /api/messages/send
Headers: Authorization: Bearer {token}
Content-Type: application/json

{
  "recipient": "recipient_id",
  "recipientModel": "Student" | "Teacher" | "Admin",
  "subject": "Important Notice",
  "message": "Please attend the meeting tomorrow",
  "messageType": "text",
  "priority": "high"
}

Response:
{
  "success": true,
  "message": "Message sent",
  "newMessage": { ... }
}
```

#### Get Received Messages
```
GET /api/messages/received?page=1&limit=10&isRead=false
Headers: Authorization: Bearer {token}

Response:
{
  "success": true,
  "messages": [ ... ],
  "unreadCount": 5,
  "pagination": { page, limit, total, pages }
}
```

#### Create Notice
```
POST /api/messages/notice/create
Headers: Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Holiday Announcement",
  "content": "College will be closed on 26th January",
  "category": "holiday" | "academic" | "events" | "maintenance" | "general",
  "visibility": "all" | "students" | "teachers" | "staff",
  "expiryDate": "2024-02-01"
}

Response:
{
  "success": true,
  "message": "Notice created",
  "notice": { ... }
}
```

## User Roles and Permissions

### Student Role
- View own profile and documents
- View attendance records
- View exam results and CGPA
- View fee details and payment history
- View timetable
- Access learning materials
- Submit assignments and take quizzes
- Send messages to teachers and admin
- View announcements and notices

### Teacher Role
- View own profile
- Mark attendance for assigned batches
- Enter marks for students
- View own timetable
- Upload study materials and assignments
- Create quizzes
- Grade student submissions
- Send messages to students and admin
- View analytics for own classes

### Admin Role
- Manage student information and admissions
- Create and manage courses and subjects
- Assign teachers to subjects
- Create and manage timetables
- Create exams
- Manage fees and payments
- Monitor attendance
- View all reports and analytics
- Create announcements and notices
- Manage hostel and transport
- Manage inventory

## Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **Nodemailer** - Email service
- **PDFKit** - PDF generation

### Frontend
- **React** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Ant Design** - UI components
- **Recharts** - Data visualization

## Environment Variables

Create a `.env` file in the backend directory:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ums
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
UPLOAD_DIR=./uploads
```

## Database Schema

The system uses MongoDB with the following collections:
- Students
- Teachers
- Admins
- Attendance
- Exams
- Marksheets
- Fees
- Timetables
- Subjects
- Courses
- Messages
- Notices
- LMS
- Hostels
- Transport
- Inventory
- Admissions

## API Response Format

All API responses follow this format:

```json
{
  "success": true/false,
  "message": "Success or error message",
  "data": { ... },
  "pagination": { "page": 1, "limit": 10, "total": 100, "pages": 10 }
}
```

## Error Handling

The system includes comprehensive error handling:
- Input validation
- Database errors
- Authentication errors
- Authorization errors
- File upload errors
- Email service errors

## Security Features

- JWT-based authentication
- Role-based access control
- Password hashing with bcryptjs
- Protected API endpoints
- CORS configuration
- File upload validation
- Input sanitization

## Future Enhancements

- SMS notifications
- Real-time notifications using WebSocket
- Video conferencing integration
- Mobile app
- Advanced analytics dashboards
- Integration with payment gateways
- Bulk import/export features
- Advanced reporting tools

## Support

For issues or questions, please contact the development team.

## License

MIT License

## Author

ERP Development Team

---

**Version:** 1.0.0  
**Last Updated:** 2024
