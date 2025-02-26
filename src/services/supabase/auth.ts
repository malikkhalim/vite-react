import { supabase } from './config';
import type { Profile } from '../../types/user';

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export const authService = {
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw new AuthError(error.message);
      if (!data.user) throw new AuthError('No user returned from auth service');
      
      // Get profile immediately after sign in
      const profile = await this.getProfile(data.user.id);
      return { user: data.user, profile };
    } catch (error) {
      console.error('Sign in error:', error);
      throw error instanceof AuthError ? error : new AuthError('Invalid email or password');
    }
  },

  async signInWithGoogle() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });

      if (error) {
        throw new AuthError(error.message);
      }

      return data;
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error instanceof AuthError ? error : new AuthError('Failed to sign in with Google');
    }
  },

  async getProfile(userId: string): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error('Get profile error:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Get profile error:', error);
      return null;
    }
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw new AuthError(error.message);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error instanceof AuthError ? error : new AuthError('Failed to sign out');
    }
  }
};