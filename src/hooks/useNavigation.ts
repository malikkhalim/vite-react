import { useState, useCallback } from 'react';

export type PageType = 'home' | 'flight' | 'cargo';

export function useNavigation() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');

  const navigateToPage = useCallback((page: PageType) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return {
    currentPage,
    handleHomeClick: useCallback(() => navigateToPage('home'), [navigateToPage]),
    handleBookFlightClick: useCallback(() => navigateToPage('flight'), [navigateToPage]),
    handleBookCargoClick: useCallback(() => navigateToPage('cargo'), [navigateToPage]),
  };
}