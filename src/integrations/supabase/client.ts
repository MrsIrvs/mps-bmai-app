/**
 * Supabase Client Configuration
 *
 * Enhanced with error handling utilities from mpsapp repository.
 */
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

/**
 * Helper function to handle Supabase errors with user-friendly messages
 */
export function handleSupabaseError(error: unknown): Error {
  console.error('Supabase error:', error);

  if (typeof error === 'object' && error !== null && 'code' in error) {
    const err = error as { code: string; message?: string };

    // Provide user-friendly error messages for common codes
    if (err.code === 'PGRST116') {
      return new Error('No data found');
    }
    if (err.code === '23505') {
      return new Error('This record already exists');
    }
    if (err.code === '23503') {
      return new Error('Cannot delete: this record is being used elsewhere');
    }
    if (err.message) {
      return new Error(err.message);
    }
  }

  return new Error('An unexpected error occurred');
}

/**
 * Type-safe query result type
 */
export type SupabaseQuery<T> = {
  data: T | null;
  error: Error | null;
};

/**
 * Execute a Supabase query and handle errors consistently
 *
 * Usage:
 * const result = await executeQuery(
 *   supabase.from('buildings').select('*')
 * )
 */
export async function executeQuery<T>(
  queryPromise: Promise<{ data: T | null; error: unknown }>
): Promise<SupabaseQuery<T>> {
  try {
    const { data, error } = await queryPromise;

    if (error) {
      return {
        data: null,
        error: handleSupabaseError(error)
      };
    }

    return { data, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Unknown error occurred')
    };
  }
}