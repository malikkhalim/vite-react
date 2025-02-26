import { useState, useCallback } from 'react';
import { useAuthStore } from '../stores/authStore';

export type PageType = 'home' | 'flight' | 'cargo' | 'profile' | 'bookings';

export function usePageNavigation() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const { user } = useAuthStore();

  const navigateToPage = useCallback((page: PageType) => {
    // For protected routes, ensure user is logged in
    if ((page === 'profile' || page === 'bookings') && !user) {
      console.log('Protected route, user not logged in');
      return;
    }

    console.log(`Navigating to: ${page}`);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [user]);

  return {
    currentPage,
    handleHomeClick: useCallback(() => navigateToPage('home'), [navigateToPage]),
    handleBookFlightClick: useCallback(() => navigateToPage('flight'), [navigateToPage]),
    handleBookCargoClick: useCallback(() => navigateToPage('cargo'), [navigateToPage]),
    handleProfileClick: useCallback(() => navigateToPage('profile'), [navigateToPage]),
    handleBookingsClick: useCallback(() => navigateToPage('bookings'), [navigateToPage])
  };
}