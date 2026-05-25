'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Navigation, Copy } from 'lucide-react';

export default function MapView({ latitude, longitude, address = '', city = '' }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [copied, setCopied] = useState(false);

  const handleCopyCoordinates = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(`${latitude}, ${longitude}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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

  useEffect(() => {
    if (!mapInstance.current && mapRef.current && latitude && longitude) {
      // Create map centered on lat/lng
      mapInstance.current = L.map(mapRef.current, {
        scrollWheelZoom: false, // Prevent page scrolling zooming
      }).setView([latitude, longitude], 15);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstance.current);

      // Create static marker
      const marker = L.marker([latitude, longitude], {
        icon: customPin,
      }).addTo(mapInstance.current);

      if (address || city) {
        marker.bindPopup(`
          <div style="font-family: inherit; font-size: 13px; line-height: 1.4;">
            <b style="color: #0f766e; display: block; margin-bottom: 2px;">Property Location</b>
            <span style="color: #475569;">${address}</span>
            <span style="color: #64748b; display: block;">${city}</span>
          </div>
        `).openPopup();
      }
    }

    // Cleanup map on unmount
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [latitude, longitude, address, city]);

  if (!latitude || !longitude) {
    return (
      <div className="bg-slate-100 rounded-3xl h-64 flex flex-col items-center justify-center text-slate-400 gap-2 border border-dashed border-slate-200">
        <MapPin size={32} className="text-slate-300 animate-pulse" />
        <span className="text-sm font-semibold">No location coordinates listed.</span>
      </div>
    );
  }

  // Google Maps directions search URL
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

  return (
    <div className="bg-white rounded-3xl p-6 shadow border border-slate-100 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <MapPin className="text-teal-500" size={20} /> Property Location
          </h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">
            Exact coordinate map listing
          </p>
        </div>
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer"
        >
          <Navigation size={13} /> Get Directions
        </a>
      </div>

      <div className="relative rounded-2xl overflow-hidden border border-slate-100 shadow-inner">
        <div ref={mapRef} className="h-64 w-full z-10" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-xs">
        <div className="font-semibold text-slate-600 flex items-center gap-1.5">
          <span className="font-bold text-slate-400 tracking-wider">COORDINATES:</span>
          <span className="font-mono text-slate-700 bg-slate-200/50 px-2 py-0.5 rounded">{latitude.toFixed(6)}, {longitude.toFixed(6)}</span>
        </div>
        <button
          type="button"
          onClick={handleCopyCoordinates}
          className="bg-white hover:bg-slate-100 text-teal-600 border border-slate-200 px-3 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 shadow-sm"
        >
          <Copy size={12} className={copied ? 'text-emerald-500' : ''} />
          {copied ? 'Copied!' : 'Copy Coordinates'}
        </button>
      </div>
    </div>
  );
}
