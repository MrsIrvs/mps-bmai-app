/**
 * Manual-related Type Definitions
 *
 * Types for O&M manual infrastructure imported from mpsapp repository.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Enum types
export type EquipmentType =
  | 'HVAC'
  | 'Electrical'
  | 'Fire'
  | 'Plumbing'
  | 'Hydraulic'
  | 'Security'
  | 'Lift'
  | 'Other';

export type ProcessingStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed';

export type SectionType =
  | 'chapter'
  | 'section'
  | 'subsection'
  | 'appendix'
  | 'index'
  | 'glossary';

export type ContentType =
  | 'text'
  | 'table'
  | 'procedure'
  | 'list'
  | 'warning'
  | 'note';

export type ImageType =
  | 'diagram'
  | 'photo'
  | 'schematic'
  | 'table'
  | 'chart'
  | 'logo'
  | 'other';

export type ImagePosition =
  | 'top'
  | 'middle'
  | 'bottom'
  | 'full-page'
  | 'inline';

export type ReferenceType =
  | 'see_also'
  | 'prerequisite'
  | 'related_diagram'
  | 'continuation'
  | 'external';

export type SearchType =
  | 'keyword'
  | 'semantic'
  | 'hybrid';

// Table row types
export interface Manual {
  id: string;
  building_id: string;
  name: string;
  manufacturer: string | null;
  equipment_type: EquipmentType | null;
  model_number: string | null;
  version: string | null;
  total_pages: number | null;
  file_url: string;
  file_size_bytes: number | null;
  file_hash: string | null;
  processing_status: ProcessingStatus;
  processing_notes: Json;
  upload_date: string;
  created_at: string;
  updated_at: string;
  tags: string[] | null;
  is_active: boolean;
}

export interface ManualSection {
  id: string;
  manual_id: string;
  parent_section_id: string | null;
  section_number: string | null;
  section_title: string;
  section_type: SectionType | null;
  start_page: number | null;
  end_page: number | null;
  depth_level: number;
  order_index: number;
  full_path: string | null;
  created_at: string;
}

export interface ManualContent {
  id: string;
  section_id: string;
  content_type: ContentType | null;
  content_text: string;
  content_metadata: Json;
  page_number: number | null;
  chunk_index: number;
  embedding: number[] | null;
  token_count: number | null;
  created_at: string;
}

export interface ManualImage {
  id: string;
  section_id: string;
  image_url: string;
  image_type: ImageType | null;
  caption: string | null;
  ocr_text: string | null;
  ocr_confidence: number | null;
  page_number: number | null;
  position_on_page: ImagePosition | null;
  width_px: number | null;
  height_px: number | null;
  file_size_bytes: number | null;
  created_at: string;
}

export interface ManualCrossReference {
  id: string;
  from_section_id: string;
  to_section_id: string;
  reference_type: ReferenceType | null;
  reference_text: string | null;
  external_reference: string | null;
  created_at: string;
}

export interface ManualSearchLog {
  id: string;
  user_id: string | null;
  building_id: string | null;
  manual_id: string | null;
  search_query: string;
  search_type: SearchType | null;
  results_returned: number | null;
  top_section_id: string | null;
  relevance_score: number | null;
  was_helpful: boolean | null;
  user_feedback: string | null;
  searched_at: string;
}

// Insert types
export interface ManualInsert {
  id?: string;
  building_id: string;
  name: string;
  manufacturer?: string | null;
  equipment_type?: EquipmentType | null;
  model_number?: string | null;
  version?: string | null;
  total_pages?: number | null;
  file_url: string;
  file_size_bytes?: number | null;
  file_hash?: string | null;
  processing_status?: ProcessingStatus;
  processing_notes?: Json;
  upload_date?: string;
  tags?: string[] | null;
  is_active?: boolean;
}

export interface ManualSectionInsert {
  id?: string;
  manual_id: string;
  parent_section_id?: string | null;
  section_number?: string | null;
  section_title: string;
  section_type?: SectionType | null;
  start_page?: number | null;
  end_page?: number | null;
  depth_level?: number;
  order_index: number;
  full_path?: string | null;
}

// Search result type
export interface SearchResult {
  content_id: string;
  section_id: string;
  manual_id: string;
  manual_name: string;
  section_title: string;
  section_number: string | null;
  full_path: string | null;
  content_text: string;
  page_number: number | null;
  similarity_score?: number;
  rank?: number;
  manufacturer: string | null;
  model_number: string | null;
}

// Manual with building relationship
export interface ManualWithBuilding extends Manual {
  buildings: {
    id: string;
    name: string;
    address: string | null;
    region: string;
  } | null;
}

// Section with content relationship
export interface SectionWithContent extends ManualSection {
  manual_content: ManualContent[];
}

// Ingestion stats view type
export interface ManualIngestionStats {
  manual_id: string | null;
  manual_name: string | null;
  manufacturer: string | null;
  equipment_type: EquipmentType | null;
  processing_status: ProcessingStatus | null;
  total_pages: number | null;
  section_count: number | null;
  content_chunk_count: number | null;
  embedded_chunk_count: number | null;
  image_count: number | null;
  created_at: string | null;
  updated_at: string | null;
}
