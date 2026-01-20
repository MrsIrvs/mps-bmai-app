import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface Building {
  id: string;
  name: string;
  address: string;
  region: string;
  documentsCount: number;
  status: 'online' | 'warning' | 'offline';
}

type UserRole = 'admin' | 'technician' | 'client';

interface AppContextType {
  selectedBuilding: Building | null;
  setSelectedBuilding: (building: Building | null) => void;
  buildings: Building[];
  loading: boolean;
  error: Error | null;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  refreshBuildings: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const { profile, role } = useAuth();
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Fetch buildings from Supabase
  const fetchBuildings = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching buildings from Supabase...');

      // Query buildings table
      const { data: buildingsData, error: fetchError } = await supabase
        .from('buildings')
        .select(`
          building_id,
          building_name,
          address,
          region,
          status,
          client_user_ids,
          tech_user_ids
        `)
        .eq('status', 'active')
        .order('building_name');

      if (fetchError) {
        console.error('Error fetching buildings:', fetchError);
        throw new Error(`Failed to fetch buildings: ${fetchError.message}`);
      }

      console.log('Buildings fetched:', buildingsData);

      // For each building, count manuals (documents)
      const buildingsWithCounts = await Promise.all(
        (buildingsData || []).map(async (building) => {
          const { count } = await supabase
            .from('manuals')
            .select('*', { count: 'exact', head: true })
            .eq('building_id', building.building_id)
            .eq('is_active', true);

          return {
            id: building.building_id,
            name: building.building_name,
            address: building.address || '',
            region: building.region,
            documentsCount: count || 0,
            // Determine status based on manual count (simple heuristic)
            status: (count || 0) > 15 ? 'online' : (count || 0) > 5 ? 'warning' : 'offline'
          } as Building;
        })
      );

      console.log('Buildings with counts:', buildingsWithCounts);
      setBuildings(buildingsWithCounts);

      // Set default building if none selected
      if (buildingsWithCounts.length > 0 && !selectedBuilding) {
        setSelectedBuilding(buildingsWithCounts[0]);
        console.log('Default building selected:', buildingsWithCounts[0]);
      }
    } catch (err) {
      console.error('Exception fetching buildings:', err);
      setError(err instanceof Error ? err : new Error('Unknown error fetching buildings'));
      // Keep any existing buildings in case of error
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchBuildings();
  }, []);

  // Filter buildings based on user's role and assigned buildings
  const accessibleBuildings = React.useMemo(() => {
    if (role === 'admin') {
      // Admins see all buildings
      return buildings;
    }

    if (role === 'technician' && profile?.region) {
      // Technicians see buildings in their region
      return buildings.filter((b) => b.region === profile.region);
    }

    if (role === 'client' && profile?.buildings?.length) {
      // Clients see only their assigned buildings
      return buildings.filter((b) => profile.buildings.includes(b.id));
    }

    // Default: no buildings accessible
    return [];
  }, [buildings, role, profile]);

  // Update selected building when accessible buildings change
  useEffect(() => {
    if (accessibleBuildings.length > 0 && !selectedBuilding) {
      setSelectedBuilding(accessibleBuildings[0]);
    } else if (selectedBuilding && !accessibleBuildings.find(b => b.id === selectedBuilding.id)) {
      // Selected building is no longer accessible, switch to first available
      setSelectedBuilding(accessibleBuildings[0] || null);
    }
  }, [accessibleBuildings, selectedBuilding]);

  return (
    <AppContext.Provider
      value={{
        selectedBuilding,
        setSelectedBuilding,
        buildings: accessibleBuildings,
        loading,
        error,
        sidebarOpen,
        setSidebarOpen,
        refreshBuildings: fetchBuildings,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export type { Building, UserRole };
