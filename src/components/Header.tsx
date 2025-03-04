import React, { useState } from 'react';
import { Plane, Package, Menu, X, Settings, Users, Sliders } from 'lucide-react';
import { HomeButton } from './ui/HomeButton';
import { UserMenu } from './auth/UserMenu/index';
import { AuthControls } from './auth/AuthControls';
import { useUserStore } from '../stores/userStore';

interface HeaderProps {
  onHomeClick: () => void;
  onBookFlightClick: () => void;
  onBookCargoClick: () => void;
  onProfileClick: () => void;
  onBookingsClick: () => void;
  onAdminClick?: () => void;
  onAdminSettingsClick?: () => void;  // Added this prop
  onAdminCustomersClick?: () => void; // Added this prop
}

export default function Header({ 
  onHomeClick, 
  onBookFlightClick, 
  onBookCargoClick,
  onProfileClick,
  onBookingsClick,
  onAdminClick,
  onAdminSettingsClick,   // Added this prop
  onAdminCustomersClick   // Added this prop
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useUserStore();
  const isAdmin = user?.is_admin === true; // Explicitly check for true
  
  console.log("Header - User:", user); // Debug log
  console.log("Header - Is admin:", isAdmin); // Debug log

  const handleMenuItemClick = (handler: () => void) => {
    setIsMenuOpen(false);
    handler();
  };

  return (
    <header className="bg-sky-700 text-white relative" style={{ zIndex: 50 }}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <button onClick={onHomeClick} className="flex items-center gap-2">
              <Plane className="h-8 w-8" />
              <span className="text-xl font-bold">Timor Pacific Logistics</span>
            </button>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <HomeButton onClick={onHomeClick} />
            <button 
              onClick={onBookFlightClick}
              className="hover:text-sky-200 flex items-center gap-2"
            >
              <Plane className="h-5 w-5" />
              Book Flight
            </button>
            <button 
              onClick={onBookCargoClick}
              className="hover:text-sky-200 flex items-center gap-2"
            >
              <Package className="h-5 w-5" />
              Book Cargo
            </button>
            {user ? (
              <UserMenu 
                onProfileClick={onProfileClick}
                onBookingsClick={onBookingsClick}
                onAdminClick={isAdmin ? onAdminClick : undefined}
                onAdminSettingsClick={isAdmin ? onAdminSettingsClick : undefined}
                onAdminCustomersClick={isAdmin ? onAdminCustomersClick : undefined}
              />
            ) : (
              <AuthControls />
            )}
          </div>

          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <HomeButton onClick={() => handleMenuItemClick(onHomeClick)} />
            <div className="flex flex-col space-y-4">
              <button 
                onClick={() => handleMenuItemClick(onBookFlightClick)}
                className="hover:text-sky-200 flex items-center gap-2"
              >
                <Plane className="h-5 w-5 shrink-0" />
                <span>Book Flight</span>
              </button>
              <button 
                onClick={() => handleMenuItemClick(onBookCargoClick)}
                className="hover:text-sky-200 flex items-center gap-2"
              >
                <Package className="h-5 w-5 shrink-0" />
                <span>Book Cargo</span>
              </button>
              {!user && <AuthControls />}
              {isAdmin && (
                <>
                  {onAdminClick && (
                    <button 
                      onClick={() => handleMenuItemClick(onAdminClick)}
                      className="hover:text-sky-200 flex items-center gap-2"
                    >
                      <Settings className="h-5 w-5 shrink-0" />
                      <span>Admin Dashboard</span>
                    </button>
                  )}
                  {onAdminSettingsClick && (
                    <button 
                      onClick={() => handleMenuItemClick(onAdminSettingsClick)}
                      className="hover:text-sky-200 flex items-center gap-2"
                    >
                      <Sliders className="h-5 w-5 shrink-0" />
                      <span>Admin Settings</span>
                    </button>
                  )}
                  {onAdminCustomersClick && (
                    <button 
                      onClick={() => handleMenuItemClick(onAdminCustomersClick)}
                      className="hover:text-sky-200 flex items-center gap-2"
                    >
                      <Users className="h-5 w-5 shrink-0" />
                      <span>Admin Customers</span>
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}