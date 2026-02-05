/**
 * Service Requests Hook
 *
 * React Query hook for fetching and managing service requests.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/hooks/useAuth';
import {
  getServiceRequestsByBuilding,
  getServiceRequestsWithDetails,
  createServiceRequest,
  updateServiceRequest,
  updateServiceRequestStatus,
  ServiceRequest,
  CreateServiceRequestInput,
  UpdateServiceRequestInput,
  ServiceRequestStatus,
} from '@/lib/service-request-queries';

// Query keys for cache management
export const serviceRequestKeys = {
  all: ['service-requests'] as const,
  lists: () => [...serviceRequestKeys.all, 'list'] as const,
  list: (buildingId: string, filters?: Record<string, unknown>) =>
    [...serviceRequestKeys.lists(), buildingId, filters] as const,
  details: () => [...serviceRequestKeys.all, 'detail'] as const,
  detail: (id: string) => [...serviceRequestKeys.details(), id] as const,
};

interface UseServiceRequestsOptions {
  includeResolved?: boolean;
  status?: ServiceRequestStatus;
}

/**
 * Hook to fetch service requests for the selected building
 */
export function useServiceRequests(options: UseServiceRequestsOptions = {}) {
  const { selectedBuilding } = useApp();
  const buildingId = selectedBuilding?.id;

  return useQuery({
    queryKey: serviceRequestKeys.list(buildingId || '', options),
    queryFn: async () => {
      if (!buildingId) return [];

      const { data, error } = await getServiceRequestsByBuilding(buildingId, {
        includeResolved: options.includeResolved,
        status: options.status,
      });

      if (error) throw error;
      return data || [];
    },
    enabled: !!buildingId,
    staleTime: 30000, // Consider data stale after 30 seconds
  });
}

/**
 * Hook to fetch service requests with full details (joined data)
 */
export function useServiceRequestsWithDetails() {
  const { selectedBuilding } = useApp();
  const buildingId = selectedBuilding?.id;

  return useQuery({
    queryKey: [...serviceRequestKeys.list(buildingId || ''), 'with-details'],
    queryFn: async () => {
      if (!buildingId) return [];

      const { data, error } = await getServiceRequestsWithDetails(buildingId);

      if (error) throw error;
      return data || [];
    },
    enabled: !!buildingId,
    staleTime: 30000,
  });
}

/**
 * Hook to create a new service request
 */
export function useCreateServiceRequest() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (input: CreateServiceRequestInput) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await createServiceRequest(input, user.id);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate all service request lists to refetch
      queryClient.invalidateQueries({ queryKey: serviceRequestKeys.lists() });
    },
  });
}

/**
 * Hook to update a service request
 */
export function useUpdateServiceRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      requestId,
      updates,
    }: {
      requestId: string;
      updates: UpdateServiceRequestInput;
    }) => {
      const { data, error } = await updateServiceRequest(requestId, updates);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceRequestKeys.lists() });
    },
  });
}

/**
 * Hook to update service request status
 */
export function useUpdateServiceRequestStatus() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      requestId,
      status,
      resolutionNotes,
    }: {
      requestId: string;
      status: ServiceRequestStatus;
      resolutionNotes?: string;
    }) => {
      const { data, error } = await updateServiceRequestStatus(
        requestId,
        status,
        status === 'resolved' ? user?.id : undefined,
        resolutionNotes
      );
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceRequestKeys.lists() });
    },
  });
}

// Re-export types for convenience
export type {
  ServiceRequest,
  CreateServiceRequestInput,
  ServiceRequestStatus,
};
