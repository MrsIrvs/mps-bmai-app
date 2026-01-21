import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  Search,
  MoreVertical,
  Edit,
  Archive,
  Plus,
  MapPin,
  Loader2,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
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
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useApp } from '@/contexts/AppContext';
import { toast } from 'sonner';
import { z } from 'zod';

// Validation schema
const buildingSchema = z.object({
  name: z.string().trim().min(1, 'Building name is required').max(100, 'Name must be less than 100 characters'),
  address: z.string().trim().max(255, 'Address must be less than 255 characters').optional(),
  region: z.string().min(1, 'Region is required'),
  status: z.enum(['active', 'inactive']),
  notes: z.string().trim().max(1000, 'Notes must be less than 1000 characters').optional(),
});

type BuildingFormData = z.infer<typeof buildingSchema>;

interface Building {
  id: string;
  name: string;
  address: string | null;
  region: string;
  status: 'active' | 'inactive';
  notes: string | null;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

const REGIONS = ['WA', 'NSW', 'VIC', 'QLD', 'SA', 'TAS', 'NT', 'ACT'];

const statusConfig = {
  active: { label: 'Active', className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  inactive: { label: 'Inactive', className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
};

export function BuildingManagement() {
  const { role: currentUserRole } = useAuth();
  const { refreshBuildings } = useApp();
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRegion, setFilterRegion] = useState<string>('all');
  const [showArchived, setShowArchived] = useState(false);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState<Building | null>(null);
  const [formData, setFormData] = useState<BuildingFormData>({
    name: '',
    address: '',
    region: '',
    status: 'active',
    notes: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // Fetch buildings
  const fetchBuildings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('buildings')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching buildings:', error);
        toast.error('Failed to load buildings');
        return;
      }

      // Cast the data to ensure proper typing
      const typedData: Building[] = (data || []).map((b) => ({
        id: b.id,
        name: b.name,
        address: b.address,
        region: b.region,
        status: b.status as 'active' | 'inactive',
        notes: b.notes,
        is_archived: b.is_archived,
        created_at: b.created_at,
        updated_at: b.updated_at,
      }));

      setBuildings(typedData);
    } catch (err) {
      console.error('Error fetching buildings:', err);
      toast.error('Failed to load buildings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuildings();
  }, []);

  // Filter buildings
  const filteredBuildings = buildings.filter((building) => {
    const matchesSearch =
      building.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (building.address?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesRegion = filterRegion === 'all' || building.region === filterRegion;
    const matchesArchived = showArchived ? building.is_archived : !building.is_archived;
    return matchesSearch && matchesRegion && matchesArchived;
  });

  // Region counts
  const regionCounts = REGIONS.reduce((acc, region) => {
    acc[region] = buildings.filter((b) => b.region === region && !b.is_archived).length;
    return acc;
  }, {} as Record<string, number>);

  // Open dialog for new building
  const handleAddBuilding = () => {
    setEditingBuilding(null);
    setFormData({
      name: '',
      address: '',
      region: '',
      status: 'active',
      notes: '',
    });
    setFormErrors({});
    setDialogOpen(true);
  };

  // Open dialog for editing
  const handleEditBuilding = (building: Building) => {
    setEditingBuilding(building);
    setFormData({
      name: building.name,
      address: building.address || '',
      region: building.region,
      status: building.status,
      notes: building.notes || '',
    });
    setFormErrors({});
    setDialogOpen(true);
  };

  // Save building
  const handleSave = async () => {
    // Validate form
    const result = buildingSchema.safeParse(formData);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message;
        }
      });
      setFormErrors(errors);
      return;
    }

    try {
      setSaving(true);
      setFormErrors({});

      const buildingData = {
        name: result.data.name,
        address: result.data.address || null,
        region: result.data.region,
        status: result.data.status,
        notes: result.data.notes || null,
      };

      if (editingBuilding) {
        // Update existing building
        const { error } = await supabase
          .from('buildings')
          .update(buildingData)
          .eq('id', editingBuilding.id);

        if (error) {
          console.error('Error updating building:', error);
          toast.error('Failed to update building');
          return;
        }

        toast.success('Building updated successfully');
      } else {
        // Create new building
        const { error } = await supabase.from('buildings').insert(buildingData);

        if (error) {
          console.error('Error creating building:', error);
          toast.error('Failed to create building');
          return;
        }

        toast.success('Building created successfully');
      }

      setDialogOpen(false);
      setEditingBuilding(null);
      fetchBuildings();
      refreshBuildings();
    } catch (err) {
      console.error('Error saving building:', err);
      toast.error('Failed to save building');
    } finally {
      setSaving(false);
    }
  };

  // Archive/unarchive building
  const handleArchive = async (building: Building, archive: boolean) => {
    try {
      const { error } = await supabase
        .from('buildings')
        .update({ is_archived: archive })
        .eq('id', building.id);

      if (error) {
        console.error('Error archiving building:', error);
        toast.error(`Failed to ${archive ? 'archive' : 'restore'} building`);
        return;
      }

      toast.success(`Building ${archive ? 'archived' : 'restored'} successfully`);
      fetchBuildings();
      refreshBuildings();
    } catch (err) {
      console.error('Error archiving building:', err);
      toast.error(`Failed to ${archive ? 'archive' : 'restore'} building`);
    }
  };

  // Access control
  if (currentUserRole !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
        <p className="text-muted-foreground">
          You need administrator privileges to manage buildings.
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
              placeholder="Search buildings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterRegion} onValueChange={setFilterRegion}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              {REGIONS.map((region) => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              id="show-archived"
              checked={showArchived}
              onCheckedChange={setShowArchived}
            />
            <Label htmlFor="show-archived" className="text-sm text-muted-foreground">
              Show archived
            </Label>
          </div>
          <Button onClick={handleAddBuilding} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Building
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {REGIONS.map((region) => (
          <div
            key={region}
            className={cn(
              'bg-card rounded-xl border border-border p-3 text-center cursor-pointer transition-colors',
              filterRegion === region && 'border-primary bg-primary/5'
            )}
            onClick={() => setFilterRegion(filterRegion === region ? 'all' : region)}
          >
            <p className="text-lg font-bold">{regionCounts[region] || 0}</p>
            <p className="text-xs text-muted-foreground">{region}</p>
          </div>
        ))}
      </div>

      {/* Building List */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                  Building
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                  Region
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                  Status
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                  Created
                </th>
                <th className="w-10 px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredBuildings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    {showArchived ? 'No archived buildings found' : 'No buildings found'}
                  </td>
                </tr>
              ) : (
                filteredBuildings.map((building, index) => {
                  const status = statusConfig[building.status];
                  return (
                    <motion.tr
                      key={building.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.03 }}
                      className={cn(
                        'hover:bg-muted/30 transition-colors',
                        building.is_archived && 'opacity-60'
                      )}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                            <Building2 className="h-5 w-5 text-accent" />
                          </div>
                          <div>
                            <p className="font-medium">{building.name}</p>
                            {building.address && (
                              <p className="text-sm text-muted-foreground truncate max-w-xs">
                                {building.address}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          {building.region}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Badge className={cn('text-xs', status.className)}>
                            {status.label}
                          </Badge>
                          {building.is_archived && (
                            <Badge variant="outline" className="text-xs">
                              Archived
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(building.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditBuilding(building)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            {building.is_archived ? (
                              <DropdownMenuItem onClick={() => handleArchive(building, false)}>
                                <RotateCcw className="mr-2 h-4 w-4" />
                                Restore
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() => handleArchive(building, true)}
                                className="text-destructive"
                              >
                                <Archive className="mr-2 h-4 w-4" />
                                Archive
                              </DropdownMenuItem>
                            )}
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

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingBuilding ? 'Edit Building' : 'Add New Building'}
            </DialogTitle>
            <DialogDescription>
              {editingBuilding
                ? 'Update the building details below.'
                : 'Enter the details for the new building.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Building Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Enter building name"
                className={formErrors.name ? 'border-destructive' : ''}
              />
              {formErrors.name && (
                <p className="text-xs text-destructive">{formErrors.name}</p>
              )}
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                placeholder="Enter building address"
                className={formErrors.address ? 'border-destructive' : ''}
              />
              {formErrors.address && (
                <p className="text-xs text-destructive">{formErrors.address}</p>
              )}
            </div>

            {/* Region */}
            <div className="space-y-2">
              <Label htmlFor="region">
                Region <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.region}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, region: value }))}
              >
                <SelectTrigger className={formErrors.region ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {REGIONS.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.region && (
                <p className="text-xs text-destructive">{formErrors.region}</p>
              )}
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'active' | 'inactive') =>
                  setFormData((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                placeholder="Optional notes about this building"
                rows={3}
                className={formErrors.notes ? 'border-destructive' : ''}
              />
              {formErrors.notes && (
                <p className="text-xs text-destructive">{formErrors.notes}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingBuilding ? 'Save Changes' : 'Add Building'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
