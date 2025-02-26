import React from 'react';
import { User, LogIn } from 'lucide-react';
import { useUserStore } from '../../stores/userStore';
import { LoginModal } from './LoginModal';

export function AuthControls() {
  const { user, signOut } = useUserStore();
  const [showLoginModal, setShowLoginModal] = React.useState(false);

  if (user) {
    return (
      <div className="relative group">
        <button className="flex items-center gap-2 text-white hover:text-sky-200">
          <User className="h-5 w-5" />
          <span>{user.firstName || 'Account'}</span>
        </button>
        
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
          <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            Profile
          </a>
          <a href="/bookings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            My Bookings
          </a>
          <button
            onClick={signOut}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowLoginModal(true)}
        className="flex items-center gap-2 text-white hover:text-sky-200"
      >
        <LogIn className="h-5 w-5" />
        <span>Sign In</span>
      </button>

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </>
  );
}