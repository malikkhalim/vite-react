import { useState } from 'react';
import { validateCargoRoute } from '../constants/routes';
import { 
  CargoSearchData, 
  CargoDetails, 
  ContactDetails, 
  CargoSummary,
  PaymentMethod 
} from '../types/cargo';

export function useCargoBooking() {
  const [step, setStep] = useState(1);
  const [searchData, setSearchData] = useState<CargoSearchData | null>(null);
  const [cargoDetails, setCargoDetails] = useState<CargoDetails | null>(null);
  const [contactDetails, setContactDetails] = useState<{
    shipper: ContactDetails;
    consignee: ContactDetails;
  } | null>(null);
  const [summary, setSummary] = useState<CargoSummary | null>(null);

  const handleSearch = (data: CargoSearchData) => {
    const error = validateCargoRoute(data.from, data.to);
    if (error) {
      console.error('Invalid route:', error);
      return;
    }
    
    setSearchData(data);
    setStep(2);
  };

  const handleDetailsSubmit = (data: CargoDetails) => {
    setCargoDetails(data);
    setStep(3);
  };

  const handleContactSubmit = (shipper: ContactDetails, consignee: ContactDetails) => {
    setContactDetails({ shipper, consignee });
    setStep(4);
  };

  const handleSummarySubmit = (summaryData: CargoSummary) => {
    setSummary(summaryData);
    setStep(5);
  };

  const handlePaymentSubmit = () => {
    setStep(6);
  };

  const handleConfirm = () => {
    // Reset all state
    setStep(1);
    setSearchData(null);
    setCargoDetails(null);
    setContactDetails(null);
    setSummary(null);
  };

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
      // Clear data for the current step when going back
      switch (step) {
        case 6:
          // Keep summary when going back to payment
          break;
        case 5:
          setSummary(null);
          break;
        case 4:
          setContactDetails(null);
          break;
        case 3:
          setCargoDetails(null);
          break;
        case 2:
          setSearchData(null);
          break;
      }
    }
  };

  return {
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
  };
}