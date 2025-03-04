/**
 * Detects and fixes corrupted localStorage entries
 * @returns True if any fixes were applied
 */
export const fixCorruptedStorage = (): boolean => {
    let fixesApplied = false;
    
    try {
      // Check admin-settings-storage
      const adminSettingsStr = localStorage.getItem('admin-settings-storage');
      if (adminSettingsStr) {
        try {
          const parsed = JSON.parse(adminSettingsStr);
          if (!parsed || typeof parsed !== 'object') {
            // Invalid format, remove it
            console.warn('Fixing corrupted admin-settings-storage');
            localStorage.removeItem('admin-settings-storage');
            fixesApplied = true;
          }
        } catch (e) {
          // Parse error, remove it
          console.warn('Removing unparseable admin-settings-storage');
          localStorage.removeItem('admin-settings-storage');
          fixesApplied = true;
        }
      }
      
      // Check user-storage
      const userStorageStr = localStorage.getItem('user-storage');
      if (userStorageStr) {
        try {
          const parsed = JSON.parse(userStorageStr);
          if (!parsed || typeof parsed !== 'object') {
            console.warn('Fixing corrupted user-storage');
            localStorage.removeItem('user-storage');
            fixesApplied = true;
          }
        } catch (e) {
          console.warn('Removing unparseable user-storage');
          localStorage.removeItem('user-storage');
          fixesApplied = true;
        }
      }
    } catch (e) {
      console.error('Error while fixing storage:', e);
    }
    
    return fixesApplied;
  };
  
  /**
   * Reset function that can be attached to admin components or triggered from the console
   */
  export const resetAppState = () => {
    try {
      localStorage.clear();
      console.log('App state reset successful');
      return true;
    } catch (e) {
      console.error('Error resetting app state:', e);
      return false;
    }
  };
  
  /**
   * Attaches the fixCorruptedStorage function to run on app init
   */
  export const setupStorageFixing = () => {
    // Check for corruption immediately
    const fixesApplied = fixCorruptedStorage();
    if (fixesApplied) {
      console.log('Storage fixes applied - refreshing page');
      window.location.reload();
      return true;
    }
    
    // Make the reset function available globally for debugging
    (window as any).resetAppState = resetAppState;
    (window as any).fixCorruptedStorage = fixCorruptedStorage;
    
    return false;
  };