import { useState, useCallback } from 'react';
import { useUserStore } from '../stores/userStore';

// Enhanced page type to include admin subpages
export type PageType = 'home' | 'flight' | 'cargo' | 'profile' | 'bookings' | 
  'admin' | 'admin-dashboard' | 'admin-settings' | 'admin-customers';

export function usePageNavigation() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const { user } = useUserStore();
  const isAdmin = user?.is_admin === true;

  const navigateToPage = useCallback((page: PageType) => {
    // For protected routes, ensure user is logged in
    if ((page === 'profile' || page === 'bookings') && !user) {
      console.log('Protected route, user not logged in');
      return;
    }
    
    // For admin routes, ensure user is admin
    if (page.startsWith('admin') && !isAdmin) {
      console.log('Admin route, user not an admin');
      return;
    }

    console.log(`Navigating to: ${page}`);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [user, isAdmin]);

  // Function to parse URL paths into page types
  const navigateToPath = useCallback((path: string) => {
    const normalizedPath = path.startsWith('/') ? path.substring(1) : path;
    
    if (normalizedPath === '') return navigateToPage('home');
    if (normalizedPath === 'flight') return navigateToPage('flight');
    if (normalizedPath === 'cargo') return navigateToPage('cargo');
    if (normalizedPath === 'profile') return navigateToPage('profile');
    if (normalizedPath === 'bookings') return navigateToPage('bookings');
    
    // Admin routes
    if (normalizedPath === 'admin' || normalizedPath === 'admin/dashboard') 
      return navigateToPage('admin-dashboard');
    if (normalizedPath === 'admin/settings') 
      return navigateToPage('admin-settings');
    if (normalizedPath === 'admin/customers') 
      return navigateToPage('admin-customers');
    
    return navigateToPage('home');
  }, [navigateToPage]);

  return {
    currentPage,
    navigateToPath,
    handleHomeClick: useCallback(() => navigateToPage('home'), [navigateToPage]),
    handleBookFlightClick: useCallback(() => navigateToPage('flight'), [navigateToPage]),
    handleBookCargoClick: useCallback(() => navigateToPage('cargo'), [navigateToPage]),
    handleProfileClick: useCallback(() => navigateToPage('profile'), [navigateToPage]),
    handleBookingsClick: useCallback(() => navigateToPage('bookings'), [navigateToPage]),
    handleAdminClick: useCallback(() => navigateToPage('admin-dashboard'), [navigateToPage]),
    handleAdminSettingsClick: useCallback(() => navigateToPage('admin-settings'), [navigateToPage]),
    handleAdminCustomersClick: useCallback(() => navigateToPage('admin-customers'), [navigateToPage])
  };
}