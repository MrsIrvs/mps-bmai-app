import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Search,
  MoreVertical,
  Edit,
  Shield,
  Building2,
  Mail,
  MapPin,
  Loader2,
  AlertCircle,
  Check,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

type AppRole = 'admin' | 'technician' | 'client';

interface UserWithRole {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  buildings: string[];
  region: string | null;
  created_at: string;
  role: AppRole;
}

const roleConfig: Record<AppRole, { label: string; className: string }> = {
  admin: { label: 'Administrator', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  technician: { label: 'Technician', className: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400' },
  client: { label: 'Facilities Manager', className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
};

// Available regions for technicians
const REGIONS = ['WA', 'VIC', 'NSW', 'QLD', 'SA', 'TAS', 'NT', 'ACT'];

// Placeholder buildings until buildings table exists
const AVAILABLE_BUILDINGS = [
  { id: 'building-1', name: 'Perth CBD Tower' },
  { id: 'building-2', name: 'Fremantle Maritime Centre' },
  { id: 'building-3', name: 'Melbourne Central Plaza' },
  { id: 'building-4', name: 'Sydney Opera Complex' },
  { id: 'building-5', name: 'Brisbane Riverside Centre' },
];

export function UserManagement() {
  const { role: currentUserRole } = useAuth();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  
  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserWithRole | null>(null);
  const [editForm, setEditForm] = useState({
    role: '' as AppRole,
    region: '',
    buildings: [] as string[],
  });
  const [saving, setSaving] = useState(false);

  // Fetch users with their roles
  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        toast.error('Failed to load users');
        return;
      }

      // Fetch roles for all users
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) {
        console.error('Error fetching roles:', rolesError);
        toast.error('Failed to load user roles');
        return;
      }

      // Create a map of user_id to role
      const roleMap = new Map(roles?.map(r => [r.user_id, r.role as AppRole]) || []);

      // Combine profiles with roles
      const usersWithRoles: UserWithRole[] = (profiles || []).map(profile => ({
        id: profile.id,
        user_id: profile.user_id,
        full_name: profile.full_name,
        email: profile.email,
        buildings: profile.buildings || [],
        region: profile.region,
        created_at: profile.created_at,
        role: roleMap.get(profile.user_id) || 'client',
      }));

      setUsers(usersWithRoles);
    } catch (err) {
      console.error('Error fetching users:', err);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search and role filter
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  // Role counts for stats
  const roleCounts = {
    admin: users.filter(u => u.role === 'admin').length,
    technician: users.filter(u => u.role === 'technician').length,
    client: users.filter(u => u.role === 'client').length,
  };

  // Open edit dialog
  const handleEditUser = (user: UserWithRole) => {
    setEditingUser(user);
    setEditForm({
      role: user.role,
      region: user.region || '',
      buildings: user.buildings || [],
    });
    setEditDialogOpen(true);
  };

  // Save user changes
  const handleSaveUser = async () => {
    if (!editingUser) return;

    try {
      setSaving(true);

      // Update role in user_roles table
      const { error: roleError } = await supabase
        .from('user_roles')
        .update({ role: editForm.role })
        .eq('user_id', editingUser.user_id);

      if (roleError) {
        console.error('Error updating role:', roleError);
        toast.error('Failed to update role');
        return;
      }

      // Update profile (region and buildings)
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          region: editForm.role === 'technician' ? editForm.region : null,
          buildings: editForm.role === 'client' ? editForm.buildings : [],
        })
        .eq('user_id', editingUser.user_id);

      if (profileError) {
        console.error('Error updating profile:', profileError);
        toast.error('Failed to update profile');
        return;
      }

      toast.success('User updated successfully');
      setEditDialogOpen(false);
      setEditingUser(null);
      fetchUsers(); // Refresh the list
    } catch (err) {
      console.error('Error saving user:', err);
      toast.error('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  // Toggle building in selection
  const toggleBuilding = (buildingId: string) => {
    setEditForm(prev => ({
      ...prev,
      buildings: prev.buildings.includes(buildingId)
        ? prev.buildings.filter(id => id !== buildingId)
        : [...prev.buildings, buildingId],
    }));
  };

  // Check if current user is admin
  if (currentUserRole !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
        <p className="text-muted-foreground">
          You need administrator privileges to manage users.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Administrators</SelectItem>
              <SelectItem value="technician">Technicians</SelectItem>
              <SelectItem value="client">Facilities Managers</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Administrators', count: roleCounts.admin, color: 'blue' },
          { label: 'Technicians', count: roleCounts.technician, color: 'cyan' },
          { label: 'Facilities Managers', count: roleCounts.client, color: 'green' },
        ].map((stat) => (
          <div key={stat.label} className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                'flex h-10 w-10 items-center justify-center rounded-lg',
                stat.color === 'blue' && 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
                stat.color === 'cyan' && 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
                stat.color === 'green' && 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
              )}>
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.count}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* User List */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                  User
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                  Role
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                  Access
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                  Created
                </th>
                <th className="w-10 px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => {
                  const role = roleConfig[user.role];
                  return (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.03 }}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                              {user.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.full_name}</p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={cn('text-xs', role.className)}>
                          {role.label}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          {user.role === 'admin' ? (
                            <span className="flex items-center gap-1">
                              <Shield className="h-4 w-4" />
                              All Access
                            </span>
                          ) : user.role === 'technician' ? (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {user.region || 'No region assigned'}
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <Building2 className="h-4 w-4" />
                              {user.buildings.length} building{user.buildings.length !== 1 && 's'}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditUser(user)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditUser(user)}>
                              <Shield className="mr-2 h-4 w-4" />
                              Manage Permissions
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update role and access permissions for {editingUser?.full_name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* User Info */}
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {editingUser?.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{editingUser?.full_name}</p>
                <p className="text-sm text-muted-foreground">{editingUser?.email}</p>
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <Label>Role</Label>
              <Select 
                value={editForm.role} 
                onValueChange={(value: AppRole) => setEditForm(prev => ({ ...prev, role: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">
                    <span className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-blue-600" />
                      Administrator
                    </span>
                  </SelectItem>
                  <SelectItem value="technician">
                    <span className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-cyan-600" />
                      Technician
                    </span>
                  </SelectItem>
                  <SelectItem value="client">
                    <span className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-green-600" />
                      Facilities Manager
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Region Selection for Technicians */}
            {editForm.role === 'technician' && (
              <div className="space-y-2">
                <Label>Assigned Region</Label>
                <Select 
                  value={editForm.region} 
                  onValueChange={(value) => setEditForm(prev => ({ ...prev, region: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    {REGIONS.map(region => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Technicians can access all buildings within their assigned region.
                </p>
              </div>
            )}

            {/* Building Selection for Clients */}
            {editForm.role === 'client' && (
              <div className="space-y-2">
                <Label>Assigned Buildings</Label>
                <div className="border rounded-lg divide-y max-h-48 overflow-y-auto">
                  {AVAILABLE_BUILDINGS.map(building => (
                    <div 
                      key={building.id} 
                      className="flex items-center gap-3 p-3 hover:bg-muted/50 cursor-pointer"
                      onClick={() => toggleBuilding(building.id)}
                    >
                      <Checkbox 
                        checked={editForm.buildings.includes(building.id)}
                        onCheckedChange={() => toggleBuilding(building.id)}
                      />
                      <span className="text-sm">{building.name}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Facilities Managers can only access their assigned buildings.
                </p>
              </div>
            )}

            {/* Admin Info */}
            {editForm.role === 'admin' && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  Administrators have full access to all buildings, user management, and system settings.
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <Button 
              variant="outline" 
              onClick={() => setEditDialogOpen(false)}
              disabled={saving}
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button 
              onClick={handleSaveUser}
              disabled={saving}
              className="bg-accent hover:bg-accent/90"
            >
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Check className="mr-2 h-4 w-4" />
              )}
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
