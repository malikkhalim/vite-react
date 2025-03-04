import React, { useState, useRef, useEffect } from 'react';
import { User } from 'lucide-react';
import { useUserStore } from '../../../stores/userStore';
import { UserMenuDropdown } from './UserMenuDropdown';

interface UserMenuProps {
  onProfileClick: () => void;
  onBookingsClick: () => void;
  onAdminClick?: () => void;
  onAdminSettingsClick?: () => void;  // Added this prop
  onAdminCustomersClick?: () => void; // Added this prop
}

export function UserMenu({ 
  onProfileClick, 
  onBookingsClick, 
  onAdminClick,
  onAdminSettingsClick,   // Added this prop
  onAdminCustomersClick   // Added this prop
}: UserMenuProps) {
  const { user, signOut } = useUserStore();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Access is_admin directly
  const isAdmin = user?.is_admin === true;
  
  console.log("User:", user); // Debug log
  console.log("Is admin:", isAdmin); // Debug log

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  if (!user) return null;

  return (
    <div className="relative" ref={containerRef}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-white hover:text-sky-200 transition-colors p-2 rounded-md"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <User className="h-5 w-5" />
        <span>{user.firstName || user.email || 'Account'}</span>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/20" 
            style={{ zIndex: 998 }}
            onClick={() => setIsOpen(false)}
          />
          <div 
            ref={menuRef}
            style={{ zIndex: 999 }}
            className="absolute right-0"
          >
            <UserMenuDropdown 
              onClose={() => setIsOpen(false)}
              onLogout={signOut}
              onProfileClick={onProfileClick}
              onBookingsClick={onBookingsClick}
              onAdminClick={onAdminClick}
              onAdminSettingsClick={onAdminSettingsClick}
              onAdminCustomersClick={onAdminCustomersClick}
              isAdmin={isAdmin}
            />
          </div>
        </>
      )}
    </div>
  );
}