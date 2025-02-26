export type AirportCode = 'DIL' | 'DRW' | 'DPS' | 'SIN' | 'OEC' | 'XMN';

export interface Airport {
  code: AirportCode;
  city: string;
  name: string;
  country: string;
}