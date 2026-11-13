'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Listing } from '@/lib/providers/types';
import {
  Dog,
  Car,
  Bookmark,
  Scale,
  MessageSquare,
  Calculator,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Navigation,
  Building,
  Images,
} from 'lucide-react';

interface ListingCardProps {
  listing: Listing;
  isSaved: boolean;
  isCompared: boolean;
  onToggleSaved: (id: string) => void;
  onToggleCompare: (id: string) => void;
  onOpenOutreach: (listing: Listing) => void;
  onOpenCostReality: (listing: Listing) => void;
  onOpenRoute?: (listing: Listing) => void;
  onOpenPhotos?: (listing: Listing, index?: number) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  isHovered?: boolean;
}

const FALLBACK_PHOTO =
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80';

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  isSaved,
  isCompared,
  onToggleSaved,
  onToggleCompare,
  onOpenOutreach,
  onOpenCostReality,
  onOpenRoute,
  onOpenPhotos,
  onMouseEnter,
  onMouseLeave,
  isHovered,
}) => {
  const [photoIndex, setPhotoIndex] = useState(0);

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setPhotoIndex((prev) => (prev + 1) % listing.photos.length);
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setPhotoIndex((prev) => (prev - 1 + listing.photos.length) % listing.photos.length);
  };

  const morningMin = listing.commute?.morning.minutes || 10;
  const eveningMin = listing.commute?.evening.minutes || 12;
  const propertyLabel = listing.communityName || listing.address.line1;
  const websiteUrl = listing.source_url || listing.url;
  const galleryUrl = listing.gallery_url || websiteUrl;

  return (
    <article
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-200 bg-white dark:bg-stone-900 ${
        isHovered
          ? 'border-teal-700 ring-2 ring-teal-500/20 shadow-xl dark:border-teal-500'
          : 'border-stone-200 hover:border-stone-300 shadow-xs dark:border-stone-800 dark:hover:border-stone-700'
      }`}
    >
      {/* Photo carousel & direct gallery link container */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
        <button
          type="button"
          onClick={() => {
            if (onOpenPhotos) {
              onOpenPhotos(listing, photoIndex);
            } else {
              window.open(galleryUrl, "_blank", "noopener,noreferrer");
            }
          }}
          className="block h-full w-full text-left cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-teal-600"
          title={`Click to view high-resolution photo gallery for ${propertyLabel}`}
        >
          <img
            src={listing.photos[photoIndex] || FALLBACK_PHOTO}
            alt={`${propertyLabel} preview photo ${photoIndex + 1}`}
            onError={(e) => {
              const target = e.currentTarget;
              if (target.src !== FALLBACK_PHOTO) target.src = FALLBACK_PHOTO;
            }}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-102"
            loading="lazy"
          />
          <span className="sr-only">Open photo gallery for {propertyLabel}</span>
        </button>

        {/* Benchmark Match Badge */}
        {listing.scores && (
          <div className="pointer-events-none absolute top-3 left-3 flex items-center space-x-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-stone-900 shadow-sm backdrop-blur-md dark:bg-stone-900/90 dark:text-white">
            <span
              className={`inline-block h-2 w-2 rounded-full ${
                listing.scores.lincolnParity >= 80 ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
            <span>{listing.scores.lincolnParity}% Benchmark Match</span>
          </div>
        )}

        {/* Commute Badge Pill */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onOpenRoute) onOpenRoute(listing);
          }}
          className="absolute bottom-2.5 left-2.5 z-10 flex min-h-9 items-center space-x-1.5 rounded-full bg-stone-900/85 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md shadow-sm hover:bg-stone-950 transition"
          title="Click to view Google Maps Car Route to 241 E Saginaw"
        >
          <Navigation className="h-3.5 w-3.5 text-teal-300" />
          <span>{morningMin} min to 241 E Saginaw</span>
        </button>

        {/* Direct "More Photos" Badge Pill on Photo Hero */}
        <div className="absolute bottom-2.5 right-2.5 z-10 inline-flex items-center space-x-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onOpenPhotos) {
                onOpenPhotos(listing, photoIndex);
              } else {
                window.open(galleryUrl, "_blank", "noopener,noreferrer");
              }
            }}
            className="inline-flex min-h-9 items-center space-x-1 rounded-l-full bg-teal-800/95 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm backdrop-blur-md hover:bg-teal-700 transition"
            title="Open photo gallery"
          >
            <Images className="h-3.5 w-3.5 text-teal-200 shrink-0" />
            <span>
              Photos ({photoIndex + 1}/{Math.max(1, listing.photos.length)})
            </span>
          </button>
          <a
            href={galleryUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex min-h-9 items-center justify-center rounded-r-full bg-teal-900/95 px-2 py-1 text-[11px] font-bold text-teal-200 shadow-sm backdrop-blur-md hover:bg-teal-950 transition"
            title="Open official property website"
          >
            <ExternalLink className="h-3.5 w-3.5 shrink-0" />
            <span className="sr-only">Open official property website for {propertyLabel}</span>
          </a>
        </div>

        {/* Favorite & Compare Action Buttons */}
        <div className="absolute top-3 right-3 flex items-center space-x-1.5 z-10">
          <button
            type="button"
            onClick={() => onToggleCompare(listing.id)}
            title="Pin to Compare"
            aria-label={`Pin ${propertyLabel} to Compare`}
            className={`flex h-11 w-11 sm:h-8 sm:w-8 items-center justify-center rounded-full border backdrop-blur-md transition ${
              isCompared
                ? 'bg-amber-500 border-amber-600 text-white'
                : 'bg-white/90 border-stone-200 text-stone-700 hover:bg-white'
            }`}
          >
            <Scale className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onToggleSaved(listing.id)}
            title="Save to favorites"
            aria-label={`Save ${propertyLabel} to favorites`}
            className={`flex h-11 w-11 sm:h-8 sm:w-8 items-center justify-center rounded-full border backdrop-blur-md transition ${
              isSaved
                ? 'bg-teal-700 border-teal-800 text-white'
                : 'bg-white/90 border-stone-200 text-stone-700 hover:bg-white'
            }`}
          >
            <Bookmark className="h-4 w-4" fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Photo Navigation arrows if multiple */}
        {listing.photos.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevPhoto}
              aria-label={`Previous preview photo for ${propertyLabel}`}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition hover:bg-black/80"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={nextPhoto}
              aria-label={`Next preview photo for ${propertyLabel}`}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition hover:bg-black/80"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline space-x-1.5">
            <span className="font-serif text-2xl font-bold tracking-tight text-stone-900 dark:text-white">
              ${listing.price.toLocaleString()}
            </span>
            <span className="text-xs font-medium text-stone-500">/mo</span>
          </div>
          {listing.sqft && (
            <span className="text-xs font-mono text-stone-500">
              ${(listing.price / listing.sqft).toFixed(2)}/sqft
            </span>
          )}
        </div>

        {/* Above-the-fold Operator + Direct Property Website Link */}
        <div className="mt-1 flex items-center justify-between gap-2">
          <a
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 text-[11px] font-semibold text-teal-800 hover:text-teal-950 hover:underline dark:text-teal-400 dark:hover:text-teal-300"
          >
            <Building className="h-3 w-3 shrink-0" />
            <span className="line-clamp-1">
              {listing.operator || 'Property Listing'} · Official Website
            </span>
            <span className="sr-only"> for {propertyLabel}</span>
            <ExternalLink className="h-2.5 w-2.5 shrink-0" />
          </a>
        </div>

        <div className="mt-0.5">
          <Link href={`/listing/${encodeURIComponent(listing.id)}`} className="hover:underline">
            <h3 className="font-serif text-base font-semibold text-stone-900 line-clamp-1 dark:text-stone-100">
              {propertyLabel}
            </h3>
          </Link>
          <p className="text-xs text-stone-500 line-clamp-1">
            {listing.address.line1}, {listing.address.city}, CA {listing.address.zip}
          </p>
        </div>

        {/* Specs: Beds, Baths, Sqft */}
        <div className="mt-2.5 flex items-center space-x-3 border-y border-stone-100 py-2 text-xs font-medium text-stone-700 dark:border-stone-800 dark:text-stone-300">
          <span>
            <strong>{listing.beds}</strong> Bed{listing.beds > 1 ? 's' : ''}
          </span>
          <span>•</span>
          <span>
            <strong>{listing.baths}</strong> Bath{listing.baths > 1 ? 's' : ''}
          </span>
          {listing.sqft && (
            <>
              <span>•</span>
              <span>
                <strong>{listing.sqft.toLocaleString()}</strong> Sq Ft
              </span>
            </>
          )}
          <span>•</span>
          <span className="capitalize text-stone-500">{listing.propertyType.replace('_', ' ')}</span>
        </div>

        {/* Hard Requirements Status Indicators */}
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          {/* Commute details & route modal trigger */}
          <button
            type="button"
            onClick={() => onOpenRoute && onOpenRoute(listing)}
            className="flex items-center space-x-1.5 rounded-lg bg-stone-50 p-2 text-left hover:bg-stone-100 transition dark:bg-stone-800 dark:hover:bg-stone-750"
          >
            <Navigation className="h-3.5 w-3.5 text-teal-700 shrink-0 dark:text-teal-400" />
            <div className="truncate">
              <span className="font-bold text-stone-800 dark:text-stone-200">
                {morningMin}m AM / {eveningMin}m PM
              </span>
              <p className="text-[10px] text-teal-700 dark:text-teal-400 font-semibold truncate">
                🗺️ Car Route
              </p>
            </div>
          </button>

          {/* 2 Cars Covered Parking */}
          <div className="flex items-center space-x-1.5 rounded-lg bg-stone-50 p-2 dark:bg-stone-800">
            <Car className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
            <div className="truncate">
              <span className="font-bold text-stone-800 dark:text-stone-200">
                {listing.parking.twoCarsCovered === 'yes'
                  ? '2 Covered (Confirmed)'
                  : listing.parking.coveredConfirmed
                  ? 'Covered Space'
                  : 'Call to Confirm'}
              </span>
              <p className="text-[10px] text-stone-400 capitalize">{listing.parking.type || 'Parking'}</p>
            </div>
          </div>

          {/* 2 Dogs policy */}
          <div className="flex items-center space-x-1.5 rounded-lg bg-stone-50 p-2 dark:bg-stone-800 col-span-2">
            <Dog className="h-3.5 w-3.5 text-teal-700 shrink-0" />
            <div className="truncate flex-1">
              <span className="font-bold text-stone-800 dark:text-stone-200">
                {listing.petPolicy.twoDogsOk === 'yes'
                  ? '2 Dogs Allowed (Confirmed)'
                  : listing.petPolicy.dogsAllowed === true
                  ? 'Dogs Welcome (Verify 2 Pets)'
                  : 'Call to Verify Pets'}
              </span>
              {listing.petPolicy.weightLimitLbs && (
                <span className="ml-1 text-[10px] text-stone-500">
                  (Up to {listing.petPolicy.weightLimitLbs} lbs)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer with Prominent Primary Website & Photo Gallery CTA + Utility Actions */}
        <footer className="mt-3.5 pt-3 border-t border-stone-100 dark:border-stone-800 space-y-2">
          <a
            href={galleryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full min-h-11 sm:min-h-9 items-center justify-center space-x-2 rounded-xl bg-teal-800 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-teal-700 transition"
          >
            <Images className="h-3.5 w-3.5 text-teal-200 shrink-0" />
            <span>Property Website & More Photos</span>
            <span className="sr-only"> for {propertyLabel}</span>
            <ExternalLink className="h-3.5 w-3.5 text-teal-200 shrink-0" />
          </a>

          <div className="flex items-center justify-between gap-1.5">
            <div className="flex items-center space-x-1.5">
              <button
                type="button"
                onClick={() => onOpenRoute && onOpenRoute(listing)}
                className="inline-flex items-center space-x-1 rounded-md border border-stone-200 bg-teal-50/50 min-h-11 sm:min-h-7 px-2.5 py-1 text-[11px] font-semibold text-teal-900 hover:bg-teal-100/60 dark:border-teal-900/40 dark:bg-teal-950/30 dark:text-teal-200"
              >
                <Navigation className="h-3 w-3 text-teal-700 dark:text-teal-400" />
                <span>Route</span>
              </button>
              <button
                type="button"
                onClick={() => onOpenOutreach(listing)}
                className="inline-flex items-center space-x-1 rounded-md border border-stone-200 bg-white min-h-11 sm:min-h-7 px-2 py-1 text-[11px] font-semibold text-stone-700 hover:bg-stone-50 dark:border-stone-750 dark:bg-stone-800 dark:text-stone-300"
              >
                <MessageSquare className="h-3 w-3 text-teal-700" />
                <span>Inquire</span>
              </button>
              <button
                type="button"
                onClick={() => onOpenCostReality(listing)}
                className="inline-flex items-center space-x-1 rounded-md border border-stone-200 bg-white min-h-11 sm:min-h-7 px-2 py-1 text-[11px] font-semibold text-stone-700 hover:bg-stone-50 dark:border-stone-750 dark:bg-stone-800 dark:text-stone-300"
              >
                <Calculator className="h-3 w-3 text-amber-600" />
                <span>Cost</span>
              </button>
            </div>

            <Link
              href={`/listing/${encodeURIComponent(listing.id)}`}
              className="min-h-11 sm:min-h-7 px-1.5 text-xs font-semibold text-teal-800 hover:text-teal-900 hover:underline dark:text-teal-400 inline-flex items-center space-x-1"
            >
              <span>Details</span>
              <span className="sr-only"> for {propertyLabel}</span>
            </Link>
          </div>
        </footer>
      </div>
    </article>
  );
};
