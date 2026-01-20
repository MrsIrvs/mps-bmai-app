# 🚀 BMAI Quick Start Guide

Get your test environment up and running in 3 simple steps!

---

## Step 1: Setup Test Environment (2 minutes)

### Go to Supabase SQL Editor:
👉 https://supabase.com/dashboard/project/nhxyazfdliwxqzmmhgga/sql/new

### Run the setup script:

1. Open the file: `supabase/setup_test_environment.sql`
2. **Copy the ENTIRE contents** (Ctrl+A, Ctrl+C)
3. **Paste into SQL Editor**
4. Click **"RUN"** ▶️

✅ This creates:
- Storage bucket for document uploads
- 4 test buildings (Perth, Sydney, Melbourne, Fremantle)
- All necessary security policies

---

## Step 2: Create Test Users (3 minutes)

### Go to Supabase Authentication:
👉 https://supabase.com/dashboard/project/nhxyazfdliwxqzmmhgga/auth/users

### Click "Add User" and create 5 users:

**IMPORTANT:** Check ✅ "Auto Confirm User" for each!

| Email | Password | Role |
|-------|----------|------|
| `admin@mps.com.au` | `TestAdmin123!` | Admin |
| `tech.wa@mps.com.au` | `TestTech123!` | WA Technician |
| `tech.nsw@mps.com.au` | `TestTech123!` | NSW Technician |
| `client.perth@company.com.au` | `TestClient123!` | Perth Client |
| `client.sydney@company.com.au` | `TestClient123!` | Sydney Client |

---

## Step 3: Assign User Roles (2 minutes)

### Get User IDs:

1. **Go to SQL Editor:**
   👉 https://supabase.com/dashboard/project/nhxyazfdliwxqzmmhgga/sql/new

2. **Run this query:**
   ```sql
   SELECT id as user_id, email
   FROM auth.users
   WHERE email LIKE '%mps.com.au' OR email LIKE '%company.com.au'
   ORDER BY email;
   ```

3. **Copy the UUIDs** for each user

### Assign Roles:

1. Open the file: `supabase/setup_test_users.sql`

2. **Find and replace** the placeholders with your UUIDs:
   - `PASTE_ADMIN_UUID_HERE` → Your admin user's UUID
   - `PASTE_WA_TECH_UUID_HERE` → Your WA tech user's UUID
   - `PASTE_NSW_TECH_UUID_HERE` → Your NSW tech user's UUID
   - `PASTE_PERTH_CLIENT_UUID_HERE` → Your Perth client user's UUID
   - `PASTE_SYDNEY_CLIENT_UUID_HERE` → Your Sydney client user's UUID

3. **Copy the ENTIRE modified script**

4. **Paste into SQL Editor** and click **"RUN"** ▶️

---

## 🎉 Test Your Setup!

### Start the dev server:
```bash
npm run dev
```

### Login and test each role:

#### 🔴 Admin (`admin@mps.com.au` / `TestAdmin123!`)
Should see:
- ✅ All 4 buildings
- ✅ Upload button on Documents page
- ✅ Users page
- ✅ Reports page

#### 🔧 WA Tech (`tech.wa@mps.com.au` / `TestTech123!`)
Should see:
- ✅ Only 2 WA buildings (Perth Central, Fremantle)
- ❌ No upload button
- ❌ No Users/Reports pages

#### 🔧 NSW Tech (`tech.nsw@mps.com.au` / `TestTech123!`)
Should see:
- ✅ Only 1 NSW building (Sydney Harbour)
- ❌ No upload button
- ❌ No Users/Reports pages

#### 👤 Perth Client (`client.perth@company.com.au` / `TestClient123!`)
Should see:
- ✅ Only Perth Central Tower
- ❌ No upload button
- ❌ No Users/Reports pages

#### 👤 Sydney Client (`client.sydney@company.com.au` / `TestClient123!`)
Should see:
- ✅ Only Sydney Harbour Building
- ❌ No upload button
- ❌ No Users/Reports pages

---

## 📤 Test Document Upload

1. **Login as Admin**
2. Go to **Documents** page
3. Click **"Upload Documents"**
4. Select a building (e.g., Perth Central Tower)
5. Choose document type: **O&M Manual**
6. Upload a PDF file
7. ✅ Should upload successfully!
8. **Login as Perth Client** - you should see the document
9. **Login as Sydney Client** - should NOT see the Perth document

---

## ✅ You're Ready!

Your frontend is now fully functional with:
- ✅ Role-based authentication
- ✅ Building access control
- ✅ Real document uploads
- ✅ Multi-tenant data isolation

---

## 🐛 Troubleshooting

### "Login failed"
- Check user was created with "Auto Confirm" ✅ enabled
- Verify email/password are correct

### "No buildings found"
- Re-run `setup_test_environment.sql`
- Check buildings table in Supabase

### "Upload failed"
- Check storage bucket exists in Supabase > Storage
- Verify you're logged in as admin

### "Invalid UUID syntax"
- You forgot to replace `PASTE_XXX_UUID_HERE` with actual UUIDs
- Re-run the query to get UUIDs and update the script

---

## 📞 Need Help?

If you're stuck, check:
1. Browser console for errors (F12)
2. Supabase logs: https://supabase.com/dashboard/project/nhxyazfdliwxqzmmhgga/logs/explorer
3. Network tab to see if API calls are failing

**Next:** Once the frontend is working, we'll implement the AI/RAG backend!
