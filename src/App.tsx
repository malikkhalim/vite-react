import React from 'react';
import { MainLayout } from './layouts/MainLayout';
import { HomePage } from './pages/HomePage';
import BookFlight from './pages/BookFlight';
import BookCargo from './pages/BookCargo';
import { useNavigation } from './hooks/useNavigation';

export default function App() {
  const { 
    currentPage, 
    handleHomeClick, 
    handleBookFlightClick, 
    handleBookCargoClick,
  } = useNavigation();

  const renderContent = () => {
    switch (currentPage) {
      case 'flight':
        return <BookFlight />;
      case 'cargo':
        return <BookCargo />;
      default:
        return <HomePage onBookFlight={handleBookFlightClick} onBookCargo={handleBookCargoClick} />;
    }
  };

  return (
    <MainLayout
      onHomeClick={handleHomeClick}
      onBookFlightClick={handleBookFlightClick}
      onBookCargoClick={handleBookCargoClick}
    >
      {renderContent()}
    </MainLayout>
  );
}