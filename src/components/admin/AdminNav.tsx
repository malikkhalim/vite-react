import React from 'react';
import { LayoutDashboard, Settings, Users, LogOut } from 'lucide-react';
import { useUserStore } from '../../stores/userStore';

export function AdminNav() {
  const { signOut } = useUserStore();
  
  return (
    <nav className="bg-sky-700 text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <span className="text-xl font-bold">Admin Panel</span>
            
            <div className="flex gap-6">
              <a href="/admin" className="flex items-center gap-2 hover:text-sky-200">
                <LayoutDashboard className="h-5 w-5" />
                Dashboard
              </a>
              <a href="/admin/settings" className="flex items-center gap-2 hover:text-sky-200">
                <Settings className="h-5 w-5" />
                Settings
              </a>
              <a href="/admin/customers" className="flex items-center gap-2 hover:text-sky-200">
                <Users className="h-5 w-5" />
                Customers
              </a>
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