import React, { useState, useRef, useEffect } from 'react';
import { User } from 'lucide-react';
import { useAuthStore } from '../../../stores/authStore';
import { UserMenuDropdown } from './UserMenuDropdown';

interface UserMenuProps {
  onProfileClick: () => void;
  onBookingsClick: () => void;
}

export function UserMenu({ onProfileClick, onBookingsClick }: UserMenuProps) {
  const { user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
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
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-white hover:text-sky-200 transition-colors p-2 rounded-md"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <User className="h-5 w-5" />
        <span>{user.displayName || user.email || 'Account'}</span>
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
              onLogout={logout}
              onProfileClick={onProfileClick}
              onBookingsClick={onBookingsClick}
            />
          </div>
        </>
      )}
    </div>
  );
}