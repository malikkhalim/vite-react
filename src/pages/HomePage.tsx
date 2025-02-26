import React from 'react';
import Hero from '../components/Hero';
import Services from '../components/Services';

interface HomePageProps {
  onBookFlight: () => void;
  onBookCargo: () => void;
}

export function HomePage({ onBookFlight, onBookCargo }: HomePageProps) {
  return (
    <>
      <Hero 
        onBookFlightClick={onBookFlight}
        onBookCargoClick={onBookCargo}
      />
      <Services />
    </>
  );
}