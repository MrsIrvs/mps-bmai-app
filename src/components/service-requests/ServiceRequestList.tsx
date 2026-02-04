import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Wrench,
  Clock,
  CheckCircle2,
  Building2,
  Camera,
  Send,
  ArrowUpRight,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/hooks/useAuth';
import {
  useServiceRequests,
  useCreateServiceRequest,
  ServiceRequestStatus,
} from '@/hooks/useServiceRequests';
import { ServiceRequestPriority, ServiceRequestCategory } from '@/lib/service-request-queries';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const statusConfig: Record<ServiceRequestStatus, { icon: typeof Clock; label: string; className: string }> = {
  pending: { icon: Clock, label: 'Pending', className: 'bg-warning/10 text-warning' },
  dispatched: { icon: ArrowUpRight, label: 'Dispatched', className: 'bg-info/10 text-info' },
  in_progress: { icon: Wrench, label: 'In Progress', className: 'bg-accent/10 text-accent' },
  resolved: { icon: CheckCircle2, label: 'Resolved', className: 'bg-success/10 text-success' },
};

const priorityConfig: Record<ServiceRequestPriority, { label: string; className: string }> = {
  low: { label: 'Low', className: 'bg-muted text-muted-foreground' },
  medium: { label: 'Medium', className: 'bg-warning/10 text-warning' },
  high: { label: 'High', className: 'bg-destructive/10 text-destructive' },
};

const categoryOptions: { value: ServiceRequestCategory; label: string }[] = [
  { value: 'HVAC', label: 'HVAC' },
  { value: 'Electrical', label: 'Electrical' },
  { value: 'Fire', label: 'Fire' },
  { value: 'Plumbing', label: 'Plumbing' },
  { value: 'Hydraulic', label: 'Hydraulic' },
  { value: 'Security', label: 'Security' },
  { value: 'Lift', label: 'Lift' },
  { value: 'Other', label: 'Other' },
];

export function ServiceRequestList() {
  const { selectedBuilding } = useApp();
  const { role } = useAuth();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ServiceRequestCategory>('Other');
  const [priority, setPriority] = useState<ServiceRequestPriority>('medium');

  // Fetch service requests using the hook
  const { data: requests = [], isLoading, error } = useServiceRequests({ includeResolved: true });
  const createMutation = useCreateServiceRequest();

  const handleSubmit = async () => {
    if (!selectedBuilding?.id || !title.trim() || !description.trim()) return;

    try {
      await createMutation.mutateAsync({
        building_id: selectedBuilding.id,
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
      });

      toast({
        title: 'Request submitted',
        description: 'Your service request has been created successfully.',
      });

      // Reset form
      setShowForm(false);
      setTitle('');
      setDescription('');
      setCategory('Other');
      setPriority('medium');
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to create service request',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* New Request Form */}
      {role === 'client' && (
        <Card className="border-accent/20">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-accent" />
                  New Service Request
                </CardTitle>
                <CardDescription>Submit a maintenance request for {selectedBuilding?.name}</CardDescription>
              </div>
              {!showForm && (
                <Button onClick={() => setShowForm(true)} className="bg-accent hover:bg-accent/90">
                  Create Request
                </Button>
              )}
            </div>
          </CardHeader>
          {showForm && (
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Brief summary of the issue..."
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please describe the problem in detail, including location and any observations..."
                  rows={4}
                  className="resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={category} onValueChange={(v) => setCategory(v as ServiceRequestCategory)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={priority} onValueChange={(v) => setPriority(v as ServiceRequestPriority)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - Can wait</SelectItem>
                      <SelectItem value="medium">Medium - Within 24 hours</SelectItem>
                      <SelectItem value="high">High - Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Attach Photo (optional)</Label>
                <Button variant="outline" className="w-full gap-2" type="button">
                  <Camera className="h-4 w-4" />
                  Upload Photo
                </Button>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={() => setShowForm(false)} type="button">
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!title.trim() || !description.trim() || createMutation.isPending}
                  className="gap-2 bg-accent hover:bg-accent/90"
                >
                  {createMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  {createMutation.isPending ? 'Submitting...' : 'Submit Request'}
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Request List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Recent Requests</h3>
          <Badge variant="secondary">{requests.length} total</Badge>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="border-destructive/50">
            <CardContent className="flex items-center gap-3 py-6">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <p className="text-sm text-destructive">
                Failed to load service requests. Please try again.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!isLoading && !error && requests.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Wrench className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h4 className="font-medium mb-1">No service requests</h4>
              <p className="text-sm text-muted-foreground">
                {selectedBuilding
                  ? `No service requests found for ${selectedBuilding.name}.`
                  : 'Select a building to view service requests.'}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Request List */}
        {!isLoading && !error && requests.length > 0 && (
          <div className="space-y-3">
            {requests.map((request, index) => {
              const status = statusConfig[request.status];
              const StatusIcon = status.icon;
              const priorityCfg = priorityConfig[request.priority];

              return (
                <motion.div
                  key={request.request_id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    'bg-card rounded-xl border border-border p-5',
                    'hover:shadow-md hover:border-accent/30 transition-all cursor-pointer'
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className={cn('text-xs', priorityCfg.className)}>
                          {priorityCfg.label}
                        </Badge>
                        <Badge className={cn('text-xs gap-1.5', status.className)}>
                          <StatusIcon className="h-3 w-3" />
                          {status.label}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {request.category}
                        </Badge>
                      </div>
                      <h4 className="font-medium mb-1">{request.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{request.description}</p>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Building2 className="h-3.5 w-3.5" />
                          {selectedBuilding?.name || 'Unknown Building'}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          {formatDate(request.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
