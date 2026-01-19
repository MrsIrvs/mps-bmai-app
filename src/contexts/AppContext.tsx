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
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock buildings data - in production, this would come from the database
const mockBuildings: Building[] = [
  {
    id: '1',
    name: 'Westfield Sydney CBD',
    address: '188 Pitt Street, Sydney NSW 2000',
    region: 'NSW',
    documentsCount: 24,
    status: 'online',
  },
  {
    id: '2',
    name: 'Perth Convention Centre',
    address: '21 Mounts Bay Rd, Perth WA 6000',
    region: 'WA',
    documentsCount: 18,
    status: 'warning',
  },
  {
    id: '3',
    name: 'Brisbane Airport Terminal',
    address: '1 Airport Dr, Brisbane Airport QLD 4008',
    region: 'QLD',
    documentsCount: 31,
    status: 'online',
  },
  {
    id: '4',
    name: 'Melbourne Crown Casino',
    address: '8 Whiteman St, Southbank VIC 3006',
    region: 'VIC',
    documentsCount: 42,
    status: 'online',
  },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const { profile, role } = useAuth();
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Filter buildings based on user's profile buildings array
  const accessibleBuildings = profile?.buildings?.length 
    ? mockBuildings.filter((b) => profile.buildings.includes(b.id))
    : role === 'admin' 
      ? mockBuildings 
      : [];

  // Set default building when user logs in
  useEffect(() => {
    if (accessibleBuildings.length > 0 && !selectedBuilding) {
      setSelectedBuilding(accessibleBuildings[0]);
    }
  }, [accessibleBuildings, selectedBuilding]);

  return (
    <AppContext.Provider
      value={{
        selectedBuilding,
        setSelectedBuilding,
        buildings: accessibleBuildings,
        sidebarOpen,
        setSidebarOpen,
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

export { mockBuildings };
export type { Building, UserRole };
