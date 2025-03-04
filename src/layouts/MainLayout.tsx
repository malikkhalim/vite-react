import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface MainLayoutProps {
  children: React.ReactNode;
  onHomeClick: () => void;
  onBookFlightClick: () => void;
  onBookCargoClick: () => void;
  onProfileClick: () => void;
  onBookingsClick: () => void;
  onAdminClick?: () => void;
}

export function MainLayout({ 
  children, 
  onHomeClick, 
  onBookFlightClick, 
  onBookCargoClick,
  onProfileClick,
  onBookingsClick,
  onAdminClick
}: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        onHomeClick={onHomeClick}
        onBookFlightClick={onBookFlightClick}
        onBookCargoClick={onBookCargoClick}
        onProfileClick={onProfileClick}
        onBookingsClick={onBookingsClick}
        onAdminClick={onAdminClick}
      />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}