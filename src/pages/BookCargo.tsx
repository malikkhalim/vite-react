import React from 'react';
import { Container } from '../components/layout/Container';
import { CargoSearchForm } from '../components/cargo/CargoSearchForm';
import { CargoProgress } from '../components/cargo/CargoProgress';
import { CargoDetails } from '../components/cargo/CargoDetails';
import { ContactDetails } from '../components/cargo/ContactDetails';
import { CargoSummary } from '../components/cargo/CargoSummary';
import { CargoCheckout } from '../components/cargo/CargoCheckout';
import { CargoConfirmation } from '../components/cargo/CargoConfirmation';
import { BackButton } from '../components/ui/BackButton';
import { useCargoBooking } from '../hooks/useCargoBooking';

export default function BookCargo() {
  const {
    step,
    searchData,
    cargoDetails,
    contactDetails,
    summary,
    handleSearch,
    handleDetailsSubmit,
    handleContactSubmit,
    handleSummarySubmit,
    handlePaymentSubmit,
    handleConfirm,
    goBack,
  } = useCargoBooking();

  return (
    <Container className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Book Cargo Space</h1>
        {step > 1 && <BackButton onClick={goBack} />}
      </div>

      <CargoProgress currentStep={step} />

      {step === 1 && <CargoSearchForm onSearch={handleSearch} />}
      
      {step === 2 && searchData && (
        <CargoDetails 
          searchData={searchData} 
          onSubmit={handleDetailsSubmit} 
        />
      )}

      {step === 3 && cargoDetails && (
        <ContactDetails
          cargoDetails={cargoDetails}
          onSubmit={handleContactSubmit}
        />
      )}

      {step === 4 && cargoDetails && contactDetails && (
        <CargoSummary
          cargoDetails={cargoDetails}
          contactDetails={contactDetails}
          onContinue={handleSummarySubmit}
        />
      )}

      {step === 5 && summary && (
        <CargoCheckout
          summary={summary}
          onSubmit={handlePaymentSubmit}
        />
      )}
      
      {step === 6 && (
        <CargoConfirmation 
          onClose={handleConfirm}
        />
      )}
    </Container>
  );
}