-- Vector Search Functions for O&M Manuals
-- Imported from mpsapp repository

-- =============================================================================
-- SEMANTIC SEARCH FUNCTION
-- Search manual content using vector similarity
-- =============================================================================

CREATE OR REPLACE FUNCTION public.search_manual_content(
  query_embedding VECTOR(1536),
  target_building_id UUID,
  target_equipment_type TEXT DEFAULT NULL,
  similarity_threshold FLOAT DEFAULT 0.7,
  max_results INT DEFAULT 10
)
RETURNS TABLE (
  content_id UUID,
  section_id UUID,
  manual_id UUID,
  manual_name TEXT,
  section_title TEXT,
  section_number TEXT,
  full_path TEXT,
  content_text TEXT,
  page_number INT,
  similarity_score FLOAT,
  manufacturer TEXT,
  model_number TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    mc.id AS content_id,
    mc.section_id,
    m.id AS manual_id,
    m.name AS manual_name,
    ms.section_title,
    ms.section_number,
    ms.full_path,
    mc.content_text,
    mc.page_number,
    1 - (mc.embedding <=> query_embedding) AS similarity_score,
    m.manufacturer,
    m.model_number
  FROM public.manual_content mc
  JOIN public.manual_sections ms ON mc.section_id = ms.id
  JOIN public.manuals m ON ms.manual_id = m.id
  WHERE
    m.building_id = target_building_id
    AND m.is_active = true
    AND m.processing_status = 'completed'
    AND (target_equipment_type IS NULL OR m.equipment_type = target_equipment_type)
    AND (1 - (mc.embedding <=> query_embedding)) > similarity_threshold
  ORDER BY mc.embedding <=> query_embedding
  LIMIT max_results;
END;
$$ LANGUAGE plpgsql STABLE;

-- =============================================================================
-- KEYWORD SEARCH FUNCTION
-- Search manual content using full-text search
-- =============================================================================

CREATE OR REPLACE FUNCTION public.search_manual_content_keyword(
  search_query TEXT,
  target_building_id UUID,
  target_equipment_type TEXT DEFAULT NULL,
  max_results INT DEFAULT 10
)
RETURNS TABLE (
  content_id UUID,
  section_id UUID,
  manual_id UUID,
  manual_name TEXT,
  section_title TEXT,
  section_number TEXT,
  full_path TEXT,
  content_text TEXT,
  page_number INT,
  rank FLOAT,
  manufacturer TEXT,
  model_number TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    mc.id AS content_id,
    mc.section_id,
    m.id AS manual_id,
    m.name AS manual_name,
    ms.section_title,
    ms.section_number,
    ms.full_path,
    mc.content_text,
    mc.page_number,
    ts_rank(to_tsvector('english', mc.content_text), plainto_tsquery('english', search_query)) AS rank,
    m.manufacturer,
    m.model_number
  FROM public.manual_content mc
  JOIN public.manual_sections ms ON mc.section_id = ms.id
  JOIN public.manuals m ON ms.manual_id = m.id
  WHERE
    m.building_id = target_building_id
    AND m.is_active = true
    AND m.processing_status = 'completed'
    AND (target_equipment_type IS NULL OR m.equipment_type = target_equipment_type)
    AND to_tsvector('english', mc.content_text) @@ plainto_tsquery('english', search_query)
  ORDER BY rank DESC
  LIMIT max_results;
END;
$$ LANGUAGE plpgsql STABLE;

-- =============================================================================
-- STATS VIEW
-- Quick overview of manual processing status
-- =============================================================================

CREATE OR REPLACE VIEW public.manual_ingestion_stats AS
SELECT
  m.id AS manual_id,
  m.name AS manual_name,
  m.manufacturer,
  m.equipment_type,
  m.processing_status,
  m.total_pages,
  COUNT(DISTINCT ms.id) AS section_count,
  COUNT(DISTINCT mc.id) AS content_chunk_count,
  COUNT(DISTINCT mc.id) FILTER (WHERE mc.embedding IS NOT NULL) AS embedded_chunk_count,
  COUNT(DISTINCT mi.id) AS image_count,
  m.created_at,
  m.updated_at
FROM public.manuals m
LEFT JOIN public.manual_sections ms ON m.id = ms.manual_id
LEFT JOIN public.manual_content mc ON ms.id = mc.section_id
LEFT JOIN public.manual_images mi ON ms.id = mi.section_id
GROUP BY m.id;

-- =============================================================================
-- COMMENTS
-- =============================================================================

COMMENT ON FUNCTION public.search_manual_content IS 'Semantic search using vector similarity (cosine distance)';
COMMENT ON FUNCTION public.search_manual_content_keyword IS 'Keyword-based full-text search using PostgreSQL tsvector';
COMMENT ON VIEW public.manual_ingestion_stats IS 'Quick overview of manual processing status and content counts';
