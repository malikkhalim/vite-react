import { XMLParser } from 'fast-xml-parser';
import type { FlightSearchResponse } from '../types/flight-search';

export class ResponseParser {
  private static parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    textNodeName: '#text'
  });

  static parseFlightSearchResponse(xmlString: string): FlightSearchResponse {
    const parsed = this.parser.parse(xmlString);
    const response = parsed['SOAP-ENV:Envelope']['SOAP-ENV:Body']
      ['ns1:WsSearchFlightResponse'].return;

    // Transform the response to match our interface
    return {
      Username: response.Username,
      Adult: response.Adult,
      Child: response.Child,
      Infant: response.Infant,
      TripDetail: Array.isArray(response.TripDetail.item) 
        ? response.TripDetail.item 
        : [response.TripDetail.item],
      ErrorCode: response.ErrorCode,
      ErrorMessage: response.ErrorMessage
    };
  }
}