/**
 * Contractors Hooks
 *
 * React Query hooks for fetching and managing contractors.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/hooks/useAuth';
import {
  getContractors,
  getContractorById,
  getContractorsWithBuildings,
  getContractorsByBuilding,
  getContractorsBySpecialty,
  getEmergencyContractors,
  getContractorStats,
  createContractor,
  updateContractor,
  archiveContractor,
  restoreContractor,
  assignContractorToBuilding,
  removeContractorFromBuilding,
  setPreferredContractor,
  Contractor,
  ContractorWithBuildings,
  CreateContractorInput,
  UpdateContractorInput,
  EquipmentCategory,
} from '@/lib/contractor-queries';

// ============================================================================
// QUERY KEYS
// ============================================================================

export const contractorKeys = {
  all: ['contractors'] as const,
  lists: () => [...contractorKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...contractorKeys.lists(), filters] as const,
  details: () => [...contractorKeys.all, 'detail'] as const,
  detail: (id: string) => [...contractorKeys.details(), id] as const,
  byBuilding: (buildingId: string) => [...contractorKeys.all, 'building', buildingId] as const,
  bySpecialty: (category: EquipmentCategory) => [...contractorKeys.all, 'specialty', category] as const,
  emergency: () => [...contractorKeys.all, 'emergency'] as const,
  stats: () => [...contractorKeys.all, 'stats'] as const,
};

// ============================================================================
// READ HOOKS
// ============================================================================

interface UseContractorsOptions {
  includeArchived?: boolean;
}

/**
 * Hook to fetch all contractors
 */
export function useContractors(options: UseContractorsOptions = {}) {
  return useQuery({
    queryKey: contractorKeys.list(options),
    queryFn: async () => {
      const { data, error } = await getContractors(options);
      if (error) throw error;
      return data || [];
    },
    staleTime: 30000,
  });
}

/**
 * Hook to fetch contractors with their building assignments
 */
export function useContractorsWithBuildings(options: UseContractorsOptions = {}) {
  return useQuery({
    queryKey: [...contractorKeys.list(options), 'with-buildings'],
    queryFn: async () => {
      const { data, error } = await getContractorsWithBuildings(options);
      if (error) throw error;
      return data || [];
    },
    staleTime: 30000,
  });
}

/**
 * Hook to fetch a single contractor by ID
 */
export function useContractor(contractorId: string | undefined) {
  return useQuery({
    queryKey: contractorKeys.detail(contractorId || ''),
    queryFn: async () => {
      if (!contractorId) return null;
      const { data, error } = await getContractorById(contractorId);
      if (error) throw error;
      return data;
    },
    enabled: !!contractorId,
    staleTime: 30000,
  });
}

/**
 * Hook to fetch contractors for the selected building
 */
export function useContractorsByBuilding(buildingId?: string) {
  const { selectedBuilding } = useApp();
  const id = buildingId || selectedBuilding?.id;

  return useQuery({
    queryKey: contractorKeys.byBuilding(id || ''),
    queryFn: async () => {
      if (!id) return [];
      const { data, error } = await getContractorsByBuilding(id);
      if (error) throw error;
      return data || [];
    },
    enabled: !!id,
    staleTime: 30000,
  });
}

/**
 * Hook to fetch contractors by specialty
 */
export function useContractorsBySpecialty(category: EquipmentCategory) {
  return useQuery({
    queryKey: contractorKeys.bySpecialty(category),
    queryFn: async () => {
      const { data, error } = await getContractorsBySpecialty(category);
      if (error) throw error;
      return data || [];
    },
    staleTime: 30000,
  });
}

/**
 * Hook to fetch emergency-available contractors
 */
export function useEmergencyContractors() {
  return useQuery({
    queryKey: contractorKeys.emergency(),
    queryFn: async () => {
      const { data, error } = await getEmergencyContractors();
      if (error) throw error;
      return data || [];
    },
    staleTime: 30000,
  });
}

/**
 * Hook to fetch contractor statistics
 */
export function useContractorStats() {
  return useQuery({
    queryKey: contractorKeys.stats(),
    queryFn: async () => {
      const { data, error } = await getContractorStats();
      if (error) throw error;
      return data;
    },
    staleTime: 60000,
  });
}

// ============================================================================
// MUTATION HOOKS
// ============================================================================

/**
 * Hook to create a new contractor
 */
export function useCreateContractor() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (input: CreateContractorInput) => {
      if (!user?.id) throw new Error('User not authenticated');
      const { data, error } = await createContractor(input, user.id);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contractorKeys.lists() });
      queryClient.invalidateQueries({ queryKey: contractorKeys.stats() });
    },
  });
}

/**
 * Hook to update a contractor
 */
export function useUpdateContractor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      contractorId,
      updates,
    }: {
      contractorId: string;
      updates: UpdateContractorInput;
    }) => {
      const { data, error } = await updateContractor(contractorId, updates);
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: contractorKeys.lists() });
      queryClient.invalidateQueries({ queryKey: contractorKeys.detail(variables.contractorId) });
      queryClient.invalidateQueries({ queryKey: contractorKeys.stats() });
    },
  });
}

/**
 * Hook to archive a contractor
 */
export function useArchiveContractor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contractorId: string) => {
      const { data, error } = await archiveContractor(contractorId);
      if (error) throw error;
      return data;
    },
    onSuccess: (_, contractorId) => {
      queryClient.invalidateQueries({ queryKey: contractorKeys.lists() });
      queryClient.invalidateQueries({ queryKey: contractorKeys.detail(contractorId) });
      queryClient.invalidateQueries({ queryKey: contractorKeys.stats() });
    },
  });
}

/**
 * Hook to restore an archived contractor
 */
export function useRestoreContractor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contractorId: string) => {
      const { data, error } = await restoreContractor(contractorId);
      if (error) throw error;
      return data;
    },
    onSuccess: (_, contractorId) => {
      queryClient.invalidateQueries({ queryKey: contractorKeys.lists() });
      queryClient.invalidateQueries({ queryKey: contractorKeys.detail(contractorId) });
      queryClient.invalidateQueries({ queryKey: contractorKeys.stats() });
    },
  });
}

// ============================================================================
// BUILDING ASSIGNMENT HOOKS
// ============================================================================

/**
 * Hook to assign a contractor to a building
 */
export function useAssignContractorToBuilding() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      contractorId,
      buildingId,
      isPreferred,
      notes,
    }: {
      contractorId: string;
      buildingId: string;
      isPreferred?: boolean;
      notes?: string;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');
      const { data, error } = await assignContractorToBuilding(
        contractorId,
        buildingId,
        user.id,
        { isPreferred, notes }
      );
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: contractorKeys.lists() });
      queryClient.invalidateQueries({ queryKey: contractorKeys.detail(variables.contractorId) });
      queryClient.invalidateQueries({ queryKey: contractorKeys.byBuilding(variables.buildingId) });
    },
  });
}

/**
 * Hook to remove a contractor from a building
 */
export function useRemoveContractorFromBuilding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      contractorId,
      buildingId,
    }: {
      contractorId: string;
      buildingId: string;
    }) => {
      const { error } = await removeContractorFromBuilding(contractorId, buildingId);
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: contractorKeys.lists() });
      queryClient.invalidateQueries({ queryKey: contractorKeys.detail(variables.contractorId) });
      queryClient.invalidateQueries({ queryKey: contractorKeys.byBuilding(variables.buildingId) });
    },
  });
}

/**
 * Hook to set a contractor as preferred for a building
 */
export function useSetPreferredContractor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      contractorId,
      buildingId,
    }: {
      contractorId: string;
      buildingId: string;
    }) => {
      const { data, error } = await setPreferredContractor(contractorId, buildingId);
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: contractorKeys.lists() });
      queryClient.invalidateQueries({ queryKey: contractorKeys.byBuilding(variables.buildingId) });
    },
  });
}

// ============================================================================
// RE-EXPORTS
// ============================================================================

export type {
  Contractor,
  ContractorWithBuildings,
  CreateContractorInput,
  UpdateContractorInput,
  EquipmentCategory,
};
