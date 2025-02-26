const ONEMAP_API = 'https://developers.onemap.sg/commonapi/search';

export interface OneMapAddress {
  ADDRESS: string;
  POSTAL: string;
  BUILDING: string;
  BLOCK: string;
}

export interface OneMapResponse {
  found: number;
  totalNumPages: number;
  pageNum: number;
  results: OneMapAddress[];
}

export async function lookupPostalCode(postalCode: string): Promise<OneMapAddress | null> {
  try {
    const response = await fetch(
      `${ONEMAP_API}?searchVal=${postalCode}&returnGeom=N&getAddrDetails=Y`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch address');
    }

    const data: OneMapResponse = await response.json();
    
    if (data.found === 0) {
      return null;
    }

    return data.results[0];
  } catch (error) {
    throw new Error('Failed to lookup address');
  }
}