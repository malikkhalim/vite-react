import { XMLParser } from 'fast-xml-parser';
import { SOAP_CREDENTIALS } from '../config/endpoints';
import type { ApiResponse } from '../types/common';

export class SoapClient {
  private static readonly API_URL = 'https://api.aerodili.com/v1';
  private static readonly parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '_'
  });

  static async execute<T>(action: string, params: Record<string, any>): Promise<ApiResponse<T>> {
    try {
      const envelope = this.createEnvelope(action, {
        ...params,
        Username: SOAP_CREDENTIALS.USERNAME,
        Password: SOAP_CREDENTIALS.PASSWORD
      });

      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/xml;charset=UTF-8',
          'SOAPAction': action
        },
        body: envelope
      });

      if (!response.ok) {
        throw new Error(`SOAP request failed: ${response.statusText}`);
      }

      const xmlResponse = await response.text();
      return this.parseResponse<T>(xmlResponse);
    } catch (error) {
      console.error(`SOAP ${action} failed:`, error);
      return {
        success: false,
        error: {
          code: 'SOAP_ERROR',
          message: error instanceof Error ? error.message : 'SOAP request failed'
        }
      };
    }
  }

  private static createEnvelope(action: string, params: Record<string, any>): string {
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

  private static parseResponse<T>(xmlString: string): ApiResponse<T> {
    try {
      const result = this.parser.parse(xmlString);
      const response = result['soapenv:Envelope']['soapenv:Body'][`ns:${action}Response`];

      if (response.ErrorCode || response.ErrorMessage) {
        return {
          success: false,
          error: {
            code: response.ErrorCode || 'SOAP_ERROR',
            message: response.ErrorMessage || 'Unknown error'
          }
        };
      }

      return {
        success: true,
        data: response as T
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'PARSE_ERROR',
          message: 'Failed to parse SOAP response'
        }
      };
    }
  }
}