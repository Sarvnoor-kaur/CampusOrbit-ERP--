# Complete Startup Guide - UMS System

## Prerequisites
- MongoDB running on `localhost:27017`
- Node.js installed
- npm installed

## Step 1: Start MongoDB
Open Command Prompt or PowerShell and run:
```bash
mongod
```
Keep it running in a separate terminal.

---

## Step 2: Install Backend Dependencies
Open a new terminal and run:
```bash
cd backend
npm install
```

---

## Step 3: Seed Database with Test Data
Create test accounts (Admin, Student, Teacher):
```bash
npm run seed
```

**Output should show:**
```
✅ Connected to MongoDB
✅ Student created
   Email: student@test.com
   Admission Number: ADM001
   Password: password123

✅ Teacher created
   Email: teacher@test.com
   Employee ID: EMP001
   Password: password123

✅ Admin created
   Email: admin@erp.com
   Password: Admin@123
```

---

## Step 4: Start Backend Server
```bash
npm start
```

**Expected output:**
```
Server running in development mode on port 5000
MongoDB Connected: localhost
✅ Indexes synced successfully
```

Keep this terminal open.

---

## Step 5: Install Frontend Dependencies
Open another terminal and run:
```bash
cd frontend
npm install
```

---

## Step 6: Start Frontend
```bash
npm start
```

This will open the app in your browser at `http://localhost:3000`

---

## Test Accounts

### 🎓 Student Login
- **Admission Number:** `ADM001`
- **Password:** `password123`
- After login → Complete application form → Dashboard access

### 👨‍🏫 Teacher Login
- **Employee ID:** `EMP001`
- **Password:** `password123`

### 👨‍💼 Admin Login
- **Email:** `admin@erp.com`
- **Password:** `Admin@123`

---

## Verify Everything Works

### 1. Test Student Flow
1. Go to `http://localhost:3000`
2. Click "Student Login"
3. Enter: `ADM001` / `password123`
4. Fill application form
5. Submit application
6. Should redirect to dashboard

### 2. Test Teacher Login
1. Go to `http://localhost:3000`
2. Click "Teacher Login"
3. Enter: `EMP001` / `password123`

### 3. Test Admin Login
1. Go to `http://localhost:3000`
2. Click "Admin Login"
3. Enter: `admin@erp.com` / `Admin@123`
4. Access admin dashboard

---

## Common Issues & Fixes

### ❌ "Cannot connect to MongoDB"
- Check if MongoDB is running: `mongod` in terminal
- Verify MongoDB running on port 27017

### ❌ "Login fails - Invalid credentials"
- Run seed script again: `npm run seed`
- Check if test data was created

### ❌ "Application form submit fails"
- Ensure backend is running: `npm start`
- Check browser console for error details

### ❌ "CORS errors"
- Backend should be on `http://localhost:5000`
- Frontend should be on `http://localhost:3000`
- Both must be running

### ❌ "All APIs failing"
- Restart backend: `npm start`
- Check terminal for error messages
- Verify MongoDB connection

---

## Backend Health Check
Open browser and go to: `http://localhost:5000/api/health`

Should return:
```json
{
  "status": "ok",
  "timestamp": "2025-12-01T...",
  "uptime": 123.45
}
```

---

## Frontend-Backend Connection
Check browser DevTools (F12) → Network tab → Login request

Should see status `200` with response containing `token` and `user` data.

---

## Next Steps After Setup
1. Create more test data via admin dashboard
2. Add teachers, courses, subjects
3. Test attendance marking
4. Test application approval workflow
