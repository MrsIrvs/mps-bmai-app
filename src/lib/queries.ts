/**
 * Supabase Query Utilities
 *
 * Pre-built, type-safe query functions for common database operations.
 * Imported and adapted from mpsapp repository.
 *
 * Usage:
 * import { getManualsByBuilding, searchManualContentKeyword } from '@/lib/queries'
 *
 * const manuals = await getManualsByBuilding(buildingId)
 * const results = await searchManualContentKeyword(buildingId, 'filter replacement')
 */

import { supabase, executeQuery } from '@/integrations/supabase/client';
import type {
  Manual,
  ManualSection,
  ManualWithBuilding,
  SearchResult,
  ManualInsert,
  EquipmentType,
  ManualIngestionStats
} from '@/types/manual';

// ============================================================================
// MANUALS
// ============================================================================

/**
 * Get all manuals for a building
 */
export async function getManualsByBuilding(buildingId: string) {
  return executeQuery<Manual[]>(
    supabase
      .from('manuals')
      .select('*')
      .eq('building_id', buildingId)
      .eq('is_active', true)
      .order('name')
  );
}

/**
 * Get manuals with building information
 */
export async function getManualsWithBuilding(buildingId: string) {
  return executeQuery<ManualWithBuilding[]>(
    supabase
      .from('manuals')
      .select(`
        *,
        buildings (id, name, address, region)
      `)
      .eq('building_id', buildingId)
      .eq('is_active', true)
      .order('name')
  );
}

/**
 * Get manuals by equipment type
 */
export async function getManualsByEquipmentType(
  buildingId: string,
  equipmentType: EquipmentType
) {
  return executeQuery<Manual[]>(
    supabase
      .from('manuals')
      .select('*')
      .eq('building_id', buildingId)
      .eq('equipment_type', equipmentType)
      .eq('is_active', true)
      .order('name')
  );
}

/**
 * Get a single manual by ID
 */
export async function getManualById(manualId: string) {
  return executeQuery<Manual>(
    supabase
      .from('manuals')
      .select('*')
      .eq('id', manualId)
      .single()
  );
}

/**
 * Create a new manual
 */
export async function createManual(manual: ManualInsert) {
  return executeQuery<Manual>(
    supabase
      .from('manuals')
      .insert(manual)
      .select()
      .single()
  );
}

/**
 * Update manual processing status
 */
export async function updateManualStatus(
  manualId: string,
  status: 'pending' | 'processing' | 'completed' | 'failed',
  notes?: Record<string, unknown>
) {
  return executeQuery<Manual>(
    supabase
      .from('manuals')
      .update({
        processing_status: status,
        ...(notes && { processing_notes: notes })
      })
      .eq('id', manualId)
      .select()
      .single()
  );
}

// ============================================================================
// MANUAL SECTIONS
// ============================================================================

/**
 * Get all sections for a manual (top-level only)
 */
export async function getManualSections(manualId: string) {
  return executeQuery<ManualSection[]>(
    supabase
      .from('manual_sections')
      .select('*')
      .eq('manual_id', manualId)
      .is('parent_section_id', null)
      .order('order_index')
  );
}

/**
 * Get all sections for a manual (hierarchical)
 */
export async function getAllManualSections(manualId: string) {
  return executeQuery<ManualSection[]>(
    supabase
      .from('manual_sections')
      .select('*')
      .eq('manual_id', manualId)
      .order('order_index')
  );
}

/**
 * Get child sections for a parent section
 */
export async function getChildSections(parentSectionId: string) {
  return executeQuery<ManualSection[]>(
    supabase
      .from('manual_sections')
      .select('*')
      .eq('parent_section_id', parentSectionId)
      .order('order_index')
  );
}

/**
 * Get a single section by ID
 */
export async function getSectionById(sectionId: string) {
  return executeQuery<ManualSection>(
    supabase
      .from('manual_sections')
      .select('*')
      .eq('id', sectionId)
      .single()
  );
}

// ============================================================================
// SEARCH
// ============================================================================

/**
 * Search manual content using keyword search
 *
 * @param buildingId - The building to search within
 * @param query - Search query string
 * @param equipmentType - Optional filter by equipment type
 * @param maxResults - Maximum number of results (default: 10)
 */
export async function searchManualContentKeyword(
  buildingId: string,
  query: string,
  equipmentType?: EquipmentType,
  maxResults: number = 10
) {
  return executeQuery<SearchResult[]>(
    supabase.rpc('search_manual_content_keyword', {
      search_query: query,
      target_building_id: buildingId,
      target_equipment_type: equipmentType || null,
      max_results: maxResults
    })
  );
}

/**
 * Search manual content using semantic (vector) search
 *
 * Note: Requires embeddings to be generated first
 *
 * @param buildingId - The building to search within
 * @param embedding - Query embedding vector (1536 dimensions from OpenAI)
 * @param equipmentType - Optional filter by equipment type
 * @param similarityThreshold - Minimum similarity score (0-1, default: 0.7)
 * @param maxResults - Maximum number of results (default: 10)
 */
export async function searchManualContentSemantic(
  buildingId: string,
  embedding: number[],
  equipmentType?: EquipmentType,
  similarityThreshold: number = 0.7,
  maxResults: number = 10
) {
  return executeQuery<SearchResult[]>(
    supabase.rpc('search_manual_content', {
      query_embedding: embedding,
      target_building_id: buildingId,
      target_equipment_type: equipmentType || null,
      similarity_threshold: similarityThreshold,
      max_results: maxResults
    })
  );
}

/**
 * Log a search query for analytics
 */
export async function logSearch(
  searchQuery: string,
  buildingId: string,
  manualId?: string,
  searchType: 'keyword' | 'semantic' | 'hybrid' = 'keyword',
  resultsReturned?: number
) {
  return executeQuery(
    supabase
      .from('manual_search_logs')
      .insert({
        search_query: searchQuery,
        building_id: buildingId,
        manual_id: manualId || null,
        search_type: searchType,
        results_returned: resultsReturned || null
      })
  );
}

/**
 * Update search feedback
 */
export async function updateSearchFeedback(
  logId: string,
  wasHelpful: boolean,
  feedback?: string
) {
  return executeQuery(
    supabase
      .from('manual_search_logs')
      .update({
        was_helpful: wasHelpful,
        user_feedback: feedback || null
      })
      .eq('id', logId)
  );
}

// ============================================================================
// STATS & ANALYTICS
// ============================================================================

/**
 * Get manual ingestion statistics
 */
export async function getManualStats(manualId: string) {
  return executeQuery<ManualIngestionStats>(
    supabase
      .from('manual_ingestion_stats')
      .select('*')
      .eq('manual_id', manualId)
      .single()
  );
}

/**
 * Get all manual stats for a building
 */
export async function getBuildingManualStats(buildingId: string) {
  // First get manual IDs for the building
  const { data: manuals } = await supabase
    .from('manuals')
    .select('id')
    .eq('building_id', buildingId);

  if (!manuals || manuals.length === 0) return { data: [], error: null };

  const manualIds = manuals.map(m => m.id);

  return executeQuery<ManualIngestionStats[]>(
    supabase
      .from('manual_ingestion_stats')
      .select('*')
      .in('manual_id', manualIds)
  );
}

// ============================================================================
// FILE STORAGE
// ============================================================================

/**
 * Upload a file to Supabase Storage
 *
 * @param bucket - Storage bucket name ('manuals', 'manual-images', etc.)
 * @param path - File path within bucket
 * @param file - File to upload
 */
export async function uploadFile(
  bucket: string,
  path: string,
  file: File
) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    return { data: null, error: new Error(error.message) };
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return { data: { ...data, publicUrl }, error: null };
}

/**
 * Get public URL for a stored file
 */
export function getFileUrl(bucket: string, path: string): string {
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return publicUrl;
}

/**
 * Delete a file from storage
 */
export async function deleteFile(bucket: string, path: string) {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) {
    return { error: new Error(error.message) };
  }

  return { error: null };
}
