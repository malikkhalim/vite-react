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
    loading,
    error,
    searchData,
    flights,
    selectedFlight,
    selectedReturnFlight,
    bookingCode,
    ticketIssued,
    searchFlights,
    selectFlight,
    submitPassengerDetails,
    processPayment,
    resetBooking,
    handleDateChange,
    goBack
  } = useBookingFlow();

  const handlePaymentSuccess = () => {
    processPayment({ /* payment details */ });
  };

  return (
    <Container className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Book a Flight</h1>
        {step > 1 && <BackButton onClick={goBack} />}
      </div>

      <BookingProgress currentStep={step} />

      {loading && (
        <div className="bg-white p-8 rounded-lg shadow-md text-center mt-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing your request...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mt-4 mb-4">
          {error}
        </div>
      )}

      {!loading && (
        <div className="mt-8">
          {step === 1 && (
            <FlightSearchForm onSearch={searchFlights} />
          )}

          {step === 2 && searchData && (
            <FlightSearch
              searchData={searchData}
              selectedClass={searchData.class}
              onDateChange={handleDateChange}
              onFlightSelect={selectFlight}
              selectedOutboundFlight={selectedFlight}
              selectedReturnFlight={selectedReturnFlight}
            />
          )}

          {step === 3 && selectedFlight && searchData && (
            <PassengerForm
              flight={selectedFlight}
              passengerCount={searchData.passengers}
              onSubmit={submitPassengerDetails}
            />
          )}

          {step === 4 && selectedFlight && bookingCode && (
            <PaymentForm
              amount={selectedFlight.price} // Adjust calculation as needed
              bookingCode={bookingCode}
              onSuccess={handlePaymentSuccess}
            />
          )}

          {step === 5 && selectedFlight && ticketIssued && (
            <BookingConfirmation
              flight={selectedFlight}
              bookingCode={bookingCode || ""}
              onClose={resetBooking}
            />
          )}
        </div>
      )}
    </Container>
  );
}