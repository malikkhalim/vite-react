import { useState, useCallback } from 'react';
import { useUserStore } from '../stores/userStore';

// Enhanced page type to include payment pages
export type PageType = 
  'home' | 'flight' | 'cargo' | 'profile' | 'bookings' | 
  'admin' | 'admin-dashboard' | 'admin-settings' | 'admin-customers' |
  'payment-success' | 'payment-cancel' | 'payment-failed';

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
    const basePath = normalizedPath.split('?')[0]; // Remove query parameters
    
    // Handle payment routes - just check the base path
    if (basePath === 'payment/success') return navigateToPage('payment-success');
    if (basePath === 'payment/cancel') return navigateToPage('payment-cancel');
    if (basePath === 'payment/failed') return navigateToPage('payment-failed');
    
    // Handle standard routes
    if (basePath === '') return navigateToPage('home');
    if (basePath === 'flight') return navigateToPage('flight');
    if (basePath === 'cargo') return navigateToPage('cargo');
    if (basePath === 'profile') return navigateToPage('profile');
    if (basePath === 'bookings') return navigateToPage('bookings');
    
    // Admin routes
    if (basePath === 'admin' || basePath === 'admin/dashboard') 
      return navigateToPage('admin-dashboard');
    if (basePath === 'admin/settings') 
      return navigateToPage('admin-settings');
    if (basePath === 'admin/customers') 
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
    handleAdminCustomersClick: useCallback(() => navigateToPage('admin-customers'), [navigateToPage]),
    handlePaymentSuccessPage: useCallback(() => navigateToPage('payment-success'), [navigateToPage]),
    handlePaymentCancelPage: useCallback(() => navigateToPage('payment-cancel'), [navigateToPage]),
    handlePaymentFailedPage: useCallback(() => navigateToPage('payment-failed'), [navigateToPage])
  };
}