export type CochabambaZona =
  | 'Cercado Centro'
  | 'Cercado Norte'
  | 'Cercado Sur'
  | 'Tiquipaya'
  | 'Sacaba'
  | 'Quillacollo'
  | 'Colcapirhua'

export const COCHABAMBA_ZONAS: CochabambaZona[] = [
  'Cercado Centro',
  'Cercado Norte',
  'Cercado Sur',
  'Tiquipaya',
  'Sacaba',
  'Quillacollo',
  'Colcapirhua',
]

export const ZONE_COORDINATES: Record<CochabambaZona, { lat: number; lng: number; zoom: number }> = {
  'Cercado Centro': { lat: -17.3935, lng: -66.157, zoom: 15 },
  'Cercado Norte': { lat: -17.368, lng: -66.158, zoom: 14 },
  'Cercado Sur': { lat: -17.42, lng: -66.15, zoom: 14 },
  Tiquipaya: { lat: -17.338, lng: -66.216, zoom: 14 },
  Sacaba: { lat: -17.404, lng: -66.04, zoom: 14 },
  Quillacollo: { lat: -17.393, lng: -66.281, zoom: 14 },
  Colcapirhua: { lat: -17.388, lng: -66.236, zoom: 14 },
}

export interface CheckoutFormData {
  nombre: string
  telefono: string
  email: string
  zona: CochabambaZona
  direccion: string
  referencias: string
  fechaEntrega: string
  horaEntrega: string
  lat?: number
  lng?: number
}

