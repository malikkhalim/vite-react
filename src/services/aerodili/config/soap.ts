export const SOAP_CONFIG = {
  WSDL_URL: 'http://demo-aerodili.nieve.id/wsdl.apiv12/index.php?wsdl',
  VERSION: 'v1.2',
  ACTIONS: {
    FLIGHT: {
      SEARCH: 'WsSearchFlight',
      AVAILABILITY: 'WsFlightAvailability',
      PRICING: 'WsFlightPricing'
    },
    BOOKING: {
      CREATE: 'WsCreateBooking',
      STATUS: 'WsBookingStatus',
      CANCEL: 'WsCancelBooking'
    },
    PAYMENT: {
      CREATE: 'WsCreatePayment',
      VERIFY: 'WsVerifyPayment'
    }
  },
  TIMEOUT: 30000,
  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY_MS: 1000,
    BACKOFF: true
  }
} as const;