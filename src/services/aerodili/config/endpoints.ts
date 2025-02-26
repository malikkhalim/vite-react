export const SOAP_ENDPOINTS = {
  FLIGHT_SEARCH: 'WsSearchFlight',
  FLIGHT_AVAILABILITY: 'WsFlightAvailability',
  FLIGHT_PRICING: 'WsFlightPricing',
  GENERATE_PNR: 'WsGeneratePNR',
  ISSUING: 'WsIssuing'
} as const;

export const SOAP_CREDENTIALS = {
  USERNAME: 'DILTRAVEL002',
  PASSWORD: 'Abc12345'
} as const;