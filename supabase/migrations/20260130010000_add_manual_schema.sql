-- O&M Manual Structured Storage Schema
-- Imported from mpsapp repository
-- Adapted for CENTRAL conventions (id vs building_id, TIMESTAMPTZ)

-- Enable pgvector extension for semantic search
CREATE EXTENSION IF NOT EXISTS vector;

-- =============================================================================
-- TABLE 1: manuals
-- Stores metadata about each O&M manual
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.manuals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  building_id UUID REFERENCES public.buildings(id) ON DELETE CASCADE,

  -- Manual identification
  name TEXT NOT NULL,
  manufacturer TEXT,
  equipment_type TEXT CHECK (equipment_type IN ('HVAC', 'Electrical', 'Fire', 'Plumbing', 'Hydraulic', 'Security', 'Lift', 'Other')),
  model_number TEXT,
  version TEXT,

  -- File information
  total_pages INT,
  file_url TEXT NOT NULL,
  file_size_bytes BIGINT,
  file_hash TEXT, -- SHA-256 for duplicate detection

  -- Processing status
  processing_status TEXT DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
  processing_notes JSONB DEFAULT '{}',

  -- Timestamps
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

  -- Metadata for search and organization
  tags TEXT[],
  is_active BOOLEAN DEFAULT true
);

-- Indexes for manuals table
CREATE INDEX IF NOT EXISTS idx_manuals_building ON public.manuals(building_id);
CREATE INDEX IF NOT EXISTS idx_manuals_equipment_type ON public.manuals(equipment_type);
CREATE INDEX IF NOT EXISTS idx_manuals_manufacturer ON public.manuals(manufacturer);
CREATE INDEX IF NOT EXISTS idx_manuals_status ON public.manuals(processing_status);
CREATE INDEX IF NOT EXISTS idx_manuals_tags ON public.manuals USING GIN(tags);

-- =============================================================================
-- TABLE 2: manual_sections
-- Stores hierarchical table of contents and section structure
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.manual_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  manual_id UUID REFERENCES public.manuals(id) ON DELETE CASCADE,
  parent_section_id UUID REFERENCES public.manual_sections(id) ON DELETE CASCADE,

  -- Section identification
  section_number TEXT,
  section_title TEXT NOT NULL,
  section_type TEXT CHECK (section_type IN ('chapter', 'section', 'subsection', 'appendix', 'index', 'glossary')),

  -- Page range
  start_page INT,
  end_page INT,

  -- Hierarchy
  depth_level INT DEFAULT 1,
  order_index INT NOT NULL,

  -- Full path for easy breadcrumb display
  full_path TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes for manual_sections table
CREATE INDEX IF NOT EXISTS idx_sections_manual ON public.manual_sections(manual_id);
CREATE INDEX IF NOT EXISTS idx_sections_parent ON public.manual_sections(parent_section_id);
CREATE INDEX IF NOT EXISTS idx_sections_order ON public.manual_sections(manual_id, order_index);
CREATE INDEX IF NOT EXISTS idx_sections_depth ON public.manual_sections(depth_level);

-- =============================================================================
-- TABLE 3: manual_content
-- Stores actual content with embeddings for semantic search
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.manual_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID REFERENCES public.manual_sections(id) ON DELETE CASCADE,

  -- Content details
  content_type TEXT CHECK (content_type IN ('text', 'table', 'procedure', 'list', 'warning', 'note')),
  content_text TEXT NOT NULL,
  content_metadata JSONB DEFAULT '{}',

  -- Location
  page_number INT,
  chunk_index INT DEFAULT 0,

  -- Semantic search
  embedding VECTOR(1536), -- OpenAI text-embedding-3-small dimension

  -- Token counts for cost tracking
  token_count INT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes for manual_content table
CREATE INDEX IF NOT EXISTS idx_content_section ON public.manual_content(section_id);
CREATE INDEX IF NOT EXISTS idx_content_page ON public.manual_content(page_number);

-- Vector index for semantic search (IVFFlat for faster approximate search)
CREATE INDEX IF NOT EXISTS idx_content_embedding ON public.manual_content
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- =============================================================================
-- TABLE 4: manual_images
-- Stores diagrams, photos, schematics extracted from manuals
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.manual_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID REFERENCES public.manual_sections(id) ON DELETE CASCADE,

  -- Image details
  image_url TEXT NOT NULL,
  image_type TEXT CHECK (image_type IN ('diagram', 'photo', 'schematic', 'table', 'chart', 'logo', 'other')),
  caption TEXT,

  -- OCR results
  ocr_text TEXT,
  ocr_confidence FLOAT,

  -- Location
  page_number INT,
  position_on_page TEXT CHECK (position_on_page IN ('top', 'middle', 'bottom', 'full-page', 'inline')),

  -- Image metadata
  width_px INT,
  height_px INT,
  file_size_bytes INT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes for manual_images table
CREATE INDEX IF NOT EXISTS idx_images_section ON public.manual_images(section_id);
CREATE INDEX IF NOT EXISTS idx_images_page ON public.manual_images(page_number);
CREATE INDEX IF NOT EXISTS idx_images_type ON public.manual_images(image_type);

-- =============================================================================
-- TABLE 5: manual_cross_references
-- Stores links between sections (e.g., "See Section 4.2")
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.manual_cross_references (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_section_id UUID REFERENCES public.manual_sections(id) ON DELETE CASCADE,
  to_section_id UUID REFERENCES public.manual_sections(id) ON DELETE CASCADE,

  -- Reference details
  reference_type TEXT CHECK (reference_type IN ('see_also', 'prerequisite', 'related_diagram', 'continuation', 'external')),
  reference_text TEXT,

  -- For external references (to other manuals or standards)
  external_reference TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes for manual_cross_references table
CREATE INDEX IF NOT EXISTS idx_refs_from ON public.manual_cross_references(from_section_id);
CREATE INDEX IF NOT EXISTS idx_refs_to ON public.manual_cross_references(to_section_id);

-- =============================================================================
-- TABLE 6: manual_search_logs
-- Track which sections are queried most (for analytics and improvement)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.manual_search_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Search context
  user_id UUID REFERENCES auth.users(id),
  building_id UUID REFERENCES public.buildings(id),
  manual_id UUID REFERENCES public.manuals(id),

  -- Search details
  search_query TEXT NOT NULL,
  search_type TEXT CHECK (search_type IN ('keyword', 'semantic', 'hybrid')),

  -- Results
  results_returned INT,
  top_section_id UUID REFERENCES public.manual_sections(id),
  relevance_score FLOAT,

  -- User feedback
  was_helpful BOOLEAN,
  user_feedback TEXT,

  searched_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes for search logs
CREATE INDEX IF NOT EXISTS idx_search_logs_manual ON public.manual_search_logs(manual_id);
CREATE INDEX IF NOT EXISTS idx_search_logs_building ON public.manual_search_logs(building_id);
CREATE INDEX IF NOT EXISTS idx_search_logs_date ON public.manual_search_logs(searched_at);

-- =============================================================================
-- TRIGGERS
-- =============================================================================

-- Trigger to auto-update updated_at on manuals table
CREATE TRIGGER update_manuals_updated_at
    BEFORE UPDATE ON public.manuals
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================================================
-- RLS POLICIES
-- =============================================================================

-- Enable RLS on all manual tables
ALTER TABLE public.manuals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manual_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manual_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manual_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manual_cross_references ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manual_search_logs ENABLE ROW LEVEL SECURITY;

-- Manuals: Users can view manuals for buildings they have access to
CREATE POLICY "Users can view manuals for accessible buildings"
ON public.manuals FOR SELECT
USING (
  building_id IN (
    SELECT id FROM public.buildings
  )
);

CREATE POLICY "Admins can manage all manuals"
ON public.manuals FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Manual sections: inherit from manuals access
CREATE POLICY "Users can view sections for accessible manuals"
ON public.manual_sections FOR SELECT
USING (
  manual_id IN (SELECT id FROM public.manuals)
);

CREATE POLICY "Admins can manage all sections"
ON public.manual_sections FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Manual content: inherit from sections access
CREATE POLICY "Users can view content for accessible sections"
ON public.manual_content FOR SELECT
USING (
  section_id IN (SELECT id FROM public.manual_sections)
);

CREATE POLICY "Admins can manage all content"
ON public.manual_content FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Manual images: inherit from sections access
CREATE POLICY "Users can view images for accessible sections"
ON public.manual_images FOR SELECT
USING (
  section_id IN (SELECT id FROM public.manual_sections)
);

CREATE POLICY "Admins can manage all images"
ON public.manual_images FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Cross references: inherit from sections access
CREATE POLICY "Users can view cross references"
ON public.manual_cross_references FOR SELECT
USING (
  from_section_id IN (SELECT id FROM public.manual_sections)
);

CREATE POLICY "Admins can manage all cross references"
ON public.manual_cross_references FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Search logs: users can view their own logs
CREATE POLICY "Users can view their own search logs"
ON public.manual_search_logs FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own search logs"
ON public.manual_search_logs FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all search logs"
ON public.manual_search_logs FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- =============================================================================
-- COMMENTS
-- =============================================================================

COMMENT ON TABLE public.manuals IS 'Stores metadata for O&M manuals';
COMMENT ON TABLE public.manual_sections IS 'Hierarchical table of contents structure';
COMMENT ON TABLE public.manual_content IS 'Actual content chunks with embeddings for semantic search';
COMMENT ON TABLE public.manual_images IS 'Extracted diagrams and images with OCR text';
COMMENT ON TABLE public.manual_cross_references IS 'Links between sections and external references';
COMMENT ON TABLE public.manual_search_logs IS 'Analytics on search queries and results';
