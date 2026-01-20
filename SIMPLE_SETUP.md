# Simple Admin Setup - 3 Easy Steps

Get yourself set up as an admin and start testing in 5 minutes.

---

## Step 1: Run the Simple Setup Script (1 minute)

1. **Go to Supabase SQL Editor:**
   👉 https://supabase.com/dashboard/project/nhxyazfdliwxqzmmhgga/sql/new

2. **Open** `supabase/simple_admin_setup.sql` in your code editor

3. **Copy ALL the contents** and paste into the SQL Editor

4. **Click "RUN"** ▶️

✅ This creates:
- 1 test building (Perth Central Tower)
- Storage bucket for documents
- Security policies

---

## Step 2: Create YOUR Admin User (2 minutes)

1. **Go to Supabase Authentication:**
   👉 https://supabase.com/dashboard/project/nhxyazfdliwxqzmmhgga/auth/users

2. **Click "Add User"**

3. **Fill in YOUR details:**
   - Email: (use your real email, like `yourname@mps.com.au`)
   - Password: (choose a password you'll remember)
   - ✅ **CHECK "Auto Confirm User"** ← Very important!

4. **Click "Create User"**

5. **Copy the User ID** (the UUID that appears)

---

## Step 3: Make Yourself Admin (1 minute)

1. **Go back to SQL Editor:**
   👉 https://supabase.com/dashboard/project/nhxyazfdliwxqzmmhgga/sql/new

2. **Paste this SQL** (replace `YOUR_UUID_HERE` with the UUID you copied):

```sql
-- Make yourself admin
INSERT INTO public.user_roles (user_id, role, region)
VALUES ('YOUR_UUID_HERE'::uuid, 'admin', NULL);

INSERT INTO public.profiles (user_id, full_name, email, buildings, region)
VALUES ('YOUR_UUID_HERE'::uuid, 'Admin', 'your-email@mps.com.au', ARRAY[]::uuid[], NULL);
```

3. **Click "RUN"** ▶️

---

## 🎉 Done! Now Test It

### Start your app:
```bash
npm run dev
```

### Login with your email and password

### You Should See:
- ✅ Perth Central Tower in the building selector
- ✅ Documents page with "Upload Documents" button
- ✅ Users page (where you can create other users)
- ✅ Reports page

---

## 📤 Test Your Admin User Story

Now test the admin workflow:

### 1. Upload a Document
- Go to **Documents** page
- Click **"Upload Documents"**
- Select **Perth Central Tower**
- Choose **O&M Manual** as type
- Upload a PDF file
- ✅ Should upload successfully!

### 2. Create a New User
- Go to **Users** page
- Click **"Add User"**
- Fill in details:
  - Name: Test User
  - Email: test@example.com
  - Role: Client
  - Buildings: Perth Central Tower
- ✅ User should be created

### 3. View Reports
- Go to **Reports** page
- ✅ Should see dashboard with metrics

---

## ✅ Success Criteria

After completing these steps, you should be able to:
- ✅ Login as admin
- ✅ See Perth Central Tower building
- ✅ Upload documents
- ✅ Create users via the Users page
- ✅ Assign roles and buildings
- ✅ View reports

---

## 🐛 Troubleshooting

**"Login failed"**
- Did you check "Auto Confirm User"?
- Is the email/password correct?

**"No buildings found"**
- Re-run `simple_admin_setup.sql`

**"Upload failed"**
- Check browser console (F12) for errors
- Verify storage bucket was created

**"Invalid UUID syntax"**
- You didn't replace `YOUR_UUID_HERE` with your actual user ID
- Go back to Auth > Users and copy the ID again

---

## What's Next?

Once you can login as admin and test the user story, we can:
1. Add more buildings if needed
2. Create additional test users
3. Start working on the AI/RAG backend

**Much simpler!** Just focus on getting yourself logged in as admin first. 🚀
