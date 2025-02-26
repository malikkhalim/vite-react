import { BaseClient } from './base';
import { SOAP_ACTIONS } from '../config';
import { validateFlightSearch } from '../utils/validation';
import { transformSearchRequest, transformSearchResponse } from '../utils/transform';
import { cache } from '../utils/cache';
import { CACHE_CONFIG } from '../constants';
import type { ApiResponse } from '../types/common';
import type {
  FlightSearchRequest,
  FlightSearchResponse,
  FlightAvailabilityRequest,
  FlightAvailabilityResponse,
  FlightPricingRequest,
  FlightPricingResponse,
} from '../types/flight';

export class FlightClient extends BaseClient {
  static async searchFlights(params: FlightSearchRequest): Promise<ApiResponse<FlightSearchResponse>> {
    const validationError = validateFlightSearch(params);
    if (validationError) {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: validationError
        }
      };
    }

    const cacheKey = `flights:${params.from}:${params.to}:${params.date}`;
    const cached = cache.get<FlightSearchResponse>(cacheKey);
    
    if (cached) {
      return {
        success: true,
        data: cached
      };
    }

    try {
      const soapRequest = transformSearchRequest(params);
      const response = await this.execute(
        SOAP_ACTIONS.FLIGHT.SEARCH,
        soapRequest
      );

      if (!response.success) {
        return response;
      }

      const transformedData = transformSearchResponse(response.data);
      cache.set(cacheKey, transformedData, { 
        ttl: CACHE_CONFIG.TTL.FLIGHT_SEARCH 
      });

      return {
        success: true,
        data: transformedData
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'SOAP_ERROR',
          message: error instanceof Error ? error.message : 'SOAP request failed'
        }
      };
    }
  }
}