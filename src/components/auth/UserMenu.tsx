import React, { useState } from 'react';
import { User, LogOut } from 'lucide-react';
import { useUserStore } from '../../stores/userStore';


export function UserMenu() {
  const { user, signOut } = useUserStore();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-white hover:text-sky-200"
      >
        <User className="h-5 w-5" />
        <span>{user.firstName || 'Account'}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
          <a
            href="/profile"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Profile
          </a>
          <a
            href="/bookings"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            My Bookings
          </a>
          <button
            onClick={signOut}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}