import { motion } from 'framer-motion';
import {
  MessageSquare,
  FileText,
  Wrench,
  Users,
  TrendingUp,
  Building2,
  Clock,
  Download,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const stats = [
  { label: 'Chat Sessions', value: '1,247', change: '+12%', icon: MessageSquare },
  { label: 'Documents Indexed', value: '156', change: '+8', icon: FileText },
  { label: 'Service Requests', value: '89', change: '+23%', icon: Wrench },
  { label: 'Active Users', value: '34', change: '+5', icon: Users },
];

const recentActivity = [
  { type: 'chat', user: 'Emily Chen', building: 'Westfield Sydney CBD', time: '2 min ago', description: 'Asked about HVAC fault code E47' },
  { type: 'request', user: 'Mike Thompson', building: 'Perth Convention Centre', time: '15 min ago', description: 'Submitted service request for fire system' },
  { type: 'document', user: 'Sarah Mitchell', building: 'Brisbane Airport Terminal', time: '1 hour ago', description: 'Uploaded new compliance document' },
  { type: 'chat', user: 'James Carter', building: 'Melbourne Crown Casino', time: '2 hours ago', description: 'Troubleshooting chiller startup' },
  { type: 'request', user: 'Lisa Wong', building: 'Brisbane Airport Terminal', time: '3 hours ago', description: 'Resolved lighting issue on level 2' },
];

const activityIcons = {
  chat: MessageSquare,
  request: Wrench,
  document: FileText,
};

export function ReportsDashboard() {
  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Overview</h2>
          <p className="text-muted-foreground">System usage and activity metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="7d">
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="card-interactive">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                    <stat.icon className="h-6 w-6 text-accent" />
                  </div>
                  <span className="text-sm font-medium text-success flex items-center gap-1">
                    <TrendingUp className="h-3.5 w-3.5" />
                    {stat.change}
                  </span>
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts placeholder & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Usage Chart Placeholder */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Chat Sessions Over Time</CardTitle>
            <CardDescription>Daily chat activity across all buildings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
              <div className="text-center text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Chart visualization will be displayed here</p>
                <p className="text-xs mt-1">Connect to Lovable Cloud for real data</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system interactions</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {recentActivity.map((activity, index) => {
                const Icon = activityIcons[activity.type as keyof typeof activityIcons];
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                        activity.type === 'chat' && 'bg-accent/10 text-accent',
                        activity.type === 'request' && 'bg-warning/10 text-warning',
                        activity.type === 'document' && 'bg-info/10 text-info',
                      )}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{activity.user}</p>
                        <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <Building2 className="h-3 w-3" />
                          <span className="truncate">{activity.building}</span>
                          <span>·</span>
                          <Clock className="h-3 w-3" />
                          <span>{activity.time}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Building Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Usage by Building</CardTitle>
          <CardDescription>Activity breakdown per facility</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'Westfield Sydney CBD', chats: 456, requests: 23, percentage: 85 },
              { name: 'Melbourne Crown Casino', chats: 312, requests: 18, percentage: 72 },
              { name: 'Brisbane Airport Terminal', chats: 289, requests: 31, percentage: 68 },
              { name: 'Perth Convention Centre', chats: 190, requests: 17, percentage: 45 },
            ].map((building) => (
              <div key={building.name} className="flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium truncate">{building.name}</p>
                    <span className="text-sm text-muted-foreground">
                      {building.chats} chats · {building.requests} requests
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${building.percentage}%` }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="h-full bg-accent rounded-full"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
