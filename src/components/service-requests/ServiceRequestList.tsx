import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Wrench,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  User,
  Camera,
  Send,
  ArrowUpRight,
} from 'lucide-react';
import { ServiceRequest } from '@/types';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

const statusConfig = {
  pending: { icon: Clock, label: 'Pending', className: 'bg-warning/10 text-warning' },
  dispatched: { icon: ArrowUpRight, label: 'Dispatched', className: 'bg-info/10 text-info' },
  in_progress: { icon: Wrench, label: 'In Progress', className: 'bg-accent/10 text-accent' },
  resolved: { icon: CheckCircle2, label: 'Resolved', className: 'bg-success/10 text-success' },
};

const priorityConfig = {
  low: { label: 'Low', className: 'bg-muted text-muted-foreground' },
  medium: { label: 'Medium', className: 'bg-warning/10 text-warning' },
  high: { label: 'High', className: 'bg-destructive/10 text-destructive' },
};

// Mock service requests (will be replaced with real data in Phase 1 Task 5)
const mockRequests: ServiceRequest[] = [
  {
    id: '1',
    buildingId: '1',
    title: 'HVAC Issue on Level 3',
    description: 'Air conditioning not working properly on Level 3. Temperature reading 28°C when set to 22°C.',
    category: 'HVAC',
    priority: 'high',
    status: 'in_progress',
    location: 'Level 3',
    photoUrls: [],
    createdBy: 'client-1',
    createdAt: new Date('2024-01-14T09:30:00'),
    updatedAt: new Date('2024-01-14T09:30:00'),
    // Joined data for display
    buildingName: 'Westfield Sydney CBD',
    createdByName: 'Emily Chen',
  },
  {
    id: '2',
    buildingId: '1',
    title: 'Flickering Lights in Lobby',
    description: 'Flickering lights in the main lobby area near the east entrance.',
    category: 'Electrical',
    priority: 'medium',
    status: 'dispatched',
    location: 'Main Lobby, East Entrance',
    photoUrls: [],
    createdBy: 'client-1',
    createdAt: new Date('2024-01-13T14:15:00'),
    updatedAt: new Date('2024-01-13T14:15:00'),
    // Joined data for display
    buildingName: 'Westfield Sydney CBD',
    createdByName: 'Emily Chen',
  },
  {
    id: '3',
    buildingId: '2',
    title: 'Fire Suppression Quarterly Inspection',
    description: 'Scheduled maintenance for fire suppression system - quarterly inspection.',
    category: 'Fire',
    priority: 'low',
    status: 'pending',
    photoUrls: [],
    createdBy: 'tech-2',
    createdAt: new Date('2024-01-12T11:00:00'),
    updatedAt: new Date('2024-01-12T11:00:00'),
    // Joined data for display
    buildingName: 'Perth Convention Centre',
    createdByName: 'Mike Thompson',
  },
];

export function ServiceRequestList() {
  const { selectedBuilding } = useApp();
  const { role } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<string>('medium');

  // Filter requests based on building for clients
  const filteredRequests = role === 'client'
    ? mockRequests.filter((r) => r.buildingId === selectedBuilding?.id)
    : mockRequests;

  const handleSubmit = () => {
    // Simulate submission
    setShowForm(false);
    setDescription('');
    setPriority('medium');
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
                <Label>Describe the issue</Label>
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
                  <Label>Priority</Label>
                  <Select value={priority} onValueChange={setPriority}>
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
                <div className="space-y-2">
                  <Label>Attach Photo (optional)</Label>
                  <Button variant="outline" className="w-full gap-2">
                    <Camera className="h-4 w-4" />
                    Upload Photo
                  </Button>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!description.trim()}
                  className="gap-2 bg-accent hover:bg-accent/90"
                >
                  <Send className="h-4 w-4" />
                  Submit Request
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
          <Badge variant="secondary">{filteredRequests.length} total</Badge>
        </div>

        <div className="space-y-3">
          {filteredRequests.map((request, index) => {
            const status = statusConfig[request.status];
            const StatusIcon = status.icon;
            const priorityCfg = priorityConfig[request.priority];

            return (
              <motion.div
                key={request.id}
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
                        {request.buildingName}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5" />
                        {request.createdByName}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {request.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
