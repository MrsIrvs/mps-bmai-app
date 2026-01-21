-- Add client_user_ids array to buildings table
ALTER TABLE public.buildings
ADD COLUMN client_user_ids UUID[] NOT NULL DEFAULT '{}'::uuid[];

-- Create index for faster lookups
CREATE INDEX idx_buildings_client_user_ids ON public.buildings USING GIN(client_user_ids);