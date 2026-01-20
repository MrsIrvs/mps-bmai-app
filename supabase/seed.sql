-- Seed data for testing BMAI application
-- This script creates test users, buildings, and assigns proper access

-- ============================================================================
-- TEST BUILDINGS
-- ============================================================================

INSERT INTO public.buildings (building_id, building_name, address, region, status, notes)
VALUES
  (
    '11111111-1111-1111-1111-111111111111'::uuid,
    'Perth Central Tower',
    '123 St Georges Terrace, Perth WA 6000',
    'WA',
    'active',
    'Main office tower in Perth CBD'
  ),
  (
    '22222222-2222-2222-2222-222222222222'::uuid,
    'Sydney Harbour Building',
    '456 Pitt Street, Sydney NSW 2000',
    'NSW',
    'active',
    'Commercial building in Sydney CBD'
  ),
  (
    '33333333-3333-3333-3333-333333333333'::uuid,
    'Melbourne Innovation Hub',
    '789 Collins Street, Melbourne VIC 3000',
    'VIC',
    'active',
    'Modern tech hub in Melbourne'
  ),
  (
    '44444444-4444-4444-4444-444444444444'::uuid,
    'Fremantle Business Park',
    '100 Marine Terrace, Fremantle WA 6160',
    'WA',
    'active',
    'Business park in Fremantle'
  )
ON CONFLICT (building_id) DO NOTHING;

-- ============================================================================
-- NOTES FOR CREATING TEST USERS
-- ============================================================================

-- Users must be created through Supabase Auth, then profiles/roles assigned
-- You can create users in the Supabase Dashboard > Authentication > Users

-- TEST USERS TO CREATE:
-- 1. Admin User
--    Email: admin@mps.com.au
--    Password: TestAdmin123!
--    Full Name: Admin User

-- 2. WA Technician
--    Email: tech.wa@mps.com.au
--    Password: TestTech123!
--    Full Name: WA Technician

-- 3. NSW Technician
--    Email: tech.nsw@mps.com.au
--    Password: TestTech123!
--    Full Name: NSW Technician

-- 4. Perth Client (Facilities Manager)
--    Email: client.perth@company.com.au
--    Password: TestClient123!
--    Full Name: Perth FM

-- 5. Sydney Client (Facilities Manager)
--    Email: client.sydney@company.com.au
--    Password: TestClient123!
--    Full Name: Sydney FM

-- ============================================================================
-- AFTER CREATING USERS IN SUPABASE AUTH, RUN THESE INSERTS
-- ============================================================================

-- NOTE: Replace the UUIDs below with actual user IDs from auth.users after creation

-- Example for when users are created:
-- Replace 'ADMIN_USER_ID', 'WA_TECH_ID', etc. with actual UUIDs

/*
-- Admin user role
INSERT INTO public.user_roles (user_id, role, region)
VALUES ('ADMIN_USER_ID'::uuid, 'admin', NULL);

-- Admin profile
INSERT INTO public.profiles (user_id, full_name, email, buildings, region)
VALUES ('ADMIN_USER_ID'::uuid, 'Admin User', 'admin@mps.com.au', ARRAY[]::uuid[], NULL);

-- WA Technician role
INSERT INTO public.user_roles (user_id, role, region)
VALUES ('WA_TECH_ID'::uuid, 'tech', 'WA');

-- WA Technician profile
INSERT INTO public.profiles (user_id, full_name, email, buildings, region)
VALUES ('WA_TECH_ID'::uuid, 'WA Technician', 'tech.wa@mps.com.au', ARRAY[]::uuid[], 'WA');

-- Update buildings to include WA tech user_id
UPDATE public.buildings
SET tech_user_ids = ARRAY['WA_TECH_ID'::uuid]
WHERE region = 'WA';

-- NSW Technician role
INSERT INTO public.user_roles (user_id, role, region)
VALUES ('NSW_TECH_ID'::uuid, 'tech', 'NSW');

-- NSW Technician profile
INSERT INTO public.profiles (user_id, full_name, email, buildings, region)
VALUES ('NSW_TECH_ID'::uuid, 'NSW Technician', 'tech.nsw@mps.com.au', ARRAY[]::uuid[], 'NSW');

-- Update buildings to include NSW tech user_id
UPDATE public.buildings
SET tech_user_ids = ARRAY['NSW_TECH_ID'::uuid]
WHERE region = 'NSW';

-- Perth Client role
INSERT INTO public.user_roles (user_id, role, region)
VALUES ('PERTH_CLIENT_ID'::uuid, 'client', NULL);

-- Perth Client profile
INSERT INTO public.profiles (user_id, full_name, email, buildings, region)
VALUES (
  'PERTH_CLIENT_ID'::uuid,
  'Perth FM',
  'client.perth@company.com.au',
  ARRAY['11111111-1111-1111-1111-111111111111'::uuid]::uuid[],
  NULL
);

-- Update Perth building to include client
UPDATE public.buildings
SET client_user_ids = ARRAY['PERTH_CLIENT_ID'::uuid]
WHERE building_id = '11111111-1111-1111-1111-111111111111';

-- Sydney Client role
INSERT INTO public.user_roles (user_id, role, region)
VALUES ('SYDNEY_CLIENT_ID'::uuid, 'client', NULL);

-- Sydney Client profile
INSERT INTO public.profiles (user_id, full_name, email, buildings, region)
VALUES (
  'SYDNEY_CLIENT_ID'::uuid,
  'Sydney FM',
  'client.sydney@company.com.au',
  ARRAY['22222222-2222-2222-2222-222222222222'::uuid]::uuid[],
  NULL
);

-- Update Sydney building to include client
UPDATE public.buildings
SET client_user_ids = ARRAY['SYDNEY_CLIENT_ID'::uuid]
WHERE building_id = '22222222-2222-2222-2222-222222222222';
*/

-- ============================================================================
-- SIMPLIFIED MANUAL SETUP GUIDE
-- ============================================================================

-- STEP 1: Go to Supabase Dashboard > Authentication > Users > Add User
-- Create 5 users with the emails and passwords listed above
-- Note down their User IDs

-- STEP 2: Run the INSERT statements above after replacing the placeholder IDs
-- with actual UUIDs from the created users

-- STEP 3: Test login with each user to verify:
-- - Admin sees all 4 buildings
-- - WA Tech sees 2 WA buildings (Perth Central, Fremantle)
-- - NSW Tech sees 1 NSW building (Sydney Harbour)
-- - Perth Client sees only Perth Central Tower
-- - Sydney Client sees only Sydney Harbour Building
