-- Migration: Add RLS Policies for Service Requests
-- Enables row-level security for service_requests, service_request_photos, and service_request_comments

-- ============================================================================
-- HELPER FUNCTION: Check if user has a specific role
-- ============================================================================

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

-- Helper function to get user's region
CREATE OR REPLACE FUNCTION public.get_user_region(_user_id UUID)
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT region FROM public.user_roles WHERE user_id = _user_id LIMIT 1;
$$;

-- ============================================================================
-- ENABLE RLS ON ALL SERVICE REQUEST TABLES
-- ============================================================================

ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_request_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_request_comments ENABLE ROW LEVEL SECURITY;

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

-- Technicians can view requests for their regional buildings or assigned buildings
CREATE POLICY "Technicians can view requests for their region"
ON public.service_requests FOR SELECT
USING (
  public.has_role(auth.uid(), 'technician')
  AND EXISTS (
    SELECT 1 FROM public.buildings b
    WHERE b.building_id = service_requests.building_id
    AND (
      b.region = public.get_user_region(auth.uid())
      OR auth.uid() = ANY(b.tech_user_ids)
    )
  )
);

-- Technicians can update requests in their region (status changes, assignment, resolution)
CREATE POLICY "Technicians can update requests in their region"
ON public.service_requests FOR UPDATE
USING (
  public.has_role(auth.uid(), 'technician')
  AND EXISTS (
    SELECT 1 FROM public.buildings b
    WHERE b.building_id = service_requests.building_id
    AND (
      b.region = public.get_user_region(auth.uid())
      OR auth.uid() = ANY(b.tech_user_ids)
    )
  )
);

-- Clients can view requests for their assigned buildings
CREATE POLICY "Clients can view requests for their buildings"
ON public.service_requests FOR SELECT
USING (
  public.has_role(auth.uid(), 'client')
  AND EXISTS (
    SELECT 1 FROM public.buildings b
    WHERE b.building_id = service_requests.building_id
    AND auth.uid() = ANY(b.client_user_ids)
  )
);

-- Clients can create requests for their assigned buildings
CREATE POLICY "Clients can insert requests for their buildings"
ON public.service_requests FOR INSERT
WITH CHECK (
  public.has_role(auth.uid(), 'client')
  AND created_by_user_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.buildings b
    WHERE b.building_id = building_id
    AND auth.uid() = ANY(b.client_user_ids)
  )
);

-- Clients can update their own requests (add notes, etc.)
CREATE POLICY "Clients can update their own requests"
ON public.service_requests FOR UPDATE
USING (
  public.has_role(auth.uid(), 'client')
  AND created_by_user_id = auth.uid()
);

-- ============================================================================
-- RLS POLICIES FOR SERVICE_REQUEST_PHOTOS
-- ============================================================================

-- Admins can do everything with photos
CREATE POLICY "Admins can view all photos"
ON public.service_request_photos FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert photos"
ON public.service_request_photos FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update photos"
ON public.service_request_photos FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete photos"
ON public.service_request_photos FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Technicians can view photos for requests in their region
CREATE POLICY "Technicians can view photos for their region"
ON public.service_request_photos FOR SELECT
USING (
  public.has_role(auth.uid(), 'technician')
  AND EXISTS (
    SELECT 1 FROM public.service_requests sr
    JOIN public.buildings b ON b.building_id = sr.building_id
    WHERE sr.request_id = service_request_photos.request_id
    AND (
      b.region = public.get_user_region(auth.uid())
      OR auth.uid() = ANY(b.tech_user_ids)
    )
  )
);

-- Technicians can add photos to requests in their region
CREATE POLICY "Technicians can insert photos for their region"
ON public.service_request_photos FOR INSERT
WITH CHECK (
  public.has_role(auth.uid(), 'technician')
  AND uploaded_by_user_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.service_requests sr
    JOIN public.buildings b ON b.building_id = sr.building_id
    WHERE sr.request_id = request_id
    AND (
      b.region = public.get_user_region(auth.uid())
      OR auth.uid() = ANY(b.tech_user_ids)
    )
  )
);

-- Clients can view photos for their requests
CREATE POLICY "Clients can view photos for their buildings"
ON public.service_request_photos FOR SELECT
USING (
  public.has_role(auth.uid(), 'client')
  AND EXISTS (
    SELECT 1 FROM public.service_requests sr
    JOIN public.buildings b ON b.building_id = sr.building_id
    WHERE sr.request_id = service_request_photos.request_id
    AND auth.uid() = ANY(b.client_user_ids)
  )
);

-- Clients can add photos to their requests
CREATE POLICY "Clients can insert photos for their requests"
ON public.service_request_photos FOR INSERT
WITH CHECK (
  public.has_role(auth.uid(), 'client')
  AND uploaded_by_user_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.service_requests sr
    WHERE sr.request_id = request_id
    AND sr.created_by_user_id = auth.uid()
  )
);

-- ============================================================================
-- RLS POLICIES FOR SERVICE_REQUEST_COMMENTS
-- ============================================================================

-- Admins can do everything with comments
CREATE POLICY "Admins can view all comments"
ON public.service_request_comments FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert comments"
ON public.service_request_comments FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update comments"
ON public.service_request_comments FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete comments"
ON public.service_request_comments FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Technicians can view comments for requests in their region
CREATE POLICY "Technicians can view comments for their region"
ON public.service_request_comments FOR SELECT
USING (
  public.has_role(auth.uid(), 'technician')
  AND EXISTS (
    SELECT 1 FROM public.service_requests sr
    JOIN public.buildings b ON b.building_id = sr.building_id
    WHERE sr.request_id = service_request_comments.request_id
    AND (
      b.region = public.get_user_region(auth.uid())
      OR auth.uid() = ANY(b.tech_user_ids)
    )
  )
);

-- Technicians can add comments to requests in their region
CREATE POLICY "Technicians can insert comments for their region"
ON public.service_request_comments FOR INSERT
WITH CHECK (
  public.has_role(auth.uid(), 'technician')
  AND user_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.service_requests sr
    JOIN public.buildings b ON b.building_id = sr.building_id
    WHERE sr.request_id = request_id
    AND (
      b.region = public.get_user_region(auth.uid())
      OR auth.uid() = ANY(b.tech_user_ids)
    )
  )
);

-- Technicians can update their own comments
CREATE POLICY "Technicians can update their own comments"
ON public.service_request_comments FOR UPDATE
USING (
  public.has_role(auth.uid(), 'technician')
  AND user_id = auth.uid()
);

-- Clients can view comments for their requests
CREATE POLICY "Clients can view comments for their buildings"
ON public.service_request_comments FOR SELECT
USING (
  public.has_role(auth.uid(), 'client')
  AND EXISTS (
    SELECT 1 FROM public.service_requests sr
    JOIN public.buildings b ON b.building_id = sr.building_id
    WHERE sr.request_id = service_request_comments.request_id
    AND auth.uid() = ANY(b.client_user_ids)
  )
);

-- Clients can add comments to their requests
CREATE POLICY "Clients can insert comments for their requests"
ON public.service_request_comments FOR INSERT
WITH CHECK (
  public.has_role(auth.uid(), 'client')
  AND user_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.service_requests sr
    WHERE sr.request_id = request_id
    AND sr.created_by_user_id = auth.uid()
  )
);

-- Clients can update their own comments
CREATE POLICY "Clients can update their own comments"
ON public.service_request_comments FOR UPDATE
USING (
  public.has_role(auth.uid(), 'client')
  AND user_id = auth.uid()
);

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

GRANT EXECUTE ON FUNCTION public.has_role TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_region TO authenticated;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON FUNCTION public.has_role IS 'Checks if a user has a specific role';
COMMENT ON FUNCTION public.get_user_region IS 'Gets the region assigned to a user';
