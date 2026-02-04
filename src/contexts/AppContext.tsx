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

  // Fetch buildings from database
  const fetchBuildings = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('buildings')
        .select('*')
        .eq('is_archived', false)
        .order('name', { ascending: true });

      if (fetchError) {
        console.error('Error fetching buildings:', fetchError);
        setError(new Error(fetchError.message));
        return;
      }

      // Map database buildings to the Building interface
      const mappedBuildings: Building[] = (data || []).map((b) => ({
        id: b.building_id,
        name: b.building_name,
        address: b.address || '',
        region: b.region,
        documentsCount: 0, // TODO: Count documents when documents table exists
        status: b.status === 'active' ? 'online' : 'warning',
      }));

      setBuildings(mappedBuildings);
      console.log('Buildings loaded from database:', mappedBuildings.length);
    } catch (err) {
      console.error('Exception fetching buildings:', err);
      setError(err instanceof Error ? err : new Error('Unknown error fetching buildings'));
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchBuildings();
  }, []);

  // Filter buildings based on user's role and assigned buildings
  // Note: RLS already handles most filtering, but we keep this for additional client-side filtering if needed
  const accessibleBuildings = React.useMemo(() => {
    // RLS handles the filtering server-side, so we just return all buildings from the query
    return buildings;
  }, [buildings]);

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
