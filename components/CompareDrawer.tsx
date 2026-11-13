'use client';

import React from 'react';
import Link from 'next/link';
import { Listing } from '@/lib/providers/types';
import { X, Check, HelpCircle, ShieldCheck, Clock, Trash2, ExternalLink } from 'lucide-react';

interface CompareDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  listings: Listing[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

export const CompareDrawer: React.FC<CompareDrawerProps> = ({
  isOpen,
  onClose,
  listings,
  onRemove,
  onClear,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-xs p-4 sm:p-6">
      <div className="relative max-h-[85vh] w-full max-w-6xl overflow-y-auto rounded-3xl border border-stone-200 bg-white p-6 shadow-2xl dark:border-stone-800 dark:bg-stone-900">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4 dark:border-stone-800">
          <div>
            <h3 className="font-serif text-xl font-bold text-stone-900 dark:text-white">
              Side-by-Side Comparison ({listings.length}/4)
            </h3>
            <p className="text-xs text-stone-500">
              Full side-by-side comparison across all price and commute criteria
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {listings.length > 0 && (
              <button
                onClick={onClear}
                className="inline-flex items-center space-x-1 text-xs text-stone-500 hover:text-red-600"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Clear All</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {listings.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm font-medium text-stone-600 dark:text-stone-400">
              No homes pinned for comparison yet.
            </p>
            <p className="mt-1 text-xs text-stone-400">
              Click the scale icon on any listing card to pin up to 4 homes side-by-side.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-stone-100 dark:divide-stone-800">
            {listings.map((item) => (
              <div key={item.id} className="relative pt-4 md:pt-0 md:px-3 first:pl-0">
                <button
                  onClick={() => onRemove(item.id)}
                  className="absolute top-0 right-0 rounded-full p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-600"
                  title="Remove from compare"
                >
                  <X className="h-4 w-4" />
                </button>

                <img
                  src={item.photos[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80'}
                  alt={item.communityName || item.address.line1}
                  className="h-32 w-full rounded-xl object-cover"
                />

                <h4 className="font-serif mt-2 font-bold text-stone-900 line-clamp-1 dark:text-white">
                  {item.communityName || item.address.line1}
                </h4>
                <p className="text-[11px] text-stone-500">{item.address.city}, CA</p>

                <div className="mt-4 space-y-3 text-xs">
                  <div className="flex justify-between border-b border-stone-100 pb-1.5 dark:border-stone-800">
                    <span className="text-stone-500">Rent:</span>
                    <span className="font-mono font-bold text-stone-900 dark:text-white">
                      ${item.price.toLocaleString()}/mo
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-stone-100 pb-1.5 dark:border-stone-800">
                    <span className="text-stone-500">Beds / Baths:</span>
                    <span className="font-semibold text-stone-800 dark:text-stone-200">
                      {item.beds} bd / {item.baths} ba
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-stone-100 pb-1.5 dark:border-stone-800">
                    <span className="text-stone-500">Sq Footage:</span>
                    <span className="font-mono font-semibold text-stone-800 dark:text-stone-200">
                      {item.sqft ? `${item.sqft.toLocaleString()} sqft` : '—'}
                    </span>
                  </div>



                  <div className="flex justify-between border-b border-stone-100 pb-1.5 dark:border-stone-800">
                    <span className="text-stone-500">Commute AM/PM:</span>
                    <span className="font-bold text-amber-700 dark:text-amber-400">
                      {item.commute?.morning.minutes}m / {item.commute?.evening.minutes}m
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-stone-100 pb-1.5 dark:border-stone-800">
                    <span className="text-stone-500">2 Dogs Allowed:</span>
                    <span className="font-semibold text-stone-800 dark:text-stone-200">
                      {item.petPolicy.twoDogsOk === 'yes' ? 'Confirmed' : 'Verify'}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-stone-100 pb-1.5 dark:border-stone-800">
                    <span className="text-stone-500">2 Covered Cars:</span>
                    <span className="font-semibold text-stone-800 dark:text-stone-200">
                      {item.parking.twoCarsCovered === 'yes' ? 'Confirmed' : 'Verify'}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-stone-100 pb-1.5 dark:border-stone-800">
                    <span className="text-stone-500">In-Unit W/D:</span>
                    <span>{item.amenities.inUnitLaundry ? 'Yes' : 'Unknown'}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="space-y-2 pt-1">
                    <a
                      href={item.gallery_url || item.source_url || item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full min-h-10 items-center justify-center space-x-1.5 rounded-xl bg-teal-800 py-2 px-3 text-center text-xs font-bold text-white hover:bg-teal-700 transition"
                    >
                      <span>Website & Photos</span>
                      <span className="sr-only"> for {item.communityName || item.address.line1}</span>
                      <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                    </a>
                    <Link
                      href={`/listing/${encodeURIComponent(item.id)}`}
                      className="block w-full rounded-xl border border-stone-200 bg-stone-50 py-2 text-center text-xs font-bold text-stone-700 hover:bg-stone-100 dark:border-stone-750 dark:bg-stone-800 dark:text-stone-200"
                    >
                      View Commute & Cost Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
