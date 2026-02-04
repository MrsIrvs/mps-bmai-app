import { useState, useEffect } from 'react';
import { Loader2, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { z } from 'zod';
import {
  useCreateContractor,
  useUpdateContractor,
  ContractorWithBuildings,
  EquipmentCategory,
} from '@/hooks/useContractors';

const CATEGORIES: EquipmentCategory[] = ['HVAC', 'Electrical', 'Fire', 'Plumbing', 'Hydraulic', 'Security', 'Lift', 'Other'];

// Validation schema
const contractorSchema = z.object({
  name: z.string().trim().min(1, 'Company name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().trim().email('Invalid email address'),
  phone: z.string().trim().max(20, 'Phone must be less than 20 characters').optional(),
  contact_name: z.string().trim().max(100, 'Contact name must be less than 100 characters').optional(),
  specialties: z.array(z.enum(['HVAC', 'Electrical', 'Fire', 'Plumbing', 'Hydraulic', 'Security', 'Lift', 'Other'])),
  emergency_available: z.boolean(),
  rating: z.number().min(0).max(5).nullable(),
  notes: z.string().trim().max(1000, 'Notes must be less than 1000 characters').optional(),
});

type ContractorFormData = z.infer<typeof contractorSchema>;

interface ContractorDialogProps {
  open: boolean;
  onClose: () => void;
  contractor: ContractorWithBuildings | null;
}

function RatingSelector({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (rating: number | null) => void;
}) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className="p-0.5 focus:outline-none"
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(null)}
          onClick={() => onChange(value === star ? null : star)}
        >
          <Star
            className={cn(
              'h-6 w-6 transition-colors',
              (hoverRating !== null ? star <= hoverRating : value !== null && star <= value)
                ? 'fill-amber-400 text-amber-400'
                : 'text-muted-foreground/30 hover:text-amber-300'
            )}
          />
        </button>
      ))}
      {value !== null && (
        <span className="ml-2 text-sm text-muted-foreground">{value}/5</span>
      )}
      {value !== null && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="ml-2 h-6 px-2 text-xs"
          onClick={() => onChange(null)}
        >
          Clear
        </Button>
      )}
    </div>
  );
}

export function ContractorDialog({ open, onClose, contractor }: ContractorDialogProps) {
  const [formData, setFormData] = useState<ContractorFormData>({
    name: '',
    email: '',
    phone: '',
    contact_name: '',
    specialties: [],
    emergency_available: false,
    rating: null,
    notes: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const createMutation = useCreateContractor();
  const updateMutation = useUpdateContractor();
  const isEditing = !!contractor;
  const isSaving = createMutation.isPending || updateMutation.isPending;

  // Reset form when dialog opens/closes or contractor changes
  useEffect(() => {
    if (open) {
      if (contractor) {
        setFormData({
          name: contractor.name,
          email: contractor.email,
          phone: contractor.phone || '',
          contact_name: contractor.contact_name || '',
          specialties: contractor.specialties || [],
          emergency_available: contractor.emergency_available,
          rating: contractor.rating,
          notes: contractor.notes || '',
        });
      } else {
        setFormData({
          name: '',
          email: '',
          phone: '',
          contact_name: '',
          specialties: [],
          emergency_available: false,
          rating: null,
          notes: '',
        });
      }
      setFormErrors({});
    }
  }, [open, contractor]);

  const toggleSpecialty = (specialty: EquipmentCategory) => {
    setFormData((prev) => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter((s) => s !== specialty)
        : [...prev.specialties, specialty],
    }));
  };

  const handleSave = async () => {
    // Validate form
    const result = contractorSchema.safeParse(formData);
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
      setFormErrors({});

      if (isEditing && contractor) {
        await updateMutation.mutateAsync({
          contractorId: contractor.id,
          updates: {
            name: result.data.name,
            email: result.data.email,
            phone: result.data.phone || null,
            contact_name: result.data.contact_name || null,
            specialties: result.data.specialties,
            emergency_available: result.data.emergency_available,
            rating: result.data.rating,
            notes: result.data.notes || null,
          },
        });
        toast.success('Contractor updated successfully');
      } else {
        await createMutation.mutateAsync({
          name: result.data.name,
          email: result.data.email,
          phone: result.data.phone || undefined,
          contact_name: result.data.contact_name || undefined,
          specialties: result.data.specialties,
          emergency_available: result.data.emergency_available,
          rating: result.data.rating ?? undefined,
          notes: result.data.notes || undefined,
        });
        toast.success('Contractor created successfully');
      }

      onClose();
    } catch (err) {
      console.error('Error saving contractor:', err);
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} contractor`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Contractor' : 'Add New Contractor'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the contractor details below.'
              : 'Enter the details for the new contractor.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Company Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Company Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Enter company name"
              className={formErrors.name ? 'border-destructive' : ''}
            />
            {formErrors.name && (
              <p className="text-xs text-destructive">{formErrors.name}</p>
            )}
          </div>

          {/* Contact Name */}
          <div className="space-y-2">
            <Label htmlFor="contact_name">Contact Person</Label>
            <Input
              id="contact_name"
              value={formData.contact_name}
              onChange={(e) => setFormData((prev) => ({ ...prev, contact_name: e.target.value }))}
              placeholder="Primary contact name"
              className={formErrors.contact_name ? 'border-destructive' : ''}
            />
            {formErrors.contact_name && (
              <p className="text-xs text-destructive">{formErrors.contact_name}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="contact@company.com"
              className={formErrors.email ? 'border-destructive' : ''}
            />
            {formErrors.email && (
              <p className="text-xs text-destructive">{formErrors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
              placeholder="+61 4XX XXX XXX"
              className={formErrors.phone ? 'border-destructive' : ''}
            />
            {formErrors.phone && (
              <p className="text-xs text-destructive">{formErrors.phone}</p>
            )}
          </div>

          {/* Specialties */}
          <div className="space-y-2">
            <Label>Specialties</Label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((category) => (
                <div
                  key={category}
                  className={cn(
                    'flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors',
                    formData.specialties.includes(category)
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-muted/50'
                  )}
                  onClick={() => toggleSpecialty(category)}
                >
                  <Checkbox
                    checked={formData.specialties.includes(category)}
                    onCheckedChange={() => toggleSpecialty(category)}
                  />
                  <span className="text-sm">{category}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Available */}
          <div className="flex items-center justify-between p-3 rounded-lg border border-border">
            <div>
              <Label htmlFor="emergency">Emergency Available</Label>
              <p className="text-xs text-muted-foreground">
                Available for emergency call-outs
              </p>
            </div>
            <Switch
              id="emergency"
              checked={formData.emergency_available}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, emergency_available: checked }))
              }
            />
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <Label>Rating</Label>
            <RatingSelector
              value={formData.rating}
              onChange={(rating) => setFormData((prev) => ({ ...prev, rating }))}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Internal Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Optional notes about this contractor"
              rows={3}
              className={formErrors.notes ? 'border-destructive' : ''}
            />
            {formErrors.notes && (
              <p className="text-xs text-destructive">{formErrors.notes}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Save Changes' : 'Add Contractor'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
