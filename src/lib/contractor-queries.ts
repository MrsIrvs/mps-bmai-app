/**
 * Contractor Query Utilities
 *
 * Type-safe query functions for contractor CRUD operations.
 *
 * Usage:
 * import { getContractors, createContractor } from '@/lib/contractor-queries'
 *
 * const contractors = await getContractors()
 * const newContractor = await createContractor({ ... }, userId)
 */

import { supabase, executeQuery } from '@/integrations/supabase/client';

// ============================================================================
// TYPES
// ============================================================================

// Specialty categories (stored as TEXT[] in database)
export type EquipmentCategory = 'HVAC' | 'Electrical' | 'Fire' | 'Plumbing' | 'Hydraulic' | 'Security' | 'Lift' | 'Other';

export interface Contractor {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  contact_name: string | null;
  specialties: string[] | null;  // TEXT[] in database
  emergency_available: boolean;
  rating: number | null;
  notes: string | null;
  is_archived: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContractorBuildingAssignment {
  id: string;
  contractor_id: string;
  building_id: string;
  is_preferred: boolean;
  assigned_at: string;
  assigned_by: string | null;
  notes: string | null;
  created_at: string;
}

export interface ContractorWithBuildings extends Contractor {
  building_assignments: {
    id: string;
    building_id: string;
    building_name: string;
    is_preferred: boolean;
  }[];
}

export interface CreateContractorInput {
  name: string;
  email: string;
  phone?: string;
  contact_name?: string;
  specialties?: EquipmentCategory[];
  emergency_available?: boolean;
  rating?: number;
  notes?: string;
}

export interface UpdateContractorInput {
  name?: string;
  email?: string;
  phone?: string | null;
  contact_name?: string | null;
  specialties?: EquipmentCategory[];
  emergency_available?: boolean;
  rating?: number | null;
  notes?: string | null;
  is_archived?: boolean;
}

// ============================================================================
// CONTRACTORS - READ
// ============================================================================

/**
 * Get all contractors
 */
export async function getContractors(options?: { includeArchived?: boolean }) {
  let query = supabase
    .from('service_providers')
    .select('*')
    .order('name', { ascending: true });

  if (!options?.includeArchived) {
    query = query.eq('is_archived', false);
  }

  return executeQuery<Contractor[]>(query);
}

/**
 * Get a single contractor by ID
 */
export async function getContractorById(contractorId: string) {
  return executeQuery<Contractor>(
    supabase
      .from('service_providers')
      .select('*')
      .eq('id', contractorId)
      .single()
  );
}

/**
 * Get contractors with their building assignments
 */
export async function getContractorsWithBuildings(options?: { includeArchived?: boolean }) {
  // First get all contractors
  let contractorsQuery = supabase
    .from('service_providers')
    .select('*')
    .order('name', { ascending: true });

  if (!options?.includeArchived) {
    contractorsQuery = contractorsQuery.eq('is_archived', false);
  }

  const { data: contractors, error: contractorsError } = await contractorsQuery;

  if (contractorsError) {
    return { data: null, error: new Error(contractorsError.message) };
  }

  if (!contractors || contractors.length === 0) {
    return { data: [] as ContractorWithBuildings[], error: null };
  }

  // Get all building assignments with building names
  const { data: assignments, error: assignmentsError } = await supabase
    .from('contractor_building_assignments')
    .select(`
      id,
      contractor_id,
      building_id,
      is_preferred,
      buildings:building_id (
        name
      )
    `);

  if (assignmentsError) {
    return { data: null, error: new Error(assignmentsError.message) };
  }

  // Map assignments to contractors
  const contractorsWithBuildings: ContractorWithBuildings[] = contractors.map((contractor) => {
    const contractorAssignments = (assignments || [])
      .filter((a) => a.contractor_id === contractor.id)
      .map((a) => ({
        id: a.id,
        building_id: a.building_id,
        building_name: (a.buildings as { name: string } | null)?.name || 'Unknown',
        is_preferred: a.is_preferred,
      }));

    return {
      ...contractor,
      building_assignments: contractorAssignments,
    };
  });

  return { data: contractorsWithBuildings, error: null };
}

/**
 * Get contractors assigned to a specific building
 */
export async function getContractorsByBuilding(buildingId: string) {
  const { data, error } = await supabase
    .from('contractor_building_assignments')
    .select(`
      id,
      is_preferred,
      notes,
      assigned_at,
      contractor:contractor_id (
        id,
        name,
        email,
        phone,
        contact_name,
        specialties,
        emergency_available,
        rating,
        notes,
        is_archived,
        created_at,
        updated_at
      )
    `)
    .eq('building_id', buildingId);

  if (error) {
    return { data: null, error: new Error(error.message) };
  }

  // Transform to flat structure with assignment info
  const contractors = (data || [])
    .filter((a) => a.contractor && !(a.contractor as Contractor).is_archived)
    .map((a) => ({
      ...(a.contractor as Contractor),
      assignment_id: a.id,
      is_preferred: a.is_preferred,
      assignment_notes: a.notes,
      assigned_at: a.assigned_at,
    }));

  return { data: contractors, error: null };
}

/**
 * Get contractors by specialty
 */
export async function getContractorsBySpecialty(category: EquipmentCategory) {
  return executeQuery<Contractor[]>(
    supabase
      .from('service_providers')
      .select('*')
      .contains('specialties', [category])
      .eq('is_archived', false)
      .order('rating', { ascending: false, nullsFirst: false })
  );
}

/**
 * Get emergency-available contractors
 */
export async function getEmergencyContractors() {
  return executeQuery<Contractor[]>(
    supabase
      .from('service_providers')
      .select('*')
      .eq('emergency_available', true)
      .eq('is_archived', false)
      .order('rating', { ascending: false, nullsFirst: false })
  );
}

// ============================================================================
// CONTRACTORS - CREATE
// ============================================================================

/**
 * Create a new contractor
 */
export async function createContractor(
  input: CreateContractorInput,
  createdByUserId: string
) {
  return executeQuery<Contractor>(
    supabase
      .from('service_providers')
      .insert({
        name: input.name,
        email: input.email,
        phone: input.phone || null,
        contact_name: input.contact_name || null,
        specialties: input.specialties || [],
        emergency_available: input.emergency_available || false,
        rating: input.rating ?? null,
        notes: input.notes || null,
        is_archived: false,
        created_by: createdByUserId,
      })
      .select()
      .single()
  );
}

// ============================================================================
// CONTRACTORS - UPDATE
// ============================================================================

/**
 * Update a contractor
 */
export async function updateContractor(
  contractorId: string,
  updates: UpdateContractorInput
) {
  return executeQuery<Contractor>(
    supabase
      .from('service_providers')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', contractorId)
      .select()
      .single()
  );
}

/**
 * Archive a contractor (soft delete)
 */
export async function archiveContractor(contractorId: string) {
  return executeQuery<Contractor>(
    supabase
      .from('service_providers')
      .update({
        is_archived: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', contractorId)
      .select()
      .single()
  );
}

/**
 * Restore an archived contractor
 */
export async function restoreContractor(contractorId: string) {
  return executeQuery<Contractor>(
    supabase
      .from('service_providers')
      .update({
        is_archived: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', contractorId)
      .select()
      .single()
  );
}

// ============================================================================
// BUILDING ASSIGNMENTS
// ============================================================================

/**
 * Get building assignments for a contractor
 */
export async function getContractorBuildingAssignments(contractorId: string) {
  const { data, error } = await supabase
    .from('contractor_building_assignments')
    .select(`
      id,
      building_id,
      is_preferred,
      notes,
      assigned_at,
      assigned_by,
      building:building_id (
        id,
        name,
        address,
        region
      )
    `)
    .eq('contractor_id', contractorId)
    .order('is_preferred', { ascending: false });

  if (error) {
    return { data: null, error: new Error(error.message) };
  }

  return { data, error: null };
}

/**
 * Assign a contractor to a building
 */
export async function assignContractorToBuilding(
  contractorId: string,
  buildingId: string,
  assignedByUserId: string,
  options?: { isPreferred?: boolean; notes?: string }
) {
  return executeQuery<ContractorBuildingAssignment>(
    supabase
      .from('contractor_building_assignments')
      .insert({
        contractor_id: contractorId,
        building_id: buildingId,
        assigned_by: assignedByUserId,
        is_preferred: options?.isPreferred || false,
        notes: options?.notes || null,
      })
      .select()
      .single()
  );
}

/**
 * Remove a contractor from a building
 */
export async function removeContractorFromBuilding(
  contractorId: string,
  buildingId: string
) {
  const { error } = await supabase
    .from('contractor_building_assignments')
    .delete()
    .eq('contractor_id', contractorId)
    .eq('building_id', buildingId);

  if (error) {
    return { error: new Error(error.message) };
  }

  return { error: null };
}

/**
 * Update building assignment (e.g., set preferred status)
 */
export async function updateBuildingAssignment(
  contractorId: string,
  buildingId: string,
  updates: { isPreferred?: boolean; notes?: string }
) {
  return executeQuery<ContractorBuildingAssignment>(
    supabase
      .from('contractor_building_assignments')
      .update({
        is_preferred: updates.isPreferred,
        notes: updates.notes,
      })
      .eq('contractor_id', contractorId)
      .eq('building_id', buildingId)
      .select()
      .single()
  );
}

/**
 * Set a contractor as preferred for a building
 * This will also unset any other preferred contractor for that building
 */
export async function setPreferredContractor(
  contractorId: string,
  buildingId: string
) {
  // First, unset any existing preferred contractor for this building
  await supabase
    .from('contractor_building_assignments')
    .update({ is_preferred: false })
    .eq('building_id', buildingId)
    .eq('is_preferred', true);

  // Set the new preferred contractor
  return executeQuery<ContractorBuildingAssignment>(
    supabase
      .from('contractor_building_assignments')
      .update({ is_preferred: true })
      .eq('contractor_id', contractorId)
      .eq('building_id', buildingId)
      .select()
      .single()
  );
}

// ============================================================================
// CONTRACTOR STATISTICS
// ============================================================================

/**
 * Get contractor statistics
 */
export async function getContractorStats() {
  const { data, error } = await supabase
    .from('service_providers')
    .select('specialties, emergency_available, is_archived');

  if (error) {
    return { data: null, error: new Error(error.message) };
  }

  const stats = {
    total: data.filter((c) => !c.is_archived).length,
    archived: data.filter((c) => c.is_archived).length,
    emergencyAvailable: data.filter((c) => c.emergency_available && !c.is_archived).length,
    bySpecialty: {} as Record<EquipmentCategory, number>,
  };

  // Count by specialty
  const categories: EquipmentCategory[] = ['HVAC', 'Electrical', 'Fire', 'Plumbing', 'Hydraulic', 'Security', 'Lift', 'Other'];
  categories.forEach((cat) => {
    stats.bySpecialty[cat] = data.filter(
      (c) => !c.is_archived && c.specialties?.includes(cat)
    ).length;
  });

  return { data: stats, error: null };
}
