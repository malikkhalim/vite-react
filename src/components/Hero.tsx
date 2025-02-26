import React from 'react';
import { Plane, Package } from 'lucide-react';

interface HeroProps {
  onBookFlightClick: () => void;
  onBookCargoClick: () => void;
}

export default function Hero({ onBookFlightClick, onBookCargoClick }: HeroProps) {
  return (
    <div className="relative h-[600px] flex items-center">
      {/* Background Image Container */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>
      
      {/* Content Container */}
      <div className="container mx-auto px-4 relative" style={{ zIndex: 1 }}>
        <div className="max-w-3xl text-white">
          <h1 className="text-5xl font-bold mb-6">Your Gateway to East Timor</h1>
          <p className="text-xl mb-8">Experience seamless air travel and cargo services with Timor Pacific Logistics</p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <button 
              onClick={onBookFlightClick}
              className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Plane className="h-5 w-5" />
              Book a Flight
            </button>
            <button 
              onClick={onBookCargoClick}
              className="bg-white hover:bg-gray-100 text-sky-900 px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Package className="h-5 w-5" />
              Book Cargo Space
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}