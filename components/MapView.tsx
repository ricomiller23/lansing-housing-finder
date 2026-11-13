'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Listing } from '@/lib/providers/types';
import { WORK_LOCATION, getGoogleMapsRouteUrl } from '@/lib/commute/routes';
import {
  Building2,
  Navigation,
  ExternalLink,
  Layers,
  LocateFixed,
  Maximize2,
  Compass,
  Map as MapIcon,
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';

interface MapViewProps {
  listings: Listing[];
  hoveredId: string | null;
  onHoverListing: (id: string | null) => void;
  onSelectListing: (listing: Listing) => void;
  onOpenRoute?: (listing: Listing) => void;
}

type GoogleLayerType = 'streets' | 'satellite' | 'terrain';

const GOOGLE_LAYERS: Record<GoogleLayerType, { label: string; url: string; maxZoom: number }> = {
  streets: {
    label: 'Google Streets',
    url: 'https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    maxZoom: 20,
  },
  satellite: {
    label: 'Google Satellite',
    url: 'https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    maxZoom: 20,
  },
  terrain: {
    label: 'Google Terrain',
    url: 'https://mt{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
    maxZoom: 20,
  },
};

export const MapView: React.FC<MapViewProps> = ({
  listings,
  hoveredId,
  onHoverListing,
  onSelectListing,
  onOpenRoute,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());
  const routeLineRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [layerType, setLayerType] = useState<GoogleLayerType>('streets');
  const tileLayerRef = useRef<any>(null);

  // Initialize Google Maps Layer on Leaflet
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    let isMounted = true;

    import('leaflet').then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      const map = L.map(mapContainerRef.current, {
        center: [33.576346, -117.72646],
        zoom: 13,
        zoomControl: false,
      });

      L.control.zoom({ position: 'topright' }).addTo(map);

      // Google Maps Tile Layer
      const googleTileLayer = L.tileLayer(GOOGLE_LAYERS[layerType].url, {
        subdomains: ['0', '1', '2', '3'],
        maxZoom: GOOGLE_LAYERS[layerType].maxZoom,
        attribution: '&copy; Google Maps',
      }).addTo(map);

      tileLayerRef.current = googleTileLayer;

      // Add Workplace Pin for 100 Progress (Central Office)
      const bankIcon = L.divIcon({
        className: 'google-bank-marker-pin',
        html: `
          <div class="flex flex-col items-center -translate-x-1/2 -translate-y-full cursor-pointer">
            <div style="background-color: #115e59; color: white; border-radius: 9999px; padding: 6px 12px; font-size: 11px; font-weight: 800; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.35); border: 2px solid #5eead4; white-space: nowrap; display: flex; align-items: center; gap: 6px;">
              <span>🏦</span>
              <span>241 E Saginaw (Central Office)</span>
            </div>
            <div style="width: 8px; height: 8px; background-color: #115e59; transform: rotate(45deg); margin-top: -4px;"></div>
          </div>
        `,
        iconSize: [0, 0],
      });

      const bankMarker = L.marker([WORK_LOCATION.lat, WORK_LOCATION.lng], {
        icon: bankIcon,
        zIndexOffset: 1000,
      }).addTo(map);

      bankMarker.bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px; padding: 4px; max-width: 240px;">
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
            <span style="font-size: 14px;">🏦</span>
            <strong style="color: #115e59; font-size: 13px;">Central Office</strong>
          </div>
          <p style="color: #4b5563; margin: 0 0 6px 0;">241 East Saginaw, East Lansing, MI 48824</p>
          <div style="padding: 4px 6px; background: #f0fdfa; border-radius: 6px; font-size: 10px; color: #0f766e; font-weight: 700; display: inline-block;">
            📍 E Saginaw St Corridor · Commute Anchor
          </div>
        </div>
      `);

      mapInstanceRef.current = map;
      setMapLoaded(true);
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Switch between Google Streets, Google Satellite, and Google Terrain
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded) return;

    import('leaflet').then((L) => {
      if (tileLayerRef.current) {
        mapInstanceRef.current.removeLayer(tileLayerRef.current);
      }

      const newLayer = L.tileLayer(GOOGLE_LAYERS[layerType].url, {
        subdomains: ['0', '1', '2', '3'],
        maxZoom: GOOGLE_LAYERS[layerType].maxZoom,
        attribution: '&copy; Google Maps',
      }).addTo(mapInstanceRef.current);

      tileLayerRef.current = newLayer;
    });
  }, [layerType, mapLoaded]);

  // Sync Listing Markers on Google Map
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded) return;

    import('leaflet').then((L) => {
      const map = mapInstanceRef.current;
      const currentMarkers = markersRef.current;

      // Remove existing listing markers
      currentMarkers.forEach((marker) => marker.remove());
      currentMarkers.clear();

      // Add a Google Maps marker for each listing
      listings.forEach((item) => {
        const isHovered = hoveredId === item.id;
        const isSelected = selectedListing?.id === item.id;
        const priceK = (item.price / 1000).toFixed(1);
        const driveMin = item.commute?.morning.minutes || 12;

        const pillBg = isHovered || isSelected ? '#115e59' : '#ffffff';
        const pillTextColor = isHovered || isSelected ? '#ffffff' : '#1c1917';
        const pillBorder = isHovered || isSelected ? '2px solid #5eead4' : '1.5px solid #d6d3d1';
        const pillScale = isHovered || isSelected ? 'scale(1.15)' : 'scale(1)';
        const zIndex = isHovered || isSelected ? 500 : 100;

        const customPill = L.divIcon({
          className: 'google-listing-price-marker',
          html: `
            <div style="
              transform: translate(-50%, -50%) ${pillScale};
              transition: all 0.2s ease;
              background-color: ${pillBg};
              color: ${pillTextColor};
              border: ${pillBorder};
              border-radius: 9999px;
              padding: 3px 8px;
              font-size: 11px;
              font-weight: 800;
              box-shadow: 0 4px 10px rgba(0,0,0,0.18);
              white-space: nowrap;
              cursor: pointer;
              display: flex;
              align-items: center;
              gap: 4px;
            ">
              <span>$${priceK}k</span>
              <span style="font-size: 9px; opacity: 0.85; font-weight: 600;">${driveMin}m</span>
            </div>
          `,
          iconSize: [0, 0],
        });

        const marker = L.marker([item.address.lat, item.address.lng], {
          icon: customPill,
          zIndexOffset: zIndex,
        }).addTo(map);

        marker.on('click', () => {
          setSelectedListing(item);
          onSelectListing(item);
        });

        marker.on('mouseover', () => {
          onHoverListing(item.id);
        });

        marker.on('mouseout', () => {
          onHoverListing(null);
        });

        currentMarkers.set(item.id, marker);
      });
    });
  }, [listings, hoveredId, selectedListing, mapLoaded, onHoverListing, onSelectListing]);

  // Draw Google Maps Car Route Polyline from Hovered/Selected Listing to 100 Progress
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded) return;

    const activeItem = listings.find((l) => l.id === hoveredId) || selectedListing;

    import('leaflet').then((L) => {
      const map = mapInstanceRef.current;

      if (routeLineRef.current) {
        routeLineRef.current.remove();
        routeLineRef.current = null;
      }

      if (activeItem) {
        const latLngs: [number, number][] = [
          [activeItem.address.lat, activeItem.address.lng],
          [WORK_LOCATION.lat, WORK_LOCATION.lng],
        ];

        routeLineRef.current = L.polyline(latLngs, {
          color: '#0f766e',
          weight: 4,
          dashArray: '8, 6',
          opacity: 0.9,
        }).addTo(map);
      }
    });
  }, [hoveredId, selectedListing, listings, mapLoaded]);

  // Auto-frame active submarket listings when submarket selection changes
  const listingSignature = listings.map((l) => l.id).join('|');
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded || listings.length === 0) return;
    import('leaflet').then((L) => {
      if (!mapInstanceRef.current) return;
      const coords: [number, number][] = listings.map((l) => [l.address.lat, l.address.lng]);
      const bounds = L.latLngBounds(coords);
      mapInstanceRef.current.fitBounds(bounds, { padding: [36, 36], maxZoom: 14 });
    });
  }, [listingSignature, mapLoaded]);

  // Center on Bank (100 Progress)
  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([WORK_LOCATION.lat, WORK_LOCATION.lng], 11, {
        duration: 0.8,
      });
    }
  };

  // Zoom to Fit All Listings
  const handleFitBounds = () => {
    if (!mapInstanceRef.current || listings.length === 0) return;
    import('leaflet').then((L) => {
      const coords: [number, number][] = listings.map((l) => [l.address.lat, l.address.lng]);
      const bounds = L.latLngBounds(coords);
      bounds.extend([WORK_LOCATION.lat, WORK_LOCATION.lng]);
      mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40] });
    });
  };

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-stone-200 bg-stone-100 shadow-sm dark:border-stone-800 dark:bg-stone-900">
      {/* Real Google Maps Container */}
      <div ref={mapContainerRef} className="h-full w-full z-0" />

      {/* Top Google Maps Controls Bar */}
      <div className="absolute top-3 left-3 z-20 flex items-center space-x-1.5 rounded-xl border border-stone-200/90 bg-white/95 p-1.5 shadow-md backdrop-blur-md dark:border-stone-800 dark:bg-stone-900/95 text-xs">
        {/* Layer Selector */}
        <div className="flex rounded-lg bg-stone-100 p-0.5 dark:bg-stone-800">
          {(['streets', 'satellite', 'terrain'] as GoogleLayerType[]).map((type) => (
            <button
              key={type}
              onClick={() => setLayerType(type)}
              className={`rounded-md px-2 py-1 text-[11px] font-semibold transition capitalize ${
                layerType === type
                  ? 'bg-white text-teal-900 shadow-xs dark:bg-stone-700 dark:text-white'
                  : 'text-stone-500 hover:text-stone-800 dark:text-stone-400'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="h-4 w-px bg-stone-200 dark:bg-stone-700" />

        <button
          onClick={handleRecenter}
          className="flex items-center space-x-1 rounded-lg px-2 py-1 font-semibold text-stone-700 hover:bg-stone-100 transition dark:text-stone-300 dark:hover:bg-stone-800 text-[11px]"
          title="Center on Bank Location"
        >
          <LocateFixed className="h-3 w-3 text-amber-600" />
          <span>100 Progress</span>
        </button>

        <div className="h-4 w-px bg-stone-200 dark:bg-stone-700" />

        <button
          onClick={handleFitBounds}
          className="flex items-center space-x-1 rounded-lg px-2 py-1 font-semibold text-stone-700 hover:bg-stone-100 transition dark:text-stone-300 dark:hover:bg-stone-800 text-[11px]"
          title="Zoom to Fit All Homes"
        >
          <Maximize2 className="h-3 w-3 text-stone-600" />
          <span>Fit ({listings.length})</span>
        </button>
      </div>

      {/* Bottom Google Maps Brand & Legend */}
      <div className="absolute bottom-3 left-3 z-20 rounded-xl border border-stone-200/90 bg-white/95 px-3 py-2 text-xs shadow-md backdrop-blur-md dark:border-stone-800 dark:bg-stone-900/95 space-y-1">
        <div className="flex items-center space-x-2">
          <span className="text-sm">📍</span>
          <span className="font-bold text-stone-900 dark:text-stone-100">
            Google Maps · 100 Progress, Irvine
          </span>
        </div>
        <div className="flex items-center space-x-2 text-stone-600 dark:text-stone-300 text-[11px]">
          <span className="inline-block h-2 w-2 rounded-full bg-teal-800"></span>
          <span>Click any marker to inspect car route</span>
        </div>
      </div>

      {/* Selected Listing Floating Popover */}
      {selectedListing && (
        <div className="absolute top-14 right-3 z-30 w-80 rounded-2xl border border-stone-200 bg-white p-4 shadow-2xl dark:border-stone-800 dark:bg-stone-900 animate-in fade-in duration-150">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 dark:text-teal-400">
                {selectedListing.operator || 'Rental Home'}
              </span>
              <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-white line-clamp-1">
                {selectedListing.communityName || selectedListing.address.line1}
              </h4>
            </div>
            <button
              onClick={() => setSelectedListing(null)}
              className="rounded-full p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-600 dark:hover:bg-stone-800 text-xs"
            >
              ✕
            </button>
          </div>

          <p className="text-xs text-stone-500 mt-0.5">
            {selectedListing.address.line1}, {selectedListing.address.city}
          </p>

          <div className="mt-2.5 flex items-center justify-between text-xs border-y border-stone-100 py-2 dark:border-stone-800">
            <span className="font-serif font-bold text-stone-900 dark:text-white">
              ${selectedListing.price.toLocaleString()}/mo
            </span>
            <span className="text-stone-600 font-medium dark:text-stone-300">
              {selectedListing.beds} bd / {selectedListing.baths} ba
            </span>
            <span className="font-bold text-amber-700 dark:text-amber-400">
              {selectedListing.commute?.morning.minutes} min drive
            </span>
          </div>

          {/* Corridor info */}
          <div className="mt-2 flex items-center space-x-1.5 text-[11px] text-stone-600 dark:text-stone-400">
            <Compass className="h-3.5 w-3.5 text-teal-700" />
            <span className="truncate">Via {selectedListing.commute?.primaryCorridor || 'Alton Pkwy'}</span>
          </div>

          {/* Action Buttons */}
          <div className="mt-3 space-y-2">
            <a
              href={selectedListing.gallery_url || selectedListing.source_url || selectedListing.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full min-h-10 items-center justify-center space-x-1.5 rounded-xl bg-teal-800 py-2 px-3 text-xs font-bold text-white shadow-xs hover:bg-teal-700 transition"
            >
              <span>Property Website & More Photos</span>
              <span className="sr-only"> for {selectedListing.communityName || selectedListing.address.line1}</span>
              <ExternalLink className="h-3.5 w-3.5 shrink-0" />
            </a>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => onOpenRoute && onOpenRoute(selectedListing)}
                className="flex-1 flex min-h-9 items-center justify-center space-x-1.5 rounded-xl border border-teal-200 bg-teal-50 py-1.5 text-xs font-bold text-teal-900 hover:bg-teal-100 transition dark:border-teal-900 dark:bg-teal-950 dark:text-teal-200"
              >
                <Navigation className="h-3.5 w-3.5" />
                <span>Car Route</span>
              </button>
              <a
                href={`/listing/${encodeURIComponent(selectedListing.id)}`}
                className="inline-flex min-h-9 items-center rounded-xl border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-bold text-stone-700 hover:bg-stone-100 transition dark:border-stone-750 dark:bg-stone-800 dark:text-stone-300"
              >
                Details
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
