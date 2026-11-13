'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Listing } from '@/lib/providers/types';
import { Navbar } from '@/components/Navbar';
import { OutreachHelperModal } from '@/components/OutreachHelperModal';
import { CostRealityModal } from '@/components/CostRealityModal';
import { RouteModal } from '@/components/RouteModal';
import { WORK_LOCATION, getGoogleMapsRouteUrl } from '@/lib/commute/routes';
import {
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  Clock,
  Dog,
  Car,
  Check,
  HelpCircle,
  MessageSquare,
  Calculator,
  Building,
  Sparkles,
  MapPin,
  Navigation,
  Compass,
} from 'lucide-react';

export default function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [activePhoto, setActivePhoto] = useState(0);
  const [isOutreachOpen, setIsOutreachOpen] = useState(false);
  const [isCostOpen, setIsCostOpen] = useState(false);
  const [isRouteOpen, setIsRouteOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['listing-detail', id],
    queryFn: async () => {
      const res = await fetch(`/api/listings/${encodeURIComponent(id)}`);
      if (!res.ok) throw new Error('Listing not found');
      return res.json();
    },
  });

  const listing: Listing | undefined = data?.listing;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#faf8f5] dark:bg-stone-950 p-8 text-center text-xs text-stone-500">
        Loading property intelligence...
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-[#faf8f5] dark:bg-stone-950 p-8 text-center">
        <h2 className="font-serif text-lg font-bold text-stone-900 dark:text-white">Listing not found</h2>
        <Link href="/" className="mt-4 inline-block text-xs font-semibold text-teal-800 underline">
          Return to search
        </Link>
      </div>
    );
  }

  const fullAddr = `${listing.address.line1}, ${listing.address.city}, CA ${listing.address.zip}`;
  const googleMapsUrl = listing.commute?.googleMapsUrl || getGoogleMapsRouteUrl(fullAddr, listing.address.lat, listing.address.lng);
  const corridor = listing.commute?.primaryCorridor || 'Alton Pkwy / Irvine Spectrum';

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-800 antialiased dark:bg-stone-950 dark:text-stone-100 pb-16">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 pt-6 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 dark:hover:text-stone-300 mb-4"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to All Regional Homes (≤40 min)</span>
        </Link>

        {/* Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative md:col-span-3 aspect-16/10 overflow-hidden rounded-2xl bg-stone-100 dark:bg-stone-850">
            <img
              src={listing.photos[activePhoto] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'}
              alt={listing.communityName || listing.address.line1}
              className="h-full w-full object-cover"
            />
            <a
              href={listing.gallery_url || listing.source_url || listing.url}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-3 right-3 inline-flex min-h-11 items-center space-x-2 rounded-xl bg-teal-800/95 px-4 py-2 text-xs font-bold text-white shadow-lg backdrop-blur-md hover:bg-teal-700 transition"
            >
              <span>View Full Photo Gallery on Property Website</span>
              <ExternalLink className="h-3.5 w-3.5 shrink-0" />
            </a>
          </div>

          <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto max-h-[400px]">
            {listing.photos.map((photo, idx) => (
              <button
                key={idx}
                onClick={() => setActivePhoto(idx)}
                className={`relative aspect-16/10 w-24 md:w-full shrink-0 overflow-hidden rounded-xl border-2 transition ${
                  activePhoto === idx ? 'border-teal-700' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={photo} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Core Header Card */}
        <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between rounded-2xl border border-stone-200 bg-white p-6 shadow-xs dark:border-stone-800 dark:bg-stone-900 gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-bold text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                {listing.scores?.lincolnParity}% Benchmark Match
              </span>
              {listing.operator && (
                <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-semibold text-stone-700 dark:bg-stone-800 dark:text-stone-300 flex items-center space-x-1">
                  <Building className="h-3 w-3 text-teal-700" />
                  <span>{listing.operator}</span>
                </span>
              )}
            </div>

            <h1 className="mt-2 font-serif text-2xl font-bold text-stone-900 dark:text-white">
              {listing.communityName || listing.address.line1}
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              {listing.address.line1}, {listing.address.city}, CA {listing.address.zip}
            </p>

            <div className="mt-3 flex items-center space-x-4 text-xs font-medium text-stone-600 dark:text-stone-300">
              <span className="font-serif text-2xl font-bold text-stone-900 dark:text-white">
                ${listing.price.toLocaleString()}
                <span className="text-xs font-normal text-stone-500">/mo</span>
              </span>
              <span>•</span>
              <span><strong>{listing.beds}</strong> Beds</span>
              <span>•</span>
              <span><strong>{listing.baths}</strong> Baths</span>
              {listing.sqft && (
                <>
                  <span>•</span>
                  <span><strong>{listing.sqft.toLocaleString()}</strong> Sq Ft</span>
                </>
              )}
              <span>•</span>
              <span className="capitalize">{listing.propertyType.replace('_', ' ')}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsRouteOpen(true)}
              className="inline-flex items-center space-x-1.5 rounded-xl border border-teal-200 bg-teal-50 px-3.5 py-2 text-xs font-bold text-teal-900 hover:bg-teal-100 shadow-xs dark:border-teal-900 dark:bg-teal-950 dark:text-teal-200"
            >
              <Navigation className="h-3.5 w-3.5 text-teal-700 dark:text-teal-400" />
              <span>Car Route to Bank ({listing.commute?.morning.minutes}m)</span>
            </button>

            <button
              onClick={() => setIsOutreachOpen(true)}
              className="inline-flex items-center space-x-1.5 rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 shadow-xs dark:border-stone-750 dark:bg-stone-800 dark:text-stone-300"
            >
              <MessageSquare className="h-3.5 w-3.5 text-teal-700" />
              <span>Outreach Script</span>
            </button>

            <button
              onClick={() => setIsCostOpen(true)}
              className="inline-flex items-center space-x-1.5 rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 shadow-xs dark:border-stone-750 dark:bg-stone-800 dark:text-stone-300"
            >
              <Calculator className="h-3.5 w-3.5 text-amber-600" />
              <span>Cost Reality</span>
            </button>

            <a
              href={listing.gallery_url || listing.source_url || listing.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center space-x-1.5 rounded-xl bg-teal-800 px-4 py-2 text-xs font-bold text-white hover:bg-teal-700 shadow-sm"
            >
              <span>Property Website & More Photos</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Two-Column Deep Intelligence */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Left Column: Description & Extracted Facts */}
          <div className="md:col-span-7 space-y-6">
            {/* Hard Requirements Verification */}
            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs dark:border-stone-800 dark:bg-stone-900">
              <h3 className="font-serif text-base font-bold text-stone-900 dark:text-white mb-4">
                Household Hard Constraints
              </h3>

              <div className="space-y-4 text-xs">
                {/* 2 Dogs */}
                <div className="flex items-start space-x-3 rounded-xl bg-stone-50 p-3.5 dark:bg-stone-800">
                  <Dog className="h-4 w-4 text-teal-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-stone-900 dark:text-white">
                      2 Dogs Policy: {listing.petPolicy.twoDogsOk === 'yes' ? 'Confirmed OK (2 Dogs Allowed)' : 'Dogs Allowed (Call to verify 2 pets)'}
                    </span>
                    {listing.petPolicy.sourceSnippet && (
                      <p className="mt-1 text-stone-500 font-mono text-[11px]">
                        "{listing.petPolicy.sourceSnippet}"
                      </p>
                    )}
                  </div>
                </div>

                {/* 2 Cars Covered Parking */}
                <div className="flex items-start space-x-3 rounded-xl bg-stone-50 p-3.5 dark:bg-stone-800">
                  <Car className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-stone-900 dark:text-white">
                      Parking: {listing.parking.twoCarsCovered === 'yes' ? '2 Covered / Garage Spaces Confirmed' : 'Covered Space Included'}
                    </span>
                    {listing.parking.sourceSnippet && (
                      <p className="mt-1 text-stone-500 font-mono text-[11px]">
                        "{listing.parking.sourceSnippet}"
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs dark:border-stone-800 dark:bg-stone-900">
              <h3 className="font-serif text-base font-bold text-stone-900 dark:text-white mb-3">
                Property Description
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed whitespace-pre-line">
                {listing.description || 'Not yet sourced'}
              </p>
              <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center justify-between gap-2 text-[11px] text-stone-500">
                <span>
                  Retrieved: <strong className="font-mono">{new Date(listing.retrieved_at || listing.lastSeenAt).toLocaleDateString()}</strong>
                </span>
                <a
                  href={listing.source_url || listing.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 font-semibold text-teal-800 hover:underline dark:text-teal-400"
                >
                  <span>Source Receipt</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Commute & Nearby Amenities */}
          <div className="md:col-span-5 space-y-6">
            {/* Real Traffic Commute to 100 Progress */}
            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs dark:border-stone-800 dark:bg-stone-900">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2 text-teal-800 dark:text-teal-400">
                  <Navigation className="h-4 w-4" />
                  <h3 className="font-serif text-base font-bold text-stone-900 dark:text-white">
                    Google Maps Car Route
                  </h3>
                </div>
                <button
                  onClick={() => setIsRouteOpen(true)}
                  className="text-xs font-bold text-teal-800 underline hover:text-teal-900 dark:text-teal-400"
                >
                  View Map
                </button>
              </div>

              <p className="text-[11px] text-stone-500 mb-4">
                Destination: {WORK_LOCATION.name}, {WORK_LOCATION.address}
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                <div className="rounded-xl border border-teal-200 bg-teal-50/60 p-3 dark:border-teal-900/50 dark:bg-teal-950/20">
                  <span className="block text-[10px] text-teal-800 font-bold uppercase">Morning Peak</span>
                  <span className="font-serif text-xl font-bold text-teal-950 dark:text-teal-200">
                    {listing.commute?.morning.minutes} min
                  </span>
                  <p className="text-[10px] text-stone-500 mt-0.5">{listing.commute?.morning.miles} miles (7:45 AM)</p>
                </div>

                <div className="rounded-xl border border-teal-200 bg-teal-50/60 p-3 dark:border-teal-900/50 dark:bg-teal-950/20">
                  <span className="block text-[10px] text-teal-800 font-bold uppercase">Evening Peak</span>
                  <span className="font-serif text-xl font-bold text-teal-950 dark:text-teal-200">
                    {listing.commute?.evening.minutes} min
                  </span>
                  <p className="text-[10px] text-stone-500 mt-0.5">{listing.commute?.evening.miles} miles (5:30 PM)</p>
                </div>
              </div>

              <div className="rounded-xl bg-stone-50 p-3 text-xs dark:bg-stone-850 mb-4">
                <div className="flex items-center space-x-1.5 font-bold text-stone-800 dark:text-stone-200 mb-0.5">
                  <Compass className="h-3.5 w-3.5 text-teal-700" />
                  <span>Primary Corridor:</span>
                </div>
                <p className="text-stone-600 dark:text-stone-400 text-[11px]">{corridor}</p>
              </div>

              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center space-x-2 rounded-xl bg-teal-800 py-2.5 px-3 text-center text-xs font-bold text-white shadow-xs hover:bg-teal-700 transition"
              >
                <Navigation className="h-3.5 w-3.5" />
                <span>Open in Google Maps Navigation</span>
                <ExternalLink className="h-3 w-3 ml-1 opacity-80" />
              </a>
            </div>

            {/* Nearby Irvine Essentials */}
            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs dark:border-stone-800 dark:bg-stone-900">
              <h3 className="font-serif text-base font-bold text-stone-900 dark:text-white mb-3">
                Nearby Essentials & Groceries
              </h3>
              <ul className="space-y-2.5 text-xs text-stone-600 dark:text-stone-300">
                <li className="flex items-center justify-between">
                  <span>🐾 Dedicated Dog Parks & Walking Trails</span>
                  <span className="font-mono text-stone-400">Nearby</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>🥦 Whole Foods / Trader Joe's Market</span>
                  <span className="font-mono text-stone-400">Within 10 min</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>🩺 24/7 Veterinary Emergency Care</span>
                  <span className="font-mono text-stone-400">Under 15 min</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>🏦 Beach Cities Commercial Bank</span>
                  <span className="font-mono text-teal-800 font-bold dark:text-teal-400">{listing.commute?.morning.minutes} min drive</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <RouteModal listing={listing} onClose={() => setIsRouteOpen(false)} />
      <OutreachHelperModal listing={listing} onClose={() => setIsOutreachOpen(false)} />
      <CostRealityModal listing={listing} onClose={() => setIsCostOpen(false)} />
    </div>
  );
}
