'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';

export default function MapPicker({ value, onChange, cityHint = '', addressHint = '' }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerInstance = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchError, setSearchError] = useState('');
  const [searching, setSearching] = useState(false);

  // Default coordinate set (New Delhi coordinates: [latitude, longitude])
  const defaultCenter = [28.6139, 77.2090];
  const initialLat = value?.lat || defaultCenter[0];
  const initialLng = value?.lng || defaultCenter[1];

  // SVG Custom Pin
  const customPin = L.divIcon({
    html: `
      <svg width="32" height="42" viewBox="0 0 30 42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 0C6.71573 0 0 6.71573 0 15C0 26.25 15 42 15 42C15 42 30 26.25 30 15C30 6.71573 23.2843 0 15 0ZM15 20.25C12.1005 20.25 9.75 17.8995 9.75 15C9.75 12.1005 12.1005 9.75 15 9.75C17.8995 9.75 20.25 12.1005 20.25 15C20.25 17.8995 17.8995 20.25 15 20.25Z" fill="#0d9488" stroke="white" stroke-width="2"/>
      </svg>
    `,
    className: 'custom-marker-pin',
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -40]
  });

  // Combine hints for initial search queries
  useEffect(() => {
    if (!value?.lat && !value?.lng) {
      const combined = [addressHint, cityHint].filter(Boolean).join(', ');
      setSearchQuery(combined);
    }
  }, [cityHint, addressHint, value]);

  useEffect(() => {
    // Initialize map
    if (!mapInstance.current && mapRef.current) {
      mapInstance.current = L.map(mapRef.current).setView([initialLat, initialLng], 14);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstance.current);

      // Create draggable marker
      markerInstance.current = L.marker([initialLat, initialLng], {
        draggable: true,
        icon: customPin,
      }).addTo(mapInstance.current);

      // Handle marker drag event
      markerInstance.current.on('dragend', () => {
        const position = markerInstance.current.getLatLng();
        onChange({ lat: position.lat, lng: position.lng });
      });

      // Handle map click to place marker
      mapInstance.current.on('click', (e) => {
        const { lat, lng } = e.latlng;
        markerInstance.current.setLatLng([lat, lng]);
        onChange({ lat, lng });
      });
    }

    // Cleanup map on unmount
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []); // Run once on mount

  // Sync value changes (e.g. if updated externally via search)
  useEffect(() => {
    if (mapInstance.current && markerInstance.current && value?.lat && value?.lng) {
      const currentPos = markerInstance.current.getLatLng();
      if (currentPos.lat !== value.lat || currentPos.lng !== value.lng) {
        markerInstance.current.setLatLng([value.lat, value.lng]);
        mapInstance.current.setView([value.lat, value.lng], mapInstance.current.getZoom());
      }
    }
  }, [value]);

  // Geocoding function using OSM Nominatim API
  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    setSearchError('');

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const newLat = parseFloat(lat);
        const newLng = parseFloat(lon);

        onChange({ lat: newLat, lng: newLng });
      } else {
        setSearchError('Address not found. Please try dragging the pin manually.');
      }
    } catch (err) {
      setSearchError('Failed to look up address. Please try dragging the pin.');
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <input
          id="map-search-query"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search location to position pin..."
          className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-teal-300 transition"
        />
        <button
          type="button"
          onClick={handleSearch}
          disabled={searching}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl shadow-md transition disabled:opacity-60 flex items-center justify-center shrink-0 cursor-pointer"
        >
          {searching ? 'Searching...' : 'Locate'}
        </button>
      </div>

      {searchError && (
        <span className="text-xs text-amber-600 font-semibold">{searchError}</span>
      )}

      <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
        <div ref={mapRef} className="h-72 w-full z-10" />
        <div className="absolute bottom-2 right-2 z-20 bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-500 shadow border border-slate-100">
          📍 Drag marker or click map to place pin
        </div>
      </div>
    </div>
  );
}
