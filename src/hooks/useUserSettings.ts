/**
 * User Settings Hook
 *
 * React Query hook for fetching and managing user settings/preferences.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type UserSettings = Database['public']['Tables']['user_settings']['Row'];
type UserSettingsUpdate = Database['public']['Tables']['user_settings']['Update'];

// Default settings for new users
const DEFAULT_SETTINGS: Omit<UserSettings, 'id' | 'user_id' | 'created_at' | 'updated_at'> = {
  email_notifications: true,
  critical_alerts: true,
  weekly_summary: false,
  ai_web_search: true,
  ai_citations: true,
  ai_response_style: 'balanced',
};

// Query keys for cache management
export const userSettingsKeys = {
  all: ['user-settings'] as const,
  user: (userId: string) => [...userSettingsKeys.all, userId] as const,
};

/**
 * Hook to fetch user settings
 */
export function useUserSettings() {
  const { user } = useAuth();
  const userId = user?.id;

  return useQuery({
    queryKey: userSettingsKeys.user(userId || ''),
    queryFn: async () => {
      if (!userId) return null;

      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      // If no settings exist, return defaults (we'll create on first save)
      if (error?.code === 'PGRST116') {
        return { ...DEFAULT_SETTINGS, user_id: userId } as UserSettings;
      }

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
    staleTime: 60000, // Consider data stale after 1 minute
  });
}

/**
 * Hook to update user settings (upsert)
 */
export function useUpdateUserSettings() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (updates: Partial<Omit<UserSettingsUpdate, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
      if (!user?.id) throw new Error('User not authenticated');

      // Upsert: insert if doesn't exist, update if it does
      const { data, error } = await supabase
        .from('user_settings')
        .upsert(
          {
            user_id: user.id,
            ...updates,
          },
          {
            onConflict: 'user_id',
          }
        )
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      // Update cache with new data
      if (user?.id) {
        queryClient.setQueryData(userSettingsKeys.user(user.id), data);
      }
    },
  });
}

export type { UserSettings, UserSettingsUpdate };
