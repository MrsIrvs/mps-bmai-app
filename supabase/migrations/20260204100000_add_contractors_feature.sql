-- Migration: Create Service Providers and Contractors Feature
-- Creates service_providers table and contractor_building_assignments junction table
-- Applied via Supabase MCP: create_service_providers_and_contractors

-- ============================================================================
-- CREATE SERVICE_PROVIDERS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.service_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  contact_name TEXT,
  specialties TEXT[] DEFAULT '{}',
  emergency_available BOOLEAN DEFAULT false,
  rating NUMERIC(2,1) CHECK (rating IS NULL OR (rating >= 0 AND rating <= 5)),
  notes TEXT,
  is_archived BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.service_providers ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- CREATE CONTRACTOR_BUILDING_ASSIGNMENTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.contractor_building_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contractor_id UUID NOT NULL REFERENCES public.service_providers(id) ON DELETE CASCADE,
  building_id UUID NOT NULL REFERENCES public.buildings(building_id) ON DELETE CASCADE,
  is_preferred BOOLEAN DEFAULT false,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  assigned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(contractor_id, building_id)
);

-- Enable RLS
ALTER TABLE public.contractor_building_assignments ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_service_providers_name ON public.service_providers(name);
CREATE INDEX IF NOT EXISTS idx_service_providers_email ON public.service_providers(email);
CREATE INDEX IF NOT EXISTS idx_service_providers_archived ON public.service_providers(is_archived);
CREATE INDEX IF NOT EXISTS idx_service_providers_emergency ON public.service_providers(emergency_available) WHERE emergency_available = true;
CREATE INDEX IF NOT EXISTS idx_service_providers_specialties ON public.service_providers USING GIN(specialties);

CREATE INDEX IF NOT EXISTS idx_cba_contractor_id ON public.contractor_building_assignments(contractor_id);
CREATE INDEX IF NOT EXISTS idx_cba_building_id ON public.contractor_building_assignments(building_id);
CREATE INDEX IF NOT EXISTS idx_cba_is_preferred ON public.contractor_building_assignments(is_preferred) WHERE is_preferred = true;

-- ============================================================================
-- TRIGGER FOR UPDATED_AT
-- ============================================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_service_providers_updated_at ON public.service_providers;
CREATE TRIGGER update_service_providers_updated_at
  BEFORE UPDATE ON public.service_providers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- RLS POLICIES FOR SERVICE_PROVIDERS
-- ============================================================================

-- Admins can do everything
CREATE POLICY "Admins can view all service providers"
ON public.service_providers FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert service providers"
ON public.service_providers FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update service providers"
ON public.service_providers FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete service providers"
ON public.service_providers FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Clients can view all non-archived contractors
CREATE POLICY "Clients can view all contractors"
ON public.service_providers FOR SELECT
USING (
  public.has_role(auth.uid(), 'client')
  AND is_archived = false
);

-- Clients can create new service providers
CREATE POLICY "Clients can insert service providers"
ON public.service_providers FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'client'));

-- Clients can update providers they created
CREATE POLICY "Clients can update their own service providers"
ON public.service_providers FOR UPDATE
USING (
  public.has_role(auth.uid(), 'client')
  AND created_by = auth.uid()
);

-- Technicians can view all non-archived contractors
CREATE POLICY "Technicians can view all contractors"
ON public.service_providers FOR SELECT
USING (
  public.has_role(auth.uid(), 'technician')
  AND is_archived = false
);

-- ============================================================================
-- RLS POLICIES FOR CONTRACTOR_BUILDING_ASSIGNMENTS
-- ============================================================================

-- Admins can do everything
CREATE POLICY "Admins can view all contractor assignments"
ON public.contractor_building_assignments FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert contractor assignments"
ON public.contractor_building_assignments FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update contractor assignments"
ON public.contractor_building_assignments FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete contractor assignments"
ON public.contractor_building_assignments FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Clients can view/manage assignments for their buildings
CREATE POLICY "Clients can view contractor assignments for their buildings"
ON public.contractor_building_assignments FOR SELECT
USING (
  public.has_role(auth.uid(), 'client')
  AND EXISTS (
    SELECT 1 FROM public.buildings b
    WHERE b.building_id = contractor_building_assignments.building_id
    AND auth.uid() = ANY(b.client_user_ids)
  )
);

CREATE POLICY "Clients can insert contractor assignments for their buildings"
ON public.contractor_building_assignments FOR INSERT
WITH CHECK (
  public.has_role(auth.uid(), 'client')
  AND EXISTS (
    SELECT 1 FROM public.buildings b
    WHERE b.building_id = building_id
    AND auth.uid() = ANY(b.client_user_ids)
  )
);

CREATE POLICY "Clients can update contractor assignments for their buildings"
ON public.contractor_building_assignments FOR UPDATE
USING (
  public.has_role(auth.uid(), 'client')
  AND EXISTS (
    SELECT 1 FROM public.buildings b
    WHERE b.building_id = contractor_building_assignments.building_id
    AND auth.uid() = ANY(b.client_user_ids)
  )
);

CREATE POLICY "Clients can delete contractor assignments for their buildings"
ON public.contractor_building_assignments FOR DELETE
USING (
  public.has_role(auth.uid(), 'client')
  AND EXISTS (
    SELECT 1 FROM public.buildings b
    WHERE b.building_id = contractor_building_assignments.building_id
    AND auth.uid() = ANY(b.client_user_ids)
  )
);

-- Technicians can view assignments for their regional buildings
CREATE POLICY "Technicians can view contractor assignments for their region"
ON public.contractor_building_assignments FOR SELECT
USING (
  public.has_role(auth.uid(), 'technician')
  AND EXISTS (
    SELECT 1 FROM public.buildings b
    WHERE b.building_id = contractor_building_assignments.building_id
    AND b.region = (SELECT region FROM public.user_roles WHERE user_id = auth.uid())
  )
);

-- ============================================================================
-- HELPER FUNCTION: Get contractors for a building
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_contractors_for_building(_building_id UUID)
RETURNS TABLE (
  contractor_id UUID,
  contractor_name TEXT,
  contractor_email TEXT,
  contractor_phone TEXT,
  contact_name TEXT,
  specialties TEXT[],
  emergency_available BOOLEAN,
  rating NUMERIC(2,1),
  is_preferred BOOLEAN
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    sp.id,
    sp.name,
    sp.email,
    sp.phone,
    sp.contact_name,
    sp.specialties,
    sp.emergency_available,
    sp.rating,
    cba.is_preferred
  FROM public.service_providers sp
  JOIN public.contractor_building_assignments cba
    ON cba.contractor_id = sp.id
  WHERE cba.building_id = _building_id
    AND sp.is_archived = false
  ORDER BY cba.is_preferred DESC, sp.name ASC;
$$;

GRANT EXECUTE ON FUNCTION public.get_contractors_for_building TO authenticated;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE public.service_providers IS 'Service providers/contractors that can be assigned to handle service requests';
COMMENT ON TABLE public.contractor_building_assignments IS 'Links contractors (service providers) to buildings they service';
COMMENT ON COLUMN public.service_providers.specialties IS 'Array of equipment categories the contractor specializes in';
COMMENT ON COLUMN public.service_providers.contact_name IS 'Primary contact person name at the contractor company';
COMMENT ON COLUMN public.service_providers.emergency_available IS 'Whether contractor is available for emergency calls';
COMMENT ON COLUMN public.service_providers.rating IS 'Internal rating of contractor (0-5 scale)';
COMMENT ON COLUMN public.service_providers.notes IS 'Internal notes about the contractor';
COMMENT ON COLUMN public.service_providers.is_archived IS 'Soft delete flag for archiving contractors';
COMMENT ON COLUMN public.contractor_building_assignments.is_preferred IS 'Marks the preferred contractor for a building';
COMMENT ON FUNCTION public.get_contractors_for_building IS 'Returns all contractors assigned to a building';
