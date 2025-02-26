import axios from 'axios';
import { AERODILI_CONFIG } from './config';
import type { ApiResponse } from './types/common';
import type { FlightSearchRequest, FlightSearchResponse } from './types/flight';

const api = axios.create({
  baseURL: AERODILI_CONFIG.API_URL,
  timeout: AERODILI_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export class AeroDiliAPI {
  static async searchFlights(params: FlightSearchRequest): Promise<ApiResponse<FlightSearchResponse>> {
    try {
      // Convert to REST API format
      const searchParams = {
        origin: params.from,
        destination: params.to,
        date: params.date,
        passengers: {
          adult: params.passengers.adult,
          child: params.passengers.child,
          infant: params.passengers.infant
        }
      };

      const response = await api.post('/flights/search', searchParams);

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'API_ERROR',
          message: error instanceof Error ? error.message : 'API request failed'
        }
      };
    }
  }
}