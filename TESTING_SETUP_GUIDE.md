# BMAI Frontend Testing Setup Guide

This guide will help you set up test data to test the frontend with different user roles and document uploads.

## 🎯 What You Can Test After Setup

- ✅ Role-based authentication (Admin, Technician, Client)
- ✅ Building access filtering by role
- ✅ Document upload to Supabase Storage
- ✅ Real-time document management
- ✅ Multi-tenant building selection

---

## Step 1: Apply Database Migration

The storage bucket migration needs to be applied to enable document uploads.

### Option A: Supabase Dashboard (Recommended)

1. Go to: https://supabase.com/dashboard/project/nhxyazfdliwxqzmmhgga/sql/new
2. Open the file: `supabase/migrations/20260120140000_setup_storage_bucket.sql`
3. Copy the entire contents
4. Paste into the SQL Editor
5. Click **"Run"**
6. Verify success message

### Option B: Supabase CLI

```bash
npx supabase db push
```

---

## Step 2: Create Test Buildings

1. Go to: https://supabase.com/dashboard/project/nhxyazfdliwxqzmmhgga/sql/new
2. Open the file: `supabase/seed.sql`
3. Copy ONLY the buildings section (lines with INSERT INTO buildings)
4. Paste into the SQL Editor
5. Click **"Run"**

This creates 4 test buildings:
- **Perth Central Tower** (WA region)
- **Sydney Harbour Building** (NSW region)
- **Melbourne Innovation Hub** (VIC region)
- **Fremantle Business Park** (WA region)

---

## Step 3: Create Test Users

### Go to Supabase Dashboard > Authentication > Users > "Add User"

Create these 5 test users:

#### 1. Admin User
- **Email**: `admin@mps.com.au`
- **Password**: `TestAdmin123!`
- **Auto Confirm**: ✅ Yes
- ❗ **Copy the User ID** after creation

#### 2. WA Technician
- **Email**: `tech.wa@mps.com.au`
- **Password**: `TestTech123!`
- **Auto Confirm**: ✅ Yes
- ❗ **Copy the User ID** after creation

#### 3. NSW Technician
- **Email**: `tech.nsw@mps.com.au`
- **Password**: `TestTech123!`
- **Auto Confirm**: ✅ Yes
- ❗ **Copy the User ID** after creation

#### 4. Perth Client (Facilities Manager)
- **Email**: `client.perth@company.com.au`
- **Password**: `TestClient123!`
- **Auto Confirm**: ✅ Yes
- ❗ **Copy the User ID** after creation

#### 5. Sydney Client (Facilities Manager)
- **Email**: `client.sydney@company.com.au`
- **Password**: `TestClient123!`
- **Auto Confirm**: ✅ Yes
- ❗ **Copy the User ID** after creation

---

## Step 4: Assign Roles and Building Access

Now you need to run SQL to assign roles and building access to each user.

### Go to: SQL Editor in Supabase Dashboard

Run the following SQL, **replacing the placeholder UUIDs** with the actual User IDs you copied:

```sql
-- ADMIN USER
-- Replace 'YOUR_ADMIN_USER_ID_HERE' with the actual UUID
INSERT INTO public.user_roles (user_id, role, region)
VALUES ('YOUR_ADMIN_USER_ID_HERE'::uuid, 'admin', NULL);

INSERT INTO public.profiles (user_id, full_name, email, buildings, region)
VALUES ('YOUR_ADMIN_USER_ID_HERE'::uuid, 'Admin User', 'admin@mps.com.au', ARRAY[]::uuid[], NULL);

-- WA TECHNICIAN
-- Replace 'YOUR_WA_TECH_USER_ID_HERE' with the actual UUID
INSERT INTO public.user_roles (user_id, role, region)
VALUES ('YOUR_WA_TECH_USER_ID_HERE'::uuid, 'tech', 'WA');

INSERT INTO public.profiles (user_id, full_name, email, buildings, region)
VALUES ('YOUR_WA_TECH_USER_ID_HERE'::uuid, 'WA Technician', 'tech.wa@mps.com.au', ARRAY[]::uuid[], 'WA');

UPDATE public.buildings
SET tech_user_ids = ARRAY['YOUR_WA_TECH_USER_ID_HERE'::uuid]
WHERE region = 'WA';

-- NSW TECHNICIAN
-- Replace 'YOUR_NSW_TECH_USER_ID_HERE' with the actual UUID
INSERT INTO public.user_roles (user_id, role, region)
VALUES ('YOUR_NSW_TECH_USER_ID_HERE'::uuid, 'tech', 'NSW');

INSERT INTO public.profiles (user_id, full_name, email, buildings, region)
VALUES ('YOUR_NSW_TECH_USER_ID_HERE'::uuid, 'NSW Technician', 'tech.nsw@mps.com.au', ARRAY[]::uuid[], 'NSW');

UPDATE public.buildings
SET tech_user_ids = ARRAY['YOUR_NSW_TECH_USER_ID_HERE'::uuid]
WHERE region = 'NSW';

-- PERTH CLIENT
-- Replace 'YOUR_PERTH_CLIENT_USER_ID_HERE' with the actual UUID
INSERT INTO public.user_roles (user_id, role, region)
VALUES ('YOUR_PERTH_CLIENT_USER_ID_HERE'::uuid, 'client', NULL);

INSERT INTO public.profiles (user_id, full_name, email, buildings, region)
VALUES (
  'YOUR_PERTH_CLIENT_USER_ID_HERE'::uuid,
  'Perth FM',
  'client.perth@company.com.au',
  ARRAY['11111111-1111-1111-1111-111111111111'::uuid]::uuid[],
  NULL
);

UPDATE public.buildings
SET client_user_ids = ARRAY['YOUR_PERTH_CLIENT_USER_ID_HERE'::uuid]
WHERE building_id = '11111111-1111-1111-1111-111111111111';

-- SYDNEY CLIENT
-- Replace 'YOUR_SYDNEY_CLIENT_USER_ID_HERE' with the actual UUID
INSERT INTO public.user_roles (user_id, role, region)
VALUES ('YOUR_SYDNEY_CLIENT_USER_ID_HERE'::uuid, 'client', NULL);

INSERT INTO public.profiles (user_id, full_name, email, buildings, region)
VALUES (
  'YOUR_SYDNEY_CLIENT_USER_ID_HERE'::uuid,
  'Sydney FM',
  'client.sydney@company.com.au',
  ARRAY['22222222-2222-2222-2222-222222222222'::uuid]::uuid[],
  NULL
);

UPDATE public.buildings
SET client_user_ids = ARRAY['YOUR_SYDNEY_CLIENT_USER_ID_HERE'::uuid]
WHERE building_id = '22222222-2222-2222-2222-222222222222';
```

---

## Step 5: Test the Application

### Start the dev server:
```bash
npm run dev
```

### Test Each User Role:

#### 🔴 **Admin User** (`admin@mps.com.au`)
**Expected Behavior:**
- ✅ Can see **ALL 4 buildings** in building selector
- ✅ Can upload documents to any building
- ✅ Can access Users page
- ✅ Can access Reports page
- ✅ Upload button visible on Documents page

#### 🔧 **WA Technician** (`tech.wa@mps.com.au`)
**Expected Behavior:**
- ✅ Can see **2 WA buildings** only (Perth Central Tower, Fremantle Business Park)
- ❌ Cannot see NSW/VIC buildings
- ❌ No access to Users page
- ❌ No access to Reports page
- ❌ No upload button on Documents page

#### 🔧 **NSW Technician** (`tech.nsw@mps.com.au`)
**Expected Behavior:**
- ✅ Can see **1 NSW building** only (Sydney Harbour Building)
- ❌ Cannot see WA/VIC buildings
- ❌ No access to Users/Reports pages
- ❌ No upload button

#### 👤 **Perth Client** (`client.perth@company.com.au`)
**Expected Behavior:**
- ✅ Can see **1 building** only (Perth Central Tower)
- ❌ Cannot see other buildings
- ❌ No access to Users/Reports pages
- ❌ No upload button
- ✅ Can view documents for their building
- ✅ Can chat about their building

#### 👤 **Sydney Client** (`client.sydney@company.com.au`)
**Expected Behavior:**
- ✅ Can see **1 building** only (Sydney Harbour Building)
- ❌ Cannot see other buildings
- ❌ No access to Users/Reports pages
- ❌ No upload button

---

## Step 6: Test Document Upload

### Log in as Admin:
1. Go to **Documents** page
2. Click **"Upload Documents"**
3. Select building: **Perth Central Tower**
4. Choose document type: **O&M Manual**
5. Drag & drop a PDF file (or click to browse)
6. Click **"Upload"**
7. ✅ File should upload to Supabase Storage
8. ✅ Document should appear in the list immediately
9. ✅ Document count in sidebar should increment

### Verify Building Isolation:
1. Log in as **Perth Client** (`client.perth@company.com.au`)
2. Go to **Documents** page
3. ✅ You should see the uploaded document
4. Log in as **Sydney Client** (`client.sydney@company.com.au`)
5. Go to **Documents** page
6. ❌ You should NOT see the Perth document (empty list)

---

## 🎉 Success Criteria

After completing all steps, you should be able to:

- ✅ Log in as 5 different users
- ✅ See different buildings based on role
- ✅ Upload documents as Admin
- ✅ View documents scoped to accessible buildings
- ✅ Verify role-based UI (Admin sees extra pages)
- ✅ Test multi-tenant data isolation

---

## 🐛 Troubleshooting

### "No buildings found"
- Check that you ran the buildings INSERT statements
- Verify buildings exist in Supabase > Database > buildings table

### "User has no role"
- Check that user_roles INSERT completed successfully
- Verify in Supabase > Database > user_roles table

### "Cannot upload documents"
- Verify storage bucket migration was applied
- Check Supabase > Storage > manuals bucket exists
- Check browser console for errors

### "Upload fails with permission error"
- Verify RLS policies were created for storage.objects
- Check user has admin role assigned
- Verify building_id exists in buildings table

---

## Next Steps

Once the frontend is working with role-based access and document uploads, we can move on to:

1. Implementing the AI/RAG backend (Claude integration)
2. Document processing pipeline (PDF → embeddings)
3. Real chat functionality with document retrieval
4. Service request workflow
5. Email notifications

Let me know when you're ready to proceed!
