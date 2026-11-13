'use client';

import React from 'react';
import { Listing } from '@/lib/providers/types';
import { WORK_LOCATION, getGoogleMapsRouteUrl } from '@/lib/commute/routes';
import {
  X,
  Navigation,
  Car,
  Clock,
  ExternalLink,
  MapPin,
  Building2,
  Compass,
  AlertCircle,
  Route as RouteIcon,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface RouteModalProps {
  listing: Listing | null;
  onClose: () => void;
}

export const RouteModal: React.FC<RouteModalProps> = ({ listing, onClose }) => {
  if (!listing) return null;

  const morningMin = listing.commute?.morning.minutes || 12;
  const eveningMin = listing.commute?.evening.minutes || 15;
  const miles = listing.commute?.morning.miles || 5.0;
  const corridor = listing.commute?.primaryCorridor || 'Alton Pkwy / Irvine Center Dr';

  const fullOriginAddress = `${listing.address.line1}, ${listing.address.city}, CA ${listing.address.zip}`;
  const googleMapsUrl = listing.commute?.googleMapsUrl || getGoogleMapsRouteUrl(fullOriginAddress, listing.address.lat, listing.address.lng);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xl dark:border-stone-850 dark:bg-stone-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header banner */}
        <div className="bg-gradient-to-r from-teal-900 via-teal-850 to-stone-900 p-5 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-700/60 ring-2 ring-teal-400/40">
                <Navigation className="h-5 w-5 text-teal-200" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold tracking-tight">
                  Google Maps Driving Route
                </h3>
                <p className="text-xs text-teal-200/90">
                  Car route to Beach Cities Commercial Bank (100 Progress)
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-full bg-white/10 p-1.5 text-stone-300 hover:bg-white/20 hover:text-white transition"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Key Metric Badges */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 dark:border-amber-900/50 dark:bg-amber-950/30">
              <div className="flex items-center justify-center space-x-1 text-amber-700 dark:text-amber-400 mb-0.5">
                <Clock className="h-3.5 w-3.5" />
                <span className="text-[11px] font-semibold uppercase tracking-wider">Morning AM</span>
              </div>
              <div className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">
                {morningMin} <span className="text-xs font-normal text-stone-500">min</span>
              </div>
              <p className="text-[10px] text-stone-500">Arrival 7:45 - 8:15 AM</p>
            </div>

            <div className="rounded-xl border border-indigo-200 bg-indigo-50/70 p-3 dark:border-indigo-900/50 dark:bg-indigo-950/30">
              <div className="flex items-center justify-center space-x-1 text-indigo-700 dark:text-indigo-400 mb-0.5">
                <Clock className="h-3.5 w-3.5" />
                <span className="text-[11px] font-semibold uppercase tracking-wider">Evening PM</span>
              </div>
              <div className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">
                {eveningMin} <span className="text-xs font-normal text-stone-500">min</span>
              </div>
              <p className="text-[10px] text-stone-500">Departure 5:15 - 5:45 PM</p>
            </div>

            <div className="rounded-xl border border-stone-200 bg-stone-50 p-3 dark:border-stone-800 dark:bg-stone-850">
              <div className="flex items-center justify-center space-x-1 text-stone-600 dark:text-stone-400 mb-0.5">
                <RouteIcon className="h-3.5 w-3.5" />
                <span className="text-[11px] font-semibold uppercase tracking-wider">Distance</span>
              </div>
              <div className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">
                {miles} <span className="text-xs font-normal text-stone-500">mi</span>
              </div>
              <p className="text-[10px] text-stone-500">Door to Door</p>
            </div>
          </div>

          {/* Route corridor banner */}
          <div className="flex items-center space-x-2.5 rounded-xl border border-teal-200 bg-teal-50/60 p-3 dark:border-teal-900/40 dark:bg-teal-950/20">
            <Compass className="h-4 w-4 text-teal-700 shrink-0 dark:text-teal-400" />
            <div className="text-xs">
              <span className="font-bold text-teal-950 dark:text-teal-200">Primary Highway Corridor: </span>
              <span className="font-semibold text-teal-800 dark:text-teal-300">{corridor}</span>
            </div>
          </div>

          {/* Waypoints Origin to Destination */}
          <div className="space-y-3 rounded-xl border border-stone-200 bg-stone-50 p-4 dark:border-stone-800 dark:bg-stone-850 text-xs">
            {/* Origin */}
            <div className="flex items-start space-x-3">
              <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-stone-200 text-stone-700 font-bold text-[11px] shrink-0 dark:bg-stone-750 dark:text-stone-300">
                A
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 dark:text-stone-100">
                    {listing.communityName || listing.address.line1}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-stone-400">Origin</span>
                </div>
                <p className="text-stone-500 dark:text-stone-400">{fullOriginAddress}</p>
                {listing.operator && (
                  <p className="text-[11px] text-teal-700 dark:text-teal-400 font-semibold mt-0.5">
                    Operator: {listing.operator}
                  </p>
                )}
              </div>
            </div>

            {/* Connecting corridor line */}
            <div className="ml-3 border-l-2 border-dashed border-stone-300 pl-6 py-1 text-[11px] text-stone-500 dark:border-stone-700">
              <div className="flex items-center space-x-1.5 py-0.5">
                <Car className="h-3 w-3 text-teal-700" />
                <span>Drive via {corridor} • Peak traffic speed ~35–55 mph</span>
              </div>
            </div>

            {/* Destination */}
            <div className="flex items-start space-x-3">
              <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-teal-800 text-white font-bold text-[11px] shrink-0 ring-2 ring-teal-400/50">
                B
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-teal-900 dark:text-teal-200">
                    {WORK_LOCATION.name}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-teal-700 dark:text-teal-400">Destination</span>
                </div>
                <p className="text-stone-600 dark:text-stone-300 font-medium">{WORK_LOCATION.address}</p>
                <p className="text-[10px] text-stone-400">{WORK_LOCATION.landmark}</p>
              </div>
            </div>
          </div>

          {/* Navigation Strategy Tip */}
          <div className="rounded-xl border border-stone-200 bg-white p-3 text-xs dark:border-stone-800 dark:bg-stone-900">
            <div className="flex items-center space-x-1.5 font-bold text-stone-800 dark:text-stone-200 mb-1">
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              <span>Commute Optimization Notes:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-stone-600 dark:text-stone-400 text-[11px]">
              <li>
                <strong>Morning flow:</strong> Arriving at Innovation Office Park via Alton Pkwy or Irvine Center Dr avoids I-5 / I-405 freeway interchange bottlenecks.
              </li>
              <li>
                <strong>Parking at 100 Progress:</strong> Surface parking with EV chargers directly adjacent to Suite 150 entrance.
              </li>
              <li>
                <strong>Strict 40-min radius:</strong> Within regional 40-minute driving ceiling from beach cities and master plans.
              </li>
            </ul>
          </div>

          {/* Primary Action Button: Open in Google Maps */}
          <div className="pt-2">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center space-x-2 rounded-xl bg-teal-800 py-3 px-4 text-center text-xs font-bold text-white shadow-md hover:bg-teal-700 transition"
            >
              <Navigation className="h-4 w-4" />
              <span>Launch Turn-by-Turn Car Route in Google Maps</span>
              <ExternalLink className="h-3.5 w-3.5 ml-1 opacity-80" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
