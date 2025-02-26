import { format } from 'date-fns';
import { FlightSearchRequest } from '../types/flight-search';

export function createSoapEnvelope(action: string, params: any): string {
  return `
    <soapenv:Envelope 
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xmlns:xsd="http://www.w3.org/2001/XMLSchema"
      xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
      xmlns:urn="urn:sj_service">
      <soapenv:Header/>
      <soapenv:Body>
        <urn:${action} soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
          <param xsi:type="urn:req${action}" xmlns:urn="urn:webservice">
            ${Object.entries(params)
              .map(([key, value]) => 
                `<${key} xsi:type="xsd:string">${value}</${key}>`
              )
              .join('\n')}
          </param>
        </urn:${action}>
      </soapenv:Body>
    </soapenv:Envelope>
  `;
}

export function formatSearchDate(date: Date): string {
  return format(date, 'dd-MMM-yy');
}