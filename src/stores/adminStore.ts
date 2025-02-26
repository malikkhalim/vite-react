import { create } from 'zustand';
import { AdminState, AdminSettings } from '../types/admin';
import { supabase } from '../services/supabase/config';

interface AdminStore extends AdminState {
  loadSettings: () => Promise<void>;
  updateSettings: (settings: AdminSettings) => Promise<void>;
  clearError: () => void;
}

export const useAdminStore = create<AdminStore>((set) => ({
  settings: null,
  isLoading: false,
  error: null,

  loadSettings: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*')
        .single();
      
      if (error) throw error;
      set({ settings: data });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateSettings: async (settings) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('admin_settings')
        .update(settings)
        .eq('id', 1);
      
      if (error) throw error;
      set({ settings });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));