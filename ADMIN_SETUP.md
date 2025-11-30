# 🔐 Admin Setup & Login Guide

## Step 1️⃣ Create Default Admin Account

### Option A: Automatic Setup (Recommended)

1. **Open Command Prompt/Terminal** in the backend folder
2. **Run the seed script:**
   ```bash
   cd backend
   node seedAdmin.js
   ```

3. **You'll see this output:**
   ```
   ✅ Admin account created successfully!
   
   📋 Admin Login Credentials:
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Email:    admin@erp.com
   Password: Admin@123
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   
   🔐 Change the password after first login!
   ```

### Option B: Manual MongoDB Setup

If you want to create admin directly in MongoDB:

1. Open MongoDB Compass or CLI
2. Insert a document in `admins` collection:
   ```json
   {
     "adminId": "ADM1234567890",
     "email": "admin@erp.com",
     "password": "$2a$10$...", // hashed password
     "firstName": "Super",
     "lastName": "Admin",
     "phone": "9876543210",
     "role": "superadmin",
     "department": "Administration",
     "isActive": true
   }
   ```

---

## Step 2️⃣ Admin Login

### Go to Login Page

1. Open browser → `http://localhost:3000/login`
2. You'll see **three tabs:**
   - 🎓 **Student** (default)
   - 👨‍🏫 **Teacher**
   - ⚙️ **Admin** ← Click this tab

### Enter Admin Credentials

**Credentials:**
- **Email:** `admin@erp.com`
- **Password:** `Admin@123`

**Form fields:**
```
Email: admin@erp.com
Password: Admin@123
```

4. Click **Login**

---

## Step 3️⃣ Access Admin Dashboard

After successful login, you'll see:

### Admin Dashboard Components

```
┌─────────────────────────────────┐
│    ERP System                   │
│ ─────────────────────────────── │
│ [🏠 Dashboard]                  │
│ [📋 Admission Management] ← NEW │
│ [👥 Students]                   │
│ [👨‍🏫 Teachers]                   │
│ [📚 Courses]                    │
│ [🎓 Subjects]                   │
│ [📅 Attendance]                 │
│ [💰 Fees]                       │
│ [🔓 Logout]                     │
└─────────────────────────────────┘
```

### Navigate to Admission Management

**Click on:** `Admission Management` (shown in sidebar)

---

## Step 4️⃣ Manage Student Applications

### Admission Dashboard Features

#### 📊 Statistics Cards
```
┌──────────┬──────────┬──────────┬──────────┐
│ 📋 Total │ ⏳ Pend. │ ✅ Appr. │ ❌ Rejc. │
│   Apps   │ Apps     │ Apps     │ Apps     │
│    25    │    12    │     8    │     5    │
└──────────┴──────────┴──────────┴──────────┘
```

#### 🔍 Search Bar
- Search by **student name** or **email**
- Real-time filtering

#### 📋 Application Table
```
Name          | Email              | Phone      | Batch | Status   | Date      | Action
──────────────────────────────────────────────────────────────────────────────────────
Rahul Sharma  | rahul@email.com    | 9876543210 | 2025  | Pending  | 26 Nov    | View
Priya Singh   | priya@email.com    | 9876543211 | 2025  | Approved | 25 Nov    | View
Amit Kumar    | amit@email.com     | 9876543212 | 2025  | Rejected | 24 Nov    | View
```

---

## Step 5️⃣ Review & Approve Applications

### View Application Details

1. **Click "View"** button on any application row
2. **Modal opens showing:**
   - ✏️ Personal Details (Name, Email, Phone, DOB, Gender, Blood Group)
   - 👨‍👩‍👧 Guardian Details (Father, Mother, Guardian info)
   - 🎓 Academic Details (Batch, Previous School, Board, Percentage)
   - 📄 Status (Pending/Approved/Rejected)

### Approve Application

**For Pending Applications:**

1. Click **"View"** to see full details
2. Click **"Approve"** button
3. System will:
   - ✅ Generate admission number (e.g., ADM202500123)
   - 🔐 Create login credentials
   - 💾 Create student record in database
   - 📧 Prepare for email notification (optional)

4. **Success message:** "Admission approved successfully!"

### Reject Application

**For Pending Applications:**

1. Click **"View"** to see details
2. Click **"Reject"** button
3. **Modal appears** asking for rejection reason
4. **Type reason** (e.g., "Does not meet eligibility criteria")
5. Click **"OK"** to confirm rejection
6. **Success message:** "Admission rejected successfully"

---

## Step 6️⃣ Approved Student Login

### What Happens After Approval?

**Admin approves → System creates student account with:**

- **Admission Number:** ADM202500123
- **Email:** (same as applied)
- **Temporary Password:** Auto-generated (shown to admin)

### How Student Logs In

1. Student goes to `/login` page
2. Clicks **"Student"** tab
3. Enters:
   - **Email:** (same as application)
   - **Password:** (temporary password provided by admin via email/message)
4. Logs in successfully
5. Can now access student dashboard

---

## Step 7️⃣ Troubleshooting

### ❌ "Invalid credentials" Error

**Problem:** Email/password not matching
**Solution:**
- Check spelling of email (case-insensitive)
- Verify password is exactly: `Admin@123`
- Ensure admin account is created via seedAdmin.js

### ❌ "Admin tab not showing"

**Problem:** Login page not showing admin tab
**Solution:**
- Refresh the page (Ctrl + R)
- Clear browser cache
- Try incognito mode

### ❌ Can't find "Admission Management"

**Problem:** Menu not showing admission link
**Solution:**
- Check you're logged in as admin
- Verify user role shows "admin" or "superadmin"
- Refresh the page

### ✅ "Admission approved" but no student entry

**Problem:** Student can't login after approval
**Solution:**
- Verify student database record created
- Check student email address matches exactly
- Try resetting password

---

## 📝 Quick Reference

### Admin Login Details
```
🌐 URL: http://localhost:3000/login
📧 Email: admin@erp.com
🔑 Password: Admin@123
```

### Admin Functions
| Function | Location | Steps |
|----------|----------|-------|
| View pending apps | Admission Management | Table view |
| Approve app | View modal | Click Approve button |
| Reject app | View modal | Click Reject, enter reason |
| Search students | Search bar | Type name/email |
| View statistics | Dashboard | Top 4 cards |

### What Admin Can Do
- ✅ View all student applications
- ✅ Approve pending applications
- ✅ Reject applications with reason
- ✅ Generate admission numbers
- ✅ Create student accounts
- ✅ Search and filter applications
- ✅ View application statistics

---

## 🔐 Security Tips

1. **Change default password immediately**
2. **Don't share admin credentials**
3. **Create separate accounts for each admin**
4. **Use strong passwords**
5. **Log out when done**
6. **Delete seedAdmin.js after first use** (optional)

---

## 🆘 Need Help?

**Admin Creation Issues?**
- Ensure backend is running: `npm run dev`
- Check MongoDB connection: `http://localhost:5000/api/health`

**Login Issues?**
- Clear browser cache
- Try different browser
- Check network/backend connection

**Application Not Showing?**
- Refresh page
- Check internet connection
- Verify backend API is responding

---

Created: 2025-01-26
Last Updated: 2025-01-26
