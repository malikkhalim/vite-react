export interface Airport {
  code: string;
  city: string;
  name: string;
  country: string;
}

export const AIRPORTS: Record<string, Airport> = {
  'DIL': {
    code: 'DIL',
    city: 'Dili',
    name: 'Presidente Nicolau Lobato International Airport',
    country: 'Timor-Leste'
  },
  'DRW': {
    code: 'DRW',
    city: 'Darwin',
    name: 'Darwin International Airport',
    country: 'Australia'
  },
  'DPS': {
    code: 'DPS',
    city: 'Bali',
    name: 'Ngurah Rai International Airport',
    country: 'Indonesia'
  },
  'SIN': {
    code: 'SIN',
    city: 'Singapore',
    name: 'Singapore Changi Airport',
    country: 'Singapore'
  },
  'OEC': {
    code: 'OEC',
    city: 'Oecusse',
    name: 'Oecusse Airport',
    country: 'Timor-Leste'
  },
  'XMN': {
    code: 'XMN',
    city: 'Xiamen',
    name: 'Xiamen Gaoqi International Airport',
    country: 'China'
  }
} as const;

export type AirportCode = keyof typeof AIRPORTS;