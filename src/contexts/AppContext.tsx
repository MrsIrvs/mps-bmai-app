import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Building, UserRole } from '@/types';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  selectedBuilding: Building | null;
  setSelectedBuilding: (building: Building | null) => void;
  buildings: Building[];
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock data for demo
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

const mockUsers: Record<UserRole, User> = {
  admin: {
    id: 'admin-1',
    name: 'Sarah Mitchell',
    email: 'sarah.mitchell@mechps.com.au',
    role: 'admin',
    buildings: ['1', '2', '3', '4'],
    createdAt: new Date('2024-01-15'),
  },
  technician: {
    id: 'tech-1',
    name: 'James Carter',
    email: 'james.carter@mechps.com.au',
    role: 'technician',
    buildings: ['1', '2', '3', '4'],
    region: 'WA',
    createdAt: new Date('2024-03-10'),
  },
  client: {
    id: 'client-1',
    name: 'Emily Chen',
    email: 'emily.chen@westfield.com.au',
    role: 'client',
    buildings: ['1'],
    createdAt: new Date('2024-06-01'),
  },
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(mockUsers.admin);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(mockBuildings[0]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Filter buildings based on user access
  const accessibleBuildings = currentUser
    ? mockBuildings.filter((b) => currentUser.buildings.includes(b.id))
    : [];

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
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

export { mockUsers, mockBuildings };
