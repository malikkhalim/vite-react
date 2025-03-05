import { SoapClient } from '../client/soap-client';
import type { AirportCode } from '../../../types/airport';

interface RouteOperation {
  from: AirportCode;
  fromName: string;
  fromCountry: string;
  fromAirport: string;
  to: AirportCode;
  toName: string;
  toCountry: string;
  toAirport: string;
  toTimezone: string;
  isInternational: boolean;
}

export class RouteOperationsAdapter {
  static async getRoutes(): Promise<RouteOperation[]> {
    try {
      const response = await SoapClient.execute('WsRouteOperate', {});

      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to retrieve routes');
      }

      // Transform the response to our required format
      const routes = response.data.RouteOperates?.map((item: { CityFrom: string; CityFromName: any; CityFromCountry: any; ApoNameFrom: any; CityTo: string; CityToName: any; CityToCountry: any; ApoNameTo: any; TimeZoneTo: any; StatusRoute: string; }) => ({
        from: item.CityFrom as AirportCode,
        fromName: item.CityFromName,
        fromCountry: item.CityFromCountry,
        fromAirport: item.ApoNameFrom,
        to: item.CityTo as AirportCode,
        toName: item.CityToName,
        toCountry: item.CityToCountry,
        toAirport: item.ApoNameTo,
        toTimezone: item.TimeZoneTo,
        isInternational: item.StatusRoute === 'I'
      })) || [];

      return routes;
    } catch (error) {
      console.error('Error fetching routes:', error);
      throw error;
    }
  }

  // Get all unique airports from routes
  static async getAirports(): Promise<{
    code: AirportCode;
    city: string;
    name: string;
    country: string;
  }[]> {
    const routes = await this.getRoutes();
    
    // Create a map to deduplicate airports
    const airportsMap = new Map();
    
    // Add origin airports
    routes.forEach(route => {
      if (!airportsMap.has(route.from)) {
        airportsMap.set(route.from, {
          code: route.from,
          city: route.fromName,
          name: route.fromAirport,
          country: route.fromCountry
        });
      }
    });
    
    // Add destination airports
    routes.forEach(route => {
      if (!airportsMap.has(route.to)) {
        airportsMap.set(route.to, {
          code: route.to,
          city: route.toName,
          name: route.toAirport,
          country: route.toCountry
        });
      }
    });
    
    return Array.from(airportsMap.values());
  }
  
  // Get available destinations for a specific origin
  static async getDestinationsForOrigin(origin: AirportCode): Promise<AirportCode[]> {
    const routes = await this.getRoutes();
    return routes
      .filter(route => route.from === origin)
      .map(route => route.to);
  }
}