import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { ZONE_COORDINATES, type CochabambaZona } from '../types/checkout'

interface CochabambaMapProps {
  selectedZona: CochabambaZona
  direccion: string
  lat?: number
  lng?: number
  onLocationSelect: (direccion: string, lat: number, lng: number) => void
}

interface NominatimResult {
  place_id: number
  display_name: string
  lat: string
  lon: string
}

// Icono personalizado para el Pin en el mapa
const customPinIcon = L.divIcon({
  className: 'custom-map-pin',
  html: `
    <div style="
      background-color: #734F62;
      width: 38px;
      height: 38px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(115,79,98,0.4);
      border: 2px solid white;
    ">
      <span style="
        transform: rotate(45deg);
        color: white;
        font-size: 16px;
      ">🧁</span>
    </div>
  `,
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38],
})

export default function CochabambaMap({
  selectedZona,
  direccion,
  lat,
  lng,
  onLocationSelect,
}: CochabambaMapProps) {
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  const [searchQuery, setSearchQuery] = useState(direccion)
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number }>(() => {
    if (lat && lng) return { lat, lng }
    const coords = ZONE_COORDINATES[selectedZona] || { lat: -17.3895, lng: -66.1568 }
    return { lat: coords.lat, lng: coords.lng }
  })

  // 1. Inicializa el mapa
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    const initialCoords = ZONE_COORDINATES[selectedZona] || { lat: -17.3895, lng: -66.1568, zoom: 12 }
    const map = L.map(mapContainerRef.current, {
      center: [initialCoords.lat, initialCoords.lng],
      zoom: initialCoords.zoom,
      zoomControl: true,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map)

    const marker = L.marker([initialCoords.lat, initialCoords.lng], {
      icon: customPinIcon,
      draggable: true,
    }).addTo(map)

    markerRef.current = marker
    mapRef.current = map

    // Evento al arrastrar el Pin
    marker.on('dragend', () => {
      const pos = marker.getLatLng()
      handleCoordsChange(pos.lat, pos.lng, true)
    })

    // Evento al hacer clic en cualquier lugar del mapa
    map.on('click', (e: L.LeafletMouseEvent) => {
      marker.setLatLng(e.latlng)
      handleCoordsChange(e.latlng.lat, e.latlng.lng, true)
    })

    return () => {
      map.remove()
      mapRef.current = null
      markerRef.current = null
    }
  }, [])

  // 2. Vuela hacia la zona cuando cambia el selector de zona
  useEffect(() => {
    const coords = ZONE_COORDINATES[selectedZona]
    if (coords && mapRef.current && markerRef.current) {
      mapRef.current.flyTo([coords.lat, coords.lng], coords.zoom, {
        animate: true,
        duration: 1.2,
      })
      markerRef.current.setLatLng([coords.lat, coords.lng])
      setCurrentCoords({ lat: coords.lat, lng: coords.lng })
      onLocationSelect(direccion, coords.lat, coords.lng)
    }
  }, [selectedZona])

  // 3. Manejo del cambio de coordenadas y geocodificación inversa
  const handleCoordsChange = async (newLat: number, newLng: number, reverseGeocode = false) => {
    setCurrentCoords({ lat: newLat, lng: newLng })
    let newAddress = searchQuery

    if (reverseGeocode) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newLat}&lon=${newLng}&zoom=18&addressdetails=1`,
          { headers: { 'User-Agent': 'SarahBakeryApp/1.0' } }
        )
        const data = await response.json()
        if (data && data.display_name) {
          // Extrae el nombre de la calle/lugar simplificado
          const parts = data.display_name.split(',')
          newAddress = parts.slice(0, 3).join(',').trim()
          setSearchQuery(newAddress)
        }
      } catch (err) {
        console.error('Error al realizar geocodificación inversa:', err)
      }
    }

    onLocationSelect(newAddress, newLat, newLng)
  }

  // 4. Búsqueda Autocomplete con Nominatim
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 3) {
      setSuggestions([])
      setShowDropdown(false)
      return
    }

    const timer = setTimeout(async () => {
      setIsSearching(true)
      try {
        const queryWithZone = `${searchQuery}, ${selectedZona}, Cochabamba, Bolivia`
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            queryWithZone
          )}&limit=5&viewbox=-66.35,-17.30,-66.00,-17.45&bounded=1`,
          { headers: { 'User-Agent': 'SarahBakeryApp/1.0' } }
        )
        const data = await res.json()
        setSuggestions(data || [])
        setShowDropdown(true)
      } catch (err) {
        console.error('Error en búsqueda de direcciones:', err)
      } finally {
        setIsSearching(false)
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [searchQuery, selectedZona])

  // Selección de una sugerencia de búsqueda
  const handleSelectSuggestion = (item: NominatimResult) => {
    const itemLat = parseFloat(item.lat)
    const itemLng = parseFloat(item.lon)

    const shortAddress = item.display_name.split(',').slice(0, 3).join(',').trim()
    setSearchQuery(shortAddress)
    setShowDropdown(false)

    if (mapRef.current && markerRef.current) {
      mapRef.current.flyTo([itemLat, itemLng], 17, { animate: true, duration: 1 })
      markerRef.current.setLatLng([itemLat, itemLng])
    }

    handleCoordsChange(itemLat, itemLng, false)
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Input de Búsqueda de Calle con Autocomplete */}
      <div className="relative">
        <label className="block text-xs font-semibold text-[#3D2C33] mb-1">
          Busca tu calle / avenida o haz clic en el mapa *
        </label>
        <div className="relative">
          <input
            type="text"
            required
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              onLocationSelect(e.target.value, currentCoords.lat, currentCoords.lng)
            }}
            placeholder={`Ej. Av. América y Pando, ${selectedZona}`}
            className="w-full rounded-xl border border-taupe bg-cream/40 placeholder-[#A99C8E] text-[#3D2C33] text-sm pl-10 pr-10 py-3 outline-none focus:border-mauve transition-colors"
          />
          <span className="absolute left-3.5 top-3.5 text-base text-[#6B5560]">🔍</span>
          {isSearching && (
            <span className="absolute right-3.5 top-3.5 text-xs text-mauve animate-pulse">
              Buscando…
            </span>
          )}
        </div>

        {/* Dropdown de Sugerencias */}
        {showDropdown && suggestions.length > 0 && (
          <ul className="absolute z-[70] left-0 right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-taupe/30 max-h-56 overflow-y-auto divide-y divide-taupe/15 text-xs">
            {suggestions.map((item) => (
              <li key={item.place_id}>
                <button
                  type="button"
                  onClick={() => handleSelectSuggestion(item)}
                  className="w-full text-left px-4 py-3 hover:bg-mauve/10 transition-colors flex items-start gap-2"
                >
                  <span className="text-sm">📍</span>
                  <span className="text-[#3D2C33] line-clamp-2">{item.display_name}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Visor interactivo del Mapa */}
      <div className="relative rounded-xl2 overflow-hidden border-2 border-mauve/30 shadow-card">
        <div ref={mapContainerRef} className="w-full h-64 sm:h-72 z-10" />
      </div>
    </div>
  )
}
