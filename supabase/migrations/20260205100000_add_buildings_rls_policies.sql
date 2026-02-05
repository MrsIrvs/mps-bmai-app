-- Enable RLS on buildings table
ALTER TABLE public.buildings ENABLE ROW LEVEL SECURITY;

-- Admin policy: can do everything (SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY "Admins have full access to buildings"
ON public.buildings
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Technician policy: can view buildings they're assigned to via tech_user_ids array
CREATE POLICY "Technicians can view assigned buildings"
ON public.buildings
FOR SELECT
USING (
  public.has_role(auth.uid(), 'technician')
  AND auth.uid() = ANY(COALESCE(tech_user_ids, ARRAY[]::uuid[]))
);

-- Client policy: can view buildings they're assigned to via client_user_ids array
CREATE POLICY "Clients can view assigned buildings"
ON public.buildings
FOR SELECT
USING (
  public.has_role(auth.uid(), 'client')
  AND auth.uid() = ANY(COALESCE(client_user_ids, ARRAY[]::uuid[]))
);

-- Note: User-building assignments are managed via:
-- - buildings.client_user_ids[] for client users
-- - buildings.tech_user_ids[] for technician users
-- A building can have multiple users, and users can be assigned to multiple buildings
