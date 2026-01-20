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
CREATE POLICY "Authenticated users can upload manuals"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'manuals' AND
  (storage.foldername(name))[1] IN (
    -- Get building IDs the user has access to
    SELECT building_id::text
    FROM buildings b
    WHERE
      -- Admins can upload to any building
      has_role(auth.uid(), 'admin')
      OR
      -- Clients can upload to their assigned buildings
      (has_role(auth.uid(), 'client') AND auth.uid() = ANY(b.client_user_ids))
      OR
      -- Techs can upload to buildings in their region
      (has_role(auth.uid(), 'tech') AND EXISTS (
        SELECT 1 FROM user_roles ur
        WHERE ur.user_id = auth.uid() AND ur.region = b.region
      ))
  )
);

-- Policy: Users can view manuals for buildings they have access to
CREATE POLICY "Users can view manuals for accessible buildings"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'manuals' AND
  (storage.foldername(name))[1] IN (
    -- Get building IDs the user has access to
    SELECT building_id::text
    FROM buildings b
    WHERE
      -- Admins see all
      has_role(auth.uid(), 'admin')
      OR
      -- Clients see their buildings
      (has_role(auth.uid(), 'client') AND auth.uid() = ANY(b.client_user_ids))
      OR
      -- Techs see regional buildings
      (has_role(auth.uid(), 'tech') AND EXISTS (
        SELECT 1 FROM user_roles ur
        WHERE ur.user_id = auth.uid() AND ur.region = b.region
      ))
  )
);

-- Policy: Admins can delete manuals
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
