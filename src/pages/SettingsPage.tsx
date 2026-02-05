import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Building2, Bell, Shield, Loader2 } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useApp } from '@/contexts/AppContext';
import { useUserSettings, useUpdateUserSettings } from '@/hooks/useUserSettings';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

type ResponseStyle = 'concise' | 'balanced' | 'detailed';

export default function SettingsPage() {
  const { selectedBuilding } = useApp();
  const { toast } = useToast();
  const { data: settings, isLoading } = useUserSettings();
  const updateSettings = useUpdateUserSettings();

  // Form state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [criticalAlerts, setCriticalAlerts] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(false);
  const [aiWebSearch, setAiWebSearch] = useState(true);
  const [aiCitations, setAiCitations] = useState(true);
  const [aiResponseStyle, setAiResponseStyle] = useState<ResponseStyle>('balanced');

  // Track if form has unsaved changes
  const [hasChanges, setHasChanges] = useState(false);

  // Load settings into form state
  useEffect(() => {
    if (settings) {
      setEmailNotifications(settings.email_notifications);
      setCriticalAlerts(settings.critical_alerts);
      setWeeklySummary(settings.weekly_summary);
      setAiWebSearch(settings.ai_web_search);
      setAiCitations(settings.ai_citations);
      setAiResponseStyle(settings.ai_response_style);
      setHasChanges(false);
    }
  }, [settings]);

  // Check for changes
  useEffect(() => {
    if (!settings) return;

    const changed =
      emailNotifications !== settings.email_notifications ||
      criticalAlerts !== settings.critical_alerts ||
      weeklySummary !== settings.weekly_summary ||
      aiWebSearch !== settings.ai_web_search ||
      aiCitations !== settings.ai_citations ||
      aiResponseStyle !== settings.ai_response_style;

    setHasChanges(changed);
  }, [settings, emailNotifications, criticalAlerts, weeklySummary, aiWebSearch, aiCitations, aiResponseStyle]);

  const handleSave = async () => {
    try {
      await updateSettings.mutateAsync({
        email_notifications: emailNotifications,
        critical_alerts: criticalAlerts,
        weekly_summary: weeklySummary,
        ai_web_search: aiWebSearch,
        ai_citations: aiCitations,
        ai_response_style: aiResponseStyle,
      });

      toast({
        title: 'Settings saved',
        description: 'Your preferences have been updated successfully.',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to save settings',
        variant: 'destructive',
      });
    }
  };

  const SettingsSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
          <Skeleton className="h-6 w-10 rounded-full" />
        </div>
      ))}
    </div>
  );

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <Settings className="h-5 w-5 text-accent" />
            </div>
            Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure system preferences and building settings
          </p>
        </motion.div>

        <div className="space-y-6">
          {/* Building Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Building Configuration
              </CardTitle>
              <CardDescription>
                Settings specific to {selectedBuilding?.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Building Name</Label>
                  <Input value={selectedBuilding?.name || ''} disabled readOnly />
                </div>
                <div className="space-y-2">
                  <Label>Region</Label>
                  <Input value={selectedBuilding?.region || ''} disabled readOnly />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input value={selectedBuilding?.address || ''} disabled readOnly />
              </div>
              <p className="text-xs text-muted-foreground">
                Contact an administrator to update building details.
              </p>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>
                Configure how you receive alerts and updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <SettingsSkeleton />
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive email alerts for new service requests
                      </p>
                    </div>
                    <Switch
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Critical Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Immediate notification for high-priority issues
                      </p>
                    </div>
                    <Switch
                      checked={criticalAlerts}
                      onCheckedChange={setCriticalAlerts}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Weekly Summary</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive a weekly digest of system activity
                      </p>
                    </div>
                    <Switch
                      checked={weeklySummary}
                      onCheckedChange={setWeeklySummary}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* AI Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                AI Assistant Configuration
              </CardTitle>
              <CardDescription>
                Customize the AI assistant behavior
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <SettingsSkeleton />
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>External Web Search</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow AI to search the web for additional information
                      </p>
                    </div>
                    <Switch
                      checked={aiWebSearch}
                      onCheckedChange={setAiWebSearch}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Citation Sources</Label>
                      <p className="text-sm text-muted-foreground">
                        Show document references in AI responses
                      </p>
                    </div>
                    <Switch
                      checked={aiCitations}
                      onCheckedChange={setAiCitations}
                    />
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label>Response Style</Label>
                    <Select
                      value={aiResponseStyle}
                      onValueChange={(v) => setAiResponseStyle(v as ResponseStyle)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="concise">Concise</SelectItem>
                        <SelectItem value="balanced">Balanced</SelectItem>
                        <SelectItem value="detailed">Detailed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end gap-3">
            {hasChanges && (
              <p className="text-sm text-muted-foreground self-center">
                You have unsaved changes
              </p>
            )}
            <Button
              onClick={handleSave}
              disabled={!hasChanges || updateSettings.isPending || isLoading}
              className="bg-accent hover:bg-accent/90 gap-2"
            >
              {updateSettings.isPending && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              {updateSettings.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
