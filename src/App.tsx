import React, { useEffect } from 'react';
import { MainLayout } from './layouts/MainLayout';
import { HomePage } from './pages/HomePage';
import BookFlight from './pages/BookFlight';
import BookCargo from './pages/BookCargo';
import AdminDashboard from './pages/admin/Dashboard';
import AdminSettings from './pages/admin/Settings';
import AdminCustomers from './pages/admin/Customers';
import { usePageNavigation } from './hooks/usePageNavigation';
import { useUserStore } from './stores/userStore';

export default function App() {
  const { 
    currentPage, 
    navigateToPath,
    handleHomeClick, 
    handleBookFlightClick, 
    handleBookCargoClick,
    handleProfileClick,
    handleBookingsClick,
    handleAdminClick,
    handleAdminSettingsClick,
    handleAdminCustomersClick
  } = usePageNavigation();
  
  const { user } = useUserStore();
  const isAdmin = user?.is_admin === true;
  
  // Handle URL based navigation when app loads
  useEffect(() => {
    const path = window.location.pathname;
    navigateToPath(path);
  }, [navigateToPath]);

  const renderContent = () => {
    switch (currentPage) {
      case 'flight':
        return <BookFlight />;
      case 'cargo':
        return <BookCargo />;
      case 'admin-dashboard':
        return isAdmin ? <AdminDashboard /> : <HomePage onBookFlight={handleBookFlightClick} onBookCargo={handleBookCargoClick} />;
      case 'admin-settings':
        return isAdmin ? <AdminSettings /> : <HomePage onBookFlight={handleBookFlightClick} onBookCargo={handleBookCargoClick} />;
      case 'admin-customers':
        return isAdmin ? <AdminCustomers /> : <HomePage onBookFlight={handleBookFlightClick} onBookCargo={handleBookCargoClick} />;
      default:
        return <HomePage onBookFlight={handleBookFlightClick} onBookCargo={handleBookCargoClick} />;
    }
  };

  return (
    <MainLayout
      onHomeClick={handleHomeClick}
      onBookFlightClick={handleBookFlightClick}
      onBookCargoClick={handleBookCargoClick}
      onProfileClick={handleProfileClick}
      onBookingsClick={handleBookingsClick}
      onAdminClick={handleAdminClick}
      onAdminSettingsClick={handleAdminSettingsClick}
      onAdminCustomersClick={handleAdminCustomersClick}
      isAdmin={isAdmin}
    >
      {renderContent()}
    </MainLayout>
  );
}