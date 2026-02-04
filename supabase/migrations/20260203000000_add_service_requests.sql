-- Migration: Add Service Requests Feature
-- Creates tables for service requests, service providers, and their assignments

-- ============================================================================
-- ENUM TYPES
-- ============================================================================

-- Equipment/service category (matches manual equipment types)
CREATE TYPE public.equipment_category AS ENUM (
  'HVAC',
  'Electrical',
  'Fire',
  'Plumbing',
  'Hydraulic',
  'Security',
  'Lift',
  'Other'
);

-- Request priority levels
CREATE TYPE public.request_priority AS ENUM ('low', 'medium', 'high');

-- Request status (matching current UI)
CREATE TYPE public.request_status AS ENUM ('pending', 'dispatched', 'in_progress', 'resolved');

-- ============================================================================
-- CREATE ALL TABLES FIRST (before RLS policies to avoid dependency issues)
-- ============================================================================

-- Service Providers Table
CREATE TABLE public.service_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Building Service Provider Assignments Table
CREATE TABLE public.building_service_provider_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  building_id UUID NOT NULL REFERENCES public.buildings(id) ON DELETE CASCADE,
  service_provider_id UUID NOT NULL REFERENCES public.service_providers(id) ON DELETE CASCADE,
  category equipment_category NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  -- One provider per category per building
  UNIQUE (building_id, category)
);

-- Service Requests Table
CREATE TABLE public.service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  building_id UUID NOT NULL REFERENCES public.buildings(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category equipment_category NOT NULL,
  priority request_priority NOT NULL DEFAULT 'medium',
  status request_status NOT NULL DEFAULT 'pending',
  location TEXT, -- Specific area within building, e.g., "Level 3, Room 301"
  due_date DATE,
  photo_urls TEXT[] DEFAULT '{}',
  notes TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================================

ALTER TABLE public.service_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.building_service_provider_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Service Providers indexes
CREATE INDEX idx_service_providers_name ON public.service_providers(name);
CREATE INDEX idx_service_providers_email ON public.service_providers(email);

-- Building Service Provider Assignments indexes
CREATE INDEX idx_bspa_building_id ON public.building_service_provider_assignments(building_id);
CREATE INDEX idx_bspa_service_provider_id ON public.building_service_provider_assignments(service_provider_id);
CREATE INDEX idx_bspa_category ON public.building_service_provider_assignments(category);

-- Service Requests indexes
CREATE INDEX idx_service_requests_building_id ON public.service_requests(building_id);
CREATE INDEX idx_service_requests_category ON public.service_requests(category);
CREATE INDEX idx_service_requests_priority ON public.service_requests(priority);
CREATE INDEX idx_service_requests_status ON public.service_requests(status);
CREATE INDEX idx_service_requests_created_by ON public.service_requests(created_by);
CREATE INDEX idx_service_requests_created_at ON public.service_requests(created_at DESC);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Trigger for service_providers updated_at
CREATE TRIGGER update_service_providers_updated_at
  BEFORE UPDATE ON public.service_providers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for service_requests updated_at
CREATE TRIGGER update_service_requests_updated_at
  BEFORE UPDATE ON public.service_requests
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

-- Clients can view providers linked to their buildings
CREATE POLICY "Clients can view providers for their buildings"
ON public.service_providers FOR SELECT
USING (
  public.has_role(auth.uid(), 'client')
  AND EXISTS (
    SELECT 1 FROM public.building_service_provider_assignments bspa
    JOIN public.buildings b ON b.id = bspa.building_id
    WHERE bspa.service_provider_id = service_providers.id
    AND (
      b.id::text = ANY(COALESCE((SELECT buildings FROM public.profiles WHERE user_id = auth.uid()), ARRAY[]::text[]))
      OR auth.uid() = ANY(b.client_user_ids)
    )
  )
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

-- Technicians can view providers for their regional buildings
CREATE POLICY "Technicians can view providers for their region"
ON public.service_providers FOR SELECT
USING (
  public.has_role(auth.uid(), 'technician')
  AND EXISTS (
    SELECT 1 FROM public.building_service_provider_assignments bspa
    JOIN public.buildings b ON b.id = bspa.building_id
    WHERE bspa.service_provider_id = service_providers.id
    AND b.region = (SELECT region FROM public.profiles WHERE user_id = auth.uid())
  )
);

-- ============================================================================
-- RLS POLICIES FOR BUILDING_SERVICE_PROVIDER_ASSIGNMENTS
-- ============================================================================

-- Admins can do everything
CREATE POLICY "Admins can view all assignments"
ON public.building_service_provider_assignments FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert assignments"
ON public.building_service_provider_assignments FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update assignments"
ON public.building_service_provider_assignments FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete assignments"
ON public.building_service_provider_assignments FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Clients can view/manage assignments for their buildings
CREATE POLICY "Clients can view assignments for their buildings"
ON public.building_service_provider_assignments FOR SELECT
USING (
  public.has_role(auth.uid(), 'client')
  AND EXISTS (
    SELECT 1 FROM public.buildings b
    WHERE b.id = building_service_provider_assignments.building_id
    AND (
      b.id::text = ANY(COALESCE((SELECT buildings FROM public.profiles WHERE user_id = auth.uid()), ARRAY[]::text[]))
      OR auth.uid() = ANY(b.client_user_ids)
    )
  )
);

CREATE POLICY "Clients can insert assignments for their buildings"
ON public.building_service_provider_assignments FOR INSERT
WITH CHECK (
  public.has_role(auth.uid(), 'client')
  AND EXISTS (
    SELECT 1 FROM public.buildings b
    WHERE b.id = building_id
    AND (
      b.id::text = ANY(COALESCE((SELECT buildings FROM public.profiles WHERE user_id = auth.uid()), ARRAY[]::text[]))
      OR auth.uid() = ANY(b.client_user_ids)
    )
  )
);

CREATE POLICY "Clients can update assignments for their buildings"
ON public.building_service_provider_assignments FOR UPDATE
USING (
  public.has_role(auth.uid(), 'client')
  AND EXISTS (
    SELECT 1 FROM public.buildings b
    WHERE b.id = building_service_provider_assignments.building_id
    AND (
      b.id::text = ANY(COALESCE((SELECT buildings FROM public.profiles WHERE user_id = auth.uid()), ARRAY[]::text[]))
      OR auth.uid() = ANY(b.client_user_ids)
    )
  )
);

CREATE POLICY "Clients can delete assignments for their buildings"
ON public.building_service_provider_assignments FOR DELETE
USING (
  public.has_role(auth.uid(), 'client')
  AND EXISTS (
    SELECT 1 FROM public.buildings b
    WHERE b.id = building_service_provider_assignments.building_id
    AND (
      b.id::text = ANY(COALESCE((SELECT buildings FROM public.profiles WHERE user_id = auth.uid()), ARRAY[]::text[]))
      OR auth.uid() = ANY(b.client_user_ids)
    )
  )
);

-- Technicians can view assignments for their regional buildings
CREATE POLICY "Technicians can view assignments for their region"
ON public.building_service_provider_assignments FOR SELECT
USING (
  public.has_role(auth.uid(), 'technician')
  AND EXISTS (
    SELECT 1 FROM public.buildings b
    WHERE b.id = building_service_provider_assignments.building_id
    AND b.region = (SELECT region FROM public.profiles WHERE user_id = auth.uid())
  )
);

-- ============================================================================
-- RLS POLICIES FOR SERVICE_REQUESTS
-- ============================================================================

-- Admins can do everything
CREATE POLICY "Admins can view all service requests"
ON public.service_requests FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert service requests"
ON public.service_requests FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update service requests"
ON public.service_requests FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete service requests"
ON public.service_requests FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Technicians can view requests for their regional buildings
CREATE POLICY "Technicians can view requests for their region"
ON public.service_requests FOR SELECT
USING (
  public.has_role(auth.uid(), 'technician')
  AND EXISTS (
    SELECT 1 FROM public.buildings b
    WHERE b.id = service_requests.building_id
    AND b.region = (SELECT region FROM public.profiles WHERE user_id = auth.uid())
  )
);

-- Technicians can update status of requests in their region
CREATE POLICY "Technicians can update requests in their region"
ON public.service_requests FOR UPDATE
USING (
  public.has_role(auth.uid(), 'technician')
  AND EXISTS (
    SELECT 1 FROM public.buildings b
    WHERE b.id = service_requests.building_id
    AND b.region = (SELECT region FROM public.profiles WHERE user_id = auth.uid())
  )
);

-- Clients can view requests for their buildings
CREATE POLICY "Clients can view requests for their buildings"
ON public.service_requests FOR SELECT
USING (
  public.has_role(auth.uid(), 'client')
  AND EXISTS (
    SELECT 1 FROM public.buildings b
    WHERE b.id = service_requests.building_id
    AND (
      b.id::text = ANY(COALESCE((SELECT buildings FROM public.profiles WHERE user_id = auth.uid()), ARRAY[]::text[]))
      OR auth.uid() = ANY(b.client_user_ids)
    )
  )
);

-- Clients can create requests for their buildings
CREATE POLICY "Clients can insert requests for their buildings"
ON public.service_requests FOR INSERT
WITH CHECK (
  public.has_role(auth.uid(), 'client')
  AND created_by = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.buildings b
    WHERE b.id = building_id
    AND (
      b.id::text = ANY(COALESCE((SELECT buildings FROM public.profiles WHERE user_id = auth.uid()), ARRAY[]::text[]))
      OR auth.uid() = ANY(b.client_user_ids)
    )
  )
);

-- Clients can update their own requests (e.g., add notes, cancel)
CREATE POLICY "Clients can update their own requests"
ON public.service_requests FOR UPDATE
USING (
  public.has_role(auth.uid(), 'client')
  AND created_by = auth.uid()
);

-- ============================================================================
-- HELPER FUNCTION: Get service provider for a building and category
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_service_provider_for_request(
  _building_id UUID,
  _category equipment_category
)
RETURNS TABLE (
  provider_id UUID,
  provider_name TEXT,
  provider_email TEXT,
  provider_phone TEXT
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
    sp.phone
  FROM public.service_providers sp
  JOIN public.building_service_provider_assignments bspa
    ON bspa.service_provider_id = sp.id
  WHERE bspa.building_id = _building_id
    AND bspa.category = _category
  LIMIT 1;
$$;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE public.service_providers IS 'Service providers that can be assigned to handle service requests';
COMMENT ON TABLE public.building_service_provider_assignments IS 'Links service providers to buildings by category';
COMMENT ON TABLE public.service_requests IS 'Service/maintenance requests submitted by clients for buildings';

COMMENT ON COLUMN public.service_requests.location IS 'Specific location within the building, e.g., Level 3, Room 301';
COMMENT ON COLUMN public.service_requests.photo_urls IS 'Array of URLs to photos uploaded to Supabase Storage';

COMMENT ON FUNCTION public.get_service_provider_for_request IS 'Returns the service provider assigned to handle a specific category for a building';
