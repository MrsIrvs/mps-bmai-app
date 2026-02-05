import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  Users,
  BarChart3,
  Settings,
  Wrench,
  ChevronDown,
  LogOut,
  Menu,
  Building2,
  HardHat,
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import mpsLogo from '@/assets/mps-logo.png';

const navigation = {
  admin: [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'AI Assistant', href: '/chat', icon: MessageSquare },
    { name: 'Documents', href: '/documents', icon: FileText },
    { name: 'Service Requests', href: '/service-requests', icon: Wrench },
    { name: 'Contractors', href: '/contractors', icon: HardHat },
    { name: 'Buildings', href: '/buildings', icon: Building2 },
    { name: 'User Management', href: '/users', icon: Users },
    { name: 'Reports', href: '/reports', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ],
  technician: [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'AI Assistant', href: '/chat', icon: MessageSquare },
    { name: 'Documents', href: '/documents', icon: FileText },
    { name: 'Service Requests', href: '/service-requests', icon: Wrench },
  ],
  client: [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'AI Assistant', href: '/chat', icon: MessageSquare },
    { name: 'Documents', href: '/documents', icon: FileText },
    { name: 'Service Requests', href: '/service-requests', icon: Wrench },
    { name: 'Contractors', href: '/contractors', icon: HardHat },
  ],
};

const roleLabels = {
  admin: 'Administrator',
  technician: 'Technician',
  client: 'Facilities Manager',
};

const roleBadgeClass = {
  admin: 'role-badge-admin',
  technician: 'role-badge-technician',
  client: 'role-badge-client',
};

export function AppSidebar() {
  const location = useLocation();
  const { selectedBuilding, buildings, setSelectedBuilding, sidebarOpen, setSidebarOpen } = useApp();
  const { profile, role, signOut } = useAuth();

  if (!profile || !role) return null;

  const navItems = navigation[role];

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <>
      {/* Mobile toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        className={cn(
          'fixed left-0 top-0 z-50 h-screen w-[min(280px,85vw)] flex flex-col',
          'bg-sidebar text-sidebar-foreground',
          'border-r border-sidebar-border',
          'lg:w-[280px] lg:translate-x-0 lg:static'
        )}
        style={{ background: 'var(--gradient-sidebar)' }}
      >
        {/* MPS Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
          <img src={mpsLogo} alt="MPS Logo" className="h-10 w-auto" />
          <div>
            <h1 className="font-heading font-semibold text-lg tracking-tight">BMAI</h1>
            <p className="text-xs text-sidebar-foreground/60">Building Manager AI</p>
          </div>
        </div>

        {/* Building Selector */}
        <div className="px-4 py-4 border-b border-sidebar-border">
          <p className="text-xs font-medium text-sidebar-foreground/60 mb-2 px-2">ACTIVE BUILDING</p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between text-left h-auto py-3 px-3 bg-sidebar-accent hover:bg-sidebar-accent/80"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={cn('status-dot', `status-${selectedBuilding?.status}`)} />
                  <div className="min-w-0">
                    <p className="font-medium truncate text-sm">{selectedBuilding?.name}</p>
                    <p className="text-xs text-sidebar-foreground/60 truncate">
                      {selectedBuilding?.address}
                    </p>
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[min(248px,calc(85vw-2rem))]">
              {buildings.map((building) => (
                <DropdownMenuItem
                  key={building.id}
                  onClick={() => setSelectedBuilding(building)}
                  className="flex items-center gap-3 py-3"
                >
                  <div className={cn('status-dot', `status-${building.status}`)} />
                  <div className="min-w-0">
                    <p className="font-medium truncate">{building.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{building.region}</p>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                        : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Profile */}
        <div className="px-4 py-4 border-t border-sidebar-border">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start text-left h-auto py-3 px-3 hover:bg-sidebar-accent"
              >
                <Avatar className="h-9 w-9 mr-3">
                  <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-sm">
                    {profile.full_name.split(' ').map((n) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm truncate">{profile.full_name}</p>
                  <Badge variant="secondary" className={cn('text-xs mt-1', roleBadgeClass[role])}>
                    {roleLabels[role]}
                  </Badge>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[min(248px,calc(85vw-2rem))]">
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Account Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.aside>
    </>
  );
}
