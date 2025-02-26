import React from 'react';
import { Container } from '../components/layout/Container';
import { BookingProgress } from '../components/booking/BookingProgress';
import { FlightSearchForm } from '../components/booking/FlightSearchForm';
import { FlightSearch } from '../components/booking/FlightSearch';
import PassengerForm from '../components/booking/PassengerForm';
import { PaymentForm } from '../components/payment/PaymentForm';
import BookingConfirmation from '../components/booking/BookingConfirmation';
import { BackButton } from '../components/ui/BackButton';
import { useBookingFlow } from '../hooks/useBookingFlow';

export default function BookFlight() {
  const {
    step,
    searchData,
    selectedFlight,
    selectedReturnFlight,
    bookingData,
    handleSearch,
    handleFlightSelect,
    handlePassengerSubmit,
    handlePaymentSubmit,
    handleBookingComplete,
    handleDateChange,
    goBack,
  } = useBookingFlow();

  const handlePaymentSuccess = () => {
    handlePaymentSubmit();
  };

  return (
    <Container className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Book a Flight</h1>
        {step > 1 && <BackButton onClick={goBack} />}
      </div>

      <BookingProgress currentStep={step} />

      <div className="mt-8">
        {step === 1 && (
          <FlightSearchForm onSearch={handleSearch} />
        )}

        {step === 2 && searchData && (
          <FlightSearch
            searchData={searchData}
            selectedClass={searchData.class}
            onDateChange={handleDateChange}
            onFlightSelect={handleFlightSelect}
            selectedOutboundFlight={selectedFlight}
            selectedReturnFlight={selectedReturnFlight}
          />
        )}

        {step === 3 && selectedFlight && searchData && (
          <PassengerForm
            flight={selectedFlight}
            passengerCount={searchData.passengers}
            onSubmit={handlePassengerSubmit}
          />
        )}

        {step === 4 && selectedFlight && bookingData && (
          <PaymentForm
            amount={bookingData.totalAmount}
            passengers={searchData!.passengers}
            flightPrice={selectedFlight.price}
            contactDetails={bookingData.contactDetails}
            onSuccess={handlePaymentSuccess}
          />
        )}

        {step === 5 && selectedFlight && bookingData && (
          <BookingConfirmation
            flight={selectedFlight}
            bookingData={bookingData}
            onClose={handleBookingComplete}
          />
        )}
      </div>
    </Container>
  );
}