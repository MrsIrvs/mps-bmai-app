-- ============================================================================
-- BMAI TEST USERS SETUP
-- ============================================================================
-- BEFORE RUNNING THIS SCRIPT:
-- 1. Go to Supabase Dashboard > Authentication > Users > "Add User"
-- 2. Create 5 users with these credentials (Auto Confirm = YES):
--
--    Email: admin@mps.com.au             | Password: TestAdmin123!
--    Email: tech.wa@mps.com.au           | Password: TestTech123!
--    Email: tech.nsw@mps.com.au          | Password: TestTech123!
--    Email: client.perth@company.com.au  | Password: TestClient123!
--    Email: client.sydney@company.com.au | Password: TestClient123!
--
-- 3. Copy each user's UUID after creation
-- 4. Replace the placeholders below with the actual UUIDs
-- 5. Run this script
-- ============================================================================

-- ============================================================================
-- STEP 1: GET YOUR USER IDs
-- ============================================================================
-- Run this query to see all users and their IDs:

SELECT
  id as user_id,
  email,
  created_at,
  confirmed_at
FROM auth.users
ORDER BY created_at DESC;

-- Copy the UUIDs for each email and paste them below

-- ============================================================================
-- STEP 2: REPLACE PLACEHOLDERS AND RUN
-- ============================================================================

-- Admin User Setup
INSERT INTO public.user_roles (user_id, role, region)
VALUES ('PASTE_ADMIN_UUID_HERE'::uuid, 'admin', NULL)
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO public.profiles (user_id, full_name, email, buildings, region)
VALUES ('PASTE_ADMIN_UUID_HERE'::uuid, 'Admin User', 'admin@mps.com.au', ARRAY[]::uuid[], NULL)
ON CONFLICT (user_id) DO NOTHING;

-- WA Technician Setup
INSERT INTO public.user_roles (user_id, role, region)
VALUES ('PASTE_WA_TECH_UUID_HERE'::uuid, 'tech', 'WA')
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO public.profiles (user_id, full_name, email, buildings, region)
VALUES ('PASTE_WA_TECH_UUID_HERE'::uuid, 'WA Technician', 'tech.wa@mps.com.au', ARRAY[]::uuid[], 'WA')
ON CONFLICT (user_id) DO NOTHING;

UPDATE public.buildings
SET tech_user_ids = ARRAY['PASTE_WA_TECH_UUID_HERE'::uuid]
WHERE region = 'WA';

-- NSW Technician Setup
INSERT INTO public.user_roles (user_id, role, region)
VALUES ('PASTE_NSW_TECH_UUID_HERE'::uuid, 'tech', 'NSW')
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO public.profiles (user_id, full_name, email, buildings, region)
VALUES ('PASTE_NSW_TECH_UUID_HERE'::uuid, 'NSW Technician', 'tech.nsw@mps.com.au', ARRAY[]::uuid[], 'NSW')
ON CONFLICT (user_id) DO NOTHING;

UPDATE public.buildings
SET tech_user_ids = ARRAY['PASTE_NSW_TECH_UUID_HERE'::uuid]
WHERE region = 'NSW';

-- Perth Client Setup
INSERT INTO public.user_roles (user_id, role, region)
VALUES ('PASTE_PERTH_CLIENT_UUID_HERE'::uuid, 'client', NULL)
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO public.profiles (user_id, full_name, email, buildings, region)
VALUES (
  'PASTE_PERTH_CLIENT_UUID_HERE'::uuid,
  'Perth FM',
  'client.perth@company.com.au',
  ARRAY['11111111-1111-1111-1111-111111111111'::uuid]::uuid[],
  NULL
)
ON CONFLICT (user_id) DO NOTHING;

UPDATE public.buildings
SET client_user_ids = ARRAY['PASTE_PERTH_CLIENT_UUID_HERE'::uuid]
WHERE building_id = '11111111-1111-1111-1111-111111111111';

-- Sydney Client Setup
INSERT INTO public.user_roles (user_id, role, region)
VALUES ('PASTE_SYDNEY_CLIENT_UUID_HERE'::uuid, 'client', NULL)
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO public.profiles (user_id, full_name, email, buildings, region)
VALUES (
  'PASTE_SYDNEY_CLIENT_UUID_HERE'::uuid,
  'Sydney FM',
  'client.sydney@company.com.au',
  ARRAY['22222222-2222-2222-2222-222222222222'::uuid]::uuid[],
  NULL
)
ON CONFLICT (user_id) DO NOTHING;

UPDATE public.buildings
SET client_user_ids = ARRAY['PASTE_SYDNEY_CLIENT_UUID_HERE'::uuid]
WHERE building_id = '22222222-2222-2222-2222-222222222222';

-- ============================================================================
-- VERIFY SETUP
-- ============================================================================

-- Run this to verify all users are set up correctly:
SELECT
  u.email,
  ur.role,
  ur.region,
  p.full_name
FROM auth.users u
LEFT JOIN user_roles ur ON ur.user_id = u.id
LEFT JOIN profiles p ON p.user_id = u.id
WHERE u.email LIKE '%mps.com.au' OR u.email LIKE '%company.com.au'
ORDER BY ur.role, u.email;

-- You should see 5 rows with all users having roles and names assigned
