import React from 'react';
import { LucideIcon } from 'lucide-react';

interface UserMenuItemProps {
  icon?: LucideIcon;
  children: React.ReactNode;
  onClick?: () => void;
}

export function UserMenuItem({ icon: Icon, children, onClick }: UserMenuItemProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
      role="menuitem"
    >
      {Icon && <Icon className="h-4 w-4" />}
      <span>{children}</span>
    </button>
  );
}