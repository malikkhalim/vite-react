import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../services/supabase/config';
import { authService, AuthError } from '../services/supabase/auth';
import type { Profile } from '../types/user';

interface UserState {
  user: Profile | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: any) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      error: null,

      signIn: async (email, password) => {
        if (get().loading) return;
        set({ loading: true, error: null });
        try {
          const { profile } = await authService.signIn(email, password);
          if (!profile) {
            throw new AuthError('Failed to load user profile');
          }
          set({ user: profile, loading: false });
        } catch (error) {
          set({
            error: error instanceof AuthError ? error.message : 'Sign in failed',
            loading: false,
            user: null
          });
        }
      },

      signUp: async (email, password, metadata = {}) => {
        if (get().loading) return;
        set({ loading: true, error: null });
        try {
          // Register the user but don't automatically sign in
          const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: metadata,
              emailRedirectTo: `${window.location.origin}/auth/callback`
            }
          });

          if (error) throw new AuthError(error.message);

          // Don't automatically sign in - just return success
          set({ loading: false });
        } catch (error) {
          set({
            error: error instanceof AuthError ? error.message : 'Registration failed',
            loading: false
          });
          throw error; // Re-throw to handle in component
        }
      },

      signInWithGoogle: async () => {
        if (get().loading) return;
        set({ loading: true, error: null });
        try {
          await authService.signInWithGoogle();
          // Profile will be set by auth state listener after redirect
        } catch (error) {
          set({
            error: error instanceof AuthError ? error.message : 'Google sign in failed',
            loading: false
          });
        }
      },

      signOut: async () => {
        if (get().loading) return;
        set({ loading: true, error: null });
        try {
          set({ user: null });
          localStorage.removeItem('user-storage');
          await authService.signOut();

          set({ loading: false });

          // Force page reload if  still have issues
          // window.location.href = '/';
        } catch (error) {
          set({
            error: error instanceof AuthError ? error.message : 'Sign out failed',
            loading: false
          });
          console.error('Sign out error:', error);
        }
      },
      clearError: () => set({ error: null })
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({ user: state.user })
    }
  )
);

// Set up auth state listener
supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === 'SIGNED_IN' && session?.user) {
    const profile = await authService.getProfile(session.user.id);
    useUserStore.setState({ user: profile, loading: false });
  } else if (event === 'SIGNED_OUT') {
    useUserStore.setState({ user: null, loading: false });
  }
});