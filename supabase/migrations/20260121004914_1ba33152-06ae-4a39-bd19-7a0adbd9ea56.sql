-- Create buildings table
CREATE TABLE public.buildings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  region TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  notes TEXT,
  is_archived BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.buildings ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
CREATE POLICY "Admins can view all buildings"
ON public.buildings FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert buildings"
ON public.buildings FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update buildings"
ON public.buildings FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete buildings"
ON public.buildings FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Technicians can view buildings in their region (non-archived only)
CREATE POLICY "Technicians can view buildings in their region"
ON public.buildings FOR SELECT
USING (
  public.has_role(auth.uid(), 'technician')
  AND NOT is_archived
  AND region = (SELECT region FROM public.profiles WHERE user_id = auth.uid())
);

-- Clients can view their assigned buildings (non-archived only)
CREATE POLICY "Clients can view assigned buildings"
ON public.buildings FOR SELECT
USING (
  public.has_role(auth.uid(), 'client')
  AND NOT is_archived
  AND id::text = ANY(COALESCE((SELECT buildings FROM public.profiles WHERE user_id = auth.uid()), ARRAY[]::text[]))
);

-- Create trigger for updated_at
CREATE TRIGGER update_buildings_updated_at
BEFORE UPDATE ON public.buildings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for common queries
CREATE INDEX idx_buildings_region ON public.buildings(region);
CREATE INDEX idx_buildings_status ON public.buildings(status);
CREATE INDEX idx_buildings_archived ON public.buildings(is_archived);