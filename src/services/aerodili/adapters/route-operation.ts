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

// Helper function to extract actual text value from XML parsed objects
function extractTextValue(value: any): string {
  if (!value) return '';
  
  // If it's a string, return it directly
  if (typeof value === 'string') return value;
  
  // If it has #text property (common in XML parsing), return that
  if (value['#text']) return value['#text'];
  
  // For objects with xsi:type attributes
  if (typeof value === 'object') {
    // Try to find a text property
    for (const key in value) {
      if (key === '#text') return value[key];
    }
  }
  
  // If we can't extract a text value, stringify the object
  return String(value);
}

export class RouteOperationsAdapter {
  static async getRoutes(): Promise<RouteOperation[]> {
    try {
      const response = await SoapClient.execute('WsRouteOperate', {});

      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to retrieve routes');
      }

      // Extract the RouteOperates array
      let routeItems = [];
      if (response.data?.RouteOperates) {
        if (Array.isArray(response.data.RouteOperates)) {
          routeItems = response.data.RouteOperates;
        } else if (response.data.RouteOperates.item && Array.isArray(response.data.RouteOperates.item)) {
          routeItems = response.data.RouteOperates.item;
        } else {
          routeItems = [response.data.RouteOperates];
        }
      }

      // Transform the response to our required format
      const routes = routeItems.map(item => ({
        from: extractTextValue(item.CityFrom) as AirportCode,
        fromName: extractTextValue(item.CityFromName),
        fromCountry: extractTextValue(item.CityFromCountry),
        fromAirport: extractTextValue(item.ApoNameFrom),
        to: extractTextValue(item.CityTo) as AirportCode,
        toName: extractTextValue(item.CityToName),
        toCountry: extractTextValue(item.CityToCountry),
        toAirport: extractTextValue(item.ApoNameTo),
        toTimezone: extractTextValue(item.TimeZoneTo),
        isInternational: extractTextValue(item.StatusRoute) === 'I'
      }));

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