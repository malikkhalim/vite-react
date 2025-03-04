import React, { useEffect, useState } from 'react';
import { MainLayout } from './layouts/MainLayout';
import { HomePage } from './pages/HomePage';
import BookFlight from './pages/BookFlight';
import BookCargo from './pages/BookCargo';
import AdminDashboard from './pages/admin/Dashboard';
import AdminSettings from './pages/admin/Settings';
import AdminCustomers from './pages/admin/Customers';
import PaymentSuccess from './pages/payment/Success';
import PaymentCancel from './pages/payment/Cancel';
import PaymentFailed from './pages/payment/Failed';
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
  
  const { user, loading: userLoading } = useUserStore();
  const isAdmin = user?.is_admin === true;
  
  // Add state to track if initial auth check is complete
  const [authCheckComplete, setAuthCheckComplete] = useState(false);
  
  // Handle auth state initialization
  useEffect(() => {
    if (!userLoading) {
      setAuthCheckComplete(true);
    }
  }, [userLoading]);
  
  // Handle path-based navigation after auth check
  useEffect(() => {
    if (authCheckComplete) {
      // Extract path from current URL
      const path = window.location.pathname;
      console.log('Initial path navigation:', path);
      navigateToPath(path);
    }
  }, [navigateToPath, authCheckComplete]);

  // Show loading during initial auth check
  if (!authCheckComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing application...</p>
        </div>
      </div>
    );
  }

  // Emergency reset button - include this somewhere unobtrusive
  const EmergencyReset = () => (
    <button
      onClick={() => {
        if (window.confirm('Reset application state? This will clear all cached data.')) {
          localStorage.clear();
          window.location.reload();
        }
      }}
      className="fixed bottom-4 right-4 bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded hover:bg-gray-300 z-50 opacity-70 hover:opacity-100"
    >
      Reset App
    </button>
  );

  const renderContent = () => {
    // For admin routes, verify admin status
    if (currentPage.startsWith('admin-') && !isAdmin) {
      setTimeout(() => handleHomeClick(), 0);
      return (
        <div className="p-8 text-center">
          <p className="text-red-600 mb-2">You don't have permission to access this page.</p>
          <p className="text-gray-600">Redirecting to home...</p>
        </div>
      );
    }

    // Check for payment routes in URL path
    const path = window.location.pathname;

    console.log('Current path:', path);

    if (path.includes('/payment/success')) {
      return <PaymentSuccess />;
    } else if (path.includes('/payment/cancel')) {
      return <PaymentCancel />;
    } else if (path.includes('/payment/failed')) {
      return <PaymentFailed />;
    }

    // Standard page routes
    switch (currentPage) {
      case 'flight':
        return <BookFlight />;
      case 'cargo':
        return <BookCargo />;
      case 'admin-dashboard':
        return <AdminDashboard />;
      case 'admin-settings':
        return <AdminSettings />;
      case 'admin-customers':
        return <AdminCustomers />;
      default:
        return <HomePage onBookFlight={handleBookFlightClick} onBookCargo={handleBookCargoClick} />;
    }
  };

  return (
    <>
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
      <EmergencyReset />
    </>
  );
}
