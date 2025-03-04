/**
 * Clear all application caches and storages
 */
export const clearAllAppCaches = () => {
    console.log('Clearing all application caches...');
    
    // Clear specific app data
    localStorage.removeItem('user-storage');
    localStorage.removeItem('admin-settings-storage');
    
    console.log('Application caches cleared');
  };
  
  /**
   * Emergency reset that clears all browser storage and reloads the app
   */
  export const emergencyReset = () => {
    if (window.confirm('This will clear ALL application data and reload the page. Continue?')) {
      console.log('Performing emergency application reset...');
      
      // Clear all localStorage
      localStorage.clear();
      
      // Clear session storage
      sessionStorage.clear();
      
      // Clear cookies
      document.cookie.split(";").forEach(function(c) {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      
      console.log('All storage cleared, reloading application...');
      
      // Reload the application, forcing a fresh load from server
      window.location.href = '/?reset=' + Date.now();
    }
  };
  
  /**
   * Add this to debug any localStorage corruption issues
   */
  export const checkStorageIntegrity = () => {
    console.log('Checking storage integrity...');
    const issues = [];
    
    try {
      // Check user storage
      const userStorage = localStorage.getItem('user-storage');
      if (userStorage) {
        try {
          JSON.parse(userStorage);
        } catch (e) {
          issues.push('Corrupted user-storage');
          localStorage.removeItem('user-storage');
        }
      }
      
      // Check admin settings storage
      const adminStorage = localStorage.getItem('admin-settings-storage');
      if (adminStorage) {
        try {
          JSON.parse(adminStorage);
        } catch (e) {
          issues.push('Corrupted admin-settings-storage');
          localStorage.removeItem('admin-settings-storage');
        }
      }
      
    } catch (e) {
      issues.push('Error checking storage: ' + e);
    }
    
    if (issues.length > 0) {
      console.warn('Storage integrity issues found:', issues);
      return {
        hasIssues: true,
        issues
      };
    }
    
    console.log('Storage integrity check passed');
    return {
      hasIssues: false,
      issues: []
    };
  };