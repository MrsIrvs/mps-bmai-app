import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  HardHat,
  Search,
  Edit,
  Trash2,
  Plus,
  Loader2,
  AlertCircle,
  RotateCcw,
  Phone,
  Mail,
  User,
  Star,
  Building2,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

const specialtyColors: Record<EquipmentCategory, string> = {
  HVAC: 'bg-purple-100 text-purple-800',
  Electrical: 'bg-yellow-100 text-yellow-800',
  Fire: 'bg-red-100 text-red-800',
  Plumbing: 'bg-cyan-100 text-cyan-800',
  Hydraulic: 'bg-blue-100 text-blue-800',
  Security: 'bg-indigo-100 text-indigo-800',
  Lift: 'bg-gray-100 text-gray-800',
  Other: 'bg-pink-100 text-pink-800',
};

export function ContractorManagement() {
  const { role: currentUserRole } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [showEmergencyOnly, setShowEmergencyOnly] = useState(false);
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
      contractor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contractor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contractor.phone?.includes(searchTerm) ||
      (contractor.contact_name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

    const matchesSpecialty =
      selectedSpecialty === 'all' ||
      contractor.specialties?.includes(selectedSpecialty as EquipmentCategory);

    const matchesEmergency = !showEmergencyOnly || contractor.emergency_available;

    const matchesArchived = showArchived ? contractor.is_archived : !contractor.is_archived;

    return matchesSearch && matchesSpecialty && matchesEmergency && matchesArchived;
  });

  // Open dialog for new contractor
  const handleAddContractor = () => {
    setEditingContractor(null);
    setContractorDialogOpen(true);
  };

  // Open dialog for editing
  const handleEdit = (contractor: ContractorWithBuildings) => {
    setEditingContractor(contractor);
    setContractorDialogOpen(true);
  };

  // Open dialog for building assignment
  const handleAssignBuildings = (contractor: ContractorWithBuildings) => {
    setAssigningContractor(contractor);
    setAssignDialogOpen(true);
  };

  // Archive contractor
  const handleDelete = async (contractor: ContractorWithBuildings) => {
    if (!confirm(`Archive ${contractor.name}? You can restore it later.`)) return;

    try {
      await archiveMutation.mutateAsync(contractor.id);
      toast.success('Contractor archived');
    } catch (err) {
      console.error('Error archiving contractor:', err);
      toast.error('Failed to archive contractor');
    }
  };

  // Restore archived contractor
  const handleRestore = async (contractor: ContractorWithBuildings) => {
    try {
      await restoreMutation.mutateAsync(contractor.id);
      toast.success('Contractor restored');
    } catch (err) {
      console.error('Error restoring contractor:', err);
      toast.error('Failed to restore contractor');
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
      {/* Header with Add Button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <p className="text-muted-foreground">
            {contractors.filter(c => !c.is_archived).length} active contractors
          </p>
        </div>
        <Button onClick={handleAddContractor} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Add Contractor
        </Button>
      </div>

      {/* Filter Bar */}
      <Card className="bg-card shadow-sm">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, contact, phone, or email..."
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
              <SelectTrigger className="md:w-48">
                <SelectValue placeholder="All Specialties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specialties</SelectItem>
                {CATEGORIES.map((specialty) => (
                  <SelectItem key={specialty} value={specialty}>
                    {specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="emergencyFilter"
                  checked={showEmergencyOnly}
                  onCheckedChange={(checked) => setShowEmergencyOnly(checked as boolean)}
                />
                <label htmlFor="emergencyFilter" className="text-sm cursor-pointer">
                  Emergency Only
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="archivedFilter"
                  checked={showArchived}
                  onCheckedChange={(checked) => setShowArchived(checked as boolean)}
                />
                <label htmlFor="archivedFilter" className="text-sm cursor-pointer">
                  Show Archived
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contractor Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContractors.map((contractor, index) => (
          <motion.div
            key={contractor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className={cn(
              'bg-card hover:shadow-lg transition-shadow',
              contractor.is_archived && 'opacity-60'
            )}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg mb-1 truncate">{contractor.name}</CardTitle>
                    {contractor.rating !== null && contractor.rating > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-semibold">{contractor.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(contractor)}
                      className="h-10 w-10"
                    >
                      <Edit className="w-5 h-5" />
                    </Button>
                    {contractor.is_archived ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRestore(contractor)}
                        className="h-10 w-10 text-green-600 hover:text-green-700"
                      >
                        <RotateCcw className="w-5 h-5" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(contractor)}
                        className="h-10 w-10 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Contact Name */}
                  {contractor.contact_name && (
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span className="truncate">{contractor.contact_name}</span>
                    </div>
                  )}

                  {/* Phone */}
                  {contractor.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                      <a href={`tel:${contractor.phone}`} className="text-primary hover:underline">
                        {contractor.phone}
                      </a>
                    </div>
                  )}

                  {/* Email */}
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                    <a
                      href={`mailto:${contractor.email}`}
                      className="text-primary hover:underline truncate"
                    >
                      {contractor.email}
                    </a>
                  </div>

                  {/* Buildings Assigned */}
                  {contractor.building_assignments && contractor.building_assignments.length > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="w-4 h-4 text-muted-foreground shrink-0" />
                      <button
                        onClick={() => handleAssignBuildings(contractor)}
                        className="text-primary hover:underline"
                      >
                        {contractor.building_assignments.length} building{contractor.building_assignments.length !== 1 ? 's' : ''} assigned
                      </button>
                    </div>
                  )}

                  {/* Specialties */}
                  <div className="flex flex-wrap gap-1 pt-2">
                    {contractor.specialties?.map((specialty) => (
                      <Badge
                        key={specialty}
                        variant="outline"
                        className={cn('text-xs', specialtyColors[specialty as EquipmentCategory])}
                      >
                        {specialty}
                      </Badge>
                    ))}
                  </div>

                  {/* Emergency Badge */}
                  {contractor.emergency_available && (
                    <Badge className="bg-red-100 text-red-800 border-red-200">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Emergency Available
                    </Badge>
                  )}

                  {/* Notes Preview */}
                  {contractor.notes && (
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                      {contractor.notes}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredContractors.length === 0 && (
        <div className="text-center py-20">
          <HardHat className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No contractors found</h3>
          <p className="text-muted-foreground">
            {searchTerm || selectedSpecialty !== 'all' || showEmergencyOnly
              ? 'Try adjusting your filters'
              : 'Add your first contractor to get started'}
          </p>
        </div>
      )}

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
