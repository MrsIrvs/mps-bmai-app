import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  HardHat,
  Search,
  MoreVertical,
  Edit,
  Archive,
  Plus,
  Loader2,
  AlertCircle,
  RotateCcw,
  Phone,
  Mail,
  Star,
  Building2,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import {
  useContractorsWithBuildings,
  useArchiveContractor,
  useRestoreContractor,
  ContractorWithBuildings,
  EquipmentCategory,
} from '@/hooks/useContractors';
import { ContractorDialog } from './ContractorDialog';
import { AssignBuildingsDialog } from './AssignBuildingsDialog';

const CATEGORIES: EquipmentCategory[] = ['HVAC', 'Electrical', 'Fire', 'Plumbing', 'Hydraulic', 'Security', 'Lift', 'Other'];

const specialtyConfig: Record<EquipmentCategory, { className: string }> = {
  HVAC: { className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  Electrical: { className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  Fire: { className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  Plumbing: { className: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400' },
  Hydraulic: { className: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  Security: { className: 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400' },
  Lift: { className: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' },
  Other: { className: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400' },
};

function StarRating({ rating }: { rating: number | null }) {
  if (rating === null) return <span className="text-muted-foreground text-sm">-</span>;

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={cn(
            'h-3.5 w-3.5',
            i < fullStars
              ? 'fill-amber-400 text-amber-400'
              : i === fullStars && hasHalfStar
              ? 'fill-amber-400/50 text-amber-400'
              : 'text-muted-foreground/30'
          )}
        />
      ))}
      <span className="ml-1 text-sm text-muted-foreground">({rating.toFixed(1)})</span>
    </div>
  );
}

export function ContractorManagement() {
  const { role: currentUserRole } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState<string>('all');
  const [showArchived, setShowArchived] = useState(false);

  // Dialog state
  const [contractorDialogOpen, setContractorDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [editingContractor, setEditingContractor] = useState<ContractorWithBuildings | null>(null);
  const [assigningContractor, setAssigningContractor] = useState<ContractorWithBuildings | null>(null);

  // Fetch data
  const { data: contractors = [], isLoading, error, refetch } = useContractorsWithBuildings({
    includeArchived: showArchived,
  });

  const archiveMutation = useArchiveContractor();
  const restoreMutation = useRestoreContractor();

  // Filter contractors
  const filteredContractors = contractors.filter((contractor) => {
    const matchesSearch =
      contractor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contractor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (contractor.contact_name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesSpecialty =
      filterSpecialty === 'all' ||
      contractor.specialties?.includes(filterSpecialty as EquipmentCategory);
    const matchesArchived = showArchived ? contractor.is_archived : !contractor.is_archived;
    return matchesSearch && matchesSpecialty && matchesArchived;
  });

  // Specialty counts
  const specialtyCounts = CATEGORIES.reduce((acc, category) => {
    acc[category] = contractors.filter(
      (c) => !c.is_archived && c.specialties?.includes(category)
    ).length;
    return acc;
  }, {} as Record<EquipmentCategory, number>);

  // Open dialog for new contractor
  const handleAddContractor = () => {
    setEditingContractor(null);
    setContractorDialogOpen(true);
  };

  // Open dialog for editing
  const handleEditContractor = (contractor: ContractorWithBuildings) => {
    setEditingContractor(contractor);
    setContractorDialogOpen(true);
  };

  // Open dialog for building assignment
  const handleAssignBuildings = (contractor: ContractorWithBuildings) => {
    setAssigningContractor(contractor);
    setAssignDialogOpen(true);
  };

  // Archive/restore contractor
  const handleArchive = async (contractor: ContractorWithBuildings, archive: boolean) => {
    try {
      if (archive) {
        await archiveMutation.mutateAsync(contractor.id);
        toast.success('Contractor archived successfully');
      } else {
        await restoreMutation.mutateAsync(contractor.id);
        toast.success('Contractor restored successfully');
      }
    } catch (err) {
      console.error('Error archiving contractor:', err);
      toast.error(`Failed to ${archive ? 'archive' : 'restore'} contractor`);
    }
  };

  // Dialog close handlers
  const handleContractorDialogClose = () => {
    setContractorDialogOpen(false);
    setEditingContractor(null);
  };

  const handleAssignDialogClose = () => {
    setAssignDialogOpen(false);
    setAssigningContractor(null);
  };

  // Access control - allow admin and client roles
  if (currentUserRole !== 'admin' && currentUserRole !== 'client') {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
        <p className="text-muted-foreground">
          You need administrator or client privileges to manage contractors.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-xl font-semibold mb-2">Error Loading Contractors</h2>
        <p className="text-muted-foreground mb-4">
          {error instanceof Error ? error.message : 'An error occurred'}
        </p>
        <Button onClick={() => refetch()}>Try Again</Button>
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
              placeholder="Search contractors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterSpecialty} onValueChange={setFilterSpecialty}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Specialty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Specialties</SelectItem>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
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
          <Button onClick={handleAddContractor} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Contractor
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {CATEGORIES.map((category) => (
          <div
            key={category}
            className={cn(
              'bg-card rounded-xl border border-border p-3 text-center cursor-pointer transition-colors',
              filterSpecialty === category && 'border-primary bg-primary/5'
            )}
            onClick={() => setFilterSpecialty(filterSpecialty === category ? 'all' : category)}
          >
            <p className="text-lg font-bold">{specialtyCounts[category] || 0}</p>
            <p className="text-xs text-muted-foreground">{category}</p>
          </div>
        ))}
      </div>

      {/* Contractor List */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                  Contractor
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                  Specialties
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                  Contact
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                  Emergency
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                  Rating
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                  Buildings
                </th>
                <th className="w-10 px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredContractors.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                    {showArchived ? 'No archived contractors found' : 'No contractors found'}
                  </td>
                </tr>
              ) : (
                filteredContractors.map((contractor, index) => (
                  <motion.tr
                    key={contractor.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.03 }}
                    className={cn(
                      'hover:bg-muted/30 transition-colors',
                      contractor.is_archived && 'opacity-60'
                    )}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                          <HardHat className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                          <p className="font-medium">{contractor.name}</p>
                          {contractor.contact_name && (
                            <p className="text-sm text-muted-foreground">
                              {contractor.contact_name}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {contractor.specialties && contractor.specialties.length > 0 ? (
                          contractor.specialties.slice(0, 3).map((specialty) => (
                            <Badge
                              key={specialty}
                              className={cn('text-xs', specialtyConfig[specialty]?.className)}
                            >
                              {specialty}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground text-sm">None</span>
                        )}
                        {contractor.specialties && contractor.specialties.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{contractor.specialties.length - 3}
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-sm">
                          <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                          <a
                            href={`mailto:${contractor.email}`}
                            className="text-accent hover:underline"
                          >
                            {contractor.email}
                          </a>
                        </div>
                        {contractor.phone && (
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Phone className="h-3.5 w-3.5" />
                            {contractor.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {contractor.emergency_available ? (
                        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs">
                          Available
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          No
                        </Badge>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <StarRating rating={contractor.rating} />
                    </td>
                    <td className="px-6 py-4">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1.5 cursor-pointer">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">
                              {contractor.building_assignments?.length || 0}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          {contractor.building_assignments && contractor.building_assignments.length > 0 ? (
                            <div className="space-y-1">
                              {contractor.building_assignments.slice(0, 5).map((a) => (
                                <p key={a.building_id} className="text-sm">
                                  {a.building_name}
                                  {a.is_preferred && ' (Preferred)'}
                                </p>
                              ))}
                              {contractor.building_assignments.length > 5 && (
                                <p className="text-sm text-muted-foreground">
                                  +{contractor.building_assignments.length - 5} more
                                </p>
                              )}
                            </div>
                          ) : (
                            <p className="text-sm">No buildings assigned</p>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    </td>
                    <td className="px-6 py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditContractor(contractor)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAssignBuildings(contractor)}>
                            <Building2 className="mr-2 h-4 w-4" />
                            Assign Buildings
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {contractor.is_archived ? (
                            <DropdownMenuItem onClick={() => handleArchive(contractor, false)}>
                              <RotateCcw className="mr-2 h-4 w-4" />
                              Restore
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => handleArchive(contractor, true)}
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dialogs */}
      <ContractorDialog
        open={contractorDialogOpen}
        onClose={handleContractorDialogClose}
        contractor={editingContractor}
      />

      <AssignBuildingsDialog
        open={assignDialogOpen}
        onClose={handleAssignDialogClose}
        contractor={assigningContractor}
      />
    </div>
  );
}
