/**
 * Service Request Query Utilities
 *
 * Type-safe query functions for service request CRUD operations.
 * Types match the ACTUAL database schema (verified via introspection).
 */

import { supabase, executeQuery } from '@/integrations/supabase/client';

// ============================================================================
// TYPES (matching actual database schema)
// ============================================================================

export type ServiceRequestCategory = 'HVAC' | 'Electrical' | 'Fire' | 'Plumbing' | 'Hydraulic' | 'Security' | 'Lift' | 'Other';
export type ServiceRequestPriority = 'low' | 'medium' | 'high';
export type ServiceRequestStatus = 'pending' | 'dispatched' | 'in_progress' | 'resolved';
export type ServiceRequestSource = 'manual' | 'chat' | 'email';

export interface ServiceRequest {
  request_id: string;
  building_id: string;
  created_by_user_id: string;
  assigned_tech_id: string | null;
  title: string;
  description: string;
  category: ServiceRequestCategory;
  priority: ServiceRequestPriority;
  status: ServiceRequestStatus;
  resolution_notes: string | null;
  resolved_at: string | null;
  resolved_by_user_id: string | null;
  source: ServiceRequestSource | null;
  chat_message_id: string | null;
  email_sent_at: string | null;
  email_to: string | null;
  email_message_id: string | null;
  external_ref: string | null;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface CreateServiceRequestInput {
  building_id: string;
  title: string;
  description: string;
  category: ServiceRequestCategory;
  priority?: ServiceRequestPriority;
  source?: ServiceRequestSource;
  chat_message_id?: string;
}

export interface UpdateServiceRequestInput {
  title?: string;
  description?: string;
  category?: ServiceRequestCategory;
  priority?: ServiceRequestPriority;
  status?: ServiceRequestStatus;
  assigned_tech_id?: string | null;
  resolution_notes?: string;
  is_active?: boolean;
}

// ============================================================================
// SERVICE REQUESTS - READ
// ============================================================================

/**
 * Get all service requests for a building
 */
export async function getServiceRequestsByBuilding(
  buildingId: string,
  options?: {
    status?: ServiceRequestStatus;
    category?: ServiceRequestCategory;
    priority?: ServiceRequestPriority;
    limit?: number;
    includeResolved?: boolean;
  }
) {
  let query = supabase
    .from('service_requests')
    .select('*')
    .eq('building_id', buildingId)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (options?.status) {
    query = query.eq('status', options.status);
  } else if (!options?.includeResolved) {
    query = query.neq('status', 'resolved');
  }

  if (options?.category) {
    query = query.eq('category', options.category);
  }

  if (options?.priority) {
    query = query.eq('priority', options.priority);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  return executeQuery<ServiceRequest[]>(query);
}

/**
 * Get a single service request by ID
 */
export async function getServiceRequestById(requestId: string) {
  return executeQuery<ServiceRequest>(
    supabase
      .from('service_requests')
      .select('*')
      .eq('request_id', requestId)
      .single()
  );
}

/**
 * Get service requests with full details
 */
export async function getServiceRequestsWithDetails(buildingId: string) {
  return getServiceRequestsByBuilding(buildingId, { includeResolved: true });
}

/**
 * Get service requests assigned to a technician
 */
export async function getServiceRequestsByTechnician(techId: string) {
  return executeQuery<ServiceRequest[]>(
    supabase
      .from('service_requests')
      .select('*')
      .eq('assigned_tech_id', techId)
      .eq('is_active', true)
      .neq('status', 'resolved')
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false })
  );
}

/**
 * Get service requests created by a user
 */
export async function getServiceRequestsByCreator(userId: string) {
  return executeQuery<ServiceRequest[]>(
    supabase
      .from('service_requests')
      .select('*')
      .eq('created_by_user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
  );
}

/**
 * Get service request statistics for a building
 */
export async function getServiceRequestStats(buildingId: string) {
  const { data, error } = await supabase
    .from('service_requests')
    .select('status, priority, category')
    .eq('building_id', buildingId)
    .eq('is_active', true);

  if (error) {
    return { data: null, error: new Error(error.message) };
  }

  const stats = {
    total: data.length,
    byStatus: {
      pending: 0,
      dispatched: 0,
      in_progress: 0,
      resolved: 0,
    },
    byPriority: {
      low: 0,
      medium: 0,
      high: 0,
    },
    byCategory: {} as Record<string, number>,
  };

  data.forEach((request) => {
    stats.byStatus[request.status as ServiceRequestStatus]++;
    stats.byPriority[request.priority as ServiceRequestPriority]++;
    stats.byCategory[request.category] = (stats.byCategory[request.category] || 0) + 1;
  });

  return { data: stats, error: null };
}

// ============================================================================
// SERVICE REQUESTS - CREATE
// ============================================================================

/**
 * Create a new service request
 */
export async function createServiceRequest(
  input: CreateServiceRequestInput,
  createdByUserId: string
) {
  return executeQuery<ServiceRequest>(
    supabase
      .from('service_requests')
      .insert({
        building_id: input.building_id,
        created_by_user_id: createdByUserId,
        title: input.title,
        description: input.description,
        category: input.category,
        priority: input.priority || 'medium',
        status: 'pending',
        source: input.source || 'manual',
        chat_message_id: input.chat_message_id || null,
        is_active: true,
      })
      .select()
      .single()
  );
}

// ============================================================================
// SERVICE REQUESTS - UPDATE
// ============================================================================

/**
 * Update a service request
 */
export async function updateServiceRequest(
  requestId: string,
  updates: UpdateServiceRequestInput
) {
  return executeQuery<ServiceRequest>(
    supabase
      .from('service_requests')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('request_id', requestId)
      .select()
      .single()
  );
}

/**
 * Update service request status
 */
export async function updateServiceRequestStatus(
  requestId: string,
  status: ServiceRequestStatus,
  resolvedByUserId?: string,
  resolutionNotes?: string
) {
  const updates: Record<string, unknown> = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (status === 'resolved') {
    updates.resolved_at = new Date().toISOString();
    updates.resolved_by_user_id = resolvedByUserId || null;
    updates.resolution_notes = resolutionNotes || null;
  }

  return executeQuery<ServiceRequest>(
    supabase
      .from('service_requests')
      .update(updates)
      .eq('request_id', requestId)
      .select()
      .single()
  );
}

/**
 * Assign a technician to a service request
 */
export async function assignServiceRequest(
  requestId: string,
  technicianId: string | null
) {
  return executeQuery<ServiceRequest>(
    supabase
      .from('service_requests')
      .update({
        assigned_tech_id: technicianId,
        status: technicianId ? 'dispatched' : 'pending',
        updated_at: new Date().toISOString(),
      })
      .eq('request_id', requestId)
      .select()
      .single()
  );
}

/**
 * Soft delete a service request (set is_active to false)
 */
export async function deleteServiceRequest(requestId: string) {
  return executeQuery<ServiceRequest>(
    supabase
      .from('service_requests')
      .update({
        is_active: false,
        updated_at: new Date().toISOString(),
      })
      .eq('request_id', requestId)
      .select()
      .single()
  );
}
