# Complete API Endpoints Reference

## Base URL
```
http://localhost:5000/api
```

## Authentication Endpoints
| Method | Endpoint | Authentication | Description |
|--------|----------|-----------------|-------------|
| POST | `/auth/register-student` | None | Register a new student |
| POST | `/auth/login-student` | None | Student login |
| POST | `/auth/login-teacher` | None | Teacher login |
| POST | `/auth/login-admin` | None | Admin login |
| GET | `/auth/verify-token` | JWT | Verify current token |

## Student Endpoints
| Method | Endpoint | Authentication | Role | Description |
|--------|----------|-----------------|------|-------------|
| GET | `/students/profile` | JWT | Student | Get own profile |
| PUT | `/students/profile` | JWT | Student | Update own profile |
| POST | `/students/upload-document` | JWT | Student | Upload document |
| GET | `/students/attendance` | JWT | Student | Get own attendance |
| GET | `/students/results` | JWT | Student | Get own results |
| GET | `/students/fees` | JWT | Student | Get own fee details |
| GET | `/students/marksheet/:marksheeetId/download` | JWT | Student | Download marksheet |
| GET | `/students` | JWT | Admin | Get all students |
| GET | `/students/:id` | JWT | Admin | Get student by ID |
| PUT | `/students/:id` | JWT | Admin | Update student |
| DELETE | `/students/:id` | JWT | Admin | Delete student |

## Teacher Endpoints
| Method | Endpoint | Authentication | Role | Description |
|--------|----------|-----------------|------|-------------|
| GET | `/teachers/profile` | JWT | Teacher | Get own profile |
| PUT | `/teachers/profile` | JWT | Teacher | Update own profile |
| POST | `/teachers/mark-attendance` | JWT | Teacher | Mark student attendance |
| GET | `/teachers/attendance` | JWT | Teacher | Get attendance records |
| POST | `/teachers/enter-marks` | JWT | Teacher | Enter student marks |
| GET | `/teachers/timetable` | JWT | Teacher | Get own timetable |
| POST | `/teachers/upload-lms` | JWT | Teacher | Upload LMS content |
| GET | `/teachers` | JWT | Admin | Get all teachers |
| GET | `/teachers/:id` | JWT | Admin | Get teacher by ID |
| PUT | `/teachers/:id` | JWT | Admin | Update teacher |
| DELETE | `/teachers/:id` | JWT | Admin | Delete teacher |

## Admin Endpoints
| Method | Endpoint | Authentication | Role | Description |
|--------|----------|-----------------|------|-------------|
| POST | `/admin/create-admin` | JWT | Admin | Create new admin |
| GET | `/admin/admissions` | JWT | Admin | Get all admissions |
| POST | `/admin/admission/:id/approve` | JWT | Admin | Approve admission |
| POST | `/admin/admission/:id/reject` | JWT | Admin | Reject admission |
| POST | `/admin/course/create` | JWT | Admin | Create course |
| GET | `/admin/courses` | JWT | Admin | Get all courses |
| POST | `/admin/subject/create` | JWT | Admin | Create subject |
| GET | `/admin/subjects` | JWT | Admin | Get all subjects |
| POST | `/admin/teacher/create` | JWT | Admin | Create teacher |
| GET | `/admin/dashboard-stats` | JWT | Admin | Get dashboard statistics |

## Attendance Endpoints
| Method | Endpoint | Authentication | Role | Description |
|--------|----------|-----------------|------|-------------|
| POST | `/attendance/mark` | JWT | Teacher/Admin | Mark attendance |
| GET | `/attendance/student/:studentId` | JWT | All | Get student attendance |
| GET | `/attendance/batch` | JWT | Teacher/Admin | Get batch attendance |
| GET | `/attendance/low-attendance-alerts` | JWT | Admin | Get low attendance alerts |
| POST | `/attendance/biometric` | JWT | All | Mark via biometric |
| POST | `/attendance/rfid` | JWT | All | Mark via RFID |
| PUT | `/attendance/:id` | JWT | Teacher/Admin | Update attendance |
| DELETE | `/attendance/:id` | JWT | Admin | Delete attendance |

## Exam Endpoints
| Method | Endpoint | Authentication | Role | Description |
|--------|----------|-----------------|------|-------------|
| POST | `/exams/create` | JWT | Admin/Teacher | Create exam |
| GET | `/exams` | JWT | All | Get all exams |
| GET | `/exams/:id` | JWT | All | Get exam details |
| PUT | `/exams/:id` | JWT | Admin/Teacher | Update exam |
| DELETE | `/exams/:id` | JWT | Admin | Delete exam |
| POST | `/exams/:examId/publish-results` | JWT | Admin/Teacher | Publish results |
| GET | `/exams/:examId/results` | JWT | Admin/Teacher | Get exam results |

## Fee Endpoints
| Method | Endpoint | Authentication | Role | Description |
|--------|----------|-----------------|------|-------------|
| POST | `/fees/create` | JWT | Admin | Create fee structure |
| POST | `/fees/payment` | JWT | Admin/Student | Record payment |
| GET | `/fees/student/:studentId` | JWT | Student/Admin | Get student fees |
| GET | `/fees` | JWT | Admin | Get all fees |
| GET | `/fees/pending/all` | JWT | Admin | Get pending fees |
| GET | `/fees/report/generate` | JWT | Admin | Generate fee report |

## Timetable Endpoints
| Method | Endpoint | Authentication | Role | Description |
|--------|----------|-----------------|------|-------------|
| POST | `/timetable/create` | JWT | Admin | Create timetable |
| GET | `/timetable/batch` | JWT | All | Get batch timetable |
| GET | `/timetable` | JWT | All | Get all timetables |
| GET | `/timetable/:id` | JWT | All | Get timetable by ID |
| PUT | `/timetable/:id` | JWT | Admin/Teacher | Update timetable |
| DELETE | `/timetable/:id` | JWT | Admin | Delete timetable |

## Message Endpoints
| Method | Endpoint | Authentication | Role | Description |
|--------|----------|-----------------|------|-------------|
| POST | `/messages/send` | JWT | All | Send message |
| GET | `/messages/received` | JWT | All | Get received messages |
| GET | `/messages/sent` | JWT | All | Get sent messages |
| PUT | `/messages/:messageId/read` | JWT | All | Mark as read |
| DELETE | `/messages/:messageId` | JWT | All | Delete message |
| POST | `/messages/notice/create` | JWT | Admin | Create notice |
| GET | `/messages/notice` | JWT | All | Get all notices |
| PUT | `/messages/notice/:noticeId` | JWT | Admin | Update notice |
| DELETE | `/messages/notice/:noticeId` | JWT | Admin | Delete notice |

## LMS Endpoints
| Method | Endpoint | Authentication | Role | Description |
|--------|----------|-----------------|------|-------------|
| POST | `/lms/upload` | JWT | Teacher | Upload content |
| GET | `/lms` | JWT | All | Get all content |
| GET | `/lms/:contentId` | JWT | All | Get content details |
| POST | `/lms/:contentId/submit-assignment` | JWT | Student | Submit assignment |
| POST | `/lms/:contentId/:studentId/grade-assignment` | JWT | Teacher | Grade assignment |
| POST | `/lms/:contentId/submit-quiz` | JWT | Student | Submit quiz |
| GET | `/lms/:contentId/submissions` | JWT | Teacher | Get submissions |
| PUT | `/lms/:contentId` | JWT | Teacher | Update content |
| DELETE | `/lms/:contentId` | JWT | Teacher | Delete content |

## Health Check
| Method | Endpoint | Authentication | Description |
|--------|----------|-----------------|-------------|
| GET | `/health` | None | Check API health |

## Request Headers

All authenticated endpoints require:
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

## Query Parameters

### Common Pagination Parameters
- `page` - Page number (default: 1)
- `limit` - Records per page (default: 10)

### Filtering Parameters
- `search` - Search term
- `status` - Filter by status
- `batch` - Filter by batch
- `semester` - Filter by semester
- `examType` - Filter by exam type
- `category` - Filter by category

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "status": 400
}
```

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing/invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 500 | Server Error - Internal error |

## File Upload

### Supported Formats
- Documents: PDF, DOC, DOCX, XLS, XLSX
- Images: JPG, JPEG, PNG
- Videos: MP4, AVI, MOV

### Upload Endpoint
```
POST /api/students/upload-document
Content-Type: multipart/form-data

Form Fields:
- document: File
- documentType: string
```

## Rate Limiting

Currently no rate limiting. Consider implementing for production:
- 100 requests per 15 minutes per IP
- 1000 requests per hour per authenticated user

## Webhooks

Not implemented. Consider adding for:
- Payment notifications
- Email delivery status
- SMS delivery status

## Authentication

### Token Generation
Tokens are issued on login and expire after 7 days.

### Token Refresh
No refresh token mechanism. Re-login when token expires.

### Token Storage
Store token in browser localStorage:
```javascript
localStorage.setItem('token', token);
```

## Pagination Example

```
GET /api/students?page=2&limit=20

Response includes:
{
  "pagination": {
    "page": 2,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

## Search Example

```
GET /api/students?search=john

Searches in:
- personalDetails.firstName
- personalDetails.lastName
- email
- admissionNumber
```

## CORS

Frontend URL: `http://localhost:3000`

To allow other origins, update `.env`:
```
CORS_ORIGIN=http://your-domain.com
```

## API Usage Tips

1. Always include Authorization header for protected routes
2. Check response format before using data
3. Handle pagination for large datasets
4. Implement proper error handling
5. Cache responses where appropriate
6. Use appropriate HTTP methods (GET, POST, PUT, DELETE)
7. Validate input on frontend before sending

## Troubleshooting

### 401 Unauthorized
- Token missing or invalid
- Token expired - need to re-login
- Check Authorization header format

### 403 Forbidden
- User role insufficient for endpoint
- Check user role in token payload

### 404 Not Found
- Resource ID incorrect
- Resource doesn't exist
- Check endpoint path

### 500 Server Error
- Check server logs
- Verify MongoDB connection
- Check request payload format

## Performance Tips

1. Use pagination for large datasets
2. Filter data before requesting
3. Cache static data (courses, subjects)
4. Implement lazy loading for large lists
5. Use search instead of retrieving all records

---

**Last Updated:** 2024
**API Version:** 1.0.0
