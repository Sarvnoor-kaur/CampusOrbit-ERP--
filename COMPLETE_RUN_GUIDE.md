# 🚀 Complete Step-by-Step Guide to Run the ERP System

## **Step 1: Start MongoDB**

Ensure MongoDB is running locally on `localhost:27017`

```bash
# If MongoDB is not running, start it:
# Windows: mongod (in MongoDB installation folder)
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

Check connection: Visit `http://localhost:5000/api/health` in browser

---

## **Step 2: Setup Backend (Terminal 1)**

```bash
cd c:\Users\sarvn\OneDrive\Desktop\ums\backend

# Install dependencies (first time only)
npm install

# Create admin account
node seedAdmin.js

# You'll see:
# ✅ Admin account created successfully!
# Email: admin@erp.com
# Password: Admin@123

# Start backend server
npm run dev

# Backend should be running on port 5000
```

✅ **Keep this terminal open**

---

## **Step 3: Setup Frontend (Terminal 2)**

```bash
cd c:\Users\sarvn\OneDrive\Desktop\ums\frontend

# Install dependencies (first time only)
npm install

# Start frontend server
npm start

# Frontend should open automatically on http://localhost:3000
```

✅ **Keep this terminal open**

---

## **Step 4: Add Test Admissions (Terminal 3)**

In a new terminal, run:

```bash
cd c:\Users\sarvn\OneDrive\Desktop\ums\backend

node fixDatabase.js

# You'll see:
# ✅ Database fixed with test admissions!
# 
# 📱 Test Applications:
# 1. rahul.sharma@example.com
# 2. priya.singh@example.com
```

---

## **Step 5: Login as Admin**

1. **Go to:** `http://localhost:3000/login`
2. **Click the "Admin" tab** (3rd tab)
3. **Enter credentials:**
   ```
   Email: admin@erp.com
   Password: Admin@123
   ```
4. **Click "Login"**

---

## **Step 6: View Pending Applications**

After login:

1. You'll see the **Admin Dashboard**
2. At the top, you'll see **4 stat cards:**
   ```
   📋 Total Applications: 2
   ⏳ Pending: 2
   ✅ Approved: 0
   ❌ Rejected: 0
   ```

3. Click the **"Admissions"** tab (it's already selected)
4. **You'll see the table with 2 pending applications:**
   ```
   Name              | Email                      | Phone      | Status
   Rahul Sharma      | rahul.sharma@example.com   | 9876543210 | ⏳ PENDING
   Priya Singh       | priya.singh@example.com    | 9876543220 | ⏳ PENDING
   ```

---

## **Step 7: Approve an Application**

### **Option A: Quick Approve (Direct Button)**
1. In the table row, click the **"Approve"** button
2. ✅ Application approved! Student can now login

### **Option B: View Details First**
1. Click **"View"** button on a row
2. See all student details in a modal
3. Click **"Approve"** button inside modal
4. ✅ Done!

---

## **Step 8: Reject an Application**

1. Click **"Reject"** button on a row
2. A confirmation dialog appears asking for rejection reason
3. Type reason (e.g., "Does not meet eligibility criteria")
4. Click **"OK"**
5. ❌ Application rejected!

---

## **Step 9: Student Login After Approval**

After approving an application:

1. Go to: `http://localhost:3000/login`
2. Click **"Student"** tab
3. Enter approved student email and password
4. Access the **Student Dashboard**

---

## **📋 Complete Workflow Summary**

```
┌─────────────────────────────────────────┐
│ 1. START SERVERS (2 terminals)          │
│    Terminal 1: npm run dev (backend)    │
│    Terminal 2: npm start (frontend)     │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ 2. CREATE TEST DATA (Terminal 3)        │
│    node fixDatabase.js                  │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ 3. LOGIN AS ADMIN                       │
│    http://localhost:3000/login          │
│    Email: admin@erp.com                 │
│    Password: Admin@123                  │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ 4. VIEW ADMISSIONS                      │
│    Dashboard → Admissions tab           │
│    See pending applications             │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ 5. APPROVE/REJECT APPLICATIONS          │
│    Click Approve or Reject button       │
│    Student account auto-created         │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ 6. STUDENT LOGIN                        │
│    Use approved credentials             │
│    Access dashboard                     │
└─────────────────────────────────────────┘
```

---

## **🐛 Troubleshooting**

### ❌ "Cannot GET /api/health"
**Problem:** Backend not running  
**Solution:** Run `npm run dev` in backend terminal

### ❌ "Cannot find module"
**Problem:** Dependencies not installed  
**Solution:** Run `npm install` in that folder

### ❌ "Cannot connect to MongoDB"
**Problem:** MongoDB not running  
**Solution:** Start MongoDB service

### ❌ "No admissions showing"
**Problem:** Test data not created  
**Solution:** Run `node fixDatabase.js` in backend folder

### ❌ "Invalid credentials"
**Problem:** Wrong email/password  
**Solution:** Use exactly:
- Email: `admin@erp.com`
- Password: `Admin@123`

### ❌ "Button click does nothing"
**Problem:** Frontend cache issue  
**Solution:** Clear cache (Ctrl+Shift+Delete) or use Incognito mode

---

## **✅ Final Checklist**

Before you start, make sure:

- [ ] MongoDB is running
- [ ] Backend installed (`npm install` in `/backend`)
- [ ] Frontend installed (`npm install` in `/frontend`)
- [ ] Backend starts without errors (`npm run dev`)
- [ ] Frontend opens in browser (`npm start`)
- [ ] Admin account created (`node seedAdmin.js`)
- [ ] Test data loaded (`node fixDatabase.js`)

---

## **🎯 Quick Commands Reference**

```bash
# Backend setup
cd backend && npm install && node seedAdmin.js && npm run dev

# Frontend setup
cd frontend && npm install && npm start

# Add test data
cd backend && node fixDatabase.js

# Check database
cd backend && node checkAdmissions.js

# Fix all issues
cd backend && node fixDatabase.js
```

---

## **🔗 Important URLs**

| Page | URL | Default Credentials |
|------|-----|---------------------|
| Frontend | http://localhost:3000 | - |
| Admin Login | http://localhost:3000/login | admin@erp.com / Admin@123 |
| Admission Form | http://localhost:3000/admission | Any email |
| Backend API | http://localhost:5000 | - |
| Health Check | http://localhost:5000/api/health | - |

---

## **💡 Tips**

✅ Always keep both backend and frontend servers running  
✅ Use incognito mode if you see cached data  
✅ Check browser console (F12) for any errors  
✅ Check terminal for backend errors  
✅ Restart both servers if data doesn't update  

---

Last Updated: 2025-01-26
