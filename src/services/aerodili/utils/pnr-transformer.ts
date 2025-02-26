import { PNRResponse } from '../types/pnr-response';

export class PNRTransformer {
  static transformResponse(response: any): PNRResponse {
    // Extract the actual response data from SOAP envelope
    const pnrData = response['SOAP-ENV:Envelope']['SOAP-ENV:Body']
      ['ns1:WsGeneratePNRResponse'].return;

    return {
      Username: pnrData.Username,
      BookingCode: pnrData.BookingCode,
      YourItineraryDetails: {
        ReservationDetails: this.transformReservationDetails(pnrData.YourItineraryDetails.ReservationDetails),
        PassengerDetails: this.transformPassengerDetails(pnrData.YourItineraryDetails.PassengerDetails),
        ItineraryDetails: {
          Journey: this.transformJourneyDetails(pnrData.YourItineraryDetails.ItineraryDetails.Journey)
        },
        PaymentDetails: this.transformPaymentDetails(pnrData.YourItineraryDetails.PaymentDetails),
        ContactList: this.transformContactList(pnrData.YourItineraryDetails.ContactList),
        AgentDetails: pnrData.YourItineraryDetails.AgentDetails
      },
      ErrorCode: pnrData.ErrorCode,
      ErrorMessage: pnrData.ErrorMessage
    };
  }

  private static transformReservationDetails(details: any): ReservationDetails {
    return {
      BookingCode: details.BookingCode,
      BookingDate: details.BookingDate,
      BalanceDue: details.BalanceDue,
      BalanceDueRemarks: details.BalanceDueRemarks,
      CurrencyCode: details.CurrencyCode,
      Time: details.Time,
      TimeDescription: details.TimeDescription,
      Status: details.Status
    };
  }

  private static transformPassengerDetails(details: any): PassengerDetails[] {
    const passengers = Array.isArray(details.item) ? details.item : [details.item];
    return passengers.map(p => ({
      No: p.No,
      Suffix: p.Suffix,
      FirstName: p.FirstName,
      LastName: p.LastName,
      SeatQty: p.SeatQty,
      TicketNumber: p.TicketNumber,
      FrequentFlyerNumber: p.FrequentFlyerNumber,
      SpecialRequest: p.SpecialRequest,
      TravelDoc: this.transformTravelDocs(p.TravelDoc)
    }));
  }

  private static transformTravelDocs(docs: any): TravelDoc[] {
    const travelDocs = Array.isArray(docs.item) ? docs.item : [docs.item];
    return travelDocs.map(doc => ({
      DocType: doc.DocType,
      DocNumber: doc.DocNumber,
      ExpirationDate: doc.ExpirationDate
    }));
  }

  private static transformJourneyDetails(journey: any) {
    const segments = Array.isArray(journey.item.Segment.item) 
      ? journey.item.Segment.item 
      : [journey.item.Segment.item];

    return [{
      Segment: segments.map(s => ({
        FlownDate: s.FlownDate,
        FlightNo: s.FlightNo,
        CityFrom: s.CityFrom,
        CityTo: s.CityTo,
        CityFromName: s.CityFromName,
        CityToName: s.CityToName,
        StdLT: s.StdLT,
        StaLT: s.StaLT,
        ReservationStatus: s.ReservationStatus,
        Class: s.Class,
        CheckInStatus: s.CheckInStatus
      }))
    }];
  }

  private static transformPaymentDetails(details: any): PaymentDetails {
    return {
      BasicFare: details.BasicFare,
      Others: details.Others,
      Sti: details.Sti,
      Total: details.Total,
      DirectVoucher: details.DirectVoucher,
      AddOn: details.AddOn,
      Nta: details.Nta,
      CurrencyCode: details.CurrencyCode
    };
  }

  private static transformContactList(contacts: any): ContactInfo[] {
    const contactList = Array.isArray(contacts.item) ? contacts.item : [contacts.item];
    return contactList.map(c => ({
      Type: c.Type,
      Description: c.Description,
      Value: c.Value
    }));
  }
}