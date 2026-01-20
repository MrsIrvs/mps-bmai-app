import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

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

// Placeholder buildings until the buildings table is created
const PLACEHOLDER_BUILDINGS: Building[] = [
  {
    id: 'building-1',
    name: 'Perth CBD Tower',
    address: '100 St Georges Terrace, Perth WA 6000',
    region: 'WA',
    documentsCount: 12,
    status: 'online',
  },
  {
    id: 'building-2',
    name: 'Fremantle Maritime Centre',
    address: '45 Mews Road, Fremantle WA 6160',
    region: 'WA',
    documentsCount: 8,
    status: 'warning',
  },
  {
    id: 'building-3',
    name: 'Melbourne Central Plaza',
    address: '211 La Trobe Street, Melbourne VIC 3000',
    region: 'VIC',
    documentsCount: 15,
    status: 'online',
  },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const { profile, role } = useAuth();
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Fetch buildings - uses placeholder data until buildings table exists
  const fetchBuildings = async () => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Replace with actual Supabase query when buildings table is created
      // For now, use placeholder data
      await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate network delay
      setBuildings(PLACEHOLDER_BUILDINGS);

      console.log('Buildings loaded (placeholder):', PLACEHOLDER_BUILDINGS);
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

    // Default: show all buildings for now (until proper assignment)
    return buildings;
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
