import { SOAP_CONFIG } from '../config/soap';

export function createSoapHeaders(action: string) {
  return {
    'SOAPAction': `${SOAP_CONFIG.VERSION}#${action}`,
    'Content-Type': 'text/xml;charset=UTF-8',
  };
}

export function createAuthHeader() {
  return {
    'Username': process.env.AERODILI_USERNAME || 'DILTRAVEL002',
    'Password': process.env.AERODILI_PASSWORD || 'Abc12345'
  };
}