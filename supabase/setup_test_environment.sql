-- ============================================================================
-- BMAI TEST ENVIRONMENT SETUP - ONE-CLICK SCRIPT
-- ============================================================================
-- This script sets up everything needed for testing EXCEPT user creation
-- Users must be created manually via Supabase Dashboard first
-- ============================================================================

-- ============================================================================
-- PART 1: CREATE STORAGE BUCKET FOR DOCUMENT UPLOADS
-- ============================================================================

-- Create storage bucket for manuals
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'manuals',
  'manuals',
  true,
  52428800, -- 50MB limit
  ARRAY['application/pdf']::text[]
)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users can upload to their building's folder
DROP POLICY IF EXISTS "Authenticated users can upload manuals" ON storage.objects;
CREATE POLICY "Authenticated users can upload manuals"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'manuals' AND
  (storage.foldername(name))[1] IN (
    SELECT building_id::text
    FROM buildings b
    WHERE
      has_role(auth.uid(), 'admin')
      OR
      (has_role(auth.uid(), 'client') AND auth.uid() = ANY(b.client_user_ids))
      OR
      (has_role(auth.uid(), 'tech') AND EXISTS (
        SELECT 1 FROM user_roles ur
        WHERE ur.user_id = auth.uid() AND ur.region = b.region
      ))
  )
);

-- Policy: Users can view manuals for buildings they have access to
DROP POLICY IF EXISTS "Users can view manuals for accessible buildings" ON storage.objects;
CREATE POLICY "Users can view manuals for accessible buildings"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'manuals' AND
  (storage.foldername(name))[1] IN (
    SELECT building_id::text
    FROM buildings b
    WHERE
      has_role(auth.uid(), 'admin')
      OR
      (has_role(auth.uid(), 'client') AND auth.uid() = ANY(b.client_user_ids))
      OR
      (has_role(auth.uid(), 'tech') AND EXISTS (
        SELECT 1 FROM user_roles ur
        WHERE ur.user_id = auth.uid() AND ur.region = b.region
      ))
  )
);

-- Policy: Admins can delete manuals
DROP POLICY IF EXISTS "Admins can delete manuals" ON storage.objects;
CREATE POLICY "Admins can delete manuals"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'manuals' AND
  has_role(auth.uid(), 'admin')
);

-- Add RLS policies for manuals table access
DROP POLICY IF EXISTS "Users can view manuals for accessible buildings" ON public.manuals;
DROP POLICY IF EXISTS "Admins can insert manuals" ON public.manuals;
DROP POLICY IF EXISTS "Admins can update manuals" ON public.manuals;
DROP POLICY IF EXISTS "Admins can delete manuals" ON public.manuals;

CREATE POLICY "Users can view manuals for accessible buildings"
ON public.manuals FOR SELECT
TO authenticated
USING (
  building_id IN (
    SELECT building_id
    FROM buildings b
    WHERE
      has_role(auth.uid(), 'admin')
      OR
      (has_role(auth.uid(), 'client') AND auth.uid() = ANY(b.client_user_ids))
      OR
      (has_role(auth.uid(), 'tech') AND EXISTS (
        SELECT 1 FROM user_roles ur
        WHERE ur.user_id = auth.uid() AND ur.region = b.region
      ))
  )
);

CREATE POLICY "Admins can insert manuals"
ON public.manuals FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update manuals"
ON public.manuals FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete manuals"
ON public.manuals FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- ============================================================================
-- PART 2: CREATE TEST BUILDINGS
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
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Test environment setup complete!';
  RAISE NOTICE '';
  RAISE NOTICE '📋 NEXT STEPS:';
  RAISE NOTICE '1. Create test users in Supabase Dashboard > Authentication > Users';
  RAISE NOTICE '2. Run the user setup script (see setup_test_users.sql)';
  RAISE NOTICE '';
  RAISE NOTICE '📦 Created:';
  RAISE NOTICE '  - Storage bucket: manuals (with RLS policies)';
  RAISE NOTICE '  - 4 test buildings (Perth, Sydney, Melbourne, Fremantle)';
  RAISE NOTICE '  - RLS policies for manuals table';
END $$;
