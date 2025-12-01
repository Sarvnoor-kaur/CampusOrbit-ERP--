# Troubleshooting Guide

## Complete Solution Checklist

### 1️⃣ APIs Not Working

**Check backend is running:**
```bash
# Terminal 1: MongoDB
mongod

# Terminal 2: Backend
cd backend
npm start
```

**Verify connection:**
- Open browser: `http://localhost:5000/api/health`
- Should return `{"status":"ok"}`

**If still failing:**
- Check `.env` file has correct `MONGODB_URI=mongodb://localhost:27017/ums`
- Check port 5000 is not in use: `netstat -ano | findstr :5000`
- Restart backend server

---

### 2️⃣ Cannot Fill/Submit Application Form

**Root cause:** No authenticated student session

**Solution:**
1. Verify you're logged in as student with `ADM001`
2. Application form should be at `/application-form`
3. Check browser console (F12) for errors

**If form doesn't load:**
- Clear localStorage: F12 → Application → Storage → Clear All
- Hard refresh: `Ctrl + Shift + R`
- Try incognito window

**If submit fails:**
- Check DevTools Network tab
- Look for failed POST to `/api/admissions/submit-application`
- Check backend terminal for error logs

---

### 3️⃣ Admin Login Not Working

**Issue:** Admin account might not exist in database

**Solution:**
```bash
cd backend
npm run seed
```

**Verify admin was created:**
- Check MongoDB directly:
```javascript
use ums
db.admins.find()
```

**If no admin found:**
- Check seed script ran without errors
- Create admin manually via MongoDB:
```javascript
db.admins.insertOne({
  adminId: "ADMIN001",
  email: "admin@erp.com",
  password: "$2a$10$J1NkLdJHRQONjvvmJZvKs.ZGvCx6nZa0rL5vK9L2h8b4mC3b1N5kK",
  firstName: "System",
  lastName: "Administrator",
  role: "superadmin",
  isActive: true
})
```

---

### 4️⃣ Teacher Login Not Working

**Issue:** Teacher account doesn't exist

**Solution:**
```bash
cd backend
npm run seed
```

**Verify teacher created:**
```javascript
db.teachers.find()
```

**Test with credentials:**
- Employee ID: `EMP001`
- Password: `password123`

---

### 5️⃣ Student Registration Fails

**Common issues:**

**Issue: "Email already registered"**
- Try different email
- Or clear MongoDB: `db.students.deleteMany({})`

**Issue: "Validation error"**
- Fill all fields correctly
- Phone: 10 digits only
- Password: min 6 characters

**Issue: Doesn't redirect to application form**
- Check browser console for errors
- Verify localStorage has token and user

---

### 6️⃣ All APIs Return 401 (Unauthorized)

**Cause:** Invalid or missing token

**Solution:**
1. Login again to get fresh token
2. Check token in localStorage (F12 → Application)
3. Token should exist in headers for protected routes

**If persists:**
- Clear localStorage
- Hard refresh browser
- Login again

---

### 7️⃣ "Cannot read property 'email' of null"

**Cause:** User object is null in backend

**Solution:**
- Backend is trying to access user that doesn't exist
- Check database for the user:
```javascript
db.students.find({ admissionNumber: "ADM001" })
db.teachers.find({ employeeId: "EMP001" })
db.admins.find({ email: "admin@erp.com" })
```

If not found, run: `npm run seed`

---

### 8️⃣ CORS Errors

**Error:** "Access to XMLHttpRequest blocked by CORS policy"

**Solution:**
- Verify backend CORS is configured in `server.js`
- Check frontend URL is in allowed origins:
```javascript
http://localhost:3000
http://localhost:3001
```

- Restart backend after checking

---

### 9️⃣ MongoDB Connection Fails

**Error:** "connect ECONNREFUSED 127.0.0.1:27017"

**Solution:**
1. Check MongoDB is running:
```bash
mongod
```

2. Verify connection string in `.env`:
```
MONGODB_URI=mongodb://localhost:27017/ums
```

3. Test connection:
```bash
mongo
> use ums
> db.adminCommand("ping")
```

---

### 🔟 Port Already in Use

**Error:** "Port 5000 already in use"

**Solution:**
```bash
# Windows: Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID)
taskkill /PID <PID> /F

# Or use different port
set PORT=5001
npm start
```

---

## Complete Reset Procedure

If everything fails, do a complete reset:

### Backend Reset
```bash
cd backend

# Remove node_modules
rmdir /s node_modules

# Reinstall dependencies
npm install

# Reseed database
npm run seed

# Start fresh
npm start
```

### Frontend Reset
```bash
cd frontend

# Clear cache
rmdir /s node_modules
del package-lock.json

# Reinstall
npm install

# Clear browser cache
# F12 → Application → Storage → Clear Site Data

# Start frontend
npm start
```

### Database Reset
```javascript
# In MongoDB shell
mongo
> use ums
> db.dropDatabase()
> exit

# Then reseed
cd backend
npm run seed
```

---

## Debug Logs to Check

### Backend Console
Look for:
- ✅ "Server running on port 5000"
- ✅ "MongoDB Connected"
- ✅ "Indexes synced successfully"
- ❌ Any error messages

### Browser Console (F12)
- Network tab: Check API responses
- Console tab: JavaScript errors
- Look for 401, 404, 500 status codes

### MongoDB
```javascript
# Check connections
db.adminCommand("connectionStatus")

# Check collections exist
show collections

# Sample data
db.students.findOne()
db.teachers.findOne()
db.admins.findOne()
```

---

## Manual Testing

### Test Student Login API
```bash
curl -X POST http://localhost:5000/api/auth/login-student \
  -H "Content-Type: application/json" \
  -d '{"admissionNumber":"ADM001","password":"password123"}'
```

### Test Teacher Login API
```bash
curl -X POST http://localhost:5000/api/auth/login-teacher \
  -H "Content-Type: application/json" \
  -d '{"employeeId":"EMP001","password":"password123"}'
```

### Test Admin Login API
```bash
curl -X POST http://localhost:5000/api/auth/login-admin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@erp.com","password":"Admin@123"}'
```

Expected response:
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": "...",
    "email": "...",
    "role": "student|teacher|admin"
  }
}
```

---

## Still Having Issues?

1. **Check all terminals are running:**
   - MongoDB terminal
   - Backend terminal
   - Frontend terminal

2. **Verify all three are healthy:**
   - MongoDB: No errors
   - Backend: "Server running on port 5000"
   - Frontend: "Webpack compiled successfully"

3. **Do a complete reset** (see above)

4. **Check firewall** isn't blocking ports 3000, 5000, 27017
