import { useState, useEffect } from 'react';
import { Building2, Loader2, Search, Star, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { useApp } from '@/contexts/AppContext';
import {
  useAssignContractorToBuilding,
  useRemoveContractorFromBuilding,
  useSetPreferredContractor,
  ContractorWithBuildings,
} from '@/hooks/useContractors';

interface AssignBuildingsDialogProps {
  open: boolean;
  onClose: () => void;
  contractor: ContractorWithBuildings | null;
}

interface BuildingAssignment {
  building_id: string;
  building_name: string;
  is_assigned: boolean;
  is_preferred: boolean;
}

export function AssignBuildingsDialog({ open, onClose, contractor }: AssignBuildingsDialogProps) {
  const { buildings } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [assignments, setAssignments] = useState<BuildingAssignment[]>([]);
  const [pendingChanges, setPendingChanges] = useState<Map<string, { assign: boolean; preferred: boolean }>>(new Map());
  const [saving, setSaving] = useState(false);

  const assignMutation = useAssignContractorToBuilding();
  const removeMutation = useRemoveContractorFromBuilding();
  const preferredMutation = useSetPreferredContractor();

  // Initialize assignments when dialog opens
  useEffect(() => {
    if (open && contractor) {
      const assignedBuildingIds = new Set(
        contractor.building_assignments?.map((a) => a.building_id) || []
      );
      const preferredBuildingIds = new Set(
        contractor.building_assignments
          ?.filter((a) => a.is_preferred)
          .map((a) => a.building_id) || []
      );

      const buildingAssignments: BuildingAssignment[] = buildings
        .filter((b) => !b.is_archived)
        .map((building) => ({
          building_id: building.id,
          building_name: building.name,
          is_assigned: assignedBuildingIds.has(building.id),
          is_preferred: preferredBuildingIds.has(building.id),
        }));

      setAssignments(buildingAssignments);
      setPendingChanges(new Map());
      setSearchQuery('');
    }
  }, [open, contractor, buildings]);

  // Filter buildings by search
  const filteredAssignments = assignments.filter((a) =>
    a.building_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get current state (original + pending changes)
  const getCurrentState = (buildingId: string) => {
    const original = assignments.find((a) => a.building_id === buildingId);
    const pending = pendingChanges.get(buildingId);

    if (pending) {
      return {
        is_assigned: pending.assign,
        is_preferred: pending.preferred,
      };
    }

    return {
      is_assigned: original?.is_assigned || false,
      is_preferred: original?.is_preferred || false,
    };
  };

  // Toggle assignment
  const toggleAssignment = (buildingId: string) => {
    const original = assignments.find((a) => a.building_id === buildingId);
    const current = getCurrentState(buildingId);
    const newAssigned = !current.is_assigned;

    setPendingChanges((prev) => {
      const next = new Map(prev);
      if (newAssigned === original?.is_assigned && !current.is_preferred) {
        // Revert to original state
        next.delete(buildingId);
      } else {
        next.set(buildingId, {
          assign: newAssigned,
          preferred: newAssigned ? current.is_preferred : false,
        });
      }
      return next;
    });
  };

  // Toggle preferred
  const togglePreferred = (buildingId: string) => {
    const original = assignments.find((a) => a.building_id === buildingId);
    const current = getCurrentState(buildingId);

    if (!current.is_assigned) return;

    const newPreferred = !current.is_preferred;

    setPendingChanges((prev) => {
      const next = new Map(prev);
      if (newPreferred === original?.is_preferred && current.is_assigned === original?.is_assigned) {
        next.delete(buildingId);
      } else {
        next.set(buildingId, {
          assign: current.is_assigned,
          preferred: newPreferred,
        });
      }
      return next;
    });
  };

  // Save changes
  const handleSave = async () => {
    if (!contractor || pendingChanges.size === 0) {
      onClose();
      return;
    }

    setSaving(true);

    try {
      for (const [buildingId, change] of pendingChanges) {
        const original = assignments.find((a) => a.building_id === buildingId);

        if (change.assign && !original?.is_assigned) {
          // Add assignment
          await assignMutation.mutateAsync({
            contractorId: contractor.id,
            buildingId,
            isPreferred: change.preferred,
          });
        } else if (!change.assign && original?.is_assigned) {
          // Remove assignment
          await removeMutation.mutateAsync({
            contractorId: contractor.id,
            buildingId,
          });
        } else if (change.assign && original?.is_assigned && change.preferred !== original.is_preferred) {
          // Update preferred status
          if (change.preferred) {
            await preferredMutation.mutateAsync({
              contractorId: contractor.id,
              buildingId,
            });
          }
        }
      }

      toast.success('Building assignments updated');
      onClose();
    } catch (err) {
      console.error('Error updating assignments:', err);
      toast.error('Failed to update building assignments');
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = pendingChanges.size > 0;
  const assignedCount = assignments.filter((a) => getCurrentState(a.building_id).is_assigned).length;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Buildings</DialogTitle>
          <DialogDescription>
            Select buildings that {contractor?.name} services.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search buildings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {assignedCount} of {assignments.length} buildings assigned
            </span>
            {hasChanges && (
              <Badge variant="outline" className="text-xs">
                Unsaved changes
              </Badge>
            )}
          </div>

          {/* Building List */}
          <ScrollArea className="h-[300px] rounded-lg border">
            <div className="divide-y">
              {filteredAssignments.length === 0 ? (
                <div className="px-4 py-8 text-center text-muted-foreground text-sm">
                  No buildings found
                </div>
              ) : (
                filteredAssignments.map((assignment) => {
                  const state = getCurrentState(assignment.building_id);
                  const hasChange = pendingChanges.has(assignment.building_id);

                  return (
                    <div
                      key={assignment.building_id}
                      className={cn(
                        'flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors',
                        hasChange && 'bg-accent/5'
                      )}
                    >
                      <Checkbox
                        checked={state.is_assigned}
                        onCheckedChange={() => toggleAssignment(assignment.building_id)}
                      />
                      <div
                        className="flex-1 min-w-0 cursor-pointer"
                        onClick={() => toggleAssignment(assignment.building_id)}
                      >
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="font-medium truncate">
                            {assignment.building_name}
                          </span>
                        </div>
                      </div>
                      {state.is_assigned && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className={cn(
                            'h-7 px-2 gap-1',
                            state.is_preferred && 'text-amber-600'
                          )}
                          onClick={() => togglePreferred(assignment.building_id)}
                        >
                          <Star
                            className={cn(
                              'h-3.5 w-3.5',
                              state.is_preferred
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-muted-foreground'
                            )}
                          />
                          <span className="text-xs">
                            {state.is_preferred ? 'Preferred' : 'Set preferred'}
                          </span>
                        </Button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving || !hasChanges}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
