-- ============================================================================
-- SIMPLE ADMIN SETUP - Just Get Started!
-- ============================================================================
-- This creates ONE admin user so you can start testing immediately
-- ============================================================================

-- STEP 1: Create ONE test building (Perth Central Tower)
INSERT INTO public.buildings (building_id, building_name, address, region, status, notes)
VALUES (
  '11111111-1111-1111-1111-111111111111'::uuid,
  'Perth Central Tower',
  '123 St Georges Terrace, Perth WA 6000',
  'WA',
  'active',
  'Test building for admin'
)
ON CONFLICT (building_id) DO NOTHING;

-- STEP 2: Create storage bucket for document uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'manuals',
  'manuals',
  true,
  52428800, -- 50MB limit
  ARRAY['application/pdf']::text[]
)
ON CONFLICT (id) DO NOTHING;

-- STEP 3: Enable storage security
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Allow admins to upload/view documents
DROP POLICY IF EXISTS "Admins can manage manuals" ON storage.objects;
CREATE POLICY "Admins can manage manuals"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'manuals' AND has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'manuals' AND has_role(auth.uid(), 'admin'));

-- Allow admins to manage manuals table
DROP POLICY IF EXISTS "Admins can manage manuals table" ON public.manuals;
CREATE POLICY "Admins can manage manuals table"
ON public.manuals FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- ============================================================================
-- SUCCESS! Now go create your admin user in Supabase Dashboard
-- ============================================================================
