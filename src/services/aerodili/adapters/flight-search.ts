import { format } from 'date-fns';
import { SoapClient } from '../client/soap-client';
import { SOAP_ENDPOINTS } from '../config/endpoints';
import type { BookingFormData, Flight } from '../../../types/flight';

export class FlightSearchAdapter {
  static async searchFlights(formData: BookingFormData) {
    try {
      console.log("Search data:", formData);
      
      const requestData = {
        ReturnStatus: formData.tripType === 'return' ? 'YES' : 'NO',
        CityFrom: formData.from,
        CityTo: formData.to,
        DepartDate: format(new Date(formData.departureDate), 'dd-MMM-yy'),
        ReturnDate: formData.returnDate 
          ? format(new Date(formData.returnDate), 'dd-MMM-yy')
          : '',
        PromoCode: '',
        Adult: formData.passengers.adult.toString(),
        Child: formData.passengers.child.toString(),
        Infant: formData.passengers.infant.toString()
      };

      const response = await SoapClient.execute(
        'WsSearchFlight',
        requestData
      );

      if (!response.success) {
        throw new Error(response.error?.message || 'Search failed');
      }

      // TODO: Process actual response
      // For now, return mock data
      return this.getMockFlightData(formData);
    } catch (error) {
      console.error("Flight search error:", error);
      
      // Return mock data on error
      console.log("Falling back to mock data");
      return this.getMockFlightData(formData);
    }
  }

  // Mock flight data generator for testing
  private static getMockFlightData(formData: BookingFormData) {
    const mockSearchKey = "00000221847678736878717382718985828470867085887";
    const departureDate = new Date(formData.departureDate);
    const returnDate = formData.returnDate ? new Date(formData.returnDate) : null;
    
    // Generate a mock flight for outbound
    const outboundFlight: Flight = {
      id: 'AE555',
      from: formData.from,
      to: formData.to,
      departureDate: departureDate.toISOString(),
      arrivalDate: new Date(departureDate.getTime() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours later
      duration: 120,
      aircraft: 'Boeing 737-800',
      price: 299,
      businessPrice: 599,
      seatsAvailable: 45,
      businessSeatsAvailable: 12,
      baggage: {
        economy: 23,
        business: 32
      },
      services: {
        economy: ['Complimentary snacks', 'In-flight entertainment'],
        business: ['Priority boarding', 'Premium meals', 'Extra legroom']
      },
      searchKey: mockSearchKey,
      classKey: "72753:X:S"
    };
    
    // Generate return flight if needed
    const returnFlights = formData.tripType === 'return' && returnDate 
      ? [{
          id: 'AE556',
          from: formData.to,
          to: formData.from,
          departureDate: returnDate.toISOString(),
          arrivalDate: new Date(returnDate.getTime() + 2 * 60 * 60 * 1000).toISOString(),
          duration: 120,
          aircraft: 'Boeing 737-800',
          price: 299,
          businessPrice: 599,
          seatsAvailable: 45,
          businessSeatsAvailable: 12,
          baggage: {
            economy: 23,
            business: 32
          },
          services: {
            economy: ['Complimentary snacks', 'In-flight entertainment'],
            business: ['Priority boarding', 'Premium meals', 'Extra legroom']
          },
          searchKey: mockSearchKey,
          classKey: "72754:X:S"
        }]
      : [];
    
    return {
      outboundFlights: [outboundFlight],
      returnFlights: returnFlights
    };
  }
}