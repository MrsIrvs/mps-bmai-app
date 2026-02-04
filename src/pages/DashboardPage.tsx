import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Wrench,
  FileText,
  AlertCircle,
  CheckCircle2,
  Clock,
  TrendingUp,
  Building2,
  HardHat,
  LayoutDashboard,
} from 'lucide-react';
import { format } from 'date-fns';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useApp } from '@/contexts/AppContext';
import { useServiceRequests } from '@/hooks/useServiceRequests';
import { useContractors } from '@/hooks/useContractors';

const priorityColors: Record<string, string> = {
  low: 'bg-blue-100 text-blue-800 border-blue-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  emergency: 'bg-red-100 text-red-800 border-red-200',
};

const statusColors: Record<string, string> = {
  pending: 'bg-gray-100 text-gray-800',
  dispatched: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-purple-100 text-purple-800',
  resolved: 'bg-green-100 text-green-800',
};

export default function DashboardPage() {
  const { selectedBuilding } = useApp();
  const { data: serviceRequests = [], isLoading: requestsLoading } = useServiceRequests();
  const { data: contractors = [], isLoading: contractorsLoading } = useContractors();

  // Calculate stats
  const openRequests = serviceRequests.filter(
    (r) => r.status !== 'resolved'
  ).length;

  const emergencyRequests = serviceRequests.filter(
    (r) => r.priority === 'high' && r.status === 'pending'
  ).length;

  const recentRequests = serviceRequests.slice(0, 5);
  const activeContractors = contractors.filter((c) => !c.is_archived).length;

  // No building selected state
  if (!selectedBuilding) {
    return (
      <AppLayout>
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-card rounded-xl shadow-sm border border-border p-12 text-center">
              <Building2 className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">No Building Selected</h2>
              <p className="text-muted-foreground mb-6">
                Please select a building from the sidebar to view your dashboard
              </p>
              <Link to="/buildings">
                <Button className="bg-primary hover:bg-primary/90">
                  Manage Buildings
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">
              Here's what's happening with {selectedBuilding.name}
            </p>
          </motion.div>

          {/* Emergency Alert */}
          {emergencyRequests > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="mb-6 border-red-200 bg-red-50 dark:bg-red-950/20 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <AlertCircle className="w-10 h-10 text-red-600 shrink-0" />
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-red-900 dark:text-red-100">
                        High Priority Requests Pending
                      </h3>
                      <p className="text-red-700 dark:text-red-300">
                        You have {emergencyRequests} high priority service request{emergencyRequests !== 1 ? 's' : ''} requiring attention
                      </p>
                    </div>
                    <Link to="/service-requests" className="shrink-0">
                      <Button className="bg-red-600 hover:bg-red-700 text-white">
                        View Now
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Quick Action Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-primary border-none shadow-lg hover:shadow-xl transition-shadow text-primary-foreground h-full">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <Clock className="w-6 h-6" />
                    </div>
                    <MessageSquare className="w-5 h-5 opacity-80" />
                  </div>
                  <p className="text-sm opacity-80 mb-1">Quick Action</p>
                  <Link to="/chat">
                    <Button className="w-full mt-2 bg-white text-primary hover:bg-white/90 font-semibold shadow-md">
                      Ask AI Assistant
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            {/* Active Contractors Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Card className="bg-card border-none shadow-lg hover:shadow-xl transition-shadow h-full">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/50 rounded-xl flex items-center justify-center">
                      <HardHat className="w-6 h-6 text-primary" />
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-1 font-medium">Active Contractors</p>
                  <p className="text-3xl font-bold">
                    {contractorsLoading ? '...' : activeContractors}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">Service providers</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Documents Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-card border-none shadow-lg hover:shadow-xl transition-shadow h-full">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-50 dark:bg-purple-950/50 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-purple-600" />
                    </div>
                    <FileText className="w-5 h-5 text-purple-500" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-1 font-medium">Documents</p>
                  <Link to="/documents">
                    <Button variant="outline" className="w-full mt-2">
                      View O&M Manuals
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            {/* Open Requests Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <Card className="bg-card border-none shadow-lg hover:shadow-xl transition-shadow h-full">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-orange-50 dark:bg-orange-950/50 rounded-xl flex items-center justify-center">
                      <Wrench className="w-6 h-6 text-orange-600" />
                    </div>
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-1 font-medium">Open Requests</p>
                  <p className="text-3xl font-bold">
                    {requestsLoading ? '...' : openRequests}
                  </p>
                  <Progress
                    value={Math.min((openRequests / 20) * 100, 100)}
                    className="mt-3 h-1.5"
                  />
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Service Requests */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-card border-none shadow-lg">
                <CardHeader className="border-b border-border">
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Wrench className="w-5 h-5 text-primary" />
                      Recent Service Requests
                    </span>
                    <Link to="/service-requests">
                      <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 hover:bg-primary/10">
                        View All
                      </Button>
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {requestsLoading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
                    </div>
                  ) : recentRequests.length > 0 ? (
                    <div className="space-y-4">
                      {recentRequests.map((request) => (
                        <div
                          key={request.id}
                          className="flex items-start gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                        >
                          <div className="w-10 h-10 bg-card rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                            <Wrench className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold truncate">{request.title}</h4>
                            <p className="text-sm text-muted-foreground truncate">
                              {request.location || 'No location specified'}
                            </p>
                            <div className="flex gap-2 mt-2">
                              <Badge variant="outline" className={priorityColors[request.priority]}>
                                {request.priority}
                              </Badge>
                              <Badge variant="outline" className={statusColors[request.status]}>
                                {request.status.replace('_', ' ')}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground shrink-0">
                            {format(new Date(request.created_at), 'MMM d')}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <CheckCircle2 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-muted-foreground">No service requests yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Links / Building Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <Card className="bg-card border-none shadow-lg">
                <CardHeader className="border-b border-border">
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-primary" />
                      Building Overview
                    </span>
                    <Link to="/buildings">
                      <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 hover:bg-primary/10">
                        Details
                      </Button>
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Building Info */}
                    <div className="p-4 rounded-xl bg-muted/50">
                      <h4 className="font-semibold mb-2">{selectedBuilding.name}</h4>
                      <p className="text-sm text-muted-foreground mb-1">
                        {selectedBuilding.address || 'No address on file'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Region: {selectedBuilding.region}
                      </p>
                    </div>

                    {/* Quick Links */}
                    <div className="grid grid-cols-2 gap-3">
                      <Link to="/chat">
                        <Button variant="outline" className="w-full justify-start gap-2">
                          <MessageSquare className="w-4 h-4" />
                          AI Assistant
                        </Button>
                      </Link>
                      <Link to="/service-requests">
                        <Button variant="outline" className="w-full justify-start gap-2">
                          <Wrench className="w-4 h-4" />
                          New Request
                        </Button>
                      </Link>
                      <Link to="/documents">
                        <Button variant="outline" className="w-full justify-start gap-2">
                          <FileText className="w-4 h-4" />
                          Documents
                        </Button>
                      </Link>
                      <Link to="/contractors">
                        <Button variant="outline" className="w-full justify-start gap-2">
                          <HardHat className="w-4 h-4" />
                          Contractors
                        </Button>
                      </Link>
                    </div>

                    {/* Start Chat CTA */}
                    <div className="pt-4">
                      <Link to="/chat">
                        <Button className="w-full bg-primary hover:bg-primary/90 shadow-md">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Start a Conversation with AI
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
