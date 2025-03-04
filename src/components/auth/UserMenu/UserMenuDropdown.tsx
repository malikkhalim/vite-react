import React from 'react';
import { User, Package, LogOut, Settings, Sliders, Users } from 'lucide-react';
import { UserMenuItem } from './UserMenuItem';

interface UserMenuDropdownProps {
  onClose: () => void;
  onLogout: () => void;
  onProfileClick: () => void;
  onBookingsClick: () => void;
  onAdminClick?: () => void;
  onAdminSettingsClick?: () => void;  // Added this prop
  onAdminCustomersClick?: () => void; // Added this prop
  isAdmin?: boolean;
}

export function UserMenuDropdown({ 
  onClose, 
  onLogout,
  onProfileClick,
  onBookingsClick,
  onAdminClick,
  onAdminSettingsClick,   // Added this prop
  onAdminCustomersClick,  // Added this prop
  isAdmin
}: UserMenuDropdownProps) {
  const handleMenuItemClick = (action: () => void) => {
    // First close the menu
    onClose();
    // Then execute the action after a short delay
    setTimeout(() => {
      action();
    }, 100);
  };

  console.log("Admin status:", isAdmin); // Debug log

  return (
    <div 
      className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg ring-1 ring-black/5 divide-y divide-gray-100"
      style={{ zIndex: 1000 }}
      role="menu"
      aria-orientation="vertical"
    >
      <div className="p-1">
        <UserMenuItem 
          icon={User} 
          onClick={() => handleMenuItemClick(onProfileClick)}
        >
          Profile
        </UserMenuItem>
        <UserMenuItem 
          icon={Package} 
          onClick={() => handleMenuItemClick(onBookingsClick)}
        >
          My Bookings
        </UserMenuItem>
        {isAdmin && (
          <>
            {onAdminClick && (
              <UserMenuItem 
                icon={Settings} 
                onClick={() => handleMenuItemClick(onAdminClick)}
              >
                Admin Dashboard
              </UserMenuItem>
            )}
            {onAdminSettingsClick && (
              <UserMenuItem 
                icon={Sliders} 
                onClick={() => handleMenuItemClick(onAdminSettingsClick)}
              >
                Admin Settings
              </UserMenuItem>
            )}
            {onAdminCustomersClick && (
              <UserMenuItem 
                icon={Users} 
                onClick={() => handleMenuItemClick(onAdminCustomersClick)}
              >
                Admin Customers
              </UserMenuItem>
            )}
          </>
        )}
      </div>
      <div className="p-1">
        <UserMenuItem 
          icon={LogOut} 
          onClick={() => handleMenuItemClick(onLogout)}
        >
          Sign Out
        </UserMenuItem>
      </div>
    </div>
  );
}