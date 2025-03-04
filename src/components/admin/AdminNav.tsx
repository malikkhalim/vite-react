import React from 'react';
import { LayoutDashboard, Settings, Users, LogOut } from 'lucide-react';
import { useUserStore } from '../../stores/userStore';
import { usePageNavigation } from '../../hooks/usePageNavigation';

export function AdminNav() {
  const { signOut } = useUserStore();
  const { 
    handleAdminClick, 
    handleAdminSettingsClick, 
    handleAdminCustomersClick 
  } = usePageNavigation();
  
  return (
    <nav className="bg-sky-700 text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <span className="text-xl font-bold">Admin Panel</span>
            
            <div className="flex gap-6">
              <button 
                onClick={handleAdminClick} 
                className="flex items-center gap-2 hover:text-sky-200"
              >
                <LayoutDashboard className="h-5 w-5" />
                Dashboard
              </button>
              <button 
                onClick={handleAdminSettingsClick} 
                className="flex items-center gap-2 hover:text-sky-200"
              >
                <Settings className="h-5 w-5" />
                Settings
              </button>
              <button 
                onClick={handleAdminCustomersClick} 
                className="flex items-center gap-2 hover:text-sky-200"
              >
                <Users className="h-5 w-5" />
                Customers
              </button>
            </div>
          </div>

          <button
            onClick={signOut}
            className="flex items-center gap-2 hover:text-sky-200"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}