import React from 'react';
import { Home } from 'lucide-react';

interface HomeButtonProps {
  onClick: () => void;
  className?: string;
}

export function HomeButton({ onClick, className = '' }: HomeButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 text-white hover:text-sky-200 transition-colors ${className}`}
      aria-label="Go to home page"
    >
      <Home className="h-5 w-5" />
      <span>Home</span>
    </button>
  );
}